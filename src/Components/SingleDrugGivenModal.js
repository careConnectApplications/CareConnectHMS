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
import { FaPills, FaHeartbeat, FaHandHoldingMedical } from "react-icons/fa";
import Button from "./Button";
import Input from "./Input";
import ShowToast from "./ToastNotification";
import {
  CreateDrugGivensAPI,
  UpdateDrugGivensAPI,
} from "../Utils/ApiCalls";

export default function SingleDrugGivenModal({
  isOpen,
  onClose,
  anaesthesiaId,
  onSuccess,
  type = "create",        // "create" or "edit"
  initialData,
}) {
  // use the record ID for edit, otherwise the anaesthesiaId for create
  const recordId =
    type === "edit"
      ? (initialData._id || initialData.id)
      : anaesthesiaId;

  const initialForm = {
    druggiven: "",
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
        druggiven:  initialData.druggiven   || "",
        timegiven:  initialData.timegiven?.slice(0,10) || "",
        bp:         initialData.bp          || "",
        pulse:      initialData.pulse       || "",
        temp:       initialData.temp        || "",
      });
    } else {
      setFormData(initialForm);
    }
  }, [isOpen, type, initialData]);

  const handleSubmit = async () => {
    if (Object.values(formData).some((v) => !v.trim())) {
      showToast({ status: "error", message: "All fields are required." });
      return;
    }
    setLoading(true);
    try {
      if (type === "edit") {
        await UpdateDrugGivensAPI(formData, recordId);
        showToast({ status: "success", message: "Drug record updated." });
      } else {
        await CreateDrugGivensAPI(formData, recordId);
        showToast({ status: "success", message: "Drug given recorded." });
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      showToast({
        status: "error",
        message: `Failed to ${type === "edit" ? "update" : "create"}: ${
          err.response?.data?.msg || err.message
        }`,
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
            {type === "edit" ? "Edit Drug Given" : "Record Drug Given"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid columns={1} spacing={4}>
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaPills} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    name="druggiven"
                    label="Drug Given"
                    placeholder="Drug Given"
                    value={formData.druggiven}
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
                    label="BP"
                    placeholder="BP"
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
                    label="Pulse"
                    placeholder="Pulse"
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
                    label="Temperature"
                    placeholder="Temperature"
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
