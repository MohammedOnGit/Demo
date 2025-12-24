import React from "react";
import accountImage from "../../assets/ban/accountImage.webp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Address from "@/components/shoping-view/address";
import ShoppingOrders from "@/components/shoping-view/orders";

function ShoppingAccount() {
  return (
    <section className="flex flex-col">
      {/* ================= ACCOUNT BANNER ================= */}
      <div className="relative w-full h-[340px] sm:h-[420px] md:h-[480px] overflow-hidden bg-muted">
        <img
          src={accountImage}
          alt="User account banner"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      </div>

      {/* ================= ACCOUNT CONTENT ================= */}
      <div className="container mx-auto px-4 py-10">
        <div className="rounded-xl bg-background p-6 shadow-sm">
          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="flex justify-center sm:justify-start">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <ShoppingOrders/>
            </TabsContent>

            <TabsContent value="address">
              <Address />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}

export default ShoppingAccount;
