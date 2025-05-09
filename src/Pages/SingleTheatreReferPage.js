import React, { useState, useEffect } from "react";
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";
import {
  Box,
  Flex,
  HStack,
  SimpleGrid,
  Select,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
} from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, TableContainer } from "@chakra-ui/react";
import moment from "moment";
import { useNavigate, useLocation } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import { SlPlus } from "react-icons/sl";
import { IoFilter } from "react-icons/io5";
import { FaCalendarAlt } from "react-icons/fa";
import Input from "../Components/Input";
import Button from "../Components/Button";
import ShowToast from "../Components/ToastNotification";
import Pagination from "../Components/Pagination";
import Preloader from "../Components/Preloader";
import TableRowY from "../Components/TableRowY";
// Use the updated modal that includes patient selection and the new API
import ReferTheatreAdmissionWithPatientModal from "../Components/ReferTheatreAdmissionWithPatientModal";
import {
  GetAllReferredForTheatreAdmissionApi,
  GetAllTheatreApi,
  UpdateTheatreAdmissionStatusApi,
} from "../Utils/ApiCalls";
import { configuration } from "../Utils/Helpers"; // <-- Added configuration import

export default function SingleTheatreReferPage() {
  // Loading & Toast States
  const [IsLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });
  const activateNotifications = (message, status) => {
    setShowToast({ show: true, message, status });
    setTimeout(() => setShowToast({ show: false }), 5000);
  };

  // Modal & Trigger
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [Trigger, setTrigger] = useState(false);

  // Admissions Data States
  const [Data, setData] = useState([]); // Original admissions data
  const [FilterData, setFilterData] = useState([]); // Admissions after applying filters

  // Pagination States
  const [CurrentPage, setCurrentPage] = useState(1);
  // Removed local PostPerPage state; using configuration.sizePerPage instead:
  const postsPerPage = configuration.sizePerPage;
  const indexOfLast = CurrentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const PaginatedData = FilterData.slice(indexOfFirst, indexOfLast);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Search & Filter States
  const [SearchInput, setSearchInput] = useState("");
  const [filterOption, setFilterOption] = useState(""); // "clinic", "doctor", "referredtheatre", "patient", "mrn", or "date"

  // Date Filter States
  const [ByDate, setByDate] = useState(false);
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");

  // Status Filter States
  const [All, setAll] = useState(true);
  const [ToAdmit, setToAdmit] = useState(false);
  const [Admited, setAdmited] = useState(false);
  const [ToTransfer, setToTransfer] = useState(false);
  const [Transfered, setTransfered] = useState(false);
  const [ToDischarge, setToDischarge] = useState(false);
  const [Discharged, setDischarged] = useState(false);

  const statusMapping = {
    toadmit: "To Admit",
    admited: "Admited",
    totransfer: "To Transfer",
    transfered: "Transfered",
    todischarge: "To Discharge",
    discharged: "Discharged",
  };

  // Theatre Dropdown States
  const [Theatres, setTheatres] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState("");

  // Flag to indicate if a manual fetch has already occurred
  const [hasFetched, setHasFetched] = useState(false);

  // Fetch list of theatres on mount
  useEffect(() => {
    const fetchTheatres = async () => {
      try {
        const result = await GetAllTheatreApi();
        setTheatres(result.queryresult.theatremanagementdetails || []);
      } catch (error) {
        console.error("Error fetching theatres:", error.message);
      }
    };
    fetchTheatres();
  }, []);

  // Function to fetch admissions using selected theatre id
  const fetchAdmissions = async () => {
    if (!selectedTheatre) return;
    setIsLoading(true);
    try {
      const response = await GetAllReferredForTheatreAdmissionApi(selectedTheatre);
      console.log("GET Admissions API Response:", response);
      if (response.data.status === true) {
        setData(response.data.queryresult.thearteadmissiondetails);
        setHasFetched(true);
      } else {
        setData([]);
        setHasFetched(true);
      }
    } catch (error) {
      console.error("Error fetching admissions:", error.message);
      activateNotifications(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh admissions automatically when Trigger toggles (after a new record is created)
  useEffect(() => {
    if (hasFetched) {
      fetchAdmissions();
    }
  }, [Trigger]);

  // Apply status, search, date, and patient/mrn filters
  const applyFilters = () => {
    let filtered = Data;
    if (!All) {
      if (ToAdmit) {
        filtered = filtered.filter(
          (item) => item.status.toLowerCase() === "toadmit"
        );
      } else if (Admited) {
        filtered = filtered.filter(
          (item) => item.status.toLowerCase() === "admited"
        );
      } else if (ToTransfer) {
        filtered = filtered.filter(
          (item) => item.status.toLowerCase() === "totransfer"
        );
      } else if (Transfered) {
        filtered = filtered.filter(
          (item) => item.status.toLowerCase() === "transfered"
        );
      } else if (ToDischarge) {
        filtered = filtered.filter(
          (item) => item.status.toLowerCase() === "todischarge"
        );
      } else if (Discharged) {
        filtered = filtered.filter(
          (item) => item.status.toLowerCase() === "discharged"
        );
      }
    }
    if (SearchInput.trim() !== "") {
      const searchLower = SearchInput.toLowerCase();
      if (filterOption === "clinic") {
        filtered = filtered.filter((item) =>
          item.clinic?.toLowerCase().includes(searchLower)
        );
      } else if (filterOption === "doctor") {
        filtered = filtered.filter((item) =>
          item.doctorname?.toLowerCase().includes(searchLower)
        );
      } else if (filterOption === "referredtheatre") {
        filtered = filtered.filter((item) =>
          item.referedtheatre?.theatrename?.toLowerCase().includes(searchLower)
        );
      } else if (filterOption === "patient") {
        filtered = filtered.filter((item) => {
          const patientName = `${item.patient?.firstName || ""} ${item.patient?.lastName || ""}`.toLowerCase();
          return patientName.includes(searchLower);
        });
      } else if (filterOption === "mrn") {
        filtered = filtered.filter((item) => {
          const mrn = String(item.patient?.MRN || item.MRN || "").toLowerCase();
          return mrn.includes(searchLower);
        });
      } else {
        // Default: search across all fields including MRN
        filtered = filtered.filter(
          (item) =>
            item.clinic?.toLowerCase().includes(searchLower) ||
            item.doctorname?.toLowerCase().includes(searchLower) ||
            item.referedtheatre?.theatrename?.toLowerCase().includes(searchLower) ||
            `${item.patient?.firstName || ""} ${item.patient?.lastName || ""}`
              .toLowerCase()
              .includes(searchLower) ||
            String(item.patient?.MRN || item.MRN || "")
              .toLowerCase()
              .includes(searchLower)
        );
      }
    }
    // Date filtering when filterOption is "date" and both dates are provided
    if (filterOption === "date" && StartDate && EndDate) {
      filtered = filtered.filter((item) => {
        if (item.appointmentdate) {
          return moment(item.appointmentdate).isBetween(StartDate, EndDate, "day", "[]");
        }
        return false;
      });
    }
    setFilterData(filtered);
    setCurrentPage(1);
  };


  const location = useLocation().pathname

  const theateTimeline = (Admission_ID, Name) => {
    localStorage.setItem('pathLocation', location)
    nav(`/dashboard/single-theatre/patient-timeline/${Admission_ID}`);
    localStorage.setItem('appointmentId', Admission_ID)
    localStorage.setItem('PatientName', Name)


  }

  useEffect(() => {
    applyFilters();
  }, [
    Data,
    All,
    ToAdmit,
    Admited,
    ToTransfer,
    Transfered,
    ToDischarge,
    Discharged,
    SearchInput,
    filterOption,
    StartDate,
    EndDate,
  ]);

  // Status Filter Functions
  const filterAll = () => {
    setAll(true);
    setToAdmit(false);
    setAdmited(false);
    setToTransfer(false);
    setTransfered(false);
    setToDischarge(false);
    setDischarged(false);
  };
  const filterToAdmit = () => {
    setAll(false);
    setToAdmit(true);
    setAdmited(false);
    setToTransfer(false);
    setTransfered(false);
    setToDischarge(false);
    setDischarged(false);
  };
  const filterAdmited = () => {
    setAll(false);
    setToAdmit(false);
    setAdmited(true);
    setToTransfer(false);
    setTransfered(false);
    setToDischarge(false);
    setDischarged(false);
  };
  const filterToTransfer = () => {
    setAll(false);
    setToAdmit(false);
    setAdmited(false);
    setToTransfer(true);
    setTransfered(false);
    setToDischarge(false);
    setDischarged(false);
  };
  const filterTransfered = () => {
    setAll(false);
    setToAdmit(false);
    setAdmited(false);
    setToTransfer(false);
    setTransfered(true);
    setToDischarge(false);
    setDischarged(false);
  };
  const filterToDischarge = () => {
    setAll(false);
    setToAdmit(false);
    setAdmited(false);
    setToTransfer(false);
    setTransfered(false);
    setToDischarge(true);
    setDischarged(false);
  };
  const filterDischarged = () => {
    setAll(false);
    setToAdmit(false);
    setAdmited(false);
    setToTransfer(false);
    setTransfered(false);
    setToDischarge(false);
    setDischarged(true);
  };

  // Search Input Handling
  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };
  const handleFilterBy = (field) => {
    setFilterOption(field);
  };
  const clearFilter = () => {
    setFilterOption("");
    setSearchInput("");
    setByDate(false);
    setStartDate("");
    setEndDate("");
  };

  // Modal handling for add/edit admission
  const [modalState, setModalState] = useState("");
  const [oldPayload, setOldPayload] = useState({});
  const addAdmission = () => {
    setModalState("new");
    setOldPayload({});
    onOpen();
  };
  const handleEdit = (item) => {
    setModalState("edit");
    setOldPayload(item);
    onOpen();
  };

  // New functions to handle status updates via API using the _id from the GET API response
  const handleAdmit = async (id) => {
    try {
      const result = await UpdateTheatreAdmissionStatusApi(id, { status: "admited" });
      if (result.status === 200) {
        setTrigger(!Trigger);
        activateNotifications("Admission status updated to Admited successfully", "success");
      }
    } catch (e) {
      activateNotifications(e.message, "error");
    }
  };

  const handleTransfer = async (id) => {
    try {
      const result = await UpdateTheatreAdmissionStatusApi(id, { status: "transfered" });
      if (result.status === 200) {
        setTrigger(!Trigger);
        activateNotifications("Admission status updated to Transfered successfully", "success");
      }
    } catch (e) {
      activateNotifications(e.message, "error");
    }
  };

  const handleDischarge = async (id) => {
    try {
      const result = await UpdateTheatreAdmissionStatusApi(id, { status: "discharged" });
      if (result.status === 200) {
        setTrigger(!Trigger);
        activateNotifications("Admission status updated to Discharged successfully", "success");
      }
    } catch (e) {
      activateNotifications(e.message, "error");
    }
  };

  const { pathname } = useLocation();
  const nav = useNavigate();

  return (
    <MainLayout>
      <Seo
        title="Single Theatre Admission"
        description="Manage your single theatre admissions"
      />
      {IsLoading && <Preloader />}
      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}
      <HStack>
        <Text color="#1F2937" fontWeight="600" fontSize="19px">
          Theatre Admissions
        </Text>
        <Text color="#667085" fontWeight="400" fontSize="18px">
          ({FilterData.length})
        </Text>
      </HStack>
      <Text color="#686C75" mt="9px" fontWeight="400" fontSize="15px">
        Manage your theatre admissions for the selected theatre.
      </Text>
      <Text color="blue.blue500" mt="9px" fontWeight="400" fontSize="15px">
        Kindly Select Clinic you want to manage
      </Text>

      {/* Theatre Selection */}
      <SimpleGrid mt="5px" mb="20px" columns={{ base: 1, md: 2, lg: 2 }} spacing={10}>
        <Select
          id="theatre"
          value={selectedTheatre}
          onChange={(e) => setSelectedTheatre(e.target.value)}
          placeholder="Select Theatre"
          fontSize={selectedTheatre !== "" ? "16px" : "13px"}
        >
          {Theatres.map((theatre) => (
            <option key={theatre._id} value={theatre._id}>
              {theatre.theatrename}
            </option>
          ))}
        </Select>
        <Button
          isLoading={IsLoading}
          onClick={fetchAdmissions}
          disabled={!selectedTheatre}
        >
          Fetch Admissions
        </Button>
      </SimpleGrid>

      {!selectedTheatre ? (
        <Text fontSize="lg" color="gray.500" textAlign="center" mt="20px">
          Please select a theatre to view admissions.
        </Text>
      ) : (
        <>
          {/* Status Filters */}
          <Flex
            display="inline-flex"
            alignItems="center"
            flexWrap="wrap"
            bg="#E4F3FF"
            rounded="7px"
            py="3.5px"
            px="5px"
            cursor="pointer"
            mb="15px"
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
                All
              </Text>
            </Box>
            <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterToAdmit}>
              <Text
                py="8.5px"
                px="12px"
                bg={ToAdmit ? "#fff" : "transparent"}
                rounded="7px"
                color="#1F2937"
                fontWeight="500"
                fontSize="13px"
              >
                To Admit
              </Text>
            </Box>
            <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterAdmited}>
              <Text
                py="8.5px"
                px="12px"
                bg={Admited ? "#fff" : "transparent"}
                rounded="7px"
                color="#1F2937"
                fontWeight="500"
                fontSize="13px"
              >
                Admited
              </Text>
            </Box>
            <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterToTransfer}>
              <Text
                py="8.5px"
                px="12px"
                bg={ToTransfer ? "#fff" : "transparent"}
                rounded="7px"
                color="#1F2937"
                fontWeight="500"
                fontSize="13px"
              >
                To Transfer
              </Text>
            </Box>
            <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterTransfered}>
              <Text
                py="8.5px"
                px="12px"
                bg={Transfered ? "#fff" : "transparent"}
                rounded="7px"
                color="#1F2937"
                fontWeight="500"
                fontSize="13px"
              >
                Transfered
              </Text>
            </Box>
            <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterToDischarge}>
              <Text
                py="8.5px"
                px="12px"
                bg={ToDischarge ? "#fff" : "transparent"}
                rounded="7px"
                color="#1F2937"
                fontWeight="500"
                fontSize="13px"
              >
                To Discharge
              </Text>
            </Box>
            <Box onClick={filterDischarged}>
              <Text
                py="8.5px"
                px="12px"
                bg={Discharged ? "#fff" : "transparent"}
                rounded="7px"
                color="#1F2937"
                fontWeight="500"
                fontSize="13px"
              >
                Discharged
              </Text>
            </Box>
          </Flex>

          {/* Action Bar: Add Button and Search/Date Filter */}
          <Flex
            flexDirection={["column", "row"]}
            justifyContent="space-between"
            alignItems="center"
            mb="15px"
            gap="15px"
          >
            <Button
              rightIcon={<SlPlus />}
              w={["100%", "220px"]}
              onClick={addAdmission}
            >
              Add Refer Admission
            </Button>
            <HStack w={["100%", "auto"]} flexWrap={["wrap", "nowrap"]}>
              {ByDate ? (
                <HStack>
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
                    onClick={() => handleFilterBy("date")}
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
              ) : (
                <Input
                  label="Search"
                  onChange={handleInputChange}
                  value={SearchInput}
                  bColor="#E4E4E4"
                  leftIcon={<BiSearch />}
                />
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
                <MenuList fontSize="14px">
                  <MenuItem
                    onClick={() => handleFilterBy("clinic")}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
                  >
                    by Clinic
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleFilterBy("doctor")}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
                  >
                    by Doctor
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleFilterBy("referredtheatre")}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
                  >
                    by Referred Theatre
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleFilterBy("patient")}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
                  >
                    by Patient
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleFilterBy("mrn")}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
                  >
                    by MRN
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setByDate(true);
                      handleFilterBy("date");
                    }}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
                  >
                    by Date
                  </MenuItem>
                  <MenuItem
                    onClick={clearFilter}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
                  >
                    Clear Filter
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>

          {/* Admissions Table */}
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
              Single Theatre Admission History
            </Text>
            <TableContainer>
              <Table variant="striped">
                <Thead bg="#fff">
                  <Tr>
                    <Th fontSize="13px" color="#534D59" fontWeight="600">
                      S/N
                    </Th>
                    <Th fontSize="13px" color="#534D59" fontWeight="600">
                      Admission ID
                    </Th>
                    <Th fontSize="13px" color="#534D59" fontWeight="600">
                      Appointment Date
                    </Th>
                    <Th fontSize="13px" color="#534D59" fontWeight="600">
                      Clinic
                    </Th>
                    <Th fontSize="13px" color="#534D59" fontWeight="600">
                      Patient
                    </Th>
                    <Th fontSize="13px" color="#534D59" fontWeight="600">
                      Referred Theatre
                    </Th>
                    <Th fontSize="13px" color="#534D59" fontWeight="600">
                      Doctor
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
                  {PaginatedData.map((item, i) => (
                    <TableRowY
                      key={i}
                      type="single-refer-theatre-admission"
                      onView={() => theateTimeline(item._id, item.patient.firstName + " " + item.patient.lastName)}
                      sn={indexOfFirst + i + 1}
                      theatreadmissionid={item.theatreadmissionid}
                      appointmentdate={
                        item.appointmentdate
                          ? moment(item.appointmentdate).format("lll")
                          : ""
                      }
                      clinic={item.clinic}
                      patient={item.patient}
                      referedtheatre={item.referedtheatre}
                      doctorname={item.doctorname}
                      status={statusMapping[item.status.toLowerCase()] || item.status}
                      onEdit={() => handleEdit(item)}
                      onAdmit={() => handleAdmit(item._id)}
                      onTransfer={() => handleTransfer(item._id)}
                      onDischarge={() => handleDischarge(item._id)}
                    />
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            <Pagination
              postPerPage={postsPerPage}
              currentPage={CurrentPage}
              totalPosts={FilterData.length}
              paginate={paginate}
            />
          </Box>

          {/* Updated Modal using the new API, patient selection, and onRefresh callback */}
          <ReferTheatreAdmissionWithPatientModal
            isOpen={isOpen}
            onClose={onClose}
            type={modalState}
            activateNotifications={activateNotifications}
            oldPayload={oldPayload}
            onRefresh={() => setTrigger(!Trigger)}
          />
        </>
      )}
    </MainLayout>
  );
}
