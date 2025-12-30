import React, { useState, useCallback, useMemo, useEffect } from "react";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import UserCartItemsContent from "./cart-items-content";
import { Separator } from "../ui/separator";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, PackageOpen, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

function UserCartWrapper({ cartItems = [], setOpenCartSheet }) {
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);

  const {
    hasItems,
    totalItems,
    subtotal,
    shippingCost,
    finalTotal,
    remainingForFreeShipping,
  } = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => {
      const price = item.salePrice > 0 ? item.salePrice : item.price;
      return sum + price * item.quantity;
    }, 0);

    const shippingThreshold = 300;
    const shippingCost = subtotal >= shippingThreshold ? 0 : 25;

    return {
      hasItems: cartItems.length > 0,
      totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      shippingCost,
      finalTotal: subtotal + shippingCost,
      remainingForFreeShipping: Math.max(shippingThreshold - subtotal, 0),
    };
  }, [cartItems]);

  const format = useCallback((amount) => `GHC ${amount.toFixed(2)}`, []);

  // Simple fade-out animation when closing normally
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      if (setOpenCartSheet) {
        setOpenCartSheet(false);
      }
    }, 300);
  }, [setOpenCartSheet]);

  // Checkout: Close sheet and navigate
  const checkout = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      if (setOpenCartSheet) {
        setOpenCartSheet(false);
      }
      navigate("/shop/checkout");
    }, 300);
  }, [navigate, setOpenCartSheet]);

  // Reset closing state when cart re-opens
  useEffect(() => {
    setIsClosing(false);
  }, [cartItems.length]);

  return (
    <SheetContent
      side="right"
      className={cn(
        "w-full sm:max-w-md h-full flex flex-col p-0 transition-all duration-300",
        isClosing && "opacity-0 translate-x-full"
      )}
      onCloseAutoFocus={(e) => e.preventDefault()} // Prevent focus issues
      onEscapeKeyDown={handleClose}
      onPointerDownOutside={handleClose}
    >
      {/* Header */}
      <SheetHeader className="border-b px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-muted-foreground" />
          <div>
            <SheetTitle>My Cart</SheetTitle>
            {hasItems && (
              <p className="text-xs text-muted-foreground">
                {totalItems} items · {format(subtotal)}
              </p>
            )}
          </div>
        </div>
        {hasItems && shippingCost > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            Add {format(remainingForFreeShipping)} more for free shipping
          </p>
        )}
      </SheetHeader>

      {/* Body */}
      <div
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-5"
        onWheel={(e) => e.stopPropagation()}
      >
        {hasItems ? (
          cartItems.map((item, i) => (
            <div key={`${item.productId}-${i}`}>
              <UserCartItemsContent cartItem={item} />
              {i < cartItems.length - 1 && <Separator className="my-4" />}
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <PackageOpen className="h-10 w-10 mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Your cart is empty</p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => {
                handleClose();
                navigate("/shop/listing");
              }}
            >
              Browse Products
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      {hasItems && (
        <div className="border-t px-4 py-4 space-y-4 flex-shrink-0">
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{format(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? "FREE" : format(shippingCost)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-primary">{format(finalTotal)}</span>
            </div>
          </div>

          <Button className="w-full h-11" onClick={checkout}>
            <Lock className="h-4 w-4 mr-2" />
            Checkout
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full h-11" 
            onClick={() => {
              handleClose();
              navigate("/shop/cart");
            }}
          >
            View Full Cart
          </Button>
        </div>
      )}
    </SheetContent>
  );
}

export default UserCartWrapper;