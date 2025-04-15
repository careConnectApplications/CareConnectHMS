import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Text,
  Flex,
  Box,
  Stack,
  FormControl,
  FormLabel,
  Textarea,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import Button from "../Components/Button";
import Input from "../Components/Input";
import {
  ReadPharmacyByOrderId,
  ConfirmPharmacyGroupOrder,
  GetPriceOfDrugApi,
  DispenseApi,
} from "../Utils/ApiCalls";
import TableRowY from "../Components/TableRowY";
import moment from "moment";

export default function PharmacyOrderModal({
  isOpen,
  onClose,
  orderId,
  onConfirm,   // Kept unchanged to avoid removing user’s existing props
  onDispense,  // Kept unchanged to avoid removing user’s existing props
  onSuccess,   // <-- New prop to handle toast from the parent
}) {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmationData, setConfirmationData] = useState({});
  const [prices, setPrices] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const quantityRef = useRef(null);

  // Fetch order details when the modal opens
  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const data = await ReadPharmacyByOrderId(orderId);
      // Expected response: { queryresult: { prescriptiondetails: [ ... ] } }
      setOrderDetails(data.queryresult);
    } catch (error) {
      console.error("Error fetching order details:", error);
      // Use parent's toast
      onSuccess("Error fetching order details", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderDetails();
      // Reset confirmation data when modal opens
      setConfirmationData({});
      setPrices({});
    }
  }, [isOpen, orderId]);

  // Initialize confirmationData for each prescription detail
  useEffect(() => {
    if (orderDetails && orderDetails.prescriptiondetails) {
      const initialData = {};
      orderDetails.prescriptiondetails.forEach((detail) => {
        initialData[detail._id] = {
          showForm: false,
          option: "", // "accept" or "reject"
          remark: "",
          qty: "",
        };
      });
      setConfirmationData(initialData);
    }
  }, [orderDetails]);

  // For each prescription detail, fetch its price using its id
  useEffect(() => {
    if (orderDetails && orderDetails.prescriptiondetails) {
      const fetchPrices = async () => {
        const newPrices = {};
        await Promise.all(
          orderDetails.prescriptiondetails.map(async (detail) => {
            try {
              const res = await GetPriceOfDrugApi(detail._id);
              newPrices[detail._id] = res.price;
            } catch (err) {
              console.error(`Error fetching price for ${detail._id}:`, err.message);
              newPrices[detail._id] = "Error";
            }
          })
        );
        setPrices(newPrices);
      };
      fetchPrices();
    }
  }, [orderDetails]);

  // When a row's confirmation form is toggled to "accept", scroll the quantity input into view
  useEffect(() => {
    Object.keys(confirmationData).forEach((id) => {
      if (
        confirmationData[id].showForm &&
        confirmationData[id].option === "accept" &&
        quantityRef.current
      ) {
        quantityRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }, [confirmationData]);

  // Toggle confirmation form for a given prescription detail
  const toggleConfirmForm = (id) => {
    setConfirmationData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        showForm: !prev[id].showForm,
      },
    }));
  };

  // Handle changes in confirmation form inputs for a given detail
  const handleConfirmationChange = (id, field, value) => {
    setConfirmationData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  // Dispense functionality updated to use onSuccess
  const handleDispensePrescription = async (prescriptionId) => {
    try {
      const response = await DispenseApi(prescriptionId);
      console.log("Dispensed successfully:", response);
      // Show success message
      onSuccess(response?.msg || "Prescription dispensed successfully!", "success");
      // Refresh the order details
      fetchOrderDetails();
    } catch (error) {
      console.error("Error dispensing prescription:", error);
      onSuccess(
        error?.response?.data?.msg || "Failed to dispense prescription",
        "error"
      );
    }
  };

  // Submit the confirmation for all rows that have the confirmation form open
  const handleSubmit = async () => {
    if (!orderDetails || !orderDetails.prescriptiondetails) return;

    let pharmacyrequest;
    try {
      pharmacyrequest = orderDetails.prescriptiondetails
        .filter((detail) => confirmationData[detail._id]?.showForm && confirmationData[detail._id].option)
        .map((detail) => {
          const conf = confirmationData[detail._id];
          if (conf.option === "accept" && (!conf.qty || Number(conf.qty) <= 0)) {
            onSuccess("Quantity must be greater than 0 for accepted orders.", "error");
            throw new Error("Invalid quantity");
          }
          return {
            option: conf.option === "accept",
            remark: conf.remark.trim(),
            qty: conf.option === "accept" ? Number(conf.qty) : "",
            id: detail._id,
          };
        });
    } catch (error) {
      return;
    }
    if (pharmacyrequest.length === 0) {
      onSuccess("No orders selected for confirmation.", "error");
      return;
    }
    setSubmitLoading(true);
    try {
      const payload = { pharmacyrequest };
      await ConfirmPharmacyGroupOrder(payload);
      onSuccess("Group order confirmed successfully!", "success");
      onClose();
    } catch (error) {
      onSuccess(`Failed to confirm group order: ${error.message}`, "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Check if any confirmation form is open
  const isAnyConfirmationOpen = !!orderDetails?.prescriptiondetails?.some(
    (detail) => confirmationData[detail._id]?.showForm
  );

  // Compute the grand total for accepted orders
  const grandTotal =
    orderDetails && orderDetails.prescriptiondetails
      ? orderDetails.prescriptiondetails.reduce((sum, detail) => {
          const conf = confirmationData[detail._id];
          const price = Number(prices[detail._id]);
          const qty = Number(conf?.qty);
          if (conf?.option === "accept" && qty > 0 && !isNaN(price)) {
            return sum + price * qty;
          }
          return sum;
        }, 0)
      : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent maxW={{ base: "90%", md: "80%" }} maxH="80vh" overflowY="auto">
        <ModalHeader>Pharmacy Order Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <Text>Loading order details...</Text>
          ) : orderDetails ? (
            <>
              <TableContainer>
                <Table variant="striped">
                  <Thead>
                    <Tr>
                      <Th>Patient</Th>
                      <Th>MRN</Th>
                      <Th>Prescription</Th>
                      <Th>Frequency</Th>
                      <Th>Dosage</Th>
                      <Th>Duration</Th>
                      <Th>Quantity</Th>
                      <Th>Amount</Th>
                      <Th>Prescriber</Th>
                      <Th>Created Date</Th>
                      <Th>Payment Status</Th>
                      <Th>Dispense Status</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {orderDetails.prescriptiondetails.map((detail) => (
                      <TableRowY
                        key={detail._id}
                        type="pharmacy-order"
                        patient={`${detail.patient?.firstName || ""} ${detail.patient?.lastName || ""}`}
                        email={detail.patient?.email}
                        mrn={detail.patient?.MRN}
                        prescription={detail.prescription}
                        frequency={detail.frequency}
                        dosage={detail.dosage}
                        duration={detail.duration}
                        quantity={detail.payment?.qty || "N/A"}
                        amount={detail.payment?.amount || "N/A"}
                        prescribersName={detail.prescribersname}
                        createdDate={detail.createdAt}
                        paymentStatus={detail.payment ? detail.payment.status : "N/A"}
                        dispensestatus={detail.dispensestatus}
                        onConfirm={() => toggleConfirmForm(detail._id)}
                        onDispense={() => handleDispensePrescription(detail._id)}
                      />
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
              {/* Render confirmation form for each row that is toggled */}
              {orderDetails.prescriptiondetails.map((detail) =>
                confirmationData[detail._id]?.showForm ? (
                  <Box key={detail._id} borderWidth="1px" borderRadius="md" p={3} mt={4}>
                    <Text fontWeight="bold" mb={2}>
                      Confirm Order for Prescription: {detail.prescription}
                    </Text>
                    <Text mb={2}>
                      Price:{" "}
                      {prices[detail._id] !== undefined ? prices[detail._id] : "Loading..."}
                    </Text>
                    <Stack spacing={3}>
                      <FormControl>
                        <FormLabel>Order Option</FormLabel>
                        <RadioGroup
                          onChange={(val) => handleConfirmationChange(detail._id, "option", val)}
                          value={confirmationData[detail._id].option}
                        >
                          <Stack direction="row" spacing={3}>
                            <Radio value="accept">Accept Order</Radio>
                            <Radio value="reject">Reject Order</Radio>
                          </Stack>
                        </RadioGroup>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Remark</FormLabel>
                        <Textarea
                          value={confirmationData[detail._id].remark}
                          onChange={(e) =>
                            handleConfirmationChange(detail._id, "remark", e.target.value)
                          }
                          placeholder="Enter remark (optional)"
                          resize="vertical"
                        />
                      </FormControl>
                      {confirmationData[detail._id].option === "accept" && (
                        <>
                          <FormControl ref={quantityRef}>
                            <Input
                              label="Quantity"
                              type="number"
                              value={confirmationData[detail._id].qty}
                              onChange={(e) =>
                                handleConfirmationChange(detail._id, "qty", e.target.value)
                              }
                              placeholder="Enter quantity"
                            />
                          </FormControl>
                          {/* Display individual total for this prescription */}
                          {confirmationData[detail._id].qty &&
                            !isNaN(Number(prices[detail._id])) && (
                              <Text mt={2}>
                                Total:{" "}
                                {(
                                  Number(prices[detail._id]) *
                                  Number(confirmationData[detail._id].qty)
                                ).toFixed(2)}
                              </Text>
                            )}
                        </>
                      )}
                    </Stack>
                  </Box>
                ) : null
              )}
              {/* Display grand total for all accepted orders */}
              {grandTotal > 0 && (
                <Box mt={4} p={2} borderWidth="1px" borderRadius="md">
                  <Text fontWeight="bold">Grand Total: {grandTotal.toFixed(2)}</Text>
                </Box>
              )}
            </>
          ) : (
            <Text>No order details found.</Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Flex w="100%" justify="flex-end">
            {isAnyConfirmationOpen && (
              <Button onClick={handleSubmit} isLoading={submitLoading}>
                Submit
              </Button>
            )}
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
