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
  SearchRadiologyApi,
} from "../Utils/ApiCalls";

export default function RadiologyOrderRequestModal({
  isOpen,
  onClose,
  admissionId,
  onSuccess,
  type = "create",
  initialData,
  oldPayload,
}) {

  const [note, setNote]                    = useState("");
  const [testNames, setTestNames]          = useState([]);
  const [testNameInput, setTestNameInput]  = useState("");
  const [availableTests, setAvailableTests]= useState([]);

  const [searchTestQuery, setSearchTestQuery]       = useState("");
  const [testSearchResults, setTestSearchResults]   = useState([]);
  const [isLoadingTests, setIsLoadingTests]         = useState(false);

  const [loading, setLoading]              = useState(false);
  const [toast, setToast]                  = useState(null);


  const showToast = ({ status, message }) => {
    setToast({ status, message });
    setTimeout(() => setToast(null), 2000);
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
    } else {
      setNote("");
      setTestNames([]);
      setTestNameInput("");
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

  const addTestName = () => {
    if (!testNameInput.trim()) return;
    setTestNames([...testNames, testNameInput.trim()]);
    setTestNameInput("");
  };
  const removeTestName = (name) =>
    setTestNames(testNames.filter((t) => t !== name));

 

  const handleSubmit = async () => {
    if (testNames.length === 0) {
      showToast({ status: "error", message: "At least one test name is required." });
      return;
    }
    if (!note.trim()) {
      showToast({ status: "error", message: "Note field is required." });
      return;
    }

    setLoading(true);
    const payload = {
      testname: testNames,
      note: note.trim(),
      appointmentid: oldPayload.id,
    };

    try {
      if (type === "edit" && initialData) {
        const id = initialData.id || initialData._id;
        await UpdateRadiologyApi(payload, id);
      } else {
        const patientId = localStorage.getItem("patientId");
        await CreateRadiologyOrderApi(payload, patientId);
      }
      const msg =
        type === "edit"
          ? "Radiology order updated successfully!"
          : "Radiology order created successfully!";
      showToast({ status: "success", message: msg });
      if (onSuccess) onSuccess(msg, "success");
      onClose();
      setNote("");
      setTestNames([]);
      setTestNameInput("");
      setSearchTestQuery("");
      setTestSearchResults([]);
    } catch (err) {
      showToast({
        status: "error",
        message: `Failed to ${type === "edit" ? "update" : "create"} radiology order: ${err.message}`,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled = loading || testNames.length === 0 || !note.trim();

  return (
    <>
      {toast && <ShowToast status={toast.status} message={toast.message} />}

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent maxW={["90%", "600px"]}>
          <ModalHeader fontSize={["lg", "xl"]}>
            {type === "edit" ? "Edit Radiology Order Request" : "Create Radiology Order Request"}
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody>
            <Stack spacing={["10px", "15px"]}>
              {/* -------- Test search input -------- */}
              <Input
                label="Search for Test"
                placeholder="Enter test name"
                value={searchTestQuery}
                onChange={(e) => setSearchTestQuery(e.target.value)}
                leftIcon={<FiSearch size={16} color="blue.500" />}
              />

              {/* -------- Test dropdown & add button -------- */}
              <Flex direction={{ base: "column", md: "row" }} alignItems={{ base: "stretch", md: "center" }}>
                <Box flex="1" mr={{ base: 0, md: "2" }}>
                  <Select
                    placeholder={isLoadingTests ? "Loading tests..." : "Select test name"}
                    value={testNameInput}
                    onChange={(e) => setTestNameInput(e.target.value)}
                    isDisabled={isLoadingTests}
                  >
                    {(searchTestQuery.trim() ? testSearchResults : availableTests).map((t, idx) => (
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
                  w={{ base: "auto", md: "150px" }}
                  onClick={addTestName}
                  rightIcon={<SlPlus />}
                  size="sm"
                  disabled={!testNameInput}
                >
                  Add
                </Button>
              </Flex>

              {/* -------- Test chips -------- */}
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={2}>
                {testNames.map((item, idx) => (
                  <Flex
                    key={idx}
                    cursor="pointer"
                    px="10px"
                    py="10px"
                    rounded="25px"
                    bg="blue.blue500"
                    color="white"
                    fontSize="13px"
                    _hover={{ bg: "blue.blue400" }}
                    w="100%"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text color="#fff" fontWeight="500" textTransform="capitalize">
                      {item}
                    </Text>
                    <Box fontSize="20px" color="#fff" onClick={() => removeTestName(item)}>
                      <IoIosCloseCircle />
                    </Box>
                  </Flex>
                ))}
              </SimpleGrid>

              {/* -------- Note -------- */}
              <Input
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter note"
                label="Note"
                leftIcon={<MdNote color="blue.500" />}
              />
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit} disabled={isSubmitDisabled} isLoading={loading}>
              {type === "edit" ? "Update" : "Submit"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
