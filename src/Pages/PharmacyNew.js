import React, { useState, useEffect } from "react";
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
  TableContainer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import TableRowY from "../Components/TableRowY";
import Pagination from "../Components/Pagination";
import Button from "../Components/Button";
import Input from "../Components/Input";
import Preloader from "../Components/Preloader";
import ShowToast from "../Components/ToastNotification";
import { BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import { SlPlus } from "react-icons/sl";
import Seo from "../Utils/Seo";
import { configuration } from "../Utils/Helpers";
import PharmacyModal from "../Components/PharmacyModal";
import PharmacyOrderModal from "../Components/PharmacyOrderModal";
import PharmacyWithoutConfirmationModal from "../Components/PharmacyWithoutConfirmationModal";
import {
  GroupReadAllFilteredPharmacyOptApi,
  GroupReadAllPharmacyOptApi,
  DispenseApi,
} from "../Utils/ApiCalls";
import { FaCalendarAlt } from "react-icons/fa";
import ConfirmPharmacyOrderModal from "../Components/ConfirmPharmacyOrderModal";

export default function PharmacyNew() {
  const [selectedOrderData, setSelectedOrderData] = useState(null);

  // Data states
  const [OriginalData, setOriginalData] = useState([]); // full dataset
  const [FilterData, setFilterData] = useState([]); // status-filtered data
  const [SearchInput, setSearchInput] = useState("");
  const [FilteredData, setFilteredData] = useState(null); // search filter result

  // Date filter states
  const [ByDate, setByDate] = useState(false);
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");

  // Status filter states (left unchanged)
  const [All, setAll] = useState(true);
  const [Paid, setPaid] = useState(false);
  const [Pending, setPending] = useState(false);
  const [Dispensed, setDispensed] = useState(false);
  const [Trigger, setTrigger] = useState(false);

  // Modal states
  // modalType "new" => PharmacyModal (Place Order)
  // modalType "confirm" => ConfirmPharmacyOrderModal (Confirm order)
  const [modalType, setModalType] = useState("new");
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Pagination states
  const [CurrentPage, setCurrentPage] = useState(1);
  const PostPerPage = configuration.sizePerPage;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Toast state
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

  const [IsLoading, setIsLoading] = useState(false);

  const [Status, setStatus] = useState("pending");
  const [TotalData, setTotalData] = useState("");

  const fetchData = async (status) => {
    setIsLoading(true);
    try {
      // Use the GroupReadAllPharmacyOptApi here
      const data = await GroupReadAllPharmacyOptApi(
        status,
        CurrentPage,
        PostPerPage
      );
      console.log("Group API response:", data);
      setOriginalData(data.queryresult.pharmacydetails);
      setFilterData(data.queryresult.pharmacydetails);
      setTotalData(data.queryresult.totalpharmacydetails);
    } catch (error) {
      console.error("Error fetching data:", error);
      setShowToast({
        show: true,
        message: "Error fetching data",
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Default search change handler (searches by patient name, prescriber, orderid, and MRN)
  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchInput(value);
    setCurrentPage(1);
  };

  const [Key, setKey] = useState("");
  const [Value, setValue] = useState("");

  const getFilteredpharmacy = async (key, value) => {
    setKey(key);
    setValue(value);

    try {
      setIsLoading(true);
      const result = await GroupReadAllFilteredPharmacyOptApi(
        Status,
        CurrentPage,
        PostPerPage,
        key,
        value
      );
      console.log("all fitlered pharmacy", result);
      if (result.status === true) {
        setFilteredData(result.queryresult.pharmacydetails);
        setTotalData(result.queryresult.totalpharmacydetails);
      }
    } catch (e) {
      console.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter by specific field: "patient", "prescriber", "mrn", "date", "orderid"
  const filterBy = (field) => {
    if (field === "mrn") {
      getFilteredpharmacy("MRN", SearchInput);
    } else if (field === "prescriber") {
      getFilteredpharmacy("prescriber", SearchInput);
    } else if (field === "firstName") {
      getFilteredpharmacy("firstName", SearchInput);
    } else if (field === "lastName") {
      getFilteredpharmacy("lastName", SearchInput);
    } else if (field === "orderid") {
      getFilteredpharmacy("orderid", SearchInput);
    } else if (field === "date") {
      if (StartDate && EndDate) {
        let endDateObj = new Date(EndDate);
        endDateObj.setDate(endDateObj.getDate() + 1);
        const formattedEndDate = endDateObj.toISOString().split("T")[0];
        const filtered = OriginalData.filter((item) => {
          const createdDate = item.createdAt.split("T")[0];
          return createdDate >= StartDate && createdDate <= formattedEndDate;
        });
        setFilteredData(filtered);
      }
    }
  };

  const clearFilter = () => {
    setFilteredData(null);
    setSearchInput("");
    setByDate(false);
    setStartDate("");
    setEndDate("");
    filterPending();
    setCurrentPage(1);
  };

  // Status filtering functions (left unchanged)
  const filterPending = () => {
    setAll(true);
    setPaid(false);
    setPending(false);
    setDispensed(false);

    fetchData("pending");
    setStatus("pending");
    setCurrentPage(1);
  };

  const filterAwaitingConfirmation = () => {
    setAll(false);
    setPaid(true);
    setDispensed(false);
    fetchData("confirmation");
    setStatus("confirmation");
    setCurrentPage(1);
  };

  const filterDispensed = () => {
    setAll(false);
    setPaid(false);
    setDispensed(true);
    fetchData("dispense");
    setStatus("dispense");
    setCurrentPage(1);
  };

  // Modal and order handlers
  // For placing a new order
  const handleTakeOrderClick = (pharmacy) => {
    setModalType("new");
    setSelectedPharmacy(pharmacy);
    onOpen();
  };

  // For confirming an order that is "awaiting confirmation"
  const handleConfirmOrderClick = (pharmacyId) => {
    setModalType("confirm");
    setSelectedPharmacy(pharmacyId);
    const selectedOrder = OriginalData.find(
      (order) => order.orderid === pharmacyId
    );
    setSelectedOrderData(selectedOrder);
    onOpen();
  };

  // Handle Dispense as in the initial code
  const handleDispense = async (prescriptionId) => {
    try {
      const response = await DispenseApi(prescriptionId);
      console.log("Dispensed successfully:", response);
      const successMessage =
        response?.msg || "Prescription dispensed successfully!";
      setShowToast({
        show: true,
        message: successMessage,
        status: "success",
      });
      setTimeout(() => setShowToast({ show: false }), 3000);
      setTrigger(!Trigger);
    } catch (error) {
      console.error("Error dispensing prescription:", error);
      const errorMessage =
        error?.response?.data?.msg || "Failed to dispense prescription";
      setShowToast({
        show: true,
        message: errorMessage,
        status: "error",
      });
      setTimeout(() => setShowToast({ show: false }), 3000);
    }
  };

  const handleConfirmClick = (orderId) => {
    setSelectedOrderId(orderId);
    setOrderModalOpen(true);
  };

  // Reusable local toast (via ShowToast)
  const handleSuccess = (message, status) => {
    setShowToast({
      show: true,
      message: message,
      status: status,
    });
    setTimeout(() => {
      setShowToast({ show: false, message: "", status: "" });
    }, 3000);
    setTrigger(!Trigger);
  };

  useEffect(() => {
    if (FilteredData?.length > 0 || FilteredData !== null) {
      getFilteredpharmacy(Key, Value);
    } else {
      if (All === true) {
        fetchData("pending");
      } else if (Paid === true) {
        fetchData("confirmation");
      } else if (Dispensed === true) {
        fetchData("dispense");
      }
    }
  }, [Trigger, CurrentPage]);

  return (
    <MainLayout>
      {IsLoading && <Preloader />}
      <Seo title="Pharmacy" description="Manage your pharmacy records" />
      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}
      <HStack>
        <Text color="#1F2937" fontWeight="600" fontSize="19px">
          Pharmacy
        </Text>
        <Text color="#667085" fontWeight="400" fontSize="18px">
          ({TotalData})
        </Text>
      </HStack>
      <Text color="#686C75" mt="9px" fontWeight="400" fontSize="15px">
        Manage your pharmacy records, track prescriptions, and view patient
        details.
      </Text>

      {/* Filter Section */}
      <Box
        bg="#fff"
        border="1px solid #EFEFEF"
        mt="12px"
        py="17px"
        px={["18px", "18px"]}
        rounded="10px"
      >
        <Flex justifyContent="space-between" flexWrap="wrap">
          {/* Status Filter Buttons */}
          <Flex
            alignItems="center"
            flexWrap="wrap"
            bg="#E4F3FF"
            rounded="7px"
            py="3.5px"
            px="5px"
            cursor="pointer"
            mt="10px"
          >
            <Box
              borderRight="1px solid #EDEFF2"
              pr="5px"
              onClick={filterPending}
            >
              <Text
                py="8.5px"
                px="12px"
                bg={All ? "#fff" : "transparent"}
                rounded="7px"
                color="#1F2937"
                fontWeight="500"
                fontSize="13px"
              >
                All Pending
              </Text>
            </Box>
            <Box
              borderRight="1px solid #EDEFF2"
              pr="5px"
              onClick={filterAwaitingConfirmation}
            >
              <Text
                py="8.5px"
                px="12px"
                bg={Paid ? "#fff" : "transparent"}
                rounded="7px"
                color="#1F2937"
                fontWeight="500"
                fontSize="13px"
              >
                Awaiting Confirmation
              </Text>
            </Box>
            <Box pr="5px" onClick={filterDispensed}>
              <Text
                py="8.5px"
                px="12px"
                bg={Dispensed ? "#fff" : "transparent"}
                rounded="7px"
                color="#1F2937"
                fontWeight="500"
                fontSize="13px"
              >
                Dispensed
              </Text>
            </Box>
          </Flex>

          {/* Search & Additional Filter Options */}
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
                  onChange={handleInputChange}
                  value={SearchInput}
                  bColor="#E4E4E4"
                  leftIcon={<BiSearch />}
                />
              ) : (
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
                <MenuList fontSize="14px">
                  <MenuItem
                    onClick={() => filterBy("firstName")}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    by First Name
                  </MenuItem>
                  <MenuItem
                    onClick={() => filterBy("lastName")}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    by Last Name
                  </MenuItem>
                  <MenuItem
                    onClick={() => filterBy("prescriber")}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    by Prescriber
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
                    by MRN
                  </MenuItem>
                  {/* New Menu Item for filtering by Order ID */}
                  <MenuItem
                    onClick={() => filterBy("orderid")}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    by Order ID
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
                    by Date
                  </MenuItem>
                  <MenuItem
                    onClick={clearFilter}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    clear filter
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>

          {/* Place Order Button */}
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
            onClick={handleTakeOrderClick}
          >
            Place Order
          </Button>
        </Flex>
      </Box>

      {/* Table Section */}
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
                  Order ID
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Patient Name
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
                  Creation Date
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Prescriber Name
                </Th>

                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  HMO Cover
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  HMO Name
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  HMO Plan
                </Th>

                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Appointment Date
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
                  Appointment ID
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Action
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {SearchInput === "" || FilteredData === null ? (
                FilterData.map((item, i) => (
                  <TableRowY
                    key={i}
                    type="pharmacy"
                    orderid={item.orderid}
                    patient={`${item.firstName || ""} ${item.lastName || ""}`}
                    email={item.email}
                    MRN={item.MRN}
                    createdDate={item.createdAt}
                    prescribersName={item.prescribersname}
                    isHMOCover={item.isHMOCover}
                    HMOName={item.HMOName}
                    HMOPlan={item.HMOPlan}
                    appointmentdate={item.appointmentdate}
                    clinic={item.clinic}
                    appointmentid={item.appointmentid}
                    onDispense={() => handleDispense(item.orderid)}
                    onConfirm={() => handleConfirmClick(item.orderid)}
                  />
                ))
              ) : FilteredData.length > 0 ? (
                FilteredData.map((item, i) => (
                  <TableRowY
                    key={i}
                    type="pharmacy"
                    orderid={item.orderid}
                    patient={`${item.firstName || ""} ${item.lastName || ""}`}
                    email={item.email}
                    MRN={item.MRN}
                    createdDate={item.createdAt}
                    prescribersName={item.prescribersname}
                    isHMOCover={item.isHMOCover || "N/A"}
                    HMOName={item.HMOName || "N/A"}
                    HMOPlan={item.HMOPlan || "N/A"}
                    appointmentdate={item.appointmentdate}
                    clinic={item.clinic || "N/A"}
                    appointmentid={item.appointmentid}
                    onDispense={() => handleDispense(item.orderid)}
                    onConfirm={() => handleConfirmClick(item.orderid)}
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

      {/* Render the appropriate modal */}
      {modalType === "confirm" ? (
        <ConfirmPharmacyOrderModal
          isOpen={isOpen}
          onClose={onClose}
          pharmacyId={selectedPharmacy}
          onSuccess={handleSuccess}
          order={selectedOrderData}
        />
      ) : (
        <PharmacyWithoutConfirmationModal
          isOpen={isOpen}
          onClose={onClose}
          onSuccess={handleSuccess}
        />
      )}

      {orderModalOpen && (
        <PharmacyOrderModal
          isOpen={orderModalOpen}
          onClose={() => setOrderModalOpen(false)}
          orderId={selectedOrderId}
          onConfirm={(prescriptionId) => {}}
          onDispense={(prescriptionId) => {}}
          onSuccess={handleSuccess}
        />
      )}
    </MainLayout>
  );
}
