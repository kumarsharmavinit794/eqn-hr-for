import { motion } from "framer-motion";
import { Monitor, Key, Shield, Users, Mail, Lock, Settings, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const systemAccess = [
  { employee: "Sarah Chen", email: "sarah@nexahr.com", systems: ["GitHub", "Slack", "Jira", "AWS"], role: "admin", status: "active" },
  { employee: "Marcus Johnson", email: "marcus@nexahr.com", systems: ["GitHub", "Slack", "Jira"], role: "developer", status: "active" },
  { employee: "Aisha Patel", email: "aisha@nexahr.com", systems: ["Figma", "Slack", "Notion"], role: "designer", status: "active" },
  { employee: "James Wilson", email: "james@nexahr.com", systems: ["GitHub", "AWS", "K8s"], role: "devops", status: "deactivated" },
];

const roles = [
  { name: "Super Admin", users: 2, permissions: ["All Access", "User Management", "Billing", "Settings"] },
  { name: "HR Manager", users: 5, permissions: ["Employee Data", "Attendance", "Payroll", "Reports"] },
  { name: "Team Lead", users: 12, permissions: ["Team View", "Approvals", "Performance"] },
  { name: "Employee", users: 146, permissions: ["Self Profile", "Leave Request", "Payslip"] },
];

const securitySettings = [
  { name: "Two-Factor Authentication", description: "Require 2FA for all users", enabled: true },
  { name: "SSO (Single Sign-On)", description: "Enable SAML-based SSO", enabled: true },
  { name: "IP Whitelisting", description: "Restrict access to office IPs", enabled: false },
  { name: "Session Timeout", description: "Auto-logout after 30 min idle", enabled: true },
  { name: "Password Rotation", description: "Force password change every 90 days", enabled: false },
  { name: "Audit Logging", description: "Log all user actions", enabled: true },
];

export default function ITAccessPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="page-header">IT & Access Management</h1>
        <p className="page-subheader">System access, role-based permissions & security settings</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Users", value: "163", icon: Users },
          { label: "System Integrations", value: "8", icon: Monitor },
          { label: "Security Score", value: "92%", icon: Shield },
          { label: "Pending Requests", value: "4", icon: Key },
        ].map((s) => (
          <Card key={s.label} className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <s.icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="access">
        <TabsList>
          <TabsTrigger value="access">System Access</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="security">Security Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="access" className="mt-4">
          <Card className="glass-card">
            <CardContent className="p-4 space-y-2">
              {systemAccess.map((s) => (
                <div key={s.email} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-primary-foreground text-xs font-semibold">
                    {s.employee.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{s.employee}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Mail className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{s.email}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {s.systems.map((sys) => (
                      <Badge key={sys} variant="secondary" className="text-xs">{sys}</Badge>
                    ))}
                  </div>
                  <Badge variant="outline" className="text-xs capitalize">{s.role}</Badge>
                  {s.status === "active" ? (
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  ) : (
                    <XCircle className="w-4 h-4 text-destructive" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="mt-4">
          <Card className="glass-card">
            <CardContent className="p-4 space-y-3">
              {roles.map((r) => (
                <div key={r.name} className="p-4 rounded-lg border border-border bg-muted/20">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-sm">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.users} users</p>
                    </div>
                    <Button size="sm" variant="outline"><Settings className="w-4 h-4 mr-1" /> Edit</Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {r.permissions.map((p) => (
                      <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <Card className="glass-card">
            <CardContent className="p-4 space-y-3">
              {securitySettings.map((s) => (
                <div key={s.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.description}</p>
                    </div>
                  </div>
                  <Switch checked={s.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
