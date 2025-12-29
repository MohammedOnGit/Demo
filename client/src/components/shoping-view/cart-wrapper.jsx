
// above
import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import UserCartItemsContent from "./cart-items-content";
import { Separator } from "../ui/separator";
import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";
import {
  ShoppingBag,
  PackageOpen,
  X,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

function UserCartWrapper({ cartItems = [], setOpenCartSheet }) {
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);

  const {
    hasItems,
    totalItems,
    totalCartAmount,
    totalSavings,
    shippingThreshold,
    shippingCost,
    finalTotal,
    remainingForFreeShipping,
  } = useMemo(() => {
    const hasItems = cartItems.length > 0;

    const totalItems = hasItems
      ? cartItems.reduce((sum, item) => sum + item.quantity, 0)
      : 0;

    const totalCartAmount = hasItems
      ? cartItems.reduce((sum, item) => {
          const price = item.salePrice > 0 ? item.salePrice : item.price;
          return sum + price * item.quantity;
        }, 0)
      : 0;

    const totalSavings = hasItems
      ? cartItems.reduce((sum, item) => {
          return item.salePrice > 0
            ? sum + (item.price - item.salePrice) * item.quantity
            : sum;
        }, 0)
      : 0;

    const shippingThreshold = 300;
    const shippingCost = totalCartAmount >= shippingThreshold ? 0 : 25;
    const finalTotal = totalCartAmount + shippingCost;
    const remainingForFreeShipping = Math.max(
      shippingThreshold - totalCartAmount,
      0
    );

    return {
      hasItems,
      totalItems,
      totalCartAmount,
      totalSavings,
      shippingThreshold,
      shippingCost,
      finalTotal,
      remainingForFreeShipping,
    };
  }, [cartItems]);

  const formatCurrency = useCallback(
    (amount) => `GHC ${Number(amount || 0).toFixed(2)}`,
    []
  );

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setOpenCartSheet(false);
      setIsClosing(false);
    }, 200);
  }, [setOpenCartSheet]);

  const handleCheckout = useCallback(() => {
    handleClose();
    setTimeout(() => navigate("/shop/checkout"), 250);
  }, [handleClose, navigate]);

  const handleStartShopping = useCallback(() => {
    handleClose();
    setTimeout(() => navigate("/shop/home"), 250);
  }, [handleClose, navigate]);

  return (
    <SheetContent
      side="right"
      className={cn(
        "w-full sm:max-w-md flex flex-col h-full p-0",
        isClosing && "opacity-0"
      )}
    >
      {/* Header */}
      <SheetHeader className="border-b px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-muted-foreground" />
            <div>
              <SheetTitle className="text-lg">My Cart</SheetTitle>
              {hasItems && (
                <p className="text-xs text-muted-foreground">
                  {totalItems} items · {formatCurrency(totalCartAmount)}
                </p>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            aria-label="Close cart"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {hasItems && shippingCost > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            Add {formatCurrency(remainingForFreeShipping)} for free shipping
          </p>
        )}
      </SheetHeader>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        {hasItems ? (
          <div className="space-y-5">
            {cartItems.map((item, index) => (
              <div key={`${item.productId}-${index}`}>
                <UserCartItemsContent cartItem={item} />
                {index < cartItems.length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <PackageOpen className="h-10 w-10 text-muted-foreground mb-3" />
            <h3 className="font-medium mb-1">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Start adding items to your cart
            </p>
            <Button onClick={handleStartShopping}>
              Start Shopping
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      {hasItems && (
        <div className="border-t px-4 py-4 space-y-4 flex-shrink-0">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(totalCartAmount)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>
                {shippingCost === 0
                  ? "FREE"
                  : formatCurrency(shippingCost)}
              </span>
            </div>

            {totalSavings > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Savings</span>
                <span>-{formatCurrency(totalSavings)}</span>
              </div>
            )}

            <Separator />

            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-primary">
                {formatCurrency(finalTotal)}
              </span>
            </div>
          </div>

          <Button
            className="w-full h-11 gap-2"
            onClick={handleCheckout}
          >
            <Lock className="h-4 w-4" />
            Checkout
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleClose}
          >
            Continue Shopping
          </Button>
        </div>
      )}
    </SheetContent>
  );
}

export default UserCartWrapper;
