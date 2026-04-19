import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Brain,
  Briefcase,
  DollarSign,
  Gauge,
  Heart,
  Info,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Funnel,
  FunnelChart,
  LabelList,
  Line,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type InsightTone = "opportunity" | "warning" | "action";

interface InsightCard {
  title: string;
  detail: string;
  metric: string;
  confidence: number;
  tone: InsightTone;
  icon: LucideIcon;
}

interface Recommendation {
  title: string;
  description: string;
}

interface SummaryMetric {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
}

interface CriticalTalentRole {
  role: string;
  readyNow: number;
  readyIn90Days: number;
  benchStrength: number;
  vacancyRisk: "High" | "Medium";
}

interface MobilityTrendPoint {
  quarter: string;
  internalMoves: number;
  promotions: number;
  internalFillRate: number;
}

interface RetentionWatchItem {
  segment: string;
  probability: number;
  earlyWarning: string;
  window: string;
}

interface FunnelStage {
  stage: string;
  value: number;
  fill: string;
}

interface SkillHeatmapRow {
  capability: string;
  engineering: number;
  product: number;
  sales: number;
  operations: number;
  gap: string;
}

interface WellbeingPoint {
  month: string;
  wellbeing: number;
  burnout: number;
}

interface CompensationPoint {
  family: string;
  internal: number;
  market: number;
}

interface ManagerEffectivenessPoint {
  subject: string;
  score: number;
}

interface ComplianceRisk {
  area: string;
  riskScore: number;
  incidents: number;
  action: string;
}

interface TooltipEntry {
  color?: string;
  fill?: string;
  name?: string;
  dataKey?: string;
  value?: number | string;
}

interface ExecutiveTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

const hubItemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 16 },
  },
};

const glassPanelClass =
  "relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-[0_20px_70px_-25px_rgba(0,0,0,0.55)]";

const aiExecutiveInsights: InsightCard[] = [
  {
    title: "6 ready-now leaders can close 3 critical succession gaps",
    detail: "Engineering, Finance, and People Ops can be backfilled internally in under 90 days.",
    metric: "₹1.84 Cr external hiring cost avoided",
    confidence: 93,
    tone: "opportunity",
    icon: Award,
  },
  {
    title: "Retention risk cluster detected in Platform and Customer Success",
    detail: "Workload surge, pay compression, and manager span are driving elevated flight probability.",
    metric: "18% exit probability across 42 high-value roles",
    confidence: 91,
    tone: "warning",
    icon: Bell,
  },
  {
    title: "AI recommends mobility-led hiring for product and revenue roles",
    detail: "Internal candidates are converting 1.8x faster than external offers for adjacent skills.",
    metric: "61% projected internal fill rate next quarter",
    confidence: 88,
    tone: "action",
    icon: TrendingUp,
  },
];

const executiveRecommendations: Recommendation[] = [
  {
    title: "Accelerate succession slates",
    description: "Move 2 ready-now successors into shadow assignments before Q3 planning closes.",
  },
  {
    title: "Trigger retention sprints",
    description: "Target manager coaching and pay corrections for the top 3 burnout hotspots this month.",
  },
  {
    title: "Prioritize internal hiring",
    description: "Route product, analytics, and RevOps openings to the mobility pool before new requisitions.",
  },
];

const summaryMetrics: SummaryMetric[] = [
  {
    label: "Critical Roles Covered",
    value: "86%",
    change: "+9 pts vs last quarter",
    icon: Users,
  },
  {
    label: "Promotion-Ready Talent",
    value: "24",
    change: "13 ready in < 90 days",
    icon: UserPlus,
  },
  {
    label: "AI Retention Alerts",
    value: "3",
    change: "2 require action this week",
    icon: TrendingDown,
  },
  {
    label: "Value Recoverable",
    value: "₹2.52 Cr",
    change: "250% projected ROI",
    icon: DollarSign,
  },
];

const criticalTalentPool: CriticalTalentRole[] = [
  {
    role: "VP Engineering",
    readyNow: 2,
    readyIn90Days: 1,
    benchStrength: 88,
    vacancyRisk: "High",
  },
  {
    role: "Finance Controller",
    readyNow: 1,
    readyIn90Days: 2,
    benchStrength: 76,
    vacancyRisk: "High",
  },
  {
    role: "Plant HR Lead",
    readyNow: 1,
    readyIn90Days: 2,
    benchStrength: 81,
    vacancyRisk: "Medium",
  },
  {
    role: "Customer Success Head",
    readyNow: 2,
    readyIn90Days: 1,
    benchStrength: 84,
    vacancyRisk: "Medium",
  },
];

const internalMobilityTrend: MobilityTrendPoint[] = [
  { quarter: "Q1", internalMoves: 14, promotions: 6, internalFillRate: 42 },
  { quarter: "Q2", internalMoves: 18, promotions: 9, internalFillRate: 48 },
  { quarter: "Q3", internalMoves: 22, promotions: 11, internalFillRate: 56 },
  { quarter: "Q4", internalMoves: 27, promotions: 14, internalFillRate: 61 },
];

const retentionWatchlist: RetentionWatchItem[] = [
  {
    segment: "Platform Engineering",
    probability: 72,
    earlyWarning: "Workload spike + recognition dip",
    window: "30-45 days",
  },
  {
    segment: "Customer Success Managers",
    probability: 64,
    earlyWarning: "Pay compression vs market",
    window: "45-60 days",
  },
  {
    segment: "Analytics Leads",
    probability: 58,
    earlyWarning: "Manager quality variance",
    window: "60 days",
  },
];

const talentFunnel: FunnelStage[] = [
  { stage: "Applied", value: 312, fill: "#1d4ed8" },
  { stage: "Screened", value: 168, fill: "#0ea5e9" },
  { stage: "Interview", value: 79, fill: "#14b8a6" },
  { stage: "Offer", value: 29, fill: "#22c55e" },
  { stage: "Hired", value: 18, fill: "#86efac" },
];

const skillsHeatmap: SkillHeatmapRow[] = [
  {
    capability: "AI / Automation",
    engineering: 91,
    product: 78,
    sales: 39,
    operations: 52,
    gap: "Sales enablement gap",
  },
  {
    capability: "Leadership Readiness",
    engineering: 76,
    product: 82,
    sales: 71,
    operations: 64,
    gap: "Ops succession bench",
  },
  {
    capability: "Data Literacy",
    engineering: 88,
    product: 84,
    sales: 58,
    operations: 49,
    gap: "Ops upskilling needed",
  },
  {
    capability: "Consultative Selling",
    engineering: 44,
    product: 57,
    sales: 93,
    operations: 48,
    gap: "Cross-functional mobility path",
  },
];

const wellbeingTrend: WellbeingPoint[] = [
  { month: "Jan", wellbeing: 78, burnout: 21 },
  { month: "Feb", wellbeing: 80, burnout: 19 },
  { month: "Mar", wellbeing: 77, burnout: 24 },
  { month: "Apr", wellbeing: 75, burnout: 27 },
  { month: "May", wellbeing: 74, burnout: 29 },
  { month: "Jun", wellbeing: 76, burnout: 25 },
];

const compensationBenchmark: CompensationPoint[] = [
  { family: "Engineering", internal: 102, market: 100 },
  { family: "Product", internal: 97, market: 100 },
  { family: "Sales", internal: 94, market: 100 },
  { family: "Operations", internal: 92, market: 100 },
];

const managerEffectiveness: ManagerEffectivenessPoint[] = [
  { subject: "Coaching", score: 84 },
  { subject: "Clarity", score: 88 },
  { subject: "Inclusion", score: 79 },
  { subject: "Feedback", score: 81 },
  { subject: "Velocity", score: 76 },
  { subject: "Retention", score: 85 },
];

const complianceScorecard: ComplianceRisk[] = [
  { area: "POSH & Ethics", riskScore: 12, incidents: 0, action: "Maintain audit cadence" },
  { area: "Labor Law Filing", riskScore: 18, incidents: 1, action: "Close state renewal by Friday" },
  { area: "Contractor Classification", riskScore: 27, incidents: 2, action: "Review 11 contractor roles" },
  { area: "Documentation Gaps", riskScore: 9, incidents: 0, action: "Healthy controls in place" },
];

const retentionGaugeData = [{ name: "Retention Risk", value: 18, fill: "#f97316" }];

const attritionModel = {
  atRiskExits: 18,
  averageCtcLakh: 29,
  replacementMultiplier: 1.45,
  preventedExits: 6,
  interventionCostCr: 0.72,
};

const toneStyles: Record<
  InsightTone,
  { badge: string; border: string; bg: string; text: string }
> = {
  opportunity: {
    badge: "Opportunity",
    border: "border-emerald-400/30",
    bg: "bg-emerald-500/10",
    text: "text-emerald-300",
  },
  warning: {
    badge: "Risk",
    border: "border-amber-400/30",
    bg: "bg-amber-500/10",
    text: "text-amber-300",
  },
  action: {
    badge: "Action",
    border: "border-blue-400/30",
    bg: "bg-blue-500/10",
    text: "text-blue-300",
  },
};

function ExecutiveTooltip({ active, payload, label }: ExecutiveTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="min-w-[180px] rounded-3xl border border-white/15 bg-zinc-950/95 p-4 text-sm text-white shadow-2xl backdrop-blur-2xl">
      {label ? <p className="mb-3 font-medium text-emerald-300">{label}</p> : null}
      <div className="space-y-2">
        {payload.map((entry, index) => (
          <div key={`${entry.dataKey ?? entry.name ?? "entry"}-${index}`} className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-zinc-400">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: entry.color ?? entry.fill ?? "#22c55e" }}
              />
              <span>{entry.name ?? entry.dataKey}</span>
            </div>
            <span className="font-semibold text-white">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function getHeatStyle(score: number) {
  const opacity = Math.min(0.18 + score / 130, 0.9);
  const borderOpacity = Math.min(0.12 + score / 170, 0.55);

  return {
    background: `linear-gradient(135deg, rgba(16,185,129,${opacity}), rgba(15,23,42,0.92))`,
    borderColor: `rgba(52,211,153,${borderOpacity})`,
  };
}

function getRiskTone(score: number) {
  if (score >= 25) {
    return "text-rose-300";
  }

  if (score >= 15) {
    return "text-amber-300";
  }

  return "text-emerald-300";
}

export function StrategicWorkforceIntelligenceHub() {
  const totalReadyNow = criticalTalentPool.reduce((sum, role) => sum + role.readyNow, 0);
  const totalReadyIn90Days = criticalTalentPool.reduce((sum, role) => sum + role.readyIn90Days, 0);
  const highRiskAlerts = retentionWatchlist.filter((item) => item.probability >= 60).length;
  const totalPipeline = talentFunnel[0]?.value ?? 0;
  const hires = talentFunnel[talentFunnel.length - 1]?.value ?? 0;
  const funnelConversion = totalPipeline > 0 ? Math.round((hires / totalPipeline) * 100) : 0;
  const projectedAttritionExposureCr = Number(
    ((attritionModel.atRiskExits * attritionModel.averageCtcLakh * attritionModel.replacementMultiplier) / 100).toFixed(2),
  );
  const retainedValueCr = Number(
    ((attritionModel.preventedExits * attritionModel.averageCtcLakh * attritionModel.replacementMultiplier) / 100).toFixed(2),
  );
  const roiPercent = Math.round(((retainedValueCr - attritionModel.interventionCostCr) / attritionModel.interventionCostCr) * 100);
  const netValuePreservedCr = Number((retainedValueCr - attritionModel.interventionCostCr).toFixed(2));

  return (
    <motion.section
      variants={hubItemVariants}
      className="relative overflow-hidden rounded-[32px] border border-emerald-400/15 bg-gradient-to-br from-[#07110c] via-[#0b1220] to-[#111827] p-5 pb-24 sm:p-6 sm:pb-24 lg:p-8 lg:pb-24 shadow-[0_30px_120px_-40px_rgba(16,185,129,0.35)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_38%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.16),transparent_36%)]" />

      <div className="relative z-10 space-y-6 lg:space-y-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-emerald-300">
              <Brain className="h-3.5 w-3.5 shrink-0" />
              Strategic Workforce Intelligence Hub
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              One executive command layer for talent, risk, productivity, and workforce ROI.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
              This premium module unifies succession coverage, internal mobility, attrition prediction, hiring funnel health,
              skills readiness, wellbeing, compensation positioning, manager quality, compliance exposure, and live attrition economics.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-2 self-start rounded-3xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/15"
          >
            <BarChart3 className="h-4 w-4 shrink-0 text-emerald-300" />
            Export Executive Report
            <ArrowRight className="h-4 w-4 shrink-0 text-zinc-300" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <motion.div variants={hubItemVariants} className={`xl:col-span-8 ${glassPanelClass} p-5 sm:p-6`}>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-300">AI-powered executive insights</p>
                <p className="mt-1 text-sm text-zinc-400">Live signals ranked by impact on continuity, retention, and productivity.</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                <Zap className="h-3.5 w-3.5 shrink-0" />
                Updated from live HR telemetry
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {aiExecutiveInsights.map((insight) => {
                const styles = toneStyles[insight.tone];

                return (
                  <motion.div
                    key={insight.title}
                    variants={hubItemVariants}
                    whileHover={{ y: -4 }}
                    className={`rounded-3xl border ${styles.border} ${styles.bg} p-5 transition-transform`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                        <insight.icon className={`h-5 w-5 ${styles.text}`} />
                      </div>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-medium ${styles.bg} ${styles.text}`}>
                        {styles.badge}
                      </span>
                    </div>
                    <p className="mt-4 text-base font-medium leading-6 text-white">{insight.title}</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">{insight.detail}</p>
                    <div className="mt-5 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Impact</p>
                        <p className="mt-1 text-sm font-medium text-white">{insight.metric}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Confidence</p>
                        <p className="mt-1 text-lg font-semibold text-emerald-300">{insight.confidence}%</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div variants={hubItemVariants} className={`xl:col-span-4 ${glassPanelClass} p-5 sm:p-6`}>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10">
                <Brain className="h-5 w-5 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Recommended next moves</h3>
                <p className="text-sm text-zinc-400">Where leadership can act this week.</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {executiveRecommendations.map((item, index) => (
                <motion.div
                  key={item.title}
                  variants={hubItemVariants}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold text-emerald-300">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-white">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-zinc-400">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 rounded-3xl border border-emerald-400/15 bg-emerald-500/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">AI confidence</p>
              <div className="mt-2 flex items-end justify-between gap-4">
                <div>
                  <p className="text-3xl font-semibold text-white">91%</p>
                  <p className="mt-1 text-sm text-zinc-400">Model agreement across retention, pay, and mobility signals.</p>
                </div>
                <Gauge className="h-8 w-8 shrink-0 text-emerald-300" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryMetrics.map((metric) => (
            <motion.div
              key={metric.label}
              variants={hubItemVariants}
              whileHover={{ y: -4 }}
              className={`${glassPanelClass} p-5`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-zinc-400">{metric.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{metric.value}</p>
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                  <metric.icon className="h-5 w-5 text-emerald-300" />
                </div>
              </div>
              <p className="mt-6 text-sm font-medium text-emerald-300">{metric.change}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <motion.div variants={hubItemVariants} className={`xl:col-span-7 ${glassPanelClass} p-5 sm:p-6`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <Award className="h-5 w-5 shrink-0 text-emerald-300" />
                  Succession Planning & Internal Mobility
                </h3>
                <p className="mt-1 text-sm text-zinc-400">Critical role coverage paired with promotion and mobility throughput.</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 font-medium text-emerald-300">
                  {totalReadyNow} ready-now successors
                </span>
                <span className="rounded-full bg-blue-500/10 px-3 py-1 font-medium text-blue-300">
                  {totalReadyIn90Days} ready in 90 days
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 font-medium text-zinc-300">61% internal fill rate</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-5">
              <div className="space-y-3 xl:col-span-2">
                {criticalTalentPool.map((role) => (
                  <motion.div
                    key={role.role}
                    variants={hubItemVariants}
                    whileHover={{ x: 2 }}
                    className="rounded-3xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-white">{role.role}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">Bench strength</p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                          role.vacancyRisk === "High"
                            ? "bg-amber-500/10 text-amber-300"
                            : "bg-emerald-500/10 text-emerald-300"
                        }`}
                      >
                        {role.vacancyRisk} vacancy risk
                      </span>
                    </div>
                    <div className="mt-4 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-2xl font-semibold text-white">{role.benchStrength}%</p>
                        <p className="text-xs text-zinc-400">coverage score</p>
                      </div>
                      <div className="text-right text-sm">
                        <p className="text-emerald-300">{role.readyNow} ready now</p>
                        <p className="mt-1 text-zinc-400">{role.readyIn90Days} in 90 days</p>
                      </div>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-emerald-400" style={{ width: `${role.benchStrength}%` }} />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="xl:col-span-3">
                <ResponsiveContainer width="100%" height={320}>
                  <ComposedChart data={internalMobilityTrend}>
                    <CartesianGrid stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="quarter" tickLine={false} axisLine={{ stroke: "#ffffff15" }} tick={{ fill: "#a1a1aa" }} />
                    <YAxis
                      yAxisId="left"
                      tickLine={false}
                      axisLine={{ stroke: "#ffffff15" }}
                      tick={{ fill: "#a1a1aa" }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={[0, 100]}
                      tickLine={false}
                      axisLine={{ stroke: "#ffffff15" }}
                      tick={{ fill: "#a1a1aa" }}
                      tickFormatter={(value: number) => `${value}%`}
                    />
                    <Tooltip content={<ExecutiveTooltip />} />
                    <Bar yAxisId="left" dataKey="internalMoves" name="Internal Moves" fill="#22c55e" radius={[10, 10, 0, 0]} />
                    <Bar yAxisId="left" dataKey="promotions" name="Promotions" fill="#60a5fa" radius={[10, 10, 0, 0]} />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="internalFillRate"
                      name="Internal Fill Rate"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#f59e0b" }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          <motion.div variants={hubItemVariants} className={`xl:col-span-5 ${glassPanelClass} p-5 sm:p-6`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <Bell className="h-5 w-5 shrink-0 text-emerald-300" />
                  Retention Risk & Compliance Scorecard
                </h3>
                <p className="mt-1 text-sm text-zinc-400">Early warning signal plus legal and governance exposure.</p>
              </div>
              <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
                {highRiskAlerts} elevated alerts
              </span>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                <div className="relative mx-auto h-[220px] max-w-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      data={retentionGaugeData}
                      innerRadius="72%"
                      outerRadius="100%"
                      startAngle={210}
                      endAngle={-30}
                      barSize={18}
                    >
                      <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                      <RadialBar dataKey="value" background={{ fill: "#ffffff14" }} cornerRadius={999} clockWise />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Exit probability</p>
                    <p className="mt-2 text-5xl font-semibold text-white">18%</p>
                    <p className="mt-2 text-sm text-amber-300">AI early warning active</p>
                  </div>
                </div>

                <div className="mt-2 rounded-3xl bg-amber-500/10 p-3 text-sm text-zinc-300">
                  Burnout + pay compression are the strongest flight drivers in the current alert cluster.
                </div>
              </div>

              <div className="space-y-3">
                {retentionWatchlist.map((item) => (
                  <motion.div
                    key={item.segment}
                    variants={hubItemVariants}
                    className="rounded-3xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-white">{item.segment}</p>
                        <p className="mt-1 text-sm text-zinc-400">{item.earlyWarning}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-semibold text-amber-300">{item.probability}%</p>
                        <p className="text-xs text-zinc-500">{item.window}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              {complianceScorecard.map((item) => (
                <motion.div
                  key={item.area}
                  variants={hubItemVariants}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 shrink-0 text-zinc-400" />
                        <p className="font-medium text-white">{item.area}</p>
                      </div>
                      <p className="mt-1 text-sm text-zinc-400">{item.action}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`text-xl font-semibold ${getRiskTone(item.riskScore)}`}>{item.riskScore}/100</p>
                        <p className="text-xs text-zinc-500">{item.incidents} recent incidents</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full ${
                        item.riskScore >= 25
                          ? "bg-rose-400"
                          : item.riskScore >= 15
                            ? "bg-amber-400"
                            : "bg-emerald-400"
                      }`}
                      style={{ width: `${item.riskScore}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <motion.div variants={hubItemVariants} className={`xl:col-span-4 ${glassPanelClass} p-5 sm:p-6`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <Briefcase className="h-5 w-5 shrink-0 text-emerald-300" />
                  Talent Acquisition Funnel
                </h3>
                <p className="mt-1 text-sm text-zinc-400">Visual funnel health across active executive and specialist hiring.</p>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                {funnelConversion}% final conversion
              </span>
            </div>

            <div className="mt-6 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <Tooltip content={<ExecutiveTooltip />} />
                  <Funnel dataKey="value" data={talentFunnel} isAnimationActive>
                    <LabelList position="right" fill="#e4e4e7" stroke="none" dataKey="stage" />
                    {talentFunnel.map((entry) => (
                      <Cell key={entry.stage} fill={entry.fill} />
                    ))}
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-3xl bg-white/[0.03] p-3">
                <p className="text-2xl font-semibold text-white">{totalPipeline}</p>
                <p className="mt-1 text-xs text-zinc-500">Applicants</p>
              </div>
              <div className="rounded-3xl bg-white/[0.03] p-3">
                <p className="text-2xl font-semibold text-white">29</p>
                <p className="mt-1 text-xs text-zinc-500">Offers</p>
              </div>
              <div className="rounded-3xl bg-white/[0.03] p-3">
                <p className="text-2xl font-semibold text-white">{hires}</p>
                <p className="mt-1 text-xs text-zinc-500">Hires</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={hubItemVariants} className={`xl:col-span-4 ${glassPanelClass} p-5 sm:p-6`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <Heart className="h-5 w-5 shrink-0 text-emerald-300" />
                  Wellbeing & Burnout Index
                </h3>
                <p className="mt-1 text-sm text-zinc-400">Executive pulse trend showing recovery after intervention in June.</p>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-zinc-300">74 wellbeing index</span>
            </div>

            <div className="mt-6 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={wellbeingTrend}>
                  <defs>
                    <linearGradient id="wellbeingArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0.03} />
                    </linearGradient>
                    <linearGradient id="burnoutArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: "#ffffff15" }} tick={{ fill: "#a1a1aa" }} />
                  <YAxis tickLine={false} axisLine={{ stroke: "#ffffff15" }} tick={{ fill: "#a1a1aa" }} />
                  <Tooltip content={<ExecutiveTooltip />} />
                  <Area type="monotone" dataKey="wellbeing" name="Wellbeing" stroke="#22c55e" fill="url(#wellbeingArea)" strokeWidth={3} />
                  <Area type="monotone" dataKey="burnout" name="Burnout" stroke="#f97316" fill="url(#burnoutArea)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-3xl bg-emerald-500/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Trend</p>
                <p className="mt-2 text-2xl font-semibold text-white">+2 pts</p>
                <p className="text-sm text-zinc-400">wellbeing recovered in June</p>
              </div>
              <div className="rounded-3xl bg-amber-500/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Watchlist</p>
                <p className="mt-2 text-2xl font-semibold text-white">29%</p>
                <p className="text-sm text-zinc-400">burnout intensity at May peak</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={hubItemVariants} className={`xl:col-span-4 ${glassPanelClass} p-5 sm:p-6`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <Target className="h-5 w-5 shrink-0 text-emerald-300" />
                  Manager Effectiveness
                </h3>
                <p className="mt-1 text-sm text-zinc-400">Radar view of the leadership behaviors driving retention and output.</p>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">82 / 100 overall</span>
            </div>

            <div className="mt-6 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={managerEffectiveness}>
                  <PolarGrid stroke="#ffffff18" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#d4d4d8", fontSize: 12 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar dataKey="score" stroke="#22c55e" fill="#22c55e" fillOpacity={0.35} strokeWidth={2.5} />
                  <Tooltip content={<ExecutiveTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Strongest dimension</span>
                <span className="font-medium text-white">Goal Clarity</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-zinc-400">Best ROI lever</span>
                <span className="font-medium text-emerald-300">Manager coaching in velocity teams</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <motion.div variants={hubItemVariants} className={`xl:col-span-6 ${glassPanelClass} p-5 sm:p-6`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <BookOpen className="h-5 w-5 shrink-0 text-emerald-300" />
                  Skills Inventory Heatmap
                </h3>
                <p className="mt-1 text-sm text-zinc-400">Readiness by capability and function, tuned for mobility and succession planning.</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <span className="rounded-full bg-white/10 px-3 py-1">Low</span>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-300">High</span>
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              <div className="min-w-[620px]">
                <div className="grid grid-cols-[1.6fr_repeat(4,1fr)_1.3fr] gap-3 text-xs uppercase tracking-[0.2em] text-zinc-500">
                  <div>Capability</div>
                  <div className="text-center">Engineering</div>
                  <div className="text-center">Product</div>
                  <div className="text-center">Sales</div>
                  <div className="text-center">Operations</div>
                  <div>Critical gap</div>
                </div>

                <div className="mt-3 space-y-3">
                  {skillsHeatmap.map((row) => (
                    <div key={row.capability} className="grid grid-cols-[1.6fr_repeat(4,1fr)_1.3fr] gap-3">
                      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                        <p className="font-medium text-white">{row.capability}</p>
                      </div>

                      {[row.engineering, row.product, row.sales, row.operations].map((score, index) => (
                        <motion.div
                          key={`${row.capability}-${index}`}
                          variants={hubItemVariants}
                          whileHover={{ scale: 1.03 }}
                          className="rounded-3xl border p-4 text-center"
                          style={getHeatStyle(score)}
                        >
                          <p className="text-2xl font-semibold text-white">{score}</p>
                          <p className="mt-1 text-xs text-zinc-300">readiness</p>
                        </motion.div>
                      ))}

                      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                        <p className="text-sm font-medium text-white">{row.gap}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={hubItemVariants} className={`xl:col-span-3 ${glassPanelClass} p-5 sm:p-6`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <DollarSign className="h-5 w-5 shrink-0 text-emerald-300" />
                  Compensation vs Market
                </h3>
                <p className="mt-1 text-sm text-zinc-400">Indexed to market median = 100.</p>
              </div>
            </div>

            <div className="mt-6 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={compensationBenchmark} layout="vertical" margin={{ left: 12, right: 12 }}>
                  <CartesianGrid stroke="#ffffff10" horizontal={false} />
                  <XAxis type="number" tickLine={false} axisLine={{ stroke: "#ffffff15" }} tick={{ fill: "#a1a1aa" }} />
                  <YAxis
                    dataKey="family"
                    type="category"
                    width={88}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#d4d4d8" }}
                  />
                  <Tooltip content={<ExecutiveTooltip />} />
                  <Bar dataKey="market" name="Market" fill="#1d4ed8" radius={[0, 10, 10, 0]} />
                  <Bar dataKey="internal" name="Internal" fill="#22c55e" radius={[0, 10, 10, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-3xl bg-white/[0.03] p-4">
              <p className="text-sm text-zinc-400">Biggest gap</p>
              <p className="mt-2 text-xl font-semibold text-white">Operations at -8%</p>
              <p className="mt-1 text-sm text-zinc-400">Recommend correction to reduce avoidable attrition in critical support roles.</p>
            </div>
          </motion.div>

          <motion.div variants={hubItemVariants} className={`xl:col-span-3 ${glassPanelClass} p-5 sm:p-6`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <Trophy className="h-5 w-5 shrink-0 text-emerald-300" />
                  Attrition Cost Calculator
                </h3>
                <p className="mt-1 text-sm text-zinc-400">Live ROI model in INR crores.</p>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Value preserved</p>
              <p className="mt-3 text-5xl font-semibold text-white">₹{retainedValueCr} Cr</p>
              <p className="mt-2 text-sm text-zinc-300">Projected savings if 6 high-risk exits are prevented via targeted intervention.</p>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-3xl bg-white/[0.03] p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Attrition exposure</span>
                  <span className="font-medium text-white">₹{projectedAttritionExposureCr} Cr</span>
                </div>
              </div>
              <div className="rounded-3xl bg-white/[0.03] p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Intervention cost</span>
                  <span className="font-medium text-white">₹{attritionModel.interventionCostCr} Cr</span>
                </div>
              </div>
              <div className="rounded-3xl bg-white/[0.03] p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Net value preserved</span>
                  <span className="font-medium text-emerald-300">₹{netValuePreservedCr} Cr</span>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Projected ROI</span>
                <span className="text-2xl font-semibold text-emerald-300">{roiPercent}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-emerald-400" style={{ width: `${Math.min(roiPercent / 3, 100)}%` }} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.96 }}
        className="absolute bottom-5 right-5 z-20 inline-flex items-center gap-3 rounded-full border border-emerald-400/25 bg-zinc-950/85 px-4 py-3 text-sm font-medium text-white shadow-[0_20px_50px_-20px_rgba(16,185,129,0.7)] backdrop-blur-2xl"
      >
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15">
          <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-emerald-400/70" />
          <Brain className="relative h-4 w-4 text-emerald-300" />
        </span>
        Floating AI HR Assistant
      </motion.button>
    </motion.section>
  );
}
