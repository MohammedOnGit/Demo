import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import axios from "axios";

function PaystackReturn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");
  
  useEffect(() => {
    const reference = searchParams.get('reference');
    const trxref = searchParams.get('trxref');
    
    const paymentReference = reference || trxref;
    
    if (paymentReference) {
      verifyPayment(paymentReference);
    } else {
      setStatus("failed");
      setTimeout(() => {
        navigate('/shop/paypal-cancel');
      }, 2000);
    }
  }, [searchParams, navigate]);

  const verifyPayment = async (reference) => {
    try {
      setStatus("verifying");
      
      // Call your backend to verify the payment
      const response = await axios.get(`http://localhost:5000/api/shop/verify-payment/${reference}`);
      
      if (response.data.success) {
        setStatus("success");
        
        // Wait a moment to show success message, then redirect
        setTimeout(() => {
          navigate(`/order-confirmation/${response.data.orderId}`, {
            state: { order: response.data.order }
          });
        }, 1500);
      } else {
        setStatus("failed");
        setTimeout(() => {
          navigate('/shop/paypal-cancel');
        }, 2000);
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setStatus("failed");
      setTimeout(() => {
        navigate('/shop/paypal-cancel');
      }, 2000);
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case "verifying":
        return {
          title: "Verifying Payment",
          message: "Please wait while we confirm your payment...",
          icon: <Loader2 className="h-16 w-16 text-blue-500 animate-spin mx-auto mb-4" />
        };
      case "success":
        return {
          title: "Payment Verified!",
          message: "Redirecting to order confirmation...",
          icon: <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        };
      case "failed":
        return {
          title: "Payment Failed",
          message: "Unable to verify payment. Redirecting...",
          icon: <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        };
      default:
        return {
          title: "Processing...",
          message: "Please wait...",
          icon: <Loader2 className="h-16 w-16 text-blue-500 animate-spin mx-auto mb-4" />
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md">
        {statusInfo.icon}
        <h1 className="text-2xl font-bold mb-2">{statusInfo.title}</h1>
        <p className="text-gray-600 mb-6">{statusInfo.message}</p>
        
        {status === "verifying" && (
          <div className="space-y-2">
            <div className="h-1 w-full bg-gray-200 rounded overflow-hidden">
              <div className="h-full bg-blue-500 animate-pulse"></div>
            </div>
            <p className="text-xs text-gray-500">This may take a few seconds</p>
          </div>
        )}
        
        {status === "failed" && (
          <button
            onClick={() => navigate('/shop/checkout')}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Return to Checkout
          </button>
        )}
      </div>
    </div>
  );
}

export default PaystackReturn;