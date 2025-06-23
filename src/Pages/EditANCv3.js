import { HStack, Text, Box, Flex, Select, Stack, useDisclosure, SimpleGrid, Tooltip } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";
import Button from "../Components/Button";
import Input from "../Components/Input";
import TextArea from "../Components/TextArea";
import ShowToast from "../Components/ToastNotification";
import ANC3 from "./ANC3";
import PreviousPregnancyModal from "../Components/PreviousPregnancyModal";
import GeneralMedicalHistoryModalv2 from "../Components/GeneralMedicalHistoryModalv2";
import PreviewANC from "../Components/PreviewANC";
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon, RadioGroup, Radio
} from '@chakra-ui/react'
import { SettingsApi, EditAncV3API } from "../Utils/ApiCalls";
import { FaNoteSticky } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { MdDateRange } from "react-icons/md";
import { useParams } from 'react-router-dom';

export default function AddANCv3() {
    const { id } = useParams()
    const [Settings, setSettings] = useState({});
    const [OpenObstetricHistoryModal, setOpenObstetricHistoryModal] = useState(false);
    const [OpenGeneralMedicalHistoryModal, setOpenGeneralMedicalHistoryModal] = useState(false);
    const [OpenPreview, setOpenPreview] = useState(false);
    const [PostMedicalHistory, setPostMedicalHistory] = useState([]);
    const [HistoryPresentPregnancy, setHistoryPresentPregnancy] = useState([]);
    const [HistoryIndexPreg, setHistoryIndexPreg] = useState([]);
    const [GyneHistory, setGyneHistory] = useState([]);
    const [PastSurgicalHistory, setPastSurgicalHistory] = useState([]);
    const [DrugHistory, setDrugHistory] = useState([]);
    const [FamilySocialHistory, setFamilySocialHistory] = useState([]);
    const [SystematicReview, setSystematicReview] = useState([]);
    const [Summary, setSummary] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ModalState, setModalState] = useState("");
    const [Disabled, setDisabled] = useState(true);
    const [Loading, setLoading] = useState(false);
    const [LoadingCompleted, setLoadingCompleted] = useState(false);

    const [Payload, setPayload] = useState({

        lmp: "",
        edd: "",
        gravidity: "",
        cycle: "",
        breasts: "",
        height: "",
        cvs: "",
        rs: "",
        pelvis: "",
        abdomen: "",
    })

const OldPayload = JSON.parse(localStorage.getItem("ANCv3"))


    const handleSuccess = (message, status) => {
        setShowToast({ show: true, message, status });
        setTimeout(() => {
            setShowToast({ show: false, message: "", status: "" });
        }, 3000);

    };

    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

    }

    const addPostMedicalHistory = () => {
        setPostMedicalHistory([...PostMedicalHistory, Payload.postmedicalorsurgicalhistory])
        setPayload({ ...Payload, postmedicalorsurgicalhistory: "" })
    }
    const addHistoryPresentPregnancy = () => {
        setHistoryPresentPregnancy([...HistoryPresentPregnancy, Payload.historyofpresentpregnancy])
        setPayload({ ...Payload, historyofpresentpregnancy: "" })
    }
   



    const getSettings = async () => {
        try {
            const result = await SettingsApi();
            let checker = result?.servicecategory?.filter(item => item.category === "Appointment")
            setSettings(result);
        } catch (e) {

        }
    };

    const removePostMedicalHistory = (item) => {


        const updatedPostMedicalHistory = PostMedicalHistory.filter(id => id !== item);
        setPostMedicalHistory(updatedPostMedicalHistory);
    }
    const removeHistoryPresentPregnancy = (item) => {


        const updatedItems = HistoryPresentPregnancy.filter(id => id !== item);
        setHistoryPresentPregnancy(updatedItems);
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


    const handleCompleted = async () => {
        setLoadingCompleted(true)
        try {
            const result = await EditAncV3API({
                ...Payload,
                postmedicalorsurgicalhistory: PostMedicalHistory,
                historyofpresentpregnancy: HistoryPresentPregnancy,
               
            }, OldPayload?._id);


            if (result.status === 200) {
                setLoadingCompleted(false)
                activateNotifications("ANC Updated Successfully. Redirecting...", "success")

                setTimeout(() => {
                    nav(`${pathName}`)

                }, 3000)


            }

        } catch (e) {
            setLoadingCompleted(false)
            activateNotifications(e.message, "error")
        }
    }

    

  
    useEffect(() => {

        setPayload({

        lmp: OldPayload?.pregnancysummary?.lmp,
        edd: OldPayload?.pregnancysummary?.edd,
        gravidity: OldPayload?.pregnancysummary?.gravidity,
        cycle: OldPayload?.generalexamination?.cycle,
        breasts: OldPayload?.generalexamination?.breasts,
        height: OldPayload?.generalexamination?.height,
        cvs: OldPayload?.generalexamination?.cvs,
        rs: OldPayload?.generalexamination?.rs,
        pelvis: OldPayload?.generalexamination?.pelvis,
        abdomen: OldPayload?.generalexamination?.abdomen,
        previouspregnancy: OldPayload?.previouspregnancy,

    })

       setPostMedicalHistory(OldPayload?.postmedicalorsurgicalhistory)
       setHistoryPresentPregnancy(OldPayload?.historyofpresentpregnancy)

       

    }, []);



    const nav = useNavigate()

    const pathname = localStorage.getItem("pathname")
    return (
        <MainLayout>
            {showToast.show && (
                <ShowToast message={showToast.message} status={showToast.status} />
            )}
            <Seo title="Create ANC" description="Care connect  ANC Creation " />

            <Box>
                <Button leftIcon={<IoMdArrowRoundBack />} px="40px" w="100px" onClick={() => nav(`${pathname}`)}>Back</Button>

                <Accordion defaultIndex={[2]} mt="32px" allowToggle>
                    <AccordionItem mb="15px" >

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                Previous ANC
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px" >
                            <ANC3 hide={true} />
                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                               General Examination
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <Stack spacing={4}>



                               
                                <Input leftIcon={<FaNoteSticky />} label="Cycle" value={Payload.cycle} val={Payload.cycle !=="" ? true: false} onChange={handlePayload} id="cycle" />
                                <Input leftIcon={<FaNoteSticky />} label="Breasts" value={Payload.breasts} val={Payload.breasts !=="" ? true: false} onChange={handlePayload} id="breasts" />
                                <Input leftIcon={<FaNoteSticky />} label="Height" value={Payload.height} val={Payload.height !=="" ? true: false} onChange={handlePayload} id="height" />

                                <Input leftIcon={<FaNoteSticky />} label="CVS" value={Payload.cvs} val={Payload.cvs !=="" ? true: false} onChange={handlePayload} id="cvs" />
                                <Input leftIcon={<FaNoteSticky />} label="RS" value={Payload.rs} val={Payload.rs !=="" ? true: false} onChange={handlePayload} id="rs" />
                                <Input leftIcon={<FaNoteSticky />} label="Pelvis" value={Payload.pelvis} val={Payload.pelvis !=="" ? true: false} onChange={handlePayload} id="pelvis" />
                                <Input leftIcon={<FaNoteSticky />} label="Abdomen" value={Payload.abdomen} val={Payload.abdomen !=="" ? true: false} onChange={handlePayload} id="abdomen" />







                            </Stack>


                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                              Pregnancy Summary
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <Stack spacing={4}>



                                <Input leftIcon={<FaNoteSticky />} label="Gravidity" value={Payload.gravidity} val={Payload.gravidity !=="" ? true: false} onChange={handlePayload} id="gravidity" />

                                <SimpleGrid mt="12px" columns={{ base: 1, md: 2 }} spacing={2}>
                                    <Input leftIcon={<MdDateRange />} type="date" label="LMP" value={Payload.lmp}  val={Payload.lmp !=="" ? true: false} onChange={handlePayload} id="lmp" />
                                    <Input leftIcon={<MdDateRange />} type="date" label="EDD" value={Payload.edd} val={Payload.edd !=="" ? true: false} onChange={handlePayload} id="edd" />

                                </SimpleGrid>
              
                            </Stack>


                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                Post Medical History
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <Stack spacing={4} pt="10">

                                <TextArea label="Post Medical History" value={Payload.postmedicalorsurgicalhistory} onChange={handlePayload} id="postmedicalorsurgicalhistory" />



                            </Stack>
                            <Flex justifyContent={"flex-end"} mt="2">
                                <Button

                                    onClick={addPostMedicalHistory}

                                    w={["100%", "100%", "184px", "184px"]}

                                >
                                    Add
                                </Button>
                            </Flex>



                            <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>

                                {
                                    PostMedicalHistory?.map((item, i) => (

                                        <Flex key={i} cursor="pointer" px="10px" py="10px" rounded={"20px"} fontSize="12px" _hover={{ bg: "blue.blue400" }} bg="blue.blue500" w="100%" justifyContent="space-between" alignItems="center" >
                                            <Text color="#fff" fontWeight="500" textTransform="capitalize" >{item}</Text>
                                            <Box fontSize="20px" color="#fff" onClick={() => removePostMedicalHistory(item)}><IoIosCloseCircle /></Box>
                                        </Flex>
                                    ))
                                }

                            </SimpleGrid>


                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                History Of Present Pregnancy
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <Stack spacing={4} pt="10">

                                <TextArea label=" History Of Present Pregnancy" value={Payload.historyofpresentpregnancy} onChange={handlePayload} id="historyofpresentpregnancy" />



                            </Stack>
                            <Flex justifyContent={"flex-end"} mt="2">
                                <Button

                                    onClick={addHistoryPresentPregnancy}

                                    w={["100%", "100%", "184px", "184px"]}

                                >
                                    Add
                                </Button>
                            </Flex>



                            <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>

                                {
                                    HistoryPresentPregnancy?.map((item, i) => (

                                        <Flex key={i} cursor="pointer" px="10px" py="10px" rounded={"20px"} fontSize="12px" _hover={{ bg: "blue.blue400" }} bg="blue.blue500" w="100%" justifyContent="space-between" alignItems="center" >
                                            <Text color="#fff" fontWeight="500" textTransform="capitalize" >{item}</Text>
                                            <Box fontSize="20px" color="#fff" onClick={() => removeHistoryPresentPregnancy(item)}><IoIosCloseCircle /></Box>
                                        </Flex>
                                    ))
                                }

                            </SimpleGrid>


                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                Previous pregnancy
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">




                            <Tooltip label='Previous Pregnancy'>
                                <Box onClick={() => setOpenObstetricHistoryModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Previous Pregnancy </Box>
                            </Tooltip>


                        </AccordionPanel>
                        <PreviousPregnancyModal isOpen={OpenObstetricHistoryModal} onClose={() => setOpenObstetricHistoryModal(false)} setOldPayload={setPayload} oldPayload={Payload} type={ModalState} activateNotifications={activateNotifications} />
                    </AccordionItem>


                </Accordion>

                <Flex justifyContent="center">

                    <Flex
                        justifyContent="space-between"
                        flexWrap="wrap"
                        mt={["10px", "10px", "10px", "10px"]}
                        w={["100%", "100%", "60%", "60%"]}
                    >
                        <Button
                            mt={["10px", "10px", "0px", "0px"]}

                            background="#f8ddd1 "
                            border="1px solid #EA5937"
                            color="blue.blue500"
                            w={["100%", "100%", "144px", "144px"]}
                            onClick={() => {
                                setOpenPreview(true)

                            }
                            }
                        >
                            Preview
                        </Button>

                        <Button
                          
                            onClick={handleCompleted}
                            isLoading={LoadingCompleted}
                            w={["100%", "100%", "184px", "184px"]}

                        >
                            Update
                        </Button>

                    </Flex>
                </Flex>
                <PreviewANC isOpen={OpenPreview} onClose={() => setOpenPreview(false)} setOldPayload={setPayload} oldPayload={Payload} />

            </Box>
        </MainLayout>
    )
}
