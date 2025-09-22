import React, { useState, useEffect, useRef } from 'react'
import { Text, Flex, HStack, Box, useDisclosure } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, TableContainer, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import moment from "moment";
import TableRow from "../Components/TableRow";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../Components/Button";
import ExamineModal from "../Components/ExamineModal";
import LabRequestModal from "../Components/LabRequestModal";
import Input from "../Components/Input";
import ShowToast from "../Components/ToastNotification";
import { IoFilter } from "react-icons/io5";
import { HiOutlineDocumentArrowUp } from "react-icons/hi2";
import { BiSearch } from "react-icons/bi";
import { SlPlus } from "react-icons/sl";
import { UpdateAdmissionStatusAPI, GetAllProcedureHistoryApi, UploadProcedureResultApi, ViewMultipleRadiologyResultsApi } from "../Utils/ApiCalls";
import Pagination from "../Components/Pagination";
import ToTransferModal from "../Components/ToTransferModal";
import CreateProcedureModal from "../Components/CreateProcedureModal";
import DicomViewerModal from "../Components/DicomViewerModal";
import { configuration } from '../Utils/Helpers'
import Preloader from "../Components/Preloader";

export default function SingleProcedure() {
    const [IsLoading, setIsLoading] = useState(true);
    const [All, setAll] = useState(true);
    const [InProgress, setInProgress] = useState(false);
    const [Processed, setProcessed] = useState(false);
    const [OpenProcedureModal, setOpenProcedureModal] = useState(false);
    const [Data, setData] = useState([]);
    const [OldPayload, setOldPayload] = useState({});
    const [ModalState, setModalState] = useState("");

    const [FilterData, setFilterData] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [Trigger, setTrigger] = useState(false);
    
    // DICOM Viewer Modal states
    const [viewerModalOpen, setViewerModalOpen] = useState(false);
    const [viewerImageUrls, setViewerImageUrls] = useState([]);
    const [viewerTestName, setViewerTestName] = useState("");

    // Pagination settings
    const [CurrentPage, setCurrentPage] = useState(1);
    const [PostPerPage, setPostPerPage] = useState(configuration.sizePerPage);
    const indexOfLastSra = CurrentPage * PostPerPage;
    const indexOfFirstSra = indexOfLastSra - PostPerPage;
    const PaginatedData = FilterData.slice(indexOfFirstSra, indexOfLastSra);
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Search Filter settings
    const [SearchInput, setSearchInput] = useState("");
    const [FilteredData, setFilteredData] = useState(null);

    const filterBy = (title) => {
        if (title === "appointmentId") {
            let filter = Data.filter(item => item.appointmentid?.toLowerCase().includes(SearchInput.toLowerCase()));
            setFilteredData(filter);
        } else if (title === "appointmentCategory") {
            let filter = Data.filter(item => item.appointmentcategory?.toLowerCase().includes(SearchInput.toLowerCase()));
            setFilteredData(filter);
        } else if (title === "appointmentType") {
            let filter = Data.filter(item => item.appointmenttype?.toLowerCase().includes(SearchInput.toLowerCase()) || item.lastName?.toLowerCase().includes(SearchInput.toLowerCase()));
            setFilteredData(filter);
        }
    };

    let id = localStorage.getItem("patientId");

    const [showToast, setShowToast] = useState({
        show: false,
        message: "",
        status: "",
    });

    const getAllProcedureHistory = async () => {
        setIsLoading(true);
        try {
            const result = await GetAllProcedureHistoryApi(id);
            console.log("getAllProcedureHistory", result);
            if (result.status === true) {
                setIsLoading(false);
                setData(result.queryresult.proceduredetails);
                setFilterData(result.queryresult.proceduredetails);
            }
        } catch (e) {
            console.error(e.message);
        }
    };

    // Filter functions for Inprogress and Processed statuses only
    const filterAll = () => {
        setAll(true);
        setInProgress(false);
        setProcessed(false);
        setFilterData(Data);
    };

    const filterInProgress = () => {
        setAll(false);
        setInProgress(true);
        setProcessed(false);
        const filterData = Data.filter(item => item.status === "inprogress");
        setFilterData(filterData);
    };

    const filterProcessed = () => {
        setAll(false);
        setInProgress(false);
        setProcessed(true);
        const filterData = Data.filter(item => item.status === "processed");
        setFilterData(filterData);
    };

    const { pathname } = useLocation();
    const nav = useNavigate();

    const ViewLabResult = (id) => {
        nav(`/dashboard/lab-process/report/${id}`);
        localStorage.setItem("pathname", pathname);
    };

    const activateNotifications = (message, status) => {
        setShowToast({
            show: true,
            message: message,
            status: status,
        });
        setTimeout(() => {
            setShowToast({ show: false });
        }, 5000);
    };

    const AddProcedure = () => {
        setOpenProcedureModal(true);
        setModalState("new");
    };

    const handleEdit = (item) => {
        setModalState("edit");
        setOldPayload(item);
        setOpenProcedureModal(true);
    };

    const handleView = (item) => {
        setModalState("view");
        setOldPayload(item);
        setOpenProcedureModal(true);
    };

    // --- New Handlers for Procedure Result Upload and View ---
    const fileInputRef = useRef(null);
    const [uploadProcedureId, setUploadProcedureId] = useState(null);

    const handleUploadClick = (procedureId) => {
        setUploadProcedureId(procedureId);
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleProcedureFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !uploadProcedureId) return;
        try {
            const result = await UploadProcedureResultApi(file, uploadProcedureId);
            activateNotifications("Procedure result uploaded successfully", "success");
            setTrigger(!Trigger);
        } catch (err) {
            activateNotifications(err.message, "error");
        }
        e.target.value = null;
        setUploadProcedureId(null);
    };

    const handleViewResult = async (resultArray, procedureName = "Procedure Result") => {
        if (resultArray && resultArray.length > 0) {
            try {
                const urls = await ViewMultipleRadiologyResultsApi(resultArray);
                // Use DICOM viewer modal instead of popup
                setViewerImageUrls(urls);
                setViewerTestName(procedureName);
                setViewerModalOpen(true);
            } catch (error) {
                activateNotifications("Error fetching procedure results", "error");
            }
        } else {
            activateNotifications("No procedure result available for viewing", "error");
        }
    };
    // --- End New Handlers ---

    useEffect(() => {
        getAllProcedureHistory();
    }, [isOpen, OpenProcedureModal, Trigger]);

    return (
        <Box
            bg="#fff"
            border="1px solid #EFEFEF"
            mt="10px"
            py="17px"
            px={["18px", "18px"]}
            rounded="10px"
        >
            {IsLoading && (<Preloader />)}
            {showToast.show && (<ShowToast message={showToast.message} status={showToast.status} />)}

            {/* Filter Section */}
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
                            color="#1F2937"
                            fontWeight="500"
                            fontSize="13px"
                        >
                            All{" "}
                            <Box as="span" color="#667085" fontWeight="400" fontSize="13px">
                                ({Data?.length})
                            </Box>
                        </Text>
                    </Box>
                    <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterInProgress}>
                        <Text
                            py="8.5px"
                            px="12px"
                            bg={InProgress ? "#fff" : "transparent"}
                            rounded="7px"
                            color="#1F2937"
                            fontWeight="500"
                            fontSize="13px"
                        >
                            Inprogress{" "}
                            <Box as="span" color="#667085" fontWeight="400" fontSize="13px">
                                ({Data.filter(item => item.status === "inprogress").length})
                            </Box>
                        </Text>
                    </Box>
                    <Box onClick={filterProcessed}>
                        <Text
                            py="8.5px"
                            px="12px"
                            bg={Processed ? "#fff" : "transparent"}
                            rounded="7px"
                            color="#1F2937"
                            fontWeight="500"
                            fontSize="13px"
                        >
                            Processed{" "}
                            <Box as="span" color="#667085" fontWeight="400" fontSize="13px">
                                ({Data.filter(item => item.status === "processed").length})
                            </Box>
                        </Text>
                    </Box>
                </Flex>

                <Flex
                    flexWrap="wrap"
                    mt={["10px", "10px", "0px", "0px"]}
                    alignItems="center"
                    justifyContent="flex-end"
                >
                    <HStack>
                        <Input
                            label="Search"
                            onChange={(e) => setSearchInput(e.target.value)}
                            value={SearchInput}
                            bColor="#E4E4E4"
                            leftIcon={<BiSearch />}
                        />
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
                                    onClick={() => {
                                        setFilteredData(null);
                                        setSearchInput("");
                                    }}
                                    textTransform="capitalize"
                                    fontWeight="500"
                                    color="#2F2F2F"
                                    _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}
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

            <Flex
                justifyContent="space-between"
                flexWrap="wrap"
                mt={["10px", "10px", "10px", "10px"]}
                w={["100%", "100%", "50%", "37%"]}
            >
                <Button
                    rightIcon={<SlPlus />}
                    w={["100%", "100%", "144px", "144px"]}
                    px="120px"
                    onClick={AddProcedure}
                >
                    Schedule Procedure
                </Button>
            </Flex>

            {/* Procedure History Table */}
            <Box
                bg="#fff"
                border="1px solid #EFEFEF"
                mt="12px"
                py="15px"
                px="15px"
                rounded="10px"
                overflowX="auto"
            >
                <Text mb="20px" fontWeight="700" fontSize="16px" color="blue.blue500">
                    Procedure History
                </Text>
                <TableContainer>
                    <Table variant="striped">
                        <Thead bg="#fff">
                            <Tr>
                                <Th fontSize="13px" color="#534D59" fontWeight="600">
                                    Patient Name
                                </Th>
                                <Th fontSize="13px" color="#534D59" fontWeight="600">
                                    Doctor
                                </Th>
                                <Th fontSize="13px" color="#534D59" fontWeight="600">
                                    Appointment Date
                                </Th>
                                <Th fontSize="13px" color="#534D59" fontWeight="600">
                                    Procedure Name
                                </Th>
                                <Th fontSize="13px" color="#534D59" fontWeight="600">
                                    Status
                                </Th>
                                <Th fontSize="13px" color="#534D59" fontWeight="600">
                                   Payment Status
                                </Th>
                                <Th fontSize="13px" color="#534D59" fontWeight="600">
                                    Actions
                                </Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {PaginatedData.map((item, i) => (
                                <TableRow
                                    key={i}
                                    type="patient-procedure"
                                    name={`${item.patient?.firstName} ${item.patient?.lastName}`}
                                    mrn={`${item.patient?.MRN}`}
                                    doctor={item.raiseby}
                                    date={moment(item.appointmentdate).format("lll")}
                                    testName={item.procedure}
                                    status={item.status}
                                    PaymentStatus={item.payment?.status}
                                    onEdit={() => handleEdit(item)}
                                    onView={() => handleView(item)}
                                    onViewResult={() => handleViewResult(item.procedureresult, item.procedure)}
                                    onUpload={() => handleUploadClick(item._id)}
                                />
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
                <CreateProcedureModal
                    isOpen={OpenProcedureModal}
                    onClose={() => setOpenProcedureModal(false)}
                    type={ModalState}
                    activateNotifications={activateNotifications}
                    oldPayload={OldPayload}
                />
                <ToTransferModal
                    isOpen={isOpen}
                    oldPayload={OldPayload}
                    onClose={onClose}
                    activateNotifications={activateNotifications}
                />
            </Box>

            <Pagination
                postPerPage={PostPerPage}
                currentPage={CurrentPage}
                totalPosts={Data.length}
                paginate={paginate}
            />

            {/* Hidden file input for procedure result upload */}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleProcedureFileChange}
            />
            
            {/* DICOM Viewer Modal for procedure results */}
            <DicomViewerModal
                isOpen={viewerModalOpen}
                onClose={() => setViewerModalOpen(false)}
                imageUrls={viewerImageUrls}
                testName={viewerTestName}
            />
        </Box>
    );
}
