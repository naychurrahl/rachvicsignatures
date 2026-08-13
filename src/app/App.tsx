import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

function AppRoutes() {
  const { authReady } = useApp();

  if (!authReady) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <BottomNav />
      <CustomerChatWidget />
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
