import { motion } from "framer-motion";
import { Users, UserCheck, Clock, DollarSign, TrendingUp, Briefcase, CalendarCheck, Target } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

const barData = [
  { month: "Jan", hired: 12, left: 3 },
  { month: "Feb", hired: 8, left: 2 },
  { month: "Mar", hired: 15, left: 4 },
  { month: "Apr", hired: 10, left: 1 },
  { month: "May", hired: 18, left: 5 },
  { month: "Jun", hired: 14, left: 2 },
];

const pieData = [
  { name: "Engineering", value: 45 },
  { name: "Design", value: 15 },
  { name: "Marketing", value: 20 },
  { name: "Sales", value: 25 },
  { name: "HR", value: 10 },
];

const COLORS = ["hsl(174,72%,40%)", "hsl(262,60%,55%)", "hsl(38,92%,50%)", "hsl(210,80%,55%)", "hsl(152,60%,42%)"];

const areaData = [
  { day: "Mon", attendance: 92 },
  { day: "Tue", attendance: 96 },
  { day: "Wed", attendance: 89 },
  { day: "Thu", attendance: 94 },
  { day: "Fri", attendance: 85 },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export default function DashboardPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <div>
        <h1 className="page-header">Dashboard</h1>
        <p className="page-subheader">Welcome back, John. Here's your HR overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Employees" value="1,248" change="+12 this month" changeType="up" icon={Users} />
        <StatCard title="Active Recruitment" value="23" change="5 closing soon" changeType="neutral" icon={Briefcase} />
        <StatCard title="Attendance Rate" value="94.2%" change="+1.3% vs last week" changeType="up" icon={CalendarCheck} />
        <StatCard title="Avg Performance" value="8.4/10" change="+0.3 vs Q1" changeType="up" icon={Target} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card rounded-xl p-5">
          <h3 className="font-semibold mb-4">Hiring vs Attrition</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Bar dataKey="hired" fill="hsl(174,72%,40%)" radius={[4,4,0,0]} />
              <Bar dataKey="left" fill="hsl(0,72%,55%)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h3 className="font-semibold mb-4">Department Split</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={4}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {pieData.map((d, i) => (
              <span key={d.name} className="text-xs flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                {d.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance area chart */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="font-semibold mb-4">Weekly Attendance Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={areaData}>
            <defs>
              <linearGradient id="attendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(174,72%,40%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(174,72%,40%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis domain={[80, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
            <Area type="monotone" dataKey="attendance" stroke="hsl(174,72%,40%)" fill="url(#attendGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
