import { Box, Flex, HStack, Avatar, Text,Menu, MenuButton, MenuList, MenuItem,} from '@chakra-ui/react'
import {

    Tr,
    Td,

} from '@chakra-ui/react';
import { BsThreeDots } from "react-icons/bs"
import { useNavigate } from 'react-router-dom'

export default function TableRowX({ type, name, mrn, phone, code, age,patientType, email,status, date, onEdit, hmoId, onRemove, onView, onChangeStatus, onClick, gender,hmoStatus }) {
    const router = useNavigate()
    return (

        <Tr textTransform="capitalize" cursor="pointer">
            {
                type === "patient-management" && (
                    <>
                    <Td >
                        <HStack cursor={"pointer"} onClick={onClick}>
                            <Avatar name={name} size='sm' src='https://bit.ly/tioluwani-kolawole' />
                            <Box>
                            <Text color={"#101828"} fontWeight={"500"} fontSize={"13px"} >{name}</Text>
                            <Text color={"#667085"} textTransform={"lowercase"} fontWeight={"400"} fontSize={"11px"} >{email}</Text>

                            </Box>
                          

                        </HStack>   

                    </Td>
                    <Td><Text fontWeight="400" fontSize={"12px"}>{mrn}</Text></Td>
                    <Td><Text fontWeight="400" fontSize={"12px"}>{patientType}</Text></Td>
                    <Td><Text fontWeight="400" fontSize={"12px"}>{code}</Text></Td>
                    <Td><Text fontWeight="400" fontSize={"12px"} >{phone}</Text></Td>
                    <Td><Text fontWeight="400" fontSize={"12px"} >{age}</Text></Td>
                    <Td><Text fontWeight="400" fontSize={"12px"} >{gender}</Text></Td>
                    <Td><Text fontWeight="400" fontSize={"12px"} >{hmoStatus}</Text></Td>
                    <Td><Text fontWeight="400" fontSize={"12px"} >{hmoId}</Text></Td>
                    <Td>
                        <HStack color={status === "active" ? "#027A48": status === "inactive" ? "#FFA30C": "#FD4739"}>
                            <Box rounded="100%" w="8px" h="8px" bg={status === "active" ? "#027A48": status === "inactive" ? "#FFA30C": "#FD4739"}></Box>
                            <Text fontWeight="400" fontSize={"12px"} >{status}</Text>
                        </HStack>
                    </Td>
                    <Td><Text fontWeight="400" fontSize={"13px"} >{date}</Text></Td>
                    <Td>
                         <Menu isLazy>
                            <MenuButton as={Box}>

                            <Flex justifyContent="center" color="#000000" fontSize="16px"><BsThreeDots /></Flex>
                            </MenuButton>
                            <MenuList >
                             
                                <MenuItem onClick={onEdit} textTransform="capitalize" fontWeight={"500"} color='#2F2F2F' _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}>
                                    <HStack fontSize="12px">
                                      
                                        <Text>Edit</Text>
                                    </HStack>
                                </MenuItem>
                               
                                <MenuItem  onClick={onView} textTransform="capitalize" fontWeight={"500"} _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}>
                                    <HStack fontSize="12px">
                                      
                                        <Text >View</Text>
                                    </HStack>
                                </MenuItem>

                                <MenuItem  onClick={onView} textTransform="capitalize" fontWeight={"500"} _hover={{ color: "#fff", fontWeight: "400", bg: "blue.blue500" }}>
                                    <HStack fontSize="12px">
                                      
                                        <Text >Delete</Text>
                                    </HStack>
                                </MenuItem>

                            </MenuList>
                        </Menu>
                        </Td>
                    </>
                 
                )
            }
         

        </Tr>
    )
}
