import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AppProvider, useApp } from "@/app/contexts/AppContext";
import { Toaster } from "@/app/components/ui/sonner";

import AuthModal from "@/app/components/modal/AuthModal";
import { ProtectedRoute } from "@/app/components/ProtectedRoute";

// Customer Components
import { Home } from "@/app/components/customer/Home";
import { ProductDetails } from "@/app/components/customer/ProductDetails";
import { Cart } from "@/app/components/customer/Cart";
import { Checkout } from "@/app/components/customer/Checkout";
import { OrderConfirmation } from "@/app/components/customer/OrderConfirmation";
import { Orders } from "@/app/components/customer/Orders";
import { Profile } from "@/app/components/customer/Profile";
import { ResetPassword } from "@/app/components/customer/ResetPassword";
import { PolicyPage } from "@/app/components/customer/PolicyPage";
import { BottomNav } from "@/app/components/BottomNav";
import { CustomerChatWidget } from "@/app/components/chat/CustomerChatWidget";

// Staff Components
import { StaffDashboard } from "@/app/components/staff/StaffDashboard";
import { StaffOrders } from "@/app/components/staff/StaffOrders";
import { StaffProducts } from "@/app/components/staff/StaffProducts";
import { StaffChat } from "@/app/components/staff/StaffChat";

// Owner Components
import { OwnerDashboard } from "@/app/components/owner/OwnerDashboard";
import { OwnerStaff } from "@/app/components/owner/OwnerStaff";
import { OwnerSettings } from "@/app/components/owner/OwnerSettings";

function AppRoutes() {
  const { authReady } = useApp();
  const location = useLocation();

  if (!authReady) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const isBackoffice =
    location.pathname.startsWith("/staff") ||
    location.pathname.startsWith("/owner");

  return (
    <>
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/policies/:slug" element={<PolicyPage />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute allowedRoles={["customer", "staff", "admin"]}>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-confirmation/:orderId"
          element={
            <ProtectedRoute allowedRoles={["customer", "staff", "admin"]}>
              <OrderConfirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRoles={["customer", "staff", "admin"]}>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["customer", "staff", "admin"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Staff Routes */}
        <Route
          path="/staff/dashboard"
          element={
            <ProtectedRoute allowedRoles={["staff", "admin"]}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/orders"
          element={
            <ProtectedRoute allowedRoles={["staff", "admin"]}>
              <StaffOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/products"
          element={
            <ProtectedRoute allowedRoles={["staff", "admin"]}>
              <StaffProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/chat"
          element={
            <ProtectedRoute allowedRoles={["staff", "admin"]}>
              <StaffChat />
            </ProtectedRoute>
          }
        />

        {/* Owner Routes */}
        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/staff"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <OwnerStaff />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/settings"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <OwnerSettings />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isBackoffice && <BottomNav />}
      {!isBackoffice && <CustomerChatWidget />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
          <AppRoutes />
          <Toaster />
        </div>
        <AuthModal />
      </AppProvider>
    </BrowserRouter>
  );
}
