import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import CommonForm from "../common/form";
import AddressCard from "./address-card";
import { addressFormControls, getRequiredFields } from "@/config";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  digitalAddress: "",
  notes: "",
};

function Address() {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [addresses, setAddresses] = useState([]);

  // 🔑 derive required fields from config
  const REQUIRED_FIELDS = getRequiredFields(addressFormControls);

  // ✅ validate using config (notes auto-optional)
  function isFormValid() {
    return REQUIRED_FIELDS.every((field) => formData[field]?.trim() !== "");
  }

  // Add / Save address
  function handleManageAddress(event) {
    event.preventDefault();

    if (!isFormValid()) {
      alert("Please fill in all required fields.");
      return;
    }

    setAddresses((prev) => [...prev, formData]);
    setFormData(initialAddressFormData);
  }

  return (
    <Card>
      {/* ================= ADDRESS LIST ================= */}
      <CardContent className="space-y-3">
        {addresses.length > 0 ? (
          addresses.map((address, index) => (
            <AddressCard key={index} addressInfo={address} />
          ))
        ) : (
          <p className="text-muted-foreground">No addresses added yet.</p>
        )}
      </CardContent>

      {/* ================= ADD NEW ADDRESS ================= */}
      <CardHeader>
        <CardTitle>Add New Address</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-start text-sm font-medium">
          <span>
            All fields marked{" "}
            <span className="text-red-500 ml-2 font-bold">*</span> are required
          </span>
        </div>
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText="Add"
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
}

export default Address;
