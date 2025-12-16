import React from "react";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems = [] }) {
  return (
    <SheetContent side="right" className="w-full max-w-md">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>

      <div className="mt-8 space-y-4 px-4">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <UserCartItemsContent
              key={item.productId}
              cartItem={item}
            />
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            Your cart is empty
          </p>
        )}
      </div>

      <div className="mt-8 space-y-4 mx-4">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">GHC 1000</span>
        </div>
      </div>

      <div className="mx-4">
        <Button className="w-full">Checkout</Button>
      </div>
    </SheetContent>
  );
}

export default UserCartWrapper;
