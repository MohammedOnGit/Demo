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

function ShopListing() {
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-lowtohigh");

  function handleSort(value) {
    setSort(value);
    sessionStorage.setItem("shop-sort", value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    let copyFilters = { ...filters };

    // Check if section exists
    const sectionExists = Object.keys(copyFilters).includes(getSectionId);

    if (!sectionExists) {
      copyFilters[getSectionId] = [getCurrentOption];
    } else {
      const options = copyFilters[getSectionId];
      const index = options.indexOf(getCurrentOption);

      if (index === -1) {
        options.push(getCurrentOption);
      } else {
        options.splice(index, 1);
      }

      if (options.length === 0) {
        delete copyFilters[getSectionId];
      }
    }

    setFilters(copyFilters);
    sessionStorage.setItem("shop-filters", JSON.stringify(copyFilters));
  }

  // Load Saved filters + sort
  useEffect(() => {
    const savedFilters =
      JSON.parse(sessionStorage.getItem("shop-filters")) || {};
    const savedSort = sessionStorage.getItem("shop-sort") || "price-lowtohigh";

    setFilters(savedFilters);
    setSort(savedSort);
  }, []);

  // Fetch products whenever filters or sort change
  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filters, sort }));
  }, [dispatch, filters, sort]);

  // Safe selector
  const { products = [] } = useSelector((state) => state.shopProducts || {});

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
      {/* FILTER SIDEBAR */}
      <div className="w-full lg:sticky lg:top-24 h-fit">
        <ProductFilter filters={filters} handleFilter={handleFilter} />
      </div>

      {/* PRODUCT SECTION */}
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
          <h2 className="text-xl font-semibold tracking-tight">
            All Products
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm sm:text-base">{products.length} products</p>

            {/* SORT DROPDOWN */}
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

        {/* PRODUCT GRID */}
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
            products.map((productItem) => (
              <ShoppingProductTile
                key={productItem._id}
                product={productItem}
              />
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
