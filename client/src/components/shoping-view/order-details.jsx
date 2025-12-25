// import React from "react";
// import {
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogClose,
// } from "../ui/dialog";
// import { Badge } from "../ui/badge";
// import { Separator } from "../ui/separator";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../ui/table";
// import {
//   Package,
//   Truck,
//   CheckCircle2,
//   X,
//   MapPin,
//   Phone,
//   User,
//   Calendar,
//   CreditCard,
//   ShieldCheck,
//   Clock,
//   FileText,
//   Download,
//   Printer,
//   MessageSquare,
//   HelpCircle,
//   ChevronRight
// } from "lucide-react";

// const statusConfig = {
//   pending: { 
//     variant: "default", 
//     label: "Pending", 
//     icon: Clock,
//     color: "text-amber-500",
//     bgColor: "bg-amber-50"
//   },
//   processing: { 
//     variant: "secondary", 
//     label: "Processing", 
//     icon: Package,
//     color: "text-blue-500",
//     bgColor: "bg-blue-50"
//   },
//   shipping: { 
//     variant: "outline", 
//     label: "In Transit", 
//     icon: Truck,
//     color: "text-purple-500",
//     bgColor: "bg-purple-50"
//   },
//   delivered: { 
//     variant: "success", 
//     label: "Delivered", 
//     icon: CheckCircle2,
//     color: "text-emerald-500",
//     bgColor: "bg-emerald-50"
//   },
//   rejected: { 
//     variant: "destructive", 
//     label: "Cancelled", 
//     icon: X,
//     color: "text-red-500",
//     bgColor: "bg-red-50"
//   },
// };

// function ShoppingOrderDetailsView() {
//   const currentStatus = "processing";
//   const status = statusConfig[currentStatus];
//   const StatusIcon = status.icon;

//   return (
//     <DialogContent className="w-full max-w-full h-[100dvh] sm:h-auto sm:max-h-[95vh] sm:max-w-5xl flex flex-col overflow-hidden p-0 sm:rounded-2xl shadow-2xl bg-background">
//       {/* Sticky Header with Backdrop Blur */}
//       <DialogHeader className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b supports-[backdrop-filter]:bg-background/60">
//         <div className="flex items-center justify-between px-4 sm:px-8 py-4">
//           <div className="flex items-center gap-3 min-w-0">
//             <div className="min-w-0">
//               <DialogTitle className="text-xl sm:text-2xl font-bold truncate">
//                 Order #122355
//               </DialogTitle>
//               <div className="flex items-center gap-2 mt-1">
//                 <p className="text-sm text-muted-foreground flex items-center gap-1">
//                   <Calendar className="h-3 w-3" />
//                   Placed on 12 Dec 2025
//                 </p>
//                 <span className="text-muted-foreground">•</span>
//                 <Badge
//                   variant={status.variant}
//                   className="shrink-0 text-xs sm:text-sm px-3 py-1 font-medium flex items-center gap-1.5"
//                 >
//                   <StatusIcon className={`h-3 w-3 ${status.color}`} />
//                   {status.label}
//                 </Badge>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             {/* Desktop Action Buttons */}
//             <div className="hidden sm:flex items-center gap-2">
//               <button className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted/50 transition-colors gap-2">
//                 <FileText className="h-4 w-4" />
//                 Invoice
//               </button>
//               <button className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted/50 transition-colors gap-2">
//                 <MessageSquare className="h-4 w-4" />
//                 Support
//               </button>
//             </div>
            
//             <DialogClose className="p-2 rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors">
//               <X className="h-5 w-5" />
//               <span className="sr-only">Close</span>
//             </DialogClose>
//           </div>
//         </div>
//       </DialogHeader>

//       {/* Scrollable Content */}
//       <div className="flex-1 overflow-y-auto">
//         <div className="px-4 sm:px-8 py-6 space-y-8">
//           {/* Order Status Progress */}
//           <div className="bg-card border rounded-xl p-6">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-lg font-semibold">Order Status</h3>
//               <button className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
//                 Track Order
//                 <ChevronRight className="h-4 w-4" />
//               </button>
//             </div>
            
//             <div className="relative">
//               {/* Progress Line */}
//               <div className="absolute top-5 left-0 right-0 h-1 bg-muted -translate-y-1/2">
//                 <div 
//                   className="h-full bg-primary transition-all duration-500"
//                   style={{ width: currentStatus === 'processing' ? '50%' : 
//                            currentStatus === 'shipping' ? '75%' : 
//                            currentStatus === 'delivered' ? '100%' : '25%' }}
//                 />
//               </div>
              
//               <div className="flex justify-between relative z-10">
//                 {['pending', 'processing', 'shipping', 'delivered'].map((step, index) => {
//                   const stepConfig = statusConfig[step];
//                   const StepIcon = stepConfig.icon;
//                   const isActive = step === currentStatus;
//                   const isCompleted = ['processing', 'shipping', 'delivered'].indexOf(step) <= 
//                                      ['processing', 'shipping', 'delivered'].indexOf(currentStatus);
                  
//                   return (
//                     <div key={step} className="flex flex-col items-center text-center" style={{ width: '25%' }}>
//                       <div className={`
//                         h-10 w-10 rounded-full flex items-center justify-center mb-2
//                         ${isCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
//                         ${isActive ? 'ring-2 ring-primary ring-offset-2' : ''}
//                       `}>
//                         <StepIcon className="h-5 w-5" />
//                       </div>
//                       <span className={`text-xs font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
//                         {stepConfig.label}
//                       </span>
//                       <span className="text-xs text-muted-foreground mt-1">
//                         {step === 'processing' && 'Processing'}
//                         {step === 'shipping' && 'On the way'}
//                         {step === 'delivered' && 'Delivered'}
//                       </span>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>

//           {/* Two Column Layout */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Main Content */}
//             <div className="lg:col-span-2 space-y-8">
//               {/* Order Summary Cards */}
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <div className="bg-card border rounded-xl p-5">
//                   <div className="flex items-start justify-between mb-3">
//                     <div>
//                       <p className="text-sm text-muted-foreground mb-2">Payment Method</p>
//                       <p className="font-semibold">Mobile Money</p>
//                       <div className="flex items-center gap-1 mt-2">
//                         <ShieldCheck className="h-3 w-3 text-green-500" />
//                         <span className="text-xs text-muted-foreground">Secure payment</span>
//                       </div>
//                     </div>
//                     <CreditCard className="h-5 w-5 text-muted-foreground" />
//                   </div>
//                 </div>
                
//                 <div className="bg-card border rounded-xl p-5">
//                   <div className="flex items-start justify-between mb-3">
//                     <div>
//                       <p className="text-sm text-muted-foreground mb-2">Payment Status</p>
//                       <p className="font-semibold text-green-600">Paid</p>
//                       <p className="text-xs text-muted-foreground mt-2">GHC 450.00</p>
//                     </div>
//                     <CheckCircle2 className="h-5 w-5 text-green-500" />
//                   </div>
//                 </div>
                
//                 <div className="bg-card border rounded-xl p-5">
//                   <div className="flex items-start justify-between mb-3">
//                     <div>
//                       <p className="text-sm text-muted-foreground mb-2">Delivery Estimate</p>
//                       <p className="font-semibold">18–22 Dec 2025</p>
//                       <p className="text-xs text-muted-foreground mt-2">Standard Shipping</p>
//                     </div>
//                     <Truck className="h-5 w-5 text-muted-foreground" />
//                   </div>
//                 </div>
//               </div>

//               {/* Delivery Address */}
//               <section className="bg-card border rounded-xl p-6">
//                 <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
//                   <MapPin className="h-5 w-5" />
//                   Delivery Address
//                 </h3>
                
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                   <div>
//                     <div className="flex items-start gap-3 mb-4">
//                       <div className={`h-10 w-10 rounded-full ${status.bgColor} flex items-center justify-center flex-shrink-0`}>
//                         <User className={`h-5 w-5 ${status.color}`} />
//                       </div>
//                       <div>
//                         <p className="font-medium">Mohammed Ibrahim</p>
//                         <p className="text-sm text-muted-foreground mt-1">Customer</p>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-start gap-3">
//                       <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
//                         <Phone className="h-5 w-5 text-muted-foreground" />
//                       </div>
//                       <div>
//                         <p className="font-medium">+233 24 000 0000</p>
//                         <p className="text-sm text-muted-foreground mt-1">Primary contact</p>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="space-y-4">
//                     <div className="p-4 bg-muted/30 rounded-lg">
//                       <p className="font-medium mb-2">Shipping Address</p>
//                       <p className="text-muted-foreground">Tamale, Northern Region</p>
//                       <p className="text-xs text-muted-foreground mt-2">Residential address • Standard delivery</p>
//                     </div>
                    
//                     <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
//                       <p className="text-sm font-medium text-blue-700 mb-1">Delivery Instructions</p>
//                       <p className="text-sm text-blue-600">"Please deliver after 5 PM"</p>
//                     </div>
//                   </div>
//                 </div>
//               </section>

//               {/* Ordered Items */}
//               <section className="bg-card border rounded-xl overflow-hidden">
//                 <div className="p-6">
//                   <h3 className="text-lg font-semibold mb-6">Items in Your Order</h3>
                  
//                   <div className="space-y-4">
//                     {[
//                       { 
//                         name: "Wireless Headset", 
//                         desc: "Premium Audio • Noise Cancelling • Black",
//                         quantity: 1, 
//                         price: 200.00,
//                         image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100"
//                       },
//                       { 
//                         name: "USB-C Charger", 
//                         desc: "Fast Charging • 65W • GaN Technology",
//                         quantity: 2, 
//                         price: 125.00,
//                         image: "https://images.unsplash.com/photo-1594736797933-d0c6e2d8e5a5?w-100"
//                       }
//                     ].map((item, index) => (
//                       <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/30 transition-colors">
//                         <div className="h-20 w-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
//                           <Package className="h-10 w-10 text-muted-foreground" />
//                         </div>
                        
//                         <div className="flex-1 min-w-0">
//                           <div className="flex justify-between items-start">
//                             <div>
//                               <h4 className="font-medium">{item.name}</h4>
//                               <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
//                             </div>
//                             <span className="font-bold text-lg">GHC {(item.price * item.quantity).toFixed(2)}</span>
//                           </div>
                          
//                           <div className="flex justify-between items-center mt-4">
//                             <div className="flex items-center gap-4">
//                               <div className="flex items-center gap-2">
//                                 <span className="text-sm text-muted-foreground">Quantity:</span>
//                                 <span className="font-medium">{item.quantity}</span>
//                               </div>
//                               <div className="flex items-center gap-2">
//                                 <span className="text-sm text-muted-foreground">Unit Price:</span>
//                                 <span className="font-medium">GHC {item.price.toFixed(2)}</span>
//                               </div>
//                             </div>
                            
//                             <button className="text-sm font-medium text-primary hover:underline">
//                               View Product
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </section>
//             </div>

//             {/* Sidebar - Order Summary & Actions */}
//             <div className="space-y-8">
//               {/* Order Summary Card */}
//               <div className="bg-card border rounded-xl p-6 sticky top-24">
//                 <h3 className="text-lg font-semibold mb-6">Order Summary</h3>
                
//                 <div className="space-y-3">
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Subtotal (2 items)</span>
//                     <span>GHC 450.00</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Shipping</span>
//                     <span className="text-green-600">Free</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Tax</span>
//                     <span>GHC 0.00</span>
//                   </div>
//                   <Separator className="my-4" />
//                   <div className="flex justify-between text-lg font-bold">
//                     <span>Total</span>
//                     <span>GHC 450.00</span>
//                   </div>
                  
//                   <div className="pt-4 border-t">
//                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                       <ShieldCheck className="h-4 w-4" />
//                       <span>Your payment is secure and encrypted</span>
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Action Buttons */}
//                 <div className="space-y-3 mt-8">
//                   <button className="w-full bg-primary text-primary-foreground font-medium py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
//                     <Truck className="h-4 w-4" />
//                     Track Order
//                   </button>
//                   <button className="w-full border font-medium py-3 rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-2">
//                     <FileText className="h-4 w-4" />
//                     Download Invoice
//                   </button>
//                 </div>
//               </div>

//               {/* Customer Support */}
//               <div className="bg-card border rounded-xl p-6">
//                 <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
//                   <HelpCircle className="h-5 w-5" />
//                   Need Help?
//                 </h3>
                
//                 <div className="space-y-4">
//                   <button className="w-full text-left p-4 rounded-lg hover:bg-muted/50 transition-colors border">
//                     <div className="flex items-center gap-3">
//                       <MessageSquare className="h-5 w-5 text-muted-foreground" />
//                       <div>
//                         <p className="font-medium">Contact Support</p>
//                         <p className="text-sm text-muted-foreground mt-1">Get help with your order</p>
//                       </div>
//                     </div>
//                   </button>
                  
//                   <button className="w-full text-left p-4 rounded-lg hover:bg-muted/50 transition-colors border">
//                     <div className="flex items-center gap-3">
//                       <FileText className="h-5 w-5 text-muted-foreground" />
//                       <div>
//                         <p className="font-medium">Return Policy</p>
//                         <p className="text-sm text-muted-foreground mt-1">30-day return window</p>
//                       </div>
//                     </div>
//                   </button>
                  
//                   <button className="w-full text-left p-4 rounded-lg hover:bg-muted/50 transition-colors border">
//                     <div className="flex items-center gap-3">
//                       <ShieldCheck className="h-5 w-5 text-muted-foreground" />
//                       <div>
//                         <p className="font-medium">Warranty Info</p>
//                         <p className="text-sm text-muted-foreground mt-1">1-year manufacturer warranty</p>
//                       </div>
//                     </div>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Bottom Action Bar */}
//       <div className="lg:hidden sticky bottom-0 bg-background/95 backdrop-blur-sm border-t supports-[backdrop-filter]:bg-background/60 p-4">
//         <div className="flex items-center justify-between gap-4">
//           <div>
//             <p className="text-sm text-muted-foreground">Total Amount</p>
//             <p className="text-xl font-bold">GHC 450.00</p>
//           </div>
//           <div className="flex items-center gap-2">
//             <button className="px-4 py-3 border font-medium rounded-lg hover:bg-muted transition-colors text-sm">
//               Support
//             </button>
//             <button className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors text-sm">
//               Track Order
//             </button>
//           </div>
//         </div>
//       </div>
//     </DialogContent>
//   );
// }

// export default ShoppingOrderDetailsView;

import React from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Package,
  Truck,
  CheckCircle2,
  X,
  MapPin,
  Phone,
  User,
  Calendar,
  CreditCard,
  ShieldCheck,
  Clock,
  FileText,
  Download,
  MessageSquare,
  HelpCircle,
  ChevronRight,
  Home,
  City,
  Globe,
  Star
} from "lucide-react";

const statusConfig = {
  pending: { 
    variant: "default", 
    label: "Pending", 
    icon: Clock,
    color: "text-amber-500",
    bgColor: "bg-amber-50"
  },
  processing: { 
    variant: "secondary", 
    label: "Processing", 
    icon: Package,
    color: "text-blue-500",
    bgColor: "bg-blue-50"
  },
  shipping: { 
    variant: "outline", 
    label: "On the Way", 
    icon: Truck,
    color: "text-purple-500",
    bgColor: "bg-purple-50"
  },
  delivered: { 
    variant: "success", 
    label: "Delivered", 
    icon: CheckCircle2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50"
  },
  rejected: { 
    variant: "destructive", 
    label: "Cancelled", 
    icon: X,
    color: "text-red-500",
    bgColor: "bg-red-50"
  },
};

// Ghana regions for reference
const ghanaRegions = {
  "Greater Accra": { color: "text-blue-600", bg: "bg-blue-50" },
  "Ashanti": { color: "text-amber-600", bg: "bg-amber-50" },
  "Eastern": { color: "text-emerald-600", bg: "bg-emerald-50" },
  "Western": { color: "text-red-600", bg: "bg-red-50" },
  "Central": { color: "text-purple-600", bg: "bg-purple-50" },
  "Volta": { color: "text-green-600", bg: "bg-green-50" },
  "Northern": { color: "text-orange-600", bg: "bg-orange-50" },
  "Upper East": { color: "text-cyan-600", bg: "bg-cyan-50" },
  "Upper West": { color: "text-indigo-600", bg: "bg-indigo-50" },
  "Bono": { color: "text-pink-600", bg: "bg-pink-50" },
  "Ahafo": { color: "text-rose-600", bg: "bg-rose-50" },
  "Bono East": { color: "text-fuchsia-600", bg: "bg-fuchsia-50" },
  "Oti": { color: "text-teal-600", bg: "bg-teal-50" },
  "Savannah": { color: "text-lime-600", bg: "bg-lime-50" },
  "North East": { color: "text-violet-600", bg: "bg-violet-50" }
};

function ShoppingOrderDetailsView() {
  const currentStatus = "processing";
  const status = statusConfig[currentStatus];
  const StatusIcon = status.icon;
  const customerRegion = "Northern";
  const regionInfo = ghanaRegions[customerRegion] || { color: "text-gray-600", bg: "bg-gray-50" };

  return (
    <DialogContent className="w-full max-w-full h-[100dvh] sm:h-auto sm:max-h-[95vh] sm:max-w-5xl flex flex-col overflow-hidden p-0 sm:rounded-2xl shadow-2xl bg-background">
      {/* Sticky Header */}
      <DialogHeader className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-4 sm:px-8 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <DialogTitle className="text-xl sm:text-2xl font-bold truncate">
                Order #122355
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Placed on 12 Dec 2025
                </p>
                <span className="text-muted-foreground">•</span>
                <Badge
                  variant={status.variant}
                  className="shrink-0 text-xs sm:text-sm px-3 py-1 font-medium flex items-center gap-1.5"
                >
                  <StatusIcon className={`h-3 w-3 ${status.color}`} />
                  {status.label}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DialogClose className="p-2 rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>
        </div>
      </DialogHeader>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-8 py-6 space-y-8">
          {/* Order Progress with Ghana-specific timeline */}
          <div className="bg-card border rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Delivery Progress</h3>
              <Badge variant="outline" className="flex items-center gap-1.5">
                <Globe className="h-3 w-3" />
                Shipping within Ghana
              </Badge>
            </div>
            
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-1 bg-muted -translate-y-1/2">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: currentStatus === 'processing' ? '33%' : 
                           currentStatus === 'shipping' ? '66%' : 
                           currentStatus === 'delivered' ? '100%' : '0%' }}
                />
              </div>
              
              <div className="flex justify-between relative z-10">
                {[
                  { stage: 'processing', label: 'Processing', desc: 'Order confirmed', icon: Package },
                  { stage: 'shipping', label: 'On the Way', desc: 'Left our warehouse', icon: Truck },
                  { stage: 'delivered', label: 'Delivered', desc: 'Arrived safely', icon: CheckCircle2 }
                ].map((step, index) => {
                  const isActive = step.stage === currentStatus;
                  const isCompleted = ['processing', 'shipping', 'delivered'].indexOf(step.stage) <= 
                                     ['processing', 'shipping', 'delivered'].indexOf(currentStatus);
                  
                  return (
                    <div key={step.stage} className="flex flex-col items-center text-center" style={{ width: '33%' }}>
                      <div className={`
                        h-10 w-10 rounded-full flex items-center justify-center mb-2
                        ${isCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                        ${isActive ? 'ring-2 ring-primary ring-offset-2' : ''}
                      `}>
                        <step.icon className="h-5 w-5" />
                      </div>
                      <span className={`text-xs font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.label}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">
                        {step.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Delivery Estimate */}
            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Estimated Delivery</p>
                  <p className="font-semibold">18–22 Dec 2025</p>
                  <p className="text-xs text-muted-foreground mt-1">3-5 business days</p>
                </div>
                <Badge className={`${regionInfo.bg} ${regionInfo.color} border-0`}>
                  {customerRegion} Region
                </Badge>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Ghana Payment Methods */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-card border rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Payment Method</p>
                      <p className="font-semibold">Mobile Money</p>
                      <div className="flex items-center gap-1 mt-2">
                        <ShieldCheck className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-muted-foreground">MTN MoMo</span>
                      </div>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-card border rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Payment Status</p>
                      <p className="font-semibold text-green-600">Paid</p>
                      <p className="text-xs text-muted-foreground mt-2">GHC 450.00</p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                </div>
                
                <div className="bg-card border rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Delivery Type</p>
                      <p className="font-semibold">Standard Delivery</p>
                      <p className="text-xs text-muted-foreground mt-2">Within Ghana</p>
                    </div>
                    <Truck className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Ghana Delivery Address */}
              <section className="bg-card border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Address in Ghana
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`h-10 w-10 rounded-full ${regionInfo.bg} flex items-center justify-center flex-shrink-0`}>
                        <User className={`h-5 w-5 ${regionInfo.color}`} />
                      </div>
                      <div>
                        <p className="font-medium">Mohammed Ibrahim</p>
                        <p className="text-sm text-muted-foreground mt-1">Customer</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">+233 24 000 0000</p>
                        <p className="text-sm text-muted-foreground mt-1">MTN Ghana number</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className={`p-4 ${regionInfo.bg} rounded-lg border`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Home className={`h-4 w-4 ${regionInfo.color}`} />
                        <p className="font-medium">Shipping Address</p>
                      </div>
                      <p className="text-foreground">Tamale, Northern Region</p>
                      <p className="text-sm text-muted-foreground mt-2">Ghana Postal Code: TL-1234</p>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <p className="text-sm font-medium text-blue-700">Delivery Instructions</p>
                      </div>
                      <p className="text-sm text-blue-600">"Please deliver after 5 PM. Call upon arrival."</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Ordered Items */}
              <section className="bg-card border rounded-xl overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-6">Items in Your Order</h3>
                  
                  <div className="space-y-4">
                    {[
                      { 
                        name: "Wireless Headset", 
                        desc: "Premium Audio • Noise Cancelling • Black",
                        quantity: 1, 
                        price: 200.00,
                        warranty: "1-year warranty"
                      },
                      { 
                        name: "USB-C Charger", 
                        desc: "Fast Charging • 65W • GaN Technology",
                        quantity: 2, 
                        price: 125.00,
                        warranty: "6-month warranty"
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="h-20 w-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="h-10 w-10 text-muted-foreground" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                            </div>
                            <span className="font-bold text-lg">GHC {(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                          
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Qty:</span>
                                <span className="font-medium">{item.quantity}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Unit Price:</span>
                                <span className="font-medium">GHC {item.price.toFixed(2)}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {item.warranty}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar - Order Summary & Ghana Support */}
            <div className="space-y-8">
              {/* Order Summary Card */}
              <div className="bg-card border rounded-xl p-6 sticky top-24">
                <h3 className="text-lg font-semibold mb-6">Order Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal (2 items)</span>
                    <span>GHC 450.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">VAT (included)</span>
                    <span>GHC 68.18</span>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>GHC 450.00</span>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ShieldCheck className="h-4 w-4 text-green-500" />
                      <span>Secured by Ghana Payment Systems</span>
                    </div>
                  </div>
                </div>
                
                {/* Ghana-specific Action Buttons */}
                <div className="space-y-3 mt-8">
                  <button className="w-full bg-primary text-primary-foreground font-medium py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    <Truck className="h-4 w-4" />
                    Track Delivery in Ghana
                  </button>
                  <button className="w-full border font-medium py-3 rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-2">
                    <FileText className="h-4 w-4" />
                    Download VAT Invoice
                  </button>
                </div>
              </div>

              {/* Ghana Customer Support */}
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Ghana Customer Support
                </h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Call Us</p>
                        <p className="text-sm text-muted-foreground mt-1">0302 123 4567</p>
                        <p className="text-xs text-green-600 mt-2">Mon-Fri, 8AM-8PM</p>
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full text-left p-4 rounded-lg hover:bg-muted/50 transition-colors border">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">WhatsApp Support</p>
                        <p className="text-sm text-muted-foreground mt-1">+233 24 123 4567</p>
                      </div>
                    </div>
                  </button>
                  
                  <button className="w-full text-left p-4 rounded-lg hover:bg-muted/50 transition-colors border">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Return & Exchange</p>
                        <p className="text-sm text-muted-foreground mt-1">14-day return policy</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Ghana Delivery Information */}
              <div className="bg-card border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Ghana Delivery Info
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Free delivery across Ghana</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">3-7 business days delivery</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Cash on Delivery available</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Real-time SMS tracking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Action Bar - Ghana specific */}
      <div className="lg:hidden sticky bottom-0 bg-background/95 backdrop-blur-sm border-t supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-xl font-bold">GHC 450.00</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-3 border font-medium rounded-lg hover:bg-muted transition-colors text-sm flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Call
            </button>
            <button className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors text-sm">
              Track Order
            </button>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;