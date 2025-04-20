import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  HStack,
  Text,
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
  useDisclosure,
} from "@chakra-ui/react";
import moment from "moment";
import { IoFilter } from "react-icons/io5";
import { BiSearch } from "react-icons/bi";

import TableRowY from "../Components/TableRowY";
import Input from "../Components/Input";
import ShowToast from "../Components/ToastNotification";
import Pagination from "../Components/Pagination";
import Preloader from "../Components/Preloader";
import MedicalChartModal from "../Components/MedicalChartModal";

import { GetAllPatientPharmacyApi } from "../Utils/ApiCalls";
import { configuration } from "../Utils/Helpers";

export default function NursingPrescription() {

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const postPerPage = configuration.sizePerPage;

  const [searchInput, setSearchInput] = useState("");
  const [toast, setToast] = useState(null);


  const {
    isOpen: isServeOpen,
    onOpen: openServeModal,
    onClose: closeServeModal,
  } = useDisclosure();
  const [selectedDrug, setSelectedDrug] = useState("");
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState("");

  const paginate = (p) => setCurrentPage(p);
  const indexOfLast = currentPage * postPerPage;
  const paginatedData = filterData.slice(
    indexOfLast - postPerPage,
    indexOfLast
  );

  const showToast = (message, status) => {
    setToast({ message, status });
    setTimeout(() => setToast(null), 5000);
  };

  const getAllPharmacy = async () => {
    setIsLoading(true);
    try {
      const id = localStorage.getItem("patientId");
      const res = await GetAllPatientPharmacyApi(id);
      if (res.status) {
        const rows = res.queryresult.prescriptiondetails ?? [];
        setData(rows);
        setFilterData(rows);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllPharmacy();
  }, []);


  const handleServe = (drug, prescriptionId) => {
    setSelectedDrug(drug);
    setSelectedPrescriptionId(prescriptionId);
    openServeModal();
  };
  const handleServeSuccess = (apiResponse) => {
    console.log("MedicalChart API response:", apiResponse);

    if (apiResponse?.message && apiResponse?.status) {
      showToast(apiResponse.message, apiResponse.status);
    } else {
      showToast("Medical chart saved!", "success");
    }

    if (apiResponse?.prescriptionId && apiResponse?.servedstatus) {
      const { prescriptionId, servedstatus } = apiResponse;
      const merge = (arr) =>
        arr.map((row) =>
          row._id === prescriptionId ? { ...row, servedstatus } : row
        );
      setData(merge);
      setFilterData(merge);
    }
  };


  return (
    <Box
      bg="#fff"
      border="1px solid #EFEFEF"
      mt="10px"
      py="17px"
      px="18px"
      rounded="10px"
    >
      {isLoading && <Preloader />}
      {toast && <ShowToast message={toast.message} status={toast.status} />}

      {/* ────────────── search / filter bar ────────────── */}
      <Flex justifyContent="space-between" flexWrap="wrap">
        <Box />
        <Flex mt="10px" alignItems="center">
          <HStack>
            <Input
              label="Search"
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
                  py="11.64px"
                  px="16.98px"
                  bg="#f8ddd1"
                  cursor="pointer"
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
                  onClick={() => setSearchInput("")}
                  fontWeight="500"
                  color="#2F2F2F"
                  _hover={{ color: "#fff", bg: "blue.blue500" }}
                >
                  clear filter
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Flex>


      <Box
        bg="#fff"
        border="1px solid #EFEFEF"
        mt="12px"
        py="15px"
        px="15px"
        rounded="10px"
      >
        <Text mb="20px" fontWeight="700" fontSize="16px" color="blue.blue500">
          Prescription History
        </Text>

        <TableContainer>
          <Table variant="striped">
            <Thead>
              <Tr>
                {[
                  "Patient name",
                  "Pharmacy",
                  "Drug",
                  "Prescriber Name",
                  "Date",
                  "Dispense Status",
                  "Serve Status",
                  "Action",
                ].map((head) => (
                  <Th
                    key={head}
                    fontSize="13px"
                    color="#534D59"
                    fontWeight="600"
                    textTransform="capitalize"
                  >
                    {head}
                  </Th>
                ))}
              </Tr>
            </Thead>

            <Tbody>
              {paginatedData.map((row) => (
                <TableRowY
                  key={row._id}
                  type="e-prescription"
                  name={`${row.patient?.firstName} ${row.patient?.lastName}`}
                  mrn={row.patient?.MRN}
                  pharmacy={row.pharmacy}
                  drug={row.prescription}
                  doctor={row.prescribersname}
                  date={moment(row.createdAt).format("lll")}
                  status={row.dispensestatus}
                  servedstatus={row.servedstatus}
                  onServe={() => handleServe(row.prescription, row._id)}
                />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>


      <Pagination
        postPerPage={postPerPage}
        currentPage={currentPage}
        totalPosts={data.length}
        paginate={paginate}
      />

      <MedicalChartModal
        isOpen={isServeOpen}
        onClose={closeServeModal}
        onSuccess={handleServeSuccess}
        selectedDrug={selectedDrug}
        selectedPrescriptionId={selectedPrescriptionId}
      />
    </Box>
  );
}
