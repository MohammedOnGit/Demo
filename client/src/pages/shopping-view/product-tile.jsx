import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { brandOptionsMap } from "@/config";

function ShoppingProductTile({ product }) {
  return (
    //     <Card className="
    //       w-full
    //       max-w-[360px]
    //       sm:max-w-[400px]
    //       md:max-w-[340px]
    //       lg:max-w-[360px]
    //       mx-auto
    //       cursor-pointer
    //       overflow-hidden
    //       rounded-2xl
    //       shadow-sm
    //       hover:shadow-xl
    //       transition-all
    //     ">

    // {/* ✅ Responsive Image Wrapper */}
    //       <div className="relative w-full aspect-[4/3] sm:aspect-[3/4] md:aspect-square pt-0">
    //       {/* <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"> */}

    //         <img
    //           src={product?.image}
    //           alt={product?.title}
    //           // className="w-full h-full object-cover"
    //           // className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-3/2"

    //           className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"

    //         />

    //         {product?.salePrice > 0 && (
    //           <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-xs sm:text-sm">
    //             Sale
    //           </Badge>
    //         )}
    //       </div>

    //       {/* ✅ Responsive Content */}
    //       <CardContent className="p-3 sm:p-4 md:p-5">
    //         <h2 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 line-clamp-2">
    //           {product?.title}
    //         </h2>

    //         <div className="flex justify-between items-center mb-2 text-xs sm:text-sm">
    //           <span className="text-muted-foreground">
    //             {brandOptionsMap[product?.category]}
    //           </span>
    //           <span className="text-muted-foreground">
    //             {brandOptionsMap[product?.brand]}
    //           </span>
    //         </div>

    //         <div className="flex justify-between items-center">
    //           <span
    //             className={`${
    //               product?.salePrice > 0 ? "line-through text-muted-foreground" : ""
    //             } text-sm sm:text-base md:text-lg font-semibold`}
    //           >
    //             ₵{product?.price?.toFixed(2)}
    //           </span>

    //           {product?.salePrice > 0 && (
    //             <span className="text-sm sm:text-base md:text-lg font-semibold text-primary">
    //               ₵{product?.salePrice?.toFixed(2)}
    //             </span>
    //           )}
    //         </div>
    //       </CardContent>

    //       {/* ✅ Responsive Button */}
    //       <CardFooter className="p-3 sm:p-4 md:p-5 pt-0">
    //         <Button className="w-full h-9 sm:h-10 md:h-11 text-sm sm:text-base">
    //           Add to cart
    //         </Button>
    //       </CardFooter>
    //     </Card>
    <>
      <div
        className="
    w-full 
    max-w-[360px] 
    sm:max-w-[400px] 
    md:max-w-[340px] 
    lg:max-w-[360px] 
    mx-auto 
    cursor-pointer 
    overflow-hidden 
    rounded-2xl 
    shadow-sm 
    hover:shadow-xl 
    transition-all
    bg-white
  "
      >
        {/* ✅ Image Section */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[3/4] md:aspect-square">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-full rounded-t-2xl object-cover bg-gray-200 hover:opacity-75 transition"
          />

          {product?.salePrice > 0 && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs sm:text-sm px-2 py-1 rounded">
              Sale
            </span>
          )}
        </div>

        {/* ✅ Content Section */}
        <div className="p-3 sm:p-4 md:p-5">
          <h2 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 line-clamp-2">
            {product?.title}
          </h2>

          <div className="flex justify-between items-center mb-2 text-xs sm:text-sm text-gray-500">
            <span>{brandOptionsMap[product?.category]}</span>
            <span>{brandOptionsMap[product?.brand]}</span>
          </div>

          <div className="flex justify-between items-center">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through text-gray-400" : ""
              } text-sm sm:text-base md:text-lg font-semibold`}
            >
              ₵{product?.price?.toFixed(2)}
            </span>

            {product?.salePrice > 0 && (
              <span className="text-sm sm:text-base md:text-lg font-semibold text-primary">
                ₵{product?.salePrice?.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* ✅ Button Section */}
        <div className="p-3 sm:p-4 md:p-5 pt-0">
          <button className="w-full h-9 sm:h-10 md:h-11 text-sm sm:text-base bg-primary text-white rounded-lg hover:opacity-90 transition">
            Add to cart
          </button>
        </div>
      </div>
    </>
  );
}

export default ShoppingProductTile;
