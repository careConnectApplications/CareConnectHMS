import React, { useState, useEffect } from 'react'
import { Text, Flex, HStack, Box, useDisclosure } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, SimpleGrid, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import moment from "moment";
import TableRow from "../Components/TableRow";
import Button from "../Components/Button";
import ExamineModal from "../Components/ExamineModal";
import ExamineDetails from "../Components/ExamineDetails";
import LabRequestModal from "../Components/LabRequestModal";
import Input from "../Components/Input";
import PreviewCard from "../Components/PreviewCard";
import PreviewCardV2 from "../Components/PreviewCardV2";
import ShowToast from "../Components/ToastNotification";
import { IoFilter } from "react-icons/io5";
import { BiSearch } from "react-icons/bi";
import { GetPreviousClinicalEncounterApi } from "../Utils/ApiCalls";
import Pagination from "../Components/Pagination";
import { configuration } from '../Utils/Helpers'
import Preloader from "../Components/Preloader";
import { SlPlus } from "react-icons/sl";
import { useNavigate, useLocation } from 'react-router-dom';
import { FaClock } from "react-icons/fa";
import { BsCalendar2DateFill } from "react-icons/bs";


export default function ClinicalEncounter({ hide = false, index }) {
    const [IsLoading, setIsLoading] = useState(true);
    const [All, setAll] = useState(true);
    const [InProgress, setInProgress] = useState(false);
    const [Completed, setCompleted] = useState(false);
    const [Data, setData] = useState([]);
    const [OpenView, setOpenView] = useState(false);
    const [ModalState, setModalState] = useState("");
    const [OpenModal, setOpenModal] = useState(false);
    const [OldPayload, setOldPayload] = useState({});
    const [FilterData, setFilterData] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [Trigger, setTrigger] = useState(false);

    // Pagination settings to follow
    const [CurrentPage, setCurrentPage] = useState(1);
    const [PostPerPage, setPostPerPage] = useState(configuration.sizePerPage);

    //get current post
    const indexOfLastSra = CurrentPage * PostPerPage;
    const indexOfFirstSra = indexOfLastSra - PostPerPage;
    const PaginatedData = FilterData.slice(indexOfFirstSra, indexOfLastSra);
    //change page 
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    // Pagination settings to follow end here 


    // Search Filter settings to follow 
    const [SearchInput, setSearchInput] = useState("");

    const [FilteredData, setFilteredData] = useState(null);


    const filterBy = (title) => {

        if (title === "appointmentId") {
            let filter = Data.filter(item => item.appointmentid?.toLowerCase().includes(SearchInput.toLowerCase()))
            setFilteredData(filter)

        } else if (title === "appointmentCategory") {
            let filter = Data.filter(item => item.appointmentcategory?.toLowerCase().includes(SearchInput.toLowerCase()))
            setFilteredData(filter)

        } else if (title === "appointmentType") {
            let filter = Data.filter(item => item.appointmenttype?.toLowerCase().includes(SearchInput.toLowerCase()) || item.lastName?.toLowerCase().includes(SearchInput.toLowerCase()))
            setFilteredData(filter)

        }


    }

    // Search Filter settings to follow end here

    let id = localStorage.getItem("appointmentId")
    let PatientId = localStorage.getItem("patientId")




    const [showToast, setShowToast] = useState({
        show: false,
        message: "",
        status: "",
    });


    const GetSingleANCHistory = async () => {
        setIsLoading(true)
        try {
            const result = await GetPreviousClinicalEncounterApi(PatientId);

            console.log("getAllPreviousClinicalEncounter", result);

            if (result.status === true) {
                setIsLoading(false)
                setFilterData(result.queryresult.appointmentdetails)
                setData(result.queryresult.appointmentdetails)


            }



        } catch (e) {

            activateNotifications(e.message, "error")
        }
    };


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

        }, 10000)
    }


    const filterAll = () => {
        setAll(true);
        setInProgress(false);
        setCompleted(false);
        setFilterData(Data);
    };


    const filterInProgress = () => {
        setAll(false);
        setInProgress(true);
        setCompleted(false);

        const filterData = Data.filter((item) => item.status === "inprogress");

        setFilterData(filterData);
    };
    const filterCompleted = () => {
        setAll(false);
        setInProgress(false);
        setCompleted(true);

        const filterData = Data.filter((item) => item.status === "complete");

        setFilterData(filterData);
    };


    const nav = useNavigate()
    const { pathname } = useLocation()

    const AddClinicalEncounter = () => {


        nav(`/dashboard/add-clinical-encounter/${id}`)
        localStorage.setItem("pathname", pathname)


    }


    const ViewLabResult = (id) => {
        nav(`/dashboard/lab-process/report/${id}`)
        localStorage.setItem("pathname", pathname)
    }



    useEffect(() => {

        GetSingleANCHistory();




    }, [isOpen, Trigger, index]);

    

    return (
        <Box
            bg="#fff"
            border="1px solid #EFEFEF"
            mt="10px"
            py="17px"
            px={["18px", "18px"]}
            rounded="10px"
        >
            {
                IsLoading && (
                    <Preloader />
                )
            }

            {showToast.show && (
                <ShowToast message={showToast.message} status={showToast.status} />
            )}
            {/* filter section  */}
            <Flex justifyContent="space-between" flexWrap="wrap">
                <Flex
                    alignItems="center"
                    flexWrap="wrap"
                    bg="#E4F3FF"
                    rounded="7px"
                    py="3.5px"
                    px="5px"
                    cursor="pointer"
                    mt={["10px", "10px", "0px", "0px"]}
                >
                    <Box borderRight="1px solid #EDEFF2" pr="5px" onClick={filterAll}>
                        <Text
                            py="8.5px"
                            px="12px"
                            bg={All ? "#fff" : "transparent"}
                            rounded="7px"
                            color={"#1F2937"}
                            fontWeight={"500"}
                            fontSize={"13px"}
                        >
                            All{" "}
                            <Box color="#667085" as="span" fontWeight="400" fontSize="13px">
                                ({Data?.length})
                            </Box>
                        </Text>
                    </Box>

                    <Box
                        borderRight="1px solid #EDEFF2"
                        pr="5px"
                        onClick={filterInProgress}
                    >
                        <Text
                            py="8.5px"
                            px="12px"
                            bg={InProgress ? "#fff" : "transparent"}
                            rounded="7px"
                            color={"#1F2937"}
                            fontWeight={"500"}
                            fontSize={"13px"}
                        >
                            In Progress
                        </Text>
                    </Box>
                    <Box
                        borderRight="1px solid #EDEFF2"
                        pr="5px"
                        onClick={filterCompleted}
                    >
                        <Text
                            py="8.5px"
                            px="12px"
                            bg={Completed ? "#fff" : "transparent"}
                            rounded="7px"
                            color={"#1F2937"}
                            fontWeight={"500"}
                            fontSize={"13px"}
                        >
                            Completed
                        </Text>
                    </Box>
                </Flex>

                {hide === false && (
                    <Flex
                        flexWrap="wrap"
                        mt={["10px", "10px", "0px", "0px"]}
                        alignItems="center"
                        justifyContent={"flex-end"}
                    >
                        <HStack>
                            <Input label="Search" onChange={(e) => setSearchInput(e.target.value)} value={SearchInput} bColor="#E4E4E4" leftIcon={<BiSearch />} />


                            <Menu isLazy>
                                <MenuButton as={Box}>

                                    <HStack
                                        border="1px solid #EA5937"
                                        rounded="7px"
                                        cursor="pointer"
                                        py="11.64px"
                                        px="16.98px"
                                        bg="#f8ddd1"
                                        color="blue.blue500"
                                        fontWeight="500"
                                        fontSize="14px"
                                    >
                                        <Text>Filter</Text>
                                        <IoFilter />
                                    </HStack>
                                </MenuButton>
                                <MenuList >

                                    <MenuItem onClick={() => filterBy("appointmentId")} textTransform="capitalize" fontWeight={"500"} color='#2F2F2F' _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}>
                                        <HStack fontSize="14px">

                                            <Text>by Appointment ID</Text>
                                        </HStack>
                                    </MenuItem>
                                    <MenuItem onClick={() => filterBy("appointmentCategory")} textTransform="capitalize" fontWeight={"500"} color='#2F2F2F' _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}>
                                        <HStack fontSize="14px">

                                            <Text>by Appointment Category</Text>
                                        </HStack>
                                    </MenuItem>
                                    <MenuItem onClick={() => filterBy("appointmentType")} textTransform="capitalize" fontWeight={"500"} color='#2F2F2F' _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}>
                                        <HStack fontSize="14px">

                                            <Text>by Appointment Type</Text>
                                        </HStack>
                                    </MenuItem>
                                    <MenuItem onClick={() => {
                                        setFilteredData(null)
                                        setSearchInput("")
                                    }} textTransform="capitalize" fontWeight={"500"} color='#2F2F2F' _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}>
                                        <HStack fontSize="14px">

                                            <Text>clear filter</Text>
                                        </HStack>
                                    </MenuItem>



                                </MenuList>
                            </Menu>
                        </HStack>
                    </Flex>
                )}
            </Flex>

            {
                hide === false && (

                    <Flex
                        justifyContent="space-between"
                        flexWrap="wrap"
                        mt={["10px", "10px", "10px", "10px"]}
                        w={["100%", "100%", "50%", "37%"]}
                    >
                        <Button

                            w={["100%", "100%", "144px", "144px"]}
                            onClick={AddClinicalEncounter}
                            rightIcon={<SlPlus />}
                        >
                            Add Encounter
                        </Button>


                    </Flex>
                )
            }

            {/* filter section end here */}

            <Box
                bg="#fff"
                border="1px solid #EFEFEF"
                mt="12px"
                py="15px"
                px="15px"
                rounded="10px"
                overflowX="auto"
            >

                <Text mb="20px" fontWeight="700" fontSize="16px" color="blue.blue500">Previous Clinical Encounter </Text>
                {
                    FilterData.map((item, i) => (
                        <Box key={i} mt="20px">
                            <HStack bg="orange.orange500" py="10px" px="10px" rounded="10px" color="blue.blue500" justifyContent="space-between" fontStyle="italic" fontSize="14px" fontWeight="500">
                                <HStack>

                                    <Box color="blue.blue500"><BsCalendar2DateFill /></Box>
                                    <Text textAlign="center">{moment(item.createdAt).format("L")} </Text>
                                    <Box color="blue.blue500"><FaClock /></Box>
                                    <Text textAlign="center"> {moment(item.createdAt).format("LT")} </Text>
                                </HStack>

                                {/* <Text textAlign="center"> {item.appointmenttype} </Text> */}
                            </HStack>
                            {
                                item.doctor && (
                                    <Box>
                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">Doctors Details</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                            <PreviewCard title="first name" value={item.doctor?.firstName} />
                                            <PreviewCard title="last name" value={item.doctor?.lastName} />
                                            <PreviewCard title="email" value={item.doctor?.email} />
                                            <PreviewCard title="phone number" value={item.doctor?.phoneNumber} />
                                            <PreviewCard title="Specialization details" value={item.doctor?.specializationDetails} />
                                            <PreviewCard title="staff id" value={item.doctor?.staffId} />
                                        </SimpleGrid>
                                    </Box>
                                )
                            }

                            {
                                item.vitals?.length > 0 && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">Vitals</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>
                                            <PreviewCard title="vital date" value={moment(Date.now()).format("ll")} />
                                            <PreviewCard title="height" value={item.vitals[0]?.height} />
                                            <PreviewCard title="weight" value={item.vitals[0]?.weight} />
                                            <PreviewCard title="temperature" value={item.vitals[0]?.temperature} />
                                            <PreviewCard title="Blood Pressure Systolic" value={item.vitals[0]?.bloodpressuresystolic} />
                                            <PreviewCard title="Blood Pressure Diastolic" value={item.vitals[0]?.bloodpressurediastolic} />
                                            <PreviewCard title="Heart Rate" value={item.vitals[0]?.heart} />
                                            <PreviewCard title="O2 Saturation" value={item.vitals[0]?.saturation} />
                                            <PreviewCard title="respiration" value={item.vitals[0]?.respiration} />
                                            <PreviewCard title="bmi" value={item.vitals[0]?.bmi} />
                                        </SimpleGrid>
                                    </Box>
                                )
                            }
                            {
                                item.clinicalencounter.assessmentnote && (
                                    <>
                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">Assessment Note  </Text>
                                        {
                                            item.clinicalencounter.assessmentnote?.map((item, i) => (
                                                <Box>
                                                    <PreviewCardV2 title="" value={item} />
                                                    <br />

                                                </Box>
                                            ))
                                        }

                                    </>


                                )
                            }
                            {
                                item.clinicalencounter.clinicalnote && (
                                    <>
                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">Clinical Note  </Text>
                                        {
                                            item.clinicalencounter.clinicalnote?.map((item, i) => (
                                                <Box>
                                                    <PreviewCardV2 title="" value={item} />
                                                    <br />

                                                </Box>
                                            ))
                                        }

                                    </>


                                )
                            }
                            {
                                item.clinicalencounter.diagnosisnote && (
                                    <>
                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">Diagnosis Note  </Text>
                                        {
                                            item.clinicalencounter.diagnosisnote?.map((item, i) => (
                                                <Box>
                                                    <PreviewCardV2 title="" value={item} />
                                                    <br />

                                                </Box>
                                            ))
                                        }

                                    </>


                                )
                            }

                            {
                                item.clinicalencounter.diagnosisicd10 && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">diagnosis icd 11</Text>
                                        <PreviewCardV2 value={item.clinicalencounter?.diagnosisicd10} />

                                    </Box>
                                )
                            }

                            {
                                item.clinicalencounter.plannote && (
                                    <>
                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">Plan Note  </Text>
                                        {
                                            item.clinicalencounter.plannote?.map((item, i) => (
                                                <Box>
                                                    <PreviewCardV2 title="" value={item} />
                                                    <br />

                                                </Box>
                                            ))
                                        }

                                    </>


                                )
                            }

                            {
                                item.clinicalencounter.outcome && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">Outcome</Text>
                                        <PreviewCardV2 value={item.clinicalencounter?.outcome} />

                                    </Box>
                                )
                            }

                            {
                                item.lab.length > 0 && (
                                    <>
                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">Lab order  </Text>
                                        {
                                            item.lab?.map((item, i) => (
                                                <Box>
                                                    <PreviewCardV2 title="" value={item.testname} />
                                                    {
                                                        item.testresult?.length > 0 && (
                                                            <>
                                                                <Text onClick={() => ViewLabResult(item.appointment)} cursor="pointer" fontSize="12px" color="blue.blue500">View Result</Text>

                                                            </>
                                                        )
                                                    }
                                                    <br />

                                                </Box>
                                            ))
                                        }

                                    </>


                                )
                            }
                            {
                                item.radiology.length > 0 && (
                                    <>
                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">Radiology order  </Text>
                                        {
                                            item.radiology?.map((item, i) => (
                                                <Box>
                                                    <PreviewCardV2 value={item.testname} />
                                                    <PreviewCardV2 value={" Note: " + item.note} />

                                                    {
                                                        item.testresult?.length > 0 && (
                                                            <>
                                                                <Text onClick={() => ViewLabResult(item.appointment)} cursor="pointer" fontSize="12px" color="blue.blue500">View Result</Text>

                                                            </>
                                                        )
                                                    }
                                                    <br />

                                                </Box>
                                            ))
                                        }

                                    </>


                                )
                            }
                            {
                                item.prescription.length > 0 && (
                                    <>
                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">Pharmacy order  </Text>
                                        {
                                            item.prescription?.map((item, i) => (
                                                <Box>
                                                    <PreviewCardV2 value={item.prescription} />
                                                    <PreviewCardV2 value={" frequency: " + item.frequency} />


                                                    <br />

                                                </Box>
                                            ))
                                        }

                                    </>


                                )
                            }
                            {
                                item.procedure.length > 0 && (
                                    <>
                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">Procedure order  </Text>
                                        {
                                            item.procedure?.map((item, i) => (
                                                <Box>
                                                    <PreviewCardV2 value={item.procedure} />
                                                    <PreviewCardV2 value={" appointment Date: " + moment(item.appointmentdate).format("LL")} />
                                                    <PreviewCardV2 value={" CPT Codes: " + item.cptcodes.map((item, i) => (` ${item} `))} />
                                                    <PreviewCardV2 value={" DX Codes: " + item.dxcodes.map((item, i) => (` ${item} `))} />


                                                    <br />

                                                </Box>
                                            ))
                                        }

                                    </>


                                )
                            }


                            {
                                item.status === "inprogress" && (

                                    <Button display={hide === false ? "block": "none"} mt="32px" onClick={() => {
                                        nav(`/dashboard/edit-clinical-encounter/${item._id}`);
                                        localStorage.setItem("pathname", pathname)
                                        localStorage.setItem("oldEncounter", JSON.stringify(item))

                                    }}>Complete Encounter</Button>
                                )
                            }




                        </Box>
                    ))
                }

            </Box>




        </Box>
    )
}
