
// AdminSideBar.jsx - JavaScript version
import {
  BadgeCheck,
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
} from "lucide-react";
import { Fragment } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket className="h-5 w-5" />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck className="h-5 w-5" />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleNavigate = (path) => {
    navigate(path);
    if (setOpen) setOpen(false); // Close mobile sheet on navigation
  };

  return (
    <nav className="mt-8 flex flex-col gap-1">
      {adminSidebarMenuItems.map((item) => {
        const isActive = pathname === item.path;

        return (
          <div
            key={item.id}
            onClick={() => handleNavigate(item.path)}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
              "hover:bg-accent hover:text-accent-foreground",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        );
      })}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogoClick = () => {
    navigate("/admin/dashboard");
    if (setOpen) setOpen(false);
  };

  return (
    <Fragment>
      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col h-screen-dynamic">
            <SheetHeader className="border-b bg-background px-6 py-5">
              <SheetTitle
                className="flex cursor-pointer items-center gap-3"
                onClick={handleLogoClick}
              >
                <ChartNoAxesCombined className="h-8 w-8 text-primary" />
                <h1 className="text-xl font-extrabold tracking-tight">
                  Admin Panel
                </h1>
              </SheetTitle>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-4 py-6">
              <MenuItems setOpen={setOpen} />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-background lg:flex">
        <div className="flex h-full flex-col h-screen-dynamic">
          {/* Logo/Header */}
          <div className="border-b px-6 py-5">
            <div
              onClick={() => navigate("/admin/dashboard")}
              className="flex cursor-pointer items-center gap-3"
            >
              <ChartNoAxesCombined className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-extrabold tracking-tight">
                Admin Panel
              </h1>
            </div>
          </div>

          {/* Menu */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <MenuItems />
          </div>
        </div>
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;