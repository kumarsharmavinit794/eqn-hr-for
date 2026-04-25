import { useCallback, useEffect, useMemo, useState } from "react";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Brain,
  Briefcase,
  Calendar,
  CalendarCheck,
  Gauge,
  Gift,
  Heart,
  Layers,
  MapPin,
  Plane,
  Smile,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users,
  Users2,
  Zap,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AIHRCommandCockpit2027 } from "@/components/AIHRCommandCockpit2027";
import {
  SafeChart,
  SafeChartFallback,
  SafeChartTooltip,
  createSafeDotRenderer,
  hasChartData,
} from "@/components/charts/SafeChart";
import { SectionGuard } from "@/components/common/ErrorBoundary";
import { getStoredRole } from "@/lib/auth";
import api from "@/lib/api";
import {
  clampNumber,
  fallbackDashboardData,
  sanitizeCollection,
  sanitizeDashboardData,
  toSafeNumber,
  toSafeString,
  type DashboardData,
} from "@/utils/dataSanitizer";

const COLORS = ["#22C55E", "#3B82F6", "#A855F7", "#EF4444", "#8B5CF6"];
const SECTION_ERROR_MESSAGE = "Unable to load this section.";
const MAX_RECRUITMENT_STAGE = 184;

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 90, damping: 15 },
  },
};

const colorMap = {
  emerald: {
    bg: "bg-emerald-100 dark:bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-300 dark:border-emerald-500/30",
  },
  blue: {
    bg: "bg-blue-100 dark:bg-blue-500/10",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-300 dark:border-blue-500/30",
  },
  purple: {
    bg: "bg-violet-100 dark:bg-purple-500/10",
    text: "text-violet-700 dark:text-purple-400",
    border: "border-violet-300 dark:border-purple-500/30",
  },
  amber: {
    bg: "bg-amber-100 dark:bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-300 dark:border-amber-500/30",
  },
  rose: {
    bg: "bg-rose-100 dark:bg-rose-500/10",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-300 dark:border-rose-500/30",
  },
} as const;

const dotColorMap = {
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  emerald: "bg-emerald-500",
  blue: "bg-blue-500",
  purple: "bg-purple-500",
} as const;

const theme = {
  heading: "text-zinc-900 dark:text-white",
  body: "text-zinc-600 dark:text-zinc-400",
  muted: "text-zinc-500 dark:text-zinc-500",
  card: "bg-white/90 dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/10",
  icon: "text-zinc-700 dark:text-zinc-300",
  accentIcon: "text-emerald-600 dark:text-emerald-400",
  subtleSurface: "bg-zinc-100 dark:bg-white/10",
  pill: "bg-zinc-100 text-zinc-700 dark:bg-white/10 dark:text-white/80",
} as const;

const dashboardContentLayerClass =
  "dashboard-content-layer relative isolate z-10 pointer-events-auto";
const dashboardDecorativeLayerClass =
  "dashboard-decorative-layer pointer-events-none absolute inset-0 z-0";
const pageWrapperClass =
  "dashboard-shell-layer relative w-full max-w-full overflow-x-hidden px-3 sm:px-4 lg:px-6";
const sectionHeaderClass =
  "flex min-w-0 w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between";
const sectionCardClass = `${dashboardContentLayerClass} min-w-0 w-full overflow-hidden rounded-3xl ${theme.card} p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] backdrop-blur-2xl sm:p-8`;
const interactiveSectionCardClass = `${sectionCardClass} transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.22)]`;
const innerCardClass = `${dashboardContentLayerClass} min-w-0 w-full overflow-hidden break-words rounded-3xl ${theme.card} p-6 backdrop-blur-2xl`;
const headingTextClass = theme.heading;
const bodyTextClass = theme.body;
const mutedTextClass = theme.muted;
const iconTextClass = theme.icon;
const accentIconTextClass = theme.accentIcon;

const HERO_ACTIONS = [
  {
    label: "Run Pulse Survey",
    icon: Zap,
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    label: "Add Recognition",
    icon: Heart,
    gradient: "from-pink-500 to-rose-500",
  },
  {
    label: "Launch Initiative",
    icon: Users,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    label: "View Full Report",
    icon: BarChart3,
    gradient: "from-purple-500 to-violet-500",
  },
];

const AI_INSIGHTS = [
  {
    icon: Brain,
    title: "Engineering engagement increased 12%",
    desc: "Strong correlation with new recognition program",
    confidence: 94,
    type: "positive",
    badge: "Opportunity",
  },
  {
    icon: TrendingDown,
    title: "HR department has highest attrition risk",
    desc: "3 key employees likely to leave in next 90 days",
    confidence: 87,
    type: "risk",
    badge: "Risk",
  },
  {
    icon: CalendarCheck,
    title: "Friday meetings correlate with -4% attendance",
    desc: "Consider moving to Thursday or async updates",
    confidence: 91,
    type: "neutral",
    badge: "Insight",
  },
  {
    icon: Heart,
    title: "Low recognition scores = 2.3× burnout risk",
    desc: "Targeted kudos campaigns recommended",
    confidence: 89,
    type: "risk",
    badge: "Warning",
  },
  {
    icon: Users,
    title: "Remote employees have +11 eNPS vs hybrid",
    desc: "Flexibility is a key retention driver",
    confidence: 96,
    type: "positive",
    badge: "Positive",
  },
] as const;

const PREDICTIVE_METRICS = [
  {
    title: "Attrition Risk",
    value: 14,
    trend: "-3%",
    status: "Improving",
    color: "#22C55E",
  },
  {
    title: "Burnout Risk",
    value: 23,
    trend: "+2%",
    status: "Warning",
    color: "#F59E0B",
  },
  {
    title: "Flight Risk",
    value: 9,
    trend: "-5%",
    status: "Stable",
    color: "#3B82F6",
  },
  {
    title: "Promotion Readiness",
    value: 31,
    trend: "+8%",
    status: "Healthy",
    color: "#A855F7",
  },
] as const;

const ENPS = 41;
const PROMOTERS = 62;
const PASSIVES = 24;
const DETRACTORS = 14;

const ENPS_BENCHMARK = [
  { industry: "Technology", score: 38 },
  { industry: "Healthcare", score: 24 },
  { industry: "Manufacturing", score: 12 },
  { industry: "Retail", score: 18 },
  { industry: "Finance", score: 31 },
  { industry: "HR Services", score: 42 },
] as const;

const ENGAGEMENT_STRATEGIES = [
  { icon: Trophy, title: "Recognition & Rewards", impact: "+18%", priority: "High" },
  { icon: Users, title: "Leadership Communication", impact: "+14%", priority: "High" },
  { icon: Calendar, title: "Flexible Work Policy", impact: "+11%", priority: "Medium" },
  { icon: BookOpen, title: "Career Growth Pathways", impact: "+22%", priority: "High" },
] as const;

const TEAM_HEALTH = [
  { label: "Morale", score: 84, color: "#22C55E" },
  { label: "Productivity", score: 91, color: "#3B82F6" },
  { label: "Collaboration", score: 77, color: "#A855F7" },
  { label: "Workload Balance", score: 69, color: "#F59E0B" },
] as const;

const DIVERSITY_DATA = {
  gender: { female: 42, male: 56, other: 2 },
  age: { "18-30": 31, "31-40": 48, "41+": 21 },
  inclusivityScore: 76,
} as const;

const LND_METRICS = [
  { title: "Courses Completed", value: 184, trend: "+34" },
  { title: "Training Hours", value: "2,847", trend: "+12%" },
  { title: "Certifications Earned", value: 67, trend: "+9" },
] as const;

const RECOGNITION_DATA = {
  totalThisMonth: 412,
  mostRecognized: "Neha Kapoor",
} as const;

const QUICK_INSIGHTS = [
  {
    title: "Overall Engagement",
    value: "82",
    icon: Smile,
    trend: "+5 pts",
    color: "emerald",
  },
  {
    title: "eNPS Score",
    value: "41",
    icon: Heart,
    trend: "+8",
    color: "blue",
  },
  {
    title: "Survey Participation",
    value: "87%",
    icon: Users2,
    trend: "↑ 12%",
    color: "amber",
  },
  {
    title: "Retention Risk",
    value: "9%",
    icon: TrendingUp,
    trend: "-3%",
    color: "emerald",
  },
] as const;

const RECENT_ACTIVITIES = [
  {
    icon: Smile,
    title: "Q2 Engagement Survey closed",
    desc: "1,184 responses • 87% participation",
    time: "14 min ago",
  },
  {
    icon: Users,
    title: "Rahul Sharma promoted",
    desc: "Engineering • +12% engagement impact",
    time: "41 min ago",
  },
  {
    icon: Heart,
    title: "Wellbeing initiative launched",
    desc: "Mental health days approved",
    time: "3 hours ago",
  },
  {
    icon: Zap,
    title: "Recognition program updated",
    desc: "New peer-to-peer kudos system",
    time: "5 hours ago",
  },
] as const;

const NOTIFICATIONS = [
  { text: "Engagement pulse survey due in 3 days", dot: "amber" },
  { text: "4 departments below 75% engagement threshold", dot: "rose" },
  { text: "eNPS benchmark updated — now at industry top 20%", dot: "emerald" },
] as const;

const ATTENDANCE_SUMMARY = [
  { label: "Present", value: "1,142", percent: "91%", color: "#22C55E" },
  { label: "Absent", value: "47", percent: "4%", color: "#EF4444" },
  { label: "On Leave", value: "38", percent: "3%", color: "#F59E0B" },
  { label: "Late", value: "21", percent: "2%", color: "#EA580C" },
] as const;

const TOP_PERFORMERS = [
  {
    name: "Neha Kapoor",
    dept: "Engineering",
    score: 96,
    avatar: "https://i.pravatar.cc/48?u=neha",
    rank: 1,
  },
  {
    name: "Vikram Singh",
    dept: "Sales",
    score: 93,
    avatar: "https://i.pravatar.cc/48?u=vikram",
    rank: 2,
  },
  {
    name: "Ananya Sharma",
    dept: "Marketing",
    score: 91,
    avatar: "https://i.pravatar.cc/48?u=ananya",
    rank: 3,
  },
] as const;

const LEAVE_REQUESTS = [
  {
    id: 1,
    name: "Rohan Mehta",
    avatar: "https://i.pravatar.cc/32?u=rohan",
    type: "Sick Leave",
    days: "2",
    status: "Pending",
  },
  {
    id: 2,
    name: "Sneha Iyer",
    avatar: "https://i.pravatar.cc/32?u=sneha",
    type: "Annual Leave",
    days: "5",
    status: "Pending",
  },
] as const;

const UPCOMING_EVENTS = [
  {
    title: "Company Holiday – Independence Day",
    date: "15 Aug 2026",
    time: "All Day",
    type: "Holiday",
    daysLeft: 12,
    description: "Office will remain closed.",
    icon: Calendar,
    color: "emerald",
  },
  {
    title: "Team Trip – Jaipur Resort",
    date: "22 Aug 2026",
    time: "10:00 AM",
    type: "Trip",
    daysLeft: 19,
    description: "Annual team outing for all departments.",
    icon: Plane,
    color: "blue",
  },
  {
    title: "Monthly Townhall Meeting",
    date: "28 Aug 2026",
    time: "4:00 PM",
    type: "Meeting",
    daysLeft: 25,
    description: "Leadership updates and Q&A.",
    icon: Users,
    color: "rose",
  },
  {
    title: "Priya Sharma Birthday",
    date: "30 Aug 2026",
    time: "12:00 PM",
    type: "Birthday",
    daysLeft: 27,
    description: "Celebration in cafeteria.",
    icon: Gift,
    color: "purple",
  },
  {
    title: "Diwali Festival Celebration",
    date: "10 Nov 2026",
    time: "All Day",
    type: "Festival",
    daysLeft: 99,
    description: "Office closed + virtual events.",
    icon: MapPin,
    color: "amber",
  },
] as const;

const OKR_TRACKING = [
  {
    objective: "Achieve 30% revenue growth in FY26",
    progress: 78,
    status: "On Track",
    color: "#22C55E",
    keyResults: "4 of 5 KRs completed",
  },
  {
    objective: "Improve employee engagement score to 85",
    progress: 64,
    status: "At Risk",
    color: "#F59E0B",
    keyResults: "3 of 5 KRs on track",
  },
  {
    objective: "Reduce voluntary attrition to <8%",
    progress: 92,
    status: "On Track",
    color: "#22C55E",
    keyResults: "All KRs exceeding targets",
  },
  {
    objective: "Launch 3 new DE&I initiatives",
    progress: 45,
    status: "Behind",
    color: "#EF4444",
    keyResults: "1 of 3 initiatives live",
  },
] as const;

const AI_SUMMARY_BANNER = {
  risks: 3,
  opportunities: 2,
  urgentActions: 1,
  summary:
    "Burnout risk in Engineering increased 8%. Schedule retention meeting this week.",
} as const;

const RECRUITMENT_PIPELINE = [
  { stage: "Applied", count: 184, color: "#64748B" },
  { stage: "Screened", count: 92, color: "#3B82F6" },
  { stage: "Interview", count: 31, color: "#A855F7" },
  { stage: "Offer", count: 14, color: "#22C55E" },
] as const;

const FORECAST_DATA = sanitizeCollection(
  [
    { month: "May", headcount: 1260, plan: 1280, target: 1300 },
    { month: "Jun", headcount: 1275, plan: 1300, target: 1320 },
    { month: "Jul", headcount: 1290, plan: 1320, target: 1340 },
  ],
  (item, index) => {
    const entry =
      typeof item === "object" && item !== null
        ? (item as Record<string, unknown>)
        : {};

    return {
      month: toSafeString(entry.month, `Month ${index + 1}`),
      headcount: Math.max(0, Math.round(toSafeNumber(entry.headcount, 0))),
      plan: Math.max(0, Math.round(toSafeNumber(entry.plan, 0))),
      target: Math.max(0, Math.round(toSafeNumber(entry.target, 0))),
    };
  },
);

const SENTIMENT_DATA = sanitizeCollection(
  [
    { name: "Positive", value: 68, color: "#22C55E" },
    { name: "Neutral", value: 24, color: "#F59E0B" },
    { name: "Negative", value: 8, color: "#EF4444" },
  ],
  (item, index) => {
    const entry =
      typeof item === "object" && item !== null
        ? (item as Record<string, unknown>)
        : {};

    return {
      name: toSafeString(entry.name, `Sentiment ${index + 1}`),
      value: clampNumber(entry.value, 0, 100, 0),
      color:
        typeof entry.color === "string" && entry.color.trim().length > 0
          ? entry.color
          : COLORS[index % COLORS.length],
    };
  },
);

const getDashboardDebugFlag = (): boolean => {
  if (!import.meta.env.DEV || typeof window === "undefined") {
    return false;
  }

  try {
    const params = new URLSearchParams(window.location.search);
    return params.has("debugDashboard") || params.has("debugInteractions");
  } catch {
    return false;
  }
};

const SafeAIHRCommandCockpit = () => {
  const fallback = (
    <SafeChartFallback
      className="rounded-3xl"
      message={SECTION_ERROR_MESSAGE}
      minHeightClassName="min-h-[220px]"
    />
  );

  if (typeof AIHRCommandCockpit2027 !== "function") {
    return fallback;
  }

  return (
    <SectionGuard fallback={fallback} resetKey="ai-cockpit">
      <AIHRCommandCockpit2027 />
    </SectionGuard>
  );
};

export default function DashboardPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [data, setData] = useState<DashboardData>(fallbackDashboardData);
  const [currentTime, setCurrentTime] = useState(() => new Date());

  const dashboardDebugEnabled = useMemo(getDashboardDebugFlag, []);

  const logDebug = useCallback(
    (message: string, payload?: unknown) => {
      if (import.meta.env.DEV && dashboardDebugEnabled) {
        console.debug(`[DashboardPage] ${message}`, payload);
      }
    },
    [dashboardDebugEnabled],
  );

  const role = useMemo(() => {
    try {
      return getStoredRole();
    } catch {
      return null;
    }
  }, []);

  const axisColor = isDark ? "#a1a1aa" : "#52525b";
  const gridColor = isDark ? "#ffffff15" : "#d4d4d8";
  const chartTrackColor = isDark ? "#ffffff10" : "#e4e4e7";
  const activeDotStrokeColor = isDark ? "#ffffff" : "#18181b";

  const chartTickStyle = useMemo(
    () => ({ fontSize: 10, fill: axisColor }),
    [axisColor],
  );

  const legendWrapperStyle = useMemo(
    () => ({ fontSize: 12, color: axisColor }),
    [axisColor],
  );

  const legendFormatter = useCallback(
    (value: string) => (
      <span className={bodyTextClass}>{toSafeString(value, "Series")}</span>
    ),
    [],
  );

  const departmentDot = useMemo(
    () => createSafeDotRenderer({ r: 6, fill: "#3B82F6" }),
    [],
  );
  const departmentActiveDot = useMemo(
    () =>
      createSafeDotRenderer({
        r: 8,
        fill: "#3B82F6",
        stroke: activeDotStrokeColor,
        strokeWidth: 2,
      }),
    [activeDotStrokeColor],
  );
  const forecastPlanDot = useMemo(
    () => createSafeDotRenderer({ r: 5, fill: "#3B82F6" }),
    [],
  );
  const forecastPlanActiveDot = useMemo(
    () =>
      createSafeDotRenderer({
        r: 7,
        fill: "#3B82F6",
        stroke: activeDotStrokeColor,
        strokeWidth: 2,
      }),
    [activeDotStrokeColor],
  );
  const forecastTargetActiveDot = useMemo(
    () =>
      createSafeDotRenderer({
        r: 7,
        fill: "#A855F7",
        stroke: activeDotStrokeColor,
        strokeWidth: 2,
      }),
    [activeDotStrokeColor],
  );
  const attendanceDot = useMemo(
    () => createSafeDotRenderer({ r: 5, fill: "#22C55E" }),
    [],
  );
  const attendanceActiveDot = useMemo(
    () =>
      createSafeDotRenderer({
        r: 7,
        fill: "#22C55E",
        stroke: activeDotStrokeColor,
        strokeWidth: 2,
      }),
    [activeDotStrokeColor],
  );

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (dashboardDebugEnabled) {
      logDebug("Debug mode enabled");
    }
  }, [dashboardDebugEnabled, logDebug]);

  useEffect(() => {
    let isActive = true;

    const loadDashboard = async () => {
      try {
        const response = await api.get("/dashboard");
        const sanitizedData = sanitizeDashboardData(response?.data?.data);

        if (!isActive) {
          return;
        }

        logDebug("Fetched dashboard payload", {
          raw: response?.data?.data,
          sanitized: sanitizedData,
        });

        setData(sanitizedData);
      } catch (error) {
        if (!isActive) {
          return;
        }

        if (import.meta.env.DEV) {
          console.warn(
            "[DashboardPage] Failed to load /dashboard. Falling back to static data.",
            error,
          );
        }

        logDebug("Dashboard request failed. Using fallback dataset.", error);
        setData(fallbackDashboardData);
      }
    };

    void loadDashboard();

    return () => {
      isActive = false;
    };
  }, [logDebug]);

  const greeting = useMemo(() => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, [currentTime]);

  const formattedDate = useMemo(
    () =>
      currentTime.toLocaleDateString("en-IN", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    [currentTime],
  );

  const audienceLabel = useMemo(() => {
    if (role === "admin") return "Admin";
    if (role === "employee") return "Team Member";
    return "HR Leader";
  }, [role]);

  const safeDepartmentData = useMemo(
    () =>
      data.departmentData.filter(
        (item) => typeof item.name === "string" && item.name.trim().length > 0,
      ),
    [data.departmentData],
  );

  const safeAttendanceTrend = useMemo(
    () =>
      data.attendanceTrend.filter(
        (item) => typeof item.day === "string" && item.day.trim().length > 0,
      ),
    [data.attendanceTrend],
  );

  const safeForecastData = useMemo(() => FORECAST_DATA, []);
  const safeSentimentData = useMemo(() => SENTIMENT_DATA, []);

  const safeAttendanceDomain = useMemo<[number, number]>(() => {
    const values = safeAttendanceTrend
      .map((item) => item.attendance)
      .filter((value) => Number.isFinite(value));

    if (values.length === 0) {
      return [80, 100];
    }

    const min = Math.min(...values);
    const max = Math.max(...values);

    return [
      Math.max(0, Math.floor(min - 2)),
      Math.min(100, Math.ceil(max + 2)),
    ];
  }, [safeAttendanceTrend]);

  const sentimentScore = useMemo(() => {
    const positive =
      safeSentimentData.find((item) => item.name === "Positive")?.value ?? 0;
    const neutral =
      safeSentimentData.find((item) => item.name === "Neutral")?.value ?? 0;

    return Math.max(0, Math.min(100, Math.round(positive + neutral / 2)));
  }, [safeSentimentData]);

  const hasForecastData = useMemo(
    () =>
      safeForecastData.some(
        (item) => item.headcount > 0 || item.plan > 0 || item.target > 0,
      ),
    [safeForecastData],
  );

  const hasSentimentData = useMemo(
    () => safeSentimentData.some((item) => item.value > 0),
    [safeSentimentData],
  );

  const coreStats = useMemo(
    () => [
      {
        title: "Total Headcount",
        value: data.totalEmployees,
        icon: Users,
        trend: "+38 this month",
        status: "Growing",
        accent: "#22C55E",
      },
      {
        title: "Active Recruitment",
        value: data.activeRecruitment,
        icon: Briefcase,
        trend: "47 open roles",
        status: "High",
        accent: "#3B82F6",
      },
      {
        title: "Avg Attendance",
        value: `${data.attendanceRate}%`,
        icon: CalendarCheck,
        trend: "+2.4% MoM",
        status: "Stable",
        accent: "#22C55E",
      },
      {
        title: "Avg Performance",
        value: data.avgPerformance,
        icon: Target,
        trend: "↑ 4 pts",
        status: "Excellent",
        accent: "#A855F7",
      },
    ],
    [data],
  );

  return (
    <div
      className={pageWrapperClass}
      data-interaction-debug={dashboardDebugEnabled ? "true" : undefined}
      style={{ contain: "layout paint" }}
    >
      <motion.div
        animate="show"
        className="dashboard-shell-layer relative min-w-0 w-full flex flex-col gap-6 overflow-x-hidden pb-10"
        initial="hidden"
        variants={container}
      >
        <SectionGuard resetKey="hero">
          <motion.div
            className={`${dashboardContentLayerClass} min-w-0 w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f172a] via-[#1e2937] to-[#111827] shadow-2xl`}
            variants={cardVariants}
          >
            <div
              className={`${dashboardDecorativeLayerClass} bg-[radial-gradient(at_30%_20%,rgba(16,185,129,0.18),transparent)]`}
            />
            <div
              className={`${dashboardDecorativeLayerClass} bg-[radial-gradient(at_70%_80%,rgba(59,130,246,0.15),transparent)]`}
            />
            <div className="relative z-10 flex min-w-0 w-full flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:p-10">
              <div className="min-w-0 flex-1">
                <div className="mb-6 inline-flex max-w-full items-center gap-3 rounded-3xl bg-white/10 px-4 py-1.5 backdrop-blur-md">
                  <div className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-400" />
                  <span className="break-words text-xs font-medium tracking-widest text-emerald-300">
                    AI-POWERED HR OPERATING SYSTEM • LIVE
                  </span>
                </div>
                <h1 className="break-words text-3xl font-semibold leading-none tracking-tighter text-white sm:text-4xl xl:text-6xl">
                  {greeting}, {audienceLabel}
                </h1>
                <p className="mt-4 max-w-full break-words text-base text-zinc-300 line-clamp-none sm:text-lg lg:max-w-2xl lg:text-xl">
                  Executive workforce intelligence. AI insights, predictive analytics,
                  and real-time people metrics.
                </p>
                <div className="mt-8 flex min-w-0 flex-wrap items-center gap-4 text-sm text-zinc-300 sm:gap-8">
                  <div className="break-words">{formattedDate}</div>
                  <div className="h-px w-8 bg-white/30" />
                  <div>Updated 3 min ago</div>
                </div>
              </div>
              <div className="flex w-full flex-wrap gap-3 lg:w-auto lg:justify-end">
                {HERO_ACTIONS.map((button) => (
                  <motion.button
                    key={`hero-action-${button.label}`}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-gradient-to-r ${button.gradient} px-5 py-3 text-sm font-medium text-white shadow-lg shadow-black/40 transition-all sm:w-auto sm:px-7 sm:py-4`}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <button.icon className="h-4 w-4 shrink-0" />
                    <span className="break-words text-center">{button.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </SectionGuard>

        <SectionGuard resetKey="ai-summary">
          <motion.div
            className={`${sectionCardClass} bg-gradient-to-r from-emerald-500/10 to-blue-500/10`}
            variants={cardVariants}
          >
            <div className={`${sectionHeaderClass} gap-4 sm:gap-6 lg:gap-8`}>
              <div className="flex min-w-0 items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <Brain className="h-5 w-5 shrink-0" />
                <span className={`font-semibold ${headingTextClass}`}>AI Summary</span>
              </div>
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3 sm:gap-4 lg:gap-8">
                <span className="shrink-0 rounded-3xl bg-rose-100 px-3 py-1 text-xs font-medium text-rose-700 dark:bg-rose-500/10 dark:text-rose-400">
                  {AI_SUMMARY_BANNER.risks} Risks
                </span>
                <span className="shrink-0 rounded-3xl bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                  {AI_SUMMARY_BANNER.opportunities} Opportunities
                </span>
                <span className="shrink-0 rounded-3xl bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                  {AI_SUMMARY_BANNER.urgentActions} Urgent Actions
                </span>
                <p className={`min-w-0 flex-1 break-words ${bodyTextClass}`}>
                  {AI_SUMMARY_BANNER.summary}
                </p>
              </div>
              <button
                className={`inline-flex w-full items-center justify-center gap-2 rounded-3xl px-5 py-3 text-sm font-medium text-zinc-900 transition-all hover:bg-zinc-200 sm:w-auto dark:text-white dark:hover:bg-white/20 ${theme.subtleSurface}`}
              >
                Generate Full Report
              </button>
            </div>
          </motion.div>
        </SectionGuard>

        <SectionGuard resetKey="core-stats">
          <div className="grid min-w-0 w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {coreStats.map((stat) => (
              <motion.div
                key={`core-stat-${stat.title}`}
                className={`${interactiveSectionCardClass} min-w-0 overflow-hidden break-words`}
                variants={cardVariants}
              >
                <div className="flex min-w-0 w-full flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className={`break-words text-sm ${bodyTextClass}`}>{stat.title}</p>
                    <p className={`mt-3 break-words text-3xl font-semibold sm:text-4xl ${headingTextClass}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl ${theme.subtleSurface}`}
                    style={{ color: stat.accent }}
                  >
                    <stat.icon className="h-7 w-7 shrink-0" />
                  </div>
                </div>
                <div className="mt-8 flex min-w-0 w-full flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
                  <span className={`shrink-0 rounded-3xl px-4 py-1 text-xs ${theme.pill}`}>
                    {stat.status}
                  </span>
                  <span className="break-words text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {stat.trend}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionGuard>

        <SectionGuard resetKey="ai-insights">
          <motion.div className={sectionCardClass} variants={cardVariants}>
            <div className={`mb-6 ${sectionHeaderClass}`}>
              <h2 className={`flex min-w-0 items-center gap-2 text-xl font-semibold ${headingTextClass}`}>
                <Brain className={`h-5 w-5 shrink-0 ${accentIconTextClass}`} />
                AI Workforce Insights
              </h2>
              <span className={`text-xs ${bodyTextClass}`}>Powered by NEXA • Updated live</span>
            </div>
            <div className="grid min-w-0 w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
              {AI_INSIGHTS.map((insight) => (
                <motion.div
                  key={`ai-insight-${insight.badge}-${insight.title}`}
                  className={`${interactiveSectionCardClass} min-w-0 overflow-hidden break-words p-6`}
                  variants={cardVariants}
                >
                  <div
                    className={`pointer-events-none absolute right-6 top-6 rounded-3xl px-3 py-1 text-xs font-medium ${
                      insight.type === "positive"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : insight.type === "risk"
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                    }`}
                  >
                    {insight.badge}
                  </div>
                  <div className="mb-4 flex min-w-0 items-center gap-3">
                    <insight.icon className={`h-6 w-6 shrink-0 ${iconTextClass}`} />
                    <p className={`min-w-0 flex-1 break-words text-sm font-medium leading-tight line-clamp-none ${headingTextClass}`}>
                      {insight.title}
                    </p>
                  </div>
                  <p className={`mb-6 break-words text-xs line-clamp-none ${bodyTextClass}`}>
                    {insight.desc}
                  </p>
                  <div className="flex min-w-0 w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                    <div className={`text-xs ${bodyTextClass}`}>
                      Confidence{" "}
                      <span className="font-mono text-emerald-600 dark:text-emerald-400">
                        {insight.confidence}%
                      </span>
                    </div>
                    <button className="inline-flex items-center gap-1 text-xs text-emerald-600 transition-colors hover:text-zinc-900 dark:text-emerald-400 dark:hover:text-white">
                      AI Recommendation <ArrowRight className="h-3 w-3 shrink-0" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </SectionGuard>

        <SectionGuard resetKey="department-collaboration">
          <motion.div className={interactiveSectionCardClass} variants={cardVariants}>
            <div className={`mb-6 ${sectionHeaderClass}`}>
              <h2 className={`flex min-w-0 items-center gap-2 text-xl font-semibold ${headingTextClass}`}>
                <Layers className={`h-5 w-5 shrink-0 ${accentIconTextClass}`} /> Department Collaboration Network
              </h2>
              <span className="rounded-3xl bg-emerald-100 px-4 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                Interactive • Recharts
              </span>
            </div>
            <SectionGuard message={SECTION_ERROR_MESSAGE} resetKey="department-collaboration-chart">
              <SafeChart
                emptyMessage={SECTION_ERROR_MESSAGE}
                hasData={hasChartData(safeDepartmentData)}
              >
                <ResponsiveContainer height="100%" width="100%">
                  <ComposedChart data={safeDepartmentData}>
                    <CartesianGrid stroke={gridColor} />
                    <XAxis
                      axisLine={{ stroke: gridColor }}
                      dataKey="name"
                      interval="preserveStartEnd"
                      tick={chartTickStyle}
                      tickLine={false}
                    />
                    <YAxis
                      axisLine={{ stroke: gridColor }}
                      tick={chartTickStyle}
                      tickLine={false}
                    />
                    <Tooltip content={<SafeChartTooltip />} />
                    <Legend formatter={legendFormatter} wrapperStyle={legendWrapperStyle} />
                    <Bar
                      dataKey="value"
                      fill="#22C55E"
                      isAnimationActive={false}
                      name="Collaboration Score"
                      radius={[8, 8, 0, 0]}
                    />
                    <Line
                      activeDot={departmentActiveDot}
                      dataKey="value"
                      dot={departmentDot}
                      isAnimationActive={false}
                      name="Engagement Trend"
                      stroke="#3B82F6"
                      strokeWidth={4}
                      type="monotone"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </SafeChart>
            </SectionGuard>
          </motion.div>
        </SectionGuard>

        <SectionGuard resetKey="upcoming-events">
          <motion.div className={`${sectionCardClass} overflow-visible`} variants={cardVariants}>
            <div className={`mb-6 ${sectionHeaderClass}`}>
              <h2 className={`flex min-w-0 items-center gap-2 text-xl font-semibold ${headingTextClass}`}>
                <Calendar className={`h-5 w-5 shrink-0 ${accentIconTextClass}`} /> Upcoming Events &amp; Holidays
              </h2>
              <button className="inline-flex items-center gap-1 text-xs text-emerald-600 transition-colors hover:text-zinc-900 dark:text-emerald-400 dark:hover:text-white">
                View Full Calendar <ArrowRight className="h-3 w-3 shrink-0" />
              </button>
            </div>
            <div className="grid min-w-0 w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
              {UPCOMING_EVENTS.map((event, index) => {
                const styles =
                  colorMap[event.color as keyof typeof colorMap] ?? colorMap.emerald;
                const isNext = index === 0;

                return (
                  <motion.div
                    key={`upcoming-event-${event.date}-${event.title}`}
                    className={`${interactiveSectionCardClass} min-w-0 w-full overflow-hidden p-6 ${isNext ? "border-emerald-400/60 shadow-xl" : ""}`}
                    variants={cardVariants}
                  >
                    {isNext && (
                      <div className="pointer-events-none absolute right-4 top-4 rounded-3xl bg-emerald-600 px-2.5 py-0.5 text-[10px] font-medium text-white dark:bg-emerald-500">
                        NEXT EVENT
                      </div>
                    )}
                    <div className="flex min-w-0 items-start gap-4">
                      <div
                        className={`${styles.bg} flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl`}
                      >
                        <event.icon className={`${styles.text} h-5 w-5 shrink-0`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className={`mb-2 inline-flex rounded-3xl px-3 py-1 text-xs font-medium ${styles.bg} ${styles.text}`}>
                          {event.type}
                        </div>
                        <p className={`break-words text-sm font-medium leading-tight line-clamp-none ${headingTextClass}`}>
                          {event.title}
                        </p>
                        <p className={`mt-3 break-words text-xs ${bodyTextClass}`}>
                          {event.date} • {event.time}
                        </p>
                        <p className={`mt-4 break-words text-xs line-clamp-none ${mutedTextClass}`}>
                          {event.description}
                        </p>
                        <div className="mt-6 flex min-w-0 w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                          <div className={`shrink-0 rounded-3xl px-3 py-1 text-xs font-medium ${theme.pill}`}>
                            {event.daysLeft} days left
                          </div>
                          {event.daysLeft <= 7 && (
                            <div className="shrink-0 text-xs font-medium text-rose-600 dark:text-rose-400">
                              Urgent
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className={`${innerCardClass} mt-8`}>
              <div className={`mb-4 ${sectionHeaderClass}`}>
                <p className={`text-sm font-medium ${headingTextClass}`}>August 2026</p>
                <div className={`text-xs ${bodyTextClass}`}>Mini Calendar</div>
              </div>
              <div className="overflow-x-auto">
                <div className="grid min-w-[280px] grid-cols-7 gap-1 text-center text-xs sm:min-w-[320px]">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                    <div
                      key={`mini-calendar-weekday-${day}-${index}`}
                      className={`font-medium ${bodyTextClass}`}
                    >
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 35 }).map((_, index) => (
                    <div
                      key={`mini-calendar-slot-${index + 1}`}
                      className={`flex h-7 items-center justify-center rounded-xl text-[10px] ${index === 14 ? "bg-emerald-500 text-white" : bodyTextClass}`}
                    >
                      {index + 1 > 31 ? "" : index + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </SectionGuard>

        <SectionGuard resetKey="okr-tracking">
          <motion.div className={sectionCardClass} variants={cardVariants}>
            <div className={`mb-6 ${sectionHeaderClass}`}>
              <h2 className={`flex min-w-0 items-center gap-2 text-xl font-semibold ${headingTextClass}`}>
                <Trophy className={`h-5 w-5 shrink-0 ${accentIconTextClass}`} /> OKR Tracking
              </h2>
              <span className="text-xs text-emerald-600 dark:text-emerald-400">
                Q2 2026 • 76% overall progress
              </span>
            </div>
            <div className="grid min-w-0 w-full grid-cols-1 gap-6 lg:grid-cols-12">
              <div className={`min-w-0 lg:col-span-3 ${innerCardClass}`}>
                <div className="text-center">
                  <p className={`text-sm ${bodyTextClass}`}>Company OKR Progress</p>
                  <div className="relative mx-auto mt-4 h-28 w-28 sm:h-32 sm:w-32">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 42 42">
                      <circle
                        cx="21"
                        cy="21"
                        fill="none"
                        r="15"
                        stroke={chartTrackColor}
                        strokeWidth="5"
                      />
                      <circle
                        cx="21"
                        cy="21"
                        fill="none"
                        r="15"
                        stroke="#22C55E"
                        strokeDasharray="76 100"
                        strokeLinecap="round"
                        strokeWidth="5"
                      />
                    </svg>
                    <div className={`pointer-events-none absolute inset-0 flex items-center justify-center text-4xl font-semibold sm:text-5xl ${headingTextClass}`}>
                      76%
                    </div>
                  </div>
                </div>
              </div>
              <div className={`min-w-0 lg:col-span-9 ${innerCardClass}`}>
                <div className="space-y-6">
                  {OKR_TRACKING.map((okr) => (
                    <div
                      key={`okr-${okr.objective}`}
                      className="flex min-w-0 w-full flex-col gap-4 lg:flex-row lg:items-center lg:gap-6"
                    >
                      <div className="min-w-0 flex-1">
                        <p className={`break-words font-medium line-clamp-none ${headingTextClass}`}>
                          {okr.objective}
                        </p>
                        <p className={`mt-1 break-words text-xs ${bodyTextClass}`}>
                          {okr.keyResults}
                        </p>
                      </div>
                      <div className="w-full shrink-0 lg:w-32">
                        <div className={`h-2 overflow-hidden rounded-3xl ${theme.subtleSurface}`}>
                          <div
                            className="h-full rounded-3xl"
                            style={{ width: `${okr.progress}%`, backgroundColor: okr.color }}
                          />
                        </div>
                      </div>
                      <div className="w-full shrink-0 text-left lg:w-28 lg:text-right">
                        <span className={`text-sm font-medium ${headingTextClass}`}>
                          {okr.progress}%
                        </span>
                        <span
                          className={`ml-0 mt-2 inline-block rounded-3xl px-3 py-1 text-xs lg:ml-3 lg:mt-0 ${
                            okr.status === "On Track"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                              : okr.status === "At Risk"
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                                : "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                          }`}
                        >
                          {okr.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </SectionGuard>

        <SectionGuard resetKey="forecast">
          <motion.div className={sectionCardClass} variants={cardVariants}>
            <h3 className={`mb-6 flex min-w-0 items-center gap-2 text-xl font-semibold ${headingTextClass}`}>
              <BarChart3 className={`h-5 w-5 shrink-0 ${accentIconTextClass}`} /> Workforce Forecast (Advanced Composed)
            </h3>
            <SectionGuard message={SECTION_ERROR_MESSAGE} resetKey="forecast-chart">
              <SafeChart emptyMessage={SECTION_ERROR_MESSAGE} hasData={hasForecastData}>
                <ResponsiveContainer height="100%" width="100%">
                  <ComposedChart
                    data={safeForecastData}
                    margin={{ top: 20, right: 12, left: 0, bottom: 12 }}
                  >
                    <defs>
                      <linearGradient
                        id="dashboard-headcount-gradient"
                        x1="0"
                        x2="0"
                        y1="0"
                        y2="1"
                      >
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                    <XAxis
                      axisLine={{ stroke: gridColor }}
                      dataKey="month"
                      interval="preserveStartEnd"
                      tick={chartTickStyle}
                      tickLine={false}
                    />
                    <YAxis
                      axisLine={{ stroke: gridColor }}
                      tick={chartTickStyle}
                      tickLine={false}
                    />
                    <Tooltip content={<SafeChartTooltip />} />
                    <Legend formatter={legendFormatter} wrapperStyle={legendWrapperStyle} />
                    <Bar
                      dataKey="headcount"
                      fill="url(#dashboard-headcount-gradient)"
                      isAnimationActive={false}
                      name="Actual Headcount"
                      radius={[8, 8, 0, 0]}
                    />
                    <Line
                      activeDot={forecastPlanActiveDot}
                      dataKey="plan"
                      dot={forecastPlanDot}
                      isAnimationActive={false}
                      name="Plan"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      type="monotone"
                    />
                    <Line
                      activeDot={forecastTargetActiveDot}
                      dataKey="target"
                      dot={false}
                      isAnimationActive={false}
                      name="Target"
                      stroke="#A855F7"
                      strokeDasharray="5 5"
                      strokeWidth={3}
                      type="monotone"
                    />
                    <ReferenceLine
                      label={{
                        value: "Critical Threshold",
                        fill: axisColor,
                        fontSize: 12,
                      }}
                      stroke="#EF4444"
                      strokeDasharray="4 4"
                      y={1300}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </SafeChart>
            </SectionGuard>
          </motion.div>
        </SectionGuard>

        <SectionGuard resetKey="advanced-attendance">
          <motion.div className={sectionCardClass} variants={cardVariants}>
            <h3 className={`mb-6 text-xl font-semibold ${headingTextClass}`}>
              Weekly Attendance Trend (Advanced Gradient)
            </h3>
            <SectionGuard message={SECTION_ERROR_MESSAGE} resetKey="advanced-attendance-chart">
              <SafeChart
                emptyMessage={SECTION_ERROR_MESSAGE}
                hasData={hasChartData(safeAttendanceTrend)}
              >
                <ResponsiveContainer height="100%" width="100%">
                  <AreaChart data={safeAttendanceTrend}>
                    <defs>
                      <linearGradient
                        id="dashboard-attendance-gradient-advanced"
                        x1="0"
                        x2="0"
                        y1="0"
                        y2="1"
                      >
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={gridColor} />
                    <XAxis
                      axisLine={{ stroke: gridColor }}
                      dataKey="day"
                      interval="preserveStartEnd"
                      tick={chartTickStyle}
                      tickLine={false}
                    />
                    <YAxis
                      axisLine={{ stroke: gridColor }}
                      domain={safeAttendanceDomain}
                      tick={chartTickStyle}
                      tickLine={false}
                    />
                    <Tooltip content={<SafeChartTooltip />} />
                    <Legend formatter={legendFormatter} wrapperStyle={legendWrapperStyle} />
                    <Area
                      activeDot={attendanceActiveDot}
                      dataKey="attendance"
                      dot={attendanceDot}
                      fill="url(#dashboard-attendance-gradient-advanced)"
                      isAnimationActive={false}
                      name="Attendance"
                      stroke="#22C55E"
                      strokeWidth={4}
                      type="monotone"
                    />
                    <ReferenceLine
                      label={{ value: "Target", fill: axisColor, fontSize: 12 }}
                      stroke="#F59E0B"
                      strokeDasharray="3 3"
                      y={95}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </SafeChart>
            </SectionGuard>
          </motion.div>
        </SectionGuard>

        <SectionGuard resetKey="sentiment">
          <motion.div className={`${sectionCardClass} overflow-visible`} variants={cardVariants}>
            <h3 className={`mb-6 text-xl font-semibold ${headingTextClass}`}>
              Employee Sentiment Intelligence (Advanced Donut)
            </h3>
            <div className="flex w-full min-w-0 flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="w-full min-w-0 lg:w-auto">
                <SectionGuard message={SECTION_ERROR_MESSAGE} resetKey="sentiment-chart">
                  <SafeChart
                    className="mx-auto max-w-[320px] sm:max-w-[360px]"
                    emptyMessage={SECTION_ERROR_MESSAGE}
                    hasData={hasSentimentData}
                    minHeightClassName="h-[260px] sm:h-[300px]"
                  >
                    <div className="relative h-full w-full">
                      <ResponsiveContainer height="100%" width="100%">
                        <PieChart>
                          <Pie
                            cx="50%"
                            cy="50%"
                            data={safeSentimentData}
                            dataKey="value"
                            innerRadius={75}
                            isAnimationActive={false}
                            outerRadius={105}
                            paddingAngle={2}
                            stroke="none"
                          >
                            {safeSentimentData.map((entry, index) => (
                              <Cell key={`sentiment-${index}`} fill={entry.color} />
                            ))}
                          </Pie>

                          <Tooltip content={<SafeChartTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>

                      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                        <div className={`text-4xl font-bold sm:text-5xl ${headingTextClass}`}>
                          {sentimentScore}%
                        </div>
                        <div className={`mt-1 text-xs ${bodyTextClass}`}>Overall Score</div>
                      </div>
                    </div>
                  </SafeChart>
                </SectionGuard>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                  {safeSentimentData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className={`text-sm ${bodyTextClass}`}>
                        {item.name} ({item.value}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full min-w-0 flex-1">
                <div className="rounded-3xl border border-zinc-200/70 bg-zinc-50/70 p-6 dark:border-white/10 dark:bg-zinc-900/40">
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    AI Summary
                  </p>

                  <p className={`mt-3 break-words text-sm leading-7 ${bodyTextClass}`}>
                    Overall employee sentiment is positive, but workload concerns are
                    rising in Engineering. Recognition, growth opportunities, and
                    flexibility remain the strongest drivers of employee engagement.
                  </p>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      <p className={`text-sm ${bodyTextClass}`}>
                        68% employees reported positive sentiment.
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
                      <p className={`text-sm ${bodyTextClass}`}>
                        24% employees are neutral and may need more engagement.
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-rose-500" />
                      <p className={`text-sm ${bodyTextClass}`}>
                        8% employees are at risk due to burnout or dissatisfaction.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 rounded-2xl bg-white/80 p-4 dark:bg-white/5">
                    <div className={`text-xs uppercase tracking-wider ${mutedTextClass}`}>
                      Latest Employee Quote
                    </div>

                    <p className={`mt-2 italic leading-7 ${headingTextClass}`}>
                      "The new mentorship program made me feel truly supported — this is
                      why I stay."
                    </p>

                    <p className={`mt-3 text-xs ${mutedTextClass}`}>
                      — Priya Patel, Product Manager
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </SectionGuard>

        <SectionGuard resetKey="predictive-analytics">
          <motion.div className={sectionCardClass} variants={cardVariants}>
            <h2 className={`mb-6 flex min-w-0 items-center gap-2 text-xl font-semibold ${headingTextClass}`}>
              <Gauge className={`h-5 w-5 shrink-0 ${accentIconTextClass}`} /> Predictive Workforce Analytics
            </h2>
            <div className="grid min-w-0 w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {PREDICTIVE_METRICS.map((metric) => (
                <motion.div
                  key={`predictive-metric-${metric.title}`}
                  className={`${interactiveSectionCardClass} min-w-0 overflow-hidden break-words p-7`}
                  variants={cardVariants}
                >
                  <div className="relative mx-auto h-24 w-24 shrink-0">
                    <svg className="h-24 w-24 -rotate-90" viewBox="0 0 42 42">
                      <circle
                        cx="21"
                        cy="21"
                        fill="none"
                        r="15"
                        stroke={chartTrackColor}
                        strokeWidth="4"
                      />
                      <circle
                        cx="21"
                        cy="21"
                        fill="none"
                        r="15"
                        stroke={metric.color}
                        strokeDasharray={`${metric.value} 100`}
                        strokeLinecap="round"
                        strokeWidth="4"
                      />
                    </svg>
                    <div className={`pointer-events-none absolute inset-0 flex items-center justify-center text-4xl font-semibold ${headingTextClass}`}>
                      {metric.value}%
                    </div>
                  </div>
                  <p className={`mt-6 text-center font-medium break-words line-clamp-none ${headingTextClass}`}>
                    {metric.title}
                  </p>
                  <div className="mt-2 flex min-w-0 w-full flex-wrap items-center justify-center gap-2">
                    <span className="text-xs text-emerald-600 dark:text-emerald-400">
                      {metric.trend}
                    </span>
                    <span className={`rounded-3xl px-3 py-1 text-xs ${theme.pill}`}>
                      {metric.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </SectionGuard>

        <SectionGuard resetKey="ai-cockpit-section">
          <div className={`${dashboardContentLayerClass} min-w-0 w-full overflow-visible rounded-3xl`}>
            <SafeAIHRCommandCockpit />
          </div>
        </SectionGuard>

        <SectionGuard resetKey="advanced-enps">
          <motion.div className={sectionCardClass} variants={cardVariants}>
            <h2 className={`mb-6 flex min-w-0 items-center gap-2 text-xl font-semibold ${headingTextClass}`}>
              <Heart className={`h-5 w-5 shrink-0 ${accentIconTextClass}`} /> Advanced eNPS Intelligence
            </h2>
            <div className="grid min-w-0 w-full grid-cols-1 gap-6 lg:grid-cols-12">
              <div className={`min-w-0 lg:col-span-3 ${innerCardClass}`}>
                <div className="text-center">
                  <p className={`text-sm ${bodyTextClass}`}>Current eNPS</p>
                  <div className={`mt-2 break-words text-5xl font-semibold sm:text-7xl ${headingTextClass}`}>
                    {ENPS}
                  </div>
                  <div className="mt-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    +8 from last quarter
                  </div>
                </div>
              </div>
              <div className={`min-w-0 lg:col-span-5 ${innerCardClass}`}>
                <h3 className={`mb-6 font-medium ${headingTextClass}`}>eNPS Formula</h3>
                <div className="flex min-w-0 w-full items-center justify-center gap-6 text-sm sm:gap-12">
                  <div className="text-center">
                    <div className="text-3xl font-semibold text-emerald-600 dark:text-emerald-400 sm:text-4xl">
                      {PROMOTERS}%
                    </div>
                    <p className={`mt-1 text-xs ${bodyTextClass}`}>Promoters (9–10)</p>
                  </div>
                  <div className="text-5xl font-light text-rose-600 dark:text-rose-400 sm:text-6xl">
                    -
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-semibold text-rose-600 dark:text-rose-400 sm:text-4xl">
                      {DETRACTORS}%
                    </div>
                    <p className={`mt-1 text-xs ${bodyTextClass}`}>Detractors (0–6)</p>
                  </div>
                </div>
                <div className="mt-8 text-center text-3xl font-semibold text-emerald-600 dark:text-emerald-400 sm:text-4xl">
                  = {ENPS}
                </div>
                <p className={`mt-2 text-center text-xs ${bodyTextClass}`}>
                  Passives (7–8) are excluded
                </p>
                <p className={`mt-3 text-center text-xs ${mutedTextClass}`}>
                  Passives: {PASSIVES}%
                </p>
              </div>
              <div className={`min-w-0 lg:col-span-4 ${innerCardClass}`}>
                <h3 className={`mb-4 font-medium ${headingTextClass}`}>Industry Benchmarks</h3>
                <div className="space-y-4">
                  {ENPS_BENCHMARK.map((benchmark) => (
                    <div
                      key={`enps-benchmark-${benchmark.industry}`}
                      className="flex min-w-0 w-full flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className={`min-w-0 break-words ${bodyTextClass}`}>
                        {benchmark.industry}
                      </span>
                      <span
                        className={`shrink-0 font-medium ${benchmark.score > ENPS ? "text-emerald-600 dark:text-emerald-400" : headingTextClass}`}
                      >
                        {benchmark.score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 grid min-w-0 w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {ENGAGEMENT_STRATEGIES.map((strategy) => (
                <motion.div
                  key={`engagement-strategy-${strategy.title}`}
                  className={`${innerCardClass} min-w-0 overflow-hidden break-words`}
                  variants={cardVariants}
                >
                  <strategy.icon className={`mb-4 h-6 w-6 shrink-0 ${accentIconTextClass}`} />
                  <p className={`break-words font-medium line-clamp-none ${headingTextClass}`}>
                    {strategy.title}
                  </p>
                  <p className={`mt-2 text-xs ${bodyTextClass}`}>
                    Priority: {strategy.priority}
                  </p>
                  <p className="mt-6 text-sm text-emerald-600 dark:text-emerald-400">
                    Expected impact: <span className="font-semibold">{strategy.impact}</span>
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </SectionGuard>

        <SectionGuard resetKey="team-health">
          <motion.div className={sectionCardClass} variants={cardVariants}>
            <h2 className={`mb-6 text-xl font-semibold ${headingTextClass}`}>
              Team Health Score
            </h2>
            <div className="grid min-w-0 w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {TEAM_HEALTH.map((health) => (
                <motion.div
                  key={`team-health-${health.label}`}
                  className={`${innerCardClass} min-w-0 overflow-hidden break-words`}
                  variants={cardVariants}
                >
                  <p className={`text-sm ${bodyTextClass}`}>{health.label}</p>
                  <div className="mt-4 flex min-w-0 w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className={`break-words text-4xl font-semibold sm:text-5xl ${headingTextClass}`}>
                      {health.score}
                    </div>
                    <div className={`h-2 w-20 shrink-0 overflow-hidden rounded-3xl ${theme.subtleSurface}`}>
                      <div
                        className="h-full rounded-3xl"
                        style={{ width: `${health.score}%`, backgroundColor: health.color }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </SectionGuard>

        <SectionGuard resetKey="diversity">
          <motion.div className={sectionCardClass} variants={cardVariants}>
            <div className="grid min-w-0 w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              <div className={innerCardClass}>
                <h3 className={`mb-6 font-medium ${headingTextClass}`}>Gender Distribution</h3>
                <div className={`flex min-w-0 w-full flex-col gap-3 text-sm sm:flex-row sm:flex-wrap sm:justify-between ${bodyTextClass}`}>
                  <div>
                    Female{" "}
                    <span className={`font-semibold ${headingTextClass}`}>
                      {DIVERSITY_DATA.gender.female}%
                    </span>
                  </div>
                  <div>
                    Male{" "}
                    <span className={`font-semibold ${headingTextClass}`}>
                      {DIVERSITY_DATA.gender.male}%
                    </span>
                  </div>
                  <div>
                    Other{" "}
                    <span className={`font-semibold ${headingTextClass}`}>
                      {DIVERSITY_DATA.gender.other}%
                    </span>
                  </div>
                </div>
              </div>
              <div className={innerCardClass}>
                <h3 className={`mb-6 font-medium ${headingTextClass}`}>Diversity Index</h3>
                <div className={`break-words text-5xl font-semibold sm:text-6xl ${headingTextClass}`}>
                  {DIVERSITY_DATA.inclusivityScore}
                </div>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  +4% from last quarter
                </p>
              </div>
              <div className={innerCardClass}>
                <h3 className={`mb-6 font-medium ${headingTextClass}`}>Age Distribution</h3>
                <div className="space-y-3 text-sm">
                  {Object.entries(DIVERSITY_DATA.age).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex min-w-0 w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className={`min-w-0 break-words ${bodyTextClass}`}>{key}</span>
                      <span className={`shrink-0 font-medium ${headingTextClass}`}>
                        {value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </SectionGuard>

        <SectionGuard resetKey="lnd-recognition">
          <motion.div className={sectionCardClass} variants={cardVariants}>
            <div className="grid min-w-0 w-full grid-cols-1 gap-6 lg:grid-cols-2">
              <motion.div className={innerCardClass} variants={cardVariants}>
                <h3 className={`mb-6 font-semibold ${headingTextClass}`}>
                  Learning &amp; Development
                </h3>
                {LND_METRICS.map((metric) => (
                  <div
                    key={`lnd-metric-${metric.title}`}
                    className="flex min-w-0 w-full flex-col gap-2 border-b border-zinc-200/60 py-4 sm:flex-row sm:items-center sm:justify-between last:border-none dark:border-white/10"
                  >
                    <span className={`min-w-0 break-words ${bodyTextClass}`}>
                      {metric.title}
                    </span>
                    <span className={`shrink-0 font-semibold ${headingTextClass}`}>
                      {metric.value}
                    </span>
                  </div>
                ))}
              </motion.div>
              <motion.div className={innerCardClass} variants={cardVariants}>
                <h3 className={`mb-6 font-semibold ${headingTextClass}`}>
                  Recognition &amp; Rewards
                </h3>
                <div className="text-center">
                  <p className="text-emerald-600 dark:text-emerald-400">Most Recognized</p>
                  <p className={`mt-3 break-words text-2xl font-medium sm:text-3xl ${headingTextClass}`}>
                    {RECOGNITION_DATA.mostRecognized}
                  </p>
                  <p className={`mt-8 text-sm ${bodyTextClass}`}>
                    {RECOGNITION_DATA.totalThisMonth} recognitions this month
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </SectionGuard>

        <SectionGuard resetKey="department-benchmarking">
          <motion.div className={sectionCardClass} variants={cardVariants}>
            <h3 className={`mb-8 font-semibold ${headingTextClass}`}>
              Department Benchmarking
            </h3>
            <div className="space-y-6">
              {safeDepartmentData.map((department) => (
                <div
                  key={`department-benchmark-${department.name}`}
                  className="flex min-w-0 w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 lg:gap-8"
                >
                  <div className={`min-w-0 w-full break-words font-medium sm:w-36 ${headingTextClass}`}>
                    {department.name}
                  </div>
                  <div className={`h-2.5 flex-1 overflow-hidden rounded-3xl ${theme.subtleSurface}`}>
                    <div
                      className="h-full bg-emerald-500"
                      style={{ width: `${department.value}%` }}
                    />
                  </div>
                  <div className={`w-full shrink-0 break-words text-right font-mono text-sm sm:w-12 ${headingTextClass}`}>
                    {department.value}%
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </SectionGuard>

        <SectionGuard resetKey="engagement-snapshot">
          <motion.div className={sectionCardClass} variants={cardVariants}>
            <h2 className={`mb-6 flex min-w-0 items-center gap-2 text-xl font-semibold ${headingTextClass}`}>
              <BarChart3 className={`h-5 w-5 shrink-0 ${accentIconTextClass}`} /> Engagement Snapshot
            </h2>
            <div className="grid min-w-0 w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {QUICK_INSIGHTS.map((item) => {
                const styles =
                  colorMap[item.color as keyof typeof colorMap] ?? colorMap.emerald;

                return (
                  <motion.div
                    key={`quick-insight-${item.title}`}
                    className={`${interactiveSectionCardClass} min-w-0 overflow-hidden break-words p-7`}
                    variants={cardVariants}
                  >
                    <div
                      className={`pointer-events-none absolute left-0 top-0 h-full w-1 border-l ${styles.border}`}
                    />
                    <div className="flex min-w-0 items-center gap-3">
                      <div className={`${styles.bg} flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl`}>
                        <item.icon className={`${styles.text} h-5 w-5 shrink-0`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`break-words text-3xl font-semibold sm:text-4xl ${headingTextClass}`}>
                          {item.value}
                        </p>
                        <p className={`mt-1 break-words text-sm line-clamp-none ${bodyTextClass}`}>
                          {item.title}
                        </p>
                      </div>
                    </div>
                    <p className={`mt-8 break-words text-xs font-medium ${styles.text}`}>
                      {item.trend}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </SectionGuard>

        <SectionGuard resetKey="attendance-summary-section">
          <motion.div className={sectionCardClass} variants={cardVariants}>
            <div className="grid min-w-0 w-full grid-cols-1 gap-6 lg:grid-cols-5">
              <motion.div
                className={`min-w-0 lg:col-span-3 ${interactiveSectionCardClass}`}
                variants={cardVariants}
              >
                <h3 className={`mb-6 text-xl font-semibold ${headingTextClass}`}>
                  Weekly Attendance Trend
                </h3>
                <SectionGuard message={SECTION_ERROR_MESSAGE} resetKey="attendance-summary-chart">
                  <SafeChart
                    emptyMessage={SECTION_ERROR_MESSAGE}
                    hasData={hasChartData(safeAttendanceTrend)}
                  >
                    <ResponsiveContainer height="100%" width="100%">
                      <AreaChart data={safeAttendanceTrend}>
                        <defs>
                          <linearGradient
                            id="dashboard-attendance-gradient-summary"
                            x1="0"
                            x2="0"
                            y1="0"
                            y2="1"
                          >
                            <stop offset="5%" stopColor="#22C55E" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#22C55E" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke={gridColor} />
                        <XAxis
                          axisLine={{ stroke: gridColor }}
                          dataKey="day"
                          interval="preserveStartEnd"
                          tick={chartTickStyle}
                          tickLine={false}
                        />
                        <YAxis
                          axisLine={{ stroke: gridColor }}
                          domain={safeAttendanceDomain}
                          tick={chartTickStyle}
                          tickLine={false}
                        />
                        <Tooltip content={<SafeChartTooltip />} />
                        <Legend formatter={legendFormatter} wrapperStyle={legendWrapperStyle} />
                        <Area
                          activeDot={attendanceActiveDot}
                          dataKey="attendance"
                          dot={attendanceDot}
                          fill="url(#dashboard-attendance-gradient-summary)"
                          isAnimationActive={false}
                          name="Attendance"
                          stroke="#22C55E"
                          strokeWidth={3}
                          type="natural"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </SafeChart>
                </SectionGuard>
              </motion.div>
              <motion.div
                className={`min-w-0 lg:col-span-2 ${interactiveSectionCardClass} flex flex-col`}
                variants={cardVariants}
              >
                <h3 className={`mb-8 text-xl font-semibold ${headingTextClass}`}>
                  Today&apos;s Attendance
                </h3>
                <div className="grid min-w-0 w-full flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
                  {ATTENDANCE_SUMMARY.map((item) => (
                    <div
                      key={`attendance-summary-${item.label}`}
                      className="min-w-0 overflow-hidden break-words rounded-3xl border border-zinc-200/80 bg-zinc-50/90 p-6 dark:border-white/5 dark:bg-zinc-950/40"
                    >
                      <div
                        className="mb-5 h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <p className={`break-words text-3xl font-semibold sm:text-4xl ${headingTextClass}`}>
                        {item.value}
                      </p>
                      <p className={`mt-1 text-sm ${bodyTextClass}`}>{item.label}</p>
                      <p className={`mt-4 text-xs ${mutedTextClass}`}>{item.percent}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </SectionGuard>

        <SectionGuard resetKey="activity-alerts">
          <motion.div className={sectionCardClass} variants={cardVariants}>
            <div className="grid min-w-0 w-full grid-cols-1 gap-6 lg:grid-cols-12">
              <motion.div
                className={`min-w-0 lg:col-span-7 ${interactiveSectionCardClass}`}
                variants={cardVariants}
              >
                <h3 className={`mb-8 text-xl font-semibold ${headingTextClass}`}>
                  Recent Engagement Activity
                </h3>
                <div className="space-y-6">
                  {RECENT_ACTIVITIES.map((activity) => (
                    <div
                      key={`recent-activity-${activity.title}`}
                      className="group flex min-w-0 items-start gap-4 sm:gap-6"
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${theme.subtleSurface}`}>
                        <activity.icon className={`h-5 w-5 shrink-0 ${iconTextClass}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`break-words font-medium line-clamp-none transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400 ${headingTextClass}`}>
                          {activity.title}
                        </p>
                        <p className={`break-words text-sm line-clamp-none ${bodyTextClass}`}>
                          {activity.desc}
                        </p>
                        <p className={`mt-3 text-xs ${mutedTextClass}`}>{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div
                className={`min-w-0 lg:col-span-5 ${interactiveSectionCardClass}`}
                variants={cardVariants}
              >
                <h3 className={`mb-8 text-xl font-semibold ${headingTextClass}`}>
                  Engagement Alerts
                </h3>
                <div className="space-y-4">
                  {NOTIFICATIONS.map((notification) => (
                    <div
                      key={`engagement-alert-${notification.dot}-${notification.text}`}
                      className="flex min-w-0 items-center gap-4 rounded-3xl border border-zinc-200/80 bg-zinc-50/90 p-5 dark:border-white/5 dark:bg-zinc-950/50"
                    >
                      <div
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotColorMap[notification.dot as keyof typeof dotColorMap] ?? dotColorMap.emerald}`}
                      />
                      <p className={`min-w-0 flex-1 break-words text-sm ${headingTextClass}`}>
                        {notification.text}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </SectionGuard>

        <SectionGuard resetKey="performers-pipeline">
          <motion.div className={sectionCardClass} variants={cardVariants}>
            <div className="grid min-w-0 w-full grid-cols-1 gap-6 lg:grid-cols-2">
              <motion.div className={interactiveSectionCardClass} variants={cardVariants}>
                <h3 className={`mb-8 text-xl font-semibold ${headingTextClass}`}>
                  Top Performers • Engagement Impact
                </h3>
                <div className="space-y-6">
                  {TOP_PERFORMERS.map((employee, index) => (
                    <div
                      key={`top-performer-${employee.rank}-${employee.name}`}
                      className="flex min-w-0 flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5"
                    >
                      <div className="relative shrink-0">
                        <img
                          alt={employee.name}
                          className="h-12 w-12 rounded-3xl ring-2 ring-zinc-200/70 dark:ring-white/10"
                          src={employee.avatar}
                        />
                        {index === 0 && (
                          <Award className="pointer-events-none absolute -right-1 -top-1 h-6 w-6 shrink-0 text-amber-600 dark:text-amber-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`break-words font-medium line-clamp-none ${headingTextClass}`}>
                          {employee.name}
                        </p>
                        <p className={`break-words text-xs ${bodyTextClass}`}>
                          {employee.dept}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className={`rounded-3xl px-3 py-1 text-xs ${theme.pill}`}>
                          #{employee.rank}
                        </div>
                        <div className="mt-2 font-mono text-2xl font-semibold text-emerald-600 dark:text-emerald-400 sm:text-3xl">
                          {employee.score}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div className={interactiveSectionCardClass} variants={cardVariants}>
                <h3 className={`mb-8 text-xl font-semibold ${headingTextClass}`}>
                  Recruitment Pipeline
                </h3>
                <div className="space-y-6">
                  {RECRUITMENT_PIPELINE.map((step, index) => (
                    <div
                      key={`recruitment-stage-${step.stage}`}
                      className="flex min-w-0 flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6"
                    >
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl border border-zinc-200/70 text-sm font-medium dark:border-white/20"
                        style={{ color: step.color }}
                      >
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex min-w-0 w-full flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
                          <span className={`min-w-0 break-words font-medium ${headingTextClass}`}>
                            {step.stage}
                          </span>
                          <span className={`shrink-0 font-mono ${bodyTextClass}`}>
                            {step.count}
                          </span>
                        </div>
                        <div className={`h-2 overflow-hidden rounded-3xl ${theme.subtleSurface}`}>
                          <div
                            className="h-full rounded-3xl"
                            style={{
                              width: `${(step.count / MAX_RECRUITMENT_STAGE) * 100}%`,
                              backgroundColor: step.color,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </SectionGuard>

        <SectionGuard resetKey="leave-requests">
          <motion.div className={sectionCardClass} variants={cardVariants}>
            <div className="mb-8 flex min-w-0 w-full flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <h3 className={`text-xl font-semibold ${headingTextClass}`}>
                Pending Leave Requests
              </h3>
              <button className="inline-flex w-full items-center justify-center gap-2 text-sm text-emerald-600 transition-colors hover:text-zinc-900 sm:w-auto dark:text-emerald-400 dark:hover:text-white">
                View all requests <ArrowRight className="h-4 w-4 shrink-0" />
              </button>
            </div>
            <SectionGuard message={SECTION_ERROR_MESSAGE} resetKey="leave-requests-table">
              <div className="w-full overflow-x-auto rounded-3xl">
                <table className="w-full min-w-[640px] sm:min-w-[700px]">
                  <thead>
                    <tr className="border-b border-zinc-200/70 text-xs uppercase tracking-widest text-zinc-500 dark:border-white/10">
                      <th className="pb-6 text-left font-normal">Employee</th>
                      <th className="pb-6 text-left font-normal">Leave Type</th>
                      <th className="pb-6 text-left font-normal">Days</th>
                      <th className="pb-6 text-left font-normal">Status</th>
                      <th className="pb-6 text-right font-normal">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200/70 dark:divide-white/10">
                    {LEAVE_REQUESTS.map((request) => (
                      <tr
                        key={request.id}
                        className="transition-colors hover:bg-zinc-100 dark:hover:bg-white/5"
                      >
                        <td className="py-7">
                          <div className="flex min-w-0 items-center gap-4">
                            <img
                              alt={request.name}
                              className="h-9 w-9 shrink-0 rounded-3xl"
                              src={request.avatar}
                            />
                            <span className={`min-w-0 break-words font-medium ${headingTextClass}`}>
                              {request.name}
                            </span>
                          </div>
                        </td>
                        <td className={`py-7 ${bodyTextClass}`}>{request.type}</td>
                        <td className={`py-7 ${bodyTextClass}`}>{request.days} days</td>
                        <td className="py-7">
                          <span className="rounded-3xl border border-amber-200 bg-amber-100 px-5 py-1 text-xs text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
                            {request.status}
                          </span>
                        </td>
                        <td className="py-7 text-right">
                          <div className="inline-flex items-center gap-6">
                            <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300">
                              Approve
                            </button>
                            <button className="text-sm font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300">
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionGuard>
          </motion.div>
        </SectionGuard>
      </motion.div>
    </div>
  );
}
