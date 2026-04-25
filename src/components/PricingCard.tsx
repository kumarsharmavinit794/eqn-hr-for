import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { type NexaPlanId, type NexaPricingPlan } from "@/lib/nexaHr";
import { cn } from "@/lib/utils";

type PricingCardProps = {
  compact?: boolean;
  currentPlan?: NexaPlanId;
  onSelect?: (planId: NexaPlanId) => void;
  plan: NexaPricingPlan;
};

export function PricingCard({
  compact = false,
  currentPlan,
  onSelect,
  plan,
}: PricingCardProps) {
  const isCurrentPlan = currentPlan === plan.id && plan.id !== "free";
  const isFeatured = Boolean(plan.featured);

  return (
    <motion.div
      whileHover={{ y: compact ? -4 : -8 }}
      className={cn(
        "relative overflow-hidden rounded-[28px] border p-6 shadow-[0_30px_90px_rgba(11,18,32,0.14)] backdrop-blur-2xl transition-colors sm:p-8",
        compact ? "h-full" : "min-h-[460px]",
        isFeatured
          ? "border-emerald-400/40 bg-[linear-gradient(180deg,rgba(16,185,129,0.18),rgba(7,11,20,0.92))] text-white"
          : "border-zinc-200/70 bg-white/85 text-zinc-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-70",
          isFeatured
            ? "bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.3),transparent_32%)]"
            : "bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_28%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_30%)]",
        )}
      />

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]">
            <Sparkles className="h-3.5 w-3.5" />
            {plan.badge ?? plan.tagline}
          </div>
          {isFeatured && (
            <div className="rounded-full bg-white/14 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
              Popular
            </div>
          )}
          {isCurrentPlan && !isFeatured && (
            <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
              Active
            </div>
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-2xl font-semibold tracking-tight">{plan.name}</h3>
          <p
            className={cn(
              "mt-2 text-sm leading-7",
              isFeatured ? "text-white/74" : "text-zinc-600 dark:text-zinc-400",
            )}
          >
            {plan.description}
          </p>
        </div>

        <div className="mt-8 flex items-end gap-2">
          <span className="text-5xl font-semibold tracking-tight">{plan.price}</span>
          {plan.cadence ? (
            <span
              className={cn(
                "pb-1 text-sm",
                isFeatured ? "text-white/70" : "text-zinc-500 dark:text-zinc-500",
              )}
            >
              {plan.cadence}
            </span>
          ) : null}
        </div>

        <p
          className={cn(
            "mt-3 text-sm font-medium",
            isFeatured ? "text-emerald-100" : "text-zinc-700 dark:text-zinc-300",
          )}
        >
          {plan.tagline}
        </p>

        <div className="mt-8 flex-1 space-y-3">
          {plan.features.map((feature) => (
            <div
              key={`${plan.id}-${feature}`}
              className={cn(
                "flex items-start gap-3 rounded-2xl border px-3 py-3",
                isFeatured
                  ? "border-white/10 bg-white/8"
                  : "border-zinc-200/80 bg-zinc-50/70 dark:border-white/8 dark:bg-white/[0.03]",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                  isFeatured
                    ? "bg-emerald-400/20 text-emerald-100"
                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                )}
              >
                <Check className="h-3.5 w-3.5" />
              </span>
              <span
                className={cn(
                  "text-sm leading-6",
                  isFeatured ? "text-white/84" : "text-zinc-700 dark:text-zinc-300",
                )}
              >
                {feature}
              </span>
            </div>
          ))}
        </div>

        <Button
          className={cn(
            "mt-8 w-full rounded-2xl py-6 text-sm font-semibold",
            isFeatured
              ? "bg-white text-zinc-950 hover:bg-zinc-100"
              : "border-zinc-300/80 bg-white/60 text-zinc-900 hover:bg-white dark:border-white/12 dark:bg-white/5 dark:text-white dark:hover:bg-white/10",
          )}
          disabled={isCurrentPlan}
          variant={isFeatured ? "default" : "outline"}
          onClick={() => onSelect?.(plan.id)}
        >
          {isCurrentPlan ? "Current Plan" : plan.cta}
        </Button>
      </div>
    </motion.div>
  );
}
