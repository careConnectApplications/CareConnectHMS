import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainLayout from "../Layouts/Index";
import {
  Text,
  Flex,
  HStack,
  Box,
  useDisclosure,
  SimpleGrid,
  Select,
} from "@chakra-ui/react";
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
import Button from "../Components/Button";
import Input from "../Components/Input";
import VitalsModal from "../Components/VitalsModal";
import ScheduleProcedureModal from "../Components/ScheduleProcedureModal";
import ShowToast from "../Components/ToastNotification";
import { BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import { SlPlus } from "react-icons/sl";
import moment from "moment";
import Seo from "../Utils/Seo";

import {
  GetAllProcedureByClinicApi,
  GetOnlyClinicApi,
  UploadProcedureResultApi,
  ViewMultipleRadiologyResultsApi,
} from "../Utils/ApiCalls";
import Pagination from "../Components/Pagination";
import { configuration } from "../Utils/Helpers";
import Preloader from "../Components/Preloader";
import { FaCalendarAlt } from "react-icons/fa";


export default function ScheduleProcedure() {
  const [IsLoading, setIsLoading] = useState(false);
  const [All, setAll] = useState(true);
  const [Inprogress, setInprogress] = useState(false);
  const [Processed, setProcessed] = useState(false);
  const [Clinic, setClinic] = useState("");
  const [ClinicData, setClinicData] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [Trigger, setTrigger] = useState(false);
  const [OldPayload, setOldPayload] = useState({});

  const [Data, setData] = useState([]);
  const [QueueData, setQueueData] = useState([]);
  const [ByDate, setByDate] = useState(false);
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");

  const [FilterData, setFilterData] = useState(Data);
  const [OpenProcedureModal, setOpenProcedureModal] = useState(false);
  const [ModalState, setModalState] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  // Updated filterBy to include doctor and procedure
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
    } else if (title === "doctor") {
      let filter = Data.filter((item) =>
        item.raiseby?.toLowerCase().includes(SearchInput.toLowerCase())
      );
      setFilteredData(filter);
    } else if (title === "procedure") {
      let filter = Data.filter((item) =>
        item.procedure?.toLowerCase().includes(SearchInput.toLowerCase())
      );
      setFilteredData(filter);
    } else if (title === "mrn") {
      let filter = Data.filter((item) =>
        item.patient?.MRN?.toLowerCase().includes(SearchInput.toLowerCase())
      );
      setFilteredData(filter);
    } else if (title === "date") {
      // add 1 day to end date
      let endDate = new Date(EndDate);
      endDate.setDate(endDate.getDate() + 1);
      // format date back
      let formatedEndDate = endDate.toISOString().split("T")[0];
      let filter = Data.filter(
        (item) =>
          item.appointmentdate >= StartDate && item.appointmentdate <= formatedEndDate
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

  const nav = useNavigate();

  // Update filter functions to include Processed
  const filterAll = () => {
    setAll(true);
    setInprogress(false);
    setProcessed(false);
    setFilterData(Data);
  };

  const filterInProgress = () => {
    setAll(false);
    setInprogress(true);
    setProcessed(false);
    const filterData = Data.filter((item) => item.status === "inprogress");
    setFilterData(filterData);
  };

  const filterProcessed = () => {
    setAll(false);
    setInprogress(false);
    setProcessed(true);
    const filterData = Data.filter((item) => item.status === "processed");
    setFilterData(filterData);
  };

  const getAllPatientHistory = async () => {
    setIsLoading(true);
    try {
      const result = await GetAllProcedureByClinicApi(Clinic);
      console.log("getAllProcedureHistory", result);
      if (result.status === true) {
        setIsLoading(false);
        setLoading(false);
        setData(result.queryresult.proceduredetails);
        setFilterData(result.queryresult.proceduredetails);
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  const getAllClinic = async () => {
    try {
      const result = await GetOnlyClinicApi();
      console.log("getonlyClinic", result);
      setClinicData(result.queryresult.clinicdetails);
    } catch (e) {
      // handle error if needed
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

  const ExaminePatient = (PatientId, AppointmentID, Name, status) => {
    localStorage.setItem("pathLocation", location);
    nav(`/dashboard/doctor-schedule-details/${PatientId}`);
    localStorage.setItem("appointmentId", AppointmentID);
    localStorage.setItem("PatientName", Name);
    localStorage.setItem("appointmentStatus", status);
  };

  const AddProcedure = () => {
    setOpenProcedureModal(true);
    setModalState("new");
  };

  const handleEdit = (item) => {
    setModalState("edit");
    setOldPayload(item);
    setOpenProcedureModal(true);
  };

  const handleView = (item) => {
    setModalState("view");
    setOldPayload(item);
    setOpenProcedureModal(true);
  };

  // --- New Handlers for Procedure Result Upload and View ---
  const fileInputRef = useRef(null);
  const [uploadProcedureId, setUploadProcedureId] = useState(null);

  const handleUploadClick = (procedureId) => {
    setUploadProcedureId(procedureId);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleProcedureFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !uploadProcedureId) return;
    try {
      const result = await UploadProcedureResultApi(file, uploadProcedureId);
      activateNotifications(
        "Procedure result uploaded successfully",
        "success"
      );
      setTrigger(!Trigger);
    } catch (err) {
      activateNotifications(err.message, "error");
    }
    e.target.value = null;
    setUploadProcedureId(null);
  };

  const handleViewResult = async (resultArray) => {
    if (resultArray && resultArray.length > 0) {
      try {
        const urls = await ViewMultipleRadiologyResultsApi(resultArray);
        const newWindow = window.open("", "_blank");
        if (!newWindow) {
          alert("Popup blocked. Please allow popups for this site.");
          return;
        }
        const html = `
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <title>Procedure Results Slideshow</title>
                    <style>
                      body { font-family: Arial, sans-serif; text-align: center; background-color: #f2f2f2; margin: 0; padding: 20px; }
                      #slideshow { max-width: 90%; margin: 0 auto; }
                      #slideshow img { display: block; margin: 0 auto; width: auto; max-width: 100%; height: auto; max-height: 80vh; }
                      .nav { cursor: pointer; font-size: 2rem; user-select: none; padding: 10px; }
                      .nav:hover { color: #EA5937; }
                      .nav-container { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
                    </style>
                  </head>
                  <body>
                    <div id="slideshow">
                      <img id="slide" src="${urls[0]}" alt="Procedure Result">
                    </div>
                    <div class="nav-container">
                      <div id="prev" class="nav">&laquo; Prev</div>
                      <div id="next" class="nav">Next &raquo;</div>
                    </div>
                    <script>
                      const urls = ${JSON.stringify(urls)};
                      let index = 0;
                      const slide = document.getElementById("slide");
                      document.getElementById("prev").addEventListener("click", () => {
                        index = (index === 0) ? urls.length - 1 : index - 1;
                        slide.src = urls[index];
                      });
                      document.getElementById("next").addEventListener("click", () => {
                        index = (index === urls.length - 1) ? 0 : index + 1;
                        slide.src = urls[index];
                      });
                    </script>
                  </body>
                  </html>
                `;
        newWindow.document.write(html);
        newWindow.document.close();
      } catch (error) {
        activateNotifications("Error fetching procedure results", "error");
      }
    } else {
      activateNotifications(
        "No procedure result available for viewing",
        "error"
      );
    }
  };
  // --- End New Handlers ---

  const fetchPatient = () => {
    setLoading(true);
    getAllPatientHistory();
  };

  useEffect(() => {
    getAllClinic();
    if (Clinic !== "") {
      getAllPatientHistory();
    }
  }, [isOpen, OpenProcedureModal, Trigger]);

  return (
    <MainLayout>
      {IsLoading && <Preloader />}
      <Seo
        title="Scheduled Procedure"
        description="Care connect Manage Scheduled Procedure"
      />

      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}
      <HStack>
        <Text color="#1F2937" fontWeight="600" fontSize="19px">
          Scheduled Procedure
        </Text>
        <Text color="#667085" fontWeight="400" fontSize="18px">
          ({Data?.length})
        </Text>
      </HStack>
      <Text color="#686C75" mt="9px" fontWeight="400" fontSize="15px">
        View and manage all procedures in one place. Quickly access statuses,
        update details, and manage schedules as needed.
      </Text>
      <Text color="blue.blue500" mt="9px" fontWeight="400" fontSize="15px">
        Kindly Select Clinic you want to manage
      </Text>
      <SimpleGrid mt="5px" columns={{ base: 1, md: 2, lg: 2 }} spacing={10}>
        <Select
          id="type"
          value={Clinic}
          onChange={(e) => setClinic(e.target.value)}
          placeholder="Select Clinic"
          fontSize={Clinic !== "" ? "16px" : "13px"}
        >
          {ClinicData?.map((item, i) => (
            <option value={item.clinic} key={i}>
              {item.clinic}
            </option>
          ))}
        </Select>

        <Button
          isLoading={Loading}
          onClick={fetchPatient}
          disabled={Clinic !== "" ? false : true}
        >
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
        {/* Filter Section */}
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
                color="#1F2937"
                fontWeight="500"
                fontSize="13px"
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
              onClick={filterInProgress}
            >
              <Text
                py="8.5px"
                px="12px"
                bg={Inprogress ? "#fff" : "transparent"}
                rounded="7px"
                color="#1F2937"
                fontWeight="500"
                fontSize="13px"
              >
                In Progress{" "}
                <Box color="#667085" as="span" fontWeight="400" fontSize="13px">
                  ({Data.filter((item) => item.status === "inprogress").length})
                </Box>
              </Text>
            </Box>
            <Box onClick={filterProcessed}>
              <Text
                py="8.5px"
                px="12px"
                bg={Processed ? "#fff" : "transparent"}
                rounded="7px"
                color="#1F2937"
                fontWeight="500"
                fontSize="13px"
              >
                Processed{" "}
                <Box color="#667085" as="span" fontWeight="400" fontSize="13px">
                  ({Data.filter((item) => item.status === "processed").length})
                </Box>
              </Text>
            </Box>
          </Flex>

          <Flex
            flexWrap="wrap"
            mt={["10px", "10px", "0px", "0px"]}
            alignItems="center"
            justifyContent="flex-end"
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
                    onClick={() => filterBy("appointmentType")}
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
                      <Text>by Appointment Type</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => filterBy("doctor")}
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
                      <Text>by Doctor</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => filterBy("procedure")}
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
                      <Text>by Procedure</Text>
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
            px="120px"
            onClick={AddProcedure}
          >
            Schedule Procedure
          </Button>
        </Flex>

        {/* Procedure History Table */}
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
                    Appointment Date
                  </Th>
                  <Th fontSize="13px" color="#534D59" fontWeight="600">
                    Procedure Name
                  </Th>
                  <Th fontSize="13px" color="#534D59" fontWeight="600">
                    Status
                  </Th>
                  <Th fontSize="13px" color="#534D59" fontWeight="600">
                    Payment Status
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
                      type="patient-procedure"
                      name={`${item.patient?.firstName} ${item.patient?.lastName}`}
                      mrn={`${item.patient?.MRN}`}
                      doctor={item.raiseby}
                      date={moment(item.appointmentdate).format("lll")}
                      testName={item.procedure}
                      status={item.status}
                      PaymentStatus={item.patient?.isHMOCover === "Yes" ? "paid" : item.payment?.status}
                      onEdit={() => handleEdit(item)}
                      onView={() => handleView(item)}
                      onViewResult={() =>
                        handleViewResult(item.procedureresult)
                      }
                      onUpload={() => handleUploadClick(item._id)}
                    />
                  ))
                ) : SearchInput !== "" && FilteredData?.length > 0 ? (
                  FilteredData.map((item, i) => (
                    <TableRow
                      key={i}
                      type="patient-procedure"
                      name={`${item.patient?.firstName} ${item.patient?.lastName}`}
                      mrn={`${item.patient?.MRN}`}
                      doctor={item.raiseby}
                      date={moment(item.appointmentdate).format("lll")}
                      testName={item.procedure}
                      status={item.status}
                      PaymentStatus={item.patient?.isHMOCover === "Yes" ? "paid" : item.payment?.status}
                      onEdit={() => handleEdit(item)}
                      onView={() => handleView(item)}
                      onViewResult={() =>
                        handleViewResult(item.procedureresult)
                      }
                      onUpload={() => handleUploadClick(item._id)}
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
        <ScheduleProcedureModal
          isOpen={OpenProcedureModal}
          onClose={() => setOpenProcedureModal(false)}
          type={ModalState}
          activateNotifications={activateNotifications}
          oldPayload={OldPayload}
        />
        <VitalsModal
          isOpen={isOpen}
          oldPayload={OldPayload}
          onClose={onClose}
          type={ModalState}
          activateNotifications={activateNotifications}
        />
      </Box>
      {/* Hidden file input for procedure result upload */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleProcedureFileChange}
      />
    </MainLayout>
  );
}
