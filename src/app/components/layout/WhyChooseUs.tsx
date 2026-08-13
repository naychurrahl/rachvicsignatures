import {
  Award, Gift, Heart, LifeBuoy, Lock, LucideIcon, MessageCircle, Package, RotateCcw,
  ShieldCheck, Sparkles, Star, ThumbsUp, Truck,
} from "lucide-react";
import { WhyChooseBenefit } from "@/app/data/interFaces";

const ICONS: Record<string, LucideIcon> = {
  Sparkles, Lock, MessageCircle, RotateCcw, Truck, ShieldCheck, LifeBuoy,
  Star, Heart, Gift, Award, ThumbsUp, Package,
};

interface WhyChooseUsProps {
  eyebrow: string;
  title: string;
  benefits: WhyChooseBenefit[];
}

export function WhyChooseUs({ eyebrow, title, benefits }: WhyChooseUsProps) {
  if (benefits.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
      <div className="mb-8 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-primary mb-1">
          {eyebrow}
        </p>
        <h2 className="text-2xl">{title}</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {benefits.map(({ icon, title: benefitTitle, description }) => {
          const Icon = ICONS[icon] ?? Sparkles;
          return (
            <div
              key={benefitTitle}
              className="bg-white dark:bg-gray-900 rounded-lg border p-5 text-center flex flex-col items-center"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                <Icon className="h-6 w-6" />
              </div>
              <p className="font-medium mb-1">{benefitTitle}</p>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
