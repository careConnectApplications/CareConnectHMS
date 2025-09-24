import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Text,
  FormControl,
  FormLabel,
  Select,
  Box,
  Flex,
  SimpleGrid,
  Input as ChakraInput,
  Stack,
} from "@chakra-ui/react";
import Input from "./Input";
import Button from "./Button";
import Preloader from "./Preloader";
import { MdClose, MdNote } from "react-icons/md";
import { SlPlus } from "react-icons/sl";
import { IoIosCloseCircle } from "react-icons/io";
import {
  PlaceOrderApi,
  GetAllClinicApi,
  SettingsApi,
  GetPharmarcystockbyname,
} from "../Utils/ApiCalls";

export default function CreatePrescriptionModal({
  isOpen,
  onClose,
  onSuccess,
  oldPayload,
}) {
  // Loading state for data fetching and submission
  const [isLoading, setIsLoading] = useState(false);
  // Pharmacies for the pharmacy dropdown
  const [pharmacies, setPharmacies] = useState([]);
  // Settings for dropdown (frequency)
  const [settings, setSettings] = useState({});
  // Products array – each product now contains pharmacy, drug, frequency, duration, dosage, doctorsNotes (array), doctorsNoteInput, drugOptions, and drugSearch
  const [products, setProducts] = useState([
    {
      pharmacy: "",
      drug: "",
      frequency: "",
      duration: "",
      dosage: "",
      doctorsNotes: [], // Array for storing multiple notes
      doctorsNoteInput: "", // Input field for adding new notes
      drugOptions: [],
      drugSearch: "",
    },
  ]);

  // Initialize form when modal opens or oldPayload changes
  useEffect(() => {
    if (isOpen) {
      // If oldPayload has existing products, prefill them
      if (oldPayload?.products && Array.isArray(oldPayload.products)) {
        setProducts(
          oldPayload.products.map((product) => ({
            ...product,
            // Convert existing doctorsnote string to array, or use existing array
            doctorsNotes: product.doctorsnote
              ? [product.doctorsnote]
              : product.doctorsNotes && Array.isArray(product.doctorsNotes)
              ? product.doctorsNotes
              : [],
            doctorsNoteInput: "", // Initialize input field
            drugOptions: [], // Will be fetched when pharmacy is selected
            drugSearch: "",
          }))
        );
      } else {
        setProducts([
          {
            pharmacy: "",
            drug: "",
            frequency: "",
            duration: "",
            dosage: "",
            doctorsNotes: [],
            doctorsNoteInput: "",
            drugOptions: [],
            drugSearch: "",
          },
        ]);
      }

      setIsLoading(true);
      const fetchData = async () => {
        try {
          // Fetch pharmacies (clinics of type "pharmacy")
          const clinicResult = await GetAllClinicApi();
          if (clinicResult?.queryresult?.clinicdetails) {
            setPharmacies(
              clinicResult.queryresult.clinicdetails.filter(
                (item) => item.type === "pharmacy"
              )
            );
          }
          // Fetch settings for frequency dropdown
          const settingsData = await SettingsApi();
          setSettings(settingsData);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen, oldPayload]);

  // Handle changes for each product row
  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;

    // When a pharmacy is selected, fetch its available drugs (medicine)
    if (field === "pharmacy") {
      // Reset the current medicine selection and clear the search field.
      newProducts[index]["drug"] = "";
      newProducts[index]["drugSearch"] = "";
      if (value) {
        GetPharmarcystockbyname(value)
          .then((data) => {
            const pricedetails = data?.queryresult?.pricedetails;
            if (Array.isArray(pricedetails)) {
              const uniqueServiceTypes = [
                ...new Set(pricedetails.map((item) => item.servicetype)),
              ];
              newProducts[index]["drugOptions"] = uniqueServiceTypes;
            } else {
              newProducts[index]["drugOptions"] = [];
            }
            setProducts(newProducts);
          })
          .catch((error) => {
            console.error("Error fetching pharmacy stock:", error);
            newProducts[index]["drugOptions"] = [];
            setProducts(newProducts);
          });
      } else {
        setProducts(newProducts);
      }
    } else {
      setProducts(newProducts);
    }
  };

  // Add a doctors note to a specific product
  const addDoctorsNote = (index) => {
    if (!products[index].doctorsNoteInput.trim()) return;

    const newProducts = [...products];
    newProducts[index].doctorsNotes = [
      ...newProducts[index].doctorsNotes,
      newProducts[index].doctorsNoteInput.trim(),
    ];
    newProducts[index].doctorsNoteInput = ""; // Clear input after adding
    setProducts(newProducts);
  };

  // Remove a doctors note from a specific product
  const removeDoctorsNote = (index, noteIndex) => {
    const newProducts = [...products];
    newProducts[index].doctorsNotes = newProducts[index].doctorsNotes.filter(
      (_, i) => i !== noteIndex
    );
    setProducts(newProducts);
  };

  // Add a new product row, preserving the previous product's pharmacy and drug options
  const addProduct = () => {
    setProducts((prev) => [
      ...prev,
      {
        pharmacy: prev.length > 0 ? prev[prev.length - 1].pharmacy : "",
        drug: "",
        frequency: "",
        duration: "",
        dosage: "",
        doctorsNotes: [],
        doctorsNoteInput: "",
        drugOptions: prev.length > 0 ? prev[prev.length - 1].drugOptions : [],
        drugSearch: "",
      },
    ]);
  };

  // Remove a product row (ensuring at least one remains)
  const removeProduct = (index) => {
    if (products.length === 1) return;
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  // Validate that pharmacy and medicine are optional, but other fields are required
  const isProductComplete = (product) => {
    const requiredFields = ["frequency", "duration", "dosage"];

    return requiredFields.every(
      (field) => product[field] && product[field].toString().trim() !== ""
    );

    // Pharmacy and drug are optional, so we don't validate them
  };

  // Check if at least one product has either pharmacy or drug filled (optional validation)
  const hasAtLeastOneProductWithDetails = () => {
    return products.some(
      (product) => product.pharmacy.trim() !== "" || product.drug.trim() !== ""
    );
  };

  // Handle form submission with toast notifications for success/failure
  const handleSubmit = async () => {
    const patientId = localStorage.getItem("patientId");
    if (!patientId) {
      if (onSuccess) {
        onSuccess("Patient ID not found.", "error");
      }
      return;
    }

    if (products.length === 0 || !products.every(isProductComplete)) {
      if (onSuccess) {
        onSuccess(
          "Please fill frequency, duration, and dosage for each product.",
          "error"
        );
      }
      return;
    }

    // Optional: Add warning if no pharmacy/drug is specified, but still allow submission
    if (!hasAtLeastOneProductWithDetails()) {
      // You can show a warning or just proceed - here we'll proceed with a warning
      console.warn(
        "No pharmacy or medicine specified - submitting with only prescription details"
      );
    }

    // Build payload with products (sending doctorsNotes array as doctorsnote to API)
    const payload = {
      products: products.map((product) => ({
        pharmacy: product.pharmacy || "", // Send empty string if not provided
        drug: product.drug || "", // Send empty string if not provided
        frequency: product.frequency,
        duration: product.duration,
        dosage: product.dosage,
        doctorsnote: product.doctorsNotes, // Send array as doctorsnote (singular) to API
      })),
    };

    if (oldPayload?.id) {
      payload.appointmentid = oldPayload.id;
    }

    // If editing an existing order, include the order ID
    if (oldPayload?.orderId) {
      payload.orderId = oldPayload.orderId;
    }

    try {
      const response = await PlaceOrderApi(payload, patientId);
      if (onSuccess) {
        onSuccess(
          oldPayload?.orderId
            ? "Order updated successfully."
            : "Order placed successfully.",
          "success"
        );
      }
      onClose();
      // Reset the form
      setProducts([
        {
          pharmacy: "",
          drug: "",
          frequency: "",
          duration: "",
          dosage: "",
          doctorsNotes: [],
          doctorsNoteInput: "",
          drugOptions: [],
          drugSearch: "",
        },
      ]);
    } catch (error) {
      console.error("Error placing order:", error);
      if (onSuccess) {
        onSuccess(
          error.message || "An error occurred while placing the order.",
          "error"
        );
      }
    }
  };

  // Reset form on modal close (with a brief loader)
  const handleCloseWithLoader = () => {
    setIsLoading(true);
    setTimeout(() => {
      onClose();
      setProducts([
        {
          pharmacy: "",
          drug: "",
          frequency: "",
          duration: "",
          dosage: "",
          doctorsNotes: [],
          doctorsNoteInput: "",
          drugOptions: [],
          drugSearch: "",
        },
      ]);
      setIsLoading(false);
    }, 200);
  };

  const isFormComplete =
    products.length > 0 && products.every(isProductComplete);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseWithLoader}
      isCentered
      size="xl"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <Preloader />
        </Box>
      ) : (
        <ModalContent maxW={{ base: "90%", md: "70%" }} borderRadius="lg" p={4}>
          <ModalHeader>
            <Text fontSize="lg" fontWeight="bold">
              {oldPayload?.orderId ? "Edit Order" : "Place Order"}
            </Text>
            <ModalCloseButton onClick={handleCloseWithLoader} />
          </ModalHeader>
          <ModalBody pb={6} mt={2}>
            {/* Dynamic Product Forms */}
            <Box mb={4}>
              <Text fontWeight="bold" mb={2}>
                Medicine Order
              </Text>


              {products.map((product, index) => (
                <Box
                  key={index}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  mb={4}
                  position="relative"
                >
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    mb={4}
                  >
                    <Text fontWeight="bold">Medicine {index + 1}</Text>
                    {products.length > 1 && (
                      <Box
                        cursor="pointer"
                        onClick={() => removeProduct(index)}
                      >
                        <MdClose size={20} />
                      </Box>
                    )}
                  </Flex>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {/* Pharmacy - Optional */}
                    <FormControl>
                      <FormLabel>Pharmacy</FormLabel>
                      <Select
                        placeholder="Select Pharmacy"
                        value={product.pharmacy}
                        onChange={(e) =>
                          handleProductChange(index, "pharmacy", e.target.value)
                        }
                        border="2px solid"
                        borderColor="gray.500"
                      >
                        {pharmacies.map((item, idx) => (
                          <option key={idx} value={item.clinic}>
                            {item.clinic}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Medicine Search - Optional */}
                    <FormControl>
                      <FormLabel>Search Medicine </FormLabel>
                      <Input
                        value={product.drugSearch}
                        onChange={(e) =>
                          handleProductChange(
                            index,
                            "drugSearch",
                            e.target.value
                          )
                        }
                        placeholder="Type to filter medicines "
                        border="2px solid"
                        borderColor="gray.500"
                      />
                    </FormControl>

                    {/* Medicine Dropdown - Optional */}
                    <FormControl>
                      <FormLabel>Medicine</FormLabel>
                      <Select
                        placeholder="Select Medicine"
                        value={product.drug}
                        onChange={(e) =>
                          handleProductChange(index, "drug", e.target.value)
                        }
                        border="2px solid"
                        borderColor="gray.500"
                        disabled={!product.pharmacy} // Only enable if pharmacy is selected
                      >
                        <option value="">No specific medicine</option>
                        {product.drugOptions
                          .filter((type) => {
                            // If no search text is entered, show all options.
                            if (!product.drugSearch) return true;
                            return type
                              .toLowerCase()
                              .includes(product.drugSearch.toLowerCase());
                          })
                          .map((type, idx) => (
                            <option key={idx} value={type}>
                              {type}
                            </option>
                          ))}
                      </Select>
                    </FormControl>

                    {/* Frequency - Required */}
                    <FormControl isRequired>
                      <FormLabel>Frequency </FormLabel>
                      <Select
                        placeholder="Select Frequency *"
                        value={product.frequency}
                        onChange={(e) =>
                          handleProductChange(
                            index,
                            "frequency",
                            e.target.value
                          )
                        }
                        border="2px solid"
                        borderColor="gray.500"
                        required
                      >
                        {settings?.medicationchartfrequency?.map(
                          (option, idx) => (
                            <option key={idx} value={option}>
                              {option}
                            </option>
                          )
                        )}
                      </Select>
                    </FormControl>

                    {/* Duration - Required */}
                    <FormControl isRequired>
                      <FormLabel>Duration </FormLabel>
                      <Input
                        value={product.duration}
                        onChange={(e) =>
                          handleProductChange(index, "duration", e.target.value)
                        }
                        placeholder="Enter Duration *"
                        border="2px solid"
                        borderColor="gray.500"
                        required
                      />
                    </FormControl>

                    {/* Dosage - Required */}
                    <FormControl isRequired>
                      <FormLabel>Dosage </FormLabel>
                      <Input
                        value={product.dosage}
                        onChange={(e) =>
                          handleProductChange(index, "dosage", e.target.value)
                        }
                        placeholder="Enter Dosage *"
                        border="2px solid"
                        borderColor="gray.500"
                        required
                      />
                    </FormControl>
                  </SimpleGrid>

                  {/* Doctor's Notes for this specific medicine - Optional */}
                  <FormControl mt={4}>
                    <FormLabel>Doctor's Notes </FormLabel>
                    <Stack spacing={3}>
                      {/* Input for adding new notes */}
                      <Flex direction={{ base: "column", md: "row" }} gap={2}>
                        <ChakraInput
                          value={product.doctorsNoteInput}
                          onChange={(e) =>
                            handleProductChange(
                              index,
                              "doctorsNoteInput",
                              e.target.value
                            )
                          }
                          placeholder="Enter a note"
                          border="2px solid"
                          borderColor="gray.500"
                          flex="1"
                          leftIcon={<MdNote color="blue.500" />}
                        />
                        <Button
                          onClick={() => addDoctorsNote(index)}
                          w={{ base: "100%", md: "150px" }}
                          rightIcon={<SlPlus />}
                          disabled={!product.doctorsNoteInput.trim()}
                        >
                          Add Note
                        </Button>
                      </Flex>

                      {/* Display existing notes as chips */}
                      {product.doctorsNotes.length > 0 && (
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                          {product.doctorsNotes.map((note, noteIndex) => (
                            <Flex
                              key={noteIndex}
                              cursor="pointer"
                              px="10px"
                              py="8px"
                              rounded="md"
                              bg="blue.500"
                              color="white"
                              fontSize="sm"
                              _hover={{ bg: "blue.400" }}
                              alignItems="center"
                              justifyContent="space-between"
                            >
                              <Text fontWeight="medium" flex="1" mr={2}>
                                {note}
                              </Text>
                              <Box
                                fontSize="lg"
                                onClick={() =>
                                  removeDoctorsNote(index, noteIndex)
                                }
                              >
                                <IoIosCloseCircle />
                              </Box>
                            </Flex>
                          ))}
                        </SimpleGrid>
                      )}
                    </Stack>
                  </FormControl>
                </Box>
              ))}
              <Button
                onClick={addProduct}
                mt={2}
                w="150px"
                rightIcon={<SlPlus />}
              >
                Add Medicine
              </Button>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={handleSubmit}
              disabled={!isFormComplete || isLoading}
              isLoading={isLoading}
            >
              {oldPayload?.orderId ? "Update Order" : "Submit Order"}
            </Button>
          </ModalFooter>
        </ModalContent>
      )}
    </Modal>
  );
}
