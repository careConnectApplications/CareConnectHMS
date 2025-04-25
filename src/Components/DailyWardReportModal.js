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
  Select,
  Flex,
  Box,
  Text,
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react";
import TextArea from "./TextArea";
import Button from "./Button";
import {
  CreateDailyWardReportApi,
  UpdateDailyWardReportApi,
  GetAllWardApi,
} from "../Utils/ApiCalls";
import { IoIosCloseCircle } from "react-icons/io";
import PreviewCard from "./PreviewCard";
import PreviewCardV2 from "./PreviewCardV2";

export default function DailyWardReportModal({
  isOpen,
  onClose,
  type = "new",
  activateNotifications,
  oldPayload,
}) {
  const [loading, setLoading] = useState(false);
  const [wards, setWards] = useState([]);
  const [selectedWardId, setSelectedWardId] = useState("");
  const [reportNotes, setReportNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState("");

  // Load wards when modal opens
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const res = await GetAllWardApi();
        setWards(res.queryresult.wardmanagementdetails || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [isOpen]);

  // Initialize for edit/view
  useEffect(() => {
    if ((type === "edit" || type === "view") && oldPayload) {
      setSelectedWardId(oldPayload.ward._id);
      setReportNotes(oldPayload.wardreport || []);
    } else {
      setSelectedWardId("");
      setReportNotes([]);
    }
    setCurrentNote("");
  }, [type, oldPayload, isOpen]);

  const addReportNote = () => {
    if (!currentNote.trim()) return;
    setReportNotes(notes => [...notes, currentNote.trim()]);
    setCurrentNote("");
  };

  const removeReportNote = idx => {
    setReportNotes(notes => notes.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const ward = wards.find(w => w._id === selectedWardId);
      const payload = {
        wardname: ward.wardname,
        wardreport: reportNotes,
      };
      const res =
        type === "new"
          ? await CreateDailyWardReportApi(payload)
          : await UpdateDailyWardReportApi(payload, oldPayload._id);

      if (res.status === 200) {
        activateNotifications(
          type === "new"
            ? "Daily ward report created successfully."
            : "Daily ward report updated successfully.",
          "success"
        );
        onClose();
      }
    } catch (e) {
      activateNotifications(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const waitingForPayload = (type === "edit" || type === "view") && !oldPayload;
  const canSubmit = selectedWardId && reportNotes.length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent maxW="60vw" maxH="90vh" overflowY="auto">
        <ModalHeader>
          {type === "new"
            ? "New Daily Ward Report"
            : type === "view"
            ? "View Daily Ward Report"
            : "Edit Daily Ward Report"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {waitingForPayload ? (
            <Flex justify="center" align="center" minH="200px">
              <Spinner size="xl" />
            </Flex>
          ) : (
            <Stack spacing={6}>
              {type === "view" ? (
                // — VIEW MODE —
                <>
                  <Text fontWeight="700" fontSize="16px" color="blue.blue500">
                    Ward Information
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <PreviewCard title="Ward Name" value={oldPayload.ward.wardname} />
                    <PreviewCard title="Specialization" value={oldPayload.ward.bedspecialization} />
                    <PreviewCard title="Ward ID" value={oldPayload.ward.wardid} />
                    <PreviewCard title="Total Beds" value={oldPayload.ward.totalbed} />
                    <PreviewCard title="Occupied Beds" value={oldPayload.ward.occupiedbed} />
                    <PreviewCard title="Vacant Beds" value={oldPayload.ward.vacantbed} />
                  </SimpleGrid>

                  <Text mt="6" fontWeight="700" fontSize="16px" color="blue.blue500">
                    Report Notes
                  </Text>
                  <Stack spacing={2}>
                    {reportNotes.map((note, idx) => (
                      <PreviewCardV2 key={idx} value={note} />
                    ))}
                  </Stack>
                </>
              ) : (
                // — NEW or EDIT MODE FORM —
                <>
                  <Select
                    placeholder="Select Ward"
                    value={selectedWardId}
                    onChange={e => setSelectedWardId(e.target.value)}
                    mb={4}
                    borderWidth="2px"
                    borderColor="gray.400"
                  >
                    {wards.map(w => (
                      <option key={w._id} value={w._id}>
                        {w.wardname}
                      </option>
                    ))}
                  </Select>

                  <TextArea
                    label="Add Report Note"
                    value={currentNote}
                    onChange={e => setCurrentNote(e.target.value)}
                    mb={4}
                  />
                  <Flex justify="flex-end" mb={4}>
                    <Button size="xs" w="50px" h="10" onClick={addReportNote}>
                      Add
                    </Button>
                  </Flex>

                  {type === "new" ? (
                    // NEW: display as badges
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      {reportNotes.map((note, idx) => (
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
                            {note}
                          </Text>
                          <Box ml={2} cursor="pointer" onClick={() => removeReportNote(idx)}>
                            <IoIosCloseCircle color="white" />
                          </Box>
                        </Flex>
                      ))}
                    </SimpleGrid>
                  ) : (
                    // EDIT: display as editable textareas
                    <Stack spacing={4}>
                      {reportNotes.map((note, idx) => (
                        <Flex key={idx} align="start">
                          <TextArea
                            value={note}
                            onChange={e => {
                              const updated = [...reportNotes];
                              updated[idx] = e.target.value;
                              setReportNotes(updated);
                            }}
                            mb={2}
                          />
                          <Box ml={2} mt={2} cursor="pointer">
                            <Text
                              fontSize="16px"
                              fontWeight="bold"
                              onClick={() => removeReportNote(idx)}
                            >
                              ×
                            </Text>
                          </Box>
                        </Flex>
                      ))}
                    </Stack>
                  )}
                </>
              )}
            </Stack>
          )}
        </ModalBody>
        <ModalFooter>
          {!waitingForPayload && type !== "view" && (
            <Button onClick={handleSubmit} isLoading={loading} disabled={!canSubmit}>
              {type === "new" ? "Create Report" : "Update Report"}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
