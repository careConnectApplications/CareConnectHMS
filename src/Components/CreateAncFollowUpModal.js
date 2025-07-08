import { HStack, Radio, RadioGroup, Text } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  SimpleGrid,
  Select,
  Flex,
} from "@chakra-ui/react";
import { SlPlus } from "react-icons/sl";
import Input from "./Input";
import TextArea from "./TextArea";
import Button from "./Button";
import ReferralDiagnosisCard from "./ReferralDiagnosisCard";
import { FaNoteSticky } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { IoColorFilter } from "react-icons/io5";
import {
  SettingsApi,
  AddANCFollowUpAPI,
  UpdateAncFollowupAPI,
  GetAllClinicApi,
  GetAllUsersApi,
} from "../Utils/ApiCalls";
import { FaArrowsToDot } from "react-icons/fa6";
import { AiFillDatabase } from "react-icons/ai";

export default function CreateAncFollowUpModal({
  isOpen,
  onClose,
  setOldPayload,
  activateNotifications,
  type,
  oldPayload,
}) {
  const [Disabled, setDisabled] = useState(true);
  const [Loading, setLoading] = useState(false);
  const [Clinics, setClinics] = useState([]);
  const [Doctors, setDoctors] = useState([]);
  const [Settings, setSettings] = useState("");

  const [Payload, setPayload] = useState({
    ga: "",
    sfh: "",
    wt: "",
    lie: "",
    presentation: "",
    position: "",
    fhr: "",
    urine: "",
    bp: "",
    remark: "",
    followup: "",
    riskidentified: "",
    currentmedication: "",
  });
  const [UpdatedPayload, setUpdatedPayload] = useState({
    ga: "",
    sfh: "",
    wt: "",
    lie: "",
    presentation: "",
    position: "",
    fhr: "",
    urine: "",
    bp: "",
    remark: "",
    followup: "",
    riskidentified: "",
    currentmedication: "",
  });

  const handlePayload = (e) => {
    setPayload({ ...Payload, [e.target.id]: e.target.value });
  };

  const handleUpdatedPayload = (e) => {
    setUpdatedPayload({ ...UpdatedPayload, [e.target.id]: e.target.value });
  };

  const handleSubmitNew = async () => {
    setLoading(true);
    try {
      const result = await AddANCFollowUpAPI(Payload, oldPayload._id);

      if (result.status === 200) {
        setLoading(false);
        setPayload({
          ga: "",
          sfh: "",
          wt: "",
          lie: "",
          presentation: "",
          position: "",
          fhr: "",
          urine: "",
          bp: "",
          remark: "",
          followup: "",
          riskidentified: "",
          currentmedication: "",
        });
        activateNotifications("ANC Follow Up Added Successfully", "success");
        onClose();
      }
    } catch (e) {
      setLoading(false);
      activateNotifications(e.message, "error");
    }
  };

  const handleSubmitUpdate = async () => {
    setLoading(true);
    try {
      const result = await UpdateAncFollowupAPI(UpdatedPayload, oldPayload._id);

      if (result.status === 200) {
        setLoading(false);
        activateNotifications("ANC Follow Up Updated Successfully", "success");
        onClose();
      }
    } catch (e) {
      setLoading(false);
      activateNotifications(e.message, "error");
    }
  };

  const getSettings = async () => {
    try {
      const result = await SettingsApi();
      console.log("Settings API Response:", result);
      setSettings(result);
    } catch (e) {}
  };

  const getAllClinic = async () => {
    try {
      const result = await GetAllClinicApi();
      setClinics(result.queryresult.clinicdetails);
    } catch (e) {}
  };
  const getAllUser = async () => {
    try {
      const result = await GetAllUsersApi();

      setDoctors(result.queryresult.userdetails);
    } catch (e) {}
  };

  useEffect(() => {
    getAllUser();
    getAllClinic();
    getSettings();

    setUpdatedPayload({
      ga: oldPayload?.ga,
      sfh: oldPayload?.sfh,
      wt: oldPayload?.wt,
      lie: oldPayload?.lie,
      presentation: oldPayload?.presentation,
      position: oldPayload?.position,
      fhr: oldPayload?.fhr,
      urine: oldPayload?.urine,
      bp: oldPayload?.bp,
      remark: oldPayload?.remark,
      followup: oldPayload?.followup,
      riskidentified: oldPayload?.riskidentified,
      currentmedication: oldPayload?.currentmedication,
    });
  }, [isOpen, Payload]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent
        maxW={{ base: "90%", md: "60%" }}
        maxH="80vh"
        overflowY="auto"
      >
        <ModalHeader>
          {" "}
          {type === "new"
            ? "Add New ANC Follow up"
            : type === "edit"
            ? "Edit ANC Follow up"
            : "ANC Follow up Details"}{" "}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {type === "new" ? (
            <>
              <SimpleGrid
                mt="18px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="GA"
                  type="text"
                  value={Payload.ga}
                  onChange={handlePayload}
                  id="ga"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="SFH"
                  type="text"
                  value={Payload.sfh}
                  onChange={handlePayload}
                  id="sfh"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="WT"
                  type="text"
                  value={Payload.wt}
                  onChange={handlePayload}
                  id="wt"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="LIE"
                  type="text"
                  value={Payload.lie}
                  onChange={handlePayload}
                  id="lie"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Presentation"
                  type="text"
                  value={Payload.presentation}
                  onChange={handlePayload}
                  id="presentation"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Position"
                  type="text"
                  value={Payload.position}
                  onChange={handlePayload}
                  id="position"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="FHR"
                  type="text"
                  value={Payload.fhr}
                  onChange={handlePayload}
                  id="fhr"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Urine"
                  type="text"
                  value={Payload.urine}
                  onChange={handlePayload}
                  id="urine"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Bp"
                  type="text"
                  value={Payload.bp}
                  onChange={handlePayload}
                  id="bp"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Remark"
                  type="text"
                  value={Payload.remark}
                  onChange={handlePayload}
                  id="remark"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Followup"
                  type="text"
                  value={Payload.followup}
                  onChange={handlePayload}
                  id="followup"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Risk Identified"
                  type="text"
                  value={Payload.riskidentified}
                  onChange={handlePayload}
                  id="riskidentified"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Current Medication"
                  type="text"
                  value={Payload.currentmedication}
                  onChange={handlePayload}
                  id="currentmedication"
                />
              </SimpleGrid>

              <Button mt="32px" isLoading={Loading} onClick={handleSubmitNew}>
                Proceed
              </Button>
            </>
          ) : type === "edit" ? (
            <>
              <SimpleGrid
                mt="18px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="GA"
                  type="text"
                  value={UpdatedPayload.ga}
                  onChange={handleUpdatedPayload}
                  id="ga"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="SFH"
                  type="text"
                  value={UpdatedPayload.sfh}
                  onChange={handleUpdatedPayload}
                  id="sfh"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="WT"
                  type="text"
                  value={UpdatedPayload.wt}
                  onChange={handleUpdatedPayload}
                  id="wt"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="LIE"
                  type="text"
                  value={UpdatedPayload.lie}
                  onChange={handleUpdatedPayload}
                  id="lie"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Presentation"
                  type="text"
                  value={UpdatedPayload.presentation}
                  onChange={handleUpdatedPayload}
                  id="presentation"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Position"
                  type="text"
                  value={UpdatedPayload.position}
                  onChange={handleUpdatedPayload}
                  id="position"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="FHR"
                  type="text"
                  value={UpdatedPayload.fhr}
                  onChange={handleUpdatedPayload}
                  id="fhr"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Urine"
                  type="text"
                  value={UpdatedPayload.urine}
                  onChange={handleUpdatedPayload}
                  id="urine"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Bp"
                  type="text"
                  value={UpdatedPayload.bp}
                  onChange={handleUpdatedPayload}
                  id="bp"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Remark"
                  type="text"
                  value={UpdatedPayload.remark}
                  onChange={handleUpdatedPayload}
                  id="remark"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Followup"
                  type="text"
                  value={UpdatedPayload.followup}
                  onChange={handleUpdatedPayload}
                  id="followup"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Risk Identified"
                  type="text"
                  value={UpdatedPayload.riskidentified}
                  onChange={handleUpdatedPayload}
                  id="riskidentified"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Current Medication"
                  type="text"
                  value={UpdatedPayload.currentmedication}
                  onChange={handleUpdatedPayload}
                  id="currentmedication"
                />
              </SimpleGrid>

              <Button
                mt="32px"
                isLoading={Loading}
                onClick={handleSubmitUpdate}
              >
                Update
              </Button>
            </>
          ) : (
            <></>
          )}
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
