import { motion } from "framer-motion";
import { Target, TrendingUp, Award, Star } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Progress } from "@/components/ui/progress";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useEffect, useState } from "react";
import api from "@/lib/api";

// Type definitions for API response
interface RadarData {
  skill: string;
  score: number;
}

interface TrendData {
  month: string;
  score: number;
}

interface KPI {
  label: string;
  value: number;
  target: number;
}

interface PerformanceData {
  stats: {
    overallScore: number;
    productivity: number;
    growth: number;
    awards: number;
  };
  radar: RadarData[];
  trend: TrendData[];
  kpis: KPI[];
}

export default function PerformancePage() {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/performance")
      .then((res) => {
        setData(res.data?.data || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching performance data:", err);
        setError("Failed to load performance data");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading performance data...</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error || !data) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="text-center py-12">
          <p className="text-destructive">{error || "No data available"}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="page-header">Performance</h1>
        <p className="page-subheader">AI-driven performance analytics and KPI tracking</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard 
          title="Overall Score" 
          value={`${data.stats.overallScore}/10`} 
          change="+0.3 vs Q4" 
          changeType="up" 
          icon={Star} 
        />
        <StatCard 
          title="Productivity" 
          value={`${data.stats.productivity}%`} 
          change="Above average" 
          changeType="up" 
          icon={Target} 
        />
        <StatCard 
          title="Growth Rate" 
          value={`+${data.stats.growth}%`} 
          change="YoY improvement" 
          changeType="up" 
          icon={TrendingUp} 
        />
        <StatCard 
          title="Awards" 
          value={`${data.stats.awards}`} 
          change="This quarter" 
          icon={Award} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Radar Chart */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-semibold mb-4">Skill Assessment</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={data.radar}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="skill" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Radar 
                dataKey="score" 
                stroke="hsl(174,72%,40%)" 
                fill="hsl(174,72%,40%)" 
                fillOpacity={0.2} 
                strokeWidth={2} 
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Trend Chart */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-semibold mb-4">Performance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis domain={[7, 9]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  background: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))", 
                  borderRadius: 8 
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="hsl(262,60%,55%)" 
                strokeWidth={2} 
                dot={{ fill: "hsl(262,60%,55%)" }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* KPIs */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="font-semibold mb-4">Key Performance Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.kpis.map(kpi => (
            <div key={kpi.label} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{kpi.label}</span>
                <span className="mono-text font-semibold">
                  {kpi.value}%<span className="text-muted-foreground font-normal"> / {kpi.target}%</span>
                </span>
              </div>
              <Progress value={(kpi.value / kpi.target) * 100} className="h-2" />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
