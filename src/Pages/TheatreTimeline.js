import { HStack, Text } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import React from 'react'
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";
import TheatrePreAnathetics from './TheatrePreAnathetics'
import TheatreOperationalConsent from './TheatreOperationalConsent'
import { useNavigate, useParams } from 'react-router-dom';

export default function TheatreTimeline() {

    const {id} = useParams()

   localStorage.setItem('patientId', id)
   let patientName =  localStorage.getItem('PatientName')
   let pathName =  localStorage.getItem('pathLocation')

   
  
    const nav = useNavigate()
    return (
        <MainLayout>
            <Seo title="Doctor Schedule Details" description="Care Connect Doctor Schedule Details" />

            <HStack cursor="pointer">
                <Text fontSize="15px" onClick={() => nav(`${pathName}`)} fontWeight="500" color="blue.blue500">Patient Timeline </Text>
                <Text fontSize="15px" fontWeight="400" color="#8A8D8E"> {`> ${patientName}`}</Text>
            </HStack>
            <Text color="#686C75" mt="9px" fontWeight="400" fontSize="15px">
                Give review, notes, findings and diagnosis about patient
            </Text>


            <Tabs mt="12px" >
                <TabList color="#101828" pb="10px" flexWrap={"wrap"}>
                    <Tab _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Pre-Anathetics </Tab>
                    <Tab _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Operational Consent </Tab>
                    <Tab _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Pre-Operative Nurses </Tab>
                    

                </TabList>
                {/* <TabIndicator mt='-1.5px' height='2px' bg='blue.blue500' borderRadius='1px' /> */}
                <TabPanels>
                    <TabPanel p="0">
                        <TheatrePreAnathetics index={0} id={id}/>
                       

                    </TabPanel>
                    <TabPanel p="0">
                        <TheatreOperationalConsent index={1} id={id}/>
                       

                    </TabPanel>
                    <TabPanel p="0">
                        {/* <LabAppointment id={id} /> */}
                    </TabPanel>

                </TabPanels>
            </Tabs>


        </MainLayout>
    )
}
