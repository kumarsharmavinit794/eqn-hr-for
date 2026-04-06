import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, LogIn, LogOut, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/StatCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "@/lib/api";

type AttendanceLog = {
  id: number;
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  hours: number | null;
  status: string;
};

type AttendanceChartPoint = { day: string; hours: number };

type AttendanceStats = { daysPresent: number; avgHoursPerDay: number; lateArrivals: number };

export default function AttendancePage() {
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [clockedIn, setClockedIn] = useState(false);
  const [chart, setChart] = useState<AttendanceChartPoint[]>([]);
  const [stats, setStats] = useState<AttendanceStats>({ daysPresent: 0, avgHoursPerDay: 0, lateArrivals: 0 });

  const formatTime = (iso: string | null | undefined) =>
    iso ? new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—";

  const formatDate = (isoDate: string | null | undefined) =>
    isoDate ? new Date(isoDate).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "—";

  const currentMonthLabel = new Date().toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const loadAttendance = async () => {
    const res = await api.get("/attendance");
    console.log("API:", res.data);
    const payload = res.data?.data;
    if (Array.isArray(payload)) {
      setLogs(payload as any);
      setClockedIn(false);
      setChart([]);
      setStats({ daysPresent: 0, avgHoursPerDay: 0, lateArrivals: 0 });
      return;
    }
    setLogs(payload?.logs || []);
    setClockedIn(Boolean(payload?.clockedIn));
    setChart(payload?.chart || []);
    setStats(payload?.stats || { daysPresent: 0, avgHoursPerDay: 0, lateArrivals: 0 });
  };

  useEffect(() => {
    loadAttendance().catch((err) => console.error("Error fetching attendance data:", err));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="page-header">Attendance</h1>
        <p className="page-subheader">Track your daily attendance and working hours</p>
      </div>

      {/* Clock In/Out */}
      <div className="glass-card rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="text-center sm:text-left flex-1">
          <p className="text-4xl font-bold mono-text">
            {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <Button
          size="lg"
          onClick={async () => {
            try {
              if (clockedIn) {
                await api.post("/clock-out");
              } else {
                await api.post("/clock-in");
              }
              await loadAttendance();
            } catch (err) {
              console.error("Error clocking in/out:", err);
              alert("Failed to update attendance.");
            }
          }}
          className={clockedIn ? "bg-destructive hover:bg-destructive/90" : ""}
        >
          {clockedIn ? <><LogOut className="w-4 h-4 mr-2" /> Clock Out</> : <><LogIn className="w-4 h-4 mr-2" /> Clock In</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Days Present" value={String(stats.daysPresent)} change="This month" icon={CalendarDays} />
        <StatCard title="Avg Hours/Day" value={`${stats.avgHoursPerDay}h`} change="This month" icon={Clock} />
        <StatCard title="Late Arrivals" value={String(stats.lateArrivals)} change="This month" icon={LogIn} />
      </div>

      {/* Monthly Chart */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="font-semibold mb-4">Daily Hours ({currentMonthLabel})</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chart}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
            <Bar dataKey="hours" fill="hsl(174,72%,40%)" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Logs */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="font-semibold mb-4">Recent Logs</h3>
        <div className="space-y-3">
          {logs.map((log, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-sm font-medium w-20">{formatDate(log.date)}</span>
              <span className="text-sm text-muted-foreground">{formatTime(log.clockIn)}</span>
              <span className="text-sm text-muted-foreground">{formatTime(log.clockOut)}</span>
              <span className="text-sm font-medium mono-text w-20 text-right">{typeof log.hours === "number" ? `${log.hours}h` : "—"}</span>
              <Badge variant="outline" className={`text-xs capitalize ${
                log.status === "active" || log.status === "present" ? "text-success border-success/30" :
                log.status === "absent" ? "text-destructive border-destructive/30" : "text-muted-foreground"
              }`}>{log.status || "unknown"}</Badge>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
