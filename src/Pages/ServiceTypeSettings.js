import React, { useState, useEffect } from "react";
import { Text, Flex, HStack, Box, useDisclosure, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, TableContainer } from "@chakra-ui/react";
import moment from "moment";
import TableRow from "../Components/TableRow";
import Button from "../Components/Button";
import CreateServiceTypeModal from "../Components/CreateServiceTypeModal";
import Input from "../Components/Input";
import ShowToast from "../Components/ToastNotification";
import { IoFilter } from "react-icons/io5";
import { BiSearch } from "react-icons/bi";
import { SlPlus } from "react-icons/sl";
import { GetAllServiceApi, UpdatePriceStatusApi } from "../Utils/ApiCalls";
import Pagination from "../Components/Pagination";
import { configuration } from "../Utils/Helpers";

export default function ServiceTypeSettings() {
  const [all, setAll] = useState(true);
  const [active, setActive] = useState(false);
  const [inActive, setInActive] = useState(false);
  const [data, setData] = useState([]); // full dataset
  const [filterData, setFilterData] = useState([]); // filtered dataset
  const [modalState, setModalState] = useState("");
  const [oldPayload, setOldPayload] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [trigger, setTrigger] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = configuration.sizePerPage;
  const [showToast, setShowToast] = useState({ show: false, message: "", status: "" });
  const [searchInput, setSearchInput] = useState("");

  // Calculate pagination indices
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const paginatedData = filterData.slice(indexOfFirstPost, indexOfLastPost);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getAllServiceType = async () => {
    try {
      const result = await GetAllServiceApi();
      console.log("getAllServiceType", result);
      setData(result.queryresult.servicetypedetails);
      setFilterData(result.queryresult.servicetypedetails);
    } catch (e) {
      activateNotifications(e.message, "error");
    }
  };

  const activateNotifications = (message, status) => {
    setShowToast({ show: true, message: message, status: status });
    setTimeout(() => {
      setShowToast({ show: false, message: "", status: "" });
    }, 3000);
  };

  // Status Filtering Functions
  const filterAll = () => {
    setAll(true);
    setActive(false);
    setInActive(false);
    setFilterData(data);
  };

  const filterActive = () => {
    setAll(false);
    setActive(true);
    setInActive(false);
    const filteredData = data.filter((item) => item.status === "active");
    setFilterData(filteredData);
  };

  const filterInactive = () => {
    setAll(false);
    setActive(false);
    setInActive(true);
    const filteredData = data.filter((item) => item.status === "inactive");
    setFilterData(filteredData);
  };

  // Search handler
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (value.trim() === "") {
      setFilterData(data);
    } else {
      const lower = value.toLowerCase();
      const filtered = data.filter((item) => {
        const serviceType = String(item.type || "").toLowerCase();
        const serviceCategory = String(item.category || "").toLowerCase();
        const department = String(item.department || "").toLowerCase();
        return serviceType.includes(lower) || serviceCategory.includes(lower) || department.includes(lower);
      });
      setFilterData(filtered);
    }
  };

  // Filter By dropdown handler
  const filterBy = (field) => {
    if (searchInput.trim() === "") {
      setFilterData(data);
      return;
    }
    const lower = searchInput.toLowerCase();
    if (field === "servicetype") {
      const filtered = data.filter((item) =>
        String(item.type || "").toLowerCase().includes(lower)
      );
      setFilterData(filtered);
    } else if (field === "servicecategory") {
      const filtered = data.filter((item) =>
        String(item.category || "").toLowerCase().includes(lower)
      );
      setFilterData(filtered);
    } else if (field === "department") {
      const filtered = data.filter((item) =>
        String(item.department || "").toLowerCase().includes(lower)
      );
      setFilterData(filtered);
    }
  };

  const clearFilter = () => {
    setSearchInput("");
    setFilterData(data);
  };

  // Define onChangeStatus to update status for a given service type entry.
  const onChangeStatus = async (id) => {
    try {
      const result = await UpdatePriceStatusApi(id);
      if (result.status === 200) {
        setTrigger(!trigger);
        setShowToast({ show: true, message: "Status Updated Successfully", status: "success" });
        setTimeout(() => setShowToast({ show: false, message: "", status: "" }), 3000);
      }
    } catch (err) {
      // Error handling if needed.
    }
  };

  const createServiceType = () => {
    setModalState("new");
    onOpen();
  };

  const editServiceType = (item) => {
    setModalState("edit");
    onOpen();
    setOldPayload(item);
  };

  useEffect(() => {
    getAllServiceType();
  }, [isOpen, trigger]);

  return (
    <Box bg="#fff" border="1px solid #EFEFEF" mt="10px" py="17px" px={["18px", "18px"]} rounded="10px">
      {showToast.show && <ShowToast message={showToast.message} status={showToast.status} />}

      {/* Filter & Search Section */}
      <Flex justifyContent="space-between" flexWrap="wrap" mb="20px">
        <Flex alignItems="center" flexWrap="wrap" bg="#E4F3FF" rounded="7px" py="3.5px" px="5px" cursor="pointer">
          <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterAll}>
            <Text py="8.5px" px="12px" bg={all ? "#fff" : "transparent"} rounded="7px" color="#1F2937" fontWeight="500" fontSize="13px">
              All <Box as="span" color="#667085" fontWeight="400" fontSize="13px">({data?.length})</Box>
            </Text>
          </Box>
          <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterActive}>
            <Text py="8.5px" px="12px" bg={active ? "#fff" : "transparent"} rounded="7px" color="#1F2937" fontWeight="500" fontSize="13px">
              Active
            </Text>
          </Box>
          <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterInactive}>
            <Text py="8.5px" px="12px" bg={inActive ? "#fff" : "transparent"} rounded="7px" color="#1F2937" fontWeight="500" fontSize="13px">
              Inactive
            </Text>
          </Box>
        </Flex>

        {/* Search Input & Filter Dropdown */}
        <Flex alignItems="center" mt={["10px", "0px"]}>
          <Box maxW="300px" mr="10px">
            <Input
              label="Search"
              placeholder="Search"
              value={searchInput}
              onChange={handleSearchChange}
              bColor="#E4E4E4"
              leftIcon={<BiSearch />}
            />
          </Box>
          <Menu isLazy>
            <MenuButton as={Box}>
              <HStack border="1px solid #EA5937" rounded="7px" cursor="pointer" py="11.64px" px="16.98px" bg="#f8ddd1" color="blue.blue500" fontWeight="500" fontSize="14px">
                <Text>Filter</Text>
                <IoFilter />
              </HStack>
            </MenuButton>
            <MenuList fontSize="14px">
              <MenuItem onClick={() => filterBy("servicetype")} textTransform="capitalize" fontWeight="500" color="#2F2F2F" _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}>
                By Service Type
              </MenuItem>
              <MenuItem onClick={() => filterBy("servicecategory")} textTransform="capitalize" fontWeight="500" color="#2F2F2F" _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}>
                By Service Category
              </MenuItem>
              <MenuItem onClick={() => filterBy("department")} textTransform="capitalize" fontWeight="500" color="#2F2F2F" _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}>
                By Clinic/Department
              </MenuItem>
              <MenuItem onClick={clearFilter} textTransform="capitalize" fontWeight="500" color="#2F2F2F" _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}>
                Clear Filter
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {/* Add Service Type Button */}
      <Flex justifyContent="space-between" flexWrap="wrap" mt={["10px", "10px", "10px", "10px"]} w={["100%", "100%", "50%", "37%"]}>
        <Button rightIcon={<SlPlus />} w={["100%", "100%", "165px", "205px"]} onClick={createServiceType}>
          Add Service Type
        </Button>
      </Flex>

      {/* Table Section */}
      <Box bg="#fff" border="1px solid #EFEFEF" mt="12px" py="15px" px="15px" rounded="10px" overflowX="auto">
        <TableContainer>
          <Table variant="striped">
            <Thead bg="#fff">
              <Tr>
                <Th fontSize="13px" color="#534D59" fontWeight="600">S/N</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Date</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Service Type</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Service Category</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Clinic/Department</Th>
                <Th fontSize="13px" color="#534D59" fontWeight="600">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedData.map((item, i) => (
                <TableRow
                  key={i}
                  type="serviceType-settings"
                  sn={i + 1}
                  date={moment(item.createdAt).format("lll")}
                  serviceType={item.type}
                  serviceCategory={item.category}
                  dept={item.department}
                  onEdit={() => editServiceType(item)}
                  onChangeStatus={() => onChangeStatus(item._id)}
                />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      {/* Pagination */}
      <Pagination postPerPage={postsPerPage} currentPage={currentPage} totalPosts={filterData.length} paginate={paginate} />

      <CreateServiceTypeModal
        isOpen={isOpen}
        oldPayload={oldPayload}
        onClose={onClose}
        type={modalState}
        activateNotifications={activateNotifications}
      />
    </Box>
  );
}
