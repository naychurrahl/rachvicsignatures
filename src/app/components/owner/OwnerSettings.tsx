import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, RefreshCw, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from 'sonner';

export function OwnerSettings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    storeOpen: true,
    openTime: '09:00',
    closeTime: '18:00',
    refundEnabled: true,
    refundDays: 30,
    orderLimit: 10
  });

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b px-4 py-3 flex items-center">
        <button onClick={() => navigate('/owner/dashboard')} className="p-2 -ml-2 active:scale-90 transition-transform">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg ml-2">Policy Settings</h1>
      </div>

      <div className="p-4">
        {/* Store Hours */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Store Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="store-open">Store Open</Label>
              <Switch
                id="store-open"
                checked={settings.storeOpen}
                onCheckedChange={(checked) => setSettings({ ...settings, storeOpen: checked })}
              />
            </div>
            {settings.storeOpen && (
              <>
                <div>
                  <Label htmlFor="open-time" className="text-xs text-gray-500">Opening Time</Label>
                  <Input
                    id="open-time"
                    type="time"
                    value={settings.openTime}
                    onChange={(e) => setSettings({ ...settings, openTime: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="close-time" className="text-xs text-gray-500">Closing Time</Label>
                  <Input
                    id="close-time"
                    type="time"
                    value={settings.closeTime}
                    onChange={(e) => setSettings({ ...settings, closeTime: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Refund Policy */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refund Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="refund-enabled">Enable Refunds</Label>
              <Switch
                id="refund-enabled"
                checked={settings.refundEnabled}
                onCheckedChange={(checked) => setSettings({ ...settings, refundEnabled: checked })}
              />
            </div>
            {settings.refundEnabled && (
              <div>
                <Label htmlFor="refund-days" className="text-xs text-gray-500">Refund Window (days)</Label>
                <Input
                  id="refund-days"
                  type="number"
                  value={settings.refundDays}
                  onChange={(e) => setSettings({ ...settings, refundDays: parseInt(e.target.value) })}
                  className="mt-1"
                  min="1"
                  max="90"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Limits */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Order Limits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="order-limit" className="text-xs text-gray-500">Maximum Items Per Order</Label>
              <Input
                id="order-limit"
                type="number"
                value={settings.orderLimit}
                onChange={(e) => setSettings({ ...settings, orderLimit: parseInt(e.target.value) })}
                className="mt-1"
                min="1"
              />
              <p className="text-xs text-gray-500 mt-1">Set to 0 for unlimited</p>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="w-full h-12">
          Save Settings
        </Button>
      </div>
    </div>
  );
}
