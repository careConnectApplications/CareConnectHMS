import { HStack, Radio, RadioGroup, Text, Checkbox } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
     Table,
      Thead,
      Tbody,
      Tr,
      Th,
      TableContainer,
      
    Stack, SimpleGrid, Select, Flex
} from '@chakra-ui/react'
import { SlPlus } from "react-icons/sl";
import Input from "./Input";
import TextArea from "./TextArea";
import Button from "./Button";
import TableRow from "./TableRow";
import ReferralDiagnosisCard from "./ReferralDiagnosisCard";
import { FaNoteSticky } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { IoColorFilter } from "react-icons/io5";
import { SettingsApi, AddDeliveryNoteAPI, confirmPaymentAPI, confirmAllPaymentAPI, GetAllPaymentDetailApi, getWalletBalanceApi } from "../Utils/ApiCalls";
import { FaArrowsToDot } from "react-icons/fa6";
import { AiFillDatabase } from "react-icons/ai";
import moment from "moment";

export default function PaymentGroupModal({ isOpen, onClose, setOldPayload, activateNotifications, type, oldPayload }) {

    const [Disabled, setDisabled] = useState(true);
    const [Loading, setLoading] = useState(false);
    const [Clinics, setClinics] = useState([]);
    const [Data, setData] = useState([]);
    const [TotalAmount, setTotalAmount] = useState([]);
    const [Settings, setSettings] = useState("");
    const [Trigger, setTrigger] = useState(false);
    const [UseWallet, setUseWallet] = useState(false);
    const [WalletBalance, setWalletBalance] = useState(0);


    const id = localStorage.getItem('patientId')
    const [Payload, setPayload] = useState({

       note:""

    })
    const [UpdatedPayload, setUpdatedPayload] = useState({
      note:""
    })




    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })

    }

    const handleUpdatedPayload = (e) => {
        setUpdatedPayload({ ...UpdatedPayload, [e.target.id]: e.target.value })

    }

    const handleSubmitNew = async () => {
        setLoading(true)
        try {
            const result = await AddDeliveryNoteAPI(Payload, id);
        
            if (result.status === 200) {
                setLoading(false)
                setPayload({ 
                     note:""
                })
                activateNotifications("Delivery Note Added Successfully", "success")
                onClose()

            }

        } catch (e) {
            setLoading(false)
            activateNotifications(e.message, "error")
        }
    }




    const getSettings = async () => {
        try {
            const result = await SettingsApi();
            setSettings(result);
        } catch (e) {

        }
    };




 
    const getPaymentDetails = async () => {
        try {
            const result = await GetAllPaymentDetailApi(oldPayload.paymentreference);

            setData(result.queryresult.paymentdetails);
            setTotalAmount(result.totalAmount[0].totalAmount)

            // fetch wallet balance
            if(result.queryresult?.paymentdetails?.length > 0) {
                const patientId = result.queryresult.paymentdetails[0].patient?._id;
                if(patientId) {
                    const balanceResult = await getWalletBalanceApi(patientId);
                    if(balanceResult) {
                        setWalletBalance(balanceResult.queryresult?.walletBalance || balanceResult.walletBalance || balanceResult.balance || 0);
                    }
                }
            }
        } catch (e) {
            console.log(e.message, "error");
        }
    };
    const { pathname } = useLocation()
      const nav = useNavigate();
     const PrintReceipt = (item) => {
        nav(`/dashboard/billing-payment/receipt/${item.paymentreference}`)
        
        localStorage.setItem("pathname", pathname)
       
      }

      const onChangeStatus = async (id) => {
          try {
            const result = await confirmPaymentAPI(id, { useWallet: UseWallet });
            if (result.status === 200) {
            
                activateNotifications("Payment confirmed Successfully", "success")
               
                setTrigger(!Trigger)
            }
          } catch (err) {
            activateNotifications(err.message, "error")

          }
        };

      const ConfirmAllPayment = async () => {
          setLoading(true)
          try {
            const payload = { useWallet: UseWallet };
            const result = await confirmAllPaymentAPI(oldPayload.paymentreference, payload);
            if (result.status === 200) {
                setLoading(false)
            
                activateNotifications("All Payment confirmed Successfully", "success")
               
                setTrigger(!Trigger)
            }
          } catch (err) {
            activateNotifications(err.message, "error")
            setLoading(false)

          }
        };


    useEffect(() => {
        getPaymentDetails()
      
        getSettings()

        setUpdatedPayload({
            note: oldPayload?.note,
          
        })

    }, [isOpen, Payload, Trigger]);

    return (

        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent maxW={{ base: "90%", md: "80%" }} maxH="80vh"
                overflowY="auto">
                <ModalHeader>Payment Details </ModalHeader>
                <ModalCloseButton />
                <ModalBody>

         <Text>Total amount to be paid is {TotalAmount.toLocaleString()}</Text>          
          <TableContainer>
                    <Table variant="striped">
                      <Thead bg="#fff">
                        <Tr>
                          <Th
                            fontSize="13px"
                            textTransform="capitalize"
                            color="#534D59"
                            fontWeight="600"
                          >
                            patient name
                          </Th>
                          <Th
                            fontSize="13px"
                            textTransform="capitalize"
                            color="#534D59"
                            fontWeight="600"
                          >
                            MRN
                          </Th>
                          <Th
                            fontSize="13px"
                            textTransform="capitalize"
                            color="#534D59"
                            fontWeight="600"
                          >
                            phone
                          </Th>
                          <Th
                            fontSize="13px"
                            textTransform="capitalize"
                            color="#534D59"
                            fontWeight="600"
                          >
                            age
                          </Th>
        
                          <Th
                            fontSize="13px"
                            textTransform="capitalize"
                            color="#534D59"
                            fontWeight="600"
                          >
                            status
                          </Th>
                          <Th
                            fontSize="13px"
                            textTransform="capitalize"
                            color="#534D59"
                            fontWeight="600"
                          >
                            payment type
                          </Th>
                          <Th
                            fontSize="13px"
                            textTransform="capitalize"
                            color="#534D59"
                            fontWeight="600"
                          >
                            amount
                          </Th>
                          <Th
                            fontSize="13px"
                            textTransform="capitalize"
                            color="#534D59"
                            fontWeight="600"
                          >
                            Quantity
                          </Th>
                          <Th
                            fontSize="13px"
                            textTransform="capitalize"
                            color="#534D59"
                            fontWeight="600"
                          >
                            Total Amount
                          </Th>
                          <Th
                            fontSize="13px"
                            textTransform="capitalize"
                            color="#534D59"
                            fontWeight="600"
                          >
                            date created
                          </Th>
                          <Th
                            fontSize="13px"
                            textTransform="capitalize"
                            color="#534D59"
                            fontWeight="600"
                          >
                            actions
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
        
        
        
                        {
                    
                            Data?.map((item, i) => (
                              <TableRow
                                key={i}
                                type="payment"
                                name={`${item.patient?.firstName} ${item.patient?.lastName}`}
                                email={item.patient?.email}
                                age={item.patient?.age}
                                phone={item.patient?.phoneNumber}
                                mrn={item.patient?.MRN}
                                amount={item.amount/item.qty}
                                quantity={item.qty}
                                total={item.amount}
                                status={item.status}
                                paymentType={item.paymentype}
                                date={moment(item.createdAt).format("lll")}
                                onClick={() => onChangeStatus(item._id)}
                                onPrint={() => PrintReceipt(item)}
                              />
                            ))
                         
        
                        }
        
        
                      </Tbody>
                    </Table>
                  </TableContainer>

                  <Flex
                        justifyContent="flex-end"
                        alignItems="center"
                        flexWrap="wrap"
                        mt={["10px", "10px", "10px", "10px"]}
                        w={"100%"}
                        gap="3"
                    >
                        <Checkbox
                            isChecked={UseWallet}
                            onChange={(e) => setUseWallet(e.target.checked)}
                            colorScheme="blue"
                            fontWeight="500"
                            fontSize="14px"
                        >
                            Pay with Wallet (Wallet Balance: {Number(WalletBalance).toLocaleString()})
                        </Checkbox>
                        <Button
                            mt={["10px", "10px", "0px", "0px"]}
                            isLoading={Loading}
                            background="#f8ddd1 "
                            border="1px solid #EA5937"
                            color="blue.blue500"
                            w={["100%", "100%", "144px", "144px"]}
                            onClick={ConfirmAllPayment}
                            
                        >
                            Confirm all Payment 
                        </Button>
                        </Flex>

                </ModalBody>

                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
