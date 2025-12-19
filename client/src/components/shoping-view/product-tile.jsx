import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { brandOptionsMap } from "@/config";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  return (
    <Card
      className="
        w-full
        max-w-[360px]
        mx-auto
        cursor-pointer
        overflow-hidden
        rounded-2xl
        shadow-sm
        hover:shadow-xl
        transition-all
      "
    >
      {/* Image */}
      <div
        onClick={() => handleGetProductDetails(product?._id)}
        className="relative w-full aspect-square"
      >
        <img
          src={product?.image}
          alt={product?.title}
          className="w-full h-full object-cover"
        />

        {product?.salePrice > 0 && (
          <Badge className="absolute top-3 left-3 bg-red-500 text-xs">
            Sale
          </Badge>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-4">
       
          <h2 className="text-lg justity-start font-bold mb-2 line-clamp-2">
          {product?.title}
        </h2>
       

        <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
          <span>{brandOptionsMap[product?.category]}</span>
          <span>{brandOptionsMap[product?.brand]}</span>
        </div>

        <div className="flex justify-between items-center">
          <span
            className={`text-lg font-semibold ${
              product?.salePrice > 0 ? "line-through text-muted-foreground" : ""
            }`}
          >
            ₵{product?.price?.toFixed(2)}
          </span>

          {product?.salePrice > 0 && (
            <span className="text-lg font-semibold text-primary">
              ₵{product?.salePrice?.toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-4 pt-0">
        {/* <Button
          onClick={() => handleAddtoCart(product?._id)}
          className="w-full"
        >
          Add to cart
        </Button> */}

        <Button onClick={() => handleAddtoCart(product)}>Add to Cart</Button>
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
