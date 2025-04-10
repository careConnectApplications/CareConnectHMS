import { HStack, Text } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator, Image } from '@chakra-ui/react'
import React from 'react'
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";
import Examine from './Examine'
import SingleLabReport from './SingleLabReport'
import LabAppointment from './LabAppointment'
import { useNavigate, useParams } from 'react-router-dom';
import VitalChart from "./VitalChart"
import MedicationChart from "./MedicationChart"
import ProgressReport from "./ProgressReport"
import InsulinChart from "./InsulinChart"
import TubeFeedingChart from "./TubeFeedingChart"
import FluidBalanceChart from "./FluidBalanceChart"
import BloodMonitoringChart from "./BloodMonitoringChart"
import NursingCarePlan from "./NursingCarePlan"
import NursingPrescription from './NursingPrescription';
import NursingEncounter from './NursingEncounter';


export default function InPatientTimeline() {

    const {id} = useParams()

    localStorage.setItem('patientId', id)
   let patient =  JSON.parse(localStorage.getItem('inPatient'))

   
  
    const nav = useNavigate()
    return (
        <MainLayout>
            <Seo title="In Patient Timeline" description="Care Connect In Patient Timeline" />

            <HStack cursor="pointer" >
                <Text fontSize="15px" onClick={() => nav("/dashboard/nurse-care")} fontWeight="500" color="blue.blue500">In Patient </Text>
                <Text fontSize="15px" fontWeight="400" color="#8A8D8E"> {`> ${patient.lastName} ${patient.firstName}`}</Text>
               
            </HStack>
            <Text color="#686C75" mt="9px" fontWeight="400" fontSize="15px">
               Manage in-patient vitals, blood, insulin, fluid balance, tube feeding, and progress Chart 
            </Text>
            <HStack cursor="pointer" mt="32px" >
                <Text fontSize="15px"  fontWeight="500" color="blue.blue500"> Profile Details </Text>
                <Text fontSize="15px" fontWeight="400" color="#8A8D8E"> {`> Gender ~ ${patient.gender}`}</Text>
                <Text fontSize="15px" fontWeight="400" color="#8A8D8E"> {`> Age ~ ${patient.age}`}</Text>
                <Text fontSize="15px" fontWeight="400" color="#8A8D8E"> {`> MRN ~ ${patient.MRN}`}</Text>
                <Text fontSize="15px" fontWeight="400" color="#8A8D8E"> {`> Phone No ~ ${patient.phoneNumber}`}</Text>
            </HStack>



            <Tabs mt="12px" size="md" overflowX="scroll">
                <TabList color="#101828" pb="10px"  flexWrap={"wrap"}>
                    <Tab _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Vitals Chart</Tab>
                    <Tab _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Medication Chart </Tab>
                    <Tab _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Progress Report</Tab>
                    <Tab _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Nursing Care</Tab>
                    <Tab _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Insulin Chart</Tab>
                    <Tab _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Tube Feeding Chart</Tab>
                    <Tab _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Fluid Balance Chart </Tab>
                    <Tab _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Blood Monitoring Chart </Tab>
                    <Tab _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Pharmacy</Tab>
                    <Tab _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Clinical Encounter</Tab>

                </TabList>
                
                <TabPanels>
                    <TabPanel p="0">
                       <VitalChart/>

                    </TabPanel>
                    <TabPanel p="0">
                       <MedicationChart/>
                    </TabPanel>
                    <TabPanel p="0">
                      <ProgressReport/>
                    </TabPanel>
                    <TabPanel p="0">
                     <NursingCarePlan/>
                    </TabPanel>
                    <TabPanel p="0">
                      <InsulinChart/>
                    </TabPanel>
                    <TabPanel p="0">
                     <TubeFeedingChart/>
                    </TabPanel>
                    <TabPanel p="0">
                     <FluidBalanceChart/>
                    </TabPanel>
                    <TabPanel p="0">
                     <BloodMonitoringChart/>
                    </TabPanel>
                    <TabPanel p="0">
                     <NursingPrescription/>
                    </TabPanel>
                    <TabPanel p="0">
                     <NursingEncounter/>
                    </TabPanel>


                </TabPanels>
            </Tabs>

        </MainLayout>
    )
}
