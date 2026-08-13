import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

export function NewsletterCta() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Enter a valid email address.");
      return;
    }
    toast.success("Thanks! We'll keep you posted on new arrivals.");
    setEmail("");
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
      <div className="rounded-2xl border bg-gray-50 dark:bg-gray-900 px-6 py-10 sm:px-12 text-center">
        <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
          <Mail className="h-6 w-6" />
        </div>
        <h2 className="text-2xl mb-2">Stay in the Loop</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          Get notified about new arrivals and collection drops. No spam, unsubscribe anytime.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-11"
          />
          <Button type="submit" size="lg" className="sm:w-auto w-full">
            Notify Me
          </Button>
        </form>
      </div>
    </section>
  );
}
