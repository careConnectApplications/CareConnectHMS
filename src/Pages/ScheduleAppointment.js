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
import TableRowY from "../Components/TableRowY";
import Button from "../Components/Button";
import Input from "../Components/Input";
import ShowToast from "../Components/ToastNotification";
import { BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import { SlPlus } from "react-icons/sl";
import CreateAppointmentModal from "../Components/CreateAppointmentModal";
import moment from "moment";
import Seo from "../Utils/Seo";
import { GetAllSchedulesApi, GetAllFilteredScheduledApi } from "../Utils/ApiCalls";
import { configuration } from "../Utils/Helpers";
import Pagination from "../Components/Pagination";
import Preloader from "../Components/Preloader";
import { FaCalendarAlt } from "react-icons/fa";

export default function ScheduleAppointment() {
  const [IsLoading, setIsLoading] = useState(true);
  const [All, setAll] = useState(true);
  const [Approved, setScheduled] = useState(false);
  const [Pending, setPending] = useState(false);
  const [Trigger, setTrigger] = useState(false);
  const [Data, setData] = useState([]);
  const [FilterData, setFilterData] = useState([]);
  const [ModalState, setModalState] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [FilterAppointment, setFilterAppointment] = useState({});
  const [selectedAppointmentData, setSelectedAppointmentData] = useState(null);

  // filter by date
  const [ByDate, setByDate] = useState(false);
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");

  // Pagination settings to follow
  const [CurrentPage, setCurrentPage] = useState(1);
  const [PostPerPage, setPostPerPage] = useState(configuration.sizePerPage);
  const [TotalData, setTotalData] = useState("");


  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [SearchInput, setSearchInput] = useState("");
  const [FilteredData, setFilteredData] = useState(null);

  const [Key, setKey] = useState("");
  const [Value, setValue] = useState("");


  const getFilteredScheduled = async (key, value) => {
    setKey(key)
    setValue(value)

    try {
      setIsLoading(true);
      const result = await GetAllFilteredScheduledApi(key, value, CurrentPage, PostPerPage);
      console.log("all fitlered scheduled", result);
      if (result.status === true) {
        setFilteredData(result.queryresult.appointmentdetails);
        setTotalData(result.queryresult.totalappointentdetails)
      }
    } catch (e) {
      console.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filterBy = (title) => {
    if (title === "mrn") {
      getFilteredScheduled("MRN", SearchInput)
    } else if (title === "appointment") {
      getFilteredScheduled("appointmentcategory", SearchInput)

    } else if (title === "firstName") {

      getFilteredScheduled("firstName", SearchInput)

    } else if (title === "lastName") {

      getFilteredScheduled("lastName", SearchInput)

    } else if (title === "type") {

      getFilteredScheduled("appointmenttype", SearchInput)
    } else if (title === "date") {
      // add 1 day to end date
      let endDate = new Date(EndDate);
      endDate.setDate(endDate.getDate() + 1);
      // format date back
      let formatedEndDate = endDate.toISOString().split("T")[0];
      let filter = Data.filter(
        (item) =>
          item.appointmentdate >= StartDate &&
          item.appointmentdate <= formatedEndDate
      );
      setFilteredData(filter);
      setSearchInput("s");
      console.log("filterdate", filter);
    }
  };

  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

  const router = useNavigate();

  const getSchedules = async () => {
    setIsLoading(true);
    try {
      let response = await GetAllSchedulesApi(CurrentPage, PostPerPage);

      console.log("response", response)
      if (response.status === true) {
        setIsLoading(false);
        setData(response.queryresult.appointmentdetails);
        setFilterData(response.queryresult.appointmentdetails);
        setTotalData(response.queryresult.totalappointentdetails);
      }
    } catch (e) { }
  };



  const filterAll = () => {
    setAll(true);
    setScheduled(false);
    setPending(false);
    setFilterData(Data);
  };

  const filterScheduled = () => {
    setAll(false);
    setScheduled(true);
    setPending(false);
    const filterData = Data.filter((item) => item.status === "scheduled");
    setFilterData(filterData);
  };

  const filterPending = () => {
    setAll(false);
    setScheduled(false);
    setPending(true);
    const filterData = Data.filter((item) => item.status === "pending payment");
    setFilterData(filterData);
  };

  const onEdit = (id) => {
    const appointment = Data.find((item) => item._id === id);
    if (appointment) {
      setSelectedAppointmentData({
        appointmentdate: appointment.appointmentdate,
        reason: appointment.reason,
        appointmentcategory: appointment.appointmentcategory,
        appointmenttype: appointment.appointmenttype,
        patient: appointment.patient._id,
        clinic: appointment.clinic,
        id: appointment._id, // Pass the ID for editing
      });
      setModalState("edit");
      onOpen();
    }
  };

  const CreateAppointment = () => {
    setSelectedAppointmentData(null);
    setModalState("new");
    onOpen();
  };

  useEffect(() => {
    if (FilteredData?.length > 0 || FilteredData !== null) {
      getFilteredScheduled(Key, Value)
    } else {


      getSchedules();
    }
  }, [Trigger, isOpen, CurrentPage]);
  return (
    <MainLayout>
      {IsLoading && <Preloader />}
      <Seo title="Schedule Appointment" description="Manage Appointments" />

      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}
      <HStack>
        <Text color="#1F2937" fontWeight="600" fontSize="19px">
          Scheduled Appointments
        </Text>
        <Text color="#667085" fontWeight="400" fontSize="18px">
          ({TotalData})
        </Text>
      </HStack>
      <Text color="#686C75" mt="9px" fontWeight="400" fontSize="15px">
        View and manage all appointments in one place. Quickly access statuses,
        update details, and manage schedules as needed.
      </Text>

      <Box
        bg="#fff"
        border="1px solid #EFEFEF"
        mt="12px"
        py="17px"
        px={["18px", "18px"]}
        rounded="10px"
      >
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
            <Box borderRight="1px solid #EDEFF2" pr="5px" >
              <Text
                py="8.5px"
                px="12px"
                bg={All ? "#fff" : "transparent"}
                rounded="7px"
                color={"#1F2937"}
                fontWeight={"500"}
                fontSize={"13px"}
              >
                All
                <Box color="#667085" as="span" fontWeight="400" fontSize="13px">
                  ({TotalData})
                </Box>
              </Text>
            </Box>
            {/* <Box
              borderRight="1px solid #EDEFF2"
              pr="5px"
              onClick={filterScheduled}
            >
              <Text
                py="8.5px"
                px="12px"
                bg={Approved ? "#fff" : "transparent"}
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
              onClick={filterPending}
            >
              <Text
                py="8.5px"
                px="12px"
                bg={Pending ? "#fff" : "transparent"}
                rounded="7px"
                color={"#1F2937"}
                fontWeight={"500"}
                fontSize={"13px"}
              >
                Pending
              </Text>
            </Box> */}
          </Flex>

          <Flex
            flexWrap="wrap"
            mt="10px"
            alignItems="center"
            justifyContent={"flex-end"}
          >
            <HStack>
              {ByDate === false ? (
                <Input
                  label="Search"
                  onChange={(e) => {
                    setSearchInput(e.target.value)
                    setCurrentPage(1)
                  }
                  }
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
                    onClick={() => filterBy("appointment")}
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
                      <Text>by Appointment</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => filterBy("firstName")}
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
                      <Text>by First Name</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => filterBy("lastName")}
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
                      <Text>by Last Name</Text>
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
                    onClick={() => filterBy("type")}
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
                      <Text>by Type</Text>
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
                      getSchedules();
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
            onClick={CreateAppointment}
            px="95px"
          >
            Add Appointment
          </Button>
        </Flex>

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
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    Date
                  </Th>
                 
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    Appointment
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    Type
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    Patient
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    MRN
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    Clinic
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    Status
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    Actions
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {SearchInput === "" || FilteredData === null ? (
                  FilterData?.map((item, i) => (
                    <TableRowY
                      key={i}
                      type="schedule-appointment"
                      date={moment(item.appointmentdate).format("lll")}
                      reason={item.reason}
                      appointment={item.appointmentcategory}
                      appointmentType={item.appointmenttype}
                      patient={`${item.firstName} ${item.lastName}`}
                      mrn={item.MRN}
                      clinic={item.clinic}
                      status={item.status}
                      onEdit={() => onEdit(item._id)}
                    />
                  ))
                ) : SearchInput !== "" && FilteredData?.length > 0 ? (
                  FilteredData?.map((item, i) => (
                    <TableRowY
                      key={i}
                      type="schedule-appointment"
                      date={moment(item.appointmentdate).format("lll")}
                      reason={item.reason}
                      appointment={item.appointmentcategory}
                      appointmentType={item.appointmenttype}
                      patient={`${item.firstName} ${item.lastName}`}
                      mrn={item.MRN}
                      clinic={item.clinic}
                      status={item.status}
                      onEdit={() => onEdit(item._id)}
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
      {/* Modals */}
      <CreateAppointmentModal
        isOpen={isOpen}
        onClose={onClose}
        type={ModalState}
        initialData={selectedAppointmentData}
      />
    </MainLayout>
  );
}
