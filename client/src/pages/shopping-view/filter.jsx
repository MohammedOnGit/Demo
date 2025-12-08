import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { filterOptions } from "@/config";
import React, { Fragment } from "react";

function ProductFilter({ filters, handleFilter }) {
  return (
    <div className="w-26 md:w-36 rounded-lg shadow-md border bg-white overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 sm:px-5 sm:py-4 border-b">
        <h2 className="text-sm sm:text-base font-semibold tracking-tight">
          Filters
        </h2>
      </div>

      {/* Filter Content */}
      <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div className="flex flex-col">
              <h3 className="text-base sm:text-xl font-semibold tracking-tight">
                {keyItem}
              </h3>

              <div className="grid gap-2">
                {filterOptions[keyItem].map((option, index) => {
                  const isChecked =
                    filters &&
                    filters[keyItem] &&
                    filters[keyItem].includes(option.id);

                  return (
                    <div
                      key={`${keyItem}-${index}`}
                      className="flex items-center space-x-2"
                    >
                      {/* ✅ Use the imported Checkbox component */}
                      <Checkbox
                        id={`${keyItem}-${index}`}
                        checked={isChecked}
                        onCheckedChange={() => handleFilter(keyItem, option.id)}
                      />

                      <label
                        htmlFor={`${keyItem}-${index}`}
                        className="text-sm text-gray-700 cursor-pointer"
                      >
                        {option.label ?? option}
                      </label>
                    </div>
                  );
                })}
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
