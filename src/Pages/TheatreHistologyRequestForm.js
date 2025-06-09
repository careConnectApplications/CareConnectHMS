import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
} from "@chakra-ui/react";
import moment from "moment";
import { BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import { SlPlus } from "react-icons/sl";
import { MdModeEdit } from "react-icons/md";
import Button from "../Components/Button";
import Input from "../Components/Input";
import PreviewCard from "../Components/PreviewCard";
import PreviewCardV2 from "../Components/PreviewCardV2";
import ShowToast from "../Components/ToastNotification";
import Preloader from "../Components/Preloader";
import { GetHistologyRequestFormAPI } from "../Utils/ApiCalls";
import { useNavigate, useLocation } from "react-router-dom";

export default function TheatreHistologyRequestForm({ hide = false, index }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [trigger, setTrigger] = useState(false);
  const [showToast, setShowToast] = useState({ show: false, message: "", status: "" });

  const raw = localStorage.getItem("recoveryChartRecord");
  const admissionId = raw ? JSON.parse(raw).theatreadmission : null;
  const nav = useNavigate();
  const { pathname } = useLocation();

  const activateNotifications = (message, status) => {
    setShowToast({ show: true, message, status });
    setTimeout(() => setShowToast({ show: false }), 10000);
  };

  const getForm = async () => {
    if (!admissionId) return;
    setIsLoading(true);
    try {
      const res = await GetHistologyRequestFormAPI(admissionId);
      if (res.status) {
        setData(res.queryresult);
        setFilteredData(null);
        localStorage.setItem("histologyRequestRecord", JSON.stringify(res.queryresult));
      }
    } catch (e) {
      activateNotifications(e.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const filterBy = (field) => {
    if (!data) return;
    const term = searchInput.toLowerCase();
    let keep = false;
    switch (field) {
      case "africa":
        keep = data.africannonafrican.toLowerCase().includes(term);
        break;
      case "consultant":
        keep = data.nameofconsultant.toLowerCase().includes(term);
        break;
      case "hpi":
        keep = data.historyofpresentillness.join(" ").toLowerCase().includes(term);
        break;
      case "complaint":
        keep = data.presentingcomplaint.join(" ").toLowerCase().includes(term);
        break;
      default:
        keep = true;
    }
    setFilteredData(keep ? data : null);
  };

  const clearFilter = () => {
    setFilteredData(null);
    setSearchInput("");
  };

  const addNew = () => {
    localStorage.setItem("pathname", pathname);
    nav(`/dashboard/add-histology-request-form/${admissionId}`);
  };
  const editRecord = () => {
    localStorage.setItem("pathname", pathname);
    localStorage.setItem("oldHistologyRecord", JSON.stringify(data));
    nav(`/dashboard/edit-histology-request-form/${data._id}`);
  };

  useEffect(() => {
    getForm();
  }, [isOpen, trigger, index]);

  const display = filteredData || data;

  return (
    <Box bg="#fff" border="1px solid #EFEFEF" mt="10px" py="17px" px="18px" rounded="10px">
      {isLoading && <Preloader />}
      {showToast.show && <ShowToast message={showToast.message} status={showToast.status} />}

      {/* Search & Filter */}
      <Flex justify="space-between" flexWrap="wrap" mb="4">
        <HStack bg="#E4F3FF" rounded="7px" py="3.5px" px="5px">
          <Text
            py="8.5px"
            px="12px"
            bg="#fff"
            rounded="7px"
            color="#1F2937"
            fontWeight="500"
            fontSize="13px"
            cursor="pointer"
            onClick={clearFilter}
          >
            All
          </Text>
        </HStack>
        {!hide && (
          <Flex align="center" mt={["10px","10px","0","0"]}>
            <HStack spacing="2">
              <Input
                label="Search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                leftIcon={<BiSearch />}
              />
              <Menu>
                <MenuButton>
                  <Box
                    border="1px solid #EA5937"
                    rounded="7px"
                    py="11.6px"
                    px="16.9px"
                    bg="#f8ddd1"
                    color="blue.blue500"
                    fontWeight="500"
                    fontSize="14px"
                    cursor="pointer"
                  >
                    <HStack spacing="1">
                      <Text>Filter</Text>
                      <IoFilter />
                    </HStack>
                  </Box>
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => filterBy("africa")}>by African Status</MenuItem>
                  <MenuItem onClick={() => filterBy("consultant")}>by Consultant</MenuItem>
                  <MenuItem onClick={() => filterBy("hpi")}>by HPI</MenuItem>
                  <MenuItem onClick={() => filterBy("complaint")}>by Complaint</MenuItem>
                  <MenuItem onClick={clearFilter}>Clear Filter</MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        )}
      </Flex>

      {/* Add / Edit */}
      {!hide && (
        <Flex mb="4">
          {display ? (
            <Button rightIcon={<MdModeEdit />} onClick={editRecord} w="144px">
              Edit
            </Button>
          ) : (
            <Button rightIcon={<SlPlus />} onClick={addNew} w="144px">
              Add New
            </Button>
          )}
        </Flex>
      )}

      {/* Display */}
      {display && (
        <Box mt="20px" overflowX="auto">
          <Text mb="20px" fontWeight="700" fontSize="16px" color="blue.blue500">
            Previous Histology Request
          </Text>

          <HStack
            bg="orange.orange500"
            py="10px"
            px="10px"
            rounded="10px"
            color="blue.blue500"
            justify="space-between"
            fontStyle="italic"
            fontSize="14px"
            fontWeight="500"
          >
            <Text>{moment(display.createdAt).format("L LT")}</Text>
          </HStack>

          <Text mt="12px" mb="5" fontSize="15px" fontWeight="700" color="blue.blue500">
            Basic Details
          </Text>
          <PreviewCard title="African / Non-African" value={display.africannonafrican} />
          <PreviewCard title="Consultant Name" value={display.nameofconsultant} />

          {[
            { key: "historyofpresentillness", title: "History of Present Illness" },
            { key: "presentingcomplaint", title: "Presenting Complaint" },
            { key: "findingonphysicalexamination", title: "Physical Exam Findings" },
            { key: "otherfindings", title: "Other Findings" },
            { key: "anatomicalsiteofbiopsy", title: "Anatomical Site of Biopsy" },
            { key: "grossappearanceoflesion", title: "Gross Appearance of Lesion" },
            { key: "previousreportwithnumberanddate", title: "Previous Report (No. & Date)" },
          ].map(({ key, title }) =>
            display[key]?.length ? (
              <Box key={key} mt="12px" mb="5">
                <Text fontSize="15px" fontWeight="700" color="blue.blue500">
                  {title}
                </Text>
                {display[key].map((item, i) => (
                  <Box key={i} mb="2">
                    <PreviewCardV2 value={item} />
                  </Box>
                ))}
              </Box>
            ) : null
          )}
        </Box>
      )}
    </Box>
  );
}
