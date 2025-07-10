import { HStack, Radio, RadioGroup, Text } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  SimpleGrid,
  Select,
  Checkbox,
} from "@chakra-ui/react";
import Input from "./Input";
import Button from "./Button";
import { FaNoteSticky } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { IoColorFilter } from "react-icons/io5";
import {
  SettingsApi,
  AddFamilyPlanAPI,
  UpdateFamilyPlaningAPI,
} from "../Utils/ApiCalls";
import { FaArrowsToDot } from "react-icons/fa6";
import { AiFillDatabase } from "react-icons/ai";

export default function CreateFamilyPlanningModal({
  isOpen,
  onClose,
  setOldPayload,
  activateNotifications,
  type,
  oldPayload,
}) {
  const [Disabled, setDisabled] = useState(true);
  const [Loading, setLoading] = useState(false);
  const [Settings, setSettings] = useState("");

  const id = localStorage.getItem("patientId");

  const [Payload, setPayload] = useState({
    weight: "",
    bloodpressuresystolic: "",
    parity: "",
    counsellingonfamilyplanning: "",
    counsellingonpostpartumfamilyplanning: "",
    firsttimemodernfamilyplanninguser: "",
    emergencycontraception: "",
    typeoffamilyplanningclient: "",
    oralpillsname: "",
    orapillsquantity: "",
    nameofinjectable: "",
    injectablequantity: "",
    selfinjection: "",
    typeofiud: "",
    typeofbarriermethods: "",
    barrierquantity: "",
    typeofimplants: "",
    voluntorysterilization: "",
  });

  const [CheckedItems, setCheckedItems] = useState({
    oralnewacceptor: false,
    oralrevisit: false,
    injectableacceptor: false,
    injectablerevisit: false,
    iudinnewacceptor: false,
    iudinrevisit: false,
    iudoutnewacceptor: false,
    iudoutrevisit: false,
    barriernewacceptor: false,
    barrierrevisit: false,
    implantsinnewacceptor: false,
    implantsinrevisit: false,
    implantsoutnewacceptor: false,
    implantsoutrevisit: false,
    naturalemthodsnewacceptorforcyclebeads: false,
    naturalemthodsrevisitforcyclebeads: false,
    naturalemthodsnewacceptorforothers: false,
    naturalemthodsrevisitforothers: false,
    referredoralpills: false,
    referredinjectable: false,
    referredip: false,
    referredintrauterinedevice: false,
    referredsurgicalreferred: false,
    referredmedicalreferred: false,
  });

  const handleCheckBoxChange = (event) => {
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [event.target.value]: event.target.checked,
    }));
  };

  const [UpdatedPayload, setUpdatedPayload] = useState({
    weight: "",
    bloodpressuresystolic: "",
    parity: "",
    counsellingonfamilyplanning: "",
    counsellingonpostpartumfamilyplanning: "",
    firsttimemodernfamilyplanninguser: "",
    emergencycontraception: "",
    typeoffamilyplanningclient: "",
    oralpillsname: "",
    orapillsquantity: "",
    nameofinjectable: "",
    injectablequantity: "",
    selfinjection: "",
    typeofiud: "",
    typeofbarriermethods: "",
    barrierquantity: "",
    typeofimplants: "",
    voluntorysterilization: "",
  });

  const [UpdatedCheckedItems, setUpdatedCheckedItems] = useState({
    oralnewacceptor: false,
    oralrevisit: false,
    injectableacceptor: false,
    injectablerevisit: false,
    iudinnewacceptor: false,
    iudinrevisit: false,
    iudoutnewacceptor: false,
    iudoutrevisit: false,
    barriernewacceptor: false,
    barrierrevisit: false,
    implantsinnewacceptor: false,
    implantsinrevisit: false,
    implantsoutnewacceptor: false,
    implantsoutrevisit: false,
    naturalemthodsnewacceptorforcyclebeads: false,
    naturalemthodsrevisitforcyclebeads: false,
    naturalemthodsnewacceptorforothers: false,
    naturalemthodsrevisitforothers: false,
    referredoralpills: false,
    referredinjectable: false,
    referredip: false,
    referredintrauterinedevice: false,
    referredsurgicalreferred: false,
    referredmedicalreferred: false,
  });

  const handleUpdatedCheckBoxChange = (event) => {
    setUpdatedCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [event.target.value]: event.target.checked,
    }));
  };

  const handlePayload = (e) => {
    setPayload({ ...Payload, [e.target.id]: e.target.value });
  };

  const handleUpdatedPayload = (e) => {
    setUpdatedPayload({ ...UpdatedPayload, [e.target.id]: e.target.value });
  };

  const handleSubmitNew = async () => {
    setLoading(true);

    // Convert checkbox booleans to "Yes"/"No"
    const checkboxPayload = prepareCheckboxPayload(CheckedItems);
    let mergedPayload = { ...Payload, ...checkboxPayload };

    try {
      const result = await AddFamilyPlanAPI(mergedPayload, id);

      if (result.status === 200) {
        setLoading(false);
        activateNotifications("New Family Plan Added Successfully", "success");
        onClose();
      }
    } catch (e) {
      setLoading(false);
      activateNotifications(e.message, "error");
    }
  };

  const handleSubmitUpdate = async () => {
    setLoading(true);

    // Convert checkbox booleans to "Yes"/"No"
    const checkboxPayload = prepareCheckboxPayload(UpdatedCheckedItems);
    let mergedPayload = { ...UpdatedPayload, ...checkboxPayload };

    try {
      const result = await UpdateFamilyPlaningAPI(
        mergedPayload,
        oldPayload._id
      );

      if (result.status === 200) {
        setLoading(false);
        activateNotifications(
          "Family Planning Updated Successfully",
          "success"
        );
        onClose();
      }
    } catch (e) {
      setLoading(false);
      activateNotifications(e.message, "error");
    }
  };
  const prepareCheckboxPayload = (checkedItems) => {
    return Object.keys(checkedItems).reduce((acc, key) => {
      acc[key] = checkedItems[key] ? "Yes" : "No";
      return acc;
    }, {});
  };

  const getSettings = async () => {
    try {
      const result = await SettingsApi();
      console.log("Settings API Response:", result);
      setSettings(result);
    } catch (e) {}
  };

  useEffect(() => {
    getSettings();

    if (type === "edit" || type === "view") {
      setUpdatedPayload({
        weight: oldPayload?.weight || "",
        bloodpressuresystolic: oldPayload?.bloodpressuresystolic || "",
        parity: oldPayload?.parity || "",
        counsellingonfamilyplanning:
          oldPayload?.counsellingonfamilyplanning || "",
        counsellingonpostpartumfamilyplanning:
          oldPayload?.counsellingonpostpartumfamilyplanning || "",
        firsttimemodernfamilyplanninguser:
          oldPayload?.firsttimemodernfamilyplanninguser || "",
        emergencycontraception: oldPayload?.emergencycontraception || "",
        typeoffamilyplanningclient:
          oldPayload?.typeoffamilyplanningclient || "",
        oralpillsname: oldPayload?.oralpillsname || "",
        orapillsquantity: oldPayload?.orapillsquantity || "",
        nameofinjectable: oldPayload?.nameofinjectable || "",
        injectablequantity: oldPayload?.injectablequantity || "",
        selfinjection: oldPayload?.selfinjection || "",
        typeofiud: oldPayload?.typeofiud || "",
        typeofbarriermethods: oldPayload?.typeofbarriermethods || "",
        barrierquantity: oldPayload?.barrierquantity || "",
        typeofimplants: oldPayload?.typeofimplants || "",
        voluntorysterilization: oldPayload?.voluntorysterilization || "",
      });

      setUpdatedCheckedItems({
        oralnewacceptor: oldPayload?.oralnewacceptor === "Yes",
        oralrevisit: oldPayload?.oralrevisit === "Yes",
        injectableacceptor: oldPayload?.injectableacceptor === "Yes",
        injectablerevisit: oldPayload?.injectablerevisit === "Yes",
        iudinnewacceptor: oldPayload?.iudinnewacceptor === "Yes",
        iudinrevisit: oldPayload?.iudinrevisit === "Yes",
        iudoutnewacceptor: oldPayload?.iudoutnewacceptor === "Yes",
        iudoutrevisit: oldPayload?.iudoutrevisit === "Yes",
        barriernewacceptor: oldPayload?.barriernewacceptor === "Yes",
        barrierrevisit: oldPayload?.barrierrevisit === "Yes",
        implantsinnewacceptor: oldPayload?.implantsinnewacceptor === "Yes",
        implantsinrevisit: oldPayload?.implantsinrevisit === "Yes",
        implantsoutnewacceptor: oldPayload?.implantsoutnewacceptor === "Yes",
        implantsoutrevisit: oldPayload?.implantsoutrevisit === "Yes",
        naturalemthodsnewacceptorforcyclebeads:
          oldPayload?.naturalemthodsnewacceptorforcyclebeads === "Yes",
        naturalemthodsrevisitforcyclebeads:
          oldPayload?.naturalemthodsrevisitforcyclebeads === "Yes",
        naturalemthodsnewacceptorforothers:
          oldPayload?.naturalemthodsnewacceptorforothers === "Yes",
        naturalemthodsrevisitforothers:
          oldPayload?.naturalemthodsrevisitforothers === "Yes",
        referredoralpills: oldPayload?.referredoralpills === "Yes",
        referredinjectable: oldPayload?.referredinjectable === "Yes",
        referredip: oldPayload?.referredip === "Yes",
        referredintrauterinedevice:
          oldPayload?.referredintrauterinedevice === "Yes",
        referredsurgicalreferred:
          oldPayload?.referredsurgicalreferred === "Yes",
        referredmedicalreferred: oldPayload?.referredmedicalreferred === "Yes",
      });
    }
  }, [isOpen, oldPayload, type]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent
        maxW={{ base: "90%", md: "60%" }}
        maxH="80vh"
        overflowY="auto"
      >
        <ModalHeader>
          {" "}
          {type === "new"
            ? "Add New Family Planning"
            : type === "edit"
            ? "Edit Family Planning"
            : "Family Planning Details"}{" "}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {type === "new" ? (
            <>
              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Weight"
                  type="number"
                  value={Payload.weight}
                  onChange={handlePayload}
                  id="weight"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Blood Pressure Systolic"
                  type="number"
                  value={Payload.bloodpressuresystolic}
                  onChange={handlePayload}
                  id="bloodpressuresystolic"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Parity"
                  type="text"
                  value={Payload.parity}
                  onChange={handlePayload}
                  id="parity"
                />

                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    Payload.counsellingonfamilyplanning !== "" ? "16px" : "13px"
                  }
                  borderColor="#6B7280"
                  id="counsellingonfamilyplanning"
                  value={Payload.counsellingonfamilyplanning}
                  onChange={handlePayload}
                  placeholder="Counselling on Family Planning"
                >
                  {Settings?.familyplanningyesnooption?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    Payload.counsellingonpostpartumfamilyplanning !== ""
                      ? "16px"
                      : "13px"
                  }
                  borderColor="#6B7280"
                  id="counsellingonpostpartumfamilyplanning"
                  value={Payload.counsellingonpostpartumfamilyplanning}
                  onChange={handlePayload}
                  placeholder="Counselling on Postpartum Family Planning"
                >
                  {Settings?.familyplanningyesnooption?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    Payload.firsttimemodernfamilyplanninguser !== ""
                      ? "16px"
                      : "13px"
                  }
                  borderColor="#6B7280"
                  id="firsttimemodernfamilyplanninguser"
                  value={Payload.firsttimemodernfamilyplanninguser}
                  onChange={handlePayload}
                  placeholder="First Time Modern Family Planning User"
                >
                  {Settings?.familyplanningyesnooption?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    Payload.emergencycontraception !== "" ? "16px" : "13px"
                  }
                  borderColor="#6B7280"
                  id="emergencycontraception"
                  value={Payload.emergencycontraception}
                  onChange={handlePayload}
                  placeholder="Emergency Contraception"
                >
                  {Settings?.familyplanningyesnooption?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    Payload.typeoffamilyplanningclient !== "" ? "16px" : "13px"
                  }
                  borderColor="#6B7280"
                  id="typeoffamilyplanningclient"
                  value={Payload.typeoffamilyplanningclient}
                  onChange={handlePayload}
                  placeholder="Type of Family Planning Client"
                >
                  {Settings?.typeoffamilyplanningclient?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Oral Pills:
              </Text>

              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Oral Pills Name"
                  type="text"
                  value={Payload.oralpillsname}
                  onChange={handlePayload}
                  id="oralpillsname"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Oral Pills Quantity"
                  type="text"
                  value={Payload.orapillsquantity}
                  onChange={handlePayload}
                  id="orapillsquantity"
                />
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Tick As Appropriate:
              </Text>
              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Checkbox
                  colorScheme="orange"
                  onChange={handleCheckBoxChange}
                  isChecked={CheckedItems.oralnewacceptor}
                  value="oralnewacceptor"
                >
                  <Text textTransform="capitalize">New Acceptor</Text>
                </Checkbox>
                <Checkbox
                  colorScheme="orange"
                  onChange={handleCheckBoxChange}
                  isChecked={CheckedItems.oralrevisit}
                  value="oralrevisit"
                >
                  <Text textTransform="capitalize">Revisit</Text>
                </Checkbox>
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Injectable:
              </Text>

              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={Payload.nameofinjectable !== "" ? "16px" : "13px"}
                  borderColor="#6B7280"
                  id="nameofinjectable"
                  value={Payload.nameofinjectable}
                  onChange={handlePayload}
                  placeholder="Name Of Injectable"
                >
                  {Settings?.nameofinjectable?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Injectable Quantity"
                  type="number"
                  value={Payload.injectablequantity}
                  onChange={handlePayload}
                  id="injectablequantity"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Self Injection"
                  type="text"
                  value={Payload.selfinjection}
                  onChange={handlePayload}
                  id="selfinjection"
                />
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Tick As Appropriate:
              </Text>
              {/* Injectable Checkboxes */}
              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Checkbox
                  colorScheme="orange"
                  onChange={handleCheckBoxChange}
                  isChecked={CheckedItems.injectableacceptor}
                  value="injectableacceptor"
                >
                  <Text textTransform="capitalize">New Acceptor</Text>
                </Checkbox>
                <Checkbox
                  colorScheme="orange"
                  onChange={handleCheckBoxChange}
                  isChecked={CheckedItems.injectablerevisit}
                  value="injectablerevisit"
                >
                  <Text textTransform="capitalize">Revisit</Text>
                </Checkbox>
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Intra-Uterine Device (IUD) :
              </Text>

              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 1, lg: 1 }}
                spacing={5}
              >
                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={Payload.typeofiud !== "" ? "16px" : "13px"}
                  borderColor="#6B7280"
                  id="typeofiud"
                  value={Payload.typeofiud}
                  onChange={handlePayload}
                  placeholder="Type Of IUD"
                >
                  {Settings?.typeofiud?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                IN (Tick As Appropriate):
              </Text>
              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Checkbox
                  colorScheme="orange"
                  onChange={handleCheckBoxChange}
                  isChecked={CheckedItems.iudinnewacceptor}
                  value="iudinnewacceptor"
                >
                  <Text textTransform="capitalize">New Acceptor</Text>
                </Checkbox>
                <Checkbox
                  colorScheme="orange"
                  onChange={handleCheckBoxChange}
                  isChecked={CheckedItems.iudinrevisit}
                  value="iudinrevisit"
                >
                  <Text textTransform="capitalize">Revisit</Text>
                </Checkbox>
              </SimpleGrid>
              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                OUT (Tick As Appropriate):
              </Text>
              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Checkbox
                  colorScheme="orange"
                  onChange={handleCheckBoxChange}
                  isChecked={CheckedItems.iudoutnewacceptor}
                  value="iudoutnewacceptor"
                >
                  <Text textTransform="capitalize">New Acceptor</Text>
                </Checkbox>
                <Checkbox
                  colorScheme="orange"
                  onChange={handleCheckBoxChange}
                  isChecked={CheckedItems.iudoutrevisit}
                  value="iudoutrevisit"
                >
                  <Text textTransform="capitalize">Revisit</Text>
                </Checkbox>
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Barrier Methods :
              </Text>

              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    Payload.typeofbarriermethods !== "" ? "16px" : "13px"
                  }
                  borderColor="#6B7280"
                  id="typeofbarriermethods"
                  value={Payload.typeofbarriermethods}
                  onChange={handlePayload}
                  placeholder="Type Of Barrier Methods"
                >
                  {Settings?.typeofbarriermethods?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>

                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Barrier Quantity"
                  type="number"
                  value={Payload.barrierquantity}
                  onChange={handlePayload}
                  id="barrierquantity"
                />
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Tick As Appropriate:
              </Text>
              {/* Barrier Methods Checkboxes */}
              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Checkbox
                  colorScheme="orange"
                  onChange={handleCheckBoxChange}
                  isChecked={CheckedItems.barriernewacceptor}
                  value="barriernewacceptor"
                >
                  <Text textTransform="capitalize">New Acceptor</Text>
                </Checkbox>
                <Checkbox
                  colorScheme="orange"
                  onChange={handleCheckBoxChange}
                  isChecked={CheckedItems.barrierrevisit}
                  value="barrierrevisit"
                >
                  <Text textTransform="capitalize">Revisit</Text>
                </Checkbox>
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Implants :
              </Text>

              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 1, lg: 1 }}
                spacing={5}
              >
                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={Payload.typeofimplants !== "" ? "16px" : "13px"}
                  borderColor="#6B7280"
                  id="typeofimplants"
                  value={Payload.typeofimplants}
                  onChange={handlePayload}
                  placeholder="Implant"
                >
                  {Settings?.typeofimplants?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                IN (Tick As Appropriate):
              </Text>
              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Checkbox
                  colorScheme="orange"
                  onChange={handleCheckBoxChange}
                  isChecked={CheckedItems.implantsinnewacceptor}
                  value="implantsinnewacceptor"
                >
                  <Text textTransform="capitalize">New Acceptor</Text>
                </Checkbox>
                <Checkbox
                  colorScheme="orange"
                  onChange={handleCheckBoxChange}
                  isChecked={CheckedItems.implantsinrevisit}
                  value="implantsinrevisit"
                >
                  <Text textTransform="capitalize">Revisit</Text>
                </Checkbox>
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                OUT (Tick As Appropriate):
              </Text>
              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Checkbox
                  colorScheme="orange"
                  onChange={handleCheckBoxChange}
                  isChecked={CheckedItems.implantsoutnewacceptor}
                  value="implantsoutnewacceptor"
                >
                  <Text textTransform="capitalize">New Acceptor</Text>
                </Checkbox>
                <Checkbox
                  colorScheme="orange"
                  onChange={handleCheckBoxChange}
                  isChecked={CheckedItems.implantsoutrevisit}
                  value="implantsoutrevisit"
                >
                  <Text textTransform="capitalize">Revisit</Text>
                </Checkbox>
              </SimpleGrid>
              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Voluntary Sterilization :
              </Text>

              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 1, lg: 1 }}
                spacing={5}
              >
                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    Payload.voluntorysterilization !== "" ? "16px" : "13px"
                  }
                  borderColor="#6B7280"
                  id="voluntorysterilization"
                  value={Payload.voluntorysterilization}
                  onChange={handlePayload}
                  placeholder="Type Of IUD"
                >
                  {Settings?.voluntorysterilization?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Natural Methods (Tick As Appropriate):
              </Text>
              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Checkbox
                  colorScheme="orange"
                  onChange={handleCheckBoxChange}
                  isChecked={
                    CheckedItems.naturalemthodsnewacceptorforcyclebeads
                  }
                  value="naturalemthodsnewacceptorforcyclebeads"
                >
                  <Text>New Acceptor for Cycle Beads (NA)</Text>
                </Checkbox>
                <Checkbox
                  colorScheme="orange"
                  onChange={handleCheckBoxChange}
                  isChecked={CheckedItems.naturalemthodsrevisitforcyclebeads}
                  value="naturalemthodsrevisitforcyclebeads"
                >
                  <Text>Revisit (RV) for Cycle Beads</Text>
                </Checkbox>
                <Checkbox
                  colorScheme="orange"
                  onChange={handleCheckBoxChange}
                  isChecked={CheckedItems.naturalemthodsnewacceptorforothers}
                  value="naturalemthodsnewacceptorforothers"
                >
                  <Text>New Acceptor for Others (NA)</Text>
                </Checkbox>
                <Checkbox
                  colorScheme="orange"
                  onChange={handleCheckBoxChange}
                  isChecked={CheckedItems.naturalemthodsrevisitforothers}
                  value="naturalemthodsrevisitforothers"
                >
                  <Text>Revisit (RV) for Others</Text>
                </Checkbox>
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Referred (Tick As Appropriate):
              </Text>
              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Checkbox
                  colorScheme="orange"
                  onChange={handleCheckBoxChange}
                  isChecked={CheckedItems.referredoralpills}
                  value="referredoralpills"
                >
                  <Text>Oral Pills (OP)</Text>
                </Checkbox>
                <Checkbox
                  colorScheme="orange"
                  onChange={handleCheckBoxChange}
                  isChecked={CheckedItems.referredinjectable}
                  value="referredinjectable"
                >
                  <Text>Injectable (IJ)</Text>
                </Checkbox>
                <Checkbox
                  colorScheme="orange"
                  onChange={handleCheckBoxChange}
                  isChecked={CheckedItems.referredip}
                  value="referredip"
                >
                  <Text>IP</Text>
                </Checkbox>
                <Checkbox
                  colorScheme="orange"
                  onChange={handleCheckBoxChange}
                  isChecked={CheckedItems.referredintrauterinedevice}
                  value="referredintrauterinedevice"
                >
                  <Text>Intra-Uterine Device (IUD)</Text>
                </Checkbox>
                <Checkbox
                  colorScheme="orange"
                  onChange={handleCheckBoxChange}
                  isChecked={CheckedItems.referredsurgicalreferred}
                  value="referredsurgicalreferred"
                >
                  <Text>Surgical Referred (STER)</Text>
                </Checkbox>
                <Checkbox
                  colorScheme="orange"
                  onChange={handleCheckBoxChange}
                  isChecked={CheckedItems.referredmedicalreferred}
                  value="referredmedicalreferred"
                >
                  <Text>Medical Referral (MR)</Text>
                </Checkbox>
              </SimpleGrid>

              <Button mt="32px" isLoading={Loading} onClick={handleSubmitNew}>
                Proceed
              </Button>
            </>
          ) : type === "edit" ? (
            <>
              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Weight"
                  type="number"
                  value={UpdatedPayload.weight}
                  onChange={handleUpdatedPayload}
                  id="weight"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Blood Pressure Systolic"
                  type="number"
                  value={UpdatedPayload.bloodpressuresystolic}
                  onChange={handleUpdatedPayload}
                  id="bloodpressuresystolic"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Parity"
                  type="text"
                  value={UpdatedPayload.parity}
                  onChange={handleUpdatedPayload}
                  id="parity"
                />

                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    UpdatedPayload.counsellingonfamilyplanning !== ""
                      ? "16px"
                      : "13px"
                  }
                  borderColor="#6B7280"
                  id="counsellingonfamilyplanning"
                  value={UpdatedPayload.counsellingonfamilyplanning}
                  onChange={handleUpdatedPayload}
                  placeholder="Counselling on Family Planning"
                >
                  {Settings?.familyplanningyesnooption?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    UpdatedPayload.counsellingonpostpartumfamilyplanning !== ""
                      ? "16px"
                      : "13px"
                  }
                  borderColor="#6B7280"
                  id="counsellingonpostpartumfamilyplanning"
                  value={UpdatedPayload.counsellingonpostpartumfamilyplanning}
                  onChange={handleUpdatedPayload}
                  placeholder="Counselling on Postpartum Family Planning"
                >
                  {Settings?.familyplanningyesnooption?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    UpdatedPayload.firsttimemodernfamilyplanninguser !== ""
                      ? "16px"
                      : "13px"
                  }
                  borderColor="#6B7280"
                  id="firsttimemodernfamilyplanninguser"
                  value={UpdatedPayload.firsttimemodernfamilyplanninguser}
                  onChange={handleUpdatedPayload}
                  placeholder="First Time Modern Family Planning User"
                >
                  {Settings?.familyplanningyesnooption?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    UpdatedPayload.emergencycontraception !== ""
                      ? "16px"
                      : "13px"
                  }
                  borderColor="#6B7280"
                  id="emergencycontraception"
                  value={UpdatedPayload.emergencycontraception}
                  onChange={handleUpdatedPayload}
                  placeholder="Emergency Contraception"
                >
                  {Settings?.familyplanningyesnooption?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    UpdatedPayload.typeoffamilyplanningclient !== ""
                      ? "16px"
                      : "13px"
                  }
                  borderColor="#6B7280"
                  id="typeoffamilyplanningclient"
                  value={UpdatedPayload.typeoffamilyplanningclient}
                  onChange={handleUpdatedPayload}
                  placeholder="Type of Family Planning Client"
                >
                  {Settings?.typeoffamilyplanningclient?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Oral Pills:
              </Text>

              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Oral Pills Name"
                  type="text"
                  value={UpdatedPayload.oralpillsname}
                  onChange={handleUpdatedPayload}
                  id="oralpillsname"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Oral Pills Quantity"
                  type="text"
                  value={UpdatedPayload.orapillsquantity}
                  onChange={handleUpdatedPayload}
                  id="orapillsquantity"
                />
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Tick As Appropriate:
              </Text>
              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Checkbox
                  colorScheme="orange"
                  onChange={handleUpdatedCheckBoxChange}
                  isChecked={UpdatedCheckedItems.oralnewacceptor}
                  value="oralnewacceptor"
                >
                  <Text textTransform="capitalize"> New Acceptor</Text>
                </Checkbox>
                <Checkbox
                  colorScheme="orange"
                  onChange={handleUpdatedCheckBoxChange}
                  isChecked={UpdatedCheckedItems.oralrevisit}
                  value="oralrevisit"
                >
                  <Text textTransform="capitalize">Revisit</Text>
                </Checkbox>
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Injectable:
              </Text>

              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    UpdatedPayload.nameofinjectable !== "" ? "16px" : "13px"
                  }
                  borderColor="#6B7280"
                  id="nameofinjectable"
                  value={UpdatedPayload.nameofinjectable}
                  onChange={handleUpdatedPayload}
                  placeholder="Name Of Injectable"
                >
                  {Settings?.nameofinjectable?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Injectable Quantity"
                  type="number"
                  value={UpdatedPayload.injectablequantity}
                  onChange={handleUpdatedPayload}
                  id="injectablequantity"
                />
                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Self Injection"
                  type="text"
                  value={UpdatedPayload.selfinjection}
                  onChange={handleUpdatedPayload}
                  id="selfinjection"
                />
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Tick As Appropriate:
              </Text>
              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Checkbox
                  colorScheme="orange"
                  onChange={handleUpdatedCheckBoxChange}
                  isChecked={UpdatedCheckedItems.injectableacceptor}
                  value="injectableacceptor"
                >
                  <Text textTransform="capitalize"> New Acceptor</Text>
                </Checkbox>
                <Checkbox
                  colorScheme="orange"
                  onChange={handleUpdatedCheckBoxChange}
                  isChecked={UpdatedCheckedItems.injectablerevisit}
                  value="injectablerevisit"
                >
                  <Text textTransform="capitalize"> Revisit</Text>
                </Checkbox>
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Intra-Uterine Device (IUD) :
              </Text>

              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 1, lg: 1 }}
                spacing={5}
              >
                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={UpdatedPayload.typeofiud !== "" ? "16px" : "13px"}
                  borderColor="#6B7280"
                  id="typeofiud"
                  value={UpdatedPayload.typeofiud}
                  onChange={handleUpdatedPayload}
                  placeholder="Type Of IUD"
                >
                  {Settings?.typeofiud?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                IN (Tick As Appropriate):
              </Text>
              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Checkbox
                  colorScheme="orange"
                  onChange={handleUpdatedCheckBoxChange}
                  isChecked={UpdatedCheckedItems.iudinnewacceptor}
                  value="iudinnewacceptor"
                >
                  <Text textTransform="capitalize"> New Acceptor</Text>
                </Checkbox>
                <Checkbox
                  colorScheme="orange"
                  onChange={handleUpdatedCheckBoxChange}
                  isChecked={UpdatedCheckedItems.iudinrevisit}
                  value="iudinrevisit"
                >
                  <Text textTransform="capitalize"> Revisit</Text>
                </Checkbox>
              </SimpleGrid>
              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                OUT (Tick As Appropriate):
              </Text>
              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Checkbox
                  colorScheme="orange"
                  onChange={handleUpdatedCheckBoxChange}
                  isChecked={UpdatedCheckedItems.iudoutnewacceptor}
                  value="iudoutnewacceptor"
                >
                  <Text textTransform="capitalize"> New Acceptor</Text>
                </Checkbox>
                <Checkbox
                  colorScheme="orange"
                  onChange={handleUpdatedCheckBoxChange}
                  isChecked={UpdatedCheckedItems.iudoutrevisit}
                  value="iudoutrevisit"
                >
                  <Text textTransform="capitalize"> Revisit</Text>
                </Checkbox>
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Barrier Methods :
              </Text>

              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    UpdatedPayload.typeofbarriermethods !== "" ? "16px" : "13px"
                  }
                  borderColor="#6B7280"
                  id="typeofbarriermethods"
                  value={UpdatedPayload.typeofbarriermethods}
                  onChange={handleUpdatedPayload}
                  placeholder="Type Of Barrier Methods"
                >
                  {Settings?.typeofbarriermethods?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>

                <Input
                  leftIcon={<FaNoteSticky />}
                  label="Barrier Quantity"
                  type="number"
                  value={UpdatedPayload.barrierquantity}
                  onChange={handleUpdatedPayload}
                  id="barrierquantity"
                />
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Tick As Appropriate:
              </Text>
              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Checkbox
                  colorScheme="orange"
                  onChange={handleUpdatedCheckBoxChange}
                  isChecked={UpdatedCheckedItems.barriernewacceptor}
                  value="barriernewacceptor"
                >
                  <Text textTransform="capitalize"> New Acceptor</Text>
                </Checkbox>
                <Checkbox
                  colorScheme="orange"
                  onChange={handleUpdatedCheckBoxChange}
                  isChecked={UpdatedCheckedItems.barrierrevisit}
                  value="barrierrevisit"
                >
                  <Text textTransform="capitalize"> Revisit</Text>
                </Checkbox>
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Implants :
              </Text>

              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 1, lg: 1 }}
                spacing={5}
              >
                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    UpdatedPayload.typeofimplants !== "" ? "16px" : "13px"
                  }
                  borderColor="#6B7280"
                  id="typeofimplants"
                  value={UpdatedPayload.typeofimplants}
                  onChange={handleUpdatedPayload}
                  placeholder="Implant"
                >
                  {Settings?.typeofimplants?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                IN (Tick As Appropriate):
              </Text>
              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Checkbox
                  colorScheme="orange"
                  onChange={handleUpdatedCheckBoxChange}
                  isChecked={UpdatedCheckedItems.implantsinnewacceptor}
                  value="implantsinnewacceptor"
                >
                  <Text textTransform="capitalize"> New Acceptor</Text>
                </Checkbox>
                <Checkbox
                  colorScheme="orange"
                  onChange={handleUpdatedCheckBoxChange}
                  isChecked={UpdatedCheckedItems.implantsinrevisit}
                  value="implantsinrevisit"
                >
                  <Text textTransform="capitalize"> Revisit</Text>
                </Checkbox>
              </SimpleGrid>
              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                OUT (Tick As Appropriate):
              </Text>
              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Checkbox
                  colorScheme="orange"
                  onChange={handleUpdatedCheckBoxChange}
                  isChecked={UpdatedCheckedItems.implantsoutnewacceptor}
                  value="implantsoutnewacceptor"
                >
                  <Text textTransform="capitalize"> New Acceptor</Text>
                </Checkbox>
                <Checkbox
                  colorScheme="orange"
                  onChange={handleUpdatedCheckBoxChange}
                  isChecked={UpdatedCheckedItems.implantsoutrevisit}
                  value="implantsoutrevisit"
                >
                  <Text textTransform="capitalize"> Revisit</Text>
                </Checkbox>
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Voluntary Sterilization :
              </Text>

              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 1, lg: 1 }}
                spacing={5}
              >
                <Select
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    UpdatedPayload.voluntorysterilization !== ""
                      ? "16px"
                      : "13px"
                  }
                  borderColor="#6B7280"
                  id="voluntorysterilization"
                  value={UpdatedPayload.voluntorysterilization}
                  onChange={handleUpdatedPayload}
                  placeholder="Type Of IUD"
                >
                  {Settings?.voluntorysterilization?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Natural Methods (Tick As Appropriate):
              </Text>
              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Checkbox
                  colorScheme="orange"
                  onChange={handleUpdatedCheckBoxChange}
                  isChecked={
                    UpdatedCheckedItems.naturalemthodsnewacceptorforcyclebeads
                  }
                  value="naturalemthodsnewacceptorforcyclebeads"
                >
                  <Text textTransform="capitalize">
                    New Acceptor for Cycle Beads (NA)
                  </Text>
                </Checkbox>
                <Checkbox
                  colorScheme="orange"
                  onChange={handleUpdatedCheckBoxChange}
                  isChecked={
                    UpdatedCheckedItems.naturalemthodsrevisitforcyclebeads
                  }
                  value="naturalemthodsrevisitforcyclebeads"
                >
                  <Text textTransform="capitalize">
                    {" "}
                    Revisit (RV) for Cycle Beads
                  </Text>
                </Checkbox>
                <Checkbox
                  colorScheme="orange"
                  onChange={handleUpdatedCheckBoxChange}
                  isChecked={
                    UpdatedCheckedItems.naturalemthodsnewacceptorforothers
                  }
                  value="naturalemthodsnewacceptorforothers"
                >
                  <Text textTransform="capitalize">
                    {" "}
                    New Acceptor for Others (NA)
                  </Text>
                </Checkbox>
                <Checkbox
                  colorScheme="orange"
                  onChange={handleUpdatedCheckBoxChange}
                  isChecked={UpdatedCheckedItems.naturalemthodsrevisitforothers}
                  value="naturalemthodsrevisitforothers"
                >
                  <Text textTransform="capitalize">
                    {" "}
                    Revisit (RV) for Others
                  </Text>
                </Checkbox>
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Referred (Tick As Appropriate):
              </Text>
              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Checkbox
                  colorScheme="orange"
                  onChange={handleUpdatedCheckBoxChange}
                  isChecked={UpdatedCheckedItems.referredoralpills}
                  value="referredoralpills"
                >
                  <Text textTransform="capitalize">Oral Pills (OP)</Text>
                </Checkbox>
                <Checkbox
                  colorScheme="orange"
                  onChange={handleUpdatedCheckBoxChange}
                  isChecked={UpdatedCheckedItems.referredinjectable}
                  value="referredinjectable"
                >
                  <Text textTransform="capitalize"> Injectable (IJ)</Text>
                </Checkbox>
                <Checkbox
                  colorScheme="orange"
                  onChange={handleUpdatedCheckBoxChange}
                  isChecked={UpdatedCheckedItems.referredip}
                  value="referredip"
                >
                  <Text textTransform="capitalize"> IP</Text>
                </Checkbox>
                <Checkbox
                  colorScheme="orange"
                  onChange={handleUpdatedCheckBoxChange}
                  isChecked={UpdatedCheckedItems.referredintrauterinedevice}
                  value="referredintrauterinedevice"
                >
                  <Text textTransform="capitalize">
                    {" "}
                    Intra-Uterine Device (IUD)
                  </Text>
                </Checkbox>
                <Checkbox
                  colorScheme="orange"
                  onChange={handleUpdatedCheckBoxChange}
                  isChecked={UpdatedCheckedItems.referredsurgicalreferred}
                  value="referredsurgicalreferred"
                >
                  <Text textTransform="capitalize">
                    {" "}
                    Surgical Referred (STER)
                  </Text>
                </Checkbox>
                <Checkbox
                  colorScheme="orange"
                  onChange={handleUpdatedCheckBoxChange}
                  isChecked={UpdatedCheckedItems.referredmedicalreferred}
                  value="referredmedicalreferred"
                >
                  <Text textTransform="capitalize"> Medical Referral (MR)</Text>
                </Checkbox>
              </SimpleGrid>

              <Button
                mt="32px"
                isLoading={Loading}
                onClick={handleSubmitUpdate}
              >
                Update
              </Button>
            </>
          ) : (
            <>
              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Input
                  isDisabled={true}
                  leftIcon={<FaNoteSticky />}
                  label="Weight"
                  type="number"
                  value={UpdatedPayload.weight}
                  onChange={handleUpdatedPayload}
                  id="weight"
                />
                <Input
                  isDisabled={true}
                  leftIcon={<FaNoteSticky />}
                  label="Blood Pressure Systolic"
                  type="number"
                  value={UpdatedPayload.bloodpressuresystolic}
                  onChange={handleUpdatedPayload}
                  id="bloodpressuresystolic"
                />
                <Input
                  isDisabled={true}
                  leftIcon={<FaNoteSticky />}
                  label="Parity"
                  type="text"
                  value={UpdatedPayload.parity}
                  onChange={handleUpdatedPayload}
                  id="parity"
                />

                <Select
                  isDisabled={true}
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    UpdatedPayload.counsellingonfamilyplanning !== ""
                      ? "16px"
                      : "13px"
                  }
                  borderColor="#6B7280"
                  id="counsellingonfamilyplanning"
                  value={UpdatedPayload.counsellingonfamilyplanning}
                  onChange={handleUpdatedPayload}
                  placeholder="Counselling on Family Planning"
                >
                  {Settings?.familyplanningyesnooption?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
                <Select
                  isDisabled={true}
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    UpdatedPayload.counsellingonpostpartumfamilyplanning !== ""
                      ? "16px"
                      : "13px"
                  }
                  borderColor="#6B7280"
                  id="counsellingonpostpartumfamilyplanning"
                  value={UpdatedPayload.counsellingonpostpartumfamilyplanning}
                  onChange={handleUpdatedPayload}
                  placeholder="Counselling on Postpartum Family Planning"
                >
                  {Settings?.familyplanningyesnooption?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
                <Select
                  isDisabled={true}
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    UpdatedPayload.firsttimemodernfamilyplanninguser !== ""
                      ? "16px"
                      : "13px"
                  }
                  borderColor="#6B7280"
                  id="firsttimemodernfamilyplanninguser"
                  value={UpdatedPayload.firsttimemodernfamilyplanninguser}
                  onChange={handleUpdatedPayload}
                  placeholder="First Time Modern Family Planning User"
                >
                  {Settings?.familyplanningyesnooption?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
                <Select
                  isDisabled={true}
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    UpdatedPayload.emergencycontraception !== ""
                      ? "16px"
                      : "13px"
                  }
                  borderColor="#6B7280"
                  id="emergencycontraception"
                  value={UpdatedPayload.emergencycontraception}
                  onChange={handleUpdatedPayload}
                  placeholder="Emergency Contraception"
                >
                  {Settings?.familyplanningyesnooption?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
                <Select
                  isDisabled={true}
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    UpdatedPayload.typeoffamilyplanningclient !== ""
                      ? "16px"
                      : "13px"
                  }
                  borderColor="#6B7280"
                  id="typeoffamilyplanningclient"
                  value={UpdatedPayload.typeoffamilyplanningclient}
                  onChange={handleUpdatedPayload}
                  placeholder="Type of Family Planning Client"
                >
                  {Settings?.typeoffamilyplanningclient?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Oral Pills:
              </Text>

              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Input
                  isDisabled={true}
                  leftIcon={<FaNoteSticky />}
                  label="Oral Pills Name"
                  type="text"
                  value={UpdatedPayload.oralpillsname}
                  onChange={handleUpdatedPayload}
                  id="oralpillsname"
                />
                <Input
                  isDisabled={true}
                  leftIcon={<FaNoteSticky />}
                  label="Oral Pills Quantity"
                  type="text"
                  value={UpdatedPayload.orapillsquantity}
                  onChange={handleUpdatedPayload}
                  id="orapillsquantity"
                />
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Tick As Appropriate:
              </Text>
              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Checkbox
                  isDisabled={true}
                  colorScheme="orange"
                  isChecked={oldPayload?.oralnewacceptor === "Yes"}
                >
                  <Text textTransform="capitalize">New Acceptor</Text>
                </Checkbox>
                <Checkbox
                  isDisabled={true}
                  colorScheme="orange"
                  isChecked={oldPayload?.oralrevisit === "Yes"}
                >
                  <Text textTransform="capitalize">Revisit</Text>
                </Checkbox>
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Injectable:
              </Text>

              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Select
                  isDisabled={true}
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    UpdatedPayload.nameofinjectable !== "" ? "16px" : "13px"
                  }
                  borderColor="#6B7280"
                  id="nameofinjectable"
                  value={UpdatedPayload.nameofinjectable}
                  onChange={handleUpdatedPayload}
                  placeholder="Name Of Injectable"
                >
                  {Settings?.nameofinjectable?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
                <Input
                  isDisabled={true}
                  leftIcon={<FaNoteSticky />}
                  label="Injectable Quantity"
                  type="number"
                  value={UpdatedPayload.injectablequantity}
                  onChange={handleUpdatedPayload}
                  id="injectablequantity"
                />
                <Input
                  isDisabled={true}
                  leftIcon={<FaNoteSticky />}
                  label="Self Injection"
                  type="text"
                  value={UpdatedPayload.selfinjection}
                  onChange={handleUpdatedPayload}
                  id="selfinjection"
                />
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Tick As Appropriate:
              </Text>
              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Checkbox
                  isDisabled={true}
                  colorScheme="orange"
                  isChecked={oldPayload?.injectableacceptor === "Yes"}
                >
                  <Text textTransform="capitalize">New Acceptor</Text>
                </Checkbox>
                <Checkbox
                  isDisabled={true}
                  colorScheme="orange"
                  isChecked={oldPayload?.injectablerevisit === "Yes"}
                >
                  <Text textTransform="capitalize">Revisit</Text>
                </Checkbox>
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Intra-Uterine Device (IUD) :
              </Text>

              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 1, lg: 1 }}
                spacing={5}
              >
                <Select
                  isDisabled={true}
                  h="45px"
                  borderWidth="2px"
                  fontSize={UpdatedPayload.typeofiud !== "" ? "16px" : "13px"}
                  borderColor="#6B7280"
                  id="typeofiud"
                  value={UpdatedPayload.typeofiud}
                  onChange={handleUpdatedPayload}
                  placeholder="Type Of IUD"
                >
                  {Settings?.typeofiud?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                IN (Tick As Appropriate):
              </Text>
              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Checkbox
                  isDisabled={true}
                  colorScheme="orange"
                  isChecked={oldPayload?.iudinnewacceptor === "Yes"}
                >
                  <Text textTransform="capitalize">New Acceptor</Text>
                </Checkbox>
                <Checkbox
                  isDisabled={true}
                  colorScheme="orange"
                  isChecked={oldPayload?.iudinrevisit === "Yes"}
                >
                  <Text textTransform="capitalize">Revisit</Text>
                </Checkbox>
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                OUT (Tick As Appropriate):
              </Text>
              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Checkbox
                  isDisabled={true}
                  colorScheme="orange"
                  isChecked={oldPayload?.iudoutnewacceptor === "Yes"}
                >
                  <Text textTransform="capitalize">New Acceptor</Text>
                </Checkbox>
                <Checkbox
                  isDisabled={true}
                  colorScheme="orange"
                  isChecked={oldPayload?.iudoutrevisit === "Yes"}
                >
                  <Text textTransform="capitalize">Revisit</Text>
                </Checkbox>
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Tick As Appropriate:
              </Text>
              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Checkbox
                  isDisabled={true}
                  colorScheme="orange"
                  isChecked={oldPayload?.barriernewacceptor === "Yes"}
                >
                  <Text textTransform="capitalize">New Acceptor</Text>
                </Checkbox>
                <Checkbox
                  isDisabled={true}
                  colorScheme="orange"
                  isChecked={oldPayload?.barrierrevisit === "Yes"}
                >
                  <Text textTransform="capitalize">Revisit</Text>
                </Checkbox>
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Tick As Appropriate:
              </Text>
              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Checkbox
                  isDisabled={true}
                  colorScheme="orange"
                  onChange={handleUpdatedCheckBoxChange}
                  isChecked={UpdatedCheckedItems.barriernewacceptor}
                  value="barriernewacceptor"
                >
                  <Text textTransform="capitalize"> New Acceptor</Text>
                </Checkbox>
                <Checkbox
                  isDisabled={true}
                  colorScheme="orange"
                  onChange={handleUpdatedCheckBoxChange}
                  isChecked={UpdatedCheckedItems.barrierrevisit}
                  value="barrierrevisit"
                >
                  <Text textTransform="capitalize"> Revisit</Text>
                </Checkbox>
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Implants :
              </Text>

              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 1, lg: 1 }}
                spacing={5}
              >
                <Select
                  isDisabled={true}
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    UpdatedPayload.typeofimplants !== "" ? "16px" : "13px"
                  }
                  borderColor="#6B7280"
                  id="typeofimplants"
                  value={UpdatedPayload.typeofimplants}
                  onChange={handleUpdatedPayload}
                  placeholder="Implant"
                >
                  {Settings?.typeofimplants?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                IN (Tick As Appropriate):
              </Text>
              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Checkbox
                  isDisabled={true}
                  colorScheme="orange"
                  isChecked={oldPayload?.implantsinnewacceptor === "Yes"}
                >
                  <Text textTransform="capitalize">New Acceptor</Text>
                </Checkbox>
                <Checkbox
                  isDisabled={true}
                  colorScheme="orange"
                  isChecked={oldPayload?.implantsinrevisit === "Yes"}
                >
                  <Text textTransform="capitalize">Revisit</Text>
                </Checkbox>
              </SimpleGrid>
              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                OUT (Tick As Appropriate):
              </Text>
              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Checkbox
                  isDisabled={true}
                  colorScheme="orange"
                  isChecked={oldPayload?.implantsoutnewacceptor === "Yes"}
                >
                  <Text textTransform="capitalize">New Acceptor</Text>
                </Checkbox>
                <Checkbox
                  isDisabled={true}
                  colorScheme="orange"
                  isChecked={oldPayload?.implantsoutrevisit === "Yes"}
                >
                  <Text textTransform="capitalize">Revisit</Text>
                </Checkbox>
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Voluntary Sterilization :
              </Text>

              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 1, lg: 1 }}
                spacing={5}
              >
                <Select
                  isDisabled={true}
                  h="45px"
                  borderWidth="2px"
                  fontSize={
                    UpdatedPayload.voluntorysterilization !== ""
                      ? "16px"
                      : "13px"
                  }
                  borderColor="#6B7280"
                  id="voluntorysterilization"
                  value={UpdatedPayload.voluntorysterilization}
                  onChange={handleUpdatedPayload}
                  placeholder="Type Of IUD"
                >
                  {Settings?.voluntorysterilization?.map((item, i) => (
                    <option value={`${item}`} key={i}>
                      {item}
                    </option>
                  ))}
                </Select>
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Natural Methods (Tick As Appropriate):
              </Text>
              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Checkbox
                  isDisabled={true}
                  colorScheme="orange"
                  isChecked={
                    oldPayload?.naturalemthodsnewacceptorforcyclebeads === "Yes"
                  }
                >
                  <Text>New Acceptor for Cycle Beads (NA)</Text>
                </Checkbox>
                <Checkbox
                  isDisabled={true}
                  colorScheme="orange"
                  isChecked={
                    oldPayload?.naturalemthodsrevisitforcyclebeads === "Yes"
                  }
                >
                  <Text>Revisit (RV) for Cycle Beads</Text>
                </Checkbox>
                <Checkbox
                  isDisabled={true}
                  colorScheme="orange"
                  isChecked={
                    oldPayload?.naturalemthodsnewacceptorforothers === "Yes"
                  }
                >
                  <Text>New Acceptor for Others (NA)</Text>
                </Checkbox>
                <Checkbox
                  isDisabled={true}
                  colorScheme="orange"
                  isChecked={
                    oldPayload?.naturalemthodsrevisitforothers === "Yes"
                  }
                >
                  <Text>Revisit (RV) for Others</Text>
                </Checkbox>
              </SimpleGrid>

              <Text fontSize="15px" fontWeight={"700"} color="blue.blue500">
                Referred (Tick As Appropriate):
              </Text>
              <SimpleGrid
                mt="12px"
                mb="5"
                columns={{ base: 1, md: 2, lg: 2 }}
                spacing={5}
              >
                <Checkbox
                  isDisabled={true}
                  colorScheme="orange"
                  isChecked={oldPayload?.referredoralpills === "Yes"}
                >
                  <Text>Oral Pills (OP)</Text>
                </Checkbox>
                <Checkbox
                  isDisabled={true}
                  colorScheme="orange"
                  isChecked={oldPayload?.referredinjectable === "Yes"}
                >
                  <Text>Injectable (IJ)</Text>
                </Checkbox>
                <Checkbox
                  isDisabled={true}
                  colorScheme="orange"
                  isChecked={oldPayload?.referredip === "Yes"}
                >
                  <Text>IP</Text>
                </Checkbox>
                <Checkbox
                  isDisabled={true}
                  colorScheme="orange"
                  isChecked={oldPayload?.referredintrauterinedevice === "Yes"}
                >
                  <Text>Intra-Uterine Device (IUD)</Text>
                </Checkbox>
                <Checkbox
                  isDisabled={true}
                  colorScheme="orange"
                  isChecked={oldPayload?.referredsurgicalreferred === "Yes"}
                >
                  <Text>Surgical Referred (STER)</Text>
                </Checkbox>
                <Checkbox
                  isDisabled={true}
                  colorScheme="orange"
                  isChecked={oldPayload?.referredmedicalreferred === "Yes"}
                >
                  <Text>Medical Referral (MR)</Text>
                </Checkbox>
              </SimpleGrid>

              <Button mt="32px" isDisabled={true} >
                Proceed
              </Button>
            </>
          )}
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
