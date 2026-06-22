// import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { useSwipeable } from "react-swipeable";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";

// import {
//   ChevronLeft,
//   ChevronRight,
//   Sparkles,
//   ShoppingBag,
//   Truck,
//   Shield,
//   Award,
//   Tag,
//   ShirtIcon,
//   Venus,
//   BabyIcon,
//   WatchIcon,
//   TrophyIcon,
// } from "lucide-react";

// import {
//   fetchAllFilteredProducts,
//   fetchProductDetails,
// } from "@/store/shop/products-slice";
// import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
// import { fetchWishlist } from "@/store/shop/wishlist-slice";
// import { getFeatureImages } from "@/store/common-slice";

// import ShoppingProductTile from "@/components/shoping-view/product-tile";
// import ProductDetailsDialog from "@/components/shoping-view/product-details";
// import { toast } from "sonner";
// import { cn } from "@/lib/utils";

// /* -------------------------------------------------------------------------- */

// const AUTOPLAY_DELAY = 5000;
// const MAX_FEATURED_PRODUCTS = 8;

// const heroTitles = ["Premium Fragrances", "Luxury Scents", "Elegant Aromas"];

// /* -------------------------------------------------------------------------- */

// export default function ShoppingHome() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { products = [], isLoading, productDetails } = useSelector(
//     (state) => state.shopProducts || {}
//   );

//   const { featureImageList = [] } = useSelector(
//     (state) => state.commonFeature || {}
//   );

//   const { user } = useSelector((state) => state.auth || {});

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [paused, setPaused] = useState(false);
//   const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

//   const autoplayRef = useRef(null);

//   /* ----------------------------- EFFECTS ----------------------------- */

//   useEffect(() => {
//     dispatch(getFeatureImages());
//     dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParam: null }));
//     if (user?.id) dispatch(fetchWishlist());
//   }, [dispatch, user?.id]);

//   useEffect(() => {
//     if (!featureImageList.length) return;

//     autoplayRef.current = setInterval(() => {
//       if (!paused) {
//         setCurrentIndex((i) => (i + 1) % featureImageList.length);
//       }
//     }, AUTOPLAY_DELAY);

//     return () => clearInterval(autoplayRef.current);
//   }, [paused, featureImageList.length]);

//   /* ----------------------------- HANDLERS ----------------------------- */

//   const next = () =>
//     setCurrentIndex((i) => (i + 1) % featureImageList.length);

//   const prev = () =>
//     setCurrentIndex(
//       (i) => (i - 1 + featureImageList.length) % featureImageList.length
//     );

//   const swipeHandlers = useSwipeable({
//     onSwipedLeft: next,
//     onSwipedRight: prev,
//     trackMouse: true,
//   });

//   const featuredProducts = useMemo(
//     () => products.slice(0, MAX_FEATURED_PRODUCTS),
//     [products]
//   );

//   /* ----------------------------- RENDER ----------------------------- */

//   return (
//     <div className="min-h-screen">

//       {/* HERO */}
//       {featureImageList.length > 0 ? (
//         <section
//           {...swipeHandlers}
//           onMouseEnter={() => setPaused(true)}
//           onMouseLeave={() => setPaused(false)}
//           className="relative h-[500px] md:h-[600px] overflow-hidden group"
//         >
//           <div
//             className="flex h-full transition-transform duration-700"
//             style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//           >
//             {featureImageList.map((img, i) => (
//               <div key={img._id} className="w-full h-full flex-shrink-0 relative">
//                 <img
//                   src={img.image}
//                   className="w-full h-full object-cover"
//                 />
//                 <div className="absolute inset-0 bg-black/50" />

//                 <div className="absolute inset-0 flex items-center">
//                   <div className="container mx-auto px-4 space-y-4">
//                     <Badge className="bg-white/20 text-white">
//                       <Sparkles className="h-3 w-3 mr-1" />
//                       New Collection
//                     </Badge>
//                     <h1 className="text-5xl font-bold text-white">
//                       {heroTitles[i % heroTitles.length]}
//                     </h1>
//                     <Button
//                       size="lg"
//                       className="bg-white text-black"
//                       onClick={() => navigate("/shop/listing")}
//                     >
//                       <ShoppingBag className="h-5 w-5 mr-2" />
//                       Shop Now
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {featureImageList.length > 1 && (
//             <>
//               <Button
//                 size="icon"
//                 onClick={prev}
//                 className="absolute left-4 top-1/2"
//               >
//                 <ChevronLeft />
//               </Button>
//               <Button
//                 size="icon"
//                 onClick={next}
//                 className="absolute right-4 top-1/2"
//               >
//                 <ChevronRight />
//               </Button>
//             </>
//           )}
//         </section>
//       ) : null}

//       {/* FEATURED PRODUCTS */}
//       <section className="py-12">
//         <div className="container mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {isLoading
//             ? [...Array(4)].map((_, i) => (
//                 <Skeleton key={i} className="h-80" />
//               ))
//             : featuredProducts.map((p) => (
//                 <ShoppingProductTile
//                   key={p._id}
//                   product={p}
//                   handleAddtoCart={(product) => {
//                     dispatch(
//                       addToCart({
//                         userId: user.id,
//                         productId: product._id,
//                         quantity: 1,
//                       })
//                     ).then(() => dispatch(fetchCartItems(user.id)));
//                   }}
//                   handleGetProductDetails={(id) => {
//                     dispatch(fetchProductDetails({ productId: id })).then(() =>
//                       setOpenDetailsDialog(true)
//                     );
//                   }}
//                 />
//               ))}
//         </div>
//       </section>

//       <ProductDetailsDialog
//         open={openDetailsDialog}
//         setOpen={setOpenDetailsDialog}
//         productDetails={productDetails}
//       />
//     </div>
//   );
// }




// import React, { useEffect, useRef, useState, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { useSwipeable } from "react-swipeable";

// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { ChevronLeft, ChevronRight, Sparkles, ShoppingBag } from "lucide-react";

// import {
//   fetchAllFilteredProducts,
//   fetchProductDetails,
// } from "@/store/shop/products-slice";
// import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
// import { fetchWishlist } from "@/store/shop/wishlist-slice";
// import { getFeatureImages } from "@/store/common-slice";

// import ShoppingProductTile from "@/components/shoping-view/product-tile";
// import ProductDetailsDialog from "@/components/shoping-view/product-details";

// /* -------------------------------------------------------------------------- */

// const AUTOPLAY_DELAY = 5000;
// const MAX_FEATURED_PRODUCTS = 8;
// const heroTitles = ["Premium Fragrances", "Luxury Scents", "Elegant Aromas"];

// export default function ShoppingHome() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { products = [], isLoading, productDetails } = useSelector(
//     (state) => state.shopProducts || {}
//   );
//   const { featureImageList = [] } = useSelector(
//     (state) => state.commonFeature || {}
//   );
//   const { user } = useSelector((state) => state.auth || {});

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [paused, setPaused] = useState(false);
//   const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
//   const autoplayRef = useRef(null);

//   /* ----------------------------- EFFECTS ----------------------------- */

//   useEffect(() => {
//     dispatch(getFeatureImages());
//     dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParam: null }));
//     if (user?.id) dispatch(fetchWishlist());
//   }, [dispatch, user?.id]);

//   useEffect(() => {
//     if (!featureImageList.length) return;
//     autoplayRef.current = setInterval(() => {
//       if (!paused) {
//         setCurrentIndex((i) => (i + 1) % featureImageList.length);
//       }
//     }, AUTOPLAY_DELAY);

//     return () => clearInterval(autoplayRef.current);
//   }, [paused, featureImageList.length]);

//   /* ----------------------------- HANDLERS ----------------------------- */

//   const next = () =>
//     setCurrentIndex((i) => (i + 1) % featureImageList.length);
//   const prev = () =>
//     setCurrentIndex((i) => (i - 1 + featureImageList.length) % featureImageList.length);

//   const swipeHandlers = useSwipeable({
//     onSwipedLeft: next,
//     onSwipedRight: prev,
//     trackMouse: true,
//   });

//   const featuredProducts = useMemo(
//     () => products.slice(0, MAX_FEATURED_PRODUCTS),
//     [products]
//   );

//   /* ----------------------------- RENDER ----------------------------- */

//   return (
//     <div className="min-h-screen">

//       {/* HERO SLIDER */}
//       {featureImageList.length > 0 && (
//         <section
//           {...swipeHandlers}
//           onMouseEnter={() => setPaused(true)}
//           onMouseLeave={() => setPaused(false)}
//           className="relative h-[500px] md:h-[600px] overflow-hidden group"
//         >
//           <div
//             className="flex h-full transition-transform duration-700"
//             style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//           >
//             {featureImageList.map((img, i) => (
//               <div key={img._id} className="w-full h-full flex-shrink-0 relative">
//                 <img src={img.image} className="w-full h-full object-cover" />
//                 <div className="absolute inset-0 bg-black/50" />
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="container mx-auto px-4 space-y-4">
//                     <Badge className="bg-white/20 text-white">
//                       <Sparkles className="h-3 w-3 mr-1" />
//                       New Collection
//                     </Badge>
//                     <h1 className="text-5xl font-bold text-white">
//                       {heroTitles[i % heroTitles.length]}
//                     </h1>
//                     <Button
//                       size="lg"
//                       className="bg-white text-black"
//                       onClick={() => navigate("/shop/listing")}
//                     >
//                       <ShoppingBag className="h-5 w-5 mr-2" />
//                       Shop Now
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {featureImageList.length > 1 && (
//             <>
//               <Button size="icon" onClick={prev} className="absolute left-4 top-1/2">
//                 <ChevronLeft />
//               </Button>
//               <Button size="icon" onClick={next} className="absolute right-4 top-1/2">
//                 <ChevronRight />
//               </Button>
//             </>
//           )}
//         </section>
//       )}

//       {/* FEATURED PRODUCTS */}
//       <section className="py-12">
//         <div className="container mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {isLoading
//             ? [...Array(4)].map((_, i) => <Skeleton key={i} className="h-80" />)
//             : featuredProducts.map((p) => (
//                 <ShoppingProductTile
//                   key={p._id}
//                   product={p}
//                   handleAddtoCart={() => {
//                     dispatch(
//                       addToCart({
//                         userId: user.id,
//                         productId: p._id,
//                         quantity: 1,
//                       })
//                     ).then(() => dispatch(fetchCartItems(user.id)));
//                   }}
//                   handleGetProductDetails={() => {
//                     dispatch(fetchProductDetails({ productId: p._id })).then(() =>
//                       setOpenDetailsDialog(true)
//                     );
//                   }}
//                 />
//               ))}
//         </div>
//       </section>

//       <ProductDetailsDialog
//         open={openDetailsDialog}
//         setOpen={setOpenDetailsDialog}
//         productDetails={productDetails}
//       />
//     </div>
//   );
// }



import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Sparkles, ShoppingBag } from "lucide-react";

import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchWishlist } from "@/store/shop/wishlist-slice";
import { getFeatureImages } from "@/store/common-slice";

import ShoppingProductTile from "@/components/shoping-view/product-tile";
import ProductDetailsDialog from "@/components/shoping-view/product-details";
import { toast } from "sonner";

/* -------------------------------------------------------------------------- */

const AUTOPLAY_DELAY = 5000;
const MAX_FEATURED_PRODUCTS = 8;
const heroTitles = ["Premium Fragrances", "Luxury Scents", "Elegant Aromas"];

/* -------------------------------------------------------------------------- */

export default function ShoppingHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products = [], isLoading, productDetails } = useSelector(
    (state) => state.shopProducts || {}
  );
  const { featureImageList = [] } = useSelector(
    (state) => state.commonFeature || {}
  );
  const { user } = useSelector((state) => state.auth || {});

  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const autoplayRef = useRef(null);

  /* ----------------------------- EFFECTS ----------------------------- */

  useEffect(() => {
    dispatch(getFeatureImages());
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParam: null }));
    if (user?.id) dispatch(fetchWishlist());
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (!featureImageList.length) return;
    autoplayRef.current = setInterval(() => {
      if (!paused) {
        setCurrentIndex((i) => (i + 1) % featureImageList.length);
      }
    }, AUTOPLAY_DELAY);

    return () => clearInterval(autoplayRef.current);
  }, [paused, featureImageList.length]);

  /* ----------------------------- HANDLERS ----------------------------- */

  const next = () =>
    setCurrentIndex((i) => (i + 1) % featureImageList.length);
  const prev = () =>
    setCurrentIndex((i) => (i - 1 + featureImageList.length) % featureImageList.length);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: next,
    onSwipedRight: prev,
    trackMouse: true,
  });

  // ✅ Shared add-to-cart handler (works for both tile and dialog)
  const handleAddToCart = useCallback(
    (product, quantity = 1) => {
      if (!user?.id) {
        toast.info("Please login to add items to cart");
        navigate("/login");
        return;
      }

      const stock = product.availableStock ?? product.totalStock ?? 0;
      if (product.isActive === false || stock <= 0) {
        toast.error("This product is unavailable");
        return;
      }

      dispatch(
        addToCart({
          userId: user.id,
          productId: product._id,
          quantity,
        })
      )
        .unwrap()
        .then(() => {
          dispatch(fetchCartItems(user.id));
          toast.success(`${product.title} added to cart`);
        })
        .catch((err) => {
          toast.error(err?.message || "Failed to add to cart");
        });
    },
    [dispatch, navigate, user]
  );

  // Handler to fetch product details and open dialog
  const handleGetProductDetails = useCallback(
    (productId) => {
      dispatch(fetchProductDetails({ productId })).then((res) => {
        if (res?.meta?.requestStatus === "fulfilled") {
          setOpenDetailsDialog(true);
        } else {
          toast.error("Failed to load product details");
        }
      });
    },
    [dispatch]
  );

  const featuredProducts = useMemo(
    () => products.slice(0, MAX_FEATURED_PRODUCTS),
    [products]
  );

  /* ----------------------------- RENDER ----------------------------- */

  return (
    <div className="min-h-screen">

      {/* HERO SLIDER */}
      {featureImageList.length > 0 && (
        <section
          {...swipeHandlers}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="relative h-[500px] md:h-[600px] overflow-hidden group"
        >
          <div
            className="flex h-full transition-transform duration-700"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {featureImageList.map((img, i) => (
              <div key={img._id} className="w-full h-full shrink-0 relative">
                <img src={img.image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4 space-y-4">
                    <Badge className="bg-white/20 text-white">
                      <Sparkles className="h-3 w-3 mr-1" />
                      New Collection
                    </Badge>
                    <h1 className="text-5xl font-bold text-white">
                      {heroTitles[i % heroTitles.length]}
                    </h1>
                    <Button
                      size="lg"
                      className="bg-white text-black"
                      onClick={() => navigate("/shop/listing")}
                    >
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Shop Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {featureImageList.length > 1 && (
            <>
              <Button size="icon" onClick={prev} className="absolute left-4 top-1/2">
                <ChevronLeft />
              </Button>
              <Button size="icon" onClick={next} className="absolute right-4 top-1/2">
                <ChevronRight />
              </Button>
            </>
          )}
        </section>
      )}

      {/* FEATURED PRODUCTS */}
      <section className="py-12">
        <div className="container mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? [...Array(4)].map((_, i) => <Skeleton key={i} className="h-80" />)
            : featuredProducts.map((p) => (
                <ShoppingProductTile
                  key={p._id}
                  product={p}
                  handleAddtoCart={handleAddToCart}        // ✅ pass shared handler
                  handleGetProductDetails={handleGetProductDetails}
                />
              ))}
        </div>
      </section>

      {/* PRODUCT DETAILS DIALOG */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
        handleAddtoCart={handleAddToCart}                 // ✅ now passed correctly
      />
    </div>
  );
}