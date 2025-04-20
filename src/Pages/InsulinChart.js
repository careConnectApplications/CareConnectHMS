import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Flex,
  HStack,
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
import { BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import { SlPlus } from "react-icons/sl";

import Button from "../Components/Button";
import Input from "../Components/Input";
import Pagination from "../Components/Pagination";
import TableRowY from "../Components/TableRowY";
import InsulinChartModal from "../Components/InsulinChartModal";

import { configuration } from "../Utils/Helpers";
import { ReadAllInsulinByAdmissionApi } from "../Utils/ApiCalls";

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

const InsulinChart = () => {
  const [insulinData, setInsulinData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [byDate, setByDate] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterByCriteria, setFilterByCriteria] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedInsulinChart, setSelectedInsulinChart] = useState(null);

  const [trigger, setTrigger] = useState(false);
  const itemsPerPage = configuration.sizePerPage;
  const admissionId = getAdmissionId();

  const fetchInsulinData = async () => {
    if (!admissionId) return;
    try {
      const res = await ReadAllInsulinByAdmissionApi(admissionId);
      const list =
        res?.queryresult?.insulindetails &&
        Array.isArray(res.queryresult.insulindetails)
          ? res.queryresult.insulindetails
          : [];
      setInsulinData(list);
      setFilteredData(list);
    } catch (e) {
      console.error("Error fetching insulin charts:", e);
    }
  };

  useEffect(() => {
    fetchInsulinData();
  }, [admissionId, trigger]);

  useEffect(() => {
    let data = [...insulinData];

    if (filterByCriteria === "insulinType") {
      data = data.filter((i) =>
        i.typeofinsulin.toLowerCase().includes(searchInput.toLowerCase())
      );
    } else if (filterByCriteria === "date" && startDate && endDate) {
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1);
      const endISO = end.toISOString().split("T")[0];
      data = data.filter((i) => {
        const d = new Date(i.dateandtimeofinsulinadministration)
          .toISOString()
          .split("T")[0];
        return d >= startDate && d <= endISO;
      });
    }

    setFilteredData(data);
    setCurrentPage(1);
  }, [filterByCriteria, searchInput, startDate, endDate, insulinData]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const paginatedData = filteredData.slice(indexOfFirst, indexOfLast);

  const handleAdd = () => {
    setModalType("create");
    setSelectedInsulinChart(null);
    setIsModalOpen(true);
  };
  const handleEdit = (chart) => {
    setModalType("edit");
    setSelectedInsulinChart(chart);
    setIsModalOpen(true);
  };
  const handleView = (chart) => {
    setModalType("view");
    setSelectedInsulinChart(chart);
    setIsModalOpen(true);
  };

  /* ---------------- UI ---------------- */
  return (
    <Box
      bg="#fff"
      border="1px solid #EFEFEF"
      mt="10px"
      py="17px"
      px="18px"
      rounded="10px"
    >
      {/* header */}
      <Flex justifyContent="space-between" flexWrap="wrap" mb="20px">
        <Button
          rightIcon={<SlPlus />}
          onClick={handleAdd}
          w={["100%", "100%", "250px"]}
        >
          Add Insulin Chart
        </Button>

        {/* search & filter */}
        <Flex
          flexWrap="wrap"
          mt={["10px", "10px", "0"]}
          alignItems="center"
          justifyContent="flex-end"
        >
          <HStack spacing="4">
            {/* search or date */}
            <Box flex="1">
              {!byDate ? (
                <Input
                  label="Search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  leftIcon={<BiSearch />}
                  bColor="#E4E4E4"
                />
              ) : (
                <HStack spacing="2">
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                  <Flex
                    bg="blue.blue500"
                    color="#fff"
                    px="5px"
                    py="3px"
                    rounded="5px"
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
                    setFilterByCriteria("insulinType");
                    setByDate(false);
                    setStartDate("");
                    setEndDate("");
                  }}
                >
                  by Insulin Type
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
      <Box mt="12px" py="15px" px="15px" rounded="10px" overflowX="auto">
        <TableContainer>
          <Table variant="striped">
            <Thead bg="#fff">
              <Tr>
                <Th fontSize="13px" fontWeight="600">
                  Date / Time
                </Th>
                <Th fontSize="13px" fontWeight="600">
                  Insulin Type
                </Th>
                <Th fontSize="13px" fontWeight="600">
                  RBS Value
                </Th>
                <Th fontSize="13px" fontWeight="600">
                  Dosage (IU)
                </Th>
                <Th fontSize="13px" fontWeight="600">
                  Route
                </Th>
                <Th fontSize="13px" fontWeight="600">
                  Staff Name
                </Th>
                <Th fontSize="13px" fontWeight="600">
                  Created Date
                </Th>
                <Th fontSize="13px" fontWeight="600">
                  Actions
                </Th>
              </Tr>
            </Thead>

            <Tbody>
              {paginatedData.map((item) => (
                <TableRowY
                  key={item._id}
                  type="insulin-chart"
                  date={new Date(
                    item.dateandtimeofinsulinadministration
                  ).toLocaleString()}
                  insulinType={item.typeofinsulin}
                  rbsValue={item.rbsvalue}
                  dosage={item.dosage}
                  route={item.route}
                  servedBy={item.staffname}
                  createdDate={new Date(
                    item.createdAt
                  ).toLocaleDateString()} /* NEW prop */
                  onEdit={() => handleEdit(item)}
                  onView={() => handleView(item)}
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
      <InsulinChartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        admissionId={modalType === "create" ? getAdmissionId() : undefined}
        onSuccess={() => setTrigger((p) => !p)}
        type={modalType}
        initialData={modalType !== "create" ? selectedInsulinChart : null}
      />
    </Box>
  );
};

export default InsulinChart;
