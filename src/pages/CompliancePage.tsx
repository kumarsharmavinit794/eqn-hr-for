import { motion } from "framer-motion";
import { Shield, FileText, AlertTriangle, CheckCircle2, Clock, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const complianceItems = [
  { law: "Minimum Wages Act", status: "compliant", lastAudit: "Mar 15, 2026", nextAudit: "Jun 15, 2026" },
  { law: "Payment of Gratuity Act", status: "compliant", lastAudit: "Feb 20, 2026", nextAudit: "May 20, 2026" },
  { law: "POSH Act 2013", status: "attention", lastAudit: "Jan 10, 2026", nextAudit: "Apr 10, 2026" },
  { law: "Employees PF Act", status: "compliant", lastAudit: "Mar 1, 2026", nextAudit: "Jun 1, 2026" },
  { law: "ESI Act", status: "compliant", lastAudit: "Mar 5, 2026", nextAudit: "Jun 5, 2026" },
  { law: "Equal Remuneration Act", status: "non-compliant", lastAudit: "Dec 15, 2025", nextAudit: "Apr 1, 2026" },
];

const policies = [
  { name: "Employee Code of Conduct", version: "v3.2", updated: "Mar 2026", status: "active" },
  { name: "Anti-Harassment Policy", version: "v2.1", updated: "Feb 2026", status: "active" },
  { name: "Remote Work Policy", version: "v1.5", updated: "Jan 2026", status: "review" },
  { name: "Data Privacy Policy", version: "v2.0", updated: "Mar 2026", status: "active" },
  { name: "Leave Policy", version: "v4.0", updated: "Dec 2025", status: "active" },
];

const auditItems = [
  { area: "Payroll Compliance", score: 95, findings: 1, status: "passed" },
  { area: "Workplace Safety", score: 88, findings: 3, status: "passed" },
  { area: "Data Protection", score: 72, findings: 5, status: "needs-review" },
  { area: "Employee Records", score: 91, findings: 2, status: "passed" },
];

const statusColors: Record<string, string> = {
  compliant: "bg-success/10 text-success", attention: "bg-warning/10 text-warning", "non-compliant": "bg-destructive/10 text-destructive",
};

export default function CompliancePage() {
  const compliantCount = complianceItems.filter(c => c.status === "compliant").length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="page-header">Compliance & Legal</h1>
        <p className="page-subheader">Labor law compliance, company policies & audit management</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Overall Compliance", value: `${Math.round((compliantCount / complianceItems.length) * 100)}%`, icon: Shield },
          { label: "Active Policies", value: policies.filter(p => p.status === "active").length.toString(), icon: FileText },
          { label: "Open Findings", value: "11", icon: AlertTriangle },
          { label: "Next Audit", value: "Apr 1", icon: Clock },
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

      <Tabs defaultValue="compliance">
        <TabsList>
          <TabsTrigger value="compliance">Labor Laws</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="legal">Legal Docs</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
        </TabsList>

        <TabsContent value="compliance" className="mt-4">
          <Card className="glass-card">
            <CardContent className="p-4 space-y-2">
              {complianceItems.map((c) => (
                <div key={c.law} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  {c.status === "compliant" ? <CheckCircle2 className="w-4 h-4 text-success" /> : c.status === "attention" ? <AlertTriangle className="w-4 h-4 text-warning" /> : <AlertTriangle className="w-4 h-4 text-destructive" />}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{c.law}</p>
                    <p className="text-xs text-muted-foreground">Last: {c.lastAudit} · Next: {c.nextAudit}</p>
                  </div>
                  <Badge variant="outline" className={`text-xs capitalize ${statusColors[c.status]}`}>{c.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="mt-4">
          <Card className="glass-card">
            <CardContent className="p-4 space-y-2">
              {policies.map((p) => (
                <div key={p.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.version} · Updated {p.updated}</p>
                  </div>
                  <Badge variant="outline" className="text-xs capitalize">{p.status}</Badge>
                  <Button size="sm" variant="ghost"><Eye className="w-4 h-4" /></Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal" className="mt-4">
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="grid sm:grid-cols-2 gap-3">
                {["NDA Templates", "Employment Contracts", "IP Agreements", "Severance Agreements", "Vendor Contracts", "Compliance Certificates"].map((d) => (
                  <div key={d} className="p-4 rounded-lg border border-border bg-muted/20 flex items-center gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{d}</p>
                      <p className="text-xs text-muted-foreground">Template library</p>
                    </div>
                    <Button size="sm" variant="outline">View</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-4">
          <Card className="glass-card">
            <CardContent className="p-4 space-y-3">
              {auditItems.map((a) => (
                <div key={a.area} className="p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">{a.area}</p>
                    <Badge variant="outline" className={`text-xs ${a.status === "passed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{a.status}</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={a.score} className="h-2 flex-1" />
                    <span className="text-sm font-medium">{a.score}%</span>
                    <span className="text-xs text-muted-foreground">{a.findings} findings</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
