import { Outlet } from "react-router-dom";
import AdminSideBar from "./sidebar";
import AdminHeader from "./header";
import { useState } from "react";

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-muted/40">
      {/* ✅ SIDEBAR */}
      <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} />

      {/* ✅ MAIN CONTENT AREA */}
      <div className="flex flex-1 flex-col w-full">
        {/* ✅ HEADER */}
        <AdminHeader setOpen={setOpenSidebar} />

        {/* ✅ PAGE CONTENT */}
        <main
          className="
            flex-1 
            w-full 
            p-3 
            sm:p-4 
            md:p-6 
            overflow-y-auto
          "
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
