import { motion } from "framer-motion";
import { Target, TrendingUp, Award, Star } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Progress } from "@/components/ui/progress";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const radarData = [
  { skill: "Leadership", score: 85 },
  { skill: "Communication", score: 92 },
  { skill: "Technical", score: 78 },
  { skill: "Teamwork", score: 95 },
  { skill: "Problem Solving", score: 88 },
  { skill: "Creativity", score: 72 },
];

const trendData = [
  { month: "Oct", score: 7.8 },
  { month: "Nov", score: 8.0 },
  { month: "Dec", score: 7.9 },
  { month: "Jan", score: 8.2 },
  { month: "Feb", score: 8.5 },
  { month: "Mar", score: 8.4 },
];

const kpis = [
  { label: "Tasks Completed", value: 94, target: 100 },
  { label: "Code Quality", value: 87, target: 90 },
  { label: "Collaboration", value: 96, target: 95 },
  { label: "On-time Delivery", value: 82, target: 90 },
];

export default function PerformancePage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="page-header">Performance</h1>
        <p className="page-subheader">AI-driven performance analytics and KPI tracking</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Overall Score" value="8.4/10" change="+0.3 vs Q4" changeType="up" icon={Star} />
        <StatCard title="Productivity" value="94%" change="Above average" changeType="up" icon={Target} />
        <StatCard title="Growth Rate" value="+12%" change="YoY improvement" changeType="up" icon={TrendingUp} />
        <StatCard title="Awards" value="3" change="This quarter" icon={Award} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Radar */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-semibold mb-4">Skill Assessment</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="skill" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Radar dataKey="score" stroke="hsl(174,72%,40%)" fill="hsl(174,72%,40%)" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Trend */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-semibold mb-4">Performance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis domain={[7, 9]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Line type="monotone" dataKey="score" stroke="hsl(262,60%,55%)" strokeWidth={2} dot={{ fill: "hsl(262,60%,55%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* KPIs */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="font-semibold mb-4">Key Performance Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {kpis.map(kpi => (
            <div key={kpi.label} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{kpi.label}</span>
                <span className="mono-text font-semibold">{kpi.value}%<span className="text-muted-foreground font-normal"> / {kpi.target}%</span></span>
              </div>
              <Progress value={(kpi.value / kpi.target) * 100} className="h-2" />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
