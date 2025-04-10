import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../Layouts/Index";
import { Text, Flex, HStack, Box, useDisclosure } from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import TableRow from "../Components/TableRow";
import Input from "../Components/Input";
import Button from "../Components/Button";
import ShowToast from "../Components/ToastNotification";
import { BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import moment from "moment";
import Seo from "../Utils/Seo";
import CreateTestOrderModal from "../Components/CreateTestOrderModal";
import RequestLabOtherModal from "../Components/RequestLabOtherModal";
import ConfirmLabOrderModal from "../Components/ConfirmLabOrderModal";
import { GetAllScheduledLabApi } from "../Utils/ApiCalls";
import Pagination from "../Components/Pagination";
import { configuration } from "../Utils/Helpers";
import Preloader from "../Components/Preloader";
import { SlPlus } from "react-icons/sl";
import { FaCalendarAlt } from "react-icons/fa";

export default function LabProcessing() {
  const [IsLoading, setIsLoading] = useState(true);
  const [Data, setData] = useState([]);
  const [QueueData, setQueueData] = useState([]);
  // FilterData holds the current items after filtering by search, status, etc.
  const [FilterData, setFilterData] = useState([]);
  const [ModalState, setModalState] = useState("");
  const [OpenOrderModal, setOpenOrderModal] = useState(false);
  const [OldPayload, setOldPayload] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Used to trigger refresh when a new order is created
  const [Trigger, setTrigger] = useState(false);

  // New disclosure for ConfirmLabOrderModal
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = useDisclosure();

  const [ByDate, setByDate] = useState(false);
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");

  // Pagination settings
  const [CurrentPage, setCurrentPage] = useState(1);
  const [PostPerPage, setPostPerPage] = useState(configuration.sizePerPage);
  const indexOfLastSra = CurrentPage * PostPerPage;
  const indexOfFirstSra = indexOfLastSra - PostPerPage;
  const PaginatedData = FilterData.slice(indexOfFirstSra, indexOfLastSra);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Search Filter settings
  const [SearchInput, setSearchInput] = useState("");
  const [FilteredData, setFilteredData] = useState(null);

  const filterBy = (title) => {
    if (title === "mrn") {
      let filter = Data.filter((item) =>
        item.patient.MRN?.toLowerCase().includes(SearchInput.toLowerCase())
      );
      setFilteredData(filter);
    } else if (title === "name") {
      let filter = Data.filter(
        (item) =>
          item.patient.firstName
            ?.toLowerCase()
            .includes(SearchInput.toLowerCase()) ||
          item.patient.lastName
            ?.toLowerCase()
            .includes(SearchInput.toLowerCase())
      );
      setFilteredData(filter);
    } else if (title === "testName") {
      let filter = Data.filter((item) =>
        item.testname?.toLowerCase().includes(SearchInput.toLowerCase())
      );
      setFilteredData(filter);
    } else if (title === "date") {
      let endDateObj = new Date(EndDate);
      endDateObj.setDate(endDateObj.getDate() + 1);
      let formatedEndDate = endDateObj.toISOString().split("T")[0];
      let filter = Data.filter(
        (item) =>
          item.createdAt >= StartDate && item.createdAt <= formatedEndDate
      );
      setFilteredData(filter);
      setSearchInput("s");
      console.log("Date filter checking", filter);
    }
  };

  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

  const RequestOrder = () => {
    setOpenOrderModal(true);
  };

  const nav = useNavigate();

  // New status filter state
  const [currentStatusFilter, setCurrentStatusFilter] = useState("all");

  const filterByStatus = (status) => {
    setCurrentStatusFilter(status);
    if (status === "all") {
      setFilterData(Data);
    } else {
      const filtered = Data.filter(
        (item) => item.status?.toLowerCase() === status.toLowerCase()
      );
      setFilterData(filtered);
    }
    setCurrentPage(1);
  };

  // Default filter: show all items
  const filterAll = () => {
    setCurrentStatusFilter("all");
    setFilterData(Data);
  };

  const filterTodayQueue = () => {
    // If you have a separate QueueData filtering logic, use that.
    setCurrentStatusFilter("queue");
    setFilterData(QueueData);
  };

  const getAllScheduledLab = async () => {
    setIsLoading(true);
    try {
      const result = await GetAllScheduledLabApi();
      console.log("getAllScheduledLab", result);
      if (result.status === true) {
        setIsLoading(false);
        setData(result.queryresult.labdetails);
        setFilterData(result.queryresult.labdetails);
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  const activateNotifications = (message, status) => {
    setShowToast({
      show: true,
      message: message,
      status: status,
    });
    setTimeout(() => {
      setShowToast({ show: false });
    }, 3000);
  };

  // ProcessLab is used for non-confirmation actions
  const ProcessLab = (item) => {
    setOldPayload(item);
    onOpen();
  };

  // confirmLab opens the ConfirmLabOrderModal for items with "awaiting confirmation" status.
  const confirmLab = (item) => {
    console.log("confirmLab called with item:", item);
    setOldPayload(item);
    onConfirmOpen();
  };

  // Re-fetch lab orders whenever a modal closes or after a new order is created.
  useEffect(() => {
    getAllScheduledLab();
  }, [isOpen, Trigger]);

  return (
    <MainLayout>
      {IsLoading && <Preloader />}
      <Seo
        title="Lab Processing"
        description="Care connect Manage Lab Processing"
      />

      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}
      <HStack>
        <Text color="#1F2937" fontWeight="600" fontSize="19px">
          Lab Processing
        </Text>
        <Text color="#667085" fontWeight="400" fontSize="18px">
          ({Data?.length})
        </Text>
      </HStack>
      <Text color="#686C75" mt="9px" fontWeight="400" fontSize="15px">
        Create a new test order for a patient.
      </Text>
      <Box
        bg="#fff"
        border="1px solid #EFEFEF"
        mt="12px"
        py={["10px", "15px"]}
        px={["10px", "15px"]}
        rounded="10px"
      >
        <Flex justifyContent="space-between" flexWrap="wrap">
          {/* Status Filter Section */}
          <Flex
            display="inline-flex"
            w="auto"
            alignItems="center"
            flexWrap="wrap"
            bg="#E4F3FF"
            rounded="7px"
            py="3.5px"
            px="5px"
            cursor="pointer"
            mt={["10px", "10px", "0px", "0px"]}
          >
            <Box
              borderRight="1px solid #EDEFF2"
              pr="5px"
              onClick={() => filterByStatus("all")}
            >
              <Text
                py="8.5px"
                px="12px"
                bg={currentStatusFilter === "all" ? "#fff" : "transparent"}
                rounded="7px"
                color="#1F2937"
                fontWeight="500"
                fontSize="13px"
              >
                All 
              </Text>
            </Box>
            <Box
              borderRight="1px solid #EDEFF2"
              pr="5px"
              ml="5px"
              onClick={() => filterByStatus("awaiting confirmation")}
            >
              <Text
                py="8.5px"
                px="12px"
                bg={
                  currentStatusFilter === "awaiting confirmation"
                    ? "#fff"
                    : "transparent"
                }
                rounded="7px"
                color="#1F2937"
                fontWeight="500"
                fontSize="13px"
              >
                Awaiting Confirmation 
              </Text>
            </Box>
            <Box
              borderRight="1px solid #EDEFF2"
              pr="5px"
              ml="5px"
              onClick={() => filterByStatus("complete")}
            >
              <Text
                py="8.5px"
                px="12px"
                bg={currentStatusFilter === "complete" ? "#fff" : "transparent"}
                rounded="7px"
                color="#1F2937"
                fontWeight="500"
                fontSize="13px"
              >
                Complete 
              </Text>
            </Box>
            <Box ml="5px" onClick={() => filterByStatus("scheduled")}>
              <Text
                py="8.5px"
                px="12px"
                bg={currentStatusFilter === "scheduled" ? "#fff" : "transparent"}
                rounded="7px"
                color="#1F2937"
                fontWeight="500"
                fontSize="13px"
              >
                Scheduled 
              </Text>
            </Box>
          </Flex>

          {/* Additional Filter Section (Search & Date Filter) */}
          <Flex
            justifyContent="space-between"
            flexWrap="wrap"
            mt={["10px", "10px", "0px", "0px"]}
          >
            <HStack flexWrap={["wrap", "nowrap"]}>
              {ByDate === false ? (
                <Input
                  label="Search"
                  onChange={(e) => setSearchInput(e.target.value)}
                  value={SearchInput}
                  bColor="#E4E4E4"
                  leftIcon={<BiSearch />}
                />
              ) : (
                <HStack flexWrap={["wrap", "nowrap"]}>
                  <Input
                    label="Start Date"
                    type="date"
                    onChange={(e) => setStartDate(e.target.value)}
                    value={StartDate}
                    bColor="#E4E4E4"
                    leftIcon={<FaCalendarAlt />}
                  />
                  <Input
                    label="End Date"
                    type="date"
                    onChange={(e) => setEndDate(e.target.value)}
                    value={EndDate}
                    bColor="#E4E4E4"
                    leftIcon={<FaCalendarAlt />}
                  />
                  <Flex
                    onClick={() => filterBy("date")}
                    cursor="pointer"
                    px="5px"
                    py="3px"
                    rounded="5px"
                    bg="blue.blue500"
                    color="#fff"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <BiSearch />
                  </Flex>
                </HStack>
              )}
              <Menu isLazy>
                <MenuButton as={Box}>
                  <HStack
                    border="1px solid #EA5937"
                    rounded="7px"
                    cursor="pointer"
                    py="11.64px"
                    px="16.98px"
                    bg="#f8ddd1"
                    color="blue.blue500"
                    fontWeight="500"
                    fontSize="14px"
                  >
                    <Text>Filter</Text>
                    <IoFilter />
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() => filterBy("name")}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>by Patient Name</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => filterBy("mrn")}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>by MRN</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => filterBy("testName")}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>by Test Name</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => setByDate(true)}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>by date</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setFilteredData(null);
                      setSearchInput("");
                      setByDate(false);
                      setStartDate("");
                      setEndDate("");
                    }}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>clear filter</Text>
                    </HStack>
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>

          <Flex
            justifyContent="space-between"
            flexWrap="wrap"
            mt={["10px", "10px", "10px", "10px"]}
            w={["100%", "100%", "50%", "37%"]}
          >
            <Button
              rightIcon={<SlPlus />}
              w={["100%", "100%", "144px", "144px"]}
              onClick={RequestOrder}
            >
              Request Order
            </Button>
          </Flex>
        </Flex>
      </Box>

      {/* Data Table */}
      <Box
        bg="#fff"
        border="1px solid #EFEFEF"
        mt="12px"
        py="15px"
        px="15px"
        rounded="10px"
        overflowX="auto"
      >
        <TableContainer>
          <Table variant="striped">
            <Thead bg="#fff">
              <Tr>
              <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                 Test ID
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                  Patient name
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                  Department
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                  Test Name
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                  Order Date
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                  Lab Status
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {SearchInput === "" || FilteredData === null ? (
                PaginatedData?.map((item, i) => (
                  <TableRow
                    key={i}
                    type="lab-processing"
                    testid={item.testid}
                    name={`${item.patient?.firstName} ${item.patient?.lastName}`}
                    mrn={item.patient?.MRN}
                    department={item.department}
                    testName={item.testname}
                    date={moment(item.createdAt).format("lll")}
                    labStatus={item.status}
                    onConfirmClick={() => {
                      console.log("Confirm action triggered for item:", item);
                      confirmLab(item);
                    }}
                    onClick={() => {
                      if (
                        item.status?.trim().toLowerCase() === "awaiting confirmation"
                      ) {
                        console.log("Confirm action triggered for item:", item);
                        confirmLab(item);
                      } else {
                        ProcessLab(item);
                      }
                    }}
                  />
                ))
              ) : SearchInput !== "" && FilteredData?.length > 0 ? (
                FilteredData?.map((item, i) => (
                  <TableRow
                    key={i}
                    type="lab-processing"
                    name={`${item.patient?.firstName} ${item.patient?.lastName}`}
                    mrn={item.patient?.MRN}
                    testName={item.testname}
                    date={moment(item.createdAt).format("lll")}
                    labStatus={item.status}
                    onConfirmClick={() => {
                      console.log("Confirm action triggered for item:", item);
                      confirmLab(item);
                    }}
                    onClick={() => {
                      if (
                        item.status?.trim().toLowerCase() === "awaiting confirmation"
                      ) {
                        console.log("Confirm action triggered for item:", item);
                        confirmLab(item);
                      } else {
                        ProcessLab(item);
                      }
                    }}
                  />
                ))
              ) : (
                <Text textAlign="center" mt="32px" color="black">
                  *--No record found--*
                </Text>
              )}
            </Tbody>
          </Table>
        </TableContainer>
        <Pagination
          postPerPage={PostPerPage}
          currentPage={CurrentPage}
          totalPosts={Data.length}
          paginate={paginate}
        />
      </Box>

      {/* Modals */}
      <CreateTestOrderModal
        isOpen={isOpen}
        oldPayload={OldPayload}
        onClose={onClose}
        type={ModalState}
        activateNotifications={activateNotifications}
      />
      <RequestLabOtherModal
        isOpen={OpenOrderModal}
        oldPayload={OldPayload}
        onClose={() => setOpenOrderModal(false)}
        activateNotifications={activateNotifications}
        onSuccess={() => setTrigger((prev) => !prev)}
      />
      <ConfirmLabOrderModal
        isOpen={isConfirmOpen}
        labOrderId={OldPayload?._id}
        onClose={onConfirmClose}
        onSuccess={() => setTrigger((prev) => !prev)}
      />
    </MainLayout>
  );
}
