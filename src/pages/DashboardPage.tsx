import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Users, Briefcase, CalendarCheck, Target, 
  Plus, UserPlus, DollarSign, Bell, Award, ArrowRight,
  TrendingUp, Heart, BarChart3, Smile, Users2, Zap,
  Brain, Gauge, TrendingDown, BookOpen, Trophy,
  Calendar, Info, Gift, Plane, MapPin, Layers
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, ComposedChart,
  Legend, ReferenceLine
} from "recharts";
import { getStoredRole } from "@/lib/auth";
import api from "@/lib/api";
import { AIHRCommandCockpit2027 } from "@/components/AIHRCommandCockpit2027";

const COLORS = ["#22C55E", "#3B82F6", "#A855F7", "#EF4444", "#8B5CF6"];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 15 } },
};

// Tailwind-safe color map
const colorMap = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
  rose: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/30" },
};

// Custom Recharts Tooltip (premium glass style)
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && Array.isArray(payload) && payload.length > 0) {
    return (
      <div className="bg-zinc-900 border border-white/20 backdrop-blur-2xl rounded-3xl p-4 shadow-2xl text-white text-sm min-w-[180px]">
        <p className="font-medium mb-3 text-emerald-400">{label}</p>
        {payload.filter(Boolean).map((entry: any, index: number) => (
          <div
            key={`${entry?.dataKey ?? entry?.name ?? "tooltip-entry"}-${index}`}
            className="flex items-center justify-between gap-8 mb-1 last:mb-0"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry?.color ?? "#22C55E" }} />
              <span className="text-zinc-400">{entry.name || entry.dataKey}</span>
            </div>
            <span className="font-semibold text-white">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ChartContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full h-[320px]">
    {children}
  </div>
);

const dotColorMap = {
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  emerald: "bg-emerald-500",
  blue: "bg-blue-500",
  purple: "bg-purple-500",
};

const toChartNumber = (value: unknown): number | null => {
  const numericValue = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
};

const toChartNumberOrZero = (value: unknown): number => toChartNumber(value) ?? 0;

const toChartLabel = (value: unknown, fallback: string): string =>
  typeof value === "string" && value.trim().length > 0 ? value : fallback;

type SafeDotProps = Omit<React.ComponentPropsWithoutRef<"circle">, "cx" | "cy" | "r"> & {
  cx?: number | string | null;
  cy?: number | string | null;
  r?: number | string | null;
  dataKey?: string | number;
  index?: number;
};

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
  props: SafeDotProps | undefined,
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

const renderDepartmentDot = (props: SafeDotProps) =>
  renderSafeDot(props, { r: 6, fill: "#3B82F6" });

const renderDepartmentActiveDot = (props: SafeDotProps) =>
  renderSafeDot(props, { r: 8, fill: "#3B82F6", stroke: "#ffffff", strokeWidth: 2 });

const renderForecastPlanDot = (props: SafeDotProps) =>
  renderSafeDot(props, { r: 5, fill: "#3B82F6" });

const renderForecastPlanActiveDot = (props: SafeDotProps) =>
  renderSafeDot(props, { r: 7, fill: "#3B82F6", stroke: "#ffffff", strokeWidth: 2 });

const renderForecastTargetActiveDot = (props: SafeDotProps) =>
  renderSafeDot(props, { r: 7, fill: "#A855F7", stroke: "#ffffff", strokeWidth: 2 });

const renderAttendanceDot = (props: SafeDotProps) =>
  renderSafeDot(props, { r: 5, fill: "#22C55E" });

const renderAttendanceActiveDot = (props: SafeDotProps) =>
  renderSafeDot(props, { r: 7, fill: "#22C55E", stroke: "#ffffff", strokeWidth: 2 });

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const role = getStoredRole();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => {
        if (import.meta.env.DEV) {
          console.debug("Dashboard API:", res.data);
        }
        setData(res.data?.data || null);
      })
      .catch((err) => {
        console.log(err);
        setData({
          totalEmployees: 1248,
          activeRecruitment: 47,
          attendanceRate: 94.2,
          avgPerformance: 87,
          hiringData: [
            { month: "Jan", hired: 24, left: 8 },
            { month: "Feb", hired: 31, left: 12 },
            { month: "Mar", hired: 28, left: 15 },
            { month: "Apr", hired: 35, left: 9 },
          ],
          departmentData: [
            { name: "Engineering", value: 42 },
            { name: "Sales", value: 28 },
            { name: "Marketing", value: 18 },
            { name: "HR", value: 12 },
          ],
          attendanceTrend: [
            { day: "Mon", attendance: 92 },
            { day: "Tue", attendance: 95 },
            { day: "Wed", attendance: 89 },
            { day: "Thu", attendance: 96 },
            { day: "Fri", attendance: 93 },
          ],
        });
      });
  }, []);

  const greeting = useMemo(() => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, [currentTime]);

  const formattedDate = currentTime.toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // AI Workforce Insights
  const aiInsights = [
    {
      icon: Brain,
      title: "Engineering engagement increased 12%",
      desc: "Strong correlation with new recognition program",
      confidence: 94,
      type: "positive",
      badge: "Opportunity"
    },
    {
      icon: TrendingDown,
      title: "HR department has highest attrition risk",
      desc: "3 key employees likely to leave in next 90 days",
      confidence: 87,
      type: "risk",
      badge: "Risk"
    },
    {
      icon: CalendarCheck,
      title: "Friday meetings correlate with -4% attendance",
      desc: "Consider moving to Thursday or async updates",
      confidence: 91,
      type: "neutral",
      badge: "Insight"
    },
    {
      icon: Heart,
      title: "Low recognition scores = 2.3× burnout risk",
      desc: "Targeted kudos campaigns recommended",
      confidence: 89,
      type: "risk",
      badge: "Warning"
    },
    {
      icon: Users,
      title: "Remote employees have +11 eNPS vs hybrid",
      desc: "Flexibility is a key retention driver",
      confidence: 96,
      type: "positive",
      badge: "Positive"
    },
  ];

  // Predictive Analytics
  const predictiveMetrics = [
    { title: "Attrition Risk", value: 14, trend: "-3%", status: "Improving", color: "#22C55E" },
    { title: "Burnout Risk", value: 23, trend: "+2%", status: "Warning", color: "#F59E0B" },
    { title: "Flight Risk", value: 9, trend: "-5%", status: "Stable", color: "#3B82F6" },
    { title: "Promotion Readiness", value: 31, trend: "+8%", status: "Healthy", color: "#A855F7" },
  ];

  // Sentiment Intelligence
  const sentimentData = [
    { name: "Positive", value: 68, color: "#22C55E" },
    { name: "Neutral", value: 24, color: "#F59E0B" },
    { name: "Negative", value: 8, color: "#EF4444" },
  ];

  // Advanced eNPS Data
  const eNPS = 41;
  const promoters = 62;
  const passives = 24;
  const detractors = 14;
  const eNPSBenchmark = [
    { industry: "Technology", score: 38 },
    { industry: "Healthcare", score: 24 },
    { industry: "Manufacturing", score: 12 },
    { industry: "Retail", score: 18 },
    { industry: "Finance", score: 31 },
    { industry: "HR Services", score: 42 },
  ];

  const engagementStrategies = [
    { icon: Trophy, title: "Recognition & Rewards", impact: "+18%", priority: "High" },
    { icon: Users, title: "Leadership Communication", impact: "+14%", priority: "High" },
    { icon: Calendar, title: "Flexible Work Policy", impact: "+11%", priority: "Medium" },
    { icon: BookOpen, title: "Career Growth Pathways", impact: "+22%", priority: "High" },
  ];

  // Team Health
  const teamHealth = [
    { label: "Morale", score: 84, color: "#22C55E" },
    { label: "Productivity", score: 91, color: "#3B82F6" },
    { label: "Collaboration", score: 77, color: "#A855F7" },
    { label: "Workload Balance", score: 69, color: "#F59E0B" },
  ];

  // Diversity & Inclusion
  const diversityData = {
    gender: { female: 42, male: 56, other: 2 },
    age: { "18-30": 31, "31-40": 48, "41+": 21 },
    inclusivityScore: 76,
  };

  // Learning & Development
  const lndMetrics = [
    { title: "Courses Completed", value: 184, trend: "+34" },
    { title: "Training Hours", value: "2,847", trend: "+12%" },
    { title: "Certifications Earned", value: 67, trend: "+9" },
  ];

  // Recognition & Rewards
  const recognitionData = {
    totalThisMonth: 412,
    mostRecognized: "Neha Kapoor",
  };

  // Workforce Planning
  const forecastData = [
    { month: "May", headcount: 1260, plan: 1280, target: 1300 },
    { month: "Jun", headcount: 1275, plan: 1300, target: 1320 },
    { month: "Jul", headcount: 1290, plan: 1320, target: 1340 },
  ];

  // Quick Insights
  const quickInsights = [
    { title: "Overall Engagement", value: "82", icon: Smile, trend: "+5 pts", color: "emerald" },
    { title: "eNPS Score", value: "41", icon: Heart, trend: "+8", color: "blue" },
    { title: "Survey Participation", value: "87%", icon: Users2, trend: "↑ 12%", color: "amber" },
    { title: "Retention Risk", value: "9%", icon: TrendingUp, trend: "-3%", color: "emerald" },
  ];

  // Recent Activities
  const recentActivities = [
    { icon: Smile, title: "Q2 Engagement Survey closed", desc: "1,184 responses • 87% participation", time: "14 min ago" },
    { icon: Users, title: "Rahul Sharma promoted", desc: "Engineering • +12% engagement impact", time: "41 min ago" },
    { icon: Heart, title: "Wellbeing initiative launched", desc: "Mental health days approved", time: "3 hours ago" },
    { icon: Zap, title: "Recognition program updated", desc: "New peer-to-peer kudos system", time: "5 hours ago" },
  ];

  // Notifications
  const notifications = [
    { text: "Engagement pulse survey due in 3 days", dot: "amber" },
    { text: "4 departments below 75% engagement threshold", dot: "rose" },
    { text: "eNPS benchmark updated — now at industry top 20%", dot: "emerald" },
  ];

  // Attendance Summary
  const attendanceSummary = [
    { label: "Present", value: "1,142", percent: "91%", color: "#22C55E" },
    { label: "Absent", value: "47", percent: "4%", color: "#EF4444" },
    { label: "On Leave", value: "38", percent: "3%", color: "#F59E0B" },
    { label: "Late", value: "21", percent: "2%", color: "#EA580C" },
  ];

  // Top Performers
  const topPerformers = [
    { name: "Neha Kapoor", dept: "Engineering", score: 96, avatar: "https://i.pravatar.cc/48?u=neha", rank: 1 },
    { name: "Vikram Singh", dept: "Sales", score: 93, avatar: "https://i.pravatar.cc/48?u=vikram", rank: 2 },
    { name: "Ananya Sharma", dept: "Marketing", score: 91, avatar: "https://i.pravatar.cc/48?u=ananya", rank: 3 },
  ];

  // Leave Requests
  const leaveRequests = [
    { id: 1, name: "Rohan Mehta", avatar: "https://i.pravatar.cc/32?u=rohan", type: "Sick Leave", days: "2", status: "Pending" },
    { id: 2, name: "Sneha Iyer", avatar: "https://i.pravatar.cc/32?u=sneha", type: "Annual Leave", days: "5", status: "Pending" },
  ];

  // Upcoming Events & Holiday Planner
  const upcomingEvents = [
    {
      title: "Company Holiday – Independence Day",
      date: "15 Aug 2026",
      time: "All Day",
      type: "Holiday",
      daysLeft: 12,
      description: "Office will remain closed.",
      icon: Calendar,
      color: "emerald"
    },
    {
      title: "Team Trip – Jaipur Resort",
      date: "22 Aug 2026",
      time: "10:00 AM",
      type: "Trip",
      daysLeft: 19,
      description: "Annual team outing for all departments.",
      icon: Plane,
      color: "blue"
    },
    {
      title: "Monthly Townhall Meeting",
      date: "28 Aug 2026",
      time: "4:00 PM",
      type: "Meeting",
      daysLeft: 25,
      description: "Leadership updates and Q&A.",
      icon: Users,
      color: "rose"
    },
    {
      title: "Priya Sharma Birthday",
      date: "30 Aug 2026",
      time: "12:00 PM",
      type: "Birthday",
      daysLeft: 27,
      description: "Celebration in cafeteria.",
      icon: Gift,
      color: "purple"
    },
    {
      title: "Diwali Festival Celebration",
      date: "10 Nov 2026",
      time: "All Day",
      type: "Festival",
      daysLeft: 99,
      description: "Office closed + virtual events.",
      icon: MapPin,
      color: "amber"
    }
  ];

  // OKR Tracking
  const okrTracking = [
    {
      objective: "Achieve 30% revenue growth in FY26",
      progress: 78,
      status: "On Track",
      color: "#22C55E",
      keyResults: "4 of 5 KRs completed"
    },
    {
      objective: "Improve employee engagement score to 85",
      progress: 64,
      status: "At Risk",
      color: "#F59E0B",
      keyResults: "3 of 5 KRs on track"
    },
    {
      objective: "Reduce voluntary attrition to <8%",
      progress: 92,
      status: "On Track",
      color: "#22C55E",
      keyResults: "All KRs exceeding targets"
    },
    {
      objective: "Launch 3 new DE&I initiatives",
      progress: 45,
      status: "Behind",
      color: "#EF4444",
      keyResults: "1 of 3 initiatives live"
    }
  ];

  // AI Summary Banner
  const aiSummaryBanner = {
    risks: 3,
    opportunities: 2,
    urgentActions: 1,
    summary: "Burnout risk in Engineering increased 8%. Schedule retention meeting this week."
  };

  const safeDepartmentData = (Array.isArray(data?.departmentData) ? data.departmentData : []).map(
    (item: any, index: number) => ({
      name: toChartLabel(item?.name, `Department ${index + 1}`),
      value: toChartNumberOrZero(item?.value),
    }),
  );

  const safeAttendanceTrend = (Array.isArray(data?.attendanceTrend) ? data.attendanceTrend : [])
    .map((item: any, index: number) => ({
      day: toChartLabel(item?.day, `Day ${index + 1}`),
      attendance: toChartNumber(item?.attendance),
    }))
    .filter((item) => item.attendance !== null);

  const safeForecastData = (Array.isArray(forecastData) ? forecastData : []).map(
    (item: any, index: number) => ({
      month: toChartLabel(item?.month, `Month ${index + 1}`),
      headcount: toChartNumberOrZero(item?.headcount),
      plan: toChartNumber(item?.plan),
      target: toChartNumber(item?.target),
    }),
  ).filter((item) => item.headcount > 0 || item.plan !== null || item.target !== null);

  const safeSentimentData = (Array.isArray(sentimentData) ? sentimentData : []).map(
    (item: any, index: number) => ({
      name: toChartLabel(item?.name, `Sentiment ${index + 1}`),
      value: toChartNumberOrZero(item?.value),
      color:
        typeof item?.color === "string" && item.color.trim().length > 0
          ? item.color
          : COLORS[index % COLORS.length],
    }),
  );

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm text-muted-foreground">Loading executive HR command center...</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full flex flex-col gap-6 pb-10 overflow-x-hidden"
    >
      {/* Premium Hero */}
      <div className="relative h-auto min-h-0 rounded-3xl overflow-hidden border border-white/10 border-red-500 bg-gradient-to-br from-[#0f172a] via-[#1e2937] to-[#111827] shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(at_30%_20%,rgba(16,185,129,0.18),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(at_70%_80%,rgba(59,130,246,0.15),transparent)]" />
        <div className="relative p-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
          <div className="flex-1">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-3xl mb-6">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-300 text-xs font-medium tracking-widest">AI-POWERED HR OPERATING SYSTEM • LIVE</span>
            </div>
            <h1 className="text-5xl xl:text-6xl font-semibold tracking-tighter text-white leading-none">
              {greeting}, {role === "admin" ? "Admin" : "HR Leader"}
            </h1>
            <p className="mt-4 text-xl text-zinc-400 max-w-md">
              Executive workforce intelligence. AI insights, predictive analytics, and real-time people metrics.
            </p>
            <div className="mt-8 flex items-center gap-8 text-sm text-zinc-400">
              <div>{formattedDate}</div>
              <div className="h-px w-8 bg-white/30" />
              <div>Updated 3 min ago</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { label: "Run Pulse Survey", icon: Zap, gradient: "from-emerald-500 to-teal-500" },
              { label: "Add Recognition", icon: Heart, gradient: "from-pink-500 to-rose-500" },
              { label: "Launch Initiative", icon: Users, gradient: "from-blue-500 to-cyan-500" },
              { label: "View Full Report", icon: BarChart3, gradient: "from-purple-500 to-violet-500" },
            ].map((btn) => (
              <motion.button
                key={`hero-action-${btn.label}`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`inline-flex items-center gap-2 bg-gradient-to-r ${btn.gradient} text-white px-7 py-4 rounded-3xl text-sm font-medium shadow-lg shadow-black/40 transition-all`}
              >
                <btn.icon className="h-4 w-4 shrink-0" />
                {btn.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Summary Banner */}
      <motion.div variants={cardVariants} className="relative h-auto min-h-0 overflow-hidden rounded-3xl border border-white/10 border-red-500 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 backdrop-blur-2xl p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]">
        <div className="flex flex-wrap items-center gap-8">
          <div className="flex items-center gap-2 text-emerald-400">
            <Brain className="h-5 w-5 shrink-0" />
            <span className="font-semibold">AI Summary</span>
          </div>
          <div className="flex items-center gap-8 flex-1 min-w-0">
            <div className="flex items-center gap-2 shrink-0">
              <span className="bg-rose-500/10 text-rose-400 text-xs px-3 py-1 rounded-3xl font-medium">{aiSummaryBanner.risks} Risks</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-3xl font-medium">{aiSummaryBanner.opportunities} Opportunities</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="bg-amber-500/10 text-amber-400 text-xs px-3 py-1 rounded-3xl font-medium">{aiSummaryBanner.urgentActions} Urgent Actions</span>
            </div>
            <p className="text-zinc-300 flex-1 min-w-0 truncate">{aiSummaryBanner.summary}</p>
          </div>
          <button className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-6 py-3 rounded-3xl transition-all shrink-0">
            Generate Full Report
          </button>
        </div>
      </motion.div>

      {/* Core Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 h-auto min-h-0 border border-red-500 rounded-3xl p-0">
        {[
          { title: "Total Headcount", value: data.totalEmployees, icon: Users, trend: "+38 this month", status: "Growing", accent: "#22C55E" },
          { title: "Active Recruitment", value: data.activeRecruitment, icon: Briefcase, trend: "47 open roles", status: "High", accent: "#3B82F6" },
          { title: "Avg Attendance", value: `${data.attendanceRate}%`, icon: CalendarCheck, trend: "+2.4% MoM", status: "Stable", accent: "#22C55E" },
          { title: "Avg Performance", value: data.avgPerformance, icon: Target, trend: "↑ 4 pts", status: "Excellent", accent: "#A855F7" },
        ].map((stat) => (
          <motion.div 
            key={`core-stat-${stat.title}`} 
            variants={cardVariants} 
            className="relative h-auto min-h-0 overflow-hidden rounded-3xl border border-white/10 border-red-500 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.22)] hover:-translate-y-1 transition-all duration-500 p-8"
          >
            <div className="flex justify-between items-start">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-zinc-500 truncate">{stat.title}</p>
                <p className="text-4xl font-semibold text-white mt-3 truncate">{stat.value}</p>
              </div>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-white/10" style={{ color: stat.accent }}>
                <stat.icon className="h-7 w-7 shrink-0" />
              </div>
            </div>
            <div className="mt-10 flex justify-between items-end">
              <span className="px-4 py-1 text-xs rounded-3xl bg-white/10 text-white/80 shrink-0">{stat.status}</span>
              <span className="text-emerald-400 text-sm font-medium truncate">{stat.trend}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Workforce Insights */}
      <motion.div variants={cardVariants} className="h-auto min-h-0 border border-red-500 rounded-3xl p-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
            <Brain className="h-5 w-5 shrink-0 text-emerald-400" /> AI Workforce Insights
          </h2>
          <span className="text-xs text-zinc-400">Powered by NEXA • Updated live</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {aiInsights.map((insight) => (
            <motion.div
              key={`ai-insight-${insight.badge}-${insight.title}`}
              variants={cardVariants}
                className="relative h-auto min-h-0 overflow-hidden rounded-3xl border border-white/10 border-red-500 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.22)] hover:-translate-y-1 transition-all duration-500"
            >
              <div className={`absolute top-6 right-6 text-xs font-medium px-3 py-1 rounded-3xl ${insight.type === "positive" ? "bg-emerald-500/10 text-emerald-400" : insight.type === "risk" ? "bg-rose-500/10 text-rose-400" : "bg-amber-500/10 text-amber-400"}`}>
                {insight.badge}
              </div>
              <div className="flex items-center gap-3 mb-4 min-w-0">
                <insight.icon className="h-6 w-6 shrink-0 text-zinc-400" />
                <p className="font-medium text-white text-sm leading-tight flex-1 min-w-0 truncate">{insight.title}</p>
              </div>
              <p className="text-xs text-zinc-400 mb-6 line-clamp-3 break-words">{insight.desc}</p>
              <div className="flex justify-between items-center">
                <div className="text-xs text-zinc-400">Confidence <span className="font-mono text-emerald-400">{insight.confidence}%</span></div>
                <button className="text-xs inline-flex items-center gap-1 text-emerald-400 hover:text-white transition-colors">
                  AI Recommendation <ArrowRight className="h-3 w-3 shrink-0" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Department Collaboration Network */}
      <motion.div variants={cardVariants} className="h-auto min-h-0 rounded-3xl border border-white/10 border-red-500 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.22)] hover:-translate-y-1 transition-all duration-500 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
            <Layers className="h-5 w-5 shrink-0 text-emerald-400" /> Department Collaboration Network
          </h2>
          <span className="text-xs px-4 py-1 bg-emerald-500/10 text-emerald-400 rounded-3xl font-medium">Interactive • Recharts</span>
        </div>
        {safeDepartmentData.length > 0 && (
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={safeDepartmentData}>
                <CartesianGrid stroke="#ffffff10" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  key="department-collaboration-bar"
                  dataKey="value"
                  fill="#22C55E"
                  radius={[8, 8, 0, 0]}
                  name="Collaboration Score"
                  isAnimationActive={false}
                />
                <Line
                  key="department-collaboration-line"
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  strokeWidth={4}
                  isAnimationActive={false}
                  dot={renderDepartmentDot}
                  activeDot={renderDepartmentActiveDot}
                  name="Engagement Trend"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </motion.div>

      {/* Upcoming Events & Holiday Planner */}
      <motion.div variants={cardVariants} className="h-auto min-h-0 border border-red-500 rounded-3xl p-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
            <Calendar className="h-5 w-5 shrink-0 text-emerald-400" /> Upcoming Events &amp; Holidays
          </h2>
          <button className="text-xs inline-flex items-center gap-1 text-emerald-400 hover:text-white transition-colors">
            View Full Calendar <ArrowRight className="h-3 w-3 shrink-0" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {upcomingEvents.map((event, i) => {
            const styles = colorMap[event.color as keyof typeof colorMap];
            const isNext = i === 0;
            return (
              <motion.div
                key={`upcoming-event-${event.date}-${event.title}`}
                variants={cardVariants}
                className={`relative overflow-hidden rounded-3xl border ${isNext ? "border-emerald-400/60 shadow-xl" : "border-white/10"} bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.22)] hover:-translate-y-1 transition-all duration-500`}
              >
                {isNext && (
                  <div className="absolute top-4 right-4 text-[10px] font-medium bg-emerald-400 text-white px-2.5 py-0.5 rounded-3xl">NEXT EVENT</div>
                )}
                <div className="flex items-start gap-4">
                  <div className={`${styles.bg} flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl`}>
                    <event.icon className={`${styles.text} h-5 w-5 shrink-0`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`inline-flex text-xs font-medium px-3 py-1 rounded-3xl mb-2 ${styles.bg} ${styles.text}`}>
                      {event.type}
                    </div>
                    <p className="font-medium text-white text-sm leading-tight line-clamp-2 break-words">{event.title}</p>
                    <p className="text-xs text-zinc-400 mt-3">{event.date} • {event.time}</p>
                    <p className="text-xs text-zinc-500 mt-4 line-clamp-2 break-words">{event.description}</p>
                    <div className="mt-6 flex items-center justify-between">
                      <div className="text-xs font-medium bg-white/10 px-3 py-1 rounded-3xl shrink-0">
                        {event.daysLeft} days left
                      </div>
                      {event.daysLeft <= 7 && <div className="text-rose-400 text-xs font-medium shrink-0">Urgent</div>}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mini Calendar Preview */}
        <div className="mt-8 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-medium">August 2026</p>
            <div className="text-xs text-zinc-400">Mini Calendar</div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={`mini-calendar-weekday-${d}-${i}`} className="text-zinc-400 font-medium">{d}</div>
            ))}
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={`mini-calendar-slot-${i + 1}`}
                className={`h-7 flex items-center justify-center rounded-xl text-[10px] ${i === 14 ? "bg-emerald-400 text-white" : "text-zinc-400"}`}
              >
                {i + 1 > 31 ? "" : i + 1}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* OKR Tracking */}
      <motion.div variants={cardVariants} className="h-auto min-h-0 border border-red-500 rounded-3xl p-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
            <Trophy className="h-5 w-5 shrink-0 text-emerald-400" /> OKR Tracking
          </h2>
          <span className="text-xs text-emerald-400">Q2 2026 • 76% overall progress</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 relative h-auto min-h-0 overflow-hidden rounded-3xl border border-white/10 border-red-500 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]">
            <div className="text-center">
              <p className="text-sm text-zinc-500">Company OKR Progress</p>
              <div className="relative w-32 h-32 mx-auto mt-4">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 42 42">
                  <circle cx="21" cy="21" r="15" fill="none" stroke="#ffffff10" strokeWidth="5" />
                  <circle cx="21" cy="21" r="15" fill="none" stroke="#22C55E" strokeWidth="5" strokeDasharray="76 100" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-5xl font-semibold text-white">76%</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-9 relative h-auto min-h-0 overflow-hidden rounded-3xl border border-white/10 border-red-500 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]">
            <div className="space-y-6">
              {okrTracking.map((okr) => (
                <div key={`okr-${okr.objective}`} className="flex items-center gap-6">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white line-clamp-2 break-words">{okr.objective}</p>
                    <p className="text-xs text-zinc-400 mt-1 break-words">{okr.keyResults}</p>
                  </div>
                  <div className="w-32 shrink-0">
                    <div className="h-2 bg-white/10 rounded-3xl overflow-hidden">
                      <div className="h-full rounded-3xl" style={{ width: `${okr.progress}%`, backgroundColor: okr.color }} />
                    </div>
                  </div>
                  <div className="text-right w-28 shrink-0">
                    <span className="text-sm font-medium">{okr.progress}%</span>
                    <span className={`ml-3 text-xs px-3 py-1 rounded-3xl ${okr.status === "On Track" ? "bg-emerald-500/10 text-emerald-400" : okr.status === "At Risk" ? "bg-amber-500/10 text-amber-400" : "bg-rose-500/10 text-rose-400"}`}>
                      {okr.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Workforce Forecast - ComposedChart */}
      <motion.div variants={cardVariants} className="h-auto min-h-0 rounded-3xl border border-white/10 border-red-500 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden">
        <h3 className="font-semibold text-xl mb-6 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 shrink-0 text-emerald-400" /> Workforce Forecast (Advanced Composed)
        </h3>
        {safeForecastData.length > 0 && (
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={safeForecastData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <defs>
                  <linearGradient id="dashboard-headcount-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#ffffff10" strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: "#ffffff15" }} />
                <YAxis tickLine={false} axisLine={{ stroke: "#ffffff15" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  key="workforce-headcount-bar"
                  dataKey="headcount"
                  fill="url(#dashboard-headcount-gradient)"
                  radius={[8, 8, 0, 0]}
                  name="Actual Headcount"
                  isAnimationActive={false}
                />
                <Line
                  key="workforce-plan-line"
                  type="monotone"
                  dataKey="plan"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  isAnimationActive={false}
                  dot={renderForecastPlanDot}
                  activeDot={renderForecastPlanActiveDot}
                  name="Plan"
                />
                <Line
                  key="workforce-target-line"
                  type="monotone"
                  dataKey="target"
                  stroke="#A855F7"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  isAnimationActive={false}
                  dot={false}
                  activeDot={renderForecastTargetActiveDot}
                  name="Target"
                />
                <ReferenceLine
                  key="workforce-critical-threshold"
                  y={1300}
                  stroke="#EF4444"
                  strokeDasharray="4 4"
                  label="Critical Threshold"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </motion.div>

      {/* Attendance Trend - Advanced AreaChart */}
      <motion.div variants={cardVariants} className="h-auto min-h-0 rounded-3xl border border-white/10 border-red-500 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden">
        <h3 className="font-semibold text-xl mb-6">Weekly Attendance Trend (Advanced Gradient)</h3>
        {safeAttendanceTrend.length > 0 && (
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={safeAttendanceTrend}>
                <defs>
                  <linearGradient id="dashboard-attendance-gradient-advanced" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#ffffff10" />
                <XAxis dataKey="day" tickLine={false} axisLine={{ stroke: "#ffffff15" }} />
                <YAxis domain={[80, 100]} tickLine={false} axisLine={{ stroke: "#ffffff15" }} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  key="advanced-attendance-area"
                  type="monotone"
                  dataKey="attendance"
                  stroke="#22C55E"
                  strokeWidth={4}
                  fill="url(#dashboard-attendance-gradient-advanced)"
                  isAnimationActive={false}
                  dot={renderAttendanceDot}
                  activeDot={renderAttendanceActiveDot}
                />
                <ReferenceLine key="advanced-attendance-target" y={95} stroke="#F59E0B" strokeDasharray="3 3" label="Target" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </motion.div>

      {/* Employee Sentiment - Premium Donut */}
      <motion.div variants={cardVariants} className="relative h-auto min-h-0 overflow-hidden rounded-3xl border border-white/10 border-red-500 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]">
        <h3 className="font-semibold text-xl mb-6">Employee Sentiment Intelligence (Advanced Donut)</h3>
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="w-[280px] h-[280px]">
            <PieChart width={280} height={280}>
              <Pie
                key="employee-sentiment-pie"
                data={safeSentimentData}
                cx="50%"
                cy="50%"
                innerRadius={95}
                outerRadius={130}
                dataKey="value"
                isAnimationActive={false}
              >
                {safeSentimentData.map((entry, i) => (
                  <Cell key={`sentiment-${entry.name}-${i}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-white text-5xl font-semibold">
                87%
              </text>
            </PieChart>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-emerald-400 font-medium">AI Summary</p>
            <p className="text-zinc-300 mt-2 break-words">Overall employee sentiment is positive but workload concerns increased in Engineering. Recognition and growth opportunities remain top drivers of engagement.</p>
            <div className="mt-8 text-xs text-zinc-400">Latest employee quote</div>
            <p className="italic text-white mt-1 break-words">"The new mentorship program made me feel truly supported — this is why I stay."</p>
            <p className="text-xs text-zinc-500 mt-3">— Priya Patel, Product Manager</p>
          </div>
        </div>
      </motion.div>

      {/* Predictive Workforce Analytics */}
      <motion.div variants={cardVariants} className="h-auto min-h-0 border border-red-500 rounded-3xl p-0">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
          <Gauge className="h-5 w-5 shrink-0 text-emerald-400" /> Predictive Workforce Analytics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {predictiveMetrics.map((metric) => (
            <motion.div
              key={`predictive-metric-${metric.title}`}
              variants={cardVariants}
              className="relative h-auto min-h-0 overflow-hidden rounded-3xl border border-white/10 border-red-500 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl p-7 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.22)] hover:-translate-y-1 transition-all duration-500 flex flex-col items-center"
            >
              <div className="relative w-24 h-24 shrink-0">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 42 42">
                  <circle cx="21" cy="21" r="15" fill="none" stroke="#ffffff10" strokeWidth="4" />
                  <circle cx="21" cy="21" r="15" fill="none" stroke={metric.color} strokeWidth="4" strokeDasharray={`${metric.value} 100`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-4xl font-semibold text-white">{metric.value}%</div>
              </div>
              <p className="font-medium mt-6 text-center">{metric.title}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-emerald-400">{metric.trend}</span>
                <span className="text-xs px-3 py-1 rounded-3xl bg-white/10">{metric.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="w-full h-auto min-h-0 overflow-hidden border border-red-500 rounded-3xl">
        <AIHRCommandCockpit2027 />
      </div>

      {/* Advanced eNPS Section */}
      <motion.div variants={cardVariants} className="flex flex-col gap-6 h-auto min-h-0 border border-red-500 rounded-3xl p-0">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
          <Heart className="h-5 w-5 shrink-0 text-emerald-400" /> Advanced eNPS Intelligence
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 relative h-auto min-h-0 overflow-hidden rounded-3xl border border-white/10 border-red-500 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]">
            <div className="text-center">
              <p className="text-sm text-zinc-500">Current eNPS</p>
              <div className="text-7xl font-semibold text-white mt-2">{eNPS}</div>
              <div className="text-emerald-400 text-sm font-medium mt-1">+8 from last quarter</div>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-auto min-h-0 overflow-hidden rounded-3xl border border-white/10 border-red-500 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]">
            <h3 className="font-medium mb-6">eNPS Formula</h3>
            <div className="flex justify-center items-center gap-12 text-sm">
              <div className="text-center">
                <div className="text-4xl font-semibold text-emerald-400">{promoters}%</div>
                <p className="text-xs text-zinc-400 mt-1">Promoters (9–10)</p>
              </div>
              <div className="text-rose-400 text-6xl font-light">-</div>
              <div className="text-center">
                <div className="text-4xl font-semibold text-rose-400">{detractors}%</div>
                <p className="text-xs text-zinc-400 mt-1">Detractors (0–6)</p>
              </div>
            </div>
            <div className="text-center mt-8 text-4xl font-semibold text-emerald-400">= {eNPS}</div>
            <p className="text-center text-xs text-zinc-400 mt-2">Passives (7–8) are excluded</p>
          </div>

          <div className="lg:col-span-4 relative h-auto min-h-0 overflow-hidden rounded-3xl border border-white/10 border-red-500 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]">
            <h3 className="font-medium mb-4">Industry Benchmarks</h3>
            <div className="space-y-4">
              {eNPSBenchmark.map((bench) => (
                <div key={`enps-benchmark-${bench.industry}`} className="flex justify-between text-sm">
                  <span className="text-zinc-400">{bench.industry}</span>
                  <span className={`font-medium ${bench.score > eNPS ? "text-emerald-400" : "text-zinc-400"}`}>{bench.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {engagementStrategies.map((strat) => (
            <motion.div key={`engagement-strategy-${strat.title}`} variants={cardVariants} className="rounded-3xl border border-white/10 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl p-6 overflow-hidden">
              <strat.icon className="h-6 w-6 mb-4 shrink-0 text-emerald-400" />
              <p className="font-medium break-words">{strat.title}</p>
              <p className="text-emerald-400 text-sm mt-6">Expected impact: <span className="font-semibold">{strat.impact}</span></p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Team Health Score */}
      <motion.div variants={cardVariants} className="h-auto min-h-0 border border-red-500 rounded-3xl p-0">
        <h2 className="text-xl font-semibold mb-6">Team Health Score</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {teamHealth.map((health) => (
            <motion.div key={`team-health-${health.label}`} variants={cardVariants} className="rounded-3xl border border-white/10 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl p-7 overflow-hidden">
              <p className="text-sm text-zinc-500">{health.label}</p>
              <div className="flex items-center justify-between mt-4">
                <div className="text-5xl font-semibold text-white">{health.score}</div>
                <div className="w-20 h-2 bg-white/10 rounded-3xl overflow-hidden shrink-0">
                  <div className="h-full bg-emerald-400" style={{ width: `${health.score}%` }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Diversity & Inclusion */}
      <motion.div variants={cardVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto min-h-0 border border-red-500 rounded-3xl p-0">
        <div className="rounded-3xl border border-white/10 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl p-8 overflow-hidden">
          <h3 className="font-medium mb-6">Gender Distribution</h3>
          <div className="flex justify-between text-sm">
            <div>Female <span className="font-semibold text-white">{diversityData.gender.female}%</span></div>
            <div>Male <span className="font-semibold text-white">{diversityData.gender.male}%</span></div>
            <div>Other <span className="font-semibold text-white">{diversityData.gender.other}%</span></div>
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl p-8 overflow-hidden">
          <h3 className="font-medium mb-6">Diversity Index</h3>
          <div className="text-6xl font-semibold text-white">{diversityData.inclusivityScore}</div>
          <p className="text-emerald-400 text-sm">+4% from last quarter</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl p-8 overflow-hidden">
          <h3 className="font-medium mb-6">Age Distribution</h3>
          <div className="space-y-3 text-sm">
            {Object.entries(diversityData.age).map(([key, val]) => (
              <div key={key} className="flex justify-between">
                <span>{key}</span>
                <span className="font-medium">{val}%</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Learning & Development + Recognition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto min-h-0 border border-red-500 rounded-3xl p-0">
        <motion.div variants={cardVariants} className="rounded-3xl border border-white/10 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl p-8 overflow-hidden">
          <h3 className="font-semibold mb-6">Learning & Development</h3>
          {lndMetrics.map((m) => (
            <div key={`lnd-metric-${m.title}`} className="flex justify-between py-4 border-b border-white/10 last:border-none">
              <span className="text-zinc-400">{m.title}</span>
              <span className="font-semibold text-white">{m.value}</span>
            </div>
          ))}
        </motion.div>

        <motion.div variants={cardVariants} className="rounded-3xl border border-white/10 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl p-8 overflow-hidden">
          <h3 className="font-semibold mb-6">Recognition & Rewards</h3>
          <div className="text-center">
            <p className="text-emerald-400">Most Recognized</p>
            <p className="text-3xl font-medium mt-3">{recognitionData.mostRecognized}</p>
            <p className="text-sm text-zinc-400 mt-8">{recognitionData.totalThisMonth} recognitions this month</p>
          </div>
        </motion.div>
      </div>

      {/* Department Benchmarking */}
      <motion.div variants={cardVariants} className="h-auto min-h-0 rounded-3xl border border-white/10 border-red-500 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl p-8 overflow-hidden">
        <h3 className="font-semibold mb-8">Department Benchmarking</h3>
        <div className="space-y-6">
          {safeDepartmentData.map((dept: any) => (
            <div key={`department-benchmark-${dept.name}`} className="flex items-center gap-8">
              <div className="w-36 font-medium">{dept.name}</div>
              <div className="flex-1 h-2.5 bg-white/10 rounded-3xl overflow-hidden">
                <div className="h-full bg-emerald-400" style={{ width: `${dept.value}%` }} />
              </div>
              <div className="font-mono text-sm text-white w-12">{dept.value}%</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Insights */}
      <motion.div variants={cardVariants} className="h-auto min-h-0 border border-red-500 rounded-3xl p-0">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
          <BarChart3 className="h-5 w-5 shrink-0 text-emerald-400" /> Engagement Snapshot
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {quickInsights.map((item) => {
            const styles = colorMap[item.color as keyof typeof colorMap];
            return (
              <motion.div
                key={`quick-insight-${item.title}`}
                variants={cardVariants}
                className="relative h-auto min-h-0 overflow-hidden rounded-3xl border border-white/10 border-red-500 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl p-7 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.22)] hover:-translate-y-1 transition-all duration-500"
              >
                <div className={`absolute left-0 top-0 h-full w-1 ${styles.border}`} />
                <div className="flex items-center gap-3">
                  <div className={`${styles.bg} flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl`}>
                    <item.icon className={`${styles.text} h-5 w-5 shrink-0`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-4xl font-semibold text-white truncate">{item.value}</p>
                    <p className="text-zinc-500 text-sm mt-1 truncate">{item.title}</p>
                  </div>
                </div>
                <p className={`mt-8 text-xs font-medium ${styles.text}`}>{item.trend}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Attendance Trend + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-auto min-h-0 border border-red-500 rounded-3xl p-0">
        <motion.div variants={cardVariants} className="lg:col-span-3 relative h-auto min-h-0 overflow-hidden rounded-3xl border border-white/10 border-red-500 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.22)] hover:-translate-y-1 transition-all duration-500">
          <h3 className="font-semibold text-xl mb-6">Weekly Attendance Trend</h3>
          {safeAttendanceTrend.length > 0 && (
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={safeAttendanceTrend}>
                  <defs>
                  <linearGradient id="dashboard-attendance-gradient-summary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0.02} />
                  </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#ffffff10" />
                  <XAxis dataKey="day" tickLine={false} axisLine={{ stroke: "#ffffff15" }} />
                  <YAxis domain={[80, 100]} tickLine={false} axisLine={{ stroke: "#ffffff15" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    key="summary-attendance-area"
                    type="natural"
                    dataKey="attendance"
                    stroke="#22C55E"
                    strokeWidth={3}
                    fill="url(#dashboard-attendance-gradient-summary)"
                    isAnimationActive={false}
                    dot={renderAttendanceDot}
                    activeDot={renderAttendanceActiveDot}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </motion.div>

        <motion.div variants={cardVariants} className="lg:col-span-2 relative h-auto min-h-0 overflow-hidden rounded-3xl border border-white/10 border-red-500 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.22)] hover:-translate-y-1 transition-all duration-500 flex flex-col">
          <h3 className="font-semibold text-xl mb-8">Today’s Attendance</h3>
          <div className="grid grid-cols-2 gap-4 flex-1">
            {attendanceSummary.map((item) => (
              <div key={`attendance-summary-${item.label}`} className="rounded-3xl bg-zinc-950/40 p-6 border border-white/5 overflow-hidden">
                <div className="w-3 h-3 rounded-full mb-5" style={{ backgroundColor: item.color }} />
                <p className="text-4xl font-semibold text-white truncate">{item.value}</p>
                <p className="text-sm text-zinc-400 mt-1">{item.label}</p>
                <p className="text-xs text-zinc-500 mt-4">{item.percent}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity + Notifications */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-auto min-h-0 border border-red-500 rounded-3xl p-0">
        <motion.div variants={cardVariants} className="xl:col-span-7 relative h-auto min-h-0 overflow-hidden rounded-3xl border border-white/10 border-red-500 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.22)] hover:-translate-y-1 transition-all duration-500">
          <h3 className="font-semibold text-xl mb-8">Recent Engagement Activity</h3>
          <div className="space-y-6">
            {recentActivities.map((act) => (
              <div key={`recent-activity-${act.title}`} className="flex items-start gap-6 group">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                  <act.icon className="h-5 w-5 shrink-0 text-zinc-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white group-hover:text-emerald-400 transition-colors break-words">{act.title}</p>
                  <p className="text-sm text-zinc-500 break-words">{act.desc}</p>
                  <p className="text-xs text-zinc-500 mt-3">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="xl:col-span-5 relative h-auto min-h-0 overflow-hidden rounded-3xl border border-white/10 border-red-500 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.22)] hover:-translate-y-1 transition-all duration-500">
          <h3 className="font-semibold text-xl mb-8">Engagement Alerts</h3>
          <div className="space-y-4">
            {notifications?.length > 0 && notifications.map((n) => (
              <div key={`engagement-alert-${n.dot}-${n.text}`} className="flex items-center gap-4 bg-zinc-950/50 rounded-3xl p-5 border border-white/5">
                <div
                  className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                    dotColorMap[n.dot as keyof typeof dotColorMap]
                  }`}
                />
                <p className="text-sm text-zinc-300 break-words flex-1 min-w-0">{n.text}</p>
              </div>
            ))}
          </div> 
        </motion.div>
      </div>

      {/* Top Performers + Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto min-h-0 border border-red-500 rounded-3xl p-0">
        <motion.div variants={cardVariants} className="relative h-auto min-h-0 overflow-hidden rounded-3xl border border-white/10 border-red-500 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.22)] hover:-translate-y-1 transition-all duration-500">
          <h3 className="font-semibold text-xl mb-8">Top Performers • Engagement Impact</h3>
          <div className="space-y-6"> 
            {topPerformers?.length > 0 && topPerformers.map((emp, i) => (
              <div key={`top-performer-${emp.rank}-${emp.name}`} className="flex items-center gap-5">
                <div className="relative shrink-0">
                  <img src={emp.avatar} alt="" className="w-12 h-12 rounded-3xl ring-2 ring-white/10" />
                  {i === 0 && <Award className="absolute -top-1 -right-1 text-amber-400 h-6 w-6 shrink-0" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{emp.name}</p>
                  <p className="text-xs text-zinc-500 truncate">{emp.dept}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs px-3 py-1 bg-white/10 rounded-3xl">#{emp.rank}</div>
                  <div className="text-3xl font-semibold text-emerald-400 mt-2 font-mono">{emp.score}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="relative h-auto min-h-0 overflow-hidden rounded-3xl border border-white/10 border-red-500 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.22)] hover:-translate-y-1 transition-all duration-500">
          <h3 className="font-semibold text-xl mb-8">Recruitment Pipeline</h3>
          <div className="space-y-6"> 
            {[
              { stage: "Applied", count: 184, color: "#64748B" },
              { stage: "Screened", count: 92, color: "#3B82F6" },
              { stage: "Interview", count: 31, color: "#A855F7" },
              { stage: "Offer", count: 14, color: "#22C55E" },
            ].map((step, i) => (
              <div key={`recruitment-stage-${step.stage}`} className="flex items-center gap-6">
                <div className="flex-shrink-0 w-8 h-8 rounded-2xl border border-white/20 flex items-center justify-center text-sm font-medium" style={{ color: step.color }}> 
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="font-medium text-white truncate">{step.stage}</span>
                    <span className="font-mono text-zinc-400">{step.count}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-3xl overflow-hidden">
                    <div className="h-full rounded-3xl" style={{ width: `${(step.count / 184) * 100}%`, backgroundColor: step.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div> 
        </motion.div>
      </div>

      {/* Leave Requests Table */}
      <motion.div variants={cardVariants} className="relative h-auto min-h-0 overflow-hidden rounded-3xl border border-white/10 border-red-500 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.22)] hover:-translate-y-1 transition-all duration-500">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-semibold text-xl">Pending Leave Requests</h3>
          <button className="text-emerald-400 text-sm inline-flex items-center gap-2 hover:text-white transition-colors">
            View all requests <ArrowRight className="h-4 w-4 shrink-0" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase text-zinc-500 tracking-widest">
                <th className="pb-6 text-left font-normal">Employee</th>
                <th className="pb-6 text-left font-normal">Leave Type</th>
                <th className="pb-6 text-left font-normal">Days</th>
                <th className="pb-6 text-left font-normal">Status</th>
                <th className="pb-6 text-right font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {leaveRequests?.length > 0 && leaveRequests.map((req) => (
                <tr key={req.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-7 flex items-center gap-4">
                    <img src={req.avatar} alt="" className="w-9 h-9 rounded-3xl shrink-0" />
                    <span className="font-medium truncate">{req.name}</span>
                  </td>
                  <td className="py-7 text-zinc-400">{req.type}</td>
                  <td className="py-7 text-zinc-400">{req.days} days</td>
                  <td className="py-7">
                    <span className="px-5 py-1 text-xs rounded-3xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {req.status}
                    </span>
                  </td>
                  <td className="py-7 text-right space-x-6">
                    <button className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">Approve</button>
                    <button className="text-rose-400 hover:text-rose-300 text-sm font-medium">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
