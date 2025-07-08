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
    Stack,
} from '@chakra-ui/react'
import Input from "./Input";
import Button from "./Button";
import { AddOutreachMedicationApi, UpdateOutreachMedicationApi, SettingsApi } from "../Utils/ApiCalls";
import { FaClinicMedical } from "react-icons/fa";

export default function CreateOutreachMedicationModal({ isOpen, onClose, type, activateNotifications, oldPayload }) {
    const [Settings, setSettings] = useState({});
    const [Loading, setLoading] = useState(false);
    const [Payload, setPayload] = useState({
        outreachmedicationname: "",
    });
    const [UpdatedPayload, setUpdatedPayload] = useState({
        outreachmedicationname: "",
    });

    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value });
    };

    const handleUpdatedPayload = (e) => {
        setUpdatedPayload({ ...UpdatedPayload, [e.target.id]: e.target.value });
    };

    const getSettings = async () => {
        try {
            const result = await SettingsApi();
            setSettings(result);
        } catch (e) {
            console.error("Failed to fetch settings:", e);
        }
    };

    const addOutreachMedication = async () => {
        setLoading(true);
        try {
            const result = await AddOutreachMedicationApi(Payload);

            if (result.status === 200) {
                setLoading(false);
                setPayload({
                    outreachmedicationname: "",
                });
                activateNotifications("Outreach Medication Added Successfully", "success");
                onClose();
            }
        } catch (e) {
            setLoading(false);
            activateNotifications(e.message, "error");
        }
    };

    const updateOutreachMedication = async () => {
        setLoading(true);
        try {
            const result = await UpdateOutreachMedicationApi(UpdatedPayload, oldPayload._id);

            if (result.status === 200) {
                setLoading(false);
                activateNotifications("Outreach Medication Updated Successfully", "success");
                onClose();
            }
        } catch (e) {
            setLoading(false);
            activateNotifications(e.message, "error");
        }
    };

    useEffect(() => {
        getSettings();
        if (type === "edit" && isOpen) {
            setUpdatedPayload({
                outreachmedicationname: oldPayload.outreachmedicationname || "",
            });
        }
    }, [isOpen, type, oldPayload]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    {type === "new" ? "Add New Outreach Medication" : "Edit Outreach Medication"}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {type === "new" ? (
                        <>
                            <Stack spacing="15px">
                                <Input
                                    val={Payload.outreachmedicationname !== "" ? true : false}
                                    leftIcon={<FaClinicMedical />}
                                    onChange={handlePayload}
                                    id="outreachmedicationname"
                                    value={Payload.outreachmedicationname}
                                    label="Outreach Medication Name"
                                />
                            </Stack>
                            <Button mt="32px" isLoading={Loading} onClick={addOutreachMedication}>
                                Add
                            </Button>
                        </>
                    ) : (
                        <>
                            <Stack spacing="15px">
                                <Input
                                    val={UpdatedPayload.outreachmedicationname !== "" ? true : false}
                                    leftIcon={<FaClinicMedical />}
                                    onChange={handleUpdatedPayload}
                                    id="outreachmedicationname"
                                    value={UpdatedPayload.outreachmedicationname}
                                    label="Outreach Medication Name"
                                />
                            </Stack>
                            <Button mt="32px" isLoading={Loading} onClick={updateOutreachMedication}>
                                Update
                            </Button>
                        </>
                    )}
                </ModalBody>
                <ModalFooter />
            </ModalContent>
        </Modal>
    );
}