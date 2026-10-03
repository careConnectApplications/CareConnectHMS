import React, { useEffect, useState } from "react";
import MainLayout from "../Layouts/Index";
import {
  Text,
  Flex,
  HStack,
  Box,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Select,
} from "@chakra-ui/react";
import TableRow from "../Components/TableRow";
import Button from "../Components/Button";
import Input from "../Components/Input";
import ShowToast from "../Components/ToastNotification";
import { BiSearch } from "react-icons/bi";
import moment from "moment";
import Seo from "../Utils/Seo";
import {
  GetOnlyClinicApi,
  ReadAllReferralByClinicApi,
} from "../Utils/ApiCalls";
import Pagination from "../Components/Pagination";
import { configuration } from "../Utils/Helpers";
import Preloader from "../Components/Preloader";
import CreateReferralModal from "../Components/CreateReferralModal";
import ProcessReferralModal from "../Components/ProcessReferralModal";
import ScheduleReferralModal from "../Components/ScheduleReferralModal";

export default function ClinicReferralPage() {
  const [IsLoading, setIsLoading] = useState(false);
  const [Clinics, setClinics] = useState([]);
  const [SelectedClinic, setSelectedClinic] = useState("");
  const [SearchInput, setSearchInput] = useState("");
  const [Data, setData] = useState([]);
  const [FilterData, setFilterData] = useState([]);
  const [OldPayload, setOldPayload] = useState({});
  const [ModalState, setModalState] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [OpenProcessModal, setOpenProcessModal] = useState(false);
  const [OpenScheduleModal, setOpenScheduleModal] = useState(false);

  // Pagination
  const [CurrentPage, setCurrentPage] = useState(1);
  const [PostPerPage] = useState(configuration.sizePerPage);

  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

  const activateNotifications = (message, status) => {
    setShowToast({
      show: true,
      message,
      status,
    });
    setTimeout(() => {
      setShowToast({ show: false, message: "", status: "" });
    }, 4000);
  };

  // Fetch Clinics List
  const fetchClinics = async () => {
    try {
      const res = await GetOnlyClinicApi();
      if (res?.queryresult?.clinicdetails) {
        setClinics(res.queryresult.clinicdetails);
      } else if (Array.isArray(res)) {
        setClinics(res);
      }
    } catch (e) {
      console.error("Error fetching clinics:", e.message);
    }
  };

  useEffect(() => {
    fetchClinics();
  }, []);

  // Fetch Referrals by Selected Clinic
  const handleFetchReferrals = async () => {
    if (!SelectedClinic) {
      activateNotifications("Please select a clinic first", "error");
      return;
    }
    setIsLoading(true);
    try {
      const res = await ReadAllReferralByClinicApi(SelectedClinic);
      if (res?.queryresult?.referrerdetails) {
        const details = res.queryresult.referrerdetails;
        setData(details);
        setFilterData(details);
        setCurrentPage(1);
        if (details.length === 0) {
          activateNotifications(`No referrals found for ${SelectedClinic}`, "warning");
        } else {
          activateNotifications(`Fetched ${details.length} referral(s) for ${SelectedClinic}`, "success");
        }
      } else {
        setData([]);
        setFilterData([]);
      }
    } catch (e) {
      activateNotifications(e.message || "Error fetching referrals", "error");
      setData([]);
      setFilterData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Search Filter
  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchInput(val);
    if (!val.trim()) {
      setFilterData(Data);
      return;
    }
    const filtered = Data.filter((item) => {
      const patientName = `${item.patient?.firstName || ""} ${item.patient?.lastName || ""}`.toLowerCase();
      const mrn = (item.patient?.MRN || "").toLowerCase();
      const doctor = (item.referredby || "").toLowerCase();
      const status = (item.status || "").toLowerCase();
      const originating = (item.referredclinic || "").toLowerCase();
      const search = val.toLowerCase();
      return (
        patientName.includes(search) ||
        mrn.includes(search) ||
        doctor.includes(search) ||
        status.includes(search) ||
        originating.includes(search)
      );
    });
    setFilterData(filtered);
    setCurrentPage(1);
  };

  // Handlers for Row Actions
  const handleEdit = (item) => {
    setOldPayload(item);
    setModalState("edit");
    onOpen();
  };

  const handleView = (item) => {
    setOldPayload(item);
    setModalState("view");
    onOpen();
  };

  const handleProcess = (item) => {
    setOldPayload(item);
    setOpenProcessModal(true);
  };

  const handleSchedule = (item) => {
    setOldPayload(item);
    setOpenScheduleModal(true);
  };

  // Paginated Data
  const indexOfLastItem = CurrentPage * PostPerPage;
  const indexOfFirstItem = indexOfLastItem - PostPerPage;
  const paginatedData = FilterData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <MainLayout>
      <Seo title="Clinic Referral | CareConnect" />
      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}

      <Box px={{ base: "4", md: "8" }} py="6">
        <Flex justify="space-between" align="center" mb="6">
          <Box>
            <Text fontSize="24px" fontWeight="700" color="blue.blue500">
              Referral by Clinic
            </Text>
            <Text fontSize="14px" color="gray.600">
              Select a clinic to view, process, accept/reject, and schedule referral appointments.
            </Text>
          </Box>
        </Flex>

        {/* Filter Controls */}
        <Flex
          direction={{ base: "column", md: "row" }}
          gap="4"
          align="center"
          justify="space-between"
          mb="6"
          bg="white"
          p="4"
          rounded="12px"
          shadow="sm"
        >
          <HStack spacing="4" flex="1" w={{ base: "100%", md: "auto" }}>
            <Select
              placeholder="Select Clinic"
              value={SelectedClinic}
              onChange={(e) => setSelectedClinic(e.target.value)}
              h="45px"
              borderColor="#6B7280"
              fontSize="14px"
              maxW="300px"
            >
              {Clinics.map((item, i) => {
                const cName = typeof item === "string" ? item : (item.clinic || item.clinicname || item.name || item.id || "");
                return (
                  <option key={item._id || i} value={cName}>
                    {cName}
                  </option>
                );
              })}
            </Select>

            <Button
              onClick={handleFetchReferrals}
              isLoading={IsLoading}
              px="6"
              h="45px"
            >
              Submit
            </Button>
          </HStack>

          {/* Search Input */}
          <Box w={{ base: "100%", md: "300px" }}>
            <Input
              placeholder="Search patient, MRN, doctor..."
              value={SearchInput}
              onChange={handleSearch}
              leftIcon={<BiSearch />}
            />
          </Box>
        </Flex>

        {/* Data Table */}
        {IsLoading ? (
          <Preloader />
        ) : (
          <Box bg="white" rounded="12px" shadow="sm" p="4">
            <TableContainer overflowX="auto">
              <Table variant="simple">
                <Thead bg="#F9FAFB">
                  <Tr>
                    <Th fontSize="13px" color="#534D59" fontWeight="600">
                      Referral ID
                    </Th>
                    <Th fontSize="13px" color="#534D59" fontWeight="600">
                      Patient Name
                    </Th>
                    <Th fontSize="13px" color="#534D59" fontWeight="600">
                      Originating Unit
                    </Th>
                    <Th fontSize="13px" color="#534D59" fontWeight="600">
                      Receiving Unit
                    </Th>
                    <Th fontSize="13px" color="#534D59" fontWeight="600">
                      Doctor
                    </Th>
                    <Th fontSize="13px" color="#534D59" fontWeight="600">
                      Referral Date
                    </Th>
                    <Th fontSize="13px" color="#534D59" fontWeight="600">
                      Priority
                    </Th>
                    <Th fontSize="13px" color="#534D59" fontWeight="600">
                      Referral Status
                    </Th>
                    <Th fontSize="13px" color="#534D59" fontWeight="600">
                      Actions
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {paginatedData && paginatedData.length > 0 ? (
                    paginatedData.map((item, i) => (
                      <TableRow
                        key={item._id || i}
                        type="patient-referral"
                        id={item.referralid || item._id}
                        name={`${item.patient?.firstName || ""} ${item.patient?.lastName || ""}`}
                        mrn={`${item.patient?.MRN || ""}`}
                        originatingUnit={item.referredclinic}
                        receivingUnit={item.receivingclinic}
                        doctor={item.referredby}
                        priority={item.priority}
                        status={item.status}
                        consultant={item.preferredconsultant}
                        date={moment(item.createdAt || item.referraldate).format("lll")}
                        onEdit={() => handleEdit(item)}
                        onView={() => handleView(item)}
                        onProcess={() => handleProcess(item)}
                        onClick={() => handleSchedule(item)}
                      />
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={9} textAlign="center" py="8" color="gray.500">
                        {SelectedClinic
                          ? "*-- No referral records found --*"
                          : "Please select a clinic and click Submit to view referrals."}
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {FilterData.length > 0 && (
              <Box mt="6">
                <Pagination
                  postPerPage={PostPerPage}
                  currentPage={CurrentPage}
                  totalPost={FilterData.length}
                  paginate={paginate}
                />
              </Box>
            )}
          </Box>
        )}

        {/* Modals */}
        {isOpen && (
          <CreateReferralModal
            isOpen={isOpen}
            onClose={onClose}
            type={ModalState}
            activateNotifications={activateNotifications}
            oldPayload={OldPayload}
          />
        )}
        {OpenProcessModal && (
          <ProcessReferralModal
            isOpen={OpenProcessModal}
            onClose={() => {
              setOpenProcessModal(false);
              if (SelectedClinic) handleFetchReferrals();
            }}
            activateNotifications={activateNotifications}
            oldPayload={OldPayload}
          />
        )}
        {OpenScheduleModal && (
          <ScheduleReferralModal
            isOpen={OpenScheduleModal}
            onClose={() => {
              setOpenScheduleModal(false);
              if (SelectedClinic) handleFetchReferrals();
            }}
            activateNotifications={activateNotifications}
            oldPayload={OldPayload}
          />
        )}
      </Box>
    </MainLayout>
  );
}
