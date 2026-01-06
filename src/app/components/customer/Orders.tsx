import { useApp } from '../../contexts/AppContext';
import { Badge } from '../ui/badge';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Order } from '../../data/mockData';

export function Orders() {
  const { orders } = useApp();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'default';
      case 'in-progress':
        return 'secondary';
      case 'completed':
        return 'default';
      default:
        return 'default';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-180px)]">
        <div className="text-gray-400 mb-4">
          <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg mb-2">No orders yet</h3>
        <p className="text-sm text-gray-500">Your order history will appear here</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 pb-20">
        {orders.map(order => (
          <div
            key={order.id}
            onClick={() => setSelectedOrder(order)}
            className="bg-white dark:bg-gray-900 rounded-lg border p-4 mb-3 active:scale-98 transition-transform cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm text-gray-500">Order #{order.id}</p>
                <p className="text-xs text-gray-400 mt-0.5">{order.date}</p>
              </div>
              <Badge variant={getStatusColor(order.status) as any}>
                {order.status.replace('-', ' ')}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {order.items.length} item{order.items.length > 1 ? 's' : ''}
                </p>
                <p className="text-lg">${order.total.toFixed(2)}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Order Number</p>
                <p>{selectedOrder.id}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <div className="flex gap-2">
                  <div className={`flex-1 h-2 rounded-full ${selectedOrder.status !== 'new' ? 'bg-blue-600' : 'bg-gray-200'}`} />
                  <div className={`flex-1 h-2 rounded-full ${selectedOrder.status === 'completed' ? 'bg-blue-600' : 'bg-gray-200'}`} />
                  <div className={`flex-1 h-2 rounded-full ${selectedOrder.status === 'completed' ? 'bg-blue-600' : 'bg-gray-200'}`} />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Placed</span>
                  <span>Processing</span>
                  <span>Delivered</span>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Items</p>
                {selectedOrder.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm mb-1">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="text-lg">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
