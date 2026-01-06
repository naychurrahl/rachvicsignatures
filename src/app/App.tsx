import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import { Toaster } from './components/ui/sonner';

// Customer Components
import { Home } from './components/customer/Home';
import { ProductDetails } from './components/customer/ProductDetails';
import { Cart } from './components/customer/Cart';
import { Checkout } from './components/customer/Checkout';
import { OrderConfirmation } from './components/customer/OrderConfirmation';
import { Orders } from './components/customer/Orders';
import { Profile } from './components/customer/Profile';
import { BottomNav } from './components/BottomNav';

// Staff Components
import { StaffDashboard } from './components/staff/StaffDashboard';
import { StaffOrders } from './components/staff/StaffOrders';
import { StaffProducts } from './components/staff/StaffProducts';

// Owner Components
import { OwnerDashboard } from './components/owner/OwnerDashboard';
import { OwnerStaff } from './components/owner/OwnerStaff';
import { OwnerSettings } from './components/owner/OwnerSettings';

function AppRoutes() {
  const { userRole } = useApp();

  return (
    <>
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
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
      {userRole === 'customer' && (
        <BottomNav />
      )}
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
      </AppProvider>
    </BrowserRouter>
  );
}
