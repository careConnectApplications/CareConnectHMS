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
  TableContainer,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input as ChakraInput,
} from "@chakra-ui/react";
import { SlPlus } from "react-icons/sl";
import { BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import { IoMdArrowRoundBack } from "react-icons/io";
import { configuration } from "../Utils/Helpers";
import SingleVitalScoreModal from "../Components/SingleVitalScoreModal";
import TableRowY from "../Components/TableRowY";
import Pagination from "../Components/Pagination";
import Button from "../Components/Button";
import Input from "../Components/Input";
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";
import { GetAllVitalSignScoresByTheatreAdmissionApi } from "../Utils/ApiCalls";
import { useNavigate } from "react-router-dom";

export default function TheatreVitalSignScores() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const itemsPerPage = configuration.sizePerPage;
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedItem, setSelectedItem] = useState(null);
  const [trigger, setTrigger] = useState(false);

  const [filter, setFilter] = useState("all"); // all | bp | staffname
  const [searchInput, setSearchInput] = useState("");
  const [byDate, setByDate] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const stored = localStorage.getItem("recoveryChartRecord");
  const chartId = stored ? JSON.parse(stored)._id : null;

  const nav = useNavigate();
  const returnPath = localStorage.getItem("pathname") || "/";

  // fetch
  useEffect(() => {
    if (!chartId) return;
    setLoading(true);
    GetAllVitalSignScoresByTheatreAdmissionApi(chartId)
      .then((res) => {
        const items = res.queryresult.vitalsignscoredetails || [];
        const tx = items.map((item) => ({
          id: item._id,
          consciousness: item.consciousness,
          ventilation: item.ventilation,
          movement: item.movement,
          total: item.total,
          bp: item.bp,
          pulserate: item.pulserate,
          respiration: item.respiration,
          color: item.color,
          temperature: item.temperature,
          time: item.time,
          staffname: item.staffname || "Unknown",
          createdAt: item.createdAt,
        }));
        setData(tx);
        setFilteredData(tx);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [chartId, trigger]);

  // filter & search
  useEffect(() => {
    let result = [...data];
    if (filter === "bp") {
      result = result.filter((d) =>
        d.bp.toLowerCase().includes(searchInput.toLowerCase())
      );
    } else if (filter === "staffname") {
      result = result.filter((d) =>
        d.staffname.toLowerCase().includes(searchInput.toLowerCase())
      );
    } else if (filter === "date" && startDate && endDate) {
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1);
      const endStr = end.toISOString().split("T")[0];
      result = result.filter(
        (d) => d.time.slice(0, 10) >= startDate && d.time.slice(0, 10) <= endStr
      );
    }
    setFilteredData(result);
    setCurrentPage(1);
  }, [filter, searchInput, startDate, endDate, data]);

  const lastIdx = currentPage * itemsPerPage;
  const firstIdx = lastIdx - itemsPerPage;
  const paginated = filteredData.slice(firstIdx, lastIdx);

  const openCreate = () => {
    setModalType("create");
    setSelectedItem(null);
    setIsModalOpen(true);
  };
  const openEdit = (item) => {
    setModalType("edit");
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <MainLayout>
      <Seo title="Vital Sign Scores" description="Manage vital sign scores" />
      <Box p={["10px", "20px"]}>
        <Button
          leftIcon={<IoMdArrowRoundBack />}
          px="12px"
          w="80px"
          onClick={() => nav(returnPath)}
        >
          Back
        </Button>

        <Flex justify="space-between" wrap="wrap" my="20px">
          <Button rightIcon={<SlPlus />} onClick={openCreate} w="250px">
            Add Vital Score
          </Button>

          <Flex wrap="wrap" align="center" justify="flex-end">
            <HStack spacing="4">
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
                    <ChakraInput
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <ChakraInput
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
                      cursor="pointer"
                      onClick={() => setFilter("date")}
                    >
                      <BiSearch />
                    </Flex>
                  </HStack>
                )}
              </Box>

              <Menu isLazy>
                <MenuButton>
                  <HStack
                    border="1px solid #EA5937"
                    rounded="7px"
                    cursor="pointer"
                    py="11.6px"
                    px="16.9px"
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
                      setFilter("bp");
                      setByDate(false);
                      setSearchInput("");
                    }}
                  >
                    by BP
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setFilter("staffname");
                      setByDate(false);
                      setSearchInput("");
                    }}
                  >
                    by Staff Name
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setFilter("date");
                      setByDate(true);
                    }}
                  >
                    by Time
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setFilter("all");
                      setByDate(false);
                      setSearchInput("");
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

        <Box
          bg="#fff"
          border="1px solid #EFEFEF"
          rounded="md"
          overflowX="auto"
          py="15px"
          px="15px"
        >
          {loading ? (
            <Flex justify="center" py="40px">
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
                    <Th>Consciousness</Th>
                    <Th>Ventilation</Th>
                    <Th>Movement</Th>
                    <Th>Total</Th>
                    <Th>BP</Th>
                    <Th>Pulse</Th>
                    <Th>Respiration</Th>
                    <Th>Color</Th>
                    <Th>Temperature</Th>
                    <Th>Time</Th>
                    <Th>Staff</Th>
                    <Th>Created On</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {paginated.map((item) => (
                    <TableRowY
                      key={item.id}
                      type="vital-score"
                      consciousness={item.consciousness}
                      ventilation={item.ventilation}
                      movement={item.movement}
                      total={item.total}
                      bp={item.bp}
                      pulserate={item.pulserate}
                      respiration={item.respiration}
                      color={item.color}
                      temperature={item.temperature}
                      time={item.time}
                      staffname={item.staffname}
                      createdAt={item.createdAt}
                      onEdit={() => openEdit(item)}
                    />
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </Box>

        {filteredData.length > itemsPerPage && !loading && (
          <Pagination
            postPerPage={itemsPerPage}
            currentPage={currentPage}
            totalPosts={filteredData.length}
            paginate={setCurrentPage}
          />
        )}

        <SingleVitalScoreModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          chartId={chartId}
          type={modalType}
          initialData={selectedItem}
          onSuccess={() => setTrigger((v) => !v)}
        />
      </Box>
    </MainLayout>
  );
}
