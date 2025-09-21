import React, { useState, useEffect } from "react";
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
import { BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import { SlPlus } from "react-icons/sl";
import Seo from "../Utils/Seo";
import { configuration } from "../Utils/Helpers";
import Pagination from "../Components/Pagination";
import Button from "../Components/Button";
import Input from "../Components/Input";
import Preloader from "../Components/Preloader";
import ShowToast from "../Components/ToastNotification";
import { ReadAllRadiologyByPatientApi, ViewMultipleRadiologyResultsApi } from "../Utils/ApiCalls";
import RadiologyOrderRequestModal from "../Components/RadiologyOrderRequestModal";
import TableRowY from "../Components/TableRowY";
import DicomViewerModal from "../Components/DicomViewerModal";

// Helper function to format the date and time in a simpler format
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

export default function Radiology() {
  const [isLoading, setIsLoading] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  
  // Updated status filter states
  const [all, setAll] = useState(true);
  const [inProgress, setInProgress] = useState(false);
  const [processed, setProcessed] = useState(false);
  
  const [trigger, setTrigger] = useState(false);
  const [modalType, setModalType] = useState("create"); // "create" or "edit"
  const [selectedRadiology, setSelectedRadiology] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // DICOM Viewer Modal state
  const { 
    isOpen: isDicomViewerOpen, 
    onOpen: onDicomViewerOpen, 
    onClose: onDicomViewerClose 
  } = useDisclosure();
  const [dicomUrls, setDicomUrls] = useState([]);
  const [currentTestName, setCurrentTestName] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = configuration.sizePerPage;
  const indexOfLastItem = currentPage * postsPerPage;
  const indexOfFirstItem = indexOfLastItem - postsPerPage;
  const paginatedData = filterData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Retrieve patientId from local storage
        const patientId = localStorage.getItem("patientId");
        const data = await ReadAllRadiologyByPatientApi(patientId);
        setOriginalData(data.queryresult.radiologydetails);
        setFilterData(data.queryresult.radiologydetails);
      } catch (error) {
        console.error("Error fetching data:", error);
        setShowToast({
          show: true,
          message: "Error fetching data",
          status: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [trigger]);

  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchInput(value);
    const filtered = originalData.filter((item) => {
      const testName = String(item.testname || "").toLowerCase();
      const testId = String(item.testid || "").toLowerCase();
      const department = String(item.department || "").toLowerCase();
      const note = String(item.note || "").toLowerCase();
      return (
        testName.includes(value) ||
        testId.includes(value) ||
        department.includes(value) ||
        note.includes(value)
      );
    });
    setFilterData(filtered);
  };

  // Filter functions using "inprogress" and "processed" statuses
  const filterAll = () => {
    setAll(true);
    setInProgress(false);
    setProcessed(false);
    setFilterData(originalData);
  };

  const filterInProgress = () => {
    setAll(false);
    setInProgress(true);
    setProcessed(false);
    const filtered = originalData.filter((item) => {
      const status = item.status?.toLowerCase();
      return status === "inprogress";
    });
    setFilterData(filtered);
  };

  const filterProcessed = () => {
    setAll(false);
    setInProgress(false);
    setProcessed(true);
    const filtered = originalData.filter((item) => {
      const status = item.status?.toLowerCase();
      return status === "processed";
    });
    setFilterData(filtered);
  };

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
    setShowToast({ show: true, message, status });
    setTimeout(() => {
      setShowToast({ show: false, message: "", status: "" });
    }, 3000);
    setTrigger(!trigger); // Refresh data after creation/updating
  };

  // --- View Radiology Result Handler (DICOM Viewer for ALL images) ---
  const handleView = async (testResultArray, testName = "Radiology Result") => {
    if (testResultArray && testResultArray.length > 0) {
      try {
        const urls = await ViewMultipleRadiologyResultsApi(testResultArray);
        console.log("urls", urls);
        
        // Always use DICOM viewer modal for ALL images (DICOM, JPG, PNG, etc.)
        setDicomUrls(urls);
        setCurrentTestName(testName);
        onDicomViewerOpen();
      } catch (error) {
        setShowToast({ show: true, message: "Error fetching radiology results", status: "error" });
      }
    } else {
      setShowToast({ show: true, message: "No radiology result available for viewing", status: "error" });
    }
  };

  // --- Slideshow Function (New Tab with Slideshow) ---
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

  return (
    <Box p={["10px", "15px", "20px"]}>
      {isLoading && <Preloader />}

      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}
      <Box
        bg="#fff"
        border="1px solid #EFEFEF"
        mt="12px"
        py={["10px", "15px"]}
        px={["10px", "15px"]}
        rounded="10px"
      >
        <Flex justifyContent="space-between" flexWrap="wrap">
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
                bg={all ? "#fff" : "transparent"}
                rounded="7px"
                color="#1F2937"
                fontWeight="500"
                fontSize={["11px", "13px"]}
              >
                All
              </Text>
            </Box>
            <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterInProgress}>
              <Text
                py="8.5px"
                px="12px"
                bg={inProgress ? "#fff" : "transparent"}
                rounded="7px"
                color="#1F2937"
                fontWeight="500"
                fontSize={["11px", "13px"]}
              >
                In Progress
              </Text>
            </Box>
            <Box onClick={filterProcessed}>
              <Text
                py="8.5px"
                px="12px"
                bg={processed ? "#fff" : "transparent"}
                rounded="7px"
                color="#1F2937"
                fontWeight="500"
                fontSize={["11px", "13px"]}
              >
                Processed
              </Text>
            </Box>
          </Flex>
          <Flex
            flexWrap="wrap"
            mt="10px"
            alignItems="center"
            justifyContent="flex-end"
          >
            <HStack spacing="4">
              <Input
                label="Search"
                onChange={handleInputChange}
                value={searchInput}
                bColor="#E4E4E4"
                leftIcon={<BiSearch />}
                fontSize={["11px", "13px"]}
              />
              <Menu>
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
                <MenuList>
                  <MenuItem
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                    onClick={filterAll}
                  >
                    Reset Filters
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        </Flex>

        <Flex
          justifyContent="space-between"
          flexWrap="wrap"
          mt="10px"
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
                <Th fontSize={["10px", "13px"]} textTransform="capitalize" color="#534D59" fontWeight="600">
                  Date
                </Th>
                <Th fontSize={["10px", "13px"]} textTransform="capitalize" color="#534D59" fontWeight="600">
                  Test Name
                </Th>
                <Th fontSize={["10px", "13px"]} textTransform="capitalize" color="#534D59" fontWeight="600">
                  Test ID
                </Th>
                <Th fontSize={["10px", "13px"]} textTransform="capitalize" color="#534D59" fontWeight="600">
                  Department
                </Th>
                <Th fontSize={["10px", "13px"]} textTransform="capitalize" color="#534D59" fontWeight="600">
                  Note
                </Th>
                <Th fontSize={["10px", "13px"]} textTransform="capitalize" color="#534D59" fontWeight="600">
                  Status
                </Th>
                <Th fontSize={["10px", "13px"]} textTransform="capitalize" color="#534D59" fontWeight="600">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedData.map((item) => (
                <TableRowY
                  key={item._id}
                  type="radiology"
                  date={formatDateTime(item.createdAt)}
                  testName={item.testname}
                  testId={item.testid}
                  department={item.department}
                  note={item.note}
                  status={item.status}
                  onView={() => handleView(item.testresult, item.testname)}
                  onEdit={() => handleEdit(item)}
                />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <Pagination
          postPerPage={postsPerPage}
          currentPage={currentPage}
          totalPosts={filterData.length}
          paginate={paginate}
        />
      </Box>

      <RadiologyOrderRequestModal
        isOpen={isOpen}
        onClose={onClose}
        admissionId={null} 
        type={modalType}
        initialData={selectedRadiology}
        onSuccess={handleSuccess}
      />

      {/* DICOM Viewer Modal */}
      <DicomViewerModal
        isOpen={isDicomViewerOpen}
        onClose={onDicomViewerClose}
        imageUrls={dicomUrls}
        testName={currentTestName}
      />
    </Box>
  );
}
