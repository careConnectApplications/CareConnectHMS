import { HStack, Text } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Stack, SimpleGrid
} from '@chakra-ui/react'
import Input from "./Input";
import TextArea from "./TextArea";
import Button from "./Button";
import { UpdateExaminedPatientAPI, TakeVitalApi } from "../Utils/ApiCalls";
import { FaTemperatureHigh, FaHeartCircleCheck  } from "react-icons/fa6";
import { FaTextHeight,FaHeartbeat  } from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";
import { GiEnergyBreath } from "react-icons/gi";
import { GiWeight } from "react-icons/gi";
import { TbMichelinStarFilled } from "react-icons/tb";

export default function VitalsModal({ isOpen, onClose, type, activateNotifications, oldPayload, onSuccess }) {


    let id = localStorage.getItem('appointmentId')

    const [Loading, setLoading] = useState(false);
    const [Payload, setPayload] = useState({

        height: "",
        weight: "",
        temperature:"",
        bloodpressuresystolic:"",
        bloodpressurediastolic:"",
        respiration:"",
        saturation:"",
        heartrate: "",
        status: "2"
    })
    const [UpdatedPayload, setUpdatedPayload] = useState({
        height: "",
        weight: "",
        temperature:"",
        bloodpressuresystolic:"",
        bloodpressurediastolic:"",
        respiration:"",
        saturation:"",
        bmi: "",
        heartrate: ""
    });

    const handleUpdatedPayload = (e) => {
        setUpdatedPayload({ ...UpdatedPayload, [e.target.id]: e.target.value })
    }
    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })
    }



    const CollectVitals = async () => {
        setLoading(true)
        try {
            const result = await TakeVitalApi(Payload, oldPayload?.vitals?._id);



            if (result.status === 200) {
                setLoading(false)
                setPayload({

                    findings: "",
                    diagnosis: "",
                    notes: ""
                })

                activateNotifications("Vitals Saved Successfully", "success")
                onClose()
                onSuccess();

            }

        } catch (e) {
            setLoading(false)
            onClose()
            activateNotifications(e.message, "error")
        }
    };

    const UpdateExamination = async () => {
        setLoading(true)
        try {
            const result = await UpdateExaminedPatientAPI(UpdatedPayload, oldPayload._id);

           
            if (result.status === 200) {
                setLoading(false)
                onClose()
                activateNotifications("Examination Updated Successfully", "success")

            }

        } catch (e) {
            setLoading(false)
            activateNotifications(e.message, "error")
        }
    };





    useEffect(() => {

        setUpdatedPayload({
            findings: oldPayload.findings,
            diagnosis: oldPayload.diagnosis,
            notes: oldPayload.notes

           
        })
    }, [isOpen]);

    return (

        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent maxW={{ base: "90%", md: "60%" }}  maxH="80vh"
          overflowY="auto">
                <ModalHeader> {type === "new" ? "Take Patient Vitals" : "Edit Examined Patient"} </ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                    {
                        type === "new" ? (
                            <>
                                <SimpleGrid mt="32px" columns={{ base: 1, md: 2 }} spacing={5}>
                                    <Input leftIcon={<FaTemperatureHigh />} label="Temperature (C)" value={Payload.temperature} onChange={handlePayload} id="temperature" />
                                    <Input leftIcon={<FaHeartbeat />} label="Heart Rate (bpm)" value={Payload.heartrate} onChange={handlePayload} id="heartrate" />
                                    <Input leftIcon={<MdBloodtype />} label="Blood Pressure (systolic)(mmHg)" value={Payload.bloodpressuresystolic} onChange={handlePayload} id="bloodpressuresystolic" />
                                    <Input leftIcon={<MdBloodtype />} label="Blood Pressure (Diastolic)(mmHg)" value={Payload.bloodpressurediastolic} onChange={handlePayload} id="bloodpressurediastolic" />
                                    <Input leftIcon={<GiEnergyBreath />} label="Respiration (bpm)" value={Payload.respiration} onChange={handlePayload} id="respiration" />
                                    <Input leftIcon={<FaHeartCircleCheck />} label="O2 Saturation (%)" value={Payload.saturation} onChange={handlePayload} id="saturation" />
                                    <Input leftIcon={<FaTextHeight />} label="Height (cm)" value={Payload.height} onChange={handlePayload} id="height" />
                                    <Input leftIcon={<GiWeight />} label="Weight (kg)" value={Payload.weight} onChange={handlePayload} id="weight" />
                                   
                                  
                                </SimpleGrid>

                                <Text color="red" mt="20px">Note: Please add at least one vital information </Text>
                                <Button mt="32px" onClick={CollectVitals} isLoading={Loading}>Submit</Button>

                            </>

                        ) : (
                            <>
                                <SimpleGrid mt="32px" columns={{ base: 1, md: 2 }} spacing={10}>
                                    <TextArea label="Findings" value={UpdatedPayload.findings} onChange={handleUpdatedPayload} id="findings" />
                                    <TextArea label="Diagnosis" value={UpdatedPayload.diagnosis} onChange={handleUpdatedPayload} id="diagnosis" />
                                    <TextArea label="Notes" value={UpdatedPayload.notes} onChange={handleUpdatedPayload} id="notes" />
                                </SimpleGrid>

                                <Button mt="32px" onClick={UpdateExamination} isLoading={Loading}>Update Examination</Button>
                            </>

                        )
                    }


                </ModalBody>

                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
