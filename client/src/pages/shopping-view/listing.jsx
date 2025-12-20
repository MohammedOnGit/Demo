import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import ProductFilter from "../../components/shoping-view/filter";
import ShoppingProductTile from "../../components/shoping-view/product-tile";
import ProductDetailsDialog from "@/components/shoping-view/product-details";

import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { sortOptions } from "@/config";
import { toast } from "sonner";

/* ---------------- HELPERS ---------------- */
function createSearchParamsHelper(filters) {
  const queryParams = [];
  for (const [key, value] of Object.entries(filters)) {
    if (Array.isArray(value) && value.length > 0) {
      queryParams.push(`${key}=${value.join(",")}`);
    }
  }
  return queryParams.join("&");
}

function parseSearchParamsToFilters(searchParams) {
  const filters = {};
  for (const [key, value] of searchParams.entries()) {
    filters[key] = value.split(",");
  }
  return filters;
}

/* ---------------- SHOPPING LISTING ---------------- */
function ShoppingListing() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { products = [], productDetails = null } = useSelector((state) => state.shopProducts);

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-lowtohigh");
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  /* ---------------- PRODUCT DETAILS ---------------- */
  const handleGetProductDetails = (productId) => {
    dispatch(fetchProductDetails({ productId }));
  };

  /* ---------------- ADD TO CART ---------------- */
  const handleAddtoCart = (product) => {
    if (!user?.id || !product?._id) return;

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

  /* ---------------- FILTER HANDLER ---------------- */
  const handleFilter = (section, optionId) => {
    const newFilters = { ...filters };
    if (!newFilters[section]) newFilters[section] = [optionId];
    else if (newFilters[section].includes(optionId)) newFilters[section] = newFilters[section].filter((id) => id !== optionId);
    else newFilters[section].push(optionId);

    if (newFilters[section]?.length === 0) delete newFilters[section];

    setFilters(newFilters);
    sessionStorage.setItem("shop-filters", JSON.stringify(newFilters));
  };

  /* ---------------- LOAD FILTERS FROM URL OR SESSION ---------------- */
  useEffect(() => {
    const urlFilters = parseSearchParamsToFilters(searchParams);

    if (Object.keys(urlFilters).length > 0) {
      setFilters(urlFilters);
    } else {
      // fallback to sessionStorage
      setFilters(JSON.parse(sessionStorage.getItem("shop-filters")) || {});
    }

    setSort(sessionStorage.getItem("shop-sort") || "price-lowtohigh");
  }, [searchParams]);

  /* ---------------- SYNC FILTERS TO URL ---------------- */
  useEffect(() => {
    const queryString = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(queryString));
  }, [filters, setSearchParams]);

  /* ---------------- FETCH PRODUCTS ---------------- */
  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: filters, sortParam: sort }));
  }, [dispatch, filters, sort]);

  /* ---------------- OPEN PRODUCT DETAILS ---------------- */
  useEffect(() => {
    if (productDetails) setOpenDetailsDialog(true);
  }, [productDetails]);

  /* ---------------- RENDER ---------------- */
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 p-4">
      <ProductFilter filters={filters} handleFilter={handleFilter} />

      <div className="bg-background rounded-xl shadow-sm">
        {/* TOP BAR */}
        <div className="flex justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">All Products</h2>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ArrowUpDown className="w-4 h-4 mr-2" /> Sort
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={sort}
                onValueChange={(value) => {
                  setSort(value);
                  sessionStorage.setItem("shop-sort", value);
                }}
              >
                {sortOptions.map((sortItem) => (
                  <DropdownMenuRadioItem key={sortItem.id} value={sortItem.id}>
                    {sortItem.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
          {products.length > 0 ? (
            products.map((product) => (
              <ShoppingProductTile
                key={product._id}
                product={product}
                handleGetProductDetails={handleGetProductDetails}
                handleAddtoCart={handleAddtoCart}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground">
              No products found
            </p>
          )}
        </div>
      </div>

      {/* PRODUCT DETAILS DIALOG */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
        handleAddtoCart={handleAddtoCart}
      />
    </div>
  );
}

export default ShoppingListing;
