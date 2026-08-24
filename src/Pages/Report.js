import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../Layouts/Index";
import { Text, Flex, HStack, Box, useDisclosure } from "@chakra-ui/react";
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
    MenuItem, SimpleGrid, Select
} from "@chakra-ui/react";
import * as XLSX from 'xlsx/xlsx.mjs';
import TableRow from "../Components/TableRow";
import Button from "../Components/Button";
import Input from "../Components/Input";
import Preloader from "../Components/Preloader";
import ShowToast from "../Components/ToastNotification";
import { CgSearch } from "react-icons/cg";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import CreateUserModal from "../Components/CreateUserModal";
import BulkUploadModal from "../Components/BulkUploadModal";
import { GetFullReportApi, UpdateUserStatusApi, GetReportSettingsApi } from "../Utils/ApiCalls";
import moment from "moment";
import Seo from "../Utils/Seo";
import { FaCalendarAlt } from "react-icons/fa";
import { IoFilter } from "react-icons/io5";
import { HiOutlineDocumentArrowUp } from "react-icons/hi2";
import { BiSearch } from "react-icons/bi";

import { SlPlus } from "react-icons/sl";
import Pagination from "../Components/Pagination";
import { configuration } from "../Utils/Helpers";
export default function Report() {
    const [IsLoading, setIsLoading] = useState(true);
    const [Loading, setLoading] = useState(false);
    const [All, setAll] = useState(true);
    const [Active, setActive] = useState(false);
    const [InActive, setInActive] = useState(false);
    const [Trigger, setTrigger] = useState(false);
    const [Data, setData] = useState([]);
    const [FilterData, setFilterData] = useState([]);
    const [ModalState, setModalState] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [FilterUser, setFilterUser] = useState({});

    // filter by date
    const [ByDate, setByDate] = useState(false);
    const [StartDate, setStartDate] = useState("");
    const [EndDate, setEndDate] = useState("");





    // Pagination settings to follow
    const [CurrentPage, setCurrentPage] = useState(1);
    const [PostPerPage, setPostPerPage] = useState(configuration.sizePerPage);

    //get current post
    const indexOfLastSra = CurrentPage * PostPerPage;
    const indexOfFirstSra = indexOfLastSra - PostPerPage;
    const PaginatedData = FilterData.slice(indexOfFirstSra, indexOfLastSra);
    //change page
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Pagination settings to follow end here


    const [QuerySettings, setQuerySettings] = useState([]);
    const [QueryType, setQueryType] = useState("");
    const [QueryGroup, setQueryGroup] = useState("");
    const [QueryStartDate, setQueryStartDate] = useState("");
    const [QueryEndDate, setQueryEndDate] = useState("");

    // Search Filter settings to follow
    const [SearchInput, setSearchInput] = useState("");
    const [FilteredData, setFilteredData] = useState(null);

    const handleInputChange = (e) => {
        let val = e.target.value.toLowerCase();
        let filter = Data.filter(
            (item) =>
                item.role?.toLowerCase().includes(val) ||
                item.email?.toLowerCase().includes(val) ||
                item.firstName?.toLowerCase().includes(val) ||
                item.lastName?.toLowerCase().includes(val) ||
                item.patientName?.toLowerCase().includes(val) ||
                item.nameOfPt?.toLowerCase().includes(val) ||
                item.patientNumber?.toLowerCase().includes(val) ||
                item.ptNumber?.toLowerCase().includes(val) ||
                item.patientSurname?.toLowerCase().includes(val) ||
                item.patientFirstName?.toLowerCase().includes(val) ||
                item.diagnosis?.toLowerCase().includes(val) ||
                item.presentingComplaint?.toLowerCase().includes(val) ||
                item.labinvestigation?.toLowerCase().includes(val) ||
                item.drugsGiven?.toLowerCase().includes(val) ||
                item.dateOfDischarge?.toLowerCase().includes(val) ||
                item.dischargedate?.toLowerCase().includes(val) ||
                item.ageGroup?.toLowerCase().includes(val)
        );
        console.log("filter checking", filter);
        setFilteredData(filter);
        setSearchInput(e.target.value);
    };

    const filterBy = (title) => {
        console.log("filter checking", title);

        if (title === "role") {
            let filter = Data.filter((item) =>
                item.role?.toLowerCase().includes(SearchInput.toLowerCase())
            );
            setFilteredData(filter);
            console.log("filter checking", filter);
        } else if (title === "email") {
            let filter = Data.filter((item) =>
                item.email?.toLowerCase().includes(SearchInput.toLowerCase())
            );
            setFilteredData(filter);
            console.log("filter checking", filter);
        } else if (title === "name") {
            let filter = Data.filter(
                (item) =>
                    item.firstName?.toLowerCase().includes(SearchInput.toLowerCase()) ||
                    item.lastName?.toLowerCase().includes(SearchInput.toLowerCase()) ||
                    item.patientName?.toLowerCase().includes(SearchInput.toLowerCase()) ||
                    item.patientSurname?.toLowerCase().includes(SearchInput.toLowerCase()) ||
                    item.patientFirstName?.toLowerCase().includes(SearchInput.toLowerCase())
            );
            setFilteredData(filter);
            console.log("filter checking", filter);
        } else if (title === "date") {
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
            console.log(" Date filter checking", filter);
            console.log(" Date plus  checking", endDate.toISOString());
        }
    };

    // Search Filter settings to follow end here

    const [showToast, setShowToast] = useState({
        show: false,
        message: "",
        status: "",
    });

    const router = useNavigate();

    const fetchReport = async () => {
        setLoading(true);
        try {
            const result = await GetFullReportApi(QueryType, QueryGroup, QueryStartDate, QueryEndDate);

            console.log("result GetFullReportApi", result);

            if (result.status === true) {
                setLoading(false);
                setData(result.queryresult);
                setFilterData(result.queryresult);
            }
        } catch (e) {
            console.log(e.message);
        }
    };

    const getReportSettings = async () => {
        setIsLoading(true);
        try {
            const result = await GetReportSettingsApi();

            console.log("getReportSettings", result);

            if (result.status === true) {
                setIsLoading(false);
                setQuerySettings(result.querygroupsettings)
            }
        } catch (e) {
            console.log(e.message);
        }
    };



    const filterAll = () => {
        setAll(true);
        setActive(false);
        setInActive(false);

        setFilterData(Data);
    };
    const filterActive = () => {
        setAll(false);
        setActive(true);
        setInActive(false);

        const filterData = Data.filter((item) => item.status === "active");

        setFilterData(filterData);
    };

    const filterInactive = () => {
        setAll(false);
        setActive(false);
        setInActive(true);

        const filterData = Data.filter((item) => item.status === "inactive");

        setFilterData(filterData);
    };


    const formatChunkedText = (inputData, fallbackArray, getProp, chunkSize = 10) => {
        let items = [];
        if (typeof inputData === 'string' && inputData.trim()) {
            items = inputData.split(',').map(s => s.trim()).filter(Boolean);
        } else if (Array.isArray(fallbackArray) && fallbackArray.length > 0) {
            items = fallbackArray.map(l => typeof l === 'string' ? l : getProp(l)).filter(Boolean);
        }
        if (items.length === 0) return typeof inputData === 'string' ? inputData : "";
        let chunks = [];
        for (let i = 0; i < items.length; i += chunkSize) {
            chunks.push(items.slice(i, i + chunkSize).join(", "));
        }
        return chunks.join("\n");
    };

    const DownloadFile = () => {
        var workbook = XLSX.utils.book_new();
        let exportData = Data;

        if (QueryType === "inpatientregister" || QueryType === "inpatientregisterreport" || QueryType === "admissionreport") {
            exportData = Data.map((item, index) => {
                const formatDateStr = (d) => {
                    if (!d) return "";
                    const m = moment(d);
                    return m.isValid() ? m.format("DD/MM/YYYY") : d;
                };

                const pName = item.patientName || `${item.patientSurname || ''} ${item.patientFirstName || ''}`.trim() || `${item.patient?.lastName || ''} ${item.patient?.firstName || ''}`.trim();
                const pNum = item.patientNumber || item.patient?.MRN || "";
                const pSex = item.sex || item.patient?.gender || "";
                const pAge = item.age || item.patient?.age || "";
                const diag = item.diagnosis || (Array.isArray(item.alldiagnosis) ? item.alldiagnosis.map(d => typeof d === 'string' ? d : (d.diagnosis || d.note || '')).filter(Boolean).join(", ") : "");
                const lab = item.labinvestigation || (Array.isArray(item.labDetails) && item.labDetails.length > 0 ? item.labDetails.map(l => typeof l === 'string' ? l : (l.investigation || l.testName || l.labTest || l.test || l.serviceName || l.name || l.title || l.labTestName || '')).filter(Boolean).join(", ") : "");
                const drugs = item.drugsGiven || (Array.isArray(item.prescriptionDetails) && item.prescriptionDetails.length > 0 ? item.prescriptionDetails.map(p => typeof p === 'string' ? p : (p.prescription || p.drugName || p.drug || p.name || p.drugGiven || '')).filter(Boolean).join(", ") : "");
                const dischDate = item.dateOfDischarge || item.dischargedate || "";

                const outcome = item.admissionOutcome || {
                    abs: item.dischargereason?.toUpperCase().includes("ABS") ? item.dischargedate : null,
                    disch: item.dischargereason?.toUpperCase().includes("DISCH") ? item.dischargedate : null,
                    ref: item.dischargereason?.toUpperCase().includes("REF") ? item.dischargedate : null,
                    lama: item.dischargereason?.toUpperCase().includes("LAMA") ? item.dischargedate : null,
                    death: (item.dischargereason?.toUpperCase().includes("DEATH") || item.dischargereason?.toUpperCase().includes("DEAD")) ? item.dischargedate : null
                };

                return {
                    "S/N": item.sn || index + 1,
                    "Date of Admission": formatDateStr(item.dateOfAdmission || item.referddate),
                    "Name of Patient (Surname First)": pName,
                    "Patient number": pNum,
                    "Sex": pSex,
                    "Age": pAge,
                    "Diagnosis": diag,
                    "Laboratory Test": lab,
                    "Drug Given": drugs,
                    "Date of Discharge": formatDateStr(dischDate),
                    "ABS": formatDateStr(outcome?.abs),
                    "DISCH": formatDateStr(outcome?.disch),
                    "REF": formatDateStr(outcome?.ref),
                    "LAMA": formatDateStr(outcome?.lama),
                    "DEATH": formatDateStr(outcome?.death)
                };
            });
        } else if (QueryType === "outpatientregister" || QueryType === "outpatientregisterreport") {
            exportData = Data.map((item, index) => {
                const formatDateStr = (d) => {
                    if (!d) return "";
                    const m = moment(d);
                    return m.isValid() ? m.format("DD/MM/YYYY") : d;
                };

                const diag = item.diagnosis || (Array.isArray(item.alldiagnosis) ? item.alldiagnosis.map(d => typeof d === 'string' ? d : (d.diagnosis || d.note || '')).filter(Boolean).join(", ") : "");
                const lab = item.labinvestigation || (Array.isArray(item.labDetails) && item.labDetails.length > 0 ? item.labDetails.map(l => typeof l === 'string' ? l : (l.investigation || l.testName || l.labTest || l.test || l.serviceName || l.name || l.title || l.labTestName || '')).filter(Boolean).join(", ") : "");
                const drugs = item.drugsGiven || (Array.isArray(item.prescriptionDetails) && item.prescriptionDetails.length > 0 ? item.prescriptionDetails.map(p => typeof p === 'string' ? p : `${p.prescription || p.drugName || p.drug || p.name || ''} ${p.dosage || ''} ${p.frequency || ''} ${p.duration || ''}`.trim()).filter(Boolean).join(", ") : "");

                return {
                    "S/N": item.sn || index + 1,
                    "DATE": formatDateStr(item.date || item.appointmentdate),
                    "NAME OF PT": item.nameOfPt || item.patientName || `${item.lastName || ''} ${item.firstName || ''}`.trim(),
                    "PT NUMBER": item.ptNumber || item.patientNumber || item.MRN || "",
                    "Sex": item.sex || item.patient?.gender || "",
                    "Age": item.age || item.patient?.age || "",
                    "TYPE OF Attendance New/F/up": item.typeOfAttendance || item.appointmenttype || "",
                    "Presenting complaint": item.presentingComplaint || item.reason || "",
                    "Diagnosis": diag,
                    "Laboratory investigation": lab,
                    "Drug Given": drugs
                };
            });
        } else if (QueryType === "generalattendance" || QueryType === "generalattendancereport") {
            exportData = Data.map((item) => ({
                "Age Group": item.ageGroup,
                "M": item.M ?? item.male ?? 0,
                "F": item.F ?? item.female ?? 0,
                "TOTAL": item.total ?? item.TOTAL ?? 0
            }));
        }

        var worksheet = XLSX.utils.json_to_sheet(exportData);
        XLSX.utils.book_append_sheet(workbook, worksheet);
        let date = moment(Date.now()).format("DD/MM/YYYY");
        XLSX.writeFile(workbook, `${date}_Care Connect_${QueryType}_report.xlsx`);
    }
    useEffect(() => {

        getReportSettings()
    }, [isOpen, Trigger]);

    return (
        <MainLayout>
            {IsLoading && <Preloader />}

            <Seo title="User Management" description="Care Connect Patients" />

            {showToast.show && (
                <ShowToast message={showToast.message} status={showToast.status} />
            )}
            <HStack>
                <Text color="#1F2937" fontWeight="600" fontSize="19px">
                    Report
                </Text>
                <Text color="#667085" fontWeight="400" fontSize="18px">
                    ({Data?.length})
                </Text>
            </HStack>
            <Text color="#686C75" mt="9px" fontWeight="400" fontSize="15px">
              Access reports, and analytics across departments all in one place.
            </Text>
            {/* filters needed for the get full report */}
            <Box
                bg="#fff"
                border="1px solid #EFEFEF"
                mt="12px"
                py="17px"
                px={["18px", "18px"]}
                rounded="10px"
            >

                <SimpleGrid mt="12px" columns={{ base: 2, md: 4 }} spacing={2}>
                    <Box>
                        <Text color="#1F2937" fontWeight="500" fontSize="14px">Report Category</Text>
                        <Select fontSize={QueryType !== "" ? "16px" : "13px"}
                            h="45px"
                            borderWidth="2px"
                            borderColor="#E4E4E4"
                            _hover={{ borderColor: "#7A27AB" }}
                            _focus={{ borderColor: "blue.blue500" }}
                            value={QueryType}
                            textTransform="capitalize"
                            onChange={(e) =>{
                                setQueryType(e.target.value)
                                setData([])
                            }}
                            placeholder="Select Report Category"
                        >

                            {
                                QuerySettings?.map((item, i) => (
                                    <option value={`${item.querytype}`} key={i}>{item.querytype === "generalattendance" ? "General Attendance Report" : item.querytype === "outpatientregister" ? "Outpatient Register Report" : item.querytype === "inpatientregister" ? "Inpatient Register Report" : item.querytype.replace("report"," report ").replace("hmo","hmo ").replace("for"," for ").replace("secondaryservice","Secondary service")}</option>

                                ))
                            }



                        </Select>
                    </Box>
                    <Box>
                        <Text color="#1F2937" fontWeight="500" fontSize="14px">Department/Unit/Ward</Text>
                        <Select fontSize={QueryGroup !== "" ? "16px" : "13px"}
                            h="45px"
                            borderWidth="2px"
                            borderColor="#E4E4E4"
                            _hover={{ borderColor: "#7A27AB" }}
                            _focus={{ borderColor: "blue.blue500" }}
                            value={QueryGroup}
                            textTransform="capitalize"
                            onChange={(e) => {
                                setQueryGroup(e.target.value)
                                setData([])
                            }}
                            placeholder="Select Department/Unit/Ward"
                        >

                            {
                                QuerySettings?.filter(item => item.querytype === QueryType)[0]?.querygroup?.map((item, i) => (
                                    <option value={`${item}`} key={i}>{item} </option>

                                ))
                            }


                        </Select>
                    </Box>
                    <Box>
                        <Text color="#1F2937" fontWeight="500" fontSize="14px">Start Date</Text>
                        <Input type="date" onChange={(e) =>{
                         setQueryStartDate(e.target.value)
                         setData([])
                        }
                        } value={QueryStartDate} bColor="#E4E4E4" leftIcon={<FaCalendarAlt />} />

                    </Box>
                    <Box>
                        <Text color="#1F2937" fontWeight="500" fontSize="14px">End Date</Text>
                        <Input type="date" onChange={(e) => {
                            setQueryEndDate(e.target.value)
                            setData([])

                            } } value={QueryEndDate} bColor="#E4E4E4" leftIcon={<FaCalendarAlt />} />

                    </Box>




                </SimpleGrid>


                <Flex justifyContent="flex-end" mt="2">
                    <Button
                        mt={["10px", "10px", "0px", "0px"]}
                        isLoading={Loading}
                        loadingText="Fetching..."
                        background="#f8ddd1 "
                        border="1px solid #EA5937"
                        color="blue.blue500"
                        w={["100%", "100%", "144px", "144px"]}
                        onClick={fetchReport}
                        disabled={QueryType !== "" && QueryGroup !== "" && QueryStartDate !== "" && QueryEndDate !== "" ? false : true}
                    >
                        Fetch Report
                    </Button>
                </Flex>

            </Box>

            {/* filters needed for the get full report end heree ....*/}

            {
                Data.length > 0 && (
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
                                justifyContent="space-between"
                                flexWrap="wrap"
                                mt={["10px", "10px", "10px", "10px"]}
                                w={["100%", "100%", "50%", "37%"]}
                            >
                                <Button
                                    rightIcon={<FaCloudDownloadAlt />}
                                    w={["100%", "100%", "144px", "144px"]}
                                onClick={DownloadFile}
                                >
                                    Download
                                </Button>


                            </Flex>

                            <Flex
                                flexWrap="wrap"
                                mt={["10px", "10px", "0px", "0px"]}
                                alignItems="center"
                                justifyContent={"flex-end"}
                            >
                                <HStack  >
                                    {ByDate === false ? (
                                        <Input

                                            label="Search"
                                            onChange={handleInputChange}
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

                                            <Flex onClick={() => filterBy("date")} cursor="pointer" px="5px" py="3px" rounded="5px" bg="blue.blue500" color="#fff" justifyContent="center" alignItems="center" >
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
                                                onClick={() => filterBy("name")}
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
                                                    <Text>by Name</Text>
                                                </HStack>
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => filterBy("email")}
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
                                                    <Text>by email</Text>
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
                                                onClick={() => filterBy("role")}
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
                                                    <Text>by role</Text>
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
                                                    setByDate(false)
                                                    setStartDate("")
                                                    setEndDate("")
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

                        {
                            QueryType === "financialreport" && (
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
                                                payment reference
                                            </Th>
                                            <Th
                                                fontSize="13px"
                                                textTransform="capitalize"
                                                color="#534D59"
                                                fontWeight="600"
                                            >
                                                payment category
                                            </Th>
                                            <Th
                                                fontSize="13px"
                                                textTransform="capitalize"
                                                color="#534D59"
                                                fontWeight="600"
                                            >
                                                payment type
                                            </Th>
                                            <Th
                                                fontSize="13px"
                                                textTransform="capitalize"
                                                color="#534D59"
                                                fontWeight="600"
                                            >
                                                qyt
                                            </Th>
                                            <Th
                                                fontSize="13px"
                                                textTransform="capitalize"
                                                color="#534D59"
                                                fontWeight="600"
                                            >
                                                amount (&#8358;)
                                            </Th>
                                            <Th
                                                fontSize="13px"
                                                textTransform="capitalize"
                                                color="#534D59"
                                                fontWeight="600"
                                            >
                                                total (&#8358;)
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
                                                status
                                            </Th>
                                           
                                        </Tr>
                                    </Thead>
                                    <Tbody>

                                    {
                                        FilterData.map((item,i)=> (
                                            <TableRow
                                            key={i}
                                            type="financial-report"
                                            name={`${item.patient[0]?.firstName} ${item.patient[0]?.lastName}`}
                                            mrn={item.patient[0]?.MRN}                                        
                                            reference={item.paymentreference}
                                            category={item.paymentcategory}
                                            paymentType={item.paymentype} 
                                            quantity={item.qty} 
                                            status={item.status} 
                                            amount={item.amount/item.qty} 
                                            total={item.amount?.toLocaleString()} 
                                            onRemove={onOpen}
                                            date={moment(item.createdAt).format("lll")}
                                            phone={item.phoneNumber}
                                           
                                        />
                                        ))
                                    }

                                       

                                    </Tbody>
                                </Table>
                            </TableContainer>
                            )
                        }
                           
                        {
                            QueryType === "appointmentreport" && (
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
                                                Clinic
                                            </Th>
                                            <Th
                                                fontSize="13px"
                                                textTransform="capitalize"
                                                color="#534D59"
                                                fontWeight="600"
                                            >
                                                Appointment Category
                                            </Th>
                                            <Th
                                                fontSize="13px"
                                                textTransform="capitalize"
                                                color="#534D59"
                                                fontWeight="600"
                                            >
                                                Appointment Type
                                            </Th>
                                            <Th
                                                fontSize="13px"
                                                textTransform="capitalize"
                                                color="#534D59"
                                                fontWeight="600"
                                            >
                                                Appointment Date
                                            </Th>
                                            <Th
                                                fontSize="13px"
                                                textTransform="capitalize"
                                                color="#534D59"
                                                fontWeight="600"
                                            >
                                                Appointment ID
                                            </Th>
                                           
                                           
                                            <Th
                                                fontSize="13px"
                                                textTransform="capitalize"
                                                color="#534D59"
                                                fontWeight="600"
                                            >
                                                Physical assault
                                            </Th>
                                            <Th
                                                fontSize="13px"
                                                textTransform="capitalize"
                                                color="#534D59"
                                                fontWeight="600"
                                            >
                                                Police Name
                                            </Th>
                                            <Th
                                                fontSize="13px"
                                                textTransform="capitalize"
                                                color="#534D59"
                                                fontWeight="600"
                                            >
                                                Police Case
                                            </Th>
                                            <Th
                                                fontSize="13px"
                                                textTransform="capitalize"
                                                color="#534D59"
                                                fontWeight="600"
                                            >
                                                Police Phone N0
                                            </Th>
                                            <Th
                                                fontSize="13px"
                                                textTransform="capitalize"
                                                color="#534D59"
                                                fontWeight="600"
                                            >
                                                reason
                                            </Th>
                                            <Th
                                                fontSize="13px"
                                                textTransform="capitalize"
                                                color="#534D59"
                                                fontWeight="600"
                                            >
                                                service number
                                            </Th>
                                            <Th
                                                fontSize="13px"
                                                textTransform="capitalize"
                                                color="#534D59"
                                                fontWeight="600"
                                            >
                                                Sexual assault
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
                                                status
                                            </Th>
                                           
                                        </Tr>
                                    </Thead>
                                    <Tbody>

                                    {
                                        FilterData.map((item,i)=> (
                                            <TableRow
                                            key={i}
                                            type="appointment-report"
                                            name={`${item.patient[0]?.firstName} ${item.patient[0]?.lastName}`}
                                            mrn={item.patient[0]?.MRN}                                        
                                            clinic={item.clinic}
                                            category={item.appointmentcategory}
                                            appointmentType={item.appointmenttype}
                                            referredDate={moment(item.appointmentdate).format("lll")}
                                            sn={item.appointmentid}
                                            physicalAssault={item.physicalassault? "true":"false"}
                                            policeName={item.policaename}
                                            policeCase={item.policecase ? "true":"false"}
                                            phone={item.policephonenumber}
                                            serviceNumber={item.servicenumber}
                                            reason={item.reason}
                                            sexualAssault={item.sexualassault}
                                            date={moment(item.createdAt).format("lll")}
                                            status={item.status}
                                           
                                        />
                                        ))
                                    }

                                       

                                    </Tbody>
                                </Table>
                            </TableContainer>
                            )
                        }
                        {
                            (QueryType === "inpatientregister" || QueryType === "inpatientregisterreport" || QueryType === "admissionreport") && (
                                <TableContainer>
                                    <Text color="#1F2937" fontWeight="700" fontSize="20px" textAlign="center" my="3" textTransform="uppercase" letterSpacing="0.5px">
                                        DAILY INPATIENT REGISTER
                                    </Text>
                                    <Table variant="striped" size="sm" borderWidth="1px" borderColor="#E2E8F0">
                                        <Thead bg="#F7FAFC">
                                            <Tr>
                                                <Th rowSpan={2} fontSize="12px" textTransform="none" color="#2D3748" fontWeight="700" textAlign="center" border="1px solid #CBD5E0">
                                                    S/N
                                                </Th>
                                                <Th rowSpan={2} fontSize="12px" textTransform="none" color="#2D3748" fontWeight="700" textAlign="center" border="1px solid #CBD5E0">
                                                    Date of Admission
                                                </Th>
                                                <Th rowSpan={2} fontSize="12px" textTransform="none" color="#2D3748" fontWeight="700" textAlign="center" border="1px solid #CBD5E0">
                                                    Name of Patient (Surname First)
                                                </Th>
                                                <Th rowSpan={2} fontSize="12px" textTransform="none" color="#2D3748" fontWeight="700" textAlign="center" border="1px solid #CBD5E0">
                                                    Patient number
                                                </Th>
                                                <Th rowSpan={2} fontSize="12px" textTransform="none" color="#2D3748" fontWeight="700" textAlign="center" border="1px solid #CBD5E0">
                                                    Sex
                                                </Th>
                                                <Th rowSpan={2} fontSize="12px" textTransform="none" color="#2D3748" fontWeight="700" textAlign="center" border="1px solid #CBD5E0">
                                                    Age
                                                </Th>
                                                <Th rowSpan={2} fontSize="12px" textTransform="none" color="#2D3748" fontWeight="700" textAlign="center" border="1px solid #CBD5E0">
                                                    Diagnosis
                                                </Th>
                                                <Th rowSpan={2} fontSize="12px" textTransform="none" color="#2D3748" fontWeight="700" textAlign="center" border="1px solid #CBD5E0">
                                                    Laboratory Test
                                                </Th>
                                                <Th rowSpan={2} fontSize="12px" textTransform="none" color="#2D3748" fontWeight="700" textAlign="center" border="1px solid #CBD5E0">
                                                    Drug Given
                                                </Th>
                                                <Th rowSpan={2} fontSize="12px" textTransform="none" color="#2D3748" fontWeight="700" textAlign="center" border="1px solid #CBD5E0">
                                                    Date of Discharge
                                                </Th>
                                                <Th colSpan={5} fontSize="12px" textTransform="none" color="#2D3748" fontWeight="700" textAlign="center" border="1px solid #CBD5E0">
                                                    ADMISSION OUTCOME (dates)
                                                </Th>
                                            </Tr>
                                            <Tr bg="#F7FAFC">
                                                <Th fontSize="11px" textTransform="none" color="#2D3748" fontWeight="700" textAlign="center" border="1px solid #CBD5E0">
                                                    ABS
                                                </Th>
                                                <Th fontSize="11px" textTransform="none" color="#2D3748" fontWeight="700" textAlign="center" border="1px solid #CBD5E0">
                                                    DISCH
                                                </Th>
                                                <Th fontSize="11px" textTransform="none" color="#2D3748" fontWeight="700" textAlign="center" border="1px solid #CBD5E0">
                                                    REF
                                                </Th>
                                                <Th fontSize="11px" textTransform="none" color="#2D3748" fontWeight="700" textAlign="center" border="1px solid #CBD5E0">
                                                    LAMA
                                                </Th>
                                                <Th fontSize="11px" textTransform="none" color="#2D3748" fontWeight="700" textAlign="center" border="1px solid #CBD5E0">
                                                    DEATH
                                                </Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {
                                                FilterData.map((item, i) => (
                                                    <TableRow
                                                        key={i}
                                                        type="inpatient-register"
                                                        sn={item.sn || i + 1}
                                                        dateOfAdmission={item.dateOfAdmission || item.referddate}
                                                        patientName={item.patientName || `${item.patientSurname || ''} ${item.patientFirstName || ''}`.trim() || `${item.patient?.lastName || ''} ${item.patient?.firstName || ''}`.trim()}
                                                        patientNumber={item.patientNumber || item.patient?.MRN}
                                                        sex={item.sex || item.patient?.gender}
                                                        age={item.age || item.patient?.age}
                                                        diagnosis={formatChunkedText(item.diagnosis, item.alldiagnosis, d => d.diagnosis || d.note || '', 10)}
                                                        labinvestigation={formatChunkedText(item.labinvestigation, item.labDetails, l => l.investigation || l.testName || l.labTest || l.test || l.serviceName || l.name || l.title || l.labTestName || '', 10)}
                                                        drugsGiven={formatChunkedText(item.drugsGiven, item.prescriptionDetails, p => p.prescription || p.drugName || p.drug || p.name || p.drugGiven || '', 10)}
                                                        dateOfDischarge={item.dateOfDischarge || item.dischargedate}
                                                        admissionOutcome={item.admissionOutcome || {
                                                            abs: item.dischargereason?.toUpperCase().includes("ABS") ? item.dischargedate : null,
                                                            disch: item.dischargereason?.toUpperCase().includes("DISCH") ? item.dischargedate : null,
                                                            ref: item.dischargereason?.toUpperCase().includes("REF") ? item.dischargedate : null,
                                                            lama: item.dischargereason?.toUpperCase().includes("LAMA") ? item.dischargedate : null,
                                                            death: (item.dischargereason?.toUpperCase().includes("DEATH") || item.dischargereason?.toUpperCase().includes("DEAD")) ? item.dischargedate : null
                                                        }}
                                                    />
                                                ))
                                            }
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            )
                        }
                        {
                            (QueryType === "outpatientregister" || QueryType === "outpatientregisterreport") && (
                                <TableContainer>
                                    <Text color="#1F2937" fontWeight="700" fontSize="20px" textAlign="center" my="3" textTransform="uppercase" letterSpacing="0.5px">
                                        DAILY OUTPATIENT REGISTER (OPD REG.)
                                    </Text>
                                    <Table variant="striped" size="sm" borderWidth="1px" borderColor="#E2E8F0">
                                        <Thead bg="#F7FAFC">
                                            <Tr>
                                                <Th fontSize="12px" textTransform="none" color="#2D3748" fontWeight="700" textAlign="center" border="1px solid #CBD5E0">
                                                    S/N
                                                </Th>
                                                <Th fontSize="12px" textTransform="none" color="#2D3748" fontWeight="700" textAlign="center" border="1px solid #CBD5E0">
                                                    DATE
                                                </Th>
                                                <Th fontSize="12px" textTransform="none" color="#2D3748" fontWeight="700" textAlign="center" border="1px solid #CBD5E0">
                                                    NAME OF PT
                                                </Th>
                                                <Th fontSize="12px" textTransform="none" color="#2D3748" fontWeight="700" textAlign="center" border="1px solid #CBD5E0">
                                                    PT NUMBER
                                                </Th>
                                                <Th fontSize="12px" textTransform="none" color="#2D3748" fontWeight="700" textAlign="center" border="1px solid #CBD5E0">
                                                    Sex
                                                </Th>
                                                <Th fontSize="12px" textTransform="none" color="#2D3748" fontWeight="700" textAlign="center" border="1px solid #CBD5E0">
                                                    Age
                                                </Th>
                                                <Th fontSize="12px" textTransform="none" color="#2D3748" fontWeight="700" textAlign="center" border="1px solid #CBD5E0">
                                                    TYPE OF Attendance New/F/up
                                                </Th>
                                                <Th fontSize="12px" textTransform="none" color="#2D3748" fontWeight="700" textAlign="center" border="1px solid #CBD5E0">
                                                    Presenting complaint
                                                </Th>
                                                <Th fontSize="12px" textTransform="none" color="#2D3748" fontWeight="700" textAlign="center" border="1px solid #CBD5E0">
                                                    Diagnosis
                                                </Th>
                                                <Th fontSize="12px" textTransform="none" color="#2D3748" fontWeight="700" textAlign="center" border="1px solid #CBD5E0">
                                                    Laboratory investigation
                                                </Th>
                                                <Th fontSize="12px" textTransform="none" color="#2D3748" fontWeight="700" textAlign="center" border="1px solid #CBD5E0">
                                                    Drug Given
                                                </Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {
                                                FilterData.map((item, i) => (
                                                    <TableRow
                                                        key={i}
                                                        type="outpatient-register"
                                                        sn={item.sn || i + 1}
                                                        date={item.date || item.appointmentdate}
                                                        nameOfPt={item.nameOfPt || item.patientName || `${item.lastName || ''} ${item.firstName || ''}`.trim()}
                                                        ptNumber={item.ptNumber || item.patientNumber || item.MRN}
                                                        sex={item.sex || item.patient?.gender}
                                                        age={item.age || item.patient?.age}
                                                        typeOfAttendance={item.typeOfAttendance || item.appointmenttype}
                                                        presentingComplaint={formatChunkedText(item.presentingComplaint || item.reason, null, null, 10)}
                                                        diagnosis={formatChunkedText(item.diagnosis, item.alldiagnosis, d => d.diagnosis || d.note || '', 10)}
                                                        labinvestigation={formatChunkedText(item.labinvestigation, item.labDetails, l => l.investigation || l.testName || l.labTest || l.test || l.serviceName || l.name || l.title || l.labTestName || '', 10)}
                                                        drugsGiven={formatChunkedText(item.drugsGiven, item.prescriptionDetails, p => typeof p === 'string' ? p : `${p.prescription || p.drugName || p.drug || p.name || ''} ${p.dosage || ''} ${p.frequency || ''} ${p.duration || ''}`.trim(), 10)}
                                                    />
                                                ))
                                            }
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            )
                        }
                        {
                            (QueryType === "generalattendance" || QueryType === "generalattendancereport") && (
                                <TableContainer>
                                    <Text color="#1F2937" fontWeight="700" fontSize="20px" textAlign="center" my="3" textTransform="uppercase" letterSpacing="0.5px">
                                        GENERAL ATTENDANCE
                                    </Text>
                                    <Table variant="striped" size="sm" borderWidth="1px" borderColor="#E2E8F0">
                                        <Thead bg="#F7FAFC">
                                            <Tr>
                                                <Th fontSize="12px" textTransform="none" color="#2D3748" fontWeight="700" textAlign="center" border="1px solid #CBD5E0">
                                                    Age Group
                                                </Th>
                                                <Th fontSize="12px" textTransform="none" color="#2D3748" fontWeight="700" textAlign="center" border="1px solid #CBD5E0">
                                                    M
                                                </Th>
                                                <Th fontSize="12px" textTransform="none" color="#2D3748" fontWeight="700" textAlign="center" border="1px solid #CBD5E0">
                                                    F
                                                </Th>
                                                <Th fontSize="12px" textTransform="none" color="#2D3748" fontWeight="700" textAlign="center" border="1px solid #CBD5E0">
                                                    TOTAL
                                                </Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {
                                                FilterData.map((item, i) => (
                                                    <TableRow
                                                        key={i}
                                                        type="general-attendance"
                                                        ageGroup={item.ageGroup}
                                                        M={item.M ?? item.male}
                                                        F={item.F ?? item.female}
                                                        total={item.total ?? item.TOTAL}
                                                    />
                                                ))
                                            }
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            )
                        }
                        {
                            QueryType === "hmolabreport" && (
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
                                                Test Name
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
                                                Processed Date
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
                                                status
                                            </Th>
                                           
                                        </Tr>
                                    </Thead>
                                    <Tbody>

                                    {
                                        FilterData.map((item,i)=> (
                                            <TableRow
                                            key={i}
                                            type="admission-report"
                                            name={`${item.patient?.firstName} ${item.patient?.lastName}`}
                                            mrn={item.patient?.MRN}                                        
                                            clinic={item.testname}
                                            referredDate={moment(item.processeddate).format("lll")}
                                            date={moment(item.createdAt).format("lll")}
                                            doctor={item.amount}
                                            status={item.status}
                                           
                                        />
                                        ))
                                    }

                                       

                                    </Tbody>
                                </Table>
                            </TableContainer>
                            ) 
                        }
                        {
                            QueryType === "hmoreportforprocedure" && (
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
                                                clinic
                                            </Th>
                                            <Th
                                                fontSize="13px"
                                                textTransform="capitalize"
                                                color="#534D59"
                                                fontWeight="600"
                                            >
                                                Procedure
                                            </Th>
                                            <Th
                                                fontSize="13px"
                                                textTransform="capitalize"
                                                color="#534D59"
                                                fontWeight="600"
                                            >
                                                Appointment Date
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
                                                status
                                            </Th>
                                           
                                        </Tr>
                                    </Thead>
                                    <Tbody>

                                    {
                                        FilterData.map((item,i)=> (
                                            <TableRow
                                            key={i}
                                            type="admission-report"
                                            name={`${item.patient?.firstName} ${item.patient?.lastName}`}
                                            mrn={item.patient?.MRN}                                        
                                            clinic={item.clinic}
                                            referredDate={moment(item.appointmentdate).format("lll")}
                                            date={moment(item.createdAt).format("lll")}
                                            doctor={item.procedure}
                                            status={item.status}
                                           
                                        />
                                        ))
                                    }

                                       

                                    </Tbody>
                                </Table>
                            </TableContainer>
                            ) 
                        }
                        {
                            QueryType === "hmoreportforpharmacy" && (
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
                                                pharmacy
                                            </Th>
                                            <Th
                                                fontSize="13px"
                                                textTransform="capitalize"
                                                color="#534D59"
                                                fontWeight="600"
                                            >
                                                Prescription
                                            </Th>
                                            <Th
                                                fontSize="13px"
                                                textTransform="capitalize"
                                                color="#534D59"
                                                fontWeight="600"
                                            >
                                                Appointment Date
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
                                                Dosage
                                            </Th>
                                           
                                        </Tr>
                                    </Thead>
                                    <Tbody>

                                    {
                                        FilterData.map((item,i)=> (
                                            <TableRow
                                            key={i}
                                            type="admission-report"
                                            name={`${item.patient?.firstName} ${item.patient?.lastName}`}
                                            mrn={item.patient?.MRN}                                        
                                            clinic={item.pharmacy}
                                            referredDate={moment(item.appointmentdate).format("lll")}
                                            date={moment(item.createdAt).format("lll")}
                                            doctor={item.prescription}
                                            status={item.dosage}
                                           
                                        />
                                        ))
                                    }

                                       

                                    </Tbody>
                                </Table>
                            </TableContainer>
                            ) 
                        }

                        {
                            QueryType === "hmoappointmentreport" && (
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
                                                Clinic
                                            </Th>
                                            <Th
                                                fontSize="13px"
                                                textTransform="capitalize"
                                                color="#534D59"
                                                fontWeight="600"
                                            >
                                                Appointment Category
                                            </Th>
                                            <Th
                                                fontSize="13px"
                                                textTransform="capitalize"
                                                color="#534D59"
                                                fontWeight="600"
                                            >
                                                Appointment Type
                                            </Th>
                                            <Th
                                                fontSize="13px"
                                                textTransform="capitalize"
                                                color="#534D59"
                                                fontWeight="600"
                                            >
                                                Appointment Date
                                            </Th>
                                            <Th
                                                fontSize="13px"
                                                textTransform="capitalize"
                                                color="#534D59"
                                                fontWeight="600"
                                            >
                                                Appointment ID
                                            </Th>
                                           
                                           
                                            <Th
                                                fontSize="13px"
                                                textTransform="capitalize"
                                                color="#534D59"
                                                fontWeight="600"
                                            >
                                                Physical assault
                                            </Th>
                                            <Th
                                                fontSize="13px"
                                                textTransform="capitalize"
                                                color="#534D59"
                                                fontWeight="600"
                                            >
                                                Police Name
                                            </Th>
                                            <Th
                                                fontSize="13px"
                                                textTransform="capitalize"
                                                color="#534D59"
                                                fontWeight="600"
                                            >
                                                Police Case
                                            </Th>
                                            <Th
                                                fontSize="13px"
                                                textTransform="capitalize"
                                                color="#534D59"
                                                fontWeight="600"
                                            >
                                                Police Phone N0
                                            </Th>
                                            <Th
                                                fontSize="13px"
                                                textTransform="capitalize"
                                                color="#534D59"
                                                fontWeight="600"
                                            >
                                                reason
                                            </Th>
                                            <Th
                                                fontSize="13px"
                                                textTransform="capitalize"
                                                color="#534D59"
                                                fontWeight="600"
                                            >
                                                service number
                                            </Th>
                                            <Th
                                                fontSize="13px"
                                                textTransform="capitalize"
                                                color="#534D59"
                                                fontWeight="600"
                                            >
                                                Sexual assault
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
                                                status
                                            </Th>
                                           
                                        </Tr>
                                    </Thead>
                                    <Tbody>

                                    {
                                        FilterData.map((item,i)=> (
                                            <TableRow
                                            key={i}
                                            type="appointment-report"
                                            name={`${item.patient?.firstName} ${item.patient?.lastName}`}
                                            mrn={item.patient?.MRN}                                        
                                            clinic={item.clinic}
                                            category={item.appointmentcategory}
                                            appointmentType={item.appointmenttype}
                                            referredDate={moment(item.appointmentdate).format("lll")}
                                            sn={item.appointmentid}
                                            physicalAssault={item.physicalassault? "true":"false"}
                                            policeName={item.policaename}
                                            policeCase={item.policecase ? "true":"false"}
                                            phone={item.policephonenumber}
                                            serviceNumber={item.servicenumber}
                                            reason={item.reason}
                                            sexualAssault={item.sexualassault}
                                            date={moment(item.createdAt).format("lll")}
                                            status={item.status}
                                           
                                        />
                                        ))
                                    }

                                       

                                    </Tbody>
                                </Table>
                            </TableContainer>
                            )
                        }
                        {
                            QueryType === "hmoradiologyreport" && (
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
                                                Test Name
                                            </Th>
                                            <Th
                                                fontSize="13px"
                                                textTransform="capitalize"
                                                color="#534D59"
                                                fontWeight="600"
                                            >
                                                Department
                                            </Th>
                                            <Th
                                                fontSize="13px"
                                                textTransform="capitalize"
                                                color="#534D59"
                                                fontWeight="600"
                                            >
                                                Processed Date
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
                                                status
                                            </Th>
                                           
                                        </Tr>
                                    </Thead>
                                    <Tbody>

                                    {
                                        FilterData.map((item,i)=> (
                                            <TableRow
                                            key={i}
                                            type="admission-report"
                                            name={`${item.patient?.firstName} ${item.patient?.lastName}`}
                                            mrn={item.patient?.MRN}                                        
                                            clinic={item.testname}
                                            referredDate={moment(item.processeddate).format("lll")}
                                            date={moment(item.createdAt).format("lll")}
                                            doctor={item.department}
                                            status={item.status}
                                           
                                        />
                                        ))
                                    }

                                       

                                    </Tbody>
                                </Table>
                            </TableContainer>
                            ) 
                        }

                        {
                            QueryType === "secondaryservicereport" && (
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
                                                Facility
                                            </Th>
                                            <Th
                                                fontSize="13px"
                                                textTransform="capitalize"
                                                color="#534D59"
                                                fontWeight="600"
                                            >
                                                authorization code 
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
                                                date created
                                            </Th>
                                           
                                           
                                        </Tr>
                                    </Thead>
                                    <Tbody>

                                    {
                                        FilterData.map((item,i)=> (
                                            <TableRow
                                            key={i}
                                            type="secondaryService-report"
                                            name={`${item.patient?.firstName} ${item.patient?.lastName}`}
                                            mrn={item.patient?.MRN}                                        
                                            code={item.patient?.authorizationcode}
                                            facility={item.patient?.facilitypateintreferedfrom}
                                            serviceType={item.servicetype}
                                            date={moment(item.createdAt).format("lll")}
                                          
                                           
                                        />
                                        ))
                                    }

                                       

                                    </Tbody>
                                </Table>
                            </TableContainer>
                            )
                        }
                           


                        </Box>
                    </Box>
                )
            }



        </MainLayout>
    );
}
