import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Users, Briefcase, Clock, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const attritionData = [
  { month: "Oct", rate: 4.2 }, { month: "Nov", rate: 3.8 }, { month: "Dec", rate: 5.1 },
  { month: "Jan", rate: 4.5 }, { month: "Feb", rate: 3.9 }, { month: "Mar", rate: 3.2 },
];

const hiringFunnel = [
  { stage: "Applied", count: 450 },
  { stage: "Screened", count: 280 },
  { stage: "Interviewed", count: 120 },
  { stage: "Offered", count: 45 },
  { stage: "Joined", count: 32 },
];

const departmentDistribution = [
  { name: "Engineering", value: 45, color: "hsl(var(--primary))" },
  { name: "Sales", value: 25, color: "hsl(var(--accent))" },
  { name: "Marketing", value: 15, color: "hsl(var(--warning))" },
  { name: "Design", value: 10, color: "hsl(var(--info))" },
  { name: "HR", value: 5, color: "hsl(var(--success))" },
];

const performanceTrend = [
  { month: "Oct", avg: 3.6, top: 4.5, low: 2.8 },
  { month: "Nov", avg: 3.7, top: 4.6, low: 2.9 },
  { month: "Dec", avg: 3.5, top: 4.4, low: 2.7 },
  { month: "Jan", avg: 3.8, top: 4.7, low: 3.0 },
  { month: "Feb", avg: 3.9, top: 4.8, low: 3.1 },
  { month: "Mar", avg: 4.0, top: 4.9, low: 3.2 },
];

const headcountTrend = [
  { month: "Oct", count: 142 }, { month: "Nov", count: 148 }, { month: "Dec", count: 145 },
  { month: "Jan", count: 152 }, { month: "Feb", count: 158 }, { month: "Mar", count: 165 },
];

const chartStyle = { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 };

export default function AnalyticsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="page-header">Analytics & Reports</h1>
        <p className="page-subheader">Comprehensive workforce analytics, hiring reports & performance insights</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Employees", value: "165", icon: Users, change: "+7 this month", up: true },
          { label: "Attrition Rate", value: "3.2%", icon: TrendingDown, change: "-0.7% vs last month", up: false },
          { label: "Open Positions", value: "23", icon: Briefcase, change: "5 critical", up: true },
          { label: "Avg Tenure", value: "2.8 yrs", icon: Clock, change: "+0.3 vs last year", up: true },
        ].map((s) => (
          <Card key={s.label} className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <s.icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xl font-bold">{s.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {s.up ? <TrendingUp className="w-3 h-3 text-success" /> : <TrendingDown className="w-3 h-3 text-success" />}
                <span className="text-xs text-muted-foreground">{s.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Attrition Trend */}
        <Card className="glass-card">
          <CardHeader className="pb-2"><CardTitle className="text-base">Attrition Rate Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={attritionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={chartStyle} />
                <Area type="monotone" dataKey="rate" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.15} name="Attrition %" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Hiring Funnel */}
        <Card className="glass-card">
          <CardHeader className="pb-2"><CardTitle className="text-base">Hiring Funnel</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={hiringFunnel} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis type="category" dataKey="stage" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} width={80} />
                <Tooltip contentStyle={chartStyle} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card className="glass-card">
          <CardHeader className="pb-2"><CardTitle className="text-base">Department Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={departmentDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="value">
                  {departmentDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Trend */}
        <Card className="glass-card">
          <CardHeader className="pb-2"><CardTitle className="text-base">Performance Score Trends</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={performanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis domain={[2, 5]} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={chartStyle} />
                <Line type="monotone" dataKey="top" stroke="hsl(var(--success))" strokeWidth={2} name="Top Performers" />
                <Line type="monotone" dataKey="avg" stroke="hsl(var(--primary))" strokeWidth={2} name="Average" />
                <Line type="monotone" dataKey="low" stroke="hsl(var(--warning))" strokeWidth={2} name="Needs Improvement" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Headcount Trend */}
      <Card className="glass-card">
        <CardHeader className="pb-2"><CardTitle className="text-base">Headcount Growth</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={headcountTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={chartStyle} />
              <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} name="Headcount" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
