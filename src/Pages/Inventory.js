import React, { useEffect, useState } from "react";
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
import { HiOutlineDocumentArrowUp } from "react-icons/hi2";
import { SlPlus } from "react-icons/sl";
import Seo from "../Utils/Seo";
import { configuration } from "../Utils/Helpers";
import InventoryModal from "../Components/InventoryModal";
import PharmacyBulkUploadModal from "../Components/PharmacyBulkUploadModal";
import { fetchPharmacyStock } from "../Utils/ApiCalls";
import { FaCalendarAlt } from "react-icons/fa";

export default function Inventory() {
  // Data states
  const [Data, setData] = useState([]);
  const [FilterData, setFilterData] = useState([]);
  const [SearchInput, setSearchInput] = useState("");

  // New state for filtering by a specific field.
  // "default" means filtering by serviceType and category (as before)
  // Other options: "productid", "serviceCategory", "amount", "serviceType", "category", "quantity", "date"
  const [selectedFilter, setSelectedFilter] = useState("default");

  // Date filter states
  const [ByDate, setByDate] = useState(false);
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");

  // Status filter states
  const [All, setAll] = useState(true);
  const [Available, setAvailable] = useState(false);
  const [LowStock, setLowStock] = useState(false);
  const [OutOfStock, setOutOfStock] = useState(false);

  // Other states
  const [IsLoading, setIsLoading] = useState(true);
  const [Trigger, setTrigger] = useState(false);
  const [modalType, setModalType] = useState("new");
  const [selectedInventory, setSelectedInventory] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isBulkUploadModalOpen,
    onOpen: onBulkUploadModalOpen,
    onClose: onBulkUploadModalClose,
  } = useDisclosure();

  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

  // Pagination states
  const PostPerPage = configuration.sizePerPage;
  const [CurrentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = CurrentPage * PostPerPage;
  const indexOfFirstItem = indexOfLastItem - PostPerPage;
  const PaginatedData = FilterData.slice(indexOfFirstItem, indexOfLastItem);

  // Load the pharmacy stock data
  useEffect(() => {
    const loadPharmacyStock = async () => {
      try {
        const stockData = await fetchPharmacyStock();
        const pricedetails = stockData?.queryresult?.pricedetails;
        if (Array.isArray(pricedetails)) {
          const formattedData = pricedetails.map((item) => ({
            id: item._id,
            productid: item.productid,
            pharmacy: item.pharmacy,
            serviceCategory: item.servicecategory,
            amount: item.amount,
            serviceType: item.servicetype,
            category: item.category,
            quantity: item.qty,
            lowStockLevel: item.lowstocklevel,
            expirationDate: new Date(item.expirationdate)
              .toISOString()
              .split("T")[0],
            lastRestockDate: new Date(item.lastrestockdate)
              .toISOString()
              .split("T")[0],
            status:
              item.qty <= 0
                ? "out of stock"
                : item.qty <= item.lowstocklevel
                ? "low stock"
                : "available",
          }));
          setData(formattedData);
          setFilterData(formattedData);
        } else {
          console.error(
            "Expected an array in 'queryresult.pricedetails'.",
            stockData
          );
        }
      } catch (error) {
        console.error("Error fetching pharmacy stock:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPharmacyStock();
  }, [Trigger]);

  // Update search filtering based on the selected filter option
  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchInput(value);
    if (!ByDate) {
      let filtered = [];
      switch (selectedFilter) {
        case "productid":
          filtered = Data.filter((item) =>
            String(item.productid).toLowerCase().includes(value)
          );
          break;
        case "serviceCategory":
          filtered = Data.filter((item) =>
            item.serviceCategory.toLowerCase().includes(value)
          );
          break;
        case "amount":
          filtered = Data.filter((item) =>
            String(item.amount).toLowerCase().includes(value)
          );
          break;
        case "serviceType":
          filtered = Data.filter((item) =>
            item.serviceType.toLowerCase().includes(value)
          );
          break;
        case "category":
          filtered = Data.filter((item) =>
            item.category.toLowerCase().includes(value)
          );
          break;
        case "quantity":
          filtered = Data.filter((item) =>
            String(item.quantity).toLowerCase().includes(value)
          );
          break;
        default: // "default" filters by serviceType and category
          filtered = Data.filter(
            (item) =>
              item.serviceType.toLowerCase().includes(value) ||
              item.category.toLowerCase().includes(value)
          );
          break;
      }
      setFilterData(filtered);
    }
  };

  // Function to perform date filtering using the "expirationDate" field
  const filterByDate = () => {
    if (StartDate && EndDate) {
      let endDateObj = new Date(EndDate);
      endDateObj.setDate(endDateObj.getDate() + 1);
      const formattedEndDate = endDateObj.toISOString().split("T")[0];
      const filtered = Data.filter(
        (item) =>
          item.expirationDate >= StartDate &&
          item.expirationDate <= formattedEndDate
      );
      setFilterData(filtered);
    }
  };

  // Status filter functions
  const filterAll = () => {
    setAll(true);
    setAvailable(false);
    setLowStock(false);
    setOutOfStock(false);
    setFilterData(Data);
  };

  const filterAvailable = () => {
    setAll(false);
    setAvailable(true);
    setLowStock(false);
    setOutOfStock(false);
    setFilterData(Data.filter((item) => item.status === "available"));
  };

  const filterLowStock = () => {
    setAll(false);
    setAvailable(false);
    setLowStock(true);
    setOutOfStock(false);
    setFilterData(Data.filter((item) => item.status === "low stock"));
  };

  const filterOutOfStock = () => {
    setAll(false);
    setAvailable(false);
    setLowStock(false);
    setOutOfStock(true);
    setFilterData(Data.filter((item) => item.status === "out of stock"));
  };

  // Modal handlers
  const handleAddItemClick = () => {
    setModalType("new");
    setSelectedInventory(null);
    onOpen();
  };

  const handleUpdateStockClick = (item) => {
    setModalType("edit");
    setSelectedInventory(item);
    onOpen();
  };

  const handleSuccess = (message) => {
    setShowToast({
      show: true,
      message: message,
      status: "success",
    });
    setTimeout(() => {
      setShowToast({ show: false });
    }, 3000);
    setTrigger(!Trigger);
  };

  return (
    <MainLayout>
      {IsLoading && <Preloader />}
      <Seo title="Inventory" description="Manage your inventory" />

      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}

      <HStack>
        <Text color="#1F2937" fontWeight="600" fontSize="19px">
          Inventory
        </Text>
        <Text color="#667085" fontWeight="400" fontSize="18px">
          ({Data.length})
        </Text>
      </HStack>
      <Text color="#686C75" mt="9px" fontWeight="400" fontSize="15px">
        Manage your inventory data, track stock levels, and view item details.
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
            <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterAll}>
              <Text
                py="8.5px"
                px="12px"
                bg={All ? "#fff" : "transparent"}
                rounded="7px"
                color="#1F2937"
                fontWeight="500"
                fontSize="13px"
              >
                All
              </Text>
            </Box>
            <Box
              borderRight="1px solid #EDEFF2"
              pr="5px"
              onClick={filterAvailable}
            >
              <Text
                py="8.5px"
                px="12px"
                bg={Available ? "#fff" : "transparent"}
                rounded="7px"
                color="#1F2937"
                fontWeight="500"
                fontSize="13px"
              >
                Available
              </Text>
            </Box>
            <Box
              borderRight="1px solid #EDEFF2"
              pr="5px"
              onClick={filterLowStock}
            >
              <Text
                py="8.5px"
                px="12px"
                bg={LowStock ? "#fff" : "transparent"}
                rounded="7px"
                color="#1F2937"
                fontWeight="500"
                fontSize="13px"
              >
                Low Stock
              </Text>
            </Box>
            <Box pr="5px" onClick={filterOutOfStock}>
              <Text
                py="8.5px"
                px="12px"
                bg={OutOfStock ? "#fff" : "transparent"}
                rounded="7px"
                color="#1F2937"
                fontWeight="500"
                fontSize="13px"
              >
                Out of Stock
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
                  fontSize="12px"
                  p="8px"
                />
              ) : (
                <HStack>
                  <Input
                    label="Start Date"
                    type="date"
                    value={StartDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    bColor="#E4E4E4"
                    leftIcon={<FaCalendarAlt />}
                    fontSize="12px"
                    p="8px"
                  />
                  <Input
                    label="End Date"
                    type="date"
                    value={EndDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    bColor="#E4E4E4"
                    leftIcon={<FaCalendarAlt />}
                    fontSize="12px"
                    p="8px"
                  />
                  <Flex
                    onClick={filterByDate}
                    cursor="pointer"
                    px="5px"
                    py="3px"
                    rounded="5px"
                    bg="blue.blue500"
                    color="#fff"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <BiSearch size={16} />
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
                    <IoFilter size={16} />
                  </HStack>
                </MenuButton>
                <MenuList fontSize="14px">
                  <MenuItem
                    onClick={() => {
                      setByDate(false);
                      setSelectedFilter("productid");
                    }}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    by Product ID
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setByDate(false);
                      setSelectedFilter("serviceCategory");
                    }}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    by Service Category
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setByDate(false);
                      setSelectedFilter("amount");
                    }}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    by Amount
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setByDate(false);
                      setSelectedFilter("serviceType");
                    }}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    by Service Type
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setByDate(false);
                      setSelectedFilter("category");
                    }}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    by Category
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setByDate(false);
                      setSelectedFilter("quantity");
                    }}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    by Quantity
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setByDate(true);
                      setSelectedFilter("date");
                    }}
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
                    onClick={() => {
                      setSearchInput("");
                      setFilterData(Data);
                      setByDate(false);
                      setSelectedFilter("default");
                    }}
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
          <Flex
            justifyContent="space-between"
            flexWrap="wrap"
            mt={["10px", "10px", "10px", "10px"]}
            w={["100%", "100%", "50%", "37%"]}
          >
            <Button
              rightIcon={<SlPlus />}
              w={["100%", "100%", "144px", "144px"]}
              onClick={handleAddItemClick}
            >
              Add Item
            </Button>

            <Button
              mt={["10px", "10px", "0px", "0px"]}
              rightIcon={<HiOutlineDocumentArrowUp />}
              background="#f8ddd1"
              border="1px solid #EA5937"
              color="blue.blue500"
              w={["100%", "100%", "144px", "144px"]}
              onClick={onBulkUploadModalOpen}
            >
              Bulk Upload
            </Button>
          </Flex>
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
                  Product ID
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Pharmacy
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Service Category
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Amount
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Service Type
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Category
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Quantity
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Low Stock Level
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Expiration Date
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Last Restock Date
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Status
                </Th>
                <Th
                  fontSize="13px"
                  textTransform="capitalize"
                  color="#534D59"
                  fontWeight="600"
                >
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {PaginatedData.map((item) => (
                <TableRowY
                  key={item.id}
                  type="inventory"
                  productid={item.productid}
                  pharmacy={item.pharmacy}
                  serviceCategory={item.serviceCategory}
                  amount={item.amount}
                  serviceType={item.serviceType}
                  category={item.category}
                  quantity={item.quantity}
                  lowStockLevel={item.lowStockLevel}
                  expirationDate={item.expirationDate}
                  lastRestockDate={item.lastRestockDate}
                  status={item.status}
                  onUpdateStock={() => handleUpdateStockClick(item)}
                />
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        <Pagination
          postPerPage={PostPerPage}
          currentPage={CurrentPage}
          totalPosts={FilterData.length}
          paginate={setCurrentPage}
        />
      </Box>

      <InventoryModal
        isOpen={isOpen}
        onClose={onClose}
        type={modalType}
        selectedInventory={selectedInventory}
        onSuccess={handleSuccess}
      />

      <PharmacyBulkUploadModal
        isOpen={isBulkUploadModalOpen}
        onClose={onBulkUploadModalClose}
        onSuccess={() => setTrigger(!Trigger)}
      />
    </MainLayout>
  );
}
