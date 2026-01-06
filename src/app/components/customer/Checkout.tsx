import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Truck, Store, CreditCard, Wallet } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

export function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart, addOrder } = useApp();
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [address, setAddress] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = deliveryMethod === 'delivery' ? 5.99 : 0;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    const order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      total,
      status: 'new' as const,
      items: [...cart],
      deliveryMethod,
      address: deliveryMethod === 'delivery' ? address : undefined,
      paymentMethod: paymentMethod === 'card' ? 'Credit Card' : 'PayPal'
    };
    addOrder(order);
    clearCart();
    navigate(`/order-confirmation/${order.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b px-4 py-3 flex items-center">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 active:scale-90 transition-transform">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg ml-2">Checkout</h1>
      </div>

      <div className="p-4 pb-32">
        {/* Delivery Method */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border p-4 mb-4">
          <h2 className="text-sm mb-3">Delivery Method</h2>
          <RadioGroup value={deliveryMethod} onValueChange={(v) => setDeliveryMethod(v as 'delivery' | 'pickup')}>
            <div className="flex items-start gap-3 p-3 rounded-lg border mb-2">
              <RadioGroupItem value="delivery" id="delivery" className="mt-0.5" />
              <label htmlFor="delivery" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <Truck className="h-4 w-4" />
                  <span className="text-sm">Delivery</span>
                </div>
                <p className="text-xs text-gray-500">Estimated 2-3 days</p>
              </label>
              <span className="text-sm">$5.99</span>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border">
              <RadioGroupItem value="pickup" id="pickup" className="mt-0.5" />
              <label htmlFor="pickup" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <Store className="h-4 w-4" />
                  <span className="text-sm">Pickup</span>
                </div>
                <p className="text-xs text-gray-500">Ready today</p>
              </label>
              <span className="text-sm">Free</span>
            </div>
          </RadioGroup>
        </div>

        {/* Address Section */}
        {deliveryMethod === 'delivery' && (
          <div className="bg-white dark:bg-gray-900 rounded-lg border p-4 mb-4">
            <h2 className="text-sm mb-3">Delivery Address</h2>
            <div>
              <Label htmlFor="address" className="text-xs text-gray-500">Street Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, City, State 12345"
                className="mt-1"
              />
            </div>
          </div>
        )}

        {/* Payment Method */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border p-4 mb-4">
          <h2 className="text-sm mb-3">Payment Method</h2>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center gap-3 p-3 rounded-lg border mb-2">
              <RadioGroupItem value="card" id="card" />
              <label htmlFor="card" className="flex items-center gap-2 flex-1 cursor-pointer">
                <CreditCard className="h-4 w-4" />
                <span className="text-sm">Credit Card</span>
              </label>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <RadioGroupItem value="paypal" id="paypal" />
              <label htmlFor="paypal" className="flex items-center gap-2 flex-1 cursor-pointer">
                <Wallet className="h-4 w-4" />
                <span className="text-sm">PayPal</span>
              </label>
            </div>
          </RadioGroup>
        </div>

        {/* Order Summary */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border p-4">
          <h2 className="text-sm mb-3">Order Summary</h2>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between text-sm mb-2">
              <span>{item.name} x{item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {deliveryMethod === 'delivery' && (
              <div className="flex justify-between text-sm mb-1">
                <span>Delivery</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg">Total</span>
          <span className="text-2xl">${total.toFixed(2)}</span>
        </div>
        <Button
          onClick={handlePlaceOrder}
          disabled={deliveryMethod === 'delivery' && !address}
          className="w-full h-14 text-lg"
          size="lg"
        >
          Pay Now
        </Button>
      </div>
    </div>
  );
}
