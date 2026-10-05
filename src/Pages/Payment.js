import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainLayout from "../Layouts/Index";
import { Text, Flex, HStack, Box, useDisclosure } from "@chakra-ui/react";
import TableRow from "../Components/TableRow";
import TableRowX from "../Components/TableRowX";
import Button from "../Components/Button";
import Input from "../Components/Input";
import ShowToast from "../Components/ToastNotification";
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
import PaymentGroupModal from "../Components/PaymentGroupModal";
import CreatePatientModal from "../Components/CreatePatientModal";
import FundWalletModal from "../Components/FundWalletModal";
import WalletTransactionsModal from "../Components/WalletTransactionsModal";
import RefundRequestModal from "../Components/RefundRequestModal";
import {
  GetAllPaidPaymentGroupApi,
  GetAllFilteredPaymentGroupOptApi,
  GetAllPaymentGroupOptApi,
  GetAllPatientsApi,
  GetAllFilteredPatientsApi,
} from "../Utils/ApiCalls";
import moment from "moment";
import Seo from "../Utils/Seo";
import { HiOutlineDocumentArrowUp } from "react-icons/hi2";
import { BiSearch } from "react-icons/bi";

import { SlPlus } from "react-icons/sl";
import Pagination from "../Components/Pagination";
import { configuration } from "../Utils/Helpers";
import Preloader from "../Components/Preloader";
import { FaCalendarAlt } from "react-icons/fa";

export default function Payment() {
  // ─── Top-level tab state ───────────────────────────────────────────────────
  const [ActiveTab, setActiveTab] = useState("billing"); // "billing" | "patients"

  // ─── Billing & Payment state ───────────────────────────────────────────────
  const [IsLoading, setIsLoading] = useState(true);
  const [All, setAll] = useState(true);
  const [Paid, setPaid] = useState(false);
  const [Pending, setPending] = useState(false);
  const [Trigger, setTrigger] = useState(false);
  const [OldPayload, setOldPayload] = useState("");
  const [Data, setData] = useState([]);
  const [FilterData, setFilterData] = useState([]);
  const [ModalState, setModalState] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [FilterUser, setFilterUser] = useState({});

  // Billing search/filter
  const [SearchInput, setSearchInput] = useState("");
  const [FilteredData, setFilteredData] = useState(null);
  const [ByDate, setByDate] = useState(false);
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");

  // Billing pagination
  const [CurrentPage, setCurrentPage] = useState(1);
  const [PostPerPage, setPostPerPage] = useState(configuration.sizePerPage);
  const [TotalData, setTotalData] = useState("");
  const [Status, setStatus] = useState("pending payment");
  const [Key, setKey] = useState("");
  const [Value, setValue] = useState("");

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

  const getFilteredBilling = async (key, value) => {
    setKey(key);
    setValue(value);
    try {
      setIsLoading(true);
      const result = await GetAllFilteredPaymentGroupOptApi(
        Status,
        key,
        value,
        CurrentPage,
        PostPerPage
      );
      console.log("all filtered payment", result);
      if (result.status === true) {
        setFilteredData(result.queryresult.paymentdetails);
        setTotalData(result.queryresult.totalpaymentdetails);
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
      getFilteredBilling("MRN", SearchInput);
    } else if (title === "email") {
      getFilteredBilling("email", SearchInput);
    } else if (title === "firstName") {
      getFilteredBilling("firstName", SearchInput);
    } else if (title === "lastName") {
      getFilteredBilling("lastName", SearchInput);
    } else if (title === "phoneNumber") {
      getFilteredBilling("phoneNumber", SearchInput);
    } else if (title === "ref") {
      getFilteredBilling("paymentreference", SearchInput);
    } else if (title === "hmoId") {
      getFilteredBilling("HMOId", SearchInput);
    } else if (title === "date") {
      let endDate = new Date(EndDate);
      endDate.setDate(endDate.getDate() + 1);
      let formatedEndDate = endDate.toISOString().split("T")[0];
      let filter = Data.filter(
        (item) =>
          item.createdAt >= StartDate && item.createdAt <= formatedEndDate
      );
      setFilteredData(filter);
      setSearchInput("s");
    }
  };

  const getAllPayment = async (status) => {
    try {
      setIsLoading(true);
      const result = await GetAllPaymentGroupOptApi(
        CurrentPage,
        PostPerPage,
        status
      );
      console.log("result getAllPaymentGroup", result);
      if (result.status === true) {
        setData(result.queryresult.paymentdetails);
        setFilterData(result.queryresult.paymentdetails);
        setTotalData(result.queryresult.totalpaymentdetails);
      }
    } catch (e) {
      console.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAll = () => {
    setAll(true);
    setPaid(false);
    getAllPayment("pending payment");
    setStatus("pending payment");
    setCurrentPage(1);
  };

  const filterPaid = () => {
    setAll(false);
    setPaid(true);
    getAllPayment("paid");
    setStatus("paid");
    setCurrentPage(1);
  };

  const onChangeStatus = async (item) => {
    setOldPayload(item);
    onOpen();
  };

  const { pathname } = useLocation();
  const nav = useNavigate();

  const PrintReceipt = (item) => {
    nav(`/dashboard/billing-payment/receipt/${item.paymentreference}`);
    localStorage.setItem("pathname", pathname);
  };

  const activateNotifications = (message, status) => {
    setShowToast({ show: true, message: message, status: status });
    setTimeout(() => {
      setShowToast({ show: false });
    }, 5000);
  };

  useEffect(() => {
    if (ActiveTab === "billing") {
      if (FilteredData?.length > 0 || FilteredData !== null) {
        getFilteredBilling(Key, Value);
      } else {
        if (All === true) {
          getAllPayment("pending payment");
        } else {
          getAllPayment("paid");
        }
      }
    }
  }, [isOpen, Trigger, CurrentPage, ActiveTab]);

  // ─── Patient Registration state ────────────────────────────────────────────
  const [PAll, setPAll] = useState(true);
  const [PActive, setPActive] = useState(false);
  const [PInactive, setPInactive] = useState(false);
  const [PData, setPData] = useState([]);
  const [PFilterData, setPFilterData] = useState([]);
  const [PTotalData, setPTotalData] = useState("");
  const [PIsLoading, setPIsLoading] = useState(false);

  // Patient search/filter
  const [PSearchInput, setPSearchInput] = useState("");
  const [PFilteredData, setPFilteredData] = useState(null);
  const [PByDate, setPByDate] = useState(false);
  const [PStartDate, setPStartDate] = useState("");
  const [PEndDate, setPEndDate] = useState("");
  const [PKey, setPKey] = useState("");
  const [PValue, setPValue] = useState("");

  // Patient pagination
  const [PCurrentPage, setPCurrentPage] = useState(1);
  const [PPostPerPage] = useState(configuration.sizePerPage);

  // Patient modal state
  const [PModalState, setPModalState] = useState("");
  const {
    isOpen: isPOpen,
    onOpen: onPOpen,
    onClose: onPClose,
  } = useDisclosure();
  const [PFilterPatient, setPFilterPatient] = useState({});
  const [fundWalletOpen, setFundWalletOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState("");

  // Wallet transactions modal state
  const [walletTxOpen, setWalletTxOpen] = useState(false);
  const [walletTxPatient, setWalletTxPatient] = useState(null);

  // Refund request modal state
  const [refundOpen, setRefundOpen] = useState(false);
  const [refundPatient, setRefundPatient] = useState(null);

  const handleViewWalletTx = (item) => {
    setWalletTxPatient(item);
    setWalletTxOpen(true);
  };

  const handleRefundRequest = (item) => {
    setRefundPatient(item);
    setRefundOpen(true);
  };

  const router = useNavigate();

  const pPaginate = (pageNumber) => {
    setPCurrentPage(pageNumber);
  };

  const getFilteredPatient = async (key, value) => {
    setPKey(key);
    setPValue(value);
    try {
      setPIsLoading(true);
      const result = await GetAllFilteredPatientsApi(
        key,
        value,
        PCurrentPage,
        PPostPerPage
      );
      console.log("all filtered patient", result);
      if (result.status === true) {
        setPFilteredData(result.queryresult.patientdetails);
        setPTotalData(result.queryresult.totalpatientdetails);
      }
    } catch (e) {
      console.error(e.message);
    } finally {
      setPIsLoading(false);
    }
  };

  const pFilterBy = (title) => {
    if (title === "mrn") {
      getFilteredPatient("MRN", PSearchInput);
    } else if (title === "email") {
      getFilteredPatient("email", PSearchInput);
    } else if (title === "FirstName") {
      getFilteredPatient("firstName", PSearchInput);
    } else if (title === "LastName") {
      getFilteredPatient("lastName", PSearchInput);
    } else if (title === "phoneNumber") {
      getFilteredPatient("phoneNumber", PSearchInput);
    } else if (title === "hmoId") {
      getFilteredPatient("HMOId", PSearchInput);
    } else if (title === "date") {
      let endDate = new Date(PEndDate);
      endDate.setDate(endDate.getDate() + 1);
      let formatedEndDate = endDate.toISOString().split("T")[0];
      let filter = PData.filter(
        (item) =>
          item.createdAt >= PStartDate && item.createdAt <= formatedEndDate
      );
      setPFilteredData(filter);
      setPSearchInput("s");
    }
  };

  const getAllPatient = async () => {
    try {
      setPIsLoading(true);
      const result = await GetAllPatientsApi(PCurrentPage, PPostPerPage);
      console.log("all patient", result);
      if (result.status === true) {
        setPData(result.queryresult.patientdetails);
        setPFilterData(result.queryresult.patientdetails);
        setPTotalData(result.queryresult.totalpatientdetails);
      }
    } catch (e) {
      console.error(e.message);
    } finally {
      setPIsLoading(false);
    }
  };

  const pFilterAll = () => {
    setPAll(true);
    setPActive(false);
    setPInactive(false);
    setPFilterData(PData);
  };

  const pFilterActive = () => {
    setPAll(false);
    setPActive(true);
    setPInactive(false);
    const activePatients = PData.filter(
      (item) => item.status?.toLowerCase() === "active"
    );
    setPFilterData(activePatients);
  };

  const pFilterInactive = () => {
    setPAll(false);
    setPActive(false);
    setPInactive(true);
    const inactivePatients = PData.filter(
      (item) => item.status?.toLowerCase() === "inactive"
    );
    setPFilterData(inactivePatients);
  };

  const onPEdit = (id) => {
    const filteredpatient = PData.filter((patient) => patient._id === id);
    setPFilterPatient(filteredpatient);
    setPModalState("edit");
    onPOpen();
  };

  const onPView = (id) => {
    router(`/dashboard/patient/${id}`);
  };

  const CreatePatient = () => {
    setPModalState("new");
    onPOpen();
  };

  const handleFundWallet = (id) => {
    setSelectedPatientId(id);
    setFundWalletOpen(true);
  };

  useEffect(() => {
    if (ActiveTab === "patients") {
      if (PFilteredData?.length > 0 || PFilteredData !== null) {
        getFilteredPatient(PKey, PValue);
      } else {
        getAllPatient();
      }
    }
  }, [isPOpen, PCurrentPage, ActiveTab]);

  // ─── Tab switch handler ────────────────────────────────────────────────────
  const switchTab = (tab) => {
    setActiveTab(tab);
    if (tab === "billing" && Data.length === 0) {
      getAllPayment("pending payment");
    }
    if (tab === "patients" && PData.length === 0) {
      getAllPatient();
    }
  };

  return (
    <MainLayout>
      {(IsLoading || PIsLoading) && <Preloader />}
      <Seo title="Billing & Payment" description="Care Connect Billing & Payment" />

      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}

      {/* Page Header */}
      <HStack>
        <Text color="#1F2937" fontWeight="600" fontSize="19px">
          {ActiveTab === "billing" ? "Payment" : "Patient Registration"}
        </Text>
        <Text color="#667085" fontWeight="400" fontSize="18px">
          ({ActiveTab === "billing"
            ? TotalData.toLocaleString()
            : PTotalData.toLocaleString()}
          )
        </Text>
      </HStack>
      <Text color="#686C75" mt="9px" fontWeight="400" fontSize="15px">
        {ActiveTab === "billing"
          ? "Confirm and manage pending payment from patient from one place"
          : "Create, View and manage all Patients in one place. Quickly assign statuses, and update details as needed."}
      </Text>

      {/* ─── Top-level Tab Switcher ──────────────────────────────────────── */}
      <HStack
        mt="16px"
        mb="0"
        borderBottom="2px solid #EFEFEF"
        spacing="0"
      >
        <Box
          onClick={() => switchTab("billing")}
          cursor="pointer"
          pb="10px"
          px="18px"
          borderBottom={ActiveTab === "billing" ? "2px solid #EA5937" : "2px solid transparent"}
          mb="-2px"
        >
          <Text
            fontWeight={ActiveTab === "billing" ? "600" : "400"}
            fontSize="14px"
            color={ActiveTab === "billing" ? "#EA5937" : "#667085"}
          >
            Billing &amp; Payment
          </Text>
        </Box>
        <Box
          onClick={() => switchTab("patients")}
          cursor="pointer"
          pb="10px"
          px="18px"
          borderBottom={ActiveTab === "patients" ? "2px solid #EA5937" : "2px solid transparent"}
          mb="-2px"
        >
          <Text
            fontWeight={ActiveTab === "patients" ? "600" : "400"}
            fontSize="14px"
            color={ActiveTab === "patients" ? "#EA5937" : "#667085"}
          >
            Patient Registration
          </Text>
        </Box>
      </HStack>

      {/* ═══════════════════════════════════════════════════════════════════
          BILLING & PAYMENT TAB
      ═══════════════════════════════════════════════════════════════════ */}
      {ActiveTab === "billing" && (
        <Box
          bg="#fff"
          border="1px solid #EFEFEF"
          mt="12px"
          py="17px"
          px={["18px", "18px"]}
          rounded="10px"
        >
          {/* filter section */}
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
                  All Pending
                </Text>
              </Box>
              <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterPaid}>
                <Text
                  py="8.5px"
                  px="12px"
                  bg={Paid ? "#fff" : "transparent"}
                  rounded="7px"
                  color={"#1F2937"}
                  fontWeight={"500"}
                  fontSize={"13px"}
                >
                  Paid
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
                    onChange={(e) => {
                      setSearchInput(e.target.value);
                      setCurrentPage(1);
                    }}
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
                      onClick={() => filterBy("firstName")}
                      textTransform="capitalize"
                      fontWeight={"500"}
                      color="#2F2F2F"
                      _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
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
                      _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
                    >
                      <HStack fontSize="14px">
                        <Text>by Last Name</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => filterBy("mrn")}
                      textTransform="capitalize"
                      fontWeight={"500"}
                      color="#2F2F2F"
                      _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
                    >
                      <HStack fontSize="14px">
                        <Text>by Patient MRN</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => filterBy("phoneNumber")}
                      textTransform="capitalize"
                      fontWeight={"500"}
                      color="#2F2F2F"
                      _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
                    >
                      <HStack fontSize="14px">
                        <Text>by Phone Number</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => filterBy("ref")}
                      textTransform="capitalize"
                      fontWeight={"500"}
                      color="#2F2F2F"
                      _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
                    >
                      <HStack fontSize="14px">
                        <Text>by Reference No</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => setByDate(true)}
                      textTransform="capitalize"
                      fontWeight={"500"}
                      color="#2F2F2F"
                      _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
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
                        filterAll();
                        setCurrentPage(1);
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
          {/* filter section end */}

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
                      patient name
                    </Th>
                    <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      MRN
                    </Th>
                    <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      phone
                    </Th>
                    <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      age
                    </Th>
                    <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      Reference No
                    </Th>
                    <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      Total Amount
                    </Th>
                    <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      date created
                    </Th>
                    <Th fontSize="13px" textTransform="capitalize" color="#534D59" fontWeight="600">
                      actions
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {SearchInput === "" || FilteredData === null ? (
                    FilterData?.map((item, i) => (
                      <TableRow
                        key={i}
                        type="payment-group"
                        name={`${item?.firstName || ""} ${item?.lastName || ""}`}
                        email={item.email}
                        age={item.age}
                        phone={item.phoneNumber}
                        mrn={item.MRN}
                        reference={item.paymentreference}
                        quantity={item.qty}
                        total={item.amount}
                        status={item.status}
                        paymentType={item.paymentype}
                        date={moment(item.createdAt).format("lll")}
                        onClick={() => onChangeStatus(item)}
                        onPrint={() => PrintReceipt(item)}
                      />
                    ))
                  ) : SearchInput !== "" && FilteredData?.length > 0 ? (
                    FilteredData?.map((item, i) => (
                      <TableRow
                        key={i}
                        type="payment-group"
                        name={`${item?.firstName || ""} ${item?.lastName || ""}`}
                        email={item.email}
                        age={item.age}
                        phone={item.phoneNumber}
                        mrn={item.MRN}
                        total={item.amount}
                        status={item.status}
                        reference={item.paymentreference}
                        quantity={item.qty}
                        paymentType={item.paymentype}
                        date={moment(item.createdAt).format("lll")}
                        onClick={() => onChangeStatus(item)}
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
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          PATIENT REGISTRATION TAB
      ═══════════════════════════════════════════════════════════════════ */}
      {ActiveTab === "patients" && (
        <Box
          bg="#fff"
          border="1px solid #EFEFEF"
          mt="12px"
          py="17px"
          px={["18px", "18px"]}
          rounded="10px"
        >
          {/* filter section */}
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
              <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={pFilterAll}>
                <Text
                  py="8.5px"
                  px="12px"
                  bg={PAll ? "#fff" : "transparent"}
                  rounded="7px"
                  color={"#1F2937"}
                  fontWeight={"500"}
                  fontSize={"13px"}
                >
                  All{" "}
                  <Box color="#667085" as="span" fontWeight="400" fontSize="13px">
                    ({PData?.length.toLocaleString()})
                  </Box>
                </Text>
              </Box>
              <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={pFilterActive}>
                <Text
                  py="8.5px"
                  px="12px"
                  bg={PActive ? "#fff" : "transparent"}
                  rounded="7px"
                  color={"#1F2937"}
                  fontWeight={"500"}
                  fontSize={"13px"}
                >
                  Active
                </Text>
              </Box>
              <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={pFilterInactive}>
                <Text
                  py="8.5px"
                  px="12px"
                  bg={PInactive ? "#fff" : "transparent"}
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
                {PByDate === false ? (
                  <Input
                    label="Search"
                    onChange={(e) => {
                      setPSearchInput(e.target.value);
                      setPCurrentPage(1);
                    }}
                    value={PSearchInput}
                    bColor="#E4E4E4"
                    leftIcon={<BiSearch />}
                  />
                ) : (
                  <HStack flexWrap={["wrap", "nowrap"]}>
                    <Input
                      label="Start Date"
                      type="date"
                      onChange={(e) => setPStartDate(e.target.value)}
                      value={PStartDate}
                      bColor="#E4E4E4"
                      leftIcon={<FaCalendarAlt />}
                    />
                    <Input
                      label="End Date"
                      type="date"
                      onChange={(e) => setPEndDate(e.target.value)}
                      value={PEndDate}
                      bColor="#E4E4E4"
                      leftIcon={<FaCalendarAlt />}
                    />
                    <Flex
                      onClick={() => pFilterBy("date")}
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
                      onClick={() => pFilterBy("FirstName")}
                      textTransform="capitalize"
                      fontWeight={"500"}
                      color="#2F2F2F"
                      _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
                    >
                      <HStack fontSize="14px">
                        <Text>by FirstName</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => pFilterBy("LastName")}
                      textTransform="capitalize"
                      fontWeight={"500"}
                      color="#2F2F2F"
                      _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
                    >
                      <HStack fontSize="14px">
                        <Text>by LastName</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => pFilterBy("mrn")}
                      textTransform="capitalize"
                      fontWeight={"500"}
                      color="#2F2F2F"
                      _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
                    >
                      <HStack fontSize="14px">
                        <Text>by MRN</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => pFilterBy("phoneNumber")}
                      textTransform="capitalize"
                      fontWeight={"500"}
                      color="#2F2F2F"
                      _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
                    >
                      <HStack fontSize="14px">
                        <Text>by Phone Number</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => pFilterBy("hmoId")}
                      textTransform="capitalize"
                      fontWeight={"500"}
                      color="#2F2F2F"
                      _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
                    >
                      <HStack fontSize="14px">
                        <Text>by HMO ID</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => pFilterBy("email")}
                      textTransform="capitalize"
                      fontWeight={"500"}
                      color="#2F2F2F"
                      _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
                    >
                      <HStack fontSize="14px">
                        <Text>by Email</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => setPByDate(true)}
                      textTransform="capitalize"
                      fontWeight={"500"}
                      color="#2F2F2F"
                      _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
                    >
                      <HStack fontSize="14px">
                        <Text>by date</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setPFilteredData(null);
                        setPSearchInput("");
                        setPByDate(false);
                        setPStartDate("");
                        setPEndDate("");
                        getAllPatient();
                        setPCurrentPage(1);
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

          {/* Add Patient Button */}
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

          {/* Patient Table */}
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
                      Patient Type
                    </Th>
                    <Th fontSize="12px" fontWeight="600" color="#534D59">
                      Authorization Code
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
                      Wallet Balance
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
                  {PSearchInput === "" || PFilteredData === null ? (
                    PFilterData?.map((item, i) => (
                      <TableRowX
                        key={i}
                        type="patient-management"
                        name={`${item.firstName} ${item.lastName}`}
                        email={item.email}
                        mrn={item.MRN}
                        phone={item.phoneNumber}
                        code={item.authorizationcode}
                        patientType={item.patienttype}
                        age={item.age}
                        gender={item.gender}
                        status={item.status}
                        hmoStatus={item.isHMOCover}
                        hmoId={item.HMOId}
                        walletBalance={item.walletBalance || 0}
                        date={moment(item.createdAt).format("lll")}
                        onEdit={() => onPEdit(item._id)}
                        onView={() => onPView(item._id)}
                        onFundWallet={() => handleFundWallet(item._id)}
                        onViewWalletTx={() => handleViewWalletTx(item)}
                        onRefund={() => handleRefundRequest(item)}
                        hideEdit={true}
                        hideDelete={true}
                        hideView={true}
                      />
                    ))
                  ) : PSearchInput !== "" && PFilteredData?.length > 0 ? (
                    PFilteredData?.map((item, i) => (
                      <TableRowX
                        key={i}
                        type="patient-management"
                        name={`${item.firstName} ${item.lastName}`}
                        email={item.email}
                        mrn={item.MRN}
                        phone={item.phoneNumber}
                        code={item.authorizationcode}
                        patientType={item.patienttype}
                        age={item.age}
                        gender={item.gender}
                        status={item.status}
                        hmoStatus={item.isHMOCover}
                        hmoId={item.HMOId}
                        walletBalance={item.walletBalance || 0}
                        date={moment(item.createdAt).format("lll")}
                        onEdit={() => onPEdit(item._id)}
                        onView={() => onPView(item._id)}
                        onFundWallet={() => handleFundWallet(item._id)}
                        onViewWalletTx={() => handleViewWalletTx(item)}
                        onRefund={() => handleRefundRequest(item)}
                        hideEdit={true}
                        hideDelete={true}
                        hideView={true}
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
              postPerPage={PPostPerPage}
              currentPage={PCurrentPage}
              totalPosts={PTotalData}
              paginate={pPaginate}
            />
          </Box>
        </Box>
      )}

      {/* Billing modal */}
      <PaymentGroupModal
        isOpen={isOpen}
        onClose={onClose}
        type={ModalState}
        filteredUser={FilterUser}
        oldPayload={OldPayload}
        activateNotifications={activateNotifications}
      />

      {/* Patient modals */}
      <CreatePatientModal
        isOpen={isPOpen}
        onClose={onPClose}
        type={PModalState}
        filteredpatient={PFilterPatient}
      />
      <FundWalletModal
        isOpen={fundWalletOpen}
        onClose={() => setFundWalletOpen(false)}
        patientId={selectedPatientId}
        onSuccess={getAllPatient}
      />
      <WalletTransactionsModal
        isOpen={walletTxOpen}
        onClose={() => setWalletTxOpen(false)}
        patientId={walletTxPatient?._id}
        patientName={walletTxPatient ? `${walletTxPatient.firstName} ${walletTxPatient.lastName}` : ""}
      />
      <RefundRequestModal
        isOpen={refundOpen}
        onClose={() => setRefundOpen(false)}
        patient={refundPatient}
        onSuccess={getAllPatient}
      />
    </MainLayout>
  );
}
