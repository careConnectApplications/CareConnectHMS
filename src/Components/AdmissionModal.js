import { HStack, Radio, RadioGroup, Text } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Stack, SimpleGrid, Select, Flex
} from '@chakra-ui/react'
import Input from "./Input";
import Button from "./Button";
import DiagnosisCard from "./DiagnosisCard";
import { FaNoteSticky } from "react-icons/fa6";
import { IoColorFilter } from "react-icons/io5";
import { SettingsApi, GetAllWardApi, AdmitPatientApi } from "../Utils/ApiCalls";
import { FaArrowsToDot } from "react-icons/fa6";
import { AiFillDatabase } from "react-icons/ai";
import { FaCalendarAlt } from "react-icons/fa";
import { SlPlus } from "react-icons/sl";

export default function AdmissionModal({ isOpen, onClose, setOldPayload, activateNotifications, oldPayload }) {

    const [Loading, setLoading] = useState(false);
    const [Settings, setSettings] = useState("");
    const [Data, setData] = useState([]);

    const date = Date.now()
    const currentDate = new Date(date).toISOString().split('T')[0]

    const [Payload, setPayload] = useState({
        alldiagnosis: [],
        referedward: "",
        admittospecialization: "",
        referddate: currentDate
    })

    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })
    }

    const getAllWard = async () => {
        try {
            const result = await GetAllWardApi();
            setData(result.queryresult.wardmanagementdetails);
        } catch (e) {
            activateNotifications(e.message, "error");
        }
    };

    const save = async () => {
        try {
            // Retrieve patientId from local storage.
            const patientId = localStorage.getItem("patientId");

            // Add appointmentid to the body payload.
            const payloadWithAppointment = { ...Payload, appointmentid: oldPayload.appointmentid };

            // Patient id is passed as request parameter.
            let result = await AdmitPatientApi(payloadWithAppointment, patientId);

            if (result.status === 200) {
                setLoading(false)
                onClose()
                setPayload({
                    alldiagnosis: [],
                    referedward: "",
                    admittospecialization: "",
                    referddate: currentDate
                })
                activateNotifications("Patient Admitted Successfully", "success")
            }
        } catch (e) {
            setLoading(false)
            activateNotifications(e.message, "error")
        }
    }

    const getSettings = async () => {
        try {
            const result = await SettingsApi();
            setSettings(result);
        } catch (e) {
            // Handle error if required.
        }
    };

    useEffect(() => {
        getSettings()
        getAllWard()
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent maxW={{ base: "90%", md: "60%" }} maxH="80vh" overflowY="auto">
                <ModalHeader> In Patient Admission </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex justifyContent={"flex-end"} mb="15px">
                        <Button
                            w="150px"
                            rightIcon={<SlPlus />}
                            onClick={() => setPayload({
                                ...Payload,
                                alldiagnosis: [...Payload.alldiagnosis, {
                                    note: "",
                                    diagnosis: ""
                                }]
                            })}
                        >
                            Add Diagnosis
                        </Button>
                    </Flex>

                    {Payload.alldiagnosis.map((item, i) => (
                        <DiagnosisCard data={item} oldItem={Payload.alldiagnosis} Payload={Payload} setPayload={setPayload} key={i} i={i} />
                    ))}

                    <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                        <Input leftIcon={<FaCalendarAlt />} isDisabled={true} label="Referred Date" type='date' value={Payload.referddate} onChange={handlePayload} id="referddate" />

                        <Select
                            h="45px"
                            borderWidth="2px"
                            fontSize={Payload.admittospecialization !== "" ? "16px" : "13px"}
                            borderColor="#6B7280"
                            id="admittospecialization"
                            value={Payload.admittospecialization}
                            onChange={handlePayload}
                            placeholder="Admit to specialization"
                        >
                            {Settings?.clinics?.map((item, i) => (
                                <option value={`${item.clinic}`} key={i}>{item.clinic}</option>
                            ))}
                        </Select>

                        <Select
                            h="45px"
                            borderWidth="2px"
                            fontSize={Payload.referedward !== "" ? "16px" : "13px"}
                            borderColor="#6B7280"
                            id="referedward"
                            value={Payload.referedward}
                            onChange={handlePayload}
                            placeholder="Select Referred Ward"
                        >
                            {Data?.map((item, i) => (
                                <option value={`${item._id}`} key={i}>{item.wardname}</option>
                            ))}
                        </Select>
                    </SimpleGrid>

                    <Button mt="32px" isLoading={Loading} onClick={save}>Proceed</Button>
                </ModalBody>

                <ModalFooter>
                   
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
