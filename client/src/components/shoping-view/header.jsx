import React, { useEffect, useState } from "react";
import { House, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetTrigger } from "../ui/sheet";
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

/* ---------------- MENU LINKS ---------------- */
function MenuItem() {
  return (
    <nav className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 py-3 md:py-0">
      {shopingViewHeaderMenuItems.map((menuItem) => (
        <Link
          key={menuItem.id}
          to={menuItem.path}
          className="text-sm font-medium hover:text-primary"
        >
          {menuItem.label}
        </Link>
      ))}
    </nav>
  );
}

/* ---------------- RIGHT HEADER CONTENT ---------------- */
function HeaderRightContent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { cartItems = [] } = useSelector((state) => state.shopCart);

  const [openCartSheet, setOpenCartSheet] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    setOpenLogoutDialog(false);
    navigate("/shop/home");
  };

  /* ---------------- FETCH CART ---------------- */
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* CART */}
        <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
          <Button
            onClick={() => setOpenCartSheet(true)}
            variant="outline"
            size="icon"
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="sr-only">User cart</span>
          </Button>

          <UserCartWrapper cartItems={cartItems} />
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

          <DropdownMenuContent>
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

            <DropdownMenuItem onClick={() => navigate("/shop/account")}>
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

      {/* LOGOUT DIALOG */}
      <Dialog open={openLogoutDialog} onOpenChange={setOpenLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setOpenLogoutDialog(false)}
            >
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
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <div className="p-6">
              <MenuItem />
              <HeaderRightContent />
            </div>
          </Sheet>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6">
          <MenuItem />
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
