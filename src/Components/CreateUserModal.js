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
  FormLabel,
  Select,
  useDisclosure,
  Divider,
  Box, // For displaying the message
} from "@chakra-ui/react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUserTie,
  FaBirthdayCake,
  FaMapMarkerAlt,
  FaGlobe,
  FaGraduationCap,
  FaBook,
  FaLanguage,
  FaBriefcase,
  FaTimes,
  FaCalendarAlt,
  FaIdCard,
  FaPlus,
} from "react-icons/fa";
import Input from "./Input";
import Button from "./Button";
import { AddUserApi, SettingsApi, UpdateUserApi } from "../Utils/ApiCalls";

import ShowToast from "./ToastNotification";

export default function CreateUserModal({
  isOpen,
  onClose,
  type,
  filteredUser,
}) {

  const [userData, setUserData] = useState({
    title: "",
    staffId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    country: "",
    state: "",
    city: "",
    address: "",
    age: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    role: "",
    degree: "",
    profession: "",
    employmentStatus: "",
    nativeSpokenLanguage: "",
    otherLanguage: "",
    readWriteLanguage: "",
    zip: "",
    specializationDetails: "",
  });

  const [UpdatedPayload, setUpdatedPayload] = useState({
    title: "",
    staffId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    country: "",
    state: "",
    city: "",
    address: "",
    age: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    role: "",
    degree: "",
    profession: "",
    employmentStatus: "",
    nativeSpokenLanguage: "",
    otherLanguage: "",
    readWriteLanguage: "",
    zip: "",
    specializationDetails: "",
    clinic: "",
    licence: "",
    phoneNumber: "",
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
      setUserData({
        title: "",
        staffId: "",
        firstName: "",
        middleName: "",
        lastName: "",
        country: "",
        state: "",
        city: "",
        address: "",
        age: "",
        dateOfBirth: "",
        gender: "",
        email: "",
        role: "",
        degree: "",
        profession: "",
        employmentStatus: "",
        nativeSpokenLanguage: "",
        otherLanguage: "",
        readWriteLanguage: "",
        zip: "",
        specializationDetails: "",
      });
      setMessage(""); // Reset message on close
      setMessageStatus(""); // Reset message status on close
    }
    setUpdatedPayload({
      title: filteredUser[0]?.title,
      staffId: filteredUser[0]?.staffId,
      firstName: filteredUser[0]?.firstName,
      middleName: filteredUser[0]?.middleName,
      lastName: filteredUser[0]?.lastName,
      country: filteredUser[0]?.country,
      state: filteredUser[0]?.state,
      city: filteredUser[0]?.city,
      address: filteredUser[0]?.address,
      age: filteredUser[0]?.age,
      dateOfBirth: filteredUser[0]?.dateOfBirth,
      gender: filteredUser[0]?.gender,
      email: filteredUser[0]?.email,
      role: filteredUser[0]?.role,
      degree: filteredUser[0]?.degree,
      profession: filteredUser[0]?.profession,
      employmentStatus: filteredUser[0]?.employmentStatus,
      nativeSpokenLanguage: filteredUser[0]?.nativeSpokenLanguage,
      otherLanguage: filteredUser[0]?.otherLanguage,
      readWriteLanguage: filteredUser[0]?.readWriteLanguage,
      zip: filteredUser[0]?.zip,
      specializationDetails: filteredUser[0]?.specializationDetails,
      clinic: filteredUser[0]?.clinic,
      licence: filteredUser[0]?.licence,
      phoneNumber: filteredUser[0]?.phoneNumber,
    });
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

    // Check if any field in userData is empty
    // for (let key in userData) {
    //   if (userData[key] === "") {
    //     // If any field is empty, show an alert and stop the form submission
    //     alert("Please fill out all the fields.");
    //     setLoading(false);
    //     return;
    //   }
    // }

    try {
      const response = await AddUserApi(userData);

      setMessage("User added successfully!");
      setMessageStatus("success");
      onClose(); // Close the modal after success
    } catch (err) {
      let errorMessage = "Something went wrong!";

      if (err && err.response && err.response.data && err.response.data.msg) {
        errorMessage = err.response.data.msg;
      } else if (err && err.message) {
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

    // Check if any field in userData is empty
   
    try {
      const response = await UpdateUserApi(
        UpdatedPayload,
        filteredUser[0]?._id
      );

      setMessage("User added successfully!");
      setMessageStatus("success");
      onClose(); // Close the modal after success
    } catch (err) {
      let errorMessage = "Something went wrong!";

      if (err && err.response && err.response.data && err.response.data.msg) {
        errorMessage = err.response.data.msg;
      } else if (err && err.message) {
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
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent
          maxW={["95%", "80%"]}
          p={4}
          borderRadius="lg"
          boxShadow="lg"
          maxH="80vh"
          overflowY="auto"
        >
          <ModalHeader
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text fontSize="xl" fontWeight="bold" color="blue.blue500">
              {type === "new" ? "Add New User" : "Edit User"}
            </Text>
            <ModalCloseButton
              onClick={() => {
                onClose();
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
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Input
                    id="firstName"
                    label="First Name"
                    value={userData.firstName}
                    onChange={handleInputChange}
                    name="firstName"
                    placeholder="Enter First Name"
                    leftIcon={<FaUser />}
                  />
                  <Input
                    id="middleName"
                    label="Middle Name"
                    value={userData.middleName}
                    onChange={handleInputChange}
                    name="middleName"
                    placeholder="Enter Middle Name"
                    leftIcon={<FaUser />}
                  />
                  <Input
                    id="lastName"
                    label="Last Name"
                    value={userData.lastName}
                    onChange={handleInputChange}
                    name="lastName"
                    placeholder="Enter Last Name"
                    leftIcon={<FaUser />}
                  />
                  <Input
                    id="age"
                    label="Age"
                    value={userData.age}
                    onChange={handleInputChange}
                    name="age"
                    type="number"
                    placeholder="Enter your age"
                    leftIcon={<FaCalendarAlt />}
                  />
                  <Input
                    id="email"
                    label="Email"
                    value={userData.email}
                    onChange={handleInputChange}
                    name="email"
                    type="email"
                    placeholder="Enter Email"
                    leftIcon={<FaEnvelope />}
                  />
                  <Input
                    id="dateOfBirth"
                    label="Date of Birth"
                    value={userData.dateOfBirth}
                    onChange={handleInputChange}
                    name="dateOfBirth"
                    type="date"
                    placeholder="Enter Date of Birth"
                    leftIcon={<FaBirthdayCake />}
                  />
                  <FormControl>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      name="gender"
                      value={userData.gender}
                      onChange={handleInputChange}
                      placeholder="Select Gender"
                      border="2px solid"
                      borderColor="gray.500"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Title</FormLabel>
                    <Select
                      name="title"
                      value={userData.title}
                      onChange={handleInputChange}
                      placeholder="Select Title"
                      border="2px solid"
                      borderColor="gray.500"
                    >
                      <option value="Mr">Mr</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Miss">Miss</option>
                      <option value="Dr">Dr</option>
                      <option value="Prof">Prof</option>
                      <option value="Prof">Mallam</option>
                      <option value="Prof">Alhaji </option>
                      <option value="Prof">Hajiya </option>
                    </Select>
                  </FormControl>
                </SimpleGrid>
                <Divider my={4} />
                {/* Job Information Section */}
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  color="blue.blue500"
                  mb={2}
                >
                  Job Information
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Input
                    id="staffId"
                    label="Staff ID"
                    value={userData.staffId}
                    onChange={handleInputChange}
                    name="staffId"
                    placeholder="Enter Staff ID"
                    leftIcon={<FaUserTie />}
                  />

                  <Select
                    name="clinic"
                    value={userData.clinic}
                    onChange={handleInputChange}
                    placeholder="Select Clinic/Department/Pharmacy"
                    border="2px solid"
                    borderColor="gray.500"
                  >
                    {Settings?.clinics?.map((item, i) => (
                      <option value={item.clinic} key={i}>
                        {item.clinic}
                      </option>
                    ))}
                  </Select>
                  <FormControl>
                    <FormLabel>Role</FormLabel>
                    <Select
                      name="role"
                      value={userData.role}
                      onChange={handleInputChange}
                      placeholder="Select Role"
                      border="2px solid"
                      borderColor="gray.500"
                    >
                      {Settings?.roles?.map((item, i) => (
                        <option value={item.role} key={i}>
                          {item.role}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Employment Status</FormLabel>
                    <Select
                      name="employmentStatus"
                      value={userData.employmentStatus}
                      onChange={handleInputChange}
                      placeholder="Select Employment Status"
                      border="2px solid"
                      borderColor="gray.500"
                    >
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="intern">Intern</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>
                <Divider my={4} />
                {/* Educational Information Section */}
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  color="blue.blue500"
                  mb={2}
                >
                  Educational Information
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Input
                    id="degree"
                    label="Degree"
                    value={userData.degree}
                    onChange={handleInputChange}
                    name="degree"
                    placeholder="Enter Degree"
                    leftIcon={<FaGraduationCap />}
                  />
                  <Input
                    id="profession"
                    label="Profession"
                    value={userData.profession}
                    onChange={handleInputChange}
                    name="profession"
                    placeholder="Enter Profession"
                    leftIcon={<FaBook />}
                  />
                  {/* License Input */}
                  <Input
                    id="licence"
                    label="Licence"
                    value={userData.license}
                    onChange={handleInputChange}
                    name="licence"
                    placeholder="Enter Licence"
                    leftIcon={<FaIdCard />}
                  />
                </SimpleGrid>
                <Divider my={4} />
                {/* Language Section */}
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  color="blue.blue500"
                  mb={2}
                >
                  Languages
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Input
                    id="nativeSpokenLanguage"
                    label="Native Spoken Language"
                    value={userData.nativeSpokenLanguage}
                    onChange={handleInputChange}
                    name="nativeSpokenLanguage"
                    placeholder="Enter Native Language"
                    leftIcon={<FaLanguage />}
                  />
                  <Input
                    id="otherLanguage"
                    label="Other Language"
                    value={userData.otherLanguage}
                    onChange={handleInputChange}
                    name="otherLanguage"
                    placeholder="Enter Other Language"
                    leftIcon={<FaLanguage />}
                  />
                  <Input
                    id="readWriteLanguage"
                    label="Read/Write Language"
                    value={userData.readWriteLanguage}
                    onChange={handleInputChange}
                    name="readWriteLanguage"
                    placeholder="Enter Read/Write Language"
                    leftIcon={<FaBook />}
                  />
                </SimpleGrid>
                <Divider my={4} />
                {/* Contact Information Section */}
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  color="blue.blue500"
                  mb={2}
                >
                  Contact Information
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Input
                    id="country"
                    label="Country"
                    value={userData.country}
                    onChange={handleInputChange}
                    name="country"
                    placeholder="Enter Country"
                    leftIcon={<FaGlobe />}
                  />
                  <Input
                    id="city"
                    label="City"
                    value={userData.city}
                    onChange={handleInputChange}
                    name="city"
                    placeholder="Enter City"
                    leftIcon={<FaMapMarkerAlt />}
                  />
                  <Input
                    id="state"
                    label="State"
                    value={userData.state}
                    onChange={handleInputChange}
                    name="state"
                    placeholder="Enter State"
                    leftIcon={<FaMapMarkerAlt />}
                  />
                  <Input
                    id="address"
                    label="Address"
                    value={userData.address}
                    onChange={handleInputChange}
                    name="address"
                    placeholder="Enter Address"
                    leftIcon={<FaMapMarkerAlt />}
                  />
                  <Input
                    id="zip"
                    label="ZIP Code"
                    value={userData.zip}
                    onChange={handleInputChange}
                    name="zip"
                    placeholder="Enter ZIP Code"
                    type="number"
                    leftIcon={<FaMapMarkerAlt />}
                  />
                  <Input
                    id="phoneNumber"
                    label="Phone Number"
                    value={userData.phoneNumber}
                    onChange={handleInputChange}
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    type="number"
                    leftIcon={<FaPhone />}
                  />
                </SimpleGrid>
                <Divider my={4} />
                {/* Specialization */}
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  color="blue.blue500"
                  mb={2}
                >
                  Specialization
                </Text>
                <Input
                  id="specializationDetails"
                  label="Specialization Details"
                  value={userData.specializationDetails}
                  onChange={handleInputChange}
                  name="specializationDetails"
                  placeholder="Enter Specialization"
                  leftIcon={<FaBriefcase />}
                />

                <Button mt="32px" isLoading={loading} disable={userData.email !=="" && userData.firstName && userData.email !=="" && userData.staffId !=="" && userData.role !==""
                && userData.gender !=="" ? false: true
                 } onClick={handleSubmit}>
                  Create User
                </Button>
              </Box>
            ) : (
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
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
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
                    <FormLabel>Gender</FormLabel>
                    <Select
                      name="gender"
                      value={UpdatedPayload.gender}
                      onChange={handleUpdatedPayload}
                      placeholder="Select Gender"
                      border="2px solid"
                      borderColor="gray.500"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Title</FormLabel>
                    <Select
                      name="title"
                      value={UpdatedPayload.title}
                      onChange={handleUpdatedPayload}
                      placeholder="Select Title"
                      border="2px solid"
                      borderColor="gray.500"
                    >
                      <option value="Mr">Mr</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Miss">Miss</option>
                      <option value="Dr">Dr</option>
                      <option value="Prof">Prof</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>
                <Divider my={4} />
                {/* Job Information Section */}
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  color="blue.blue500"
                  mb={2}
                >
                  Job Information
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Input
                    id="staffId"
                    label="Staff ID"
                    value={UpdatedPayload.staffId}
                    onChange={handleUpdatedPayload}
                    name="staffId"
                    placeholder="Enter Staff ID"
                    leftIcon={<FaUserTie />}
                  />

                  <Select
                    name="clinic"
                    value={UpdatedPayload.clinic}
                    onChange={handleUpdatedPayload}
                    placeholder="Select Clinic"
                    border="2px solid"
                    borderColor="gray.500"
                  >
                    {Settings?.clinics?.map((item, i) => (
                      <option value={item.clinic} key={i}>
                        {item.clinic}
                      </option>
                    ))}
                  </Select>
                  <FormControl>
                    <FormLabel>Role</FormLabel>
                    <Select
                      name="role"
                      value={UpdatedPayload.role}
                      onChange={handleUpdatedPayload}
                      placeholder="Select Role"
                      border="2px solid"
                      borderColor="gray.500"
                    >
                      {Settings?.roles?.map((item, i) => (
                        <option value={item.role} key={i}>
                          {item.role}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Employment Status</FormLabel>
                    <Select
                      name="employmentStatus"
                      value={UpdatedPayload.employmentStatus}
                      onChange={handleUpdatedPayload}
                      placeholder="Select Employment Status"
                      border="2px solid"
                      borderColor="gray.500"
                    >
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="intern">Intern</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>
                <Divider my={4} />
                {/* Educational Information Section */}
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  color="blue.blue500"
                  mb={2}
                >
                  Educational Information
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Input
                    id="degree"
                    label="Degree"
                    value={UpdatedPayload.degree}
                    onChange={handleUpdatedPayload}
                    name="degree"
                    placeholder="Enter Degree"
                    leftIcon={<FaGraduationCap />}
                  />
                  <Input
                    id="profession"
                    label="Profession"
                    value={UpdatedPayload.profession}
                    onChange={handleUpdatedPayload}
                    name="profession"
                    placeholder="Enter Profession"
                    leftIcon={<FaBook />}
                  />
                  {/* License Input */}
                  <Input
                    id="licence"
                    label="Licence"
                    value={UpdatedPayload.license}
                    onChange={handleUpdatedPayload}
                    name="licence"
                    placeholder="Enter Licence"
                    leftIcon={<FaIdCard />}
                  />
                </SimpleGrid>
                <Divider my={4} />
                {/* Language Section */}
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  color="blue.blue500"
                  mb={2}
                >
                  Languages
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Input
                    id="nativeSpokenLanguage"
                    label="Native Spoken Language"
                    value={UpdatedPayload.nativeSpokenLanguage}
                    onChange={handleUpdatedPayload}
                    name="nativeSpokenLanguage"
                    placeholder="Enter Native Language"
                    leftIcon={<FaLanguage />}
                  />
                  <Input
                    id="otherLanguage"
                    label="Other Language"
                    value={UpdatedPayload.otherLanguage}
                    onChange={handleUpdatedPayload}
                    name="otherLanguage"
                    placeholder="Enter Other Language"
                    leftIcon={<FaLanguage />}
                  />
                  <Input
                    id="readWriteLanguage"
                    label="Read/Write Language"
                    value={UpdatedPayload.readWriteLanguage}
                    onChange={handleUpdatedPayload}
                    name="readWriteLanguage"
                    placeholder="Enter Read/Write Language"
                    leftIcon={<FaBook />}
                  />
                </SimpleGrid>
                <Divider my={4} />
                {/* Contact Information Section */}
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  color="blue.blue500"
                  mb={2}
                >
                  Contact Information
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Input
                    id="country"
                    label="Country"
                    value={UpdatedPayload.country}
                    onChange={handleUpdatedPayload}
                    name="country"
                    placeholder="Enter Country"
                    leftIcon={<FaGlobe />}
                  />
                  <Input
                    id="city"
                    label="City"
                    value={UpdatedPayload.city}
                    onChange={handleUpdatedPayload}
                    name="city"
                    placeholder="Enter City"
                    leftIcon={<FaMapMarkerAlt />}
                  />
                  <Input
                    id="state"
                    label="State"
                    value={UpdatedPayload.state}
                    onChange={handleUpdatedPayload}
                    name="state"
                    placeholder="Enter State"
                    leftIcon={<FaMapMarkerAlt />}
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
                  <Input
                    id="zip"
                    label="ZIP Code"
                    value={UpdatedPayload.zip}
                    onChange={handleUpdatedPayload}
                    name="zip"
                    placeholder="Enter ZIP Code"
                    type="number"
                    leftIcon={<FaMapMarkerAlt />}
                  />
                  <Input
                    id="phoneNumber"
                    label="Phone Number"
                    value={UpdatedPayload.phoneNumber}
                    onChange={handleUpdatedPayload}
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    type="number"
                    leftIcon={<FaPhone />}
                  />
                </SimpleGrid>
                <Divider my={4} />
                {/* Specialization */}
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  color="blue.blue500"
                  mb={2}
                >
                  Specialization
                </Text>
                <Input
                  id="specializationDetails"
                  label="Specialization Details"
                  value={UpdatedPayload.specializationDetails}
                  onChange={handleUpdatedPayload}
                  name="specializationDetails"
                  placeholder="Enter Specialization"
                  leftIcon={<FaBriefcase />}
                />

                <Button mt="32px" isLoading={loading} onClick={handleUpdate}>
                  Update User
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
