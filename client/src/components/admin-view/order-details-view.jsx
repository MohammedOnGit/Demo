
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
import { Button } from "../ui/button";
import {
  X,
  Package,
  User,
  Users,
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
  Building2,
  MessageCircle,
  Mail,
  Bell,
  Shield,
  Edit,
  Tag,
  Copy,
  Filter,
  MoreVertical,
  ChevronDown,
  Plus,
  Minus,
  ArrowLeft,
  ChevronRight,
  Clock,
  Home,
  CreditCard as CardIcon,
  FileText,
  ShoppingBag,
} from "lucide-react";

// Ghana regions with admin-specific data
const ghanaRegions = {
  Northern: {
    color: "text-orange-600",
    bg: "bg-orange-50",
    deliveryDays: "3-5",
    warehouse: "Tamale Hub",
    manager: "Kwame Mensah",
  },
  "Greater Accra": {
    color: "text-blue-600",
    bg: "bg-blue-50",
    deliveryDays: "1-2",
    warehouse: "Accra Central",
    manager: "Ama Serwaa",
  },
  Ashanti: {
    color: "text-amber-600",
    bg: "bg-amber-50",
    deliveryDays: "2-3",
    warehouse: "Kumasi Depot",
    manager: "Kofi Asante",
  },
  Eastern: {
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    deliveryDays: "2-4",
    warehouse: "Koforidua Center",
    manager: "Esi Boateng",
  },
  Western: {
    color: "text-red-600",
    bg: "bg-red-50",
    deliveryDays: "3-5",
    warehouse: "Takoradi Base",
    manager: "Yaw Sarpong",
  },
};

const statusVariants = {
  pending: { variant: "default", icon: AlertCircle, color: "bg-yellow-100 text-yellow-800" },
  processing: { variant: "secondary", icon: PackageOpen, color: "bg-blue-100 text-blue-800" },
  shipping: { variant: "outline", icon: Truck, color: "bg-purple-100 text-purple-800" },
  delivered: { variant: "success", icon: CheckCircle, color: "bg-green-100 text-green-800" },
  rejected: { variant: "destructive", icon: X, color: "bg-red-100 text-red-800" },
};

// Mobile-optimized tab component
const MobileTabButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex flex-col items-center justify-center py-2.5 px-1 rounded-lg transition-all ${
      active
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:text-foreground"
    }`}
  >
    <Icon className="h-4 w-4 mb-1" />
    <span className="text-xs font-medium">{label}</span>
  </button>
);

function AdminOrderDetailsView() {
  const [formData, setFormData] = useState({ status: "processing" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    manager: "Regional Manager",
  };

  return (
    <DialogContent
      className="
        w-full max-w-full h-[100dvh] 
        sm:max-h-[95vh] sm:max-w-7xl 
        flex flex-col overflow-hidden p-0 
        sm:rounded-2xl shadow-2xl bg-background
      "
    >
      {/* Enhanced Mobile Header */}
      <DialogHeader className="sticky top-0 z-50 bg-background border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Back button for mobile */}
            {isMobile ? (
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 -ml-2"
                  onClick={() => setActiveTab("details")}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-base font-semibold truncate">
                    #ORD-122355
                  </DialogTitle>
                  <div className="flex items-center gap-1.5">
                    <Badge
                      className={`${
                        statusVariants[currentStatus]?.color
                      } border-0 text-xs font-medium px-2 py-0.5 flex items-center gap-1`}
                    >
                      <StatusIcon className="h-2.5 w-2.5" />
                      <span className="capitalize">{currentStatus}</span>
                    </Badge>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">GHC 450.00</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <DialogTitle className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
                  Order #ORD-122355
                </DialogTitle>
                <Badge
                  variant={statusVariants[currentStatus]?.variant || "secondary"}
                  className="shrink-0 text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 font-medium flex items-center gap-1.5"
                >
                  <StatusIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span className="capitalize">{currentStatus}</span>
                </Badge>
              </div>
            )}

            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center gap-1.5 lg:gap-2">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs lg:text-sm">
                <Download className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                <span className="hidden lg:inline">Export</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs lg:text-sm">
                <Printer className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                <span className="hidden lg:inline">Print</span>
              </Button>
              <Button size="sm" className="gap-1.5 text-xs lg:text-sm">
                <Edit className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                <span className="hidden lg:inline">Edit</span>
              </Button>
              <DialogClose className="h-9 w-9 rounded-full hover:bg-muted flex items-center justify-center">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </div>

            {/* Mobile Actions */}
            {isMobile && (
              <div className="flex items-center gap-1">
                <DialogClose className="h-9 w-9 rounded-full hover:bg-muted flex items-center justify-center">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </DialogClose>
              </div>
            )}
          </div>

          {/* Mobile Tabs as Bottom Navigation */}
          {isMobile && (
            <div className="mt-3 pb-1">
              <div className="flex items-center justify-between gap-1 bg-muted/30 rounded-lg p-1">
                {[
                  { id: "details", icon: FileText, label: "Details" },
                  { id: "logistics", icon: Truck, label: "Track" },
                  { id: "customer", icon: User, label: "Customer" },
                  { id: "financial", icon: CardIcon, label: "Payment" },
                ].map((tab) => (
                  <MobileTabButton
                    key={tab.id}
                    active={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    icon={tab.icon}
                    label={tab.label}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogHeader>

      {/* Desktop Tabs */}
      {!isMobile && (
        <div className="sticky top-[57px] sm:top-[65px] z-40 bg-background/95 backdrop-blur-sm border-b supports-[backdrop-filter]:bg-background/60">
          <div className="px-6 lg:px-8 overflow-x-auto scrollbar-hide">
            <div className="flex space-x-1 min-w-max py-1">
              {["details", "logistics", "financial", "customer", "notes"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
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
                  {tab === "notes" && "Notes"}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content - Mobile Optimized */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 lg:space-y-8">
          
          {/* Mobile: Key Metrics */}
          {isMobile && (
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-card border rounded-xl p-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Value</p>
                <p className="font-bold text-base">GHC 450</p>
              </div>
              <div className="bg-card border rounded-xl p-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Date</p>
                <p className="font-medium text-sm">12 Dec</p>
                <p className="text-[10px] text-muted-foreground">14:30</p>
              </div>
              <div className="bg-card border rounded-xl p-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Region</p>
                <Badge className={`${regionInfo.bg} ${regionInfo.color} border-0 text-xs font-medium px-2`}>
                  {customerRegion}
                </Badge>
              </div>
            </div>
          )}

          {/* Desktop: Overview Cards */}
          {!isMobile && (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              <div className="bg-card border rounded-lg p-4 hover:border-primary/50 transition-colors">
                <p className="text-xs text-muted-foreground mb-1">Value</p>
                <p className="font-bold text-lg sm:text-xl lg:text-2xl">GHC 450.00</p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  Avg: GHC 380
                </p>
              </div>
              <div className="bg-card border rounded-lg p-4 hover:border-primary/50 transition-colors">
                <p className="text-xs text-muted-foreground mb-1">Payment</p>
                <p className="font-medium text-sm sm:text-base">Mobile Money</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <CheckCircle className="h-3 w-3" />
                  MTN • Verified
                </p>
              </div>
              <div className="bg-card border rounded-lg p-4 hover:border-primary/50 transition-colors">
                <p className="text-xs text-muted-foreground mb-1">Region</p>
                <Badge className={`${regionInfo.bg} ${regionInfo.color} border-0 text-xs font-medium`}>
                  {customerRegion}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">{regionInfo.deliveryDays} days</p>
              </div>
              <div className="bg-card border rounded-lg p-4 hover:border-primary/50 transition-colors">
                <p className="text-xs text-muted-foreground mb-1">Date</p>
                <p className="font-medium text-sm sm:text-base">12 Dec 2025</p>
                <p className="text-xs text-muted-foreground">14:30 GMT</p>
              </div>
            </div>
          )}

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Card - Mobile Optimized */}
              <section className="bg-card border rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold">Mohammed Ibrahim</h3>
                      <p className="text-xs text-muted-foreground">CUST-78901</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs gap-1">
                    <Shield className="h-3 w-3" />
                    Verified
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-medium text-sm truncate">+233 24 000 0000</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-full ${regionInfo.bg} flex items-center justify-center flex-shrink-0`}>
                      <MapPin className={`h-4 w-4 ${regionInfo.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">Delivery Address</p>
                      <p className="font-medium text-sm">Tamale, Northern Region</p>
                      <p className="text-xs text-muted-foreground">TL-1234 • {regionInfo.deliveryDays} days</p>
                    </div>
                  </div>

                  {isMobile && (
                    <div className="p-2.5 bg-blue-50 rounded-lg">
                      <p className="text-xs font-medium text-blue-700 mb-1 flex items-center gap-1.5">
                        <Bell className="h-3.5 w-3.5" />
                        Delivery Preference
                      </p>
                      <p className="text-xs text-blue-600">"After 5 PM. Call on arrival."</p>
                    </div>
                  )}
                </div>
                
                {!isMobile && (
                  <>
                    <div className="p-2.5 bg-blue-50 rounded-lg mt-3">
                      <p className="text-xs font-medium text-blue-700 mb-1 flex items-center gap-1.5">
                        <Bell className="h-3.5 w-3.5" />
                        Delivery Preference
                      </p>
                      <p className="text-sm text-blue-600">"After 5 PM. Call on arrival."</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1 text-xs gap-1.5">
                        <MessageCircle className="h-3.5 w-3.5" />
                        SMS
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs gap-1.5">
                        <Mail className="h-3.5 w-3.5" />
                        Email
                      </Button>
                    </div>
                  </>
                )}
              </section>

              {/* Order Items - Mobile Optimized */}
              <section className="bg-card border rounded-xl overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      Order Items
                    </h3>
                    {!isMobile && (
                      <div className="flex gap-1.5">
                        <Button size="sm" variant="outline" className="text-xs gap-1">
                          <Plus className="h-3.5 w-3.5" />
                          Add Item
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Filter className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Mobile Items List */}
                  {isMobile ? (
                    <div className="space-y-3">
                      {[
                        {
                          name: "Wireless Headset",
                          desc: "HS-WL-2025 • Premium",
                          sku: "SKU-78901",
                          qty: 1,
                          price: 200,
                          total: 200,
                          stock: "In Stock",
                        },
                        {
                          name: "USB-C Charger",
                          desc: "CH-UC-65W • Fast",
                          sku: "SKU-78902",
                          qty: 2,
                          price: 125,
                          total: 250,
                          stock: "Low Stock",
                        },
                      ].map((item) => (
                        <div key={item.sku} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium text-sm">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{item.desc}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {item.stock}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-3">
                              <span className="text-muted-foreground">Qty: {item.qty}</span>
                              <span className="text-muted-foreground">•</span>
                              <span>GHC {item.price}</span>
                            </div>
                            <span className="font-semibold">GHC {item.total}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Desktop Table
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead className="text-center">SKU</TableHead>
                            <TableHead className="text-center">Qty</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[
                            {
                              name: "Wireless Headset",
                              desc: "HS-WL-2025 • Premium",
                              sku: "SKU-78901",
                              qty: 1,
                              price: 200,
                              total: 200,
                              stock: "In Stock",
                            },
                            {
                              name: "USB-C Charger",
                              desc: "CH-UC-65W • Fast",
                              sku: "SKU-78902",
                              qty: 2,
                              price: 125,
                              total: 250,
                              stock: "Low Stock",
                            },
                          ].map((item) => (
                            <TableRow key={item.sku}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                                  <Badge variant="outline" className="text-xs mt-1">
                                    {item.stock}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <code className="text-xs bg-muted px-2 py-1 rounded">{item.sku}</code>
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="inline-flex items-center gap-2">
                                  <Button size="icon" variant="outline" className="h-6 w-6">
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-8 text-center">{item.qty}</span>
                                  <Button size="icon" variant="outline" className="h-6 w-6">
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">GHC {item.price.toFixed(2)}</TableCell>
                              <TableCell className="text-right font-semibold">
                                GHC {item.total.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {/* Order Summary */}
                  <div className="border-t mt-4 pt-4">
                    <div className={`${isMobile ? 'space-y-2' : 'max-w-xs ml-auto space-y-2'} text-sm`}>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>GHC 450.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="text-green-600">Free</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">VAT</span>
                        <span>GHC 56.25</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between text-base font-bold">
                        <span>Total</span>
                        <span>GHC 450.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar - Mobile Bottom Sheet */}
            {!isMobile ? (
              <div className="space-y-6">
                {/* Status Update */}
                <section className="bg-card border rounded-lg p-4 sticky top-24">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold">Management</h3>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <CommonForm
                    formControls={[
                      {
                        label: "Status",
                        name: "status",
                        componentType: "select",
                        options: [
                          { id: "pending", label: "Pending" },
                          { id: "processing", label: "Processing" },
                          { id: "shipping", label: "Shipping" },
                          { id: "delivered", label: "Delivered" },
                          { id: "rejected", label: "Rejected" },
                        ],
                      },
                    ]}
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleSubmit}
                    buttonText={isSubmitting ? "Updating..." : "Update Status"}
                    buttonProps={{
                      disabled: isSubmitting,
                      size: "sm",
                      className: "w-full",
                    }}
                  />
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button variant="outline" size="sm" className="text-xs gap-1">
                      <Truck className="h-3.5 w-3.5" />
                      Tracking
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs gap-1">
                      <FileText className="h-3.5 w-3.5" />
                      Invoice
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs gap-1">
                      <Tag className="h-3.5 w-3.5" />
                      Discount
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs text-red-600 gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Flag
                    </Button>
                  </div>
                </section>

                {/* Logistics Timeline */}
                <section className="bg-card border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold">Delivery Timeline</h3>
                    <Badge variant="outline" className="text-xs">
                      {regionInfo.warehouse}
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                        </div>
                        <div className="flex-1 h-8 w-0.5 bg-emerald-200 mt-1"></div>
                      </div>
                      <div className="pb-4">
                        <p className="font-medium text-sm">Payment Received</p>
                        <p className="text-xs text-muted-foreground">12 Dec • 14:30</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                          <PackageOpen className="h-3.5 w-3.5 text-blue-600" />
                        </div>
                        <div className="flex-1 h-8 w-0.5 bg-blue-200 mt-1"></div>
                      </div>
                      <div className="pb-4">
                        <p className="font-medium text-sm">Processing</p>
                        <p className="text-xs text-muted-foreground">{regionInfo.warehouse}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-6 w-6 rounded-full border-2 border-dashed border-muted flex items-center justify-center">
                          <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Out for Delivery</p>
                        <p className="text-xs text-muted-foreground">Est. 15 Dec</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Notes */}
                <section className="bg-card border rounded-lg p-4">
                  <h3 className="text-base font-semibold mb-3">Notes</h3>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-medium mb-1">Evening delivery requested</p>
                    <p className="text-xs text-muted-foreground">Admin • 12 Dec</p>
                  </div>
                  <textarea
                    className="w-full p-3 border rounded-lg text-sm mt-3 resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Add note..."
                    rows="3"
                  />
                  <Button size="sm" className="w-full mt-3">
                    Add Note
                  </Button>
                </section>
              </div>
            ) : (
              // Mobile Quick Actions
              <div className="pb-20">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <Button variant="outline" size="sm" className="text-xs gap-1.5 py-2">
                    <Truck className="h-3.5 w-3.5" />
                    Track
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs gap-1.5 py-2">
                    <FileText className="h-3.5 w-3.5" />
                    Invoice
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs gap-1.5 py-2">
                    <MessageCircle className="h-3.5 w-3.5" />
                    SMS
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs gap-1.5 py-2">
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </Button>
                </div>
                
                <div className="bg-card border rounded-xl p-4">
                  <h3 className="text-sm font-semibold mb-3">Update Status</h3>
                  <CommonForm
                    formControls={[
                      {
                        label: "",
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
                    buttonText={isSubmitting ? "Updating..." : "Update"}
                    buttonProps={{
                      disabled: isSubmitting,
                      size: "sm",
                      className: "w-full mt-3",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Action Bar */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t supports-[backdrop-filter]:bg-background/60 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg font-bold">GHC 450.00</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="gap-1.5">
                <Edit className="h-3.5 w-3.5" />
                Edit
              </Button>
              <Button size="sm" className="gap-1.5">
                <CheckCircle className="h-3.5 w-3.5" />
                Update
              </Button>
            </div>
          </div>
        </div>
      )}
    </DialogContent>
  );
}

export default AdminOrderDetailsView;