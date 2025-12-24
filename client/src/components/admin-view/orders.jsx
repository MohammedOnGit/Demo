import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

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

function AdminOrdersViews() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="">
          <Table>
            <TableCaption>
              A list of your recent orders.
            </TableCaption>

            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Order ID</TableHead>
                <TableHead className="text-center">Date</TableHead>
                <TableHead className="text-center">Status</TableHead>

                {/* RIGHT aligned header */}
                <TableHead className="text-center">
                  Total
                </TableHead>

                {/* RIGHT aligned header */}
                <TableHead className="text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow>
                <TableCell className="font-medium text-center">
                  #INV001
                </TableCell>

                <TableCell className="text-center">12 Dec 2025</TableCell>

                <TableCell className="text-center">
                  <Badge variant="secondary">
                    In Progress
                  </Badge>
                </TableCell>

                {/* RIGHT aligned cell */}
                <TableCell className="text-center">
                  GHC 450.00
                </TableCell>

                {/* RIGHT aligned cell */}
                <TableCell className="text-center">
                  <Button size="sm">
                    View Details
                  </Button>
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
