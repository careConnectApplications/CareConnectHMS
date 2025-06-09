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
  FormControl,
  Select,
  Input as ChakraInput,
  InputGroup,
  InputLeftElement,
  Icon,
} from "@chakra-ui/react";
import { AiOutlineClockCircle } from "react-icons/ai";
import Button from "./Button";
import Input from "./Input";
import ShowToast from "./ToastNotification";
import {
  CreateVitalSignScoresAPI,
  UpdateVitalSignScoresAPI,
  SettingsApi,
} from "../Utils/ApiCalls";

export default function SingleVitalScoreModal({
  isOpen,
  onClose,
  onSuccess,
  type = "create",        // "create" or "edit"
  initialData,
  chartId,
}) {
  const recordId =
    type === "edit" ? (initialData.id || initialData._id) : chartId;

  const [form, setForm] = useState({
    consciousness: "",
    ventilation: "",
    movement: "",
    total: "",
    bp: "",
    pulserate: "",
    respiration: "",
    color: "",
    temperature: "",
    time: "",
  });
  const [settings, setSettings] = useState({
    consciousness: [],
    ventilation: [],
    movement: [],
    colorvitalsignsscore: [],
    timevitalsignscore: [],
    score: [],
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToastFn = ({ status, message }) => {
    setToast({ status, message });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!isOpen) return;
    SettingsApi()
      .then((res) => {
        console.log("SettingsApi response:", res);
        setSettings({
          consciousness: res.consciousness,
          ventilation: res.ventilation,
          movement: res.movement,
          colorvitalsignsscore: res.colorvitalsignsscore,
          timevitalsignscore: res.timevitalsignscore,
          score: res.score,
        });
      })
      .catch((err) => {
        console.error("SettingsApi error:", err);
      });

    if (type === "edit" && initialData) {
      setForm({
        consciousness: initialData.consciousness || "",
        ventilation: initialData.ventilation || "",
        movement: initialData.movement || "",
        total: initialData.total || "",
        bp: initialData.bp || "",
        pulserate: initialData.pulserate || "",
        respiration: initialData.respiration || "",
        color: initialData.color || "",
        temperature: initialData.temperature || "",
        time: initialData.time || "",
      });
    } else {
      setForm({
        consciousness: "",
        ventilation: "",
        movement: "",
        total: "",
        bp: "",
        pulserate: "",
        respiration: "",
        color: "",
        temperature: "",
        time: "",
      });
    }
  }, [isOpen, type, initialData]);

  const handleChange = ({ target: { name, value } }) =>
    setForm((f) => ({ ...f, [name]: value }));

  const handleSubmit = async () => {
    if (Object.values(form).some((v) => !v)) {
      return showToastFn({ status: "error", message: "All fields required" });
    }
    setLoading(true);
    try {
      if (type === "edit") {
        await UpdateVitalSignScoresAPI(form, recordId);
        showToastFn({ status: "success", message: "Updated successfully" });
      } else {
        await CreateVitalSignScoresAPI(form, recordId);
        showToastFn({ status: "success", message: "Recorded successfully" });
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      showToastFn({ status: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const isComplete = Object.values(form).every((v) => v);

  return (
    <>
      {toast && <ShowToast status={toast.status} message={toast.message} />}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size="lg"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxH="80vh" overflowY="auto">
          <ModalHeader>
            {type === "edit" ? "Edit Vital Score" : "Add Vital Score"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid columns={1} md={2} gap={4}>
              {/* Consciousness */}
              <FormControl>
                <Select
                  name="consciousness"
                  placeholder="Consciousness"
                  value={form.consciousness}
                  onChange={handleChange}
                >
                  {settings.consciousness.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {/* Ventilation */}
              <FormControl>
                <Select
                  name="ventilation"
                  placeholder="Ventilation"
                  value={form.ventilation}
                  onChange={handleChange}
                >
                  {settings.ventilation.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {/* Movement */}
              <FormControl>
                <Select
                  name="movement"
                  placeholder="Movement"
                  value={form.movement}
                  onChange={handleChange}
                >
                  {settings.movement.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {/* Total (score) */}
              <FormControl>
                <Select
                  name="total"
                  placeholder="Total Score"
                  value={form.total}
                  onChange={handleChange}
                >
                  {settings.score.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {/* BP, Pulse, Respiration, Temperature */}
              {["bp", "pulserate", "respiration", "temperature"].map(
                (field) => (
                  <Input
                    key={field}
                    name={field}
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={form[field]}
                    onChange={handleChange}
                  />
                )
              )}

              {/* Color */}
              <FormControl>
                <Select
                  name="color"
                  placeholder="Color"
                  value={form.color}
                  onChange={handleChange}
                >
                  {settings.colorvitalsignsscore.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {/* Time */}
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={AiOutlineClockCircle} color="gray.300" />
                  </InputLeftElement>
                  <ChakraInput
                    name="time"
                    type="datetime-local"
                    value={form.time}
                    onChange={handleChange}
                  />
                </InputGroup>
              </FormControl>
            </SimpleGrid>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit} isLoading={loading} disabled={!isComplete}>
              {type === "edit" ? "Update" : "Submit"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
