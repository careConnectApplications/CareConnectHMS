import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  SimpleGrid,
} from "@chakra-ui/react";
import { BsCalendar2DateFill } from "react-icons/bs";
import { FaClock } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { SlPlus } from "react-icons/sl";
import { BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import moment from "moment";

import Preloader from "../Components/Preloader";
import ShowToast from "../Components/ToastNotification";
import Button from "../Components/Button";
import Input from "../Components/Input";
import PreviewCard from "../Components/PreviewCard";

import { GetPreviousPreoperativePrevisitFormApi } from "../Utils/ApiCalls";
import { baseUrl } from "../Utils/ApiConfig";

export default function TheatrePrevisitDocumentation({ hide = false, index }) {
  const [isLoading, setIsLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    status: "",
  });
  const [All, setAll] = useState(true);

  const nav = useNavigate();
  const { pathname } = useLocation();

  const patientId = localStorage.getItem("patientId");
  const appointmentId = localStorage.getItem("appointmentId");

  const activateToast = (message, status) => {
    setShowToast({ show: true, message, status });
    setTimeout(
      () => setShowToast({ show: false, message: "", status: "" }),
      8000
    );
  };

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const result = await GetPreviousPreoperativePrevisitFormApi(patientId);
      if (result.status === true && result.queryresult) {
        const lst = Array.isArray(result.queryresult)
          ? result.queryresult
          : [result.queryresult];
        setRecords(lst);
      }
    } catch (e) {
      activateToast(e.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [index]);

  const filterBy = (field) => {
    if (!searchInput.trim()) {
      setFiltered(null);
      return;
    }
    const lower = searchInput.toLowerCase();
    const out = records.filter((item) =>
      (item[field] || "").toString().toLowerCase().includes(lower)
    );
    setFiltered(out);
  };

  const dataToShow = filtered ?? records;

  const AddNew = () => {
    setAll(true);
    setFiltered(null);
    localStorage.setItem("pathname", pathname);
    nav(`/dashboard/add-theatre-previsit-documentation/${appointmentId}`);
  };

  const EditRecord = (rec) => {
    setAll(true);
    setFiltered(null);
    localStorage.setItem("pathname", pathname);
    localStorage.setItem("oldPrevisitRecord", JSON.stringify(rec));
    nav(`/dashboard/edit-theatre-previsit-documentation/${rec._id}`);
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
      {showToast.show && (
        <ShowToast message={showToast.message} status={showToast.status} />
      )}

      {/* filters on one line */}
      <Flex justifyContent="space-between" flexWrap="wrap">
        <Flex
          alignItems="center"
          flexWrap="wrap"
          bg="#E4F3FF"
          rounded="7px"
          py="3.5px"
          px="5px"
          cursor="pointer"
          mt={["10px", "10px", "0px", "0px"]}
        >
          <Box borderRight="1px solid #EDEFF2" pr="5px">
            <Text
              py="8.5px"
              px="12px"
              bg={All ? "#fff" : "transparent"}
              rounded="7px"
              color="#1F2937"
              fontWeight="500"
              fontSize="13px"
            >
              All
            </Text>
          </Box>
        </Flex>

        {!hide && (
          <Flex
            flexWrap="wrap"
            mt={["10px", "10px", "0px", "0px"]}
            alignItems="center"
            justifyContent="flex-end"
          >
            <HStack spacing={3}>
              <Input
                label="Search"
                leftIcon={<BiSearch />}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                bColor="#E4E4E4"
              />

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
                    onClick={() => filterBy("conscentgained")}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>By Consent Gained</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => filterBy("patientproblem")}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>By Patient Problem</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => filterBy("nursingdiagnosis")}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>By Nursing Diagnosis</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setFiltered(null);
                      setSearchInput("");
                    }}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>Clear Filter</Text>
                    </HStack>
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        )}
      </Flex>

      {/* Add/Edit button */}
      {!hide && (
        <Flex
          justifyContent="space-between"
          flexWrap="wrap"
          mt={["10px", "10px", "10px", "10px"]}
          w={["100%", "100%", "50%", "37%"]}
        >
          <Button
            w={["100%", "100%", "144px", "144px"]}
            onClick={() => (records.length ? EditRecord(records[0]) : AddNew())}
            rightIcon={records.length ? <MdModeEdit /> : <SlPlus />}
          >
            {records.length ? "Edit" : "Add New"}
          </Button>
        </Flex>
      )}

      {/* Records */}
      {dataToShow.map((rec) => (
        <Box key={rec._id} mt="6">
          <Text fontSize="16px" fontWeight="700" color="blue.blue500" mb="20px">
            Pre-Visit on {moment(rec.createdAt).format("LL")}
          </Text>

          <HStack
            bg="orange.orange500"
            py="8px"
            px="10px"
            rounded="10px"
            color="blue.blue500"
            justify="space-between"
            mb="3"
            fontStyle="italic"
            fontSize="14px"
            fontWeight="500"
          >
            <HStack>
              <BsCalendar2DateFill />
              <Text>{moment(rec.createdAt).format("LL")}</Text>
            </HStack>
            <HStack>
              <FaClock />
              <Text>{moment(rec.createdAt).format("LT")}</Text>
            </HStack>
          </HStack>

          <Text fontSize="15px" fontWeight="700" color="blue.blue500" mb="2">
            Details
          </Text>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb="6">
            <PreviewCard
              title="Knowledge of Proposed Anesthesia"
              value={rec.knowledgeofproposedanesthesia}
            />
            <PreviewCard
              title="Previous Knowledge of Proposed Surgery"
              value={rec.previousknowledgeofproposedsurgicalintervention}
            />
            <PreviewCard
              title="Present Knowledge of Proposed Surgery"
              value={rec.presentknowledgeofproposedsurgicalintervention}
            />
            <PreviewCard title="Consent Gained" value={rec.conscentgained} />
            <PreviewCard
              title="Unknown Risk Assessment"
              value={rec.assessoftheunknownwrite}
            />
            <PreviewCard
              title="Site Operation Assessment"
              value={rec.assessthesiteoperation}
            />
            <PreviewCard
              title="Skin Preparations"
              value={rec.skinpreparations}
            />
            <PreviewCard
              title="Family Health History"
              value={rec.familyhealthhistory}
            />
            <PreviewCard
              title="General Observation"
              value={rec.generalobservation}
            />
            <PreviewCard
              title="Lab Investigations"
              value={rec.laboratoryinvestigations}
            />
            <PreviewCard
              title="Preoperative Preparations"
              value={rec.preoperativepreparations}
            />
            <PreviewCard title="Patient Problem" value={rec.patientproblem} />
            <PreviewCard
              title="Nursing Diagnosis"
              value={rec.nursingdiagnosis}
            />
            <PreviewCard title="Care Information" value={rec.careinformation} />
            <PreviewCard title="Vital Sign T" value={rec.vitalsignt} />
            <PreviewCard title="Vital Sign P" value={rec.vitalsignp} />
            <PreviewCard title="Vital Sign R" value={rec.vitalsignr} />
            <PreviewCard title="Vital Sign BP" value={rec.vitalsignbp} />
          </SimpleGrid>
        </Box>
      ))}

      {!isLoading && dataToShow.length === 0 && (
        <Text>No matching records found.</Text>
      )}
    </Box>
  );
}
