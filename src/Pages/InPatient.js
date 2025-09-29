import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  SimpleGrid,
  Select,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import TableRow from "../Components/TableRow";
import Button from "../Components/Button";
import Input from "../Components/Input";
import VitalsModal from "../Components/VitalsModal";
import ShowToast from "../Components/ToastNotification";
import { BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import { SlPlus } from "react-icons/sl";
import CreateAppointmentModal from "../Components/CreateAppointmentModal";
import moment from "moment";
import Seo from "../Utils/Seo";

import {
  GetAllAdmittedApi,
  GetAllWardApi,
  GetOnlyClinicApi,
} from "../Utils/ApiCalls";
import Pagination from "../Components/Pagination";
import { configuration } from "../Utils/Helpers";
import Preloader from "../Components/Preloader";

export default function InPatient() {
  const [IsLoading, setIsLoading] = useState(false);
  const [Ward, setWard] = useState([]);
  const [All, setAll] = useState(true);
  const [Admitted, setAdmitted] = useState(false);
  const [ToAdmit, setToAdmit] = useState(false);
  const [Clinic, setClinic] = useState("");
  const [WardData, setWardData] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [Trigger, setTrigger] = useState(false);
  const [OldPayload, setOldPayload] = useState({});

  const [Data, setData] = useState([]);
  const [QueueData, setQueueData] = useState([]);

  const [FilterData, setFilterData] = useState(Data);
  const [ModalState, setModalState] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
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
    } else if (title === "appointmentType") {
      let filter = Data.filter((item) =>
        item.appointmenttype?.toLowerCase().includes(SearchInput.toLowerCase())
      );
      setFilteredData(filter);
    }
  };

  // Search Filter settings to follow end here

  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

  const nav = useNavigate();

  const filterAll = () => {
    setAll(true);
    setAdmitted(false);
    setToAdmit(false);
    setFilterData(Data);
  };

  const filterToAdmit = () => {
    setAll(false);
    setToAdmit(true);
    setAdmitted(false);
    const filterData = Data.filter((item) => item.status === "toadmit");
    setFilterData(filterData);
  };
  const filterAdmitted = () => {
    setAll(false);
    setToAdmit(false);
    setAdmitted(true);
    const filterData = Data.filter((item) => item.status === "admited");
    setFilterData(filterData);
  };

  const getAllWard = async () => {
    try {
      const result = await GetAllWardApi();
      console.log("getallWard", result);
      setWardData(result.queryresult.wardmanagementdetails);
    } catch (e) {
      activateNotifications(e.message, "error");
    }
  };

  const getAllPatientHistory = async () => {
    setIsLoading(true);
    try {
      const result = await GetAllAdmittedApi(Ward);
      console.log("GetAllAdmitted", result);
      if (result.status === true) {
        setIsLoading(false);
        setLoading(false);
        setData(result.queryresult?.admissiondetails);
        setFilterData(result.queryresult?.admissiondetails);
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
      setShowToast({
        show: false,
      });
    }, 5000);
  };

  const location = useLocation().pathname;
  const ExaminePatient = (item) => {
    // Save the complete patient record to localStorage
    localStorage.setItem("inPatient", JSON.stringify(item.patient));
    localStorage.setItem("patientId", item.patient._id);
    localStorage.setItem("appointmentId", item._id);
    localStorage.setItem(
      "PatientName",
      `${item.patient.firstName} ${item.patient.lastName}`
    );
    localStorage.setItem("appointmentStatus", "scheduled");
    localStorage.setItem("pathLocation", location);

    // Navigate to the patient details page
    nav(`/dashboard/doctor-schedule-details/${item.patient._id}`);
  };

  const takeVitals = (item) => {
    onOpen();
    setOldPayload(item);
    setModalState("new");
  };

  const fetchPatient = () => {
    setLoading(true);
    getAllPatientHistory();
  };
  useEffect(() => {
    getAllWard();
  }, [isOpen, Trigger]);

  return (
    <MainLayout>
      {IsLoading && <Preloader />}
      <Seo
        title="Doctor Schedule"
        description="Care connect Manage Doctors Schedule"
      />

      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}
      <HStack>
        <Text color="#1F2937" fontWeight="600" fontSize="19px">
          In Patient
        </Text>
        <Text color="#667085" fontWeight="400" fontSize="18px">
          ({Data?.length})
        </Text>
      </HStack>
      <Text color="#686C75" mt="9px" fontWeight="400" fontSize="15px">
        View and manage all admitted patients in one place. Quickly access
        statuses, Patient timeline, and oversee the care of patient as needed.
      </Text>
      <Text color="blue.blue500" mt="9px" fontWeight="400" fontSize="15px">
        Kindly Select Ward you want to manage
      </Text>
      <SimpleGrid mt="5px" columns={{ base: 1, md: 2, lg: 2 }} spacing={10}>
        <Select
          id="type"
          value={Ward}
          onChange={(e) => setWard(e.target.value)}
          placeholder="Select Ward"
          fontSize={Ward !== "" ? "16px" : "13px"}
        >
          {WardData?.map((item, i) => (
            <option value={item._id}>{item.wardname}</option>
          ))}
        </Select>

        <Button
          isLoading={Loading}
          onClick={fetchPatient}
          disabled={Ward !== "" ? false : true}
        >
          {" "}
          Fetch Patient
        </Button>
      </SimpleGrid>

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
                All
                <Box color="#667085" as="span" fontWeight="400" fontSize="13px">
                  ({Data?.length})
                </Box>
              </Text>
            </Box>
            <Box
              borderRight="1px solid #EDEFF2"
              pr="5px"
              onClick={filterToAdmit}
            >
              <Text
                py="8.5px"
                px="12px"
                bg={ToAdmit ? "#fff" : "transparent"}
                rounded="7px"
                color={"#1F2937"}
                fontWeight={"500"}
                fontSize={"13px"}
              >
                To Admit
              </Text>
            </Box>
            <Box
              borderRight="1px solid #EDEFF2"
              pr="5px"
              onClick={filterAdmitted}
            >
              <Text
                py="8.5px"
                px="12px"
                bg={Admitted ? "#fff" : "transparent"}
                rounded="7px"
                color={"#1F2937"}
                fontWeight={"500"}
                fontSize={"13px"}
              >
                Admitted
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
                    onClick={() => filterBy("name")}
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
                      <Text>by Patient Name</Text>
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
                    onClick={() => filterBy("appointmentType")}
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
                      <Text>by Appointment Type</Text>
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
              <Thead bg="#fff">
                <Tr>
                  <Th fontSize="13px" color="#534D59" fontWeight="600">
                    Patient Name
                  </Th>
                  <Th fontSize="13px" color="#534D59" fontWeight="600">
                    Doctor
                  </Th>
                  <Th fontSize="13px" color="#534D59" fontWeight="600">
                    Specialization
                  </Th>
                  <Th fontSize="13px" color="#534D59" fontWeight="600">
                    Ward
                  </Th>
                  <Th fontSize="13px" color="#534D59" fontWeight="600">
                    Referred Date
                  </Th>
                  <Th fontSize="13px" color="#534D59" fontWeight="600">
                    Status
                  </Th>
                  <Th fontSize="13px" color="#534D59" fontWeight="600">
                    Actions
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {SearchInput === "" || FilteredData === null ? (
                  PaginatedData.map((item, i) => (
                    <TableRow
                      key={i}
                      name={`${item.patient.firstName} ${item.patient.lastName}`}
                      type="patient-admission"
                      date={moment(item.referddate).format("lll")}
                      doctor={item.doctorname}
                      clinic={item.admittospecialization}
                      wardName={item.referedward.wardname}
                      mrn={`${item.patient.MRN} `}
                      status={item.status}
                      onView={() => ExaminePatient(item)}
                    />
                  ))
                ) : SearchInput !== "" && FilteredData?.length > 0 ? (
                  FilteredData.map((item, i) => (
                    <TableRow
                      key={i}
                      name={`${item.patient.firstName} ${item.patient.lastName}`}
                      type="patient-admission"
                      date={moment(item.referddate).format("lll")}
                      doctor={item.doctorname}
                      clinic={item.admittospecialization}
                      wardName={item.referedward.wardname}
                      mrn={`${item.patient.MRN} `}
                      status={item.status}
                      onView={() => ExaminePatient(item)}
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
            totalPosts={Data.length}
            paginate={paginate}
          />
        </Box>

        <VitalsModal
          isOpen={isOpen}
          oldPayload={OldPayload}
          onClose={onClose}
          type={ModalState}
          activateNotifications={activateNotifications}
        />
      </Box>
    </MainLayout>
  );
}
