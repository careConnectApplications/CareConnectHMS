import React, { useEffect, useState } from 'react';
import { Text, Box, Flex, SimpleGrid } from '@chakra-ui/react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { FaNoteSticky } from 'react-icons/fa6';
import { useNavigate, useParams } from 'react-router-dom';

import MainLayout from '../Layouts/Index';
import Seo from '../Utils/Seo';
import Button from '../Components/Button';
import Input from '../Components/Input';
import ShowToast from '../Components/ToastNotification';

import { AddPreoperativePrevisitFormAPI } from '../Utils/ApiCalls';

export default function AddTheatrePrevisitDocumentation() {
  const { id } = useParams();
  const nav = useNavigate();
  const pathName = localStorage.getItem('pathname') || '/';

  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    knowledgeofproposedanesthesia: '',
    previousknowledgeofproposedsurgicalintervention: '',
    presentknowledgeofproposedsurgicalintervention: '',
    conscentgained: '',
    assessoftheunknownwrite: '',
    assessthesiteoperation: '',
    skinpreparations: '',
    familyhealthhistory: '',
    generalobservation: '',
    laboratoryinvestigations: '',
    vitalsignt: '',
    vitalsignp: '',
    vitalsignr: '',
    vitalsignbp: '',
    preoperativepreparations: '',
    patientproblem: '',
    nursingdiagnosis: '',
    careinformation: '',
  });

  const [toast, setToast] = useState({ show: false, message: '', status: '' });
  const activateToast = (message, status) => {
    setToast({ show: true, message, status });
    setTimeout(() => setToast({ show: false, message: '', status: '' }), 5000);
  };

  const handlePayload = e => {
    setPayload(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await AddPreoperativePrevisitFormAPI(payload, id);
      if (res.status === 200) {
        activateToast('Documentation submitted successfully', 'success');
        setTimeout(() => nav(pathName), 2000);
      }
    } catch (err) {
      activateToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {}, []);

  return (
    <MainLayout>
      {toast.show && <ShowToast message={toast.message} status={toast.status} />}

      <Seo
        title="Theatre Pre-Visit Documentation"
        description="Care Connect Theatre Pre-Visit Documentation"
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
          {/* Knowledge of Procedure */}
          <AccordionItem mb="15px">
            <AccordionButton
              _hover={{ border: '1px solid #EA5937', color: '#000' }}
              _focus={{ outline: 'none' }}
              border="1px solid #fff"
              _expanded={{ rounded: '8px 8px 0 0', border: 0 }}
              bg="#fff"
              color="#000"
              rounded="8px"
            >
              <Box flex="1" textAlign="left">
                Knowledge of Procedure
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0 0 8px 8px">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} mt="32px">
                <Input
                  id="knowledgeofproposedanesthesia"
                  label="Knowledge of Proposed Anesthesia"
                  leftIcon={<FaNoteSticky />}
                  value={payload.knowledgeofproposedanesthesia}
                  val={!!payload.knowledgeofproposedanesthesia}
                  onChange={handlePayload}
                  type="text"
                />
                <Input
                  id="previousknowledgeofproposedsurgicalintervention"
                  label="Previous Knowledge of Proposed Surgical Intervention"
                  leftIcon={<FaNoteSticky />}
                  value={payload.previousknowledgeofproposedsurgicalintervention}
                  val={!!payload.previousknowledgeofproposedsurgicalintervention}
                  onChange={handlePayload}
                  type="text"
                />
                <Input
                  id="presentknowledgeofproposedsurgicalintervention"
                  label="Present Knowledge of Proposed Surgical Intervention"
                  leftIcon={<FaNoteSticky />}
                  value={payload.presentknowledgeofproposedsurgicalintervention}
                  val={!!payload.presentknowledgeofproposedsurgicalintervention}
                  onChange={handlePayload}
                  type="text"
                />
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>

          {/* Consent & Assessment */}
          <AccordionItem mb="15px">
            <AccordionButton
              _hover={{ border: '1px solid #EA5937', color: '#000' }}
              _focus={{ outline: 'none' }}
              border="1px solid #fff"
              _expanded={{ rounded: '8px 8px 0 0', border: 0 }}
              bg="#fff"
              color="#000"
              rounded="8px"
            >
              <Box flex="1" textAlign="left">
                Consent & Assessment
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0 0 8px 8px">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} mt="32px">
                <Input
                  id="conscentgained"
                  label="Consent Gained"
                  leftIcon={<FaNoteSticky />}
                  value={payload.conscentgained}
                  val={!!payload.conscentgained}
                  onChange={handlePayload}
                  type="text"
                />
                <Input
                  id="assessoftheunknownwrite"
                  label="Assessment of the Unknown Risk"
                  leftIcon={<FaNoteSticky />}
                  value={payload.assessoftheunknownwrite}
                  val={!!payload.assessoftheunknownwrite}
                  onChange={handlePayload}
                  type="text"
                />
                <Input
                  id="assessthesiteoperation"
                  label="Assess the Site of Operation"
                  leftIcon={<FaNoteSticky />}
                  value={payload.assessthesiteoperation}
                  val={!!payload.assessthesiteoperation}
                  onChange={handlePayload}
                  type="text"
                />
                <Input
                  id="skinpreparations"
                  label="Skin Preparations"
                  leftIcon={<FaNoteSticky />}
                  value={payload.skinpreparations}
                  val={!!payload.skinpreparations}
                  onChange={handlePayload}
                  type="text"
                />
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>

          {/* History & Investigations */}
          <AccordionItem mb="15px">
            <AccordionButton
              _hover={{ border: '1px solid #EA5937', color: '#000' }}
              _focus={{ outline: 'none' }}
              border="1px solid #fff"
              _expanded={{ rounded: '8px 8px 0 0', border: 0 }}
              bg="#fff"
              color="#000"
              rounded="8px"
            >
              <Box flex="1" textAlign="left">
                History & Investigations
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0 0 8px 8px">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} mt="32px">
                <Input
                  id="familyhealthhistory"
                  label="Family Health History"
                  leftIcon={<FaNoteSticky />}
                  value={payload.familyhealthhistory}
                  val={!!payload.familyhealthhistory}
                  onChange={handlePayload}
                  type="text"
                />
                <Input
                  id="generalobservation"
                  label="General Observation"
                  leftIcon={<FaNoteSticky />}
                  value={payload.generalobservation}
                  val={!!payload.generalobservation}
                  onChange={handlePayload}
                  type="text"
                />
                <Input
                  id="laboratoryinvestigations"
                  label="Laboratory Investigations"
                  leftIcon={<FaNoteSticky />}
                  value={payload.laboratoryinvestigations}
                  val={!!payload.laboratoryinvestigations}
                  onChange={handlePayload}
                  type="text"
                />
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>

          {/* Vital Signs */}
          <AccordionItem mb="15px">
            <AccordionButton
              _hover={{ border: '1px solid #EA5937', color: '#000' }}
              _focus={{ outline: 'none' }}
              border="1px solid #fff"
              _expanded={{ rounded: '8px 8px 0 0', border: 0 }}
              bg="#fff"
              color="#000"
              rounded="8px"
            >
              <Box flex="1" textAlign="left">
                Vital Signs
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0 0 8px 8px">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} mt="32px">
                <Input
                  id="vitalsignt"
                  label="Vital Sign T"
                  leftIcon={<FaNoteSticky />}
                  value={payload.vitalsignt}
                  val={!!payload.vitalsignt}
                  onChange={handlePayload}
                  type="text"
                />
                <Input
                  id="vitalsignp"
                  label="Vital Sign P"
                  leftIcon={<FaNoteSticky />}
                  value={payload.vitalsignp}
                  val={!!payload.vitalsignp}
                  onChange={handlePayload}
                  type="text"
                />
                <Input
                  id="vitalsignr"
                  label="Vital Sign R"
                  leftIcon={<FaNoteSticky />}
                  value={payload.vitalsignr}
                  val={!!payload.vitalsignr}
                  onChange={handlePayload}
                  type="text"
                />
                <Input
                  id="vitalsignbp"
                  label="Vital Sign BP"
                  leftIcon={<FaNoteSticky />}
                  value={payload.vitalsignbp}
                  val={!!payload.vitalsignbp}
                  onChange={handlePayload}
                  type="text"
                />
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>

          {/* Preoperative Planning */}
          <AccordionItem mb="15px">
            <AccordionButton
              _hover={{ border: '1px solid #EA5937', color: '#000' }}
              _focus={{ outline: 'none' }}
              border="1px solid #fff"
              _expanded={{ rounded: '8px 8px 0 0', border: 0 }}
              bg="#fff"
              color="#000"
              rounded="8px"
            >
              <Box flex="1" textAlign="left">
                Preoperative Planning
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} bg="#fff" rounded="0 0 8px 8px">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} mt="32px">
                <Input
                  id="preoperativepreparations"
                  label="Preoperative Preparations"
                  leftIcon={<FaNoteSticky />}
                  value={payload.preoperativepreparations}
                  val={!!payload.preoperativepreparations}
                  onChange={handlePayload}
                  type="text"
                />
                <Input
                  id="patientproblem"
                  label="Patient Problem"
                  leftIcon={<FaNoteSticky />}
                  value={payload.patientproblem}
                  val={!!payload.patientproblem}
                  onChange={handlePayload}
                  type="text"
                />
                <Input
                  id="nursingdiagnosis"
                  label="Nursing Diagnosis"
                  leftIcon={<FaNoteSticky />}
                  value={payload.nursingdiagnosis}
                  val={!!payload.nursingdiagnosis}
                  onChange={handlePayload}
                  type="text"
                />
                <Input
                  id="careinformation"
                  label="Care Information"
                  leftIcon={<FaNoteSticky />}
                  value={payload.careinformation}
                  val={!!payload.careinformation}
                  onChange={handlePayload}
                  type="text"
                />
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Flex justify="center" mt="10px">
          <Button
            w={['100%', '100%', '184px', '184px']}
            onClick={handleSubmit}
            isLoading={loading}
          >
            Submit
          </Button>
        </Flex>
      </Box>
    </MainLayout>
  );
}
