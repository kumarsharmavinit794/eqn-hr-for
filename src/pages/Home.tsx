import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  FileText,
  Menu,
  ShieldCheck,
  Sparkles,
  Users2,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useNexaHrApp } from "@/context/NexaHrAppContext";
import { useMarketingContent } from "@/hooks/useMarketingContent";
import { NEXA_MAX_FREE_LIMIT, type NexaPlanId } from "@/lib/nexaHr";
import { cn } from "@/lib/utils";

type NavLink = {
  href: string;
  label: string;
};

type FeatureCard = {
  description: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
};

type WorkflowStep = {
  description: string;
  icon: LucideIcon;
  title: string;
};

type PricingPlan = {
  badge: string;
  description: string;
  features: string[];
  id: NexaPlanId;
  price: string;
  suffix: string;
  title: string;
};

type Testimonial = {
  company: string;
  name: string;
  quote: string;
  role: string;
};

const navLinks: NavLink[] = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#dashboard", label: "Dashboard" },
  { href: "#pricing", label: "Pricing" },
  { href: "#testimonials", label: "Testimonials" },
];

const featureCards: FeatureCard[] = [
  {
    title: "Employee management",
    eyebrow: "One source of truth",
    description:
      "Keep profiles, onboarding tasks, documents, and approvals in one clean workspace for HR and managers.",
    icon: Users2,
  },
  {
    title: "Payroll automation",
    eyebrow: "Accurate every cycle",
    description:
      "Run salary calculations, reimbursements, deductions, and payout approvals with fewer manual checks.",
    icon: Wallet,
  },
  {
    title: "Attendance tracking",
    eyebrow: "Live workforce visibility",
    description:
      "Monitor shifts, leave, late arrivals, and attendance exceptions with real-time alerts and trends.",
    icon: Clock3,
  },
  {
    title: "Reports and analytics",
    eyebrow: "Executive-ready insights",
    description:
      "See headcount, payroll spend, retention, and compliance health in dashboards built for fast decisions.",
    icon: BarChart3,
  },
  {
    title: "AI HR assistant",
    eyebrow: "Embedded where teams work",
    description:
      "Get instant help with payroll questions, policy guidance, and people ops workflows from an AI copilot.",
    icon: Bot,
  },
];

const workflowSteps: WorkflowStep[] = [
  {
    title: "Connect your workforce data",
    description:
      "Import employees, departments, salary structures, and leave policies without rebuilding your process from scratch.",
    icon: Building2,
  },
  {
    title: "Automate payroll and attendance",
    description:
      "Set recurring cycles, approval flows, compliance rules, and alerts so every run feels predictable and controlled.",
    icon: CreditCard,
  },
  {
    title: "Give leaders live visibility",
    description:
      "Managers and finance teams get dashboards, reports, and AI summaries the moment something needs attention.",
    icon: ShieldCheck,
  },
];

const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    title: "Free",
    price: "Rs 0",
    suffix: "/month",
    badge: "Launch mode",
    description:
      "A polished entry point for lean teams that want a real workspace before committing to a paid rollout.",
    features: [
      `${NEXA_MAX_FREE_LIMIT} assisted workflows per day`,
      "Employee directory and attendance basics",
      "Payroll preview and monthly summaries",
      "Standard support and onboarding guides",
    ],
  },
  {
    id: "pro",
    title: "Pro",
    price: "Rs 999",
    suffix: "/workspace",
    badge: "Most popular",
    description:
      "For growing companies that need unlimited usage, richer automation, and a premium HR operations experience.",
    features: [
      "Unlimited payroll and AI assistant usage",
      "Automated approval flows and alerts",
      "Advanced analytics and exportable reports",
      "Priority support for HR and finance teams",
    ],
  },
  {
    id: "enterprise",
    title: "Enterprise",
    price: "Custom",
    suffix: "",
    badge: "Scale with control",
    description:
      "For multi-location teams that want tailored rollout support, governance, and enterprise-ready security.",
    features: [
      "Custom implementation and migration support",
      "SSO, role controls, and audit visibility",
      "Dedicated success manager and SLA options",
      "Custom payroll rules and compliance workflows",
    ],
  },
];

const testimonials: Testimonial[] = [
  {
    quote:
      "Nexa HR replaced a messy mix of spreadsheets and point tools. Payroll runs that used to take half a day now feel calm and predictable.",
    name: "Ananya Rao",
    role: "Head of People",
    company: "Northstar Labs",
  },
  {
    quote:
      "The UI feels premium, but what sold us was the clarity. Our managers finally understand attendance trends and salary approvals at a glance.",
    name: "Marcus Lee",
    role: "Operations Director",
    company: "BluePeak Commerce",
  },
  {
    quote:
      "The AI assistant has become our first stop for payroll questions and policy drafts. It saves the team hours every week without adding complexity.",
    name: "Priya Menon",
    role: "HRBP",
    company: "Astra Cloud",
  },
];

const revealProps = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
} as const;

function SectionHeading({
  align = "center",
  description,
  eyebrow,
  title,
}: {
  align?: "center" | "left";
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <motion.div
      {...revealProps}
      className={cn("max-w-3xl", align === "center" ? "mx-auto text-center" : "text-left")}
    >
      <p className="text-sm font-semibold uppercase tracking-[0.26em] text-sky-700">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-[2.7rem]">
        {title}
      </h2>
      <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">{description}</p>
    </motion.div>
  );
}

function HeroDashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[620px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
        className="relative overflow-hidden rounded-[34px] border border-white/70 bg-white/85 p-4 shadow-[0_32px_120px_rgba(15,23,42,0.18)] backdrop-blur-xl"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(135deg,rgba(37,99,235,0.18),rgba(124,58,237,0.1),transparent)]" />

        <div className="relative rounded-[28px] border border-slate-200/80 bg-slate-950 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-5">
          <div className="flex items-center justify-between gap-4 rounded-[22px] border border-white/10 bg-white/5 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-white">Nexa HR Command Center</p>
              <p className="mt-1 text-xs text-slate-400">April payroll cycle, attendance, and approvals</p>
            </div>
            <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
              Live sync
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.35fr_0.9fr]">
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Employees", "142"],
                  ["On-time pay", "99.2%"],
                  ["Open approvals", "08"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-[22px] border border-white/10 bg-white/5 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                  >
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{label}</p>
                    <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[26px] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">People analytics</p>
                    <p className="mt-1 text-xs text-slate-400">Attendance stability and team load this month</p>
                  </div>
                  <div className="rounded-full bg-sky-500/15 px-3 py-1 text-xs font-medium text-sky-300">
                    +12% efficiency
                  </div>
                </div>

                <div className="mt-6 flex h-44 items-end gap-3 rounded-[20px] bg-[linear-gradient(180deg,rgba(15,23,42,0.2),rgba(15,23,42,0.45))] px-4 pb-4 pt-6">
                  {[62, 88, 76, 112, 98, 124, 106].map((height, index) => (
                    <div key={height} className="flex flex-1 flex-col items-center gap-3">
                      <div
                        className={cn(
                          "w-full rounded-t-full bg-[linear-gradient(180deg,#A5B4FC,#4F46E5)] shadow-[0_12px_28px_rgba(79,70,229,0.35)]",
                          index === 5 && "bg-[linear-gradient(180deg,#D8B4FE,#9333EA)]",
                        )}
                        style={{ height }}
                      />
                      <span className="text-[11px] text-slate-500">
                        {["M", "T", "W", "T", "F", "S", "S"][index]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[26px] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Payroll run</p>
                    <p className="mt-1 text-xs text-slate-400">Cycle closes in 2 days</p>
                  </div>
                  <Wallet className="h-5 w-5 text-sky-300" />
                </div>

                <div className="mt-5 space-y-3">
                  {[
                    ["Net salary", "Rs 18.4L"],
                    ["Reimbursements", "Rs 1.2L"],
                    ["Pending review", "04 items"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <span className="text-sm text-slate-300">{label}</span>
                      <span className="text-sm font-semibold text-white">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[26px] border border-sky-400/20 bg-[linear-gradient(180deg,rgba(37,99,235,0.18),rgba(15,23,42,0.25))] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">AI assistant</p>
                    <p className="mt-1 text-xs text-sky-100/80">Flagged two attendance anomalies and one payout mismatch</p>
                  </div>
                </div>
                <div className="mt-4 rounded-[22px] border border-white/10 bg-slate-950/40 p-4 text-sm leading-7 text-slate-200">
                  "Finance approvals are the only blocker for April payroll. Salary variance is within expected range."
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="absolute -left-6 top-12 hidden rounded-[24px] border border-white/70 bg-white/90 px-4 py-3 shadow-[0_18px_40px_rgba(37,99,235,0.18)] backdrop-blur-lg sm:block"
        style={{ animation: "float 7s ease-in-out infinite" }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700">
          Attendance synced
        </p>
        <p className="mt-2 text-sm font-semibold text-slate-950">142 check-ins captured today</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.38 }}
        className="absolute -bottom-6 right-2 hidden rounded-[24px] border border-slate-200/90 bg-white/95 px-4 py-3 shadow-[0_18px_50px_rgba(15,23,42,0.16)] backdrop-blur-lg sm:block"
        style={{ animation: "float 8s ease-in-out infinite 0.8s" }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-700">
          Salary preview
        </p>
        <p className="mt-2 text-sm font-semibold text-slate-950">Rs 6.8L disbursing on Apr 30</p>
      </motion.div>
    </div>
  );
}

function OperationsDashboardPreview() {
  return (
    <motion.div
      {...revealProps}
      className="relative overflow-hidden rounded-[34px] border border-slate-200/80 bg-white/90 p-4 shadow-[0_28px_100px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-5"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(37,99,235,0.12),transparent)]" />

      <div className="relative rounded-[30px] border border-slate-200/70 bg-[#f8fbff] p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-950">Payroll and workforce analytics</p>
            <p className="mt-1 text-xs text-slate-500">Built for HR, finance, and managers on the same timeline</p>
          </div>
          <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
            Updated 2 min ago
          </div>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["Payroll completion", "96%"],
                ["Attendance compliance", "98.1%"],
                ["Salary issues", "03"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-950">{value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-950">Monthly payroll trend</p>
                  <p className="mt-1 text-xs text-slate-500">Net salary vs reimbursements</p>
                </div>
                <div className="inline-flex items-center gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
                    Salary
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
                    Reimbursements
                  </span>
                </div>
              </div>

              <div className="mt-6 flex h-64 items-end gap-4 rounded-[22px] bg-[#f5f8ff] p-4">
                {[
                  [72, 18],
                  [88, 24],
                  [84, 16],
                  [108, 26],
                  [98, 20],
                  [116, 30],
                ].map(([salary, reimbursement], index) => (
                  <div key={salary} className="flex flex-1 flex-col items-center gap-3">
                    <div className="flex h-full w-full items-end justify-center gap-2">
                      <div
                        className="w-full rounded-t-full bg-[linear-gradient(180deg,#A5B4FC,#4F46E5)] shadow-[0_12px_26px_rgba(79,70,229,0.18)]"
                        style={{ height: salary }}
                      />
                      <div
                        className="w-full rounded-t-full bg-[linear-gradient(180deg,#D8B4FE,#9333EA)] shadow-[0_12px_26px_rgba(147,51,234,0.18)]"
                        style={{ height: reimbursement }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">
                      {["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"][index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-950">Salary breakdown</p>
                  <p className="mt-1 text-xs text-slate-500">Selected team payout card</p>
                </div>
                <CreditCard className="h-5 w-5 text-slate-500" />
              </div>

              <div className="mt-5 rounded-[24px] bg-slate-950 p-5 text-white shadow-[0_18px_40px_rgba(15,23,42,0.22)]">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Product team</p>
                <p className="mt-4 text-3xl font-semibold">Rs 4.8L</p>
                <p className="mt-2 text-sm text-slate-300">Scheduled payout on Apr 30</p>
                <div className="mt-6 space-y-3 text-sm">
                  {[
                    ["Base salary", "Rs 4.1L"],
                    ["Bonus and variable", "Rs 42k"],
                    ["Deductions", "Rs 18k"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between text-slate-200">
                      <span>{label}</span>
                      <span className="font-medium text-white">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {[
                  ["Approvals complete", "12/14 managers"],
                  ["Variance flagged", "2 employees"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-[#f8fbff] px-4 py-3"
                  >
                    <span className="text-sm text-slate-600">{label}</span>
                    <span className="text-sm font-semibold text-slate-950">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-sky-200 bg-[linear-gradient(135deg,rgba(219,234,254,0.8),rgba(245,243,255,0.9))] p-5 shadow-[0_16px_40px_rgba(59,130,246,0.08)]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4F46E5,#9333EA)] text-white shadow-[0_12px_28px_rgba(79,70,229,0.25)]">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950">AI summary</p>
                  <p className="mt-1 text-xs text-slate-600">Ready for HR and finance review</p>
                </div>
              </div>

              <div className="mt-4 rounded-[22px] border border-white/70 bg-white/80 p-4 text-sm leading-7 text-slate-700">
                April payroll is on track. Two reimbursement claims need approval before noon to keep disbursement timing unchanged.
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function HomeLoadingState() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white dark:bg-[#0F172A]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div className="space-y-6">
            <div className="h-6 w-40 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="h-28 animate-pulse rounded-[32px] bg-slate-200 dark:bg-slate-700" />
            <div className="h-16 animate-pulse rounded-[24px] bg-slate-100 dark:bg-slate-800" />
            <div className="flex gap-3">
              <div className="h-12 w-36 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="h-12 w-36 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-28 animate-pulse rounded-[24px] border border-slate-200/80 bg-white/90 dark:border-slate-700/70 dark:bg-[#1E293B]"
                />
              ))}
            </div>
          </div>

          <div className="h-[520px] animate-pulse rounded-[36px] border border-slate-200/80 bg-white/90 dark:border-slate-700/70 dark:bg-[#1E293B]" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { messageCount, plan, queuePrompt, remainingFreeMessages, upgradePlan } = useNexaHrApp();
  const { data, error, loading } = useMarketingContent();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const marketingNavLinks = data.navLinks;
  const featureCardsData = data.featureCards;
  const workflowStepsData = data.workflowSteps;
  const pricingPlansData = data.pricingPlans;
  const testimonialsData = data.testimonials;
  const heroMetrics = data.heroMetrics;
  const heroTags = data.heroTags;
  const dashboardHighlights = data.dashboardHighlights;

  if (loading) {
    return <HomeLoadingState />;
  }

  const handlePlanSelect = (planId: NexaPlanId) => {
    if (planId === "enterprise") {
      window.location.href =
        "mailto:sales@nexahr.ai?subject=Nexa%20HR%20Enterprise%20Demo";
      return;
    }

    if (planId === "pro") {
      upgradePlan("pro");
    }

    navigate(localStorage.getItem("token") ? "/app" : "/signup");
  };

  const openAssistantDemo = () => {
    queuePrompt(
      "Show me how Nexa HR handles payroll approvals, attendance anomalies, and employee onboarding for a growing team.",
    );
    navigate("/chat");
  };

  return (
    <div className="marketing-page min-h-screen overflow-x-hidden bg-white text-[#111827] dark:bg-[#0F172A] dark:text-white">
      <div className="relative isolate">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[980px] bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(147,51,234,0.16),transparent_24%),linear-gradient(180deg,#f7f9ff_0%,#eef4ff_46%,#ffffff_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.24),transparent_30%),radial-gradient(circle_at_top_right,rgba(147,51,234,0.2),transparent_28%),linear-gradient(180deg,#0F172A_0%,#111b32_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:76px_76px] [mask-image:linear-gradient(to_bottom,white_0%,white_45%,transparent_78%)]" />

        <header className="sticky top-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur-2xl dark:border-slate-800/80 dark:bg-[#0F172A]/80">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4F46E5,#9333EA)] text-white shadow-[0_16px_40px_rgba(79,70,229,0.25)]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-950">
                  Nexa HR
                </p>
                <p className="text-xs text-slate-500">HR & Payroll Management</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-8 lg:flex">
              {marketingNavLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              <div className="rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-xs text-slate-600 shadow-[0_10px_25px_rgba(15,23,42,0.05)]">
                {plan === "free"
                  ? `${remainingFreeMessages} free workflows left today`
                  : `${plan.toUpperCase()} plan active`}
              </div>
              <Link
                to="/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#4F46E5,#9333EA)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(79,70,229,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_rgba(79,70,229,0.32)]"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.06)] lg:hidden"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="border-t border-slate-200 bg-white/95 px-4 py-4 shadow-[0_20px_50px_rgba(15,23,42,0.08)] lg:hidden"
              >
                <div className="mx-auto flex max-w-7xl flex-col gap-2">
                  {marketingNavLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#4F46E5,#9333EA)] px-4 py-3 text-sm font-semibold text-white"
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <main className="relative z-10">
          {error ? (
            <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-200">
                {error}
              </div>
            </div>
          ) : null}

          <section className="mx-auto grid max-w-7xl gap-14 px-4 pb-24 pt-14 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:px-8 lg:pb-28 lg:pt-20">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/85 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-indigo-600 shadow-[0_12px_30px_rgba(79,70,229,0.08)] dark:border-indigo-400/20 dark:bg-[#1E293B] dark:text-indigo-300"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Startup-grade HR operations
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.06 }}
                className="mt-8 max-w-3xl text-balance text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-[4.2rem] lg:leading-[1.02]"
              >
                Run HR and payroll from one calm, premium command center.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.12 }}
                className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl"
              >
                Centralize employee records, automate payroll, track attendance, and give every manager an AI assistant in a workspace designed to feel as polished as the best SaaS products.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.18 }}
                className="mt-10 flex flex-col gap-3 sm:flex-row"
              >
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#4F46E5,#9333EA)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_20px_45px_rgba(79,70,229,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_55px_rgba(79,70,229,0.34)]"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={openAssistantDemo}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/90 px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-[0_14px_32px_rgba(15,23,42,0.07)] transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950"
                >
                  Try AI demo
                  <ChevronRight className="h-4 w-4" />
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.24 }}
                className="mt-10 grid gap-4 sm:grid-cols-3"
              >
                {heroMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-[24px] border border-white/70 bg-white/80 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1"
                  >
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{metric.label}</p>
                    <p className="mt-3 text-2xl font-semibold text-slate-950">{metric.value}</p>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8 flex flex-wrap gap-3 text-sm text-slate-600"
              >
                {heroTags.map((item) => (
                  <div
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 shadow-[0_10px_25px_rgba(15,23,42,0.04)]"
                  >
                    <CheckCircle2 className="h-4 w-4 text-sky-600" />
                    {item}
                  </div>
                ))}
              </motion.div>
            </div>

            <HeroDashboardPreview />
          </section>

          <section id="features" className="scroll-mt-28 px-4 py-24 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Features"
              title="Everything a modern HR and payroll team needs, without the dashboard clutter."
              description="The product experience is designed to stay clear and fast as your team grows, with thoughtful surfaces for HR, finance, and managers."
            />

            <div className="mx-auto mt-14 grid max-w-7xl gap-6 lg:grid-cols-3">
              {featureCardsData.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <motion.div
                    key={feature.title}
                    {...revealProps}
                    transition={{ ...revealProps.transition, delay: index * 0.06 }}
                    whileHover={{ y: -6 }}
                    className={cn(
                      "group relative overflow-hidden rounded-[30px] border border-slate-200/80 bg-white/90 p-7 shadow-[0_22px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl",
                      index === 4 && "lg:col-span-2",
                    )}
                  >
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(135deg,rgba(37,99,235,0.12),rgba(124,58,237,0.06),transparent)] opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#eff6ff,#ede9fe)] text-sky-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                        <Icon className="h-6 w-6" />
                      </div>
                      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                        {feature.eyebrow}
                      </p>
                      <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
                        {feature.title}
                      </h3>
                      <p className="mt-4 max-w-xl text-base leading-8 text-slate-600">
                        {feature.description}
                      </p>
                      <Link
                        to="/features"
                        className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-900"
                      >
                        Explore capability
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          <section
            id="how-it-works"
            className="scroll-mt-28 bg-[linear-gradient(180deg,rgba(244,247,255,0.95),rgba(255,255,255,0.95))] px-4 py-24 sm:px-6 lg:px-8"
          >
            <SectionHeading
              eyebrow="How it works"
              title="Set up quickly, automate the repetitive work, and keep every stakeholder aligned."
              description="The product is built to feel straightforward from day one, with clear steps from implementation to live payroll operations."
            />

            <div className="mx-auto mt-14 grid max-w-7xl gap-6 lg:grid-cols-3">
              {workflowStepsData.map((step, index) => {
                const Icon = step.icon;

                return (
                  <motion.div
                    key={step.title}
                    {...revealProps}
                    transition={{ ...revealProps.transition, delay: index * 0.08 }}
                    whileHover={{ y: -6 }}
                    className="relative rounded-[30px] border border-slate-200/80 bg-white/90 p-7 shadow-[0_18px_60px_rgba(15,23,42,0.06)]"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4F46E5,#9333EA)] text-white shadow-[0_16px_36px_rgba(79,70,229,0.24)]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="mt-8 inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-slate-100 px-3 text-sm font-semibold text-slate-700">
                      0{index + 1}
                    </div>
                    <h3 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">
                      {step.title}
                    </h3>
                    <p className="mt-4 text-base leading-8 text-slate-600">{step.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </section>

          <section id="dashboard" className="scroll-mt-28 px-4 py-24 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
              <div>
                <SectionHeading
                  align="left"
                  eyebrow="Dashboard preview"
                  title="A premium analytics layer for payroll health, salary visibility, and people operations."
                  description="Use one dashboard to review payroll completion, attendance compliance, salary breakdowns, and AI-generated summaries before each cycle closes."
                />

                <div className="mt-10 space-y-4">
                  {dashboardHighlights.map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <motion.div
                        key={item.title}
                        {...revealProps}
                        transition={{ ...revealProps.transition, delay: index * 0.08 }}
                        className="flex gap-4 rounded-[24px] border border-slate-200/80 bg-white/85 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#eff6ff,#ede9fe)] text-sky-700">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                          <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <motion.div
                  {...revealProps}
                  transition={{ ...revealProps.transition, delay: 0.24 }}
                  className="mt-10 flex flex-col gap-3 sm:flex-row"
                >
                  <button
                    type="button"
                    onClick={openAssistantDemo}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#4F46E5,#9333EA)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(79,70,229,0.24)] transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Explore live workspace
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <Link
                    to="/pricing"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-[0_14px_32px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-0.5"
                  >
                    View pricing
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </div>

              <OperationsDashboardPreview />
            </div>
          </section>

          <section
            id="pricing"
            className="scroll-mt-28 bg-[linear-gradient(180deg,rgba(247,249,255,0.96),rgba(255,255,255,0.96))] px-4 py-24 sm:px-6 lg:px-8"
          >
            <SectionHeading
              eyebrow="Pricing"
              title="Start free, upgrade when your workflow volume grows."
              description="The onboarding path is intentionally simple: launch on Free, validate the team experience, then move to Pro when you need unlimited usage and richer automation."
            />

            <motion.div
              {...revealProps}
              className="mx-auto mt-10 flex max-w-5xl flex-col gap-4 rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-6"
            >
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  Free includes {NEXA_MAX_FREE_LIMIT} assisted workflows per day.
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Usage today: {messageCount} of {NEXA_MAX_FREE_LIMIT} workflow runs used.
                </p>
              </div>
              <div className="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700">
                {plan === "free"
                  ? `${remainingFreeMessages} free runs remaining`
                  : `${plan.toUpperCase()} unlocked`}
              </div>
            </motion.div>

            <div className="mx-auto mt-14 grid max-w-7xl gap-6 lg:grid-cols-3">
              {pricingPlansData.map((pricingPlan, index) => {
                const isCurrentPlan =
                  pricingPlan.id !== "enterprise" && pricingPlan.id === plan;
                const isFeatured = pricingPlan.id === "pro";

                return (
                  <motion.div
                    key={pricingPlan.id}
                    {...revealProps}
                    transition={{ ...revealProps.transition, delay: index * 0.08 }}
                    whileHover={{ y: -8 }}
                    className={cn(
                      "relative overflow-hidden rounded-[32px] border p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]",
                      isFeatured
                        ? "border-sky-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(239,246,255,0.95))]"
                        : "border-slate-200/80 bg-white/92",
                    )}
                  >
                    {isFeatured && (
                      <div className="absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,#4F46E5,#9333EA)]" />
                    )}

                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                          {pricingPlan.badge}
                        </p>
                        <h3 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                          {pricingPlan.title}
                        </h3>
                      </div>
                      {isCurrentPlan && (
                        <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          Current plan
                        </div>
                      )}
                    </div>

                    <div className="mt-8 flex items-end gap-2">
                      <span className="text-4xl font-semibold tracking-tight text-slate-950">
                        {pricingPlan.price}
                      </span>
                      {pricingPlan.suffix && (
                        <span className="pb-1 text-sm text-slate-500">{pricingPlan.suffix}</span>
                      )}
                    </div>

                    <p className="mt-5 text-sm leading-7 text-slate-600">{pricingPlan.description}</p>

                    <button
                      type="button"
                      onClick={() => handlePlanSelect(pricingPlan.id)}
                      className={cn(
                        "mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold transition-all duration-300",
                        isFeatured
                          ? "bg-[linear-gradient(135deg,#4F46E5,#9333EA)] text-white shadow-[0_18px_40px_rgba(79,70,229,0.26)] hover:-translate-y-0.5"
                          : "border border-slate-200 bg-white text-slate-800 shadow-[0_14px_32px_rgba(15,23,42,0.06)] hover:-translate-y-0.5",
                      )}
                    >
                      {pricingPlan.id === "enterprise"
                        ? "Talk to sales"
                        : pricingPlan.id === "pro"
                          ? isCurrentPlan
                            ? "Open workspace"
                            : "Upgrade to Pro"
                          : "Start free"}
                      <ArrowRight className="h-4 w-4" />
                    </button>

                    <div className="mt-8 space-y-4">
                      {pricingPlan.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-sky-50 text-sky-700">
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                          <span className="text-sm leading-7 text-slate-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          <section id="testimonials" className="scroll-mt-28 px-4 py-24 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Testimonials"
              title="Teams choose Nexa HR because it feels modern, clear, and dependable under real operational pressure."
              description="The product is built for the everyday moments that matter most: payroll deadlines, approvals, employee questions, and leadership reporting."
            />

            <div className="mx-auto mt-14 grid max-w-7xl gap-6 lg:grid-cols-3">
              {testimonialsData.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  {...revealProps}
                  transition={{ ...revealProps.transition, delay: index * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="rounded-[30px] border border-slate-200/80 bg-white/92 p-7 shadow-[0_20px_70px_rgba(15,23,42,0.07)]"
                >
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                    <Sparkles className="h-3.5 w-3.5 text-sky-600" />
                    Verified customer
                  </div>
                  <p className="mt-6 text-lg leading-8 text-slate-700">"{testimonial.quote}"</p>
                  <div className="mt-8 border-t border-slate-200 pt-5">
                    <p className="text-base font-semibold text-slate-950">{testimonial.name}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pb-24">
            <motion.div
              {...revealProps}
              className="mx-auto max-w-7xl overflow-hidden rounded-[36px] border border-slate-200/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(37,99,235,0.92),rgba(124,58,237,0.88))] p-8 text-white shadow-[0_30px_100px_rgba(37,99,235,0.24)] sm:p-10 lg:p-12"
            >
              <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="max-w-3xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.26em] text-sky-100">
                    Final CTA
                  </p>
                  <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                    Launch a modern HR and payroll experience your team will actually enjoy using.
                  </h2>
                  <p className="mt-5 text-base leading-8 text-sky-50/85 sm:text-lg">
                    Start with the free workspace, validate the workflow, and upgrade when your team needs more automation, more reporting depth, and unlimited AI guidance.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_18px_40px_rgba(15,23,42,0.18)] transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="mailto:sales@nexahr.ai?subject=Nexa%20HR%20Demo%20Request"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white/15"
                  >
                    Book a demo
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </section>
        </main>

        <footer className="border-t border-slate-200/80 bg-white/90 px-4 py-10 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4F46E5,#9333EA)] text-white shadow-[0_16px_40px_rgba(79,70,229,0.22)]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-950">
                  Nexa HR
                </p>
                <p className="text-sm text-slate-500">
                  Modern HR and payroll management for growing teams.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-600">
              {marketingNavLinks.map((link) => (
                <Link key={link.href} to={link.href} className="transition-colors hover:text-slate-950">
                  {link.label}
                </Link>
              ))}
              <Link to="/login" className="transition-colors hover:text-slate-950">
                Log in
              </Link>
              <Link to="/signup" className="transition-colors hover:text-slate-950">
                Get Started
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
