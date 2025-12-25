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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogTrigger,
} from "../ui/dialog";
import AdminOrderDetailsView from "./order-details-view";


function AdminOrdersViews() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>
              A list of all customer orders.
            </TableCaption>

            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Order ID</TableHead>
                <TableHead className="text-center">Date</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Total</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow>
                <TableCell className="text-center font-medium">
                  #INV001
                </TableCell>

                <TableCell className="text-center">
                  12 Dec 2025
                </TableCell>

                <TableCell className="text-center">
                  <Badge variant="secondary">
                    In Progress
                  </Badge>
                </TableCell>

                <TableCell className="text-center">
                  GHC 450.00
                </TableCell>

                <TableCell className="text-center">
                  <Dialog
                    open={openDetailsDialog}
                    onOpenChange={setOpenDetailsDialog}
                  >
                    <DialogTrigger asChild>
                      <Button size="sm">
                        View Details
                      </Button>
                    </DialogTrigger>

                    <AdminOrderDetailsView />
                  </Dialog>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdminOrdersViews;
