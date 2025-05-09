import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Text, Box, Flex, Stack, SimpleGrid } from '@chakra-ui/react'
import Button from "./Button";



function SignaturePad({setSignature}) {

  const sigCanvas = useRef({});

  const clear = () => sigCanvas.current.clear();

  const save = () => {
    const trimmedCanvas = sigCanvas.current.getCanvas();
    const dataURL = trimmedCanvas.toDataURL("image/png");
    
    setSignature(dataURL)
    //setImageURL(dataURL);
  };

  return (
    <Box>
      <Text fontSize="14px">Sign Below</Text>
      <Box border="2px solid #EA5937" w={["100%", "100%", "50%", "50%"]} px="2" py="2" my="2" rounded="10px" >
        <SignatureCanvas
          penColor="black"
          canvasProps={{ width: 500, height: 200, }}
          ref={sigCanvas}
        />
      </Box>

      <Flex
        justifyContent="space-between"
        flexWrap="wrap"
        mt={["10px", "10px", "10px", "10px"]}
        w={["100%", "100%", "50%", "50%"]}
      >

        <Button w={["100%", "100%", "184px", "184px"]} onClick={clear} >
          Clear
        </Button>
        <Button w={["100%", "100%", "184px", "184px"]} onClick={save} >
          Save
        </Button>


      </Flex>


    </Box>
  );
}

export default SignaturePad;
