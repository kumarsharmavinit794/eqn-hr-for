import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Briefcase, CalendarCheck, Target } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { getStoredRole } from "@/lib/auth";
import api from "@/lib/api";

const COLORS = ["#00C49F", "#8884d8", "#FFBB28", "#FF8042"];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const role = getStoredRole();

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => {
        console.log("API:", res.data);
        setData(res.data?.data || null);
      })
      .catch((err) => console.log(err));
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm sm:text-base">Loading...</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 w-full"
    >
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">Dashboard</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          {role === "admin" ? "System-wide overview for administrators." : "Operational overview for the HR team."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <StatCard title="Employees" value={data?.totalEmployees || 0} icon={Users} />
        <StatCard title="Recruitment" value={data?.activeRecruitment || 0} icon={Briefcase} />
        <StatCard title="Attendance" value={(data?.attendanceRate || 0) + "%"} icon={CalendarCheck} />
        <StatCard title="Performance" value={data?.avgPerformance || 0} icon={Target} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Bar Chart (2/3 width on large screens) */}
        <div className="lg:col-span-2 glass-card rounded-xl p-4 sm:p-5">
          <h3 className="font-semibold mb-4">Hiring vs Attrition</h3>
          {data?.hiringData && (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.hiringData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hired" fill="#00C49F" />
                <Bar dataKey="left" fill="#FF4C4C" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart (1/3 width on large screens) */}
        <div className="glass-card rounded-xl p-4 sm:p-5">
          <h3 className="font-semibold mb-4">Department Split</h3>
          {data?.departmentData && (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={data.departmentData} dataKey="value">
                    {data.departmentData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-2">
                {data.departmentData.map((d, i) => (
                  <span key={d.name} className="text-xs flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                    {d.name}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Area Chart (full width) */}
      <div className="glass-card rounded-xl p-4 sm:p-5">
        <h3 className="font-semibold mb-4">Weekly Attendance Trend</h3>
        {data?.attendanceTrend && (
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={data.attendanceTrend}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area dataKey="attendance" stroke="#00C49F" fill="#00C49F" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}
