
// // import React, { useEffect, useState, useRef } from "react";
// // import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
// // import CommonForm from "../common/form";
// // import AddressCard from "./address-card";
// // import { addressFormControls } from "@/config";
// // import { useDispatch, useSelector } from "react-redux";
// // import { addNewAddress, fetchAllAddresses, editAnAddress, deleteAddress } from "@/store/shop/address-slice";
// // import { toast } from "sonner";
// // import { Button } from "../ui/button";
// // import { Plus, MapPin, AlertCircle, Search, CheckCircle } from "lucide-react";
// // import { Input } from "../ui/input";

// // const initialAddressFormData = {
// //   _id: null,
// //   address: "",
// //   city: "",
// //   phone: "",
// //   digitalAddress: "",
// //   notes: "",
// //   type: "home",
// // };

// // function Address({ onAddressSelect }) {
// //   const dispatch = useDispatch();
// //   const { addressList, isLoading } = useSelector((state) => state.shopAddress);
// //   const lastFetchRef = useRef(0);
// //   const fetchCooldown = 15000;

// //   const [formData, setFormData] = useState(initialAddressFormData);
// //   const [isAddingNew, setIsAddingNew] = useState(false);
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [selectedAddressId, setSelectedAddressId] = useState(null);

// //   // Fetch addresses with cooldown
// //   useEffect(() => {
// //     if (Date.now() - lastFetchRef.current < fetchCooldown) return;
// //     lastFetchRef.current = Date.now();
// //     dispatch(fetchAllAddresses());
// //   }, [dispatch]);

// //   // Auto-select first address
// //   useEffect(() => {
// //     if (addressList.length > 0 && !selectedAddressId && onAddressSelect) {
// //       const firstAddress = addressList[0];
// //       setSelectedAddressId(firstAddress._id);
// //       onAddressSelect(firstAddress);
// //     }
// //   }, [addressList, onAddressSelect]);

// //   const filteredAddresses = addressList.filter((addr) => {
// //     if (!searchQuery.trim()) return true;
// //     const q = searchQuery.toLowerCase();
// //     return [addr.address, addr.city, addr.digitalAddress, addr.phone, addr.notes]
// //       .some((field) => field?.toLowerCase().includes(q));
// //   });

// //   const isFormValid = () =>
// //     formData.address?.trim() && formData.city?.trim() && formData.phone?.trim() && formData.digitalAddress?.trim();

// //   const isValidPhone = (phone) => /^[0-9\-\+\s\(\)]{10,15}$/.test(phone);
// //   const isValidDigitalAddress = (addr) => addr.length >= 3 && addr.length <= 20;

// //   const handleManageAddress = async (e) => {
// //     e.preventDefault();
// //     if (!isFormValid()) return toast.error("Please fill in all required fields");
// //     if (!isValidPhone(formData.phone)) return toast.error("Please enter a valid phone number (10-15 digits)");
// //     if (!isValidDigitalAddress(formData.digitalAddress)) return toast.error("Digital address must be 3-20 chars");
// //     if (!formData._id && addressList.length >= 3) return toast.warning("You can only add up to 3 addresses");

// //     try {
// //       if (formData._id) {
// //         await dispatch(editAnAddress({ addressId: formData._id, formData })).unwrap();
// //         toast.success("Address updated successfully");
// //       } else {
// //         await dispatch(addNewAddress(formData)).unwrap();
// //         toast.success("Address added successfully");
// //       }
// //       setFormData(initialAddressFormData);
// //       setIsAddingNew(false);
// //       lastFetchRef.current = 0; // invalidate cache
// //     } catch (err) {
// //       toast.error(err?.message || "Operation failed");
// //     }
// //   };

// //   const handleDeleteAddress = async (addressId) => {
// //     try {
// //       await dispatch(deleteAddress(addressId)).unwrap();
// //       toast.success("Address deleted successfully");

// //       if (formData._id === addressId) setFormData(initialAddressFormData);
// //       if (selectedAddressId === addressId) {
// //         setSelectedAddressId(null);
// //         onAddressSelect?.(null);
// //       }
// //       lastFetchRef.current = 0;
// //     } catch {
// //       toast.error("Failed to delete address");
// //     }
// //   };

// //   const handleSetDefault = () => toast.info("Default address feature coming soon");
// //   const handleAddressClick = (addr) => {
// //     setSelectedAddressId(addr._id);
// //     onAddressSelect?.(addr);
// //   };
// //   const isAddLimitReached = !formData._id && addressList.length >= 3;

// //   return (
// //     <Card>
// //       <CardHeader>
// //         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
// //           <div>
// //             <CardTitle className="text-2xl font-bold">My Addresses</CardTitle>
// //             <CardDescription>
// //               {onAddressSelect ? "Select a shipping address for checkout" : "Manage your delivery addresses"}
// //             </CardDescription>
// //           </div>
// //           {!isAddingNew && addressList.length < 3 && (
// //             <Button onClick={() => setIsAddingNew(true)} className="gap-2">
// //               <Plus className="h-4 w-4" /> Add New Address
// //             </Button>
// //           )}
// //         </div>
// //       </CardHeader>

// //       <CardContent className="space-y-8">
// //         {/* Selected Info */}
// //         {onAddressSelect && selectedAddressId && (
// //           <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
// //             <CheckCircle className="h-5 w-5 text-green-600" />
// //             <p className="text-sm text-green-800">Address selected for checkout</p>
// //           </div>
// //         )}

// //         {/* Search */}
// //         {addressList.length > 0 && (
// //           <div className="relative">
// //             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
// //             <Input
// //               placeholder="Search addresses..."
// //               value={searchQuery}
// //               onChange={(e) => setSearchQuery(e.target.value)}
// //               className="pl-10"
// //             />
// //           </div>
// //         )}

// //         {/* Address Limit */}
// //         {addressList.length >= 3 && (
// //           <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
// //             <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
// //             <div>
// //               <p className="font-medium text-amber-800">Address Limit Reached</p>
// //               <p className="text-sm text-amber-700">
// //                 You can only store up to 3 addresses. Delete an existing address to add a new one.
// //               </p>
// //             </div>
// //           </div>
// //         )}

// //         {/* Address List */}
// //         {isLoading ? (
// //           <div className="text-center py-12">
// //             <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
// //             <p className="mt-2 text-muted-foreground">Loading addresses...</p>
// //           </div>
// //         ) : filteredAddresses.length > 0 ? (
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //             {filteredAddresses.map((addr) => (
// //               <div key={addr._id} onClick={() => onAddressSelect && handleAddressClick(addr)} className="cursor-pointer">
// //                 <AddressCard
// //                   addressInfo={addr}
// //                   setFormData={(data) => {
// //                     setFormData(data);
// //                     setIsAddingNew(true);
// //                   }}
// //                   handleDeleteAddress={handleDeleteAddress}
// //                   isDefault={addr.isDefault}
// //                   onSetDefault={handleSetDefault}
// //                   isSelected={onAddressSelect && selectedAddressId === addr._id}
// //                 />
// //               </div>
// //             ))}
// //           </div>
// //         ) : (
// //           <div className="text-center py-12 border-2 border-dashed rounded-xl">
// //             <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
// //               <MapPin className="h-8 w-8 text-muted-foreground" />
// //             </div>
// //             <h3 className="text-lg font-semibold mb-2">
// //               {searchQuery ? "No matching addresses" : "No addresses saved"}
// //             </h3>
// //             <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
// //               {searchQuery ? "Try adjusting your search term." : "Add your delivery addresses for faster checkout"}
// //             </p>
// //             {!searchQuery && addressList.length < 3 && (
// //               <Button onClick={() => setIsAddingNew(true)} className="gap-2">
// //                 <Plus className="h-4 w-4" /> Add Your First Address
// //               </Button>
// //             )}
// //           </div>
// //         )}

// //         {/* Address Form */}
// //         {(isAddingNew || formData._id) && (
// //           <div className="border-t pt-8">
// //             <div className="flex items-center justify-between mb-6">
// //               <h3 className="text-lg font-semibold">{formData._id ? "Edit Address" : "Add New Address"}</h3>
// //               <Button variant="ghost" size="sm" onClick={() => { setFormData(initialAddressFormData); setIsAddingNew(false); }}>
// //                 Cancel
// //               </Button>
// //             </div>
// //             <CommonForm
// //               formControls={addressFormControls}
// //               formData={formData}
// //               setFormData={setFormData}
// //               buttonText={formData._id ? "Update Address" : "Save Address"}
// //               onSubmit={handleManageAddress}
// //               isBtnDisabled={!isFormValid() || isLoading || isAddLimitReached}
// //               loading={isLoading}
// //             />
// //           </div>
// //         )}
// //       </CardContent>
// //     </Card>
// //   );
// // }

// // export default Address;


// import { useEffect, useState, useRef, useCallback, useMemo } from "react";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
// import CommonForm from "../common/form";
// import AddressCard from "./address-card";
// import { addressFormControls } from "@/config";
// import { useDispatch, useSelector } from "react-redux";
// import { addNewAddress, fetchAllAddresses, editAnAddress, deleteAddress } from "@/store/shop/address-slice";
// import { toast } from "sonner";
// import { Button } from "../ui/button";
// import { Plus, MapPin, AlertCircle, Search, CheckCircle } from "lucide-react";
// import { Input } from "../ui/input";

// const initialAddressFormData = {
//   _id: null,
//   address: "",
//   city: "",
//   phone: "",
//   digitalAddress: "",
//   notes: "",
//   type: "home",
// };

// const FETCH_COOLDOWN = 15000;
// const isValidPhone = (phone) => /^[0-9\-\+\s\(\)]{10,15}$/.test(phone);
// const isValidDigitalAddress = (addr) => addr?.length >= 3 && addr?.length <= 20;

// function Address({ onAddressSelect }) {
//   const dispatch = useDispatch();
//   const { addressList, isLoading } = useSelector((state) => state.shopAddress);
//   const lastFetchRef = useRef(0);

//   const [formData, setFormData] = useState(initialAddressFormData);
//   const [isAddingNew, setIsAddingNew] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedAddressId, setSelectedAddressId] = useState(null);

//   useEffect(() => {
//     if (Date.now() - lastFetchRef.current < FETCH_COOLDOWN) return;
//     lastFetchRef.current = Date.now();
//     dispatch(fetchAllAddresses());
//   }, [dispatch]);

//   useEffect(() => {
//     if (addressList.length > 0 && !selectedAddressId && onAddressSelect) {
//       const firstAddress = addressList[0];
//       setSelectedAddressId(firstAddress._id);
//       onAddressSelect(firstAddress);
//     }
//   }, [addressList, onAddressSelect, selectedAddressId]);

//   const filteredAddresses = useMemo(() => {
//     if (!searchQuery.trim()) return addressList;
    
//     const q = searchQuery.toLowerCase();
//     return addressList.filter((addr) => 
//       [addr.address, addr.city, addr.digitalAddress, addr.phone, addr.notes]
//         .some((field) => field?.toLowerCase().includes(q))
//     );
//   }, [addressList, searchQuery]);

//   const isFormValid = useCallback(() => {
//     return !!(
//       formData.address?.trim() && 
//       formData.city?.trim() && 
//       formData.phone?.trim() && 
//       formData.digitalAddress?.trim()
//     );
//   }, [formData]);

//   const isAddLimitReached = !formData._id && addressList.length >= 3;

//   const handleManageAddress = useCallback(async (e) => {
//     e.preventDefault();
    
//     if (!isFormValid()) {
//       toast.error("Please fill in all required fields");
//       return;
//     }
    
//     if (!isValidPhone(formData.phone)) {
//       toast.error("Please enter a valid phone number (10-15 digits)");
//       return;
//     }
    
//     if (!isValidDigitalAddress(formData.digitalAddress)) {
//       toast.error("Digital address must be 3-20 chars");
//       return;
//     }
    
//     if (!formData._id && addressList.length >= 3) {
//       toast.warning("You can only add up to 3 addresses");
//       return;
//     }

//     try {
//       if (formData._id) {
//         await dispatch(editAnAddress({ addressId: formData._id, formData })).unwrap();
//         toast.success("Address updated successfully");
//       } else {
//         await dispatch(addNewAddress(formData)).unwrap();
//         toast.success("Address added successfully");
//       }
      
//       setFormData(initialAddressFormData);
//       setIsAddingNew(false);
//       lastFetchRef.current = 0;
//     } catch (err) {
//       toast.error(err?.message || "Operation failed");
//     }
//   }, [formData, addressList.length, dispatch]);

//   const handleDeleteAddress = useCallback(async (addressId) => {
//     try {
//       await dispatch(deleteAddress(addressId)).unwrap();
//       toast.success("Address deleted successfully");

//       if (formData._id === addressId) {
//         setFormData(initialAddressFormData);
//       }
      
//       if (selectedAddressId === addressId) {
//         setSelectedAddressId(null);
//         onAddressSelect?.(null);
//       }
      
//       lastFetchRef.current = 0;
//     } catch {
//       toast.error("Failed to delete address");
//     }
//   }, [dispatch, formData._id, selectedAddressId, onAddressSelect]);

//   const handleSetDefault = useCallback(() => {
//     toast.info("Default address feature coming soon");
//   }, []);

//   const handleAddressClick = useCallback((addr) => {
//     setSelectedAddressId(addr._id);
//     onAddressSelect?.(addr);
//   }, [onAddressSelect]);

//   const handleEditAddress = useCallback((data) => {
//     setFormData(data);
//     setIsAddingNew(true);
//   }, []);

//   const handleCancelForm = useCallback(() => {
//     setFormData(initialAddressFormData);
//     setIsAddingNew(false);
//   }, []);

//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//           <div>
//             <CardTitle className="text-2xl font-bold">My Addresses</CardTitle>
//             <CardDescription>
//               {onAddressSelect ? "Select a shipping address for checkout" : "Manage your delivery addresses"}
//             </CardDescription>
//           </div>
//           {!isAddingNew && addressList.length < 3 && (
//             <Button onClick={() => setIsAddingNew(true)} className="gap-2">
//               <Plus className="h-4 w-4" /> Add New Address
//             </Button>
//           )}
//         </div>
//       </CardHeader>

//       <CardContent className="space-y-8">
//         {onAddressSelect && selectedAddressId && (
//           <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
//             <CheckCircle className="h-5 w-5 text-green-600" />
//             <p className="text-sm text-green-800">Address selected for checkout</p>
//           </div>
//         )}

//         {addressList.length > 0 && (
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search addresses..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10"
//             />
//           </div>
//         )}

//         {addressList.length >= 3 && (
//           <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
//             <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
//             <div>
//               <p className="font-medium text-amber-800">Address Limit Reached</p>
//               <p className="text-sm text-amber-700">
//                 You can only store up to 3 addresses. Delete an existing address to add a new one.
//               </p>
//             </div>
//           </div>
//         )}

//         {isLoading ? (
//           <div className="text-center py-12">
//             <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
//             <p className="mt-2 text-muted-foreground">Loading addresses...</p>
//           </div>
//         ) : filteredAddresses.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredAddresses.map((addr) => (
//               <div 
//                 key={addr._id} 
//                 onClick={() => onAddressSelect && handleAddressClick(addr)} 
//                 className="cursor-pointer"
//               >
//                 <AddressCard
//                   addressInfo={addr}
//                   setFormData={handleEditAddress}
//                   handleDeleteAddress={handleDeleteAddress}
//                   isDefault={addr.isDefault}
//                   onSetDefault={handleSetDefault}
//                   isSelected={onAddressSelect && selectedAddressId === addr._id}
//                 />
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-12 border-2 border-dashed rounded-xl">
//             <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
//               <MapPin className="h-8 w-8 text-muted-foreground" />
//             </div>
//             <h3 className="text-lg font-semibold mb-2">
//               {searchQuery ? "No matching addresses" : "No addresses saved"}
//             </h3>
//             <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
//               {searchQuery ? "Try adjusting your search term." : "Add your delivery addresses for faster checkout"}
//             </p>
//             {!searchQuery && addressList.length < 3 && (
//               <Button onClick={() => setIsAddingNew(true)} className="gap-2">
//                 <Plus className="h-4 w-4" /> Add Your First Address
//               </Button>
//             )}
//           </div>
//         )}

//         {(isAddingNew || formData._id) && (
//           <div className="border-t pt-8">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-lg font-semibold">
//                 {formData._id ? "Edit Address" : "Add New Address"}
//               </h3>
//               <Button variant="ghost" size="sm" onClick={handleCancelForm}>
//                 Cancel
//               </Button>
//             </div>
//             <CommonForm
//               formControls={addressFormControls}
//               formData={formData}
//               setFormData={setFormData}
//               buttonText={formData._id ? "Update Address" : "Save Address"}
//               onSubmit={handleManageAddress}
//               isBtnDisabled={!isFormValid() || isLoading || isAddLimitReached}
//               loading={isLoading}
//             />
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

// export default Address;







// import { useEffect, useState, useRef, useCallback, useMemo } from "react";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
// import CommonForm from "../common/form";
// import AddressCard from "./address-card";
// import { addressFormControls } from "@/config";
// import { useDispatch, useSelector } from "react-redux";
// import { addNewAddress, fetchAllAddresses, editAnAddress, deleteAddress } from "@/store/shop/address-slice";
// import { toast } from "sonner";
// import { Button } from "../ui/button";
// import { Plus, MapPin, AlertCircle, Search, CheckCircle, Info } from "lucide-react";
// import { Input } from "../ui/input";

// const initialAddressFormData = {
//   _id: null,
//   address: "",
//   city: "",
//   phone: "",
//   digitalAddress: "",
//   notes: "",
//   type: "home",
// };

// const FETCH_COOLDOWN = 15000;

// // Ghana district codes (comprehensive list from all regions)
// const DISTRICT_CODES = new Set([
//   // Ashanti Region
//   "A2", "A3", "A4", "A5", "A6", "A7", "A8", "AA", "AAF", "AAK", "AAM", "AAS", "AAT",
//   "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AKW", "AL", "AM", "AN",
//   "AO", "AOE", "AOK", "AOT", "AP", "AQ", "AR", "AS", "ASU", "AT", "AU", "AV", "AW",
//   "AX", "AY", "AZ",
//   // Bono Region
//   "BA", "BB", "BC", "BD", "BE", "BF", "BI", "BJ", "BS", "BW", "BY", "BZ",
//   // Central Region
//   "CA", "CB", "CC", "CE", "CF", "CG", "CH", "CI", "CJ", "CK", "CL", "CM", "CN", "CO",
//   "CP", "CR", "CS", "CT", "CU", "CV", "CW", "CX",
//   // Eastern Region
//   "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9", "EA", "EB", "EC", "ED", "EF", "EG",
//   "EH", "EI", "EJ", "EK", "EL", "EM", "EN", "EO", "EP", "EQ", "ER", "ES", "ET", "EU",
//   "EV", "EW", "EX", "EY", "EZ",
//   // Greater Accra Region
//   "G2", "G3", "G4", "G6", "G7", "GA", "GB", "GC", "GD", "GE", "GF", "GG", "GI", "GJ",
//   "GK", "GL", "GM", "GN", "GO", "GQ", "GR", "GS", "GT", "GU", "GV", "GW", "GX", "GY", "GZ",
//   // Ahafo Region
//   "HA", "HB", "HQ", "HR", "HS", "HT",
//   // North East Region
//   "MC", "ME", "MM", "MP", "MW", "MY",
//   // Northern Region
//   "NA", "NF", "NG", "NI", "NK", "NL", "NN", "NO", "NR", "NS", "NT", "NU", "NV", "NX", "NY", "NZ",
//   // Oti Region
//   "OB", "OE", "OG", "OJ", "OK", "ON", "OQ", "OS", "OW",
//   // Savannah Region
//   "SB", "SE", "SG", "SJ", "SN", "SS", "SW",
//   // Bono East Region
//   "TA", "TE", "TK", "TL", "TN", "TO", "TP", "TS", "TT", "TW", "TX",
//   // Upper East Region
//   "UA", "UB", "UE", "UG", "UK", "UL", "UM", "UN", "UO", "UP", "UR", "US", "UT", "UU", "UW",
//   // Volta Region
//   "VA", "VC", "VD", "VE", "VF", "VG", "VH", "VI", "VK", "VN", "VP", "VT", "VU", "VV", "VW", "VX", "VY", "VZ",
//   // Western Region
//   "WE", "WH", "WJ", "WK", "WM", "WN", "WP", "WR", "WS", "WT", "WW", "WX", "WY", "WZ",
//   // Upper West Region
//   "XD", "XJ", "XK", "XL", "XN", "XO", "XS", "XT", "XW", "XX", "XY",
//   // Western North Region
//   "YA", "YB", "YD", "YE", "YJ", "YK", "YS", "YU", "YW"
// ]);

// // Ghana-specific validation functions - case insensitive
// const isValidGhanaPhone = (phone) => {
//   const cleaned = phone.replace(/\s/g, '');
//   const regex = /^(0[2-5][0-9]{8})$|^(\+233[2-5][0-9]{8})$/;
//   return regex.test(cleaned);
// };

// const isValidDigitalAddress = (addr) => {
//   // Format validation: XX-XXXX-XXXX or XXX-XXXX-XXXX
//   const regex = /^([A-Z0-9]{1,3})-([0-9]{4})-([0-9]{4})$/i;
//   const match = addr.match(regex);
  
//   if (!match) return false;
  
//   const districtCode = match[1].toUpperCase();
  
//   // Check if district code exists in our list
//   // Return true even if not in list (for new districts), but validation will show warning
//   return DISTRICT_CODES.has(districtCode);
// };

// // Normalize digital address to uppercase
// const normalizeDigitalAddress = (addr) => {
//   return addr ? addr.toUpperCase().trim() : addr;
// };

// function Address({ onAddressSelect }) {
//   const dispatch = useDispatch();
//   const { addressList, isLoading } = useSelector((state) => state.shopAddress);
//   const lastFetchRef = useRef(0);
//   const formRef = useRef(null);

//   const [formData, setFormData] = useState(initialAddressFormData);
//   const [isAddingNew, setIsAddingNew] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedAddressId, setSelectedAddressId] = useState(null);
//   const [fieldErrors, setFieldErrors] = useState({});

//   // Scroll to form function
//   const scrollToForm = useCallback(() => {
//     setTimeout(() => {
//       if (formRef.current) {
//         formRef.current.scrollIntoView({
//           behavior: "smooth",
//           block: "start",
//         });
//       }
//     }, 100);
//   }, []);

//   useEffect(() => {
//     if (Date.now() - lastFetchRef.current < FETCH_COOLDOWN) return;
//     lastFetchRef.current = Date.now();
//     dispatch(fetchAllAddresses());
//   }, [dispatch]);

//   useEffect(() => {
//     if (addressList.length > 0 && !selectedAddressId && onAddressSelect) {
//       const firstAddress = addressList[0];
//       setSelectedAddressId(firstAddress._id);
//       onAddressSelect(firstAddress);
//     }
//   }, [addressList, onAddressSelect, selectedAddressId]);

//   const filteredAddresses = useMemo(() => {
//     if (!searchQuery.trim()) return addressList;
    
//     const q = searchQuery.toLowerCase();
//     return addressList.filter((addr) => 
//       [addr.address, addr.city, addr.digitalAddress, addr.phone, addr.notes]
//         .some((field) => field?.toLowerCase().includes(q))
//     );
//   }, [addressList, searchQuery]);

//   const validateField = useCallback((fieldName, value) => {
//     switch (fieldName) {
//       case "phone":
//         if (!value?.trim()) return "Phone number is required";
//         if (!isValidGhanaPhone(value)) return "Invalid Ghana phone number. Use format: 0241234567 or +233241234567";
//         return "";
//       case "digitalAddress":
//         if (!value?.trim()) return "Digital address is required";
        
//         const regex = /^([A-Z0-9]{1,3})-([0-9]{4})-([0-9]{4})$/i;
//         const match = value.match(regex);
        
//         if (!match) {
//           return "Invalid digital address. Use GhanaPostGPS format: XX-XXXX-XXXX (e.g., NT-0126-1440)";
//         }
        
//         const districtCode = match[1].toUpperCase();
//         if (!DISTRICT_CODES.has(districtCode)) {
//           return `District code "${districtCode}" may not be valid. Please check your digital address format.`;
//         }
//         return "";
//       case "address":
//         if (!value?.trim()) return "Address is required";
//         return "";
//       case "city":
//         if (!value?.trim()) return "City is required";
//         return "";
//       default:
//         return "";
//     }
//   }, []);

//   const isFormValid = useCallback(() => {
//     const errors = {};
//     let isValid = true;
    
//     const fieldsToValidate = ["address", "city", "phone", "digitalAddress"];
//     for (const field of fieldsToValidate) {
//       const error = validateField(field, formData[field]);
//       if (error) {
//         errors[field] = error;
//         isValid = false;
//       }
//     }
    
//     setFieldErrors(errors);
//     return isValid;
//   }, [formData, validateField]);

//   const handleFieldChange = useCallback((fieldName, value) => {
//     setFormData(prev => ({ ...prev, [fieldName]: value }));
//     const error = validateField(fieldName, value);
//     setFieldErrors(prev => ({ ...prev, [fieldName]: error }));
//   }, [validateField]);

//   const isAddLimitReached = !formData._id && addressList.length >= 3;

//   const handleManageAddress = useCallback(async (e) => {
//     e.preventDefault();
    
//     if (!isFormValid()) {
//       toast.error("Please fix the errors in the form");
//       return;
//     }
    
//     if (!formData._id && addressList.length >= 3) {
//       toast.warning("You can only add up to 3 addresses");
//       return;
//     }

//     try {
//       // Normalize digital address to uppercase before sending
//       const submitData = {
//         ...formData,
//         digitalAddress: normalizeDigitalAddress(formData.digitalAddress)
//       };
      
//       if (formData._id) {
//         await dispatch(editAnAddress({ addressId: formData._id, formData: submitData })).unwrap();
//         toast.success("Address updated successfully");
//       } else {
//         await dispatch(addNewAddress(submitData)).unwrap();
//         toast.success("Address added successfully");
//       }
      
//       setFormData(initialAddressFormData);
//       setFieldErrors({});
//       setIsAddingNew(false);
//       lastFetchRef.current = 0;
//     } catch (err) {
//       toast.error(err?.message || "Operation failed");
//     }
//   }, [formData, addressList.length, dispatch, isFormValid]);

//   const handleDeleteAddress = useCallback(async (addressId) => {
//     try {
//       await dispatch(deleteAddress(addressId)).unwrap();
//       toast.success("Address deleted successfully");

//       if (formData._id === addressId) {
//         setFormData(initialAddressFormData);
//         setFieldErrors({});
//         setIsAddingNew(false);
//       }
      
//       if (selectedAddressId === addressId) {
//         setSelectedAddressId(null);
//         onAddressSelect?.(null);
//       }
      
//       lastFetchRef.current = 0;
//     } catch {
//       toast.error("Failed to delete address");
//     }
//   }, [dispatch, formData._id, selectedAddressId, onAddressSelect]);

//   const handleSetDefault = useCallback(() => {
//     toast.info("Default address feature coming soon");
//   }, []);

//   const handleAddressClick = useCallback((addr) => {
//     setSelectedAddressId(addr._id);
//     onAddressSelect?.(addr);
//   }, [onAddressSelect]);

//   const handleEditAddress = useCallback((data) => {
//     setFormData(data);
//     setFieldErrors({});
//     setIsAddingNew(true);
//     scrollToForm();
//   }, [scrollToForm]);

//   const handleAddNewClick = useCallback(() => {
//     setFormData(initialAddressFormData);
//     setFieldErrors({});
//     setIsAddingNew(true);
//     scrollToForm();
//   }, [scrollToForm]);

//   const handleCancelForm = useCallback(() => {
//     setFormData(initialAddressFormData);
//     setFieldErrors({});
//     setIsAddingNew(false);
//   }, []);

//   // Enhanced form controls with error display
//   const enhancedFormControls = useMemo(() => {
//     return addressFormControls.map(control => ({
//       ...control,
//       error: fieldErrors[control.name],
//       onChange: (e) => handleFieldChange(control.name, e.target.value)
//     }));
//   }, [fieldErrors, handleFieldChange]);

//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//           <div>
//             <CardTitle className="text-2xl font-bold">My Addresses</CardTitle>
//             <CardDescription>
//               {onAddressSelect ? "Select a shipping address for checkout" : "Manage your delivery addresses"}
//             </CardDescription>
//           </div>
//           {!isAddingNew && addressList.length < 3 && (
//             <Button onClick={handleAddNewClick} className="gap-2">
//               <Plus className="h-4 w-4" /> Add New Address
//             </Button>
//           )}
//         </div>
//       </CardHeader>

//       <CardContent className="space-y-8">
//         {onAddressSelect && selectedAddressId && (
//           <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
//             <CheckCircle className="h-5 w-5 text-green-600" />
//             <p className="text-sm text-green-800">Address selected for checkout</p>
//           </div>
//         )}

//         {addressList.length > 0 && (
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search addresses..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10"
//             />
//           </div>
//         )}

//         {addressList.length >= 3 && (
//           <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
//             <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
//             <div>
//               <p className="font-medium text-amber-800">Address Limit Reached</p>
//               <p className="text-sm text-amber-700">
//                 You can only store up to 3 addresses. Delete an existing address to add a new one.
//               </p>
//             </div>
//           </div>
//         )}

//         {isLoading ? (
//           <div className="text-center py-12">
//             <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
//             <p className="mt-2 text-muted-foreground">Loading addresses...</p>
//           </div>
//         ) : filteredAddresses.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredAddresses.map((addr) => (
//               <div 
//                 key={addr._id} 
//                 onClick={() => onAddressSelect && handleAddressClick(addr)} 
//                 className="cursor-pointer"
//               >
//                 <AddressCard
//                   addressInfo={addr}
//                   setFormData={handleEditAddress}
//                   handleDeleteAddress={handleDeleteAddress}
//                   isDefault={addr.isDefault}
//                   onSetDefault={handleSetDefault}
//                   isSelected={onAddressSelect && selectedAddressId === addr._id}
//                 />
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-12 border-2 border-dashed rounded-xl">
//             <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
//               <MapPin className="h-8 w-8 text-muted-foreground" />
//             </div>
//             <h3 className="text-lg font-semibold mb-2">
//               {searchQuery ? "No matching addresses" : "No addresses saved"}
//             </h3>
//             <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
//               {searchQuery ? "Try adjusting your search term." : "Add your delivery addresses for faster checkout"}
//             </p>
//             {!searchQuery && addressList.length < 3 && (
//               <Button onClick={handleAddNewClick} className="gap-2">
//                 <Plus className="h-4 w-4" /> Add Your First Address
//               </Button>
//             )}
//           </div>
//         )}

//         {(isAddingNew || formData._id) && (
//           <div ref={formRef} className="border-t pt-8 scroll-mt-4">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-lg font-semibold">
//                 {formData._id ? "Edit Address" : "Add New Address"}
//               </h3>
//               <Button variant="ghost" size="sm" onClick={handleCancelForm}>
//                 Cancel
//               </Button>
//             </div>
            
//             {/* Format Info Banner */}
//             <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
//               <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
//               <div className="text-xs text-blue-800">
//                 <p className="font-medium mb-1">Format Requirements:</p>
//                 <p>• Digital Address: <strong className="font-mono">XX-XXXX-XXXX</strong> (e.g., NT-0126-1440, AK-644-6263)</p>
//                 <p>• Phone: <strong>0241234567</strong> or <strong>+233241234567</strong> (MTN, Vodafone, AirtelTigo, Glo)</p>
//                 <p className="mt-1 text-blue-600">✓ Digital address will be automatically converted to uppercase</p>
//               </div>
//             </div>
            
//             <CommonForm
//               formControls={addressFormControls}
//               formData={formData}
//               setFormData={setFormData}
//               buttonText={formData._id ? "Update Address" : "Save Address"}
//               onSubmit={handleManageAddress}
//               isBtnDisabled={isLoading || isAddLimitReached}
//               loading={isLoading}
//               fieldErrors={fieldErrors}
//             />
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

// export default Address;




import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import CommonForm from "../common/form";
import AddressCard from "./address-card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { addNewAddress, fetchAllAddresses, editAnAddress, deleteAddress } from "@/store/shop/address-slice";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Plus, MapPin, AlertCircle, Search, CheckCircle, Info } from "lucide-react";
import { Input } from "../ui/input";

const initialAddressFormData = {
  _id: null,
  address: "",
  city: "",
  phone: "",
  digitalAddress: "",
  notes: "",
  type: "home",
};

const FETCH_COOLDOWN = 15000;

// Ghana district codes (comprehensive list from all regions)
const DISTRICT_CODES = new Set([
  // Ashanti Region
  "A2", "A3", "A4", "A5", "A6", "A7", "A8", "AA", "AAF", "AAK", "AAM", "AAS", "AAT",
  "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AKW", "AL", "AM", "AN",
  "AO", "AOE", "AOK", "AOT", "AP", "AQ", "AR", "AS", "ASU", "AT", "AU", "AV", "AW",
  "AX", "AY", "AZ",
  // Bono Region
  "BA", "BB", "BC", "BD", "BE", "BF", "BI", "BJ", "BS", "BW", "BY", "BZ",
  // Central Region
  "CA", "CB", "CC", "CE", "CF", "CG", "CH", "CI", "CJ", "CK", "CL", "CM", "CN", "CO",
  "CP", "CR", "CS", "CT", "CU", "CV", "CW", "CX",
  // Eastern Region
  "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9", "EA", "EB", "EC", "ED", "EF", "EG",
  "EH", "EI", "EJ", "EK", "EL", "EM", "EN", "EO", "EP", "EQ", "ER", "ES", "ET", "EU",
  "EV", "EW", "EX", "EY", "EZ",
  // Greater Accra Region
  "G2", "G3", "G4", "G6", "G7", "GA", "GB", "GC", "GD", "GE", "GF", "GG", "GI", "GJ",
  "GK", "GL", "GM", "GN", "GO", "GQ", "GR", "GS", "GT", "GU", "GV", "GW", "GX", "GY", "GZ",
  // Ahafo Region
  "HA", "HB", "HQ", "HR", "HS", "HT",
  // North East Region
  "MC", "ME", "MM", "MP", "MW", "MY",
  // Northern Region
  "NA", "NF", "NG", "NI", "NK", "NL", "NN", "NO", "NR", "NS", "NT", "NU", "NV", "NX", "NY", "NZ",
  // Oti Region
  "OB", "OE", "OG", "OJ", "OK", "ON", "OQ", "OS", "OW",
  // Savannah Region
  "SB", "SE", "SG", "SJ", "SN", "SS", "SW",
  // Bono East Region
  "TA", "TE", "TK", "TL", "TN", "TO", "TP", "TS", "TT", "TW", "TX",
  // Upper East Region
  "UA", "UB", "UE", "UG", "UK", "UL", "UM", "UN", "UO", "UP", "UR", "US", "UT", "UU", "UW",
  // Volta Region
  "VA", "VC", "VD", "VE", "VF", "VG", "VH", "VI", "VK", "VN", "VP", "VT", "VU", "VV", "VW", "VX", "VY", "VZ",
  // Western Region
  "WE", "WH", "WJ", "WK", "WM", "WN", "WP", "WR", "WS", "WT", "WW", "WX", "WY", "WZ",
  // Upper West Region
  "XD", "XJ", "XK", "XL", "XN", "XO", "XS", "XT", "XW", "XX", "XY",
  // Western North Region
  "YA", "YB", "YD", "YE", "YJ", "YK", "YS", "YU", "YW"
]);

// Ghana-specific validation functions - case insensitive
const isValidGhanaPhone = (phone) => {
  const cleaned = phone.replace(/\s/g, '');
  const regex = /^(0[2-5][0-9]{8})$|^(\+233[2-5][0-9]{8})$/;
  return regex.test(cleaned);
};

const isValidDigitalAddress = (addr) => {
  // Format validation: XX-XXXX-XXXX or XXX-XXXX-XXXX
  const regex = /^([A-Z0-9]{1,3})-([0-9]{4})-([0-9]{4})$/i;
  const match = addr.match(regex);
  
  if (!match) return false;
  
  const districtCode = match[1].toUpperCase();
  
  // Check if district code exists in our list
  return DISTRICT_CODES.has(districtCode);
};

// Normalize digital address to uppercase
const normalizeDigitalAddress = (addr) => {
  return addr ? addr.toUpperCase().trim() : addr;
};

function Address({ onAddressSelect }) {
  const dispatch = useDispatch();
  const { addressList, isLoading } = useSelector((state) => state.shopAddress);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const lastFetchRef = useRef(0);
  const formRef = useRef(null);
  const initialFetchDone = useRef(false);

  const [formData, setFormData] = useState(initialAddressFormData);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Scroll to form function
  const scrollToForm = useCallback(() => {
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  }, []);

  // Fetch addresses when component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated && user && (user?.id || user?._id)) {
      const now = Date.now();
      if (now - lastFetchRef.current >= FETCH_COOLDOWN || !initialFetchDone.current) {
        console.log("Fetching addresses for user:", user.id || user._id);
        lastFetchRef.current = now;
        initialFetchDone.current = true;
        dispatch(fetchAllAddresses());
      }
    }
  }, [dispatch, isAuthenticated, user]);

  // Refetch when user changes (login/logout)
  useEffect(() => {
    if (isAuthenticated && user && (user?.id || user?._id)) {
      initialFetchDone.current = false;
      lastFetchRef.current = 0;
      dispatch(fetchAllAddresses());
    }
  }, [dispatch, isAuthenticated, user]);

  // Auto-select first address for checkout
  useEffect(() => {
    if (addressList.length > 0 && !selectedAddressId && onAddressSelect) {
      const firstAddress = addressList[0];
      setSelectedAddressId(firstAddress._id);
      onAddressSelect(firstAddress);
    }
  }, [addressList, onAddressSelect, selectedAddressId]);

  const filteredAddresses = useMemo(() => {
    if (!searchQuery.trim()) return addressList;
    
    const q = searchQuery.toLowerCase();
    return addressList.filter((addr) => 
      [addr.address, addr.city, addr.digitalAddress, addr.phone, addr.notes]
        .some((field) => field?.toLowerCase().includes(q))
    );
  }, [addressList, searchQuery]);

  const validateField = useCallback((fieldName, value) => {
    switch (fieldName) {
      case "phone":
        if (!value?.trim()) return "Phone number is required";
        if (!isValidGhanaPhone(value)) return "Invalid Ghana phone number. Use format: 0241234567 or +233241234567";
        return "";
      case "digitalAddress":
        if (!value?.trim()) return "Digital address is required";
        
        const regex = /^([A-Z0-9]{1,3})-([0-9]{4})-([0-9]{4})$/i;
        const match = value.match(regex);
        
        if (!match) {
          return "Invalid digital address. Use GhanaPostGPS format: XX-XXXX-XXXX (e.g., NT-0126-1440)";
        }
        
        const districtCode = match[1].toUpperCase();
        if (!DISTRICT_CODES.has(districtCode)) {
          return `District code "${districtCode}" may not be valid. Please check your digital address format.`;
        }
        return "";
      case "address":
        if (!value?.trim()) return "Address is required";
        return "";
      case "city":
        if (!value?.trim()) return "City is required";
        return "";
      default:
        return "";
    }
  }, []);

  const isFormValid = useCallback(() => {
    const errors = {};
    let isValid = true;
    
    const fieldsToValidate = ["address", "city", "phone", "digitalAddress"];
    for (const field of fieldsToValidate) {
      const error = validateField(field, formData[field]);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    }
    
    setFieldErrors(errors);
    return isValid;
  }, [formData, validateField]);

  const handleFieldChange = useCallback((fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    const error = validateField(fieldName, value);
    setFieldErrors(prev => ({ ...prev, [fieldName]: error }));
  }, [validateField]);

  const isAddLimitReached = !formData._id && addressList.length >= 3;

  const handleManageAddress = useCallback(async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    if (!formData._id && addressList.length >= 3) {
      toast.warning("You can only add up to 3 addresses");
      return;
    }

    try {
      // Normalize digital address to uppercase before sending
      const submitData = {
        ...formData,
        digitalAddress: normalizeDigitalAddress(formData.digitalAddress)
      };
      
      if (formData._id) {
        await dispatch(editAnAddress({ addressId: formData._id, formData: submitData })).unwrap();
        toast.success("Address updated successfully");
      } else {
        await dispatch(addNewAddress(submitData)).unwrap();
        toast.success("Address added successfully");
      }
      
      setFormData(initialAddressFormData);
      setFieldErrors({});
      setIsAddingNew(false);
      lastFetchRef.current = 0;
      // Refresh the address list
      dispatch(fetchAllAddresses());
    } catch (err) {
      toast.error(err?.message || "Operation failed");
    }
  }, [formData, addressList.length, dispatch, isFormValid]);

  const handleDeleteAddress = useCallback(async (addressId) => {
    try {
      await dispatch(deleteAddress(addressId)).unwrap();
      toast.success("Address deleted successfully");

      if (formData._id === addressId) {
        setFormData(initialAddressFormData);
        setFieldErrors({});
        setIsAddingNew(false);
      }
      
      if (selectedAddressId === addressId) {
        setSelectedAddressId(null);
        onAddressSelect?.(null);
      }
      
      lastFetchRef.current = 0;
      // Refresh the address list
      dispatch(fetchAllAddresses());
    } catch {
      toast.error("Failed to delete address");
    }
  }, [dispatch, formData._id, selectedAddressId, onAddressSelect]);

  const handleSetDefault = useCallback(() => {
    toast.info("Default address feature coming soon");
  }, []);

  const handleAddressClick = useCallback((addr) => {
    setSelectedAddressId(addr._id);
    onAddressSelect?.(addr);
  }, [onAddressSelect]);

  const handleEditAddress = useCallback((data) => {
    setFormData(data);
    setFieldErrors({});
    setIsAddingNew(true);
    scrollToForm();
  }, [scrollToForm]);

  const handleAddNewClick = useCallback(() => {
    setFormData(initialAddressFormData);
    setFieldErrors({});
    setIsAddingNew(true);
    scrollToForm();
  }, [scrollToForm]);

  const handleCancelForm = useCallback(() => {
    setFormData(initialAddressFormData);
    setFieldErrors({});
    setIsAddingNew(false);
  }, []);

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 gap-4 text-center">
          <MapPin className="h-12 w-12 text-muted-foreground/50" />
          <div>
            <p className="font-medium text-lg">Please log in to view addresses</p>
            <p className="text-sm text-muted-foreground">
              Sign in to manage your delivery addresses
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold">My Addresses</CardTitle>
            <CardDescription>
              {onAddressSelect ? "Select a shipping address for checkout" : "Manage your delivery addresses"}
            </CardDescription>
          </div>
          {!isAddingNew && addressList.length < 3 && (
            <Button onClick={handleAddNewClick} className="gap-2">
              <Plus className="h-4 w-4" /> Add New Address
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {onAddressSelect && selectedAddressId && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-sm text-green-800">Address selected for checkout</p>
          </div>
        )}

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

        {addressList.length >= 3 && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">Address Limit Reached</p>
              <p className="text-sm text-amber-700">
                You can only store up to 3 addresses. Delete an existing address to add a new one.
              </p>
            </div>
          </div>
        )}

        {isLoading && addressList.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            <p className="mt-2 text-muted-foreground">Loading addresses...</p>
          </div>
        ) : filteredAddresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAddresses.map((addr) => (
              <div 
                key={addr._id} 
                onClick={() => onAddressSelect && handleAddressClick(addr)} 
                className="cursor-pointer"
              >
                <AddressCard
                  addressInfo={addr}
                  setFormData={handleEditAddress}
                  handleDeleteAddress={handleDeleteAddress}
                  isDefault={addr.isDefault}
                  onSetDefault={handleSetDefault}
                  isSelected={onAddressSelect && selectedAddressId === addr._id}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-xl">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? "No matching addresses" : "No addresses saved"}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              {searchQuery ? "Try adjusting your search term." : "Add your delivery addresses for faster checkout"}
            </p>
            {!searchQuery && addressList.length < 3 && (
              <Button onClick={handleAddNewClick} className="gap-2">
                <Plus className="h-4 w-4" /> Add Your First Address
              </Button>
            )}
          </div>
        )}

        {(isAddingNew || formData._id) && (
          <div ref={formRef} className="border-t pt-8 scroll-mt-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">
                {formData._id ? "Edit Address" : "Add New Address"}
              </h3>
              <Button variant="ghost" size="sm" onClick={handleCancelForm}>
                Cancel
              </Button>
            </div>
            
            {/* Format Info Banner */}
            <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-800">
                <p className="font-medium mb-1">Format Requirements:</p>
                <p>• Digital Address: <strong className="font-mono">XX-XXXX-XXXX</strong> (e.g., NT-0126-1440, AK-644-6263)</p>
                <p>• Phone: <strong>0241234567</strong> or <strong>+233241234567</strong> (MTN, Vodafone, AirtelTigo, Glo)</p>
                <p className="mt-1 text-blue-600">✓ Digital address will be automatically converted to uppercase</p>
              </div>
            </div>
            
            <CommonForm
              formControls={addressFormControls}
              formData={formData}
              setFormData={setFormData}
              buttonText={formData._id ? "Update Address" : "Save Address"}
              onSubmit={handleManageAddress}
              isBtnDisabled={isLoading || isAddLimitReached}
              loading={isLoading}
              fieldErrors={fieldErrors}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default Address;