import React, { useState, useEffect } from "react";
import {
  Text,
  Flex,
  HStack,
  Box,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, TableContainer } from "@chakra-ui/react";
import moment from "moment";
import { IoFilter } from "react-icons/io5";
import { BiSearch } from "react-icons/bi";
import { SlPlus } from "react-icons/sl";
import { FaCalendarAlt } from "react-icons/fa";
import TableRowY from "../Components/TableRowY";
import Button from "../Components/Button";
import CreateOutreachMedicationModal from "../Components/CreateOutreachMedicationModal";
import Input from "../Components/Input";
import ShowToast from "../Components/ToastNotification";
import Pagination from "../Components/Pagination";
import Preloader from "../Components/Preloader";
import { GetAllOutreachMedicationApi } from "../Utils/ApiCalls";
import { configuration } from "../Utils/Helpers";

export default function OutreachMedicationSettings() {
  // Data states
  const [data, setData] = useState([]); // Full dataset
  const [filterData, setFilterData] = useState([]); // Dataset filtered by status
  const [searchInput, setSearchInput] = useState("");
  const [filteredData, setFilteredData] = useState(null); // Search/date filter result

  // Status filter states
  const [allStatus, setAllStatus] = useState(true);
  const [activeStatus, setActiveStatus] = useState(false);
  const [inactiveStatus, setInactiveStatus] = useState(false);

  // Date filter states
  const [byDate, setByDate] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Modal states
  const [modalState, setModalState] = useState(""); // "new" or "edit"
  const [oldPayload, setOldPayload] = useState({}); // Data for editing

  // Toast state
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

  // Preloader state
  const [isLoading, setIsLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = configuration.sizePerPage || 10; // Fallback to 10 if undefined

  // Determine which dataset to display
  const dataToDisplay =
    searchInput === "" && !byDate ? filterData : filteredData || filterData;

  // Pagination calculations
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const paginatedData = dataToDisplay.slice(indexOfFirstPost, indexOfLastPost);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Fetch all outreach medications from API
  const getAllOutreachMedications = async () => {
    try {
      setIsLoading(true);
      const result = await GetAllOutreachMedicationApi();
      console.log("API Response - GetAllOutreachMedicationApi:", result);
      // Handle response by extracting outreachmedicationdetails
      const queryResult = result?.queryresult?.outreachmedicationdetails
        ? Array.isArray(result.queryresult.outreachmedicationdetails)
          ? result.queryresult.outreachmedicationdetails
          : [result.queryresult.outreachmedicationdetails]
        : [];
      setData(queryResult);
      setFilterData(queryResult);
      setFilteredData(null);
    } catch (e) {
      console.error("Error fetching outreach medications:", e);
      activateNotifications(e.message || "Failed to fetch outreach medications", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Notification function
  const activateNotifications = (message, status) => {
    setShowToast({ show: true, message, status });
    setTimeout(() => setShowToast({ show: false, message: "", status: "" }), 3000);
  };

  // Status filter functions
  const filterAllStatus = () => {
    setAllStatus(true);
    setActiveStatus(false);
    setInactiveStatus(false);
    setFilterData(data);
    setCurrentPage(1);
  };

  const filterActiveStatus = () => {
    setAllStatus(false);
    setActiveStatus(true);
    setInactiveStatus(false);
    const filtered = data.filter((item) => item.status?.toLowerCase() === "active");
    setFilterData(filtered);
    setCurrentPage(1);
  };

  const filterInactiveStatus = () => {
    setAllStatus(false);
    setActiveStatus(false);
    setInactiveStatus(true);
    const filtered = data.filter((item) => item.status?.toLowerCase() !== "active");
    setFilterData(filtered);
    setCurrentPage(1);
  };

  // Search input change handler
  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchInput(value);
    const filtered = data.filter((item) => {
      const medicationName = String(item.outreachmedicationname || "").toLowerCase();
      const medicationId = String(item.outreachmedicationid || "").toLowerCase();
      return medicationName.includes(value) || medicationId.includes(value);
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  // Filter by specific field
  const filterBy = (field) => {
    if (field === "outreachmedicationname") {
      const filtered = data.filter((item) =>
        String(item.outreachmedicationname || "").toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredData(filtered);
      setCurrentPage(1);
    } else if (field === "outreachmedicationid") {
      const filtered = data.filter((item) =>
        String(item.outreachmedicationid || "").toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredData(filtered);
      setCurrentPage(1);
    }
  };

  // Filter by date
  const filterByDate = () => {
    if (startDate && endDate) {
      let endDateObj = new Date(endDate);
      endDateObj.setDate(endDateObj.getDate() + 1);
      const formattedEndDate = endDateObj.toISOString().split("T")[0];
      const filtered = data.filter((item) => {
        const createdDate = item.createdAt.split("T")[0];
        return createdDate >= startDate && createdDate <= formattedEndDate;
      });
      setFilteredData(filtered);
      setCurrentPage(1);
    }
  };

  // Clear all filters
  const clearFilter = () => {
    setFilteredData(null);
    setSearchInput("");
    setByDate(false);
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  // Action handlers
  const viewOutreachMedication = (item) => {
    console.log("View outreach medication", item);
  };

  const editOutreachMedication = (item) => {
    setModalState("edit");
    setOldPayload(item);
    onOpen();
  };

  const createOutreachMedication = () => {
    setModalState("new");
    setOldPayload({});
    onOpen();
  };

  // Fetch data on mount or modal close
  useEffect(() => {
    getAllOutreachMedications();
  }, [isOpen]);

  return (
    <Box bg="#fff" border="1px solid #EFEFEF" mt="10px" py="17px" px={["18px", "18px"]} rounded="10px">
      {/* Preloader */}
      {isLoading && <Preloader />}

      {showToast.show && <ShowToast message={showToast.message} status={showToast.status} />}

      {/* Combined Status Filter and Search/Date Filter Section */}
      <Flex justifyContent="space-between" alignItems="center" flexWrap="wrap" mb="10px">
        {/* Status Filter */}
        <Flex
          alignItems="center"
          flexWrap="wrap"
          bg="#E4F3FF"
          rounded="7px"
          py="3.5px"
          px="5px"
          cursor="pointer"
        >
          <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterAllStatus}>
            <Text
              py="8.5px"
              px="12px"
              bg={allStatus ? "#fff" : "transparent"}
              rounded="7px"
              color="#1F2937"
              fontWeight="500"
              fontSize="13px"
            >
              All <Box as="span" color="#667085" fontWeight="400" fontSize="13px">({data?.length || 0})</Box>
            </Text>
          </Box>
          <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterActiveStatus}>
            <Text
              py="8.5px"
              px="12px"
              bg={activeStatus ? "#fff" : "transparent"}
              rounded="7px"
              color="#1F2937"
              fontWeight="500"
              fontSize="13px"
            >
              Active
            </Text>
          </Box>
          <Box onClick={filterInactiveStatus}>
            <Text
              py="8.5px"
              px="12px"
              bg={inactiveStatus ? "#fff" : "transparent"}
              rounded="7px"
              color="#1F2937"
              fontWeight="500"
              fontSize="13px"
            >
              Inactive
            </Text>
          </Box>
        </Flex>

        {/* Search / Date Filter Controls */}
        <HStack spacing="10px">
          {!byDate ? (
            <Input
              label="Search"
              onChange={handleInputChange}
              value={searchInput}
              bColor="#E4E4E4"
              leftIcon={<BiSearch />}
              width="250px"
            />
          ) : (
            <HStack>
              <Input
                label="Start Date"
                type="date"
                onChange={(e) => setStartDate(e.target.value)}
                value={startDate}
                bColor="#E4E4E4"
                leftIcon={<FaCalendarAlt />}
              />
              <Input
                label="End Date"
                type="date"
                onChange={(e) => setEndDate(e.target.value)}
                value={endDate}
                bColor="#E4E4E4"
                leftIcon={<FaCalendarAlt />}
              />
              <Box
                onClick={filterByDate}
                cursor="pointer"
                px="5px"
                py="3px"
                rounded="5px"
                bg="blue.blue500"
                color="#fff"
                display="flex"
                alignItems="center"
              >
                <BiSearch />
              </Box>
            </HStack>
          )}
          <Menu isLazy>
            <MenuButton as={Box} cursor="pointer">
              <HStack
                border="1px solid #EA5937"
                rounded="7px"
                py="10px"
                px="16px"
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
                onClick={() => filterBy("outreachmedicationname")}
                textTransform="capitalize"
                fontWeight="500"
                _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
              >
                By Medication Name
              </MenuItem>
              <MenuItem
                onClick={() => filterBy("outreachmedicationid")}
                textTransform="capitalize"
                fontWeight="500"
                _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
              >
                By Medication ID
              </MenuItem>
              <MenuItem
                onClick={() => setByDate(true)}
                textTransform="capitalize"
                fontWeight="500"
                _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
              >
                By Date
              </MenuItem>
              <MenuItem
                onClick={clearFilter}
                textTransform="capitalize"
                fontWeight="500"
                _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
              >
                Clear Filter
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      {/* Add Outreach Medication Button */}
      <Flex justifyContent="space-between" flexWrap="wrap" mb="10px" mt="10px">
        <Button
          onClick={createOutreachMedication}
          w={["100%", "100%", "165px", "250px"]}
          rightIcon={<SlPlus />}
        >
          Add Outreach Medication
        </Button>
      </Flex>

      {/* Table Section */}
      <Box bg="#fff" border="1px solid #EFEFEF" mt="12px" py="15px" px="15px" rounded="10px" overflowX="auto">
        <TableContainer>
          <Table variant="striped">
            <Thead bg="#fff">
              <Tr>
                <Th fontSize="13px" color="#534D59" fontWeight="600">S/N</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Medication Name</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Medication ID</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Status</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Date</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, i) => (
                  <TableRowY
                    key={item._id || i}
                    type="outreach-medication"
                    sn={indexOfFirstPost + i + 1}
                    outreachmedicationname={item.outreachmedicationname || "N/A"}
                    outreachmedicationid={item.outreachmedicationid || "N/A"}
                    status={item.status || "N/A"}
                    createdAt={moment(item.createdAt).format("lll") || "N/A"}
                    onEdit={() => editOutreachMedication(item)}
                    onClick={() => viewOutreachMedication(item)}
                  />
                ))
              ) : (
                <Tr>
                  <Th colSpan="6">
                    <Text textAlign="center">*--No record found--*</Text>
                  </Th>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      {/* Pagination */}
      {dataToDisplay.length > 0 && (
        <Pagination
          postPerPage={postsPerPage}
          currentPage={currentPage}
          totalPosts={dataToDisplay.length}
          paginate={paginate}
        />
      )}

      {/* Create Outreach Medication Modal */}
      <CreateOutreachMedicationModal
        isOpen={isOpen}
        onClose={onClose}
        oldPayload={oldPayload}
        type={modalState}
        activateNotifications={activateNotifications}
      />
    </Box>
  );
}