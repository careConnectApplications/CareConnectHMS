import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  SimpleGrid,
  Divider,
  Text,
  InputGroup,
  InputLeftElement,
  Icon,
  Select,
} from "@chakra-ui/react";
import Button from "../Components/Button";
import Input from "../Components/Input";
import ShowToast from "./ToastNotification";
import {
  CreateInsulinApi,
  UpdateInsulinApi,
  SettingsApi,
} from "../Utils/ApiCalls";

import { AiOutlineCalendar } from "react-icons/ai";

import { FaHashtag } from "react-icons/fa";

export default function InsulinChartModal({
  isOpen,
  onClose,
  admissionId,
  onSuccess,

  type = "create",
  initialData,
}) {

  const initialFormState = {
    dateandtimeofinsulinadministration: "",
    typeofinsulin: "",
    dosage: "",
    route: "",
    rbsvalue: "", 
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [settings, setSettings] = useState({});

  const showToast = (toastData) => {
    setToast(toastData);
    setTimeout(() => setToast(null), 2000);
  };

  const handleInputChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  
  useEffect(() => {
    if (isOpen) {
      const fetchSettings = async () => {
        try {
          const settingsData = await SettingsApi();
          console.log("SettingsApi response:", settingsData); 
          setSettings(settingsData);
        } catch (error) {
          console.error("Error fetching settings:", error);
        }
      };
      fetchSettings();
    }
  }, [isOpen]);



  useEffect(() => {
    if (isOpen) {
      if (type === "edit" && initialData) {
        setFormData({
          dateandtimeofinsulinadministration:
            initialData.dateandtimeofinsulinadministration || "",
          typeofinsulin: initialData.typeofinsulin || "",
          dosage: initialData.dosage || "",
          route: initialData.route || "",
          rbsvalue: initialData.rbsvalue || "", // ← NEW
          /* ------------------------------------------------------
             The following fields are no longer part of the payload
          ------------------------------------------------------ */
          // dateandtimeofbloodglucosemonitoring: initialData.dateandtimeofbloodglucosemonitoring || "",
          // premealbloodglucoselevel:           initialData.premealbloodglucoselevel           || "",
          // postmealbloodglucoselevel:          initialData.postmealbloodglucoselevel          || "",
          // fastingbloodglucose:                initialData.fastingbloodglucose                || "",
          // mealtimes:                          initialData.mealtimes                          || "",
          // carbonhydrateintakeestimation:      initialData.carbonhydrateintakeestimation      || "",
          // symtoms:                            initialData.symtoms                            || "",
          // interventionprovided:               initialData.interventionprovided               || "",
        });
      } else {
        setFormData(initialFormState);
      }
    }
  }, [isOpen, type, initialData]);

  /* ---------------- form submission (unchanged) ---------------- */
  const handleSubmit = async () => {
    if (Object.values(formData).some((field) => field === "")) {
      showToast({ status: "error", message: "All fields are required." });
      return;
    }
    setLoading(true);
    try {
      if (type === "edit") {
        await UpdateInsulinApi(formData, initialData._id || initialData.id);
        showToast({
          status: "success",
          message: "Insulin chart updated successfully!",
        });
      } else {
        await CreateInsulinApi(formData, admissionId);
        showToast({
          status: "success",
          message: "Insulin chart created successfully!",
        });
      }
      if (onSuccess) onSuccess();
      onClose();
      setFormData(initialFormState);
    } catch (error) {
      showToast({
        status: "error",
        message: `Failed to ${
          type === "edit" ? "update" : "create"
        } insulin chart: ${error.message}`,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const isFormComplete = Object.values(formData).every((field) => field !== "");

  return (
    <>
      {toast && <ShowToast status={toast.status} message={toast.message} />}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        scrollBehavior="inside"
        size="2xl"
      >
        <ModalOverlay />
        <ModalContent
          maxW={{ base: "95%", md: "80%" }}
          maxH={{ base: "90vh", md: "auto" }}
        >
          <ModalHeader>
            {type === "edit" ? "Edit Insulin Chart" : "Create Insulin Chart"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} mt={2}>
            {/* ----------------------------------------------------
                 ↓ ONLY the Insulin‑administration block is needed
            ---------------------------------------------------- */}
            <Text fontSize="md" fontWeight="bold" color="blue.blue500" mb={2}>
              Insulin Administration
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {/* Date & Time of Insulin Administration */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={AiOutlineCalendar} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Date & Time of Insulin Administration"
                    type="datetime-local"
                    name="dateandtimeofinsulinadministration"
                    value={formData.dateandtimeofinsulinadministration}
                    onChange={handleInputChange}
                    placeholder="Select date and time"
                  />
                </InputGroup>
              </FormControl>

              {/* Type of Insulin */}
              <FormControl>
                <Select
                  placeholder="Select Type of Insulin"
                  name="typeofinsulin"
                  value={formData.typeofinsulin}
                  onChange={handleInputChange}
                  borderWidth="2px"
                  borderColor="#6B7280"
                >
                  {settings?.typeofinsulin?.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {/* Dosage */}
              {/* Dosage – in International Units */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaHashtag} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Dosage (IU)"
                    type="number" // numbers only
                    min="0"
                    step="0.1"
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleInputChange}
                    placeholder="Enter dosage in IU"
                  />
                </InputGroup>
              </FormControl>

              {/* Route */}
              <FormControl>
                <Select
                  placeholder="Select Route"
                  name="route"
                  value={formData.route}
                  onChange={handleInputChange}
                  borderWidth="2px"
                  borderColor="#6B7280"
                >
                  {settings?.insulinroute?.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {/* RBS Value (NEW) */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaHashtag} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="RBS Value"
                    type="text"
                    name="rbsvalue"
                    value={formData.rbsvalue}
                    onChange={handleInputChange}
                    placeholder="Enter random blood sugar value"
                  />
                </InputGroup>
              </FormControl>
            </SimpleGrid>

            {/* ----------------------------------------------------
               ↓ OLD sections are kept for reference but commented
            ---------------------------------------------------- */}

            {/*
            <Divider my={4} />
            <Text fontSize="md" fontWeight="bold" color="blue.blue500" mb={2}>
              Blood Glucose Monitoring
            </Text>
            ...
            */}

            {/*
            <Divider my={4} />
            <Text fontSize="md" fontWeight="bold" color="blue.blue500" mb={2}>
              Nutritional Factors
            </Text>
            ...
            */}

            {/*
            <Divider my={4} />
            <Text fontSize="md" fontWeight="bold" color="blue.blue500" mb={2}>
              Hypoglycemia or Hyperglycemia Episodes
            </Text>
            ...
            */}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              disabled={!isFormComplete || loading}
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
