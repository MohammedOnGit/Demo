import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { StarIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

function ProductDetailsDialog({
  open,
  setOpen,
  productDetails,
  handleAddtoCart,
}) {
  if (!productDetails) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="
          w-[95vw] max-w-[1100px]
          max-h-[90vh] overflow-y-auto
          p-6 sm:p-10
          grid grid-cols-1 md:grid-cols-2 gap-10
          rounded-xl
        "
      >
        <DialogHeader className="col-span-full">
          <DialogTitle className="text-2xl font-bold">
            {productDetails.title}
          </DialogTitle>
          <DialogDescription>
            See full product details, pricing and description.
          </DialogDescription>
        </DialogHeader>

        {/* Image */}
        <div className="aspect-square rounded-xl overflow-hidden">
          <img
            src={productDetails.image}
            alt={productDetails.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col justify-between">
          <div>
            <p className="text-muted-foreground mb-4">
              {productDetails.description}
            </p>

            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl font-bold">
                ₵{productDetails.price}
              </span>

              {productDetails.salePrice > 0 && (
                <span className="text-2xl font-bold text-green-600">
                  ₵{productDetails.salePrice}
                </span>
              )}
            </div>

            {/* <Button
              className="w-full"
              onClick={() => handleAddtoCart(productDetails._id)}
            >
              Add to Cart
            </Button> */}

            <Button onClick={() => handleAddtoCart(productDetails)}>
              Add to Cart
            </Button>

            <div className="flex items-center gap-1 mt-4">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="w-5 h-5 fill-primary" />
              ))}
              <span className="ml-2 text-muted-foreground">
                {productDetails.rating || 4.5}
              </span>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Reviews */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Reviews</h3>

            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4 mb-4">
                <Avatar>
                  <AvatarFallback>MO</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, j) => (
                      <StarIcon key={j} className="w-4 h-4 fill-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Great product! Really satisfied.
                  </p>
                </div>
              </div>
            ))}

            <div className="flex gap-2 mt-4">
              <Input placeholder="Write a review..." />
              <Button>Submit</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
