import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  MenuItem,
  SimpleGrid,
  Select,
} from "@chakra-ui/react";
import * as XLSX from "xlsx/xlsx.mjs";
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
import {
  GetFullReportSummaryApi,
  UpdateUserStatusApi,
  GetReportSummarySettingsApi,
} from "../Utils/ApiCalls";
import moment from "moment";
import Seo from "../Utils/Seo";
import { FaCalendarAlt } from "react-icons/fa";
import { IoFilter } from "react-icons/io5";
import { HiOutlineDocumentArrowUp } from "react-icons/hi2";
import { BiSearch } from "react-icons/bi";
import { SlPlus } from "react-icons/sl";
import Pagination from "../Components/Pagination";
import { configuration } from "../Utils/Helpers";

export default function SummaryReport() {
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
    let filter = Data.filter(
      (item) =>
        item.role?.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.email?.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.firstName?.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.lastName?.toLowerCase().includes(e.target.value.toLowerCase())
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
          item.lastName?.toLowerCase().includes(SearchInput.toLowerCase())
      );
      setFilteredData(filter);
      console.log("filter checking", filter);
    } else if (title === "date") {
      // add 1 day to end date 
      let endDate = new Date(EndDate);
      endDate.setDate(endDate.getDate() + 1);
      // format date back
      let formatedEndDate = endDate.toISOString().split("T")[0];
      let filter = Data.filter(
        (item) =>
          item.createdAt >= StartDate && item.createdAt <= formatedEndDate
      );
      setFilteredData(filter);
      setSearchInput("s");
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

  const nav = useNavigate();
  const { pathname } = useLocation();

  const fetchReport = async () => {
    setLoading(true);
    try {
      const result = await GetFullReportSummaryApi(
        QueryType,
        QueryStartDate,
        QueryEndDate
      );

      console.log("result GetFullReportSummaryApi", result);

      if (result.status === true) {
        setLoading(false);
        localStorage.setItem("pathname", pathname);
        localStorage.setItem(
          "dateRange",
          JSON.stringify({
            from: QueryStartDate,
            to: QueryEndDate,
          })
        );
        if (QueryType === "financialaggregate") {
          let arr = [
            ...result.queryresult?.paid,
           
          ];
          localStorage.setItem("reportSummary", JSON.stringify(arr));
          localStorage.setItem("reportGrandTotal", JSON.stringify(result.queryresult?.grandtotal[0]));
          localStorage.setItem("reportCategory", QueryType);
          nav("/dashboard/report-analytics/print-summary");
        } else if (QueryType === "cashieraggregate") {
          let arr = [...result.queryresult?.paid];
          localStorage.setItem("reportSummary", JSON.stringify(arr));
          localStorage.setItem("reportGrandTotal", JSON.stringify(result.queryresult?.grandtotal[0]));
          localStorage.setItem("reportCategory", QueryType);
          nav("/dashboard/report-analytics/print-summary");
        } else if (QueryType === "appointmentaggregate") {
          let arr = [
            ...result.queryresult?.complete,
            ...result.queryresult?.inprogress,
            ...result.queryresult?.scheduled,
          ];
          localStorage.setItem("reportSummary", JSON.stringify(arr));
          localStorage.setItem("reportGrandTotal", JSON.stringify(result.queryresult?.totalnumberofappointments[0]));
          localStorage.setItem("reportCategory", QueryType);
          nav("/dashboard/report-analytics/print-summary");
        } else if (QueryType === "admissionaggregate") {
          let arr = [
            ...result.queryresult?.admited,
            ...result.queryresult?.discharged,
            ...result.queryresult?.transfered,
          ];
          localStorage.setItem("reportSummary", JSON.stringify(arr));
          localStorage.setItem("reportGrandTotal", JSON.stringify(result.queryresult?.totalnumberofadmissions[0]));

          localStorage.setItem("reportCategory", QueryType);
          nav("/dashboard/report-analytics/print-summary");
        } else if (QueryType === "procedureaggregate") {
          let arr = [...result.queryresult?.paid];
          localStorage.setItem("reportSummary", JSON.stringify(arr));
          localStorage.setItem("reportCategory", QueryType);
          localStorage.setItem(
            "procedureGrandTotal",
            JSON.stringify(result.queryresult?.grandtotal[0])
          );
          nav("/dashboard/report-analytics/print-summary");
        } else if (QueryType === "clinicalaggregate") {
          let arr = [...result.queryresult?.clinicalreport];
          localStorage.setItem("reportSummary", JSON.stringify(arr));
          localStorage.setItem("reportCategory", QueryType);
          nav("/dashboard/report-analytics/print-summary");
        }else if (QueryType === "hmoaggregate") {
          
          localStorage.setItem("reportSummary", JSON.stringify(result.queryresult));
          localStorage.setItem("reportCategory", QueryType);
          nav("/dashboard/report-analytics/print-summary");
        }else if (QueryType === "nutritionaggregate") {
          
          localStorage.setItem("reportSummary", JSON.stringify(result.queryresult));
          localStorage.setItem("reportCategory", QueryType);
          nav("/dashboard/report-analytics/print-summary");
        }
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const getReportSettings = async () => {
    setIsLoading(true);
    try {
      const result = await GetReportSummarySettingsApi();

      console.log("getReportSettings", result);

      if (result.status === true) {
        setIsLoading(false);
        setQuerySettings(result.querygroupsettings);
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

  useEffect(() => {
    getReportSettings();
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
          Report Summary
        </Text>
        <Text color="#667085" fontWeight="400" fontSize="18px">
          ({Data?.length})
        </Text>
      </HStack>
      <Text color="#686C75" mt="9px" fontWeight="400" fontSize="15px">
        Access reports, and analytics across departments all in one place
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
        <SimpleGrid mt="12px" columns={{ base: 2, md: 3 }} spacing={2}>
          <Box>
            <Text color="#1F2937" fontWeight="500" fontSize="14px">
              Report Category
            </Text>
            <Select
              fontSize={QueryType !== "" ? "16px" : "13px"}
              h="45px"
              borderWidth="2px"
              borderColor="#E4E4E4"
              _hover={{ borderColor: "#7A27AB" }}
              _focus={{ borderColor: "blue.blue500" }}
              textTransform="capitalize"
              value={QueryType}
              onChange={(e) => {
                setQueryType(e.target.value);
                setData([]);
              }}
              placeholder="Select Report Category"
            >
              {QuerySettings?.map((item, i) => (
                <option value={`${item}`} key={i}>
                  {item.replace("aggregate", " aggregate")}{" "}
                </option>
              ))}
            </Select>
          </Box>

          <Box>
            <Text color="#1F2937" fontWeight="500" fontSize="14px">
              Start Date
            </Text>
            <Input
              type="date"
              onChange={(e) => {
                setQueryStartDate(e.target.value);
                setData([]);
              }}
              value={QueryStartDate}
              bColor="#E4E4E4"
              leftIcon={<FaCalendarAlt />}
            />
          </Box>
          <Box>
            <Text color="#1F2937" fontWeight="500" fontSize="14px">
              End Date
            </Text>
            <Input
              type="date"
              onChange={(e) => {
                setQueryEndDate(e.target.value);
                setData([]);
              }}
              value={QueryEndDate}
              bColor="#E4E4E4"
              leftIcon={<FaCalendarAlt />}
            />
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
            disabled={
              QueryType !== "" && QueryStartDate !== "" && QueryEndDate !== ""
                ? false
                : true
            }
          >
            Fetch Report
          </Button>
        </Flex>
      </Box>
      {/* filters needed for the get full report end heree ....*/}
    </MainLayout>
  );
}
