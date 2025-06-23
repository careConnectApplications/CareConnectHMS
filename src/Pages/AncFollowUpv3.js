import React, { useState, useEffect } from 'react'
import { Text, Flex, HStack, Box, useDisclosure } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, TableContainer, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import moment from "moment";
import TableRow from "../Components/TableRow";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../Components/Button";
import ExamineModal from "../Components/ExamineModal";
import LabRequestModal from "../Components/LabRequestModal";
import Input from "../Components/Input";
import ShowToast from "../Components/ToastNotification";
import { IoFilter } from "react-icons/io5";
import { HiOutlineDocumentArrowUp } from "react-icons/hi2";
import { BiSearch } from "react-icons/bi";
import { SlPlus } from "react-icons/sl";
import { UpdatePathCompleteAPI, GetAllAncFollowUpApiv3 } from "../Utils/ApiCalls";
import Pagination from "../Components/Pagination";
import CreateANCFollowUpModalv3 from "../Components/CreateANCFollowUpModalv3";
import { configuration } from '../Utils/Helpers'
import Preloader from "../Components/Preloader";
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";
import { IoMdArrowRoundBack } from "react-icons/io"; 




export default function AncFollowUpv3() {
    const [IsLoading, setIsLoading] = useState(true);
    const [All, setAll] = useState(true);
    const [Scheduled, setScheduled] = useState(false);
    const [Examined, setExamined] = useState(false);
    const [Completed, setCompleted] = useState(false);
    const [Data, setData] = useState([]);

    const [FilterData, setFilterData] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [Trigger, setTrigger] = useState(false);
    const [ModalState, setModalState] = useState("");
    const [OldPayload, setOldPayload] = useState({});


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

    let {id} = useParams()




    const [showToast, setShowToast] = useState({
        show: false,
        message: "",
        status: "",
    });




    const getAllAncFollowup = async () => {
        setIsLoading(true)
        try {
            const result = await GetAllAncFollowUpApiv3(id);
            console.log("getAllAncFollowup", result)
            if (result.status === true) {
                setIsLoading(false) 
                setData(result.queryresult.ancfollowupdetails);
                setFilterData(result.queryresult.ancfollowupdetails);
            }
        } catch (e) {
            console.error(e.message);
        }
    };

 



    const filterAll = () => {
        setAll(true);
        setScheduled(false);
        setExamined(false);
        setCompleted(false);
        setFilterData(Data);
    };
    const filterScheduled = () => {
        setAll(false);
        setScheduled(true);
        setExamined(false);
        setCompleted(false);

        const filterData = Data.filter((item) => item.status === "scheduled");

        setFilterData(filterData);
    };

    const filterExamined = () => {
        setAll(false);
        setScheduled(false);
        setExamined(true);
        setCompleted(false);

        const filterData = Data.filter((item) => item.status === "examined");

        setFilterData(filterData);
    };
    const filterCompleted = () => {
        setAll(false);
        setScheduled(false);
        setExamined(false);
        setCompleted(true);

        const filterData = Data.filter((item) => item.status === "completed");

        setFilterData(filterData);
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

        }, 5000)
    }





    const AddFollowUp = () => {
        setModalState("new")
        onOpen()
        setOldPayload({_id: id})
    }
    const handleEdit = (item) => {
        setModalState("edit")
        setOldPayload(item)

        onOpen()
    }
    const handleView = (item) => {
        setModalState("view")
        setOldPayload(item)

        onOpen()
    }

     const nav = useNavigate()
    
    const pathname = localStorage.getItem("pathname")

    useEffect(() => {

        getAllAncFollowup()

    }, [isOpen, Trigger]);

    return (
        <MainLayout>
            <Seo title="ANC follow Up" description="Care connect  ANC Follow up " />
              <Button leftIcon={<IoMdArrowRoundBack />} px="40px" w="100px" onClick={() => nav(`${pathname}`)}>Back</Button>
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

                    </Flex>

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

                                    {/* <MenuItem onClick={() => filterBy("appointmentId")} textTransform="capitalize" fontWeight={"500"} color='#2F2F2F' _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}>
                                    <HStack fontSize="14px">

                                        <Text>by </Text>
                                    </HStack>
                                </MenuItem> */}

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
                </Flex>

                <Flex
                    justifyContent="space-between"
                    flexWrap="wrap"
                    mt={["10px", "10px", "10px", "10px"]}
                    w={["100%", "100%", "50%", "37%"]}
                >
                    <Button
                        rightIcon={<SlPlus />}
                        w={["100%", "100%", "154px", "154px"]} px={"120px"}
                        onClick={AddFollowUp}
                    >
                        Add Follow Up
                    </Button>


                </Flex>



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

                    <Text mb="20px" fontWeight="700" fontSize="16px" color="blue.blue500">ANC Follow up History</Text>

                    <TableContainer>
                        <Table variant="striped">
                            <Thead bg="#fff">
                                <Tr>
                                    <Th fontSize="13px" color="#534D59" fontWeight="600">
                                        date
                                    </Th>

                                    <Th fontSize="13px" color="#534D59" fontWeight="600">
                                        height of fundus
                                    </Th>
                                    <Th fontSize="13px" color="#534D59" fontWeight="600">
                                        presentation and position
                                    </Th>
                                    <Th fontSize="13px" color="#534D59" fontWeight="600">
                                        presenting part
                                    </Th>
                                    <Th fontSize="13px" color="#534D59" fontWeight="600">
                                       foetal height
                                    </Th>
                                    <Th fontSize="13px" color="#534D59" fontWeight="600">
                                       bp
                                    </Th>
                                    <Th fontSize="13px" color="#534D59" fontWeight="600">
                                       hb
                                    </Th>
                                    <Th fontSize="13px" color="#534D59" fontWeight="600">
                                       protein
                                    </Th>
                                    <Th fontSize="13px" color="#534D59" fontWeight="600">
                                       glucose
                                    </Th>
                                    <Th fontSize="13px" color="#534D59" fontWeight="600">
                                       weight
                                    </Th>
                                  
                                    <Th fontSize="13px" color="#534D59" fontWeight="600">
                                       oedema 
                                    </Th>
                                    <Th fontSize="13px" color="#534D59" fontWeight="600">
                                       tetanus toxoid
                                    </Th>
                                    <Th fontSize="13px" color="#534D59" fontWeight="600">
                                       sulfadoxine pyrimethamine
                                    </Th>
                                    <Th fontSize="13px" color="#534D59" fontWeight="600">
                                       albendazole
                                    </Th>
                                    <Th fontSize="13px" color="#534D59" fontWeight="600">
                                       remark
                                    </Th>

                                    <Th fontSize="13px" color="#534D59" fontWeight="600">
                                        Actions
                                    </Th>
                                </Tr>
                            </Thead>
                            <Tbody>

                                {
                                    PaginatedData.map((item, i) => (
                                        <TableRow
                                            key={i}
                                            type="anc-followup-v3"
                                            date={moment(item.createdAt).format("lll")}
                                            heightoffundus={item.heightoffundus}
                                            presentationandposition={item.presentationandposition}
                                            presentingpart={item.presentingpart}
                                            foetalheight={item.foetalheight}
                                            bp={item.bp}
                                            hb={item.hb}
                                            protein={item.protein}
                                            glucose={item.glucose}
                                            weight={item.weight}
                                            oedema={item.oedema}
                                            tetanustoxoid={item.tetanustoxoid}
                                            sulfadoxinepyrimethamine={item.sulfadoxinepyrimethamine}
                                            albendazole={item.albendazole}
                                            remark={item.remark}
                                            status={item.status}
                                            onEdit={() => handleEdit(item)}
                                            onView={() => handleView(item)}



                                        />
                                    ))
                                }


                            </Tbody>
                        </Table>
                    </TableContainer>

                    <CreateANCFollowUpModalv3 isOpen={isOpen} onClose={onClose} type={ModalState} activateNotifications={activateNotifications} oldPayload={OldPayload} />
                </Box>

                <Pagination postPerPage={PostPerPage} currentPage={CurrentPage} totalPosts={Data.length} paginate={paginate} />


            </Box>
        </MainLayout>
    )
}
