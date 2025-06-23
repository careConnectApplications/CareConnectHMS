import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Select,
  Stack,
} from "@chakra-ui/react";
import Input from "./Input";
import Button from "./Button";
import {
  SettingsApi,
  AddPricingModelApi,
  UpdatePricingModelApi,
  GetAllPriceApi,
} from "../Utils/ApiCalls";

export default function CreatePricingModelModal({
  isOpen,
  onClose,
  type, // "new" or "edit"
  oldPayload = {},
  activateNotifications,
}) {
  const [loading, setLoading] = useState(false);
  const [clinics, setClinics] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [pricingTypes, setPricingTypes] = useState([]);
  const initialPayload = {
    pricingtype: "",
    exactnameofancclinic: "",
    exactnameofservicetypeforadult: "",
    exactnameofservicetypeforchild: "",
  };
  const [payload, setPayload] = useState(initialPayload);
  const [updatedPayload, setUpdatedPayload] = useState(initialPayload);

  // Handle form input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    type === "edit"
      ? setUpdatedPayload({ ...updatedPayload, [id]: value })
      : setPayload({ ...payload, [id]: value });
  };

  // Fetch dropdown options on modal open
  const fetchData = async () => {
    try {
      const settings = await SettingsApi();
      const priceData = await GetAllPriceApi();

      // Set pricingtype options from SettingsApi
      setPricingTypes(settings.pricingtype || []);

      // Set clinic options
      setClinics(settings.clinics || []);

      // Set service type options from GetAllPriceApi
      setServiceTypes([
        ...new Set(priceData.queryresult.pricedetails?.map((x) => x.servicetype) || []),
      ]);
    } catch (err) {
      activateNotifications("Error fetching dropdown data", "error");
    }
  };

  // Setup on open and clear on close
  useEffect(() => {
    if (isOpen) {
      fetchData();
      if (type === "edit" && oldPayload) {
        setUpdatedPayload({
          pricingtype: oldPayload.pricingtype || "",
          exactnameofancclinic: oldPayload.exactnameofancclinic || "",
          exactnameofservicetypeforadult: oldPayload.exactnameofservicetypeforadult || "",
          exactnameofservicetypeforchild: oldPayload.exactnameofservicetypeforchild || "",
        });
      }
    } else {
      // Clear form fields when modal closes
      setPayload(initialPayload);
      setUpdatedPayload(initialPayload);
    }
  }, [isOpen, type, oldPayload]);

  // Submit handlers
  const handleCreate = async () => {
    setLoading(true);
    try {
      const res = await AddPricingModelApi(payload);
      if (res.status === 200) {
        activateNotifications("Pricing model created", "success");
        setPayload(initialPayload);
        onClose();
      }
    } catch (err) {
      activateNotifications(err.message || "Failed to create pricing model", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await UpdatePricingModelApi(updatedPayload, oldPayload._id);
      if (res.status === 200) {
        activateNotifications("Pricing model updated", "success");
        onClose();
      }
    } catch (err) {
      activateNotifications(err.message || "Failed to update pricing model", "error");
    } finally {
      setLoading(false);
    }
  };

  // Dynamically choose form state + handler
  const current = type === "edit" ? updatedPayload : payload;
  const formChange = handleChange;
  const formSubmit = type === "edit" ? handleUpdate : handleCreate;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {type === "edit" ? "Edit Pricing Model" : "Add Pricing Model"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing="15px">
            <Select
              id="pricingtype"
              placeholder="Select Pricing Type"
              value={current.pricingtype}
              onChange={formChange}
              h="45px"
              borderWidth="2px"
              borderColor="#6B7280"
              fontSize={current.pricingtype !== "" ? "16px" : "13px"}
            >
              {pricingTypes.length > 0 ? (
                pricingTypes.map((type, i) => (
                  <option key={`pricingtype-${i}`} value={type}>
                    {type}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No pricing types available
                </option>
              )}
            </Select>

            <Select
              id="exactnameofancclinic"
              placeholder="Select Clinic"
              value={current.exactnameofancclinic}
              onChange={formChange}
              h="45px"
              borderWidth="2px"
              borderColor="#6B7280"
              fontSize={current.exactnameofancclinic !== "" ? "16px" : "13px"}
            >
              {clinics.map((c) => (
                <option key={c.id} value={c.clinic}>
                  {c.clinic}
                </option>
              ))}
            </Select>

            <Select
              id="exactnameofservicetypeforadult"
              placeholder="Service Type (Adult)"
              value={current.exactnameofservicetypeforadult}
              onChange={formChange}
              h="45px"
              borderWidth="2px"
              borderColor="#6B7280"
              fontSize={current.exactnameofservicetypeforadult !== "" ? "16px" : "13px"}
            >
              {serviceTypes.length > 0 ? (
                serviceTypes.map((type, i) => (
                  <option key={`adult-${i}`} value={type}>
                    {type}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No service types available
                </option>
              )}
            </Select>

            <Select
              id="exactnameofservicetypeforchild"
              placeholder="Service Type (Child)"
              value={current.exactnameofservicetypeforchild}
              onChange={formChange}
              h="45px"
              borderWidth="2px"
              borderColor="#6B7280"
              fontSize={current.exactnameofservicetypeforchild !== "" ? "16px" : "13px"}
            >
              {serviceTypes.length > 0 ? (
                serviceTypes.map((type, i) => (
                  <option key={`child-${i}`} value={type}>
                    {type}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No service types available
                </option>
              )}
            </Select>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button w="full" isLoading={loading} onClick={formSubmit}>
            {type === "edit" ? "Update" : "Create"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}