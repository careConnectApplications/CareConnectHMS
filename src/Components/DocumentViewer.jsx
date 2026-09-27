import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Button,
  Text,
  HStack,
  VStack,
  IconButton,
  Badge,
  Heading,
  Divider,
  ButtonGroup,
  Icon,
  Spinner,
} from '@chakra-ui/react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiExternalLink,
  FiFileText,
  FiFile,
  FiPrinter,
} from 'react-icons/fi';
import mammoth from 'mammoth';

const DocumentViewer = ({ imageUrls = [], testName = 'Radiology Result Document' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [docxHtml, setDocxHtml] = useState('');
  const [loadingDocx, setLoadingDocx] = useState(false);
  const [docxError, setDocxError] = useState(null);

  const rawUrl = (imageUrls && imageUrls[currentIndex]) || '';

  // Separate blob URL from #name= parameter if present
  const getCleanUrlAndName = (url) => {
    let cleanUrl = url;
    let name = 'Document';

    if (url.includes('#name=')) {
      const parts = url.split('#name=');
      cleanUrl = parts[0];
      try {
        name = decodeURIComponent(parts[1]);
      } catch {
        name = parts[1];
      }
    } else {
      try {
        const parts = url.split('?')[0].split('/');
        name = parts[parts.length - 1] || 'Document';
      } catch {
        name = 'Document';
      }
    }
    return { cleanUrl, name };
  };

  const { cleanUrl, name: fileName } = getCleanUrlAndName(rawUrl);
  const ext = fileName.split('.').pop().toLowerCase();

  const isPdf = ext === 'pdf' || rawUrl.toLowerCase().includes('.pdf') || rawUrl.startsWith('data:application/pdf');
  const isDocx = ext === 'docx' || ext === 'doc' || rawUrl.toLowerCase().includes('.docx') || rawUrl.toLowerCase().includes('.doc');

  // Load and parse .docx file using mammoth for direct in-browser viewing
  useEffect(() => {
    let isMounted = true;
    if (isDocx && cleanUrl) {
      setLoadingDocx(true);
      setDocxError(null);
      setDocxHtml('');

      fetch(cleanUrl)
        .then((res) => res.arrayBuffer())
        .then((arrayBuffer) => mammoth.convertToHtml({ arrayBuffer }))
        .then((result) => {
          if (isMounted) {
            setDocxHtml(result.value || '<p>Empty Document</p>');
            setLoadingDocx(false);
          }
        })
        .catch((err) => {
          console.error('Error rendering docx:', err);
          if (isMounted) {
            setDocxError('Unable to parse Word document formatting');
            setLoadingDocx(false);
          }
        });
    }
    return () => {
      isMounted = false;
    };
  }, [cleanUrl, isDocx]);

  if (!imageUrls || imageUrls.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Text color="gray.500">No documents available</Text>
      </Box>
    );
  }

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < imageUrls.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = cleanUrl;
    link.download = fileName;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenNewTab = () => {
    window.open(cleanUrl, '_blank', 'noopener,noreferrer');
  };

  const handlePrint = () => {
    if (isPdf) {
      const printWindow = window.open(cleanUrl, '_blank');
      if (printWindow) {
        printWindow.focus();
        printWindow.print();
      }
    } else {
      window.print();
    }
  };

  return (
    <Box p={4} bg="white" borderRadius="lg" boxShadow="sm">
      <VStack spacing={4} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center" flexWrap="wrap" gap={2}>
          <Heading size="md" color="gray.700">
            {testName}
          </Heading>
          <HStack spacing={2}>
            {imageUrls.length > 1 && (
              <Badge colorScheme="blue" fontSize="sm" px={3} py={1} borderRadius="full">
                Document {currentIndex + 1} of {imageUrls.length}
              </Badge>
            )}
            <Badge colorScheme={isPdf ? 'red' : isDocx ? 'blue' : 'purple'} fontSize="sm" px={3} py={1} borderRadius="full">
              {isPdf ? 'PDF Document' : isDocx ? 'Word Document' : 'Document'}
            </Badge>
          </HStack>
        </Flex>

        <Divider />

        {/* Toolbar Controls */}
        <HStack justify="space-between" align="center" flexWrap="wrap" gap={2}>
          {imageUrls.length > 1 ? (
            <ButtonGroup size="sm" isAttached variant="outline">
              <IconButton
                icon={<FiChevronLeft />}
                onClick={handlePrevious}
                isDisabled={currentIndex === 0}
                aria-label="Previous document"
              />
              <Button variant="outline" size="sm" disabled>
                {currentIndex + 1} / {imageUrls.length}
              </Button>
              <IconButton
                icon={<FiChevronRight />}
                onClick={handleNext}
                isDisabled={currentIndex === imageUrls.length - 1}
                aria-label="Next document"
              />
            </ButtonGroup>
          ) : <Box />}

          <HStack spacing={2}>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<FiPrinter />}
              onClick={handlePrint}
            >
              Print
            </Button>
            <Button
              size="sm"
              variant="outline"
              colorScheme="blue"
              leftIcon={<FiExternalLink />}
              onClick={handleOpenNewTab}
            >
              Open in New Tab
            </Button>
            <Button
              size="sm"
              colorScheme="blue"
              leftIcon={<FiDownload />}
              onClick={handleDownload}
            >
              Download File
            </Button>
          </HStack>
        </HStack>

        <Divider />

        {/* Viewer Content Area */}
        <Box
          position="relative"
          bg={isDocx ? 'gray.50' : 'gray.900'}
          borderRadius="md"
          height="650px"
          overflow="hidden"
          border="1px solid"
          borderColor="gray.200"
        >
          {isPdf ? (
            <object
              data={cleanUrl}
              type="application/pdf"
              width="100%"
              height="100%"
              style={{ border: 'none' }}
            >
              <iframe
                src={`${cleanUrl}#toolbar=1`}
                title={fileName}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
              />
            </object>
          ) : isDocx ? (
            <Box height="100%" overflowY="auto" p={8}>
              {loadingDocx ? (
                <Flex direction="column" align="center" justify="center" height="100%" minH="400px">
                  <Spinner size="xl" color="blue.500" thickness="3px" mb={4} />
                  <Text color="gray.600" fontSize="md">
                    Rendering Word Document inside browser...
                  </Text>
                </Flex>
              ) : docxError ? (
                <Flex direction="column" align="center" justify="center" height="100%" color="gray.700" textAlign="center" minH="400px">
                  <VStack spacing={4} maxW="500px" bg="white" p={8} borderRadius="xl" boxShadow="md" border="1px solid" borderColor="gray.200">
                    <Icon as={FiFileText} w={16} h={16} color="blue.500" />
                    <VStack spacing={1}>
                      <Heading size="md" color="gray.800">
                        {fileName}
                      </Heading>
                      <Text color="gray.500" fontSize="sm">
                        {docxError}
                      </Text>
                    </VStack>
                    <HStack spacing={3} pt={2}>
                      <Button colorScheme="blue" leftIcon={<FiDownload />} onClick={handleDownload}>
                        Download Document
                      </Button>
                      <Button variant="outline" colorScheme="blue" leftIcon={<FiExternalLink />} onClick={handleOpenNewTab}>
                        Open in New Tab
                      </Button>
                    </HStack>
                  </VStack>
                </Flex>
              ) : (
                <Box
                  bg="white"
                  p={10}
                  maxW="850px"
                  mx="auto"
                  borderRadius="md"
                  boxShadow="md"
                  border="1px solid"
                  borderColor="gray.200"
                  className="docx-content"
                  dangerouslySetInnerHTML={{ __html: docxHtml }}
                  sx={{
                    '& p': { marginBottom: '1rem', lineHeight: '1.6', color: 'gray.800' },
                    '& h1, & h2, & h3, & h4, & h5, & h6': { marginTop: '1.5rem', marginBottom: '0.75rem', fontWeight: 'bold', color: 'gray.900' },
                    '& table': { width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' },
                    '& td, & th': { border: '1px solid #CBD5E0', padding: '8px 12px' },
                    '& img': { maxWidth: '100%', height: 'auto', display: 'block', margin: '1rem auto' },
                    '& ul, & ol': { paddingLeft: '1.5rem', marginBottom: '1rem' },
                  }}
                />
              )}
            </Box>
          ) : (
            <Flex direction="column" align="center" justify="center" height="100%" color="white" textAlign="center">
              <VStack spacing={5} maxW="500px" bg="gray.800" p={8} borderRadius="xl" boxShadow="2xl">
                <Icon as={FiFile} w={16} h={16} color="blue.300" />
                <VStack spacing={2}>
                  <Heading size="md" color="white">
                    Radiology Result File
                  </Heading>
                  <Text color="gray.300" fontSize="sm">
                    {fileName}
                  </Text>
                </VStack>
                <HStack spacing={3} pt={2}>
                  <Button colorScheme="blue" leftIcon={<FiDownload />} onClick={handleDownload}>
                    Download File
                  </Button>
                  <Button variant="outline" colorScheme="whiteAlpha" leftIcon={<FiExternalLink />} onClick={handleOpenNewTab}>
                    Open in New Tab
                  </Button>
                </HStack>
              </VStack>
            </Flex>
          )}
        </Box>

        {/* Document List for multiple files */}
        {imageUrls.length > 1 && (
          <Box pt={2}>
            <Text fontSize="sm" fontWeight="bold" mb={2}>
              Result Files ({imageUrls.length})
            </Text>
            <HStack spacing={2} overflowX="auto" py={2}>
              {imageUrls.map((url, index) => {
                const { name } = getCleanUrlAndName(url);
                const isSelected = currentIndex === index;
                return (
                  <Button
                    key={index}
                    size="sm"
                    variant={isSelected ? 'solid' : 'outline'}
                    colorScheme={isSelected ? 'blue' : 'gray'}
                    onClick={() => setCurrentIndex(index)}
                    leftIcon={<FiFileText />}
                  >
                    File {index + 1}: {name.length > 18 ? name.substring(0, 15) + '...' : name}
                  </Button>
                );
              })}
            </HStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default DocumentViewer;
