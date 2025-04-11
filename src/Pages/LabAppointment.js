import React, { useState, useEffect } from "react";
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
import { IoFilter } from "react-icons/io5";
import { BiSearch } from "react-icons/bi";
import { SlPlus } from "react-icons/sl";
import { GetAllSingleLabHistoryApi } from "../Utils/ApiCalls";
import Pagination from "../Components/Pagination";
import LabRequestModal from "../Components/LabRequestModal";
import { configuration } from "../Utils/Helpers";
import Preloader from "../Components/Preloader";

export default function LabAppointment() {
  const [IsLoading, setIsLoading] = useState(true);
  const [OpenLabModal, setOpenLabModal] = useState(false);
  const [All, setAll] = useState(true);
  const [PendingPayment, setPendingPayment] = useState(false);
  const [Scheduled, setScheduled] = useState(false);
  const [Processed, setProcessed] = useState(false);
  const [Data, setData] = useState([]);

  const [FilterData, setFilterData] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [Trigger, setTrigger] = useState(false);

  // Pagination settings to follow
  const [CurrentPage, setCurrentPage] = useState(1);
  const [PostPerPage, setPostPerPage] = useState(configuration.sizePerPage);

  //get current post
  const indexOfLastSra = CurrentPage * PostPerPage;
  const indexOfFirstSra = indexOfLastSra - PostPerPage;
  const PaginatedData = FilterData.slice(indexOfFirstSra, indexOfLastSra);
  //change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Pagination settings to follow end here

  // Search Filter settings to follow
  const [SearchInput, setSearchInput] = useState("");

  const [FilteredData, setFilteredData] = useState(null);

  const filterBy = (title) => {
    if (title === "appointmentId") {
      let filter = Data.filter((item) =>
        item.appointmentid?.toLowerCase().includes(SearchInput.toLowerCase())
      );
      setFilteredData(filter);
    } else if (title === "testName") {
      let filter = Data.filter((item) =>
        item.testname?.toLowerCase().includes(SearchInput.toLowerCase())
      );
      setFilteredData(filter);
    } else if (title === "testId") {
      let filter = Data.filter(
        (item) =>
          item.testid?.toLowerCase().includes(SearchInput.toLowerCase()) ||
          item.lastName?.toLowerCase().includes(SearchInput.toLowerCase())
      );
      setFilteredData(filter);
    }
  };

  // Search Filter settings to follow end here

  let id = localStorage.getItem("patientId");

  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

  const getAllLabHistory = async () => {
    setIsLoading(true);
    try {
      const result = await GetAllSingleLabHistoryApi(id);

      console.log("getAllLabHistory", result);
      setIsLoading(false);
      setData(result.queryresult.labdetails);
      setFilterData(result.queryresult.labdetails);
    } catch (e) {
      activateNotifications(e.message, "error");
    }
  };

  const activateNotifications = (message, status) => {
    setShowToast({
      show: true,
      message: message,
      status: status,
    });

    setTimeout(() => {
      setShowToast({
        show: false,
      });
    }, 3000);
  };

  const filterAll = () => {
    setAll(true);
    setPendingPayment(false);
    setScheduled(false);
    setProcessed(false);

    setFilterData(Data);
  };
  const filterPendingPayment = () => {
    setAll(false);
    setPendingPayment(true);
    setScheduled(false);
    setProcessed(false);

    const filterData = Data.filter((item) => item.status === "pending payment");

    setFilterData(filterData);
  };

  const filterScheduled = () => {
    setAll(false);
    setPendingPayment(false);
    setScheduled(true);
    setProcessed(false);

    const filterData = Data.filter((item) => item.status === "scheduled");

    setFilterData(filterData);
  };
  const filterProcessed = () => {
    setAll(false);
    setPendingPayment(false);
    setScheduled(false);
    setProcessed(true);

    const filterData = Data.filter((item) => item.status === "processed");

    setFilterData(filterData);
  };

  useEffect(() => {
    getAllLabHistory();
  }, [isOpen, Trigger]);

  return (
    <Box
      bg="#fff"
      border="1px solid #EFEFEF"
      mt="10px"
      py="17px"
      px={["18px", "18px"]}
      rounded="10px"
    >
      {IsLoading && <Preloader />}

      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}
      {/* filter section  */}
      <Flex justifyContent="space-between" flexWrap="wrap">
        <Flex
          alignItems="center"
          flexWrap="wrap"
          bg="#E4F3FF"
          rounded="7px"
          py="3.5px"
          px="5px"
          cursor="pointer"
          mt={["10px", "10px", "0px", "0px"]}
        >
          <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterAll}>
            <Text
              py="8.5px"
              px="12px"
              bg={All ? "#fff" : "transparent"}
              rounded="7px"
              color={"#1F2937"}
              fontWeight={"500"}
              fontSize={"13px"}
            >
              All{" "}
              <Box color="#667085" as="span" fontWeight="400" fontSize="13px">
                ({Data?.length})
              </Box>
            </Text>
          </Box>
          <Box
            borderRight="1px solid #EDEFF2"
            pr="5px"
            onClick={filterPendingPayment}
          >
            <Text
              py="8.5px"
              px="12px"
              bg={PendingPayment ? "#fff" : "transparent"}
              rounded="7px"
              color={"#1F2937"}
              fontWeight={"500"}
              fontSize={"13px"}
            >
              Pending Payment
            </Text>
          </Box>
          <Box
            borderRight="1px solid #EDEFF2"
            pr="5px"
            onClick={filterScheduled}
          >
            <Text
              py="8.5px"
              px="12px"
              bg={Scheduled ? "#fff" : "transparent"}
              rounded="7px"
              color={"#1F2937"}
              fontWeight={"500"}
              fontSize={"13px"}
            >
              Scheduled
            </Text>
          </Box>
          <Box
            borderRight="1px solid #EDEFF2"
            pr="5px"
            onClick={filterProcessed}
          >
            <Text
              py="8.5px"
              px="12px"
              bg={Processed ? "#fff" : "transparent"}
              rounded="7px"
              color={"#1F2937"}
              fontWeight={"500"}
              fontSize={"13px"}
            >
              Processed
            </Text>
          </Box>
        </Flex>

        <Flex
          flexWrap="wrap"
          mt={["10px", "10px", "0px", "0px"]}
          alignItems="center"
          justifyContent={"flex-end"}
        >
          <HStack>
            <Input
              label="Search"
              onChange={(e) => setSearchInput(e.target.value)}
              value={SearchInput}
              bColor="#E4E4E4"
              leftIcon={<BiSearch />}
            />

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
                  onClick={() => filterBy("appointmentId")}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  <HStack fontSize="14px">
                    <Text>by Appointment ID</Text>
                  </HStack>
                </MenuItem>
                <MenuItem
                  onClick={() => filterBy("testName")}
                  textTransform="capitalize"
                  fontWeight={"500"}
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
                  onClick={() => filterBy("testId")}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  <HStack fontSize="14px">
                    <Text>by Test ID</Text>
                  </HStack>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setFilteredData(null);
                    setSearchInput("");
                  }}
                  textTransform="capitalize"
                  fontWeight={"500"}
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
          onClick={() => setOpenLabModal(true)}
        >
          Place Order
        </Button>
      </Flex>

      {/* filter section end here */}

      <Box
        bg="#fff"
        border="1px solid #EFEFEF"
        mt="12px"
        py="15px"
        px="15px"
        rounded="10px"
        overflowX="auto"
      >
        <Text mb="20px" fontWeight="700" fontSize="16px" color="blue.blue500">
          Lab History
        </Text>
        <TableContainer>
          <Table variant="striped">
            <Thead bg="#fff">
              <Tr>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Department
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Appointment ID
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Test name
                </Th>

                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  test ID
                </Th>

                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  payment status
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Lab status
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {SearchInput === "" || FilteredData === null ? (
                PaginatedData.map((item, i) => (
                  <TableRow
                    key={i}
                    type={"lab-history"}
                    dept={item.department}
                    appointmentId={item.appointmentid}
                    testName={item.testname}
                    testId={item.testid}
                    status={item.payment?.status}
                    labStatus={item.status}
                  />
                ))
              ) : SearchInput !== "" && FilteredData?.length > 0 ? (
                FilteredData.map((item, i) => (
                  <TableRow
                    key={i}
                    type={"lab-history"}
                    dept={item.department}
                    appointmentId={item.appointmentid}
                    testName={item.testname}
                    testId={item.testid}
                    status={item.payment?.status}
                    labStatus={item.status}
                  />
                ))
              ) : (
                <Text textAlign={"center"} mt="32px" color="black">
                  *--No record found--*
                </Text>
              )}
            </Tbody>
          </Table>
        </TableContainer>

        <LabRequestModal
          isOpen={OpenLabModal}
          oldPayload={{ _id: id, appointmentid: id }}
          onClose={() => setOpenLabModal(false)}
          activateNotifications={activateNotifications}
          onSuccess={getAllLabHistory}
        />

        <Pagination
          postPerPage={PostPerPage}
          currentPage={CurrentPage}
          totalPosts={Data.length}
          paginate={paginate}
        />
      </Box>
    </Box>
  );
}
