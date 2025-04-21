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
  InputGroup,
  InputLeftElement,
  Icon,
} from "@chakra-ui/react";
import Button from "./Button";
import Input from "./Input";
import ShowToast from "./ToastNotification";
import { CreateTubeFeedingChartApi, UpdateTubeFeedingChartApi } from "../Utils/ApiCalls";
import { AiOutlineCalendar } from "react-icons/ai";
import { MdLocalDrink } from "react-icons/md";
import { FaSignature } from "react-icons/fa";

export default function TubeFeedingChartModal({
  isOpen,
  onClose,
  admissionId,
  onSuccess,

  type = "create",
  initialData,
}) {

  let storedAdmission = localStorage.getItem("inPatient");
  let finalAdmissionId = admissionId;
  if (!finalAdmissionId && storedAdmission) {
    try {
      const patient = JSON.parse(storedAdmission);
      if (patient.admission && Array.isArray(patient.admission)) {
        finalAdmissionId = patient.admission[0];
      } else {
        finalAdmissionId = localStorage.getItem("admissionId");
      }
    } catch (err) {
      finalAdmissionId = localStorage.getItem("admissionId");
    }
  }

  const initialFormState = {
    Datetimefeeds: "",
    amount: "",
    feed: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (toastData) => {
    setToast(toastData);
    setTimeout(() => setToast(null), 2000);
  };

  const handleInputChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Pre-populate the form when editing.
  useEffect(() => {
    if (isOpen) {
      if (type === "edit" && initialData) {
        setFormData({
          Datetimefeeds: initialData.Datetimefeeds || "",
          amount: initialData.amount || "",
          feed: initialData.feed || "",
        });
      } else {
        setFormData(initialFormState);
      }
    }
  }, [isOpen, type, initialData]);

  const handleSubmit = async () => {
    // Ensure all fields are completed.
    if (Object.values(formData).some((field) => field === "")) {
      showToast({ status: "error", message: "All fields are required." });
      return;
    }
    setLoading(true);
    try {
      if (type === "edit") {
       
        await UpdateTubeFeedingChartApi(formData, initialData.id);
        showToast({
          status: "success",
          message: "Tube feeding chart updated successfully!",
        });
      } else {
       
        await CreateTubeFeedingChartApi(formData, finalAdmissionId);
        showToast({
          status: "success",
          message: "Tube feeding chart created successfully!",
        });
      }
      if (onSuccess) {
        onSuccess();
      }
      onClose();
      setFormData(initialFormState);
    } catch (error) {
      showToast({
        status: "error",
        message: `Failed to ${type === "edit" ? "update" : "create"} tube feeding chart: ${error.message}`,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const isFormComplete = Object.values(formData).every((field) => field);

  return (
    <>
      {toast && <ShowToast status={toast.status} message={toast.message} />}
      <Modal isOpen={isOpen} onClose={onClose} size="lg"  isCentered>
        <ModalOverlay />
        <ModalContent maxWidth={["90%", "60%"]}>
          <ModalHeader>
            {type === "edit" ? "Edit Tube Feeding Chart" : "Create Tube Feeding Chart"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid columns={1} spacing={4}>
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={AiOutlineCalendar} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Date & Time of Feeding"
                    type="datetime-local"
                    name="Datetimefeeds"
                    value={formData.Datetimefeeds}
                    onChange={handleInputChange}
                    placeholder="Select date and time"
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={MdLocalDrink} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Amount"
                    type="text"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="e.g., 300CL"
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaSignature} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Feed"
                    type="text"
                    name="feed"
                    value={formData.feed}
                    onChange={handleInputChange}
                    placeholder="Enter Feed"
                  />
                </InputGroup>
              </FormControl>
            </SimpleGrid>
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
