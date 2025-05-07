import { HStack, Box, Text, Spacer, Image, Flex, SimpleGrid } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import Button from "../Components/Button";
import PrintCard from "../Components/PrintCard";
import { Table, Thead, Tbody, Tr, Th, TableContainer } from "@chakra-ui/react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdLocalPrintshop } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../Assets/carelogo.png"
import { GetReportApi } from "../Utils/ApiCalls";
import moment from "moment";
import { FacilityName } from "../Utils/ApiConfig";
import TableRow from "../Components/TableRow";
import Preloader from "../Components/Preloader";


export default function PrintLabReport() {
    const [IsLoading, setIsLoading] = useState(true);
    const { id } = useParams()


    const nav = useNavigate()

    const pathname =   localStorage.getItem("pathname")

    const [Data, setData] = useState([]);
    const [ResultData, setResultData] = useState([]);

    const [Hide, setHide] = useState(false);


    const getReport = async () => {
        setIsLoading(true)
        try {
            const result = await GetReportApi(id);
            if (result.status === true) {
                setIsLoading(false)

                let index = result.queryresult.labdetails.length - 1
                // console.log("GetReportApi", result.queryresult.labdetails[index])
                console.log("GetReportApi", result)


                setData(result.queryresult.labdetails[index]);
                setResultData(result.queryresult.labdetails)

            }
        } catch (e) {
            console.error(e.message);
        }
    };


    const printNow = () => {
        setHide(true)

        setTimeout(() => {
            window.print()

        }, 1000);
        setTimeout(() => {
            setHide(false)


        }, 2000);
    }


    useEffect(() => {
        getReport();

    }, []);

    return (
        <Box px="6%" mt="32px">
          {
                IsLoading && (
                    <Preloader />
                )
            }
            {
                Hide === false && (

                    <HStack mb="12px">
                        <Button leftIcon={<IoMdArrowRoundBack />} w="150px" onClick={() => nav(`${pathname}`)}>Back</Button>
                        <Spacer />
                        <Button w="150px" rightIcon={<MdLocalPrintshop />} onClick={printNow}>Print</Button>
                    </HStack>
                )
            }
            <Flex justifyContent="center">
                <Image src={logo} width={"10%"} onClick={() => nav("/")} />
            </Flex>
            <Text textAlign="center" fontSize="25px" textTransform="uppercase" fontWeight="900" color="blue.blue500">{FacilityName}</Text>
            <Text textAlign="center" fontSize="20px" textTransform="uppercase" fontWeight="700" color="#242424">Laboratory Department</Text>

            <Box border="1px solid gray" p="15px" mt="10px" rounded="8px">

                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} >

                    <PrintCard title="MRN" value={Data?.patient?.MRN} />
                    <PrintCard title="code" value={Data?.appointmentid} />
                    <PrintCard title="name" value={`${Data?.patient?.firstName} ${Data?.patient?.lastName}`} />
                    <PrintCard title="gender" value={Data?.patient?.gender} />
                    <PrintCard title="age" value={Data?.patient?.age} />
                    <PrintCard title="date" value={moment(Data?.processeddate).format("L")} />
                    <PrintCard title="time" value={moment(Data?.processeddate).format("LT")} />
                    <PrintCard title="staff" value={`${Data?.staffname?.firstName} ${Data?.staffname?.middleName}`} />


                </SimpleGrid>

            </Box>

          {
            ResultData.map((item,i)=>(
                <Box>
                <Text mt="5px" fontSize="16px" textTransform="uppercase" fontWeight="700" color="blue.blue500">{item.testname}</Text>

                <TableContainer mt="10px">
                    <Table variant="striped">
                        <Thead bg="blue.blue500">
                            <Tr>
                                <Th
                                    fontSize="13px"
                                    textTransform="capitalize"
                                    color="#fff"
                                    fontWeight="600"
                                >
                                    S/N
                                </Th>
                                <Th
                                    fontSize="13px"
                                    textTransform="capitalize"
                                    color="#fff"
                                    fontWeight="600"
                                >
                                    Test Name
                                </Th>
                                <Th
                                    fontSize="13px"
                                    textTransform="capitalize"
                                    color="#fff"
                                    fontWeight="600"
                                >
                                    result
                                </Th>
                                <Th
                                    fontSize="13px"
                                    textTransform="capitalize"
                                    color="#fff"
                                    fontWeight="600"
                                >
                                    nranges
                                </Th>


                                <Th
                                    fontSize="13px"
                                    textTransform="capitalize"
                                    color="#fff"
                                    fontWeight="600"
                                >
                                    unit
                                </Th>
                            </Tr>
                        </Thead>
                        <Tbody>


                            {
                                item.testresult?.map((item, i) => (

                                    <TableRow
                                        key={i}
                                        type="print-report"
                                        sn={i + 1}
                                        subComponent={item.subcomponent}
                                        result={item.result}
                                        nRanges={item.nranges}
                                        unit={item.unit}

                                    />
                                ))
                            }


                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
            ))
          }
           






        </Box>
    )
}
