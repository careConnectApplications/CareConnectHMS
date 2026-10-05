import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Box,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
} from "@chakra-ui/react";
import { GetWalletTransactionsApi } from "../Utils/ApiCalls";
import moment from "moment";

export default function WalletTransactionsModal({ isOpen, onClose, patientId, patientName }) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTransactions = async () => {
    if (!patientId) return;
    setIsLoading(true);
    setError("");
    setTransactions([]);
    try {
      const result = await GetWalletTransactionsApi(patientId);
      // Support the API body directly as well as an Axios-style { data } wrapper.
      const responseBody = result?.data ?? result;
      const queryresult = responseBody?.queryresult;
      const paymentdetails = Array.isArray(queryresult)
        ? queryresult
        : queryresult?.paymentdetails ?? responseBody?.paymentdetails;
      setTransactions(Array.isArray(paymentdetails) ? paymentdetails : []);
    } catch (e) {
      setError(e.message || "Failed to fetch wallet transactions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && patientId) {
      fetchTransactions();
    }
  }, [isOpen, patientId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent maxW={{ base: "95%", md: "75%" }} maxH="85vh" overflowY="auto">
        <ModalHeader>
          <Text fontSize="17px" fontWeight="700" color="#1F2937">
            Wallet Transactions
          </Text>
          {patientName && (
            <Text fontSize="13px" fontWeight="400" color="#667085" mt="2px">
              Patient: {patientName}
            </Text>
          )}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading && (
            <Text textAlign="center" color="#667085" py="24px">
              Loading transactions...
            </Text>
          )}
          {error && (
            <Text textAlign="center" color="red.500" py="24px">
              {error}
            </Text>
          )}
          {!isLoading && !error && transactions.length === 0 && (
            <Text textAlign="center" color="#667085" py="24px">
              No wallet transactions found for this patient.
            </Text>
          )}
          {!isLoading && !error && transactions.length > 0 && (
            <TableContainer>
              <Table variant="striped" size="sm">
                <Thead bg="#fff">
                  <Tr>
                    <Th fontSize="12px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      S/N
                    </Th>
                    <Th fontSize="12px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      Type
                    </Th>
                    <Th fontSize="12px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      Amount (&#8358;)
                    </Th>
                    <Th fontSize="12px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      Description
                    </Th>
                    <Th fontSize="12px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      Date
                    </Th>
                    <Th fontSize="12px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      Status
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {transactions.map((item, i) => (
                    <Tr key={i}>
                      <Td fontSize="12px">{i + 1}</Td>
                      <Td fontSize="12px">
                        <Badge
                          colorScheme={
                            item.paymentcategory === "Wallet Funding" ||
                            item.type === "credit" ||
                            item.transactionType === "credit"
                              ? "green"
                              : item.useWallet
                                ? "red"
                                : "gray"
                          }
                          textTransform="capitalize"
                        >
                          {item.paymentcategory === "Wallet Funding"
                            ? "Credit"
                            : item.useWallet
                              ? "Wallet debit"
                              : item.type || item.transactionType || "Payment"}
                        </Badge>
                      </Td>
                      <Td fontSize="12px" fontWeight="500">
                        {Number(item.amount || 0).toLocaleString()}
                      </Td>
                      <Td fontSize="12px">
                        {item.description ||
                          item.note ||
                          [item.paymentcategory, item.paymentype]
                            .filter(Boolean)
                            .join(" — ") ||
                          item.paymentreference ||
                          "—"}
                      </Td>
                      <Td fontSize="12px">
                        {(item.confirmationdate || item.createdAt)
                          ? moment(item.confirmationdate || item.createdAt).format("lll")
                          : "—"}
                      </Td>
                      <Td fontSize="12px">
                        <Badge
                          colorScheme={item.status === "paid" ? "green" : item.status === "pending payment" ? "orange" : "gray"}
                          textTransform="capitalize"
                        >
                          {item.status || "—"}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
