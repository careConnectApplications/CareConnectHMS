import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../Layouts/Index";
import { Text, Flex, HStack, Box, useDisclosure } from "@chakra-ui/react";
import TableRowX from "../Components/TableRowX";
import Button from "../Components/Button";
import ShowToast from "../Components/ToastNotification";
import Input from "../Components/Input";
import { CgSearch } from "react-icons/cg";
import { IoFilter } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
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
import CreatePatientModal from "../Components/CreatePatientModal";
import { GetAllPatientsApi, GetAllFilteredPatientsApi } from "../Utils/ApiCalls";
import moment from "moment";
import { HiOutlineDocumentArrowUp } from "react-icons/hi2";
import { BiSearch } from "react-icons/bi";
import { SlPlus } from "react-icons/sl";
import Pagination from "../Components/Pagination";
import { configuration } from "../Utils/Helpers";
import Preloader from "../Components/Preloader";
import { FaCalendarAlt } from "react-icons/fa";

export default function Patients() {
  const [All, setAll] = useState(true);
  const [Paid, setPaid] = useState(false);
  const [PendingPayment, setPendingPayment] = useState(false);
  const [Trigger, setTrigger] = useState(false);
  const [FilterData, setFilterData] = useState([]);
  const [TotalData, setTotalData] = useState("");
  const [Data, setData] = useState([]);
  const [ModalState, setModalState] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [FilterPatient, setFilterPatient] = useState({});
  const [isLoading, setIsLoading] = useState(true); //

  // Search Filter settings to follow
  const [SearchInput, setSearchInput] = useState("");
  const [FilteredData, setFilteredData] = useState(null);

  // filter by date
  const [ByDate, setByDate] = useState(false);
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");
  
  const [Key, setKey] = useState("");
  const [Value, setValue] = useState("");

  const getFilteredPatient = async (key, value) => {
    setKey(key)
    setValue(value)

    try {
      setIsLoading(true);
      const result = await GetAllFilteredPatientsApi(key,value,CurrentPage,PostPerPage);
      console.log("all fitlered patient", result);
      if (result.status === true) {
       setFilteredData(result.queryresult.patientdetails);
       setTotalData(result.queryresult.totalpatientdetails)
      }
    } catch (e) {
      console.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filterBy = (title) => {
    console.log("filter checking", title);

    if (title === "mrn") {
      getFilteredPatient("MRN", SearchInput)
    } else if (title === "email") {
      getFilteredPatient("email", SearchInput)
     
    } else if (title === "FirstName") {
      
      getFilteredPatient("firstName", SearchInput)   
      
    } else if (title === "LastName") {
      
      getFilteredPatient("lastName", SearchInput)
      
    } else if (title === "phoneNumber") {
      getFilteredPatient("phoneNumber", SearchInput)
    }else if (title === "hmoId") {
      getFilteredPatient("HMOId", SearchInput)
    } else if (title === "date") {
      // add 1 day to end date
      let endDate = new Date(EndDate);
      endDate.setDate(endDate.getDate() + 1);
      // format date back
      let formatedEndDate = endDate.toISOString().split("T")[0];
      let filter = Data.filter(
        (item) =>
          item.createdAt >= StartDate && item.createdAt <= formatedEndDate
      );
      setFilteredData(filter);
      setSearchInput("s");
    }
  };

  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

  // Pagination settings to follow
  const [CurrentPage, setCurrentPage] = useState(1);
  const [PostPerPage, setPostPerPage] = useState(configuration.sizePerPage);

  //get current post
  // const indexOfLastSra = CurrentPage * PostPerPage;
  // const indexOfFirstSra = indexOfLastSra - PostPerPage;
  // const PaginatedData = FilterData.slice(indexOfFirstSra, indexOfLastSra);
  //change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Pagination settings to follow end here

  const filterAll = () => {
    setAll(true);
    setPaid(false);
    setPendingPayment(false);

    setFilterData(Data);
  };

  const filterActive = () => {
    setAll(false);
    setPaid(true);
    setPendingPayment(false);
    const activePatients = Data.filter(
      (item) => item.status?.toLowerCase() === "active"
    );
    setFilterData(activePatients);
  };

  const filterInactive = () => {
    setAll(false);
    setPaid(false);
    setPendingPayment(true); 
    const inactivePatients = Data.filter(
      (item) => item.status?.toLowerCase() === "inactive"
    );
    setFilterData(inactivePatients);
  };

  const router = useNavigate();

  const getAllPatient = async () => {
    try {
      setIsLoading(true);
      const result = await GetAllPatientsApi(CurrentPage,PostPerPage);
      console.log("all patient", result);
      if (result.status === true) {
        setData(result.queryresult.patientdetails);
        setFilterData(result.queryresult.patientdetails);
        setTotalData(result.queryresult.totalpatientdetails)
      }
    } catch (e) {
      console.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onEdit = (id) => {
    const filteredpatient = Data.filter((patient) => patient._id === id);
    setFilterPatient(filteredpatient);
    setModalState("edit");
    onOpen();
  };

  const onView = (id) => {
    const filteredpatient = Data.filter((patient) => patient._id === id);
    setFilterPatient(filteredpatient);
    setModalState("view");
    onOpen();
  };

 

  const CreatePatient = () => {
    setModalState("new");
    onOpen();
  };

  const testing = () => {
    alert("hello");
  };

  useEffect(() => {
    if(FilteredData?.length > 0 || FilteredData !== null ){
      getFilteredPatient(Key,Value) 
    }else{

      getAllPatient();
    }
  }, [isOpen, Trigger,CurrentPage]);

  const navigateToPatientDetails = (id) => {
    router(`/dashboard/patient/${id}`);
  };

  if (isLoading) {
    return <Preloader />; // Show Preloader while data is loading
  }

  return (
    <MainLayout>
      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}
      <HStack>
        <Text color="#1F2937" fontWeight="600" fontSize="18px">
          Out Patients
        </Text>
        <Text color="#667085" fontWeight="400" fontSize="16px">
          ({TotalData.toLocaleString()})
        </Text>
      </HStack>
      <Text color="#686C75" mt="9px" fontWeight="400" fontSize="12px">
        Create, View and manage all Patients in one place. Quickly assign
        statuses, and update details as needed.
      </Text>
      <Box
        bg="#fff"
        border="1px solid #EFEFEF"
        mt="12px"
        py="17px"
        px={["18px", "18px"]}
        rounded="10px"
      >
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
                ({Data?.length.toLocaleString()})
                </Box>
              </Text>
            </Box>
            <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterActive}>
              <Text
                py="8.5px"
                px="12px"
                bg={Paid ? "#fff" : "transparent"}
                rounded="7px"
                color={"#1F2937"}
                fontWeight={"500"}
                fontSize={"13px"}
              >
                Active
              </Text>
            </Box>
            <Box
              borderRight="1px solid #EDEFF2"
              pr="5px"
              onClick={filterInactive}
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
                Inactive
              </Text>
            </Box>
          </Flex>

          <Flex
            flexWrap="wrap"
            mt={["10px", "10px", "0px", "0px"]}
            alignItems="center"
            justifyContent={"flex-end"}
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
                    onClick={() => filterBy("FirstName")}
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
                      <Text>by FirstName</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => filterBy("LastName")}
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
                      <Text>by LastName</Text>
                    </HStack>
                  </MenuItem>

                  <MenuItem
                    onClick={() => filterBy("mrn")}
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
                      <Text>by MRN</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => filterBy("phoneNumber")}
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
                      <Text>by Phone Number</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => filterBy("hmoId")}
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
                      <Text>by HMO ID</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => filterBy("email")}
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
                      <Text>by Email</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => setByDate(true)}
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
                      getAllPatient();
                      setCurrentPage(1)
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
            onClick={CreatePatient}
          >
            Add Patient
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
          <TableContainer>
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th fontSize="12px" fontWeight="600" color="#534D59">
                    Patient Name
                  </Th>
                  <Th fontSize="12px" fontWeight="600" color="#534D59">
                    MRN
                  </Th>
                  <Th fontSize="12px" fontWeight="600" color="#534D59">
                    Phone Number
                  </Th>
                  <Th fontSize="12px" fontWeight="600" color="#534D59">
                    Age
                  </Th>
                  <Th fontSize="12px" fontWeight="600" color="#534D59">
                    gender
                  </Th>
                  <Th fontSize="12px" fontWeight="600" color="#534D59">
                    HMO Cover
                  </Th>
                  <Th fontSize="12px" fontWeight="600" color="#534D59">
                    HMO ID
                  </Th>
                  <Th fontSize="12px" fontWeight="600" color="#534D59">
                    Status
                  </Th>
                  <Th fontSize="12px" fontWeight="600" color="#534D59">
                    Date Created
                  </Th>
                  <Th fontSize="12px" fontWeight="600" color="#534D59">
                    Actions
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {SearchInput === "" || FilteredData === null ? (
                  FilterData?.map((item, i) => (
                    <TableRowX
                      key={i}
                      type="patient-management"
                      name={`${item.firstName} ${item.lastName}`}
                      email={item.email}
                      mrn={item.MRN}
                      phone={item.phoneNumber}
                      age={item.age}
                      gender={item.gender}
                      status={item.status}
                      hmoStatus={item.isHMOCover}
                      hmoId={item.HMOId}
                      date={moment(item.createdAt).format("lll")}
                      onEdit={() => onEdit(item._id)}
                      onView={() => navigateToPatientDetails(item._id)}
                      OnClick={testing}
                    />
                  ))
                ) : SearchInput !== "" && FilteredData?.length > 0 ? (
                  FilteredData?.map((item, i) => (
                    <TableRowX
                      key={i}
                      type="patient-management"
                      name={`${item.firstName} ${item.lastName}`}
                      email={item.email}
                      mrn={item.MRN}
                      phone={item.phoneNumber}
                      age={item.age}
                      gender={item.gender}
                      status={item.status}
                      hmoStatus={item.isHMOCover}
                      hmoId={item.HMOId}
                      date={moment(item.createdAt).format("lll")}
                      onEdit={() => onEdit(item._id)}
                      onView={() => navigateToPatientDetails(item._id)}
                      OnClick={testing}
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

          <Pagination
            postPerPage={PostPerPage}
            currentPage={CurrentPage}
            totalPosts={TotalData}
            paginate={paginate}
          />
        </Box>
      </Box>
      <CreatePatientModal
        isOpen={isOpen}
        onClose={onClose}
        type={ModalState}
        filteredpatient={FilterPatient}
      />
    </MainLayout>
  );
}
