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
import { GetPreviousPreAnatheticsApi } from "../Utils/ApiCalls";
import Pagination from "../Components/Pagination";
import { configuration } from '../Utils/Helpers'
import Preloader from "../Components/Preloader";
import { SlPlus } from "react-icons/sl";
import { useNavigate, useLocation } from 'react-router-dom';
import { FaClock } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { BsCalendar2DateFill } from "react-icons/bs";


export default function TheatrePreAnathetics({ hide = false, index }) {
    const [IsLoading, setIsLoading] = useState(true);
    const [All, setAll] = useState(true);
    const [InProgress, setInProgress] = useState(false);
    const [Completed, setCompleted] = useState(false);
    const [Data, setData] = useState(null);

    const [FilterData, setFilterData] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [Trigger, setTrigger] = useState(false);



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
            const result = await GetPreviousPreAnatheticsApi(PatientId);

            console.log("GetSingleANCHistoryAnathetics", result);

            if (result.status === true) {
                setIsLoading(false)
                setData(result.queryresult)


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





    const nav = useNavigate()
    const { pathname } = useLocation()

    const AddNew = () => {


        nav(`/dashboard/add-new-preAnathetics/${id}`)
        localStorage.setItem("pathname", pathname)


    }
    const EditRecord = () => {


        nav(`/dashboard/edit-preAnathetics/${Data?._id}`)
        localStorage.setItem("pathname", pathname)
        localStorage.setItem("oldRecord", JSON.stringify(Data))


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
                    <Box borderRight="1px solid #EDEFF2" pr="5px" >
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
                        {
                            Data === null ? (
                                <Button

                                    w={["100%", "100%", "144px", "144px"]}
                                    onClick={AddNew}
                                    rightIcon={<SlPlus />}
                                >
                                    Add New
                                </Button>
                            ) : (
                                <Button

                                    w={["100%", "100%", "144px", "144px"]}
                                    onClick={EditRecord}
                                    rightIcon={<MdModeEdit />}
                                >
                                    Edit
                                </Button>

                            )
                        }



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

                {
                    Data != null && (
                        <Box mt="20px">
                            <Text mb="20px" fontWeight="700" fontSize="16px" color="blue.blue500">Previous Pre Anathetics  </Text>


                            <HStack bg="orange.orange500" py="10px" px="10px" rounded="10px" color="blue.blue500" justifyContent="space-between" fontStyle="italic" fontSize="14px" fontWeight="500">
                                <HStack>

                                    <Box color="blue.blue500"><BsCalendar2DateFill /></Box>
                                    <Text textAlign="center">{moment(Data.createdAt).format("L")} </Text>

                                </HStack>

                                <HStack>

                                    <Box color="blue.blue500"><FaClock /></Box>
                                    <Text textAlign="center"> {moment(Data.createdAt).format("LT")} </Text>
                                </HStack>


                            </HStack>


                            {
                                Data && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">History</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>

                                            <PreviewCard title="dental history" value={Data.dentalhistory} />
                                            <PreviewCard title="family history" value={Data.familyhistory} />
                                            <PreviewCard title="present medical history" value={Data.presentmedicalhistory} />
                                            <PreviewCard title="past medical history" value={Data.pastmedicalhistory} />
                                            <PreviewCard title="anaesthetic medical history" value={Data.anaestheticmedicalhistory} />

                                        </SimpleGrid>
                                    </Box>
                                )
                            }
                            {
                                Data && (
                                    <Box>

                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">Assessment</Text>
                                        <SimpleGrid mt="12px" mb="5" columns={{ base: 1, md: 2, lg: 2 }} spacing={5}>

                                            <PreviewCard title="airway assessment" value={Data.airwayassessment} />
                                            <PreviewCard title="malamphatic score" value={Data.malamphaticscore} />
                                            <PreviewCard title="mouth" value={Data.mouth} />
                                            <PreviewCard title="neck" value={Data.neck} />
                                            <PreviewCard title="throid mental dish" value={Data.throidmentaldish} />

                                        </SimpleGrid>
                                    </Box>
                                )
                            }
                            {
                                Data.drugshistory && (
                                    <>
                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">Drug History  </Text>
                                        {
                                            Data.drugshistory?.map((item, i) => (
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
                                Data.physicalexamination && (
                                    <>
                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">Physical Examination  </Text>
                                        {
                                            Data.physicalexamination?.map((item, i) => (
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
                                Data.plan && (
                                    <>
                                        <Text fontSize="15px" mt="12px" fontWeight={"700"} textTransform="capitalize" color="blue.blue500">Plan Note  </Text>
                                        {
                                            Data.plan?.map((item, i) => (
                                                <Box>
                                                    <PreviewCardV2 title="" value={item} />
                                                    <br />

                                                </Box>
                                            ))
                                        }

                                    </>


                                )
                            }







                        </Box>
                    )
                }

            </Box>




        </Box>
    )
}
