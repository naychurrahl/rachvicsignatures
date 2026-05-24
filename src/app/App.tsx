import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import { BottomNav } from "@/app/components/BottomNav";

// Staff Components
import { StaffDashboard } from "@/app/components/staff/StaffDashboard";
import { StaffOrders } from "@/app/components/staff/StaffOrders";
import { StaffProducts } from "@/app/components/staff/StaffProducts";

// Owner Components
import { OwnerDashboard } from "@/app/components/owner/OwnerDashboard";
import { OwnerStaff } from "@/app/components/owner/OwnerStaff";
import { OwnerSettings } from "@/app/components/owner/OwnerSettings";

function AppRoutes() {
  const { userRole } = useApp();

  return (
    <>
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-confirmation/:orderId"
          element={<OrderConfirmation />}
        />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />

        {/* Staff Routes */}
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/orders" element={<StaffOrders />} />
        <Route path="/staff/products" element={<StaffProducts />} />

        {/* Owner Routes */}
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/owner/staff" element={<OwnerStaff />} />
        <Route path="/owner/settings" element={<OwnerSettings />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Show bottom nav only for customer role and on specific routes */}
      {userRole === "customer" && <BottomNav />}
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
          <AppRoutes />
          <Toaster />
        </div>
      </BrowserRouter>
      <AuthModal />
    </AppProvider>
  );
}
