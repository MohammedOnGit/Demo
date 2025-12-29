
import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Filter,
  X,
  Heart,
  ShoppingBag,
  ChevronDown,
  RefreshCw,
  Package,
  Truck,
  Shield,
  Award,
  ChevronLeft,
  ChevronRight,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  performSearch,
  setFilters,
  resetFilters,
  clearSearch,
  addRecentSearch,
  setPage,
  fetchPopularSearches
} from "@/store/shop/search-slice";
import { addToWishlist, removeFromWishlist, fetchWishlist } from "@/store/shop/wishlist-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const {
    searchQuery,
    searchResults,
    isLoading,
    filters,
    popularSearches,
    pagination
  } = useSelector((state) => state.search);
  
  const { user } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist || { items: [] });
  
  const [localQuery, setLocalQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [priceRange, setPriceRange] = useState([filters.minPrice, filters.maxPrice]);

  // Extract query from URL on mount
  useEffect(() => {
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const brand = searchParams.get('brand') || '';
    const page = searchParams.get('page') || 1;
    
    setLocalQuery(query);
    
    const newFilters = {};
    if (category) {
      newFilters.category = [category];
    }
    if (brand) {
      newFilters.brand = [brand];
    }
    
    // Load popular searches
    dispatch(fetchPopularSearches());
    
    // Fetch wishlist if user is logged in
    if (user) {
      dispatch(fetchWishlist());
    }
    
    // Perform search if there's a query or filters
    if (query || category || brand) {
      dispatch(performSearch({ 
        query, 
        filters: newFilters,
        page: Number(page),
        limit: 20 
      }));
      if (query) {
        dispatch(addRecentSearch(query));
      }
    }
    
    return () => {
      dispatch(clearSearch());
    };
  }, [dispatch, user]);

  // Handle wishlist toggle
  const handleWishlistToggle = (productId, e) => {
    e?.stopPropagation();
    
    if (!user?.id) {
      toast.info("Please login to save items");
      return;
    }

    const isInWishlist = wishlistItems?.some(item => {
      const itemProductId = item.product?._id || item.productId || item._id;
      return itemProductId === productId;
    });

    if (isInWishlist) {
      dispatch(removeFromWishlist(productId))
        .unwrap()
        .then(() => {
          toast.success("Removed from wishlist");
        })
        .catch((error) => {
          console.error("Remove from wishlist error:", error);
          toast.error("Failed to remove from wishlist");
        });
    } else {
      dispatch(addToWishlist(productId))
        .unwrap()
        .then(() => {
          toast.success("Added to wishlist");
        })
        .catch((error) => {
          console.error("Add to wishlist error:", error);
          toast.error("Failed to add to wishlist");
        });
    }
  };

  // Handle add to cart
  const handleAddToCart = (product, e) => {
    e?.stopPropagation();
    
    if (!user?.id || !product?._id) {
      toast.info("Please login to add items to cart");
      return;
    }

    dispatch(addToCart({ userId: user.id, productId: product._id, quantity: 1 }))
      .then((res) => {
        if (res?.meta?.requestStatus === "fulfilled") {
          dispatch(fetchCartItems(user.id));
          toast.success("", { description: `${product.title} added successfully` });
        } else {
          toast.error("Failed to add to cart");
        }
      });
  };

  // Handle search submission
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    const trimmedQuery = localQuery.trim();
    
    const params = new URLSearchParams();
    if (trimmedQuery) params.set('q', trimmedQuery);
    
    // Add filters to URL
    if (filters.category && filters.category.length > 0) {
      params.set('category', filters.category[0]);
    }
    if (filters.brand && filters.brand.length > 0) {
      params.set('brand', filters.brand[0]);
    }
    params.set('page', '1'); // Reset to first page on new search
    
    setSearchParams(params);
    dispatch(setPage(1));
    dispatch(performSearch({ 
      query: trimmedQuery, 
      filters,
      page: 1,
      limit: 20 
    }));
  }, [localQuery, filters, dispatch, setSearchParams]);

  // Update filters
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    dispatch(setFilters(newFilters));
  };

  // Apply filters and search
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (localQuery.trim()) params.set('q', localQuery.trim());
    params.set('page', '1');
    
    setSearchParams(params);
    dispatch(setPage(1));
    dispatch(performSearch({ 
      query: localQuery.trim(), 
      filters,
      page: 1,
      limit: 20 
    }));
    setShowFilters(false);
  };

  // Clear all filters
  const clearAllFilters = () => {
    dispatch(resetFilters());
    const params = new URLSearchParams();
    if (localQuery.trim()) params.set('q', localQuery.trim());
    params.set('page', '1');
    
    setSearchParams(params);
    dispatch(setPage(1));
    dispatch(performSearch({ 
      query: localQuery.trim(),
      page: 1,
      limit: 20 
    }));
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    setSearchParams(params);
    dispatch(setPage(newPage));
    dispatch(performSearch({ 
      query: localQuery.trim(), 
      filters,
      page: newPage,
      limit: 20 
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get unique categories and brands from all available data (not just current page)
  const categories = [...new Set(searchResults.map(p => p.category))];
  const brands = [...new Set(searchResults.map(p => p.brand).filter(Boolean))];

  // Sort results
  const getSortedResults = () => {
    const results = [...searchResults];
    
    switch (sortBy) {
      case "price-low":
        return results.sort((a, b) => 
          (a.salePrice || a.price) - (b.salePrice || b.price)
        );
      case "price-high":
        return results.sort((a, b) => 
          (b.salePrice || b.price) - (a.salePrice || a.price)
        );
      case "newest":
        return results.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
      default:
        return results;
    }
  };

  const sortedResults = getSortedResults();

  // Format price display
  const formatPrice = (price) => {
    return `GHC ${typeof price === 'number' ? price.toFixed(2) : '0.00'}`;
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems?.some(item => {
      const itemProductId = item.product?._id || item.productId || item._id;
      return itemProductId === productId;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/10">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex-1 max-w-2xl">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  placeholder="Search for products, brands, categories..."
                  className="w-full h-14 px-6 pl-14 rounded-2xl bg-background border-2 focus:border-primary focus:ring-4 focus:ring-primary/10 shadow-sm"
                />
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 px-6 rounded-xl font-medium"
                  size="sm"
                >
                  Search
                </Button>
              </form>
            </div>
            
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-3 h-11 px-4 rounded-xl border-2">
                    <span className="font-medium">Sort by:</span> 
                    {sortBy === 'relevance' ? 'Relevance' : 
                     sortBy === 'price-low' ? 'Price: Low to High' :
                     sortBy === 'price-high' ? 'Price: High to Low' : 'Newest'}
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border-2">
                  <DropdownMenuLabel className="font-semibold">Sort Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={sortBy === 'relevance'}
                    onCheckedChange={() => setSortBy('relevance')}
                    className="py-3 cursor-pointer hover:bg-muted/50"
                  >
                    Relevance
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={sortBy === 'price-low'}
                    onCheckedChange={() => setSortBy('price-low')}
                    className="py-3 cursor-pointer hover:bg-muted/50"
                  >
                    Price: Low to High
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={sortBy === 'price-high'}
                    onCheckedChange={() => setSortBy('price-high')}
                    className="py-3 cursor-pointer hover:bg/muted/50"
                  >
                    Price: High to Low
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={sortBy === 'newest'}
                    onCheckedChange={() => setSortBy('newest')}
                    className="py-3 cursor-pointer hover:bg-muted/50"
                  >
                    Newest First
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button
                variant="outline"
                className="gap-3 h-11 px-4 rounded-xl border-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                <span className="font-medium">Filters</span>
                {(filters.category?.length > 0 || filters.brand?.length > 0 || 
                  filters.minPrice > 0 || filters.maxPrice < 1000 ||
                  filters.inStock || filters.onSale) && (
                  <Badge variant="secondary" className="ml-1 bg-primary text-primary-foreground">
                    {[
                      filters.category?.length || 0,
                      filters.brand?.length || 0,
                      filters.minPrice > 0 ? 1 : 0,
                      filters.maxPrice < 1000 ? 1 : 0,
                      filters.inStock ? 1 : 0,
                      filters.onSale ? 1 : 0
                    ].reduce((a, b) => a + b)}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
          
          {/* Active filters display */}
          {(filters.category?.length > 0 || filters.brand?.length > 0 || 
            filters.minPrice > 0 || filters.maxPrice < 1000 ||
            filters.inStock || filters.onSale) && (
            <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-muted/20 rounded-2xl border">
              <span className="text-sm font-semibold text-muted-foreground">Active filters:</span>
              
              {filters.category?.map(cat => (
                <Badge key={cat} variant="secondary" className="gap-2 px-3 py-1.5 rounded-full border">
                  Category: {cat}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => handleFilterChange('category', filters.category.filter(c => c !== cat))}
                  />
                </Badge>
              ))}
              
              {filters.brand?.map(brand => (
                <Badge key={brand} variant="secondary" className="gap-2 px-3 py-1.5 rounded-full border">
                  Brand: {brand}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => handleFilterChange('brand', filters.brand.filter(b => b !== brand))}
                  />
                </Badge>
              ))}
              
              {(filters.minPrice > 0 || filters.maxPrice < 1000) && (
                <Badge variant="secondary" className="gap-2 px-3 py-1.5 rounded-full border">
                  Price: {formatPrice(filters.minPrice)} - {formatPrice(filters.maxPrice)}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => {
                      handleFilterChange('minPrice', 0);
                      handleFilterChange('maxPrice', 1000);
                    }}
                  />
                </Badge>
              )}
              
              {filters.inStock && (
                <Badge variant="secondary" className="gap-2 px-3 py-1.5 rounded-full border">
                  In Stock
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => handleFilterChange('inStock', false)}
                  />
                </Badge>
              )}
              
              {filters.onSale && (
                <Badge variant="secondary" className="gap-2 px-3 py-1.5 rounded-full border">
                  On Sale
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => handleFilterChange('onSale', false)}
                  />
                </Badge>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="ml-auto text-sm font-medium text-muted-foreground hover:text-primary hover:bg-transparent"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:w-72 flex-shrink-0">
              <Card className="sticky top-24 border-2 shadow-lg rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b">
                    <h3 className="font-bold text-xl">Filters</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-sm font-medium text-muted-foreground hover:text-primary"
                    >
                      Clear all
                    </Button>
                  </div>
                  
                  {/* Categories */}
                  <div className="mb-8">
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <span>Categories</span>
                      <Badge variant="outline" className="ml-1">{categories.length}</Badge>
                    </h4>
                    <div className="space-y-3">
                      {categories.map(category => (
                        <div key={category} className="flex items-center group">
                          <input
                            type="checkbox"
                            id={`cat-${category}`}
                            checked={filters.category?.includes(category)}
                            onChange={(e) => {
                              const newCategories = e.target.checked
                                ? [...(filters.category || []), category]
                                : (filters.category || []).filter(c => c !== category);
                              handleFilterChange('category', newCategories);
                            }}
                            className="h-5 w-5 rounded border-2 border-gray-300 text-primary focus:ring-2 focus:ring-primary/30 cursor-pointer"
                          />
                          <label
                            htmlFor={`cat-${category}`}
                            className="ml-3 text-sm font-medium capitalize cursor-pointer group-hover:text-primary transition-colors"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Brands */}
                  {brands.length > 0 && (
                    <div className="mb-8">
                      <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <span>Brands</span>
                        <Badge variant="outline" className="ml-1">{brands.length}</Badge>
                      </h4>
                      <div className="space-y-3">
                        {brands.map(brand => (
                          <div key={brand} className="flex items-center group">
                            <input
                              type="checkbox"
                              id={`brand-${brand}`}
                              checked={filters.brand?.includes(brand)}
                              onChange={(e) => {
                                const newBrands = e.target.checked
                                  ? [...(filters.brand || []), brand]
                                  : (filters.brand || []).filter(b => b !== brand);
                                handleFilterChange('brand', newBrands);
                              }}
                              className="h-5 w-5 rounded border-2 border-gray-300 text-primary focus:ring-2 focus:ring-primary/30 cursor-pointer"
                            />
                            <label
                              htmlFor={`brand-${brand}`}
                              className="ml-3 text-sm font-medium cursor-pointer group-hover:text-primary transition-colors"
                            >
                              {brand}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Price Range */}
                  <div className="mb-8">
                    <h4 className="font-bold text-lg mb-6">Price Range</h4>
                    <div className="px-2">
                      <div className="mb-6">
                        <Slider
                          defaultValue={[filters.minPrice, filters.maxPrice]}
                          max={1000}
                          step={10}
                          onValueChange={(value) => {
                            setPriceRange(value);
                            handleFilterChange('minPrice', value[0]);
                            handleFilterChange('maxPrice', value[1]);
                          }}
                          className="[&>*:first-child]:h-2"
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm font-medium bg-muted/30 p-3 rounded-xl">
                        <span className="text-primary font-bold">{formatPrice(filters.minPrice)}</span>
                        <span className="text-muted-foreground">to</span>
                        <span className="text-primary font-bold">{formatPrice(filters.maxPrice)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Other Filters */}
                  <div className="space-y-6 mb-8">
                    <div className="flex items-center justify-between p-3 bg-muted/20 rounded-xl">
                      <Label htmlFor="in-stock" className="text-sm font-medium cursor-pointer">
                        In Stock Only
                      </Label>
                      <Switch
                        id="in-stock"
                        checked={filters.inStock}
                        onCheckedChange={(checked) => handleFilterChange('inStock', checked)}
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-muted/20 rounded-xl">
                      <Label htmlFor="on-sale" className="text-sm font-medium cursor-pointer">
                        On Sale
                      </Label>
                      <Switch
                        id="on-sale"
                        checked={filters.onSale}
                        onCheckedChange={(checked) => handleFilterChange('onSale', checked)}
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>
                  </div>
                  
                  <Button
                    onClick={applyFilters}
                    className="w-full h-12 rounded-xl text-base font-semibold shadow-lg"
                  >
                    Apply Filters
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Results Section */}
          <div className="flex-1">
            {/* Results Summary */}
            <div className="mb-8">
              {isLoading ? (
                <div className="flex items-center gap-4">
                  <Skeleton className="h-8 w-64 rounded-lg" />
                  <Skeleton className="h-6 w-48 rounded-lg" />
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {searchQuery ? `Results for "${searchQuery}"` : 'All Products'}
                  </h2>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <p className="text-base font-medium">
                      Showing <span className="text-primary font-bold">{searchResults.length}</span> of{" "}
                      <span className="text-primary font-bold">{pagination.total}</span> product{pagination.total !== 1 ? 's' : ''}
                    </p>
                    {searchQuery && (
                      <span className="text-muted-foreground text-sm sm:ml-2">
                        matching "{searchQuery}"
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
            
            {/* Results Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="overflow-hidden border-2 rounded-2xl shadow-sm">
                    <CardContent className="p-0">
                      <Skeleton className="h-64 w-full rounded-b-none" />
                      <div className="p-5">
                        <Skeleton className="h-4 w-3/4 mb-3" />
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : sortedResults.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {sortedResults.map((product) => {
                    const productInWishlist = isInWishlist(product._id);
                    
                    return (
                      <Card 
                        key={product._id} 
                        className="group overflow-hidden border-2 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-card"
                      >
                        <CardContent className="p-0">
                          {/* Product Image */}
                          <div className="relative overflow-hidden bg-muted/30">
                            <div className="aspect-square">
                              <img
                                src={product.image || "/placeholder.jpg"}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                              {product.salePrice && product.salePrice < product.price && (
                                <Badge className="bg-red-600 text-white font-bold px-3 py-1.5 rounded-full shadow-lg">
                                  Save {formatPrice(product.price - product.salePrice)}
                                </Badge>
                              )}
                              {product.totalStock <= 2 && product.totalStock > 0 && (
                                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 font-medium px-3 py-1.5 rounded-full shadow-sm">
                                  Only {product.totalStock} left
                                </Badge>
                              )}
                            </div>
                            <div className="absolute top-4 right-4 flex flex-col gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className={`h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg hover:scale-110 transition-transform ${
                                  productInWishlist ? "bg-red-50 hover:bg-red-100" : ""
                                }`}
                                onClick={(e) => handleWishlistToggle(product._id, e)}
                              >
                                <Heart 
                                  className={`h-5 w-5 ${
                                    productInWishlist ? "fill-red-500 text-red-500" : ""
                                  }`}
                                />
                              </Button>
                            </div>
                            {product.totalStock === 0 && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <Badge className="bg-destructive text-white font-bold px-4 py-2 text-lg rounded-lg">
                                  Out of Stock
                                </Badge>
                              </div>
                            )}
                          </div>
                          
                          {/* Product Info */}
                          <div className="p-5">
                            <div className="mb-4">
                              <Badge 
                                variant="outline" 
                                className="mb-3 text-xs font-medium px-3 py-1 rounded-full border-primary/30 text-primary"
                              >
                                {product.category}
                              </Badge>
                              <h3 
                                className="font-bold text-base line-clamp-1 mb-2 group-hover:text-primary transition-colors cursor-pointer"
                                onClick={() => navigate(`/shop/product/${product._id}`)}
                              >
                                {product.title}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-4 min-h-[2.5rem]">
                                {product.description}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  {product.salePrice && product.salePrice < product.price ? (
                                    <>
                                      <span className="font-bold text-xl text-primary">
                                        {formatPrice(product.salePrice)}
                                      </span>
                                      <span className="text-sm text-muted-foreground line-through">
                                        {formatPrice(product.price)}
                                      </span>
                                      <Badge variant="secondary" className="ml-2 bg-red-100 text-red-700 text-xs">
                                        -{Math.round((1 - product.salePrice/product.price) * 100)}%
                                      </Badge>
                                    </>
                                  ) : (
                                    <span className="font-bold text-xl text-primary">
                                      {formatPrice(product.price)}
                                    </span>
                                  )}
                                </div>
                                {product.brand && (
                                  <span className="text-xs text-muted-foreground mt-1">
                                    Brand: {product.brand}
                                  </span>
                                )}
                              </div>
                              
                              <Button
                                size="sm"
                                className="gap-2 h-11 px-4 rounded-lg font-semibold shadow-md hover:shadow-lg"
                                onClick={(e) => handleAddToCart(product, e)}
                                disabled={product.totalStock === 0}
                              >
                                <ShoppingBag className="h-4 w-4" />
                                {product.totalStock === 0 ? 'Sold Out' : 'Add to Cart'}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-12 pt-8 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-medium">Page {pagination.page} of {pagination.totalPages}</span>
                      <span className="text-muted-foreground">•</span>
                      <span>{pagination.total} products total</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={!pagination.hasPrev || isLoading}
                        className="gap-2 h-11 px-5 rounded-xl border-2"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="font-medium">Previous</span>
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                          const pageNum = Math.max(1, Math.min(
                            pagination.totalPages - 4,
                            pagination.page - 2
                          )) + i;
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={pagination.page === pageNum ? "default" : "outline"}
                              onClick={() => handlePageChange(pageNum)}
                              disabled={isLoading}
                              className={`h-10 w-10 rounded-lg ${
                                pagination.page === pageNum 
                                  ? "font-bold" 
                                  : "border-2"
                              }`}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={!pagination.hasNext || isLoading}
                        className="gap-2 h-11 px-5 rounded-xl border-2"
                      >
                        <span className="font-medium">Next</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Card className="py-16 border-2 rounded-2xl shadow-lg">
                <CardContent className="text-center p-8">
                  <div className="mx-auto w-32 h-32 bg-muted/30 rounded-full flex items-center justify-center mb-8">
                    <Search className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">No products found</h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
                    {searchQuery
                      ? `We couldn't find any products matching "${searchQuery}". Try different keywords or check out our popular categories.`
                      : 'Try adjusting your filters to find what you\'re looking for.'}
                  </p>
                  
                  {searchQuery && popularSearches.length > 0 && (
                    <div className="mb-10">
                      <p className="text-base font-medium mb-4">Try searching for:</p>
                      <div className="flex flex-wrap justify-center gap-3">
                        {popularSearches.slice(0, 6).map((term) => (
                          <Button
                            key={term}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setLocalQuery(term);
                              const params = new URLSearchParams();
                              params.set('q', term);
                              params.set('page', '1');
                              setSearchParams(params);
                              dispatch(setPage(1));
                              dispatch(performSearch({ 
                                query: term,
                                page: 1,
                                limit: 20 
                              }));
                            }}
                            className="rounded-full px-5 py-2 border-2 hover:border-primary hover:text-primary"
                          >
                            {term}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Button
                    variant="outline"
                    onClick={clearAllFilters}
                    className="gap-3 h-12 px-6 rounded-xl border-2 text-base font-medium"
                  >
                    <RefreshCw className="h-5 w-5" />
                    Clear all filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        {/* Trust Badges */}
        <div className="mt-16 pt-12 border-t">
          <h3 className="text-2xl font-bold text-center mb-10">Why Shop With Us</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-card rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-16 w-16 mx-auto mb-5 bg-primary/10 rounded-full flex items-center justify-center">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-bold text-lg mb-2">Free Shipping</h4>
              <p className="text-sm text-muted-foreground">On orders over GHC 50</p>
            </div>
            
            <div className="text-center p-6 bg-card rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-16 w-16 mx-auto mb-5 bg-primary/10 rounded-full flex items-center justify-center">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-bold text-lg mb-2">Easy Returns</h4>
              <p className="text-sm text-muted-foreground">30-day return policy</p>
            </div>
            
            <div className="text-center p-6 bg-card rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-16 w-16 mx-auto mb-5 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-bold text-lg mb-2">Secure Payment</h4>
              <p className="text-sm text-muted-foreground">100% secure transactions</p>
            </div>
            
            <div className="text-center p-6 bg-card rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-16 w-16 mx-auto mb-5 bg-primary/10 rounded-full flex items-center justify-center">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-bold text-lg mb-2">Quality Guarantee</h4>
              <p className="text-sm text-muted-foreground">Authentic products</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;