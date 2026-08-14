import { useApp } from "@/app/contexts/AppContext";
import { Badge } from "@/app/components/ui/badge";
import { ArrowUpDown, ChevronRight, XCircle } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

import { OrderInterface, CartItem } from "@/app/data/interFaces";
import { formatCurrency } from "@/app/lib/formatCurrency";

type SortKey = "date-desc" | "date-asc" | "total-desc" | "total-asc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "date-desc", label: "Newest first" },
  { value: "date-asc", label: "Oldest first" },
  { value: "total-desc", label: "Total: high to low" },
  { value: "total-asc", label: "Total: low to high" },
];

export function Orders() {
  const { orders, user, settings } = useApp();

  const [selectedOrder, setSelectedOrder] = useState<OrderInterface | null>(
    null,
  );
  const [sortBy, setSortBy] = useState<SortKey>("date-desc");

  const myOrders = orders.filter((order: OrderInterface) => order.userId === user?.userId);

  // `date` is date-only (see backend fetchOrder) so same-day orders tie -- Array#sort is
  // stable, and the API already returns orders newest-created-first, so ties keep that order.
  const sortedOrders = [...myOrders].sort((a, b) => {
    switch (sortBy) {
      case "date-asc":
        return a.date.localeCompare(b.date);
      case "total-desc":
        return b.total - a.total;
      case "total-asc":
        return a.total - b.total;
      case "date-desc":
      default:
        return b.date.localeCompare(a.date);
    }
  });

  const newOrders = sortedOrders.filter((o) => o.status === "new");
  const inProgressOrders = sortedOrders.filter((o) => o.status === "in-progress");
  const completedOrders = sortedOrders.filter((o) => o.status === "completed");
  // Both failed payments and rejected orders land on status "cancelled" -- split the
  // view in two so it's clear which happened, without changing the underlying data model.
  const failedOrders = sortedOrders.filter(
    (o) => o.status === "cancelled" && o.paymentStatus === "failed",
  );
  const rejectedOrders = sortedOrders.filter(
    (o) => o.status === "cancelled" && o.paymentStatus !== "failed",
  );

  if (myOrders.length === 0) {
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
      <div className="p-4 pb-24">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg">My Orders</h1>
          <Select value={sortBy} onValueChange={(v: SortKey) => setSortBy(v)}>
            <SelectTrigger className="w-[180px]">
              <ArrowUpDown className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="new" className="w-full">
          {/* A rigid equal-width grid squeezes labels like "In Progress (3)" until they
              clip on narrow screens -- let the strip scroll horizontally on mobile instead,
              and only switch to an equal-width grid once there's room for it at sm+. */}
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabsList className="w-max sm:w-full flex sm:grid sm:grid-cols-5 gap-1">
              <TabsTrigger value="new" className="shrink-0 sm:flex-1">
                New ({newOrders.length})
              </TabsTrigger>
              <TabsTrigger value="in-progress" className="shrink-0 sm:flex-1">
                In Progress ({inProgressOrders.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="shrink-0 sm:flex-1">
                Completed ({completedOrders.length})
              </TabsTrigger>
              <TabsTrigger value="failed" className="shrink-0 sm:flex-1">
                Failed ({failedOrders.length})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="shrink-0 sm:flex-1">
                Rejected ({rejectedOrders.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="new" className="mt-4">
            <OrderList orders={newOrders} onSelect={setSelectedOrder} currencySymbol={settings.currencySymbol} />
          </TabsContent>
          <TabsContent value="in-progress" className="mt-4">
            <OrderList orders={inProgressOrders} onSelect={setSelectedOrder} currencySymbol={settings.currencySymbol} />
          </TabsContent>
          <TabsContent value="completed" className="mt-4">
            <OrderList orders={completedOrders} onSelect={setSelectedOrder} currencySymbol={settings.currencySymbol} />
          </TabsContent>
          <TabsContent value="failed" className="mt-4">
            <OrderList orders={failedOrders} onSelect={setSelectedOrder} currencySymbol={settings.currencySymbol} />
          </TabsContent>
          <TabsContent value="rejected" className="mt-4">
            <OrderList orders={rejectedOrders} onSelect={setSelectedOrder} currencySymbol={settings.currencySymbol} />
          </TabsContent>
        </Tabs>
      </div>

      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
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
                {selectedOrder.paymentStatus === "failed" ||
                selectedOrder.status === "cancelled" ? (
                  <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 px-3 py-2 rounded-lg">
                    <XCircle className="h-4 w-4 flex-shrink-0" />
                    <span>
                      {selectedOrder.paymentStatus === "failed"
                        ? "Payment failed. This order was not placed."
                        : "This order was rejected."}
                      {selectedOrder.refundStatus === "refunded" &&
                        " A refund has been issued."}
                      {selectedOrder.refundStatus === "failed" &&
                        " We couldn't process your refund automatically -- please contact support."}
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <div
                        className={`flex-1 h-2 rounded-full ${selectedOrder.status !== "new" ? "bg-primary" : "bg-gray-200"}`}
                      />
                      <div
                        className={`flex-1 h-2 rounded-full ${selectedOrder.status === "completed" ? "bg-primary" : "bg-gray-200"}`}
                      />
                      <div
                        className={`flex-1 h-2 rounded-full ${selectedOrder.status === "completed" ? "bg-primary" : "bg-gray-200"}`}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Placed</span>
                      <span>Processing</span>
                      <span>Delivered</span>
                    </div>
                  </>
                )}
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Items</p>
                {selectedOrder.items.map((item: CartItem) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm mb-1"
                  >
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>{formatCurrency(item.price * item.quantity, settings.currencySymbol)}</span>
                  </div>
                ))}
              </div>
              {selectedOrder.deliveryMethod === "delivery" &&
                selectedOrder.address && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Delivery Address</p>
                    <p className="text-sm">{selectedOrder.address}</p>
                  </div>
                )}
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="text-lg">
                    {formatCurrency(selectedOrder.total, settings.currencySymbol)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
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
          <div className="flex items-center justify-between flex-wrap gap-y-2">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {order.items.length} item{order.items.length > 1 ? "s" : ""}
              </p>
              <p className="text-lg">{formatCurrency(order.total, currencySymbol)}</p>
            </div>
            <div className="flex gap-2">
              {order.paymentStatus === "failed" && (
                <Badge variant="destructive">payment failed</Badge>
              )}
              <Badge
                variant={order.deliveryMethod === "delivery" ? "default" : "secondary"}
              >
                {order.deliveryMethod}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
