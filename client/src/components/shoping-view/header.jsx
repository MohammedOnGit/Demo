import React, { useEffect, useState, useMemo } from "react";
import {
  House,
  LogOut,
  Menu,
  ShoppingCart,
  UserCog,
  Sun,
  Moon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetTrigger, SheetContent } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shopingViewHeaderMenuItems } from "@/config";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import { fetchCartItems } from "@/store/shop/cart-slice";
import UserCartWrapper from "./cart-wrapper";
import { Label } from "../ui/label";

/* ---------------- MENU ITEMS ---------------- */
function MenuItem({ onNavigate }) {
  return (
    <nav className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 py-3 md:py-0">
      {shopingViewHeaderMenuItems.map((menuItem) => (
        <Label
          key={menuItem.id}
          className="text-sm font-medium hover:text-primary cursor-pointer"
          onClick={() => onNavigate(menuItem)}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

/* ---------------- RIGHT HEADER CONTENT ---------------- */
function HeaderRightContent({ onNavigate }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { cartItems = [] } = useSelector((state) => state.shopCart);

  const [openCartSheet, setOpenCartSheet] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode((prev) => !prev);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setOpenLogoutDialog(false);
    navigate("/shop/home");
    onNavigate?.();
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* THEME TOGGLE */}
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </Button>

        {/* CART */}
        <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1 rounded-full">
                  {cartCount}
                </span>
              )}
            </Button>
          </SheetTrigger>

          <SheetContent side="right">
            <UserCartWrapper cartItems={cartItems} setOpenCartSheet={setOpenCartSheet} />
          </SheetContent>
        </Sheet>

        {/* USER MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="bg-gray-500 cursor-pointer">
              <AvatarFallback className="bg-gray-500 text-white font-semibold">
                {user?.userName?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="flex justify-center">
              <Avatar className="bg-gray-500">
                <AvatarFallback className="bg-gray-500 text-white font-semibold">
                  {user?.userName?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuLabel>

            <div className="flex flex-col items-center px-4 pb-2">
              <span className="font-bold">{user?.userName}</span>
              <p className="text-muted-foreground text-sm">{user?.email}</p>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                navigate("/shop/account");
                onNavigate?.();
              }}
            >
              <UserCog className="mr-2 h-4 w-4" />
              Account
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => setOpenLogoutDialog(true)}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* LOGOUT CONFIRMATION */}
      <Dialog open={openLogoutDialog} onOpenChange={setOpenLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setOpenLogoutDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ---------------- MAIN HEADER ---------------- */
function ShoppingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (menuItem) => {
    // Remove old filters
    sessionStorage.removeItem("shop-filters");

    // Only apply category if not home
    const currentFilter =
      menuItem.id !== "home" ? { category: [menuItem.id] } : null;

    if (currentFilter) {
      sessionStorage.setItem("shop-filters", JSON.stringify(currentFilter));
      const params = new URLSearchParams();
      params.set("category", menuItem.id);
      navigate(`/shop/listing?${params.toString()}`);
    } else {
      navigate("/shop/home");
    }

    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* LOGO */}
        <Link className="flex items-center gap-2" to="/shop/home">
          <House className="h-6 w-6" />
          <span className="font-bold">adeeB</span>
        </Link>

        {/* MOBILE MENU */}
        <div className="md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right">
              <MenuItem onNavigate={handleNavigate} />
              <HeaderRightContent onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6">
          <MenuItem onNavigate={handleNavigate} />
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
