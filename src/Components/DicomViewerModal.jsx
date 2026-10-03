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
} from '@chakra-ui/react';
import DicomViewer from './DicomViewer';
import SimpleImageViewer from './SimpleImageViewer';
import DocumentViewer from './DocumentViewer';

const DicomViewerModal = ({ isOpen, onClose, imageUrls = [], testName = 'Radiology Result' }) => {
  const [viewerKey, setViewerKey] = useState(0);

  // Determine which viewer to use based on URL type / file format
  const viewerType = useMemo(() => {
    if (!imageUrls || imageUrls.length === 0) return 'simple';
    
    const firstUrl = imageUrls[0];
    if (!firstUrl) return 'simple';
    
    const urlLower = firstUrl.toLowerCase();
    
    // 1. DICOM files
    if (urlLower.includes('.dcm') || urlLower.includes('wado')) {
      return 'dicom';
    }

    // 2. Document files (.pdf, .doc, .docx, etc.)
    if (
      urlLower.includes('.pdf') ||
      urlLower.startsWith('data:application/pdf') ||
      urlLower.match(/\.(doc|docx|pdf|txt|rtf|csv|xlsx|xls)$/i) ||
      urlLower.includes('msword') ||
      urlLower.includes('wordprocessingml')
    ) {
      return 'document';
    }

    // 3. Regular Image / Blob URLs
    return 'simple';
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
      console.log('Viewer type:', viewerType);
    }
  }, [isOpen, imageUrls, viewerType]);

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
          {testName} - {viewerType === 'dicom' ? 'DICOM Viewer' : viewerType === 'document' ? 'Document Viewer' : 'Image Viewer'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p={0} overflow="auto">
          <Box p={4}>
            {viewerType === 'dicom' ? (
              <DicomViewer key={viewerKey} initialImageUrls={imageUrls} />
            ) : viewerType === 'document' ? (
              <DocumentViewer key={viewerKey} imageUrls={imageUrls} testName={testName} />
            ) : (
              <SimpleImageViewer key={viewerKey} imageUrls={imageUrls} testName={testName} />
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
