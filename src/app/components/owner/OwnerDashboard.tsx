import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { ArrowLeft, DollarSign, ShoppingBag, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const chartData = [
  { day: 'Mon', sales: 1200 },
  { day: 'Tue', sales: 1900 },
  { day: 'Wed', sales: 1600 },
  { day: 'Thu', sales: 2100 },
  { day: 'Fri', sales: 2400 },
  { day: 'Sat', sales: 2800 },
  { day: 'Sun', sales: 2200 },
];

export function OwnerDashboard() {
  const navigate = useNavigate();
  const { orders, setUserRole } = useApp();

  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const activeStaff = 2; // Mock data

  const handleLogout = () => {
    setUserRole('customer');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={handleLogout} className="p-2 -ml-2 active:scale-90 transition-transform">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg ml-2">Owner Dashboard</h1>
        </div>
      </div>

      <div className="p-4">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-500">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl">${totalSales.toFixed(0)}</div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-xs text-gray-500 mt-2">+12% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-500">Order Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl">{totalOrders}</div>
                <ShoppingBag className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-xs text-gray-500 mt-2">+8% from last week</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer active:scale-98 transition-transform" onClick={() => navigate('/owner/staff')}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-500">Active Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl">{activeStaff}</div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sales Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-sm">Sales This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Bar dataKey="sales" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="text-lg mb-3">Management</h2>
          <Button
            variant="outline"
            className="w-full h-14 justify-start"
            onClick={() => navigate('/owner/staff')}
          >
            <Users className="h-5 w-5 mr-3" />
            Staff Management
          </Button>
          <Button
            variant="outline"
            className="w-full h-14 justify-start"
            onClick={() => navigate('/owner/settings')}
          >
            <DollarSign className="h-5 w-5 mr-3" />
            Policy Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
