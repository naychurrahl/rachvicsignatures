import { LifeBuoy, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { useApp } from "@/app/contexts/AppContext";
import { formatCurrency } from "@/app/lib/formatCurrency";

export function TrustStrip() {
  const { settings } = useApp();

  const items = [
    {
      icon: Truck,
      title: "Fast Delivery",
      description: `From ${formatCurrency(settings.deliveryFee, settings.currencySymbol)} to ${settings.location}`,
    },
    {
      icon: ShieldCheck,
      title: "Secure Checkout",
      description: "Payments handled safely via Paystack",
    },
    {
      icon: RotateCcw,
      title: settings.refundEnabled ? "Easy Returns" : "Support",
      description: settings.refundEnabled
        ? `${settings.refundDays}-day return window`
        : "We're here if something's wrong",
    },
    {
      icon: LifeBuoy,
      title: "Live Support",
      description: "Chat with our team, right on the site",
    },
  ];

  return (
    <section className="bg-white dark:bg-gray-900 border-y">
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
        {items.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex items-center gap-3">
            <div className="shrink-0 h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium leading-tight">{title}</p>
              <p className="text-xs text-muted-foreground leading-tight mt-0.5 truncate">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
