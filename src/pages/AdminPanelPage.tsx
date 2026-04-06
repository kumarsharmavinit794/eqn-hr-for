import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, ShieldCheck, UserCog, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";

export default function AdminPanelPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    api.get("/users").then((response) => setUsers(response.data?.data || [])).catch(() => setUsers([]));
    api.get("/activity-logs").then((response) => setLogs(response.data?.data || [])).catch(() => setLogs([]));
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="space-y-2">
        <h1 className="page-header">Admin Control Center</h1>
        <p className="page-subheader">Monitor users, security-sensitive activity, and company-wide recruitment operations.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon={Users} label="Total Users" value={users.length} />
        <SummaryCard icon={ShieldCheck} label="Admins" value={users.filter((user) => user.role === "admin").length} />
        <SummaryCard icon={UserCog} label="HR Team" value={users.filter((user) => user.role === "hr").length} />
        <SummaryCard icon={Activity} label="Recent Logs" value={logs.length} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Card className="glass-card">
          <CardHeader><CardTitle>Users</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {users.slice(0, 8).map((user) => (
              <div key={user.id} className="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <span className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">{user.role}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader><CardTitle>Audit Stream</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {logs.slice(0, 8).map((log) => (
              <div key={log.id} className="rounded-xl border border-border/60 px-4 py-3">
                <p className="font-medium">{log.action}</p>
                <p className="mt-1 text-sm text-muted-foreground">{log.detail}</p>
                <p className="mt-2 text-xs text-muted-foreground">{new Date(log.created_at).toLocaleString()}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

function SummaryCard({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
  return (
    <Card className="glass-card">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="rounded-2xl bg-primary/10 p-3 text-primary"><Icon className="h-5 w-5" /></div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
