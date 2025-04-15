import { HStack, Text } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator, Image } from '@chakra-ui/react'
import React from 'react'
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";
import PriceSettings from './PriceSettings'
import ClinicSettings from './ClinicSettings'
import ServiceTypeSettings from './ServiceTypeSettings'
import WardManagement from './WardManagement'
import TheatreManagement from "./TheatreManagement"
import InsuranceManagement from './InsuranceManagement';
import HMOPatientManagement from './HMOPatientManagement'
import LabResultManagement from './LabResultManagement';
import AuditManagement from './AuditManagement'

export default function Settings() {
    return (
        <MainLayout>
            <Seo title="Settings" description="Care Connect Settings" />

            <HStack>
                <Text color="#1F2937" fontWeight="600" fontSize="19px">
                    Settings
                </Text>

            </HStack>
            <Text color="#686C75" mt="9px" fontWeight="400" fontSize="15px">
                Organize, manage and view all settings to suit what is needed at anytime at your convenience.
            </Text>


            <Tabs mt="12px">
                <TabList color="#101828" pb="10px" flexWrap={"wrap"}>
                    <Tab  _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Price </Tab>
                    <Tab  _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Clinic/Pharmacy/Department</Tab>
                    <Tab  _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Service Type </Tab>
                    <Tab  _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Ward Management</Tab>
                    <Tab  _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Theatre Management</Tab>
                    <Tab  _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Insurance Management</Tab>
                    <Tab  _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>HMO Patient Management</Tab>
                    <Tab  _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Lab Result Management</Tab>
                    <Tab  _focus={{outline: "none"}} _selected={{ color: "blue.blue500", fontWeight: "700" }}>Audit</Tab>

                </TabList>
                <TabPanels>
                    <TabPanel p="0">
                        <PriceSettings />

                    </TabPanel>
                    <TabPanel p="0">
                    <ClinicSettings />

                    </TabPanel>
                    <TabPanel p="0">
                    <ServiceTypeSettings />
               

                    </TabPanel>
                    <TabPanel p="0">
                    <WardManagement />

                    </TabPanel>
                    <TabPanel p="0">
                    <TheatreManagement />

                    </TabPanel>
                    <TabPanel p="0">
                    <InsuranceManagement />

                    </TabPanel>
                    <TabPanel p="0">
                    <HMOPatientManagement />

                    </TabPanel>
                    <TabPanel p="0">
                    <LabResultManagement/>

                    </TabPanel>
                    <TabPanel p="0">
                    <AuditManagement/>

                    </TabPanel>

                </TabPanels>
            </Tabs>

        </MainLayout>
    )
}