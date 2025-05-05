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
import { 
  FaCalendarAlt, 
  FaRulerVertical, 
  FaWeight, 
  FaTint 
} from "react-icons/fa";
import Button from "../Components/Button";
import Input from "../Components/Input";
import ShowToast from "./ToastNotification";
import {
  CreateNutritionApi,
  UpdateNutritionApi,
  SettingsApi,
} from "../Utils/ApiCalls";

export default function NutritionModal({
  isOpen,
  onClose,
  patientId,
  onSuccess,
  type = "create",
  initialData,
}) {
  const initialFormState = {
    date: "",
    ageinmonths: "",
    typeofvisit: "",
    infactandyoungchildfeeding: "",
    complementaryfeeding: "",
    counsellingprovided: "",
    referedtosupportgroup: "",
    anthropometryheight: "",
    anthropometryweight: "",
    anthropometrybilateraloedema: "",
    muacred: "",
    muacyellow: "",
    muacgreen: "",
    growthaccordingtothechildhealthcard: "",
    vitaminasupplement: "",
    deworming: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (t) => {
    setToast(t);
    setTimeout(() => setToast(null), 2000);
  };

  const handleInputChange = ({ target: { name, value } }) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  useEffect(() => {
    if (isOpen) {
      (async () => {
        try {
          const s = await SettingsApi();
          setSettings(s);
        } catch (e) {
          console.error("Error fetching nutrition settings:", e);
        }
      })();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (type === "edit" && initialData) {
        setFormData({
          date: initialData.date || "",
          ageinmonths: initialData.ageinmonths || "",
          typeofvisit: initialData.typeofvisit || "",
          infactandyoungchildfeeding: initialData.infactandyoungchildfeeding || "",
          complementaryfeeding: initialData.complementaryfeeding || "",
          counsellingprovided: initialData.counsellingprovided || "",
          referedtosupportgroup: initialData.referedtosupportgroup || "",
          anthropometryheight: initialData.anthropometryheight || "",
          anthropometryweight: initialData.anthropometryweight || "",
          anthropometrybilateraloedema: initialData.anthropometrybilateraloedema || "",
          muacred: initialData.muacred || "",
          muacyellow: initialData.muacyellow || "",
          muacgreen: initialData.muacgreen || "",
          growthaccordingtothechildhealthcard:
            initialData.growthaccordingtothechildhealthcard || "",
          vitaminasupplement: initialData.vitaminasupplement || "",
          deworming: initialData.deworming || "",
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
        await UpdateNutritionApi(formData, initialData._id || initialData.id);
      } else {
        await CreateNutritionApi(formData, patientId);
      }
      showToast({
        status: "success",
        message:
          type === "edit"
            ? "Nutrition record updated!"
            : "Nutrition record created!",
      });
      onSuccess?.(formData);
      onClose();
      setFormData(initialFormState);
    } catch (e) {
      showToast({
        status: "error",
        message: `Failed to ${
          type === "edit" ? "update" : "create"
        } nutrition: ${e.message}`,
      });
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
        <ModalContent maxW={{ base: "95%", md: "700px" }}>
          <ModalHeader>
            {type === "edit" ? "Edit Nutrition" : "Create Nutrition"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} mt={2}>
            <Box mb={4}>
              {/* TWO-COLUMN GRID */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {/* Date */}
                <FormControl>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaCalendarAlt} color="gray.500" />
                    </InputLeftElement>
                    <Input
                      type="date"
                      name="date"
                      label="Date"
                      value={formData.date}
                      onChange={handleInputChange}
                    />
                  </InputGroup>
                </FormControl>

                {/* Dropdown fields */}
                {[
                  { name: "ageinmonths", placeholder: "Age in months" },
                  { name: "typeofvisit", placeholder: "Type of visit" },
                  { name: "infactandyoungchildfeeding", placeholder: "Infant & young child feeding" },
                  { name: "complementaryfeeding", placeholder: "Complementary feeding" },
                  { name: "counsellingprovided", placeholder: "Counselling provided" },
                  { name: "referedtosupportgroup", placeholder: "Referred to support group" },
                  { name: "growthaccordingtothechildhealthcard", placeholder: "Growth per child health card" },
                  { name: "vitaminasupplement", placeholder: "Vitamin A supplement" },
                  { name: "deworming", placeholder: "Deworming" },
                ].map(({ name, placeholder }) => (
                  <FormControl key={name}>
                    <Select
                      placeholder={`Select ${placeholder}`}
                      name={name}
                      value={formData[name]}
                      onChange={handleInputChange}
                      borderWidth="2px"
                      borderColor="#6B7280"
                    >
                      {settings[name]?.map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                ))}

                {/* Anthropometry & MUAC */}
                <FormControl>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaRulerVertical} color="gray.500" />
                    </InputLeftElement>
                    <Input
                      type="text"
                      name="anthropometryheight"
                      label="Height"
                      value={formData.anthropometryheight}
                      onChange={handleInputChange}
                      placeholder="Enter height"
                    />
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaWeight} color="gray.500" />
                    </InputLeftElement>
                    <Input
                      type="text"
                      name="anthropometryweight"
                      label="Weight"
                      value={formData.anthropometryweight}
                      onChange={handleInputChange}
                      placeholder="Enter weight"
                    />
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaTint} color="gray.500" />
                    </InputLeftElement>
                    <Input
                      type="text"
                      name="anthropometrybilateraloedema"
                      label="Bilateral Oedema"
                      value={formData.anthropometrybilateraloedema}
                      onChange={handleInputChange}
                      placeholder="Enter oedema status"
                    />
                  </InputGroup>
                </FormControl>

                {/* MUAC colours */}
                {["muacred", "muacyellow", "muacgreen"].map((name) => (
                  <FormControl key={name}>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon as={FaTint} color="gray.500" />
                      </InputLeftElement>
                      <Input
                        type="text"
                        name={name}
                        label={name.replace(/muac/, "MUAC ")}
                        value={formData[name]}
                        onChange={handleInputChange}
                        placeholder={`Enter ${name.replace(/muac/, "")}`}
                      />
                    </InputGroup>
                  </FormControl>
                ))}
              </SimpleGrid>
            </Box>
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
