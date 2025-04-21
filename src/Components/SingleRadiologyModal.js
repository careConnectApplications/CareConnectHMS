import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Box,
  SimpleGrid,
  Text,
  Flex,
  Stack,
  Select,
} from "@chakra-ui/react";
import Button from "../Components/Button";
import Input from "../Components/Input";
import ShowToast from "./ToastNotification";
import { IoIosCloseCircle } from "react-icons/io";
import { SlPlus } from "react-icons/sl";
import { MdNote } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import {
  CreateRadiologyOrderApi,
  UpdateRadiologyApi,
  SettingsApi,
  SearchPatientApi,
  SearchRadiologyApi,
} from "../Utils/ApiCalls";

export default function SingleRadiologyModal({
  isOpen,
  onClose,
  onSuccess,
  type = "create", 
  initialData,
}) {

  const [note, setNote] = useState("");
  const [testNames, setTestNames] = useState([]);
  const [testNameInput, setTestNameInput] = useState("");
  const [availableTests, setAvailableTests] = useState([]);

  const [availablePatients, setAvailablePatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [searchMRN, setSearchMRN] = useState("");
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);

  const [searchTestQuery, setSearchTestQuery] = useState("");
  const [testSearchResults, setTestSearchResults] = useState([]);
  const [isLoadingTests, setIsLoadingTests] = useState(false);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);


  const showToastFn = ({ status, message }) => {
    setToast({ status, message });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    if (!isOpen) return;

    if ((type === "edit" || type === "view") && initialData) {
      setNote(initialData.note || "");
      setTestNames(
        Array.isArray(initialData.testname)
          ? initialData.testname
          : initialData.testname
          ? [initialData.testname]
          : []
      );
      setSelectedPatientId(initialData.patientId || "");
    } else {
      setNote("");
      setTestNames([]);
      setTestNameInput("");
      setSelectedPatientId("");
    }
  }, [isOpen, type, initialData]);


  useEffect(() => {
    if (!isOpen) return;
    const fetchAvailableTests = async () => {
      try {
        const res = await SettingsApi();
        const radiologyCat = res?.servicecategory?.find(
          (c) => c.category.toLowerCase() === "radiology"
        );
        if (radiologyCat?.type) setAvailableTests(radiologyCat.type);
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };
    fetchAvailableTests();
  }, [isOpen]);

  const handleSearchPatient = async () => {
    if (!searchMRN.trim()) return;
    setIsLoadingPatients(true);
    try {
      const res = await SearchPatientApi(searchMRN.trim());
      setAvailablePatients(res?.queryresult?.patientdetails || []);
    } catch (err) {
      console.error("Error searching patient:", err.message);
    } finally {
      setIsLoadingPatients(false);
    }
  };

  useEffect(() => {
    const fetchTests = async () => {
      if (!searchTestQuery.trim()) {
        setTestSearchResults([]);
        return;
      }
      setIsLoadingTests(true);
      try {
        const res = await SearchRadiologyApi(searchTestQuery.trim());
        setTestSearchResults(res?.queryresult || []);
      } catch (err) {
        console.error("Error searching radiology:", err.message);
        setTestSearchResults([]);
      } finally {
        setIsLoadingTests(false);
      }
    };
    fetchTests();
  }, [searchTestQuery]);

  useEffect(() => {
    if (isOpen) return;
    setSearchMRN("");
    setSearchTestQuery("");
    setTestSearchResults([]);
    setSelectedPatientId("");        
    setAvailablePatients([]);        
  }, [isOpen]);

  const addTestName = () => {
    if (!testNameInput.trim()) return;
    setTestNames([...testNames, testNameInput.trim()]);
    setTestNameInput("");
  };
  const removeTestName = (name) =>
    setTestNames(testNames.filter((t) => t !== name));


  const handleSubmit = async () => {
    if (!selectedPatientId) {
      return showToastFn({
        status: "error",
        message: "Please select a patient.",
      });
    }
    if (testNames.length === 0) {
      return showToastFn({
        status: "error",
        message: "At least one test name is required.",
      });
    }

    setLoading(true);
    const payload = {
      testname: testNames,
      note: note.trim(), 
    };

    try {
      if (type === "edit" && initialData) {
        const id = initialData.id || initialData._id;
        await UpdateRadiologyApi(payload, id);
      } else {
        await CreateRadiologyOrderApi(payload, selectedPatientId);
      }
      const msg =
        type === "edit"
          ? "Radiology order updated successfully!"
          : "Radiology order created successfully!";
      showToastFn({ status: "success", message: msg });
      if (onSuccess) onSuccess(msg, "success");
      onClose();
    } catch (err) {
      showToastFn({
        status: "error",
        message: `Failed to ${
          type === "edit" ? "update" : "create"
        } radiology order: ${err.message}`,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled =
    loading || !selectedPatientId || testNames.length === 0;

  return (
    <>
      {toast && <ShowToast status={toast.status} message={toast.message} />}

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent maxW={["90%", "600px"]} borderRadius="md" boxShadow="lg">
          <ModalHeader
            fontSize={["lg", "xl"]}
            borderBottom="1px"
            borderColor="gray.200"
          >
            {type === "edit"
              ? "Edit Radiology Order Request"
              : "Create Radiology Order Request"}
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody>
            <Stack spacing={4}>
              {/* -------- Patient search & select -------- */}
              <Flex mb={2} gap={4}>
                <Input
                  label="Search for Patient"
                  placeholder="Enter MRN, first name, or last name"
                  value={searchMRN}
                  onChange={(e) => setSearchMRN(e.target.value)}
                  leftIcon={<FiSearch size={16} color="blue.500" />}
                  flex="1"
                />
                <Button
                  onClick={handleSearchPatient}
                  w={["100%", "100%", "165px", "205px"]}
                >
                  Search
                </Button>
              </Flex>

              <Select
                placeholder={
                  isLoadingPatients ? "Loading patients..." : "Select Patient"
                }
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                variant="outline"
                borderColor="gray.300"
                _hover={{ borderColor: "blue.400" }}
                isDisabled={isLoadingPatients}
              >
                {availablePatients.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.firstName} {p.lastName} - {p.MRN}
                  </option>
                ))}
              </Select>

              {/* -------- Test search & select -------- */}
              <Input
                label="Search for Test"
                placeholder="Enter test name"
                value={searchTestQuery}
                onChange={(e) => setSearchTestQuery(e.target.value)}
                leftIcon={<FiSearch size={16} color="blue.500" />}
              />

              <Flex
                direction={{ base: "column", md: "row" }}
                alignItems="center"
              >
                <Box flex="1" mr={{ base: 0, md: 2 }} mt={2}>
                  <Select
                    placeholder={
                      isLoadingTests ? "Loading tests..." : "Select test name"
                    }
                    value={testNameInput}
                    onChange={(e) => setTestNameInput(e.target.value)}
                    variant="outline"
                    borderColor="gray.300"
                    _hover={{ borderColor: "blue.400" }}
                    isDisabled={isLoadingTests}
                  >
                    {(searchTestQuery.trim()
                      ? testSearchResults
                      : availableTests
                    ).map((t, idx) => (
                      <option
                        key={searchTestQuery.trim() ? t._id : idx}
                        value={searchTestQuery.trim() ? t.servicetype : t}
                      >
                        {searchTestQuery.trim() ? t.servicetype : t}
                      </option>
                    ))}
                  </Select>
                </Box>

                <Button
                  mt={{ base: 2, md: 0 }}
                  w={{ base: "100%", md: "150px" }}
                  onClick={addTestName}
                  rightIcon={<SlPlus />}
                  size="sm"
                  disabled={!testNameInput}
                >
                  Add Test
                </Button>
              </Flex>


              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={2}>
                {testNames.map((item, idx) => (
                  <Flex
                    key={idx}
                    cursor="pointer"
                    px="10px"
                    py="10px"
                    rounded="full"
                    bg="blue.blue500"
                    color="white"
                    fontSize="sm"
                    _hover={{ bg: "blue.blue400" }}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Text fontWeight="medium" textTransform="capitalize">
                      {item}
                    </Text>
                    <Box fontSize="lg" onClick={() => removeTestName(item)}>
                      <IoIosCloseCircle />
                    </Box>
                  </Flex>
                ))}
              </SimpleGrid>

              {/* -------- Optional note -------- */}
              <Input
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter note (optional)"
                label="Note (optional)"
                leftIcon={<MdNote color="blue.500" />}
              />
            </Stack>
          </ModalBody>

          <ModalFooter borderTop="1px" borderColor="gray.200">
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
              isLoading={loading}
            >
              {type === "edit" ? "Update" : "Submit"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
