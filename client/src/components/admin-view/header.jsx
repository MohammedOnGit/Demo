
// AdminHeader.jsx - JavaScript version
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Menu, LogOut, User } from "lucide-react";
import { logoutUser } from "@/store/auth-slice";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  function handleLogout() {
    dispatch(logoutUser());
    setOpenLogoutDialog(false);
    setOpen(false); // Close sidebar if open
    navigate("/auth/login");
  }

  return (
    <>
      {/* HEADER - Fixed height */}
      <header className="w-full flex h-[var(--header-height)] items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile Menu Toggle */}
        <Button
          onClick={() => setOpen(true)}
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open sidebar menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Right: User Actions */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Logout Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">Admin</span>
                </div>
                {/* Mobile: Only icon */}
                <div className="sm:hidden">
                  <LogOut className="h-4 w-4" />
                </div>
                <span className="sr-only">Open user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setOpenLogoutDialog(true)}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* LOGOUT CONFIRMATION DIALOG */}
      <Dialog open={openLogoutDialog} onOpenChange={setOpenLogoutDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out of your account? You will be redirected to the login page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setOpenLogoutDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Yes, Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AdminHeader;