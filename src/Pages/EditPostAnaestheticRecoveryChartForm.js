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
import { IoIosCloseCircle } from "react-icons/io";
import { EditPostAnaestheticRecoveryChartFormAPI } from "../Utils/ApiCalls";

export default function EditPostAnaestheticRecoveryChartForm() {
  const { id } = useParams(); // this is recoveryChartId
  const nav = useNavigate();
  const returnPath = localStorage.getItem("pathname") || "/";

  const [payload, setPayload] = useState({
    score: "",
    timeofdischarge: "",
    treatmentgiveninrecoveryroom: [],
    commentsbyrecoverynurseorwardnurse: [],
    commentsbyanaesthetist: [],
  });
  const [treatmentNote, setTreatmentNote] = useState("");
  const [nurseComment, setNurseComment] = useState("");
  const [anaesthetistComment, setAnaesthetistComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", status: "" });

  const handleChange = (e) => {
    setPayload((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const addTreatment = () => {
    if (!treatmentNote.trim()) return;
    setPayload((prev) => ({
      ...prev,
      treatmentgiveninrecoveryroom: [
        ...prev.treatmentgiveninrecoveryroom,
        treatmentNote.trim(),
      ],
    }));
    setTreatmentNote("");
  };
  const removeTreatment = (item) => {
    setPayload((prev) => ({
      ...prev,
      treatmentgiveninrecoveryroom: prev.treatmentgiveninrecoveryroom.filter(
        (t) => t !== item
      ),
    }));
  };

  const addNurseComment = () => {
    if (!nurseComment.trim()) return;
    setPayload((prev) => ({
      ...prev,
      commentsbyrecoverynurseorwardnurse: [
        ...prev.commentsbyrecoverynurseorwardnurse,
        nurseComment.trim(),
      ],
    }));
    setNurseComment("");
  };
  const removeNurseComment = (item) => {
    setPayload((prev) => ({
      ...prev,
      commentsbyrecoverynurseorwardnurse:
        prev.commentsbyrecoverynurseorwardnurse.filter((c) => c !== item),
    }));
  };

  const addAnaesthetistComment = () => {
    if (!anaesthetistComment.trim()) return;
    setPayload((prev) => ({
      ...prev,
      commentsbyanaesthetist: [
        ...prev.commentsbyanaesthetist,
        anaesthetistComment.trim(),
      ],
    }));
    setAnaesthetistComment("");
  };
  const removeAnaesthetistComment = (item) => {
    setPayload((prev) => ({
      ...prev,
      commentsbyanaesthetist: prev.commentsbyanaesthetist.filter(
        (c) => c !== item
      ),
    }));
  };

  const notify = (message, status) => {
    setToast({ show: true, message, status });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 5000);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await EditPostAnaestheticRecoveryChartFormAPI(payload, id);
      if (res.status === 200) {
        notify("Recovery chart updated", "success");
        setTimeout(() => nav(returnPath), 2000);
      }
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const old = JSON.parse(localStorage.getItem("oldRecoveryRecord") || "{}");
    if (!old) return;
    setPayload({
      score: old.score || "",
      timeofdischarge: old.timeofdischarge?.slice(0, 10) || "",
      treatmentgiveninrecoveryroom: old.treatmentgiveninrecoveryroom || [],
      commentsbyrecoverynurseorwardnurse:
        old.commentsbyrecoverynurseorwardnurse || [],
      commentsbyanaesthetist: old.commentsbyanaesthetist || [],
    });
  }, []);

  return (
    <MainLayout>
      {toast.show && (
        <ShowToast message={toast.message} status={toast.status} />
      )}
      <Seo
        title="Edit Recovery Chart"
        description="Care Connect Edit Recovery Chart"
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
          {/* Chart Details */}
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
                Chart Details
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0 0 8px 8px">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} mt="32px">
                <Input
                  id="score"
                  label="Score"
                  value={payload.score}
                  onChange={handleChange}
                />
                <Input
                  id="timeofdischarge"
                  label="Time of Discharge"
                  type="datetime-local"
                  value={payload.timeofdischarge}
                  onChange={handleChange}
                />
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>

          {/* Treatment Given */}
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
                Treatment Given in Recovery Room
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0 0 8px 8px">
              <Stack spacing={4} pt="10">
                <TextArea
                  label="Treatment Note"
                  value={treatmentNote}
                  onChange={(e) => setTreatmentNote(e.target.value)}
                />
              </Stack>
              <Flex justify="flex-end" mt="2">
                <Button onClick={addTreatment} w="184px">
                  Add
                </Button>
              </Flex>
              <SimpleGrid mt="12px" columns={2} spacing={2}>
                {payload.treatmentgiveninrecoveryroom.map((item, i) => (
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
                    <Box
                      fontSize="20px"
                      color="#fff"
                      onClick={() => removeTreatment(item)}
                    >
                      <IoIosCloseCircle />
                    </Box>
                  </Flex>
                ))}
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>

          {/* Nurse Comments */}
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
                Comments by Recovery/Ward Nurse
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0 0 8px 8px">
              <Stack spacing={4} pt="10">
                <TextArea
                  label="Nurse Comment"
                  value={nurseComment}
                  onChange={(e) => setNurseComment(e.target.value)}
                />
              </Stack>
              <Flex justify="flex-end" mt="2">
                <Button onClick={addNurseComment} w="184px">
                  Add
                </Button>
              </Flex>
              <SimpleGrid mt="12px" columns={2} spacing={2}>
                {payload.commentsbyrecoverynurseorwardnurse.map((item, i) => (
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
                    <Box
                      fontSize="20px"
                      color="#fff"
                      onClick={() => removeNurseComment(item)}
                    >
                      <IoIosCloseCircle />
                    </Box>
                  </Flex>
                ))}
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>

          {/* Anaesthetist Comments */}
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
                Comments by Anaesthetist
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0 0 8px 8px">
              <Stack spacing={4} pt="10">
                <TextArea
                  label="Anaesthetist Comment"
                  value={anaesthetistComment}
                  onChange={(e) => setAnaesthetistComment(e.target.value)}
                />
              </Stack>
              <Flex justify="flex-end" mt="2">
                <Button onClick={addAnaesthetistComment} w="184px">
                  Add
                </Button>
              </Flex>
              <SimpleGrid mt="12px" columns={2} spacing={2}>
                {payload.commentsbyanaesthetist.map((item, i) => (
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
                    <Box
                      fontSize="20px"
                      color="#fff"
                      onClick={() => removeAnaesthetistComment(item)}
                    >
                      <IoIosCloseCircle />
                    </Box>
                  </Flex>
                ))}
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>
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
