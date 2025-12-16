import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Minus, Plus, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { toast } from "sonner";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  /* ------------------ DELETE ITEM ------------------ */
  const handleCartItemDelete = (item) => {
    if (!user?.id || !item?.productId) return;

    dispatch(
      deleteCartItem({
        userId: user.id,
        productId: item.productId,
      })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Item removed from cart"); // top-right from global Toaster
      } else {
        toast.error("Failed to remove item");
      }
    });
  };

  /* ------------------ UPDATE QUANTITY ------------------ */
  const handleUpdateQuantity = (item, actionType) => {
    if (!user?.id || !item?.productId) return;

    // Prevent quantity going below 1
    if (actionType === "decrement" && item.quantity === 1) {
      toast.warning("Minimum quantity is 1");
      return;
    }

    const updatedQuantity =
      actionType === "increment"
        ? item.quantity + 1
        : item.quantity - 1;

    dispatch(
      updateCartQuantity({
        userId: user.id,
        productId: item.productId,
        quantity: updatedQuantity,
      })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Cart quantity updated");
      } else {
        toast.error("Failed to update quantity");
      }
    });
  };

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
            onClick={() => handleUpdateQuantity(cartItem, "decrement")}
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            disabled={cartItem?.quantity === 1}
          >
            <Minus className="w-4 h-4" />
          </Button>

          <span className="font-semibold">{cartItem?.quantity}</span>

          <Button
            onClick={() => handleUpdateQuantity(cartItem, "increment")}
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
