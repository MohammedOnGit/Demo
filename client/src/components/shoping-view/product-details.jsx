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

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const product = productDetails || {};

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
        {/* Header */}
        <DialogHeader className="col-span-full">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            {product.title || "Product Details"}
          </DialogTitle>

          <DialogDescription className="text-muted-foreground">
            See full product details, pricing and description.
          </DialogDescription>
        </DialogHeader>

        {/* LEFT — IMAGE */}
        <div className="relative w-full">
          <div className="aspect-square w-full rounded-xl overflow-hidden bg-muted">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        {/* RIGHT — DETAILS */}
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              {product.title || "Loading..."}
            </h2>

            <p className="text-muted-foreground leading-relaxed">
              {product.description ||
                "No description available for this product."}
            </p>
          </div>

          {/* Pricing */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-3">
              <span
                className={`
                  text-3xl font-bold 
                  ${
                    product.salePrice > 0
                      ? "line-through text-muted-foreground"
                      : "text-primary"
                  }
                `}
              >
                ${product.price || "0.00"}
              </span>

              {product.salePrice > 0 && (
                <span className="text-3xl font-bold text-green-600">
                  ${product.salePrice}
                </span>
              )}
            </div>

            <div className="items-center gap-2">
              <div className="flex items-center gap-0.5 ">
                <StarIcon className="fill-primary w-5 h-5" />
                <StarIcon className="fill-primary w-5 h-5" />
                <StarIcon className="fill-primary w-5 h-5" />
                <StarIcon className="fill-primary w-5 h-5" />
                <StarIcon className="fill-primary w-5 h-5" />
                <span className="text-muted-forground">{4.5}</span>
              </div>
            </div>

            {/* CTA BUTTON */}
            <button
              className="
                mt-5 w-full py-3 
                rounded-lg bg-primary text-white font-semibold 
                hover:bg-primary/90 transition
              "
            >
              Add to Cart
            </button>
          </div>
          <Separator />
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <div className="grid gap-6">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarFallback>MO</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <h3>Mohammed Ibrah</h3>
                  </div>
                  <div className="flex items-center gap-0.5 ">
                    <StarIcon className="fill-primary w-5 h-5" />
                    <StarIcon className="fill-primary w-5 h-5" />
                    <StarIcon className="fill-primary w-5 h-5" />
                    <StarIcon className="fill-primary w-5 h-5" />
                    <StarIcon className="fill-primary w-5 h-5" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Great product! Really satisfied with the quality and
                    performance. Highly recommend to others.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Avatar>
                  <AvatarFallback>MO</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <h3>Mohammed Ibrah</h3>
                  </div>
                  <div className="flex items-center gap-0.5 ">
                    <StarIcon className="fill-primary w-5 h-5" />
                    <StarIcon className="fill-primary w-5 h-5" />
                    <StarIcon className="fill-primary w-5 h-5" />
                    <StarIcon className="fill-primary w-5 h-5" />
                    <StarIcon className="fill-primary w-5 h-5" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Great product! Really satisfied with the quality and
                    performance. Highly recommend to others.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Avatar>
                  <AvatarFallback>MO</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <h3>Mohammed Ibrah</h3>
                  </div>
                  <div className="flex items-center gap-0.5 ">
                    <StarIcon className="fill-primary w-5 h-5" />
                    <StarIcon className="fill-primary w-5 h-5" />
                    <StarIcon className="fill-primary w-5 h-5" />
                    <StarIcon className="fill-primary w-5 h-5" />
                    <StarIcon className="fill-primary w-5 h-5" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Great product! Really satisfied with the quality and
                    performance. Highly recommend to others.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Input placeholder="Write a review...."></Input>
               <Button>Submit</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
