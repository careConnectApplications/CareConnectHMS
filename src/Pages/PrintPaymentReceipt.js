import { HStack, Box, Text, Spacer, Image, Flex, SimpleGrid } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import Button from "../Components/Button";
import PrintCard from "../Components/PrintCard";
import { Table, Thead, Tbody, Tr, Th, TableContainer } from "@chakra-ui/react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdLocalPrintshop } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../Assets/carelogo.png"
import { GetPaymentReceiptApi } from "../Utils/ApiCalls";
import moment from "moment";
import TableRow from "../Components/TableRow";
import Preloader from "../Components/Preloader";

export default function PrintPaymentReceipt() {
    const [IsLoading, setIsLoading] = useState(true);
    const { id } = useParams()
    const nav = useNavigate()
    const pathname = localStorage.getItem("pathname")
    const [Data, setData] = useState([]);
    const [TotalAmount, setTotalAmount] = useState([]);
    const [ResultData, setResultData] = useState([]);
    const [StaffName, setStaffName] = useState("");
    const [Hide, setHide] = useState(false);

    const getPaymentReceipt = async () => {
        setIsLoading(true)
        try {
            const result = await GetPaymentReceiptApi(id);
            console.log("GetPaymentReceiptApi", result)
            if (result.status === true) {
                setIsLoading(false)
                setData(result.queryresult.paymentdetails[0]);
                setResultData(result.queryresult.paymentdetails)
                setTotalAmount(result.totalAmount[0].totalAmount)
                setStaffName(result.printedbystaffname)
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

    // async function getRealTime() {
    //     try {
    //       const response = await fetch('https://worldtimeapi.org/api/ip');
    //       const data = await response.json();
    //       console.log('Current UTC Date & Time:', data.utc_datetime);
    //       // or local datetime
    //       console.log('Local Date & Time:', data.datetime);
    //     } catch (error) {
    //       console.error('Failed to fetch time:', error);
    //     }
    //   }
      
      useEffect(() => {
        
        getPaymentReceipt();
    }, []);

    return (
        <Box px="1%" mt="32px">
            {IsLoading && (
                <Preloader />
            )}
            {Hide === false && (
                <HStack mb="12px">
                    <Button leftIcon={<IoMdArrowRoundBack />} w="150px" onClick={() => nav(`${pathname}`)}>Back</Button>
                    <Spacer />
                    <Button w="150px" rightIcon={<MdLocalPrintshop />} onClick={printNow}>Print</Button>
                </HStack>
            )}
           
            <Text textAlign="center" fontSize="9px" textTransform="uppercase" fontWeight="900" color="#242424">
                General Hospital Katsina
            </Text>
            {Data?.numberoftimesprinted > 1 && (
                <Text textAlign="center" fontSize="12px" textTransform="uppercase" fontWeight="900" color="#242424">
                    Duplicate
                </Text>
            )}
            <Box border="1px solid gray" p="8px" mt="10px" rounded="8px">
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={1}>
                    <PrintCard title="payment reference" value={Data?.paymentreference} />
                    <PrintCard title="date" value={moment(Data?.createdAt).format("LL")} />
                    <PrintCard title="Client Name" value={`${Data?.patient?.firstName} ${Data?.patient?.lastName}`} />
                    <PrintCard title="Client MRN" value={`${Data?.patient?.MRN}`} />
                    <PrintCard title="HMO ID" value={Data?.patient?.HMOId} />
                    <PrintCard title="Cashier ID" value={Data?.cashierid} />
                    <PrintCard title="Cashier Name" value={StaffName} />
                    <PrintCard title="Total amount (&#8358;)" value={TotalAmount.toLocaleString()} />
                </SimpleGrid>
            </Box>
           

            {
                ResultData.map((item, i)=>(
                      
            <Box border="1px solid gray" p="8px" mt="10px" rounded="8px">
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={1}>
                    <PrintCard title="item" value={item.paymentype} />
                    <PrintCard title="quantity" value={item.qty} />
                    <PrintCard title="amount (&#8358;)" value={(item.amount / item.qty).toLocaleString()} />
                    <PrintCard title="total (&#8358;)" value={item.amount.toLocaleString()} />
                    
                  
                </SimpleGrid>
            </Box>
                ))
            }
          

           
        </Box>
    )
}
