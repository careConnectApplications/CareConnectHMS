import {
    Box,
    FormControl,
    FormHelperText,
    FormLabel,
    Input as InputBox,
    InputGroup,
    Textarea,
    InputLeftElement,
    InputRightElement,
    useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { act } from "react-dom/test-utils";
import { AiOutlineMail } from "react-icons/ai";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function TextArea({
    id = "",
    val = false,
    label = "",
    bColor = "#6B7280",
    isRequired = false,
    type = "text",
    readOnly = false,
    helper = null,
    onChange = null,
    isDisabled = false,
    size = "lg",
    placeholder = `Enter ${label.toLowerCase()}`, 
    pl = 0,
    py = 0,
    mt = "",
    rightIcon = null,
    w = "100%",
    h = "40%",
    borderColor = "blue.blue500",
    labelBg = "blue.blue350",
    leftIcon,
    iconColor = "#fff",
    ...rest
}) {
    const [active, setActive] = useState(rest.value);
    // const [value, setValue] = useState(val);

    const [inputType, setInputType] = useState(type);

    return (
        <FormControl
            id={id}
            isReadOnly={readOnly}
            isDisabled={isDisabled}
            isRequired={isRequired}
            pos="relative"
        >
            <FormLabel
                pos="absolute"
                transform={`translateY(${active || val ? "-40px" : "-40px"
                    }) translateX(0px)`}
                bottom={"16"}
                zIndex="10"
                fontSize={active ? "14" : "14px"}
                fontWeight="500"
                textTransform={"capitalize"}
                color={"#00000"}
                bg={active ? labelBg : "transparent"}
                px="4px"
            >
                {label}
            </FormLabel>

            <InputGroup>
                <InputGroup>
                    {/* <InputLeftElement
            pointerEvents='none'
            children={<Box pos={"relative"} color={active ? borderColor: iconColor} top="4.5px" fontSize={"20px"}>{leftIcon}</Box>}
          /> */}
                    <Textarea
                        // borderColor={Colors.red}
                        resize='none'
                        onChange={onChange}
                        {...rest}
                        placeholder={active || !label ? placeholder : placeholder}
                        type={inputType}
                        focusBorderColor={"blue.blue400"}
                        _placeholder={{color: "#ADB4BF", fontSize: "13px"}}
                        _focus={{ borderColor: borderColor }}
                        size={size}
                        py={py}
                        color="#00000"
                        _autofill={{ bgColor: "#fff !important" }}
                        fontWeight={"400"}
                        fontSize="16px"
                        fontFamily={"body"}
                        dropShadow={"#ADE2FFB2"}
                        borderWidth={"2px"}
                        borderColor={bColor}
                        height={"100px"}
                        rounded="8px"
                        bg="transparent"
                        w={w}
                        onFocus={() => setActive(true)}
                        onBlur={() => {
                            if (!rest.value) {
                                setActive(false);
                            }
                        }}
                    // height="56px"
                    />
                    {rightIcon && <InputRightElement children={rightIcon} />}
                </InputGroup>
                {type === "password" && (
                    <InputRightElement
                        children={
                            inputType === "password" ? (
                                <FaEyeSlash color="green.500" />
                            ) : (
                                <FaEye color="green.500" />
                            )
                        }
                        cursor={"pointer"}
                        onClick={() => {
                            if (inputType === "password") {
                                setInputType("text");
                            } else {
                                setInputType("password");
                            }
                        }}
                    />
                )}
            </InputGroup>
            {helper && (
                <FormHelperText pos={"absolute"} p={1} m="0" fontSize={"10px"}>
                    {helper}
                </FormHelperText>
            )}
        </FormControl>
    );
}
