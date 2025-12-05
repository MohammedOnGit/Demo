import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import { TrashIcon, SquarePen } from "lucide-react";

function AdminProductTile({ product,setCurrentEditedId, setOpenCreateProductDialog, setFormData,handleDelete }) {
  const hasSalePrice = product?.salePrice && product.salePrice > 0;

  const maxLength = 30;
  function truncateImgTitle(imgTitle, maxLength) {
    if (!imgTitle) return "";
    return imgTitle.length > maxLength
      ? imgTitle.substring(0, maxLength) + "..."
      : imgTitle;
  }

  return (
    <Card className="max-w-md pt-0 flex flex-col">
      {/* IMAGE */}
      <CardContent className="px-0 border-black/10 border-b-2">
        <img
          src={product?.image}
          alt={product?.title}
          className="aspect-video h-70 rounded-t-xl object-cover"
        />
      </CardContent>
      {/* HEADER */}
      <CardHeader className="px-4">
        <CardTitle className="text-left text-lg sm:text-xl md:text-2xl font-bold tracking-tight py-0 mb-8">
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="cursor-pointer">
                {truncateImgTitle(product?.title, maxLength)}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{product?.title}</p>
            </TooltipContent>
          </Tooltip>
        </CardTitle>

        <CardDescription className="flex justify-between items-center gap-5 text-left">
          <span
            className={`font-extrabold text-sm sm:text-base ${
              hasSalePrice ? "line-through text-gray-500" : ""
            }`}
          >
            GHC {product?.price}
          </span>

          {hasSalePrice && (
            <span className="text-lg font-semibold sm:text-base text-black">
              GHC {product?.salePrice}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      {/* ✅ FOOTER STICKS TO BOTTOM */}
      <CardFooter className="px-4 gap-3 mt-auto max-sm:flex-col max-sm:items-stretch">
        <Button className="from-blue-600 via-blue-500/60 to-blue-600 bg-transparent bg-gradient-to-r text-white" onClick={() => {
          setCurrentEditedId(product._id);
          setOpenCreateProductDialog(true);
          setFormData(product);
        }}>
          <SquarePen />
          Edit
        </Button>

        <Button onClick={()=>{
          handleDelete(product?._id);
        }} className="from-destructive via-destructive/60 to-destructive bg-transparent bg-gradient-to-r text-white">
          <TrashIcon />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AdminProductTile;
