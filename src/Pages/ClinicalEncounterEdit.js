import { HStack, Text, Box, Flex, Select, Stack, useDisclosure, SimpleGrid, Tooltip } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";
import Button from "../Components/Button";
import Input from "../Components/Input";
import TextArea from "../Components/TextArea";
import LabRequestModal from "../Components/LabRequestModal";
import ShowToast from "../Components/ToastNotification";
import ClinicalEncounter from "./ClinicalEncounter";
import GeneralExaminationModal from "../Components/GeneralExaminationModal";
import HistoryCvsModal from "../Components/HistoryCvsModal";
import HistoryRespModal from "../Components/HistoryRespModal";
import HistoryGiModal from "../Components/HistoryGiModal";
import HistoryGuModal from "../Components/HistoryGuModal";
import HistoryNeuroModal from "../Components/HistoryNeuroModal";
import HistoryMskModal from "../Components/HistoryMskModal";
import MedicalHistoryModal from "../Components/MedicalHistoryModal";
import PostnatalHistoryModal from "../Components/PostnatalHistoryModal";
import DevelopmentalHistoryModal from "../Components/DevelopmentalHistoryModal";
import ImmunizationHistoryModal from "../Components/ImmunizationHistoryModal";
import CvsExaminationModal from "../Components/CvsExaminationModal";
import RespExaminationModal from "../Components/RespExaminationModal";
import GiExaminationModal from "../Components/GiExaminationModal";
import GuExaminationModal from "../Components/GuExaminationModal";
import NeuroExaminationModal from "../Components/NeuroExaminationModal";
import AdmissionModal from "../Components/AdmissionModal";
import RadiologyOrderRequestModal from "../Components/RadiologyOrderRequestModal";
import CreateProcedureModal from "../Components/CreateProcedureModal";
import CreateReferralModal from "../Components/CreateReferralModal";
import MskExaminationModal from "../Components/MskExaminationModal";
import PreviewEncounter from "../Components/PreviewEncounter";
import CreatePrescriptionModal from "../Components/CreatePrescriptionModal";
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io"; import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react'
import { SettingsApi, GetDiagnosisICApi,GetAllVitalsApi, AddClinicalEncounterAPI } from "../Utils/ApiCalls";
import { FaNoteSticky } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { FaTemperatureHigh, FaHeartCircleCheck } from "react-icons/fa6";
import { FaTextHeight, FaHeartbeat } from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";
import { GiEnergyBreath } from "react-icons/gi";
import { GiWeight } from "react-icons/gi";
import { TbMichelinStarFilled } from "react-icons/tb";
import { useParams } from 'react-router-dom';

export default function ClinicalEncounterEdit() {
    const { id } = useParams()
    const [Settings, setSettings] = useState({});
    const [OpenLabModal, setOpenLabModal] = useState(false);
    const [OpenPrescriptionModal, setOpenPrescriptionModal] = useState(false);
    const [OpenRadiologyModal, setOpenRadiologyModal] = useState(false);
    const [OpenProcedureModal, setOpenProcedureModal] = useState(false);
    const [OpenReferralModal, setOpenReferralModal] = useState(false);
    const [OpenPreview, setOpenPreview] = useState(false);
    const [SearchICD, setSearchICD] = useState("");
    const [OpenAdmissionModal, setOpenAdmissionModal] = useState(false);
    const [Complaints, setComplaints] = useState([]);
    const [ClinicalNotes, setClinicalNotes] = useState([]);
    const [AssessmentNotes, setAssessmentNotes] = useState([]);
    const [DiagnosisNotes, setDiagnosisNotes] = useState([]);
    const [PlanNotes, setPlanNotes] = useState([]);
    const [DiagnosisICD, setDiagnosisICD] = useState([]);
    const [NurseVitals, setNurseVitals] = useState({});
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ModalState, setModalState] = useState("");
    const [Disabled, setDisabled] = useState(true);
    const [Loading, setLoading] = useState(false);
    const [LoadingCompleted, setLoadingCompleted] = useState(false);
    const [Payload, setPayload] = useState({
        diagnosisnote: "",
        diagnosisicd10: "",
        assessmentnote: "",
        clinicalnote: "",
        outcome: "",
        plannote: "",
        height: "",
        weight: "",
        temperature: "",
        bloodpressuresystolic: "",
        bloodpressurediastolic: "",
        respiration: "",
        saturation: "",
        heartrate: "",


    })

    const getAllICD = async (value) => {
        try {
            const result = await GetDiagnosisICApi({ diagnosis: value });

            setDiagnosisICD(result.queryresult);
        } catch (e) {

        }
    };

    const handleSearch = (e) => {

        setSearchICD(e.target.value)
        getAllICD(e.target.value)

    }

    const handleSuccess = (message, status) => {
        setShowToast({ show: true, message, status });
        setTimeout(() => {
            setShowToast({ show: false, message: "", status: "" });
        }, 3000);

    };

    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })
       
    }


    const addClinicalNotes = () => {
        setClinicalNotes([...ClinicalNotes, Payload.clinicalnote])
        setPayload({ ...Payload, clinicalnote: "" })
    }
    const addAssessmentNotes = () => {
        setAssessmentNotes([...AssessmentNotes, Payload.assessmentnote])
        setPayload({ ...Payload, assessmentnote: "" })
    }
    const addDiagnosisNotes = () => {
        setDiagnosisNotes([...DiagnosisNotes, Payload.diagnosisnote])
        console.log("DiagnosisNotes", Payload.diagnosisnote)
        setPayload({ ...Payload, diagnosisnote: "" })
    }
   
    const addPlanNotes = () => {
        setPlanNotes([...PlanNotes, Payload.plannote])
        setPayload({ ...Payload, plannote: "" })
    }


    const getSettings = async () => {
        try {
            const result = await SettingsApi();
            let checker = result?.servicecategory?.filter(item => item.category === "Appointment")
            setSettings(result);
        } catch (e) {

        }
    };
    const getAllVitals = async () => {
        try {
            const result = await GetAllVitalsApi(id);

            console.log("getAllVitals",result)
     
            setNurseVitals(result.queryresult);

            setPayload({
                height: result.queryresult?.height,
                weight: result.queryresult?.weight,
                temperature: result.queryresult?.temperature,
                bloodpressuresystolic: result.queryresult?.bloodpressuresystolic,
                bloodpressurediastolic: result.queryresult?.bloodpressurediastolic,
                respiration: result.queryresult?.respiration,
                saturation: result.queryresult?.saturation,
                heartrate: result.queryresult?.heartrate,
            })
        } catch (e) {
            console.error(e.message)
        }
    };

    const removeAssessment = (item) => {


        const updatedItems = AssessmentNotes.filter(id => id !== item);
        setAssessmentNotes(updatedItems);


    }

    const removeClinicalNotes = (item) => {


        const updatedItems = ClinicalNotes.filter(id => id !== item);
        setClinicalNotes(updatedItems);
    }
    const removeDiagnosisNotes = (item) => {


        const updatedItems = DiagnosisNotes.filter(id => id !== item);
        setDiagnosisNotes(updatedItems);
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

    const handleInprogress = async () => {

        setLoading(true)
        try {
            const result = await AddClinicalEncounterAPI(
                {
                    ...Payload, status: "3",
                    diagnosisnote: DiagnosisNotes,
                    assessmentnote: AssessmentNotes,
                    clinicalnote: ClinicalNotes,
                    plannote: PlanNotes,
                }, id);


            if (result.status === 200) {
                setLoading(false)
                activateNotifications("Encounter Saved as Inprogress Successfully", "success")
                nav(`${pathName}`)

            }

        } catch (e) {
            setLoading(false)
            activateNotifications(e.message, "error")
        }
    }
    const handleCompleted = async () => {
        setLoadingCompleted(true)
        try {
            const result = await AddClinicalEncounterAPI({
                ...Payload, status: "1",
                diagnosisnote: DiagnosisNotes,
                assessmentnote: AssessmentNotes,
                clinicalnote: ClinicalNotes,
                plannote: PlanNotes,
            }, id);
            console.log("AddClinicalEncounterAPI", result)


            if (result.status === 200) {
                setLoadingCompleted(false)

                activateNotifications("Encounter Saved as Completed Successfully", "success")
                nav(`${pathName}`)

            }

        } catch (e) {
            setLoadingCompleted(false)
            activateNotifications(e.message, "error")
        }
    }

    const oldEncounter = JSON.parse(localStorage.getItem("oldEncounter"))

    console.log("oldEncounter", oldEncounter)

    useEffect(() => {


        getAllVitals()
        getSettings();

        setClinicalNotes(oldEncounter?.clinicalencounter?.clinicalnot||[])
        setAssessmentNotes(oldEncounter?.clinicalencounter?.assessmentnote||[])
        setDiagnosisNotes(oldEncounter?.clinicalencounter?.diagnosisnotes||[])
        setPlanNotes(oldEncounter?.clinicalencounter?.plannote||[])

        setPayload({
         
            outcome: oldEncounter?.clinicalencounter?.outcome,

        })

        setSearchICD(oldEncounter?.clinicalencounter?.diagnosisicd10)
        getAllICD(oldEncounter?.clinicalencounter?.diagnosisicd10)


    }, []);



    const nav = useNavigate()

    const pathname = localStorage.getItem("pathname")
    return (
        <MainLayout>
            {showToast.show && (
                <ShowToast message={showToast.message} status={showToast.status} />
            )}
            <Seo title="Doctor's Encounter" description="Care connect  Doctor's Encounter" />

            <Box>
                <Button leftIcon={<IoMdArrowRoundBack />} px="40px" w="100px" onClick={() => nav(`${pathname}`)}>Back</Button>

                <Accordion defaultIndex={[7]} mt="32px" allowToggle>
                    <AccordionItem mb="15px" >

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                Previous Clinical Encounter
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px" >
                            <ClinicalEncounter hide={true} />
                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                Vital
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <SimpleGrid mt="32px" columns={{ base: 1, md: 2 }} spacing={5}>
                                <Input type="number" leftIcon={<FaTemperatureHigh />} label="Temperature (C)" value={Payload.temperature} val={Payload.temperature !=="" ? true: false  } onChange={handlePayload} id="temperature" />
                                <Input type="number" leftIcon={<FaHeartbeat />} label="Heart Rate (bpm)" value={Payload.heartrate} val={Payload.heartrate !=="" ? true: false  } onChange={handlePayload} id="heartrate" />
                                <Input type="number" leftIcon={<MdBloodtype />} label="Blood Pressure (systolic)(mmHg)" value={Payload.bloodpressuresystolic} val={Payload.bloodpressuresystolic !=="" ? true: false  } onChange={handlePayload} id="bloodpressuresystolic" />
                                <Input type="number" leftIcon={<MdBloodtype />} label="Blood Pressure (Diastolic)(mmHg)" value={Payload.bloodpressurediastolic} val={Payload.bloodpressurediastolic !=="" ? true: false  } onChange={handlePayload} id="bloodpressurediastolic" />
                                <Input type="number" leftIcon={<GiEnergyBreath />} label="Respiration (bpm)" value={Payload.respiration} val={Payload.respiration !=="" ? true: false  } onChange={handlePayload} id="respiration" />
                                <Input type="number" leftIcon={<FaHeartCircleCheck />} label="O2 Saturation (%)" value={Payload.saturation} val={Payload.saturation !=="" ? true: false  } onChange={handlePayload} id="saturation" />
                                <Input type="number" leftIcon={<FaTextHeight />} label="Height (cm)" value={Payload.height} val={Payload.height !=="" ? true: false  } onChange={handlePayload} id="height" />
                                <Input type="number" leftIcon={<GiWeight />} label="Weight (kg)" value={Payload.weight} val={Payload.weight !=="" ? true: false  } onChange={handlePayload} id="weight" />


                            </SimpleGrid>
                            <Text color="red" mt="20px">Note: Please add at least one vital information </Text>
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                Clinical Notes
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <Stack spacing={4} pt="10">

                                <TextArea label="Clinical Note" value={Payload.clinicalnote} onChange={handlePayload} id="clinicalnote" />


                            </Stack>
                            <Flex justifyContent={"flex-end"} mt="2">
                                <Button

                                    onClick={addClinicalNotes}

                                    w={["100%", "100%", "184px", "184px"]}

                                >
                                    Add
                                </Button>
                            </Flex>



                            <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>

                                {
                                    ClinicalNotes?.map((item, i) => (

                                        <Flex key={i} cursor="pointer" px="10px" py="10px" rounded={"20px"} fontSize="12px" _hover={{ bg: "blue.blue400" }} bg="blue.blue500" w="100%" justifyContent="space-between" alignItems="center" >
                                            <Text color="#fff" fontWeight="500" textTransform="capitalize" >{item}</Text>
                                            <Box fontSize="20px" color="#fff" onClick={() => removeClinicalNotes(item)}><IoIosCloseCircle /></Box>
                                        </Flex>
                                    ))
                                }

                            </SimpleGrid>


                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                Assessment Notes
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <Stack spacing={4} pt="10">

                                <TextArea label=" Assessment Note" value={Payload.assessmentnote} onChange={handlePayload} id="assessmentnote" />


                            </Stack>
                            <Flex justifyContent={"flex-end"} mt="2">
                                <Button

                                    onClick={addAssessmentNotes}

                                    w={["100%", "100%", "184px", "184px"]}

                                >
                                    Add
                                </Button>
                            </Flex>



                            <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>

                                {
                                    AssessmentNotes?.map((item, i) => (

                                        <Flex key={i} cursor="pointer" px="10px" py="10px" rounded={"20px"} fontSize="12px" _hover={{ bg: "blue.blue400" }} bg="blue.blue500" w="100%" justifyContent="space-between" alignItems="center" >
                                            <Text color="#fff" fontWeight="500" textTransform="capitalize" >{item}</Text>
                                            <Box fontSize="20px" color="#fff" onClick={() => removeAssessment(item)}><IoIosCloseCircle /></Box>
                                        </Flex>
                                    ))
                                }

                            </SimpleGrid>


                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                Diagnosis Notes
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <Stack spacing={4} pt="10">

                                <TextArea label=" Diagnosis Note" value={Payload.diagnosisnote} onChange={handlePayload} id="diagnosisnote" />


                            </Stack>
                            <Flex justifyContent={"flex-end"} mt="2">
                                <Button

                                    onClick={addDiagnosisNotes}

                                    w={["100%", "100%", "184px", "184px"]}

                                >
                                    Add
                                </Button>
                            </Flex>



                            <SimpleGrid mt="12px" columns={{ base: 2, md: 2 }} spacing={2}>

                                {
                                    DiagnosisNotes?.map((item, i) => (

                                        <Flex key={i} cursor="pointer" px="10px" py="10px" rounded={"20px"} fontSize="12px" _hover={{ bg: "blue.blue400" }} bg="blue.blue500" w="100%" justifyContent="space-between" alignItems="center" >
                                            <Text color="#fff" fontWeight="500" textTransform="capitalize" >{item}</Text>
                                            <Box fontSize="20px" color="#fff" onClick={() => removeDiagnosisNotes(item)}><IoIosCloseCircle /></Box>
                                        </Flex>
                                    ))
                                }

                            </SimpleGrid>


                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                Diagnosis ICD
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <SimpleGrid mt="12px" pt="12px" columns={{ base: 1, md: 1 }} spacing={2}>

                                <Input label="Search ICD 11" value={SearchICD} onChange={handleSearch} />

                                <Select fontSize={Payload.diagnosisicd10 !== "" ? "16px" : "13px"} h="45px" borderWidth="2px" borderColor="#6B7280" id="diagnosisicd10"
                                    value={Payload.diagnosisicd10} onChange={handlePayload} placeholder="Select diagnosis icd 11" >

                                    {
                                        DiagnosisICD.map((item, i) => (

                                            <option key={i} value={`${item[1]}`}>{`${item[0]} ~ ${item[1]}`}</option>
                                        ))
                                    }


                                </Select>

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

                                <TextArea label=" Plan Note" value={Payload.plannote} onChange={handlePayload} id="plannote" />


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
                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                Plan
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <SimpleGrid mt="30px" mb={2} columns={{ base: 1, md: 1 }} spacing={4} >

                                <Select fontSize={Payload.outcome !== "" ? "16px" : "13px"} h="45px" borderWidth="2px" borderColor="#6B7280" id="outcome"
                                    value={Payload.outcome} onChange={handlePayload} placeholder="Select outcome" >
                                    <option value={`Treated`}>Treated</option>
                                    <option value={`Admitted`}>Admitted</option>
                                    <option value={`Referred`}>Referred</option>
                                    <option value={`Deceased`}>Deceased</option>
                                    <option value={`Other`}>Other</option>

                                </Select>


                            </SimpleGrid>
                            <Flex justifyContent="space-between" flexWrap="wrap" mt="15px" w={["100%", "100%", "100%", "100%"]} >
                                <Tooltip label='Lab Order'>
                                    <Box onClick={() => setOpenLabModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Lab </Box>

                                </Tooltip>
                                <Tooltip label='Radiology Order'>
                                    <Box onClick={() => setOpenRadiologyModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Radiology </Box>
                                </Tooltip>
                                <Tooltip label='Prescribe Drug'>
                                    <Box cursor="pointer" onClick={() => setOpenPrescriptionModal(true)} px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Prescription </Box>
                                </Tooltip>
                                <Tooltip label='Admit Patient'>
                                    <Box onClick={() => setOpenAdmissionModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Admission </Box>
                                </Tooltip>
                                <Tooltip label='Procedure'>
                                    <Box onClick={() => setOpenProcedureModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Procedure </Box>
                                </Tooltip>
                                <Tooltip label='Refer Patient To Another Doctor'>
                                    <Box onClick={() => setOpenReferralModal(true)} cursor="pointer" px="25px" py="10px" rounded="8px" border="1px solid #EA5937" color="blue.blue500" bg="orange.orange500">Referral </Box>
                                </Tooltip>
                            </Flex>
                        </AccordionPanel>
                        <AdmissionModal isOpen={OpenAdmissionModal} oldPayload={{ _id: id, appointmentid: id }} onClose={() => setOpenAdmissionModal(false)} type={ModalState} activateNotifications={activateNotifications} />

                        <RadiologyOrderRequestModal
                            isOpen={OpenRadiologyModal}
                            onClose={() => setOpenRadiologyModal(false)}
                            admissionId={null}
                            type={"create"}
                            initialData={null}
                            oldPayload={{ id: id }}
                            onSuccess={handleSuccess}
                        />

                        <CreateProcedureModal
                            isOpen={OpenProcedureModal}
                            onClose={() => setOpenProcedureModal(false)}
                            type={"new"}
                            activateNotifications={activateNotifications}
                            oldPayload={{ id: id }}

                        />

                        <CreateReferralModal isOpen={OpenReferralModal} onClose={() => setOpenReferralModal(false)} type={ModalState} activateNotifications={activateNotifications} />

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
                            w={["100%", "100%", "184px", "184px"]}
                            onClick={handleInprogress}
                            isLoading={Loading}
                           

                        >
                            Save as In-Progress
                        </Button>
                        <Button
                           
                            onClick={handleCompleted}
                            isLoading={LoadingCompleted}
                            w={["100%", "100%", "184px", "184px"]}

                        >
                            Save as Completed
                        </Button>

                    </Flex>
                </Flex>
                <LabRequestModal isOpen={OpenLabModal} oldPayload={{ _id: id, appointmentid: id }} onClose={() => setOpenLabModal(false)} type={ModalState} activateNotifications={activateNotifications} />
                <PreviewEncounter isOpen={OpenPreview} onClose={() => setOpenPreview(false)} setOldPayload={setPayload} oldPayload={Payload} />
                <CreatePrescriptionModal
                    isOpen={OpenPrescriptionModal}
                    onClose={() => setOpenPrescriptionModal(false)}
                    onSuccess={activateNotifications}
                    oldPayload={{ id: id }}
                />

            </Box>
        </MainLayout>
    )
}
