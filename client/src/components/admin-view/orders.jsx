import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreVertical, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import AdminOrderDetailsView from "./order-details-view";

const mockOrders = [
  {
    id: "INV001",
    date: "2025-12-12",
    status: "pending",
    total: 450.0,
    itemCount: 3,
  },
  {
    id: "INV002",
    date: "2025-12-10",
    status: "processing",
    total: 1200.5,
    itemCount: 5,
  },
  {
    id: "INV003",
    date: "2025-12-08",
    status: "shipped",
    total: 89.99,
    itemCount: 1,
  },
  {
    id: "INV004",
    date: "2025-12-05",
    status: "delivered",
    total: 320.0,
    itemCount: 2,
  },
  {
    id: "INV005",
    date: "2025-12-03",
    status: "cancelled",
    total: 199.0,
    itemCount: 4,
  },
];

function getStatusConfig(status) {
  switch (status) {
    case "pending":
      return { label: "Pending", variant: "secondary", icon: Package };
    case "processing":
      return { label: "Processing", variant: "default", icon: Package };
    case "shipped":
      return { label: "Shipped", variant: "outline", icon: Truck };
    case "delivered":
      return { label: "Delivered", variant: "success", icon: CheckCircle };
    case "cancelled":
      return { label: "Cancelled", variant: "destructive", icon: XCircle };
    default:
      return { label: status, variant: "secondary", icon: Package };
  }
}

function AdminOrdersViews() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setOpenDetailsDialog(true);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(amount);
  };

  return (
    <Card className="h-full border-0 shadow-lg">
      <CardHeader className="border-b bg-muted/40">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">All Orders</CardTitle>
          <div className="text-sm text-muted-foreground">
            {mockOrders.length} total orders
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {mockOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <TableRow
                    key={order.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-medium">{order.id}</TableCell>

                    <TableCell className="text-muted-foreground">
                      {formatDate(order.date)}
                    </TableCell>

                    <TableCell>
                      <span className="text-sm">{order.itemCount} items</span>
                    </TableCell>

                    <TableCell>
                      <Badge variant={statusConfig.variant} className="gap-1">
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig.label}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right font-semibold">
                      {formatCurrency(order.total)}
                    </TableCell>

                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Order actions</span>
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Order {order.id}</DropdownMenuLabel>

                          <DropdownMenuItem
                            onClick={() => handleViewDetails(order)}
                            className="cursor-pointer"
                          >
                            View Details
                          </DropdownMenuItem>

                          {/* Future actions can be added here */}
                          {/* <DropdownMenuItem>Update Status</DropdownMenuItem> */}
                          {/* <DropdownMenuItem>Print Invoice</DropdownMenuItem> */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {mockOrders.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No orders found.</p>
            </div>
          )}
        </div>
      </CardContent>

      {/* Order Details Dialog */}
      <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              View complete information about this order
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && <AdminOrderDetailsView order={selectedOrder} />}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default AdminOrdersViews;