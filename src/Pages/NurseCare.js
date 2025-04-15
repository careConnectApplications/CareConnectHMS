import React, { useState, useEffect } from "react";
import { HStack, Text } from "@chakra-ui/react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
} from "@chakra-ui/react";
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";
import InPatientAdmission from "./InPatientAdmission";
import AdmissionDailyReport from "./AdmissionDailyReport";
import BedStatusReport from "./BedStatusReport";
import DailyWardReport from "./DailyWardReport";
import BedReport from "./BedReport";
import Preloader from "../Components/Preloader";

function NurseCare() {

  const [isLoading, setIsLoading] = useState(true);

 
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); 
    return () => clearTimeout(timer);
  }, []);


  if (isLoading) {
    return <Preloader />;
  }

  return (
    <MainLayout>
      <Seo title="Settings" description="Care Connect Settings" />
      <HStack>
        <Text color="#1F2937" fontWeight="600" fontSize="19px">
          In-Patient
        </Text>
      </HStack>
      <Text color="#686C75" mt="9px" fontWeight="400" fontSize="15px">
        Streamlines patient admission flow with real-time tracking and efficient
        management.
      </Text>

      <Tabs mt="12px">
        <TabList color="#101828" pb="10px">
          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: "blue.blue500", fontWeight: "700" }}
          >
            In-Patient Admission
          </Tab>
          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: "blue.blue500", fontWeight: "700" }}
          >
            Admission Daily Register
          </Tab>
          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: "blue.blue500", fontWeight: "700" }}
          >
            Bed Status Report
          </Tab>
          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: "blue.blue500", fontWeight: "700" }}
          >
            Daily Ward Report
          </Tab>
          <Tab
            _focus={{ outline: "none" }}
            _selected={{ color: "blue.blue500", fontWeight: "700" }}
          >
            Bed Report
          </Tab>
        </TabList>
        <TabIndicator
          mt="-1.5px"
          height="2px"
          bg="blue.blue500"
          borderRadius="1px"
        />
        <TabPanels>
          <TabPanel p="0">
            <InPatientAdmission />
          </TabPanel>
          <TabPanel p="0">
            <AdmissionDailyReport />
          </TabPanel>
          <TabPanel p="0">
            <BedStatusReport />
          </TabPanel>
          <TabPanel p="0">
            <DailyWardReport />
          </TabPanel>
          <TabPanel p="0">
            <BedReport />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </MainLayout>
  );
}

export default NurseCare;
