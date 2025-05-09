import { Text, Box, Flex, Stack, SimpleGrid } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";
import Button from "../Components/Button";
import Input from "../Components/Input";
import TextArea from "../Components/TextArea";
import ShowToast from "../Components/ToastNotification";
import TheatrePreAnathetics from "./TheatrePreAnathetics";

import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io"; import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react'
import { EditPreAnatheticsAPI } from "../Utils/ApiCalls";
import { FaNoteSticky } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { useParams } from 'react-router-dom';

export default function EditPreAnathetics() {
    const { id } = useParams()
    const [Complaints, setComplaints] = useState([]);
    const [DrugHistory, setDrugHistory] = useState([]);
    const [PhysicalExamination, setPhysicalExamination] = useState([]);
    const [PlanNotes, setPlanNotes] = useState([]);
    const [Loading, setLoading] = useState(false);
    const [Payload, setPayload] = useState({

        pastmedicalhistory: "",
        presentmedicalhistory: "",
        anaestheticmedicalhistory: "",
        drugshistory: "",
        dentalhistory: "",
        familyhistory: "",
        physicalexamination: "",
        airwayassessment: "",
        mouth: "",
        neck: "",
        throidmentaldish: "",
        malamphaticscore: "",
        plan: ""


    })





    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })
        if (e.target.id === "presentingcompalintcode") {

            setComplaints([...Complaints, e.target.value])
        }
    }


    const addDrugHistory = () => {
        setDrugHistory([...DrugHistory, Payload.drugshistory])
        setPayload({ ...Payload, drugshistory: "" })
    }
    const addPhysicalExamination = () => {
        setPhysicalExamination([...PhysicalExamination, Payload.physicalexamination])
        setPayload({ ...Payload, physicalexamination: "" })
    }

    const addPlanNotes = () => {
        setPlanNotes([...PlanNotes, Payload.plan])
        setPayload({ ...Payload, plan: "" })
    }





    const removePhysicalExamination = (item) => {


        const updatedItems = PhysicalExamination.filter(id => id !== item);
        setPhysicalExamination(updatedItems);


    }

    const removeDrugHistory = (item) => {


        const updatedItems = DrugHistory.filter(id => id !== item);
        setDrugHistory(updatedItems);
    }

    const removePlanNotes = (item) => {


        const updatedItems = PlanNotes.filter(id => id !== item);
        setPlanNotes(updatedItems);
    }

    const [showToast, setShowToast] = useState({
        show: false,
        message: "",
        status: "",
    });

    const activateNotifications = (message, status) => {

        setShowToast({
            show: true,
            message: message,
            status: status,
        });

        setTimeout(() => {
            setShowToast({
                show: false,
            });

        }, 5000)
    }


    let pathName = localStorage.getItem("pathname");

    const handleSubmit = async () => {

        setLoading(true)
        try {
            const result = await EditPreAnatheticsAPI(
                {
                    ...Payload,
                    physicalexamination: PhysicalExamination,
                    drugshistory: DrugHistory,
                    plan: PlanNotes,
                }, id);


            if (result.status === 200) {
                setLoading(false)
                activateNotifications("Updated Successfully", "success")

                setTimeout(() => {
                   nav(`${pathName}`)
                }, 2000);
           

            }

        } catch (e) {
            setLoading(false)
            activateNotifications(e.message, "error")
        }
    }


const  oldRecord = JSON.parse(localStorage.getItem("oldRecord"))

    useEffect(() => {

        setPayload(
            {
                pastmedicalhistory: oldRecord.pastmedicalhistory,
                presentmedicalhistory: oldRecord.presentmedicalhistory,
                anaestheticmedicalhistory: oldRecord.anaestheticmedicalhistory,
                dentalhistory: oldRecord.dentalhistory,
                familyhistory: oldRecord.familyhistory,
                airwayassessment: oldRecord.airwayassessment,
                mouth: oldRecord.mouth,
                neck: oldRecord.neck,
                throidmentaldish: oldRecord.throidmentaldish,
                malamphaticscore: oldRecord.malamphaticscore
               
            }
        )

        setDrugHistory(oldRecord.drugshistory)
        setPhysicalExamination(oldRecord.physicalexamination)
        setPlanNotes(oldRecord.plan)

    }, []);



    const nav = useNavigate()

    const pathname = localStorage.getItem("pathname")
    return (
        <MainLayout>
            {showToast.show && (
                <ShowToast message={showToast.message} status={showToast.status} />
            )}
            <Seo title="Pre Anathetics " description="Care connect Theatre  Pre Anathetics" />

            <Box>
                <Button leftIcon={<IoMdArrowRoundBack />} px="40px" w="100px" onClick={() => nav(`${pathname}`)}>Back</Button>

                <Accordion  mt="32px" allowToggle>
              
                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                History
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <SimpleGrid mt="32px" columns={{ base: 1, md: 2 }} spacing={5}>
                                <Input type="text" leftIcon={<FaNoteSticky />} label="Past Medical History" value={Payload.pastmedicalhistory} val={Payload.pastmedicalhistory !== "" ? true : false} onChange={handlePayload} id="pastmedicalhistory" />
                                <Input type="text" leftIcon={<FaNoteSticky />} label="Present Medical History" value={Payload.presentmedicalhistory} val={Payload.presentmedicalhistory !== "" ? true : false} onChange={handlePayload} id="presentmedicalhistory" />
                                <Input type="text" leftIcon={<FaNoteSticky />} label="Anaesthetic Medical History" value={Payload.anaestheticmedicalhistory} val={Payload.anaestheticmedicalhistory !== "" ? true : false} onChange={handlePayload} id="anaestheticmedicalhistory" />
                                <Input type="text" leftIcon={<FaNoteSticky />} label="Dental History" value={Payload.dentalhistory} val={Payload.dentalhistory !== "" ? true : false} onChange={handlePayload} id="dentalhistory" />
                                <Input type="text" leftIcon={<FaNoteSticky />} label="Family History" value={Payload.familyhistory} val={Payload.familyhistory !== "" ? true : false} onChange={handlePayload} id="familyhistory" />


                            </SimpleGrid>

                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                Drug History
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <Stack spacing={4} pt="10">

                                <TextArea label="Drug History Note" value={Payload.drugshistory} onChange={handlePayload} id="drugshistory" />


                            </Stack>
                            <Flex justifyContent={"flex-end"} mt="2">
                                <Button

                                    onClick={addDrugHistory}

                                    w={["100%", "100%", "184px", "184px"]}

                                >
                                    Add
                                </Button>
                            </Flex>



                            <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>

                                {
                                    DrugHistory?.map((item, i) => (

                                        <Flex key={i} cursor="pointer" px="10px" py="10px" rounded={"20px"} fontSize="12px" _hover={{ bg: "blue.blue400" }} bg="blue.blue500" w="100%" justifyContent="space-between" alignItems="center" >
                                            <Text color="#fff" fontWeight="500" textTransform="capitalize" >{item}</Text>
                                            <Box fontSize="20px" color="#fff" onClick={() => removeDrugHistory(item)}><IoIosCloseCircle /></Box>
                                        </Flex>
                                    ))
                                }

                            </SimpleGrid>


                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                Physical Examination
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <Stack spacing={4} pt="10">

                                <TextArea label="Physical Examination Note" value={Payload.physicalexamination} onChange={handlePayload} id="physicalexamination" />


                            </Stack>
                            <Flex justifyContent={"flex-end"} mt="2">
                                <Button

                                    onClick={addPhysicalExamination}

                                    w={["100%", "100%", "184px", "184px"]}

                                >
                                    Add
                                </Button>
                            </Flex>



                            <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>

                                {
                                    PhysicalExamination?.map((item, i) => (

                                        <Flex key={i} cursor="pointer" px="10px" py="10px" rounded={"20px"} fontSize="12px" _hover={{ bg: "blue.blue400" }} bg="blue.blue500" w="100%" justifyContent="space-between" alignItems="center" >
                                            <Text color="#fff" fontWeight="500" textTransform="capitalize" >{item}</Text>
                                            <Box fontSize="20px" color="#fff" onClick={() => removePhysicalExamination(item)}><IoIosCloseCircle /></Box>
                                        </Flex>
                                    ))
                                }

                            </SimpleGrid>


                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                Assessment
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <SimpleGrid mt="32px" columns={{ base: 1, md: 2 }} spacing={5}>
                                <Input type="text" leftIcon={<FaNoteSticky />} label="Airway Assessment" value={Payload.airwayassessment} val={Payload.airwayassessment !== "" ? true : false} onChange={handlePayload} id="airwayassessment" />
                                <Input type="text" leftIcon={<FaNoteSticky />} label="Mouth" value={Payload.mouth} val={Payload.mouth !== "" ? true : false} onChange={handlePayload} id="mouth" />
                                <Input type="text" leftIcon={<FaNoteSticky />} label="Neck" value={Payload.neck} val={Payload.neck !== "" ? true : false} onChange={handlePayload} id="neck" />
                                <Input type="text" leftIcon={<FaNoteSticky />} label="Throid Mental dish" value={Payload.throidmentaldish} val={Payload.throidmentaldish !== "" ? true : false} onChange={handlePayload} id="throidmentaldish" />
                                <Input type="text" leftIcon={<FaNoteSticky />} label="Malamphatic Score" value={Payload.malamphaticscore} val={Payload.malamphaticscore !== "" ? true : false} onChange={handlePayload} id="malamphaticscore" />

                            </SimpleGrid>

                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                Plan Notes
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <Stack spacing={4} pt="10">

                                <TextArea label=" Plan Note" value={Payload.plan} onChange={handlePayload} id="plan" />


                            </Stack>
                            <Flex justifyContent={"flex-end"} mt="2">
                                <Button

                                    onClick={addPlanNotes}

                                    w={["100%", "100%", "184px", "184px"]}

                                >
                                    Add
                                </Button>
                            </Flex>



                            <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>

                                {
                                    PlanNotes?.map((item, i) => (

                                        <Flex key={i} cursor="pointer" px="10px" py="10px" rounded={"20px"} fontSize="12px" _hover={{ bg: "blue.blue400" }} bg="blue.blue500" w="100%" justifyContent="space-between" alignItems="center" >
                                            <Text color="#fff" fontWeight="500" textTransform="capitalize" >{item}</Text>
                                            <Box fontSize="20px" color="#fff" onClick={() => removePlanNotes(item)}><IoIosCloseCircle /></Box>
                                        </Flex>
                                    ))
                                }

                            </SimpleGrid>


                        </AccordionPanel>
                    </AccordionItem>


                </Accordion>

                <Flex justifyContent="center">

                    <Flex
                        justifyContent="center"
                        flexWrap="wrap"
                        mt={["10px", "10px", "10px", "10px"]}
                        w={["100%", "100%"]}
                    >

                        <Button
                            w={["100%", "100%", "184px", "184px"]}
                            onClick={handleSubmit}
                            isLoading={Loading}


                        >
                            Update
                        </Button>


                    </Flex>
                </Flex>


            </Box>
        </MainLayout>
    )
}
