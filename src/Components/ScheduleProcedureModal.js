import React, { useState, useEffect } from "react";
import {
  Box,
  SimpleGrid,
  Select,
  Flex,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
} from "@chakra-ui/react";
import Button from "../Components/Button";
import Input from "../Components/Input";
import ShowToast from "./ToastNotification";
import { IoIosCloseCircle } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { FaNoteSticky } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { SlPlus } from "react-icons/sl";
import {
  SettingsApi,
  AddProcedureAPI,
  UpdateProcedureAPI,
  GetAllClinicApi,
  SearchPatientApi,
  SearchProcedureApi,
} from "../Utils/ApiCalls";
import Preloader from "./Preloader";

export default function ScheduleProcedureModal({
  isOpen,
  onClose,
  activateNotifications,
  type,
  oldPayload,
}) {
  const [Loading, setLoading] = useState(false);
  const [Clinics, setClinics] = useState([]);
  const [Settings, setSettings] = useState(null);

  const emptyForm = {
    patientId: "",
    clinic: "",
    indicationdiagnosisprocedure: "",
    procedure: "",
    appointmentdate: "",
    cptcodes: "",
    dxcodes: "",
  };

  const [Payload, setPayload] = useState({ ...emptyForm });
  const [UpdatedPayload, setUpdatedPayload] = useState({ ...emptyForm });
  const [ProcedureArr, setProcedureArr] = useState([]);
  const [CptcodesArr, setCptcodesArr] = useState([]);
  const [DxcodesArr, setDxcodesArr] = useState([]);
  const [Patients, setPatients] = useState([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [searchMRN, setSearchMRN] = useState("");

  // Procedure search
  const [searchProcedureQuery, setSearchProcedureQuery] = useState("");
  const [procedureSearchResults, setProcedureSearchResults] = useState([]);
  const [isLoadingProcedures, setIsLoadingProcedures] = useState(false);

  const formState = type === "edit" ? UpdatedPayload : Payload;
  const formHandler = type === "edit" ? handleUpdatedPayload : handlePayload;

  // Fetch clinics & settings, prefill if editing
  useEffect(() => {
    if (isOpen) {
      fetchClinics();
      fetchSettings();
      if (type === "edit" && oldPayload) prefillEdit();
    }
  }, [isOpen]);

  // Reset all fields when the modal closes
  useEffect(() => {
    if (!isOpen) {
      setPayload({ ...emptyForm });
      setUpdatedPayload({ ...emptyForm });
      setProcedureArr([]);
      setCptcodesArr([]);
      setDxcodesArr([]);
      setPatients([]);
      setSearchMRN("");
      setSearchProcedureQuery("");
      setProcedureSearchResults([]);
    }
  }, [isOpen]);

  // Live-search for procedures
  useEffect(() => {
    async function fetchProcedures() {
      if (searchProcedureQuery.trim()) {
        setIsLoadingProcedures(true);
        try {
          const res = await SearchProcedureApi(searchProcedureQuery);
          setProcedureSearchResults(res.queryresult || []);
        } catch {
          setProcedureSearchResults([]);
        } finally {
          setIsLoadingProcedures(false);
        }
      } else {
        setProcedureSearchResults([]);
      }
    }
    fetchProcedures();
  }, [searchProcedureQuery]);

  async function fetchSettings() {
    try {
      const r = await SettingsApi();
      setSettings(r);
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchClinics() {
    try {
      const r = await GetAllClinicApi();
      setClinics(r.queryresult.clinicdetails || []);
    } catch (e) {
      console.error(e);
    }
  }

  function prefillEdit() {
    const p = oldPayload;
    setUpdatedPayload({
      patientId: p.patientId || p.patient?._id || "",
      clinic: p.clinic || "",
      indicationdiagnosisprocedure: p.indicationdiagnosisprocedure || "",
      procedure: Array.isArray(p.procedure) ? p.procedure[0] : p.procedure || "",
      appointmentdate: p.appointmentdate || "",
      cptcodes: Array.isArray(p.cptcodes) ? p.cptcodes[0] : p.cptcodes || "",
      dxcodes: Array.isArray(p.dxcodes) ? p.dxcodes[0] : p.dxcodes || "",
    });
    setProcedureArr(Array.isArray(p.procedure) ? p.procedure : p.procedure ? [p.procedure] : []);
    setCptcodesArr(Array.isArray(p.cptodes) ? p.cptodes : p.cptodes ? [p.cptodes] : []);
    setDxcodesArr(Array.isArray(p.dxcodes) ? p.dxcodes : p.dxcodes ? [p.dxcodes] : []);
    if (p.patient) setPatients([p.patient]);
  }

  function handlePayload(e) {
    const { id, value } = e.target;
    setPayload((prev) => ({ ...prev, [id]: value }));
    if (id === "procedure") setProcedureArr((prev) => [...prev, value]);
    if (id === "cptcodes") setCptcodesArr((prev) => [...prev, value]);
    if (id === "dxcodes") setDxcodesArr((prev) => [...prev, value]);
  }

  function handleUpdatedPayload(e) {
    const { id, value } = e.target;
    setUpdatedPayload((prev) => ({ ...prev, [id]: value }));
    if (id === "procedure") setProcedureArr((prev) => [...prev, value]);
    if (id === "cptcodes") setCptcodesArr((prev) => [...prev, value]);
    if (id === "dxcodes") setDxcodesArr((prev) => [...prev, value]);
  }

  const removeProcedureArr = (item) => setProcedureArr((arr) => arr.filter((p) => p !== item));
  const removeCptcodesArr = (item) => setCptcodesArr((arr) => arr.filter((c) => c !== item));
  const removeDxcodesArr = (item) => setDxcodesArr((arr) => arr.filter((d) => d !== item));

  const handleSearchPatient = async () => {
    setIsLoadingPatients(true);
    try {
      const res = await SearchPatientApi(searchMRN);
      setPatients(res.queryresult.patientdetails || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingPatients(false);
    }
  };

  const handleSubmit = type === "edit" ? handleSubmitEdit : handleSubmitNew;

  async function handleSubmitNew() {
    setLoading(true);
    try {
      await AddProcedureAPI(
        {
          clinic: Payload.clinic,
          indicationdiagnosisprocedure: Payload.indicationdiagnosisprocedure,
          procedure: ProcedureArr,
          appointmentdate: Payload.appointmentdate,
          cptcodes: CptcodesArr,
          dxcodes: DxcodesArr,
        },
        Payload.patientId
      );
      activateNotifications("Procedure Scheduled Successfully", "success");
      onClose();
    } catch (e) {
      activateNotifications(e.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitEdit() {
    setLoading(true);
    try {
      await UpdateProcedureAPI(
        {
          clinic: UpdatedPayload.clinic,
          indicationdiagnosisprocedure: UpdatedPayload.indicationdiagnosisprocedure,
          procedure: ProcedureArr,
          appointmentdate: UpdatedPayload.appointmentdate,
          cptcodes: CptcodesArr,
          dxcodes: DxcodesArr,
        },
        oldPayload._id
      );
      activateNotifications("Procedure Updated Successfully", "success");
      onClose();
    } catch (e) {
      activateNotifications(e.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      scrollBehavior="inside"
      size="lg"
    >
      <ModalOverlay />
      <ModalContent maxW={{ base: "90%", md: "60%" }} maxH="80vh">
        <ModalHeader>{type === "new" ? "Add New Procedure" : "Edit Procedure"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Patient Search */}
          <Box mb={4}>
            <Flex mb={2} gap={4}>
              <Input
                label="Search for Patient"
                placeholder="Enter MRN, first name, or last name"
                value={searchMRN}
                onChange={(e) => setSearchMRN(e.target.value)}
                leftIcon={<FiSearch size={16} />}
                flex="1"
              />
              <Button onClick={handleSearchPatient}>Search</Button>
            </Flex>
            <Select
              onChange={formHandler}
              id="patientId"
              value={formState.patientId}
              placeholder={isLoadingPatients ? "Loading patients..." : "Select Patient"}
              size="lg"
              fontSize={formState.patientId ? "16px" : "13px"}
              border="2px solid"
              borderColor="gray.500"
              mt={2}
              isDisabled={isLoadingPatients}
            >
              {Patients.map((p, i) => (
                <option key={i} value={p._id}>
                  {`${p.firstName} ${p.lastName} ~ ${p.MRN}`}
                </option>
              ))}
            </Select>
          </Box>

          {/* Main Form */}
          <SimpleGrid columns={1} spacing={5}>
            <Select
              onChange={formHandler}
              placeholder="Select Clinic"
              id="clinic"
              value={formState.clinic}
              size="lg"
              fontSize={formState.clinic ? "16px" : "13px"}
              border="2px solid"
              borderColor="gray.500"
            >
              {Clinics.filter((c) => c.type === "clinic").map((c, i) => (
                <option key={i} value={c.clinic}>
                  {c.clinic}
                </option>
              ))}
            </Select>

            <Input
              label="Indication Diagnosis Procedure"
              leftIcon={<FaNoteSticky />}
              id="indicationdiagnosisprocedure"
              value={formState.indicationdiagnosisprocedure}
              onChange={formHandler}
            />

            {/* Procedure Search */}
            <Input
              label="Search for Procedure"
              placeholder="Enter procedure name"
              value={searchProcedureQuery}
              onChange={(e) => setSearchProcedureQuery(e.target.value)}
              leftIcon={<FiSearch size={16} />}
            />
            <Select
              onChange={formHandler}
              placeholder={isLoadingProcedures ? "Loading procedures..." : "Select Procedure"}
              id="procedure"
              value={formState.procedure}
              size="lg"
              fontSize={formState.procedure ? "16px" : "13px"}
              border="2px solid"
              borderColor="gray.500"
            >
              {searchProcedureQuery.trim() === ""
                ? Settings?.servicecategory?.find((s) => s.category === "Procedure")?.type?.map((item, i) => (
                    <option key={i} value={item}>
                      {item}
                    </option>
                  ))
                : procedureSearchResults.map((item, i) => (
                    <option key={i} value={item.servicetype}>
                      {item.servicetype}
                    </option>
                  ))}
            </Select>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={2}>
              {ProcedureArr.map((item, i) => (
                <Flex
                  key={i}
                  cursor="pointer"
                  px="10px"
                  py="10px"
                  rounded="full"
                  fontSize="13px"
                  _hover={{ bg: "blue.blue400" }}
                  bg="blue.blue500"
                  w="100%"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text color="#fff" fontWeight="500" textTransform="capitalize">
                    {item}
                  </Text>
                  <IoIosCloseCircle fontSize="20px" color="#fff" onClick={() => removeProcedureArr(item)} />
                </Flex>
              ))}
            </SimpleGrid>

            <Input
              leftIcon={<FaCalendarAlt />}
              label="Appointment Date"
              type="datetime-local"
              id="appointmentdate"
              value={formState.appointmentdate}
              onChange={formHandler}
            />

            <Select
              onChange={formHandler}
              placeholder="Select CPT Codes"
              id="cptcodes"
              value={formState.cptcodes}
              size="lg"
              fontSize={formState.cptcodes ? "16px" : "13px"}
              border="2px solid"
              borderColor="gray.500"
            >
              {Settings?.cptcodes?.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </Select>
            <SimpleGrid columns={{ base: 2, md: 2 }} spacing={2}>
              {CptcodesArr.map((item, i) => (
                <Flex
                  key={i}
                  cursor="pointer"
                  px="10px"
                  py="10px"
                  rounded="full"
                  fontSize="13px"
                  _hover={{ bg: "blue.blue400" }}
                  bg="blue.blue500"
                  w="100%"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text color="#fff" fontWeight="500" textTransform="capitalize">
                    {item}
                  </Text>
                  <IoIosCloseCircle fontSize="20px" color="#fff" onClick={() => removeCptcodesArr(item)} />
                </Flex>
              ))}
            </SimpleGrid>

            <Select
              onChange={formHandler}
              placeholder="Select DX Codes"
              id="dxcodes"
              value={formState.dxcodes}
              size="lg"
              fontSize={formState.dxcodes ? "16px" : "13px"}
              border="2px solid"
              borderColor="gray.500"
            >
              {Settings?.dxcodes?.map((d, i) => (
                <option key={i} value={d}>
                  {d}
                </option>
              ))}
            </Select>
            <SimpleGrid columns={{ base: 2, md: 2 }} spacing={2}>
              {DxcodesArr.map((item, i) => (
                <Flex
                  key={i}
                  cursor="pointer"
                  px="10px"
                  py="10px"
                  rounded="full"
                  fontSize="13px"
                  _hover={{ bg: "blue.blue400" }}
                  bg="blue.blue500"
                  w="100%"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text color="#fff" fontWeight="500" textTransform="capitalize">
                    {item}
                  </Text>
                  <IoIosCloseCircle fontSize="20px" color="#fff" onClick={() => removeDxcodesArr(item)} />
                </Flex>
              ))}
            </SimpleGrid>
          </SimpleGrid>

          <Button mt="32px" isLoading={Loading} onClick={handleSubmit}>
            {type === "edit" ? "Update Procedure" : "Proceed"}
          </Button>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
