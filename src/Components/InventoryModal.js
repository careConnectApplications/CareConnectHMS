import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  SimpleGrid,
  Text,
  FormControl,
  Box,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import { FaCalendarAlt, FaSortNumericDown } from "react-icons/fa";
import { FaNairaSign } from "react-icons/fa6";
import Input from "./Input";
import Button from "./Button";
import Preloader from "./Preloader";
import {
  AddStockApi,
  UpdateStockApi,
  SettingsApi,
  GetAllClinicApi,
} from "../Utils/ApiCalls";

export default function InventoryModal({
  isOpen,
  onClose,
  type,
  selectedInventory,
  onSuccess,
}) {
  const initialFormState = {
    productid: "",
    category: "",
    expirationdate: "",
    qty: "",
    amount: "",
    servicetype: "",
    lowstocklevel: "",
    lastrestockdate: "",
    pharmacy: "",
  };

  const [inventoryData, setInventoryData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  const [pharmacyCategories, setPharmacyCategories] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);

  // Fetch settings and pharmacy clinics when the modal is open.
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await SettingsApi();
        setPharmacyCategories(settings.pharmacycategory || []);
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    const fetchPharmacies = async () => {
      try {
        const result = await GetAllClinicApi();
        if (result?.queryresult?.clinicdetails) {
          setPharmacies(result.queryresult.clinicdetails);
        }
      } catch (error) {
        console.error("Error fetching pharmacies:", error);
      }
    };

    if (isOpen) {
      setLoading(true);
      fetchSettings();
      fetchPharmacies();
      const timer = setTimeout(() => {
        if (type === "edit" && selectedInventory) {
          setInventoryData({
            productid: selectedInventory.productid || "",
            category: selectedInventory.category || "",
            expirationdate: selectedInventory.expirationDate || "",
            qty: selectedInventory.quantity || "",
            amount: selectedInventory.amount || "",
            servicetype: selectedInventory.serviceType || "",
            lowstocklevel: selectedInventory.lowStockLevel || "",
            lastrestockdate: selectedInventory.lastRestockDate || "",
            pharmacy: selectedInventory.pharmacy || "",
          });
        } else {
          setInventoryData(initialFormState);
        }
        setLoading(false);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [isOpen, type, selectedInventory]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInventoryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (Object.values(inventoryData).some((field) => !field)) {
      setMessage("All fields are required.");
      setMessageStatus("error");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (type === "new") {
        response = await AddStockApi(inventoryData);
      } else if (type === "edit" && selectedInventory) {
        response = await UpdateStockApi(inventoryData, selectedInventory.id);
      }

      const successMessage = response.data.message || "Operation successful!";
      setMessage(successMessage);
      setMessageStatus("success");

      onSuccess(successMessage);
      setInventoryData(initialFormState);
      onClose();
    } catch (error) {
      setMessage(error.message || "An error occurred.");
      setMessageStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseWithLoader = () => {
    setLoading(true);
    setTimeout(() => {
      setInventoryData(initialFormState);
      setMessage("");
      setMessageStatus("");
      setLoading(false);
      onClose();
    }, 200);
  };

  const isFormComplete = Object.values(inventoryData).every(
    (field) => field !== ""
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseWithLoader}
      isCentered
      size="lg"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <Preloader />
        </Box>
      ) : (
        <ModalContent
          maxW={{ base: "90%", md: "50%" }}
          maxH={{ base: "95vh", md: "85vh" }}
          borderRadius="lg"
          p={4}
        >
          <ModalHeader>
            <Text fontSize="lg" fontWeight="bold">
              {type === "new" ? "Add New Inventory" : "Edit Inventory"}
            </Text>
            <ModalCloseButton onClick={handleCloseWithLoader} />
          </ModalHeader>

          <ModalBody pb={6} mt={2}>
            {/* Product ID */}
            <Input
              id="productid"
              label="Product ID"
              name="productid"
              value={inventoryData.productid}
              onChange={handleInputChange}
              placeholder="Enter Product ID"
            />

            {/* Pharmacy Selection */}
            <FormControl mb={4}>
              <FormLabel>Pharmacy</FormLabel>
              <Select
                name="pharmacy"
                value={inventoryData.pharmacy}
                onChange={handleInputChange}
                placeholder="Select Pharmacy"
                border="2px solid"
                borderColor="gray.500"
              >
                {pharmacies
                  .filter((item) => item.type === "pharmacy")
                  .map((item, index) => (
                    <option key={index} value={item.clinic}>
                      {item.clinic}
                    </option>
                  ))}
              </Select>
            </FormControl>

            {/* Quantity and Amount */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Input
                id="qty"
                label="Quantity"
                value={inventoryData.qty}
                onChange={handleInputChange}
                name="qty"
                type="number"
                placeholder="Enter Quantity"
                leftIcon={<FaSortNumericDown />}
              />
              <Input
                id="amount"
                label="Amount"
                value={inventoryData.amount}
                onChange={handleInputChange}
                name="amount"
                type="number"
                placeholder="Enter Amount"
                leftIcon={<FaNairaSign />}
              />
            </SimpleGrid>

            {/* Low Stock Level and Last Restock Date */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={4}>
              <Input
                id="lowstocklevel"
                label="Low Stock Level"
                value={inventoryData.lowstocklevel}
                onChange={handleInputChange}
                name="lowstocklevel"
                type="number"
                placeholder="Enter Low Stock Level"
              />
              <Input
                id="lastrestockdate"
                label="Last Restock Date"
                value={inventoryData.lastrestockdate}
                onChange={handleInputChange}
                name="lastrestockdate"
                type="date"
              />
            </SimpleGrid>

            {/* Service Type and Inventory Category */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={4}>
              <Input
                id="servicetype"
                label="Service Type"
                value={inventoryData.servicetype}
                onChange={handleInputChange}
                name="servicetype"
                type="text"
                placeholder="Enter Service Type"
              />
              <FormControl>
                <Select
                  name="category"
                  value={inventoryData.category}
                  onChange={handleInputChange}
                  placeholder="Select Inventory Category"
                  border="2px solid"
                  borderColor="gray.500"
                >
                  {pharmacyCategories.map((category, index) => (
                    <option value={category} key={index}>
                      {category}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </SimpleGrid>

            {/* Expiration Date */}
            <SimpleGrid columns={1} spacing={4} mt={4}>
              <Input
                id="expirationdate"
                label="Expiration Date"
                value={inventoryData.expirationdate}
                onChange={handleInputChange}
                name="expirationdate"
                type="date"
                leftIcon={<FaCalendarAlt />}
              />
            </SimpleGrid>

            <Button
              mt="32px"
              onClick={handleSubmit}
              disabled={!isFormComplete || loading}
            >
              {type === "new" ? "Add Inventory" : "Update Inventory"}
            </Button>

            {message && (
              <Box
                mt={4}
                p={4}
                borderRadius="md"
                color={messageStatus === "success" ? "green.600" : "red.600"}
                borderWidth={1}
                borderColor={
                  messageStatus === "success" ? "green.400" : "red.400"
                }
                bg={messageStatus === "success" ? "green.50" : "red.50"}
              >
                <Text>{message}</Text>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      )}
    </Modal>
  );
}
