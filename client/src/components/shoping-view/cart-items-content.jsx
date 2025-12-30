import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Minus, Plus, Trash2, Heart } from "lucide-react";
import { Button } from "../ui/button";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { addToWishlist, removeFromWishlist, fetchWishlist } from "@/store/shop/wishlist-slice";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function UserCartItemsContent({ cartItem }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: wishlistItems, isLoading: wishlistLoading } = useSelector(
    (state) => state.wishlist || { items: [], isLoading: false }
  );

  const [isMovingToWishlist, setIsMovingToWishlist] = useState(false);
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user?.id) dispatch(fetchWishlist());
  }, [dispatch, user?.id]);

  const isOnSale = cartItem?.salePrice > 0;
  const displayPrice = isOnSale ? cartItem.salePrice : cartItem.price;
  const totalPrice = displayPrice * cartItem.quantity;

  const isInWishlist = React.useMemo(() => {
    const cartProductId = cartItem?.productId || cartItem?._id;
    return wishlistItems?.some(
      (item) => item.product?._id === cartProductId || item.productId === cartProductId
    );
  }, [wishlistItems, cartItem]);

  const handleCartItemDelete = async () => {
    if (!user?.id || !cartItem?.productId) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteCartItem({ userId: user.id, productId: cartItem.productId })).unwrap();
      toast.success("Item removed");
    } catch {
      toast.error("Failed to remove item");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateQuantity = async (type) => {
    if (!user?.id || !cartItem?.productId) return;
    if (type === "decrement" && cartItem.quantity === 1) return;

    setIsUpdatingQuantity(true);
    const quantity = type === "increment" ? cartItem.quantity + 1 : cartItem.quantity - 1;

    try {
      await dispatch(updateCartQuantity({ userId: user.id, productId: cartItem.productId, quantity })).unwrap();
    } catch {
      toast.error("Failed to update cart");
    } finally {
      setIsUpdatingQuantity(false);
    }
  };

  const moveToWishlist = async () => {
    if (!user?.id) return toast.info("Please login");
    const productId = cartItem?.productId || cartItem?._id;
    setIsMovingToWishlist(true);

    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlist(productId)).unwrap();
        toast.success("Removed from wishlist");
      } else {
        await dispatch(addToWishlist(productId)).unwrap();
        await handleCartItemDelete();
        toast.success("Moved to wishlist");
      }
    } catch {
      toast.error("Wishlist update failed");
    } finally {
      setIsMovingToWishlist(false);
    }
  };

  return (
    <div className="flex gap-4 py-4 border-b">
      {/* Image */}
      <img
        src={cartItem?.image || "https://via.placeholder.com/80"}
        alt={cartItem?.title}
        className="h-20 w-20 rounded-md object-cover bg-muted"
        loading="lazy"
      />

      {/* Info */}
      <div className="flex-1">
        <h3 className="text-sm font-medium line-clamp-2">{cartItem?.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold text-primary">GHC {displayPrice.toFixed(2)}</span>
          {isOnSale && <span className="text-xs line-through text-muted-foreground">GHC {cartItem.price.toFixed(2)}</span>}
        </div>

        <div className="flex items-center gap-2 mt-3">
          <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => handleUpdateQuantity("decrement")} disabled={isUpdatingQuantity || cartItem.quantity === 1}>
            <Minus className="h-3 w-3" />
          </Button>

          <span className="text-sm font-medium">{cartItem.quantity}</span>

          <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => handleUpdateQuantity("increment")} disabled={isUpdatingQuantity}>
            <Plus className="h-3 w-3" />
          </Button>

          <Button variant="ghost" size="sm" className={cn("text-xs", isInWishlist && "text-red-500")} onClick={moveToWishlist} disabled={isMovingToWishlist || wishlistLoading}>
            <Heart className={cn("h-3 w-3 mr-1", isInWishlist && "fill-red-500")} />
            Save
          </Button>
        </div>
      </div>

      {/* Price + Delete */}
      <div className="flex flex-col items-end justify-between">
        <p className="font-semibold text-primary">GHC {totalPrice.toFixed(2)}</p>
        <Button size="icon" variant="ghost" onClick={handleCartItemDelete} disabled={isDeleting} className="text-muted-foreground hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default UserCartItemsContent;
