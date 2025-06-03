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
  InputGroup,
  InputLeftElement,
  Icon,
  SimpleGrid,
} from "@chakra-ui/react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { FaUtensils, FaHeartbeat, FaHandHoldingMedical } from "react-icons/fa";
import Button from "./Button";
import Input from "./Input";
import ShowToast from "./ToastNotification";
import {
  CreateFoodGivensAPI,
  UpdateFoodGivensAPI,
} from "../Utils/ApiCalls";

export default function SingleFoodGivenModal({
  isOpen,
  onClose,
  anaesthesiaId,
  onSuccess,
  type = "create",        // "create" or "edit"
  initialData,
}) {
  // pick up either _id (raw) or id (transformed)
  const recordId = type === "edit"
    ? (initialData._id || initialData.id)
    : anaesthesiaId;

  const initialForm = {
    foodgiven: "",
    timegiven: "",
    bp: "",
    pulse: "",
    temp: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (data) => {
    setToast(data);
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = ({ target: { name, value } }) => {
    setFormData((p) => ({ ...p, [name]: value }));
  };

  useEffect(() => {
    if (!isOpen) return;
    if (type === "edit" && initialData) {
      setFormData({
        foodgiven:  initialData.foodgiven  || "",
        timegiven:  initialData.timegiven?.slice(0,10) || "",
        bp:         initialData.bp         || "",
        pulse:      initialData.pulse      || "",
        temp:       initialData.temp       || "",
      });
    } else {
      setFormData(initialForm);
    }
  }, [isOpen, type, initialData]);

  const handleSubmit = async () => {
    // require all fields
    if (Object.values(formData).some((v) => !v.trim())) {
      showToast({ status: "error", message: "All fields are required." });
      return;
    }
    setLoading(true);
    try {
      if (type === "edit") {
        await UpdateFoodGivensAPI(formData, recordId);
        showToast({ status: "success", message: "Food given updated." });
      } else {
        await CreateFoodGivensAPI(formData, recordId);
        showToast({ status: "success", message: "Food given recorded." });
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      showToast({
        status: "error",
        message: `Failed to ${type==="edit"?"update":"create"}: ${err.response?.data?.msg || err.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const isComplete = Object.values(formData).every((v) => v.trim());

  return (
    <>
      {toast && <ShowToast status={toast.status} message={toast.message} />}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {type === "edit" ? "Edit Food Given" : "Record Food Given"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid columns={1} spacing={4}>
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaUtensils} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    name="foodgiven"
                    label="Food Given"
                    placeholder="Food Given"
                    value={formData.foodgiven}
                    onChange={handleChange}
                  />
                </InputGroup>
              </FormControl>

              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={AiOutlineClockCircle} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    name="timegiven"
                    type="date"
                    placeholder="Time given"
                    value={formData.timegiven}
                    onChange={handleChange}
                  />
                </InputGroup>
              </FormControl>

              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaHeartbeat} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    name="bp"
                    placeholder="BP"
                    label="BP"
                    value={formData.bp}
                    onChange={handleChange}
                  />
                </InputGroup>
              </FormControl>

              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaHandHoldingMedical} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    name="pulse"
                    placeholder="Pulse"
                    label="Pulse"
                    value={formData.pulse}
                    onChange={handleChange}
                  />
                </InputGroup>
              </FormControl>

              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaHeartbeat} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    name="temp"
                    placeholder="Temperature"
                    label="Temperature"
                    value={formData.temp}
                    onChange={handleChange}
                  />
                </InputGroup>
              </FormControl>
            </SimpleGrid>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={handleSubmit}
              isLoading={loading}
              disabled={!isComplete}
            >
              {type === "edit" ? "Update" : "Submit"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
