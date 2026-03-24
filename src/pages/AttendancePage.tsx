import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, LogIn, LogOut, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/StatCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const monthlyData = [
  { day: "1", hours: 8.2 }, { day: "2", hours: 7.5 }, { day: "3", hours: 9.0 },
  { day: "4", hours: 8.0 }, { day: "5", hours: 0 }, { day: "6", hours: 0 },
  { day: "7", hours: 8.5 }, { day: "8", hours: 7.8 }, { day: "9", hours: 8.1 },
  { day: "10", hours: 8.7 }, { day: "11", hours: 9.2 }, { day: "12", hours: 0 },
  { day: "13", hours: 0 }, { day: "14", hours: 8.0 }, { day: "15", hours: 8.3 },
];

const logs = [
  { date: "Today", clockIn: "09:02 AM", clockOut: "—", hours: "In Progress", status: "active" },
  { date: "Mar 23", clockIn: "08:55 AM", clockOut: "06:12 PM", hours: "9h 17m", status: "complete" },
  { date: "Mar 22", clockIn: "09:10 AM", clockOut: "05:45 PM", hours: "8h 35m", status: "complete" },
  { date: "Mar 21", clockIn: "08:48 AM", clockOut: "06:30 PM", hours: "9h 42m", status: "complete" },
  { date: "Mar 20", clockIn: "—", clockOut: "—", hours: "—", status: "absent" },
];

export default function AttendancePage() {
  const [clockedIn, setClockedIn] = useState(true);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="page-header">Attendance</h1>
        <p className="page-subheader">Track your daily attendance and working hours</p>
      </div>

      {/* Clock In/Out */}
      <div className="glass-card rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="text-center sm:text-left flex-1">
          <p className="text-4xl font-bold mono-text">{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
          <p className="text-sm text-muted-foreground mt-1">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</p>
        </div>
        <Button
          size="lg"
          onClick={() => setClockedIn(!clockedIn)}
          className={clockedIn ? "bg-destructive hover:bg-destructive/90" : ""}
        >
          {clockedIn ? <><LogOut className="w-4 h-4 mr-2" /> Clock Out</> : <><LogIn className="w-4 h-4 mr-2" /> Clock In</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Days Present" value="21" change="This month" icon={CalendarDays} />
        <StatCard title="Avg Hours/Day" value="8.4h" change="+0.2h vs last month" changeType="up" icon={Clock} />
        <StatCard title="Late Arrivals" value="2" change="-3 vs last month" changeType="up" icon={LogIn} />
      </div>

      {/* Monthly Chart */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="font-semibold mb-4">Daily Hours (March 2026)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyData}>
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
              <span className="text-sm font-medium w-20">{log.date}</span>
              <span className="text-sm text-muted-foreground">{log.clockIn}</span>
              <span className="text-sm text-muted-foreground">{log.clockOut}</span>
              <span className="text-sm font-medium mono-text w-20 text-right">{log.hours}</span>
              <Badge variant="outline" className={`text-xs capitalize ${
                log.status === "active" ? "text-success border-success/30" :
                log.status === "absent" ? "text-destructive border-destructive/30" : "text-muted-foreground"
              }`}>{log.status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
