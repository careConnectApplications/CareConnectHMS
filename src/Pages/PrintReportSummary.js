import {
  HStack,
  Box,
  Text,
  Spacer,
  Image,
  Flex,
  SimpleGrid,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import Button from "../Components/Button";
import PrintCard from "../Components/PrintCard";
import { Table, Thead, Tbody, Tr, Th, TableContainer } from "@chakra-ui/react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdLocalPrintshop } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../Assets/carelogo.png";
import { GetPaymentReceiptApi } from "../Utils/ApiCalls";
import moment from "moment";
import { FacilityName } from "../Utils/ApiConfig";
import TableRow from "../Components/TableRow";
import Preloader from "../Components/Preloader";

export default function PrintReportSummary() {
  const { id } = useParams();
  const nav = useNavigate();
  const pathname = localStorage.getItem("pathname");
  const Data = JSON.parse(localStorage.getItem("reportSummary"));
  const DateRange = JSON.parse(localStorage.getItem("dateRange"));
  const Category = localStorage.getItem("reportCategory");

  const [TotalAmount, setTotalAmount] = useState([]);
  const [ResultData, setResultData] = useState([]);
  const [Hide, setHide] = useState(false);

  const printNow = () => {
    setHide(true);
    setTimeout(() => {
      window.print();
    }, 1000);
    setTimeout(() => {
      setHide(false);
    }, 2000);
  };

  useEffect(() => {}, []);

  return (
    <Box px="6%" mt="32px">
      {Hide === false && (
        <HStack mb="12px">
          <Button
            leftIcon={<IoMdArrowRoundBack />}
            w="150px"
            onClick={() => nav(`${pathname}`)}
          >
            Back
          </Button>
          <Spacer />
          <Button w="150px" rightIcon={<MdLocalPrintshop />} onClick={printNow}>
            Print
          </Button>
        </HStack>
      )}
      <Flex justifyContent="center">
        <Image src={logo} width={"10%"} onClick={() => nav("/")} />
      </Flex>
      <Text
        textAlign="center"
        fontSize="20px"
        textTransform="uppercase"
        fontWeight="900"
        color="#242424"
      >
       {FacilityName}
      </Text>
      <Text
        textAlign="center"
        fontSize="16px"
        textTransform="uppercase"
        fontWeight="500"
        color="#242424"
      >
        Report Summary for {Category.replace("aggregate", " aggregate")}{" "}
        {`From ${DateRange.from} to ${DateRange.to}`}{" "}
      </Text>
      <Box>
        {Category === "financialaggregate" && (
          <>
          <TableContainer mt="15px">
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    S/N
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    Payment Category
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    Total Amount (&#8358;)
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    Status
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {Data.map((item, i) => (
                  <TableRow
                    type="financial-aggregate"
                    sn={i + 1}
                    category={item.paymentcategory}
                    total={item.totalAmount?.toLocaleString()}
                    status={item.status}
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Box
              mt="20px"
              p="20px"
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="md"
              bg="gray.50"
            >
             
              <Text fontWeight="700" fontSize="16px">
                Grand Total Amount: &#8358;{" "}
                {JSON.parse(
                  localStorage.getItem("reportGrandTotal")
                )?.grandtotalAmount}
              </Text>
            </Box>
           </>
        )}

        {Category === "cashieraggregate" && (
          <>
          <TableContainer mt="15px">
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    S/N
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    Cashier Email
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    Cashier Name
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    Cashier ID
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    Total Amount (&#8358;)
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    Status
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {Data.map((item, i) => (
                  <TableRow
                    type="cashier-aggregate"
                    sn={i + 1}
                    email={item.cashieremail}
                    name={item.cashiername}
                    id={item.cashierid}
                    total={item.totalAmount?.toLocaleString()}
                    status={item.status}
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Box
              mt="20px"
              p="20px"
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="md"
              bg="gray.50"
            >
             
              <Text fontWeight="700" fontSize="16px">
                Grand Total Amount: &#8358;{" "}
                {JSON.parse(
                  localStorage.getItem("reportGrandTotal")
                )?.grandtotalAmount.toLocaleString()}
              </Text>
            </Box>
           </>
        )}

        {Category === "appointmentaggregate" && (
          <>
          <TableContainer mt="15px">
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    S/N
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    Number of Appointment
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    Clinic
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    Status
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {Data.map((item, i) => (
                  <TableRow
                    type="appointment-aggregate"
                    sn={i + 1}
                    appointment={item.Numberofappointment}
                    clinic={item.clinic}
                    status={item.status}
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Box
              mt="20px"
              p="20px"
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="md"
              bg="gray.50"
            >
             
              <Text fontWeight="700" fontSize="16px">
                Grand Total Number Of Appointments: {" "}
                {JSON.parse(
                  localStorage.getItem("reportGrandTotal")
                )?.GrandTotalNumberofappointment}
              </Text>
            </Box>
           </>
        )}

        {Category === "admissionaggregate" && (
          <>
          <TableContainer mt="15px">
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    S/N
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    Number of Admission
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    WardName
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    Status
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {Data.map((item, i) => (
                  <TableRow
                    type="appointment-aggregate"
                    sn={i + 1}
                    appointment={item.Numberofadmission}
                    clinic={item.wardname}
                    status={item.status}
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Box
              mt="20px"
              p="20px"
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="md"
              bg="gray.50"
            >
             
              <Text fontWeight="700" fontSize="16px">
                Grand Total Number Of Admissions: {" "}
                {JSON.parse(
                  localStorage.getItem("reportGrandTotal")
                )?.TotalNumberofadmission}
              </Text>
            </Box>
            </>
        )}

        {Category === "procedureaggregate" && (
          <>
            <TableContainer mt="15px">
              <Table variant="striped">
                <Thead>
                  <Tr>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000"
                      fontWeight="600"
                    >
                      S/N
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000"
                      fontWeight="600"
                    >
                      Clinic
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000"
                      fontWeight="600"
                    >
                      Number of Procedures
                    </Th>
                    <Th
                      fontSize="13px"
                      textTransform="capitalize"
                      color="#000"
                      fontWeight="600"
                    >
                      Total Amount (&#8358;)
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Data.map((item, i) => (
                    <TableRow
                      type="procedure-aggregate"
                      sn={i + 1}
                      clinic={item.clinic}
                      procedures={item.Numberofprocedures}
                      total={item.totalAmount?.toLocaleString()}
                    />
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            <Box
              mt="20px"
              p="20px"
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="md"
              bg="gray.50"
            >
              <Text fontWeight="700" fontSize="16px" mb="2">
                Grand Total Procedures:{" "}
                {
                  JSON.parse(localStorage.getItem("procedureGrandTotal"))
                    .TotalNumberofprocedures
                }
              </Text>
              <Text fontWeight="700" fontSize="16px">
                Grand Total Amount: &#8358;{" "}
                {JSON.parse(
                  localStorage.getItem("procedureGrandTotal")
                ).GrandtotalAmount?.toLocaleString()}
              </Text>
            </Box>
          </>
        )}

        {Category === "clinicalaggregate" && (
          <TableContainer mt="15px">
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    S/N
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    Number of Appointments
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    Diagnosis
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {Data.map((item, i) => (
                  <TableRow
                    type="clinical-aggregate"
                    sn={i + 1}
                    appointment={item.Numberofappointment}
                    diagnosis={item.diagnosis}
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}

        {Category === "hmoaggregate" && (
          Data.hmolabsummary?.length > 0 && (
            <>
              <Text>HMO Lab Summary</Text>
              <TableContainer mt="15px">
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    S/N
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    Total Number
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    HMO Name
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {Data.hmolabsummary?.map((item, i) => (
                  <TableRow
                    type="clinical-aggregate"
                    sn={i + 1}
                    appointment={item.TotalNumber}
                    diagnosis={item.HMOName}
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
            </>
          )
         
        )}
        {Category === "hmoaggregate" && (
          Data.hmopharmacysummary?.length > 0 && (
            <>
              <Text>HMO Pharmacy Summary</Text>
              <TableContainer mt="15px">
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    S/N
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    Total Number
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    HMO Name
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {Data.hmopharmacysummary?.map((item, i) => (
                  <TableRow
                    type="clinical-aggregate"
                    sn={i + 1}
                    appointment={item.TotalNumber}
                    diagnosis={item.HMOName}
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
            </>
          )
         
        )}
        {Category === "hmoaggregate" && (
          Data.hmoproceduresummary?.length > 0 && (
            <>
              <Text>HMO Procedure Summary</Text>
              <TableContainer mt="15px">
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    S/N
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    Total Number
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    HMO Name
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {Data.hmoproceduresummary?.map((item, i) => (
                  <TableRow
                    type="clinical-aggregate"
                    sn={i + 1}
                    appointment={item.TotalNumber}
                    diagnosis={item.HMOName}
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
            </>
          )
         
        )}
        {Category === "hmoaggregate" && (
          Data.hmoradiologysummary?.length > 0 && (
            <>
              <Text>HMO Radiology Summary</Text>
              <TableContainer mt="15px">
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    S/N
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    Total Number
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    HMO Name
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {Data.hmoradiologysummary?.map((item, i) => (
                  <TableRow
                    type="clinical-aggregate"
                    sn={i + 1}
                    appointment={item.TotalNumber}
                    diagnosis={item.HMOName}
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
            </>
          )
         
        )}
        {Category === "hmoaggregate" && (
          Data.hmsappointmentsummary?.length > 0 && (
            <>
              <Text>HMO Appointment Summary</Text>
              <TableContainer mt="15px">
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    S/N
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    Total Number
                  </Th>
                  <Th
                    fontSize="13px"
                    textTransform="capitalize"
                    color="#000"
                    fontWeight="600"
                  >
                    HMO Name
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {Data.hmsappointmentsummary?.map((item, i) => (
                  <TableRow
                    type="clinical-aggregate"
                    sn={i + 1}
                    appointment={item.TotalNumber}
                    diagnosis={item.HMOName}
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
            </>
          )
         
        )}
      </Box>
    </Box>
  );
}
