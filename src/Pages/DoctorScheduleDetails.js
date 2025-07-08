import { HStack, Text } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator, Image } from '@chakra-ui/react'
import React from 'react'
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";
import Examine from './Examine'
import ClinicalEncounter from './ClinicalEncounter'
import SingleLabReport from './SingleLabReport'
import Prescription from './Prescription'
import SingleAdmission from './SingleAdmission'
import SinglePathograph from './SinglePathograph'
import Immunization from './Immunization'
import SingleFamilyPlanning from './SingleFamilyPlanning'
import AncCards from './AncCards'
import ANC from './ANC'
import ANC3 from './ANC3'
import LabAppointment from './LabAppointment'
import { useNavigate, useParams } from 'react-router-dom';
import SingleVitalChart from "./SingleVitalChart"
import SingleMedicationChart from "./SingleMedicationChart"
import Radiology from "./Radiology"
import SingleProcedure from "./SingleProcedure"
import PathographyChart from "./PathographyChart"
import SingleReferral from "./SingleReferral"
import SingleDeliveryNote from "./SingleDeliveryNote"
import ReferTheatreAdmissionPage from './ReferTheatreAdmissionPage'
import NutritionPage from './NutritionPage'

export default function DoctorScheduleDetails() {

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
                    <Tab _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Encounter </Tab>
                    <Tab _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Clinical Encounter </Tab>
                    <Tab _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Lab Test </Tab>
                    <Tab _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Lab Report </Tab>
                    <Tab _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Pharmacy </Tab>
                    <Tab _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Admission</Tab>
                    <Tab _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Vitals </Tab>
                    <Tab _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Medication </Tab>
                    <Tab _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Radiology </Tab>
                    <Tab _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Procedure </Tab>
                    <Tab _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Immunization </Tab>
                    <Tab _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Family Planning </Tab>
                    <Tab _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>ANC Card </Tab>
                    <Tab _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>ANC </Tab>
                    <Tab _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>ANC 3</Tab>
                    <Tab _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Partograph Entries</Tab>
                    <Tab _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Partograph Chart </Tab>
                    <Tab _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Delivery Note </Tab>
                    <Tab _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Referral </Tab>
                    <Tab _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Theater </Tab>
                    <Tab _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Nutrition </Tab>

                </TabList>
                {/* <TabIndicator mt='-1.5px' height='2px' bg='blue.blue500' borderRadius='1px' /> */}
                <TabPanels>
                    <TabPanel p="0">
                        <Examine index={0} id={id}/>
                       

                    </TabPanel>
                    <TabPanel p="0">
                        <ClinicalEncounter index={1} id={id}/>
                       

                    </TabPanel>
                    <TabPanel p="0">
                        <LabAppointment id={id} />
                    </TabPanel>
                    <TabPanel p="0">
                        <SingleLabReport  />

                    </TabPanel>
                    <TabPanel p="0">
                        <Prescription  />
                    </TabPanel>
                    <TabPanel p="0">
                        <SingleAdmission  />
                    </TabPanel>
                    <TabPanel p="0">
                    <SingleVitalChart/>
                    </TabPanel>
                    <TabPanel p="0">
                     <SingleMedicationChart/>
                    </TabPanel>
                    <TabPanel p="0">
                     <Radiology/>
                    </TabPanel>
                    <TabPanel p="0">
                     <SingleProcedure/>
                   
                    </TabPanel>
                    <TabPanel p="0">
                        <Immunization  />
                      
                    </TabPanel>
                    <TabPanel p="0">
                        <SingleFamilyPlanning  />
                    </TabPanel>
                    <TabPanel p="0"> 
                    <AncCards id={id}/>
                    </TabPanel>
                    <TabPanel p="0"> 
                    <ANC id={id}/>
                    </TabPanel>
                    <TabPanel p="0"> 
                    <ANC3 id={id}/>
                    </TabPanel>
                    <TabPanel p="0">
                    <SinglePathograph/>
                    </TabPanel>
                    <TabPanel p="0">
                     <PathographyChart/>
                
                    </TabPanel>
                    <TabPanel p="0">
                    
                     <SingleDeliveryNote/>
                    </TabPanel>
                    <TabPanel p="0">                
                     <SingleReferral/>
                    </TabPanel>
                    <TabPanel p="0">
                     <ReferTheatreAdmissionPage/>
                    </TabPanel>
                    <TabPanel p="0">
                     <NutritionPage/>
                    </TabPanel>


                </TabPanels>
            </Tabs>


        </MainLayout>
    )
}
