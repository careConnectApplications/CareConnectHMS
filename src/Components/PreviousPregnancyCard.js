import { Box, HStack, Select, Stack, SimpleGrid } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { AiFillCloseCircle, AiOutlineFieldNumber, AiOutlineSearch } from 'react-icons/ai'
import { SettingsApi } from "../Utils/ApiCalls";
import Input from './Input'
import { MdDateRange } from "react-icons/md";
import { CgArrangeFront } from "react-icons/cg";
import { BiUnite } from "react-icons/bi";
import { FaNoteSticky } from "react-icons/fa6";


export default function PreviousPregnancyCard({ Payload, setPayload, oldItem = [], data, i, testName }) {
    const [Data, setData] = useState([]);

    const [Settings, setSettings] = useState({});


    let itemToUpdate = oldItem;



    const handleYear = (e) => {
        //get the item index to update
        let objIndex = itemToUpdate.findIndex((obj, index) => index == i);

        // console.log("idd", objIndex, itemToUpdate[objIndex]);

        itemToUpdate[objIndex].year = e.target.value

        setPayload({ ...Payload, previouspregnancy: itemToUpdate });
    }
   
    const handledurationpregnancy = (e) => {
        //get the item index to update
        let objIndex = itemToUpdate.findIndex((obj, index) => index == i);

        // console.log("idd", objIndex, itemToUpdate[objIndex]);

        itemToUpdate[objIndex].durationpregnancy = e.target.value

        setPayload({ ...Payload, previouspregnancy: itemToUpdate });
    }
    const handleantenatalcomplication = (e) => {
        //get the item index to update
        let objIndex = itemToUpdate.findIndex((obj, index) => index == i);

        // console.log("idd", objIndex, itemToUpdate[objIndex]);

        itemToUpdate[objIndex].antenatalcomplication = e.target.value

        setPayload({ ...Payload, previouspregnancy: itemToUpdate });
    }
    const handlelabour = (e) => {
        //get the item index to update
        let objIndex = itemToUpdate.findIndex((obj, index) => index == i);

        // console.log("idd", objIndex, itemToUpdate[objIndex]);

        itemToUpdate[objIndex].labour = e.target.value

        setPayload({ ...Payload, previouspregnancy: itemToUpdate });
    }
    const handleageifalive = (e) => {
        //get the item index to update
        let objIndex = itemToUpdate.findIndex((obj, index) => index == i);

        // console.log("idd", objIndex, itemToUpdate[objIndex]);

        itemToUpdate[objIndex].ageifalive = e.target.value

        setPayload({ ...Payload, previouspregnancy: itemToUpdate });
    }
    const handleageifdead = (e) => {
        //get the item index to update
        let objIndex = itemToUpdate.findIndex((obj, index) => index == i);

        // console.log("idd", objIndex, itemToUpdate[objIndex]);

        itemToUpdate[objIndex].ageifdead = e.target.value

        setPayload({ ...Payload, previouspregnancy: itemToUpdate });
    }
    const handlecauseofdeath = (e) => {
        //get the item index to update
        let objIndex = itemToUpdate.findIndex((obj, index) => index == i);

        // console.log("idd", objIndex, itemToUpdate[objIndex]);

        itemToUpdate[objIndex].causeofdeath = e.target.value

        setPayload({ ...Payload, previouspregnancy: itemToUpdate });
    }
   
    const removeItem = () => {
        let newItem = oldItem.filter((obj, index) => (
            index !== i
        ))

        setPayload({ ...Payload, previouspregnancy: newItem })
    }

    const getSettings = async () => {
        try {
            const result = await SettingsApi();

            console.log("getSettings", result)

            let checker = result?.testsubcomponent?.filter(item => item.type === testName)[0]?.subcomponent

            console.log("checkerX", checker)
            setData(checker)
            setSettings(result);
        } catch (e) {

        }
    };

    


    useEffect(() => {
        getSettings()

    }, []);

    return (
        <Stack spacing={"10px"} mt="10px">
            <Box cursor={"pointer"} onClick={removeItem} display={i == 0 ? "none" : "flex"} justifyContent="flex-end"><AiFillCloseCircle /></Box>
           
            <SimpleGrid mt="32px" columns={{ base: 1, md: 2 }} spacing={4}>

          

                            <Input leftIcon={<MdDateRange />} onChange={handleYear} label="Year" type="date"  value={data.year}  id="year" val={data.year !== "" ? true : false} />
                          
                            <Input leftIcon={<BiUnite />} label="Duration of Pregnancy"  onChange={handledurationpregnancy}  value={data.durationpregnancy}  id="durationpregnancy" val={data.durationpregnancy !== "" ? true : false} />
                            <Input leftIcon={<BiUnite />} label="Antenatal Complication"  onChange={handleantenatalcomplication}  value={data.antenatalcomplication}  id="antenatalcomplication" val={data.antenatalcomplication !== "" ? true : false} />
                            <Input leftIcon={<BiUnite />} label="Labour"  onChange={handlelabour}  value={data.labour}  id="labour" val={data.labour !== "" ? true : false} />
                            <Input leftIcon={<BiUnite />} label="Age if Alive"  onChange={handleageifalive}  value={data.ageifalive}  id="ageifalive" val={data.ageifalive !== "" ? true : false} />
                            <Input leftIcon={<BiUnite />} label="Age if Dead"  onChange={handleageifdead}  value={data.ageifdead}  id="ageifdead" val={data.ageifdead !== "" ? true : false} />
                            <Input leftIcon={<BiUnite />} label="Cause of Death"  onChange={handlecauseofdeath}  value={data.causeofdeath}  id="causeofdeath" val={data.causeofdeath !== "" ? true : false} />
                           

                        </SimpleGrid>

        </Stack>
    )
}
