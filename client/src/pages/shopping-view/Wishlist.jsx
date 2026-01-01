import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Share2,
  Tag,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Star,
  Filter,
  Grid,
  List,
  ShoppingCart,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  fetchWishlist,
  removeFromWishlist,
  moveToCart,
  moveSelectedToCart  // ADD THIS IMPORT
} from "@/store/shop/wishlist-slice";

const Wishlist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { items, isLoading, error } = useSelector((state) => state.wishlist);
  
  const [selectedItems, setSelectedItems] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [sortBy, setSortBy] = useState("recent");

  // Fetch wishlist on component mount
  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/shop/login");
    }
  }, [user, navigate]);

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(item => item.product?._id || item._id));
    }
  };

  const handleMoveToCart = async (productId) => {
    try {
      await dispatch(moveToCart({ productId, quantity: 1 })).unwrap();
      toast.success("Item moved to cart successfully!");
      setSelectedItems(prev => prev.filter(id => id !== productId));
    } catch (error) {
      console.error("Move to cart error:", error);
      toast.error(error || "Failed to move item to cart");
    }
  };
  
  // UPDATED: Use the batch move action
  const handleMoveSelectedToCart = async () => {
    if (selectedItems.length === 0) return;
    
    try {
      // Use the batch move action instead of multiple individual calls
      const result = await dispatch(moveSelectedToCart(selectedItems)).unwrap();
      
      // Show appropriate message based on result
      if (result.failedItems && result.failedItems.length > 0) {
        const successCount = result.movedItems?.length || 0;
        const failCount = result.failedItems.length;
        
        toast.warning(
          `Moved ${successCount} items. ${failCount} failed.`,
          {
            description: result.failedItems.map(item => 
              `Product ${item.productId}: ${item.reason}`
            ).join(', ')
          }
        );
      } else {
        const movedCount = result.movedItems?.length || selectedItems.length;
        toast.success(`${movedCount} items moved to cart!`);
      }
      
      // Clear selected items
      setSelectedItems([]);
      
    } catch (error) {
      console.error("Move selected to cart error:", error);
      toast.error(error || "Failed to move items to cart");
    }
  };

  const handleRemoveItem = (productId) => {
    setItemToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const confirmRemoveItem = async () => {
    if (itemToDelete) {
      try {
        await dispatch(removeFromWishlist(itemToDelete)).unwrap();
        toast.success("Item removed from wishlist");
        setSelectedItems(prev => prev.filter(id => id !== itemToDelete));
      } catch (error) {
        console.error("Remove item error:", error);
        toast.error("Failed to remove item from wishlist");
      }
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleRemoveSelected = async () => {
    if (selectedItems.length === 0) return;
    
    try {
      // Process removals sequentially to avoid state issues
      let successCount = 0;
      let failedCount = 0;
      
      for (const productId of selectedItems) {
        try {
          await dispatch(removeFromWishlist(productId)).unwrap();
          successCount++;
        } catch (error) {
          console.error(`Failed to remove product ${productId}:`, error);
          failedCount++;
        }
      }
      
      if (failedCount > 0) {
        toast.warning(`Removed ${successCount} items. ${failedCount} failed.`);
      } else {
        toast.success(`${successCount} items removed from wishlist`);
      }
      
      setSelectedItems([]);
    } catch (error) {
      console.error("Remove selected error:", error);
      toast.error("Failed to remove items from wishlist");
    }
  };

  const formatPrice = (price) => {
    return `GHC ${typeof price === 'number' ? price.toFixed(2) : '0.00'}`;
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: "Out of Stock", color: "destructive" };
    if (stock <= 5) return { text: "Low Stock", color: "warning" };
    return { text: "In Stock", color: "success" };
  };

  const getSortedItems = () => {
    let sorted = [...items];
    
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => {
          const priceA = a.product?.salePrice || a.product?.price || 0;
          const priceB = b.product?.salePrice || b.product?.price || 0;
          return priceA - priceB;
        });
      case "price-high":
        return sorted.sort((a, b) => {
          const priceA = a.product?.salePrice || a.product?.price || 0;
          const priceB = b.product?.salePrice || b.product?.price || 0;
          return priceB - priceA;
        });
      case "name":
        return sorted.sort((a, b) => 
          (a.product?.title || "").localeCompare(b.product?.title || "")
        );
      default: // recent
        return sorted.sort((a, b) => 
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
    }
  };

  const sortedItems = getSortedItems();
  const totalValue = items.reduce((sum, item) => {
    const price = item.product?.salePrice || item.product?.price || 0;
    return sum + price;
  }, 0);
  
  const itemsOnSale = items.filter(item => 
    item.product?.salePrice && item.product.salePrice < item.product.price
  ).length;
  
  const inStockItems = items.filter(item => 
    item.product?.totalStock && item.product.totalStock > 0
  ).length;

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/10">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-4 w-64" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6">
                <Skeleton className="h-6 w-32 mb-6" />
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-4">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/10">
        <div className="container mx-auto px-4 py-8">
          <Card className="py-16 border-2 rounded-2xl border-destructive/50 bg-destructive/5">
            <CardContent className="text-center p-8">
              <div className="mx-auto w-32 h-32 bg-destructive/10 rounded-full flex items-center justify-center mb-8">
                <AlertTriangle className="h-16 w-16 text-destructive" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Error Loading Wishlist</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {error}
              </p>
              <Button
                onClick={() => dispatch(fetchWishlist())}
                className="gap-2"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-red-600" fill="currentColor" />
                </div>
                My Wishlist
              </h1>
              <p className="text-muted-foreground">
                Save items you love for later
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortBy("recent")}>
                    Recently Added
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("price-low")}>
                    Price: Low to High
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("price-high")}>
                    Price: High to Low
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("name")}>
                    Alphabetical
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="flex items-center border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="rounded-none h-10 w-10"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="rounded-none h-10 w-10"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <Card className="mb-8 border-2">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {items.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Items</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">
                    {itemsOnSale}
                  </div>
                  <div className="text-sm text-muted-foreground">On Sale</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {inStockItems}
                  </div>
                  <div className="text-sm text-muted-foreground">In Stock</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {formatPrice(totalValue)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Value</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Actions Bar */}
        {items.length > 0 && (
          <div className="mb-8 p-4 bg-muted/30 rounded-2xl border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="select-all"
                    checked={selectedItems.length === items.length && items.length > 0}
                    onChange={handleSelectAll}
                    className="h-5 w-5 rounded border-2"
                  />
                  <label htmlFor="select-all" className="text-sm font-medium">
                    Select All ({selectedItems.length} selected)
                  </label>
                </div>
                
                {selectedItems.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleMoveSelectedToCart}
                      className="gap-2"
                      disabled={isLoading}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Move {selectedItems.length} to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveSelected}
                      className="gap-2 text-destructive border-destructive/50 hover:bg-destructive/10"
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove Selected
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="text-sm text-muted-foreground">
                {items.length} items
              </div>
            </div>
          </div>
        )}
        
        {/* Wishlist Content */}
        {items.length === 0 ? (
          <Card className="py-16 border-2 rounded-2xl">
            <CardContent className="text-center p-8">
              <div className="mx-auto w-32 h-32 bg-muted/30 rounded-full flex items-center justify-center mb-8">
                <Heart className="h-16 w-16 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Your wishlist is empty</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Save items you love by clicking the heart icon on any product page. 
                They'll appear here for easy access later.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => navigate("/shop/listing")}
                  className="gap-2"
                >
                  <ArrowRight className="h-5 w-5" />
                  Start Shopping
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/shop/home")}
                >
                  Browse Collections
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortedItems.map((wishlistItem) => {
              const product = wishlistItem.product || wishlistItem;
              const productId = product?._id || wishlistItem._id;
              const stockStatus = getStockStatus(product?.totalStock || 0);
              
              return (
                <Card key={wishlistItem._id} className="group overflow-hidden border-2 rounded-2xl hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-0">
                    {/* Image Section */}
                    <div className="relative overflow-hidden">
                      <div className="aspect-square">
                        <img
                          src={product?.image || "/placeholder.jpg"}
                          alt={product?.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product?.salePrice && product.salePrice < product.price && (
                          <Badge className="bg-red-600 text-white font-bold px-3 py-1">
                            SALE
                          </Badge>
                        )}
                        <Badge variant={stockStatus.color} className="font-medium">
                          {stockStatus.text}
                        </Badge>
                      </div>
                      
                      {/* Actions */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(productId)}
                          className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      
                      {/* Selection Checkbox */}
                      <div className="absolute top-3 left-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(productId)}
                          onChange={() => handleSelectItem(productId)}
                          className="h-5 w-5 rounded border-2 bg-white"
                        />
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-5">
                      {/* Category & Brand */}
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline" className="text-xs">
                          {product?.category || "Uncategorized"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {product?.brand || "No brand"}
                        </span>
                      </div>
                      
                      {/* Title & Description */}
                      <h3 className="font-bold text-base line-clamp-1 mb-2 hover:text-primary cursor-pointer">
                        {product?.title || "Untitled Product"}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 min-h-[2.5rem]">
                        {product?.description || "No description available"}
                      </p>
                      
                      {/* Price & Actions */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            {product?.salePrice && product.salePrice < product.price ? (
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xl text-primary">
                                  {formatPrice(product.salePrice)}
                                </span>
                                <span className="text-sm text-muted-foreground line-through">
                                  {formatPrice(product.price)}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  Save {Math.round((1 - product.salePrice/product.price) * 100)}%
                                </Badge>
                              </div>
                            ) : (
                              <span className="font-bold text-xl text-primary">
                                {formatPrice(product?.price || 0)}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 gap-2"
                            onClick={() => handleMoveToCart(productId)}
                            disabled={!product?.totalStock || product.totalStock === 0 || isLoading}
                          >
                            <ShoppingBag className="h-4 w-4" />
                            Add to Cart
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => navigate(`/shop/product/${productId}`)}
                          >
                            View Details
                          </Button>
                        </div>
                        
                        {/* Added Date */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              Added {wishlistItem.createdAt ? 
                                new Date(wishlistItem.createdAt).toLocaleDateString() : 
                                "Recently"
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedItems.map((wishlistItem) => {
              const product = wishlistItem.product || wishlistItem;
              const productId = product?._id || wishlistItem._id;
              const stockStatus = getStockStatus(product?.totalStock || 0);
              
              return (
                <Card key={wishlistItem._id} className="border-2 rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Image */}
                      <div className="sm:w-32 sm:h-32 flex-shrink-0">
                        <img
                          src={product?.image || "/placeholder.jpg"}
                          alt={product?.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(productId)}
                                onChange={() => handleSelectItem(productId)}
                                className="h-5 w-5 rounded border-2"
                              />
                              <Badge variant="outline" className="text-xs">
                                {product?.category || "Uncategorized"}
                              </Badge>
                              <Badge variant={stockStatus.color} className="text-xs">
                                {stockStatus.text}
                              </Badge>
                              {product?.salePrice && product.salePrice < product.price && (
                                <Badge className="bg-red-600 text-white text-xs">
                                  SALE
                                </Badge>
                              )}
                            </div>
                            
                            <h3 className="font-bold text-lg mb-2 hover:text-primary cursor-pointer">
                              {product?.title || "Untitled Product"}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              {product?.description || "No description available"}
                            </p>
                            
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Brand:</span>
                                <span className="text-muted-foreground">{product?.brand || "No brand"}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>
                                  Added {wishlistItem.createdAt ? 
                                    new Date(wishlistItem.createdAt).toLocaleDateString() : 
                                    "Recently"
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Price & Actions */}
                          <div className="flex flex-col items-end gap-4">
                            <div className="text-right">
                              {product?.salePrice && product.salePrice < product.price ? (
                                <div>
                                  <div className="font-bold text-xl text-primary">
                                    {formatPrice(product.salePrice)}
                                  </div>
                                  <div className="text-sm text-muted-foreground line-through">
                                    {formatPrice(product.price)}
                                  </div>
                                  <div className="text-xs text-green-600 font-medium">
                                    Save {formatPrice(product.price - product.salePrice)}
                                  </div>
                                </div>
                              ) : (
                                <div className="font-bold text-xl text-primary">
                                  {formatPrice(product?.price || 0)}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleMoveToCart(productId)}
                                disabled={!product?.totalStock || product.totalStock === 0 || isLoading}
                                className="gap-2"
                              >
                                <ShoppingBag className="h-4 w-4" />
                                Add to Cart
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveItem(productId)}
                                className="text-destructive"
                                disabled={isLoading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        
        {/* Bottom Actions */}
        {items.length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <div className="flex flex-col sm:flex-row justify-between gap-6">
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-3">Wishlist Tips</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Items on sale are marked with a red badge
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Low stock items are indicated with a warning badge
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Items will be automatically removed when out of stock
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate("/shop/listing")}
                  className="gap-2"
                >
                  <ArrowRight className="h-4 w-4" />
                  Continue Shopping
                </Button>
                <Button
                  onClick={handleMoveSelectedToCart}
                  disabled={selectedItems.length === 0 || isLoading}
                  className="gap-2"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add {selectedItems.length > 0 ? `${selectedItems.length} Selected` : 'All'} to Cart
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from Wishlist</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this item from your wishlist? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemoveItem}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Wishlist;