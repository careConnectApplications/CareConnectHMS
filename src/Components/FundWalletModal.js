import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Select,
  Text,
} from "@chakra-ui/react";
import Input from "./Input";
import { FundWalletApi } from "../Utils/ApiCalls";
import ShowToast from "./ToastNotification";

export default function FundWalletModal({ isOpen, onClose, patientId, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState({ show: false, message: "", status: "" });

  const handleFund = async () => {
    if (!amount || !paymentType) {
      setShowToast({ show: true, message: "Please enter amount and select payment mode", status: "error" });
      setTimeout(() => setShowToast({ show: false, message: "", status: "" }), 3000);
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        patientId,
        amount: Number(amount),
        paymentype: paymentType,
      };
      
      const res = await FundWalletApi(payload);
      if (res?.status === true || res?.success === true) {
        setShowToast({ show: true, message: "Wallet funded successfully", status: "success" });
        setTimeout(() => {
          setShowToast({ show: false, message: "", status: "" });
          onSuccess();
          onClose();
        }, 2000);
      } else {
        const errorMessage = res?.msg || res?.message || "Failed to fund wallet";
        setShowToast({ show: true, message: errorMessage, status: "error" });
        setTimeout(() => setShowToast({ show: false, message: "", status: "" }), 3000);
      }
    } catch (e) {
      setShowToast({ show: true, message: e.message || "Error funding wallet", status: "error" });
      setTimeout(() => setShowToast({ show: false, message: "", status: "" }), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showToast.show && <ShowToast message={showToast.message} status={showToast.status} />}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Fund Wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
            <Text mt="4" mb="2" fontSize="sm" fontWeight="500">Payment Mode</Text>
            <Select
              placeholder="Select payment mode"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
            >
              <option value="Cash">Cash</option>
              <option value="POS">POS</option>
              <option value="Transfer">Transfer</option>
              <option value="Bank Deposit">Bank Deposit</option>
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleFund} isLoading={isLoading}>
              Fund Wallet
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
