import React, { useEffect, useState, useMemo } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  useDisclosure,
} from '@chakra-ui/react';
import DicomViewer from './DicomViewer';
import SimpleImageViewer from './SimpleImageViewer';

const DicomViewerModal = ({ isOpen, onClose, imageUrls = [], testName = 'Radiology Result' }) => {
  const [viewerKey, setViewerKey] = useState(0);

  // Determine which viewer to use based on URL type
  const useSimpleViewer = useMemo(() => {
    if (!imageUrls || imageUrls.length === 0) return true;
    
    // Check if any URL is a blob URL or regular image
    const firstUrl = imageUrls[0];
    if (!firstUrl) return true;
    
    // Use SimpleImageViewer for:
    // 1. Blob URLs
    // 2. Regular image extensions
    // 3. When we're not sure (safer to use simple viewer)
    const isBlobUrl = firstUrl.startsWith('blob:');
    const isRegularImage = firstUrl.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp)$/i);
    const isDicomFile = firstUrl.toLowerCase().includes('.dcm') || firstUrl.includes('wado');
    
    // Use simple viewer for blob URLs and regular images
    // Use DICOM viewer only for confirmed DICOM files
    return isBlobUrl || isRegularImage || !isDicomFile;
  }, [imageUrls]);

  // Reset viewer when modal opens with new images
  useEffect(() => {
    if (isOpen) {
      setViewerKey(prev => prev + 1);
    }
  }, [isOpen, imageUrls]);

  // Automatically load URLs when modal opens
  useEffect(() => {
    if (isOpen && imageUrls.length > 0) {
      console.log('Image URLs available:', imageUrls);
      console.log('Using simple viewer:', useSimpleViewer);
    }
  }, [isOpen, imageUrls, useSimpleViewer]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      scrollBehavior="inside"
      closeOnOverlayClick={false}
    >
      <ModalOverlay bg="blackAlpha.700" />
      <ModalContent maxW="90vw" maxH="90vh">
        <ModalHeader borderBottom="1px solid" borderColor="gray.200">
          {testName} - Image Viewer
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p={0} overflow="auto">
          <Box p={4}>
            {useSimpleViewer ? (
              <SimpleImageViewer key={viewerKey} imageUrls={imageUrls} testName={testName} />
            ) : (
              <DicomViewer key={viewerKey} initialImageUrls={imageUrls} />
            )}
          </Box>
        </ModalBody>
        <ModalFooter borderTop="1px solid" borderColor="gray.200">
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DicomViewerModal;
