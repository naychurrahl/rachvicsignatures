import { Lock, MessageCircle, RotateCcw, Sparkles } from "lucide-react";
import { useApp } from "@/app/contexts/AppContext";

export function WhyChooseUs() {
  const { settings } = useApp();

  const benefits = [
    {
      icon: Sparkles,
      title: "Thoughtfully Curated",
      description: "Every product in our catalog is chosen for quality and craftsmanship.",
    },
    {
      icon: Lock,
      title: "Secure Checkout",
      description: "Payments are processed securely through Paystack -- never stored on our servers.",
    },
    {
      icon: MessageCircle,
      title: "Real Support, Real Fast",
      description: "Chat live with our team for order help, product questions, or anything else.",
    },
    {
      icon: RotateCcw,
      title: settings.refundEnabled ? "Easy Returns" : "We've Got You",
      description: settings.refundEnabled
        ? `Not the right fit? Return it within ${settings.refundDays} days, no hassle.`
        : "Reach out any time and our team will make it right.",
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
      <div className="mb-8 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-primary mb-1">
          Why Choose Us
        </p>
        <h2 className="text-2xl">Built Around Our Customers</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {benefits.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="bg-white dark:bg-gray-900 rounded-lg border p-5 text-center flex flex-col items-center"
          >
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Icon className="h-6 w-6" />
            </div>
            <p className="font-medium mb-1">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
