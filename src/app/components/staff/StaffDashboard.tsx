import { useNavigate } from 'react-router-dom';
import { useApp } from "@/app/contexts/AppContext";
import { Package, AlertTriangle, CheckCircle, MessageCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { StaffOwnerHeader } from "@/app/components/layout/StaffOwnerHeader";

export function StaffDashboard() {
  const navigate = useNavigate();
  const { orders, products } = useApp();

  const pendingOrders = orders.filter(o => o.status === 'new').length;
  const lowStockCount = products.filter(p => p.stock < 10).length;
  const fulfilledToday = orders.filter(o => o.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <StaffOwnerHeader title="Staff Dashboard" onBack={() => navigate('/profile')} />

      <div className="p-4">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="cursor-pointer active:scale-98 transition-transform" onClick={() => navigate('/staff/orders')}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-500">Pending Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl">{pendingOrders}</div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer active:scale-98 transition-transform" onClick={() => navigate('/staff/products')}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-500">Low Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl">{lowStockCount}</div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-500">Fulfilled Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl">{fulfilledToday}</div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="text-lg mb-3">Quick Actions</h2>
          <Button
            variant="outline"
            className="w-full h-14 justify-start"
            onClick={() => navigate('/staff/orders')}
          >
            <Package className="h-5 w-5 mr-3" />
            Manage Orders
          </Button>
          <Button
            variant="outline"
            className="w-full h-14 justify-start"
            onClick={() => navigate('/staff/products')}
          >
            <AlertTriangle className="h-5 w-5 mr-3" />
            Product Management
          </Button>
          <Button
            variant="outline"
            className="w-full h-14 justify-start"
            onClick={() => navigate('/staff/chat')}
          >
            <MessageCircle className="h-5 w-5 mr-3" />
            Support Chat
          </Button>
        </div>
      </div>
    </div>
  );
}
