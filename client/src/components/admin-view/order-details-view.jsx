
import React, { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import CommonForm from "../common/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { 
  X, 
  Package, 
  User, 
  Phone, 
  MapPin, 
  Calendar,
  CreditCard,
  CheckCircle,
  Truck,
  PackageOpen,
  AlertCircle,
  Download,
  Printer,
  Globe,
  City,
  Home,
  FileText,
  MessageSquare,
  BarChart3,
  Users,
  Tag,
  Percent,
  Mail,
  MessageCircle,
  Bell,
  Shield,
  Edit,
  Copy,
  Search,
  Filter,
  MoreVertical
} from "lucide-react";

// Ghana regions with admin-specific data
const ghanaRegions = {
  "Northern": { 
    color: "text-orange-600", 
    bg: "bg-orange-50",
    deliveryDays: "3-5",
    warehouse: "Tamale Hub",
    manager: "Kwame Mensah"
  },
  "Greater Accra": { 
    color: "text-blue-600", 
    bg: "bg-blue-50",
    deliveryDays: "1-2",
    warehouse: "Accra Central",
    manager: "Ama Serwaa"
  },
  "Ashanti": { 
    color: "text-amber-600", 
    bg: "bg-amber-50",
    deliveryDays: "2-3",
    warehouse: "Kumasi Depot",
    manager: "Kofi Asante"
  },
  "Eastern": { 
    color: "text-emerald-600", 
    bg: "bg-emerald-50",
    deliveryDays: "2-4",
    warehouse: "Koforidua Center",
    manager: "Esi Boateng"
  },
  "Western": { 
    color: "text-red-600", 
    bg: "bg-red-50",
    deliveryDays: "3-5",
    warehouse: "Takoradi Base",
    manager: "Yaw Sarpong"
  },
  // Add other regions as needed
};

const statusVariants = {
  pending: { variant: "default", icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-50" },
  processing: { variant: "secondary", icon: PackageOpen, color: "text-blue-500", bg: "bg-blue-50" },
  shipping: { variant: "outline", icon: Truck, color: "text-purple-500", bg: "bg-purple-50" },
  delivered: { variant: "success", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
  rejected: { variant: "destructive", icon: X, color: "text-red-500", bg: "bg-red-50" },
};

function AdminOrderDetailsView() {
  const [formData, setFormData] = useState({ status: "processing" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Updated status:", formData.status);
    setIsSubmitting(false);
  };

  const currentStatus = "processing";
  const StatusIcon = statusVariants[currentStatus]?.icon || PackageOpen;
  const customerRegion = "Northern";
  const regionInfo = ghanaRegions[customerRegion] || { 
    color: "text-gray-600", 
    bg: "bg-gray-50",
    deliveryDays: "3-5",
    warehouse: "Regional Hub",
    manager: "Regional Manager"
  };

  return (
    <DialogContent className="w-full max-w-full h-[100dvh] sm:h-auto sm:max-h-[95vh] sm:max-w-7xl flex flex-col overflow-hidden p-0 sm:rounded-2xl shadow-2xl bg-background">
      {/* Sticky Header */}
      <DialogHeader className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-4 sm:px-8 py-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <DialogTitle className="text-xl sm:text-2xl font-bold truncate">
                Order #ORD-122355
              </DialogTitle>
              <Badge
                variant={statusVariants[currentStatus]?.variant || "secondary"}
                className="shrink-0 text-sm sm:text-base px-3 sm:px-4 py-1 font-medium flex items-center gap-2"
              >
                <StatusIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
              </Badge>
            </div>
            
            {/* Admin Action buttons */}
            <div className="hidden md:flex items-center gap-2 ml-4">
              <button className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted/50 transition-colors gap-2">
                <Download className="h-4 w-4" />
                Export CSV
              </button>
              <button className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted/50 transition-colors gap-2">
                <Printer className="h-4 w-4" />
                Print Invoice
              </button>
              <button className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted/50 transition-colors gap-2 text-blue-600">
                <Edit className="h-4 w-4" />
                Edit Order
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile action buttons */}
            <button className="md:hidden inline-flex items-center justify-center p-2 rounded-lg hover:bg-muted transition-colors">
              <Download className="h-5 w-5" />
            </button>
            <button className="md:hidden inline-flex items-center justify-center p-2 rounded-lg hover:bg-muted transition-colors">
              <MoreVertical className="h-5 w-5" />
            </button>
            
            <DialogClose className="p-2 rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>
        </div>
      </DialogHeader>

      {/* Admin Tabs */}
      <div className="sticky top-[73px] z-40 bg-background/95 backdrop-blur-sm border-b supports-[backdrop-filter]:bg-background/60">
        <div className="px-4 sm:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {["details", "logistics", "financial", "customer", "notes"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                  ${activeTab === tab 
                    ? "border-primary text-primary" 
                    : "border-transparent text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                {tab === "details" && "Order Details"}
                {tab === "logistics" && "Logistics"}
                {tab === "financial" && "Financial"}
                {tab === "customer" && "Customer"}
                {tab === "notes" && "Internal Notes"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-8 py-6 space-y-8">
          {/* Ghana Business Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border rounded-xl p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Order Value</p>
                  <p className="font-bold text-2xl sm:text-3xl">GHC 450.00</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Tag className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Average order: GHC 380.00</span>
                  </div>
                </div>
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            
            <div className="bg-card border rounded-xl p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Payment Method</p>
                  <p className="font-semibold text-lg">Mobile Money</p>
                  <div className="flex items-center gap-1 mt-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-muted-foreground">MTN MoMo • Verified</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-card border rounded-xl p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Region</p>
                  <Badge className={`${regionInfo.bg} ${regionInfo.color} border-0 font-medium`}>
                    {customerRegion}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-2">{regionInfo.deliveryDays} days delivery</p>
                </div>
                <City className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            
            <div className="bg-card border rounded-xl p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Order Date</p>
                  <p className="font-semibold text-lg">12 Dec 2025</p>
                  <p className="text-sm text-muted-foreground">14:30 GMT</p>
                </div>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Ghana Customer & Delivery Information */}
              <section className="bg-card border rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Customer & Delivery Details
                  </h3>
                  <Badge variant="outline" className="font-normal flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Verified Account
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`h-10 w-10 rounded-full ${regionInfo.bg} flex items-center justify-center flex-shrink-0`}>
                        <User className={`h-5 w-5 ${regionInfo.color}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-muted-foreground mb-1">Customer Name</p>
                        <p className="font-medium truncate">Mohammed Ibrahim</p>
                        <p className="text-xs text-muted-foreground mt-1">Customer ID: CUST-78901</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-muted-foreground mb-1">Contact Information</p>
                        <p className="font-medium">+233 24 000 0000</p>
                        <p className="text-xs text-muted-foreground mt-1">MTN Ghana • Primary contact</p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-3 mt-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Bell className="h-3 w-3 text-blue-600" />
                        <p className="text-xs font-medium text-blue-700">Delivery Preference</p>
                      </div>
                      <p className="text-sm text-blue-600">"Please deliver after 5 PM. Call upon arrival."</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`h-10 w-10 rounded-full ${regionInfo.bg} flex items-center justify-center flex-shrink-0`}>
                        <MapPin className={`h-5 w-5 ${regionInfo.color}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-muted-foreground mb-1">Delivery Address</p>
                        <p className="font-medium">Tamale, Northern Region</p>
                        <p className="text-xs text-muted-foreground mt-1">Ghana Postal: TL-1234 • Residential</p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">Assigned Warehouse</p>
                        <Badge variant="outline" className="text-xs">
                          {regionInfo.warehouse}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Manager: {regionInfo.manager} • Delivery Window: {regionInfo.deliveryDays} days
                      </p>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg border hover:bg-muted/50 transition-colors gap-2">
                        <MessageCircle className="h-4 w-4" />
                        SMS Customer
                      </button>
                      <button className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg border hover:bg-muted/50 transition-colors gap-2">
                        <Mail className="h-4 w-4" />
                        Email Invoice
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Order Items with Admin Controls */}
              <section className="bg-card border rounded-xl overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Order Items</h3>
                    <div className="flex items-center gap-2">
                      <button className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-lg border hover:bg-muted/50 transition-colors">
                        Add Item
                      </button>
                      <button className="inline-flex items-center justify-center p-1.5 rounded-lg hover:bg-muted/50 transition-colors">
                        <Filter className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow>
                          <TableHead className="font-semibold">Product Details</TableHead>
                          <TableHead className="text-center font-semibold">SKU</TableHead>
                          <TableHead className="text-center font-semibold">Qty</TableHead>
                          <TableHead className="text-right font-semibold">Unit Price</TableHead>
                          <TableHead className="text-right font-semibold">Total</TableHead>
                          <TableHead className="text-right font-semibold">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">Wireless Headset</span>
                              <span className="text-sm text-muted-foreground">HS-WL-2025 • Premium Audio</span>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">In Stock</Badge>
                                <span className="text-xs text-muted-foreground">Wholesale cost: GHC 150.00</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <code className="text-xs bg-muted px-2 py-1 rounded">SKU-78901</code>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="inline-flex items-center gap-2">
                              <button className="h-6 w-6 rounded border flex items-center justify-center">-</button>
                              <span className="font-medium min-w-[20px]">1</span>
                              <button className="h-6 w-6 rounded border flex items-center justify-center">+</button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">GHC 200.00</TableCell>
                          <TableCell className="text-right font-bold">GHC 200.00</TableCell>
                          <TableCell className="text-right">
                            <button className="p-1 hover:bg-muted rounded">
                              <Edit className="h-4 w-4" />
                            </button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">USB-C Charger</span>
                              <span className="text-sm text-muted-foreground">CH-UC-65W • Fast Charging</span>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">Low Stock</Badge>
                                <span className="text-xs text-muted-foreground">Wholesale cost: GHC 95.00</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <code className="text-xs bg-muted px-2 py-1 rounded">SKU-78902</code>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="inline-flex items-center gap-2">
                              <button className="h-6 w-6 rounded border flex items-center justify-center">-</button>
                              <span className="font-medium min-w-[20px]">2</span>
                              <button className="h-6 w-6 rounded border flex items-center justify-center">+</button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">GHC 125.00</TableCell>
                          <TableCell className="text-right font-bold">GHC 250.00</TableCell>
                          <TableCell className="text-right">
                            <button className="p-1 hover:bg-muted rounded">
                              <Edit className="h-4 w-4" />
                            </button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* Admin Financial Summary */}
                  <div className="border-t p-6">
                    <div className="max-w-md ml-auto space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>GHC 450.00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping Cost</span>
                        <span className="text-green-600">Free (GHC 25.00 waived)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">VAT (12.5%)</span>
                        <span>GHC 56.25</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Discount</span>
                        <span className="text-red-600">- GHC 0.00</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Revenue</span>
                        <span>GHC 450.00</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Profit Margin</span>
                        <span className="text-green-600">~42% (GHC 190.00)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar - Admin Controls */}
            <div className="space-y-8">
              {/* Status Update Card */}
              <section className="bg-card border rounded-xl p-6 sticky top-40">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Order Management</h3>
                  <button className="text-sm text-muted-foreground hover:text-foreground">
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                
                <CommonForm
                  formControls={[
                    {
                      label: "Update Order Status",
                      name: "status",
                      componentType: "select",
                      options: [
                        { id: "pending", label: "⏳ Pending" },
                        { id: "processing", label: "📦 Processing" },
                        { id: "shipping", label: "🚚 Shipping" },
                        { id: "delivered", label: "✅ Delivered" },
                        { id: "rejected", label: "❌ Rejected" },
                      ],
                    },
                  ]}
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleSubmit}
                  buttonText={isSubmitting ? "Updating..." : "Update Status"}
                  buttonProps={{ 
                    disabled: isSubmitting, 
                    size: "lg", 
                    className: "w-full mt-4",
                    variant: "default"
                  }}
                />
                
                {/* Quick Admin Actions */}
                <div className="mt-8 pt-6 border-t">
                  <h4 className="font-medium mb-3 text-sm text-muted-foreground">Admin Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="text-left px-3 py-2 text-sm rounded-lg hover:bg-muted/50 transition-colors border">
                      Send Tracking
                    </button>
                    <button className="text-left px-3 py-2 text-sm rounded-lg hover:bg-muted/50 transition-colors border">
                      Print Invoice
                    </button>
                    <button className="text-left px-3 py-2 text-sm rounded-lg hover:bg-muted/50 transition-colors border">
                      Apply Discount
                    </button>
                    <button className="text-left px-3 py-2 text-sm rounded-lg hover:bg-muted/50 transition-colors border text-red-600">
                      Flag Issue
                    </button>
                  </div>
                </div>
              </section>

              {/* Ghana Logistics Timeline */}
              <section className="bg-card border rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Ghana Logistics</h3>
                  <Badge variant="outline" className="text-xs">
                    {regionInfo.warehouse}
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium">Payment Received</p>
                      <p className="text-xs text-muted-foreground">12 Dec 2025 • 14:30 GMT</p>
                      <p className="text-xs text-muted-foreground mt-1">MTN MoMo • Ref: MOMO-789012</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <PackageOpen className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Processing Started</p>
                      <p className="text-xs text-muted-foreground">12 Dec 2025 • 15:15 GMT</p>
                      <p className="text-xs text-muted-foreground mt-1">Assigned to: {regionInfo.warehouse}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 opacity-60">
                    <div className="h-8 w-8 rounded-full border-2 border-dashed border-muted flex items-center justify-center flex-shrink-0">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-muted-foreground">Out for Delivery</p>
                      <p className="text-xs text-muted-foreground">Estimated: 15 Dec 2025</p>
                      <p className="text-xs text-muted-foreground mt-1">Northern Region Route</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Assigned Driver</p>
                    <p className="text-sm font-medium">Not assigned</p>
                  </div>
                  <button className="w-full mt-3 text-sm font-medium text-primary hover:underline">
                    Assign Logistics Partner
                  </button>
                </div>
              </section>

              {/* Internal Notes Section */}
              <section className="bg-card border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-6">Internal Notes</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-medium mb-1">Customer requested evening delivery</p>
                    <p className="text-xs text-muted-foreground">Added by: Admin • 12 Dec 2025</p>
                  </div>
                  <textarea 
                    className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Add internal note about this order..."
                    rows="3"
                  />
                  <button className="w-full text-sm font-medium py-2 border rounded-lg hover:bg-muted/50 transition-colors">
                    Add Note
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Action Bar */}
      <div className="lg:hidden sticky bottom-0 bg-background/95 backdrop-blur-sm border-t supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Order Value</p>
            <p className="text-xl font-bold">GHC 450.00</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-3 border font-medium rounded-lg hover:bg-muted transition-colors text-sm">
              Edit
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm"
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;