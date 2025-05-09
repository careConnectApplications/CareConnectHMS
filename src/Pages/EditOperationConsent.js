import { Text, Box, Flex, Stack, SimpleGrid } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import MainLayout from "../Layouts/Index";
import Seo from "../Utils/Seo";
import Button from "../Components/Button";
import Input from "../Components/Input";
import SignaturePad from "../Components/SignaturePad";
import ShowToast from "../Components/ToastNotification";
import TheatrePreAnathetics from "./TheatrePreAnathetics";

import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io"; import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react'
import { EditOperationalConsentAPI } from "../Utils/ApiCalls";
import { FaNoteSticky } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { useParams } from 'react-router-dom';

export default function EditOperationConsent() {
    const { id } = useParams()
    const [Loading, setLoading] = useState(false);
    const [Signature, setSignature] = useState("");
    console.log("dataURL", Signature);
    const [Payload, setPayload] = useState({

        imageBase64: "",
        nameofexplainer: "",
        nameofrepresentive: "",
        conscentdate:""


    })


    const handlePayload = (e) => {
        setPayload({ ...Payload, [e.target.id]: e.target.value })
        
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

    const handleSubmit = async () => {

        setLoading(true)
        try {
            const result = await EditOperationalConsentAPI(
                {
                    ...Payload,
                    imageBase64: Signature
                    
                }, id);


            if (result.status === 200) {
                setLoading(false)
                activateNotifications("Consent Updated Successfully", "success")
                setTimeout(() => {
                    nav(`${pathName}`)
                }, 2000);
            }

        } catch (e) {
            setLoading(false)
            activateNotifications(e.message, "error")
        }
    }



   const  oldRecord = JSON.parse(localStorage.getItem("oldRecord"))
   
       useEffect(() => {
   
           setPayload(
               {
                   nameofexplainer: oldRecord.nameofexplainer,
                   nameofrepresentive: oldRecord.nameofrepresentive,
                   conscentdate:oldRecord.conscentdate
                  
               }
           )
   
          
   
       }, []);

    const nav = useNavigate()

    const pathname = localStorage.getItem("pathname")
    return (
        <MainLayout>
            {showToast.show && (
                <ShowToast message={showToast.message} status={showToast.status} />
            )}
            <Seo title="Operational Consent " description="Care connect Theatre  Operational Consent" />

            <Box>
                <Button leftIcon={<IoMdArrowRoundBack />} px="40px" w="100px" onClick={() => nav(`${pathname}`)}>Back</Button>

                <Accordion defaultIndex={[7]} mt="32px" allowToggle>
                    {/* <AccordionItem mb="15px" >

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                Previous Pre Anathetics
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px" >
                            <TheatrePreAnathetics hide={true} />
                        </AccordionPanel>
                    </AccordionItem> */}
                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                Form
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                            <SimpleGrid mt="32px" columns={{ base: 1, md: 2 }} spacing={5}>
                                <Input type="text" leftIcon={<FaNoteSticky />} label="Name Of Explainer" value={Payload.nameofexplainer} val={Payload.nameofexplainer !== "" ? true : false} onChange={handlePayload} id="nameofexplainer" />
                                <Input type="text" leftIcon={<FaNoteSticky />} label="Name Of Representative" value={Payload.nameofrepresentive} val={Payload.nameofrepresentive !== "" ? true : false} onChange={handlePayload} id="nameofrepresentive" />
                                <Input type="date" leftIcon={<FaNoteSticky />} label="Consent Date" value={Payload.conscentdate} val={Payload.conscentdate !== "" ? true : false} onChange={handlePayload} id="conscentdate" />
                               

                            </SimpleGrid>

                        </AccordionPanel>
                    </AccordionItem>

                  
                    <AccordionItem mb="15px">

                        <AccordionButton _hover={{ border: "1px solid #EA5937", color: "#000" }} _focus={{ outline: "none" }} border="1px solid #fff" _expanded={{ rounded: "8px 8px 0px 0px", border: 0 }} bg="#fff" color="#000" rounded="8px">
                            <Box as='span' flex='1' textAlign='left'>
                                Consent Signature
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>

                        <AccordionPanel pb={4} bg="#fff" rounded="0px 0px 8px 8px">
                          <SignaturePad setSignature={setSignature}/>


                        </AccordionPanel>
                    </AccordionItem>


                </Accordion>

                <Flex justifyContent="center">

                    <Flex
                        justifyContent="center"
                        flexWrap="wrap"
                        mt={["10px", "10px", "10px", "10px"]}
                        w={["100%", "100%"]}
                    >

                        <Button
                            w={["100%", "100%", "184px", "184px"]}
                            onClick={handleSubmit}
                            isLoading={Loading}


                        >
                            Submit
                        </Button>


                    </Flex>
                </Flex>


            </Box>
        </MainLayout>
    )
}
