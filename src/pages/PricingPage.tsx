import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import { MarketingFooter } from "@/components/MarketingFooter";
import { MarketingNavbar } from "@/components/MarketingNavbar";
import { PricingCard } from "@/components/PricingCard";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for early teams exploring structured AI-assisted hiring.",
    features: ["Up to 25 candidates / month", "Basic resume screening", "Single admin workspace", "Community support"],
    cta: "Start Free",
  },
  {
    name: "Pro",
    price: "$49",
    description: "The best fit for scaling teams that want serious AI recruitment leverage.",
    features: ["Unlimited candidates", "AI scoring and candidate matching", "Admin + HR dashboards", "Priority support", "Advanced analytics"],
    cta: "Choose Pro",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations that need premium control, security, and custom workflows.",
    features: ["Custom features and integrations", "Dedicated support", "Advanced activity logs", "SSO and security controls", "Custom onboarding"],
    cta: "Talk to Sales",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.12),_transparent_22%)]">
      <MarketingNavbar />

      <main className="mx-auto w-full max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
        <section className="mx-auto max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/60 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-primary backdrop-blur-xl">
            <Sparkles className="h-4 w-4" />
            Flexible SaaS pricing
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Pricing for every stage of hiring maturity
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} className="mt-5 text-lg leading-8 text-muted-foreground">
            Start free, scale with Pro, and unlock enterprise-grade recruitment operations when you are ready.
          </motion.p>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
              <PricingCard {...plan} />
            </motion.div>
          ))}
        </section>

        <section className="mt-20 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[30px] border border-border/70 bg-card/75 p-8 backdrop-blur-xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">What every plan includes</p>
            <div className="mt-8 space-y-4">
              {[
                "Modern, responsive dashboard experience",
                "Secure authentication and role-based access",
                "Fast candidate and job workflows",
                "Clean analytics-ready data foundation",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                  <p className="text-sm leading-7 text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-primary/20 bg-gradient-to-br from-primary/12 via-card/85 to-accent/10 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Enterprise ready</p>
                <h2 className="mt-1 text-2xl font-semibold">Need procurement-friendly buying?</h2>
              </div>
            </div>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground">
              We can support custom onboarding, dedicated environments, and advanced security expectations for high-volume talent teams.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full px-7">
                <Link to="/login">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-7">
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
