// import React from "react";
// import ProductFilter from "./filter";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuRadioGroup,
//   DropdownMenuRadioItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import { ArrowUpDown } from "lucide-react";
// import { sortOptions } from "@/config";

// function ShopListing() {
//   return (
//     <div className="grid  grid-cols-1 md:grid-cols-[150px_1fr] gap-6 p-4 md:p6">
//       <ProductFilter />
//       <div className="bg-background w-full rounded-lg shad-sm">
//         <div className="p-4 border-b flex items-center justify-between">
//           <h2 className="text-lg font-extrabold">All Products</h2>
//           <div className="flex flex-row items-center gap-4">
//             <div className="flex items-center gap-2">
//               <p>10 products</p>
//             </div>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" className="flex items-center gap-2">
//                   <ArrowUpDown />
//                   <span>Sort By</span>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-[175px]">
//                 <DropdownMenuRadioGroup>
//                   {
//                     sortOptions.map(sortItem => <DropdownMenuRadioItem key={sortItem.id}>{sortItem.label}</DropdownMenuRadioItem>)
//                   }
//                 </DropdownMenuRadioGroup>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ShopListing;

import React from "react";
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

function ShopListing() {
  return (
    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-[220px_1fr]
        lg:grid-cols-[260px_1fr]
        gap-4
        md:gap-6
        p-3
        sm:p-4
        md:p-6
      "
    >
      {/* ✅ FILTER SIDEBAR */}
      <div className="w-full">
        <ProductFilter />
      </div>

      {/* ✅ PRODUCT SECTION */}
      <div
        className="
          bg-background
          w-full
          rounded-lg
          shadow-sm
          overflow-hidden
        "
      >
        {/* ✅ HEADER BAR */}
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
          <h2
            className="
              text-base
              sm:text-lg
              font-extrabold
            "
          >
            All Products
          </h2>

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-3
            "
          >
            <div className="flex items-center gap-1 text-sm sm:text-base">
              <p>10 products</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    sm:text-base
                  "
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span>Sort By</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-[175px]"
              >
                <DropdownMenuRadioGroup>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
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

        {/* ✅ PRODUCT GRID WILL GO HERE */}
        <div
          className="
            p-3
            sm:p-4
            md:p-6
          "
        >
          {/* Products will render here */}
        </div>
      </div>
    </div>
  );
}

export default ShopListing;

