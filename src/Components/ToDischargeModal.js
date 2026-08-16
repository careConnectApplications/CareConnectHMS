import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  Select,
} from "@chakra-ui/react";
import Button from "./Button";
import { UpdateAdmissionStatusAPI } from "../Utils/ApiCalls";

export default function ToDischargeModal({
  isOpen,
  onClose,
  activateNotifications,
  oldPayload,
  setTrigger,
  Trigger,
}) {
  const [Loading, setLoading] = useState(false);
  const [Payload, setPayload] = useState({
    dischargereason: "",
    status: "todischarge",
  });

  const handlePayload = (e) => {
    setPayload({ ...Payload, [e.target.id]: e.target.value });
  };

  const handleStatusUpdate = async () => {
    if (!Payload.dischargereason) {
      activateNotifications("Please select a discharge reason", "error");
      return;
    }

    setLoading(true);
    try {
      const admissionId = oldPayload?.id || oldPayload?._id;
      const result = await UpdateAdmissionStatusAPI(
        {
          status: "todischarge",
          dischargereason: Payload.dischargereason,
        },
        admissionId
      );

      if (result.status === 200 || result.status === true) {
        activateNotifications(
          "Admission Status Updated To Discharge Successfully",
          "success"
        );
        if (setTrigger) {
          setTrigger(!Trigger);
        }
        onClose();
      }
    } catch (e) {
      activateNotifications(e.message || "An error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setPayload({ dischargereason: "", status: "todischarge" });
    }
  }, [isOpen]);

  const dischargeReasons = [
    "Abscond",
    "Discharge",
    "Referral",
    "Leave Against Medical Advice",
    "Death",
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Discharge Patient</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing="15px">
            <Select
              id="dischargereason"
              value={Payload.dischargereason}
              onChange={handlePayload}
              placeholder="Select Discharge Reason"
              border="2px solid"
              fontSize={Payload.dischargereason !== "" ? "16px" : "13px"}
              borderColor="gray.500"
            >
              {dischargeReasons.map((reason, i) => (
                <option key={i} value={reason}>
                  {reason}
                </option>
              ))}
            </Select>
          </Stack>
          <Button
            mt="32px"
            isLoading={Loading}
            onClick={handleStatusUpdate}
            isDisabled={!Payload.dischargereason}
          >
            Discharge Patient
          </Button>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
