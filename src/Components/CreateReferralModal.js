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
  Flex,
} from "@chakra-ui/react";
import { SlPlus } from "react-icons/sl";
import Input from "./Input";
import Button from "./Button";
import ReferralDiagnosisCard from "./ReferralDiagnosisCard";
import { FaNoteSticky } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { IoColorFilter } from "react-icons/io5";
import {
  SettingsApi,
  AddReferralAPI,
  UpdateReferralAPI,
  GetAllClinicApi,
  GetAllUsersApi,
} from "../Utils/ApiCalls";
import { FaArrowsToDot } from "react-icons/fa6";
import { AiFillDatabase } from "react-icons/ai";

export default function CreateReferralModal({
  isOpen,
  onClose,
  setOldPayload,
  activateNotifications,
  type,
  oldPayload,
}) {
  const [Disabled, setDisabled] = useState(true);
  const [Loading, setLoading] = useState(false);
  const [Clinics, setClinics] = useState([]);
  const [Doctors, setDoctors] = useState([]);
  const [Settings, setSettings] = useState("");
  const [showCustomComplaint, setShowCustomComplaint] = useState(false);
  const [customComplaint, setCustomComplaint] = useState("");

  const date = Date.now();
  const currentDate = new Date(date).toISOString().split("T")[0];
  const id = localStorage.getItem("patientId");
  const [Payload, setPayload] = useState({
    referredclinic: "",
    referraldate: currentDate,
    referredby: "",
    receivingclinic: "",
    preferredconsultant: "",
    priority: "",
    reasonforreferral: "",
    presentingcomplaints: "",
    presentingcomplaintsnotes: "",
    additionalnotes: "",
    salienthistory: "",
    findingsonexamination: "",
    investigationdoneifany: "",
    laboratoryfindings: "",
    requiredinputintervention: "",
    diagnosis: [
      {
        diagnosis: "",
        note: "",
      },
    ],
  });
  const [UpdatedPayload, setUpdatedPayload] = useState({
    referredclinic: "",
    referraldate: currentDate,
    referredby: "",
    receivingclinic: "",
    preferredconsultant: "",
    priority: "",
    reasonforreferral: "",
    presentingcomplaints: "",
    presentingcomplaintsnotes: "",
    additionalnotes: "",
    salienthistory: "",
    findingsonexamination: "",
    investigationdoneifany: "",
    laboratoryfindings: "",
    requiredinputintervention: "",
    diagnosis: [
      {
        diagnosis: "",
        note: "",
      },
    ],
  });

  const handlePayload = (e) => {
    if (e.target.id === "presentingcomplaints") {
      if (e.target.value === "Others") {
        setShowCustomComplaint(true);
        setPayload({ ...Payload, presentingcomplaints: "" });
      } else {
        setShowCustomComplaint(false);
        setCustomComplaint("");
        setPayload({ ...Payload, [e.target.id]: e.target.value });
      }
    } else {
      setPayload({ ...Payload, [e.target.id]: e.target.value });
    }
  };

  const handleCustomComplaintChange = (e) => {
    const value = e.target.value;
    setCustomComplaint(value);
    setPayload({ ...Payload, presentingcomplaints: value });
  };

  const handleUpdatedPayload = (e) => {
    if (e.target.id === "presentingcomplaints") {
      if (e.target.value === "Others") {
        setShowCustomComplaint(true);
        setUpdatedPayload({ ...UpdatedPayload, presentingcomplaints: "" });
      } else {
        setShowCustomComplaint(false);
        setCustomComplaint("");
        setUpdatedPayload({ ...UpdatedPayload, [e.target.id]: e.target.value });
      }
    } else {
      setUpdatedPayload({ ...UpdatedPayload, [e.target.id]: e.target.value });
    }
  };

  const handleUpdatedCustomComplaintChange = (e) => {
    const value = e.target.value;
    setCustomComplaint(value);
    setUpdatedPayload({ ...UpdatedPayload, presentingcomplaints: value });
  };

  const handleSubmitNew = async () => {
    setLoading(true);
    try {
      const finalPayload = {
        ...Payload,
        presentingcomplaints: showCustomComplaint
          ? customComplaint
          : Payload.presentingcomplaints,
      };

      const result = await AddReferralAPI(finalPayload, id);

      if (result.status === 200) {
        setLoading(false);

        activateNotifications("Patient Referred Successfully", "success");
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
      const finalPayload = {
        ...UpdatedPayload,
        presentingcomplaints: showCustomComplaint
          ? customComplaint
          : UpdatedPayload.presentingcomplaints,
      };

      const result = await UpdateReferralAPI(finalPayload, oldPayload._id);

      if (result.status === 200) {
        setLoading(false);

        activateNotifications("Updated Successfully", "success");
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
    } catch (e) {}
  };

  const getAllClinic = async () => {
    try {
      const result = await GetAllClinicApi();
      setClinics(result.queryresult.clinicdetails);
    } catch (e) {}
  };
  const getAllUser = async () => {
    try {
      const result = await GetAllUsersApi();

      setDoctors(result.queryresult.userdetails);
    } catch (e) {}
  };

  useEffect(() => {
    getAllUser();
    getAllClinic();
    getSettings();

    setUpdatedPayload({
      referredclinic: oldPayload?.referredclinic,
      referraldate: oldPayload?.referraldate,
      referredby: oldPayload?.referredby,
      receivingclinic: oldPayload?.receivingclinic,
      preferredconsultant: oldPayload?.preferredconsultant,
      priority: oldPayload?.priority,
      reasonforreferral: oldPayload?.reasonforreferral,
      presentingcomplaints: oldPayload?.presentingcomplaints,
      presentingcomplaintsnotes: oldPayload?.presentingcomplaintsnotes,
      additionalnotes: oldPayload?.additionalnotes,
      salienthistory: oldPayload?.salienthistory,
      findingsonexamination: oldPayload?.findingsonexamination,
      investigationdoneifany: oldPayload?.investigationdoneifany,
      laboratoryfindings: oldPayload?.laboratoryfindings,
      requiredinputintervention: oldPayload?.requiredinputintervention,
      diagnosis: oldPayload?.diagnosis,
    });

    // Check if presenting complaint is not in the predefined list (custom complaint)
    if (
      oldPayload?.presentingcomplaints &&
      Settings?.presentingcomplaints &&
      !Settings.presentingcomplaints.includes(oldPayload.presentingcomplaints)
    ) {
      setShowCustomComplaint(true);
      setCustomComplaint(oldPayload.presentingcomplaints);
    }
  }, [isOpen, Payload]);

  // Reset custom complaint state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowCustomComplaint(false);
      setCustomComplaint("");
    }
  }, [isOpen]);

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
            ? "Add New Referral"
            : type === "edit"
            ? "Edit Referral"
            : "Referral Details"}{" "}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {type === "new" ? (
            <>
              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Referral Organization
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
                  fontSize={Payload.referredclinic !== "" ? "16px" : "13px"}
                  borderColor="#6B7280"
                  id="referredclinic"
                  value={Payload.referredclinic}
                  onChange={handlePayload}
                  placeholder="Select Originating Clinic"
                >
                  {Clinics.filter((item) => item.type === "clinic").map(
                    (item, i) => (
                      <option value={`${item.clinic}`} key={i}>
                        {item.clinic}
                      </option>
                    )
                  )}
                </Select>
                <Input
                  leftIcon={<FaCalendarAlt />}
                  val={Payload.referraldate !== "" ? true : false}
                  label="Referred Date"
                  type="date"
                  value={Payload.referraldate}
                  onChange={handlePayload}
                  id="referraldate"
                />

                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Referred By "
                  type="text"
                  value={Payload.referredby}
                  onChange={handlePayload}
                  id="referredby"
                />
              </SimpleGrid>
              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Receiving Organization
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
                  fontSize={Payload.receivingclinic !== "" ? "16px" : "13px"}
                  borderColor="#6B7280"
                  id="receivingclinic"
                  value={Payload.receivingclinic}
                  onChange={handlePayload}
                  placeholder="Select Receiving Clinic"
                >
                  {Clinics.filter((item) => item.type === "clinic").map(
                    (item, i) => (
                      <option value={`${item.clinic}`} key={i}>
                        {item.clinic}
                      </option>
                    )
                  )}
                </Select>
                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    Payload.preferredconsultant !== "" ? "16px" : "13px"
                  }
                  borderColor="#6B7280"
                  id="preferredconsultant"
                  value={Payload.preferredconsultant}
                  onChange={handlePayload}
                  placeholder="Select Preferred Consultant"
                >
                  {Doctors.filter((item) => item.role === "Medical Doctor").map(
                    (item, i) => (
                      <option
                        value={`${item._id}`}
                        key={i}
                      >{`${item.firstName} ${item.lastName}`}</option>
                    )
                  )}
                </Select>

                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={Payload.priority !== "" ? "16px" : "13px"}
                  borderColor="#6B7280"
                  id="priority"
                  value={Payload.priority}
                  onChange={handlePayload}
                  placeholder="Select Priority"
                >
                  {Settings?.priority?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>

                <Input
                  leftIcon={<FaNoteSticky />}
                  val={Payload.reasonforreferral !== "" ? true : false}
                  label="Reason For Referral"
                  type="text"
                  value={Payload.reasonforreferral}
                  onChange={handlePayload}
                  id="reasonforreferral"
                />
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Presenting Complaints
              </Text>

              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                {!showCustomComplaint ? (
                  <Select
                    h="45px"
                    borderWidth="2px"
                    fontSize={
                      Payload.presentingcomplaints !== "" ? "16px" : "13px"
                    }
                    borderColor="#6B7280"
                    id="presentingcomplaints"
                    value={Payload.presentingcomplaints}
                    onChange={handlePayload}
                    placeholder="Select Presenting Complaints"
                  >
                    {Settings?.presentingcomplaints?.map((item, i) => (
                      <option value={`${item}`} key={i}>
                        {item}
                      </option>
                    ))}
                    <option value="Others">Others</option>
                  </Select>
                ) : (
                  <Input
                    leftIcon={<FaNoteSticky />}
                    val={customComplaint !== "" ? true : false}
                    label="Specify Presenting Complaint"
                    type="text"
                    value={customComplaint}
                    onChange={handleCustomComplaintChange}
                    id="customComplaint"
                    placeholder="Enter your presenting complaint"
                  />
                )}

                <Input
                  leftIcon={<FaNoteSticky />}
                  val={Payload.presentingcomplaintsnotes !== "" ? true : false}
                  label="Presenting Complaints Notes"
                  type="text"
                  value={Payload.presentingcomplaintsnotes}
                  onChange={handlePayload}
                  id="presentingcomplaintsnotes"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  val={Payload.additionalnotes !== "" ? true : false}
                  label="Additional Notes"
                  type="text"
                  value={Payload.additionalnotes}
                  onChange={handlePayload}
                  id="additionalnotes"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  val={Payload.salienthistory !== "" ? true : false}
                  label="Salient History"
                  type="text"
                  value={Payload.salienthistory}
                  onChange={handlePayload}
                  id="salienthistory"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  val={Payload.findingsonexamination !== "" ? true : false}
                  label="Findings On Examination"
                  type="text"
                  value={Payload.findingsonexamination}
                  onChange={handlePayload}
                  id="findingsonexamination"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  val={Payload.investigationdoneifany !== "" ? true : false}
                  label="Investigation Done, If Any"
                  type="text"
                  value={Payload.investigationdoneifany}
                  onChange={handlePayload}
                  id="investigationdoneifany"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  val={Payload.laboratoryfindings !== "" ? true : false}
                  label="Laboratory Findings"
                  type="text"
                  value={Payload.laboratoryfindings}
                  onChange={handlePayload}
                  id="laboratoryfindings"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  val={Payload.requiredinputintervention !== "" ? true : false}
                  label="Required Input Intervention"
                  type="text"
                  value={Payload.requiredinputintervention}
                  onChange={handlePayload}
                  id="requiredinputintervention"
                />
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Diagnosis
              </Text>
              <Flex justifyContent={"flex-end"} mb="15px">
                <Button
                  w="150px"
                  rightIcon={<SlPlus />}
                  onClick={() =>
                    setPayload({
                      ...Payload,
                      diagnosis: [
                        ...Payload.diagnosis,
                        {
                          note: "",
                          diagnosis: "",
                        },
                      ],
                    })
                  }
                >
                  Add Diagnosis
                </Button>
              </Flex>

              {Payload.diagnosis.map((item, i) => (
                <ReferralDiagnosisCard
                  data={item}
                  oldItem={Payload.diagnosis}
                  Payload={Payload}
                  setPayload={setPayload}
                  key={i}
                  i={i}
                />
              ))}

              <Button mt="32px" isLoading={Loading} onClick={handleSubmitNew}>
                Proceed
              </Button>
            </>
          ) : type === "edit" ? (
            <>
              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Referral Organization
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
                  fontSize={
                    UpdatedPayload.referredclinic !== "" ? "16px" : "13px"
                  }
                  borderColor="#6B7280"
                  id="referredclinic"
                  value={UpdatedPayload.referredclinic}
                  onChange={handleUpdatedPayload}
                  placeholder="Select Originating Clinic"
                >
                  {Clinics.filter((item) => item.type === "clinic").map(
                    (item, i) => (
                      <option value={`${item.clinic}`} key={i}>
                        {item.clinic}
                      </option>
                    )
                  )}
                </Select>
                <Input
                  leftIcon={<FaCalendarAlt />}
                  val={UpdatedPayload.referraldate !== "" ? true : false}
                  label="Referred Date"
                  type="date"
                  value={UpdatedPayload.referraldate}
                  onChange={handleUpdatedPayload}
                  id="referraldate"
                />

                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Referred By "
                  type="text"
                  value={UpdatedPayload.referredby}
                  onChange={handleUpdatedPayload}
                  id="referredby"
                />
              </SimpleGrid>
              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Receiving Organization
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
                  fontSize={
                    UpdatedPayload.receivingclinic !== "" ? "16px" : "13px"
                  }
                  borderColor="#6B7280"
                  id="receivingclinic"
                  value={UpdatedPayload.receivingclinic}
                  onChange={handleUpdatedPayload}
                  placeholder="Select Receiving Clinic"
                >
                  {Clinics.filter((item) => item.type === "clinic").map(
                    (item, i) => (
                      <option value={`${item.clinic}`} key={i}>
                        {item.clinic}
                      </option>
                    )
                  )}
                </Select>
                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    UpdatedPayload.preferredconsultant !== "" ? "16px" : "13px"
                  }
                  borderColor="#6B7280"
                  id="preferredconsultant"
                  value={UpdatedPayload.preferredconsultant}
                  onChange={handleUpdatedPayload}
                  placeholder="Select Preferred Consultant"
                >
                  {Doctors.filter((item) => item.role === "Doctor").map(
                    (item, i) => (
                      <option
                        value={`${item._id}`}
                        key={i}
                      >{`${item.firstName} ${item.lastName}`}</option>
                    )
                  )}
                </Select>

                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={UpdatedPayload.priority !== "" ? "16px" : "13px"}
                  borderColor="#6B7280"
                  id="priority"
                  value={UpdatedPayload.priority}
                  onChange={handleUpdatedPayload}
                  placeholder="Select Priority"
                >
                  {Settings?.priority?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>

                <Input
                  leftIcon={<FaNoteSticky />}
                  val={UpdatedPayload.reasonforreferral !== "" ? true : false}
                  label="Reason For Referral"
                  type="text"
                  value={UpdatedPayload.reasonforreferral}
                  onChange={handleUpdatedPayload}
                  id="reasonforreferral"
                />
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Presenting Complaints
              </Text>

              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                {!showCustomComplaint ? (
                  <Select
                    h="45px"
                    borderWidth="2px"
                    fontSize={
                      UpdatedPayload.presentingcomplaints !== ""
                        ? "16px"
                        : "13px"
                    }
                    borderColor="#6B7280"
                    id="presentingcomplaints"
                    value={UpdatedPayload.presentingcomplaints}
                    onChange={handleUpdatedPayload}
                    placeholder="Select Presenting Complaints"
                  >
                    {Settings?.presentingcomplaints?.map((item, i) => (
                      <option value={`${item}`} key={i}>
                        {item}
                      </option>
                    ))}
                    <option value="Others">Others</option>
                  </Select>
                ) : (
                  <Input
                    leftIcon={<FaNoteSticky />}
                    val={customComplaint !== "" ? true : false}
                    label="Specify Presenting Complaint"
                    type="text"
                    value={customComplaint}
                    onChange={handleUpdatedCustomComplaintChange}
                    id="customComplaint"
                    placeholder="Enter your presenting complaint"
                  />
                )}

                <Input
                  leftIcon={<FaNoteSticky />}
                  val={
                    UpdatedPayload.presentingcomplaintsnotes !== ""
                      ? true
                      : false
                  }
                  label="Presenting Complaints Notes"
                  type="text"
                  value={UpdatedPayload.presentingcomplaintsnotes}
                  onChange={handleUpdatedPayload}
                  id="presentingcomplaintsnotes"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  val={UpdatedPayload.additionalnotes !== "" ? true : false}
                  label="Additional Notes"
                  type="text"
                  value={UpdatedPayload.additionalnotes}
                  onChange={handleUpdatedPayload}
                  id="additionalnotes"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  val={UpdatedPayload.salienthistory !== "" ? true : false}
                  label="Salient History"
                  type="text"
                  value={UpdatedPayload.salienthistory}
                  onChange={handleUpdatedPayload}
                  id="salienthistory"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  val={
                    UpdatedPayload.findingsonexamination !== "" ? true : false
                  }
                  label="Findings On Examination"
                  type="text"
                  value={UpdatedPayload.findingsonexamination}
                  onChange={handleUpdatedPayload}
                  id="findingsonexamination"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  val={
                    UpdatedPayload.investigationdoneifany !== "" ? true : false
                  }
                  label="Investigation Done, If Any"
                  type="text"
                  value={UpdatedPayload.investigationdoneifany}
                  onChange={handleUpdatedPayload}
                  id="investigationdoneifany"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  val={UpdatedPayload.laboratoryfindings !== "" ? true : false}
                  label="Laboratory Findings"
                  type="text"
                  value={UpdatedPayload.laboratoryfindings}
                  onChange={handleUpdatedPayload}
                  id="laboratoryfindings"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  val={
                    UpdatedPayload.requiredinputintervention !== ""
                      ? true
                      : false
                  }
                  label="Required Input Intervention"
                  type="text"
                  value={UpdatedPayload.requiredinputintervention}
                  onChange={handleUpdatedPayload}
                  id="requiredinputintervention"
                />
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Diagnosis
              </Text>
              <Flex justifyContent={"flex-end"} mb="15px">
                <Button
                  w="150px"
                  rightIcon={<SlPlus />}
                  onClick={() =>
                    setUpdatedPayload({
                      ...UpdatedPayload,
                      diagnosis: [
                        ...UpdatedPayload.diagnosis,
                        {
                          note: "",
                          diagnosis: "",
                        },
                      ],
                    })
                  }
                >
                  Add Diagnosis
                </Button>
              </Flex>

              {UpdatedPayload.diagnosis?.map((item, i) => (
                <ReferralDiagnosisCard
                  data={item}
                  oldItem={UpdatedPayload.diagnosis}
                  Payload={UpdatedPayload}
                  setPayload={setUpdatedPayload}
                  key={i}
                  i={i}
                />
              ))}

              <Button
                mt="32px"
                isLoading={Loading}
                onClick={handleSubmitUpdate}
              >
                Updated
              </Button>
            </>
          ) : (
            <>
              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Referral Organization
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
                  fontSize={
                    UpdatedPayload.referredclinic !== "" ? "16px" : "13px"
                  }
                  borderColor="#6B7280"
                  id="referredclinic"
                  value={UpdatedPayload.referredclinic}
                  onChange={handleUpdatedPayload}
                  placeholder="Select Originating Clinic"
                >
                  {Clinics.filter((item) => item.type === "clinic").map(
                    (item, i) => (
                      <option value={`${item.clinic}`} key={i}>
                        {item.clinic}
                      </option>
                    )
                  )}
                </Select>
                <Input
                  isDisabled={true}
                  leftIcon={<FaCalendarAlt />}
                  val={UpdatedPayload.referraldate !== "" ? true : false}
                  label="Referred Date"
                  type="date"
                  value={UpdatedPayload.referraldate}
                  onChange={handleUpdatedPayload}
                  id="referraldate"
                />

                <Input
                  isDisabled={true}
                  leftIcon={<FaNoteSticky />}
                  label="Referred By "
                  type="text"
                  value={UpdatedPayload.referredby}
                  onChange={handleUpdatedPayload}
                  id="referredby"
                />
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Receiving Organization
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
                  fontSize={
                    UpdatedPayload.receivingclinic !== "" ? "16px" : "13px"
                  }
                  borderColor="#6B7280"
                  id="receivingclinic"
                  value={UpdatedPayload.receivingclinic}
                  onChange={handleUpdatedPayload}
                  placeholder="Select Receiving Clinic"
                >
                  {Clinics.filter((item) => item.type === "clinic").map(
                    (item, i) => (
                      <option value={`${item.clinic}`} key={i}>
                        {item.clinic}
                      </option>
                    )
                  )}
                </Select>
                <Select
                  isDisabled={true}
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    UpdatedPayload.preferredconsultant !== "" ? "16px" : "13px"
                  }
                  borderColor="#6B7280"
                  id="preferredconsultant"
                  value={UpdatedPayload.preferredconsultant}
                  onChange={handleUpdatedPayload}
                  placeholder="Select Preferred Consultant"
                >
                  {Doctors.filter((item) => item.role === "Doctor").map(
                    (item, i) => (
                      <option
                        value={`${item._id}`}
                        key={i}
                      >{`${item.firstName} ${item.lastName}`}</option>
                    )
                  )}
                </Select>

                <Select
                  isDisabled={true}
                  h="45px"
                  borderWidth="2px"
                  fontSize={UpdatedPayload.priority !== "" ? "16px" : "13px"}
                  borderColor="#6B7280"
                  id="priority"
                  value={UpdatedPayload.priority}
                  onChange={handleUpdatedPayload}
                  placeholder="Select Priority"
                >
                  {Settings?.priority?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>

                <Input
                  isDisabled={true}
                  leftIcon={<FaNoteSticky />}
                  val={UpdatedPayload.reasonforreferral !== "" ? true : false}
                  label="Reason For Referral"
                  type="text"
                  value={UpdatedPayload.reasonforreferral}
                  onChange={handleUpdatedPayload}
                  id="reasonforreferral"
                />
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Presenting Complaints
              </Text>

              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                {showCustomComplaint ? (
                  <Input
                    isDisabled={true}
                    leftIcon={<FaNoteSticky />}
                    val={customComplaint !== "" ? true : false}
                    label="Specify Presenting Complaint"
                    type="text"
                    value={customComplaint}
                    id="customComplaint"
                  />
                ) : (
                  <Select
                    isDisabled={true}
                    h="45px"
                    borderWidth="2px"
                    fontSize={
                      UpdatedPayload.presentingcomplaints !== ""
                        ? "16px"
                        : "13px"
                    }
                    borderColor="#6B7280"
                    id="presentingcomplaints"
                    value={UpdatedPayload.presentingcomplaints}
                    onChange={handleUpdatedPayload}
                    placeholder="Select Presenting Complaints"
                  >
                    {Settings?.presentingcomplaints?.map((item, i) => (
                      <option value={`${item}`} key={i}>
                        {item}
                      </option>
                    ))}
                    <option value="Others">Others</option>
                  </Select>
                )}

                <Input
                  isDisabled={true}
                  leftIcon={<FaNoteSticky />}
                  val={
                    UpdatedPayload.presentingcomplaintsnotes !== ""
                      ? true
                      : false
                  }
                  label="Presenting Complaints Notes"
                  type="text"
                  value={UpdatedPayload.presentingcomplaintsnotes}
                  onChange={handleUpdatedPayload}
                  id="presentingcomplaintsnotes"
                />
                <Input
                  isDisabled={true}
                  leftIcon={<FaNoteSticky />}
                  val={UpdatedPayload.additionalnotes !== "" ? true : false}
                  label="Additional Notes"
                  type="text"
                  value={UpdatedPayload.additionalnotes}
                  onChange={handleUpdatedPayload}
                  id="additionalnotes"
                />
                <Input
                  isDisabled={true}
                  leftIcon={<FaNoteSticky />}
                  val={UpdatedPayload.salienthistory !== "" ? true : false}
                  label="Salient History"
                  type="text"
                  value={UpdatedPayload.salienthistory}
                  onChange={handleUpdatedPayload}
                  id="salienthistory"
                />
                <Input
                  isDisabled={true}
                  leftIcon={<FaNoteSticky />}
                  val={
                    UpdatedPayload.findingsonexamination !== "" ? true : false
                  }
                  label="Findings On Examination"
                  type="text"
                  value={UpdatedPayload.findingsonexamination}
                  onChange={handleUpdatedPayload}
                  id="findingsonexamination"
                />
                <Input
                  isDisabled={true}
                  leftIcon={<FaNoteSticky />}
                  val={
                    UpdatedPayload.investigationdoneifany !== "" ? true : false
                  }
                  label="Investigation Done, If Any"
                  type="text"
                  value={UpdatedPayload.investigationdoneifany}
                  onChange={handleUpdatedPayload}
                  id="investigationdoneifany"
                />
                <Input
                  isDisabled={true}
                  leftIcon={<FaNoteSticky />}
                  val={UpdatedPayload.laboratoryfindings !== "" ? true : false}
                  label="Laboratory Findings"
                  type="text"
                  value={UpdatedPayload.laboratoryfindings}
                  onChange={handleUpdatedPayload}
                  id="laboratoryfindings"
                />
                <Input
                  isDisabled={true}
                  leftIcon={<FaNoteSticky />}
                  val={
                    UpdatedPayload.requiredinputintervention !== ""
                      ? true
                      : false
                  }
                  label="Required Input Intervention"
                  type="text"
                  value={UpdatedPayload.requiredinputintervention}
                  onChange={handleUpdatedPayload}
                  id="requiredinputintervention"
                />
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Diagnosis
              </Text>
              <Flex justifyContent={"flex-end"} mb="15px">
                <Button
                  w="150px"
                  rightIcon={<SlPlus />}
                  onClick={() =>
                    setUpdatedPayload({
                      ...UpdatedPayload,
                      diagnosis: [
                        ...UpdatedPayload.diagnosis,
                        {
                          note: "",
                          diagnosis: "",
                        },
                      ],
                    })
                  }
                >
                  Add Diagnosis
                </Button>
              </Flex>

              {UpdatedPayload.diagnosis?.map((item, i) => (
                <ReferralDiagnosisCard
                  disable={true}
                  data={item}
                  oldItem={UpdatedPayload.diagnosis}
                  Payload={UpdatedPayload}
                  setPayload={setUpdatedPayload}
                  key={i}
                  i={i}
                />
              ))}
            </>
          )}
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
