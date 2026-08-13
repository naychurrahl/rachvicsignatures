import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { useApp } from "@/app/contexts/AppContext";
import { formatCurrency } from "@/app/lib/formatCurrency";

export function AnnouncementBar() {
  const { settings } = useApp();
  const [dismissed, setDismissed] = useState(false);
  const [index, setIndex] = useState(0);

  const messages = useMemo(() => {
    const items: string[] = [];

    items.push(
      settings.storeOpen
        ? `We're open — orders placed today ship out promptly (${settings.openTime}–${settings.closeTime}).`
        : `We're closed for new orders right now — back online ${settings.openTime}–${settings.closeTime}.`,
    );

    items.push(`Delivery from ${formatCurrency(settings.deliveryFee, settings.currencySymbol)} · ${settings.location}`);

    if (settings.refundEnabled) {
      items.push(`Easy ${settings.refundDays}-day returns on every order.`);
    }

    return items;
  }, [settings]);

  useEffect(() => {
    if (messages.length < 2) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [messages.length]);

  if (dismissed || messages.length === 0) return null;

  return (
    <div className="relative bg-gray-900 text-white text-center text-xs sm:text-sm">
      <div className="max-w-6xl mx-auto px-8 py-2">
        <p key={index} className="animate-in fade-in duration-500 truncate">
          {messages[index]}
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
