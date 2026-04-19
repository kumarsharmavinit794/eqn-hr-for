import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  Brain,
  BrainCircuit,
  Briefcase,
  Building2,
  CalendarCheck,
  ChartNetwork,
  Cpu,
  DollarSign,
  Gauge,
  Heart,
  Languages,
  Layers,
  MapPin,
  ScanSearch,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users,
  Waypoints,
  Workflow,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Funnel,
  FunnelChart,
  LabelList,
  Line,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type InsightTone = "opportunity" | "risk" | "action";

interface ExecutiveInsight {
  title: string;
  detail: string;
  metric: string;
  recommendation: string;
  tone: InsightTone;
  icon: LucideIcon;
}

interface SuccessionTalent {
  name: string;
  currentRole: string;
  readiness: number;
  flightRisk: number;
  growth: string;
}

interface SuccessionScenario {
  role: string;
  incumbent: string;
  readiness: number;
  readyNow: number;
  readySoon: number;
  timeToStabilize: number;
  confidence: number;
  narrative: string;
  talentPool: SuccessionTalent[];
}

interface MobilityPoint {
  quarter: string;
  internalMoves: number;
  promotions: number;
  globalMoves: number;
}

interface RecruitmentFunnelStage {
  stage: string;
  value: number;
  fill: string;
}

interface AcquisitionSignal {
  title: string;
  value: string;
  detail: string;
  icon: LucideIcon;
}

interface TalentTwin {
  id: string;
  name: string;
  role: string;
  futureRole: string;
  performance: number;
  growth: number;
  flightRisk: number;
  cultureFit: number;
  coach: string;
  recognition: string;
  review: string;
  developmentPlan: string[];
}

interface SkillHeatmapRow {
  capability: string;
  engineering: number;
  product: number;
  goToMarket: number;
  operations: number;
  gap: string;
}

interface SkillRadarPoint {
  skill: string;
  current: number;
  target: number;
}

interface WellbeingPoint {
  month: string;
  wellbeing: number;
  burnout: number;
  sentiment: number;
}

interface BurnoutSignal {
  segment: string;
  burnoutRisk: number;
  meetingSentiment: string;
  wearableStress: number;
}

interface CompensationPoint {
  function: string;
  internal: number;
  market: number;
}

interface RadarPoint {
  subject: string;
  score: number;
  fullMark: number;
}

interface PerformanceReviewInsight {
  name: string;
  summary: string;
  nextMove: string;
}

interface ComplianceRisk {
  area: string;
  riskScore: number;
  contractsReviewed: number;
  biasDrift: number;
  nextAction: string;
}

interface PolicySignal {
  title: string;
  value: string;
  detail: string;
  icon: LucideIcon;
}

interface CollaborationNode {
  id: string;
  label: string;
  x: number;
  y: number;
  size: number;
  pulse: number;
  region: string;
}

interface CollaborationEdge {
  from: string;
  to: string;
  strength: number;
}

interface CollaborationHeatRow {
  hub: string;
  apac: number;
  emea: number;
  americas: number;
  async: number;
  translation: number;
}

interface DiversityPoint {
  cohort: string;
  belonging: number;
  equity: number;
  voice: number;
}

interface ESGMetric {
  label: string;
  value: string;
  change: string;
}

interface FutureSignal {
  title: string;
  value: string;
  detail: string;
  icon: LucideIcon;
}

interface TooltipEntry {
  color?: string;
  fill?: string;
  name?: string;
  dataKey?: string;
  value?: number | string;
}

interface GlassTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

interface RingGaugeProps {
  value: number;
  color: string;
  label: string;
  suffix?: string;
}

type SafeDotProps = Omit<React.ComponentPropsWithoutRef<"circle">, "cx" | "cy" | "r"> & {
  cx?: number | string | null;
  cy?: number | string | null;
  r?: number | string | null;
  dataKey?: string | number;
  index?: number;
};

interface KpiCard {
  label: string;
  value: string;
  change: string;
  progress: number;
  color: string;
  icon: LucideIcon;
}

const cockpitVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
  },
};

const cockpitItemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 92, damping: 16 },
  },
};

const panelClass =
  "relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] backdrop-blur-2xl shadow-[0_30px_90px_-40px_rgba(0,0,0,0.85)]";

const subPanelClass = "rounded-[28px] border border-white/10 bg-black/20 backdrop-blur-xl";

const SafeDot = ({
  cx,
  cy,
  r = 4,
  fill,
  stroke,
  strokeWidth,
  className,
  opacity,
  style,
}: SafeDotProps) => {
  const safeCx = typeof cx === "number" ? cx : Number(cx);
  const safeCy = typeof cy === "number" ? cy : Number(cy);
  const safeRadius = typeof r === "number" ? r : Number(r);

  if (!Number.isFinite(safeCx) || !Number.isFinite(safeCy)) {
    return null;
  }

  return (
    <circle
      cx={safeCx}
      cy={safeCy}
      r={Number.isFinite(safeRadius) && safeRadius > 0 ? safeRadius : 4}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      className={className}
      opacity={opacity}
      style={style}
    />
  );
};

const renderSafeDot = (
  props: SafeDotProps | null | undefined,
  defaults: Partial<SafeDotProps> = {},
) => {
  if (!props) {
    return null;
  }

  const {
    index,
    dataKey,
    key,
    name,
    width,
    height,
    value,
    payload,
    points,
    ...restProps
  } = props as any;

  return (
    <SafeDot
      key={`${String(dataKey ?? defaults.dataKey ?? "dot")}-${index ?? 0}`}
      {...restProps}
      r={restProps.r ?? defaults.r ?? 4}
      fill={restProps.fill ?? defaults.fill}
      stroke={restProps.stroke ?? defaults.stroke}
      strokeWidth={restProps.strokeWidth ?? defaults.strokeWidth}
    />
  );
};

const renderCockpitLineDot = (props: SafeDotProps) =>
  renderSafeDot(props, { r: 4, fill: "#38bdf8" });

const renderCockpitLineActiveDot = (props: SafeDotProps) =>
  renderSafeDot(props, { r: 6, fill: "#38bdf8", stroke: "#ffffff", strokeWidth: 2 });

const executiveInsights: ExecutiveInsight[] = [
  {
    title: "Succession AI can protect 4 board-critical seats without external search",
    detail: "CTO, CFO, CHRO, and Global Supply Chain can be stabilized through internal shadow successors and accelerated mobility.",
    metric: "89% continuity coverage",
    recommendation: "Lock shadow-board assignments this week.",
    tone: "opportunity",
    icon: Award,
  },
  {
    title: "Predictive attrition model flags Digital Ops and Shared Services as the next 90-day hotspot",
    detail: "Pay compression, manager span, and meeting overload are creating a clustered flight-risk signal across 73 key contributors.",
    metric: "12.6% modeled exit probability",
    recommendation: "Deploy targeted retention and workload reset before month end.",
    tone: "risk",
    icon: TrendingDown,
  },
  {
    title: "Quantum matching found 17 internal moves with higher success odds than new requisitions",
    detail: "Adjacency scoring shows strong redeployment paths from platform engineering, analytics, and customer operations into critical growth roles.",
    metric: "93% fit confidence",
    recommendation: "Route open leadership roles to the mobility pool first.",
    tone: "action",
    icon: Brain,
  },
  {
    title: "Emotion AI and wearable telemetry show burnout cooling where recognition is hyper-personalized",
    detail: "Meeting sentiment, cadence reduction, and reward precision are improving resilience in the top two fatigue clusters.",
    metric: "Burnout index down 6 pts",
    recommendation: "Scale AI coach nudges to frontline managers.",
    tone: "opportunity",
    icon: Heart,
  },
];

const successionScenarios: SuccessionScenario[] = [
  {
    role: "Chief Technology Officer",
    incumbent: "Aman Verma",
    readiness: 91,
    readyNow: 2,
    readySoon: 3,
    timeToStabilize: 21,
    confidence: 95,
    narrative:
      "If the CTO exits inside 45 days, the AI bench can keep platform velocity steady by moving two VPs into staggered shadow roles and activating one global mobility relocation.",
    talentPool: [
      { name: "Naina Kapoor", currentRole: "VP Platform Engineering", readiness: 94, flightRisk: 14, growth: "Ready now" },
      { name: "Rohit Menon", currentRole: "Director, AI Infrastructure", readiness: 87, flightRisk: 18, growth: "Ready in 60 days" },
      { name: "Meera Shah", currentRole: "Head of Cloud Reliability", readiness: 82, flightRisk: 22, growth: "Ready in 90 days" },
    ],
  },
  {
    role: "Chief Financial Officer",
    incumbent: "Priyanka Sethi",
    readiness: 88,
    readyNow: 1,
    readySoon: 3,
    timeToStabilize: 28,
    confidence: 92,
    narrative:
      "The CFO slate is slightly thinner, but contract intelligence and scenario planning show internal successors can keep audit, investor, and treasury continuity above the board threshold.",
    talentPool: [
      { name: "Arjun Pillai", currentRole: "VP Finance Operations", readiness: 90, flightRisk: 11, growth: "Ready now" },
      { name: "Sonia Talwar", currentRole: "Controller, APAC", readiness: 84, flightRisk: 16, growth: "Ready in 90 days" },
      { name: "Karan Das", currentRole: "Director, FP&A", readiness: 81, flightRisk: 19, growth: "Ready in 120 days" },
    ],
  },
  {
    role: "Chief Human Resources Officer",
    incumbent: "Ritika Anand",
    readiness: 93,
    readyNow: 2,
    readySoon: 2,
    timeToStabilize: 18,
    confidence: 96,
    narrative:
      "CHRO continuity is strongest: the critical talent pool already spans regional and enterprise HR operators, with AI agents covering policy throughput during transition.",
    talentPool: [
      { name: "Devika Nair", currentRole: "VP People Experience", readiness: 95, flightRisk: 9, growth: "Ready now" },
      { name: "Vikas Bedi", currentRole: "Global HRBP Leader", readiness: 89, flightRisk: 13, growth: "Ready now" },
      { name: "Sara Jacob", currentRole: "Director, Total Rewards", readiness: 83, flightRisk: 18, growth: "Ready in 75 days" },
    ],
  },
];

const mobilityTrend: MobilityPoint[] = [
  { quarter: "Q1", internalMoves: 22, promotions: 11, globalMoves: 5 },
  { quarter: "Q2", internalMoves: 29, promotions: 15, globalMoves: 7 },
  { quarter: "Q3", internalMoves: 36, promotions: 19, globalMoves: 8 },
  { quarter: "Q4", internalMoves: 47, promotions: 24, globalMoves: 12 },
];

const recruitmentFunnel: RecruitmentFunnelStage[] = [
  { stage: "Sourced", value: 486, fill: "#1d4ed8" },
  { stage: "AI Screened", value: 280, fill: "#0ea5e9" },
  { stage: "Panel Qualified", value: 124, fill: "#14b8a6" },
  { stage: "Offer", value: 42, fill: "#22c55e" },
  { stage: "Accepted", value: 28, fill: "#86efac" },
];

const acquisitionSignals: AcquisitionSignal[] = [
  {
    title: "Predictive Culture Fit",
    value: "92%",
    detail: "Context model blends values, collaboration style, and mission alignment before final panel.",
    icon: Sparkles,
  },
  {
    title: "Neuro-Diversity AI Screening",
    value: "Bias drift 0.8σ",
    detail: "Structured prompts are tuned for accessibility, sensory load, and alternative signal recognition.",
    icon: ScanSearch,
  },
  {
    title: "Blockchain Credentials",
    value: "96% verified",
    detail: "Career credentials, prior impact claims, and certifications are cryptographically validated.",
    icon: ShieldCheck,
  },
  {
    title: "Metaverse Onboarding",
    value: "11 days faster",
    detail: "Immersive plant, office, and team simulations are cutting time-to-productivity for global hires.",
    icon: Building2,
  },
];

const talentTwins: TalentTwin[] = [
  {
    id: "naina",
    name: "Naina Kapoor",
    role: "Director, Data Platforms",
    futureRole: "VP Data & AI",
    performance: 94,
    growth: 91,
    flightRisk: 18,
    cultureFit: 96,
    coach: "Give Naina a 90-day enterprise AI monetization mission and one board-facing narrative rehearsal every fortnight.",
    recognition: "Recommend a Chairman's innovation grant plus a visible cross-region speaking opportunity.",
    review: "Autonomous review sees outsized systems leadership, clear executive communication, and unusually strong follow-through on high-ambiguity programs.",
    developmentPlan: [
      "Month 1-2: Shadow the enterprise architecture council and lead one AI governance sprint.",
      "Month 3-4: Own APAC data modernization roadmap with a finance co-pilot sponsor.",
      "Month 5-6: Present a board-ready GenAI operating model with quantified ROI.",
    ],
  },
  {
    id: "isha",
    name: "Isha Malhotra",
    role: "Senior Manager, Customer Success",
    futureRole: "Global VP Customer Outcomes",
    performance: 89,
    growth: 93,
    flightRisk: 27,
    cultureFit: 90,
    coach: "Reduce manager load by shifting two enterprise accounts, then pair Isha with the CRO on renewal strategy and influence mapping.",
    recognition: "Recommend a bespoke leadership lab seat and a family travel reward tied to renewal excellence.",
    review: "Autonomous review sees top-tier client empathy and turnaround execution, with one stretch area around executive storytelling at scale.",
    developmentPlan: [
      "Month 1-2: Rotate into revenue forecasting and commercial negotiations.",
      "Month 3-4: Lead the EMEA customer rescue pod and mentor two new managers.",
      "Month 5-6: Publish a playbook on expansion motions for strategic accounts.",
    ],
  },
  {
    id: "vikram",
    name: "Vikram Rao",
    role: "Plant HR Lead",
    futureRole: "Regional CHRO - Manufacturing",
    performance: 87,
    growth: 88,
    flightRisk: 16,
    cultureFit: 94,
    coach: "Expand Vikram's scope into labor strategy, robotics transition readiness, and ESG workforce reporting before the next board review.",
    recognition: "Recommend a high-visibility operations excellence medal with equity top-up tied to retention gains.",
    review: "Autonomous review sees disciplined frontline trust-building, high compliance credibility, and a rare ability to translate policy into plant behavior.",
    developmentPlan: [
      "Month 1-2: Lead factory automation readiness diagnostics across two plants.",
      "Month 3-4: Co-own quarterly labor risk review with legal and finance.",
      "Month 5-6: Build the manufacturing succession bench and present CHRO readiness case.",
    ],
  },
];

const skillsHeatmap: SkillHeatmapRow[] = [
  { capability: "GenAI Delivery", engineering: 93, product: 84, goToMarket: 58, operations: 61, gap: "Go-to-market AI fluency" },
  { capability: "Executive Leadership", engineering: 78, product: 81, goToMarket: 73, operations: 69, gap: "Ops succession depth" },
  { capability: "Commercial Acumen", engineering: 55, product: 72, goToMarket: 92, operations: 63, gap: "Tech-to-revenue mobility path" },
  { capability: "Data Governance", engineering: 86, product: 79, goToMarket: 64, operations: 74, gap: "Sales data hygiene" },
  { capability: "Automation Resilience", engineering: 90, product: 75, goToMarket: 48, operations: 88, gap: "Field automation literacy" },
];

const skillsRadar: SkillRadarPoint[] = [
  { skill: "AI Fluency", current: 82, target: 95 },
  { skill: "Leadership", current: 79, target: 90 },
  { skill: "Data Stewardship", current: 84, target: 92 },
  { skill: "Customer Strategy", current: 74, target: 89 },
  { skill: "Plant Automation", current: 77, target: 88 },
  { skill: "People Growth", current: 80, target: 91 },
];

const wellbeingTrend: WellbeingPoint[] = [
  { month: "Jan", wellbeing: 76, burnout: 27, sentiment: 68 },
  { month: "Feb", wellbeing: 79, burnout: 24, sentiment: 71 },
  { month: "Mar", wellbeing: 77, burnout: 28, sentiment: 69 },
  { month: "Apr", wellbeing: 75, burnout: 31, sentiment: 66 },
  { month: "May", wellbeing: 78, burnout: 26, sentiment: 72 },
  { month: "Jun", wellbeing: 81, burnout: 23, sentiment: 76 },
];

const burnoutSignals: BurnoutSignal[] = [
  { segment: "Digital Operations", burnoutRisk: 67, meetingSentiment: "Tense", wearableStress: 73 },
  { segment: "Customer Success", burnoutRisk: 61, meetingSentiment: "Reactive", wearableStress: 68 },
  { segment: "Shared Services", burnoutRisk: 54, meetingSentiment: "Neutral", wearableStress: 58 },
];

const compensationBenchmark: CompensationPoint[] = [
  { function: "Engineering", internal: 104, market: 100 },
  { function: "Digital Ops", internal: 92, market: 100 },
  { function: "Finance", internal: 101, market: 100 },
  { function: "Sales", internal: 97, market: 100 },
  { function: "Supply Chain", internal: 95, market: 100 },
];

const managerEffectiveness: RadarPoint[] = [
  { subject: "Coaching", score: 89, fullMark: 100 },
  { subject: "Clarity", score: 86, fullMark: 100 },
  { subject: "Inclusion", score: 82, fullMark: 100 },
  { subject: "Feedback", score: 88, fullMark: 100 },
  { subject: "Talent Growth", score: 85, fullMark: 100 },
  { subject: "Execution", score: 80, fullMark: 100 },
];

const autonomousReviews: PerformanceReviewInsight[] = [
  {
    name: "Ananya Bose",
    summary: "AI review predicts stretch readiness for enterprise strategy leadership based on cross-functional influence and consistent delivery.",
    nextMove: "Move into board prep and strategic planning rotation.",
  },
  {
    name: "Rahul Iyer",
    summary: "Performance engine sees strong output but flags coaching quality variance under sustained workload pressure.",
    nextMove: "Pair with manager effectiveness sprint and workload rebalance.",
  },
  {
    name: "Priya Malhotra",
    summary: "Review agent detects rising culture-fit leadership signal and above-benchmark retention impact across a hybrid team.",
    nextMove: "Nominate for multi-region people leadership track.",
  },
];

const complianceRisks: ComplianceRisk[] = [
  { area: "Labor & Wage Compliance", riskScore: 19, contractsReviewed: 14, biasDrift: 0.3, nextAction: "Close overtime anomaly in two facilities." },
  { area: "AI Legal Contract Intelligence", riskScore: 24, contractsReviewed: 37, biasDrift: 0.5, nextAction: "Redline freelancer classification language." },
  { area: "AI Ethics & Bias Auditor", riskScore: 14, contractsReviewed: 28, biasDrift: 0.8, nextAction: "Rebalance one screening prompt cluster." },
  { area: "Wearables Consent & Privacy", riskScore: 17, contractsReviewed: 19, biasDrift: 0.2, nextAction: "Refresh biometric consent flow in EMEA." },
];

const policySignals: PolicySignal[] = [
  {
    title: "Agentic Workforce",
    value: "38 live agents",
    detail: "Autonomous HR agents now handle policies, queries, and case routing across six regions.",
    icon: Bot,
  },
  {
    title: "Self-Evolving Policies",
    value: "4 policy loops",
    detail: "Policies are auto-updated from labor drift, usage telemetry, and legal review outcomes.",
    icon: Workflow,
  },
  {
    title: "Contract Intelligence",
    value: "92 clauses flagged",
    detail: "Clause clustering is reducing legal review effort and shortening cycle time.",
    icon: BookOpen,
  },
  {
    title: "Ethics Coverage",
    value: "97.1%",
    detail: "Bias monitoring covers talent acquisition, succession, rewards, and performance systems.",
    icon: ShieldCheck,
  },
];

const collaborationNodes: CollaborationNode[] = [
  { id: "blr", label: "Bengaluru AI", x: 18, y: 30, size: 6, pulse: 82, region: "APAC" },
  { id: "sin", label: "Singapore Ops", x: 36, y: 18, size: 5, pulse: 74, region: "APAC" },
  { id: "lon", label: "London HR", x: 53, y: 28, size: 5, pulse: 78, region: "EMEA" },
  { id: "dub", label: "Dubai Sales", x: 63, y: 44, size: 4.8, pulse: 71, region: "EMEA" },
  { id: "aus", label: "Austin Product", x: 77, y: 20, size: 5.5, pulse: 79, region: "AMER" },
  { id: "war", label: "Warsaw Finance", x: 79, y: 48, size: 4.5, pulse: 67, region: "EMEA" },
];

const collaborationEdges: CollaborationEdge[] = [
  { from: "blr", to: "sin", strength: 88 },
  { from: "blr", to: "lon", strength: 76 },
  { from: "sin", to: "aus", strength: 69 },
  { from: "lon", to: "dub", strength: 81 },
  { from: "lon", to: "war", strength: 74 },
  { from: "aus", to: "war", strength: 65 },
  { from: "dub", to: "aus", strength: 72 },
];

const collaborationHeatmap: CollaborationHeatRow[] = [
  { hub: "Bengaluru", apac: 94, emea: 81, americas: 68, async: 90, translation: 88 },
  { hub: "Singapore", apac: 89, emea: 76, americas: 64, async: 83, translation: 92 },
  { hub: "London", apac: 73, emea: 95, americas: 79, async: 84, translation: 90 },
  { hub: "Austin", apac: 66, emea: 80, americas: 93, async: 78, translation: 85 },
];

const diversityBelonging: DiversityPoint[] = [
  { cohort: "Women Leaders", belonging: 37, equity: 33, voice: 30 },
  { cohort: "Frontline Talent", belonging: 35, equity: 31, voice: 34 },
  { cohort: "Neurodiverse Talent", belonging: 39, equity: 29, voice: 32 },
  { cohort: "New Joiners", belonging: 34, equity: 32, voice: 34 },
];

const microAggressionInsights = [
  "Micro-aggression alerts dropped 18% after manager coaching in frontline ops.",
  "Two hybrid teams still show elevated interruption patterns in senior review meetings.",
  "Belonging sentiment is strongest where recognition is tied to peer-submitted narratives.",
];

const esgMetrics: ESGMetric[] = [
  { label: "Workforce carbon / employee", value: "1.9 tCO2e", change: "-14% YoY" },
  { label: "Green commute adoption", value: "62%", change: "+9 pts" },
  { label: "Paperless verified credentials", value: "96%", change: "+18 pts" },
];

const futureSignals: FutureSignal[] = [
  {
    title: "Holographic Meeting Insights",
    value: "93% summary fidelity",
    detail: "Executive rooms now surface live risks, decisions, and people sentiment as layered holographic overlays.",
    icon: Layers,
  },
  {
    title: "Global Translation Hub",
    value: "11 languages live",
    detail: "Real-time multilingual translation is smoothing cross-region hiring, onboarding, and performance calibration.",
    icon: Languages,
  },
  {
    title: "BCI Readiness",
    value: "61% pilot ready",
    detail: "Brain-computer interface readiness is cleared for experimentation in advanced manufacturing and accessibility programs.",
    icon: Cpu,
  },
  {
    title: "AI Agentic Workforce",
    value: "72% routine closure",
    detail: "Autonomous agents now resolve routine HR casework end-to-end with human oversight at key decision points.",
    icon: Bot,
  },
  {
    title: "Self-Evolving HR Policies",
    value: "4 adaptive loops",
    detail: "Policy intelligence learns from legal changes, employee behavior, and risk drift without waiting for quarterly refreshes.",
    icon: Workflow,
  },
  {
    title: "Metaverse Onboarding",
    value: "4.8/5 immersion",
    detail: "New hires rehearse plants, office rituals, and manager conversations in realistic digital twin spaces.",
    icon: Briefcase,
  },
];

function GlassTooltip({ active, payload, label }: GlassTooltipProps) {
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

function RingGauge({ value, color, label, suffix = "%" }: RingGaugeProps) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);

  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-semibold text-white">
          {value}
          {suffix}
        </div>
        <div className="mt-1 text-[10px] uppercase tracking-[0.24em] text-zinc-500">{label}</div>
      </div>
    </div>
  );
}

function heatColor(value: number) {
  const opacity = 0.12 + value / 150;
  return `rgba(16, 185, 129, ${Math.min(opacity, 0.92)})`;
}

function riskColor(score: number) {
  if (score >= 22) return "#f97316";
  if (score >= 16) return "#facc15";
  return "#22c55e";
}

function formatCr(value: number) {
  return `₹${value.toFixed(2)} Cr`;
}

export function AIHRCommandCockpit2027() {
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [selectedTwinId, setSelectedTwinId] = useState(talentTwins[0]?.id ?? "");
  const [attritionShock, setAttritionShock] = useState(20);
  const [automationLift, setAutomationLift] = useState(18);
  const [mobilityBoost, setMobilityBoost] = useState(12);

  const selectedScenario = successionScenarios[selectedScenarioIndex] ?? successionScenarios[0];
  const selectedTwin = talentTwins.find((twin) => twin.id === selectedTwinId) ?? talentTwins[0];

  const simulationState = useMemo(() => {
    const baseHeadcount = 2840;
    const modeledExits = Math.round((baseHeadcount * attritionShock) / 100);
    const mobilityRecovered = Math.round(modeledExits * (0.18 + mobilityBoost / 100));
    const automationRecovered = Math.round(modeledExits * (automationLift / 210));
    const totalRecovered = Math.min(modeledExits - 10, mobilityRecovered + automationRecovered);
    const netLoss = Math.max(0, modeledExits - totalRecovered);
    const attritionProbability = Math.max(6, Math.round(5 + attritionShock * 0.34 - automationLift * 0.08));
    const avoidedCostCr = (totalRecovered * 32 * 1.45) / 100;
    const interventionCostCr = 1.45 + mobilityBoost * 0.06 + automationLift * 0.05;
    const roiCr = avoidedCostCr - interventionCostCr;
    const globalRedeployable = Math.round(118 + mobilityBoost * 6 + automationLift * 2.1);
    const quantumConfidence = Math.min(98, Math.round(84 + mobilityBoost * 0.45 + automationLift * 0.2));
    const cultureRecovery = Math.min(98, Math.round(74 - attritionShock * 0.4 + automationLift * 0.5 + mobilityBoost * 0.3));
    const projectedBenchCoverage = Math.min(99, Math.round(selectedScenario.readiness + mobilityBoost * 0.35));

    const headcountProjection = [
      { phase: "Now", baseline: baseHeadcount, scenario: baseHeadcount, capacity: 100 },
      {
        phase: "30D",
        baseline: baseHeadcount - Math.round(modeledExits * 0.34),
        scenario: baseHeadcount - Math.round(modeledExits * 0.34) + Math.round(totalRecovered * 0.28),
        capacity: Math.round(96 - attritionShock * 0.2 + automationLift * 0.16),
      },
      {
        phase: "60D",
        baseline: baseHeadcount - Math.round(modeledExits * 0.68),
        scenario: baseHeadcount - Math.round(modeledExits * 0.68) + Math.round(totalRecovered * 0.62),
        capacity: Math.round(93 - attritionShock * 0.15 + automationLift * 0.25 + mobilityBoost * 0.1),
      },
      {
        phase: "90D",
        baseline: baseHeadcount - modeledExits,
        scenario: baseHeadcount - netLoss,
        capacity: Math.round(91 - attritionShock * 0.1 + automationLift * 0.32 + mobilityBoost * 0.18),
      },
    ];

    return {
      baseHeadcount,
      modeledExits,
      totalRecovered,
      netLoss,
      attritionProbability,
      avoidedCostCr,
      interventionCostCr,
      roiCr,
      globalRedeployable,
      quantumConfidence,
      cultureRecovery,
      projectedBenchCoverage,
      headcountProjection,
    };
  }, [attritionShock, automationLift, mobilityBoost, selectedScenario.readiness]);

  const kpiCards: KpiCard[] = useMemo(
    () => [
      {
        label: "Critical Bench Coverage",
        value: `${simulationState.projectedBenchCoverage}%`,
        change: `${selectedScenario.readyNow} ready now, ${selectedScenario.readySoon} in motion`,
        progress: simulationState.projectedBenchCoverage,
        color: "#22c55e",
        icon: Trophy,
      },
      {
        label: "90-Day Flight Risk",
        value: `${simulationState.attritionProbability}%`,
        change: `${simulationState.modeledExits} modeled exits under current shock`,
        progress: 100 - simulationState.attritionProbability,
        color: "#f97316",
        icon: Bell,
      },
      {
        label: "Live Attrition ROI",
        value: formatCr(simulationState.roiCr),
        change: `${simulationState.totalRecovered} exits prevented by AI actions`,
        progress: Math.min(95, Math.max(28, Math.round(simulationState.roiCr * 4))),
        color: "#38bdf8",
        icon: DollarSign,
      },
      {
        label: "AI Agentic Workforce",
        value: "38 agents",
        change: "72% of routine HR loops auto-closed",
        progress: 72,
        color: "#a855f7",
        icon: Bot,
      },
    ],
    [selectedScenario.readyNow, selectedScenario.readySoon, simulationState],
  );

  const copilotMessages = useMemo(
    () => [
      {
        role: "assistant",
        text: `Board alert: ${selectedScenario.role} continuity is currently ${selectedScenario.readiness}% secure with ${selectedScenario.readyNow} ready-now successors.`,
      },
      {
        role: "user",
        text: `Agar ${attritionShock}% log chhod gaye to kya hoga?`,
      },
      {
        role: "assistant",
        text: `Scenario engine projects ${simulationState.modeledExits} exits. With automation lift at ${automationLift}% and mobility boost at ${mobilityBoost}%, we recover ${simulationState.totalRecovered} exits and protect ${formatCr(simulationState.roiCr)} in value.`,
      },
      {
        role: "assistant",
        text: `Recommended next move: deploy a retention sprint around ${selectedTwin.name}, shift ${simulationState.globalRedeployable} globally mobile employees into adjacent critical roles, and export the board deck now.`,
      },
    ],
    [
      attritionShock,
      automationLift,
      mobilityBoost,
      selectedScenario.readiness,
      selectedScenario.readyNow,
      selectedScenario.role,
      selectedTwin.name,
      simulationState.globalRedeployable,
      simulationState.modeledExits,
      simulationState.roiCr,
      simulationState.totalRecovered,
    ],
  );

  return (
    <>
      <motion.section
        variants={cockpitVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="relative isolate w-full h-auto min-h-0 overflow-hidden rounded-[2rem] border border-emerald-400/15 border-red-500 bg-[#050b0b] p-4 sm:p-6 lg:p-8 shadow-[0_40px_140px_-60px_rgba(16,185,129,0.35)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_32%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_28%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_center,rgba(14,165,233,0.10),transparent_36%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent" />

        <motion.div variants={cockpitItemVariants} className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.32em] text-emerald-300">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              AI HR Command Cockpit – 2027 Edition
            </div>
            <h2 className="mt-5 bg-gradient-to-r from-white via-emerald-100 to-cyan-200 bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl xl:text-5xl">
              One unified executive command surface for the future of workforce intelligence.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300 sm:text-base">
              Succession, retention, hiring, skills, wellbeing, compliance, DEI, mobility, ESG, and next-gen AI signals now land in one immersive decision cockpit built for Fortune 500 boardrooms.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300 backdrop-blur-xl">
              Board sync in 14 min
            </div>
            <motion.button
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-emerald-900/40"
            >
              Export Full 2027 AI Report
              <ArrowRight className="h-4 w-4 shrink-0" />
            </motion.button>
          </div>
        </motion.div>

        <motion.div variants={cockpitItemVariants} className={`${panelClass} mt-4 p-5 sm:p-6`}>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-white/[0.02] to-sky-500/10" />
          <div className="relative grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                <Brain className="h-3.5 w-3.5 shrink-0" />
                AI Executive Summary
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">Four decisive signals. One control room.</h3>
              <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-300">
                The cockpit is prioritizing succession resilience, attrition prevention, quantum mobility matching, and wellbeing recovery as the highest-leverage actions for the next 90 days.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className={`${subPanelClass} p-4`}>
                  <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Urgent actions</div>
                  <div className="mt-3 text-3xl font-semibold text-white">03</div>
                  <div className="mt-2 text-xs text-zinc-400">Retention sprint, CFO bench depth, and manager coaching reset.</div>
                </div>
                <div className={`${subPanelClass} p-4`}>
                  <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Modeled value at stake</div>
                  <div className="mt-3 text-3xl font-semibold text-white">₹24.9 Cr</div>
                  <div className="mt-2 text-xs text-zinc-400">Gross exposure if no action is taken on current risk clusters.</div>
                </div>
                <div className={`${subPanelClass} p-4`}>
                  <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">AI confidence</div>
                  <div className="mt-3 text-3xl font-semibold text-white">94%</div>
                  <div className="mt-2 text-xs text-zinc-400">Across attrition, succession, and mobility models this cycle.</div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {executiveInsights.map((insight) => {
                const toneStyles =
                  insight.tone === "risk"
                    ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
                    : insight.tone === "action"
                      ? "border-sky-400/20 bg-sky-400/10 text-sky-300"
                      : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";

                return (
                  <motion.div
                    key={insight.title}
                    whileHover={{ y: -4, scale: 1.01 }}
                    className={`${subPanelClass} p-4`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border ${toneStyles}`}>
                        <insight.icon className="h-5 w-5 shrink-0" />
                      </div>
                      <div className={`rounded-full border px-3 py-1 text-[11px] font-medium ${toneStyles}`}>{insight.metric}</div>
                    </div>
                    <h4 className="mt-4 text-base font-semibold text-white">{insight.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">{insight.detail}</p>
                    <div className="mt-4 text-xs font-medium text-emerald-300">{insight.recommendation}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div variants={cockpitItemVariants} className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpiCards.map((card) => (
            <motion.div
              key={card.label}
              whileHover={{ y: -5, scale: 1.01 }}
              className={`${panelClass} p-5`}
            >
              <div className="absolute inset-0 opacity-70" style={{ background: `radial-gradient(circle at top right, ${card.color}22, transparent 45%)` }} />
              <div className="relative flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">{card.label}</div>
                  <div className="mt-4 text-3xl font-semibold text-white">{card.value}</div>
                  <div className="mt-2 text-sm text-zinc-300">{card.change}</div>
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <card.icon className="h-5 w-5 shrink-0" style={{ color: card.color }} />
                </div>
              </div>
              <div className="relative mt-6 h-2 rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${card.progress}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: card.color }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-4 grid gap-5 xl:grid-cols-12">
          <motion.div variants={cockpitItemVariants} className={`xl:col-span-7 ${panelClass} p-5 sm:p-6`}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                  <Trophy className="h-3.5 w-3.5 shrink-0" />
                  Succession Planning + Internal Mobility
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-white">Critical talent pool with live C-suite succession simulation.</h3>
                <p className="mt-2 text-sm leading-7 text-zinc-300">
                  Pick a board-critical seat and the cockpit instantly shows bench depth, readiness, transition time, and mobility-led stabilization capacity.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {successionScenarios.map((scenario, index) => (
                  <button
                    key={scenario.role}
                    type="button"
                    onClick={() => setSelectedScenarioIndex(index)}
                    className={`rounded-full border px-3 py-2 text-xs font-medium transition-all ${
                      index === selectedScenarioIndex
                        ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-200"
                        : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {scenario.role}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
              <div className={`${subPanelClass} p-5`}>
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-xl">
                    <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Selected succession event</div>
                    <h4 className="mt-2 text-2xl font-semibold text-white">{selectedScenario.role}</h4>
                    <div className="mt-2 text-sm text-emerald-300">Incumbent: {selectedScenario.incumbent}</div>
                    <p className="mt-4 text-sm leading-7 text-zinc-300">{selectedScenario.narrative}</p>
                  </div>
                  <RingGauge value={selectedScenario.readiness} color="#22c55e" label="Readiness" />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Ready now</div>
                    <div className="mt-3 text-3xl font-semibold text-white">{selectedScenario.readyNow}</div>
                    <div className="mt-2 text-xs text-zinc-400">Immediate board-safe backfills</div>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Ready soon</div>
                    <div className="mt-3 text-3xl font-semibold text-white">{selectedScenario.readySoon}</div>
                    <div className="mt-2 text-xs text-zinc-400">Developing in 60-120 days</div>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Stabilize</div>
                    <div className="mt-3 text-3xl font-semibold text-white">{selectedScenario.timeToStabilize}d</div>
                    <div className="mt-2 text-xs text-zinc-400">{selectedScenario.confidence}% AI confidence</div>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {selectedScenario.talentPool.map((person) => (
                    <div key={person.name} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="text-base font-semibold text-white">{person.name}</div>
                          <div className="mt-1 text-sm text-zinc-400">{person.currentRole}</div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-center text-sm">
                          <div className="rounded-2xl bg-black/20 px-3 py-2">
                            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Readiness</div>
                            <div className="mt-1 font-semibold text-white">{person.readiness}%</div>
                          </div>
                          <div className="rounded-2xl bg-black/20 px-3 py-2">
                            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Flight risk</div>
                            <div className="mt-1 font-semibold text-white">{person.flightRisk}%</div>
                          </div>
                          <div className="rounded-2xl bg-black/20 px-3 py-2">
                            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Trajectory</div>
                            <div className="mt-1 font-semibold text-emerald-300">{person.growth}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${subPanelClass} p-5`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Internal mobility & promotion tracker</div>
                    <div className="mt-2 text-xl font-semibold text-white">Promotion velocity is compounding.</div>
                  </div>
                  <div className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-300">
                    61% global mobility ready
                  </div>
                </div>

                <div className="mt-4 w-full h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mobilityTrend}>
                      <CartesianGrid stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="quarter" tickLine={false} axisLine={false} tick={{ fill: "#a1a1aa", fontSize: 12 }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
                      <Tooltip content={<GlassTooltip />} />
                      <Bar key="mobility-internal-moves-bar" dataKey="internalMoves" name="Internal moves" fill="#22c55e" radius={[8, 8, 0, 0]} isAnimationActive={false} />
                      <Bar key="mobility-promotions-bar" dataKey="promotions" name="Promotions" fill="#38bdf8" radius={[8, 8, 0, 0]} isAnimationActive={false} />
                      <Bar key="mobility-global-moves-bar" dataKey="globalMoves" name="Global moves" fill="#a855f7" radius={[8, 8, 0, 0]} isAnimationActive={false} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Internal fill rate</div>
                    <div className="mt-2 text-2xl font-semibold text-white">68%</div>
                    <div className="mt-2 text-xs text-zinc-400">Best fit roles are now filled internally before requisitions open.</div>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Global talent mobility simulator</div>
                    <div className="mt-2 text-2xl font-semibold text-white">{simulationState.globalRedeployable}</div>
                    <div className="mt-2 text-xs text-zinc-400">Employees are redeployable cross-border in the current scenario.</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={cockpitItemVariants} className={`xl:col-span-5 ${panelClass} p-5 sm:p-6`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs text-sky-300">
                  <Briefcase className="h-3.5 w-3.5 shrink-0" />
                  Talent Acquisition Funnel
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-white">Hiring velocity with predictive culture fit and verified credentials.</h3>
                <p className="mt-2 text-sm leading-7 text-zinc-300">
                  The AI funnel blends screening quality, culture fit, neuro-diversity safety, and onboarding readiness into one premium hiring view.
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-right text-xs text-emerald-300">
                <div className="uppercase tracking-[0.18em]">Time to fill</div>
                <div className="mt-1 text-lg font-semibold text-white">24 days</div>
              </div>
            </div>

            <div className="mt-4 w-full h-[320px] rounded-[28px] border border-white/10 bg-black/20 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <Tooltip content={<GlassTooltip />} />
                  <Funnel dataKey="value" data={recruitmentFunnel} isAnimationActive={false}>
                    <LabelList position="right" fill="#d4d4d8" stroke="none" dataKey="stage" />
                    {recruitmentFunnel.map((stage) => (
                      <Cell key={stage.stage} fill={stage.fill} />
                    ))}
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {acquisitionSignals.map((signal) => (
                <motion.div
                  key={signal.title}
                  whileHover={{ y: -3 }}
                  className={`${subPanelClass} p-4`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                      <signal.icon className="h-4.5 w-4.5 shrink-0 text-emerald-300" />
                    </div>
                    <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                      {signal.value}
                    </div>
                  </div>
                  <div className="mt-4 text-base font-semibold text-white">{signal.title}</div>
                  <div className="mt-2 text-sm leading-6 text-zinc-300">{signal.detail}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={cockpitItemVariants} className={`xl:col-span-7 ${panelClass} p-5 sm:p-6`}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs text-amber-300">
                  <Gauge className="h-3.5 w-3.5 shrink-0" />
                  Workforce Simulation Engine
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-white">"Agar 20% log chhod gaye to kya hoga?" Now the answer is live.</h3>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-zinc-300">
                  Tune attrition shock, automation lift, and mobility intervention to see live 90-day headcount protection, culture recovery, and attrition ROI in rupee crores.
                </p>
              </div>
              <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
                AI early warning: Digital Ops is the first breach if shock rises above 22%.
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1.12fr_0.88fr]">
              <div className={`${subPanelClass} p-5`}>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-zinc-500">
                      Attrition shock
                      <span className="text-white">{attritionShock}%</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={30}
                      step={1}
                      value={attritionShock}
                      onChange={(event) => setAttritionShock(Number(event.target.value))}
                      className="mt-3 w-full accent-amber-400"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-zinc-500">
                      Automation lift
                      <span className="text-white">{automationLift}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={30}
                      step={1}
                      value={automationLift}
                      onChange={(event) => setAutomationLift(Number(event.target.value))}
                      className="mt-3 w-full accent-emerald-400"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-zinc-500">
                      Mobility boost
                      <span className="text-white">{mobilityBoost}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={30}
                      step={1}
                      value={mobilityBoost}
                      onChange={(event) => setMobilityBoost(Number(event.target.value))}
                      className="mt-3 w-full accent-sky-400"
                    />
                  </div>
                </div>

                <div className="mt-4 w-full h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={simulationState.headcountProjection}>
                      <defs>
                        <linearGradient id="baselineGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.38} />
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0.03} />
                        </linearGradient>
                        <linearGradient id="scenarioGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.45} />
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0.04} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="phase" tickLine={false} axisLine={false} tick={{ fill: "#a1a1aa", fontSize: 12 }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
                      <Tooltip content={<GlassTooltip />} />
                      <ReferenceLine
                        y={simulationState.baseHeadcount - simulationState.modeledExits}
                        stroke="#f97316"
                        strokeDasharray="4 4"
                        label={{ value: "No action", fill: "#f97316", position: "insideTopRight" }}
                      />
                      <Area key="simulation-baseline-area" type="monotone" dataKey="baseline" name="Baseline headcount" stroke="#f97316" strokeWidth={3} fill="url(#baselineGradient)" isAnimationActive={false} />
                      <Area key="simulation-scenario-area" type="monotone" dataKey="scenario" name="AI-protected headcount" stroke="#22c55e" strokeWidth={3} fill="url(#scenarioGradient)" isAnimationActive={false} />
                      <Line key="simulation-capacity-line" type="monotone" dataKey="capacity" name="Capacity index" stroke="#38bdf8" strokeWidth={2.5} isAnimationActive={false} dot={renderCockpitLineDot} activeDot={renderCockpitLineActiveDot} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid gap-3">
                <div className={`${subPanelClass} p-4`}>
                  <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Modeled exits</div>
                  <div className="mt-3 text-3xl font-semibold text-white">{simulationState.modeledExits}</div>
                  <div className="mt-2 text-xs text-zinc-400">Employees could exit in the current 90-day shock model.</div>
                </div>
                <div className={`${subPanelClass} p-4`}>
                  <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Recovered through AI actions</div>
                  <div className="mt-3 text-3xl font-semibold text-white">{simulationState.totalRecovered}</div>
                  <div className="mt-2 text-xs text-zinc-400">Recovered via internal mobility, automation lift, and targeted saves.</div>
                </div>
                <div className={`${subPanelClass} p-4`}>
                  <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Live ROI</div>
                  <div className="mt-3 text-3xl font-semibold text-white">{formatCr(simulationState.roiCr)}</div>
                  <div className="mt-2 text-xs text-zinc-400">Net intervention return after delivery cost.</div>
                </div>
                <div className={`${subPanelClass} p-4`}>
                  <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Quantum HR analytics</div>
                  <div className="mt-3 text-3xl font-semibold text-white">{simulationState.quantumConfidence}%</div>
                  <div className="mt-2 text-xs text-zinc-400">Adjacency confidence for quantum-inspired talent matching.</div>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className={`${subPanelClass} p-4`}>
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <Waypoints className="h-4 w-4 shrink-0 text-sky-300" />
                  Global Mobility Simulator
                </div>
                <div className="mt-3 text-2xl font-semibold text-white">{simulationState.globalRedeployable}</div>
                <div className="mt-2 text-xs text-zinc-400">Cross-border redeployable talent under current visa, language, and relocation readiness constraints.</div>
              </div>
              <div className={`${subPanelClass} p-4`}>
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <Sparkles className="h-4 w-4 shrink-0 text-emerald-300" />
                  Culture Recovery
                </div>
                <div className="mt-3 text-2xl font-semibold text-white">{simulationState.cultureRecovery}%</div>
                <div className="mt-2 text-xs text-zinc-400">Predicted culture-fit recovery if current interventions go live this cycle.</div>
              </div>
              <div className={`${subPanelClass} p-4`}>
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <ShieldAlert className="h-4 w-4 shrink-0 text-amber-300" />
                  Early Warning
                </div>
                <div className="mt-3 text-2xl font-semibold text-white">{simulationState.attritionProbability}%</div>
                <div className="mt-2 text-xs text-zinc-400">Predicted attrition probability after AI early-warning recalibration.</div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={cockpitItemVariants} className={`xl:col-span-5 ${panelClass} p-5 sm:p-6`}>
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                    <BrainCircuit className="h-3.5 w-3.5 shrink-0" />
                    AI Talent Twin
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold text-white">Digital employee profiles with future performance, growth, and flight prediction.</h3>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right text-xs text-zinc-400">
                  6-month plan
                  <div className="mt-1 text-lg font-semibold text-white">Auto-generated</div>
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {talentTwins.map((twin) => (
                  <button
                    key={twin.id}
                    type="button"
                    onClick={() => setSelectedTwinId(twin.id)}
                    className={`whitespace-nowrap rounded-full border px-3 py-2 text-xs font-medium transition-all ${
                      twin.id === selectedTwin.id
                        ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-200"
                        : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {twin.name}
                  </button>
                ))}
              </div>

              <div className="grid gap-5 lg:grid-cols-[0.88fr_1.12fr]">
                <div className={`${subPanelClass} p-5`}>
                  <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Selected digital twin</div>
                  <div className="mt-2 text-2xl font-semibold text-white">{selectedTwin.name}</div>
                  <div className="mt-1 text-sm text-zinc-400">
                    {selectedTwin.role}{" → "}{selectedTwin.futureRole}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-3 text-center">
                      <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Performance</div>
                      <div className="mt-2 text-2xl font-semibold text-white">{selectedTwin.performance}%</div>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-3 text-center">
                      <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Growth</div>
                      <div className="mt-2 text-2xl font-semibold text-white">{selectedTwin.growth}%</div>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-3 text-center">
                      <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Flight risk</div>
                      <div className="mt-2 text-2xl font-semibold text-white">{selectedTwin.flightRisk}%</div>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-3 text-center">
                      <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Culture fit</div>
                      <div className="mt-2 text-2xl font-semibold text-white">{selectedTwin.cultureFit}%</div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-3xl border border-sky-400/20 bg-sky-400/10 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-sky-200">Autonomous performance review</div>
                    <div className="mt-3 text-sm leading-7 text-white">{selectedTwin.review}</div>
                  </div>
                </div>

                <div className={`${subPanelClass} p-5`}>
                  <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Generative AI development plan</div>
                  <div className="mt-4 space-y-3">
                    {selectedTwin.developmentPlan.map((item) => (
                      <div key={item} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-zinc-200">
                        {item}
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-3">
                    <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-emerald-200">Hyper-personalized recognition</div>
                      <div className="mt-3 text-sm leading-7 text-white">{selectedTwin.recognition}</div>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">AI coach</div>
                      <div className="mt-3 text-sm leading-7 text-zinc-200">{selectedTwin.coach}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={cockpitItemVariants} className={`xl:col-span-6 ${panelClass} p-5 sm:p-6`}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                  <BarChart3 className="h-3.5 w-3.5 shrink-0" />
                  Skills Inventory Heatmap
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-white">Skills ontology, gap radar, and quantum-inspired matching.</h3>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right text-xs text-zinc-400">
                Quantum match yield
                <div className="mt-1 text-lg font-semibold text-white">{simulationState.quantumConfidence}%</div>
              </div>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1.06fr_0.94fr]">
              <div className={`${subPanelClass} p-5`}>
                <div className="grid grid-cols-[1.35fr_repeat(4,minmax(0,1fr))] gap-2 text-xs uppercase tracking-[0.18em] text-zinc-500">
                  <div>Capability</div>
                  <div className="text-center">Eng</div>
                  <div className="text-center">Prod</div>
                  <div className="text-center">GTM</div>
                  <div className="text-center">Ops</div>
                </div>
                <div className="mt-3 space-y-2">
                  {skillsHeatmap.map((row) => (
                    <div key={row.capability} className="grid grid-cols-[1.35fr_repeat(4,minmax(0,1fr))] gap-2">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                        <div className="text-sm font-medium text-white">{row.capability}</div>
                        <div className="mt-1 text-xs text-zinc-400">{row.gap}</div>
                      </div>
                      {[row.engineering, row.product, row.goToMarket, row.operations].map((value, index) => (
                        <div
                          key={`${row.capability}-${index}`}
                          className="flex items-center justify-center rounded-2xl border border-white/10 p-3 text-sm font-semibold text-white"
                          style={{ backgroundColor: heatColor(value) }}
                        >
                          {value}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${subPanelClass} p-5`}>
                <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Skills gap radar</div>
                <div className="mt-4 w-full h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={skillsRadar}>
                      <PolarGrid stroke="#ffffff18" />
                      <PolarAngleAxis dataKey="skill" tick={{ fill: "#a1a1aa", fontSize: 11 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                      <Tooltip content={<GlassTooltip />} />
                      <Radar name="Current" dataKey="current" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.24} />
                      <Radar name="Target" dataKey="target" stroke="#22c55e" fill="#22c55e" fillOpacity={0.12} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid gap-2">
                  {[
                    "Platform Architect -> AI Ops Lead (96% fit)",
                    "Finance Controller -> ESG Workforce PMO (91% fit)",
                    "Sales Enablement -> Revenue Intelligence Lead (89% fit)",
                  ].map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={cockpitItemVariants} className={`xl:col-span-6 ${panelClass} p-5 sm:p-6`}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1 text-xs text-rose-200">
                  <Heart className="h-3.5 w-3.5 shrink-0" />
                  Wellbeing & Burnout Index
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-white">Emotion AI from meetings and wearables, translated into recovery actions.</h3>
              </div>
              <RingGauge value={81} color="#22c55e" label="Wellbeing" />
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1.02fr_0.98fr]">
              <div className={`${subPanelClass} p-5`}>
                <div className="w-full h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={wellbeingTrend}>
                      <defs>
                        <linearGradient id="wellbeingGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.42} />
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0.03} />
                        </linearGradient>
                        <linearGradient id="burnoutGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#fb7185" stopOpacity={0.34} />
                          <stop offset="95%" stopColor="#fb7185" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#a1a1aa", fontSize: 12 }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
                      <Tooltip content={<GlassTooltip />} />
                      <Area key="wellbeing-area" type="monotone" dataKey="wellbeing" name="Wellbeing" stroke="#22c55e" strokeWidth={3} fill="url(#wellbeingGradient)" isAnimationActive={false} />
                      <Area key="burnout-area" type="monotone" dataKey="burnout" name="Burnout" stroke="#fb7185" strokeWidth={3} fill="url(#burnoutGradient)" isAnimationActive={false} />
                      <Line key="meeting-sentiment-line" type="monotone" dataKey="sentiment" name="Meeting sentiment" stroke="#38bdf8" strokeWidth={2.5} isAnimationActive={false} dot={renderCockpitLineDot} activeDot={renderCockpitLineActiveDot} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid gap-3">
                {burnoutSignals.map((signal) => (
                  <div key={signal.segment} className={`${subPanelClass} p-4`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-base font-semibold text-white">{signal.segment}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-500">Meeting sentiment: {signal.meetingSentiment}</div>
                      </div>
                      <div className="rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1 text-xs font-medium text-rose-200">
                        {signal.burnoutRisk}% burnout risk
                      </div>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-rose-400" style={{ width: `${signal.wearableStress}%` }} />
                    </div>
                    <div className="mt-2 text-xs text-zinc-400">Wearable stress signal: {signal.wearableStress}%</div>
                  </div>
                ))}

                <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-emerald-200">Personal AI well-being coach</div>
                  <div className="mt-3 text-sm leading-7 text-white">
                    Compress recurring Friday meetings, route recognition nudges to team leads, and auto-schedule one recovery day for the top 12 burnout-risk employees this cycle.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={cockpitItemVariants} className={`xl:col-span-6 ${panelClass} p-5 sm:p-6`}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs text-sky-300">
                  <DollarSign className="h-3.5 w-3.5 shrink-0" />
                  Compensation + Manager Effectiveness
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-white">Compensation benchmark and manager effectiveness in one executive frame.</h3>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right text-xs text-zinc-400">
                Market position
                <div className="mt-1 text-lg font-semibold text-white">97.8%</div>
              </div>
            </div>

            <div className="mt-5 grid gap-5 xl:grid-cols-2">
              <div className={`${subPanelClass} p-5`}>
                <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Compensation benchmark vs market</div>
                <div className="mt-4 w-full h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={compensationBenchmark}>
                      <CartesianGrid stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="function" tickLine={false} axisLine={false} tick={{ fill: "#a1a1aa", fontSize: 11 }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
                      <Tooltip content={<GlassTooltip />} />
                      <ReferenceLine y={100} stroke="#22c55e" strokeDasharray="4 4" />
                      <Bar key="compensation-internal-bar" dataKey="internal" name="Internal pay index" fill="#38bdf8" radius={[8, 8, 0, 0]} isAnimationActive={false} />
                      <Bar key="compensation-market-bar" dataKey="market" name="Market index" fill="#22c55e" radius={[8, 8, 0, 0]} isAnimationActive={false} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={`${subPanelClass} p-5`}>
                <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Manager effectiveness radar</div>
                <div className="mt-4 w-full h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={managerEffectiveness}>
                      <PolarGrid stroke="#ffffff18" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#a1a1aa", fontSize: 11 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                      <Tooltip content={<GlassTooltip />} />
                      <Radar name="Manager effectiveness" dataKey="score" stroke="#22c55e" fill="#22c55e" fillOpacity={0.28} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {autonomousReviews.map((review) => (
                <div key={review.name} className={`${subPanelClass} p-4`}>
                  <div className="text-sm font-semibold text-white">{review.name}</div>
                  <div className="mt-3 text-xs uppercase tracking-[0.18em] text-zinc-500">Autonomous review</div>
                  <div className="mt-2 text-sm leading-6 text-zinc-200">{review.summary}</div>
                  <div className="mt-3 text-xs font-medium text-emerald-300">{review.nextMove}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={cockpitItemVariants} className={`xl:col-span-6 ${panelClass} p-5 sm:p-6`}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs text-amber-300">
                  <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                  Compliance & Legal Risk Scorecard
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-white">AI legal contract intelligence, ethics coverage, and policy automation.</h3>
              </div>
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-right text-xs text-amber-200">
                Legal SLA
                <div className="mt-1 text-lg font-semibold text-white">-34%</div>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {complianceRisks.map((risk) => (
                <div key={risk.area} className={`${subPanelClass} p-4`}>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="text-base font-semibold text-white">{risk.area}</div>
                      <div className="mt-2 text-sm text-zinc-300">{risk.nextAction}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center text-sm">
                      <div className="rounded-2xl bg-black/20 px-3 py-2">
                        <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Risk</div>
                        <div className="mt-1 font-semibold" style={{ color: riskColor(risk.riskScore) }}>
                          {risk.riskScore}
                        </div>
                      </div>
                      <div className="rounded-2xl bg-black/20 px-3 py-2">
                        <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Contracts</div>
                        <div className="mt-1 font-semibold text-white">{risk.contractsReviewed}</div>
                      </div>
                      <div className="rounded-2xl bg-black/20 px-3 py-2">
                        <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Bias drift</div>
                        <div className="mt-1 font-semibold text-white">{risk.biasDrift.toFixed(1)}σ</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {policySignals.map((signal) => (
                <motion.div key={signal.title} whileHover={{ y: -3 }} className={`${subPanelClass} p-4`}>
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    <signal.icon className="h-4.5 w-4.5 shrink-0 text-emerald-300" />
                  </div>
                  <div className="mt-4 text-sm font-semibold text-white">{signal.title}</div>
                  <div className="mt-2 text-xl font-semibold text-white">{signal.value}</div>
                  <div className="mt-2 text-xs leading-6 text-zinc-400">{signal.detail}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={cockpitItemVariants} className={`xl:col-span-7 ${panelClass} p-5 sm:p-6`}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs text-sky-300">
                  <ChartNetwork className="h-3.5 w-3.5 shrink-0" />
                  Real-time Collaboration Heatmap
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-white">Interactive network graph with holographic meeting and translation intelligence.</h3>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right text-xs text-zinc-400">
                Translation hub
                <div className="mt-1 text-lg font-semibold text-white">11 languages live</div>
              </div>
            </div>

            <div className="mt-5 grid gap-5 xl:grid-cols-[1.16fr_0.84fr]">
              <div className={`${subPanelClass} p-5`}>
                <div className="h-[320px] rounded-[28px] border border-white/10 bg-black/25 p-3">
                  <svg viewBox="0 0 100 60" className="h-full w-full overflow-visible">
                    {collaborationEdges.map((edge) => {
                      const from = collaborationNodes.find((node) => node.id === edge.from);
                      const to = collaborationNodes.find((node) => node.id === edge.to);

                      if (!from || !to) {
                        return null;
                      }

                      return (
                        <motion.line
                          key={`${edge.from}-${edge.to}`}
                          x1={from.x}
                          y1={from.y}
                          x2={to.x}
                          y2={to.y}
                          stroke="rgba(56,189,248,0.55)"
                          strokeWidth={0.3 + edge.strength / 80}
                          strokeDasharray="1.5 2"
                          initial={{ pathLength: 0, opacity: 0.1 }}
                          whileInView={{ pathLength: 1, opacity: 0.75 }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.1, ease: "easeOut" }}
                        />
                      );
                    })}

                    {collaborationNodes.map((node) => (
                      <motion.g
                        key={node.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        whileHover={{ scale: 1.08 }}
                        style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                      >
                        <motion.circle
                          cx={node.x}
                          cy={node.y}
                          r={node.size + 2}
                          fill="rgba(16,185,129,0.10)"
                          stroke="rgba(16,185,129,0.18)"
                          animate={{ r: [node.size + 2, node.size + 5, node.size + 2], opacity: [0.25, 0.55, 0.25] }}
                          transition={{ duration: 3.2 + node.pulse / 60, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <circle cx={node.x} cy={node.y} r={node.size} fill="#22c55e" stroke="rgba(255,255,255,0.35)" strokeWidth="0.7" />
                        <text x={node.x + 3.5} y={node.y - 2.4} fill="#f4f4f5" fontSize="3.1">
                          {node.label}
                        </text>
                        <text x={node.x + 3.5} y={node.y + 2.8} fill="#a1a1aa" fontSize="2.5">
                          {node.region}
                        </text>
                      </motion.g>
                    ))}
                  </svg>
                </div>
              </div>

              <div className="grid gap-3">
                <div className={`${subPanelClass} p-4`}>
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <Layers className="h-4 w-4 shrink-0 text-emerald-300" />
                    Holographic meeting insights
                  </div>
                  <div className="mt-3 text-2xl font-semibold text-white">93%</div>
                  <div className="mt-2 text-xs text-zinc-400">Summary fidelity across executive war rooms and cross-border steering meetings.</div>
                </div>
                <div className={`${subPanelClass} p-4`}>
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <Languages className="h-4 w-4 shrink-0 text-sky-300" />
                    Translation hub
                  </div>
                  <div className="mt-3 text-2xl font-semibold text-white">11 live</div>
                  <div className="mt-2 text-xs text-zinc-400">Languages synchronized in onboarding, performance calibration, and leadership reviews.</div>
                </div>
                <div className={`${subPanelClass} p-4`}>
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <CalendarCheck className="h-4 w-4 shrink-0 text-emerald-300" />
                    Meeting sentiment
                  </div>
                  <div className="mt-3 text-2xl font-semibold text-white">76%</div>
                  <div className="mt-2 text-xs text-zinc-400">Meeting rooms are calmer where agenda compression and AI recaps are enabled.</div>
                </div>
                <div className={`${subPanelClass} p-4`}>
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <MapPin className="h-4 w-4 shrink-0 text-sky-300" />
                    Follow-the-sun coverage
                  </div>
                  <div className="mt-3 text-2xl font-semibold text-white">4 hubs</div>
                  <div className="mt-2 text-xs text-zinc-400">APAC, EMEA, AMER, and remote pods are now operating with linked collaboration telemetry.</div>
                </div>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-[28px] border border-white/10 bg-black/20">
              <div className="grid grid-cols-[1.2fr_repeat(5,minmax(0,1fr))] gap-px bg-white/5 text-xs uppercase tracking-[0.16em] text-zinc-500">
                <div className="bg-black/30 px-4 py-3">Hub</div>
                <div className="bg-black/30 px-4 py-3 text-center">APAC</div>
                <div className="bg-black/30 px-4 py-3 text-center">EMEA</div>
                <div className="bg-black/30 px-4 py-3 text-center">AMER</div>
                <div className="bg-black/30 px-4 py-3 text-center">Async</div>
                <div className="bg-black/30 px-4 py-3 text-center">Translation</div>
                {collaborationHeatmap.map((row) => (
                  <div key={row.hub} className="contents">
                    <div className="bg-black/20 px-4 py-4 text-sm font-medium text-white">{row.hub}</div>
                    {[row.apac, row.emea, row.americas, row.async, row.translation].map((value, index) => (
                      <div
                        key={`${row.hub}-${index}`}
                        className="bg-black/20 px-4 py-4 text-center text-sm font-semibold text-white"
                        style={{ backgroundColor: heatColor(value) }}
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div variants={cockpitItemVariants} className={`xl:col-span-5 ${panelClass} p-5 sm:p-6`}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                  <Users className="h-3.5 w-3.5 shrink-0" />
                  DEI + Belonging Index 2.0
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-white">Belonging layers, micro-aggression insights, and ESG workforce footprint.</h3>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right text-xs text-zinc-400">
                Belonging index
                <div className="mt-1 text-lg font-semibold text-white">84</div>
              </div>
            </div>

            <div className="mt-4 w-full h-[320px] rounded-[28px] border border-white/10 bg-black/20 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={diversityBelonging}>
                  <CartesianGrid stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="cohort" tickLine={false} axisLine={false} tick={{ fill: "#a1a1aa", fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
                  <Tooltip content={<GlassTooltip />} />
                  <Bar key="dei-belonging-bar" dataKey="belonging" stackId="dei" name="Belonging" fill="#22c55e" radius={[8, 8, 0, 0]} isAnimationActive={false} />
                  <Bar key="dei-equity-bar" dataKey="equity" stackId="dei" name="Equity" fill="#38bdf8" radius={[8, 8, 0, 0]} isAnimationActive={false} />
                  <Bar key="dei-voice-bar" dataKey="voice" stackId="dei" name="Voice" fill="#a855f7" radius={[8, 8, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              <div className={`${subPanelClass} p-4`}>
                <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Micro-aggression insights</div>
                <div className="mt-4 space-y-3">
                  {microAggressionInsights.map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm leading-6 text-zinc-200">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${subPanelClass} p-4`}>
                <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">ESG + carbon footprint of workforce</div>
                <div className="mt-4 space-y-3">
                  {esgMetrics.map((metric) => (
                    <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <div className="text-sm font-medium text-white">{metric.label}</div>
                      <div className="mt-2 flex items-end justify-between gap-3">
                        <div className="text-2xl font-semibold text-white">{metric.value}</div>
                        <div className="text-xs font-medium text-emerald-300">{metric.change}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={cockpitItemVariants} className={`xl:col-span-12 ${panelClass} p-5 sm:p-6`}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                  <Zap className="h-3.5 w-3.5 shrink-0 text-emerald-300" />
                  Future-Tech Horizon
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-white">Future human systems: translation, BCI, agentic HR, and the metaverse layer.</h3>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right text-xs text-zinc-400">
                Horizon confidence
                <div className="mt-1 text-lg font-semibold text-white">91%</div>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
              {futureSignals.map((signal) => (
                <motion.div
                  key={signal.title}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className={`${subPanelClass} p-4`}
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    <signal.icon className="h-5 w-5 shrink-0 text-emerald-300" />
                  </div>
                  <div className="mt-4 text-sm font-semibold text-white">{signal.title}</div>
                  <div className="mt-2 text-xl font-semibold text-white">{signal.value}</div>
                  <div className="mt-3 text-sm leading-6 text-zinc-300">{signal.detail}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        <AnimatePresence>
          {copilotOpen ? (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.96 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="pointer-events-auto w-[min(92vw,420px)] overflow-hidden rounded-[28px] border border-emerald-400/20 bg-zinc-950/92 shadow-[0_40px_120px_-45px_rgba(16,185,129,0.65)] backdrop-blur-2xl"
            >
              <div className="border-b border-white/10 bg-gradient-to-r from-emerald-500/15 to-sky-500/15 px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-emerald-300">Executive Decision Copilot</div>
                    <div className="mt-1 text-lg font-semibold text-white">Ask AI Copilot</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCopilotOpen(false)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="space-y-3 px-4 py-4">
                {copilotMessages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`max-w-[92%] rounded-3xl px-4 py-3 text-sm leading-7 ${
                      message.role === "user"
                        ? "ml-auto border border-sky-400/20 bg-sky-400/10 text-sky-100"
                        : "border border-white/10 bg-white/5 text-zinc-100"
                    }`}
                  >
                    {message.text}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 border-t border-white/10 px-4 py-4">
                <button
                  type="button"
                  onClick={() => setSelectedScenarioIndex(1)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300"
                >
                  Simulate CFO exit
                </button>
                <button
                  type="button"
                  onClick={() => setAttritionShock(24)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300"
                >
                  Raise attrition shock
                </button>
                <button
                  type="button"
                  onClick={() => setMobilityBoost(18)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300"
                >
                  Increase mobility boost
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <motion.button
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => setCopilotOpen((open) => !open)}
          className="pointer-events-auto inline-flex items-center gap-3 rounded-full border border-emerald-400/20 bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-3 text-sm font-medium text-white shadow-[0_22px_70px_-28px_rgba(16,185,129,0.8)]"
        >
          <Bot className="h-4.5 w-4.5 shrink-0" />
          Ask AI Copilot
        </motion.button>
      </div>
    </>
  );
}
