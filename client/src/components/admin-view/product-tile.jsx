import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import { TrashIcon, SquarePen } from "lucide-react";

function AdminProductTile({
  product,
  setCurrentEditedId,
  setOpenCreateProductDialog,
  setFormData,
  handleDelete,
}) {
  const hasSalePrice = product?.salePrice && product.salePrice > 0;

  const maxLength = 30;
  function truncateImgTitle(imgTitle, maxLength) {
    if (!imgTitle) return "";
    return imgTitle.length > maxLength
      ? imgTitle.substring(0, maxLength) + "..."
      : imgTitle;
  }

  return (
    <div
      className="
        relative
        h-fit
        w-full
        max-w-sm
        sm:max-w-md
        mx-auto
        rounded-xl
        bg-gradient-to-r 
        from-neutral-600 
        to-violet-300 
        shadow-lg
        overflow-hidden
      "
    >
      {/* ✅ IMAGE */}
      <div className="w-full">
        <img
          src={product?.image}
          alt={product?.title}
          className="
            w-full
            aspect-video
            object-cover
            rounded-t-xl
          "
        />
      </div>

      {/* ✅ CONTENT CARD */}
      <Card className="border-none rounded-none">
        <CardHeader className="p-3 sm:p-4">
          <CardTitle className="text-left text-sm sm:text-base md:text-lg">
            {truncateImgTitle(product?.title, maxLength)}
          </CardTitle>
        </CardHeader>

        {/* ✅ PRICE SECTION */}
        <CardContent className="flex items-center justify-between gap-2 px-3 sm:px-4 pb-4">
          <span
            className={`font-extrabold text-xs sm:text-sm md:text-base ${
              hasSalePrice ? "line-through text-gray-400" : "text-black"
            }`}
          >
            GHC {product?.price}
          </span>

          {hasSalePrice && (
            <span className="text-sm sm:text-base md:text-lg font-semibold text-black">
              GHC {product?.salePrice}
            </span>
          )}
        </CardContent>

        {/* ✅ BUTTONS */}
        <CardFooter
          className="
            flex gap-2
            flex-col
            sm:flex-row
            items-stretch
            sm:items-center
            sm:justify-between
            px-3
            sm:px-4
            pb-4
          "
        >
          <Button
            className="
              w-full sm:w-auto
              flex items-center justify-center gap-2
              from-blue-600 via-blue-500/60 to-blue-600
              bg-transparent bg-gradient-to-r text-white
            "
            onClick={() => {
              setCurrentEditedId(product._id);
              setOpenCreateProductDialog(true);
              setFormData(product);
            }}
          >
            <SquarePen className="w-4 h-4" />
            Edit
          </Button>

          <Button
            onClick={() => handleDelete(product?._id)}
            className="
              w-full sm:w-auto
              flex items-center justify-center gap-2
              from-destructive via-destructive/60 to-destructive
              bg-transparent bg-gradient-to-r text-white
            "
          >
            <TrashIcon className="w-4 h-4" />
            Delete
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default AdminProductTile;
