import { Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { PricingCard } from "@/components/PricingCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNexaHrApp } from "@/context/NexaHrAppContext";
import { nexaPricingPlans, type NexaPlanId } from "@/lib/nexaHr";

export function UpgradeModal() {
  const navigate = useNavigate();
  const {
    closeUpgradeModal,
    isUpgradeModalOpen,
    plan,
    upgradePlan,
  } = useNexaHrApp();

  const handleSelect = (planId: NexaPlanId) => {
    if (planId === "enterprise") {
      window.location.href =
        "mailto:sales@nexahr.ai?subject=Nexa%20HR%20Enterprise%20Plan";
      return;
    }

    upgradePlan(planId);
    navigate("/chat");
  };

  return (
    <Dialog open={isUpgradeModalOpen} onOpenChange={(open) => !open && closeUpgradeModal()}>
      <DialogContent className="max-w-5xl rounded-[32px] border-zinc-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.98))] p-0 shadow-[0_40px_120px_rgba(15,23,42,0.28)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(8,13,24,0.98),rgba(5,8,18,0.98))]">
        <div className="p-6 sm:p-8">
          <DialogHeader className="space-y-4 text-left">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-400">
              <Rocket className="h-3.5 w-3.5" />
              Free Trial Ended 🚀
            </div>
            <DialogTitle className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
              Upgrade to continue using Nexa HR
            </DialogTitle>
            <DialogDescription className="max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              You have reached your free usage limit. Upgrade to continue using
              Nexa HR with unlimited messages, faster responses, and premium HR
              assistant features.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {nexaPricingPlans.map((pricingPlan) => (
              <PricingCard
                key={pricingPlan.id}
                compact
                currentPlan={plan}
                onSelect={handleSelect}
                plan={pricingPlan}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
