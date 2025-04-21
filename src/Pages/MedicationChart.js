import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Flex,
  Spinner,
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
} from "@chakra-ui/react";
import { SlPlus } from "react-icons/sl";
import { BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";

import { configuration } from "../Utils/Helpers";
import MedicalChartModal from "../Components/MedicalChartModal";
import TableRowY from "../Components/TableRowY";
import Pagination from "../Components/Pagination";
import Button from "../Components/Button";
import Input from "../Components/Input";
import ShowToast from "../Components/ToastNotification";
import { ReadAllMedicationChartByAdmissionApi } from "../Utils/ApiCalls";

const MedicationChart = () => {

  const [medicationData, setMedicationData] = useState([]);
  const [filteredData, setFilteredData]     = useState([]);
  const [currentPage, setCurrentPage]       = useState(1);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState(null);

  const [toast, setToast] = useState(null);                 

  const [filter, setFilter]           = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [StartDate, setStartDate]     = useState("");
  const [EndDate, setEndDate]         = useState("");
  const [byDate, setByDate]           = useState(false);

  const [isModalOpen, setIsModalOpen]         = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [modalType, setModalType]             = useState("create");

  const [trigger, setTrigger] = useState(false);
  const postPerPage = configuration.sizePerPage;

 
  const storedPatient = localStorage.getItem("inPatient");
  let patient = storedPatient ? JSON.parse(storedPatient) : null;
  const admissionId =
    patient && Array.isArray(patient.admission)
      ? patient.admission[0]
      : localStorage.getItem("admissionId");

 
  const showToast = (message, status = "success") => {
    setToast({ message, status });
    setTimeout(() => setToast(null), 5000);
  };


  useEffect(() => {
    if (!admissionId) return;
    setLoading(true);
    ReadAllMedicationChartByAdmissionApi(admissionId)
      .then((response) => {
        const data = response?.queryresult?.medicationchartsdetails || [];
        const transformed = data.map((item) => ({
          id: item._id,
          drug: item.drug,
          note: item.note,
          dose: item.dose,
          frequency: item.frequency,
          route: item.route,
          createdBy: item.createdBy || item.staffname || "Unknown",
          createdOn: new Date(item.createdAt).toISOString().split("T")[0],
        }));
        setMedicationData(transformed);
        setFilteredData(transformed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching medication chart data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [admissionId, trigger]);

  
  useEffect(() => {
    if (filter === "all") {
      setFilteredData(medicationData);
    } else if (filter === "date") {
      if (StartDate && EndDate) {
        const endPlusOne = new Date(EndDate);
        endPlusOne.setDate(endPlusOne.getDate() + 1);
        const endISO = endPlusOne.toISOString().split("T")[0];
        setFilteredData(
          medicationData.filter(
            (item) => item.createdOn >= StartDate && item.createdOn <= endISO
          )
        );
      } else {
        setFilteredData(medicationData);
      }
    } else if (filter === "createdBy") {
      setFilteredData(
        medicationData.filter((i) =>
          i.createdBy.toLowerCase().includes(searchInput.toLowerCase())
        )
      );
    } else if (filter === "drug") {
      setFilteredData(
        medicationData.filter((i) =>
          i.drug.toLowerCase().includes(searchInput.toLowerCase())
        )
      );
    }
  }, [filter, searchInput, StartDate, EndDate, medicationData]);

  
  const indexOfLast   = currentPage * postPerPage;
  const paginatedData = filteredData.slice(indexOfLast - postPerPage, indexOfLast);


  const handleAddMedication = () => {
    setModalType("create");
    setSelectedMedication(null);
    setIsModalOpen(true);
  };
  const handleEditMedication = (med) => {
    setModalType("edit");
    setSelectedMedication(med);
    setIsModalOpen(true);
  };


  const handleModalSuccess = (payload) => {
    console.log("MedicationChartModal response:", payload);


    if (payload?.message && payload?.status) {
      showToast(payload.message, payload.status);
    } else {
      showToast("Medication chart saved!", "success");
    }

    if (payload?.medication) {
      setMedicationData((prev) => [payload.medication, ...prev]);
      setFilteredData((prev) => [payload.medication, ...prev]);
    } else {
      
      setTrigger((p) => !p);
    }

    setIsModalOpen(false);
  };

 
  return (
    <Box bg="#fff" border="1px solid #EFEFEF" mt="10px" py="17px" px="18px" rounded="10px">
      {toast && <ShowToast message={toast.message} status={toast.status} />}

     
      <Flex justifyContent="space-between" flexWrap="wrap" mb="20px">
        {/* 
        <Button rightIcon={<SlPlus />} onClick={handleAddMedication}>
          Add Medication Chart
        </Button>
        */}
        <Flex mt="10px" alignItems="center">
          <HStack spacing="4">
            {!byDate ? (
              <Input
                label="Search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                bColor="#E4E4E4"
                leftIcon={<BiSearch />}
              />
            ) : (
              <HStack>
                <Input
                  type="date"
                  value={StartDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  variant="outline"
                  borderColor="#E4E4E4"
                />
                <Input
                  type="date"
                  value={EndDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  variant="outline"
                  borderColor="#E4E4E4"
                />
                <Flex
                  px="5px"
                  py="3px"
                  rounded="5px"
                  bg="blue.blue500"
                  color="#fff"
                  alignItems="center"
                >
                  <BiSearch />
                </Flex>
              </HStack>
            )}
            {/* Filter menu */}
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
                {[
                  { label: "by Created By", key: "createdBy" },
                  { label: "by Drug", key: "drug" },
                  { label: "by Date", key: "date", date: true },
                  { label: "Clear Filter", key: "all" },
                ].map(({ label, key, date }) => (
                  <MenuItem
                    key={key}
                    onClick={() => {
                      setFilter(key);
                      setByDate(!!date);
                      setStartDate("");
                      setEndDate("");
                      setSearchInput("");
                    }}
                    fontWeight="500"
                    _hover={{ bg: "blue.blue500", color: "#fff", fontWeight: "400" }}
                  >
                    {label}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Flex>

    
      <Box mt="12px" py="15px" px="15px" rounded="10px" overflowX="auto">
        {loading ? (
          <Flex justifyContent="center" minH="100px">
            <Spinner size="xl" />
          </Flex>
        ) : error ? (
          <Text color="red.500" textAlign="center">
            {error}
          </Text>
        ) : (
          <TableContainer>
            <Table variant="striped">
              <Thead>
                <Tr>
                  {["Drug", "Note", "Dose", "Frequency", "Route", "Created By", "Created On", "Actions"].map(
                    (h) => (
                      <Th key={h} fontSize="13px" color="#534D59" fontWeight="600">
                        {h}
                      </Th>
                    )
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {paginatedData.map((item) => (
                  <TableRowY
                    key={item.id}
                    type="medication-chart"
                    drug={item.drug}
                    note={item.note}
                    dose={item.dose}
                    frequency={item.frequency}
                    route={item.route}
                    createdBy={item.createdBy}
                    createdOn={item.createdOn}
                    onEdit={() => handleEditMedication(item)}
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Pagination */}
      {!loading && filteredData.length > 0 && (
        <Pagination
          postPerPage={postPerPage}
          currentPage={currentPage}
          totalPosts={filteredData.length}
          paginate={setCurrentPage}
        />
      )}

      {/* Modal */}
      <MedicalChartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        admissionId={admissionId}
        onSuccess={handleModalSuccess}
        type={modalType}
        initialData={modalType === "edit" ? selectedMedication : null}
      />
    </Box>
  );
};

export default MedicationChart;
