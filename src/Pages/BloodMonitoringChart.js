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
  Td, 
  Spinner,
  TableContainer,
} from "@chakra-ui/react";
import { BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import { SlPlus } from "react-icons/sl";

import TableRowY from "../Components/TableRowY";
import Button from "../Components/Button";
import Input from "../Components/Input";
import Pagination from "../Components/Pagination";
import { configuration } from "../Utils/Helpers";
import { ReadAllBloodMonitoringByAdmissionApi } from "../Utils/ApiCalls";
import BloodMonitoringChartModal from "../Components/BloodMonitoringChartModal";

const BloodMonitoringChart = () => {

  const [bloodData, setBloodData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [byDate, setByDate] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = configuration.sizePerPage;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChart, setSelectedChart] = useState(null);
  const [modalType, setModalType] = useState("create");
  const [refreshData, setRefreshData] = useState(false);

  /* admissionId */
  const storedPatient = localStorage.getItem("inPatient");
  const patient = storedPatient ? JSON.parse(storedPatient) : null;
  const admissionId =
    patient && patient.admission && Array.isArray(patient.admission)
      ? patient.admission[0]
      : localStorage.getItem("admissionId");

  /* fetch */
  useEffect(() => {
    if (!admissionId) return;
    setLoading(true);
    ReadAllBloodMonitoringByAdmissionApi(admissionId)
      .then((res) => {
        const raw = res?.queryresult?.bloodmonitoringdetails || [];
        const mapped = raw.map((item) => ({
          id: item._id,
          date: new Date(item.datetime).toLocaleDateString(),         
          time: new Date(item.datetime).toLocaleTimeString(),          
          createdDate: new Date(item.createdAt).toLocaleDateString(),  
          testType: item.typeoftestRBSFBS,
          rbsFbsValue: item.value,
          bloodMonitoringSign: item.staffname,
          specialization: item.admission?.admittospecialization || "N/A",
          ward: item.admission?.referedward || "N/A",
          createdBy: item.admission?.doctorname || "N/A",
        }));
        setBloodData(mapped);
        setFilteredData(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blood monitoring data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [admissionId, refreshData]);

  /* filter */
  useEffect(() => {
    let data = [...bloodData];
    if (filter === "date") {
      if (startDate && endDate) {
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);
        const endISO = end.toISOString().split("T")[0];
        data = data.filter((i) => {
          const d = new Date(i.date).toISOString().split("T")[0];
          return d >= startDate && d <= endISO;
        });
      }
    } else if (filter === "testType") {
      data = data.filter((i) =>
        i.testType.toLowerCase().includes(searchInput.toLowerCase())
      );
    } else if (filter === "createdBy") {
      data = data.filter((i) =>
        i.createdBy.toLowerCase().includes(searchInput.toLowerCase())
      );
    }
    setFilteredData(data);
    setCurrentPage(1);
  }, [filter, searchInput, startDate, endDate, bloodData]);

  /* pagination */
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const paginatedData = filteredData.slice(indexOfFirst, indexOfLast);

  /* modal helpers */
  const handleAdd = () => {
    setModalType("create");
    setSelectedChart(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id) => {
    const chart = bloodData.find((i) => i.id === id);
    if (!chart) return;
    setModalType("edit");
    setSelectedChart({
      id: chart.id,
      typeoftestRBSFBS: chart.testType,
      value: chart.rbsFbsValue,
      datetime: chart.datetime,
    });
    setIsModalOpen(true);
  };

  /* ui */
  return (
    <Box p={["10px", "20px"]}>
      {/* header */}
      <Flex justifyContent="space-between" flexWrap="wrap" mb="20px">
        <Button rightIcon={<SlPlus />} onClick={handleAdd} w={["100%", "100%", "260px"]}>
          Add Blood Monitoring Chart
        </Button>

        {/* search & filter */}
        <Flex flexWrap="wrap" mt={["10px", "10px", "0"]} alignItems="center" justifyContent="flex-end">
          <HStack spacing="4">
            {/* search / date range */}
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
                    onClick={() => setFilter("date")}
                  >
                    <BiSearch />
                  </Flex>
                </HStack>
              )}
            </Box>

            {/* filter menu */}
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
                    setFilter("testType");
                    setByDate(false);
                    setSearchInput("");
                    setStartDate("");
                    setEndDate("");
                  }}
                >
                  by Test Type
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setFilter("createdBy");
                    setByDate(false);
                    setSearchInput("");
                    setStartDate("");
                    setEndDate("");
                  }}
                >
                  by Created By
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setFilter("date");
                    setByDate(true);
                  }}
                >
                  by Date
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setFilter("all");
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
                <Th fontSize="13px" fontWeight="600">Date</Th>
                <Th fontSize="13px" fontWeight="600">Time</Th>
                <Th fontSize="13px" fontWeight="600">Test Type</Th>
                <Th fontSize="13px" fontWeight="600">Value (mmol/L)</Th>
                <Th fontSize="13px" fontWeight="600">Staff Name</Th>
                <Th fontSize="13px" fontWeight="600">Created Date</Th> 
                <Th fontSize="13px" fontWeight="600">Actions</Th>
              </Tr>
            </Thead>

            <Tbody>
              {loading ? (
                <Tr>
                  <Td colSpan={7}>
                    <Flex justifyContent="center" py="20px">
                      <Spinner />
                    </Flex>
                  </Td>
                </Tr>
              ) : error ? (
                <Tr>
                  <Td colSpan={7}>
                    <Text color="red.500" textAlign="center">
                      {error}
                    </Text>
                  </Td>
                </Tr>
              ) : (
                paginatedData.map((row) => (
                  <TableRowY
                    key={row.id}
                    type="blood-monitoring-chart"
                    date={row.date}
                    bloodMonitoringTime={row.time}
                    testType={row.testType}
                    rbsFbsValue={row.rbsFbsValue}
                    bloodMonitoringSign={row.bloodMonitoringSign}
                    createdAt={row.createdDate}            
                    onEdit={() => handleEdit(row.id)}
                  />
                ))
              )}
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
      <BloodMonitoringChartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        admissionId={admissionId}
        onSuccess={() => setRefreshData((p) => !p)}
        type={modalType}
        initialData={selectedChart}
      />
    </Box>
  );
};

export default BloodMonitoringChart;
