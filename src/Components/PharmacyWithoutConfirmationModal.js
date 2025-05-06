import React, { useState, useEffect, useRef } from "react";
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
} from "@chakra-ui/react";
import Input from "./Input";
import Button from "./Button";
import Preloader from "./Preloader";
import { MdClose } from "react-icons/md";
import { SlPlus } from "react-icons/sl";
import { FiSearch } from "react-icons/fi";
import {
  PlaceOrderWithoutConfirmationApi,
  ReadDrugPriceApi,
  GetAllClinicApi,
  SettingsApi,
  SearchPatientApi,
  GetPharmarcystockbyname,
} from "../Utils/ApiCalls";

export default function PharmacyWithoutConfirmationModal({
  isOpen,
  onClose,
  onSuccess,
}) {
  const [formData, setFormData] = useState({ patient: "", patientId: "" });
  const [patients, setPatients] = useState([]);
  const [searchMRN, setSearchMRN] = useState("");
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pharmacies, setPharmacies] = useState([]);
  const [settings, setSettings] = useState({});
  const [products, setProducts] = useState([
    {
      pharmacy: "",
      drugSearch: "",
      drug: "",
      drugOptions: [],
      qty: "",
      price: null,
      // frequency: "",
      // duration: "",
      // dosage: "",
    },
  ]);

  const patientSelectRef = useRef(null);

  // Load clinics & settings
  useEffect(() => {
    if (!isOpen) return;
    setIsLoadingModal(true);
    (async () => {
      try {
        const clinicRes = await GetAllClinicApi();
        const clinicDetails = clinicRes?.queryresult?.clinicdetails || [];
        setPharmacies(clinicDetails.filter((c) => c.type === "pharmacy"));
        const settingsRes = await SettingsApi();
        setSettings(settingsRes);
      } catch (err) {
        console.error("Error fetching modal data:", err);
      } finally {
        setIsLoadingModal(false);
      }
    })();
  }, [isOpen]);

  // Search patients by MRN/name
  const handleSearchPatient = async () => {
    setIsLoadingPatients(true);
    try {
      const res = await SearchPatientApi(searchMRN);
      setPatients(res?.queryresult?.patientdetails || []);
    } catch {
      setPatients([]);
    } finally {
      setIsLoadingPatients(false);
    }
  };

  const handlePatientChange = (e) => {
    const id = e.target.value;
    setFormData({ patient: id, patientId: id });
  };

  // Handle product field changes
  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;

    // If pharmacy changes → reload drug options
    if (field === "pharmacy") {
      newProducts[index].drug = "";
      newProducts[index].drugOptions = [];
      newProducts[index].price = null;
      if (value) {
        GetPharmarcystockbyname(value)
          .then((data) => {
            const details = data?.queryresult?.pricedetails || [];
            newProducts[index].drugOptions = [
              ...new Set(details.map((d) => d.servicetype)),
            ];
            setProducts(newProducts);
          })
          .catch(() => {
            newProducts[index].drugOptions = [];
            setProducts(newProducts);
          });
      } else {
        setProducts(newProducts);
      }
      return;
    }

    // If drug or qty changes → fetch price
    if ((field === "drug" || field === "qty") && newProducts[index].pharmacy) {
      newProducts[index].price = null;
      setProducts(newProducts);

      const { pharmacy, drug, qty } = newProducts[index];
      if (pharmacy && drug && qty && formData.patientId) {
        ReadDrugPriceApi(
          { pharmacy, drug, qty: Number(qty) },
          formData.patientId
        )
          .then((res) => {
            const updated = [...newProducts];
            updated[index].price = res.queryresult;
            setProducts(updated);
          })
          .catch(console.error);
      }
      return;
    }

    setProducts(newProducts);
  };

  // Add / remove rows
  const addProduct = () =>
    setProducts((prev) => [
      ...prev,
      {
        pharmacy: "",
        drugSearch: "",
        drug: "",
        drugOptions: [],
        qty: "",
        price: null,
        // frequency: "",
        // duration: "",
        // dosage: "",
      },
    ]);
  const removeProduct = (i) =>
    products.length > 1 &&
    setProducts((prev) => prev.filter((_, idx) => idx !== i));

  // Only require pharmacy, drug, qty now
  const isProductComplete = (p) => p.pharmacy && p.drug && p.qty;

  // Submit
  const handleSubmit = async () => {
    if (!formData.patient) {
      alert("Please select a patient.");
      return;
    }
    if (!products.every(isProductComplete)) {
      alert("Please fill all product fields and quantity.");
      return;
    }
    setIsSubmitting(true);
    const payload = {
      products: products.map(({ pharmacy, drug, qty }) => ({
        pharmacy,
        drug,
        qty: Number(qty),
      })),
    };
    try {
      await PlaceOrderWithoutConfirmationApi(payload, formData.patientId);
      const selected = patients.find((p) => p._id === formData.patient) || {};
      onSuccess("Order placed!", "success", {
        patient: selected,
        products: payload.products,
      });
      handleClose();
    } catch (err) {
      console.error("Submit error:", err);
      alert(err.message || "Error placing order.");
      setIsSubmitting(false);
    }
  };

  // Reset & close
  const handleClose = () => {
    setIsLoadingModal(true);
    setTimeout(() => {
      onClose();
      setFormData({ patient: "", patientId: "" });
      setSearchMRN("");
      setPatients([]);
      setProducts((prev) =>
        prev.map((prod) => ({
          pharmacy: prod.pharmacy,
          drugOptions: prod.drugOptions,
          drug: "",
          qty: "",
          drugSearch: "",
          price: null,
          // frequency: "",
          // duration: "",
          // dosage: "",
        }))
      );
      setIsSubmitting(false);
      setIsLoadingModal(false);
    }, 200);
  };
  // compute grand total of all line‐item prices
  const grandTotal = products.reduce((sum, prod) => sum + (prod.price || 0), 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      isCentered
      size="xl"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      {isLoadingModal ? (
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
              Place Order
            </Text>
            <ModalCloseButton onClick={handleClose} />
          </ModalHeader>

          <ModalBody pb={6} mt={2}>
            {/* Patient Search */}
            <FormControl mb={4}>
              <FormLabel>Search for Patient</FormLabel>
              <Flex mb={2} gap={4}>
                <Input
                  label="MRN, first or last name"
                  placeholder="Type to search"
                  value={searchMRN}
                  onChange={(e) => setSearchMRN(e.target.value)}
                  leftIcon={<FiSearch size={16} />}
                  flex="1"
                />
                <Button onClick={handleSearchPatient} w="165px">
                  Search
                </Button>
              </Flex>
              <Select
                ref={patientSelectRef}
                value={formData.patient}
                onChange={handlePatientChange}
                placeholder={isLoadingPatients ? "Loading…" : "Select Patient"}
                borderWidth="2px"
                borderColor="gray.500"
              >
                {patients.map((p) => (
                  <option key={p._id} value={p._id}>
                    {`${p.firstName} ${p.lastName} (MRN: ${p.MRN})`}
                  </option>
                ))}
              </Select>
            </FormControl>

            {/* Medicines */}
            <Box mb={4}>
              <Text fontWeight="bold" mb={2}>
                Medicines
              </Text>
              {products.map((prod, idx) => (
                <Box key={idx} p={4} borderWidth="1px" borderRadius="md" mb={4}>
                  <Flex justify="space-between" align="center" mb={4}>
                    <Text fontWeight="bold">Medicine {idx + 1}</Text>
                    {products.length > 1 && (
                      <Box cursor="pointer" onClick={() => removeProduct(idx)}>
                        <MdClose size={20} />
                      </Box>
                    )}
                  </Flex>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl>
                      <FormLabel>Pharmacy</FormLabel>
                      <Select
                        placeholder="Select Pharmacy"
                        value={prod.pharmacy}
                        onChange={(e) =>
                          handleProductChange(idx, "pharmacy", e.target.value)
                        }
                        borderWidth="2px"
                        borderColor="gray.500"
                      >
                        {pharmacies.map((c) => (
                          <option key={c.clinic} value={c.clinic}>
                            {c.clinic}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Search Medicine</FormLabel>
                      <Input
                        placeholder="Type to filter"
                        value={prod.drugSearch}
                        onChange={(e) =>
                          handleProductChange(idx, "drugSearch", e.target.value)
                        }
                        borderWidth="2px"
                        borderColor="gray.500"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Medicine</FormLabel>
                      <Select
                        placeholder="Select Medicine"
                        value={prod.drug}
                        onChange={(e) =>
                          handleProductChange(idx, "drug", e.target.value)
                        }
                        disabled={!prod.pharmacy || !prod.drugOptions.length}
                        borderWidth="2px"
                        borderColor="gray.500"
                      >
                        {prod.drugOptions
                          .filter((d) =>
                            prod.drugSearch
                              ? d
                                  .toLowerCase()
                                  .includes(prod.drugSearch.toLowerCase())
                              : true
                          )
                          .map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Quantity</FormLabel>
                      <Input
                        type="number"
                        placeholder="Enter Qty"
                        value={prod.qty}
                        onChange={(e) =>
                          handleProductChange(idx, "qty", e.target.value)
                        }
                        borderWidth="2px"
                        borderColor="gray.500"
                      />
                    </FormControl>

                    {/* Price display */}
                    {prod.price != null && (
                      <Box gridColumn="1 / -1">
                        <Text fontWeight="semibold" color="blue.blue500">
                          Price ({prod.qty}× {prod.drug}): ₦{prod.price}
                        </Text>
                      </Box>
                    )}

                    {/* 
                    // Frequency / Duration / Dosage fields are intentionally commented out
                    <FormControl>
                      <FormLabel>Frequency</FormLabel>
                      <Select placeholder="Select Frequency" value={prod.frequency} onChange={...}>
                        {settings.medicationchartfrequency.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Duration</FormLabel>
                      <Input value={prod.duration} onChange={...} placeholder="Enter Duration" />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Dosage</FormLabel>
                      <Input value={prod.dosage} onChange={...} placeholder="Enter Dosage" />
                    </FormControl>
                    */}
                  </SimpleGrid>
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
              {/* Grand total */}
              <Box mt={4} textAlign="right">
                <Text fontSize="lg" fontWeight="bold" color="blue.blue400">
                  Grand Total: ₦{grandTotal}
                </Text>
              </Box>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              isLoading={isSubmitting}
            >
              Submit Order
            </Button>
          </ModalFooter>
        </ModalContent>
      )}
    </Modal>
  );
}
