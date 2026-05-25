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
          element={
            <ProtectedRoute>
              <OrderConfirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route path="/profile" element={<Profile />} />

        {/* Staff Routes */}
        <Route
          path="/staff/dashboard"
          element={
            <ProtectedRoute>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/staff/orders" element={
            <ProtectedRoute>
              <StaffOrders />
            </ProtectedRoute>
        } />
        <Route path="/staff/products" element={
            <ProtectedRoute>
              <StaffProducts />
            </ProtectedRoute>
        } />

        {/* Owner Routes */}
        <Route path="/owner/dashboard" element={
            <ProtectedRoute>
<OwnerDashboard />
            </ProtectedRoute>
        } />
        <Route path="/owner/staff" element={
            <ProtectedRoute>
<OwnerStaff />
            </ProtectedRoute>
        } />
        <Route path="/owner/settings" element={
            <ProtectedRoute>
<OwnerSettings />
            </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Show bottom nav only for customer role and on specific routes */}
      {/*userRole === "customer" && <BottomNav />*/}
      <BottomNav />
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
