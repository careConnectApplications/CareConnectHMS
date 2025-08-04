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
    Stack, Select
} from '@chakra-ui/react'
import Input from "./Input";
import Button from "./Button";
import { UpdatePriceSettingAPI, SettingsApi, AddPriceSettingsApi } from "../Utils/ApiCalls";
import { MdMiscellaneousServices } from "react-icons/md";
import { FaMoneyBill } from "react-icons/fa";

export default function CreatePriceModal({ isOpen, onClose, type, activateNotifications, oldPayload }) {



    const [Settings, setSettings] = useState({});
    const [Loading, setLoading] = useState(false);
    const [Payload, setPayload] = useState({
        servicecategory: "",
        amount: "",
        percentageofhmocover: "",
        servicetype: ""
    });
    const [UpdatedPayload, setUpdatedPayload] = useState({
        servicecategory: "",
        amount: "",
        percentageofhmocover: "",
        servicetype: ""
    });

    const handleUpdatedPayload = (e) => {
        setUpdatedPayload({ ...UpdatedPayload, [e.target.id]: e.target.value })
    }
    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })
    }



    const getSettings = async () => {
        try {
            const result = await SettingsApi();


            let checker = result?.servicecategory?.filter(item => item.category === "Appointment")

            setSettings(result);
        } catch (e) {

        }
    };

    const AddPrice = async () => {
        setLoading(true)
        try {
            const result = await AddPriceSettingsApi(Payload);

            if (result.status === 200) {
                setLoading(false)
                setPayload({
                    servicecategory: "",
                    amount: "",
                    servicetype: ""
                })

                activateNotifications("Price Added Successfully", "success")
                onClose()

            }

        } catch (e) {
            setLoading(false)
            activateNotifications(e.message, "error")
        }
    };
    const UpdatePrice = async () => {
        setLoading(true)
        try {
            const result = await UpdatePriceSettingAPI(UpdatedPayload, oldPayload._id);


            if (result.status === 200) {
                setLoading(false)
                activateNotifications("Price Updated Successfully", "success")
                onClose()

            }

        } catch (e) {
            setLoading(false)
            activateNotifications(e.message, "error")
        }
    };





    useEffect(() => {



        getSettings();
        setUpdatedPayload({
            servicecategory: oldPayload.servicecategory,
            amount: oldPayload.amount,
            servicetype: oldPayload.servicetype,
            percentageofhmocover: oldPayload.percentageofhmocover
        })
    }, [isOpen]);

    return (

        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{type === "new" ? "Add new Price" : "Edit Price"}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>


                    {
                        type === "new" ? (
                            <>
                                <Stack spacing="15px">

                                    <Select

                                        onChange={handlePayload}
                                        placeholder="Select Service Category"
                                        id="servicecategory" value={Payload.servicecategory}
                                        fontSize={Payload.servicecategory !== "" ? "16px" : "13px"}
                                        size="lg"
                                        border="2px solid"
                                        borderColor="gray.500"
                                    >
                                        {
                                            Settings?.servicecategory?.map((item, i) => (

                                                <option key={i} value={item.category}>{item.category}</option>
                                            ))
                                        }

                                    </Select>

                                    {
                                        Payload.servicecategory !== "" && (
                                            <Select

                                                onChange={handlePayload}
                                                placeholder="Select Service Type"
                                                border="2px solid"
                                                id="servicetype" value={Payload.servicetype}
                                                size="lg"
                                                fontSize={Payload.servicetype !== "" ? "16px" : "13px"}
                                                borderColor="gray.500"
                                            >
                                                {
                                                    Settings?.servicecategory?.filter(item => item.category === Payload.servicecategory)[0]?.type?.map((item, i) => (
                                                        <option key={i} value={item}>{item}</option>
                                                    )



                                                    )
                                                }

                                            </Select>
                                        )
                                    }

                                    <Input val={Payload.amount !== "" ? true : false} leftIcon={<FaMoneyBill />} onChange={handlePayload} id="amount" value={Payload.amount} label="Amount" />
                                    <Input val={Payload.percentageofhmocover !== "" ? true : false} leftIcon={<FaMoneyBill />} onChange={handlePayload} id="percentageofhmocover" value={Payload.percentageofhmocover} label="HMO % cover" />
                                   
                                </Stack>
                                <Button mt="32px" isLoading={Loading} onClick={AddPrice}>Add Price</Button>
                            </>
                        ) : (
                            <>
                                <Stack spacing="15px">

                                    <Select

                                        onChange={handleUpdatedPayload}
                                        placeholder="Select Service Category"
                                        border="2px solid"
                                        id="servicecategory" value={UpdatedPayload.servicecategory}
                                        size="lg"
                                        fontSize={UpdatedPayload.servicecategory !== "" ? "16px" : "13px"}
                                        borderColor="gray.500"
                                    >
                                        {
                                            Settings?.servicecategory?.map((item, i) => (

                                                <option key={i} value={item.category}>{item.category}</option>
                                            ))
                                        }

                                    </Select>

                                    {
                                        UpdatedPayload.servicecategory !== "" && (
                                            <Select

                                                onChange={handleUpdatedPayload}
                                                placeholder="Select Service Type"
                                                border="2px solid"
                                                id="servicetype" value={UpdatedPayload.servicetype}
                                                size="lg"
                                                fontSize={UpdatedPayload.servicetype !== "" ? "16px" : "13px"}
                                                borderColor="gray.500"
                                            >
                                                {
                                                    Settings?.servicecategory?.filter(item => item.category === UpdatedPayload.servicecategory)[0]?.type?.map((item, i) => (
                                                        <option key={i} value={item}>{item}</option>
                                                    )



                                                    )
                                                }

                                            </Select>
                                        )
                                    }

                                    <Input val={UpdatedPayload.amount !== "" ? true : false} leftIcon={<FaMoneyBill />} onChange={handleUpdatedPayload} id="amount" value={UpdatedPayload.amount} label="Amount" />
                                    <Input val={UpdatedPayload.percentageofhmocover !== "" ? true : false} leftIcon={<FaMoneyBill />} onChange={handleUpdatedPayload} id="percentageofhmocover" value={UpdatedPayload.percentageofhmocover} label="Hmo % cover" />
                                    
                                </Stack>
                                <Button mt="32px" isLoading={Loading} onClick={UpdatePrice}>Update Price</Button>
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
