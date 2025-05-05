// src/pages/NutritionPage.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
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
  Spinner,
} from "@chakra-ui/react";
import { BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import { SlPlus } from "react-icons/sl";

import TableRowY from "../Components/TableRowY";
import Button from "../Components/Button";
import Input from "../Components/Input";
import Pagination from "../Components/Pagination";
import { configuration } from "../Utils/Helpers";
import { ReadAllNutritionByPatientApi } from "../Utils/ApiCalls";
import NutritionModal from "../Components/NutritionModal";

const FIELD_LABELS = {
  all: "Everything",
  date: "Date",
  ageinmonths: "Age (months)",
  typeofvisit: "Visit Type",
  deworming: "Deworming",
};

export default function NutritionPage() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [allTab, setAllTab] = useState(true);
  const [filterField, setFilterField] = useState("all");
  const [searchInput, setSearchInput] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = configuration.sizePerPage;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [refreshData, setRefreshData] = useState(false);

  // grab patientId
  const stored = localStorage.getItem("inPatient");
  const patient = stored ? JSON.parse(stored) : null;
  const patientId = patient?._id || null;

  // fetch on mount or refresh
  useEffect(() => {
    if (!patientId) return;
    setLoading(true);
    ReadAllNutritionByPatientApi(patientId)
      .then((res) => {
        const raw = res?.queryresult?.nutritiondetails || [];
        const mapped = raw.map((item) => ({
          id: item._id,
          date: new Date(item.date).toLocaleDateString(),
          ageinmonths: item.ageinmonths,
          typeofvisit: item.typeofvisit,
          infactandyoungchildfeeding: item.infactandyoungchildfeeding,
          complementaryfeeding: item.complementaryfeeding,
          counsellingprovided: item.counsellingprovided,
          referedtosupportgroup: item.referedtosupportgroup,
          anthropometryheight: item.anthropometryheight,
          anthropometryweight: item.anthropometryweight,
          anthropometrybilateraloedema: item.anthropometrybilateraloedema,
          muacred: item.muacred,
          muacyellow: item.muacyellow,
          muacgreen: item.muacgreen,
          growthaccordingtothechildhealthcard:
            item.growthaccordingtothechildhealthcard,
          vitaminasupplement: item.vitaminasupplement,
          deworming: item.deworming,
        }));
        setData(mapped);
        setFilteredData(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching nutrition data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [patientId, refreshData]);

  // re-filter when search or filterField changes
  useEffect(() => {
    let list = data;
    const term = searchInput.trim().toLowerCase();

    if (term) {
      if (filterField === "all") {
        list = data.filter((row) =>
          Object.values(row).some((val) =>
            String(val).toLowerCase().includes(term)
          )
        );
      } else {
        list = data.filter((row) =>
          String(row[filterField]).toLowerCase().includes(term)
        );
      }
      setAllTab(false);
    } else {
      // no search term
      if (allTab) {
        list = data;
      } else {
        // keep filteredData as-is
        list = filteredData;
      }
    }

    setFilteredData(list);
    setCurrentPage(1);
  }, [searchInput, filterField, data]);

  // restore all
  const filterAll = () => {
    setAllTab(true);
    setFilterField("all");
    setSearchInput("");
    setFilteredData(data);
  };

  const handleSelectFilter = (field) => {
    setFilterField(field);
    setSearchInput("");
    setAllTab(false);
  };

  // pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const paginatedData = filteredData.slice(indexOfFirst, indexOfLast);

  // modal handlers
  const handleAdd = () => {
    setModalType("create");
    setSelectedRecord(null);
    setIsModalOpen(true);
  };
  const handleEdit = (id) => {
    const rec = filteredData.find((r) => r.id === id);
    if (!rec) return;
    setModalType("edit");
    setSelectedRecord(rec);
    setIsModalOpen(true);
  };

  return (
    <Box p={["10px", "20px"]}>
      {/* --- Status & Search Bar --- */}
      <Flex justify="space-between" wrap="wrap" mb="20px">
        {/* Status Tab */}
        <Flex align="center" bg="#E4F3FF" rounded="7px" py="3px" px="5px">
          <Box onClick={filterAll}>
            <Text
              py="8px"
              px="12px"
              bg={allTab ? "#fff" : "transparent"}
              rounded="7px"
              fontWeight="500"
              fontSize="13px"
              color="#1F2937"
            >
              All{" "}
              <Box as="span" color="#667085" fontWeight="400" fontSize="13px">
                ({data.length})
              </Box>
            </Text>
          </Box>
        </Flex>

        {/* Search & Filter */}
        <Flex align="center" wrap="wrap" mt={["10px", "0"]}>
          <HStack spacing="4">
            <Input
              label={
                filterField === "all"
                  ? "Search"
                  : `Search by ${FIELD_LABELS[filterField]}`
              }
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              bColor="#E4E4E4"
              leftIcon={<BiSearch />}
            />

            <Menu isLazy>
              <MenuButton as={Box}>
                <HStack
                  border="1px solid #EA5937"
                  rounded="7px"
                  cursor="pointer"
                  py="11px"
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
              <MenuList>
                {Object.entries(FIELD_LABELS)
                  .filter(([key]) => key !== "all")
                  .map(([key, label]) => (
                    <MenuItem
                      key={key}
                      onClick={() => handleSelectFilter(key)}
                      fontWeight="500"
                      fontSize="14px"
                      py="6px"
                      px="10px"
                    >
                      by {label}
                    </MenuItem>
                  ))}
                <MenuItem
                  onClick={filterAll}
                  _hover={{
                    bg: "blue.blue500",
                    color: "#fff",
                  }}
                  fontWeight="500"
                  fontSize="14px"
                  py="6px"
                  px="10px"
                >
                  Clear filter
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Flex>

      {/* Add button */}
      <Flex justify="flex-start" mb="12px">
        <Button
          rightIcon={<SlPlus />}
          onClick={handleAdd}
          w={["100%", "100%", "154px", "154px"]}
          px={"120px"}
        >
          Add Nutrition
        </Button>
      </Flex>

      {/* --- Data Table --- */}
      <Box
        bg="#fff"
        border="1px solid #EFEFEF"
        rounded="md"
        overflowX="auto"
        py="15px"
        px="15px"
      >
        <TableContainer>
          <Table variant="striped">
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Age (months)</Th>
                <Th>Visit Type</Th>
                <Th>Infant & Young Child Feeding</Th>
                <Th>Complementary Feeding</Th>
                <Th>Counselling Provided</Th>
                <Th>Referred to Support Group</Th>
                <Th>Height</Th>
                <Th>Weight</Th>
                <Th>Bilateral Oedema</Th>
                <Th>MUAC Red</Th>
                <Th>MUAC Yellow</Th>
                <Th>MUAC Green</Th>
                <Th>Growth (Card)</Th>
                <Th>Vitamin A</Th>
                <Th>Deworming</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {loading ? (
                <Tr>
                  <Th colSpan={17}>
                    <Flex justify="center" py="20px">
                      <Spinner />
                    </Flex>
                  </Th>
                </Tr>
              ) : error ? (
                <Tr>
                  <Th colSpan={17}>
                    <Text color="red.500" textAlign="center">
                      {error}
                    </Text>
                  </Th>
                </Tr>
              ) : (
                paginatedData.map((row) => (
                  <TableRowY
                    key={row.id}
                    type="nutrition"
                    {...row}
                    onEdit={() => handleEdit(row.id)}
                  />
                ))
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      {/* Pagination */}
      {filteredData.length > itemsPerPage && (
        <Pagination
          postPerPage={itemsPerPage}
          currentPage={currentPage}
          totalPosts={filteredData.length}
          paginate={setCurrentPage}
        />
      )}

      {/* Nutrition Modal */}
      <NutritionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patientId={patientId}
        onSuccess={() => setRefreshData((p) => !p)}
        type={modalType}
        initialData={selectedRecord}
      />
    </Box>
  );
}
