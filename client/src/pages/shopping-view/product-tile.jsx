import React from "react";
import { Card } from "@/components/ui/card";

function ShoppingProductTile(product) {
  return (
    <Card className="w-full max-w-sm mx-auto cursor-pointer overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition">
      
      {/* Image Wrapper */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[3/4]">
        <img
          src={product?.image}
          alt={product?.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Area (prepared for future use) */}
      <div className="p-3 sm:p-4 flex flex-col gap-2">
        <h3 className="text-sm sm:text-base font-semibold truncate">
          {product?.title}
        </h3>
      </div>

    </Card>
  );
}

export default ShoppingProductTile;
