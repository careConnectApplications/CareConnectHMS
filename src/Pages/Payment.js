import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainLayout from "../Layouts/Index";
import { Text, Flex, HStack, Box, useDisclosure } from "@chakra-ui/react";
import TableRow from "../Components/TableRow";
import Button from "../Components/Button";
import Input from "../Components/Input";
import ShowToast from "../Components/ToastNotification";
import { CgSearch } from "react-icons/cg";
import { IoFilter } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import {
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
import PaymentGroupModal from "../Components/PaymentGroupModal";
import { GetAllPaidPaymentGroupApi, GetAllFilteredPaymentGroupOptApi, GetAllPaymentGroupOptApi } from "../Utils/ApiCalls";
import moment from "moment";
import Seo from "../Utils/Seo";
import { HiOutlineDocumentArrowUp } from "react-icons/hi2";
import { BiSearch } from "react-icons/bi";

import { SlPlus } from "react-icons/sl";
import Pagination from "../Components/Pagination";
import { configuration } from "../Utils/Helpers";
import Preloader from "../Components/Preloader";
import { FaCalendarAlt } from "react-icons/fa";

export default function Payment() {
  const [IsLoading, setIsLoading] = useState(true);
  const [All, setAll] = useState(true);
  const [Paid, setPaid] = useState(false);
  const [Pending, setPending] = useState(false);
  const [Trigger, setTrigger] = useState(false);
  const [OldPayload, setOldPayload] = useState("");
  const [Data, setData] = useState([]);
  const [FilterData, setFilterData] = useState([]);
  const [ModalState, setModalState] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [FilterUser, setFilterUser] = useState({});

  // Search Filter settings to follow
  const [SearchInput, setSearchInput] = useState("");
  const [FilteredData, setFilteredData] = useState(null);

  // filter by date
  const [ByDate, setByDate] = useState(false);
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
    setCurrentPage(1)
  };

 
  // Pagination settings to follow
  const [CurrentPage, setCurrentPage] = useState(1);
  const [PostPerPage, setPostPerPage] = useState(configuration.sizePerPage);
  const [TotalData, setTotalData] = useState("");
  const [Status, setStatus] = useState("pending payment");

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Pagination settings to follow end here

  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

  const [Key, setKey] = useState("");
  const [Value, setValue] = useState("");

  const getFilteredBilling = async (key, value) => {
    setKey(key)
    setValue(value)

    try {
      setIsLoading(true);
      const result = await GetAllFilteredPaymentGroupOptApi(Status, key, value, CurrentPage, PostPerPage);
      console.log("all fitlered payment", result);
      if (result.status === true) {
        setFilteredData(result.queryresult.paymentdetails);
        setTotalData(result.queryresult.totalpaymentdetails)
      }
    } catch (e) {
      console.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filterBy = (title) => {
    console.log("filter checking", title);

    if (title === "mrn") {
      getFilteredBilling("MRN", SearchInput)
    } else if (title === "email") {
      getFilteredBilling("email", SearchInput)
     
    } else if (title === "firstName") {
      
      getFilteredBilling("firstName", SearchInput)   
      
    } else if (title === "lastName") {
      
      getFilteredBilling("lastName", SearchInput)
      
    } else if (title === "phoneNumber") {
      getFilteredBilling("phoneNumber", SearchInput)
    }else if (title === "ref") {
      getFilteredBilling("paymentreference", SearchInput)
    }else if (title === "hmoId") {
      getFilteredBilling("HMOId", SearchInput)
    }else if (title === "date") {
      // add 1 day to end date 
      let endDate = new Date(EndDate)
      endDate.setDate(endDate.getDate() + 1);
      // format date back
      let formatedEndDate = endDate.toISOString().split('T')[0]
      let filter = Data.filter(
        (item) =>
          item.createdAt >= StartDate && item.createdAt <= formatedEndDate
      );
      setFilteredData(filter);
      setSearchInput("s")

    }
  };



  const getAllPayment = async (status) => {
    try {
      setIsLoading(true);
      const result = await GetAllPaymentGroupOptApi(CurrentPage, PostPerPage, status);
      console.log("result getAllPaymentGroup", result);
      if (result.status === true) {
        setData(result.queryresult.paymentdetails);
        setFilterData(result.queryresult.paymentdetails);
        setTotalData(result.queryresult.totalpaymentdetails)
      }
    } catch (e) {
      console.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };



  
  const filterAll = () => {

    setAll(true);
    setPaid(false);
    getAllPayment("pending payment")
    setStatus("pending payment")
    setCurrentPage(1)

  };
  const filterPaid = () => {

    setAll(false);
    setPaid(true);
    getAllPayment("paid")
    setStatus("paid")
    setCurrentPage(1)


  };


  const onChangeStatus = async (item) => {
    setOldPayload(item)
    onOpen()


  };

  const { pathname } = useLocation()
  const nav = useNavigate();

  const PrintReceipt = (item) => {
    nav(`/dashboard/billing-payment/receipt/${item.paymentreference}`)

    localStorage.setItem("pathname", pathname)

  }
  const activateNotifications = (message, status) => {

    setShowToast({
      show: true,
      message: message,
      status: status,
    });

    setTimeout(() => {
      setShowToast({
        show: false,
      });

    }, 5000)
  }



  useEffect(() => {

    if(FilteredData?.length > 0 || FilteredData !== null ){
      getFilteredBilling(Key,Value) 
    }else{

      if(All === true){
        getAllPayment("pending payment")
      }else{
        getAllPayment("paid")
      }

     
    }
   
   
  }, [isOpen, Trigger, CurrentPage]);

  return (
    <MainLayout>
      {IsLoading && <Preloader />}
      <Seo title="User Management" description="Care Connect Patients" />

      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}
      <HStack>
        <Text color="#1F2937" fontWeight="600" fontSize="19px">
          Payment
        </Text>
        <Text color="#667085" fontWeight="400" fontSize="18px">
          ({TotalData.toLocaleString()})
        </Text>
      </HStack>
      <Text color="#686C75" mt="9px" fontWeight="400" fontSize="15px">
        Confirm and manage pending payment from patient from one place
      </Text>

      <Box
        bg="#fff"
        border="1px solid #EFEFEF"
        mt="12px"
        py="17px"
        px={["18px", "18px"]}
        rounded="10px"
      >
        {/* filter section  */}
        <Flex justifyContent="space-between" flexWrap="wrap">
          <Flex
            alignItems="center"
            flexWrap="wrap"
            bg="#E4F3FF"
            rounded="7px"
            py="3.5px"
            px="5px"
            cursor="pointer"
            mt={["10px", "10px", "0px", "0px"]}
          >
            <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterAll}>
              <Text
                py="8.5px"
                px="12px"
                bg={All ? "#fff" : "transparent"}
                rounded="7px"
                color={"#1F2937"}
                fontWeight={"500"}
                fontSize={"13px"}
              >
                All Pending

              </Text>
            </Box>
            <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterPaid}>
              <Text
                py="8.5px"
                px="12px"
                bg={Paid ? "#fff" : "transparent"}
                rounded="7px"
                color={"#1F2937"}
                fontWeight={"500"}
                fontSize={"13px"}
              >
                Paid

              </Text>
            </Box>
          
          </Flex>

          <Flex
            flexWrap="wrap"
            mt={["10px", "10px", "0px", "0px"]}
            alignItems="center"
            justifyContent={"flex-end"}
          >
            <HStack flexWrap={["wrap", "nowrap"]}>
              {ByDate === false ? (
                <Input
                  label="Search"
                  onChange={(e) => {setSearchInput(e.target.value);
                    setCurrentPage(1)
                  }}
                  value={SearchInput}
                  bColor="#E4E4E4"
                  leftIcon={<BiSearch />}
                />
              ) : (
                <HStack flexWrap={["wrap", "nowrap"]}>
                  <Input
                    label="Start Date"
                    type="date"
                    onChange={(e) => setStartDate(e.target.value)}
                    value={StartDate}
                    bColor="#E4E4E4"
                    leftIcon={<FaCalendarAlt />}
                  />
                  <Input
                    label="End Date"
                    type="date"
                    onChange={(e) => setEndDate(e.target.value)}
                    value={EndDate}
                    bColor="#E4E4E4"
                    leftIcon={<FaCalendarAlt />}
                  />

                  <Flex
                    onClick={() => filterBy("date")}
                    cursor="pointer"
                    px="5px"
                    py="3px"
                    rounded="5px"
                    bg="blue.blue500"
                    color="#fff"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <BiSearch />
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
                    <IoFilter />
                  </HStack>
                </MenuButton>
                <MenuList>

                  <MenuItem
                    onClick={() => filterBy("firstName")}
                    textTransform="capitalize"
                    fontWeight={"500"}
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>by First Name</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => filterBy("lastName")}
                    textTransform="capitalize"
                    fontWeight={"500"}
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>by Last Name</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => filterBy("mrn")}
                    textTransform="capitalize"
                    fontWeight={"500"}
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>by Patient MRN</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => filterBy("phoneNumber")}
                    textTransform="capitalize"
                    fontWeight={"500"}
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>by Phone Number</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => filterBy("ref")}
                    textTransform="capitalize"
                    fontWeight={"500"}
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>by Reference No</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => setByDate(true)}
                    textTransform="capitalize"
                    fontWeight={"500"}
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>by date</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setFilteredData(null);
                      setSearchInput("");
                      setByDate(false);
                      setStartDate("");
                      setEndDate("");
                      filterAll()
                      setCurrentPage(1)
                    }}
                    textTransform="capitalize"
                    fontWeight={"500"}
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>clear filter</Text>
                    </HStack>
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        </Flex>

        {/* filter section end here */}

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
                    patient name
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    MRN
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    phone
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    age
                  </Th>


                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    Reference No
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    Total Amount
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    date created
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    actions
                  </Th>
                </Tr>
              </Thead>
              <Tbody>



                {
                  SearchInput === "" || FilteredData === null ? (
                    FilterData?.map((item, i) => (
                      <TableRow
                        key={i}
                        type="payment-group"
                        name={`${item.firstName} ${item.lastName}`}
                        email={item.email}
                        age={item.age}
                        phone={item.phoneNumber}
                        mrn={item.MRN}
                        reference={item.paymentreference}
                        quantity={item.qty}
                        total={item.amount}
                        status={item.status}
                        paymentType={item.paymentype}
                        date={moment(item.createdAt).format("lll")}
                        onClick={() => onChangeStatus(item)}
                        onPrint={() => PrintReceipt(item)}
                      />
                    ))
                  ) : (

                    SearchInput !== "" && FilteredData?.length > 0 ? (
                      FilteredData?.map((item, i) => (
                        <TableRow
                          key={i}
                          type="payment-group"
                          name={`${item.firstName} ${item.lastName}`}
                          email={item.email}
                          age={item.age}
                          phone={item.phoneNumber}
                          mrn={item.MRN}
                          total={item.amount}
                          status={item.status}
                          reference={item.paymentreference}
                          quantity={item.qty}
                          paymentType={item.paymentype}
                          date={moment(item.createdAt).format("lll")}
                          onClick={() => onChangeStatus(item)}
                        />
                      ))
                    ) : (

                      <Text textAlign={"center"} mt="32px" color="black">*--No record found--*</Text>
                    )

                  )


                }


              </Tbody>
            </Table>
          </TableContainer>
          <Pagination
            postPerPage={PostPerPage}
            currentPage={CurrentPage}
            totalPosts={TotalData}
            paginate={paginate}
          />
        </Box>
      </Box>

      <PaymentGroupModal
        isOpen={isOpen}
        onClose={onClose}
        type={ModalState}
        filteredUser={FilterUser}
        oldPayload={OldPayload}
        activateNotifications={activateNotifications}
      />
    </MainLayout>
  );
} 
