import { Text, Box, Flex, Stack, SimpleGrid, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react'
import React, { useState } from 'react'
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";
import Button from "../Components/Button";
import Input from "../Components/Input";
import TextArea from "../Components/TextArea";
import ShowToast from "../Components/ToastNotification";
import { useNavigate, useParams } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import { AddAnaesthesiaFormAPI } from "../Utils/ApiCalls";

export default function AddAnaesthesiaForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const pathName = localStorage.getItem("pathname") || "/";

  const [payload, setPayload] = useState({
    preopeassessment: "",
    allergies: "",
    weight: "",
    asa: "",
    temp: "",
    premedication: "",
    timegivenpremedication: "",
    timeoflastfood: "",
    vlinesite: "",
    cannulasize: "",
    bloodloss: "",
    totalinput: "",
  });

  const [Technique, setTechnique] = useState([]);
  const [techniqueNote, setTechniqueNote] = useState("");

  const [PostInstructions, setPostInstructions] = useState([]);
  const [postInstructionNote, setPostInstructionNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", status: "" });

  const handleScalarChange = (e) => {
    setPayload(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const addTechnique = () => {
    if (!techniqueNote.trim()) return;
    setTechnique([...Technique, techniqueNote.trim()]);
    setTechniqueNote("");
  };
  const removeTechnique = (item) => {
    setTechnique(Technique.filter(t => t !== item));
  };

  const addPostInstruction = () => {
    if (!postInstructionNote.trim()) return;
    setPostInstructions([...PostInstructions, postInstructionNote.trim()]);
    setPostInstructionNote("");
  };
  const removePostInstruction = (item) => {
    setPostInstructions(PostInstructions.filter(p => p !== item));
  };

  const showNotification = (message, status) => {
    setToast({ show: true, message, status });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const fullPayload = {
        ...payload,
        technique: Technique,
        postofinstruction: PostInstructions,
      };
      const res = await AddAnaesthesiaFormAPI(fullPayload, id);
      if (res.status === 200) {
        showNotification("Anaesthesia form submitted", "success");
        setTimeout(() => nav(pathName), 2000);
      }
    } catch (err) {
      showNotification(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      {toast.show && <ShowToast message={toast.message} status={toast.status} />}
      <Seo title="Add Anaesthesia Form" description="Care Connect Theatre Anaesthesia Form" />

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
              <Box flex="1" textAlign="left">Anaesthesia Details</Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0 0 8px 8px">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} mt="32px">
                <Input id="preopeassessment" label="Pre-op Assessment" value={payload.preopeassessment} onChange={handleScalarChange} />
                <Input id="allergies" label="Allergies" value={payload.allergies} onChange={handleScalarChange} />
                <Input id="weight" label="Weight" value={payload.weight} onChange={handleScalarChange} />
                <Input id="asa" label="ASA Grade" value={payload.asa} onChange={handleScalarChange} />
                <Input id="temp" label="Temperature" value={payload.temp} onChange={handleScalarChange} />
                <Input id="premedication" label="Premedication" value={payload.premedication} onChange={handleScalarChange} />
                <Input id="timegivenpremedication" label="Time Given Premedication" type="date" value={payload.timegivenpremedication} onChange={handleScalarChange} />
                <Input id="timeoflastfood" label="Time of Last Food" type="date" value={payload.timeoflastfood} onChange={handleScalarChange} />
                <Input id="vlinesite" label="V-line Site" value={payload.vlinesite} onChange={handleScalarChange} />
                <Input id="cannulasize" label="Cannula Size" value={payload.cannulasize} onChange={handleScalarChange} />
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>

          {/* Technique */}
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
              <Box flex="1" textAlign="left">Technique</Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0 0 8px 8px">
              <Stack spacing={4} pt="10">
                <TextArea
                  label="Technique Note"
                  value={techniqueNote}
                  onChange={e => setTechniqueNote(e.target.value)}
                />
              </Stack>
              <Flex justify="flex-end" mt="2">
                <Button onClick={addTechnique} w={["100%", "100%", "184px", "184px"]}>Add</Button>
              </Flex>
              <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                {Technique.map((item, i) => (
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
                    <Text color="#fff" fontWeight="500" textTransform="capitalize">{item}</Text>
                    <Box fontSize="20px" color="#fff" onClick={() => removeTechnique(item)}>×</Box>
                  </Flex>
                ))}
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>

          {/* Input / Output */}
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
              <Box flex="1" textAlign="left">Input / Output</Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0 0 8px 8px">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} mt="32px">
                <Input id="bloodloss" label="Blood Loss" value={payload.bloodloss} onChange={handleScalarChange} />
                <Input id="totalinput" label="Total Input" value={payload.totalinput} onChange={handleScalarChange} />
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>

          {/* Post Instructions */}
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
              <Box flex="1" textAlign="left">Post Instructions</Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0 0 8px 8px">
              <Stack spacing={4} pt="10">
                <TextArea
                  label="Post Instruction Note"
                  value={postInstructionNote}
                  onChange={e => setPostInstructionNote(e.target.value)}
                />
              </Stack>
              <Flex justify="flex-end" mt="2">
                <Button onClick={addPostInstruction} w={["100%", "100%", "184px", "184px"]}>Add</Button>
              </Flex>
              <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                {PostInstructions.map((item, i) => (
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
                    <Text color="#fff" fontWeight="500" textTransform="capitalize">{item}</Text>
                    <Box fontSize="20px" color="#fff" onClick={() => removePostInstruction(item)}>×</Box>
                  </Flex>
                ))}
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Flex justify="center" mt="10px">
          <Button
            w={["100%", "100%", "184px", "184px"]}
            onClick={handleSubmit}
            isLoading={loading}
          >
            Submit
          </Button>
        </Flex>
      </Box>
    </MainLayout>
  )
}
