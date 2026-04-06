import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
}

export function PricingCard({ name, price, description, features, cta, featured = false }: PricingCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className={cn(
        "relative overflow-hidden rounded-[28px] border p-6 shadow-[0_24px_90px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-8",
        featured
          ? "border-primary/40 bg-gradient-to-b from-primary/12 via-card/95 to-card/90"
          : "border-border/70 bg-card/80",
      )}
    >
      {featured && (
        <div className="mb-5 inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Most Popular
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-semibold">{name}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="flex items-end gap-2">
          <span className="text-5xl font-semibold tracking-tight">{price}</span>
          <span className="pb-1 text-sm text-muted-foreground">/ month</span>
        </div>

        <div className="space-y-3 pt-4">
          {features.map((feature) => (
            <div key={feature} className="flex items-start gap-3 text-sm text-foreground/90">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Check className="h-3.5 w-3.5" />
              </span>
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <Button asChild className={cn("mt-6 w-full rounded-2xl", !featured && "shadow-none")} variant={featured ? "default" : "outline"}>
          <Link to="/login">{cta}</Link>
        </Button>
      </div>
    </motion.div>
  );
}
