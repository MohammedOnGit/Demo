// import React, { useEffect, useRef, useState, useCallback } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { useSwipeable } from "react-swipeable";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   BabyIcon,
//   ShirtIcon,
//   Venus,
//   WatchIcon,
//   UmbrellaIcon,
//   ChessKnight,
//   LoaderPinwheel,
//   TrophyIcon,
//   CarIcon,
//   BaggageClaimIcon,
// } from "lucide-react";

// import bannerOne from "../../assets/ban/b-1.webp";
// import bannerTwo from "../../assets/ban/b-2.webp";
// import bannerThree from "../../assets/ban/b-3.webp";

// import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
// import ShoppingProductTile from "@/components/shoping-view/product-tile";

// const AUTOPLAY_DELAY = 5000;
// const MAX_FEATURED_PRODUCTS = 4;

// const slides = [bannerOne, bannerTwo, bannerThree];

// export default function ShoppingHome() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { products = [], isLoading, error } = useSelector(
//     (state) => state.shopProducts || {}
//   );

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [paused, setPaused] = useState(false);
//   const autoplayRef = useRef(null);

//   const next = useCallback(
//     () => setCurrentIndex((i) => (i + 1) % slides.length),
//     []
//   );

//   const prev = useCallback(
//     () => setCurrentIndex((i) => (i - 1 + slides.length) % slides.length),
//     []
//   );

//   useEffect(() => {
//     autoplayRef.current = setInterval(() => {
//       if (!paused) next();
//     }, AUTOPLAY_DELAY);

//     return () => clearInterval(autoplayRef.current);
//   }, [paused, next]);

//   useEffect(() => {
//     dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParam: null }));
//   }, [dispatch]);

//   const swipeHandlers = useSwipeable({
//     onSwipedLeft: next,
//     onSwipedRight: prev,
//     trackMouse: true,
//   });

//   const featuredProducts = Array.isArray(products)
//     ? products.slice(0, MAX_FEATURED_PRODUCTS)
//     : [];

//   const navigateToListing = (key, value) => {
//     const params = new URLSearchParams();
//     params.set(key, value);
//     navigate(`/shop/listing?${params.toString()}`);
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100">
//       {/* BANNER */}
//       <div
//         {...swipeHandlers}
//         onMouseEnter={() => setPaused(true)}
//         onMouseLeave={() => setPaused(false)}
//         className="relative h-[500px] overflow-hidden"
//       >
//         <div
//           className="flex h-full transition-transform duration-700"
//           style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//         >
//           {slides.map((src, i) => (
//             <img
//               key={i}
//               src={src}
//               alt={`Banner ${i + 1}`}
//               className="w-full h-full object-cover flex-shrink-0"
//             />
//           ))}
//         </div>

//         <Button onClick={prev} className="absolute left-4 top-1/2">{"<"}</Button>
//         <Button onClick={next} className="absolute right-4 top-1/2">{">"}</Button>
//       </div>

//       {/* FEATURED */}
//       <section className="py-12">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold mb-6">Featured Products</h2>

//           {isLoading ? (
//             <p>Loading...</p>
//           ) : error ? (
//             <p className="text-red-500">Failed to load products</p>
//           ) : featuredProducts.length ? (
//             <div className="grid md:grid-cols-4 gap-6">
//               {featuredProducts.map((p) => (
//                 <ShoppingProductTile key={p._id} product={p} />
//               ))}
//             </div>
//           ) : (
//             <p>No products available</p>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// }
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSwipeable } from "react-swipeable";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  BabyIcon,
  ShirtIcon,
  Venus,
  WatchIcon,
  UmbrellaIcon,
  ChessKnight,
  TrophyIcon,
  CarIcon,
  BaggageClaimIcon,
} from "lucide-react";

import bannerOne from "../../assets/ban/b-1.webp";
import bannerTwo from "../../assets/ban/b-2.webp";
import bannerThree from "../../assets/ban/b-3.webp";

import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shoping-view/product-tile";

const AUTOPLAY_DELAY = 5000;
const MAX_FEATURED_PRODUCTS = 4;

const slides = [bannerOne, bannerTwo, bannerThree];

/* ================= CATEGORY & BRAND DATA ================= */
const categoriesWithIcons = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: Venus },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "footwear", label: "Footwear", icon: TrophyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
];

const brandWithIcons = [
  { id: "nike", label: "Nike", icon: ShirtIcon },
  { id: "adidas", label: "Adidas", icon: ShirtIcon },
  { id: "puma", label: "Puma", icon: ShirtIcon },
  { id: "reebok", label: "Reebok", icon: ShirtIcon },
  { id: "gucci", label: "Gucci", icon: UmbrellaIcon },
  { id: "prada", label: "Prada", icon: UmbrellaIcon },
];

export default function ShoppingHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products = [], isLoading, error } = useSelector(
    (state) => state.shopProducts || {}
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const autoplayRef = useRef(null);

  /* ------------------- SLIDER ------------------- */
  const next = useCallback(
    () => setCurrentIndex((i) => (i + 1) % slides.length),
    []
  );
  const prev = useCallback(
    () => setCurrentIndex((i) => (i - 1 + slides.length) % slides.length),
    []
  );

  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      if (!paused) next();
    }, AUTOPLAY_DELAY);

    return () => clearInterval(autoplayRef.current);
  }, [paused, next]);

  /* ------------------- FETCH PRODUCTS ------------------- */
  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParam: null }));
  }, [dispatch]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: next,
    onSwipedRight: prev,
    trackMouse: true,
  });

  const featuredProducts = Array.isArray(products)
    ? products.slice(0, MAX_FEATURED_PRODUCTS)
    : [];

  /* ------------------- NAVIGATE TO LISTING ------------------- */
  const handleNavigateToListingPage = (item, type) => {
    const params = new URLSearchParams();
    params.set(type, item.id);
    navigate(`/shop/listing?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* ------------------- BANNER ------------------- */}
      <div
        {...swipeHandlers}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="relative h-[500px] overflow-hidden"
      >
        <div
          className="flex h-full transition-transform duration-700"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Banner ${i + 1}`}
              className="w-full h-full object-cover flex-shrink-0"
            />
          ))}
        </div>

        <Button onClick={prev} className="absolute left-4 top-1/2">{"<"}</Button>
        <Button onClick={next} className="absolute right-4 top-1/2">{">"}</Button>
      </div>

      {/* ================= SHOP BY CATEGORY ================= */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcons.map((category) => (
              <Card
                key={category.id}
                onClick={() => handleNavigateToListingPage(category, "category")}
                className="cursor-pointer hover:shadow-lg transition"
              >
                <CardContent className="flex flex-col items-center p-6">
                  <category.icon className="w-10 h-10 mb-3 text-gray-700" />
                  <span className="font-medium">{category.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SHOP BY BRAND ================= */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandWithIcons.map((brand) => (
              <Card
                key={brand.id}
                onClick={() => handleNavigateToListingPage(brand, "brand")}
                className="cursor-pointer hover:shadow-lg transition"
              >
                <CardContent className="flex flex-col items-center p-6">
                  <brand.icon className="w-10 h-10 mb-3 text-gray-700" />
                  <span className="font-medium">{brand.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------- FEATURED PRODUCTS ------------------- */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Featured Products</h2>

          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">Failed to load products</p>
          ) : featuredProducts.length ? (
            <div className="grid md:grid-cols-4 gap-6">
              {featuredProducts.map((p) => (
                <ShoppingProductTile key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <p>No products available</p>
          )}
        </div>
      </section>
    </div>
  );
}
