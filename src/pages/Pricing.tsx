import { motion } from "framer-motion";
import { ArrowRight, Building2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Navbar } from "@/components/Navbar";
import { PricingCard } from "@/components/PricingCard";
import { useNexaHrApp } from "@/context/NexaHrAppContext";
import { nexaPricingPlans, type NexaPlanId } from "@/lib/nexaHr";

export default function Pricing() {
  const navigate = useNavigate();
  const { plan, upgradePlan } = useNexaHrApp();

  const handlePlanSelect = (planId: NexaPlanId) => {
    if (planId === "enterprise") {
      window.location.href =
        "mailto:sales@nexahr.ai?subject=Nexa%20HR%20Enterprise%20Plan";
      return;
    }

    upgradePlan(planId);
    navigate("/chat");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.14),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.12),transparent_20%),linear-gradient(180deg,#f8fafc,#eef2ff)] dark:bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.18),transparent_26%),linear-gradient(180deg,#050816,#090d18)]">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Pricing
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="mt-8 text-5xl font-semibold tracking-tight text-zinc-950 sm:text-6xl dark:text-white"
          >
            Simple plans for every HR workflow
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-300"
          >
            Start on Free, move to Pro for unlimited assistant access, or talk
            to us about an enterprise rollout.
          </motion.p>
        </section>

        <section className="mt-14 grid gap-5 lg:grid-cols-3">
          {nexaPricingPlans.map((pricingPlan) => (
            <PricingCard
              key={pricingPlan.id}
              currentPlan={plan}
              onSelect={handlePlanSelect}
              plan={pricingPlan}
            />
          ))}
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] border border-zinc-200/70 bg-white/88 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">
              Why teams choose Pro
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                "Unlimited conversations with the HR assistant",
                "Faster responses for active daily usage",
                "Advanced HR guidance and premium workflows",
                "Smooth upgrade path from free trial",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[24px] border border-zinc-200/70 bg-zinc-50/80 p-5 text-sm leading-7 text-zinc-700 dark:border-white/8 dark:bg-white/[0.03] dark:text-zinc-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-zinc-200/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(236,253,245,0.82))] p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(12,18,31,0.92),rgba(8,48,52,0.78))]">
            <div className="inline-flex rounded-2xl bg-zinc-950 p-3 text-white dark:bg-white dark:text-zinc-950">
              <Building2 className="h-5 w-5" />
            </div>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
              Need enterprise buying support?
            </h2>
            <p className="mt-4 text-sm leading-8 text-zinc-600 dark:text-zinc-300">
              We can support procurement-ready conversations, custom onboarding,
              and tailored rollout planning for larger organizations.
            </p>
            <button
              type="button"
              onClick={() =>
                (window.location.href =
                  "mailto:sales@nexahr.ai?subject=Nexa%20HR%20Enterprise%20Plan")
              }
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-zinc-950"
            >
              Contact Sales
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
