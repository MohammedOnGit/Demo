import React, { useState, useMemo, useCallback } from "react";
import { Star, Package, Percent, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { addToWishlist, removeFromWishlist } from "@/store/shop/wishlist-slice";

function ShoppingProductTile({ product, handleGetProductDetails, handleAddtoCart }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: wishlistItems, isLoading: wishlistLoading } = useSelector(
    (state) => state.wishlist || { items: [], isLoading: false }
  );

  const [localWishlistLoading, setLocalWishlistLoading] = useState(false);

  // Discount percentage
  const discountPercentage = useMemo(() => {
    if (!product?.price || !product?.salePrice) return 0;
    return Math.round(((product.price - product.salePrice) / product.price) * 100);
  }, [product?.price, product?.salePrice]);

  // Check if product is in wishlist
  const isInWishlist = useMemo(() => {
    if (!wishlistItems || !product) return false;
    const productId = product._id || product.id;
    return wishlistItems.some(
      (item) => (item.product?._id || item._id || item.productId) === productId
    );
  }, [wishlistItems, product]);

  // Toggle wishlist
  const handleWishlistToggle = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();

      if (!user?.id) return toast.info("Please login to save items");
      const productId = product?._id || product?.id;
      if (!productId) return toast.error("Product information is missing");

      setLocalWishlistLoading(true);
      try {
        if (isInWishlist) {
          await dispatch(removeFromWishlist(productId)).unwrap();
          toast.success("Removed from wishlist");
        } else {
          await dispatch(addToWishlist(productId)).unwrap();
          toast.success("Added to wishlist");
        }
      } catch (err) {
        console.error(err);
        toast.error(err?.message || "Failed to update wishlist");
      } finally {
        setLocalWishlistLoading(false);
      }
    },
    [dispatch, isInWishlist, product, user?.id]
  );

  // Cart & details handlers
  const handleAddToCart = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      handleAddtoCart(product);
    },
    [handleAddtoCart, product]
  );

  const handleViewDetails = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleGetProductDetails(product._id || product.id);
    },
    [handleGetProductDetails, product]
  );

  const handleOpenDetails = useCallback(() => {
    handleGetProductDetails(product._id || product.id);
  }, [handleGetProductDetails, product]);

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted cursor-pointer" onClick={handleOpenDetails}>
        <img
          src={product.image || "https://via.placeholder.com/400x400?text=Product"}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => (e.target.src = "https://via.placeholder.com/400x400?text=No+Image")}
        />

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-xs font-bold">
            <Percent className="h-3 w-3 mr-1" /> {discountPercentage}% OFF
          </Badge>
        )}

        {/* Wishlist */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleWishlistToggle}
          disabled={localWishlistLoading || wishlistLoading}
          className={cn(
            "absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm transition-all duration-200",
            "hover:bg-white hover:scale-110 shadow-md",
            isInWishlist && "bg-red-50 hover:bg-red-100",
            (localWishlistLoading || wishlistLoading) && "cursor-not-allowed"
          )}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          {localWishlistLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
              )}
            />
          )}
        </Button>

        {/* Quick Add to Cart overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="w-full px-4 pb-4">
            <Button
              onClick={handleAddToCart}
              className="w-full bg-white text-black hover:bg-white/90 font-medium"
              size="sm"
            >
              <Package className="h-4 w-4 mr-2" /> Add to Cart
            </Button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <CardContent className="p-4 space-y-3">
        {/* Category & Brand */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">{product.category || "Uncategorized"}</Badge>
          {product.brand && <span className="text-xs text-muted-foreground">{product.brand}</span>}
        </div>

        {/* Title */}
        <h3
          className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors cursor-pointer"
          onClick={handleViewDetails}
        >
          {product.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{product.rating?.toFixed(1) || "4.5"}</span>
          <span className="text-xs text-muted-foreground">({product.reviews || 0} reviews)</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold">₵{product.salePrice || product.price}</span>
          {product.salePrice && (
            <>
              <span className="text-sm text-muted-foreground line-through">₵{product.price}</span>
              <span className="text-sm font-semibold text-green-600">
                Save ₵{(product.price - product.salePrice).toFixed(2)}
              </span>
            </>
          )}
        </div>

        {/* Stock */}
        <div className="text-xs">
          {product.totalStock > 0 ? (
            <span className="text-green-600">In Stock ({product.totalStock} available)</span>
          ) : (
            <span className="text-red-600">Out of Stock</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button onClick={handleViewDetails} variant="outline" className="flex-1">View Details</Button>
          <Button onClick={handleAddToCart} className="flex-1 gap-2" disabled={product.totalStock <= 0}>
            <Package className="h-4 w-4" /> Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ShoppingProductTile;
