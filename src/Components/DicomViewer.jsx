import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Box,
  Flex,
  Button,
  Input,
  Text,
  HStack,
  VStack,
  IconButton,
  Tooltip,
  Badge,
  SimpleGrid,
  Image,
  useToast,
  Spinner,
  Heading,
  Divider,
  ButtonGroup,
} from '@chakra-ui/react';
import {
  FiZoomIn,
  FiZoomOut,
  FiMaximize,
  FiRefreshCw,
  FiMove,
  FiSun,
  FiUpload,
  FiLink,
} from 'react-icons/fi';
import cornerstone from 'cornerstone-core';
import cornerstoneMath from 'cornerstone-math';
import cornerstoneTools from 'cornerstone-tools';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';
import Hammer from 'hammerjs';

// Initialize Cornerstone
cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneTools.external.Hammer = Hammer;

// Configure the WADO Image Loader
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

// Configure web worker (will be set up later)
const config = {
  webWorkerPath: '/cornerstoneWADOImageLoaderWebWorker.js',
  taskConfiguration: {
    decodeTask: {
      codecsPath: '/cornerstoneWADOImageLoaderCodecs.js',
    },
  },
};

cornerstoneWADOImageLoader.webWorkerManager.initialize(config);

// Web image loader for regular images (JPG, PNG, etc.) and blob URLs
// Defined as a global function to ensure it's always available
window.loadWebImage = function(imageId) {
  console.log('loadWebImage called with:', imageId);
  
  // Ensure we always return a Promise
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    return new Promise((resolve, reject) => {
      const image = new window.Image(); // Use native Image constructor, not Chakra UI
      
      // Extract URL from imageId (remove 'web:' prefix)
      const url = imageId.replace('web:', '');
      console.log('Loading image from URL:', url);
      
      // For blob URLs, we don't need CORS
      if (!url.startsWith('blob:')) {
        image.crossOrigin = 'anonymous'; // Handle CORS for non-blob URLs
      }
      
      image.onload = () => {
        try {
          canvas.width = image.width;
          canvas.height = image.height;
          ctx.drawImage(image, 0, 0);
          
          let pixelData;
          let grayPixelData;
          
          // For blob URLs, we may not be able to use getImageData due to security
          // So we'll create a simpler image object
          try {
            const imageData = ctx.getImageData(0, 0, image.width, image.height);
            pixelData = imageData.data;
            const numPixels = image.width * image.height;
            
            // Convert to grayscale for medical imaging display
            grayPixelData = new Uint8Array(numPixels);
            for (let i = 0; i < numPixels; i++) {
              const offset = i * 4;
              // Use luminance formula for grayscale conversion
              grayPixelData[i] = Math.round(
                0.299 * pixelData[offset] + 
                0.587 * pixelData[offset + 1] + 
                0.114 * pixelData[offset + 2]
              );
            }
          } catch (e) {
            // If we can't access pixel data (security error), create a dummy grayscale array
            console.warn('Cannot access pixel data, using fallback display', e);
            const numPixels = image.width * image.height;
            grayPixelData = new Uint8Array(numPixels);
            // Fill with mid-gray values as fallback
            grayPixelData.fill(128);
          }
          
          const cornerstoneImage = {
            imageId: imageId,
            minPixelValue: 0,
            maxPixelValue: 255,
            slope: 1.0,
            intercept: 0,
            windowCenter: 127,
            windowWidth: 255,
            getPixelData: () => grayPixelData,
            rows: image.height,
            columns: image.width,
            height: image.height,
            width: image.width,
            color: false,
            columnPixelSpacing: 1.0,
            rowPixelSpacing: 1.0,
            sizeInBytes: grayPixelData.byteLength,
            render: function(enabledElement, invalidated) {
              // Custom render function for blob URLs
              if (url.startsWith('blob:')) {
                const viewport = enabledElement.viewport;
                const context = enabledElement.canvas.getContext('2d');
                
                context.setTransform(1, 0, 0, 1, 0, 0);
                context.fillStyle = 'black';
                context.fillRect(0, 0, enabledElement.canvas.width, enabledElement.canvas.height);
                
                // Apply viewport transformations
                context.setTransform(
                  viewport.scale,
                  0,
                  0,
                  viewport.scale,
                  viewport.translation.x,
                  viewport.translation.y
                );
                
                // Draw the image
                context.drawImage(image, 0, 0, image.width, image.height);
              }
            }
          };
          
          console.log('Image loaded successfully');
          resolve(cornerstoneImage);
        } catch (error) {
          console.error('Error processing image:', error);
          reject(error);
        }
      };
      
      image.onerror = (error) => {
        console.error('Image load error:', error);
        reject(new Error('Failed to load image: ' + url));
      };
      
      image.src = url;
    });
  } catch (error) {
    console.error('Error in loadWebImage:', error);
    // Always return a rejected Promise on error
    return Promise.reject(error);
  }
};

// Ensure the function reference is stable
const loadWebImage = window.loadWebImage;

const DicomViewer = ({ initialImageUrls = [] }) => {
  const viewerRef = useRef(null);
  const [element, setElement] = useState(null);
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [status, setStatus] = useState('idle'); // idle, loading, loaded, error
  const [activeToolName, setActiveToolName] = useState('Wwwc');
  const [imageUrl, setImageUrl] = useState('');
  const [viewport, setViewport] = useState(null);
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);
  const webLoaderRegistered = useRef(false);
  const toast = useToast();

  // Initialize viewer element
  useEffect(() => {
    if (viewerRef.current && !element) {
      const el = viewerRef.current;
      cornerstone.enable(el);
      setElement(el);
      
      // Register web image loader after cornerstone is enabled
      if (!webLoaderRegistered.current) {
        try {
          // Use the global function reference
          cornerstone.registerImageLoader('web', window.loadWebImage);
          webLoaderRegistered.current = true;
          console.log('Web image loader registered successfully after cornerstone init');
        } catch (e) {
          console.log('Web loader registration error:', e.message);
        }
      }

      // Add tools
      cornerstoneTools.init();
      
      // Mouse Tools
      cornerstoneTools.addTool(cornerstoneTools.WwwcTool);
      cornerstoneTools.addTool(cornerstoneTools.PanTool);
      cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
      cornerstoneTools.addTool(cornerstoneTools.ZoomMouseWheelTool);
      
      // Set active tool
      cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 }); // Left click
      cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 4 }); // Middle click
      cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 2 }); // Right click
      cornerstoneTools.setToolActive('ZoomMouseWheel', {}); // Mouse wheel

      // Add viewport update handler
      el.addEventListener('cornerstoneimagerendered', (e) => {
        const viewport = cornerstone.getViewport(e.target);
        setViewport(viewport);
      });

      return () => {
        cornerstone.disable(el);
      };
    }
  }, [element, viewerRef]);

  // Auto-load initial image URLs when component mounts or URLs change
  useEffect(() => {
    if (element && initialImageUrls.length > 0 && !hasLoadedInitial) {
      loadInitialImages();
    }
  }, [element, initialImageUrls, hasLoadedInitial]);

  // Load initial images from URLs
  const loadInitialImages = async () => {
    if (!initialImageUrls || initialImageUrls.length === 0) return;
    
    setStatus('loading');
    setHasLoadedInitial(true);
    
    try {
      const imageIds = initialImageUrls.map(url => {
        // Handle blob URLs
        if (url.startsWith('blob:')) {
          // Blob URLs - treat as regular images that can be displayed directly
          return `web:${url}`;
        }
        // Check if it's a DICOM file or regular image
        else if (url.toLowerCase().includes('.dcm') || url.includes('wado')) {
          // WADO URI for DICOM
          return `wadouri:${url}`;
        } else if (url.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp)$/i)) {
          // Regular web image - use web image loader
          return `web:${url}`;
        } else {
          // For unknown types, try as web image first
          return `web:${url}`;
        }
      });

      setImages(imageIds);
      
      // Load and display the first image
      if (imageIds.length > 0 && element) {
        try {
          await loadAndDisplayImage(imageIds[0]);
          setCurrentImageIndex(0);
          setStatus('loaded');
        } catch (firstError) {
          console.warn('Failed to load image:', firstError);
          
          // Only try DICOM fallback for non-blob URLs
          const firstUrl = initialImageUrls[0];
          if (!firstUrl.startsWith('blob:')) {
            console.log('Trying as DICOM format...');
            const dicomImageId = imageIds[0].replace('web:', 'wadouri:');
            try {
              await loadAndDisplayImage(dicomImageId);
              // Update imageIds to use DICOM loader for all
              const newImageIds = imageIds.map(id => id.replace('web:', 'wadouri:'));
              setImages(newImageIds);
              setCurrentImageIndex(0);
              setStatus('loaded');
            } catch (secondError) {
              throw new Error('Failed to load image in both formats');
            }
          } else {
            // For blob URLs, the image data is likely corrupted or incompatible
            throw new Error('Failed to load blob image. The image format may not be supported.');
          }
        }
      }
    } catch (error) {
      console.error('Error loading initial images:', error);
      setStatus('error');
      toast({
        title: 'Error',
        description: 'Failed to load images. The format may not be supported.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Load DICOM from file
  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setStatus('loading');
    const imageIds = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
        imageIds.push(imageId);
      }

      setImages(imageIds);
      if (imageIds.length > 0 && element) {
        await loadAndDisplayImage(imageIds[0]);
        setCurrentImageIndex(0);
      }
      setStatus('loaded');
      toast({
        title: 'DICOM Loaded',
        description: `Successfully loaded ${imageIds.length} image(s)`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error loading DICOM:', error);
      setStatus('error');
      toast({
        title: 'Error',
        description: 'Failed to load DICOM file(s)',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Load DICOM from URL
  const handleUrlLoad = async () => {
    if (!imageUrl.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a valid URL',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setStatus('loading');
    try {
      let imageId;
      
      // Check if it's a DICOM file or regular image
      if (imageUrl.toLowerCase().endsWith('.dcm') || imageUrl.includes('wado')) {
        // WADO URI for DICOM
        imageId = `wadouri:${imageUrl}`;
      } else {
        // Regular web image
        imageId = `wadouri:${imageUrl}`;
      }

      setImages([imageId]);
      if (element) {
        await loadAndDisplayImage(imageId);
        setCurrentImageIndex(0);
      }
      setStatus('loaded');
      toast({
        title: 'Image Loaded',
        description: 'Successfully loaded image from URL',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error loading from URL:', error);
      setStatus('error');
      toast({
        title: 'Error',
        description: 'Failed to load image from URL. Check CORS settings.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Load and display image
  const loadAndDisplayImage = async (imageId) => {
    try {
      const image = await cornerstone.loadImage(imageId);
      cornerstone.displayImage(element, image);
      
      // Fit image to window
      cornerstone.fitToWindow(element);
      
      return image;
    } catch (error) {
      console.error('Error displaying image:', error);
      throw error;
    }
  };

  // Handle thumbnail click
  const handleThumbnailClick = async (index) => {
    if (images[index] && element) {
      setCurrentImageIndex(index);
      await loadAndDisplayImage(images[index]);
    }
  };

  // Tool selection
  const setActiveTool = (toolName) => {
    // Deactivate all tools
    cornerstoneTools.setToolPassive('Wwwc');
    cornerstoneTools.setToolPassive('Pan');
    cornerstoneTools.setToolPassive('Zoom');

    // Activate selected tool
    switch (toolName) {
      case 'Wwwc':
        cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 });
        break;
      case 'Pan':
        cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 1 });
        break;
      case 'Zoom':
        cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 1 });
        break;
      default:
        break;
    }
    setActiveToolName(toolName);
  };

  // Zoom functions
  const handleZoomIn = () => {
    if (element) {
      const viewport = cornerstone.getViewport(element);
      viewport.scale *= 1.25;
      cornerstone.setViewport(element, viewport);
    }
  };

  const handleZoomOut = () => {
    if (element) {
      const viewport = cornerstone.getViewport(element);
      viewport.scale *= 0.75;
      cornerstone.setViewport(element, viewport);
    }
  };

  // Reset viewport
  const handleReset = () => {
    if (element) {
      cornerstone.reset(element);
    }
  };

  // Fit to window
  const handleFitToWindow = () => {
    if (element) {
      cornerstone.fitToWindow(element);
    }
  };

  return (
    <Box p={4} bg="white" borderRadius="lg" boxShadow="sm">
      {/* Header */}
      <VStack spacing={4} align="stretch">
        <Flex justify="space-between" align="center">
          <Heading size="md" color="gray.700">
            DICOM Viewer
          </Heading>
          <Badge
            colorScheme={
              status === 'idle'
                ? 'gray'
                : status === 'loading'
                ? 'blue'
                : status === 'loaded'
                ? 'green'
                : 'red'
            }
            fontSize="sm"
            px={3}
            py={1}
            borderRadius="full"
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </Flex>

        <Divider />

        {/* Controls */}
        <VStack spacing={3} align="stretch">
          {/* File Upload */}
          <HStack spacing={3}>
            <Input
              type="file"
              accept=".dcm,application/dicom"
              multiple
              onChange={handleFileUpload}
              display="none"
              id="dicom-file-input"
            />
            <Button
              as="label"
              htmlFor="dicom-file-input"
              leftIcon={<FiUpload />}
              colorScheme="blue"
              variant="outline"
              size="sm"
              cursor="pointer"
            >
              Load DICOM Files
            </Button>
          </HStack>

          {/* URL Input */}
          <HStack spacing={2}>
            <Input
              placeholder="Enter DICOM URL (WADO or direct HTTP)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              size="sm"
            />
            <IconButton
              icon={<FiLink />}
              onClick={handleUrlLoad}
              colorScheme="blue"
              variant="outline"
              size="sm"
              aria-label="Load from URL"
            />
          </HStack>

          {/* Tool Selection */}
          <ButtonGroup size="sm" isAttached variant="outline">
            <Tooltip label="Window/Level (Brightness/Contrast)">
              <Button
                leftIcon={<FiSun />}
                onClick={() => setActiveTool('Wwwc')}
                colorScheme={activeToolName === 'Wwwc' ? 'blue' : 'gray'}
                variant={activeToolName === 'Wwwc' ? 'solid' : 'outline'}
              >
                W/L
              </Button>
            </Tooltip>
            <Tooltip label="Pan">
              <Button
                leftIcon={<FiMove />}
                onClick={() => setActiveTool('Pan')}
                colorScheme={activeToolName === 'Pan' ? 'blue' : 'gray'}
                variant={activeToolName === 'Pan' ? 'solid' : 'outline'}
              >
                Pan
              </Button>
            </Tooltip>
            <Tooltip label="Zoom">
              <Button
                leftIcon={<FiZoomIn />}
                onClick={() => setActiveTool('Zoom')}
                colorScheme={activeToolName === 'Zoom' ? 'blue' : 'gray'}
                variant={activeToolName === 'Zoom' ? 'solid' : 'outline'}
              >
                Zoom
              </Button>
            </Tooltip>
          </ButtonGroup>

          {/* Zoom Controls */}
          <HStack spacing={2}>
            <IconButton
              icon={<FiZoomIn />}
              onClick={handleZoomIn}
              size="sm"
              variant="outline"
              aria-label="Zoom In"
            />
            <IconButton
              icon={<FiZoomOut />}
              onClick={handleZoomOut}
              size="sm"
              variant="outline"
              aria-label="Zoom Out"
            />
            <IconButton
              icon={<FiMaximize />}
              onClick={handleFitToWindow}
              size="sm"
              variant="outline"
              aria-label="Fit to Window"
            />
            <IconButton
              icon={<FiRefreshCw />}
              onClick={handleReset}
              size="sm"
              variant="outline"
              aria-label="Reset"
            />
          </HStack>
        </VStack>

        <Divider />

        {/* Main Viewer Area */}
        <Flex gap={4}>
          {/* Viewer */}
          <Box flex={1}>
            <Box
              ref={viewerRef}
              bg="black"
              borderRadius="md"
              position="relative"
              height="500px"
              width="100%"
              overflow="hidden"
            >
              {status === 'loading' && (
                <Flex
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  align="center"
                  justify="center"
                  bg="rgba(0,0,0,0.7)"
                  zIndex={10}
                >
                  <VStack spacing={3}>
                    <Spinner size="xl" color="white" thickness="3px" />
                    <Text color="white" fontSize="sm">
                      Loading DICOM...
                    </Text>
                  </VStack>
                </Flex>
              )}
              {status === 'idle' && (
                <Flex
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  align="center"
                  justify="center"
                >
                  <Text color="gray.500" fontSize="lg">
                    Load a DICOM file to begin
                  </Text>
                </Flex>
              )}
            </Box>

            {/* Viewport Info */}
            {viewport && status === 'loaded' && (
              <Box mt={2} p={2} bg="gray.50" borderRadius="md">
                <HStack spacing={4} fontSize="xs" color="gray.600">
                  <Text>
                    W: {Math.round(viewport.voi.windowWidth)} / L:{' '}
                    {Math.round(viewport.voi.windowCenter)}
                  </Text>
                  <Text>Zoom: {viewport.scale.toFixed(2)}x</Text>
                  <Text>
                    Image: {currentImageIndex + 1} / {images.length}
                  </Text>
                </HStack>
              </Box>
            )}
          </Box>

          {/* Thumbnails (if multiple images) */}
          {images.length > 1 && (
            <Box width="150px" maxHeight="500px" overflowY="auto">
              <Text fontSize="sm" fontWeight="bold" mb={2}>
                Series ({images.length})
              </Text>
              <VStack spacing={2}>
                {images.map((imageId, index) => (
                  <Box
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    cursor="pointer"
                    border={
                      currentImageIndex === index
                        ? '2px solid'
                        : '1px solid'
                    }
                    borderColor={
                      currentImageIndex === index
                        ? 'blue.500'
                        : 'gray.300'
                    }
                    borderRadius="md"
                    p={1}
                    bg={currentImageIndex === index ? 'blue.50' : 'white'}
                    _hover={{ borderColor: 'blue.400' }}
                  >
                    <Box
                      bg="gray.200"
                      height="100px"
                      width="100%"
                      borderRadius="sm"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text fontSize="sm" color="gray.600">
                        {index + 1}
                      </Text>
                    </Box>
                  </Box>
                ))}
              </VStack>
            </Box>
          )}
        </Flex>
      </VStack>
    </Box>
  );
};

export default DicomViewer;
