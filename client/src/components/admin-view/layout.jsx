
// AdminLayout.jsx
import { Outlet } from "react-router-dom";
import AdminSideBar from "./sidebar";
import AdminHeader from "./header";
import { useState, useEffect } from "react";
import { useViewportHeight } from "../hooks/useViewportHeight";
import { cn } from "@/lib/utils";

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { vh } = useViewportHeight();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div 
      className="flex min-h-screen-dynamic w-full bg-muted/40"
      style={{ '--vh': `${vh}px` }}
    >
      {/* Sidebar - Mobile Sheet + Desktop Persistent */}
      <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header - Sticky with header height compensation */}
        <div className="sticky top-0 z-40">
          <AdminHeader setOpen={setOpenSidebar} />
        </div>

        {/* Page Content with header offset */}
        <main 
          className={cn(
            "flex-1 overflow-y-auto bg-background",
            "transition-all duration-300"
          )}
          style={{
            minHeight: `calc(${vh}px * 100 - var(--header-height))`,
            maxHeight: `calc(${vh}px * 100 - var(--header-height))`,
            height: `calc(${vh}px * 100 - var(--header-height))`
          }}
        >
          <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;