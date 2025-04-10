import { HStack, Text } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  Box,
  SimpleGrid,
  Flex,
} from "@chakra-ui/react";
import Input from "./Input";
import TextArea from "./TextArea";
import Button from "./Button";
import {
  UpdateExaminedPatientAPI,
  SettingsApi,
  RequestLabOrderApi,
  GetAllClinicApi,
} from "../Utils/ApiCalls";
import { MdMiscellaneousServices } from "react-icons/md";
import { FaMoneyBill } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";

export default function LabRequestModal({
  isOpen,
  onClose,
  type,
  activateNotifications,
  oldPayload,
  onSuccess,
}) {
  // Retrieve appointment and patient ids from local storage
  let id = localStorage.getItem("appointmentId");
  const patientId = localStorage.getItem("patientId");

  // Component state
  const [Loading, setLoading] = useState(false);
  const [Settings, setSettings] = useState({});
  const [TestNames, setTestNames] = useState([]);
  // Expanded payload includes department (lab) and testNames
  const [Payload, setPayload] = useState({
    department: "",
    testNames: "",
  });
  // New state to store lab list
  const [labs, setLabs] = useState([]);

  const [UpdatedPayload, setUpdatedPayload] = useState({
    servicecategory: "",
    amount: "",
    servicetype: "",
  });

  // Handler for other payload updates
  const handleUpdatedPayload = (e) => {
    setUpdatedPayload({ ...UpdatedPayload, [e.target.id]: e.target.value });
  };

  // Generic handler to update the payload.
  // If the event is for testNames, also append the selected test to TestNames array.
  const handlePayload = (e) => {
    setPayload({ ...Payload, [e.target.id]: e.target.value });
    if (e.target.id === "testNames") {
      setTestNames([...TestNames, e.target.value]);
    }
  };

  // Fetch settings (which includes test name lists, etc.)
  const getSettings = async () => {
    try {
      const result = await SettingsApi();
      // Optionally filter service category if needed.
      setSettings(result);
    } catch (e) {
      console.error("Error fetching settings:", e);
    }
  };

  // Fetch lab details by calling GetAllClinicApi and filter for labs
  const getLabs = async () => {
    try {
      const result = await GetAllClinicApi();
      if (result?.queryresult?.clinicdetails) {
        const labList = result.queryresult.clinicdetails.filter(
          (item) => item.type === "lab"
        );
        setLabs(labList);
      }
    } catch (e) {
      console.error("Error fetching labs:", e);
    }
  };

  // Function to trigger lab order request
  const RequestLabOrder = async () => {
    setLoading(true);
    try {
      // Pass the lab (as department), test names, and appointment id in the API call payload.
      const result = await RequestLabOrderApi(
        {
          testname: TestNames,
          appointmentunderscoreid: oldPayload._id,
          department: Payload.department,
        },
        patientId
      );

      if (result.status === 200) {
        setLoading(false);
        onClose();
        setPayload({
          department: "",
          testNames: "",
        });
        setTestNames([]);
        activateNotifications("Lab Order Requested Successfully", "success");
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (e) {
      setLoading(false);
      activateNotifications(e.message, "error");
    }
  };

  // Remove a test from the selected list
  const removeTestName = (item) => {
    const updatedTestNames = TestNames.filter((test) => test !== item);
    setTestNames(updatedTestNames);
  };

  // Run on component mount: fetch settings and labs
  useEffect(() => {
    getSettings();
    getLabs();
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent maxW={{ base: "90%", md: "50%" }}>
        <ModalHeader> Lab Order For {oldPayload.appointmentid} </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <>
            {/* Lab selection drop down */}
            <SimpleGrid mt="32px" columns={{ base: 1, md: 1 }} spacing={10}>
              <Select
                onChange={handlePayload}
                placeholder="Select Lab"
                border="2px solid"
                id="department"
                value={Payload.department}
                size="lg"
                fontSize={Payload.department !== "" ? "16px" : "13px"}
                borderColor="gray.500"
              >
                {labs.map((item, i) => (
                  <option key={i} value={item.clinic}>
                    {item.clinic}
                  </option>
                ))}
              </Select>
            </SimpleGrid>

            {/* Test selection drop down */}
            <SimpleGrid mt="32px" columns={{ base: 1, md: 1 }} spacing={10}>
              <Select
                onChange={handlePayload}
                placeholder="Select Test Name"
                border="2px solid"
                id="testNames"
                value={Payload.testNames}
                size="lg"
                fontSize={Payload.testNames !== "" ? "16px" : "13px"}
                borderColor="gray.500"
              >
                {Settings?.testnames?.map((item, i) => (
                  <option key={i} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </SimpleGrid>

            {/* Display the selected test names */}
            <SimpleGrid mt="12px" columns={{ base: 2, md: 4 }} spacing={2}>
              {TestNames?.map((item, i) => (
                <Flex
                  key={i}
                  cursor="pointer"
                  px="10px"
                  py="10px"
                  rounded="25px"
                  fontSize="13px"
                  _hover={{ bg: "blue.blue400" }}
                  bg="blue.blue500"
                  w="100%"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text
                    color="#fff"
                    fontWeight="500"
                    textTransform="capitalize"
                  >
                    {item}
                  </Text>
                  <Box
                    fontSize="20px"
                    color="#fff"
                    onClick={() => removeTestName(item)}
                  >
                    <IoIosCloseCircle />
                  </Box>
                </Flex>
              ))}
            </SimpleGrid>

            <Button mt="32px" onClick={RequestLabOrder} isLoading={Loading}>
              Request
            </Button>
          </>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
