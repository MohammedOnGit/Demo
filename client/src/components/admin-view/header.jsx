import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "../ui/button";
import { Menu, LogOut } from "lucide-react";
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
    setOpen(false); // ✅ close sidebar
    navigate("/auth/login"); // ✅ redirect after logout
  }

  return (
    <>
      {/* ✅ HEADER */}
      <header className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 border-b bg-white">
  {/* ✅ MOBILE MENU BUTTON */}
  <Button
    onClick={() => setOpen(true)}
    className="inline-flex lg:hidden"
    size="icon"
    variant="outline"
  >
    <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
    <span className="sr-only">Toggle menu</span>
  </Button>

  {/* ✅ RIGHT SIDE (LOGOUT BUTTON) */}
  <div className="flex flex-1 justify-end">
    <Button
      onClick={() => setOpenLogoutDialog(true)}
      className="
        inline-flex items-center gap-2 
        rounded-md shadow 
        px-3 py-2 text-xs 
        sm:px-4 sm:py-2 sm:text-sm
      "
      variant="destructive"
    >
      <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
      <span className="hidden sm:inline">Logout</span>
    </Button>
  </div>
</header>


      {/* ✅ LOGOUT CONFIRMATION DIALOG */}
      <Dialog open={openLogoutDialog} onOpenChange={setOpenLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out of your account?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex gap-2">
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
