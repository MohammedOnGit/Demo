import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import {
  House,
  LogOut,
  Menu,
  ShoppingCart,
  UserCog,
  Sun,
  Moon,
  Search,
  Heart,
  ChevronDown,
  Sparkles,
  Bell,
  X,
  User,
  ChevronRight,
  MapPin,
  Package,
  Settings,
  HelpCircle,
  Gift,
  Tag,
  Trophy,
  Users,
  Sparkle,
  ShoppingBag,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shopingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { fetchWishlist } from "@/store/shop/wishlist-slice";
import UserCartWrapper from "./cart-wrapper";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { debounce } from "lodash";
import {
  addRecentSearch,
  clearRecentSearches,
  loadRecentSearches,
  setSearchQuery,
  fetchSearchSuggestions
} from "@/store/shop/search-slice";

/* ---------------- WISHLIST INDICATOR ---------------- */
function WishlistIndicator({ isMobile = false }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, isLoading, wishlistCount } = useSelector((state) => state.wishlist);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);

  if (isMobile) {
    return (
      <Button
        variant="outline"
        size="default"
        className="w-full justify-start gap-3"
        onClick={() => user ? navigate("/shop/wishlist") : navigate("/shop/login")}
        disabled={!user}
      >
        <Heart className="h-4 w-4" />
        <span className="text-sm">Wishlist</span>
        {wishlistCount > 0 && (
          <Badge className="ml-auto bg-pink-600 text-white">
            {wishlistCount > 99 ? "99+" : wishlistCount}
          </Badge>
        )}
        {!user && (
          <span className="text-xs text-muted-foreground ml-auto">Sign in</span>
        )}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-10 w-10 rounded-full hover:bg-pink-50 dark:hover:bg-pink-950/20 transition-colors group"
      onClick={() => user ? navigate("/shop/wishlist") : navigate("/shop/login")}
      aria-label="Wishlist"
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-pink-600 border-t-transparent" />
      ) : (
        <Heart className="h-5 w-5 group-hover:text-pink-600 transition-colors" />
      )}
      {wishlistCount > 0 && (
        <>
          <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-pink-600 text-white text-xs font-bold rounded-full animate-pulse">
            {wishlistCount > 99 ? "99+" : wishlistCount}
          </span>
          <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-pink-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Wishlist
          </span>
        </>
      )}
    </Button>
  );
}

/* ---------------- MENU ITEMS COMPONENT ---------------- */
function MenuItem({ onNavigate, isMobile = false }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const iconMap = {
    House: House,
    User: User,
    Users: Users,
    Sparkles: Sparkles,
    Trophy: Trophy,
    Gift: Gift,
    Tag: Tag,
    ShoppingBag: ShoppingBag,
    Sparkle: Sparkle,
  };

  return (
    <nav className={cn(
      "flex flex-col gap-0",
      !isMobile && "md:flex-row md:items-center md:gap-2"
    )}>
      {shopingViewHeaderMenuItems.map((menuItem) => {
        const IconComponent = iconMap[menuItem.icon] || House;
        const isActive = currentPath === menuItem.path || 
                        (menuItem.id === "home" && currentPath === "/shop/home") ||
                        (menuItem.id !== "home" && currentPath.includes("/shop/listing"));

        return (
          <button
            key={menuItem.id}
            className={cn(
              "text-sm font-medium transition-all duration-200 px-3 py-2.5 md:px-0 md:py-2",
              "rounded-lg md:rounded-md text-left md:text-center",
              "hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10",
              isActive 
                ? "text-primary bg-gradient-to-r from-primary/10 to-primary/20 md:bg-transparent font-semibold" 
                : "text-muted-foreground hover:text-primary",
              isMobile && "w-full",
              !isMobile && "px-3 mx-1"
            )}
            onClick={() => onNavigate(menuItem)}
          >
            <div className="flex items-center gap-2 md:gap-1">
              <IconComponent className={cn(
                "h-4 w-4 transition-transform",
                isActive && "scale-110"
              )} />
              <span className="font-medium">{menuItem.label}</span>
              {isActive && (
                <div className="ml-auto md:hidden">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                </div>
              )}
            </div>
            
            {isActive && !isMobile && (
              <div className="hidden md:block h-0.5 w-full bg-gradient-to-r from-primary via-primary/70 to-primary/40 rounded-full mt-1" />
            )}
          </button>
        );
      })}
    </nav>
  );
}

/* ---------------- SEARCH COMPONENT ---------------- */
function SearchComponent({ variant = "desktop" }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { recentSearches, popularSearches, searchQuery } = useSelector((state) => state.search);

  useEffect(() => {
    dispatch(loadRecentSearches());
  }, [dispatch]);

  const handleSearch = useCallback(
    debounce((query) => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      dispatch(fetchSearchSuggestions(query))
        .unwrap()
        .then((data) => {
          setSuggestions(data.suggestions || []);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }, 300),
    [dispatch]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    dispatch(setSearchQuery(value));
    handleSearch(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = localSearchQuery.trim();
    if (query) {
      dispatch(addRecentSearch(query));
      navigate(`/shop/search?q=${encodeURIComponent(query)}`);
      setSearchOpen(false);
      setLocalSearchQuery("");
      dispatch(setSearchQuery(""));
    }
  };

  const handleSuggestionClick = (suggestion) => {
    let query = suggestion.text;
    let category = '';
    
    if (suggestion.type === 'product') {
      query = suggestion.text;
      category = suggestion.category;
    } else if (suggestion.type === 'category') {
      query = '';
      category = suggestion.category;
    } else if (suggestion.type === 'brand') {
      query = suggestion.text;
    }
    
    dispatch(addRecentSearch(query || suggestion.text));
    
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category) params.set('category', category);
    
    navigate(`/shop/search?${params.toString()}`);
    setSearchOpen(false);
    setLocalSearchQuery("");
    dispatch(setSearchQuery(""));
  };

  const handleClearRecentSearches = () => {
    dispatch(clearRecentSearches());
  };

  if (variant === "mobile") {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="h-5 w-5" />
        </Button>

        {searchOpen && (
          <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm animate-in slide-in-from-top duration-300">
            <div className="p-4 pt-6">
              <div className="flex items-center gap-2 mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(false)}
                  className="h-10 w-10"
                >
                  <ChevronDown className="h-5 w-5" />
                </Button>
                <div className="relative flex-1">
                  <form onSubmit={handleSubmit}>
                    <Input
                      ref={inputRef}
                      type="text"
                      value={localSearchQuery}
                      onChange={handleInputChange}
                      placeholder="Search products, brands, categories..."
                      className="w-full h-12 px-4 pl-12 rounded-xl bg-muted/50 border-0 focus:bg-background focus:ring-2 focus:ring-primary/20"
                      autoFocus
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    {isLoading && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      </div>
                    )}
                  </form>
                </div>
              </div>
              
              {recentSearches.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium">Recent Searches</p>
                    <button
                      onClick={handleClearRecentSearches}
                      className="text-xs text-muted-foreground hover:text-primary"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setLocalSearchQuery(search);
                          dispatch(setSearchQuery(search));
                          handleSearch(search);
                        }}
                        className="px-3 py-2 bg-muted rounded-lg text-sm hover:bg-muted/80 transition-colors flex items-center gap-2"
                      >
                        <Search className="h-3 w-3" />
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {suggestions.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-medium mb-3">Suggestions</p>
                  <div className="space-y-2">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors flex items-center justify-between"
                      >
                        <span className="text-sm">{suggestion.text}</span>
                        {suggestion.category && (
                          <Badge variant="outline" className="text-xs">
                            {suggestion.category}
                          </Badge>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-6 space-y-3">
                <p className="text-xs text-muted-foreground font-medium">Popular Categories</p>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.slice(0, 5).map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        navigate(`/shop/listing?category=${encodeURIComponent(term)}`);
                        setSearchOpen(false);
                      }}
                      className="px-3 py-2 bg-muted rounded-lg text-sm hover:bg-muted/80 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="relative hidden lg:block">
      <form onSubmit={handleSubmit} className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={localSearchQuery}
          onChange={handleInputChange}
          placeholder="Search for products, brands, categories..."
          className="w-72 xl:w-80 h-10 px-4 pl-10 rounded-full bg-muted/50 border-0 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-300"
          onFocus={() => setSearchOpen(true)}
          onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </form>
      
      {searchOpen && (localSearchQuery.trim() || recentSearches.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-xl shadow-2xl z-50 animate-in slide-in-from-top-5 duration-200">
          <div className="p-4">
            {localSearchQuery.trim() && suggestions.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">Suggestions</p>
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left p-2 rounded hover:bg-muted/50 transition-colors flex items-center justify-between mb-1"
                  >
                    <span className="text-sm">{suggestion.text}</span>
                    {suggestion.category && (
                      <Badge variant="outline" className="text-xs">
                        {suggestion.category}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            )}
            
            {recentSearches.length > 0 && !localSearchQuery.trim() && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-muted-foreground">Recent Searches</p>
                  <button
                    onClick={handleClearRecentSearches}
                    className="text-xs text-muted-foreground hover:text-primary"
                  >
                    Clear all
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setLocalSearchQuery(search);
                        dispatch(setSearchQuery(search));
                        inputRef.current?.focus();
                      }}
                      className="w-full text-left p-2 rounded hover:bg-muted/50 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Search className="h-3 w-3" />
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {!localSearchQuery.trim() && recentSearches.length === 0 && (
              <div className="text-center py-4">
                <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Search for products</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- CART INDICATOR ---------------- */
function CartIndicator({ isMobile = false, onClick }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems = [] } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);
  
  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const totalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    [cartItems]
  );

  if (isMobile) {
    return (
      <Button
        variant="outline"
        size="default"
        className="w-full justify-start gap-3"
        onClick={onClick}
      >
        <ShoppingCart className="h-4 w-4" />
        <span className="text-sm">Shopping Cart</span>
        {cartCount > 0 && (
          <Badge className="ml-auto bg-primary text-primary-foreground">
            {cartCount} item{cartCount !== 1 ? 's' : ''}
          </Badge>
        )}
      </Button>
    );
  }

  return (
    <>
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="relative h-10 w-10 rounded-full hover:bg-primary/5 transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <>
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-red-600 text-white text-xs font-bold rounded-full animate-bounce">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-primary whitespace-nowrap">
                  GHC {totalPrice.toFixed(2)}
                </span>
              </>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-md p-0">
          <UserCartWrapper 
            cartItems={cartItems} 
            setOpenCartSheet={setOpenCartSheet}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}

/* ---------------- USER MENU COMPONENT ---------------- */
function UserMenu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { wishlistCount } = useSelector((state) => state.wishlist);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => document.documentElement.classList.contains("dark")
  );

  const toggleTheme = useCallback(() => {
    const isDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark");
    setDarkMode(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, []);

  const handleLogout = useCallback(() => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        setOpenLogoutDialog(false);
        navigate("/shop/home");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
        navigate("/shop/home");
      });
  }, [dispatch, navigate]);

  if (!user) {
    return (
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => navigate("/shop/login")}
      >
        <User className="h-4 w-4" />
        <span>Sign In</span>
      </Button>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 px-2 h-10 hover:bg-muted/50">
            <Avatar className="h-8 w-8 ring-2 ring-primary/20 transition-transform hover:scale-105">
              <AvatarFallback className="bg-gradient-to-br from-amber-500 to-rose-500 text-white font-semibold">
                {user?.userName?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="hidden lg:flex flex-col items-start">
              <span className="text-sm font-medium max-w-[100px] truncate">
                {user?.userName?.split(" ")[0] || "Account"}
              </span>
              <span className="text-xs text-muted-foreground">Account</span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-2 p-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-amber-500 to-rose-500 text-white text-lg">
                    {user?.userName?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{user?.userName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => navigate("/shop/account")}
              className="cursor-pointer gap-2 py-3"
            >
              <UserCog className="h-4 w-4" />
              Account Settings
            </DropdownMenuItem>
            
            <DropdownMenuItem
              onClick={() => navigate("/shop/orders")}
              className="cursor-pointer gap-2 py-3"
            >
              <Package className="h-4 w-4" />
              My Orders
              <Badge variant="secondary" className="ml-auto">3</Badge>
            </DropdownMenuItem>
            
            <DropdownMenuItem
              onClick={() => navigate("/shop/wishlist")}
              className="cursor-pointer gap-2 py-3"
            >
              <Heart className="h-4 w-4" />
              Wishlist
              <Badge variant="secondary" className="ml-auto bg-pink-600">
                {wishlistCount || 0}
              </Badge>
            </DropdownMenuItem>
            
            <DropdownMenuItem
              onClick={() => navigate("/shop/gift-cards")}
              className="cursor-pointer gap-2 py-3"
            >
              <Gift className="h-4 w-4" />
              Gift Cards
            </DropdownMenuItem>
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => navigate("/shop/settings")}
              className="cursor-pointer gap-2 py-3"
            >
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
            
            <DropdownMenuItem
              onClick={() => navigate("/shop/help")}
              className="cursor-pointer gap-2 py-3"
            >
              <HelpCircle className="h-4 w-4" />
              Help & Support
            </DropdownMenuItem>
            
            <DropdownMenuItem
              onClick={toggleTheme}
              className="cursor-pointer gap-2 py-3"
            >
              {darkMode ? (
                <>
                  <Sun className="h-4 w-4" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4" />
                  Dark Mode
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => setOpenLogoutDialog(true)}
            className="cursor-pointer gap-2 py-3 text-red-600 focus:text-red-600 focus:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Logout Dialog */}
      <Dialog open={openLogoutDialog} onOpenChange={setOpenLogoutDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <LogOut className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <DialogTitle>Sign Out</DialogTitle>
                <DialogDescription>
                  Are you sure you want to sign out of your account?
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              You'll need to sign in again to access your account, orders, and wishlist.
            </p>
          </div>
          
          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setOpenLogoutDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ---------------- MAIN HEADER COMPONENT ---------------- */
function ShoppingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsMounted(true);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = useCallback((menuItem) => {
    sessionStorage.removeItem("shop-filters");
    
    if (menuItem.id !== "home") {
      sessionStorage.setItem("shop-filters", JSON.stringify({ category: [menuItem.id] }));
      const params = new URLSearchParams();
      params.set("category", menuItem.id);
      navigate(`/shop/listing?${params.toString()}`);
    } else {
      navigate("/shop/home");
    }
    
    setMobileOpen(false);
  }, [navigate]);

  const isHomePage = location.pathname === "/shop/home";

  if (!isMounted) return null;

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b transition-all duration-300",
      scrolled 
        ? "bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 shadow-lg" 
        : "bg-background",
      isHomePage && scrolled ? "border-b" : "border-transparent"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              
              <SheetContent side="left" className="w-full sm:max-w-sm p-0 overflow-y-auto">
                <div className="sticky top-0 z-10 bg-background border-b px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">A</span>
                      </div>
                      <div>
                        <p className="font-bold text-lg">adeeB</p>
                        <p className="text-xs text-muted-foreground">Luxury Perfumes</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMobileOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 space-y-6">
                  <div className="space-y-1">
                    <MenuItem onNavigate={handleNavigate} isMobile />
                  </div>
                  
                  <div className="pt-6 border-t">
                    <div className="space-y-3">
                      <SearchComponent variant="mobile" />
                      <WishlistIndicator isMobile />
                      <CartIndicator isMobile onClick={() => setMobileOpen(false)} />
                      <UserMenu />
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t">
                    <div className="text-center text-sm text-muted-foreground space-y-2">
                      <p>© {new Date().getFullYear()} adeeB Perfumes</p>
                      <div className="flex flex-wrap justify-center gap-3">
                        <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms</a>
                        <a href="#" className="hover:text-primary transition-colors">Contact</a>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <Link 
              to="/shop/home" 
              className="flex items-center gap-2.5 group flex-shrink-0"
            >
              <div className="relative">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center transition-transform group-hover:scale-105 group-hover:rotate-12">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 opacity-0 group-hover:opacity-20 blur transition-opacity" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="font-serif text-xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
                  adeeB
                </span>
                <span className="text-[10px] text-muted-foreground tracking-widest uppercase">
                  PERFUMES
                </span>
              </div>
            </Link>
            
            <div className="hidden lg:flex items-center gap-1 ml-8">
              <MenuItem onNavigate={handleNavigate} />
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-4">
            <SearchComponent variant="desktop" />
            <WishlistIndicator />
            <CartIndicator />
            <UserMenu />
          </div>
          
          <div className="flex items-center gap-2 lg:hidden">
            <SearchComponent variant="mobile" />
            <WishlistIndicator />
            <CartIndicator onClick={() => setMobileOpen(false)} />
          </div>
        </div>
      </div>
      
      <div className={cn(
        "lg:hidden overflow-x-auto transition-all duration-300",
        scrolled ? "bg-background border-t" : "bg-muted/30"
      )}>
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 py-2 min-w-max">
            {shopingViewHeaderMenuItems
              .filter(item => item.id !== "home")
              .map((menuItem) => {
                const iconMap = {
                  House: House,
                  User: User,
                  Users: Users,
                  Sparkles: Sparkles,
                  Trophy: Trophy,
                  Gift: Gift,
                  Tag: Tag,
                  ShoppingBag: ShoppingBag,
                  Sparkle: Sparkle,
                };
                const IconComponent = iconMap[menuItem.icon] || House;
                
                return (
                  <button
                    key={menuItem.id}
                    className="text-xs font-medium whitespace-nowrap px-3 py-1.5 rounded-full bg-background border hover:bg-primary/10 hover:border-primary/30 transition-colors flex items-center gap-1"
                    onClick={() => handleNavigate(menuItem)}
                  >
                    <IconComponent className="h-3 w-3" />
                    {menuItem.label}
                  </button>
                );
              })}
          </div>
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;