import React, { useEffect, useState } from "react";
import ProductFilter from "./filter";
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
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import ShoppingProductTile from "./product-tile";
import { useSearchParams } from "react-router-dom";

// -------------------------------------------
// FIXED: Create Search Params Helper
// -------------------------------------------
function createSearchParamsHelper(filters) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filters)) {
    if (Array.isArray(value) && value.length > 0) {
      queryParams.push(`${key}=${encodeURIComponent(value.join(","))}`);
    }
  }

  return queryParams.join("&");
}

function ShopListing() {
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-lowtohigh");

  // FIXED: correct useSearchParams usage
  const [searchParams, setSearchParams] = useSearchParams();

  // -------------------------------------------
  // Handle Sorting
  // -------------------------------------------
  function handleSort(value) {
    setSort(value);
    sessionStorage.setItem("shop-sort", value);
  }

  // -------------------------------------------
  // Handle Filtering
  // -------------------------------------------
  function handleFilter(section, optionId) {
    let newFilters = { ...filters };

    if (!newFilters[section]) {
      newFilters[section] = [optionId];
    } else {
      const exists = newFilters[section].includes(optionId);

      if (exists) {
        newFilters[section] = newFilters[section].filter((id) => id !== optionId);
      } else {
        newFilters[section].push(optionId);
      }

      if (newFilters[section].length === 0) {
        delete newFilters[section];
      }
    }

    setFilters(newFilters);
    sessionStorage.setItem("shop-filters", JSON.stringify(newFilters));
  }

  // -------------------------------------------
  // Load Saved Filters + Sort
  // -------------------------------------------
  useEffect(() => {
    const savedFilters = JSON.parse(sessionStorage.getItem("shop-filters")) || {};
    const savedSort = sessionStorage.getItem("shop-sort") || "price-lowtohigh";

    setFilters(savedFilters);
    setSort(savedSort);
  }, []);

  // -------------------------------------------
  // Update URL Query when Filters Change
  // -------------------------------------------
  useEffect(() => {
    const queryString = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(queryString));
  }, [filters, setSearchParams]);

  // -------------------------------------------
  // Fetch Products
  // -------------------------------------------
  useEffect(() => {
    if(filters !== null && sort !== null)
    dispatch(fetchAllFilteredProducts({ filterParams: filters, sortParam: sort }));
    
  }, [dispatch, filters, sort]);

  const { products = [] } = useSelector(
    (state) => state.shopProducts || {}
  );

  return (
    <div
      className="
      grid
      grid-cols-1
      md:grid-cols-[130px_1fr]
      lg:grid-cols-[260px_1fr]
      gap-4
      md:gap-6
      p-3
      sm:p-4
      md:p-6
    "
    >
      {/* Filter Sidebar */}
      <div className="w-full lg:sticky lg:top-24 h-fit">
        <ProductFilter filters={filters} handleFilter={handleFilter} />
      </div>

      {/* Product Section */}
      <div className="bg-background w-full rounded-xl shadow-sm overflow-hidden">
        <div
          className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-3
          p-3
          sm:p-4
          border-b
        "
        >
          <h2 className="text-xl font-semibold tracking-tight">All Products</h2>

          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm sm:text-base">{products.length} products</p>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 text-sm sm:text-base"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span>Sort By</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-[175px]">
                <DropdownMenuRadioGroup onValueChange={handleSort} value={sort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Product Grid */}
        <div
          className="
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          gap-4
          sm:gap-5
          md:gap-6
          p-3
          sm:p-4
          md:p-6
        "
        >
          {products.length > 0 ? (
            products.map((product) => (
              <ShoppingProductTile key={product._id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground">
              No products found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShopListing;
