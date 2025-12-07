import { Separator } from "@/components/ui/separator";
import { filterOptions } from "@/config";
import React, { Fragment } from "react";

function ProductFilter() {
  return (
    <div className="w-38 rounded-lg shadow-md border bg-white overflow-hidden">
      {/* ✅ Header */}
      <div className="px-4 py-3 sm:px-5 sm:py-4 border-b">
        <h1 className="text-base sm:text-lg font-extrabold">Filters</h1>
      </div>

      {/* ✅ Filter Content */}
      <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div className="flex flex-col">
              <h3 className="text-sm sm:text-base font-bold capitalize mb-2">
                {keyItem}
              </h3>

              <div className="grid gap-2">
                {filterOptions[keyItem].map((option, index) => (
                  <div
                    key={`${keyItem}-${index}`}
                    className="flex items-center"
                  >
                    <input
                      type="checkbox"
                      id={`${keyItem}-${index}`}
                      className="h-4 w-4 text-primary border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`${keyItem}-${index}`}
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {option.label ?? option}
                    </label>
                  </div>
                ))}
              </div>
           
            </div>
            <Separator />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
