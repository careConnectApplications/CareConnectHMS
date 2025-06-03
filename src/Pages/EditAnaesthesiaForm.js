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
  } from '@chakra-ui/react';
  import React, { useState, useEffect } from 'react';
  import MainLayout from "../Layouts/Index";
  import Seo from "../Utils/Seo";
  import Button from "../Components/Button";
  import Input from "../Components/Input";
  import TextArea from "../Components/TextArea";
  import ShowToast from "../Components/ToastNotification";
  import { useNavigate, useParams } from 'react-router-dom';
  import { IoMdArrowRoundBack } from "react-icons/io";
  import { IoIosCloseCircle } from "react-icons/io";
  import { EditAnaesthesiaFormAPI } from "../Utils/ApiCalls";
  
  export default function EditAnaesthesiaForm() {
    const { id } = useParams();
    const nav = useNavigate();
    const returnPath = localStorage.getItem("pathname") || "/";
  
    // scalar fields
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
  
    // arrays
    const [Technique, setTechnique] = useState([]);
    const [techniqueNote, setTechniqueNote] = useState("");
    const [PostInstructions, setPostInstructions] = useState([]);
    const [postInstructionNote, setPostInstructionNote] = useState("");
  
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", status: "" });
  
    // handle simple inputs
    const handleChange = (e) => {
      setPayload(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };
  
    // technique handlers
    const addTechnique = () => {
      if (!techniqueNote.trim()) return;
      setTechnique([...Technique, techniqueNote.trim()]);
      setTechniqueNote("");
    };
    const removeTechnique = (item) => {
      setTechnique(Technique.filter(t => t !== item));
    };
  
    // post instructions handlers
    const addPostInstruction = () => {
      if (!postInstructionNote.trim()) return;
      setPostInstructions([...PostInstructions, postInstructionNote.trim()]);
      setPostInstructionNote("");
    };
    const removePostInstruction = (item) => {
      setPostInstructions(PostInstructions.filter(p => p !== item));
    };
  
    // toast
    const notify = (message, status) => {
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
        const res = await EditAnaesthesiaFormAPI(fullPayload, id);
        if (res.status === 200) {
          notify("Anaesthesia form updated", "success");
          setTimeout(() => nav(returnPath), 2000);
        }
      } catch (err) {
        notify(err.message, "error");
      } finally {
        setLoading(false);
      }
    };
  
    // on mount, load old record
    useEffect(() => {
      const old = JSON.parse(localStorage.getItem("oldAnaesthesiaRecord") || "{}");
      if (!old) return;
  
      setPayload({
        preopeassessment: old.preopeassessment || "",
        allergies:           old.allergies || "",
        weight:              old.weight || "",
        asa:                 old.asa || "",
        temp:                old.temp || "",
        premedication:       old.premedication || "",
        timegivenpremedication: old.timegivenpremedication || "",
        timeoflastfood:      old.timeoflastfood || "",
        vlinesite:           old.vlinesite || "",
        cannulasize:         old.cannulasize || "",
        bloodloss:           old.bloodloss || "",
        totalinput:          old.totalinput || "",
      });
      setTechnique(old.technique || []);
      setPostInstructions(old.postofinstruction || []);
    }, []);
  
    return (
      <MainLayout>
        {toast.show && <ShowToast message={toast.message} status={toast.status} />}
        <Seo
          title="Edit Anaesthesia Form"
          description="Care Connect Theatre Edit Anaesthesia"
        />
  
        <Box>
          <Button
            leftIcon={<IoMdArrowRoundBack />}
            px="40px"
            w="100px"
            onClick={() => nav(returnPath)}
          >
            Back
          </Button>
  
          <Accordion allowToggle mt="32px">
            {/* Details */}
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
                  {[
                    { id: "preopeassessment", label: "Pre-op Assessment" },
                    { id: "allergies", label: "Allergies" },
                    { id: "weight", label: "Weight" },
                    { id: "asa", label: "ASA Grade" },
                    { id: "temp", label: "Temperature", type: "number" },
                    { id: "premedication", label: "Premedication" },
                    { id: "timegivenpremedication", label: "Time Given Premedication", type: "date" },
                    { id: "timeoflastfood", label: "Time of Last Food", type: "date" },
                    { id: "vlinesite", label: "V-line Site" },
                    { id: "cannulasize", label: "Cannula Size", type: "number" },
                  ].map(({ id, label, type }) => (
                    <Input
                      key={id}
                      id={id}
                      label={label}
                      type={type || "text"}
                      value={payload[id]}
                      onChange={handleChange}
                    />
                  ))}
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
                  <Button onClick={addTechnique} w={["100%", "100%", "184px", "184px"]}>
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={2} spacing={2}>
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
                      <Text color="#fff" fontWeight="500">
                        {item}
                      </Text>
                      <Box fontSize="20px" color="#fff" onClick={() => removeTechnique(item)}>
                        <IoIosCloseCircle />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </AccordionPanel>
            </AccordionItem>
  
            {/* Input/Output */}
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
                <SimpleGrid columns={2} spacing={5} mt="32px">
                  <Input
                    id="bloodloss"
                    label="Blood Loss"
                    value={payload.bloodloss}
                    onChange={handleChange}
                  />
                  <Input
                    id="totalinput"
                    label="Total Input"
                    value={payload.totalinput}
                    onChange={handleChange}
                  />
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
                  <Button onClick={addPostInstruction} w={["100%", "100%", "184px", "184px"]}>
                    Add
                  </Button>
                </Flex>
                <SimpleGrid mt="12px" columns={2} spacing={2}>
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
                      <Text color="#fff" fontWeight="500">
                        {item}
                      </Text>
                      <Box fontSize="20px" color="#fff" onClick={() => removePostInstruction(item)}>
                        <IoIosCloseCircle />
                      </Box>
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
              Update
            </Button>
          </Flex>
        </Box>
      </MainLayout>
    );
  }
  