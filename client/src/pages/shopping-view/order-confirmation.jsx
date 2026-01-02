// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { CheckCircle, ShoppingBag, Home, Package, Clock, Mail, Truck } from "lucide-react";

// function OrderConfirmation() {
//   const { orderId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [order, setOrder] = useState(location.state?.order || null);
//   const [loading, setLoading] = useState(!order);

//   useEffect(() => {
//     if (orderId && !order) {
//       fetchOrderDetails();
//     }
//   }, [orderId]);

//   const fetchOrderDetails = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`http://localhost:5000/api/shop/orders/${orderId}`);
//       const data = await response.json();
//       if (data.success) {
//         setOrder(data.order);
//       }
//     } catch (error) {
//       console.error("Error fetching order:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Prevent multiple fetches
//   useEffect(() => {
//     let isMounted = true;
    
//     const fetchData = async () => {
//       if (orderId && !order && isMounted) {
//         await fetchOrderDetails();
//       }
//     };
    
//     fetchData();
    
//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading order details...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-3xl mx-auto">
//         {/* Success Header */}
//         <div className="text-center mb-8 bg-white p-8 rounded-xl shadow-sm">
//           <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//             <CheckCircle className="h-12 w-12 text-green-600" />
//           </div>
//           <h1 className="text-3xl font-bold mb-3">Payment Successful!</h1>
//           <p className="text-gray-600 mb-4">
//             Thank you for your purchase. Your order has been confirmed.
//           </p>
//           <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg mb-4">
//             <Mail className="h-4 w-4" />
//             <span className="text-sm">Receipt sent to your email</span>
//           </div>
          
//           {order?._id && (
//             <div className="mt-6 p-4 bg-gray-50 rounded-lg inline-block">
//               <p className="text-sm text-gray-500">Order Reference</p>
//               <p className="font-mono font-bold text-lg">{order._id}</p>
//             </div>
//           )}
//         </div>

//         {/* Order Summary Card */}
//         {order && (
//           <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
//             <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
//               <Package className="h-5 w-5" />
//               Order Summary
//             </h2>
            
//             <div className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm text-gray-500">Order Status</p>
//                   <p className="font-medium capitalize">
//                     {order.orderStatus === 'confirmed' && (
//                       <span className="inline-flex items-center gap-1 text-green-600">
//                         <Truck className="h-4 w-4" />
//                         {order.orderStatus}
//                       </span>
//                     )}
//                     {order.orderStatus !== 'confirmed' && order.orderStatus}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Payment Status</p>
//                   <p className="font-medium capitalize text-green-600">
//                     {order.paymentStatus}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Total Amount</p>
//                   <p className="font-bold text-lg">GHC {order.totalAmount?.toFixed(2)}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Order Date</p>
//                   <p>{new Date(order.orderDate).toLocaleDateString()}</p>
//                 </div>
//               </div>
              
//               {order.shippingAddress && (
//                 <div className="pt-4 border-t">
//                   <p className="text-sm text-gray-500 mb-2">Shipping Address</p>
//                   <p className="font-medium">{order.shippingAddress.address}</p>
//                   <p className="text-gray-600">{order.shippingAddress.city}</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row gap-4">
//           <Button
//             onClick={() => navigate("/shop")}
//             className="flex-1 gap-2 py-6 text-lg"
//           >
//             <Home className="h-5 w-5" />
//             Continue Shopping
//           </Button>
//           <Button
//             variant="outline"
//             onClick={() => navigate("/shop/account")}
//             className="flex-1 gap-2 py-6 text-lg"
//           >
//             <ShoppingBag className="h-5 w-5" />
//             View My Orders
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default OrderConfirmation;


import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShoppingBag, Home, Package, Mail, Truck, Loader2 } from "lucide-react";
import { clearCart } from "@/store/shop/cart-slice";
import { clearAllUserData } from "@/store/clear-slice";

function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [isCartCleared, setIsCartCleared] = useState(false);

  useEffect(() => {
    if (!isCartCleared) {
      dispatch(clearCart());
      dispatch(clearAllUserData());
      
      localStorage.removeItem('cartItems');
      localStorage.removeItem('cartLastUpdated');
      
      console.log('🛒 Cart cleared from Redux state on order confirmation');
      setIsCartCleared(true);
    }
  }, [dispatch, isCartCleared]);

  useEffect(() => {
    if (orderId && !order) {
      fetchOrderDetails();
    }
  }, [orderId, order]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/shop/orders/${orderId}`);
      const data = await response.json();
      if (data.success) {
        setOrder(data.order);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      if (orderId && !order && isMounted) {
        await fetchOrderDetails();
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 bg-white p-8 rounded-xl shadow-sm">
          <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Payment Successful!</h1>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg mb-4">
            <Mail className="h-4 w-4" />
            <span className="text-sm">Receipt sent to your email</span>
          </div>
          
          {order?._id && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg inline-block">
              <p className="text-sm text-gray-500">Order Reference</p>
              <p className="font-mono font-bold text-lg">{order._id}</p>
            </div>
          )}
        </div>

        {order && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Summary
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order Status</p>
                  <p className="font-medium capitalize">
                    {order.orderStatus === 'confirmed' && (
                      <span className="inline-flex items-center gap-1 text-green-600">
                        <Truck className="h-4 w-4" />
                        {order.orderStatus}
                      </span>
                    )}
                    {order.orderStatus !== 'confirmed' && order.orderStatus}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <p className="font-medium capitalize text-green-600">
                    {order.paymentStatus}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-bold text-lg">GHC {order.totalAmount?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p>{new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              {order.addressInfo && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-2">Shipping Address</p>
                  <p className="font-medium">{order.addressInfo.address}</p>
                  <p className="text-gray-600">{order.addressInfo.city}</p>
                  {order.addressInfo.phone && (
                    <p className="text-gray-600 mt-1">Phone: {order.addressInfo.phone}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => navigate("/shop")}
            className="flex-1 gap-2 py-6 text-lg"
          >
            <Home className="h-5 w-5" />
            Continue Shopping
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/shop/account")}
            className="flex-1 gap-2 py-6 text-lg"
          >
            <ShoppingBag className="h-5 w-5" />
            View My Orders
          </Button>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;