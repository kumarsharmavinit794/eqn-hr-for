import {
  BarChart3,
  Bot,
  Building2,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  ShieldCheck,
  Sparkles,
  Users2,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { NEXA_MAX_FREE_LIMIT, type NexaPlanId } from "@/lib/nexaHr";
import { ensureArray, toSafeString } from "@/utils/dataSanitizer";

export type MarketingNavLink = {
  href: string;
  label: string;
};

export type MarketingFeatureCard = {
  description: string;
  eyebrow: string;
  icon: LucideIcon;
  title: string;
};

export type MarketingWorkflowStep = {
  description: string;
  icon: LucideIcon;
  title: string;
};

export type MarketingPricingPlan = {
  badge: string;
  description: string;
  features: string[];
  id: NexaPlanId;
  price: string;
  suffix: string;
  title: string;
};

export type MarketingTestimonial = {
  company: string;
  name: string;
  quote: string;
  role: string;
};

export type MarketingHeroMetric = {
  label: string;
  value: string;
};

export type MarketingDashboardHighlight = {
  description: string;
  icon: LucideIcon;
  title: string;
};

export type MarketingContent = {
  dashboardHighlights: MarketingDashboardHighlight[];
  featureCards: MarketingFeatureCard[];
  heroMetrics: MarketingHeroMetric[];
  heroTags: string[];
  navLinks: MarketingNavLink[];
  pricingPlans: MarketingPricingPlan[];
  testimonials: MarketingTestimonial[];
  workflowSteps: MarketingWorkflowStep[];
};

const fallbackDashboardHighlights: MarketingDashboardHighlight[] = [
  {
    icon: FileText,
    title: "Review salary and reimbursement detail",
    description:
      "Compare payout totals, deductions, and approvals without bouncing between pages.",
  },
  {
    icon: BarChart3,
    title: "Track workforce signals in real time",
    description:
      "Watch attendance trends, payroll variance, and open blockers before they become month-end surprises.",
  },
  {
    icon: Bot,
    title: "Summarize decisions with AI",
    description:
      "Turn operational data into plain-language guidance that managers and finance teams can act on immediately.",
  },
];

const fallbackFeatureCards: MarketingFeatureCard[] = [
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

const fallbackHeroMetrics: MarketingHeroMetric[] = [
  { label: "Payroll accuracy", value: "99.2%" },
  { label: "Team setup", value: "Under 24h" },
  { label: "Live AI guidance", value: `${NEXA_MAX_FREE_LIMIT} free runs/day` },
];

const fallbackHeroTags = [
  "Employee records",
  "Payroll automation",
  "Attendance insights",
  "AI assistant",
];

const fallbackNavLinks: MarketingNavLink[] = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
];

const fallbackPricingPlans: MarketingPricingPlan[] = [
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

const fallbackTestimonials: MarketingTestimonial[] = [
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

const fallbackWorkflowSteps: MarketingWorkflowStep[] = [
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

export const fallbackMarketingContent: MarketingContent = {
  dashboardHighlights: fallbackDashboardHighlights,
  featureCards: fallbackFeatureCards,
  heroMetrics: fallbackHeroMetrics,
  heroTags: fallbackHeroTags,
  navLinks: fallbackNavLinks,
  pricingPlans: fallbackPricingPlans,
  testimonials: fallbackTestimonials,
  workflowSteps: fallbackWorkflowSteps,
};

const sanitizeFeatures = (value: unknown, fallback: string[]) => {
  const features = ensureArray<string>(value)
    .map((feature, index) => toSafeString(feature, fallback[index] ?? `Feature ${index + 1}`))
    .filter(Boolean);

  return features.length > 0 ? features : fallback;
};

const sanitizeNavLinks = (value: unknown) => {
  const links = ensureArray<Partial<MarketingNavLink>>(value)
    .map((item, index) => ({
      href: toSafeString(item?.href, fallbackNavLinks[index]?.href ?? "/"),
      label: toSafeString(item?.label, fallbackNavLinks[index]?.label ?? `Page ${index + 1}`),
    }))
    .filter((item) => item.href && item.label);

  return links.length > 0 ? links : fallbackNavLinks;
};

export const sanitizeMarketingContent = (
  value: Partial<MarketingContent> | null | undefined,
): MarketingContent => {
  const content = value ?? {};

  return {
    dashboardHighlights: ensureArray<Partial<MarketingDashboardHighlight>>(content.dashboardHighlights)
      .map((item, index) => ({
        icon: item?.icon ?? fallbackDashboardHighlights[index]?.icon ?? Sparkles,
        title: toSafeString(
          item?.title,
          fallbackDashboardHighlights[index]?.title ?? `Highlight ${index + 1}`,
        ),
        description: toSafeString(
          item?.description,
          fallbackDashboardHighlights[index]?.description ?? "Insight details coming soon.",
        ),
      }))
      .filter((item) => item.title && item.description) || fallbackDashboardHighlights,
    featureCards: ensureArray<Partial<MarketingFeatureCard>>(content.featureCards)
      .map((item, index) => ({
        icon: item?.icon ?? fallbackFeatureCards[index]?.icon ?? Sparkles,
        title: toSafeString(
          item?.title,
          fallbackFeatureCards[index]?.title ?? `Feature ${index + 1}`,
        ),
        eyebrow: toSafeString(
          item?.eyebrow,
          fallbackFeatureCards[index]?.eyebrow ?? "Product highlight",
        ),
        description: toSafeString(
          item?.description,
          fallbackFeatureCards[index]?.description ?? "Feature details coming soon.",
        ),
      }))
      .filter((item) => item.title && item.description)
      .slice(0, fallbackFeatureCards.length) || fallbackFeatureCards,
    heroMetrics: ensureArray<Partial<MarketingHeroMetric>>(content.heroMetrics)
      .map((item, index) => ({
        label: toSafeString(item?.label, fallbackHeroMetrics[index]?.label ?? `Metric ${index + 1}`),
        value: toSafeString(item?.value, fallbackHeroMetrics[index]?.value ?? "N/A"),
      }))
      .filter((item) => item.label && item.value) || fallbackHeroMetrics,
    heroTags: sanitizeFeatures(content.heroTags, fallbackHeroTags),
    navLinks: sanitizeNavLinks(content.navLinks),
    pricingPlans: ensureArray<Partial<MarketingPricingPlan>>(content.pricingPlans)
      .map((item, index) => ({
        id: item?.id ?? fallbackPricingPlans[index]?.id ?? "free",
        title: toSafeString(item?.title, fallbackPricingPlans[index]?.title ?? "Plan"),
        price: toSafeString(item?.price, fallbackPricingPlans[index]?.price ?? "Custom"),
        suffix: toSafeString(item?.suffix, fallbackPricingPlans[index]?.suffix ?? ""),
        badge: toSafeString(item?.badge, fallbackPricingPlans[index]?.badge ?? "Popular"),
        description: toSafeString(
          item?.description,
          fallbackPricingPlans[index]?.description ?? "Plan details coming soon.",
        ),
        features: sanitizeFeatures(item?.features, fallbackPricingPlans[index]?.features ?? ["Feature details coming soon."]),
      }))
      .filter((item) => item.title && item.description) || fallbackPricingPlans,
    testimonials: ensureArray<Partial<MarketingTestimonial>>(content.testimonials)
      .map((item, index) => ({
        name: toSafeString(item?.name, fallbackTestimonials[index]?.name ?? `Customer ${index + 1}`),
        role: toSafeString(item?.role, fallbackTestimonials[index]?.role ?? "Team lead"),
        company: toSafeString(item?.company, fallbackTestimonials[index]?.company ?? "Nexa customer"),
        quote: toSafeString(
          item?.quote,
          fallbackTestimonials[index]?.quote ?? "Nexa HR helped our team move faster.",
        ),
      }))
      .filter((item) => item.name && item.quote) || fallbackTestimonials,
    workflowSteps: ensureArray<Partial<MarketingWorkflowStep>>(content.workflowSteps)
      .map((item, index) => ({
        icon: item?.icon ?? fallbackWorkflowSteps[index]?.icon ?? Sparkles,
        title: toSafeString(item?.title, fallbackWorkflowSteps[index]?.title ?? `Step ${index + 1}`),
        description: toSafeString(
          item?.description,
          fallbackWorkflowSteps[index]?.description ?? "Workflow details coming soon.",
        ),
      }))
      .filter((item) => item.title && item.description) || fallbackWorkflowSteps,
  };
};

export async function loadMarketingContent() {
  await Promise.resolve();
  return sanitizeMarketingContent(fallbackMarketingContent);
}
