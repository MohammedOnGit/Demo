import React, { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import bannerOne from "../../assets/ban/b-1.webp";
import bannerTwo from "../../assets/ban/b-2.webp";
import bannerThree from "../../assets/ban/b-3.webp";
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
  LoaderPinwheel,
  TrophyIcon,
  CarIcon,
  BaggageClaimIcon,
} from "lucide-react";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shoping-view/product-tile";

/* ---------------- CONFIG ---------------- */
const AUTOPLAY_DELAY = 5000;
const TRANSITION_DURATION = 700;
const MAX_FEATURED_PRODUCTS = 8;

const slides = [bannerOne, bannerTwo, bannerThree];

const categoriesWithIcons = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: Venus },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandWithIcons = [
  { id: "nike", label: "Nike", icon: ChessKnight },
  { id: "adidas", label: "Adidas", icon: LoaderPinwheel },
  { id: "puma", label: "Puma", icon: TrophyIcon },
  { id: "levi", label: "Levi's", icon: CarIcon },
  { id: "zara", label: "Zara", icon: BaggageClaimIcon },
  { id: "hm", label: "H&M", icon: ShirtIcon },
];

export default function ShoppingHome() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products = [], isLoading, error } = useSelector(
    (state) => state.shopProducts
  );

  const autoplayRef = useRef(null);

  /* ---------------- AUTOPLAY ---------------- */
  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      if (!isPaused) goToNext();
    }, AUTOPLAY_DELAY);

    return () => clearInterval(autoplayRef.current);
  }, [isPaused, goToNext]);

  useEffect(() => {
    const handleVisibilityChange = () => setIsPaused(document.hidden);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  /* ---------------- FETCH PRODUCTS ---------------- */
  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParam: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  /* ---------------- SWIPE ---------------- */
  const swipeHandlers = useSwipeable({
    onSwipedLeft: goToNext,
    onSwipedRight: goToPrev,
    trackMouse: true,
  });

  /* ---------------- NAVIGATION ---------------- */
  const handleNavigateToListingPage = (item, section) => {
    // Build query string
    const query = new URLSearchParams();
    query.set(section, item.id); // category=men or brand=nike

    navigate(`/shop/listing?${query.toString()}`);
  };

  const handleViewAllProducts = () => navigate("/shop/listing");

  /* ---------------- FEATURED PRODUCTS ---------------- */
  const featuredProducts = products.filter(Boolean).slice(0, MAX_FEATURED_PRODUCTS);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* ================= BANNER ================= */}
      <div
        {...swipeHandlers}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative w-full overflow-hidden h-[500px] lg:h-[550px]"
      >
        <div
          className="flex h-full"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: `transform ${TRANSITION_DURATION}ms ease-in-out`,
          }}
        >
          {slides.map((slide, index) => (
            <img
              key={index}
              src={slide}
              alt={`Banner ${index + 1}`}
              className="flex-shrink-0 w-full h-full object-cover"
              loading="lazy"
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={goToPrev}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80"
        >
          &lt;
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={goToNext}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80"
        >
          &gt;
        </Button>
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

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Button variant="link" onClick={handleViewAllProducts}>
              View All Products
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">Loading products...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">Failed to load products</div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ShoppingProductTile key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">No featured products found.</div>
          )}
        </div>
      </section>
    </div>
  );
}
