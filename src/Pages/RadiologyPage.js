import React, { useState, useEffect, useRef } from "react";
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
  useDisclosure,
} from "@chakra-ui/react";
import { BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import { FaCalendarAlt } from "react-icons/fa";
import { SlPlus } from "react-icons/sl";
import Seo from "../Utils/Seo";
import { configuration } from "../Utils/Helpers";
import Pagination from "../Components/Pagination";
import Button from "../Components/Button";
import Input from "../Components/Input";
import Preloader from "../Components/Preloader";
import ShowToast from "../Components/ToastNotification";
import {
  ReadAllRadiologyApi,
  UploadRadiologyResultApi,
  ViewMultipleRadiologyResultsApi,ReadAllRadiologyFilteredApi
} from "../Utils/ApiCalls";
import TableRowY from "../Components/TableRowY";
import SingleRadiologyModal from "../Components/SingleRadiologyModal";
import ConfirmRadiologyOrderModal from "../Components/ConfirmRadiologyOrderModal";
import RadiologyResultModal from "../Components/RadiologyResultModal";
import MainLayout from "../Layouts/Index";

export default function RadiologyPage() {
  // Radiology data & filtering states
  const [Data, setData] = useState([]);
  const [FilterData, setFilterData] = useState([]);
  const [SearchInput, setSearchInput] = useState("");
  const [FilteredData, setFilteredData] = useState(null);


  const [TotalData, setTotalData] = useState("");
  const [Status, setStatus] = useState("scheduled");

  const postsPerPage = configuration.sizePerPage;
  const [currentPage, setCurrentPage] = useState(1);




  // Date filter states
  const [ByDate, setByDate] = useState(false);
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");

  // Status filter states - now including "awaiting confirmation"
  const [InProgress, setInProgress] = useState(true);
  const [AwaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const [Processed, setProcessed] = useState(false);

  // Trigger for refreshing data (e.g., after file upload or order creation)
  const [Trigger, setTrigger] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // New state to track if a fetch has been performed
  const [hasFetched, setHasFetched] = useState(false);

  // New state to track the current filter type ("all", "testid", "testname", "department", "patient", "mrn", or "date")
  const [currentFilter, setCurrentFilter] = useState("all");

  // Toast state
  const [toast, setToast] = useState({ show: false, message: "", status: "" });
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(
        () => setToast({ show: false, message: "", status: "" }),
        2000
      );
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // ------------- Order Modal & Edit States -------------
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState("create"); // "create" or "edit"
  const [selectedRadiology, setSelectedRadiology] = useState(null);

  const handleRequestTestClick = () => {
    setModalType("create");
    setSelectedRadiology(null);
    onOpen();
  };

  const handleEdit = (radiologyRecord) => {
    setModalType("edit");
    setSelectedRadiology(radiologyRecord);
    onOpen();
  };

  const handleSuccess = (message, status) => {
    setToast({ show: true, message, status });
    setTimeout(() => {
      setToast({ show: false, message: "", status: "" });
    }, 3000);
    setTrigger((prev) => !prev); // Refresh data after creation/updating
  };

  // ------------- Confirm Modal States & Function -------------
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = useDisclosure();
  // Instead of storing only an id, we store the entire radiology order object
  const [selectedConfirmOrder, setSelectedConfirmOrder] = useState(null);

  // nconfirm function: Opens the confirm modal and stores the radiology order.
  const nconfirm = (order) => {
    setSelectedConfirmOrder(order);
    onConfirmOpen();
  };

  // ------------- Fetch Radiology Data -------------


  // ------------- Filtering Functions -------------
  // Now, the search input will only update the state.
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
     setCurrentPage(1)
    // No auto-filtering on keystroke
  };

  // When a user selects a filter option from the menu.
  const [Key, setKey] = useState("");
    const [Value, setValue] = useState("");
  
  
    const getFilteredScheduledRadiology = async (key, value) => {
      setKey(key)
      setValue(value)
  
      try {
        setIsLoading(true);
        const result = await ReadAllRadiologyFilteredApi(postsPerPage, currentPage, Status, key, value);
        console.log("all fitlered radiology", result);
        if (result.status === true) {
  
          setFilteredData(result.queryresult.radiologydetails);
          setTotalData(result.queryresult.totalradiologydetails)
        }
      } catch (e) {
        console.error(e.message);
      } finally {
        setIsLoading(false);
      }
    };

  const filterBy = (title) => {
    setCurrentFilter(title);
    if (title === "date") {
      if (StartDate && EndDate) {
        let endDateObj = new Date(EndDate);
        endDateObj.setDate(endDateObj.getDate() + 1);
        const formattedEndDate = endDateObj.toISOString().split("T")[0];
        const filtered = Data.filter((item) => {
          const created = item.createdAt.split("T")[0];
          return created >= StartDate && created <= formattedEndDate;
        });
        setFilteredData(filtered);
      }
    } else {
      if (SearchInput.trim() !== "") {
        
        if (title === "mrn") {
          getFilteredScheduledRadiology("MRN", SearchInput)
        } else if (title === "firstName") {
    
          getFilteredScheduledRadiology("firstName", SearchInput)
    
        } else if (title === "lastName") {
    
          getFilteredScheduledRadiology("lastName", SearchInput)
    
        } else if (title === "testName") {
    
          getFilteredScheduledRadiology("testname", SearchInput)
    
        }else if (title === "testid") {
    
          getFilteredScheduledRadiology("testid", SearchInput)
    
        }
       
      } else {
        setFilteredData(null);
      }
    }
  };

 

  // Determine which dataset to display: either the search/date-filtered data or the status-filtered data
  const dataToDisplay =
    SearchInput === "" || FilteredData === null ? FilterData : FilteredData;



  // ------------- Pagination -------------
  
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // ------------- File Upload (existing functionality) -------------
  const [uploadOrderId, setUploadOrderId] = useState(null);
  const fileInputRef = useRef(null);
  const handleUploadClick = (orderId) => {
    setUploadOrderId(orderId);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !uploadOrderId) return;
    try {
      const result = await UploadRadiologyResultApi(file, uploadOrderId);
      console.log("Upload response:", result);
      setToast({
        show: true,
        message: "Radiology result uploaded successfully!",
        status: "success",
      });
      setTrigger((prev) => !prev);
    } catch (err) {
      setToast({ show: true, message: err.message, status: "error" });
    }
    e.target.value = null;
    setUploadOrderId(null);
  };

  // ------------- Slideshow Function for Viewing Radiology Results -------------
  const openSlideshow = (urls) => {
    const newWindow = window.open("", "_blank");
    if (!newWindow) {
      alert("Popup blocked. Please allow popups for this site.");
      return;
    }
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Radiology Results Slideshow</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            background-color: #f2f2f2;
            margin: 0;
            padding: 20px;
          }
          #slideshow {
            max-width: 90%;
            margin: 0 auto;
          }
          #slideshow img {
            display: block;
            margin: 0 auto;
            width: auto;
            max-width: 100%;
            height: auto;
            max-height: 80vh;
          }
          .nav {
            cursor: pointer;
            font-size: 1.5rem;
            user-select: none;
            padding: 10px;
          }
          .nav:hover {
            color: #EA5937;
          }
          .nav-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div id="slideshow">
          <img id="slide" src="${urls[0]}" alt="Radiology Result">
        </div>
        <div class="nav-container">
          <div id="prev" class="nav">&laquo; Prev</div>
          <div id="next" class="nav">Next &raquo;</div>
        </div>
        <script>
          const urls = ${JSON.stringify(urls)};
          let index = 0;
          const slide = document.getElementById("slide");
          document.getElementById("prev").addEventListener("click", () => {
            index = (index === 0) ? urls.length - 1 : index - 1;
            slide.src = urls[index];
          });
          document.getElementById("next").addEventListener("click", () => {
            index = (index === urls.length - 1) ? 0 : index + 1;
            slide.src = urls[index];
          });
        </script>
      </body>
      </html>
    `;
    newWindow.document.write(html);
    newWindow.document.close();
  };

  // ------------- View Radiology Result Handler -------------
  const handleView = async (testResultArray) => {
    if (testResultArray && testResultArray.length > 0) {
      try {
        const urls = await ViewMultipleRadiologyResultsApi(testResultArray);
        openSlideshow(urls);
      } catch (error) {
        setToast({
          show: true,
          message: "Error fetching radiology results",
          status: "error",
        });
      }
    } else {
      setToast({
        show: true,
        message: "No radiology result available for viewing",
        status: "error",
      });
    }
  };

  // ------------- Helper: Format Date/Time -------------
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
    })} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };
  const {
    isOpen: isResultOpen,
    onOpen: onResultOpen,
    onClose: onResultClose,
  } = useDisclosure();

  const [selectedResultId, setSelectedResultId] = useState(null);

  // ❷ Called when the “Enter Result” menu item is clicked
  const handleEnterResultClick = (orderId) => {
    setSelectedResultId(orderId);
    onResultOpen();
  };
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();
  const [selectedForView, setSelectedForView] = useState([]);
  const [selectedViewRecord, setSelectedViewRecord] = useState(null);

  const handleViewManualClick = (manualArray, record) => {
    setSelectedForView(manualArray || []);
    setSelectedViewRecord(record);
    onViewOpen();
  };

  const handleFetchRadiology = async (status) => {
    setIsLoading(true);
    try {
      const result = await ReadAllRadiologyApi(postsPerPage, currentPage, status);
      // Assuming the API returns data in this structure:
      const radiologyDetails = result.queryresult.radiologydetails;
      console.log("ReadRadiology", result)
      setData(radiologyDetails);
      setFilterData(radiologyDetails);
      setTotalData(result.queryresult.totalradiologydetails)
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching radiology data:", error);
      setToast({
        show: true,
        message: "Error fetching radiology data",
        status: "error",
      });
    } 
  };


  const filterInProgress = () => {
    setInProgress(true);
    setAwaitingConfirmation(false);
    setProcessed(false);
    handleFetchRadiology("inprogress")
    setStatus("inprogress")
    setCurrentPage(1)
  };

  const filterProcessed = () => {
    setInProgress(false);
    setProcessed(true);
    setAwaitingConfirmation(false);
    handleFetchRadiology("processed")
    setStatus("processed")
    setCurrentPage(1)
  };
  const filterAwaitingConfirmation = () => {
    setInProgress(false);
    setProcessed(false);
    setAwaitingConfirmation(true);
    handleFetchRadiology("awaiting confirmation")
    setStatus("awaiting confirmation")
    setCurrentPage(1)
  };


  const clearFilter = () => {
    setSearchInput("");
    setFilteredData(null);
    setByDate(false);
    setStartDate("");
    setEndDate("");
    filterInProgress()
    setCurrentPage(1)
  };


  useEffect(() => {
    handleFetchRadiology();

    if (FilteredData?.length > 0 || FilteredData !== null) {
      getFilteredScheduledRadiology(Key,Value) 
    } else {

      if (InProgress === true) {
        handleFetchRadiology("inprogress")
      } else if (Processed === true) {
        handleFetchRadiology("processed")
      } else if (AwaitingConfirmation === true) {
        handleFetchRadiology("awaiting confirmation")
      }


    }
  }, [isOpen, Trigger, currentPage]);

  return (
    <MainLayout>
      <Seo
        title="Radiology"
        description="Upload, View And Order Radiology Tests"
      />
      <Box p={["10px", "15px", "20px"]}>
        {isLoading && <Preloader />}
        {toast.show && (
          <ShowToast message={toast.message} status={toast.status} />
        )}
        <HStack>
          <Text color="#1F2937" fontWeight="600" fontSize="19px">
            Radiology
          </Text>
          <Text color="#667085" fontWeight="400" fontSize="18px">
            ({TotalData})
          </Text>
        </HStack>
        <Text color="#686C75" mt="9px" fontWeight="400" fontSize="15px">
          Manage, Upload, View And Request Radiology Tests
        </Text>

        {/* Filter Section */}
        <Box
          bg="#fff"
          border="1px solid #EFEFEF"
          mt="12px"
          py={["10px", "15px"]}
          px={["10px", "15px"]}
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
              mt={["10px", "10px", "0px", "0px"]}
            >
              <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterInProgress}>
                <Text
                  py="8.5px"
                  px="12px"
                  bg={InProgress ? "#fff" : "transparent"}
                  rounded="7px"
                  color={"#1F2937"}
                  fontWeight={"500"}
                  fontSize={"13px"}
                >
                  InProgress

                </Text>
              </Box>
              <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterAwaitingConfirmation}>
                <Text
                  py="8.5px"
                  px="12px"
                  bg={AwaitingConfirmation ? "#fff" : "transparent"}
                  rounded="7px"
                  color={"#1F2937"}
                  fontWeight={"500"}
                  fontSize={"13px"}
                >
                  Awaiting Confirmation

                </Text>
              </Box>
              <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterProcessed}>
                <Text
                  py="8.5px"
                  px="12px"
                  bg={Processed ? "#fff" : "transparent"}
                  rounded="7px"
                  color={"#1F2937"}
                  fontWeight={"500"}
                  fontSize={"13px"}
                >
                  Processed

                </Text>
              </Box>

            </Flex>

            {/* Search & Filter Options */}
            <Flex
              flexWrap="wrap"
              mt="10px"
              alignItems="center"
              justifyContent="flex-end"
            >
              <HStack spacing="4">
                {ByDate === false ? (
                  <Input
                    label="Search"
                    value={SearchInput}
                    onChange={handleInputChange}
                    bColor="#E4E4E4"
                    leftIcon={<BiSearch />}
                    fontSize={["11px", "13px"]}
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
                    />
                    <Input
                      label="End Date"
                      type="date"
                      value={EndDate}
                      onChange={(e) => setEndDate(e.target.value)}
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
                      py={["8px", "11.64px"]}
                      px={["10px", "16.98px"]}
                      bg="#f8ddd1"
                      color="blue.blue500"
                      fontWeight="500"
                      fontSize={["11px", "14px"]}
                    >
                      <Text>Filter</Text>
                      <IoFilter />
                    </HStack>
                  </MenuButton>
                  <MenuList fontSize="14px">
                    <MenuItem
                      onClick={() => filterBy("testid")}
                      textTransform="capitalize"
                      fontWeight="500"
                      color="#2F2F2F"
                      _hover={{
                        color: "#fff",
                        fontWeight: "400",
                        bg: "blue.blue500",
                      }}
                    >
                      <HStack fontSize="14px">
                        <Text>by Test ID</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => filterBy("testName")}
                      textTransform="capitalize"
                      fontWeight="500"
                      color="#2F2F2F"
                      _hover={{
                        color: "#fff",
                        fontWeight: "400",
                        bg: "blue.blue500",
                      }}
                    >
                      <HStack fontSize="14px">
                        <Text>by Test Name</Text>
                      </HStack>
                    </MenuItem>
                  
                    <MenuItem
                      onClick={() => filterBy("firstName")}
                      textTransform="capitalize"
                      fontWeight="500"
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
                      fontWeight="500"
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
                      fontWeight="500"
                      color="#2F2F2F"
                      _hover={{
                        color: "#fff",
                        fontWeight: "400",
                        bg: "blue.blue500",
                      }}
                    >
                      <HStack fontSize="14px">
                        <Text>by MRN</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => setByDate(true)}
                      textTransform="capitalize"
                      fontWeight="500"
                      color="#2F2F2F"
                      _hover={{
                        color: "#fff",
                        fontWeight: "400",
                        bg: "blue.blue500",
                      }}
                    >
                      <HStack fontSize="14px">
                        <Text>by Date</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={clearFilter}
                      textTransform="capitalize"
                      fontWeight="500"
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
            <Flex
              justifyContent="space-between"
              flexWrap="wrap"
              mt={["10px", "10px", "10px", "10px"]}
              w={["100%", "100%", "50%", "37%"]}
            >
              <Button
                rightIcon={<SlPlus />}
                w={["100%", "100%", "144px", "144px"]}
                onClick={handleRequestTestClick}
                fontSize={["11px", "13px"]}
              >
                Request Test
              </Button>
            </Flex>
          </Flex>
        </Box>

        <Box
          bg="#fff"
          border="1px solid #EFEFEF"
          mt="12px"
          py={["10px", "15px"]}
          px={["10px", "15px"]}
          rounded="10px"
          overflowX="auto"
        >
          <TableContainer>
            <Table variant="striped">
              <Thead bg="#fff">
                <Tr>
                  <Th
                    fontSize={["10px", "13px"]}
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    Date
                  </Th>
                  <Th
                    fontSize={["10px", "13px"]}
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    Patient
                  </Th>
                  <Th
                    fontSize={["10px", "13px"]}
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    Test Name
                  </Th>
                  <Th
                    fontSize={["10px", "13px"]}
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    Test ID
                  </Th>
                  <Th
                    fontSize={["10px", "13px"]}
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    Department
                  </Th>
                  <Th
                    fontSize={["10px", "13px"]}
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    Note
                  </Th>
                  <Th
                    fontSize={["10px", "13px"]}
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    Status
                  </Th>
                  <Th
                    fontSize={["10px", "13px"]}
                    textTransform="capitalize"
                    color="#534D59"
                    fontWeight="600"
                  >
                    Actions
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {FilteredData !== null ? (
                  FilteredData?.length > 0 ? (
                    FilteredData.map((item) => (
                      <TableRowY
                        key={item._id}
                        type="radiologypage"
                        date={formatDateTime(item.createdAt)}
                        patient={`${item.patient?.firstName} ${item.patient?.lastName}`}
                        mrn={item.patient?.MRN}
                        testName={item.testname}
                        testId={item.testid}
                        department={item.department}
                        note={item.note}
                        status={item.status}
                        onView={() => handleView(item.testresult)}
                        onUpload={() => handleUploadClick(item._id)}
                        onEdit={() => handleEdit(item)}
                        onEnterResult={() =>
                          handleEnterResultClick(item._id)
                        }
                        onViewManualResult={() =>
                          handleViewManualClick(item.typetestresult, item)
                        }
                        // Pass the entire radiology order to nconfirm
                        onConfirm={() => nconfirm(item)}
                      />
                    ))
                  ) : (
                    <Text textAlign="center" mt="32px" color="black">
                      *--No record found--*
                    </Text>
                  )
                ) : (
                  FilterData.map((item) => (
                    <TableRowY
                      key={item._id}
                      type="radiologypage"
                      date={formatDateTime(item.createdAt)}
                      patient={`${item.patient?.firstName} ${item.patient?.lastName}`}
                      mrn={item.patient?.MRN}
                      testName={item.testname}
                      testId={item.testid}
                      department={item.department}
                      note={item.note}
                      status={item.status}
                      onView={() => handleView(item.testresult)}
                      onUpload={() => handleUploadClick(item._id)}
                      onEdit={() => handleEdit(item)}
                      onEnterResult={() => handleEnterResultClick(item._id)}
                      onViewManualResult={() =>
                        handleViewManualClick(item.typetestresult, item)
                      }
                      // Pass the entire radiology order to nconfirm
                      onConfirm={() => nconfirm(item)}
                    />
                  ))
                )}
              </Tbody>
            </Table>
          </TableContainer>
       
          <Pagination
              postPerPage={postsPerPage}
              currentPage={currentPage}
              totalPosts={TotalData}
              paginate={paginate}
            /> 
        </Box>

        {/* Hidden file input for uploads */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {/* Radiology Order Request Modal */}
        <SingleRadiologyModal
          isOpen={isOpen}
          onClose={onClose}
          admissionId={null}
          type={modalType}
          initialData={selectedRadiology}
          onSuccess={handleSuccess}
        />

        {/* Confirm Radiology Order Modal */}
        <ConfirmRadiologyOrderModal
          isOpen={isConfirmOpen}
          onClose={onConfirmClose}
          // Pass the radiology order id from the full order object
          radiologyId={selectedConfirmOrder?._id}
          onSuccess={() => setTrigger((prev) => !prev)}
        />

        <RadiologyResultModal
          isOpen={isResultOpen}
          onClose={onResultClose}
          recordId={selectedResultId} // ❸ Pass the selected ID
          oldResults={[]} // or existing result array
          activateNotifications={(msg, status) =>
            setToast({ show: true, message: msg, status })
          }
          onSuccess={() => setTrigger((prev) => !prev)}
        />
        <RadiologyResultModal
          isOpen={isViewOpen}
          onClose={onViewClose}
          oldResults={selectedForView}
          mode="view"
          record={selectedViewRecord}
        />
      </Box>
    </MainLayout>
  );
}
