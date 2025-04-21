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
  Select,
} from "@chakra-ui/react";
import Button from "../Components/Button";
import Input from "../Components/Input";
import ShowToast from "./ToastNotification";
import {
  CreateMedicationChartApi,
  UpdateMedicalChartApi,
  SettingsApi,
} from "../Utils/ApiCalls";
import { FaPills, FaSyringe } from "react-icons/fa";
import { MdNote } from "react-icons/md";

/**
 * Props
 * -----
 * isOpen, onClose        : chakra modal controls
 * admissionId            : optional; auto‑detected otherwise
 * onSuccess              : callback after backend success
 * type                   : "create" | "edit"
 * initialData            : for edit mode
 * selectedDrug           : prefill text
 * selectedPrescriptionId : row _id (needed for payload/parent refresh)
 */
export default function MedicalChartModal({
  isOpen,
  onClose,
  admissionId,
  onSuccess,
  type = "create",
  initialData,
  selectedDrug = "",
  selectedPrescriptionId = "",
}) {
  
  let storedAdmission = localStorage.getItem("inPatient");
  let finalAdmissionId = admissionId;
  if (!finalAdmissionId && storedAdmission) {
    try {
      const patient = JSON.parse(storedAdmission);
      if (Array.isArray(patient?.admission)) {
        finalAdmissionId = patient.admission[0];
      } else {
        finalAdmissionId = localStorage.getItem("admissionId");
      }
    } catch {
      finalAdmissionId = localStorage.getItem("admissionId");
    }
  }


  const blank = { drug: "", note: "", dose: "", frequency: "", route: "" };
  const [formData, setFormData]   = useState(blank);
  const [loading, setLoading]     = useState(false);
  const [toast, setToast]         = useState(null);
  const [settings, setSettings]   = useState({});

  const showToast = (t) => {
    setToast(t);
    setTimeout(() => setToast(null), 2500);
  };

  const handleInputChange = ({ target }) =>
    setFormData((p) => ({ ...p, [target.name]: target.value }));

 
  const handleSubmit = async () => {
    const payload = { ...formData, prescription: selectedPrescriptionId };
    const required = ["drug", "dose", "frequency", "route", "prescription"];
    if (required.some((k) => !payload[k])) {
      showToast({ status: "error", message: "All required fields must be filled" });
      return;
    }

    setLoading(true);
    try {
      let res;
      if (type === "edit") {
        res = await UpdateMedicalChartApi(payload, initialData.id);
      } else {
        res = await CreateMedicationChartApi(payload, finalAdmissionId);
      }

 
      const saved =
        res?.queryresult?.medicationchartdetails ??
        res?.data?.medicationchart ??
        null;

      const medication = saved
        ? {
            id: saved._id,
            drug: saved.drug,
            note: saved.note,
            dose: saved.dose,
            frequency: saved.frequency,
            route: saved.route,
            createdBy: saved.createdBy ?? saved.staffname ?? "Unknown",
            createdOn: new Date(saved.createdAt).toISOString().split("T")[0],
          }
        : {
            id: type === "edit" ? initialData.id : Date.now().toString(),
            drug: formData.drug,
            note: formData.note,
            dose: formData.dose,
            frequency: formData.frequency,
            route: formData.route,
            createdBy: "You",
            createdOn: new Date().toISOString().split("T")[0],
          };

      onSuccess?.({
        message: res?.message || "Medical chart saved!",
        status : res?.status  ? "success" : "error",
        prescriptionId: selectedPrescriptionId,
        servedstatus  : "served",
        medication,                  
      });

      onClose();
      setFormData(blank);
    } catch (err) {
      showToast({ status: "error", message: err.message || "Request failed" });
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const cfg = await SettingsApi();
        setSettings(cfg);
      } catch (err) {
        console.error("Settings load error:", err);
      }
    })();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (type === "edit" && initialData) {
      setFormData({
        drug     : initialData.drug ?? "",
        note     : initialData.note ?? "",
        dose     : initialData.dose ?? "",
        frequency: initialData.frequency ?? "",
        route    : initialData.route ?? "",
      });
    } else {
      setFormData({ ...blank, drug: selectedDrug });
    }
  }, [isOpen, type, initialData, selectedDrug]);

  
  const canSubmit =
    ["drug", "dose", "frequency", "route"].every((k) => formData[k]) &&
    selectedPrescriptionId;


  return (
    <>
      {toast && <ShowToast status={toast.status} message={toast.message} />}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent maxW={{ base: "95%", md: "60%" }}>
          <ModalHeader>
            {type === "edit" ? "Edit Medical Chart" : "Create Medical Chart"}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {/* Drug */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaPills} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Drug"
                    name="drug"
                    value={formData.drug}
                    onChange={handleInputChange}
                    placeholder="Enter drug name"
                  />
                </InputGroup>
              </FormControl>

              {/* Note */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={MdNote} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Note (optional)"
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    placeholder="Enter note"
                  />
                </InputGroup>
              </FormControl>

              {/* Dose */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaSyringe} color="gray.300" />
                  </InputLeftElement>
                  <Input
                    label="Dose"
                    name="dose"
                    value={formData.dose}
                    onChange={handleInputChange}
                    placeholder="Enter dose"
                  />
                </InputGroup>
              </FormControl>

              {/* Frequency */}
              <FormControl>
                <Select
                  placeholder="Select Frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleInputChange}
                  borderWidth="2px"
                  borderColor="#6B7280"
                >
                  {settings?.medicationchartfrequency?.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </Select>
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
                  {settings?.medicationchartroute?.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </SimpleGrid>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              disabled={!canSubmit || loading}
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
