import React from "react";
import { useDispatch, useSelector } from "react-redux"; // ✅ FIXED IMPORT

import { Minus, Plus, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";
import { deleteCartItem } from "@/store/shop/cart-slice";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  function handleCartItemDelete(item) {
    if (!user?.id || !item?.productId) return;

    dispatch(
      deleteCartItem({
        userId: user.id,
        productId: item.productId,
      })
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="w-20 h-20 rounded object-cover"
      />

      <div className="flex-1">
        <h1 className="scroll-m-20 text-start font-extrabold tracking-tight">
          {cartItem?.title}
        </h1>

        <div className="flex items-center mt-2 gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
          >
            <Minus className="w-4 h-4" />
          </Button>

          <span className="font-semibold">{cartItem?.quantity}</span>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <p className="font-semibold">
          GHC{" "}
          {(
            (cartItem?.salePrice > 0
              ? cartItem.salePrice
              : cartItem.price) * cartItem.quantity
          ).toFixed(2)}
        </p>

        <TrashIcon
          onClick={() => handleCartItemDelete(cartItem)}
          className="w-5 h-5 mt-4 text-red-500 cursor-pointer"
        />
      </div>
    </div>
  );
}

export default UserCartItemsContent;
