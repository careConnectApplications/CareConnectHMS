import {
  HStack,
  Radio,
  RadioGroup,
  Text,
  Flex,
  Box,
  Checkbox,
  CheckboxGroup,
  useToast,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  SimpleGrid,
  Select,
} from "@chakra-ui/react";
import Input from "./Input";
import Button from "./Button";
import { FaNoteSticky } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { IoColorFilter } from "react-icons/io5";
import {
  SettingsApi,
  AddImmunizationAPI,
  UpdateImmunizationAPI,
  GetAllOutreachMedicationApi,
} from "../Utils/ApiCalls";
import { FaArrowsToDot } from "react-icons/fa6";
import { AiFillDatabase } from "react-icons/ai";

export default function CreateImmunizationModal({
  isOpen,
  onClose,
  setOldPayload,
  activateNotifications,
  type,
  oldPayload,
}) {
  const toast = useToast();

  const [Loading, setLoading] = useState(false);
  const [Settings, setSettings] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [selectedVaccines, setSelectedVaccines] = useState([]);
  const [outreachMedications, setOutreachMedications] = useState([]);
  const [selectedOutreachMedications, setSelectedOutreachMedications] =
    useState([]);

  const date = Date.now();
  const currentDate = new Date(date).toISOString().split("T")[0];
  const id = localStorage.getItem("patientId");

  const initialPayload = {
    vaccinecode: "",
    vaccinename: "",
    dateadministered: currentDate,
    vaccinetype: "",
    manufacturer: "",
    batchno: "",
    expirydate: "",
    dose: "",
    doseamount: "",
    administrationsite: "",
    administrationroute: "",
    consent: "",
    immunizationstatus: "",
    comment: "",
    adverseeventdescription: "",
    onsetdateofreaction: "",
    reactcode: "",
    reporter: "",
    reportingsource: "",
    anynotedadverseeffect: "",
    adverseeffectseverity: "",
    medicationgiventomanageadverseeffect: "",
    adverseEffectVaccine: "",
    schedule: "",
    vaccination: [],
    vaccinationlocation: "",
    outreachMedications: [],
    isFullyImmunized: null,
    isZeroDoseChild: null,
  };

  const [Payload, setPayload] = useState(initialPayload);

  const [UpdatedPayload, setUpdatedPayload] = useState({
    vaccinecode: "",
    vaccinename: "",
    dateadministered: currentDate,
    vaccinetype: "",
    manufacturer: "",
    batchno: "",
    expirydate: "",
    dose: "",
    doseamount: "",
    administrationsite: "",
    administrationroute: "",
    consent: "",
    immunizationstatus: "",
    comment: "",
    adverseeventdescription: "",
    onsetdateofreaction: "",
    reactcode: "",
    reporter: "",
    reportingsource: "",
    anynotedadverseeffect: "",
    adverseeffectseverity: "",
    medicationgiventomanageadverseeffect: "",
    adverseEffectVaccine: "",
    schedule: "",
    vaccination: [],
    vaccinationlocation: "",
    outreachMedications: [],
    isFullyImmunized: null,
    isZeroDoseChild: null,
  });
  useEffect(() => {
    // Always call these functions to populate dropdowns
    getSettings();
    getOutreachMedications();

    if (type === "edit" || type === "view") {
      const initialVaccination = Array.isArray(oldPayload?.vaccination)
        ? oldPayload.vaccination
        : oldPayload?.vaccination
        ? [oldPayload.vaccination]
        : [];
      const initialOutreachMedications = Array.isArray(
        oldPayload?.outreachMedications
      )
        ? oldPayload.outreachMedications
        : oldPayload?.outreachMedications
        ? [oldPayload.outreachMedications]
        : [];
      setSelectedVaccines(initialVaccination);
      setSelectedOutreachMedications(initialOutreachMedications);
      setUpdatedPayload({
        vaccinecode: oldPayload?.vaccinecode || "",
        vaccinename: oldPayload?.vaccinename || "",
        dateadministered: currentDate,
        vaccinetype: oldPayload?.vaccinetype || "",
        manufacturer: oldPayload?.manufacturer || "",
        batchno: oldPayload?.batchno || "",
        expirydate: oldPayload?.expirydate || "",
        dose: oldPayload?.dose || "",
        doseamount: oldPayload?.doseamount || "",
        administrationsite: oldPayload?.administrationsite || "",
        administrationroute: oldPayload?.administrationroute || "",
        consent: oldPayload?.consent || "",
        immunizationstatus: oldPayload?.immunizationstatus || "",
        comment: oldPayload?.comment || "",
        adverseeventdescription: oldPayload?.adverseeventdescription || "",
        onsetdateofreaction: oldPayload?.onsetdateofreaction || "",
        reactcode: oldPayload?.reactcode || "",
        reporter: oldPayload?.reporter || "",
        reportingsource: oldPayload?.reportingsource || "",
        anynotedadverseeffect: oldPayload?.anynotedadverseeffect || "",
        adverseeffectseverity: oldPayload?.adverseeffectseverity || "",
        medicationgiventomanageadverseeffect:
          oldPayload?.medicationgiventomanageadverseeffect || "",
        adverseEffectVaccine: oldPayload?.adverseEffectVaccine || "",
        schedule: oldPayload?.schedule || "",
        vaccination: initialVaccination,
        vaccinationlocation: oldPayload?.vaccinationlocation || "",
        outreachMedications: initialOutreachMedications,
        isFullyImmunized: oldPayload?.isFullyImmunized ?? null,
        isZeroDoseChild: oldPayload?.isZeroDoseChild ?? null,
      });
    } else {
      setSelectedVaccines([]);
      setSelectedOutreachMedications([]);
      setPayload(initialPayload);
      setUpdatedPayload({
        ...UpdatedPayload,
        vaccination: [],
        vaccinationlocation: "",
        outreachMedications: [],
        isFullyImmunized: null,
        isZeroDoseChild: null,
      });
    }
  }, [isOpen, type, oldPayload]);

  const handlePayload = (e) => {
    const { id, value } = e.target;
    if (id === "vaccinationlocation" && value !== "outreach") {
      setSelectedOutreachMedications([]);
      setPayload({
        ...Payload,
        [id]: value,
        outreachMedications: [],
      });
    } else if (id === "isFullyImmunized" || id === "isZeroDoseChild") {
      setPayload({
        ...Payload,
        [id]: value === "true" ? true : value === "false" ? false : null,
      });
    } else {
      setPayload({ ...Payload, [id]: value });
    }
  };

  const handleUpdatedPayload = (e) => {
    const { id, value } = e.target;
    if (id === "vaccinationlocation" && value !== "outreach") {
      setSelectedOutreachMedications([]);
      setUpdatedPayload({
        ...UpdatedPayload,
        [id]: value,
        outreachMedications: [],
      });
    } else if (id === "isFullyImmunized" || id === "isZeroDoseChild") {
      setUpdatedPayload({
        ...UpdatedPayload,
        [id]: value === "true" ? true : value === "false" ? false : null,
      });
    } else {
      setUpdatedPayload({ ...UpdatedPayload, [id]: value });
    }
  };

  const handleVaccineChange = (selected) => {
    setSelectedVaccines(selected);
    setPayload({ ...Payload, vaccination: selected });
    setUpdatedPayload({ ...UpdatedPayload, vaccination: selected });
  };

  const handleOutreachMedicationChange = (selected) => {
    setSelectedOutreachMedications(selected);
    setPayload({ ...Payload, outreachMedications: selected });
    setUpdatedPayload({ ...UpdatedPayload, outreachMedications: selected });
  };
  const validateVaccines = () => {
    if (Payload.schedule && selectedVaccines.length < vaccines.length) {
      toast({
        title: "Warning",
        description:
          "Not all available vaccines for the selected schedule have been chosen.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
    return true;
  };

  const handleSubmitNew = async () => {
    if (!validateVaccines()) return;
    setLoading(true);
    try {
      const result = await AddImmunizationAPI(Payload, id);

      if (result.status === 200) {
        setLoading(false);
        activateNotifications("Immunization done Successfully", "success");
        onClose();
      }
    } catch (e) {
      setLoading(false);
      activateNotifications(e.message, "error");
    }
  };

  const handleSubmitUpdate = async () => {
    if (!validateVaccines()) return;
    setLoading(true);
    try {
      const result = await UpdateImmunizationAPI(
        UpdatedPayload,
        oldPayload._id
      );

      if (result.status === 200) {
        setLoading(false);
        activateNotifications("Immunization Updated Successfully", "success");
        onClose();
      }
    } catch (e) {
      setLoading(false);
      activateNotifications(e.message, "error");
    }
  };

  const getSettings = async () => {
    try {
      const result = await SettingsApi();
      setSettings(result);
      const vaccinationMapping = result?.vacinationmapping || [];
      const allSchedules = vaccinationMapping.map((item) => item.schedule);
      setSchedules(allSchedules);
    } catch (e) {
      console.error("Failed to fetch settings:", e);
    }
  };

  const getOutreachMedications = async () => {
    try {
      const result = await GetAllOutreachMedicationApi();
      const queryResult = result?.queryresult?.outreachmedicationdetails
        ? Array.isArray(result.queryresult.outreachmedicationdetails)
          ? result.queryresult.outreachmedicationdetails
          : [result.queryresult.outreachmedicationdetails]
        : [];
      setOutreachMedications(
        queryResult.map((item) => item.outreachmedicationname)
      );
    } catch (e) {
      console.error("Failed to fetch outreach medications:", e);
      toast({
        title: "Error",
        description: e.message || "Failed to fetch outreach medications",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleScheduleChange = (e) => {
    const selectedSchedule = e.target.value;
    setPayload({ ...Payload, schedule: selectedSchedule, vaccination: [] });
    setUpdatedPayload({
      ...UpdatedPayload,
      schedule: selectedSchedule,
      vaccination: [],
    });
    setSelectedVaccines([]);

    // Find corresponding vaccines for the selected schedule
    const selectedMapping = Settings?.vacinationmapping?.find(
      (item) => item.schedule === selectedSchedule
    );
    const selectedVaccines = selectedMapping?.vaccination || [];
    setVaccines(selectedVaccines);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent
        maxW={{ base: "90%", md: "60%" }}
        maxH="80vh"
        overflowY="auto"
      >
        <ModalHeader>
          {type === "new"
            ? "Add New Immunization"
            : type === "edit"
            ? "Edit Immunization"
            : "Immunization Details"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {type === "new" ? (
            <>
              <Text fontSize="18px" fontWeight={"700"} color="blue.blue500">
                Vaccine Information
              </Text>

              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Vaccine Code"
                  type="text"
                  value={Payload.vaccinecode}
                  onChange={handlePayload}
                  id="vaccinecode"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Vaccine Name"
                  type="text"
                  value={Payload.vaccinename}
                  onChange={handlePayload}
                  id="vaccinename"
                />
                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={Payload.vaccinetype !== "" ? "16px" : "13px"}
                  borderColor="#6B7280"
                  id="vaccinetype"
                  value={Payload.vaccinetype}
                  onChange={handlePayload}
                  placeholder="Select Vaccine Type"
                >
                  {Settings?.vaccinetype?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Manufacturer"
                  type="text"
                  value={Payload.manufacturer}
                  onChange={handlePayload}
                  id="manufacturer"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Batch No"
                  type="text"
                  value={Payload.batchno}
                  onChange={handlePayload}
                  id="batchno"
                />
                <Input
                  leftIcon={<FaCalendarAlt />}
                  label="Expiry Date"
                  type="date"
                  value={Payload.expirydate}
                  onChange={handlePayload}
                  id="expirydate"
                />
                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    Payload.vaccinationlocation !== "" ? "16px" : "13px"
                  }
                  borderColor="#6B7280"
                  id="vaccinationlocation"
                  value={Payload.vaccinationlocation}
                  onChange={handlePayload}
                  placeholder="Select Vaccination Location"
                >
                  {Settings?.vaccinationlocation?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
                {Payload.vaccinationlocation === "outreach" && (
                  <Box>
                    <Text fontSize="14px" fontWeight="500" mb="8px">
                      Select Outreach Medications
                    </Text>
                    <CheckboxGroup
                      colorScheme="blue"
                      value={selectedOutreachMedications}
                      onChange={handleOutreachMedicationChange}
                    >
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                        {outreachMedications.length > 0 ? (
                          outreachMedications.map((medication, i) => (
                            <Checkbox
                              key={i}
                              value={medication}
                              isChecked={selectedOutreachMedications.includes(
                                medication
                              )}
                            >
                              {medication}
                            </Checkbox>
                          ))
                        ) : (
                          <Text>No outreach medications available.</Text>
                        )}
                      </SimpleGrid>
                    </CheckboxGroup>
                  </Box>
                )}
                <Box>
                  <Text fontSize="14px" fontWeight="500" mb="8px">
                    Fully Immunized
                  </Text>
                  <RadioGroup
                    id="isFullyImmunized"
                    onChange={(value) =>
                      handlePayload({
                        target: { id: "isFullyImmunized", value },
                      })
                    }
                    value={
                      Payload.isFullyImmunized === null
                        ? ""
                        : Payload.isFullyImmunized.toString()
                    }
                  >
                    <Stack direction="row" spacing={5}>
                      <Radio value="true">Yes</Radio>
                      <Radio value="false">No</Radio>
                    </Stack>
                  </RadioGroup>
                </Box>
                <Box>
                  <Text fontSize="14px" fontWeight="500" mb="8px">
                    Zero Dose Child
                  </Text>
                  <RadioGroup
                    id="isZeroDoseChild"
                    onChange={(value) =>
                      handlePayload({
                        target: { id: "isZeroDoseChild", value },
                      })
                    }
                    value={
                      Payload.isZeroDoseChild === null
                        ? ""
                        : Payload.isZeroDoseChild.toString()
                    }
                  >
                    <Stack direction="row" spacing={5}>
                      <Radio value="true">Yes</Radio>
                      <Radio value="false">No</Radio>
                    </Stack>
                  </RadioGroup>
                </Box>
              </SimpleGrid>
              <Text fontSize="18px" fontWeight={"700"} color="blue.blue500">
                Administration
              </Text>

              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Select
                  leftIcon={<FaNoteSticky />}
                  h="45px"
                  borderWidth="2px"
                  fontSize={Payload.schedule !== "" ? "16px" : "13px"}
                  borderColor="#6B7280"
                  id="schedule"
                  value={Payload.schedule}
                  onChange={handleScheduleChange}
                  placeholder="Select Schedule"
                >
                  {schedules.map((schedule, i) => (
                    <option key={i} value={schedule}>
                      {schedule}
                    </option>
                  ))}
                </Select>

                <Box>
                  <Text fontSize="14px" fontWeight="500" mb="8px">
                    Select Vaccines
                  </Text>
                  <CheckboxGroup
                    colorScheme="blue"
                    value={selectedVaccines}
                    onChange={handleVaccineChange}
                  >
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                      {vaccines.length > 0 ? (
                        vaccines.map((vaccine, i) => (
                          <Checkbox
                            key={i}
                            value={vaccine}
                            isChecked={selectedVaccines.includes(vaccine)}
                          >
                            {vaccine}
                          </Checkbox>
                        ))
                      ) : (
                        <Text>
                          No vaccines available for the selected schedule.
                        </Text>
                      )}
                    </SimpleGrid>
                  </CheckboxGroup>
                </Box>

                <Input
                  leftIcon={<FaCalendarAlt />}
                  val={Payload.dateadministered !== "" ? true : false}
                  isDisabled={true}
                  label="Date Administered"
                  type="date"
                  value={Payload.dateadministered}
                  onChange={handlePayload}
                  id="dateadministered"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Dose (ml)"
                  type="number"
                  value={Payload.dose}
                  onChange={handlePayload}
                  id="dose"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Dose Amount"
                  type="number"
                  value={Payload.doseamount}
                  onChange={handlePayload}
                  id="doseamount"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Administration Site"
                  type="text"
                  value={Payload.administrationsite}
                  onChange={handlePayload}
                  id="administrationsite"
                />

                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    Payload.administrationroute !== "" ? "16px" : "13px"
                  }
                  borderColor="#6B7280"
                  id="administrationroute"
                  value={Payload.administrationroute}
                  onChange={handlePayload}
                  placeholder="Select Administration Route"
                >
                  {Settings?.administrationroute?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={Payload.consent !== "" ? "16px" : "13px"}
                  borderColor="#6B7280"
                  id="consent"
                  value={Payload.consent}
                  onChange={handlePayload}
                  placeholder="Select Consent"
                >
                  {Settings?.consent?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={Payload.immunizationstatus !== "" ? "16px" : "13px"}
                  borderColor="#6B7280"
                  id="immunizationstatus"
                  value={Payload.immunizationstatus}
                  onChange={handlePayload}
                  placeholder="Select Immunization Status"
                >
                  {Settings?.immunizationstatus?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Comment"
                  type="text"
                  value={Payload.comment}
                  onChange={handlePayload}
                  id="comment"
                />
              </SimpleGrid>

              <Text fontSize="18px" fontWeight={"700"} color="blue.blue500">
                Vaccine Reaction and Adverse Effects (AEFI)
              </Text>

              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Select
                  leftIcon={<FaNoteSticky />}
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    Payload.anynotedadverseeffect !== "" ? "16px" : "13px"
                  }
                  borderColor="#6B7280"
                  id="anynotedadverseeffect"
                  value={Payload.anynotedadverseeffect}
                  onChange={handlePayload}
                  placeholder="Any Noted Adverse Effect?"
                >
                  {Settings?.anynotedadverseeffect?.map((item, i) => (
                    <option key={i} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>

                {Payload.anynotedadverseeffect === "Yes" && (
                  <>
                    <Select
                      leftIcon={<FaNoteSticky />}
                      h="45px"
                      borderWidth="2px"
                      fontSize={
                        Payload.adverseeffectseverity !== "" ? "16px" : "13px"
                      }
                      borderColor="#6B7280"
                      id="adverseeffectseverity"
                      value={Payload.adverseeffectseverity}
                      onChange={handlePayload}
                      placeholder="Adverse Effect Severity"
                    >
                      {Settings?.adverseeffectseverity?.map((item, i) => (
                        <option key={i} value={item}>
                          {item}
                        </option>
                      ))}
                    </Select>

                    <Input
                      leftIcon={<FaNoteSticky />}
                      label="Medication Given to Manage Adverse Effect"
                      type="text"
                      value={Payload.medicationgiventomanageadverseeffect}
                      onChange={handlePayload}
                      id="medicationgiventomanageadverseeffect"
                    />
                    <Input
                      leftIcon={<FaNoteSticky />}
                      label="Vaccine Causing Adverse Effect"
                      type="text"
                      value={Payload.adverseEffectVaccine}
                      onChange={handlePayload}
                      id="adverseEffectVaccine"
                    />
                  </>
                )}

                <Input
                  leftIcon={<FaCalendarAlt />}
                  val={Payload.onsetdateofreaction !== "" ? true : false}
                  label="Onset Date Of Reaction"
                  type="date"
                  value={Payload.onsetdateofreaction}
                  onChange={handlePayload}
                  id="onsetdateofreaction"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  val={Payload.reactcode !== "" ? true : false}
                  label="React Code"
                  type="text"
                  value={Payload.reactcode}
                  onChange={handlePayload}
                  id="reactcode"
                />
              </SimpleGrid>

              <Text fontSize="18px" fontWeight={"700"} color="blue.blue500">
                Source and Reporting Information
              </Text>

              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={Payload.reporter !== "" ? "16px" : "13px"}
                  borderColor="#6B7280"
                  id="reporter"
                  value={Payload.reporter}
                  onChange={handlePayload}
                  placeholder="Select Reporter"
                >
                  {Settings?.reporter?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>

                <Input
                  leftIcon={<FaNoteSticky />}
                  val={Payload.reportingsource !== "" ? true : false}
                  label="Reporting Source"
                  type="text"
                  value={Payload.reportingsource}
                  onChange={handlePayload}
                  id="reportingsource"
                />
              </SimpleGrid>

              <Button mt="32px" isLoading={Loading} onClick={handleSubmitNew}>
                Save
              </Button>
            </>
          ) : type === "edit" ? (
            <>
              <Text fontSize="18px" fontWeight={"700"} color="blue.blue500">
                Vaccine Information
              </Text>

              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Vaccine Code"
                  type="text"
                  value={UpdatedPayload.vaccinecode}
                  onChange={handleUpdatedPayload}
                  id="vaccinecode"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Vaccine Name"
                  type="text"
                  value={UpdatedPayload.vaccinename}
                  onChange={handleUpdatedPayload}
                  id="vaccinename"
                />
                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={UpdatedPayload.vaccinetype !== "" ? "16px" : "13px"}
                  borderColor="#6B7280"
                  id="vaccinetype"
                  value={UpdatedPayload.vaccinetype}
                  onChange={handleUpdatedPayload}
                  placeholder="Select Vaccine Type"
                >
                  {Settings?.vaccinetype?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Manufacturer"
                  type="text"
                  value={UpdatedPayload.manufacturer}
                  onChange={handleUpdatedPayload}
                  id="manufacturer"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Batch No"
                  type="text"
                  value={UpdatedPayload.batchno}
                  onChange={handleUpdatedPayload}
                  id="batchno"
                />
                <Input
                  leftIcon={<FaCalendarAlt />}
                  label="Expiry Date"
                  type="date"
                  value={UpdatedPayload.expirydate}
                  onChange={handleUpdatedPayload}
                  id="expirydate"
                />
                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    UpdatedPayload.vaccinationlocation !== "" ? "16px" : "13px"
                  }
                  borderColor="#6B7280"
                  id="vaccinationlocation"
                  value={UpdatedPayload.vaccinationlocation}
                  onChange={handleUpdatedPayload}
                  placeholder="Select Vaccination Location"
                >
                  {Settings?.vaccinationlocation?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
                {UpdatedPayload.vaccinationlocation === "outreach" && (
                  <Box>
                    <Text fontSize="14px" fontWeight="500" mb="8px">
                      Select Outreach Medications
                    </Text>
                    <CheckboxGroup
                      colorScheme="blue"
                      value={selectedOutreachMedications}
                      onChange={handleOutreachMedicationChange}
                    >
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                        {outreachMedications.length > 0 ? (
                          outreachMedications.map((medication, i) => (
                            <Checkbox
                              key={i}
                              value={medication}
                              isChecked={selectedOutreachMedications.includes(
                                medication
                              )}
                            >
                              {medication}
                            </Checkbox>
                          ))
                        ) : (
                          <Text>No outreach medications available.</Text>
                        )}
                      </SimpleGrid>
                    </CheckboxGroup>
                  </Box>
                )}
                <Box>
                  <Text fontSize="14px" fontWeight="500" mb="8px">
                    Fully Immunized
                  </Text>
                  <RadioGroup
                    id="isFullyImmunized"
                    onChange={(value) =>
                      handleUpdatedPayload({
                        target: { id: "isFullyImmunized", value },
                      })
                    }
                    value={
                      UpdatedPayload.isFullyImmunized === null
                        ? ""
                        : UpdatedPayload.isFullyImmunized.toString()
                    }
                  >
                    <Stack direction="row" spacing={5}>
                      <Radio value="true">Yes</Radio>
                      <Radio value="false">No</Radio>
                    </Stack>
                  </RadioGroup>
                </Box>
                <Box>
                  <Text fontSize="14px" fontWeight="500" mb="8px">
                    Zero Dose Child
                  </Text>
                  <RadioGroup
                    id="isZeroDoseChild"
                    onChange={(value) =>
                      handleUpdatedPayload({
                        target: { id: "isZeroDoseChild", value },
                      })
                    }
                    value={
                      UpdatedPayload.isZeroDoseChild === null
                        ? ""
                        : UpdatedPayload.isZeroDoseChild.toString()
                    }
                  >
                    <Stack direction="row" spacing={5}>
                      <Radio value="true">Yes</Radio>
                      <Radio value="false">No</Radio>
                    </Stack>
                  </RadioGroup>
                </Box>
              </SimpleGrid>
              <Text fontSize="18px" fontWeight={"700"} color="blue.blue500">
                Administration
              </Text>

              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Select
                  leftIcon={<FaNoteSticky />}
                  h="45px"
                  borderWidth="2px"
                  fontSize={UpdatedPayload.schedule !== "" ? "16px" : "13px"}
                  borderColor="#6B7280"
                  id="schedule"
                  value={UpdatedPayload.schedule}
                  onChange={handleScheduleChange}
                  placeholder="Select Schedule"
                >
                  {schedules.map((schedule, i) => (
                    <option key={i} value={schedule}>
                      {schedule}
                    </option>
                  ))}
                </Select>

                <Box>
                  <Text fontSize="14px" fontWeight="500" mb="8px">
                    Select Vaccines
                  </Text>
                  <CheckboxGroup
                    colorScheme="blue"
                    value={selectedVaccines}
                    onChange={handleVaccineChange}
                  >
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                      {vaccines.length > 0 ? (
                        vaccines.map((vaccine, i) => (
                          <Checkbox
                            key={i}
                            value={vaccine}
                            isChecked={selectedVaccines.includes(vaccine)}
                          >
                            {vaccine}
                          </Checkbox>
                        ))
                      ) : (
                        <Text>
                          No vaccines available for the selected schedule.
                        </Text>
                      )}
                    </SimpleGrid>
                  </CheckboxGroup>
                </Box>

                <Input
                  leftIcon={<FaCalendarAlt />}
                  val={UpdatedPayload.dateadministered !== "" ? true : false}
                  isDisabled={true}
                  label="Date Administered"
                  type="date"
                  value={UpdatedPayload.dateadministered}
                  onChange={handleUpdatedPayload}
                  id="dateadministered"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Dose (ml)"
                  type="number"
                  value={UpdatedPayload.dose}
                  onChange={handleUpdatedPayload}
                  id="dose"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Dose Amount"
                  type="number"
                  value={UpdatedPayload.doseamount}
                  onChange={handleUpdatedPayload}
                  id="doseamount"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Administration Site"
                  type="text"
                  value={UpdatedPayload.administrationsite}
                  onChange={handleUpdatedPayload}
                  id="administrationsite"
                />

                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    UpdatedPayload.administrationroute !== "" ? "16px" : "13px"
                  }
                  borderColor="#6B7280"
                  id="administrationroute"
                  value={UpdatedPayload.administrationroute}
                  onChange={handleUpdatedPayload}
                  placeholder="Select Administration Route"
                >
                  {Settings?.administrationroute?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={UpdatedPayload.consent !== "" ? "16px" : "13px"}
                  borderColor="#6B7280"
                  id="consent"
                  value={UpdatedPayload.consent}
                  onChange={handleUpdatedPayload}
                  placeholder="Select Consent"
                >
                  {Settings?.consent?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    UpdatedPayload.immunizationstatus !== "" ? "16px" : "13px"
                  }
                  borderColor="#6B7280"
                  id="immunizationstatus"
                  value={UpdatedPayload.immunizationstatus}
                  onChange={handleUpdatedPayload}
                  placeholder="Select Immunization Status"
                >
                  {Settings?.immunizationstatus?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Comment"
                  type="text"
                  value={UpdatedPayload.comment}
                  onChange={handleUpdatedPayload}
                  id="comment"
                />
              </SimpleGrid>

              <Text fontSize="18px" fontWeight={"700"} color="blue.blue500">
                Vaccine Reaction and Adverse Effects (AEFI)
              </Text>

              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Select
                  leftIcon={<FaNoteSticky />}
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    UpdatedPayload.anynotedadverseeffect !== ""
                      ? "16px"
                      : "13px"
                  }
                  borderColor="#6B7280"
                  id="anynotedadverseeffect"
                  value={UpdatedPayload.anynotedadverseeffect}
                  onChange={handleUpdatedPayload}
                  placeholder="Any Noted Adverse Effect?"
                >
                  {Settings?.anynotedadverseeffect?.map((item, i) => (
                    <option key={i} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>

                {UpdatedPayload.anynotedadverseeffect === "Yes" && (
                  <>
                    <Select
                      leftIcon={<FaNoteSticky />}
                      h="45px"
                      borderWidth="2px"
                      fontSize={
                        UpdatedPayload.adverseeffectseverity !== ""
                          ? "16px"
                          : "13px"
                      }
                      borderColor="#6B7280"
                      id="adverseeffectseverity"
                      value={UpdatedPayload.adverseeffectseverity}
                      onChange={handleUpdatedPayload}
                      placeholder="Adverse Effect Severity"
                    >
                      {Settings?.adverseeffectseverity?.map((item, i) => (
                        <option key={i} value={item}>
                          {item}
                        </option>
                      ))}
                    </Select>

                    <Input
                      leftIcon={<FaNoteSticky />}
                      label="Medication Given to Manage Adverse Effect"
                      type="text"
                      value={
                        UpdatedPayload.medicationgiventomanageadverseeffect
                      }
                      onChange={handleUpdatedPayload}
                      id="medicationgiventomanageadverseeffect"
                    />
                    <Input
                      leftIcon={<FaNoteSticky />}
                      label="Vaccine Causing Adverse Effect"
                      type="text"
                      value={UpdatedPayload.adverseEffectVaccine}
                      onChange={handleUpdatedPayload}
                      id="adverseEffectVaccine"
                    />
                  </>
                )}

                <Input
                  leftIcon={<FaCalendarAlt />}
                  val={UpdatedPayload.onsetdateofreaction !== "" ? true : false}
                  label="Onset Date Of Reaction"
                  type="date"
                  value={UpdatedPayload.onsetdateofreaction}
                  onChange={handleUpdatedPayload}
                  id="onsetdateofreaction"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  val={UpdatedPayload.reactcode !== "" ? true : false}
                  label="React Code"
                  type="text"
                  value={UpdatedPayload.reactcode}
                  onChange={handleUpdatedPayload}
                  id="reactcode"
                />
              </SimpleGrid>

              <Text fontSize="18px" fontWeight={"700"} color="blue.blue500">
                Source and Reporting Information
              </Text>

              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={UpdatedPayload.reporter !== "" ? "16px" : "13px"}
                  borderColor="#6B7280"
                  id="reporter"
                  value={UpdatedPayload.reporter}
                  onChange={handleUpdatedPayload}
                  placeholder="Select Reporter"
                >
                  {Settings?.reporter?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>

                <Input
                  leftIcon={<FaNoteSticky />}
                  val={UpdatedPayload.reportingsource !== "" ? true : false}
                  label="Reporting Source"
                  type="text"
                  value={UpdatedPayload.reportingsource}
                  onChange={handleUpdatedPayload}
                  id="reportingsource"
                />
              </SimpleGrid>

              <Button
                mt="32px"
                isLoading={Loading}
                onClick={handleSubmitUpdate}
              >
                Save
              </Button>
            </>
          ) : (
            <>
              <Text fontSize="18px" fontWeight={"700"} color="blue.blue500">
                Vaccine Information
              </Text>

              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Input
                  isDisabled={true}
                  leftIcon={<FaNoteSticky />}
                  label="Vaccine Code"
                  type="text"
                  value={UpdatedPayload.vaccinecode}
                  onChange={handleUpdatedPayload}
                  id="vaccinecode"
                />
                <Input
                  isDisabled={true}
                  leftIcon={<FaNoteSticky />}
                  label="Vaccine Name"
                  type="text"
                  value={UpdatedPayload.vaccinename}
                  onChange={handleUpdatedPayload}
                  id="vaccinename"
                />
                <Select
                  isDisabled={true}
                  h="45px"
                  borderWidth="2px"
                  fontSize={UpdatedPayload.vaccinetype !== "" ? "16px" : "13px"}
                  borderColor="#6B7280"
                  id="vaccinetype"
                  value={UpdatedPayload.vaccinetype}
                  onChange={handleUpdatedPayload}
                  placeholder="Select Vaccine Type"
                >
                  {Settings?.vaccinetype?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
                <Input
                  isDisabled={true}
                  leftIcon={<FaNoteSticky />}
                  label="Manufacturer"
                  type="text"
                  value={UpdatedPayload.manufacturer}
                  onChange={handleUpdatedPayload}
                  id="manufacturer"
                />
                <Input
                  isDisabled={true}
                  leftIcon={<FaNoteSticky />}
                  label="Batch No"
                  type="text"
                  value={UpdatedPayload.batchno}
                  onChange={handleUpdatedPayload}
                  id="batchno"
                />
                <Input
                  isDisabled={true}
                  leftIcon={<FaCalendarAlt />}
                  label="Expiry Date"
                  type="date"
                  value={UpdatedPayload.expirydate}
                  onChange={handleUpdatedPayload}
                  id="expirydate"
                />
                <Select
                  isDisabled={true}
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    UpdatedPayload.vaccinationlocation !== "" ? "16px" : "13px"
                  }
                  borderColor="#6B7280"
                  id="vaccinationlocation"
                  value={UpdatedPayload.vaccinationlocation}
                  onChange={handleUpdatedPayload}
                  placeholder="Select Vaccination Location"
                >
                  {Settings?.vaccinationlocation?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
                {UpdatedPayload.vaccinationlocation === "outreach" && (
                  <Box>
                    <Text fontSize="14px" fontWeight="500" mb="8px">
                      Selected Outreach Medications
                    </Text>
                    <CheckboxGroup
                      colorScheme="blue"
                      value={selectedOutreachMedications}
                      isDisabled={true}
                    >
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                        {outreachMedications.length > 0 ? (
                          outreachMedications.map((medication, i) => (
                            <Checkbox
                              key={i}
                              value={medication}
                              isChecked={selectedOutreachMedications.includes(
                                medication
                              )}
                            >
                              {medication}
                            </Checkbox>
                          ))
                        ) : (
                          <Text>No outreach medications available.</Text>
                        )}
                      </SimpleGrid>
                    </CheckboxGroup>
                  </Box>
                )}
                <Box>
                  <Text fontSize="14px" fontWeight="500" mb="8px">
                    Fully Immunized
                  </Text>
                  <RadioGroup
                    id="isFullyImmunized"
                    value={
                      UpdatedPayload.isFullyImmunized === null
                        ? ""
                        : UpdatedPayload.isFullyImmunized.toString()
                    }
                    isDisabled={true}
                  >
                    <Stack direction="row" spacing={5}>
                      <Radio value="true">Yes</Radio>
                      <Radio value="false">No</Radio>
                    </Stack>
                  </RadioGroup>
                </Box>
                <Box>
                  <Text fontSize="14px" fontWeight="500" mb="8px">
                    Zero Dose Child
                  </Text>
                  <RadioGroup
                    id="isZeroDoseChild"
                    value={
                      UpdatedPayload.isZeroDoseChild === null
                        ? ""
                        : UpdatedPayload.isZeroDoseChild.toString()
                    }
                    isDisabled={true}
                  >
                    <Stack direction="row" spacing={5}>
                      <Radio value="true">Yes</Radio>
                      <Radio value="false">No</Radio>
                    </Stack>
                  </RadioGroup>
                </Box>
              </SimpleGrid>
              <Text fontSize="18px" fontWeight={"700"} color="blue.blue500">
                Administration
              </Text>

              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Select
                  isDisabled={true}
                  leftIcon={<FaNoteSticky />}
                  h="45px"
                  borderWidth="2px"
                  fontSize={UpdatedPayload.schedule !== "" ? "16px" : "13px"}
                  borderColor="#6B7280"
                  id="schedule"
                  value={UpdatedPayload.schedule}
                  onChange={handleScheduleChange}
                  placeholder="Select Schedule"
                >
                  {schedules.map((schedule, i) => (
                    <option key={i} value={schedule}>
                      {schedule}
                    </option>
                  ))}
                </Select>

                <Box>
                  <Text fontSize="14px" fontWeight="500" mb="8px">
                    Selected Vaccines
                  </Text>
                  <CheckboxGroup
                    colorScheme="blue"
                    value={selectedVaccines}
                    isDisabled={true}
                  >
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                      {vaccines.length > 0 ? (
                        vaccines.map((vaccine, i) => (
                          <Checkbox
                            key={i}
                            value={vaccine}
                            isChecked={selectedVaccines.includes(vaccine)}
                          >
                            {vaccine}
                          </Checkbox>
                        ))
                      ) : (
                        <Text>
                          No vaccines available for the selected schedule.
                        </Text>
                      )}
                    </SimpleGrid>
                  </CheckboxGroup>
                </Box>

                <Input
                  isDisabled={true}
                  leftIcon={<FaCalendarAlt />}
                  val={UpdatedPayload.dateadministered !== "" ? true : false}
                  label="Date Administered"
                  type="date"
                  value={UpdatedPayload.dateadministered}
                  onChange={handleUpdatedPayload}
                  id="dateadministered"
                />
                <Input
                  isDisabled={true}
                  leftIcon={<FaNoteSticky />}
                  label="Dose (ml)"
                  type="number"
                  value={UpdatedPayload.dose}
                  onChange={handleUpdatedPayload}
                  id="dose"
                />
                <Input
                  isDisabled={true}
                  leftIcon={<FaNoteSticky />}
                  label="Dose Amount"
                  type="number"
                  value={UpdatedPayload.doseamount}
                  onChange={handleUpdatedPayload}
                  id="doseamount"
                />
                <Input
                  isDisabled={true}
                  leftIcon={<FaNoteSticky />}
                  label="Administration Site"
                  type="text"
                  value={UpdatedPayload.administrationsite}
                  onChange={handleUpdatedPayload}
                  id="administrationsite"
                />

                <Select
                  isDisabled={true}
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    UpdatedPayload.administrationroute !== "" ? "16px" : "13px"
                  }
                  borderColor="#6B7280"
                  id="administrationroute"
                  value={UpdatedPayload.administrationroute}
                  onChange={handleUpdatedPayload}
                  placeholder="Select Administration Route"
                >
                  {Settings?.administrationroute?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
                <Select
                  isDisabled={true}
                  h="45px"
                  borderWidth="2px"
                  fontSize={UpdatedPayload.consent !== "" ? "16px" : "13px"}
                  borderColor="#6B7280"
                  id="consent"
                  value={UpdatedPayload.consent}
                  onChange={handleUpdatedPayload}
                  placeholder="Select Consent"
                >
                  {Settings?.consent?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
                <Select
                  isDisabled={true}
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    UpdatedPayload.immunizationstatus !== "" ? "16px" : "13px"
                  }
                  borderColor="#6B7280"
                  id="immunizationstatus"
                  value={UpdatedPayload.immunizationstatus}
                  onChange={handleUpdatedPayload}
                  placeholder="Select Immunization Status"
                >
                  {Settings?.immunizationstatus?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
                <Input
                  isDisabled={true}
                  leftIcon={<FaNoteSticky />}
                  label="Comment"
                  type="text"
                  value={UpdatedPayload.comment}
                  onChange={handleUpdatedPayload}
                  id="comment"
                />
              </SimpleGrid>

              <Text fontSize="18px" fontWeight={"700"} color="blue.blue500">
                Vaccine Reaction and Adverse Effects (AEFI)
              </Text>

              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Select
                  isDisabled={true}
                  leftIcon={<FaNoteSticky />}
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    UpdatedPayload.anynotedadverseeffect !== ""
                      ? "16px"
                      : "13px"
                  }
                  borderColor="#6B7280"
                  id="anynotedadverseeffect"
                  value={UpdatedPayload.anynotedadverseeffect}
                  onChange={handleUpdatedPayload}
                  placeholder="Any Noted Adverse Effect?"
                >
                  {Settings?.anynotedadverseeffect?.map((item, i) => (
                    <option key={i} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>

                {UpdatedPayload.anynotedadverseeffect === "Yes" && (
                  <>
                    <Select
                      isDisabled={true}
                      leftIcon={<FaNoteSticky />}
                      h="45px"
                      borderWidth="2px"
                      fontSize={
                        UpdatedPayload.adverseeffectseverity !== ""
                          ? "16px"
                          : "13px"
                      }
                      borderColor="#6B7280"
                      id="adverseeffectseverity"
                      value={UpdatedPayload.adverseeffectseverity}
                      onChange={handleUpdatedPayload}
                      placeholder="Adverse Effect Severity"
                    >
                      {Settings?.adverseeffectseverity?.map((item, i) => (
                        <option key={i} value={item}>
                          {item}
                        </option>
                      ))}
                    </Select>

                    <Input
                      isDisabled={true}
                      leftIcon={<FaNoteSticky />}
                      label="Medication Given to Manage Adverse Effect"
                      type="text"
                      value={
                        UpdatedPayload.medicationgiventomanageadverseeffect
                      }
                      onChange={handleUpdatedPayload}
                      id="medicationgiventomanageadverseeffect"
                    />
                    <Input
                      isDisabled={true}
                      leftIcon={<FaNoteSticky />}
                      label="Vaccine Causing Adverse Effect"
                      type="text"
                      value={UpdatedPayload.adverseEffectVaccine}
                      onChange={handleUpdatedPayload}
                      id="adverseEffectVaccine"
                    />
                  </>
                )}

                <Input
                  isDisabled={true}
                  leftIcon={<FaCalendarAlt />}
                  val={UpdatedPayload.onsetdateofreaction !== "" ? true : false}
                  label="Onset Date Of Reaction"
                  type="date"
                  value={UpdatedPayload.onsetdateofreaction}
                  onChange={handleUpdatedPayload}
                  id="onsetdateofreaction"
                />
                <Input
                  isDisabled={true}
                  leftIcon={<FaNoteSticky />}
                  val={UpdatedPayload.reactcode !== "" ? true : false}
                  label="React Code"
                  type="text"
                  value={UpdatedPayload.reactcode}
                  onChange={handleUpdatedPayload}
                  id="reactcode"
                />
              </SimpleGrid>

              <Text fontSize="18px" fontWeight={"700"} color="blue.blue500">
                Source and Reporting Information
              </Text>

              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Select
                  isDisabled={true}
                  h="45px"
                  borderWidth="2px"
                  fontSize={UpdatedPayload.reporter !== "" ? "16px" : "13px"}
                  borderColor="#6B7280"
                  id="reporter"
                  value={UpdatedPayload.reporter}
                  onChange={handleUpdatedPayload}
                  placeholder="Select Reporter"
                >
                  {Settings?.reporter?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>

                <Input
                  isDisabled={true}
                  leftIcon={<FaNoteSticky />}
                  val={UpdatedPayload.reportingsource !== "" ? true : false}
                  label="Reporting Source"
                  type="text"
                  value={UpdatedPayload.reportingsource}
                  onChange={handleUpdatedPayload}
                  id="reportingsource"
                />
              </SimpleGrid>
            </>
          )}
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
