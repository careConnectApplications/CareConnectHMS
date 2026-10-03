import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  HStack,
  Badge,
} from "@chakra-ui/react";
import moment from "moment";
import { getBedFeeRecordsApi } from "../Utils/ApiCalls";
import Preloader from "../Components/Preloader";

export default function BedFeeRecords({ id }) {
  const [data, setData] = useState([]);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getBedFeeRecordsApi(id);
        console.log("BedFee API result:", result);
        if (result?.status === true) {
          // API returns: { queryresult: { paymentdetails: [...], totalpaymentdetails: n }, totalPaid, totalPending }
          setData(result.queryresult?.paymentdetails || []);
          setTotalPaid(result.totalPaid || 0);
          setTotalPending(result.totalPending || 0);
        }
      } catch (error) {
        console.error("Failed to fetch bed fee records", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <Box bg="#fff" border="1px solid #EFEFEF" py="15px" px="15px" rounded="10px">
      {/* Summary row */}
      <HStack mb="12px" spacing="4">
        <Box bg="green.50" border="1px solid" borderColor="green.200" px="4" py="2" rounded="md">
          <Text fontSize="12px" color="green.600" fontWeight="500">Total Paid</Text>
          <Text fontSize="16px" color="green.700" fontWeight="bold">₦{Number(totalPaid).toLocaleString()}</Text>
        </Box>
        <Box bg="orange.50" border="1px solid" borderColor="orange.200" px="4" py="2" rounded="md">
          <Text fontSize="12px" color="orange.600" fontWeight="500">Total Pending</Text>
          <Text fontSize="16px" color="orange.700" fontWeight="bold">₦{Number(totalPending).toLocaleString()}</Text>
        </Box>
        <Box bg="blue.50" border="1px solid" borderColor="blue.200" px="4" py="2" rounded="md">
          <Text fontSize="12px" color="blue.600" fontWeight="500">Total Records</Text>
          <Text fontSize="16px" color="blue.700" fontWeight="bold">{data.length}</Text>
        </Box>
      </HStack>

      <TableContainer>
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Reference</Th>
              <Th>Category</Th>
              <Th>Payment Type</Th>
              <Th>Amount</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.length > 0 ? (
              data.map((item, i) => (
                <Tr key={i}>
                  <Td fontSize="12px">{moment(item.createdAt).format("lll")}</Td>
                  <Td fontSize="12px">{item.paymentreference || "-"}</Td>
                  <Td fontSize="12px">{item.paymentcategory || "Bed Fee"}</Td>
                  <Td fontSize="12px">{item.paymentype || "-"}</Td>
                  <Td fontSize="12px">₦{Number(item.amount).toLocaleString()}</Td>
                  <Td>
                    <Badge
                      colorScheme={item.status === "paid" ? "green" : "orange"}
                      fontSize="11px"
                    >
                      {item.status}
                    </Badge>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={6} textAlign="center">
                  <Text mt="4" color="gray.500">No bed fee records found</Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
