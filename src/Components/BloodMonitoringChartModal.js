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
  Box,
  SimpleGrid,
  InputGroup,
  InputLeftElement,
  Icon,
  Select,
} from "@chakra-ui/react";
import Button from "../Components/Button";
import Input from "../Components/Input";
import ShowToast from "./ToastNotification";
import {
  CreateBloodMonitoringApi,
  UpdateBloodMonitoringApi,
  SettingsApi,           
} from "../Utils/ApiCalls";
import { FaVial, FaTint, FaRegClock } from "react-icons/fa";

export default function BloodMonitoringChartModal({
  isOpen,
  onClose,
  admissionId,
  onSuccess,
  type = "create",
  initialData,
}) {
  /* ---------------- new payload fields ---------------- */
  const initialFormState = {
    typeoftestRBSFBS: "",
    value: "",
    datetime: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [settings, setSettings] = useState({});          // NEW
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (t) => {
    setToast(t);
    setTimeout(() => setToast(null), 2000);
  };

  const handleInputChange = ({ target: { name, value } }) =>
    setFormData((p) => ({ ...p, [name]: value }));

  /* ---------------- fetch settings when open ---------------- */
  useEffect(() => {
    if (isOpen) {
      (async () => {
        try {
          const s = await SettingsApi();
          setSettings(s);
        } catch (e) {
          console.error("Error fetching settings:", e);
        }
      })();
    }
  }, [isOpen]);

  /* ---------------- pre‑populate ---------------- */
  useEffect(() => {
    if (isOpen) {
      if (type === "edit" && initialData) {
        setFormData({
          typeoftestRBSFBS: initialData.typeoftestRBSFBS || "",
          value: initialData.value || "",
          datetime: initialData.datetime || "",
        });
      } else {
        setFormData(initialFormState);
      }
    }
  }, [isOpen, type, initialData]);

  /* ---------------- submit ---------------- */
  const handleSubmit = async () => {
    if (Object.values(formData).some((v) => v === "")) {
      showToast({ status: "error", message: "All fields are required." });
      return;
    }
    setLoading(true);
    try {
      if (type === "edit") {
        await UpdateBloodMonitoringApi(formData, initialData._id || initialData.id);
      } else {
        await CreateBloodMonitoringApi(formData, admissionId);
      }
      showToast({
        status: "success",
        message: type === "edit" ? "Blood monitoring chart updated!" : "Blood monitoring chart created!",
      });
      onSuccess?.(formData);
      onClose();
      setFormData(initialFormState);
    } catch (e) {
      showToast({
        status: "error",
        message: `Failed to ${type === "edit" ? "update" : "create"} chart: ${e.message}`,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const isFormComplete = Object.values(formData).every(Boolean);

  return (
    <>
      {toast && <ShowToast status={toast.status} message={toast.message} />}
      <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior="inside" size="md">
        <ModalOverlay />
        <ModalContent maxW={{ base: "95%", md: "600px" }}>
          <ModalHeader>
            {type === "edit" ? "Edit Blood Monitoring Chart" : "Create Blood Monitoring Chart"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} mt={2}>
            <Box mb={4}>
              <SimpleGrid columns={1} spacing={4}>
                {/* Type of Test (dropdown) */}
                <FormControl>
                  <InputGroup>

                    <Select
                      placeholder="Select Test Type"
                      name="typeoftestRBSFBS"
                      value={formData.typeoftestRBSFBS}
                      onChange={handleInputChange}
                      borderWidth="2px"
                      borderColor="#6B7280"
                    >
                      {settings?.testtype?.map((opt, idx) => (
                        <option key={idx} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </Select>
                  </InputGroup>
                </FormControl>

                {/* Value (mmol/L) */}
                <FormControl>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaTint} color="gray.500" />
                    </InputLeftElement>
                    <Input
                      type="text"
                      name="value"
                      label="Value (mmol/L)"
                      value={formData.value}
                      onChange={handleInputChange}
                      placeholder="Enter value in mmol/L"
                    />
                  </InputGroup>
                </FormControl>

                {/* Date & Time */}
                <FormControl>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaRegClock} color="gray.500" />
                    </InputLeftElement>
                    <Input
                      type="datetime-local"
                      name="datetime"
                      label="Date & Time"
                      value={formData.datetime}
                      onChange={handleInputChange}
                      placeholder="Select date and time"
                    />
                  </InputGroup>
                </FormControl>
              </SimpleGrid>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit} disabled={!isFormComplete || loading} isLoading={loading}>
              {type === "edit" ? "Update" : "Submit"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
