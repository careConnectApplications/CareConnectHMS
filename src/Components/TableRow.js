import {
  Box,
  Flex,
  HStack,
  Avatar,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
} from "@chakra-ui/react";
import { Tr, Td } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export default function TableRow({
  type,
  name,
  email,
  labName,code,
  physicianName,
  collectedDate,facility, 
  reportedDate,visitType,supplement,gender,count,
  PaymentStatus,  sexualAssault,serviceNumber,policeCase,policeName,physicalAssault,
  dose,
  comment,
  vaccineType, albendazole,sulfadoxinepyrimethamine,tetanustoxoid,oedema,protein,hb,foetalheight,presentationandposition,heightoffundus,glucose,presentingpart,
  vaccineCode,
  administeredBy,
  pharmacy,
  drug,
  labStatus,
  cycleStatus,
  temperature,
  respiratory,
  liquor,
  moulding,
  contraction,
  onPrint,
  role,
  currentMedication,
  riskIdentified,
  followup,
  remark,
  urine,
  presentation,
  position,
  fhr,
  lie,
  wf,
  ga,
  sfh,
  phone,
  date,
  ClinicType,
  parity,
  weight,
  bp,
  onTransfer,
  status,
  inProgress,
  priority,
  receivingUnit,
  originatingUnit,
  id,
  deliveryNote,
  consultant,
  onProcess,
  clinic,
  onEdit,
  quantity,
  items,
  total,
  onRemove,
  onChangeStatus,
  mrn,
  age,
  paymentType,
  onClick,
  description,
  doctor,
  totalAmount,
  hmoStatus,
  amountPaid,
  outstanding,
  treatmentType,
  bookingTime,
  serviceType,
  serviceCategory,
  amount,
  reason,
  appointment,
  appointmentType,
  appointmentId,
  staffId,
  dept,
  testName,
  testId,
  onView,
  sn,
  subComponent,
  result,
  nRanges,
  unit,
  category,
  reference,
  appointmentcategory,
  appointmenttype,
  appointmentdate,
  vitalStatus,
  onVital,
  price,
  occupiedBed,
  totalBed,
  vacantBed,
  wardName,
  bedSpec,
  onUpload,
  onViewResult,
  onConfirmClick, referredDate,
  procedures,
  diagnosis,
  onReset,
  testid,
  department,
}) {
  const router = useNavigate();

  const onlineUser = JSON.parse(localStorage.getItem("onlineUser"));

  return (
    <Tr textTransform="capitalize" cursor="pointer">
      {type === "user-management" && (
        <>
          <Td>
            <HStack cursor={"pointer"} onClick={onClick}>
              <Avatar
                name={name}
                size="sm"
                src="https://bit.ly/tioluwani-kolawole"
              />
              <Box>
                <Text color={"#101828"} fontWeight={"500"} fontSize={"13px"}>
                  {name}
                </Text>
                <Text
                  color={"#667085"}
                  textTransform={"lowercase"}
                  fontWeight={"400"}
                  fontSize={"11px"}
                >
                  {email}
                </Text>
              </Box>
            </HStack>
          </Td>
          <Td>
            <Text
              fontWeight="400"
              fontSize={"13px"}
              textTransform={"capitalize"}
              color={
                role === "doctor"
                  ? "#2936e4"
                  : role === "nurse"
                  ? "#a529e4"
                  : role === "pharmacists"
                  ? "#29a3d5"
                  : "black"
              }
            >
              {role}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {clinic}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {phone}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {date}
            </Text>
          </Td>
          <Td>
            <HStack
              color={
                status === "active"
                  ? "#027A48"
                  : status === "inactive"
                  ? "#FFA30C"
                  : "#FD4739"
              }
            >
              <Box
                rounded="100%"
                w="8px"
                h="8px"
                bg={
                  status === "active"
                    ? "#027A48"
                    : status === "inactive"
                    ? "#FFA30C"
                    : "#FD4739"
                }
              ></Box>
              <Text fontWeight="400" fontSize={"13px"}>
                {status}
              </Text>
            </HStack>
          </Td>
          <Td>
            <Menu isLazy>
              <MenuButton as={Box}>
                <Flex justifyContent="center" color="#000000" fontSize="16px">
                  <BsThreeDots />
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={onEdit}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  <HStack fontSize="14px">
                    <Text>Edit</Text>
                  </HStack>
                </MenuItem>

                <MenuItem
                  onClick={onChangeStatus}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  <HStack fontSize="14px">
                    <Text>Change status</Text>
                  </HStack>
                </MenuItem>
                <MenuItem
                  onClick={onReset}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  <HStack fontSize="14px">
                    <Text>Reset Password</Text>
                  </HStack>
                </MenuItem>
                <MenuItem
                  onClick={onRemove}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#FF4040"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  <HStack fontSize="14px">
                    <Text>Remove User</Text>
                  </HStack>
                </MenuItem>

              </MenuList>
            </Menu>
          </Td>
        </>
      )}
      {type === "payment" && (
        <>
          <Td>
            <HStack cursor={"pointer"}>
              <Avatar
                name={name}
                size="sm"
                src="https://bit.ly/tioluwani-kolawole"
              />
              <Box>
                <Text color={"#101828"} fontWeight={"500"} fontSize={"13px"}>
                  {name}
                </Text>
                <Text
                  color={"#667085"}
                  textTransform={"lowercase"}
                  fontWeight={"400"}
                  fontSize={"11px"}
                >
                  {email}
                </Text>
              </Box>
            </HStack>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {mrn}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {phone}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {age}
            </Text>
          </Td>
          <Td>
            <HStack
              color={
                status === "paid"
                  ? "#027A48"
                  : status === "pending payment"
                  ? "#FFA30C"
                  : "#FD4739"
              }
            >
              <Box
                rounded="100%"
                w="8px"
                h="8px"
                bg={
                  status === "paid"
                    ? "#027A48"
                    : status === "pending payment"
                    ? "#FFA30C"
                    : "#FD4739"
                }
              ></Box>
              <Text fontWeight="400" fontSize={"13px"}>
                {status}
              </Text>
            </HStack>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {paymentType}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {amount?.toLocaleString()}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {quantity?.toLocaleString()}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {total?.toLocaleString()}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {date}
            </Text>
          </Td>
          <Td>
            <Menu isLazy>
              <MenuButton as={Box}>
                <Flex justifyContent="center" color="#000000" fontSize="16px">
                  <BsThreeDots />
                </Flex>
              </MenuButton>
              <MenuList>
                {status !== "paid" && (
                  <MenuItem
                    onClick={onClick}
                    textTransform="capitalize"
                    fontWeight={"500"}
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>Confirm Payment</Text>
                    </HStack>
                  </MenuItem>
                )}

                {status === "paid" && (
                  <MenuItem
                    onClick={onPrint}
                    textTransform="capitalize"
                    fontWeight={"500"}
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>Print Receipt</Text>
                    </HStack>
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
          </Td>
        </>
      )}
      {type === "payment-group" && (
        <>
          <Td>
            <HStack cursor={"pointer"}>
              <Avatar
                name={name}
                size="sm"
                src="https://bit.ly/tioluwani-kolawole"
              />
              <Box>
                <Text color={"#101828"} fontWeight={"500"} fontSize={"13px"}>
                  {name}
                </Text>
                <Text
                  color={"#667085"}
                  textTransform={"lowercase"}
                  fontWeight={"400"}
                  fontSize={"11px"}
                >
                  {email}
                </Text>
              </Box>
            </HStack>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {mrn}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {phone}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {age}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {reference}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {total?.toLocaleString()}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {date}
            </Text>
          </Td>
          <Td>
            <Menu isLazy>
              <MenuButton as={Box}>
                <Flex justifyContent="center" color="#000000" fontSize="16px">
                  <BsThreeDots />
                </Flex>
              </MenuButton>
              <MenuList>
               
                  <MenuItem
                    onClick={onClick}
                    textTransform="capitalize"
                    fontWeight={"500"}
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>Confirm Payment</Text>
                    </HStack>
                  </MenuItem> 


               
              </MenuList>
            </Menu>
          </Td>
        </>
      )}
      {type === "payment-group-paid" && (
        <>
         
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {reference}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {total?.toLocaleString()}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {date}
            </Text>
          </Td>
          <Td>
            <Menu isLazy>
              <MenuButton as={Box}>
                <Flex justifyContent="center" color="#000000" fontSize="16px">
                  <BsThreeDots />
                </Flex>
              </MenuButton>
              <MenuList>
               
                  <MenuItem
                    onClick={onClick}
                    textTransform="capitalize"
                    fontWeight={"500"}
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>Confirm Payment</Text>
                    </HStack>
                  </MenuItem> 


               
              </MenuList>
            </Menu>
          </Td>
        </>
      )}

      {type === "billing-history" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {date}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {description}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {category}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {reference}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {amountPaid}
            </Text>
          </Td>
          <Td>
            <HStack
              color={
                status === "paid"
                  ? "#027A48"
                  : status === "pending payment"
                  ? "#FFA30C"
                  : "#FD4739"
              }
            >
              <Box
                rounded="100%"
                w="8px"
                h="8px"
                bg={
                  status === "paid"
                    ? "#027A48"
                    : status === "pending payment"
                    ? "#FFA30C"
                    : "#FD4739"
                }
              ></Box>
              <Text fontWeight="400" fontSize={"13px"}>
                {status}
              </Text>
            </HStack>
          </Td>
        </>
      )}

      {type === "appointment" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {appointmentdate}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {appointmentcategory}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {appointmenttype}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {clinic}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              <HStack
                color={
                  status === "examined"
                    ? "#027A48"
                    : status === "scheduled"
                    ? "#FFA30C"
                    : "#FD4739"
                }
              >
                <Box
                  rounded="100%"
                  w="8px"
                  h="8px"
                  bg={
                    status === "examined"
                      ? "#027A48"
                      : status === "scheduled"
                      ? "#FFA30C"
                      : "#FD4739"
                  }
                ></Box>
                <Text fontWeight="400" fontSize={"13px"}>
                  {status}
                </Text>
              </HStack>
            </Text>
          </Td>
        </>
      )}
      {type === "price-settings" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {serviceType}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {serviceCategory}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              N{amount}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {hmoStatus}
            </Text>
          </Td>

          <Td>
            <HStack
              color={
                status === "active"
                  ? "#027A48"
                  : status === "inactive"
                  ? "#FFA30C"
                  : "#FD4739"
              }
            >
              <Box
                rounded="100%"
                w="8px"
                h="8px"
                bg={
                  status === "active"
                    ? "#027A48"
                    : status === "inactive"
                    ? "#FFA30C"
                    : "#FD4739"
                }
              ></Box>
              <Text fontWeight="400" fontSize={"13px"}>
                {status}
              </Text>
            </HStack>
          </Td>
          <Td>
            <Menu isLazy>
              <MenuButton as={Box}>
                <Flex justifyContent="center" color="#000000" fontSize="16px">
                  <BsThreeDots />
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={onEdit}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  <HStack fontSize="14px">
                    <Text>Edit</Text>
                  </HStack>
                </MenuItem>

                <MenuItem
                  onClick={onChangeStatus}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  <HStack fontSize="14px">
                    <Text>Change Status</Text>
                  </HStack>
                </MenuItem>
              </MenuList>
            </Menu>
          </Td>
        </>
      )}

      {type === "schedule-appointment" && (
        <>
          <Td onClick={onClick}>
            <HStack>
              <Avatar size="sm" name={name} />
              <Box>
                <Text color={"#101828"} fontWeight={"500"} fontSize={"13px"}>
                  {name}
                </Text>
                <Text color={"#667085"} fontWeight={"400"} fontSize={"11px"}>
                  MRN ~ {mrn}
                </Text>
              </Box>
            </HStack>
          </Td>

          <Td>
            <Text fontWeight="400" fontSize="12px">
              {date}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {reason}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {appointment}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {appointmentType}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {clinic}
            </Text>
          </Td>
          <Td>
            <HStack
              color={
                vitalStatus === "complete"
                  ? "#027A48"
                  : vitalStatus === "pending vital"
                  ? "#FFA30C"
                  : "#FD4739"
              }
            >
              <Box
                rounded="100%"
                w="8px"
                h="8px"
                bg={
                  vitalStatus === "complete"
                    ? "#027A48"
                    : vitalStatus === "pending vital"
                    ? "#FFA30C"
                    : "#FD4739"
                }
              ></Box>
              <Text fontWeight="400" fontSize={"13px"}>
                {vitalStatus}
              </Text>
            </HStack>
          </Td>
          <Td>
            <HStack
              color={
                status === "complete"
                  ? "#027A48"
                  : status === "inprogress"
                  ? "#FFA30C"
                  : "#FD4739"
              }
            >
              <Box
                rounded="100%"
                w="8px"
                h="8px"
                bg={
                  status === "complete"
                    ? "#027A48"
                    : status === "inprogress"
                    ? "#FFA30C"
                    : "#FD4739"
                }
              ></Box>
              <Text fontWeight="400" fontSize={"13px"}>
                {status}
              </Text>
            </HStack>
          </Td>
          <Td>
            <Menu isLazy>
              <MenuButton as={Box}>
                <Flex justifyContent="center" color="#000000" fontSize="16px">
                  <BsThreeDots />
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={onClick}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  <HStack fontSize="14px">
                    <Text>Explore</Text>
                  </HStack>
                </MenuItem>
                <MenuItem
                  onClick={onVital}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  <HStack fontSize="14px">
                    <Text>Take Vitals</Text>
                  </HStack>
                </MenuItem>
              </MenuList>
            </Menu>
          </Td>
        </>
      )}
      {type === "medical-history" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {date}
            </Text>
          </Td>

          <Td>
            <Text fontWeight="400" fontSize="12px">
              {appointment}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {appointmentType}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {appointmentId}
            </Text>
          </Td>
          <Td>
            <HStack>
              <Avatar size="sm" name={doctor} />
              <Box>
                <Text color={"#101828"} fontWeight={"500"} fontSize={"13px"}>
                  {doctor}
                </Text>
                <Text color={"#667085"} fontWeight={"400"} fontSize={"11px"}>
                  Staff ID ~ {staffId}
                </Text>
              </Box>
            </HStack>
          </Td>

          <Td>
            <HStack
              color={
                status === "completed"
                  ? "#027A48"
                  : status === "examined"
                  ? "#FFA30C"
                  : "#FD4739"
              }
            >
              <Box
                rounded="100%"
                w="8px"
                h="8px"
                bg={
                  status === "completed"
                    ? "#027A48"
                    : status === "examined"
                    ? "#FFA30C"
                    : "#FD4739"
                }
              ></Box>
              <Text fontWeight="400" fontSize={"13px"}>
                {status}
              </Text>
            </HStack>
          </Td>
          <Td>
            <Menu isLazy>
              <MenuButton as={Box}>
                <Flex justifyContent="center" color="#000000" fontSize="16px">
                  <BsThreeDots />
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={onEdit}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  <HStack fontSize="14px">
                    <Text>Edit</Text>
                  </HStack>
                </MenuItem>
                <MenuItem
                  onClick={onClick}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  <HStack fontSize="14px">
                    <Text>Request Lab Order</Text>
                  </HStack>
                </MenuItem>
                <MenuItem
                  onClick={onView}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  <HStack fontSize="14px">
                    <Text>View More</Text>
                  </HStack>
                </MenuItem>
                <MenuItem
                  onClick={onChangeStatus}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  <HStack fontSize="14px">
                    <Text>Mark as Completed</Text>
                  </HStack>
                </MenuItem>
              </MenuList>
            </Menu>
          </Td>
        </>
      )}
      {type === "lab-history" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {dept}
            </Text>
          </Td>

          <Td>
            <Text fontWeight="400" fontSize="12px">
              {appointmentId}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {testName}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {testId}
            </Text>
          </Td>

          <Td>
            <HStack
              color={
                status === "paid"
                  ? "#027A48"
                  : status === "pending payment"
                  ? "#FFA30C"
                  : "#FD4739"
              }
            >
              <Box
                rounded="100%"
                w="8px"
                h="8px"
                bg={
                  status === "paid"
                    ? "#027A48"
                    : status === "pending payment"
                    ? "#FFA30C"
                    : "#FD4739"
                }
              ></Box>
              <Text fontWeight="400" fontSize={"13px"}>
                {status}
              </Text>
            </HStack>
          </Td>
          <Td>
            <HStack
              color={
                labStatus === "processed"
                  ? "#027A48"
                  : labStatus === "paid" || labStatus === "scheduled"
                  ? "#FFA30C"
                  : "#FD4739"
              }
            >
              <Box
                rounded="100%"
                w="8px"
                h="8px"
                bg={
                  labStatus === "processed"
                    ? "#027A48"
                    : labStatus === "paid" || labStatus === "scheduled"
                    ? "#FFA30C"
                    : "#FD4739"
                }
              ></Box>
              <Text fontWeight="400" fontSize={"13px"}>
                {labStatus}
              </Text>
            </HStack>
          </Td>

          <Td>
            <Menu>
              <MenuButton as={Box}>
                <BsThreeDots />
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={onEdit}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  View More
                </MenuItem>

                <MenuItem
                  onClick={onEdit}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  Mark as Completed
                </MenuItem>
              </MenuList>
            </Menu>
          </Td>
        </>
      )}

{type === "lab-processing" && (
  <>
      <Td>
      <Text fontWeight="400" fontSize="12px">
        {testid}
      </Text>
    </Td>
    <Td>
      <HStack>
        <Avatar size="sm" name={name} />
        <Box>
          <Text color={"#101828"} fontWeight={"500"} fontSize={"13px"}>
            {name}
          </Text>
          <Text color={"#667085"} fontWeight={"400"} fontSize={"11px"}>
            MRN ~ {mrn}
          </Text>
        </Box>
      </HStack>
    </Td>
    <Td>
      <Text fontWeight="400" fontSize="12px">
        {department}
      </Text>
    </Td>

    <Td>
      <Text fontWeight="400" fontSize="12px">
        {testName}
      </Text>
    </Td>
    <Td>
      <Text fontWeight="400" fontSize="12px">
        {date}
      </Text>
    </Td>

    <Td>
      <HStack
        color={
          labStatus === "complete"
            ? "#027A48"
            : labStatus === "scheduled"
            ? "#FFA30C"
            : "#FF0000" // changed to red
        }
      >
        <Box
          rounded="100%"
          w="8px"
          h="8px"
          bg={
            labStatus === "complete"
              ? "#027A48"
              : labStatus === "scheduled"
              ? "#FFA30C"
              : "#FF0000" // changed to red
          }
        ></Box>
        <Text fontWeight="400" fontSize={"13px"}>
          {labStatus}
        </Text>
      </HStack>
    </Td>

    <Td>
      <Menu>
        <MenuButton as={Box}>
          <BsThreeDots />
        </MenuButton>
        <MenuList>
          {labStatus === "awaiting confirmation" ? (
            <MenuItem
              onClick={onConfirmClick}
              textTransform="capitalize"
              fontWeight={"500"}
              color="#2F2F2F"
              _hover={{
                color: "#fff",
                fontWeight: "400",
                bg: "blue.blue500",
              }}
            >
              Confirm
            </MenuItem>
          ) : (
            <MenuItem
              onClick={onClick}
              textTransform="capitalize"
              fontWeight={"500"}
              color="#2F2F2F"
              _hover={{
                color: "#fff",
                fontWeight: "400",
                bg: "blue.blue500",
              }}
            >
              Process
            </MenuItem>
          )}
        </MenuList>
      </Menu>
    </Td>
  </>
)}

      {type === "lab-report" && (
        <>
          <Td>
            <HStack>
              <Avatar size="sm" name={name} />
              <Box>
                <Text color={"#101828"} fontWeight={"500"} fontSize={"13px"}>
                  {name}
                </Text>
                <Text color={"#667085"} fontWeight={"400"} fontSize={"11px"}>
                  MRN ~ {mrn}
                </Text>
              </Box>
            </HStack>
          </Td>

          <Td>
            <Text fontWeight="400" fontSize="12px">
              {appointmentId}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {date}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {phone}
            </Text>
          </Td>

          <Td>
            <Menu>
              <MenuButton as={Box}>
                <BsThreeDots />
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={onClick}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  View Report
                </MenuItem>
              </MenuList>
            </Menu>
          </Td>
        </>
      )}
      {type === "print-report" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {sn}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {subComponent}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {result}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {nRanges}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {unit}
            </Text>
          </Td>
        </>
      )}
      {type === "print-payment" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {sn}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {quantity}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {items}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {amount}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {total}
            </Text>
          </Td>
        </>
      )}
      {type === "print-payment-total" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize="12px">
            
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
             
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              
            </Text>
          </Td>
          <Td>
            <Text fontWeight="800" color="#000" fontSize="14px">
              Total:
            </Text>
          </Td>
          <Td>
            <Text fontWeight="800" color="#000" fontSize="14px">  
              {totalAmount}
            </Text>
          </Td>
        </>
      )}
      {type === "clinic-settings" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {sn}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {name}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {clinic}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {ClinicType}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {date}
            </Text>
          </Td>

          <Td>
            <Menu isLazy>
              <MenuButton as={Box}>
                <Flex justifyContent="center" color="#000000" fontSize="16px">
                  <BsThreeDots />
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={onEdit}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  <HStack fontSize="14px">
                    <Text>Edit</Text>
                  </HStack>
                </MenuItem>
              </MenuList>
            </Menu>
          </Td>
        </>
      )}
      {type === "serviceType-settings" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {sn}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {date}
            </Text>
          </Td>
          <Td>
            <HStack>
              {serviceType?.map((item, i) => (
                <Text key={i} fontWeight="400" fontSize="12px">
                  {item}
                </Text>
              ))}
            </HStack>
          </Td>

          <Td>
            <Text fontWeight="400" fontSize="12px">
              {serviceCategory}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {dept}
            </Text>
          </Td>

          <Td>
            <Menu isLazy>
              <MenuButton as={Box}>
                <Flex justifyContent="center" color="#000000" fontSize="16px">
                  <BsThreeDots />
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={onEdit}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  <HStack fontSize="14px">
                    <Text>Edit</Text>
                  </HStack>
                </MenuItem>
              </MenuList>
            </Menu>
          </Td>
        </>
      )}
      {type === "ward-management" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {sn}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {date}
            </Text>
          </Td>

          <Td>
            <Text fontWeight="400" fontSize="12px">
              {bedSpec}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {wardName}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {totalBed}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {occupiedBed}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {vacantBed}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {price}
            </Text>
          </Td>
          <Td>
            <HStack
              color={
                labStatus === "active"
                  ? "#027A48"
                  : labStatus === "inactive"
                  ? "#FFA30C"
                  : "#817D7D"
              }
            >
              <Box
                rounded="100%"
                w="8px"
                h="8px"
                bg={
                  status === "active"
                    ? "#027A48"
                    : status === "inactive"
                    ? "#FFA30C"
                    : "#817D7D"
                }
              ></Box>
              <Text fontWeight="400" fontSize={"13px"}>
                {status}
              </Text>
            </HStack>
          </Td>

          <Td>
            <Menu isLazy>
              <MenuButton as={Box}>
                <Flex justifyContent="center" color="#000000" fontSize="16px">
                  <BsThreeDots />
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={onEdit}
                  textTransform="capitalize"
                  fontWeight={"500"}
                  color="#2F2F2F"
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                >
                  <HStack fontSize="14px">
                    <Text>Edit</Text>
                  </HStack>
                </MenuItem>
              </MenuList>
            </Menu>
          </Td>
        </>
      )}
      {type === "patient-admission" && (
        <>
          <Td>
            <HStack onClick={onView}>
              <Avatar size="sm" name={name} />
              <Box>
                <Text fontWeight="500" fontSize="13px">
                  {name}
                </Text>
                <Text fontWeight="400" fontSize="12px">
                  MRN ~ {mrn}
                </Text>
              </Box>
            </HStack>
          </Td>

          <Td>
            <Text fontWeight="400" fontSize="12px">
              {doctor}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {clinic}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {wardName}
            </Text>
          </Td>

          <Td>
            <Text fontWeight="400" fontSize="12px">
              {date}
            </Text>
          </Td>
          <Td>
            <HStack
              color={
                status === "admited"
                  ? "#027A48"
                  : status === "toadmit"
                  ? "#FFA30C"
                  : status === "transferred"
                  ? "#FD4739"
                  : "#808080"
              }
            >
              <Box
                rounded="100%"
                w="8px"
                h="8px"
                bg={
                  status === "admited"
                    ? "#027A48"
                    : status === "toadmit"
                    ? "#FFA30C"
                    : status === "transferred"
                    ? "#FD4739"
                    : "#808080"
                }
              ></Box>
              <Text fontWeight="400" fontSize="13px">
                {status}
              </Text>
            </HStack>
          </Td>
          <Td>
            <Menu>
              <MenuButton as={Box}>
                <BsThreeDots />
              </MenuButton>
              <MenuList>
                <MenuItem
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                  onClick={onTransfer}
                >
                  To Transfer
                </MenuItem>
                <MenuItem
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                  onClick={onClick}
                >
                  To Discharge
                </MenuItem>
              </MenuList>
            </Menu>
          </Td>
        </>
      )}
      {type === "patient-immunization" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {name}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {dose}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {vaccineType}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {vaccineCode}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {date}
            </Text>
          </Td>

          <Td>
            <Text fontWeight="400" fontSize="12px">
              {administeredBy}
            </Text>
          </Td>

          <Td>
            <Menu>
              <MenuButton as={Box}>
                <BsThreeDots />
              </MenuButton>
              <MenuList>
                <MenuItem
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                  onClick={onEdit}
                >
                  Edit
                </MenuItem>
                <MenuItem
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                  onClick={onView}
                >
                  View
                </MenuItem>
              </MenuList>
            </Menu>
          </Td>
        </>
      )}

      {type === "e-prescription" && (
        <>
          <Td>
            <HStack cursor={"pointer"}>
              <Avatar
                name={name}
                size="sm"
                src="https://bit.ly/tioluwani-kolawole"
              />
              <Box>
                <Text color={"#101828"} fontWeight={"500"} fontSize={"13px"}>
                  {name}
                </Text>
                <Text
                  color={"#667085"}
                  textTransform={"lowercase"}
                  fontWeight={"400"}
                  fontSize={"11px"}
                >
                  {mrn}
                </Text>
              </Box>
            </HStack>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {pharmacy}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {drug}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {doctor}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {date}
            </Text>
          </Td>

          <Td>
            <HStack
              color={
                status === "paid"
                  ? "#027A48"
                  : status === "pending payment"
                  ? "#FFA30C"
                  : "#FD4739"
              }
            >
              <Box
                rounded="100%"
                w="8px"
                h="8px"
                bg={
                  status === "paid"
                    ? "#027A48"
                    : status === "pending payment"
                    ? "#FFA30C"
                    : "#FD4739"
                }
              ></Box>
              <Text fontWeight="400" fontSize={"13px"}>
                {status}
              </Text>
            </HStack>
          </Td>
        </>
      )}
      {type === "patient-partograph" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {temperature}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {respiratory}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {liquor}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {moulding}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {contraction}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {doctor}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {date}
            </Text>
          </Td>

          <Td>
            <HStack
              color={
                status === "complete"
                  ? "#027A48"
                  : status === "new"
                  ? "#FFA30C"
                  : "#FD4739"
              }
            >
              <Box
                rounded="100%"
                w="8px"
                h="8px"
                bg={
                  status === "complete"
                    ? "#027A48"
                    : status === "new"
                    ? "#FFA30C"
                    : "#FD4739"
                }
              ></Box>
              <Text fontWeight="400" fontSize={"13px"}>
                {status}
              </Text>
            </HStack>
          </Td>
          <Td>
            <Menu>
              <MenuButton as={Box}>
                <BsThreeDots />
              </MenuButton>
              <MenuList>
                <MenuItem
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                  onClick={onEdit}
                >
                  Edit
                </MenuItem>
                <MenuItem
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                  onClick={onView}
                >
                  View
                </MenuItem>
                <MenuItem
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                  onClick={onClick}
                >
                  Mark as Complete
                </MenuItem>
              </MenuList>
            </Menu>
          </Td>
        </>
      )}
      {type === "patient-familyPlanning" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {name}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {parity}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {weight}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {bp}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {date}
            </Text>
          </Td>

          <Td>
            <Menu>
              <MenuButton as={Box}>
                <BsThreeDots />
              </MenuButton>
              <MenuList>
                <MenuItem
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                  onClick={onEdit}
                >
                  Edit
                </MenuItem>
                <MenuItem
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                  onClick={onView}
                >
                  View
                </MenuItem>
              </MenuList>
            </Menu>
          </Td>
        </>
      )}
      {type === "patient-referral" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {id}
            </Text>
          </Td>
          <Td>
            <HStack cursor={"pointer"}>
              <Avatar
                name={name}
                size="sm"
                src="https://bit.ly/tioluwani-kolawole"
              />
              <Box>
                <Text color={"#101828"} fontWeight={"500"} fontSize={"13px"}>
                  {name}
                </Text>
                <Text
                  color={"#667085"}
                  textTransform={"lowercase"}
                  fontWeight={"400"}
                  fontSize={"11px"}
                >
                  {mrn}
                </Text>
              </Box>
            </HStack>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {originatingUnit}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {receivingUnit}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {doctor}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {date}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {priority}
            </Text>
          </Td>
          <Td>
            <HStack
              color={
                status === "accept"
                  ? "#027A48"
                  : status === "inprogress"
                  ? "#FFA30C"
                  : "#FD4739"
              }
            >
              <Box
                rounded="100%"
                w="8px"
                h="8px"
                bg={
                  status === "accept"
                    ? "#027A48"
                    : status === "inprogress"
                    ? "#FFA30C"
                    : "#FD4739"
                }
              ></Box>
              <Text fontWeight="400" fontSize={"13px"}>
                {status}
              </Text>
            </HStack>
          </Td>
          <Td>
            <Menu>
              <MenuButton as={Box}>
                <BsThreeDots />
              </MenuButton>
              <MenuList>
                <MenuItem
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                  onClick={onEdit}
                >
                  Edit
                </MenuItem>
                <MenuItem
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                  onClick={onView}
                >
                  View
                </MenuItem>

                {onlineUser._id === consultant && (
                  <MenuItem
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                    onClick={onProcess}
                  >
                    Process
                  </MenuItem>
                )}
                {onlineUser._id === consultant && (
                  <MenuItem
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                    onClick={onClick}
                  >
                    Schedule Appointment
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
          </Td>
        </>
      )}
      {type === "patient-deliveryNote" && (
        <>
          <Td>
            <HStack cursor={"pointer"}>
              <Avatar
                name={name}
                size="sm"
                src="https://bit.ly/tioluwani-kolawole"
              />
              <Box>
                <Text color={"#101828"} fontWeight={"500"} fontSize={"13px"}>
                  {name}
                </Text>
                <Text
                  color={"#667085"}
                  textTransform={"lowercase"}
                  fontWeight={"400"}
                  fontSize={"11px"}
                >
                  {mrn}
                </Text>
              </Box>
            </HStack>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {doctor}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {deliveryNote}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {date}
            </Text>
          </Td>

          <Td>
            <Menu>
              <MenuButton as={Box}>
                <BsThreeDots />
              </MenuButton>
              <MenuList>
                <MenuItem
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                  onClick={onEdit}
                >
                  Edit
                </MenuItem>
                <MenuItem
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                  onClick={onView}
                >
                  View
                </MenuItem>
              </MenuList>
            </Menu>
          </Td>
        </>
      )}
      {type === "patient-procedure" && (
        <>
          <Td>
            <HStack cursor={"pointer"}>
              <Avatar
                name={name}
                size="sm"
                src="https://bit.ly/tioluwani-kolawole"
              />
              <Box>
                <Text color={"#101828"} fontWeight={"500"} fontSize={"13px"}>
                  {name}
                </Text>
                <Text
                  color={"#667085"}
                  textTransform={"lowercase"}
                  fontWeight={"400"}
                  fontSize={"11px"}
                >
                  {mrn}
                </Text>
              </Box>
            </HStack>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {doctor}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {date}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {testName}
            </Text>
          </Td>
          <Td>
            <HStack
              color={
                status === "processed"
                  ? "#027A48"
                  : status === "inprogress"
                  ? "#FFA30C"
                  : "#FD4739"
              }
            >
              <Box
                rounded="100%"
                w="8px"
                h="8px"
                bg={
                  status === "processed"
                    ? "#027A48"
                    : status === "inprogress"
                    ? "#FFA30C"
                    : "#FD4739"
                }
              ></Box>
              <Text fontWeight="400" fontSize={"13px"}>
                {status}
              </Text>
            </HStack>
          </Td>
          <Td>
            <HStack
              color={
                PaymentStatus === "paid"
                  ? "#027A48"
                  : PaymentStatus === "pending payment"
                  ? "#FFA30C"
                  : "#FD4739"
              }
            >
              <Box
                rounded="100%"
                w="8px"
                h="8px"
                bg={
                  PaymentStatus === "paid"
                    ? "#027A48"
                    : PaymentStatus === "pending payment"
                    ? "#FFA30C"
                    : "#FD4739"
                }
              ></Box>
              <Text fontWeight="400" fontSize={"13px"}>
                {PaymentStatus}
              </Text>
            </HStack>
          </Td>

          <Td>
            <Menu>
              <MenuButton as={Box}>
                <BsThreeDots />
              </MenuButton>
              <MenuList>
                <MenuItem
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                  onClick={onEdit}
                >
                  Edit
                </MenuItem>
                <MenuItem
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                  onClick={onView}
                >
                  View
                </MenuItem>
                <MenuItem
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                  onClick={onUpload}
                >
                  Upload
                </MenuItem>
                <MenuItem
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                  onClick={onViewResult}
                >
                  View Result
                </MenuItem>
              </MenuList>
            </Menu>
          </Td>
        </>
      )}
      {type === "anc-followup" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {date}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {ga}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {sfh}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {wf}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {lie}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {presentation}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {position}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {fhr}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {urine}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {bp}
            </Text>
          </Td>
         
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {followup}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {riskIdentified}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {currentMedication}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {remark}
            </Text>
          </Td>

          <Td>
            <Menu>
              <MenuButton as={Box}>
                <BsThreeDots />
              </MenuButton>
              <MenuList>
                <MenuItem
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                  onClick={onEdit}
                >
                  Edit
                </MenuItem>
              </MenuList>
            </Menu>
          </Td>
        </>
      )}
      {type === "anc-followup-v3" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {date}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {heightoffundus}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {presentationandposition}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {presentingpart}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {foetalheight}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {bp}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {hb}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {protein}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {glucose}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {weight}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>    
              {oedema}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {tetanustoxoid}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>  
              {sulfadoxinepyrimethamine}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {albendazole}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize={"13px"}>
              {remark}
            </Text>
          </Td>
         
         

          <Td>
            <Menu>
              <MenuButton as={Box}>
                <BsThreeDots />
              </MenuButton>
              <MenuList>
                <MenuItem
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                  onClick={onEdit}
                >
                  Edit
                </MenuItem>
              </MenuList>
            </Menu>
          </Td>
        </>
      )}

      {type === "financial-report" && (
        <>
        <Td>
            <HStack cursor={"pointer"}>
              <Avatar
                name={name}
                size="sm"
                src="https://bit.ly/tioluwani-kolawole"
              />
              <Box>
                <Text color={"#101828"} fontWeight={"500"} fontSize={"13px"}>
                  {name}
                </Text>
                <Text
                  color={"#667085"}
                  textTransform={"lowercase"}
                  fontWeight={"400"}
                  fontSize={"11px"}
                >
                  {mrn}
                </Text>
              </Box>
            </HStack>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {reference}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {category}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {paymentType}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {quantity?.toLocaleString()}
            </Text>
          </Td>
         
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {amount?.toLocaleString()}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {total}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {date}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {status}
            </Text>
          </Td>
        </>
      )}

      {type === "admission-report" && (
        <>
        <Td>
            <HStack cursor={"pointer"}>
              <Avatar
                name={name}
                size="sm"
                src="https://bit.ly/tioluwani-kolawole"
              />
              <Box>
                <Text color={"#101828"} fontWeight={"500"} fontSize={"13px"}>
                  {name}
                </Text>
                <Text
                  color={"#667085"}
                  textTransform={"lowercase"}
                  fontWeight={"400"}
                  fontSize={"11px"}
                >
                  {mrn}
                </Text>
              </Box>
            </HStack>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {clinic}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {doctor}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {referredDate}
            </Text>
          </Td>
          
           
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {date}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {status}
            </Text>
          </Td>
        </>
      )}
      {type === "appointment-report" && (
        <>
        <Td>
            <HStack cursor={"pointer"}>
              <Avatar
                name={name}
                size="sm"
                src="https://bit.ly/tioluwani-kolawole"
              />
              <Box>
                <Text color={"#101828"} fontWeight={"500"} fontSize={"13px"}>
                  {name}
                </Text>
                <Text
                  color={"#667085"}
                  textTransform={"lowercase"}
                  fontWeight={"400"}
                  fontSize={"11px"}
                >
                  {mrn}
                </Text>
              </Box>
            </HStack>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {clinic}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {category}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {appointmentType}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {referredDate}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {sn}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {physicalAssault}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {policeName}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {policeCase}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {phone}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px"> 
              {reason}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {serviceNumber}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {sexualAssault}
            </Text>
          </Td>
          
           
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {date}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {status}
            </Text>
          </Td>
        </>
      )}
      {type === "secondaryService-report" && (
        <>
        <Td>
            <HStack cursor={"pointer"}>
              <Avatar
                name={name}
                size="sm"
                src="https://bit.ly/tioluwani-kolawole"
              />
              <Box>
                <Text color={"#101828"} fontWeight={"500"} fontSize={"13px"}>
                  {name}
                </Text>
                <Text
                  color={"#667085"}
                  textTransform={"lowercase"}
                  fontWeight={"400"}
                  fontSize={"11px"}
                >
                  {mrn}
                </Text>
              </Box>
            </HStack>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {facility}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {code}
            </Text>
          </Td>
          
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {serviceType}
            </Text>
          </Td>
          
           
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {date}
            </Text>
          </Td>
        
        </>
      )}
      {type === "financial-aggregate" && (
        <>
       
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {sn}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {category}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {total}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {status}
            </Text>
          </Td>
         
        </>
      )}
      {type === "cashier-aggregate" && (
        <>
       
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {sn}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {email}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {name}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {id}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {total}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {status}
            </Text>
          </Td>
         
        </>
      )}
      {type === "appointment-aggregate" && (
        <>
       
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {sn}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {appointment}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {clinic}
            </Text>
          </Td>
          
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {status}
            </Text>
          </Td>
         
        </>
      )}
            {type === "procedure-aggregate" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {sn}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {clinic}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {procedures}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {total}
            </Text>
          </Td>
        </>
      )}
      {type === "clinical-aggregate" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {sn}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {appointment}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {diagnosis}
            </Text>
          </Td>
        </>
      )}
      {type === "nutrition-summary" && (
        <>
        
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {count}
            </Text>
          </Td>
           <Td>
            <Text fontWeight="400" fontSize="12px">
              {age}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {gender}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {supplement}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">   
              {visitType}
            </Text>
          </Td>
         
        </>
      )}
    </Tr>
  );
}
