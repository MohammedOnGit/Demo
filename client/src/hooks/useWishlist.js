import { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
  moveToCart,
  moveSelectedToCart,
  clearWishlistError
} from '@/store/shop/wishlist-slice';

export function useWishlist() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items, isLoading, error, wishlistCount } = useSelector((state) => state.wishlist);
  
  const isFetchingRef = useRef(false);
  const abortControllerRef = useRef(null);

  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = null;
    isFetchingRef.current = false;
  }, []);

  const loadWishlist = useCallback(async () => {
    if (!user || isFetchingRef.current) return;
    
    try {
      isFetchingRef.current = true;
      abortControllerRef.current = new AbortController();
      
      await dispatch(fetchWishlist()).unwrap();
      return true;
    } catch (error) {
      console.error("Failed to load wishlist:", error);
      return false;
    } finally {
      cleanup();
    }
  }, [user, dispatch, cleanup]);

  const addItem = useCallback(async (productId) => {
    if (!user) {
      throw new Error("User must be logged in to add to wishlist");
    }
    
    try {
      const result = await dispatch(addToWishlist(productId)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message || "Failed to add to wishlist" };
    }
  }, [user, dispatch]);

  const removeItem = useCallback(async (productId) => {
    if (!user) {
      throw new Error("User must be logged in to remove from wishlist");
    }
    
    try {
      const result = await dispatch(removeFromWishlist(productId)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message || "Failed to remove from wishlist" };
    }
  }, [user, dispatch]);

  const moveItemToCart = useCallback(async (productId, quantity = 1) => {
    if (!user) {
      throw new Error("User must be logged in to move items to cart");
    }
    
    try {
      const result = await dispatch(moveToCart({ productId, quantity })).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message || "Failed to move to cart" };
    }
  }, [user, dispatch]);

  const moveItemsToCart = useCallback(async (productIds) => {
    if (!user) {
      throw new Error("User must be logged in to move items to cart");
    }
    
    if (!productIds || productIds.length === 0) {
      return { success: false, error: "No items selected" };
    }
    
    try {
      const result = await dispatch(moveSelectedToCart(productIds)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message || "Failed to move items to cart" };
    }
  }, [user, dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearWishlistError());
  }, [dispatch]);

  const checkIfInWishlist = useCallback((productId) => {
    if (!productId) return false;
    return items.some(item => 
      item.product?._id === productId || 
      item._id === productId ||
      item.productId === productId
    );
  }, [items]);

  useEffect(() => {
    return () => {
      cleanup();
      clearError();
    };
  }, [cleanup, clearError]);

  return {
    // State
    items,
    isLoading,
    error,
    wishlistCount,
    
    // Actions
    loadWishlist,
    addItem,
    removeItem,
    moveItemToCart,
    moveItemsToCart,
    clearError,
    checkIfInWishlist,
    
    // Derived state
    isEmpty: items.length === 0,
    hasError: !!error,
    
    // Utility functions
    getItemById: (productId) => {
      return items.find(item => 
        item.product?._id === productId || 
        item._id === productId ||
        item.productId === productId
      );
    },
    
    getItemsByCategory: (category) => {
      return items.filter(item => item.product?.category === category);
    },
    
    getTotalValue: () => {
      return items.reduce((total, item) => {
        const price = item.product?.salePrice || item.product?.price || 0;
        return total + price;
      }, 0);
    }
  };
}