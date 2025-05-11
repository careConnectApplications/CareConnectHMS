import { Box, Flex, HStack, Avatar, Text, Menu, MenuButton, MenuList, MenuItem, useDisclosure } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator, Image } from '@chakra-ui/react'
import React, { useState } from 'react'
import Button from '../Components/Button'
import NotificationCard from '../Components/NotificationCard'
import { IoIosArrowDown, IoMdNotificationsOutline } from 'react-icons/io'
import { BsQuestionCircle } from "react-icons/bs";
import { MdLogout } from "react-icons/md";
import { FacilityName } from "../Utils/ApiConfig";
import { CgMenuLeft } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";

import SideBar from './SideBar'

import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Stack,
} from '@chakra-ui/react'

import logo from "../Assets/carelogo.png"
import { useNavigate,useLocation} from 'react-router-dom';

import { jwtDecode } from "jwt-decode"
import { NavList } from './NavList';
import NavItem from "./NavLink";


export default function NavBar({ showSearch = true,showNav = true }) {


    const { isOpen, onOpen, onClose } = useDisclosure()

      const [isOpenx, setIsOpenx] = useState('');
    const location = useLocation();
    
    
    
        const List = NavList(location);
    const nav = useNavigate()
    const onlineUser = JSON.parse(localStorage.getItem("onlineUser"))
    const token = localStorage.getItem("token")

    const Logout = () => {

        localStorage.clear("token")
        localStorage.clear("onlineUser")

        nav("/")


    }

     


    if (jwtDecode(token).exp * 1000 <= Date.now()) {
        Logout()
        // alert("Session has expired")
    }



    return (
        <Flex borderLeft="1px solid #EDEFF2" pos="sticky" top="0" bgColor={"white"} alignItems={"center"} justifyContent={"space-between"} zIndex={"10"} px="24px" py="15.6px" borderBottom={"1px solid #EDEFF2"}>




            {/* <Box visibility={showSearch ? "visible" : "hidden"} w="40%" display={["none", "none", "block", "block"]} >
              
            </Box> */}

            <Box w="20%" display={["block", "block", "block", "block", "none"]} color="blue.blue500" fontSize="30px" onClick={onOpen}>
                <CgMenuLeft />
            </Box>
            <Box w="40%" display={["none", "none", "none", "none", "block"]} color="blue.blue500" textTransform="uppercase" fontWeight="700" fontSize="15px">
                <Text>{onlineUser.role} ~ {FacilityName}</Text>
            </Box>
            <Flex justifyContent="flex-end" w={["65%", "45%", "45%", "80%", "60%"]} cursor={"pointer"}>


                <HStack>

                    <Menu isLazy aria-expanded={true}>
                        <MenuButton as={Box}>
                            <Box color="#46455F" fontSize={"24px"} pos={"relative"} pr={"9px"} borderRight={"1px solid #D0D0D0"}>
                                <Box h="2.4px" w="2.4px" rounded={"100%"} pos={"absolute"} top={"3px"} left={"20px"} bg="#FC0202"></Box>
                                <IoMdNotificationsOutline />
                            </Box>
                        </MenuButton>
                        <MenuList minWidth={"250px"} maxWidth="350px">
                            {/* MenuItems are not rendered unless Menu is open */}
                            <Box pos='relative'>
                                <Tabs>
                                    <TabList color="#101828" pb="10px">
                                        <Tab _selected={{ color: "blue.blue500" }}>All</Tab>
                                        <Tab _selected={{ color: "blue.blue500" }}>Unread</Tab>

                                    </TabList>
                                    <TabIndicator mt='-1.5px' height='2px' bg='blue.blue500' borderRadius='1px' />
                                    <TabPanels>
                                        <TabPanel overflowY="auto" h="60vh">

                                            <NotificationCard
                                                title="order completed"
                                                message="Test Result order is done for Hafeez Ayanda has been created by admin On Date : 11/27/2024"
                                                timestamp="3s ago"
                                                unread={false}
                                            />

                                            {
                                                [3].map((item) => (
                                                    <NotificationCard
                                                        title="patient admitted"
                                                        message="Pro Test Admitted Successfully by admin On Date : 11/15/2024"
                                                        timestamp="5 mins ago"
                                                        unread={true}
                                                    />
                                                ))
                                            }
                                        </TabPanel>
                                        <TabPanel overflowY="auto" h="60vh">
                                            {
                                                [1, 2, 3, 4, 5, 4, 5].map((item, index) => (
                                                    <NotificationCard
                                                        title="patient admitted"
                                                        message="Pro Test Admitted Successfully by admin On Date : 11/15/2024"
                                                        timestamp="5 mins ago"
                                                        unread={true}
                                                    />
                                                ))
                                            }
                                        </TabPanel>

                                    </TabPanels>
                                </Tabs>
                                <Box pos="absolute" top="0" right="4">

                                    <Button background="transparent" border="1px solid #0060B6" hColor="#fff" color="blue.blue500" w='136px'>Mark All As Read</Button>
                                </Box>
                            </Box>


                        </MenuList>
                    </Menu>


                    <Box>
                        <Menu isLazy>
                            <MenuButton as={Box}>

                                <HStack cursor={"pointer"}>
                                    <Avatar name={`${onlineUser?.firstName} ${onlineUser?.lastName}`} size='sm' src='https://bit.ly/tioluwani-kolawole' />
                                    <Text color={"#2E2E2E"} fontWeight={"500"} fontSize={"14px"} >{`${onlineUser?.firstName} ${onlineUser?.lastName}`}</Text>
                                    <IoIosArrowDown size={"18px"} color='#000000' />

                                </HStack>
                            </MenuButton>
                            <MenuList minWidth='232px'>
                                {/* MenuItems are not rendered unless Menu is open */}
                                <MenuItem onClick={() => nav("/dashboard/profile-settings")} textTransform="capitalize" fontWeight={"400"} color='#586375' _hover={{ color: "blue.blue500", fontWeight: "600", bg: "orange.orange500" }}>
                                    <HStack fontSize="14px" >

                                        <IoSettingsOutline fontWeight={"900"} />
                                        <Text>Profile Settings</Text>
                                    </HStack>
                                </MenuItem>
                                <MenuItem textTransform="capitalize" fontWeight={"400"} color='#586375' _hover={{ color: "blue.blue500", fontWeight: "600", bg: "orange.orange500" }}>
                                    <HStack fontSize="14px"  >
                                        <BsQuestionCircle fontWeight={"900"} />
                                        <Text>help center</Text>
                                    </HStack>
                                </MenuItem>
                                <MenuItem onClick={Logout} textTransform="capitalize" fontWeight={"400"} color='#586375' _hover={{ color: "blue.blue500", fontWeight: "600", bg: "orange.orange500" }}>
                                    <HStack fontSize="14px"  >
                                        <MdLogout />
                                        <Text >log out</Text>
                                    </HStack>
                                </MenuItem>

                            </MenuList>
                        </Menu>
                    </Box>
                </HStack>
                <Drawer
                    isOpen={isOpen}
                    zIndex={"100px"}
                    placement='left'
                    onClose={onClose}

                >
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />


                        <DrawerBody>
                            {/* <SideBar borderRight="none" h="auto" /> */}

                            <Box pb="32px" h={"auto"} overflowY={"auto"} bgColor={"white"} borderRight={"none"} cursor="pointer" >


                                <Flex justifyContent={"flex-start"} alignItems={"center"} px="18.5px" py="13.6px">



                                    <Image src={logo} width={"55%"} onClick={() => nav("/")} />




                                </Flex>




                                <Stack spacing={"15px"} mt="32px" px="18.5px" visibility={showNav ? "visible" : "hidden"}>

                                    {
                                        List?.filter(item => item.display === true)
                                            .map((item, i) => (
                                                <NavItem
                                                    key={i}
                                                    submenu={item.children}
                                                    Wide={true}
                                                    icon={item?.icon}
                                                    onClick={() => {
                                                        if (item.children) {
                                                            if (item.name === isOpenx) {
                                                                setIsOpenx(null);



                                                            } else {
                                                                setIsOpenx(item.name);

                                                            }
                                                        } else {
                                                            nav(item.link);
                                                        }
                                                    }}
                                                    isOpen={isOpenx}
                                                    active={
                                                        item.active
                                                    }
                                                    activeScreen={item.active}

                                                    setIsOpen={setIsOpenx}

                                                >
                                                    {item.name}
                                                </NavItem>
                                            ))
                                    }



                                </Stack>

                            </Box>
                        </DrawerBody>

                    </DrawerContent>
                </Drawer>
            </Flex>




        </Flex>
    )
}
