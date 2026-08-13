import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useApp } from "@/app/contexts/AppContext";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { OrderInterface } from "@/app/data/interFaces";
import { toast } from "sonner";
import { ApiRequest, baseUrl } from "@/app/contexts/ApiRequest";
import { formatCurrency } from "@/app/lib/formatCurrency";

type ConfirmationStatus = "loading" | "success" | "error";

export function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, setloadOrder, loadOrder, settings } = useApp();

  const [status, setStatus] = useState<ConfirmationStatus>("loading");
  const [order, setOrder] = useState<OrderInterface | undefined>(undefined);

  useEffect(() => {
    if (!orderId) {
      setStatus("error");
      return;
    }

    ApiRequest({ url: `${baseUrl}/payment/${orderId}` })
      .then((data: { [key: string]: any }) => {
        if (data.data.status === "success") {
          // Reload orders from backend, then find the confirmed order
          setloadOrder((prev: boolean) => !prev);
          const confirmedOrder = orders.find(
            (o: OrderInterface) => o.id === orderId,
          );
          setOrder(confirmedOrder);
          setStatus("success");
          toast.success("Payment successful");
        } else {
          setStatus("error");
          toast.error(
            "Payment could not be confirmed. Please contact support.",
          );
        }
      })
      .catch((error: any) => {
        console.error("Payment verification error:", error);
        setStatus("error");
        toast.error(`Payment verification error: ${error?.message ?? error}`);
      });
  }, [orderId]);

  // Re-sync order from context once orders reload from backend
  useEffect(() => {
    if (status === "success" && orderId) {
      const updated = orders.find((o: OrderInterface) => o.id === orderId);
      if (updated) setOrder(updated);
    }
  }, [orders, orderId, status]);

  // Payment is confirmed but the order details haven't arrived from the
  // background refetch yet -- this is still "loading," not a failure.
  if (status === "loading" || (status === "success" && !order)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
        <p className="text-gray-500">Confirming your payment...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full">
          <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-2xl">Payment Failed</h1>
        <p className="text-gray-500 text-center max-w-xs">
          We could not confirm your payment. Please contact support if you were
          charged.
        </p>
        <div className="flex gap-3 mt-2">
          <Button variant="outline" onClick={() => navigate("/orders")}>
            View Orders
          </Button>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
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
          <p className="text-gray-600 dark:text-gray-400">
            Thank you for your purchase
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border p-4 mb-4">
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Order Number</p>
            <p className="text-xl">{order.id}</p>
          </div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">Status</p>
            <Badge>{order.status.replace("-", " ")}</Badge>
          </div>
          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 mb-2">Order Summary</p>
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm mb-1">
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>{formatCurrency(item.price * item.quantity, settings.currencySymbol)}</span>
              </div>
            ))}
            <div className="border-t mt-2 pt-2">
              <div className="flex justify-between">
                <span>Total</span>
                <span className="text-lg">{formatCurrency(order.total, settings.currencySymbol)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/orders")}
            className="flex-1"
          >
            Track Order
          </Button>
          <Button onClick={() => navigate("/")} className="flex-1">
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
