
// AdminOrdersViews.jsx - JavaScript version
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

function AdminProductTile({
  product,
  setCurrentEditedId,
  setOpenCreateProductDialog,
  setFormData,
  handleDelete,
}) {
  const hasSalePrice = product?.salePrice > 0;
  const isOutOfStock = product?.stock === 0;

  const truncateTitle = (title, maxLength = 40) => {
    if (!title) return "Untitled Product";
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  return (
    <Card className="group relative overflow-hidden border shadow-sm transition-all hover:shadow-lg"
      style={{ minHeight: '300px', maxHeight: '400px' }}
    >
      {/* Image Section */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={product?.image || "/placeholder.svg"}
          alt={product?.title || "Product image"}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Stock Badge */}
        {isOutOfStock && (
          <Badge
            variant="destructive"
            className="absolute left-2 top-2 text-xs font-semibold"
          >
            Out of Stock
          </Badge>
        )}

        {/* Sale Badge */}
        {hasSalePrice && (
          <Badge className="absolute right-2 top-2 bg-primary text-primary-foreground text-xs font-bold">
            SALE
          </Badge>
        )}
      </div>

      {/* Content */}
      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-2 text-base font-medium leading-tight">
          {truncateTitle(product?.title)}
        </CardTitle>
      </CardHeader>

      <CardContent className="pb-4">
        {/* Price Section */}
        <div className="flex items-baseline gap-3">
          {hasSalePrice ? (
            <>
              <span className="text-lg font-bold text-primary">
                GHS {product.salePrice.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                GHS {product.price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold">
              GHS {product?.price?.toFixed(2) || "0.00"}
            </span>
          )}
        </div>

        {/* Stock Info */}
        <p className="mt-2 text-sm text-muted-foreground">
          {product?.stock > 0
            ? `${product.stock} in stock`
            : "Currently unavailable"}
        </p>
      </CardContent>

      {/* Actions */}
      <CardFooter className="flex gap-2 pt-2">
        <Button
          size="sm"
          className="flex-1 gap-2"
          onClick={() => {
            setCurrentEditedId(product._id);
            setFormData(product);
            setOpenCreateProductDialog(true);
          }}
        >
          <Edit2 className="h-4 w-4" />
          Edit
        </Button>

        <Button
          size="sm"
          variant="destructive"
          className="flex-1 gap-2"
          onClick={() => handleDelete(product._id)}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AdminProductTile;