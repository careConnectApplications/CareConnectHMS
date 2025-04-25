import React from "react";
import {
  Tr,
  Td,
  HStack,
  Avatar,
  Text,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import moment from "moment";

export default function TableRowY({
  type,
  date,
  reason,
  appointment,
  appointmentType,
  patient,
  clinic,
  status,
  mrn,
  email,
  onEdit,
  onUpdateStock,
  name,
  category,
  quantity,
  createdDate,
  updatedDate,
  expirationDate,
  prescribersName,
  pharmacyName,
  prescriptionDate,
  paymentStatus,
  dispenseStatus,
  onPharmacyAction,
  serviceCategory,
  serviceType,
  lowStockLevel,
  lastRestockDate,
  amount,
  prescription,
  onDispense,
  dispensestatus,
  bedSpecialization,
  ward,
  totalBed,
  occupiedBed,
  vacantBed,
  createdBy,
  createdOn,
  onView,
  bedName,
  admissionStatus,
  admissionDate,
  allocatedBy,
  specialization,
  remark,
  referredDate,
  onAdmit,
  doctor,
  vitalDate,
  temperature,
  heartRate,
  bpSystolic,
  bpDiastolic,
  rbs,
  gcs,
  painScore,
  bmi,
  height,
  weight,
  o2Saturation,
  nurseName,
  rank,
  intravenous,
  oral,
  insulinType,
  rbsValue,
  dosage,
  route,
  insulinSign,
  tubeFeedingTime,
  feeds,
  tubeFeedingAmount,
  tubeFeedingFeed,
  bloodMonitoringTime,
  testType,
  rbsFbsValue,
  bloodMonitoringSign,
  drug,
  dose,
  note,
  frequency,
  totalIntake,
  totalOutput,
  netFluidBalance,
  testName,
  testId,
  department,
  nursingDiagnosis,
  actionintervention,
  objectives,
  evaluation,
  staffName,
  onUpload,
  sn,
  wardName,
  theatreadmissionid,
  appointmentdate,
  referedtheatre,
  doctorname,
  onUpdate,
  onTransfer,
  onDischarge,
  onConfirm,
  pharmacy,
  dosageForm,
  strength,
  paymentype,
  paymentcategory,
  paymentreference,

  createdAt,
  cashieremail,
  cashierid,
  onClick,
  onChangeStatus,
  hmoname,
  id,
  updatedAt,
  hmoStatus,
  age,
  phone,
  gender,
  hmoId,
  hmoName,
  hmoPlan,
  subcomponients,
  orderid,
  HMOName,
  MRN,
  isHMOCover,
  appointmentid,
  duration,
  HMOPlan,
  action,
  actor,
  affectedEntity,
  servedstatus,
  onServe,
  report,
  createdTime,
  servedBy,
  ServedBy,
  intakeType,
  intakeRoute,
  intakeAmount,
  outputType,
  outputRoute,
  outputAmount,
  tubeFeedingDatetimefeeds,
  bedspecialization,
  wardname,
  wardid,
  totalbed,
  occupiedbed,
  vacantbed,
  wardreport,
  staffname,
  onEditDailyWardReport,
  onViewDailyWardReport,
  onEnterResult,
  onViewManualResult,
}) {
  const isServed = servedstatus?.toLowerCase() === "served";
  const isUnserved = servedstatus?.toLowerCase() === "unserved";
  const servedColor = isServed ? "#027A48" : "#FD4739";
  return (
    <Tr textTransform="capitalize" cursor="pointer">
      {type === "schedule-appointment" && (
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
            <HStack>
              <Avatar size="sm" name={patient} />
              <Box>
                <Text fontWeight="500" color="" fontSize="13px">
                  {patient}
                </Text>
                <Text fontWeight="400" color="#667085" fontSize="11px">
                  {email}
                </Text>
              </Box>
            </HStack>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {mrn}
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
                status === "scheduled"
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
                  status === "scheduled"
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

      {type === "inventory" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {pharmacy}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {serviceCategory}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {amount}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {serviceType}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {category}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {quantity}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {lowStockLevel}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {expirationDate}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {lastRestockDate}
            </Text>
          </Td>
          <Td>
            <HStack
              color={
                status === "available"
                  ? "#027A48"
                  : status === "low stock"
                  ? "#FFA30C"
                  : "#FD4739"
              }
            >
              <Box
                rounded="100%"
                w="8px"
                h="8px"
                bg={
                  status === "available"
                    ? "#027A48"
                    : status === "low stock"
                    ? "#FFA30C"
                    : "#FD4739"
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
                  onClick={onUpdateStock} // Trigger the edit modal
                >
                  Update Stock
                </MenuItem>
              </MenuList>
            </Menu>
          </Td>
        </>
      )}

      {type === "pharmacy-order" && (
        <>
          <Td>
            <HStack>
              <Avatar size="sm" name={patient} />
              <Box>
                <Text fontWeight="500" fontSize="13px">
                  {patient}
                </Text>
                <Text fontWeight="400" color="#667085" fontSize="11px">
                  {email}
                </Text>
              </Box>
            </HStack>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {mrn}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {prescription}
            </Text>
          </Td>

          <Td>
            <Text fontWeight="400" fontSize="12px">
              {frequency}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {dosage}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {duration}
            </Text>
          </Td>

          <Td>
            <Text fontWeight="400" fontSize="12px">
              {quantity}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {amount}
            </Text>
          </Td>

          <Td>
            <Text fontWeight="400" fontSize="12px">
              {prescribersName}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {createdDate}
            </Text>
          </Td>
          <Td>
            <HStack
              color={
                paymentStatus === "paid"
                  ? "#027A48"
                  : paymentStatus === "pending payment"
                  ? "#FFA30C"
                  : "#FD4739"
              }
            >
              <Box
                rounded="100%"
                w="8px"
                h="8px"
                bg={
                  paymentStatus === "paid"
                    ? "#027A48"
                    : paymentStatus === "pending payment"
                    ? "#FFA30C"
                    : "#FD4739"
                }
              ></Box>
              <Text fontWeight="400" fontSize="13px">
                {paymentStatus}
              </Text>
            </HStack>
          </Td>
          <Td>
            <HStack
              color={
                dispensestatus === "complete"
                  ? "#027A48"
                  : dispensestatus === "pending"
                  ? "#FFA30C"
                  : "#FD4739"
              }
            >
              <Box
                rounded="100%"
                w="8px"
                h="8px"
                bg={
                  dispensestatus === "complete"
                    ? "#027A48"
                    : dispensestatus === "pending"
                    ? "#FFA30C"
                    : "#FD4739"
                }
              ></Box>
              <Text fontWeight="400" fontSize="13px">
                {dispensestatus}
              </Text>
            </HStack>
          </Td>
          <Td>
            <Menu>
              <MenuButton as={Box}>
                <BsThreeDots />
              </MenuButton>
              <MenuList>
                {dispensestatus === "awaiting confirmation" ? (
                  <MenuItem
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                    onClick={onConfirm}
                  >
                    Confirm
                  </MenuItem>
                ) : (
                  <MenuItem
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                    onClick={onDispense}
                  >
                    Dispense
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
          </Td>
        </>
      )}

      {type === "BedReport" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {bedSpecialization}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {ward}
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
        </>
      )}
      {type === "DailyWardReport" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {specialization}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {ward}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {createdBy}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {createdOn}
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
                  onClick={onView}
                >
                  View
                </MenuItem>
              </MenuList>
            </Menu>
          </Td>
        </>
      )}
      {type === "BedStatusReport" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {bedSpecialization}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {ward}
            </Text>
          </Td>
          <Td>
            <HStack
              color={
                admissionStatus === "admited"
                  ? "#027A48"
                  : admissionStatus === "toadmit"
                  ? "#FFA30C"
                  : admissionStatus === "transferred"
                  ? "#FD4739"
                  : "#808080"
              }
            >
              <Box
                rounded="100%"
                w="8px"
                h="8px"
                bg={
                  admissionStatus === "admited"
                    ? "#027A48"
                    : admissionStatus === "toadmit"
                    ? "#FFA30C"
                    : admissionStatus === "transferred"
                    ? "#FD4739"
                    : "#808080"
                }
              ></Box>
              <Text fontWeight="400" fontSize="13px">
                {admissionStatus}
              </Text>
            </HStack>
          </Td>
          <Td>
            <HStack>
              <Avatar size="sm" name={patient} />
              <Box>
                <Text fontWeight="500" fontSize="13px">
                  {patient}
                </Text>
              </Box>
            </HStack>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {mrn}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {admissionDate}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {allocatedBy}
            </Text>
          </Td>
        </>
      )}
      {type === "AdmissionDailyReport" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {specialization}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {ward}
            </Text>
          </Td>
          <Td>
            <HStack
              color={
                admissionStatus === "admited"
                  ? "#027A48"
                  : admissionStatus === "toadmit"
                  ? "#FFA30C"
                  : admissionStatus === "transferred"
                  ? "#FD4739"
                  : "#808080"
              }
            >
              <Box
                rounded="100%"
                w="8px"
                h="8px"
                bg={
                  admissionStatus === "admited"
                    ? "#027A48"
                    : admissionStatus === "toadmit"
                    ? "#FFA30C"
                    : admissionStatus === "transferred"
                    ? "#FD4739"
                    : "#808080"
                }
              ></Box>
              <Text fontWeight="400" fontSize="13px">
                {admissionStatus}
              </Text>
            </HStack>
          </Td>
          <Td>
            <HStack>
              <Avatar size="sm" name={patient} />
              <Box>
                <Text fontWeight="500" fontSize="13px">
                  {patient}
                </Text>
              </Box>
            </HStack>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {mrn}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {admissionDate}
            </Text>
          </Td>
        </>
      )}
      {type === "in-patientAdmission" && (
        <>
          <Td>
            <HStack onClick={onView}>
              <Avatar size="sm" name={patient} />
              <Box>
                <Text fontWeight="500" fontSize="13px">
                  {patient}
                </Text>
              </Box>
            </HStack>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {mrn}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {doctor}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {specialization}
            </Text>
          </Td>
          <Td>
            {Array.isArray(remark) && remark.length > 0
              ? remark.map((d, index) => (
                  <Text key={index} fontSize="12px">
                    {d.diagnosis} - {d.note}
                  </Text>
                ))
              : "No diagnosis"}
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {referredDate}
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
                {/* Only show the action option if the status is not "admited" */}
                {status.toLowerCase() !== "admited" && (
                  <MenuItem
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                    onClick={onAdmit}
                  >
                    {status.toLowerCase() === "toadmit"
                      ? "Admit"
                      : status.toLowerCase() === "totransfer"
                      ? "Transfer"
                      : status.toLowerCase() === "todischarge"
                      ? "Discharge"
                      : "Action"}
                  </MenuItem>
                )}
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
      {/* Vital Chart */}
      {type === "vital-chart" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {vitalDate}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {temperature}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {heartRate}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {bpSystolic}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {bpDiastolic}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {rbs}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {gcs}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {painScore}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {bmi}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {height}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {weight}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {o2Saturation}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {createdBy}
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

      {type === "medication-chart" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {drug}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {note}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {dose}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {frequency}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {route}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {createdBy}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {createdOn}
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

      {/* Progress Report */}
      {type === "progress-report" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {specialization}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {createdDate}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {createdTime}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {report}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {createdBy}
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
                  Update
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

      {/* Nursing Care */}
      {type === "nursing-care" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {nursingDiagnosis}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {objectives}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {actionintervention}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {evaluation}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {staffName}
            </Text>
          </Td>

          <Td>
            <Text fontWeight="400" fontSize="12px">
              {createdOn}
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

      {/* Fluid Balance Chart */}
      {type === "fluid-balance-chart" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {createdOn}
            </Text>
          </Td>
          {/* Intake */}
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {intakeType}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {intakeRoute}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {intakeAmount}
            </Text>
          </Td>

          {/* Output */}
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {outputType}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {outputRoute}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {outputAmount}
            </Text>
          </Td>

          {/* Meta */}
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {servedBy}
            </Text>
          </Td>

          {/* Actions */}
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

      {type === "insulin-chart" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {date}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {insulinType}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {rbsValue}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {dosage}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {route}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {servedBy}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {createdDate}
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

      {type === "tube-feeding-chart" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {tubeFeedingDatetimefeeds}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {tubeFeedingAmount}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {tubeFeedingFeed}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {servedBy}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {createdDate}
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

      {type === "blood-monitoring-chart" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {date}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {bloodMonitoringTime}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {testType}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {rbsFbsValue}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {bloodMonitoringSign}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {createdAt}
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
      {type === "radiology" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {date}
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
            <Text fontWeight="400" fontSize="12px">
              {department}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {note}
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
                  onClick={onEdit}
                >
                  Edit
                </MenuItem>
              </MenuList>
            </Menu>
          </Td>
        </>
      )}
      {type === "radiologypage" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {date}
            </Text>
          </Td>
          <Td>
            <HStack>
              <Avatar size="sm" name={patient} />
              <Box>
                <Text fontWeight="500" fontSize="13px">
                  {patient}
                </Text>
                <Text fontWeight="400" color="#667085" fontSize="11px">
                  {email}
                </Text>
              </Box>
            </HStack>
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
            <Text fontWeight="400" fontSize="12px">
              {department}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {note}
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
              />
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
                {status === "awaiting confirmation" ? (
                  <MenuItem
                    _hover={{
                      color: "#fff",
                      fontWeight: "400",
                      bg: "blue.blue500",
                    }}
                    onClick={onConfirm}
                  >
                    Confirm
                  </MenuItem>
                ) : (
                  <>
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
                      onClick={onEdit}
                    >
                      Edit
                    </MenuItem>
                    {status === "inprogress" && (
                      <MenuItem
                        _hover={{
                          color: "#fff",
                          fontWeight: "400",
                          bg: "blue.blue500",
                        }}
                        onClick={onEnterResult}
                      >
                        Enter Result
                      </MenuItem>
                    )}
                    {/* New action: View Manual Result */}
                    <MenuItem
                      _hover={{
                        color: "#fff",
                        fontWeight: "400",
                        bg: "blue.blue500",
                      }}
                      onClick={onViewManualResult}
                    >
                      View Manual Result
                    </MenuItem>
                  </>
                )}
              </MenuList>
            </Menu>
          </Td>
        </>
      )}

      {type === "theatre-management" && (
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
              {bedSpecialization}
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
            <HStack
              color={
                status === "active"
                  ? "#027A48"
                  : status === "inactive"
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
      {type === "refer-theatre-admission" && (
        <>
          {/* Serial Number */}
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {sn}
            </Text>
          </Td>
          {/* Admission ID */}
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {theatreadmissionid}
            </Text>
          </Td>
          {/* Appointment Date */}
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {appointmentdate ? moment(appointmentdate).format("lll") : ""}
            </Text>
          </Td>
          {/* Clinic */}
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {clinic}
            </Text>
          </Td>
          {/* Patient Info with Avatar */}
          <Td>
            <HStack cursor="pointer">
              <Avatar
                size="sm"
                name={
                  patient
                    ? `${patient.title} ${patient.firstName} ${patient.lastName}`
                    : ""
                }
              />
              <Box>
                <Text fontWeight="500" fontSize="13px">
                  {patient
                    ? `${patient.title} ${patient.firstName} ${patient.lastName}`
                    : ""}
                </Text>
                <Text fontWeight="400" color="#667085" fontSize="11px">
                  {patient ? patient.MRN : ""}
                </Text>
              </Box>
            </HStack>
          </Td>
          {/* Referred Theatre Name */}
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {referedtheatre ? referedtheatre.theatrename : ""}
            </Text>
          </Td>
          {/* Doctor Name */}
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {doctorname}
            </Text>
          </Td>
          <Td>
            <HStack
              color={
                status === "Admited"
                  ? "#027A48"
                  : status === "To Admit"
                  ? "#FFA30C"
                  : status === "Discharged"
                  ? "#FD4739"
                  : "#808080"
              }
            >
              <Box
                rounded="100%"
                w="8px"
                h="8px"
                bg={
                  status === "Admited"
                    ? "#027A48"
                    : status === "To Admit"
                    ? "#FFA30C"
                    : status === "Discharged"
                    ? "#FD4739"
                    : "#808080"
                }
              ></Box>
              <Text fontWeight="400" fontSize="13px">
                {status}
              </Text>
            </HStack>
          </Td>
          {/* Action Menu */}
          <Td>
            <Menu>
              <MenuButton as={Box}>
                <Flex justifyContent="center" color="#000000" fontSize="16px">
                  <BsThreeDots />
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuItem
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                  onClick={() => onChangeStatus("totransfer")}
                >
                  To Transfer
                </MenuItem>
                <MenuItem
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                  onClick={() => onChangeStatus("todischarge")}
                >
                  To Discharge
                </MenuItem>
              </MenuList>
            </Menu>
          </Td>
        </>
      )}

      {type === "single-refer-theatre-admission" && (
        <>
          {/* Serial Number */}
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {sn}
            </Text>
          </Td>
          {/* Patient Info with Avatar */}
          <Td>
            <HStack cursor="pointer">
              <Avatar
                size="sm"
                name={patient ? `${patient.firstName} ${patient.lastName}` : ""}
              />
              <Box>
                <Text fontWeight="500" fontSize="13px">
                  {patient ? `${patient.firstName} ${patient.lastName}` : ""}
                </Text>
                <Text fontWeight="400" color="#667085" fontSize="11px">
                  {patient ? patient.MRN : ""}
                </Text>
              </Box>
            </HStack>
          </Td>
          {/* Admission ID */}
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {theatreadmissionid}
            </Text>
          </Td>
          {/* Appointment Date */}
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {appointmentdate ? moment(appointmentdate).format("lll") : ""}
            </Text>
          </Td>
          {/* Clinic */}
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {clinic}
            </Text>
          </Td>

          {/* Refered Theatre Name */}
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {referedtheatre ? referedtheatre.theatrename : ""}
            </Text>
          </Td>
          {/* Doctor Name */}
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {doctorname}
            </Text>
          </Td>
          <Td>
            <HStack
              color={
                status === "Admited"
                  ? "#027A48"
                  : status === "To Admit"
                  ? "#FFA30C"
                  : status === "Discharged"
                  ? "#FD4739"
                  : "#808080"
              }
            >
              <Box
                rounded="100%"
                w="8px"
                h="8px"
                bg={
                  status === "Admited"
                    ? "#027A48"
                    : status === "To Admit"
                    ? "#FFA30C"
                    : status === "Discharged"
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
                  onClick={onAdmit}
                >
                  Admit
                </MenuItem>

                <MenuItem
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                  onClick={onTransfer}
                >
                  Transfer
                </MenuItem>
                <MenuItem
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                  onClick={onDischarge}
                >
                  Discharge
                </MenuItem>
              </MenuList>
            </Menu>
          </Td>
        </>
      )}
      {type === "cashier" && (
        <>
          <Td>
            <HStack>
              <Avatar
                size="sm"
                name={`${patient.firstName} ${patient.lastName}`}
              />
              <Box>
                <Text fontWeight="500" fontSize="13px">
                  {`${patient.firstName} ${patient.lastName}`}
                </Text>
                <Text fontWeight="400" color="#667085" fontSize="11px">
                  {patient.email}
                </Text>
              </Box>
            </HStack>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {paymentype}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {paymentcategory}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {paymentreference}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {amount}
            </Text>
          </Td>
          <Td>
            <HStack
              color={
                status === "paid"
                  ? "#027A48"
                  : status === "pending"
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
                    : status === "pending"
                    ? "#FFA30C"
                    : "#FD4739"
                }
              ></Box>
              <Text fontWeight="400" fontSize="13px">
                {status}
              </Text>
            </HStack>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {new Date(createdAt).toLocaleDateString()}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {cashieremail}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {cashierid}
            </Text>
          </Td>
        </>
      )}
      {type === "insurance-management" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {sn}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {hmoname}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {id}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {createdAt}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {updatedAt}
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
                  fontWeight="500"
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
      {type === "hmo-patient-management" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {sn}
            </Text>
          </Td>
          <Td>
            <HStack cursor="pointer" onClick={onClick}>
              <Avatar size="sm" name={name} />
              <Box>
                <Text fontWeight="500" fontSize="13px">
                  {name}
                </Text>
                <Text fontWeight="400" color="#667085" fontSize="11px">
                  {email}
                </Text>
              </Box>
            </HStack>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {mrn}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {phone}
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
              {hmoStatus}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {hmoId}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {hmoName}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {hmoPlan}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {date}
            </Text>
          </Td>
        </>
      )}
      {type === "test" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {sn}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {testName}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {subcomponients.join(", ")}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {createdAt}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {updatedAt}
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
                  fontWeight="500"
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
      {type === "pharmacy" && (
        <>
          <Td>
            <Text fontWeight="500" fontSize="13px">
              {orderid}
            </Text>
          </Td>
          <Td>
            <HStack>
              <Avatar size="sm" name={patient} />
              <Box>
                <Text fontWeight="500" fontSize="13px">
                  {patient}
                </Text>
                <Text fontWeight="400" color="#667085" fontSize="11px">
                  {email}
                </Text>
              </Box>
            </HStack>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {MRN}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {new Date(createdDate).toLocaleDateString()}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {prescribersName}
            </Text>
          </Td>

          <Td>
            <Text fontWeight="400" fontSize="12px">
              {isHMOCover}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {HMOName}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {HMOPlan}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {appointmentdate
                ? new Date(appointmentdate).toLocaleDateString()
                : "N/A"}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {clinic}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {appointmentid}
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
                  onClick={onConfirm}
                >
                  Order Details
                </MenuItem>
              </MenuList>
            </Menu>
          </Td>
        </>
      )}
      {type === "audit" && (
        <>
          <Td>
            <Text fontWeight="500" fontSize="13px">
              {sn}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="500" fontSize="13px">
              {action}
            </Text>
          </Td>
          <Td>
            <HStack>
              <Avatar size="sm" name={actor} />
              <Box>
                <Text fontWeight="500" fontSize="13px">
                  {actor}
                </Text>
              </Box>
            </HStack>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {affectedEntity}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {new Date(createdAt).toLocaleDateString()}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {new Date(updatedAt).toLocaleDateString()}
            </Text>
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
          {/*  Serve‑status cell — now always green if served, red if not  */}
          <Td>
            <HStack color={servedColor}>
              <Box rounded="full" w="8px" h="8px" bg={servedColor} />
              <Text fontWeight="400" fontSize="13px">
                {servedstatus}
              </Text>
            </HStack>
          </Td>

          {/*  Action cell — only show the Menu when the row is UN‑served  */}
          <Td>
            {isUnserved ? (
              <Menu isLazy>
                <MenuButton as={Box}>
                  <Flex justifyContent="center" color="#000" fontSize="16px">
                    <BsThreeDots />
                  </Flex>
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={onServe}
                    textTransform="capitalize"
                    fontWeight="500"
                    color="#2F2F2F"
                    _hover={{
                      color: "#fff",
                      bg: "blue.blue500",
                      fontWeight: "400",
                    }}
                  >
                    <HStack fontSize="14px">
                      <Text>Serve</Text>
                    </HStack>
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Box />
            )}
          </Td>
        </>
      )}
      {type === "dailywardreport" && (
        <>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {wardid}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {wardname}
            </Text>
          </Td>

          <Td>
            <Text fontWeight="400" fontSize="12px">
              {bedspecialization}
            </Text>
          </Td>

          <Td>
            <Text fontWeight="400" fontSize="12px">
              {totalbed}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {occupiedbed}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {vacantbed}
            </Text>
          </Td>

          <Td>
            <Text fontWeight="400" fontSize="12px">
              {staffname}
            </Text>
          </Td>
          {/* New status column */}
          <Td>
            <HStack color={status === "active" ? "#027A48" : "#FD4739"}>
              <Box
                rounded="100%"
                w="8px"
                h="8px"
                bg={status === "active" ? "#027A48" : "#FD4739"}
              />
              <Text fontWeight="400" fontSize="13px">
                {status}
              </Text>
            </HStack>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {new Date(createdAt).toLocaleString()}
            </Text>
          </Td>
          <Td>
            <Text fontWeight="400" fontSize="12px">
              {new Date(updatedAt).toLocaleString()}
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
                  onClick={onViewDailyWardReport}
                >
                  View
                </MenuItem>
                <MenuItem
                  _hover={{
                    color: "#fff",
                    fontWeight: "400",
                    bg: "blue.blue500",
                  }}
                  onClick={onEditDailyWardReport}
                >
                  Edit
                </MenuItem>
              </MenuList>
            </Menu>
          </Td>
        </>
      )}
    </Tr>
  );
}
