import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "../ui/button";
import { Menu, LogOut } from "lucide-react";
import { logoutUser } from "@/store/auth-slice";
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
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  function handleLogout() {
    dispatch(logoutUser());
    setOpenLogoutDialog(false);
  }

  return (
    <>
      {/* ✅ HEADER */}
      <header className="flex items-center justify-between px-4 border-b">
        <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
          <Menu />
          <span className="sr-only">Toggle menu</span>
        </Button>

        <div className="flex flex-1 justify-end">
          <Button
            onClick={() => setOpenLogoutDialog(true)}
            className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
          >
            <LogOut />
            Logout
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
