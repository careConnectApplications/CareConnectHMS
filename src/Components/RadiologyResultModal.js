import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Stack,
  Text,
  Flex,
  Box,
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react";
import TextArea from "./TextArea";
import Button from "./Button";
import { EnterRadiologyResultApi } from "../Utils/ApiCalls";
import { IoIosCloseCircle } from "react-icons/io";
import PreviewCard from "./PreviewCard";
import PreviewCardV2 from "./PreviewCardV2";

export default function RadiologyResultModal({
  isOpen,
  onClose,
  recordId,
  record = null,           // ← added prop for full record metadata
  activateNotifications,
  onSuccess,
  oldResults = [],
  mode = "enter",          // "enter" | "view"
}) {
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [currentParagraph, setCurrentParagraph] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTestResults(Array.isArray(oldResults) ? oldResults : []);
      setCurrentParagraph("");
    }
  }, [isOpen, oldResults]);

  const addParagraph = () => {
    if (!currentParagraph.trim()) return;
    setTestResults((ps) => [...ps, currentParagraph.trim()]);
    setCurrentParagraph("");
  };

  const removeParagraph = (idx) => {
    setTestResults((ps) => ps.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = { typetestresult: testResults };
      console.log("🔄 Calling EnterRadiologyResultApi with:", payload, recordId);
      const res = await EnterRadiologyResultApi(payload, recordId);
      console.log("✅ EnterRadiologyResultApi returned:", res);
      if (res.status === 200) {
        activateNotifications("Results entered successfully.", "success");
        onClose();
        onSuccess();
      }
    } catch (e) {
      activateNotifications(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent maxW="60vw" maxH="80vh" overflowY="auto">
        <ModalHeader mb="4">
          {mode === "view" ? "View Radiology Result" : "Enter Radiology Result"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {mode === "enter" ? (
            <Stack spacing={6}>
              <TextArea
                label="New Paragraph"
                value={currentParagraph}
                onChange={(e) => setCurrentParagraph(e.target.value)}
              />
              <Flex justify="flex-end">
                <Button
                  size="sm" w="50px"
                  onClick={addParagraph}
                  isDisabled={!currentParagraph.trim()}
                >
                  Add
                </Button>
              </Flex>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                {testResults.map((p, idx) => (
                  <Flex
                    key={idx}
                    px="10px"
                    py="8px"
                    bg="blue.blue500"
                    rounded="md"
                    align="center"
                    justify="space-between"
                  >
                    <Text color="white" fontSize="12px">
                      {p}
                    </Text>
                    <Box
                      ml={2}
                      cursor="pointer"
                      onClick={() => removeParagraph(idx)}
                    >
                      <IoIosCloseCircle color="white" />
                    </Box>
                  </Flex>
                ))}
              </SimpleGrid>
            </Stack>
          ) : (
            <Stack spacing={6}>
              {/* ── Metadata ── */}
              <Text fontWeight="700" fontSize="16px" color="blue.blue500">
                Test Information
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <PreviewCard title="Test ID" value={record?.testid || "-"} />
                <PreviewCard title="Test Name" value={record?.testname || "-"} />
               
                <PreviewCard
                  title="Patient"
                  value={
                    `${record?.patient?.firstName || ""} ${record?.patient?.lastName || ""}`
                      .trim() || "-"
                  }
                />
                
              </SimpleGrid>

              {/* ── Manual Results ── */}
              <Text mt="6" fontWeight="700" fontSize="16px" color="blue.blue500">
              Test Results
              </Text>
              <Stack spacing={2}>
                {testResults.length > 0 ? (
                  testResults.map((p, idx) => (
                    <Box
                      key={idx}
                      p="4"
                      bg="gray.50"
                      rounded="md"
                      whiteSpace="pre-wrap"
                      wordBreak="break-word"
                    >
                      {p}
                    </Box>
                  ))
                ) : (
                  <Text>No manual results available.</Text>
                )}
              </Stack>
            </Stack>
          )}
        </ModalBody>
        <ModalFooter>
  {mode === "enter" ? (
    <Button
      onClick={handleSubmit}
      isLoading={loading}
      disabled={testResults.length === 0}
    >
      Enter Result
    </Button>
  ) : (
    <Button onClick={onClose}>Close</Button>
  )}
</ModalFooter>
      </ModalContent>
    </Modal>
  );
}
