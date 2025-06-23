import { HStack, Radio, RadioGroup, Text } from "@chakra-ui/react";
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
  const [Disabled, setDisabled] = useState(true);
  const [Loading, setLoading] = useState(false);
  const [Settings, setSettings] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [vaccines, setVaccines] = useState([]);

  const date = Date.now();
  const currentDate = new Date(date).toISOString().split("T")[0];
  const id = localStorage.getItem("patientId");

  const [Payload, setPayload] = useState({
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
    schedule: "",
    vaccination: "",
  });

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
    schedule: "",
    vaccination: "",
  });

  const handlePayload = (e) => {
    setPayload({ ...Payload, [e.target.id]: e.target.value });
  };

  const handleUpdatedPayload = (e) => {
    setUpdatedPayload({ ...UpdatedPayload, [e.target.id]: e.target.value });
  };

  const handleSubmitNew = async () => {
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

  useEffect(() => {
    if (
      Object.values(Payload).some(
        (value) => value !== null && value !== "" && value !== undefined
      )
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
    getSettings();

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
      schedule: oldPayload?.schedule || "",
      vaccination: oldPayload?.vaccination || "",
    });
  }, [isOpen, Payload]);

  const handleScheduleChange = (e) => {
    const selectedSchedule = e.target.value;
    setPayload({ ...Payload, schedule: selectedSchedule });

    // Find corresponding vaccines for the selected schedule
    const selectedMapping = Settings?.vacinationmapping.find(
      (item) => item.schedule === selectedSchedule
    );
    const selectedVaccines = selectedMapping?.vaccination || [];
    setVaccines(selectedVaccines);
  };

  const handleVaccineChange = (e) => {
    const selectedVaccine = e.target.value;
    setPayload({ ...Payload, vaccination: selectedVaccine });
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
          {" "}
          {type === "new"
            ? "Add New Immunization"
            : type === "edit"
            ? "Edit Immunization"
            : "Immunization Details"}{" "}
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
                  label="Vaccine Code "
                  type="text"
                  value={Payload.vaccinecode}
                  onChange={handlePayload}
                  id="vaccinecode"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Vaccine Name "
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
                  label="Batch  No"
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

                <Select
                  leftIcon={<FaNoteSticky />}
                  h="45px"
                  borderWidth="2px"
                  fontSize={Payload.vaccination !== "" ? "16px" : "13px"}
                  borderColor="#6B7280"
                  id="vaccination"
                  value={Payload.vaccination}
                  onChange={handleVaccineChange}
                  placeholder="Select Vaccine"
                >
                  {vaccines.map((vaccine, i) => (
                    <option key={i} value={vaccine}>
                      {vaccine}
                    </option>
                  ))}
                </Select>
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

              <Button
                mt="32px"
                isLoading={Loading}
                disabled={Disabled}
                onClick={handleSubmitNew}
              >
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
                  label="Vaccine Code "
                  type="text"
                  value={UpdatedPayload.vaccinecode}
                  onChange={handleUpdatedPayload}
                  id="vaccinecode"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Vaccine Name "
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
                  label="Batch  No"
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

                <Select
                 
                  leftIcon={<FaNoteSticky />}
                  h="45px"
                  borderWidth="2px"
                  fontSize={UpdatedPayload.vaccination !== "" ? "16px" : "13px"}
                  borderColor="#6B7280"
                  id="vaccination"
                  value={UpdatedPayload.vaccination}
                  onChange={handleUpdatedPayload}
                  placeholder="Select Vaccine"
                >
                  {vaccines.map((vaccine, i) => (
                    <option key={i} value={vaccine}>
                      {vaccine}
                    </option>
                  ))}
                </Select>
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
                Vaccine Reaction and Adverse Effects(AEFI)
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
                disabled={Disabled}
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
                  label="Vaccine Code "
                  type="text"
                  value={UpdatedPayload.vaccinecode}
                  onChange={handleUpdatedPayload}
                  id="vaccinecode"
                />
                <Input
                  isDisabled={true}
                  leftIcon={<FaNoteSticky />}
                  label="Vaccine Name "
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
                  label="Batch  No"
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

                <Select
                  isDisabled={true}
                  leftIcon={<FaNoteSticky />}
                  h="45px"
                  borderWidth="2px"
                  fontSize={UpdatedPayload.vaccination !== "" ? "16px" : "13px"}
                  borderColor="#6B7280"
                  id="vaccination"
                  value={UpdatedPayload.vaccination}
                  onChange={handleUpdatedPayload}
                  placeholder="Select Vaccine"
                >
                  {vaccines.map((vaccine, i) => (
                    <option key={i} value={vaccine}>
                      {vaccine}
                    </option>
                  ))}
                </Select>

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
                Vaccine Reaction and Adverse Events
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
                  val={
                    UpdatedPayload.adverseeventdescription !== "" ? true : false
                  }
                  label="Adverse Event Description"
                  type="text"
                  value={UpdatedPayload.adverseeventdescription}
                  onChange={handleUpdatedPayload}
                  id="adverseeventdescription"
                />
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
