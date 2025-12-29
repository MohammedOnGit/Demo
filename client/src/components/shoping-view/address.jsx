// import React, { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// import CommonForm from "../common/form";
// import AddressCard from "./address-card";
// import { addressFormControls } from "@/config";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   addNewAddress,
//   fetchAllAddresses,
//   editAnAddress,
//   deleteAddress,
// } from "@/store/shop/address-slice";
// import { toast } from "sonner";

// const initialAddressFormData = {
//   _id: null,
//   address: "",
//   city: "",
//   phone: "",
//   digitalAddress: "",
//   notes: "",
// };

// function Address() {
//   const dispatch = useDispatch();
//   const { addressList } = useSelector((state) => state.shopAddress);

//   const [formData, setFormData] = useState(initialAddressFormData);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     dispatch(fetchAllAddresses());
//   }, [dispatch]);

//   function isFormValid() {
//     return (
//       formData.address.trim() &&
//       formData.city.trim() &&
//       formData.phone.trim() &&
//       formData.digitalAddress.trim()
//     );
//   }

//   const handleManageAddress = async (e) => {
//     e.preventDefault();

//     if (!isFormValid()) {
//       toast.error("Please fill in all required fields");
//       return;
//     }

//     // ✅ LIMIT TO 3 (ONLY WHEN ADDING)
//     if (!formData._id && addressList.length >= 3) {
//       toast.warning("You can only add up to 3 addresses");
//       return;
//     }

//     setLoading(true);

//     try {
//       if (formData._id) {
//         await dispatch(
//           editAnAddress({
//             addressId: formData._id,
//             formData,
//           })
//         ).unwrap();

//         toast.success("Address updated successfully");
//       } else {
//         await dispatch(addNewAddress(formData)).unwrap();
//         toast.success("Address added successfully");
//       }

//       setFormData(initialAddressFormData);
//     } catch (error) {
//       toast.error(error || "Operation failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteAddress = async (addressId) => {
//     try {
//       await dispatch(deleteAddress(addressId)).unwrap();
//       toast.success("Address deleted successfully");

//       // reset form if deleting currently edited address
//       if (formData._id === addressId) {
//         setFormData(initialAddressFormData);
//       }
//     } catch (error) {
//       toast.error("Failed to delete address");
//     }
//   };

//   const isAddLimitReached = !formData._id && addressList.length >= 3;

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>My Addresses</CardTitle>
//       </CardHeader>

//       <CardContent className="space-y-6 justify-end">
//         {/* ADDRESS LIST */}
//         <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
//           {addressList.map((addressItem) => (
//             <AddressCard
//               key={addressItem._id}
//               addressInfo={addressItem}
//               setFormData={setFormData}
//               handleDeleteAddress={handleDeleteAddress}
//             />
//           ))}
//         </div>

//         {/* ADDRESS FORM */}
//         <CommonForm
//           formControls={addressFormControls}
//           formData={formData}
//           setFormData={setFormData}
//           buttonText={formData._id ? "Update Address" : "Add Address"}
//           onSubmit={handleManageAddress}
//           isBtnDisabled={!isFormValid() || loading || isAddLimitReached}
//         />

//         {isAddLimitReached && (
//           <p className="text-sm text-red-500">
//             Maximum of 3 addresses allowed
//           </p>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

// export default Address;


// import React, { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
// import CommonForm from "../common/form";
// import AddressCard from "./address-card";
// import { addressFormControls } from "@/config";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   addNewAddress,
//   fetchAllAddresses,
//   editAnAddress,
//   deleteAddress,
// } from "@/store/shop/address-slice";
// import { toast } from "sonner";
// import { Button } from "../ui/button";
// import { Plus, MapPin, AlertCircle } from "lucide-react";
// import { Badge } from "../ui/badge";

// const initialAddressFormData = {
//   _id: null,
//   address: "",
//   city: "",
//   phone: "",
//   digitalAddress: "",
//   notes: "",
//   type: "home",
//   isDefault: false
// };

// function Address() {
//   const dispatch = useDispatch();
//   const { addressList, loading: addressesLoading } = useSelector((state) => state.shopAddress);
//   const [formData, setFormData] = useState(initialAddressFormData);
//   const [formLoading, setFormLoading] = useState(false);
//   const [isAddingNew, setIsAddingNew] = useState(false);

//   useEffect(() => {
//     dispatch(fetchAllAddresses());
//   }, [dispatch]);

//   function isFormValid() {
//     return (
//       formData.address.trim() &&
//       formData.city.trim() &&
//       formData.phone.trim() &&
//       formData.digitalAddress.trim()
//     );
//   }

//   const handleManageAddress = async (e) => {
//     e.preventDefault();

//     if (!isFormValid()) {
//       toast.error("Please fill in all required fields");
//       return;
//     }

//     if (!formData._id && addressList.length >= 3) {
//       toast.warning("You can only add up to 3 addresses");
//       return;
//     }

//     setFormLoading(true);

//     try {
//       if (formData._id) {
//         await dispatch(
//           editAnAddress({
//             addressId: formData._id,
//             formData,
//           })
//         ).unwrap();
//         toast.success("Address updated successfully");
//       } else {
//         await dispatch(addNewAddress(formData)).unwrap();
//         toast.success("Address added successfully");
//       }

//       setFormData(initialAddressFormData);
//       setIsAddingNew(false);
//     } catch (error) {
//       toast.error(error?.message || "Operation failed");
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   const handleDeleteAddress = async (addressId) => {
//     try {
//       await dispatch(deleteAddress(addressId)).unwrap();
//       toast.success("Address deleted successfully");

//       if (formData._id === addressId) {
//         setFormData(initialAddressFormData);
//         setIsAddingNew(false);
//       }
//     } catch (error) {
//       toast.error("Failed to delete address");
//     }
//   };

//   const handleSetDefault = (addressId) => {
//     toast.info("Setting as default address...");
//     // TODO: Implement set default address API
//   };

//   const isAddLimitReached = !formData._id && addressList.length >= 3;

//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//           <div>
//             <CardTitle className="text-2xl font-bold">My Addresses</CardTitle>
//             <CardDescription>
//               Manage your delivery addresses for quick checkout
//             </CardDescription>
//           </div>
          
//           {!isAddingNew && addressList.length < 3 && (
//             <Button
//               onClick={() => setIsAddingNew(true)}
//               className="gap-2"
//             >
//               <Plus className="h-4 w-4" />
//               Add New Address
//             </Button>
//           )}
//         </div>
//       </CardHeader>

//       <CardContent className="space-y-8">
//         {/* Address Limit Alert */}
//         {addressList.length >= 3 && (
//           <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
//             <div className="flex items-start gap-3">
//               <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
//               <div>
//                 <p className="font-medium text-amber-800">Address Limit Reached</p>
//                 <p className="text-sm text-amber-700">
//                   You can only store up to 3 addresses. Delete an existing address to add a new one.
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Address List */}
//         {addressList.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {addressList.map((addressItem) => (
//               <AddressCard
//                 key={addressItem._id}
//                 addressInfo={addressItem}
//                 setFormData={(data) => {
//                   setFormData(data);
//                   setIsAddingNew(true);
//                 }}
//                 handleDeleteAddress={handleDeleteAddress}
//                 onSetDefault={handleSetDefault}
//               />
//             ))}
//           </div>
//         ) : (
//           /* Empty State */
//           <div className="text-center py-12 border-2 border-dashed rounded-xl">
//             <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
//               <MapPin className="h-8 w-8 text-muted-foreground" />
//             </div>
//             <h3 className="text-lg font-semibold mb-2">No addresses saved</h3>
//             <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
//               Add your delivery addresses for faster checkout and order tracking
//             </p>
//             <Button onClick={() => setIsAddingNew(true)} className="gap-2">
//               <Plus className="h-4 w-4" />
//               Add Your First Address
//             </Button>
//           </div>
//         )}

//         {/* Address Form (Conditional) */}
//         {(isAddingNew || formData._id) && (
//           <div className="border-t pt-8">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-lg font-semibold">
//                 {formData._id ? "Edit Address" : "Add New Address"}
//               </h3>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => {
//                   setFormData(initialAddressFormData);
//                   setIsAddingNew(false);
//                 }}
//               >
//                 Cancel
//               </Button>
//             </div>
            
//             <CommonForm
//               formControls={addressFormControls}
//               formData={formData}
//               setFormData={setFormData}
//               buttonText={formData._id ? "Update Address" : "Save Address"}
//               onSubmit={handleManageAddress}
//               isBtnDisabled={!isFormValid() || formLoading}
//               loading={formLoading}
//             />
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

// export default Address;

//WORKING VERSION
// import React, { useState, useEffect } from "react";
// import {
//   MapPin,
//   Plus,
//   Edit,
//   Trash2,
//   Check,
//   X,
//   Home,
//   Building,
//   Navigation,
//   User,
//   Phone,
//   Mail,
//   Globe,
//   ChevronRight,
//   Star,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { Separator } from "@/components/ui/separator";
// // import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useDispatch, useSelector } from "react-redux";
// import { cn } from "@/lib/utils";

// // Import address form controls from config
// import { addressFormControls } from "@/config";

// function Address() {
//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);

//   // Initialize form data
//   useEffect(() => {
//     const initialFormData = {};
//     addressFormControls.forEach((control) => {
//       if (control.type === "checkbox") {
//         initialFormData[control.id] = false;
//       } else {
//         initialFormData[control.id] = "";
//       }
//     });
//     setFormData(initialFormData);
//   }, []);

//   // Load addresses from localStorage on component mount
//   useEffect(() => {
//     const savedAddresses = localStorage.getItem("userAddresses");
//     if (savedAddresses) {
//       try {
//         setAddresses(JSON.parse(savedAddresses));
//       } catch (error) {
//         console.error("Error loading addresses:", error);
//         setAddresses([]);
//       }
//     }
//   }, []);

//   // Save addresses to localStorage whenever they change
//   useEffect(() => {
//     localStorage.setItem("userAddresses", JSON.stringify(addresses));
//   }, [addresses]);

//   // Handle form input changes
//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));

//     // Clear error for this field
//     if (errors[field]) {
//       setErrors((prev) => ({
//         ...prev,
//         [field]: "",
//       }));
//     }
//   };

//   // Validate form
//   const validateForm = () => {
//     const newErrors = {};

//     addressFormControls.forEach((control) => {
//       if (control.required) {
//         const value = formData[control.id];

//         if (control.type === "checkbox") {
//           // Checkbox validation
//           if (!value && control.required) {
//             newErrors[control.id] = "This field is required";
//           }
//         } else {
//           // Text/select validation
//           if (!value || value.toString().trim() === "") {
//             newErrors[control.id] = "This field is required";
//           } else if (control.validation) {
//             // Pattern validation
//             if (control.validation.pattern && !control.validation.pattern.test(value)) {
//               newErrors[control.id] = control.validation.errorMessage;
//             }
//             // Length validation
//             if (control.validation.minLength && value.length < control.validation.minLength) {
//               newErrors[control.id] = `Minimum ${control.validation.minLength} characters required`;
//             }
//             if (control.validation.maxLength && value.length > control.validation.maxLength) {
//               newErrors[control.id] = `Maximum ${control.validation.maxLength} characters allowed`;
//             }
//           }
//         }
//       }
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle add new address
//   const handleAddAddress = () => {
//     if (!validateForm()) return;

//     setIsLoading(true);

//     // Simulate API call
//     setTimeout(() => {
//       const newAddress = {
//         id: `addr_${Date.now()}`,
//         ...formData,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       };

//       // If this is set as default, unset other defaults
//       if (newAddress.isDefault) {
//         const updatedAddresses = addresses.map((addr) => ({
//           ...addr,
//           isDefault: false,
//         }));
//         setAddresses([newAddress, ...updatedAddresses]);
//       } else {
//         setAddresses([newAddress, ...addresses]);
//       }

//       // Reset form and close dialog
//       resetForm();
//       setIsAddDialogOpen(false);
//       setIsLoading(false);
//     }, 500);
//   };

//   // Handle edit address
//   const handleEditAddress = () => {
//     if (!validateForm()) return;

//     setIsLoading(true);

//     // Simulate API call
//     setTimeout(() => {
//       const updatedAddresses = addresses.map((addr) =>
//         addr.id === selectedAddress.id
//           ? {
//               ...formData,
//               id: selectedAddress.id,
//               updatedAt: new Date().toISOString(),
//             }
//           : addr
//       );

//       // If this is set as default, unset other defaults
//       if (formData.isDefault) {
//         const finalAddresses = updatedAddresses.map((addr) =>
//           addr.id !== selectedAddress.id ? { ...addr, isDefault: false } : addr
//         );
//         setAddresses(finalAddresses);
//       } else {
//         setAddresses(updatedAddresses);
//       }

//       // Reset form and close dialog
//       resetForm();
//       setIsEditDialogOpen(false);
//       setSelectedAddress(null);
//       setIsLoading(false);
//     }, 500);
//   };

//   // Handle delete address
//   const handleDeleteAddress = () => {
//     setIsLoading(true);

//     // Simulate API call
//     setTimeout(() => {
//       const updatedAddresses = addresses.filter(
//         (addr) => addr.id !== selectedAddress.id
//       );
//       setAddresses(updatedAddresses);

//       setIsDeleteDialogOpen(false);
//       setSelectedAddress(null);
//       setIsLoading(false);
//     }, 500);
//   };

//   // Reset form
//   const resetForm = () => {
//     const initialFormData = {};
//     addressFormControls.forEach((control) => {
//       if (control.type === "checkbox") {
//         initialFormData[control.id] = false;
//       } else {
//         initialFormData[control.id] = "";
//       }
//     });
//     setFormData(initialFormData);
//     setErrors({});
//   };

//   // Open edit dialog
//   const openEditDialog = (address) => {
//     setSelectedAddress(address);
//     setFormData(address);
//     setIsEditDialogOpen(true);
//   };

//   // Open delete dialog
//   const openDeleteDialog = (address) => {
//     setSelectedAddress(address);
//     setIsDeleteDialogOpen(true);
//   };

//   // Set default address
//   const setDefaultAddress = (addressId) => {
//     const updatedAddresses = addresses.map((addr) => ({
//       ...addr,
//       isDefault: addr.id === addressId,
//     }));
//     setAddresses(updatedAddresses);
//   };

//   // Get address type icon
//   const getAddressTypeIcon = (type) => {
//     switch (type) {
//       case "home":
//         return <Home className="h-4 w-4" />;
//       case "office":
//         return <Building className="h-4 w-4" />;
//       default:
//         return <Navigation className="h-4 w-4" />;
//     }
//   };

//   // Get address type label
//   const getAddressTypeLabel = (type) => {
//     switch (type) {
//       case "home":
//         return "Home";
//       case "office":
//         return "Office";
//       default:
//         return "Other";
//     }
//   };

//   // Render form control
//   const renderFormControl = (control) => {
//     switch (control.type) {
//       case "text":
//       case "email":
//       case "tel":
//         return (
//           <div key={control.id} className="space-y-2">
//             <Label htmlFor={control.id}>
//               {control.label}
//               {control.required && <span className="text-red-500 ml-1">*</span>}
//             </Label>
//             <Input
//               id={control.id}
//               type={control.type}
//               placeholder={control.placeholder}
//               value={formData[control.id] || ""}
//               onChange={(e) => handleInputChange(control.id, e.target.value)}
//               className={errors[control.id] ? "border-red-500" : ""}
//               disabled={isLoading}
//             />
//             {errors[control.id] && (
//               <p className="text-sm text-red-500">{errors[control.id]}</p>
//             )}
//           </div>
//         );

//       case "textarea":
//         return (
//           <div key={control.id} className="space-y-2">
//             <Label htmlFor={control.id}>
//               {control.label}
//               {control.required && <span className="text-red-500 ml-1">*</span>}
//             </Label>
//             <Textarea
//               id={control.id}
//               placeholder={control.placeholder}
//               value={formData[control.id] || ""}
//               onChange={(e) => handleInputChange(control.id, e.target.value)}
//               className={errors[control.id] ? "border-red-500" : ""}
//               disabled={isLoading}
//               rows={3}
//             />
//             {errors[control.id] && (
//               <p className="text-sm text-red-500">{errors[control.id]}</p>
//             )}
//           </div>
//         );

//       case "select":
//         return (
//           <div key={control.id} className="space-y-2">
//             <Label htmlFor={control.id}>
//               {control.label}
//               {control.required && <span className="text-red-500 ml-1">*</span>}
//             </Label>
//             <Select
//               value={formData[control.id] || ""}
//               onValueChange={(value) => handleInputChange(control.id, value)}
//               disabled={isLoading}
//             >
//               <SelectTrigger
//                 className={errors[control.id] ? "border-red-500" : ""}
//               >
//                 <SelectValue placeholder={control.placeholder} />
//               </SelectTrigger>
//               <SelectContent>
//                 {control.options?.map((option) => (
//                   <SelectItem key={option.value} value={option.value}>
//                     {option.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             {errors[control.id] && (
//               <p className="text-sm text-red-500">{errors[control.id]}</p>
//             )}
//           </div>
//         );

//       case "checkbox":
//         return (
//           <div key={control.id} className="flex items-center space-x-2">
//             <Checkbox
//               id={control.id}
//               checked={formData[control.id] || false}
//               onCheckedChange={(checked) =>
//                 handleInputChange(control.id, checked)
//               }
//               disabled={isLoading}
//             />
//             <Label htmlFor={control.id} className="text-sm cursor-pointer">
//               {control.label}
//             </Label>
//             {errors[control.id] && (
//               <p className="text-sm text-red-500">{errors[control.id]}</p>
//             )}
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   // Render address card
//   const renderAddressCard = (address) => (
//     <Card
//       key={address.id}
//       className={cn(
//         "overflow-hidden transition-all duration-300 hover:shadow-lg",
//         address.isDefault && "border-primary/50 ring-1 ring-primary/20"
//       )}
//     >
//       <CardContent className="p-6">
//         <div className="flex items-start justify-between mb-4">
//           <div className="flex items-center gap-3">
//             <div
//               className={cn(
//                 "p-2 rounded-full",
//                 address.isDefault
//                   ? "bg-primary/10 text-primary"
//                   : "bg-muted text-muted-foreground"
//               )}
//             >
//               {getAddressTypeIcon(address.addressType || "other")}
//             </div>
//             <div>
//               <div className="flex items-center gap-2">
//                 <h3 className="font-semibold">{address.fullName}</h3>
//                 {address.isDefault && (
//                   <Badge
//                     variant="default"
//                     className="bg-primary text-primary-foreground"
//                   >
//                     <Star className="h-3 w-3 mr-1 fill-current" />
//                     Default
//                   </Badge>
//                 )}
//               </div>
//               <Badge variant="outline" className="mt-1">
//                 {getAddressTypeLabel(address.addressType || "other")}
//               </Badge>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => openEditDialog(address)}
//               disabled={isLoading}
//             >
//               <Edit className="h-4 w-4" />
//             </Button>
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => openDeleteDialog(address)}
//               disabled={isLoading || address.isDefault}
//               className="text-red-500 hover:text-red-600 hover:bg-red-50"
//             >
//               <Trash2 className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>

//         <div className="space-y-3">
//           <div className="flex items-start gap-3">
//             <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
//             <div>
//               <p className="font-medium">{address.streetAddress}</p>
//               <p className="text-sm text-muted-foreground">
//                 {address.city}, {address.state} {address.postalCode}
//               </p>
//               <p className="text-sm text-muted-foreground">{address.country}</p>
//             </div>
//           </div>

//           <Separator />

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             <div className="flex items-center gap-2">
//               <Phone className="h-4 w-4 text-muted-foreground" />
//               <span className="text-sm">{address.phoneNumber}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Mail className="h-4 w-4 text-muted-foreground" />
//               <span className="text-sm truncate">{address.email}</span>
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-2 pt-4">
//             {!address.isDefault && (
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setDefaultAddress(address.id)}
//                 disabled={isLoading}
//                 className="gap-2"
//               >
//                 <Check className="h-3 w-3" />
//                 Set as Default
//               </Button>
//             )}
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => openEditDialog(address)}
//               disabled={isLoading}
//               className="gap-2"
//             >
//               <Edit className="h-3 w-3" />
//               Edit Address
//             </Button>
//             {!address.isDefault && (
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => openDeleteDialog(address)}
//                 disabled={isLoading}
//                 className="gap-2 text-red-500 hover:text-red-600 hover:border-red-200"
//               >
//                 <Trash2 className="h-3 w-3" />
//                 Delete
//               </Button>
//             )}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto px-4 py-8">
//         <div className="max-w-6xl mx-auto">
//           {/* Header */}
//           <div className="mb-8">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="text-3xl font-bold">My Addresses</h1>
//                 <p className="text-muted-foreground mt-2">
//                   Manage your shipping and billing addresses
//                 </p>
//               </div>
//               <Button
//                 onClick={() => setIsAddDialogOpen(true)}
//                 className="gap-2"
//               >
//                 <Plus className="h-4 w-4" />
//                 Add New Address
//               </Button>
//             </div>
//           </div>

//           {/* Address List */}
//           {addresses.length === 0 ? (
//             <Card className="border-dashed">
//               <CardContent className="p-12 text-center">
//                 <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
//                   <MapPin className="h-8 w-8 text-muted-foreground" />
//                 </div>
//                 <h3 className="text-lg font-semibold mb-2">
//                   No addresses saved
//                 </h3>
//                 <p className="text-muted-foreground mb-6">
//                   Add your first address to get started with shipping
//                 </p>
//                 <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
//                   <Plus className="h-4 w-4" />
//                   Add Your First Address
//                 </Button>
//               </CardContent>
//             </Card>
//           ) : (
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {addresses.map(renderAddressCard)}
//             </div>
//           )}

//           {/* Tips */}
//           {addresses.length > 0 && (
//             <Card className="mt-8">
//               <CardContent className="p-6">
//                 <div className="flex items-start gap-4">
//                   <div className="p-2 rounded-full bg-blue-50 text-blue-600">
//                     <MapPin className="h-5 w-5" />
//                   </div>
//                   <div>
//                     <h4 className="font-semibold mb-2">Address Tips</h4>
//                     <ul className="space-y-2 text-sm text-muted-foreground">
//                       <li className="flex items-start gap-2">
//                         <ChevronRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
//                         Ensure your address is accurate to avoid delivery issues
//                       </li>
//                       <li className="flex items-start gap-2">
//                         <ChevronRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
//                         You can set one address as default for faster checkout
//                       </li>
//                       <li className="flex items-start gap-2">
//                         <ChevronRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
//                         Update your addresses when you move to a new location
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       </div>

//       {/* Add Address Dialog */}
//       <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
//         <DialogContent className="sm:max-w-lg">
//           <DialogHeader>
//             <DialogTitle>Add New Address</DialogTitle>
//             <DialogDescription>
//               Add a new shipping or billing address for your orders.
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
//             {addressFormControls.map(renderFormControl)}
//           </div>

//           <DialogFooter className="gap-3">
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setIsAddDialogOpen(false);
//                 resetForm();
//               }}
//               disabled={isLoading}
//             >
//               Cancel
//             </Button>
//             <Button onClick={handleAddAddress} disabled={isLoading}>
//               {isLoading ? "Adding..." : "Add Address"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Edit Address Dialog */}
//       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//         <DialogContent className="sm:max-w-lg">
//           <DialogHeader>
//             <DialogTitle>Edit Address</DialogTitle>
//             <DialogDescription>
//               Update your address information.
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
//             {addressFormControls.map(renderFormControl)}
//           </div>

//           <DialogFooter className="gap-3">
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setIsEditDialogOpen(false);
//                 resetForm();
//                 setSelectedAddress(null);
//               }}
//               disabled={isLoading}
//             >
//               Cancel
//             </Button>
//             <Button onClick={handleEditAddress} disabled={isLoading}>
//               {isLoading ? "Updating..." : "Update Address"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Delete Address Dialog */}
//       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Delete Address</AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to delete this address? This action cannot be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter className="gap-3">
//             <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={handleDeleteAddress}
//               disabled={isLoading}
//               className="bg-red-500 hover:bg-red-600"
//             >
//               {isLoading ? "Deleting..." : "Delete Address"}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }

// export default Address;




import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
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
import { Button } from "../ui/button";
import { Plus, MapPin, AlertCircle, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";

const initialAddressFormData = {
  _id: null,
  address: "",
  city: "",
  phone: "",
  digitalAddress: "",
  notes: "",
  type: "home",
};

function Address() {
  const dispatch = useDispatch();
  const { addressList, isLoading } = useSelector((state) => state.shopAddress);

  const [formData, setFormData] = useState(initialAddressFormData);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchAllAddresses());
  }, [dispatch]);

  // Search filter
  const filteredAddresses = addressList.filter((addr) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      addr.address?.toLowerCase().includes(query) ||
      addr.city?.toLowerCase().includes(query) ||
      addr.digitalAddress?.toLowerCase().includes(query) ||
      addr.phone?.toLowerCase().includes(query) ||
      addr.notes?.toLowerCase().includes(query)
    );
  });

  function isFormValid() {
    return (
      formData.address?.trim() &&
      formData.city?.trim() &&
      formData.phone?.trim() &&
      formData.digitalAddress?.trim()
    );
  }

  const handleManageAddress = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData._id && addressList.length >= 3) {
      toast.warning("You can only add up to 3 addresses");
      return;
    }

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
      setIsAddingNew(false);
    } catch (error) {
      toast.error(error?.message || "Operation failed");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await dispatch(deleteAddress(addressId)).unwrap();
      toast.success("Address deleted successfully");

      if (formData._id === addressId) {
        setFormData(initialAddressFormData);
        setIsAddingNew(false);
      }
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefault = (addressId) => {
    toast.info("Default address feature coming soon...");
    // TODO: implement set default API when ready
  };

  const isAddLimitReached = !formData._id && addressList.length >= 3;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold">My Addresses</CardTitle>
            <CardDescription>
              Manage your delivery addresses for quick checkout
            </CardDescription>
          </div>

          {!isAddingNew && addressList.length < 3 && (
            <Button
              onClick={() => setIsAddingNew(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Address
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Search Bar */}
        {addressList.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search addresses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {/* Address Limit Alert */}
        {addressList.length >= 3 && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Address Limit Reached</p>
                <p className="text-sm text-amber-700">
                  You can only store up to 3 addresses. Delete an existing address to add a new one.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Address List */}
        {isLoading ? (
          <div className="text-center py-12">Loading addresses...</div>
        ) : filteredAddresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAddresses.map((addressItem) => (
              <AddressCard
                key={addressItem._id}
                addressInfo={addressItem}
                setFormData={(data) => {
                  setFormData(data);
                  setIsAddingNew(true);
                }}
                handleDeleteAddress={handleDeleteAddress}
                isDefault={addressItem.isDefault}
                onSetDefault={handleSetDefault}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12 border-2 border-dashed rounded-xl">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? "No matching addresses" : "No addresses saved"}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              {searchQuery
                ? "Try adjusting your search term."
                : "Add your delivery addresses for faster checkout"}
            </p>
            {!searchQuery && addressList.length < 3 && (
              <Button onClick={() => setIsAddingNew(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Address
              </Button>
            )}
          </div>
        )}

        {/* Address Form (Conditional) */}
        {(isAddingNew || formData._id) && (
          <div className="border-t pt-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">
                {formData._id ? "Edit Address" : "Add New Address"}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFormData(initialAddressFormData);
                  setIsAddingNew(false);
                }}
              >
                Cancel
              </Button>
            </div>

            <CommonForm
              formControls={addressFormControls}
              formData={formData}
              setFormData={setFormData}
              buttonText={formData._id ? "Update Address" : "Save Address"}
              onSubmit={handleManageAddress}
              isBtnDisabled={!isFormValid() || isLoading || isAddLimitReached}
              loading={isLoading}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default Address;