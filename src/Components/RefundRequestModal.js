import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Textarea,
  Button,
  HStack,
  Box,
} from "@chakra-ui/react";
import Input from "./Input";
import { RequestRefundApi } from "../Utils/ApiCalls";
import ShowToast from "./ToastNotification";

export default function RefundRequestModal({ isOpen, onClose, patient, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState({ show: false, message: "", status: "" });

  const notify = (message, status) => {
    setShowToast({ show: true, message, status });
    setTimeout(() => setShowToast({ show: false, message: "", status: "" }), 3500);
  };

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) {
      notify("Please enter a valid refund amount", "error");
      return;
    }
    if (!reason.trim()) {
      notify("Please provide a reason for the refund", "error");
      return;
    }
    if (Number(amount) > (patient?.walletBalance || 0)) {
      notify("Refund amount cannot exceed wallet balance", "error");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        _id: patient?._id,
        amount: Number(amount),
        reason: reason.trim(),
      };
      const result = await RequestRefundApi(payload);
      if (result?.status === true || result?.success === true) {
        notify("Refund request submitted successfully", "success");
        setTimeout(() => {
          setAmount("");
          setReason("");
          onClose();
          if (onSuccess) onSuccess();
        }, 1500);
      } else {
        notify(result?.msg || result?.message || "Failed to submit refund request", "error");
      }
    } catch (e) {
      notify(e.message || "Error submitting refund request", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setAmount("");
    setReason("");
    onClose();
  };

  return (
    <>
      {showToast.show && <ShowToast message={showToast.message} status={showToast.status} />}
      <Modal isOpen={isOpen} onClose={handleClose} isCentered size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text fontSize="17px" fontWeight="700" color="#1F2937">
              Refund Request
            </Text>
            {patient && (
              <Text fontSize="13px" fontWeight="400" color="#667085" mt="2px">
                Patient: {patient.firstName} {patient.lastName}
              </Text>
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              bg="#f0f9ff"
              border="1px solid #bae6fd"
              rounded="8px"
              px="14px"
              py="10px"
              mb="16px"
            >
              <Text fontSize="13px" color="#0369a1" fontWeight="500">
                Wallet Balance: &#8358;{(patient?.walletBalance || 0).toLocaleString()}
              </Text>
            </Box>

            <Input
              label="Refund Amount (&#8358;)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount to refund"
              bColor="#E4E4E4"
            />

            <Box mt="14px">
              <Text fontSize="13px" fontWeight="500" color="#1F2937" mb="6px">
                Reason for Refund
              </Text>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for refund request..."
                borderColor="#E4E4E4"
                _hover={{ borderColor: "#EA5937" }}
                _focus={{ borderColor: "#EA5937", boxShadow: "none" }}
                fontSize="14px"
                rows={3}
              />
            </Box>
          </ModalBody>
          <ModalFooter>
            <HStack spacing="3">
              <Button variant="ghost" onClick={handleClose} isDisabled={isLoading}>
                Cancel
              </Button>
              <Button
                bg="#EA5937"
                color="#fff"
                _hover={{ bg: "#c94520" }}
                onClick={handleSubmit}
                isLoading={isLoading}
                loadingText="Submitting..."
              >
                Submit Request
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
