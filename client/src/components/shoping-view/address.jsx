import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import CommonForm from "../common/form";
import AddressCard from "./address-card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  fetchAllAddresses,
  editAnAddress,
  deleteAddress,
} from "@/store/shop/address-slice";
import { toast } from "sonner";

const initialAddressFormData = {
  _id: null,
  address: "",
  city: "",
  phone: "",
  digitalAddress: "",
  notes: "",
};

function Address() {
  const dispatch = useDispatch();
  const { addressList } = useSelector((state) => state.shopAddress);

  const [formData, setFormData] = useState(initialAddressFormData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAllAddresses());
  }, [dispatch]);

  function isFormValid() {
    return (
      formData.address.trim() &&
      formData.city.trim() &&
      formData.phone.trim() &&
      formData.digitalAddress.trim()
    );
  }

  const handleManageAddress = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error("Please fill in all required fields");
      return;
    }

    // ✅ LIMIT TO 3 (ONLY WHEN ADDING)
    if (!formData._id && addressList.length >= 3) {
      toast.warning("You can only add up to 3 addresses");
      return;
    }

    setLoading(true);

    try {
      if (formData._id) {
        await dispatch(
          editAnAddress({
            addressId: formData._id,
            formData,
          })
        ).unwrap();

        toast.success("Address updated successfully");
      } else {
        await dispatch(addNewAddress(formData)).unwrap();
        toast.success("Address added successfully");
      }

      setFormData(initialAddressFormData);
    } catch (error) {
      toast.error(error || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await dispatch(deleteAddress(addressId)).unwrap();
      toast.success("Address deleted successfully");

      // reset form if deleting currently edited address
      if (formData._id === addressId) {
        setFormData(initialAddressFormData);
      }
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  const isAddLimitReached = !formData._id && addressList.length >= 3;

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Addresses</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 justify-end">
        {/* ADDRESS LIST */}
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {addressList.map((addressItem) => (
            <AddressCard
              key={addressItem._id}
              addressInfo={addressItem}
              setFormData={setFormData}
              handleDeleteAddress={handleDeleteAddress}
            />
          ))}
        </div>

        {/* ADDRESS FORM */}
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={formData._id ? "Update Address" : "Add Address"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid() || loading || isAddLimitReached}
        />

        {isAddLimitReached && (
          <p className="text-sm text-red-500">
            Maximum of 3 addresses allowed
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default Address;
