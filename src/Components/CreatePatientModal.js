import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  SimpleGrid,
  Text,
  FormControl,
  Select,
  Divider,
  Box, // For displaying the message
} from "@chakra-ui/react";
import { Checkbox, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { FaIdBadge, FaPhone } from "react-icons/fa";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaBirthdayCake,
  FaMapMarkerAlt,
  FaGlobe,
  FaCalendarAlt,
  FaWheelchair,
  FaHeart,
  FaUserFriends,
  FaMedkit,
  FaIdCardAlt,
} from "react-icons/fa";
import { RiStickyNoteFill } from "react-icons/ri";
import Input from "./Input";
import Button from "./Button";
import {
  AddPatientApi,
  SettingsApi,
  UpdatePatientApi,
  getAllStates,
  getLGAsForState,
  GetOnlyClinicApi,
} from "../Utils/ApiCalls";

import ShowToast from "./ToastNotification";

export default function CreatePatientModal({
  isOpen,
  onClose,
  type,
  filteredpatient,
}) {
  const [states, setStates] = useState([]); // To hold all states
  const [lgas, setLgas] = useState([]); // To hold LGAs for the selected state
  const [selectedState, setSelectedState] = useState(""); // The selected state
  const [selectedLga, setSelectedLga] = useState(""); // The selected LGA
  const [ClinicData, setClinicData] = useState([]);

  // Fetch states on component mount
  useEffect(() => {
    const getStates = async () => {
      const statesData = await getAllStates();
      setStates(statesData);
    };

    getStates();
  }, []);

  // Fetch LGAs when a state is selected
  useEffect(() => {
    const getLgas = async () => {
      if (selectedState) {
        const lgasData = await getLGAsForState(selectedState);
        setLgas(lgasData);
      }
    };

    getLgas();
  }, [selectedState]);

  const handleStateChange = (event) => {
    const selected = event.target.value;
    setSelectedState(selected);
    if (selected === "Others") {
      setSelectedLga("Others");
      setPatientData((prev) => ({
        ...prev,
        stateOfResidence: selected,
        LGA: "Others",
      }));
    } else {
      setSelectedLga(""); // Reset LGA if state is not "Others"
      setPatientData((prev) => ({
        ...prev,
        stateOfResidence: selected,
        LGA: "",
      }));
    }
  };

  // Handle LGA change
  const handleLgaChange = (event) => {
    setSelectedLga(event.target.value);
    setPatientData({ ...patientData, LGA: event.target.value });
  };

  const getAllClinic = async () => {
    try {
      const result = await GetOnlyClinicApi();
      setClinicData(result.queryresult.clinicdetails);
    } catch (e) {
      // activateNotifications(e.message, "error");
    }
  };
  useEffect(() => {
    getAllClinic();
  }, []);

  const [patientData, setPatientData] = useState({
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    country: "",
    stateOfResidence: "",
    LGA: "",
    address: "",
    age: "",
    dateOfBirth: "",
    gender: "",
    nin: "",
    phoneNumber: "",
    email: "",
    oldMRN: "",
    nextOfKinName: "",
    nextOfKinRelationship: "",
    nextOfKinPhoneNumber: "",
    authorizationcode: "",
    nextOfKinAddress: "",
    maritalStatus: "",
    disability: "",
    occupation: "",
    isHMOCover: "",
    HMOName: "",
    HMOId: "",
    HMOPlan: "",
    clinic: "",
    reason: "",
    appointmentdate: "",

    // New fields
    policecase: false,
    physicalassault: false,
    sexualassault: false,
    policaename: "",
    servicenumber: "",
    policephonenumber: "",
    facilitypateintreferedfrom: "",
  });

  const [UpdatedPayload, setUpdatedPayload] = useState({
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    country: "",
    stateOfResidence: "",
    LGA: "",
    address: "",
    age: "",
    dateOfBirth: "",
    gender: "",
    nin: "",
    phoneNumber: "",
    email: "",
    oldMRN: "",
    nextOfKinName: "",
    nextOfKinRelationship: "",
    nextOfKinPhoneNumber: "",
    nextOfKinAddress: "",
    maritalStatus: "",
    disability: "",
    occupation: "",
    isHMOCover: "",
    HMOName: "",
    HMOId: "",
    HMOPlan: "",
    MRN: "",
    // New fields
    policecase: false,
    physicalassault: false,
    sexualassault: false,
    policaename: "",
    servicenumber: "",
    policephonenumber: "",
    facilitypateintreferedfrom: "",
  });

  const [Settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // State for the message
  const [messageStatus, setMessageStatus] = useState(""); // State for message status (success/error)

  const getSettings = async () => {
    try {
      const result = await SettingsApi();

      setSettings(result);
    } catch (e) {}
  };

  useEffect(() => {
    getSettings();
    if (!isOpen) {
      setPatientData({
        title: "",
        firstName: "",
        middleName: "",
        lastName: "",
        country: "",
        stateOfResidence: "",
        LGA: "",
        address: "",
        age: "",
        dateOfBirth: "",
        gender: "",
        nin: "",
        phoneNumber: "",
        email: "",
        oldMRN: "",
        nextOfKinName: "",
        nextOfKinRelationship: "",
        nextOfKinPhoneNumber: "",
        nextOfKinAddress: "",
        maritalStatus: "",
        disability: "",
        occupation: "",
        isHMOCover: "",
        HMOName: "",
        HMOId: "",
        HMOPlan: "",
        clinic: "",
        reason: "",
        appointmentdate: "",

        physicalassault: false,
        sexualassault: false,
        policeaname: "",
        servicenumber: "",
        policephonenumber: "",
        facilitypateintreferedfrom: "",
      });
      setMessage(""); // Reset message on close
      setMessageStatus(""); // Reset message status on close
    }

    console.log("filteredpatient", filteredpatient);
    setUpdatedPayload({
      title: filteredpatient[0]?.title,
      firstName: filteredpatient[0]?.firstName,
      middleName: filteredpatient[0]?.middleName,
      lastName: filteredpatient[0]?.lastName,
      country: filteredpatient[0]?.country,
      stateOfResidence: filteredpatient[0]?.stateOfResidence,
      LGA: filteredpatient[0]?.LGA,
      address: filteredpatient[0]?.address,
      age: filteredpatient[0]?.age,
      dateOfBirth: filteredpatient[0]?.dateOfBirth,
      gender: filteredpatient[0]?.gender,
      nin: filteredpatient[0]?.nin,
      phoneNumber: filteredpatient[0]?.phoneNumber,
      email: filteredpatient[0]?.email,
      oldMRN: filteredpatient[0]?.oldMRN,
      nextOfKinName: filteredpatient[0]?.nextOfKinName,
      nextOfKinRelationship: filteredpatient[0]?.nextOfKinRelationship,
      nextOfKinPhoneNumber: filteredpatient[0]?.nextOfKinPhoneNumber,
      nextOfKinAddress: filteredpatient[0]?.nextOfKinAddress,
      maritalStatus: filteredpatient[0]?.maritalStatus,
      disability: filteredpatient[0]?.disability,
      occupation: filteredpatient[0]?.occupation,
      isHMOCover: filteredpatient[0]?.isHMOCover,
      authorizationcode: filteredpatient[0]?.authorizationcode,
      HMOName: filteredpatient[0]?.HMOName,
      HMOId: filteredpatient[0]?.HMOId,
      HMOPlan: filteredpatient[0]?.HMOPlan,
      MRN: filteredpatient[0]?.MRN,
      physicalassault: filteredpatient[0]?.physicalassult,
      sexualassault: filteredpatient[0]?.sexualassult,
      policeaname: filteredpatient[0]?.policeaname,
      servicenumber: filteredpatient[0]?.servicenumber,
      policephonenumber: filteredpatient[0]?.policephonenumer,
      facilitypateintreferedfrom:
        filteredpatient[0]?.facilitypateintreferedfrom || "",
    });
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      // Remove any non-numeric characters
      const cleanedValue = value.replace(/\D/g, "");

      // Allow only 11 digits
      if (cleanedValue.length > 11) return;

      setPatientData((prev) => ({
        ...prev,
        [name]: cleanedValue,
      }));
    } else {
      setPatientData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleUpdatedPayload = (e) => {
    const { name, value } = e.target;
    setUpdatedPayload((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage(""); // Reset any previous message
    setMessageStatus("");

    // Required fields and their respective error messages
    const requiredFields = {
      firstName: "First Name is required.",
      lastName: "Last Name is required.",
      gender: "Gender is required.",
      phoneNumber: "Phone Number is required.",
    };

    // Validate required fields
    for (let field in requiredFields) {
      if (!patientData[field] || patientData[field].trim() === "") {
        setMessage(requiredFields[field]); // Set the specific error message
        setMessageStatus("error");
        setLoading(false);
        return; // Stop validation and show the first error
      }
    }

    try {
      const response = await AddPatientApi(patientData);

      setMessage("Patient added successfully!");
      setMessageStatus("success");
      onClose(); // Close the modal after success
    } catch (err) {
      let errorMessage = "Something went wrong!";

      if (err?.response?.data?.msg) {
        errorMessage = err.response.data.msg;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      setMessage(errorMessage);
      setMessageStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    setMessage(""); // Reset any previous message
    setMessageStatus("");

    // Required fields and their respective error messages
    const requiredFields = {
      firstName: "First Name is required.",
      lastName: "Last Name is required.",
      gender: "Gender is required.",

      //email: "Email is required.",
    };

    // Validate required fields
    for (let field in requiredFields) {
      if (!UpdatedPayload[field] || UpdatedPayload[field].trim() === "") {
        setMessage(requiredFields[field]);
        setMessageStatus("error");
        setLoading(false);
        return;
      }
    }

    try {
      const response = await UpdatePatientApi(
        UpdatedPayload,
        filteredpatient[0]?._id
      );

      setMessage("Patient updated successfully!");
      setMessageStatus("success");
      onClose(); // Close the modal after success
    } catch (err) {
      let errorMessage = "Something went wrong!";

      if (err?.response?.data?.msg) {
        errorMessage = err.response.data.msg;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      setMessage(errorMessage);
      setMessageStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          maxW={["95%", "80%"]}
          p={4}
          borderRadius="md"
          boxShadow="md"
          maxH="80vh"
          overflowY="auto"
        >
          <ModalHeader
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text fontSize="xl" fontWeight="bold" color="blue.blue500">
              {type === "new" ? "Add New patient" : "Edit patient"}
            </Text>
            <ModalCloseButton
              onClick={() => {
                onClose();
                setPatientData({
                  title: "",
                  firstName: "",
                  middleName: "",
                  lastName: "",
                  country: "",
                  stateOfResidence: "",
                  LGA: "",
                  address: "",
                  age: "",
                  dateOfBirth: "",
                  gender: "",
                  nin: "",
                  phoneNumber: "",
                  email: "",
                  oldMRN: "",
                  nextOfKinName: "",
                  nextOfKinRelationship: "",
                  nextOfKinPhoneNumber: "",
                  nextOfKinAddress: "",
                  maritalStatus: "",
                  disability: "",
                  occupation: "",
                  isHMOCover: "",
                  HMOName: "",
                  HMOId: "",
                  HMOPlan: "",
                  physicalassault: false,
                  sexualassault: false,
                  policaename: "",
                  servicenumber: "",
                  policephonenumber: "",
                  facilitypateintreferedfrom: "",
                });
              }}
            />
          </ModalHeader>

          <ModalBody pb={6} mt={2}>
            {type === "new" ? (
              <Box>
                {/* Personal Information Section */}
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  color="blue.blue500"
                  mb={2}
                >
                  Personal Information
                </Text>

                <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                  <FormControl>
                    <Select
                      h="45px"
                      borderWidth="2px"
                      borderColor="#6B7280"
                      name="title"
                      label="title"
                      value={patientData.title}
                      onChange={handleInputChange}
                      placeholder="Select Title"
                    >
                      <option value="Mr">Mr</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Miss">Miss</option>
                      <option value="Dr">Dr</option>
                      <option value="Prof">Prof</option>
                      <option value="Mallam">Mallam</option>
                      <option value="Alhaji">Alhaji </option>
                      <option value="Hajiya">Hajiya </option>
                    </Select>
                  </FormControl>
                  <Input
                    id="firstName"
                    label="First Name"
                    isRequired={true}
                    value={patientData.firstName}
                    onChange={handleInputChange}
                    name="firstName"
                    placeholder="Enter First Name"
                    leftIcon={<FaUser />}
                  />
                  <Input
                    id="middleName"
                    label="Middle Name"
                    value={patientData.middleName}
                    onChange={handleInputChange}
                    name="middleName"
                    placeholder="Enter Middle Name"
                    leftIcon={<FaUser />}
                  />
                  <Input
                    id="lastName"
                    label="Last Name"
                    isRequired={true}
                    value={patientData.lastName}
                    onChange={handleInputChange}
                    name="lastName"
                    placeholder="Enter Last Name"
                    leftIcon={<FaUser />}
                  />
                  <Input
                    id="age"
                    label="Age"
                    value={patientData.age}
                    onChange={handleInputChange}
                    name="age"
                    type="number"
                    placeholder="Enter your age"
                    leftIcon={<FaCalendarAlt />}
                  />
                  <Input
                    id="dateOfBirth"
                    label="Date of Birth"
                    value={patientData.dateOfBirth}
                    onChange={handleInputChange}
                    name="dateOfBirth"
                    type="date"
                    placeholder="Enter Date of Birth"
                    leftIcon={<FaBirthdayCake />}
                  />
                  <FormControl>
                    <Select
                      h="45px"
                      borderWidth="2px"
                      borderColor="#6B7280"
                      name="gender"
                      isRequired={true}
                      value={patientData.gender}
                      onChange={handleInputChange}
                      placeholder="Select Gender"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </Select>
                  </FormControl>
                  <Input
                    id="nin"
                    label="NIN"
                    value={patientData.nin}
                    onChange={handleInputChange}
                    name="nin"
                    type="text"
                    placeholder="Enter NIN"
                    leftIcon={<FaIdCardAlt />}
                  />
                </SimpleGrid>

                <Divider my={4} />
                {/* Contact Information Section */}
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  mb={2}
                  color="blue.blue500"
                >
                  Contact Information
                </Text>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <Input
                    id="phoneNumber"
                    label="Phone Number"
                    isRequired={true}
                    value={patientData.phoneNumber}
                    onChange={handleInputChange}
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    type="text"
                    maxLength={11}
                    leftIcon={<FaPhoneAlt />}
                  />

                  <Input
                    id="email"
                    label="Email"
                    value={patientData.email}
                    onChange={handleInputChange}
                    name="email"
                    type="email"
                    placeholder="Enter Email"
                    leftIcon={<FaEnvelope />}
                  />
                  <Input
                    id="address"
                    label="Address"
                    value={patientData.address}
                    onChange={handleInputChange}
                    name="address"
                    placeholder="Enter Address"
                    leftIcon={<FaMapMarkerAlt />}
                  />
                </SimpleGrid>

                <Divider my={4} />
                {/* Job Information Section */}
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  mb={2}
                  color="blue.blue500"
                >
                  Location Information
                </Text>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <FormControl>
                    <Select
                      h="45px"
                      borderWidth="2px"
                      borderColor="#6B7280"
                      name="country"
                      label="Country"
                      value={patientData.country}
                      onChange={handleInputChange}
                      placeholder="Select Country"
                    >
                      <option value="Nigeria">Nigeria</option>
                      <option value="Others">Others</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <Select
                      h="45px"
                      borderWidth="2px"
                      borderColor="#6B7280"
                      placeholder="Select State"
                      name="stateOfResidence"
                      value={selectedState}
                      onChange={handleStateChange}
                    >
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                      <option value="Others">Others</option>
                    </Select>
                  </FormControl>

                  {selectedState && (
                    <FormControl>
                      <Select
                        h="45px"
                        borderWidth="2px"
                        borderColor="#6B7280"
                        placeholder="Select LGA"
                        name="LGA"
                        value={selectedLga}
                        onChange={handleLgaChange}
                      >
                        {(Array.isArray(lgas) ? lgas : []).map((lga) => (
                          <option key={lga} value={lga}>
                            {lga}
                          </option>
                        ))}
                        <option value="Others">Others</option>
                      </Select>
                    </FormControl>
                  )}
                </SimpleGrid>
                {/* for scheduling patient */}
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  mb={5}
                  mt="5"
                  color="blue.blue500"
                >
                  Scheduling Information
                </Text>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <Input
                    type="datetime-local"
                    name="appointmentdate"
                    label="Appointment Date"
                    value={patientData.appointmentdate}
                    onChange={handleInputChange}
                    leftIcon={<FaCalendarAlt />}
                  />
                  <Input
                    name="reason"
                    label="Reason"
                    value={patientData.reason}
                    onChange={handleInputChange}
                    leftIcon={<RiStickyNoteFill />}
                  />

                  <FormControl>
                    <Select
                      name="clinic"
                      value={patientData.clinic}
                      onChange={handleInputChange}
                      placeholder="Select Clinic"
                      fontSize={patientData.clinic !== "" ? "16px" : "13px"}
                    >
                      {ClinicData?.map((item, i) => (
                        <option value={item.clinic}>{item.clinic}</option>
                      ))}
                    </Select>
                  </FormControl>
                  <Input
                    id="facilitypateintreferedfrom"
                    name="facilitypateintreferedfrom"
                    label="Facility Referred From"
                    value={patientData.facilitypateintreferedfrom}
                    onChange={handleInputChange}
                    placeholder="Enter referring facility"
                    leftIcon={<FaMedkit />}
                  />
                </SimpleGrid>

                <Divider my={4} />
                {/* Emergency Contact */}
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  mb={2}
                  color="blue.blue500"
                >
                  Next Of Kin Contact Information
                </Text>
                <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                  <Input
                    id="nextKinName"
                    label="Next of Kin"
                    value={patientData.nextOfKinName}
                    onChange={handleInputChange}
                    name="nextOfKinName"
                    placeholder="Enter Name"
                    leftIcon={<FaGlobe />}
                  />
                  <Input
                    id="nextKinRelationship"
                    label="Next of Kin Relationship"
                    value={patientData.nextOfKinRelationship}
                    onChange={handleInputChange}
                    name="nextOfKinRelationship"
                    placeholder="Relationship"
                    leftIcon={<FaHeart />}
                  />
                  <Input
                    id="nextKinPhone"
                    label="Next of Kin Phone"
                    value={patientData.nextOfKinPhoneNumber}
                    onChange={handleInputChange}
                    name="nextOfKinPhoneNumber"
                    placeholder="Phone Number"
                    leftIcon={<FaPhoneAlt />}
                  />

                  <Input
                    id="nextKinAddress"
                    label="Next of Kin Address"
                    value={patientData.nextOfKinAddress}
                    onChange={handleInputChange}
                    name="nextOfKinAddress"
                    placeholder="Next Of Address"
                    leftIcon={<FaMapMarkerAlt />}
                  />
                </SimpleGrid>

                <Divider my={4} />
                {/* Emergency Contact */}
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  mb={2}
                  color="blue.blue500"
                >
                  Social and Employment Information
                </Text>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <Input
                    id="maritalStatus"
                    label="Marital Status"
                    value={patientData.maritalStatus}
                    onChange={handleInputChange}
                    name="maritalStatus"
                    placeholder="Marital Status"
                    leftIcon={<FaGlobe />}
                  />
                  <Input
                    id="disability"
                    label="Disability (Optional)"
                    value={patientData.disability}
                    onChange={handleInputChange}
                    name="disability"
                    placeholder="Disability"
                    leftIcon={<FaWheelchair />}
                  />
                  <Input
                    id="occupation"
                    label="Occupation"
                    value={patientData.occupation}
                    onChange={handleInputChange}
                    name="occupation"
                    placeholder="Occupation"
                    leftIcon={<FaUserFriends />}
                  />
                </SimpleGrid>

                <Divider my={4} />
                {/* Medical Informatio */}
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  mb={2}
                  color="blue.blue500"
                >
                  Medical Information
                </Text>
                <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                  <Input
                    id="oldmrn"
                    label="Old MRN"
                    value={patientData.oldMRN}
                    onChange={handleInputChange}
                    name="oldMRN"
                    placeholder="Old MRN"
                    leftIcon={<FaMedkit />}
                  />
                </SimpleGrid>

                <Divider my={4} />
                {/* Medical Informatio */}
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  mb={2}
                  color="blue.blue500"
                >
                  Health Insurance Information
                </Text>
                <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                  <FormControl>
                    <Select
                      name="isHMOCover"
                      value={patientData.isHMOCover}
                      onChange={handleInputChange}
                      placeholder="Select HMO Option"
                      fontSize={patientData.isHMOCover !== "" ? "16px" : "13px"}
                    >
                      <option value={"Yes"}>Yes</option>
                      <option value={"No"}>No</option>
                    </Select>
                  </FormControl>

                  <Input
                    id="hnoName"
                    label="HMO Name"
                    value={patientData.HMOName}
                    onChange={handleInputChange}
                    name="HMOName"
                    placeholder="HMO Name"
                    leftIcon={<FaMedkit />}
                  />

                  <Input
                    id="hnoPlan"
                    label="HMO Plan"
                    value={patientData.HMOPlan}
                    onChange={handleInputChange}
                    name="HMOPlan"
                    placeholder="HMO Plan"
                    leftIcon={<FaMedkit />}
                  />

                  <Input
                    id="hnoID"
                    label="HMO ID"
                    value={patientData.HMOId}
                    onChange={handleInputChange}
                    name="HMOId"
                    leftIcon={<FaMedkit />}
                  />
                  <Input
                    id="authorizationcode"
                    label="Authorization Code"
                    value={patientData.authorizationcode}
                    onChange={handleInputChange}
                    name="authorizationcode"
                    leftIcon={<FaMedkit />}
                  />
                </SimpleGrid>
                {/* NEW: Police Report Information */}
                <Divider my={4} />
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  mb={2}
                  color="blue.blue500"
                >
                  Police Report Information
                </Text>
                <FormControl display="flex" alignItems="center">
                  <Checkbox
                    isChecked={patientData.policecase}
                    onChange={(e) =>
                      setPatientData((prev) => ({
                        ...prev,
                        policecase: e.target.checked,
                      }))
                    }
                  >
                    Police Case
                  </Checkbox>
                </FormControl>

                {patientData.policecase && (
                  <>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={4}>
                      <FormControl display="flex" alignItems="center">
                        <Checkbox
                          isChecked={patientData.physicalassault}
                          onChange={(e) =>
                            setPatientData((prev) => ({
                              ...prev,
                              physicalassault: e.target.checked,
                            }))
                          }
                        >
                          Physical Assault
                        </Checkbox>
                      </FormControl>
                      <FormControl display="flex" alignItems="center">
                        <Checkbox
                          isChecked={patientData.sexualassault}
                          onChange={(e) =>
                            setPatientData((prev) => ({
                              ...prev,
                              sexualassault: e.target.checked,
                            }))
                          }
                        >
                          Sexual Assault
                        </Checkbox>
                      </FormControl>
                    </SimpleGrid>

                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mt={4}>
                      <Input
                        id="policaename"
                        label="Police Name"
                        value={patientData.policaename}
                        onChange={handleInputChange}
                        name="policaename"
                        placeholder="Enter Police Name"
                        leftIcon={<FaUser />}
                      />
                      <Input
                        id="servicenumber"
                        label="Service Number"
                        value={patientData.servicenumber}
                        onChange={handleInputChange}
                        name="servicenumber"
                        placeholder="Enter Service Number"
                        leftIcon={<FaIdBadge />}
                      />
                      <Input
                        id="policephonenumber"
                        label="Police Phone Number"
                        value={patientData.policephonenumber}
                        onChange={handleInputChange}
                        name="policephonenumber"
                        placeholder="Enter Police Phone Number"
                        leftIcon={<FaPhone />}
                      />
                    </SimpleGrid>
                  </>
                )}

                <Button mt="32px" isLoading={loading} onClick={handleSubmit}>
                  Save
                </Button>
              </Box>
            ) : (
              // Update Patient Information
              <Box>
                {/* Personal Information Section */}
                <Text
                  fontSize="md"
                  fontWeight="bold="
                  mb={2}
                  color="blue.blue500"
                >
                  Personal Information
                </Text>

                <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                  <FormControl>
                    <Select
                      h="45px"
                      borderWidth="2px"
                      borderColor="#6B7280"
                      name="title"
                      label="title"
                      value={UpdatedPayload.title}
                      onChange={handleUpdatedPayload}
                      placeholder="Select Title"
                    >
                      <option value="Mr">Mr</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Miss">Miss</option>
                      <option value="Dr">Dr</option>
                      <option value="Prof">Prof</option>
                      <option value="Mallam">Mallam</option>
                      <option value="Alhaji">Alhaji </option>
                      <option value="Hajiya">Hajiya </option>
                    </Select>
                  </FormControl>
                  <Input
                    id="firstName"
                    label="First Name"
                    value={UpdatedPayload.firstName}
                    onChange={handleUpdatedPayload}
                    name="firstName"
                    placeholder="Enter First Name"
                    leftIcon={<FaUser />}
                  />
                  <Input
                    id="middleName"
                    label="Middle Name"
                    value={UpdatedPayload.middleName}
                    onChange={handleUpdatedPayload}
                    name="middleName"
                    placeholder="Enter Middle Name"
                    leftIcon={<FaUser />}
                  />
                  <Input
                    id="lastName"
                    label="Last Name"
                    value={UpdatedPayload.lastName}
                    onChange={handleUpdatedPayload}
                    name="lastName"
                    placeholder="Enter Last Name"
                    leftIcon={<FaUser />}
                  />
                  <Input
                    id="age"
                    label="Age"
                    value={UpdatedPayload.age}
                    onChange={handleUpdatedPayload}
                    name="age"
                    type="number"
                    placeholder="Enter your age"
                    leftIcon={<FaCalendarAlt />}
                  />
                  <Input
                    id="dateOfBirth"
                    label="Date of Birth"
                    value={UpdatedPayload.dateOfBirth}
                    onChange={handleUpdatedPayload}
                    name="dateOfBirth"
                    type="date"
                    placeholder="Enter Date of Birth"
                    leftIcon={<FaBirthdayCake />}
                  />
                  <FormControl>
                    <Select
                      h="45px"
                      borderWidth="2px"
                      borderColor="#6B7280"
                      name="gender"
                      value={UpdatedPayload.gender}
                      onChange={handleUpdatedPayload}
                      placeholder="Select Gender"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </Select>
                  </FormControl>
                  <Input
                    id="nin"
                    label="NIN"
                    value={UpdatedPayload.nin}
                    onChange={handleUpdatedPayload}
                    name="nin"
                    type="text"
                    placeholder="Enter NIN"
                    leftIcon={<FaIdCardAlt />}
                  />
                </SimpleGrid>

                <Divider my={4} />
                {/* Contact Information Section */}
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  mb={2}
                  color="blue.blue500"
                >
                  Contact Information
                </Text>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <Input
                    id="phoneNumber"
                    label="Phone Number"
                    value={UpdatedPayload.phoneNumber}
                    onChange={handleUpdatedPayload}
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    type="number"
                    leftIcon={<FaPhoneAlt />}
                  />
                  <Input
                    id="email"
                    label="Email"
                    value={UpdatedPayload.email}
                    onChange={handleUpdatedPayload}
                    name="email"
                    type="email"
                    placeholder="Enter Email"
                    leftIcon={<FaEnvelope />}
                  />
                  <Input
                    id="address"
                    label="Address"
                    value={UpdatedPayload.address}
                    onChange={handleUpdatedPayload}
                    name="address"
                    placeholder="Enter Address"
                    leftIcon={<FaMapMarkerAlt />}
                  />
                </SimpleGrid>

                <Divider my={4} />
                {/* Job Information Section */}
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  mb={2}
                  color="blue.blue500"
                >
                  Location Information
                </Text>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <FormControl>
                    <Select
                      h="45px"
                      borderWidth="2px"
                      borderColor="#6B7280"
                      name="country"
                      label="Country"
                      value={UpdatedPayload.country}
                      onChange={handleUpdatedPayload}
                      placeholder="Select Country"
                    >
                      <option value="Nigeria">Nigeria</option>
                      <option value="Others">Others</option>
                    </Select>
                  </FormControl>
                  <Input
                    id="stateOfResidence"
                    label="State of Residence"
                    value={UpdatedPayload.stateOfResidence}
                    onChange={handleUpdatedPayload}
                    name="stateOfResidence"
                    placeholder="Enter State of Residence"
                    leftIcon={<FaMapMarkerAlt />}
                  />
                  <Input
                    id="lga"
                    label="LGA"
                    value={UpdatedPayload.LGA}
                    onChange={handleUpdatedPayload}
                    name="LGA"
                    placeholder="Enter LGA"
                    leftIcon={<FaMapMarkerAlt />}
                  />
                </SimpleGrid>
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  mb={5}
                  mt="5"
                  color="blue.blue500"
                >
                  Scheduling Information
                </Text>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <Input
                    type="datetime-local"
                    name="appointmentdate"
                    label="Appointment Date"
                    value={UpdatedPayload.appointmentdate}
                    onChange={handleUpdatedPayload}
                    leftIcon={<FaCalendarAlt />}
                  />
                  <Input
                    name="reason"
                    label="Reason"
                    value={UpdatedPayload.reason}
                    onChange={handleUpdatedPayload}
                    leftIcon={<RiStickyNoteFill />}
                  />

                  <FormControl>
                    <Select
                      name="appointmentcategory"
                      value={UpdatedPayload.appointmentcategory}
                      onChange={handleUpdatedPayload}
                      placeholder="Select Appointment Category"
                      fontSize={
                        UpdatedPayload.appointmentcategory !== ""
                          ? "16px"
                          : "13px"
                      }
                    >
                      {Settings.servicecategory
                        ?.filter((item) => item.category === "Appointment")
                        .map((item, index) => (
                          <option key={index} value={item.category}>
                            {item.category}
                          </option>
                        ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <Select
                      name="appointmenttype"
                      value={UpdatedPayload.appointmenttype}
                      onChange={handleUpdatedPayload}
                      placeholder="Select Appointment Type"
                      fontSize={
                        UpdatedPayload.appointmenttype !== "" ? "16px" : "13px"
                      }
                    >
                      {Settings.servicecategory
                        ?.find(
                          (item) =>
                            item.category === UpdatedPayload.appointmentcategory
                        )
                        ?.type?.map((type, index) => (
                          <option key={index} value={type}>
                            {type}
                          </option>
                        ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <Select
                      name="clinic"
                      value={UpdatedPayload.clinic}
                      onChange={handleUpdatedPayload}
                      placeholder="Select Clinic"
                    >
                      {ClinicData?.map((item, i) => (
                        <option value={item.clinic}>{item.clinic}</option>
                      ))}
                    </Select>
                  </FormControl>
                  <Input
                    id="facilitypateintreferedfrom"
                    name="facilitypateintreferedfrom"
                    label="Facility Referred From"
                    value={UpdatedPayload.facilitypateintreferedfrom}
                    onChange={handleUpdatedPayload}
                    placeholder="Enter referring facility"
                    leftIcon={<FaMedkit />}
                  />
                </SimpleGrid>

                <Divider my={4} />
                {/* Emergency Contact */}
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  mb={2}
                  color="blue.blue500"
                >
                  Next Of Kin Contact Information
                </Text>
                <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                  <Input
                    id="nextKinName"
                    label="Next of Kin"
                    value={UpdatedPayload.nextOfKinName}
                    onChange={handleUpdatedPayload}
                    name="nextOfKinName"
                    placeholder="Enter Name"
                    leftIcon={<FaGlobe />}
                  />
                  <Input
                    id="nextKinRelationship"
                    label="Next of Kin Relationship"
                    value={UpdatedPayload.nextOfKinRelationship}
                    onChange={handleUpdatedPayload}
                    name="nextOfKinRelationship"
                    placeholder="Relationship"
                    leftIcon={<FaHeart />}
                  />
                  <Input
                    id="nextKinPhone"
                    label="Next of Kin Phone"
                    value={UpdatedPayload.nextOfKinPhoneNumber}
                    onChange={handleUpdatedPayload}
                    name="nextOfKinPhoneNumber"
                    placeholder="Phone Number"
                    leftIcon={<FaPhoneAlt />}
                  />

                  <Input
                    id="nextKinAddress"
                    label="Next of Kin Address"
                    value={UpdatedPayload.nextOfKinAddress}
                    onChange={handleUpdatedPayload}
                    name="nextOfKinAddress"
                    placeholder="Next Of Address"
                    leftIcon={<FaMapMarkerAlt />}
                  />
                </SimpleGrid>

                <Divider my={4} />
                {/* Emergency Contact */}
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  mb={2}
                  color="blue.blue500"
                >
                  Social and Employment Information
                </Text>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <Input
                    id="maritalStatus"
                    label="Marital Status"
                    value={UpdatedPayload.maritalStatus}
                    onChange={handleUpdatedPayload}
                    name="maritalStatus"
                    placeholder="Marital Status"
                    leftIcon={<FaGlobe />}
                  />
                  <Input
                    id="disability"
                    label="Disability (Optional)"
                    value={UpdatedPayload.disability}
                    onChange={handleUpdatedPayload}
                    name="disability"
                    placeholder="Disability"
                    leftIcon={<FaWheelchair />}
                  />
                  <Input
                    id="occupation"
                    label="Occupation"
                    value={UpdatedPayload.occupation}
                    onChange={handleUpdatedPayload}
                    name="occupation"
                    placeholder="Occupation"
                    leftIcon={<FaUserFriends />}
                  />
                </SimpleGrid>

                <Divider my={4} />
                {/* Medical Informatio */}
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  mb={2}
                  color="blue.blue500"
                >
                  Medical Information
                </Text>
                <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                  <Input
                    id="oldmrn"
                    label="Old MRN"
                    value={UpdatedPayload.oldMRN}
                    onChange={handleUpdatedPayload}
                    name="oldMRN"
                    placeholder="Old MRN"
                    leftIcon={<FaMedkit />}
                  />
                </SimpleGrid>

                <Divider my={4} />
                {/* Medical Informatio */}
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  mb={2}
                  color="blue.blue500"
                >
                  Health Insurance Information
                </Text>
                <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                  <FormControl>
                    <Select
                      isDisabled={true}
                      name="isHMOCover"
                      value={UpdatedPayload.isHMOCover}
                      onChange={handleUpdatedPayload}
                      placeholder="Select HMO Option"
                      fontSize={
                        UpdatedPayload.isHMOCover !== "" ? "16px" : "13px"
                      }
                    >
                      <option value={"Yes"}>Yes</option>
                      <option value={"No"}>No</option>
                    </Select>
                  </FormControl>

                  <Input
                    id="hnoName"
                    label="HMO Name"
                    value={UpdatedPayload.HMOName}
                    onChange={handleUpdatedPayload}
                    name="HMOName"
                    placeholder="HMO Name"
                    leftIcon={<FaMedkit />}
                  />

                  <Input
                    id="hnoPlan"
                    label="HMO Plan"
                    value={UpdatedPayload.HMOPlan}
                    onChange={handleUpdatedPayload}
                    name="HMOPlan"
                    placeholder="HMO Plan"
                    leftIcon={<FaMedkit />}
                  />

                  <Input
                    id="hnoID"
                    label="HMO ID"
                    value={UpdatedPayload.HMOId}
                    onChange={handleUpdatedPayload}
                    name="HMOId"
                    placeholder="Old"
                    leftIcon={<FaMedkit />}
                  />
                  <Input
                    id="authorizationcode"
                    label="Authorization Code"
                    value={UpdatedPayload.authorizationcode}
                    onChange={handleUpdatedPayload}
                    name="authorizationcode"
                    leftIcon={<FaMedkit />}
                  />
                </SimpleGrid>
                <Divider my={4} />
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  mb={2}
                  color="blue.blue500"
                >
                  Police Report Information
                </Text>
                <FormControl display="flex" alignItems="center">
                  <Checkbox
                    isChecked={UpdatedPayload.policecase}
                    onChange={(e) =>
                      setUpdatedPayload((prev) => ({
                        ...prev,
                        policecase: e.target.checked,
                      }))
                    }
                  >
                    Police Case
                  </Checkbox>
                </FormControl>

                {UpdatedPayload.policecase && (
                  <>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={4}>
                      <FormControl display="flex" alignItems="center">
                        <Checkbox
                          isChecked={UpdatedPayload.physicalassault}
                          onChange={(e) =>
                            setUpdatedPayload((prev) => ({
                              ...prev,
                              physicalassault: e.target.checked,
                            }))
                          }
                        >
                          Physical Assault
                        </Checkbox>
                      </FormControl>
                      <FormControl display="flex" alignItems="center">
                        <Checkbox
                          isChecked={UpdatedPayload.sexualassault}
                          onChange={(e) =>
                            setUpdatedPayload((prev) => ({
                              ...prev,
                              sexualassault: e.target.checked,
                            }))
                          }
                        >
                          Sexual Assault
                        </Checkbox>
                      </FormControl>
                    </SimpleGrid>

                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mt={4}>
                      <FormControl>
                        <Input
                          id="policaename"
                          label="Police Name"
                          value={UpdatedPayload.policaename}
                          onChange={handleUpdatedPayload}
                          name="policaename"
                          placeholder="Enter Police Name"
                          leftIcon={<FaUser />}
                        />
                      </FormControl>
                      <FormControl>
                        <Input
                          id="servicenumber"
                          label="Service Number"
                          value={UpdatedPayload.servicenumber}
                          onChange={handleUpdatedPayload}
                          name="servicenumber"
                          placeholder="Enter Service Number"
                          leftIcon={<FaIdBadge />}
                        />
                      </FormControl>
                      <FormControl>
                        <Input
                          id="policephonenumber"
                          label="Police Phone Number"
                          value={UpdatedPayload.policephonenumber}
                          onChange={handleUpdatedPayload}
                          name="policephonenumber"
                          placeholder="Enter Police Phone Number"
                          leftIcon={<FaPhone />}
                        />
                      </FormControl>
                    </SimpleGrid>
                  </>
                )}

                <Button mt="32px" isLoading={loading} onClick={handleUpdate}>
                  Update Patient
                </Button>
              </Box>
            )}

            {/* Message display (success/error) */}
            {message && (
              <Box
                mt={4}
                p={4}
                borderRadius="md"
                color={messageStatus === "success" ? "green.600" : "red.600"}
                borderWidth={1}
                borderColor={
                  messageStatus === "success" ? "green.400" : "red.400"
                }
                bg={messageStatus === "success" ? "green.50" : "red.50"}
              >
                <Text>{message}</Text>
              </Box>
            )}

            <ModalFooter></ModalFooter>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
