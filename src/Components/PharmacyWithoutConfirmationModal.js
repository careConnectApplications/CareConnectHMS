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
      drug: "",
      drugOptions: [],
      frequency: "",
      duration: "",
      dosage: "",
      qty: "",
      drugSearch: "",
      price: null,
    },
  ]);

  const patientSelectRef = useRef(null);

  // Load clinics & settings when modal opens
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

  // Search patients
  const handleSearchPatient = async () => {
    setIsLoadingPatients(true);
    try {
      const res = await SearchPatientApi(searchMRN);
      setPatients(res?.queryresult?.patientdetails || []);
    } catch (err) {
      console.error("Patient search error:", err);
      setPatients([]);
    } finally {
      setIsLoadingPatients(false);
    }
  };
  const handlePatientChange = (e) => {
    const id = e.target.value;
    setFormData({ patient: id, patientId: id });
  };

  // Handle product changes & price lookup
  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;

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
          .catch((err) => {
            console.error("Stock fetch error:", err);
            newProducts[index].drugOptions = [];
            setProducts(newProducts);
          });
      } else {
        setProducts(newProducts);
      }
      return;
    }

    if (field === "drug" || field === "qty") {
      newProducts[index].price = null;
      setProducts(newProducts);
      const { pharmacy, drug, qty } = newProducts[index];
      if (pharmacy && drug && qty && formData.patientId) {
        const payload = { drug, pharmacy, qty: Number(qty) };
        ReadDrugPriceApi(payload, formData.patientId)
          .then((res) => {
            const updated = [...newProducts];
            updated[index].price = res.queryresult;
            setProducts(updated);
          })
          .catch((err) => console.error(err));
      }
      return;
    }

    setProducts(newProducts);
  };

  // Add / remove products
  const addProduct = () =>
    setProducts((prev) => [
      ...prev,
      {
        pharmacy: "",
        drug: "",
        drugOptions: [],
        frequency: "",
        duration: "",
        dosage: "",
        qty: "",
        drugSearch: "",
        price: null,
      },
    ]);
  const removeProduct = (i) =>
    products.length > 1 && setProducts((prev) => prev.filter((_, idx) => idx !== i));

  const isProductComplete = (p) =>
    p.pharmacy && p.drug && p.frequency && p.duration && p.dosage && p.qty;

  // Submit order
  const handleSubmit = async () => {
    if (!formData.patient) {
      alert("Please select a patient.");
      return;
    }
    if (!products.every(isProductComplete)) {
      alert("Please fill all fields, including quantity.");
      return;
    }
    setIsSubmitting(true);
    const payload = {
      products: products.map(({ pharmacy, drug, frequency, duration, dosage, qty }) => ({
        pharmacy,
        drug,
        frequency,
        duration,
        dosage,
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

  // Close modal: reset patient & other fields, but keep pharmacy & drugOptions
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
          frequency: "",
          duration: "",
          dosage: "",
          qty: "",
          drugSearch: "",
          price: null,
        }))
      );
      setIsSubmitting(false);
      setIsLoadingModal(false);
    }, 200);
  };

  const isFormComplete =
    formData.patient && products.length > 0 && products.every(isProductComplete);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered size="xl" scrollBehavior="inside">
      <ModalOverlay />
      {isLoadingModal ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Preloader />
        </Box>
      ) : (
        <ModalContent maxW={{ base: "90%", md: "70%" }} borderRadius="lg" p={4}>
          <ModalHeader>
            <Text fontSize="lg" fontWeight="bold">Place Order</Text>
            <ModalCloseButton onClick={handleClose} />
          </ModalHeader>
          <ModalBody pb={6} mt={2}>
            {/* Patient Search */}
            <FormControl mb={4}>
              <FormLabel>Search for Patient</FormLabel>
              <Flex mb={2} gap={4}>
                <Input
                  label="Search for Patient"
                  placeholder="MRN, first or last name"
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
                w="100%"
                mt={2}
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
              <Text fontWeight="bold" mb={2}>Medicines</Text>
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
                        onChange={(e) => handleProductChange(idx, "pharmacy", e.target.value)}
                        borderWidth="2px"
                        borderColor="gray.500"
                      >
                        {pharmacies.map((c) => (
                          <option key={c.clinic} value={c.clinic}>{c.clinic}</option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Search Medicine</FormLabel>
                      <Input
                        value={prod.drugSearch}
                        onChange={(e) => handleProductChange(idx, "drugSearch", e.target.value)}
                        placeholder="Type to filter"
                        borderWidth="2px"
                        borderColor="gray.500"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Medicine</FormLabel>
                      <Select
                        placeholder="Select Medicine"
                        value={prod.drug}
                        onChange={(e) => handleProductChange(idx, "drug", e.target.value)}
                        disabled={!prod.pharmacy || !prod.drugOptions.length}
                        borderWidth="2px"
                        borderColor="gray.500"
                      >
                        {prod.drugOptions
                          .filter((d) =>
                            prod.drugSearch
                              ? d.toLowerCase().includes(prod.drugSearch.toLowerCase())
                              : true
                          )
                          .map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Quantity</FormLabel>
                      <Input
                        type="number"
                        value={prod.qty}
                        onChange={(e) => handleProductChange(idx, "qty", e.target.value)}
                        placeholder="Enter Qty"
                        borderWidth="2px"
                        borderColor="gray.500"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Frequency</FormLabel>
                      <Select
                        placeholder="Select Frequency"
                        value={prod.frequency}
                        onChange={(e) => handleProductChange(idx, "frequency", e.target.value)}
                        borderWidth="2px"
                        borderColor="gray.500"
                      >
                        {settings?.medicationchartfrequency?.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Duration</FormLabel>
                      <Input
                        value={prod.duration}
                        onChange={(e) => handleProductChange(idx, "duration", e.target.value)}
                        placeholder="Enter Duration"
                        borderWidth="2px"
                        borderColor="gray.500"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Dosage</FormLabel>
                      <Input
                        value={prod.dosage}
                        onChange={(e) => handleProductChange(idx, "dosage", e.target.value)}
                        placeholder="Enter Dosage"
                        borderWidth="2px"
                        borderColor="gray.500"
                      />
                    </FormControl>
                    {prod.price != null && (
                      <Box gridColumn="1 / -1">
                        <Text fontWeight="semibold" color="blue.blue500">
                          Price for {prod.drug} (Qty: {prod.qty}): ₦{prod.price}
                        </Text>
                      </Box>
                    )}
                  </SimpleGrid>
                </Box>
              ))}
              <Button onClick={addProduct} mt={2} w="150px" rightIcon={<SlPlus />}>
                Add Medicine
              </Button>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              mt="32px"
              onClick={handleSubmit}
              disabled={!isFormComplete || isSubmitting}
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
