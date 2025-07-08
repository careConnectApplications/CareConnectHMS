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
    AddANCFollowUpAPIv3,
    UpdateAncFollowupAPIv3,
    GetAllClinicApi,
    GetAllUsersApi,
} from "../Utils/ApiCalls";
import { FaArrowsToDot } from "react-icons/fa6";
import { AiFillDatabase } from "react-icons/ai";

export default function CreateANCFollowUpModalv3({
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

        heightoffundus: "",
        presentationandposition: "",
        presentingpart: "",
        foetalheight: "",
        bp: "",
        hb: "",
        protein: "",
        glucose: "",
        weight: "",
        oedema: "",
        tetanustoxoid: "",
        sulfadoxinepyrimethamine: "",
        albendazole: "",
        remark: ""
    });
    const [UpdatedPayload, setUpdatedPayload] = useState({
        heightoffundus: "",
        presentationandposition: "",
        presentingpart: "",
        foetalheight: "",
        bp: "",
        hb: "",
        protein: "",
        glucose: "",
        weight: "",
        oedema: "",
        tetanustoxoid: "",
        sulfadoxinepyrimethamine: "",
        albendazole: "",
        remark: ""
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
            const result = await AddANCFollowUpAPIv3(Payload, oldPayload._id);

            if (result.status === 200) {
                setLoading(false);
                setPayload({
                    heightoffundus: "",
                    presentationandposition: "",
                    presentingpart: "",
                    foetalheight: "",
                    bp: "",
                    hb: "",
                    protein: "",
                    glucose: "",
                    weight: "",
                    oedema: "",
                    tetanustoxoid: "",
                    sulfadoxinepyrimethamine: "",
                    albendazole: "",
                    remark: ""
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
            const result = await UpdateAncFollowupAPIv3(UpdatedPayload, oldPayload._id);

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
        } catch (e) { }
    };

    const getAllClinic = async () => {
        try {
            const result = await GetAllClinicApi();
            setClinics(result.queryresult.clinicdetails);
        } catch (e) { }
    };
    const getAllUser = async () => {
        try {
            const result = await GetAllUsersApi();

            setDoctors(result.queryresult.userdetails);
        } catch (e) { }
    };

    useEffect(() => {
        getAllUser();
        getAllClinic();
        getSettings();

        setUpdatedPayload({
            heightoffundus: oldPayload?.heightoffundus,
            presentationandposition: oldPayload?.presentationandposition,
            presentingpart: oldPayload?.presentingpart,
            foetalheight: oldPayload?.foetalheight,
            bp: oldPayload?.bp,
            hb: oldPayload?.hb,
            protein: oldPayload?.protein,
            glucose: oldPayload?.glucose,
            weight: oldPayload?.weight,
            oedema: oldPayload?.oedema,
            tetanustoxoid: oldPayload?.tetanustoxoid,
            sulfadoxinepyrimethamine: oldPayload?.sulfadoxinepyrimethamine,
            albendazole: oldPayload?.albendazole,
            remark: oldPayload?.remark,
           
           
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
                                    label="Height of fundus"
                                    type="text"
                                    value={Payload.heightoffundus}
                                    onChange={handlePayload}
                                    id="heightoffundus"
                                />
                                <Input
                                    leftIcon={<FaNoteSticky />}
                                    label="Presentation and position"
                                    type="text"
                                    value={Payload.presentationandposition}
                                    onChange={handlePayload}
                                    id="presentationandposition"
                                />
                                <Input
                                    leftIcon={<FaNoteSticky />}
                                    label="Presenting part"
                                    type="text"
                                    value={Payload.presentingpart}
                                    onChange={handlePayload}
                                    id="presentingpart"
                                />
                                <Input
                                    leftIcon={<FaNoteSticky />}
                                    label="Foetal height"
                                    type="text"
                                    value={Payload.foetalheight}
                                    onChange={handlePayload}
                                    id="foetalheight"
                                />
                                <Input
                                    leftIcon={<FaNoteSticky />}
                                    label="BP"
                                    type="text"
                                    value={Payload.bp}
                                    onChange={handlePayload}
                                    id="bp"
                                />
                                <Input
                                    leftIcon={<FaNoteSticky />}
                                    label="HB"
                                    type="text"
                                    value={Payload.hb}
                                    onChange={handlePayload}
                                    id="hb"
                                />
                                <Input
                                    leftIcon={<FaNoteSticky />}
                                    label="Protein"
                                    type="text"
                                    value={Payload.protein}
                                    onChange={handlePayload}
                                    id="protein"
                                />
                                <Input
                                    leftIcon={<FaNoteSticky />}
                                    label="Glucose"
                                    type="text"
                                    value={Payload.glucose}
                                    onChange={handlePayload}
                                    id="glucose"
                                />
                                <Input
                                    leftIcon={<FaNoteSticky />}
                                    label="Weight"
                                    type="text"
                                    value={Payload.weight}
                                    onChange={handlePayload}
                                    id="weight"
                                />
                                <Input
                                    leftIcon={<FaNoteSticky />}
                                    label="Oedema"
                                    type="text"
                                    value={Payload.oedema}
                                    onChange={handlePayload}
                                    id="oedema"
                                />
                                <Input
                                    leftIcon={<FaNoteSticky />}
                                    label="Tetanus toxoid"
                                    type="text"
                                    value={Payload.tetanustoxoid}
                                    onChange={handlePayload}
                                    id="tetanustoxoid"
                                />
                                <Input
                                    leftIcon={<FaNoteSticky />}
                                    label="Sulfadoxine pyrimethamine"
                                    type="text"
                                    value={Payload.sulfadoxinepyrimethamine}
                                    onChange={handlePayload}
                                    id="sulfadoxinepyrimethamine"
                                />
                                <Input
                                    leftIcon={<FaNoteSticky />}
                                    label="Albendazole"
                                    type="text"
                                    value={Payload.albendazole}
                                    onChange={handlePayload}
                                    id="albendazole"
                                />
                                <Input
                                    leftIcon={<FaNoteSticky />}
                                    label="remark"
                                    type="text"
                                    value={Payload.remark}
                                    onChange={handlePayload}
                                    id="remark"
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
                                    label="Height of fundus"
                                    type="text"
                                    value={UpdatedPayload.heightoffundus}
                                    onChange={handleUpdatedPayload}
                                    id="heightoffundus"
                                />
                                <Input
                                    leftIcon={<FaNoteSticky />}
                                    label="Presentation and position"
                                    type="text"
                                    value={UpdatedPayload.presentationandposition}
                                    onChange={handleUpdatedPayload}
                                    id="presentationandposition"
                                />
                                <Input
                                    leftIcon={<FaNoteSticky />}
                                    label="Presenting part"
                                    type="text"
                                    value={UpdatedPayload.presentingpart}
                                    onChange={handleUpdatedPayload}
                                    id="presentingpart"
                                />
                                <Input
                                    leftIcon={<FaNoteSticky />}
                                    label="Foetal height"
                                    type="text"
                                    value={UpdatedPayload.foetalheight}
                                    onChange={handleUpdatedPayload}
                                    id="foetalheight"
                                />
                                <Input
                                    leftIcon={<FaNoteSticky />}
                                    label="BP"
                                    type="text"
                                    value={UpdatedPayload.bp}
                                    onChange={handleUpdatedPayload}
                                    id="bp"
                                />
                                <Input
                                    leftIcon={<FaNoteSticky />}
                                    label="HB"
                                    type="text"
                                    value={UpdatedPayload.hb}
                                    onChange={handleUpdatedPayload}
                                    id="hb"
                                />
                                <Input
                                    leftIcon={<FaNoteSticky />}
                                    label="Protein"
                                    type="text"
                                    value={UpdatedPayload.protein}
                                    onChange={handleUpdatedPayload}
                                    id="protein"
                                />
                                <Input
                                    leftIcon={<FaNoteSticky />}
                                    label="Glucose"
                                    type="text"
                                    value={UpdatedPayload.glucose}
                                    onChange={handleUpdatedPayload}
                                    id="glucose"
                                />
                                <Input
                                    leftIcon={<FaNoteSticky />}
                                    label="Weight"
                                    type="text"
                                    value={UpdatedPayload.weight}
                                    onChange={handleUpdatedPayload}
                                    id="weight"
                                />
                                <Input
                                    leftIcon={<FaNoteSticky />}
                                    label="Oedema"
                                    type="text"
                                    value={UpdatedPayload.oedema}
                                    onChange={handleUpdatedPayload}
                                    id="oedema"
                                />
                                <Input
                                    leftIcon={<FaNoteSticky />}
                                    label="Tetanus toxoid"
                                    type="text"
                                    value={UpdatedPayload.tetanustoxoid}
                                    onChange={handleUpdatedPayload}
                                    id="tetanustoxoid"
                                />
                                <Input
                                    leftIcon={<FaNoteSticky />}
                                    label="Sulfadoxine pyrimethamine"
                                    type="text"
                                    value={UpdatedPayload.sulfadoxinepyrimethamine}
                                    onChange={handleUpdatedPayload}
                                    id="sulfadoxinepyrimethamine"
                                />
                                <Input
                                    leftIcon={<FaNoteSticky />}
                                    label="Albendazole"
                                    type="text"
                                    value={UpdatedPayload.albendazole}
                                    onChange={handleUpdatedPayload}
                                    id="albendazole"
                                />
                                <Input
                                    leftIcon={<FaNoteSticky />}
                                    label="remark"
                                    type="text"
                                    value={UpdatedPayload.remark}
                                    onChange={handleUpdatedPayload}
                                    id="remark"
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
