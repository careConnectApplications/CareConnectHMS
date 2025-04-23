import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Flex,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  TableContainer,
} from "@chakra-ui/react";
import { SlPlus } from "react-icons/sl";
import { BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";

import Pagination from "../Components/Pagination";
import Button from "../Components/Button";
import Input from "../Components/Input";
import TableRowY from "../Components/TableRowY";
import { configuration } from "../Utils/Helpers";
import { ReadAllTubeFeedingChartByAdmissionApi } from "../Utils/ApiCalls";
import TubeFeedingChartModal from "../Components/TubeFeedingChartModal";

const TubeFeedingChart = () => {
  /* ---------------- state ---------------- */
  const [tubeFeedingData, setTubeFeedingData] = useState([]);
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
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalType, setModalType] = useState("create");

  const [trigger, setTrigger] = useState(false);

  /* admissionId */
  const storedPatient = localStorage.getItem("inPatient");
  const patient = storedPatient ? JSON.parse(storedPatient) : null;
  const admissionId =
    patient && patient.admission && Array.isArray(patient.admission)
      ? patient.admission[0]
      : localStorage.getItem("admissionId");

  /* ---------------- fetch ---------------- */
  useEffect(() => {
    if (!admissionId) return;
    setLoading(true);
    ReadAllTubeFeedingChartByAdmissionApi(admissionId)
      .then((res) => {
        const data = res || [];
        const transformed = data.map((item) => {
          const dt = new Date(item.Datetimefeeds);
          return {
            id: item._id,
            datetimefeeds: dt.toLocaleString(),                 // full date & time
            createdDate: new Date(item.createdAt).toLocaleDateString(),
            amount: item.amount,
            feed: item.feed,
            servedBy: item.staffname,
          };
        });
        setTubeFeedingData(transformed);
        setFilteredData(transformed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tube feeding data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [admissionId, trigger]);

  /* ---------------- filter ---------------- */
  useEffect(() => {
    let data = [...tubeFeedingData];

    if (filter === "tubeFeedingTime") {
      data = data.filter((i) =>
        i.datetimefeeds.toLowerCase().includes(searchInput.toLowerCase())
      );
    } else if (filter === "date" && startDate && endDate) {
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1);
      const endISO = end.toISOString().split("T")[0];
      data = data.filter((i) => {
        const d = new Date(i.datetimefeeds).toISOString().split("T")[0];
        return d >= startDate && d <= endISO;
      });
    }

    setFilteredData(data);
    setCurrentPage(1);
  }, [filter, searchInput, startDate, endDate, tubeFeedingData]);

 
  const lastIdx = currentPage * itemsPerPage;
  const firstIdx = lastIdx - itemsPerPage;
  const paginatedData = filteredData.slice(firstIdx, lastIdx);

 
  const handleAdd = () => {
    setModalType("create");
    setSelectedRecord(null);
    setIsModalOpen(true);
  };
  const handleEdit = (record) => {
    setModalType("edit");
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  return (
    <Box p={["10px", "20px"]}>
      {/* Header */}
      <Flex justifyContent="space-between" flexWrap="wrap" mb="20px">
        <Button rightIcon={<SlPlus />} onClick={handleAdd} w={["100%", "100%", "250px"]}>
          Add Tube Feeding Chart
        </Button>

        {/* Search & Filter */}
        <Flex flexWrap="wrap" mt={["10px", "10px", "0"]} alignItems="center" justifyContent="flex-end">
          <HStack spacing="4">
            <Box flex="1">
              {!byDate ? (
                <Input
                  label="Search"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setFilter("tubeFeedingTime");
                  }}
                  leftIcon={<BiSearch />}
                  bColor="#E4E4E4"
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

            {/* Filter menu */}
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
                    setFilter("tubeFeedingTime");
                    setByDate(false);
                    setSearchInput("");
                    setStartDate("");
                    setEndDate("");
                  }}
                >
                  by Datetimefeeds
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

      {/* Table */}
      <Box bg="#fff" border="1px solid #EFEFEF" rounded="md" overflowX="auto" mt="12px" py="15px" px="15px">
        {loading ? (
          <Flex justifyContent="center" py="40px">
            <Spinner />
          </Flex>
        ) : error ? (
          <Text color="red.500" textAlign="center" py="40px">
            {error}
          </Text>
        ) : (
          <TableContainer>
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th fontSize="13px" fontWeight="600">Date / Time</Th>
                  <Th fontSize="13px" fontWeight="600">Amount (ml)</Th>
                  <Th fontSize="13px" fontWeight="600">Feed</Th>
                  <Th fontSize="13px" fontWeight="600">Staff Name</Th>
                  <Th fontSize="13px" fontWeight="600">Created Date</Th>
                  <Th fontSize="13px" fontWeight="600">Actions</Th>
                </Tr>
              </Thead>

              <Tbody>
                {paginatedData.map((row) => (
                  <TableRowY
                    key={row.id}
                    type="tube-feeding-chart"
                    tubeFeedingDatetimefeeds={row.datetimefeeds}
                    tubeFeedingAmount={row.amount}
                    tubeFeedingFeed={row.feed}
                    servedBy={row.servedBy}
                    createdDate={row.createdDate}
                    onEdit={() => handleEdit(row)}
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Pagination */}
      {filteredData.length > itemsPerPage && !loading && (
        <Pagination
          postPerPage={itemsPerPage}
          currentPage={currentPage}
          totalPosts={filteredData.length}
          paginate={setCurrentPage}
        />
      )}

      {/* Modal */}
      <TubeFeedingChartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setTrigger((p) => !p)}
        admissionId={admissionId}
        type={modalType}
        initialData={modalType === "edit" ? selectedRecord : null}
      />
    </Box>
  );
};

export default TubeFeedingChart;
