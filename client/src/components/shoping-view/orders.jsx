

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent } from "../ui/dialog";
import ShoppingOrderDetailsView from "./order-details";
import {
  Search,
  Filter,
  Download,
  Eye,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  Calendar,
  CreditCard,
} from "lucide-react";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

const statusConfig = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-800", icon: Clock },
  processing: { label: "Processing", color: "bg-blue-100 text-blue-800", icon: Package },
  shipping: { label: "Shipping", color: "bg-purple-100 text-purple-800", icon: Truck },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-800", icon: CheckCircle },
  rejected: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: XCircle },
};

function StatusBadge({ status }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <Badge className={cn("gap-1.5", config.color)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

function ShoppingOrders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const orders = [
    { id: "ORD-001", date: "12 Dec 2025", status: "processing", total: 450.0, items: 2, payment: "Mobile Money", deliveryDate: "18-22 Dec 2025" },
    { id: "ORD-002", date: "10 Dec 2025", status: "delivered", total: 890.0, items: 3, payment: "Credit Card", deliveryDate: "15 Dec 2025" },
    { id: "ORD-003", date: "08 Dec 2025", status: "pending", total: 220.0, items: 1, payment: "Cash on Delivery", deliveryDate: "Pending" },
    { id: "ORD-004", date: "05 Dec 2025", status: "shipping", total: 670.0, items: 4, payment: "Bank Transfer", deliveryDate: "10-12 Dec 2025" },
    { id: "ORD-005", date: "01 Dec 2025", status: "rejected", total: 350.0, items: 2, payment: "Mobile Money", deliveryDate: "Cancelled" },
  ];

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.payment.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  return (
    <>
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Order History</CardTitle>
              <CardDescription>Track and manage all your orders in one place</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" /> Export
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders by ID or payment method..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <config.icon className="h-3 w-3" />
                      {config.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table View */}
          <div className="hidden lg:block rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableCaption className="py-3">
                  {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
                </TableCaption>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map(order => (
                    <TableRow key={order.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-mono text-sm">{order.id}</TableCell>
                      <TableCell className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" /> {order.date}
                      </TableCell>
                      <TableCell><StatusBadge status={order.status} /></TableCell>
                      <TableCell className="text-sm">{order.items} item{order.items !== 1 ? 's' : ''}</TableCell>
                      <TableCell className="flex items-center gap-2 text-sm">
                        <CreditCard className="h-3 w-3 text-muted-foreground" /> {order.payment}
                      </TableCell>
                      <TableCell className="text-right font-bold">GHC {order.total.toFixed(2)}</TableCell>
                      <TableCell className="text-center">
                        <Button size="sm" variant="ghost" className="gap-2" onClick={() => openOrderDetails(order)}>
                          <Eye className="h-4 w-4" /> View <ChevronRight className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4 mt-6">
            {filteredOrders.map(order => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-mono font-bold text-lg">{order.id}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3" /> {order.date}
                      </div>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  <Separator className="my-3" />

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-muted-foreground">Items</div>
                      <div className="font-medium">{order.items} item{order.items !== 1 ? 's' : ''}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Payment</div>
                      <div className="font-medium">{order.payment}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Delivery</div>
                      <div className="font-medium">{order.deliveryDate}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Total</div>
                      <div className="font-bold text-lg">GHC {order.total.toFixed(2)}</div>
                    </div>
                  </div>

                  <Button className="w-full mt-4 gap-2" onClick={() => openOrderDetails(order)}>
                    <Eye className="h-4 w-4" /> View Order Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl p-0">
          {selectedOrder && <ShoppingOrderDetailsView order={selectedOrder} />}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ShoppingOrders;
