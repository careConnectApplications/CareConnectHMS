import {
  Text,
  Box,
  Flex,
  Stack,
  SimpleGrid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Select,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";
import Button from "../Components/Button";
import Input from "../Components/Input";
import TextArea from "../Components/TextArea";
import ShowToast from "../Components/ToastNotification";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { SlPlus } from "react-icons/sl";
import { EditHistologyRequestFormAPI } from "../Utils/ApiCalls";

export default function EditHistologyRequestForm() {
  const { id } = useParams(); // formId
  const nav = useNavigate();
  const pathName = localStorage.getItem("pathname") || "/";
  const old = JSON.parse(localStorage.getItem("oldHistologyRecord") || "{}");

  const [payload, setPayload] = useState({
    africannonafrican: old.africannonafrican || "",
    nameofconsultant: old.nameofconsultant || "",
    historyofpresentillness: old.historyofpresentillness || [],
    presentingcomplaint: old.presentingcomplaint || [],
    findingonphysicalexamination: old.findingonphysicalexamination || [],
    otherfindings: old.otherfindings || [],
    anatomicalsiteofbiopsy: old.anatomicalsiteofbiopsy || [],
    grossappearanceoflesion: old.grossappearanceoflesion || [],
    previousreportwithnumberanddate: old.previousreportwithnumberanddate || [],
  });

  const [temp, setTemp] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", status: "" });

  const showNotification = (message, status) => {
    setToast({ show: true, message, status });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
  };

  const handleScalarChange = e => {
    setPayload(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const addArray = key => {
    const text = (temp[key] || "").trim();
    if (!text) return;
    setPayload(prev => ({ ...prev, [key]: [...prev[key], text] }));
    setTemp(prev => ({ ...prev, [key]: "" }));
  };

  const removeArray = (key, item) => {
    setPayload(prev => ({
      ...prev,
      [key]: prev[key].filter(i => i !== item),
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await EditHistologyRequestFormAPI(payload, id);
      if (res.status === 200) {
        showNotification("Histology request updated", "success");
        setTimeout(() => nav(pathName), 2000);
      }
    } catch (err) {
      showNotification(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { key: "historyofpresentillness", label: "History of Present Illness" },
    { key: "presentingcomplaint", label: "Presenting Complaint" },
    { key: "findingonphysicalexamination", label: "Findings on Physical Examination" },
    { key: "otherfindings", label: "Other Findings" },
    { key: "anatomicalsiteofbiopsy", label: "Anatomical Site of Biopsy" },
    { key: "grossappearanceoflesion", label: "Gross Appearance of Lesion" },
    { key: "previousreportwithnumberanddate", label: "Previous Report (No. & Date)" },
  ];

  return (
    <MainLayout>
      {toast.show && <ShowToast message={toast.message} status={toast.status} />}
      <Seo title="Edit Histology Request" description="Care Connect Edit Histology Form" />

      <Box>
        <Button
          leftIcon={<IoMdArrowRoundBack />}
          px="40px"
          w="100px"
          onClick={() => nav(pathName)}
        >
          Back
        </Button>

        <Accordion allowToggle mt="32px">
          {/* Basic Details */}
          <AccordionItem mb="15px">
            <AccordionButton
              _hover={{ border: "1px solid #EA5937", color: "#000" }}
              _focus={{ outline: "none" }}
              border="1px solid #fff"
              _expanded={{ rounded: "8px 8px 0 0", border: 0 }}
              bg="#fff"
              color="#000"
              rounded="8px"
            >
              <Box flex="1" textAlign="left">
                Basic Details
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0 0 8px 8px">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} mt="32px">
                <Select
                  id="africannonafrican"
                  placeholder="African / Non-African"
                  value={payload.africannonafrican}
                  onChange={handleScalarChange}
                >
                  <option value="african">African</option>
                  <option value="non-african">Non-African</option>
                </Select>
                <Input
                  id="nameofconsultant"
                  label="Name of Consultant"
                  value={payload.nameofconsultant}
                  onChange={handleScalarChange}
                />
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>

          {/* Array Sections */}
          {sections.map(({ key, label }) => (
            <AccordionItem mb="15px" key={key}>
              <AccordionButton
                _hover={{ border: "1px solid #EA5937", color: "#000" }}
                _focus={{ outline: "none" }}
                border="1px solid #fff"
                _expanded={{ rounded: "8px 8px 0 0", border: 0 }}
                bg="#fff"
                color="#000"
                rounded="8px"
              >
                <Box flex="1" textAlign="left">{label}</Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4} bg="#fff" rounded="0 0 8px 8px">
                <Stack spacing={4} pt="10">
                  <TextArea
                    label={`${label}`}
                    value={temp[key] || ""}
                    onChange={e => setTemp(prev => ({ ...prev, [key]: e.target.value }))}
                  />
                </Stack>
                <Flex justify="flex-end" mt="2">
                  <Button onClick={() => addArray(key)} w="184px">
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={2} spacing={2}>
                  {payload[key].map((item, i) => (
                    <Flex
                      key={i}
                      cursor="pointer"
                      px="10px"
                      py="10px"
                      rounded="20px"
                      fontSize="12px"
                      _hover={{ bg: "blue.blue400" }}
                      bg="blue.blue500"
                      w="100%"
                      justify="space-between"
                      align="center"
                    >
                      <Text color="#fff" fontWeight="500">{item}</Text>
                      <Box fontSize="20px" color="#fff" onClick={() => removeArray(key, item)}>×</Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>

        <Flex justify="center" mt="10px">
          <Button w="184px" onClick={handleSubmit} isLoading={loading}>
            Update
          </Button>
        </Flex>
      </Box>
    </MainLayout>
  );
}
