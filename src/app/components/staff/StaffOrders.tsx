import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useApp } from "@/app/contexts/AppContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "@/app/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "@/app/components/ui/button";
import { OrderInterface, CartItem } from "@/app/data/interFaces";
import { ApiRequest, baseUrl } from "@/app/contexts/ApiRequest";
import { StaffOwnerHeader } from "@/app/components/layout/StaffOwnerHeader";
import { toast } from "sonner";
import { formatCurrency } from "@/app/lib/formatCurrency";

export function StaffOrders() {
  const navigate = useNavigate();
  const { orders, updateOrderStatus, setloadOrder, settings } = useApp();
  const [selectedOrder, setSelectedOrder] = useState<OrderInterface | null>(
    null,
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const newOrders: OrderInterface[] = orders.filter((o: OrderInterface) => o.status === "new");
  const inProgressOrders: OrderInterface[] = orders.filter((o: OrderInterface) => o.status === "in-progress");
  const completedOrders: OrderInterface[] = orders.filter((o: OrderInterface) => o.status === "completed");

  const handleAccept = async (orderId: string) => {
    setIsProcessing(true);
    try {
      await updateOrder({
        id: orderId,
        status: "in-progress",
      });

      updateOrderStatus(orderId, "in-progress");
      setloadOrder((prev: boolean) => !prev);
      toast.success("Order accepted");
      setSelectedOrder(null);
    } catch (error) {
      toast.error("Failed to accept order");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (orderId: string) => {
    setIsProcessing(true);
    try {
      await updateOrder({
        id: orderId,
        status: "cancelled",
      });

      updateOrderStatus(orderId, "cancelled");
      setloadOrder((prev: boolean) => !prev);
      toast.success("Order rejected");
      setSelectedOrder(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject order");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleComplete = async (orderId: string) => {
    setIsProcessing(true);
    try {
      await updateOrder({
        id: orderId,
        status: "completed",
      });

      updateOrderStatus(orderId, "completed");
      setloadOrder((prev: boolean) => !prev);
      toast.success("Order marked as completed");
      setSelectedOrder(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to mark order as completed");
    } finally {
      setIsProcessing(false);
    }
  };

  const updateOrder = async (order: OrderInterface) => {
    return await ApiRequest({
      url: `${baseUrl}/orders`,
      method: "PUT",
      body: order,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <StaffOwnerHeader
        title="Order Management"
        onBack={() => navigate("/staff/dashboard")}
      />

      <div className="p-4">
        <Tabs defaultValue="new" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="new">New ({newOrders.length})</TabsTrigger>
            <TabsTrigger value="in-progress">
              In Progress ({inProgressOrders.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedOrders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="mt-4">
            <OrderList orders={newOrders} onSelect={setSelectedOrder} currencySymbol={settings.currencySymbol} />
          </TabsContent>

          <TabsContent value="in-progress" className="mt-4">
            <OrderList orders={inProgressOrders} onSelect={setSelectedOrder} currencySymbol={settings.currencySymbol} />
          </TabsContent>

          <TabsContent value="completed" className="mt-4">
            <OrderList orders={completedOrders} onSelect={setSelectedOrder} currencySymbol={settings.currencySymbol} />
          </TabsContent>
        </Tabs>
      </div>

      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
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
                <Badge>{selectedOrder.status.replace("-", " ")}</Badge>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Items</p>
                {selectedOrder.items.map((item: CartItem) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm mb-2 p-2 bg-gray-50 dark:bg-gray-800 rounded"
                  >
                    <div>
                      <p>{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span>{formatCurrency(item.price * item.quantity, settings.currencySymbol)}</span>
                  </div>
                ))}
              </div>
              {selectedOrder.deliveryMethod === "delivery" &&
                selectedOrder.address && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">
                      Delivery Address
                    </p>
                    <p className="text-sm">{selectedOrder.address}</p>
                  </div>
                )}
              <div className="border-t pt-3 mb-4">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="text-lg">
                    {formatCurrency(selectedOrder.total, settings.currencySymbol)}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {selectedOrder.status === "new" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleReject(selectedOrder.id)}
                      disabled={isProcessing}
                      className="flex-1"
                    >
                      Reject Order
                    </Button>
                    <Button
                      onClick={() => handleAccept(selectedOrder.id)}
                      disabled={isProcessing}
                      className="flex-1"
                    >
                      Accept Order
                    </Button>
                  </>
                )}
                {selectedOrder.status === "in-progress" && (
                  <Button
                    onClick={() => handleComplete(selectedOrder.id)}
                    disabled={isProcessing}
                    className="flex-1"
                  >
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

function OrderList({
  orders,
  onSelect,
  currencySymbol,
}: {
  orders: OrderInterface[];
  onSelect: (order: OrderInterface) => void;
  currencySymbol: string;
}) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No orders in this category
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
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
                {order.items.length} item{order.items.length > 1 ? "s" : ""}
              </p>
              <p className="text-lg">{formatCurrency(order.total, currencySymbol)}</p>
            </div>
            <Badge
              variant={
                order.deliveryMethod === "delivery" ? "default" : "secondary"
              }
            >
              {order.deliveryMethod}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
