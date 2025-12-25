import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Dialog, DialogTrigger } from "../ui/dialog";
import ShoppingOrderDetailsView from "./order-details";

function ShoppingOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Order History</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableCaption>A list of your recent orders.</TableCaption>

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
              <TableCell className="font-medium text-center">#INV001</TableCell>
              <TableCell className="text-center">12 Dec 2025</TableCell>
              <TableCell className="text-center">
                <Badge variant="secondary">In Progress</Badge>
              </TableCell>
              <TableCell className="text-center">GHC 450.00</TableCell>
              <TableCell className="text-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">View Details</Button>
                  </DialogTrigger>
                  <ShoppingOrderDetailsView />
                </Dialog>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;
