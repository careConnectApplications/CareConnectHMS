import { Button as ButtonBox } from '@chakra-ui/button';
import { Box } from '@chakra-ui/react';
import React from 'react';
import {  useNavigate } from 'react-router-dom';

export default function Button({
  children,
  onClick = () => {},
  isLoading = false,
  pos="relative",
  link = false,
  isSubmit = false,
  size = 'md',
  disabled = false,
  full = false,
  background = 'blue.blue500',
  color = '#fff',
  border,
  w= "100%",
  leftIcon,
  rightIcon,
  href,
  mt,
  mb, 
  px="85px",
  loadingText="Please wait . . .",
  py="8px"
}) {

  const history = useNavigate();
 

  return (
    <ButtonBox
      fontSize={size === 'xs' ? 'xs' : size === 'sm' ? 'sm' : '16px'}
      fontWeight={'400'}
      pos={pos}
      color={color}
      bg={background}
      border={border}
      _focus={{outline: "none"}}
      transition= "0.5s"
      _hover={{
        bg: "blue.blue400",
        color: "#fff",
        border: "none"
      }}
      _active={{
        bg: "blue.blue400",
        color: "#fff"
      }}
      rounded="8px"
      size={size}
      as="button"
      onClick={() => {
        link ? history(link) : onClick();
      }}
      
      isLoading={isLoading}
      loadingText={loadingText}
      type={isSubmit ? 'submit' : 'button'}
      disabled={isLoading || disabled}
      w={w}
      px={px}
      py={py}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      mt={mt}
      mb={mb}
    >
    <Box as = "a" href={href}>
    {children}
    </Box>
     
    </ButtonBox>
  );
}
