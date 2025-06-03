import React, { useState } from 'react';
import {
  Text,
  Box,
  Flex,
  Stack,
  SimpleGrid,
} from '@chakra-ui/react';
import MainLayout from '../Layouts/Index';
import Seo from '../Utils/Seo';
import Button from '../Components/Button';
import Input from '../Components/Input';
import TextArea from '../Components/TextArea';
import ShowToast from '../Components/ToastNotification';
import { useNavigate, useParams } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { FillOperationNoteAPI } from '../Utils/ApiCalls';
import { IoIosCloseCircle } from 'react-icons/io';

export default function AddNewOperationNote() {
  const { id } = useParams(); // theatreAdmissionId
  const [assistantsList, setAssistantsList] = useState([]);
  const [findingsList, setFindingsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    diagnosispreop: '',
    diagnosisoperative: '',
    operative: '',
    surgeon: '',
    preoperativenurse: '',
    anestheticnurse: '',
    typeofanesthetic: '',
  });
  const [tempAssistant, setTempAssistant] = useState('');
  const [tempFinding, setTempFinding] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', status: '' });

  const nav = useNavigate();
  const pathName = localStorage.getItem('pathname') || '/';

  const activateNotifications = (message, status) => {
    setToast({ show: true, message, status });
    setTimeout(() => {
      setToast({ show: false, message: '', status: '' });
    }, 5000);
  };

  const handlePayload = (e) => {
    const { id: field, value } = e.target;
    setPayload((prev) => ({ ...prev, [field]: value }));
  };

  const addAssistant = () => {
    if (tempAssistant.trim() !== '') {
      setAssistantsList((prev) => [...prev, tempAssistant.trim()]);
      setTempAssistant('');
    }
  };

  const addFinding = () => {
    if (tempFinding.trim() !== '') {
      setFindingsList((prev) => [...prev, tempFinding.trim()]);
      setTempFinding('');
    }
  };

  const removeAssistant = (item) => {
    setAssistantsList((prev) => prev.filter((i) => i !== item));
  };

  const removeFinding = (item) => {
    setFindingsList((prev) => prev.filter((i) => i !== item));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await FillOperationNoteAPI(
        {
          diagnosispreop: payload.diagnosispreop,
          diagnosisoperative: payload.diagnosisoperative,
          operative: payload.operative,
          surgeon: payload.surgeon,
          assistants: assistantsList,
          preoperativenurse: payload.preoperativenurse,
          anestheticnurse: payload.anestheticnurse,
          typeofanesthetic: payload.typeofanesthetic,
          findings: findingsList,
        },
        id
      );
      if (result.status === 200 || result.status === 201) {
        activateNotifications('Submitted Successfully', 'success');
        setTimeout(() => {
          nav(pathName);
        }, 2000);
      }
    } catch (e) {
      activateNotifications(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      {toast.show && (
        <ShowToast message={toast.message} status={toast.status} />
      )}
      <Seo
        title="Operation Note"
        description="Care Connect Theatre Operation Note"
      />

      <Box>
        <Button
          leftIcon={<IoMdArrowRoundBack />}
          px="40px"
          w="100px"
          onClick={() => nav(pathName)}
        >
          Back
        </Button>

        <Accordion defaultIndex={[0]} mt="32px" allowToggle>
          {/* Diagnosis */}
          <AccordionItem mb="15px">
            <AccordionButton
              _hover={{ border: '1px solid #EA5937', color: '#000' }}
              _focus={{ outline: 'none' }}
              border="1px solid #fff"
              _expanded={{ rounded: '8px 8px 0px 0px', border: 0 }}
              bg="#fff"
              color="#000"
              rounded="8px"
            >
              <Box as="span" flex="1" textAlign="left">
                Diagnosis
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <SimpleGrid mt="20px" columns={{ base: 1, md: 2 }} spacing={5}>
                <TextArea
                  label="Pre-op Diagnosis"
                  value={payload.diagnosispreop}
                  onChange={handlePayload}
                  id="diagnosispreop"
                />
                <TextArea
                  label="Operative Diagnosis"
                  value={payload.diagnosisoperative}
                  onChange={handlePayload}
                  id="diagnosisoperative"
                />
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>

          {/* Operative Details */}
          <AccordionItem mb="15px">
            <AccordionButton
              _hover={{ border: '1px solid #EA5937', color: '#000' }}
              _focus={{ outline: 'none' }}
              border="1px solid #fff"
              _expanded={{ rounded: '8px 8px 0px 0px', border: 0 }}
              bg="#fff"
              color="#000"
              rounded="8px"
            >
              <Box as="span" flex="1" textAlign="left">
                Operative Details
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <SimpleGrid mt="20px" columns={{ base: 1, md: 2 }} spacing={5}>
                <Input
                  label="Operative"
                  value={payload.operative}
                  onChange={handlePayload}
                  id="operative"
                />
                <Input
                  label="Surgeon"
                  value={payload.surgeon}
                  onChange={handlePayload}
                  id="surgeon"
                />
                <Input
                  label="Pre-op Nurse"
                  value={payload.preoperativenurse}
                  onChange={handlePayload}
                  id="preoperativenurse"
                />
                <Input
                  label="Anesthetic Nurse"
                  value={payload.anestheticnurse}
                  onChange={handlePayload}
                  id="anestheticnurse"
                />
                <Input
                  label="Type of Anesthetic"
                  value={payload.typeofanesthetic}
                  onChange={handlePayload}
                  id="typeofanesthetic"
                />
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>

          {/* Assistants */}
          <AccordionItem mb="15px">
            <AccordionButton
              _hover={{ border: '1px solid #EA5937', color: '#000' }}
              _focus={{ outline: 'none' }}
              border="1px solid #fff"
              _expanded={{ rounded: '8px 8px 0px 0px', border: 0 }}
              bg="#fff"
              color="#000"
              rounded="8px"
            >
              <Box as="span" flex="1" textAlign="left">
                Assistants
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <Stack spacing={4} pt="10">
                <TextArea
                  label="Assistant Name"
                  value={tempAssistant}
                  onChange={(e) => setTempAssistant(e.target.value)}
                />
              </Stack>
              <Flex justifyContent="flex-end" mt="2">
                <Button onClick={addAssistant} w={['100%', '184px']}>
                  Add
                </Button>
              </Flex>
              <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                {assistantsList.map((item, i) => (
                  <Flex
                    key={i}
                    cursor="pointer"
                    px="10px"
                    py="10px"
                    rounded="20px"
                    fontSize="12px"
                    _hover={{ bg: 'blue.blue400' }}
                    bg="blue.blue500"
                    w="100%"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text
                      color="#fff"
                      fontWeight="500"
                      textTransform="capitalize"
                    >
                      {item}
                    </Text>
                    <Box
                      fontSize="20px"
                      color="#fff"
                      onClick={() => removeAssistant(item)}
                    >
                      <IoIosCloseCircle />
                    </Box>
                  </Flex>
                ))}
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>

          {/* Findings */}
          <AccordionItem mb="15px">
            <AccordionButton
              _hover={{ border: '1px solid #EA5937', color: '#000' }}
              _focus={{ outline: 'none' }}
              border="1px solid #fff"
              _expanded={{ rounded: '8px 8px 0px 0px', border: 0 }}
              bg="#fff"
              color="#000"
              rounded="8px"
            >
              <Box as="span" flex="1" textAlign="left">
                Findings
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
              <Stack spacing={4} pt="10">
                <TextArea
                  label="Finding"
                  value={tempFinding}
                  onChange={(e) => setTempFinding(e.target.value)}
                />
              </Stack>
              <Flex justifyContent="flex-end" mt="2">
                <Button onClick={addFinding} w={['100%', '184px']}>
                  Add
                </Button>
              </Flex>
              <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>
                {findingsList.map((item, i) => (
                  <Flex
                    key={i}
                    cursor="pointer"
                    px="10px"
                    py="10px"
                    rounded="20px"
                    fontSize="12px"
                    _hover={{ bg: 'blue.blue400' }}
                    bg="blue.blue500"
                    w="100%"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text
                      color="#fff"
                      fontWeight="500"
                      textTransform="capitalize"
                    >
                      {item}
                    </Text>
                    <Box
                      fontSize="20px"
                      color="#fff"
                      onClick={() => removeFinding(item)}
                    >
                      <IoIosCloseCircle />
                    </Box>
                  </Flex>
                ))}
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Flex justifyContent="center" mt="20px">
          <Button onClick={handleSubmit} isLoading={loading}>
            Submit
          </Button>
        </Flex>
      </Box>
    </MainLayout>
  );
}
