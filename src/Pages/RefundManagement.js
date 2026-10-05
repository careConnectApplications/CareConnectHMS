import React, { useEffect, useState } from "react";
import MainLayout from "../Layouts/Index";
import {
  Text,
  Flex,
  HStack,
  Box,
  Avatar,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Select,
} from "@chakra-ui/react";
import { BiSearch } from "react-icons/bi";
import { FaCalendarAlt } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { IoFilter } from "react-icons/io5";
import Input from "../Components/Input";
import Button from "../Components/Button";
import Preloader from "../Components/Preloader";
import ShowToast from "../Components/ToastNotification";
import Seo from "../Utils/Seo";
import { GetAllRefundsApi, ApproveRejectRefundApi } from "../Utils/ApiCalls";
import moment from "moment";

export default function RefundManagement() {
  const [activeTab, setActiveTab] = useState("pending"); // "pending" | "approved"
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // refundId being actioned
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showToast, setShowToast] = useState({ show: false, message: "", status: "" });

  const notify = (message, status) => {
    setShowToast({ show: true, message, status });
    setTimeout(() => setShowToast({ show: false, message: "", status: "" }), 4000);
  };

  const fetchRefunds = async (statusFilter) => {
    setIsLoading(true);
    try {
      const result = await GetAllRefundsApi(statusFilter, startDate, endDate);
      if (result?.status === true) {
        setData(result.queryresult || []);
      } else {
        setData([]);
      }
    } catch (e) {
      notify(e.message || "Failed to fetch refunds", "error");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (refundId, action) => {
    setActionLoading(refundId);
    try {
      const result = await ApproveRejectRefundApi(refundId, action);
      if (result?.status === true || result?.success === true) {
        notify(
          `Refund ${action === "approve" ? "approved" : "rejected"} successfully`,
          "success"
        );
        fetchRefunds(activeTab === "pending" ? "Pending" : "Approved");
      } else {
        notify(result?.msg || result?.message || "Action failed", "error");
      }
    } catch (e) {
      notify(e.message || "Action failed", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleFilter = () => {
    fetchRefunds(activeTab === "pending" ? "Pending" : "Approved");
  };

  const clearFilter = () => {
    setStartDate("");
    setEndDate("");
    fetchRefunds(activeTab === "pending" ? "Pending" : "Approved");
  };

  useEffect(() => {
    fetchRefunds(activeTab === "pending" ? "Pending" : "Approved");
  }, [activeTab]);

  const statusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === "approved") return "green";
    if (s === "rejected") return "red";
    return "orange";
  };

  return (
    <MainLayout>
      {isLoading && <Preloader />}
      <Seo title="Refund Management" description="Manage patient refund requests" />
      {showToast.show && <ShowToast message={showToast.message} status={showToast.status} />}

      {/* Page Header */}
      <HStack>
        <Text color="#1F2937" fontWeight="600" fontSize="19px">
          Refund Management
        </Text>
        <Text color="#667085" fontWeight="400" fontSize="18px">
          ({data.length})
        </Text>
      </HStack>
      <Text color="#686C75" mt="9px" fontWeight="400" fontSize="15px">
        View, approve, or reject patient wallet refund requests.
      </Text>

      {/* Tab Switcher */}
      <HStack mt="16px" mb="0" borderBottom="2px solid #EFEFEF" spacing="0">
        <Box
          onClick={() => setActiveTab("pending")}
          cursor="pointer"
          pb="10px"
          px="18px"
          borderBottom={activeTab === "pending" ? "2px solid #EA5937" : "2px solid transparent"}
          mb="-2px"
        >
          <Text
            fontWeight={activeTab === "pending" ? "600" : "400"}
            fontSize="14px"
            color={activeTab === "pending" ? "#EA5937" : "#667085"}
          >
            Refund Requests
          </Text>
        </Box>
        <Box
          onClick={() => setActiveTab("approved")}
          cursor="pointer"
          pb="10px"
          px="18px"
          borderBottom={activeTab === "approved" ? "2px solid #EA5937" : "2px solid transparent"}
          mb="-2px"
        >
          <Text
            fontWeight={activeTab === "approved" ? "600" : "400"}
            fontSize="14px"
            color={activeTab === "approved" ? "#EA5937" : "#667085"}
          >
            Approved Refunds
          </Text>
        </Box>
      </HStack>

      <Box
        bg="#fff"
        border="1px solid #EFEFEF"
        mt="12px"
        py="17px"
        px={["18px", "18px"]}
        rounded="10px"
      >
        {/* Date Filter */}
        <Flex justifyContent="flex-end" flexWrap="wrap" gap="8px" alignItems="flex-end">
          <Box>
            <Text fontSize="12px" fontWeight="500" color="#1F2937" mb="4px">
              Start Date
            </Text>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              bColor="#E4E4E4"
              leftIcon={<FaCalendarAlt />}
            />
          </Box>
          <Box>
            <Text fontSize="12px" fontWeight="500" color="#1F2937" mb="4px">
              End Date
            </Text>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              bColor="#E4E4E4"
              leftIcon={<FaCalendarAlt />}
            />
          </Box>
          <HStack>
            <Button
              background="#EA5937"
              border="1px solid #EA5937"
              color="#fff"
              onClick={handleFilter}
              w="100px"
            >
              Filter
            </Button>
            <Button
              background="#f8ddd1"
              border="1px solid #EA5937"
              color="blue.blue500"
              onClick={clearFilter}
              w="100px"
            >
              Clear
            </Button>
          </HStack>
        </Flex>

        {/* Table */}
        <Box mt="16px" overflowX="auto">
          <TableContainer>
            <Table variant="striped">
              <Thead bg="#fff">
                <Tr>
                  <Th fontSize="12px" textTransform="capitalize" color="#534D59" fontWeight="600">
                    S/N
                  </Th>
                  <Th fontSize="12px" textTransform="capitalize" color="#534D59" fontWeight="600">
                    Patient Name
                  </Th>
                  <Th fontSize="12px" textTransform="capitalize" color="#534D59" fontWeight="600">
                    MRN
                  </Th>
                  <Th fontSize="12px" textTransform="capitalize" color="#534D59" fontWeight="600">
                    Amount (&#8358;)
                  </Th>
                  <Th fontSize="12px" textTransform="capitalize" color="#534D59" fontWeight="600">
                    Reason
                  </Th>
                  <Th fontSize="12px" textTransform="capitalize" color="#534D59" fontWeight="600">
                    Status
                  </Th>
                  <Th fontSize="12px" textTransform="capitalize" color="#534D59" fontWeight="600">
                    Date Requested
                  </Th>
                  {activeTab === "pending" && (
                    <Th fontSize="12px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      Actions
                    </Th>
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {data.length === 0 && !isLoading && (
                  <Tr>
                    <Td colSpan={8} textAlign="center" color="#667085" py="32px">
                      No refund records found.
                    </Td>
                  </Tr>
                )}
                {data.map((item, i) => {
                  const patient = item.patient || item;
                  const patientName =
                    item.patientName ||
                    `${patient?.firstName || ""} ${patient?.lastName || ""}`.trim() ||
                    "—";
                  return (
                    <Tr key={i} cursor="default">
                      <Td fontSize="12px">{i + 1}</Td>
                      <Td fontSize="12px">
                        <HStack>
                          <Avatar name={patientName} size="xs" />
                          <Text fontWeight="500">{patientName}</Text>
                        </HStack>
                      </Td>
                      <Td fontSize="12px">{item.MRN || patient?.MRN || "—"}</Td>
                      <Td fontSize="12px" fontWeight="600" color="#027A48">
                        &#8358;{(item.amount || 0).toLocaleString()}
                      </Td>
                      <Td fontSize="12px" maxW="200px">
                        <Text noOfLines={2}>{item.reason || "—"}</Text>
                      </Td>
                      <Td fontSize="12px">
                        <Badge colorScheme={statusColor(item.status)} textTransform="capitalize">
                          {item.status || "Pending"}
                        </Badge>
                      </Td>
                      <Td fontSize="12px">
                        {item.createdAt ? moment(item.createdAt).format("lll") : "—"}
                      </Td>
                      {activeTab === "pending" && (
                        <Td fontSize="12px">
                          <Menu isLazy>
                            <MenuButton as={Box} cursor="pointer">
                              <Flex justifyContent="center" color="#000000" fontSize="16px">
                                <BsThreeDots />
                              </Flex>
                            </MenuButton>
                            <MenuList>
                              <MenuItem
                                onClick={() => handleAction(item._id, "approve")}
                                fontWeight="500"
                                color="#027A48"
                                isDisabled={actionLoading === item._id}
                                _hover={{ color: "#fff", bg: "#027A48" }}
                              >
                                <Text fontSize="13px">
                                  {actionLoading === item._id ? "Processing..." : "Approve"}
                                </Text>
                              </MenuItem>
                              <MenuItem
                                onClick={() => handleAction(item._id, "reject")}
                                fontWeight="500"
                                color="#FD4739"
                                isDisabled={actionLoading === item._id}
                                _hover={{ color: "#fff", bg: "#FD4739" }}
                              >
                                <Text fontSize="13px">
                                  {actionLoading === item._id ? "Processing..." : "Reject"}
                                </Text>
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </Td>
                      )}
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </MainLayout>
  );
}
