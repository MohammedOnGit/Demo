import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import malikImg from "@/assets/ban/malik.webp";
import Address from "@/components/shoping-view/address";
import UserCartItemsContent from "@/components/shoping-view/cart-items-content";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Button } from "@/components/ui/button";

function ShoppingCheckout() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems, isLoading } = useSelector((state) => state.shopCart);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  // Calculate total
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
            <Address />
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
                    <UserCartItemsContent key={item.productId} cartItem={item} />
                  ))}
                </div>

                {/* Sticky Total & Checkout */}
                <div className="mt-4 border-t bg-white px-4 py-4 sticky bottom-0 z-10 shadow-md">
                  <div className="flex justify-between mb-3 text-lg font-semibold">
                    <span>Total</span>
                    <span>GHC {totalCartAmount.toFixed(2)}</span>
                  </div>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                    aria-label="Proceed to checkout"
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col justify-center items-center h-full py-10 text-center text-gray-500">
                <p className="mb-4">Your cart is empty</p>
                <Button className="bg-blue-600 hover:bg-blue-700">
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
