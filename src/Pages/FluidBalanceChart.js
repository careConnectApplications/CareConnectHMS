import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
} from "@chakra-ui/react";
import { BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import { SlPlus } from "react-icons/sl";

import Pagination from "../Components/Pagination";
import Button from "../Components/Button";
import Input from "../Components/Input";
import TableRowY from "../Components/TableRowY";
import FluidBalanceModal from "../Components/FluidBalanceModal";

import { configuration } from "../Utils/Helpers";
import { ReadAllFluidBalanceByAdmissionApi } from "../Utils/ApiCalls";


const getAdmissionId = () => {
  let admissionId = localStorage.getItem("admissionId");
  const stored = localStorage.getItem("inPatient");
  if (!admissionId && stored) {
    try {
      const patient = JSON.parse(stored);
      if (patient.admission && Array.isArray(patient.admission)) {
        admissionId = patient.admission[0];
      }
    } catch {
      admissionId = localStorage.getItem("admissionId");
    }
  }
  return admissionId;
};

const FluidBalanceChart = () => {

  const [fluidData, setFluidData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [filterByCriteria, setFilterByCriteria] = useState("all");

  const [byDate, setByDate] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = configuration.sizePerPage;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedFluidBalance, setSelectedFluidBalance] = useState(null);

  const [trigger, setTrigger] = useState(false);

  const admissionId = getAdmissionId();


  useEffect(() => {
    const fetchFluidData = async () => {
      if (!admissionId) return;
      try {
        const res = await ReadAllFluidBalanceByAdmissionApi(admissionId);
        const list =
          res?.queryresult?.fluidbalancesdetails && Array.isArray(res.queryresult.fluidbalancesdetails)
            ? res.queryresult.fluidbalancesdetails
            : [];
        setFluidData(list);
        setFilteredData(list);
      } catch (e) {
        console.error("Error fetching fluid balance data:", e);
      }
    };
    fetchFluidData();
  }, [admissionId, trigger]);


  useEffect(() => {
    let data = [...fluidData];

    if (filterByCriteria === "servedBy") {
      data = data.filter((i) => i.staffname.toLowerCase().includes(searchInput.toLowerCase()));
    } else if (filterByCriteria === "date" && startDate && endDate) {
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1);
      const endISO = end.toISOString().split("T")[0];
      data = data.filter((i) => {
        const d = new Date(i.createdAt).toISOString().split("T")[0];
        return d >= startDate && d <= endISO;
      });
    }

    setFilteredData(data);
    setCurrentPage(1);
  }, [filterByCriteria, searchInput, startDate, endDate, fluidData]);

 
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const paginatedData = filteredData.slice(indexOfFirst, indexOfLast);


  const handleAdd = () => {
    setModalType("create");
    setSelectedFluidBalance(null);
    setIsModalOpen(true);
  };
  const handleEdit = (record) => {
    setModalType("edit");
    setSelectedFluidBalance(record);
    setIsModalOpen(true);
  };
  const handleViewFluidBalance = (id) => {      
    const rec = fluidData.find((r) => r._id === id);
    if (rec) handleEdit(rec);
  };


  return (
    <Box p={["10px", "20px"]}>
      {/* header */}
      <Flex justifyContent="space-between" flexWrap="wrap" mb="20px">
        <Button rightIcon={<SlPlus />} onClick={handleAdd} w={["100%", "100%", "250px"]}>
          Add Fluid Balance Chart
        </Button>

        <Flex flexWrap="wrap" mt={["10px", "10px", "0"]} alignItems="center" justifyContent="flex-end">
          <HStack spacing="4">
            {/* search / dates */}
            <Box flex="1">
              {!byDate ? (
                <Input
                  label="Search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  bColor="#E4E4E4"
                  leftIcon={<BiSearch />}
                />
              ) : (
                <HStack spacing="2">
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  <Flex
                    bg="blue.blue500"
                    color="#fff"
                    px="5px"
                    py="3px"
                    rounded="5px"
                    cursor="pointer"
                    onClick={() => setFilterByCriteria("date")}
                  >
                    <BiSearch />
                  </Flex>
                </HStack>
              )}
            </Box>

            {/* filter */}
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
                >
                  <Text>Filter</Text>
                  <IoFilter />
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={() => {
                    setFilterByCriteria("servedBy");
                    setByDate(false);
                    setSearchInput("");
                    setStartDate("");
                    setEndDate("");
                  }}
                >
                  by Served By
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setFilterByCriteria("date");
                    setByDate(true);
                  }}
                >
                  by Date
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setFilterByCriteria("all");
                    setSearchInput("");
                    setByDate(false);
                    setStartDate("");
                    setEndDate("");
                  }}
                >
                  Clear Filter
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Flex>

      {/* table */}
      <Box bg="#fff" border="1px solid #EFEFEF" rounded="md" overflowX="auto" mt="12px" py="15px" px="15px">
        <TableContainer>
          <Table variant="striped">
            <Thead>
              <Tr>
              <Th fontSize="13px" fontWeight="600">Created On</Th>
                <Th fontSize="13px" fontWeight="600">Intake Type</Th>
                <Th fontSize="13px" fontWeight="600">Intake Route</Th>
                <Th fontSize="13px" fontWeight="600">Intake Amount (ml)</Th>
                <Th fontSize="13px" fontWeight="600">Output Type</Th>
                <Th fontSize="13px" fontWeight="600">Output Route</Th>
                <Th fontSize="13px" fontWeight="600">Output Amount (ml)</Th>
                <Th fontSize="13px" fontWeight="600">Staff Name</Th>
                
                <Th fontSize="13px" fontWeight="600">Actions</Th>
              </Tr>
            </Thead>

            <Tbody>
              {paginatedData.map((item) => (
                <TableRowY
                  key={item._id}
                  
                  type="fluid-balance-chart"
                  createdOn={new Date(item.createdAt).toLocaleString()}
                  intakeType={item.intaketype}
                  intakeRoute={item.intakeroute}
                  intakeAmount={item.intakeamount}
                  outputType={item.outputtype}
                  outputRoute={item.outputroute}
                  outputAmount={item.outputamount}
                  servedBy={item.staffname}
                  createdOn={new Date(item.createdAt).toLocaleString()}
                  onEdit={() => handleViewFluidBalance(item._id)}
                />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      {/* pagination */}
      {filteredData.length > itemsPerPage && (
        <Pagination
          postPerPage={itemsPerPage}
          currentPage={currentPage}
          totalPosts={filteredData.length}
          paginate={setCurrentPage}
        />
      )}

      {/* modal */}
      <FluidBalanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        admissionId={getAdmissionId()}
        onSuccess={() => setTrigger((p) => !p)}
        type={modalType}
        initialData={modalType === "edit" ? selectedFluidBalance : null}
      />
    </Box>
  );
};

export default FluidBalanceChart;
