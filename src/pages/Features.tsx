import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ChevronRight, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { MarketingFooter } from "@/components/MarketingFooter";
import { Navbar } from "@/components/Navbar";
import { useMarketingContent } from "@/hooks/useMarketingContent";
import { cn } from "@/lib/utils";

const revealProps = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
} as const;

function SectionHeading({
  description,
  eyebrow,
  title,
}: {
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <motion.div {...revealProps} className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.26em] text-indigo-600 dark:text-indigo-300">
        {eyebrow}
      </p>
      <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-[#111827] sm:text-5xl dark:text-white">
        {title}
      </h1>
      <p className="mt-5 text-base leading-8 text-[#6B7280] sm:text-lg dark:text-slate-300">
        {description}
      </p>
    </motion.div>
  );
}

function FeaturesSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0F172A]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl animate-pulse space-y-4">
          <div className="mx-auto h-4 w-32 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="h-14 rounded-2xl bg-slate-200 dark:bg-slate-700" />
          <div className="h-6 rounded-2xl bg-slate-100 dark:bg-slate-800" />
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-64 animate-pulse rounded-[30px] border border-slate-200/80 bg-white/90 dark:border-slate-700/70 dark:bg-[#1E293B]"
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default function Features() {
  const navigate = useNavigate();
  const { data, error, loading } = useMarketingContent();

  if (loading) {
    return <FeaturesSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white text-[#111827] dark:bg-[#0F172A] dark:text-white">
      <Navbar />

      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.14),transparent_32%),radial-gradient(circle_at_top_right,rgba(147,51,234,0.12),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f8faff_56%,#ffffff_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.2),transparent_30%),radial-gradient(circle_at_top_right,rgba(147,51,234,0.18),transparent_30%),linear-gradient(180deg,#0F172A_0%,#111b32_100%)]" />

        <section className="relative mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 lg:px-8 lg:pb-20">
          {error ? (
            <div className="mx-auto mb-8 max-w-4xl rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-200">
              {error}
            </div>
          ) : null}

          <SectionHeading
            eyebrow="Product capabilities"
            title="Everything your HR, payroll, and operations teams need in one reliable workspace."
            description="Each surface is built to stay readable, connected, and action-oriented so your team can move from review to resolution without hunting for context."
          />

          <motion.div
            {...revealProps}
            className="mx-auto mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#4F46E5,#9333EA)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(79,70,229,0.28)] transition-all duration-300 hover:-translate-y-0.5"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => navigate("/pricing")}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-[#111827] shadow-[0_14px_32px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-0.5 dark:border-slate-700 dark:bg-[#1E293B] dark:text-white"
            >
              View pricing
              <ChevronRight className="h-4 w-4" />
            </button>
          </motion.div>
        </section>

        <section className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {data.featureCards.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  {...revealProps}
                  transition={{ ...revealProps.transition, delay: index * 0.05 }}
                  whileHover={{ y: -6 }}
                  className={cn(
                    "group rounded-[30px] border border-slate-200/80 bg-white/92 p-7 shadow-[0_22px_80px_rgba(15,23,42,0.08)] dark:border-slate-700/80 dark:bg-[#1E293B]",
                    index === data.featureCards.length - 1 && "lg:col-span-2",
                  )}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#EEF2FF,#F3E8FF)] text-indigo-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] dark:bg-[linear-gradient(135deg,rgba(79,70,229,0.24),rgba(147,51,234,0.24))] dark:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600 dark:text-indigo-300">
                    {feature.eyebrow}
                  </p>
                  <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[#111827] dark:text-white">
                    {feature.title}
                  </h2>
                  <p className="mt-4 text-base leading-8 text-[#6B7280] dark:text-slate-300">
                    {feature.description}
                  </p>
                  <Link
                    to="/signup"
                    className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#111827] transition-colors hover:text-indigo-600 dark:text-white dark:hover:text-indigo-300"
                  >
                    Use this workflow
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {data.workflowSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.title}
                  {...revealProps}
                  transition={{ ...revealProps.transition, delay: index * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="rounded-[30px] border border-slate-200/80 bg-white/92 p-7 shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-slate-700/80 dark:bg-[#1E293B]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4F46E5,#9333EA)] text-white shadow-[0_16px_36px_rgba(79,70,229,0.26)]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="mt-8 inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-slate-100 px-3 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    0{index + 1}
                  </div>
                  <h2 className="mt-5 text-2xl font-semibold tracking-tight text-[#111827] dark:text-white">
                    {step.title}
                  </h2>
                  <p className="mt-4 text-base leading-8 text-[#6B7280] dark:text-slate-300">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {data.dashboardHighlights.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  {...revealProps}
                  transition={{ ...revealProps.transition, delay: index * 0.08 }}
                  className="rounded-[28px] border border-slate-200/80 bg-white/92 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] dark:border-slate-700/80 dark:bg-[#1E293B]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#EEF2FF,#F3E8FF)] text-indigo-600 dark:bg-[linear-gradient(135deg,rgba(79,70,229,0.24),rgba(147,51,234,0.24))] dark:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-5 text-lg font-semibold text-[#111827] dark:text-white">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[#6B7280] dark:text-slate-300">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            {...revealProps}
            className="mt-10 rounded-[36px] border border-slate-200/80 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(79,70,229,0.92),rgba(147,51,234,0.88))] p-8 text-white shadow-[0_30px_100px_rgba(79,70,229,0.24)] sm:p-10"
          >
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.26em] text-indigo-100">
                  Ready to launch
                </p>
                <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                  Move from scattered HR tools to one clear operating system.
                </h2>
                <p className="mt-5 text-base leading-8 text-slate-100/90 sm:text-lg">
                  Start with a guided signup flow, invite your team, and keep payroll, attendance, and approvals aligned from day one.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#111827] shadow-[0_18px_40px_rgba(15,23,42,0.18)] transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white/15"
                >
                  Compare plans
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {data.heroMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4"
                >
                  <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-indigo-100">
                    <CheckCircle2 className="h-4 w-4" />
                    {metric.label}
                  </div>
                  <p className="mt-3 text-2xl font-semibold text-white">{metric.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {data.heroTags.map((tag) => (
                <div
                  key={tag}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90"
                >
                  <Sparkles className="h-4 w-4 text-indigo-100" />
                  {tag}
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
