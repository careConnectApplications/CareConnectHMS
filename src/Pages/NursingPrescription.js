import React, { useState, useEffect } from 'react';
import { Text, Flex, HStack, Box, useDisclosure } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, TableContainer, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import moment from "moment";
import TableRow from "../Components/TableRow";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../Components/Button";
import ExamineModal from "../Components/ExamineModal";
import LabRequestModal from "../Components/LabRequestModal";
import Input from "../Components/Input";
import ShowToast from "../Components/ToastNotification";
import { IoFilter } from "react-icons/io5";
import { HiOutlineDocumentArrowUp } from "react-icons/hi2";
import { BiSearch } from "react-icons/bi";
import { SlPlus } from "react-icons/sl";
import { GetSinglePatientHistoryApi, GetAllPatientPharmacyApi } from "../Utils/ApiCalls";
import Pagination from "../Components/Pagination";
import CreatePrescriptionModal from "../Components/CreatePrescriptionModal";
import { configuration } from '../Utils/Helpers';
import Preloader from "../Components/Preloader";

export default function NursingPrescription() {
  const [IsLoading, setIsLoading] = useState(true);
  const [All, setAll] = useState(true);
  const [Scheduled, setScheduled] = useState(false);
  const [Examined, setExamined] = useState(false);
  const [Completed, setCompleted] = useState(false);
  const [Data, setData] = useState([]);

  const [FilterData, setFilterData] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [Trigger, setTrigger] = useState(false);

  // Pagination settings
  const [CurrentPage, setCurrentPage] = useState(1);
  const [PostPerPage, setPostPerPage] = useState(configuration.sizePerPage);

  const indexOfLastSra = CurrentPage * PostPerPage;
  const indexOfFirstSra = indexOfLastSra - PostPerPage;
  const PaginatedData = FilterData.slice(indexOfFirstSra, indexOfLastSra);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Search filter settings
  const [SearchInput, setSearchInput] = useState("");
  const [FilteredData, setFilteredData] = useState(null);

  const filterBy = (title) => {
    if (title === "appointmentId") {
      let filter = Data.filter(item => item.appointmentid?.toLowerCase().includes(SearchInput.toLowerCase()));
      setFilteredData(filter);
    } else if (title === "appointmentCategory") {
      let filter = Data.filter(item => item.appointmentcategory?.toLowerCase().includes(SearchInput.toLowerCase()));
      setFilteredData(filter);
    } else if (title === "appointmentType") {
      let filter = Data.filter(
        item =>
          item.appointmenttype?.toLowerCase().includes(SearchInput.toLowerCase()) ||
          item.lastName?.toLowerCase().includes(SearchInput.toLowerCase())
      );
      setFilteredData(filter);
    }
  };

  let id = localStorage.getItem("patientId");

  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

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
    }, 5000);
  };

  const getAllPharmacy = async () => {
    setIsLoading(true);
    try {
      const result = await GetAllPatientPharmacyApi(id);
      console.log("getAllPharmacy", result);
      if (result.status === true) {
        setIsLoading(false);
        setData(result.queryresult.prescriptiondetails);
        setFilterData(result.queryresult.prescriptiondetails);
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  const filterAll = () => {
    setAll(true);
    setScheduled(false);
    setExamined(false);
    setCompleted(false);
    setFilterData(Data);
  };
  const filterScheduled = () => {
    setAll(false);
    setScheduled(true);
    setExamined(false);
    setCompleted(false);
    const filterData = Data.filter((item) => item.status === "scheduled");
    setFilterData(filterData);
  };

  const filterExamined = () => {
    setAll(false);
    setScheduled(false);
    setExamined(true);
    setCompleted(false);
    const filterData = Data.filter((item) => item.status === "examined");
    setFilterData(filterData);
  };
  const filterCompleted = () => {
    setAll(false);
    setScheduled(false);
    setExamined(false);
    setCompleted(true);
    const filterData = Data.filter((item) => item.status === "completed");
    setFilterData(filterData);
  };

  const { pathname } = useLocation();
  const nav = useNavigate();

  const handleTakeOrderClick = () => {
    onOpen();
  };

  useEffect(() => {
    getAllPharmacy();
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
      {showToast.show && <ShowToast message={showToast.message} status={showToast.status} />}
      {/* Filter section */}
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
                  onClick={() => {
                    setFilteredData(null);
                    setSearchInput("");
                  }}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
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
        {/*
        <Button rightIcon={<SlPlus />} w={["100%", "100%", "144px", "144px"]} onClick={handleTakeOrderClick}>
          Place Order
        </Button>
        */}
      </Flex>

      {/* Prescription History Table */}
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
          Prescription History
        </Text>
        <TableContainer>
          <Table variant="striped">
            <Thead bg="#fff">
              <Tr>
                <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                  Patient name
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                  Pharmacy
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                  Drug
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                  Prescriber Name
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                  Date
                </Th>
                <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                  Dispense Status
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {PaginatedData.map((item, i) => (
                <TableRow
                  key={i}
                  type="e-prescription"
                  name={`${item.patient?.firstName} ${item.patient?.lastName}`}
                  mrn={item.patient?.MRN}
                  pharmacy={item.pharmacy}
                  drug={item.prescription}
                  doctor={item.prescribersname}
                  date={moment(item.createdAt).format("lll")}
                  status={item.dispensestatus}
                />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      {/*
      <CreatePrescriptionModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={activateNotifications}
      />
      */}
      <Pagination postPerPage={PostPerPage} currentPage={CurrentPage} totalPosts={Data.length} paginate={paginate} />
    </Box>
  );
}
