import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Flex,
  Button,
  Text,
  HStack,
  VStack,
  IconButton,
  Badge,
  Spinner,
  Heading,
  Divider,
  ButtonGroup,
  useToast,
  Image,
} from '@chakra-ui/react';
import {
  FiZoomIn,
  FiZoomOut,
  FiMaximize,
  FiRefreshCw,
  FiMove,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';

const SimpleImageViewer = ({ imageUrls = [], testName = 'Radiology Image' }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const imageContainerRef = useRef(null);
  const toast = useToast();

  // Reset view when image changes
  useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setLoading(true);
    setError(null);
  }, [currentImageIndex, imageUrls]);

  // Handle image load
  const handleImageLoad = () => {
    setLoading(false);
    setError(null);
  };

  // Handle image error
  const handleImageError = () => {
    setLoading(false);
    setError('Failed to load image');
    toast({
      title: 'Error',
      description: 'Failed to load image',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  // Zoom functions
  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + 0.25, 5));
  };

  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - 0.25, 0.25));
  };

  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleFitToWindow = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // Pan functionality
  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Navigation
  const handlePrevious = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentImageIndex < imageUrls.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === '+' || e.key === '=') handleZoomIn();
      if (e.key === '-') handleZoomOut();
      if (e.key === '0') handleReset();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentImageIndex]);

  if (!imageUrls || imageUrls.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Text color="gray.500">No images available</Text>
      </Box>
    );
  }

  const currentUrl = imageUrls[currentImageIndex];

  return (
    <Box p={4} bg="white" borderRadius="lg" boxShadow="sm">
      <VStack spacing={4} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading size="md" color="gray.700">
            {testName}
          </Heading>
          <HStack spacing={2}>
            <Badge colorScheme="blue" fontSize="sm" px={3} py={1} borderRadius="full">
              Image {currentImageIndex + 1} of {imageUrls.length}
            </Badge>
            <Badge colorScheme="gray" fontSize="sm" px={3} py={1} borderRadius="full">
              Zoom: {(zoom * 100).toFixed(0)}%
            </Badge>
          </HStack>
        </Flex>

        <Divider />

        {/* Controls */}
        <HStack spacing={4} justify="space-between">
          {/* Navigation buttons */}
          {imageUrls.length > 1 && (
            <ButtonGroup size="sm" isAttached variant="outline">
              <IconButton
                icon={<FiChevronLeft />}
                onClick={handlePrevious}
                isDisabled={currentImageIndex === 0}
                aria-label="Previous image"
              />
              <Button variant="outline" size="sm" disabled>
                {currentImageIndex + 1} / {imageUrls.length}
              </Button>
              <IconButton
                icon={<FiChevronRight />}
                onClick={handleNext}
                isDisabled={currentImageIndex === imageUrls.length - 1}
                aria-label="Next image"
              />
            </ButtonGroup>
          )}

          {/* Zoom Controls */}
          <HStack spacing={2}>
            <ButtonGroup size="sm" isAttached variant="outline">
              <IconButton
                icon={<FiZoomOut />}
                onClick={handleZoomOut}
                aria-label="Zoom out"
                isDisabled={zoom <= 0.25}
              />
              <IconButton
                icon={<FiZoomIn />}
                onClick={handleZoomIn}
                aria-label="Zoom in"
                isDisabled={zoom >= 5}
              />
              <IconButton
                icon={<FiMaximize />}
                onClick={handleFitToWindow}
                aria-label="Fit to window"
              />
              <IconButton
                icon={<FiRefreshCw />}
                onClick={handleReset}
                aria-label="Reset view"
              />
            </ButtonGroup>
          </HStack>
        </HStack>

        <Divider />

        {/* Image Viewer Area */}
        <Box
          ref={imageContainerRef}
          position="relative"
          bg="gray.900"
          borderRadius="md"
          height="600px"
          overflow="hidden"
          cursor={zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {loading && (
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
                  Loading image...
                </Text>
              </VStack>
            </Flex>
          )}

          {error ? (
            <Flex
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              align="center"
              justify="center"
            >
              <VStack spacing={3}>
                <Text color="red.400" fontSize="lg">
                  Failed to load image
                </Text>
                <Button size="sm" onClick={handleReset} colorScheme="blue">
                  Try Again
                </Button>
              </VStack>
            </Flex>
          ) : (
            <Flex
              align="center"
              justify="center"
              height="100%"
              width="100%"
              position="relative"
            >
              <Image
                src={currentUrl}
                alt={`${testName} - Image ${currentImageIndex + 1}`}
                maxH="100%"
                maxW="100%"
                objectFit="contain"
                style={{
                  transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                  transition: isDragging ? 'none' : 'transform 0.3s ease',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none',
                }}
                onLoad={handleImageLoad}
                onError={handleImageError}
                draggable={false}
              />
            </Flex>
          )}
        </Box>

        {/* Thumbnails for multiple images */}
        {imageUrls.length > 1 && (
          <Box>
            <Text fontSize="sm" fontWeight="bold" mb={2}>
              Image Series
            </Text>
            <HStack spacing={2} overflowX="auto" py={2}>
              {imageUrls.map((url, index) => (
                <Box
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  cursor="pointer"
                  border={currentImageIndex === index ? '2px solid' : '1px solid'}
                  borderColor={currentImageIndex === index ? 'blue.500' : 'gray.300'}
                  borderRadius="md"
                  p={1}
                  bg={currentImageIndex === index ? 'blue.50' : 'white'}
                  _hover={{ borderColor: 'blue.400' }}
                  minW="80px"
                  h="80px"
                  position="relative"
                >
                  <Image
                    src={url}
                    alt={`Thumbnail ${index + 1}`}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    borderRadius="sm"
                  />
                  <Badge
                    position="absolute"
                    bottom="2px"
                    right="2px"
                    fontSize="xs"
                    colorScheme={currentImageIndex === index ? 'blue' : 'gray'}
                  >
                    {index + 1}
                  </Badge>
                </Box>
              ))}
            </HStack>
          </Box>
        )}

        {/* Instructions */}
        <Box bg="gray.50" p={3} borderRadius="md">
          <Text fontSize="xs" color="gray.600">
            <strong>Controls:</strong> Use mouse wheel or +/- buttons to zoom. 
            Click and drag to pan when zoomed in. Use arrow keys to navigate between images.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default SimpleImageViewer;
