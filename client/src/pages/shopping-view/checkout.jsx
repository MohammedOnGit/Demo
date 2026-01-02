// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import malikImg from "@/assets/ban/malik.webp";
// import Address from "@/components/shoping-view/address";
// import UserCartItemsContent from "@/components/shoping-view/cart-items-content";
// import { fetchCartItems } from "@/store/shop/cart-slice"; // CHANGED: fetchCartItems to fetchCart
// import { Button } from "@/components/ui/button";

// function ShoppingCheckout() {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
//   const { items: cartItems = [], isLoading } = useSelector((state) => state.shopCart || {}); // CHANGED: cartItems to items

//   useEffect(() => {
//     if (user?.id) {
//       dispatch(fetchCartItems(user.id)); // CHANGED: fetchCartItems to fetchCart
//     }
//   }, [dispatch, user?.id]);

//   // Calculate total
//   const totalCartAmount =
//     cartItems && cartItems.length > 0
//       ? cartItems.reduce(
//           (sum, currentItem) =>
//             sum +
//             (currentItem?.salePrice > 0
//               ? currentItem.salePrice * currentItem.quantity
//               : currentItem.price * currentItem.quantity),
//           0
//         )
//       : 0;

//   return (
//     <div className="flex flex-col w-full">
//       {/* Banner */}
//       <div className="relative w-full overflow-hidden h-[200px] sm:h-[260px] md:h-[320px] lg:h-96">
//         <img
//           src={malikImg}
//           alt="Shopping banner showing products"
//           className="absolute inset-0 w-full h-full object-cover lg:object-top"
//           loading="lazy"
//         />
//         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
//       </div>

//       {/* Content */}
//       <div className="w-full px-4 sm:px-6 md:px-8 lg:px-8 mt-5">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Address Section */}
//           <div className="lg:sticky lg:top-5">
//             <Address />
//           </div>

//           {/* Cart Items Section */}
//           <div className="flex flex-col border rounded p-2 max-h-[80vh]">
//             {isLoading ? (
//               <div className="flex justify-center items-center h-full">
//                 <span className="text-gray-500">Loading cart items...</span>
//               </div>
//             ) : cartItems && cartItems.length > 0 ? (
//               <>
//                 {/* Scrollable Cart Items List */}
//                 <div className="flex-1 overflow-y-auto space-y-3 px-4 py-2 bg-gray-50 rounded">
//                   {cartItems.map((item) => (
//                     <UserCartItemsContent key={item.productId || item._id} cartItem={item} />
//                   ))}
//                 </div>

//                 {/* Sticky Total & Checkout */}
//                 <div className="mt-4 border-t bg-white px-4 py-4 sticky bottom-0 z-10 shadow-md">
//                   <div className="flex justify-between mb-3 text-lg font-semibold">
//                     <span>Total</span>
//                     <span>GHC {totalCartAmount.toFixed(2)}</span>
//                   </div>
//                   <Button
//                     className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
//                     aria-label="Proceed to checkout"
//                   >
//                     Proceed to Checkout
//                   </Button>
//                 </div>
//               </>
//             ) : (
//               <div className="flex flex-col justify-center items-center h-full py-10 text-center text-gray-500">
//                 <p className="mb-4">Your cart is empty</p>
//                 <Button className="bg-blue-600 hover:bg-blue-700">
//                   Continue Shopping
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ShoppingCheckout;



// pages/shopping-view/checkout.jsx - UPDATE THIS FILE
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import malikImg from "@/assets/ban/malik.webp";
import Address from "@/components/shoping-view/address";
import UserCartItemsContent from "@/components/shoping-view/cart-items-content";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";

function ShoppingCheckout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items: cartItems = [], isLoading } = useSelector((state) => state.shopCart || {});

  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  const totalCartAmount = cartItems && cartItems.length > 0
    ? cartItems.reduce(
        (sum, currentItem) =>
          sum +
          (currentItem?.salePrice > 0
            ? currentItem.salePrice * currentItem.quantity
            : currentItem.price * currentItem.quantity),
        0
      )
    : 0;

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      toast.error("Please select a shipping address");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!user?.id) {
      toast.error("Please log in to continue");
      navigate("/auth/login");
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        userId: user.id,
        cartItems: cartItems.map(item => ({
          productId: item.productId || item._id,
          title: item.title,
          image: item.image,
          price: item.price,
          salePrice: item.salePrice || item.price,
          quantity: item.quantity
        })),
        addressInfo: {
          addressId: selectedAddress._id,
          address: selectedAddress.address,
          city: selectedAddress.city,
          digitalAddress: selectedAddress.digitalAddress || "",
          phone: selectedAddress.phone,
          notes: selectedAddress.notes || ""
        },
        paymentMethod: "paypal",
        totalAmount: totalCartAmount,
        customerEmail: user.email
      };

      const response = await fetch("http://localhost:5000/api/shop/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = data.approvalUrl;
      } else {
        toast.error(data.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("An error occurred during checkout");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Banner */}
      <div className="relative w-full overflow-hidden h-[200px] sm:h-[260px] md:h-[320px] lg:h-96">
        <img
          src={malikImg}
          alt="Shopping banner showing products"
          className="absolute inset-0 w-full h-full object-cover lg:object-top"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
      </div>

      {/* Content */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-8 mt-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Address Section */}
          <div className="lg:sticky lg:top-5">
            <Address onAddressSelect={handleAddressSelect} />
          </div>

          {/* Cart Items Section */}
          <div className="flex flex-col border rounded p-2 max-h-[80vh]">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <span className="text-gray-500">Loading cart items...</span>
              </div>
            ) : cartItems && cartItems.length > 0 ? (
              <>
                {/* Scrollable Cart Items List */}
                <div className="flex-1 overflow-y-auto space-y-3 px-4 py-2 bg-gray-50 rounded">
                  {cartItems.map((item) => (
                    <UserCartItemsContent key={item.productId || item._id} cartItem={item} />
                  ))}
                </div>

                {/* Sticky Total & Checkout */}
                <div className="mt-4 border-t bg-white px-4 py-4 sticky bottom-0 z-10 shadow-md">
                  {/* Address Selection Alert */}
                  {!selectedAddress && (
                    <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-amber-800">
                          Please select a shipping address from the left panel
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Selected Address Display */}
                  {selectedAddress && (
                    <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-medium text-green-800 mb-1">
                        Shipping to:
                      </p>
                      <p className="text-sm text-green-700">
                        {selectedAddress.address}, {selectedAddress.city}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between mb-3 text-lg font-semibold">
                    <span>Total</span>
                    <span>GHC {totalCartAmount.toFixed(2)}</span>
                  </div>

                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                    aria-label="Proceed to checkout"
                    onClick={handleCheckout}
                    disabled={isProcessing || !selectedAddress}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Proceed to Checkout"
                    )}
                  </Button>

                  {!selectedAddress && cartItems.length > 0 && (
                    <p className="text-sm text-amber-600 mt-2 text-center">
                      Select an address to continue
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col justify-center items-center h-full py-10 text-center text-gray-500">
                <p className="mb-4">Your cart is empty</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate("/shop")}
                >
                  Continue Shopping
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;