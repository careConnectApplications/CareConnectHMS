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
} from "@chakra-ui/react";
import Button from "./Button";
import Input from "./Input";
import ShowToast from "./ToastNotification";
import {
  CreateFluidBalanceApi,
  UpdateFluidBalanceApi,
} from "../Utils/ApiCalls";

import { AiOutlineCalendar } from "react-icons/ai";
import { GiWaterDrop } from "react-icons/gi";
import { FaHashtag, FaSyringe } from "react-icons/fa";

export default function FluidBalanceModal({
  isOpen,
  onClose,
  admissionId,
  onSuccess,
  type = "create",
  initialData,
}) {

  const initialFormState = {
    datetime: "",
    intaketype: "",
    intakeroute: "",
    intakeamount: "",
    outputtype: "",
    outputroute: "",
    outputamount: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (toastData) => {
    setToast(toastData);
    setTimeout(() => setToast(null), 2000);
  };

  const handleInputChange = ({ target: { name, value } }) =>
    setFormData((p) => ({ ...p, [name]: value }));


  useEffect(() => {
    if (isOpen) {
      if (type === "edit" && initialData) {
        setFormData({
          datetime: initialData.datetime || "",
          intaketype: initialData.intaketype || "",
          intakeroute: initialData.intakeroute || "",
          intakeamount: initialData.intakeamount || "",
          outputtype: initialData.outputtype || "",
          outputroute: initialData.outputroute || "",
          outputamount: initialData.outputamount || "",
        });
      } else {
        setFormData(initialFormState);
      }
    }
  }, [isOpen, type, initialData]);

 
  const handleSubmit = async () => {
    if (Object.values(formData).some((v) => v === "")) {
      showToast({ status: "error", message: "All fields are required." });
      return;
    }
    setLoading(true);
    try {
      if (type === "edit") {
        await UpdateFluidBalanceApi(
          formData,
          initialData._id || initialData.id
        );
        showToast({
          status: "success",
          message: "Fluid balance updated successfully!",
        });
      } else {
        await CreateFluidBalanceApi(formData, admissionId);
        showToast({
          status: "success",
          message: "Fluid balance created successfully!",
        });
      }
      onSuccess?.();
      onClose();
      setFormData(initialFormState);
    } catch (e) {
      showToast({
        status: "error",
        message: `Failed to ${
          type === "edit" ? "update" : "create"
        } fluid balance: ${e.message}`,
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
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        scrollBehavior="inside"
        size="lg"
      >
        <ModalOverlay />
        <ModalContent maxW={{ base: "95%", md: "80%" }}>
          <ModalHeader>
            {type === "edit" ? "Edit Fluid Balance" : "Create Fluid Balance"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} mt={2}>

            <Text fontSize="md" fontWeight="bold" color="blue.blue500" mb={2}>
              Date / Time
            </Text>
            <FormControl mb={4}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={AiOutlineCalendar} color="gray.300" />
                </InputLeftElement>
                <Input
                  type="datetime-local"
                  name="datetime"
                  value={formData.datetime}
                  onChange={handleInputChange}
                  label="Date & Time"
                />
              </InputGroup>
            </FormControl>


            <Text fontSize="md" fontWeight="bold" color="blue.blue500" mb={2}>
              Fluid Intake
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {/* Intake Type */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={GiWaterDrop} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Intake Type"
                    type="text"
                    name="intaketype"
                    value={formData.intaketype}
                    onChange={handleInputChange}
                    placeholder="e.g., Oral, IV"
                  />
                </InputGroup>
              </FormControl>
              {/* Intake Route */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaSyringe} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Intake Route"
                    type="text"
                    name="intakeroute"
                    value={formData.intakeroute}
                    onChange={handleInputChange}
                    placeholder="e.g., PO, IV drip"
                  />
                </InputGroup>
              </FormControl>
              {/* Intake Amount */}
              
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaHashtag} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Intake Amount (ml)"
                    type="text"
                    name="intakeamount"
                    value={formData.intakeamount}
                    onChange={handleInputChange}
                    placeholder="Enter amount (ml)"
                  />
                </InputGroup>
              </FormControl>
            </SimpleGrid>

            <Divider my={4} />


            <Text fontSize="md" fontWeight="bold" color="blue.blue500" mb={2}>
              Fluid Output
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {/* Output Type */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={GiWaterDrop} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Output Type"
                    type="text"
                    name="outputtype"
                    value={formData.outputtype}
                    onChange={handleInputChange}
                    placeholder="e.g., Urine"
                  />
                </InputGroup>
              </FormControl>
              {/* Output Route */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaSyringe} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Output Route"
                    type="text"
                    name="outputroute"
                    value={formData.outputroute}
                    onChange={handleInputChange}
                    placeholder="e.g., Catheter"
                  />
                </InputGroup>
              </FormControl>
              {/* Output Amount */}
            
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaHashtag} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Output Amount (ml)"
                    type="text"
                    name="outputamount"
                    value={formData.outputamount}
                    onChange={handleInputChange}
                    placeholder="Enter amount (ml)"
                  />
                </InputGroup>
              </FormControl>
            </SimpleGrid>


            {/*
            -------- Old Intake fields (no longer in payload) --------
            - oralfluids
            - tubefeedingvolume
            - IVfluidtype / volume / rate
            - medication
            - totalintake
            -------- Old Output fields (no longer in payload) --------
            - urineoutput
            - stoolfrequency / stoolamount / consistency
            - vomitamount
            - drainage
            - totaloutput
            -------- Old Net Balance -------------------------------
            - netfliudbalancefor24hours
            ---------------------------------------------------------
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
