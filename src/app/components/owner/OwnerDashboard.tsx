import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from "@/app/contexts/AppContext";
import { DollarSign, ShoppingBag, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { StaffOwnerHeader } from "@/app/components/layout/StaffOwnerHeader";
import { formatCurrency } from '@/app/lib/formatCurrency';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function OwnerDashboard() {
  const navigate = useNavigate();
  const { orders, staff, settings } = useApp();

  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const activeStaff = staff.filter((s) => s.status === 'active').length;

  const chartData = useMemo(() => {
    const salesByDay = WEEKDAYS.map((day) => ({ day, sales: 0 }));
    for (const order of orders) {
      const dayIndex = new Date(order.date).getDay();
      if (!Number.isNaN(dayIndex)) salesByDay[dayIndex].sales += order.total;
    }
    return salesByDay;
  }, [orders]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <StaffOwnerHeader title="Owner Dashboard" onBack={() => navigate('/profile')} />

      <div className="p-4">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-500">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl">{formatCurrency(totalSales, settings.currencySymbol)}</div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-500">Order Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl">{totalOrders}</div>
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
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
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="day" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Bar dataKey="sales" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} />
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
