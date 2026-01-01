import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {fetchCartItems} from '@/store/shop/cart-slice'; 
import { cartEvents, triggerCartUpdate } from '@/utils/cartEvents';

export function useCartSync() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state?.auth || {});
  const { lastUpdated } = useSelector((state) => state?.shopCart || {}); // Changed from state.cart to state.shopCart

  const syncCart = useCallback(async () => {
    if (user?.id) {
      try {
        await dispatch(fetchCartItems(user.id)).unwrap(); // Changed from fetchCartItems to fetchCart
        // Broadcast cart update
        triggerCartUpdate();
        return true;
      } catch (error) {
        console.error("Failed to sync cart:", error);
        return false;
      }
    }
    return false;
  }, [dispatch, user?.id]);

  // Listen for cart update events
  useEffect(() => {
    const handleCartUpdate = () => {
      if (user?.id) {
        const shouldRefresh = Date.now() - (lastUpdated ? new Date(lastUpdated).getTime() : 0) > 5000;
        if (shouldRefresh) {
          syncCart();
        }
      }
    };

    const unsubscribe = cartEvents.subscribe(handleCartUpdate);
    window.addEventListener('cart-updated', handleCartUpdate);
    
    return () => {
      unsubscribe();
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }, [syncCart, user?.id, lastUpdated]);

  // Initial sync
  useEffect(() => {
    if (user?.id) {
      syncCart();
    }
  }, [syncCart, user?.id]);

  return { syncCart, lastUpdated, triggerCartUpdate };
}