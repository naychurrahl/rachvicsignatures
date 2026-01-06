import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Order } from '../../data/mockData';
import { toast } from 'sonner';

export function StaffOrders() {
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useApp();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const newOrders = orders.filter(o => o.status === 'new');
  const inProgressOrders = orders.filter(o => o.status === 'in-progress');
  const completedOrders = orders.filter(o => o.status === 'completed');

  const handleAccept = (orderId: string) => {
    updateOrderStatus(orderId, 'in-progress');
    toast.success('Order accepted');
    setSelectedOrder(null);
  };

  const handleComplete = (orderId: string) => {
    updateOrderStatus(orderId, 'completed');
    toast.success('Order marked as completed');
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b px-4 py-3 flex items-center">
        <button onClick={() => navigate('/staff/dashboard')} className="p-2 -ml-2 active:scale-90 transition-transform">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg ml-2">Order Management</h1>
      </div>

      <div className="p-4">
        <Tabs defaultValue="new" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="new">New ({newOrders.length})</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress ({inProgressOrders.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="mt-4">
            <OrderList orders={newOrders} onSelect={setSelectedOrder} />
          </TabsContent>

          <TabsContent value="in-progress" className="mt-4">
            <OrderList orders={inProgressOrders} onSelect={setSelectedOrder} />
          </TabsContent>

          <TabsContent value="completed" className="mt-4">
            <OrderList orders={completedOrders} onSelect={setSelectedOrder} />
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Date</p>
                <p>{selectedOrder.date}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <Badge>{selectedOrder.status.replace('-', ' ')}</Badge>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Items</p>
                {selectedOrder.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm mb-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <div>
                      <p>{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              {selectedOrder.deliveryMethod === 'delivery' && selectedOrder.address && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Delivery Address</p>
                  <p className="text-sm">{selectedOrder.address}</p>
                </div>
              )}
              <div className="border-t pt-3 mb-4">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="text-lg">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {selectedOrder.status === 'new' && (
                  <Button onClick={() => handleAccept(selectedOrder.id)} className="flex-1">
                    Accept Order
                  </Button>
                )}
                {selectedOrder.status === 'in-progress' && (
                  <Button onClick={() => handleComplete(selectedOrder.id)} className="flex-1">
                    Mark as Completed
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function OrderList({ orders, onSelect }: { orders: Order[]; onSelect: (order: Order) => void }) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No orders in this category
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map(order => (
        <div
          key={order.id}
          onClick={() => onSelect(order)}
          className="bg-white dark:bg-gray-900 rounded-lg border p-4 active:scale-98 transition-transform cursor-pointer"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm text-gray-500">Order #{order.id}</p>
              <p className="text-xs text-gray-400 mt-0.5">{order.date}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {order.items.length} item{order.items.length > 1 ? 's' : ''}
              </p>
              <p className="text-lg">${order.total.toFixed(2)}</p>
            </div>
            <Badge variant={order.deliveryMethod === 'delivery' ? 'default' : 'secondary'}>
              {order.deliveryMethod}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
