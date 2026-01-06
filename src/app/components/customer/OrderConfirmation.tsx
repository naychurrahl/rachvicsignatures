import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders } = useApp();

  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Order not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mb-4">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 dark:text-gray-400">Thank you for your purchase</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border p-4 mb-4">
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Order Number</p>
            <p className="text-xl">{order.id}</p>
          </div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">Status</p>
            <Badge>{order.status.replace('-', ' ')}</Badge>
          </div>
          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 mb-2">Order Summary</p>
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between text-sm mb-1">
                <span>{item.name} x{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t mt-2 pt-2">
              <div className="flex justify-between">
                <span>Total</span>
                <span className="text-lg">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/orders')} className="flex-1">
            Track Order
          </Button>
          <Button onClick={() => navigate('/')} className="flex-1">
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
