import React from "react";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import UserCartItemsContent from "./cart-items-content";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { PackageOpen } from "lucide-react";
import { Separator } from "../ui/separator";
import { useNavigate } from "react-router-dom";

function UserCartWrapper({ cartItems = [] }) {
  // ✅ FIX: invoke the hook
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem.salePrice * currentItem.quantity
              : currentItem.price * currentItem.quantity),
          0
        )
      : 0;

  return (
    <SheetContent side="right" className="w-full max-w-md h-full flex flex-col">
      {/* HEADER */}
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto px-4">
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <React.Fragment key={item.productId}>
              <UserCartItemsContent cartItem={item} />
              {index !== cartItems.length - 1 && (
                <Separator className="my-2" />
              )}
            </React.Fragment>
          ))
        ) : (
          <div className="mt-6">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <PackageOpen size={40} className="mb-2 text-gray-400" />
                </EmptyMedia>
                <EmptyTitle>No data</EmptyTitle>
                <EmptyDescription>No data found</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button>Add data</Button>
              </EmptyContent>
            </Empty>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="border-t mt-4 space-y-4 px-4 py-4">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">GHC {totalCartAmount.toFixed(2)}</span>
        </div>

        <Button
          onClick={() => navigate("/shop/checkout")}
          className="w-full"
          disabled={cartItems.length === 0}
        >
          Checkout
        </Button>
      </div>
    </SheetContent>
  );
}

export default UserCartWrapper;
