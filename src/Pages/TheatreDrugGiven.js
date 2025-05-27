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
import SingleDrugGivenModal from "../Components/SingleDrugGivenModal";
import TableRowY from "../Components/TableRowY";
import Pagination from "../Components/Pagination";
import Button from "../Components/Button";
import Input from "../Components/Input";
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";
import { GetAllDrugGivenByTheatreAdmissionApi } from "../Utils/ApiCalls";
import { useNavigate, useLocation } from "react-router-dom";

export default function TheatreDrugGiven() {
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

  const [filter, setFilter] = useState("all"); // all | date | staffname | druggiven
  const [searchInput, setSearchInput] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [byDate, setByDate] = useState(false);

  const stored = localStorage.getItem("anaesthesiaRecord");
  const anaesthesiaId = stored ? JSON.parse(stored)._id : null;

  const nav = useNavigate();
  const returnPath = localStorage.getItem("pathname") || "/";

  // fetch all drug givens
  useEffect(() => {
    if (!anaesthesiaId) return;
    setLoading(true);
    GetAllDrugGivenByTheatreAdmissionApi(anaesthesiaId)
      .then((res) => {
        const items = res.queryresult.druggivendetails || [];
        const tx = items.map((item) => ({
          id: item._id,
          druggiven: item.druggiven,
          timegiven: item.timegiven.slice(0, 10),
          bp: item.bp,
          pulse: item.pulse,
          temp: item.temp,
          staffname: item.staffname || "Unknown",
          createdAt: item.createdAt.slice(0, 10),
        }));
        setData(tx);
        setFilteredData(tx);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [anaesthesiaId, trigger]);

  // apply search / filter
  useEffect(() => {
    let result = [...data];
    if (filter === "druggiven") {
      result = data.filter((d) =>
        d.druggiven.toLowerCase().includes(searchInput.toLowerCase())
      );
    } else if (filter === "staffname") {
      result = data.filter((d) =>
        d.staffname.toLowerCase().includes(searchInput.toLowerCase())
      );
    } else if (filter === "date" && startDate && endDate) {
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1);
      const endStr = end.toISOString().split("T")[0];
      result = data.filter(
        (d) => d.timegiven >= startDate && d.timegiven <= endStr
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
      <Seo
        title="Theatre Drug Given"
        description="Manage drugs given during theatre anaesthesia"
      />
      <Box p={["10px", "20px"]}>
        {/* Back button */}
        <Box mb="20px">
          <Button
            leftIcon={<IoMdArrowRoundBack />}
            px="12px"
            w="80px"
            onClick={() => nav(returnPath)}
          >
            Back
          </Button>
        </Box>

        {/* Add, Search, Filter */}
        <Flex justifyContent="space-between" flexWrap="wrap" mb="20px">
          <Button
            rightIcon={<SlPlus />}
            onClick={openCreate}
            w={["100%", "100%", "250px"]}
          >
            Add Drug Given
          </Button>

          <Flex
            flexWrap="wrap"
            mt={["10px", "10px", "0"]}
            alignItems="center"
            justifyContent="flex-end"
          >
            <HStack spacing="4">
              <Box flex="1">
                {!byDate ? (
                  <Input
                    label="Search"
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value);
                      setFilter("druggiven");
                    }}
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
                      setFilter("druggiven");
                      setByDate(false);
                      setSearchInput("");
                    }}
                  >
                    by Drug Given
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
                    by Date
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

        {/* Table */}
        <Box
          bg="#fff"
          border="1px solid #EFEFEF"
          rounded="md"
          overflowX="auto"
          mt="12px"
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
                    <Th fontSize="13px" fontWeight="600">
                      Drug Given
                    </Th>
                    <Th fontSize="13px" fontWeight="600">
                      Time Given
                    </Th>
                    <Th fontSize="13px" fontWeight="600">
                      BP
                    </Th>
                    <Th fontSize="13px" fontWeight="600">
                      Pulse
                    </Th>
                    <Th fontSize="13px" fontWeight="600">
                      Temp
                    </Th>
                    <Th fontSize="13px" fontWeight="600">
                      Staff Name
                    </Th>
                    <Th fontSize="13px" fontWeight="600">
                      Created On
                    </Th>
                    <Th fontSize="13px" fontWeight="600">
                      Actions
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {paginated.map((item) => (
                    <TableRowY
                      key={item.id}
                      type="drug-given-chart"
                      druggiven={item.druggiven}
                      timegiven={item.timegiven}
                      bp={item.bp}
                      pulse={item.pulse}
                      temp={item.temp}
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
        <SingleDrugGivenModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          anaesthesiaId={anaesthesiaId}
          type={modalType}
          initialData={selectedItem}
          onSuccess={() => setTrigger((v) => !v)}
        />
      </Box>
    </MainLayout>
  );
}
