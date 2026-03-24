import { motion } from "framer-motion";
import { FileText, FolderOpen, Download, Upload, Search, CreditCard, FileCheck, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const records = [
  { name: "Sarah Chen", id: "EMP-001", docs: 12, lastUpdated: "Mar 20, 2026", status: "complete" },
  { name: "Marcus Johnson", id: "EMP-002", docs: 10, lastUpdated: "Mar 18, 2026", status: "complete" },
  { name: "Aisha Patel", id: "EMP-003", docs: 8, lastUpdated: "Mar 22, 2026", status: "incomplete" },
  { name: "James Wilson", id: "EMP-004", docs: 11, lastUpdated: "Mar 15, 2026", status: "complete" },
];

const contracts = [
  { title: "Full-Time Employment Agreement", type: "Template", usedBy: 45, lastModified: "Mar 2026" },
  { title: "Contractor Agreement", type: "Template", usedBy: 12, lastModified: "Feb 2026" },
  { title: "NDA - Standard", type: "Template", usedBy: 65, lastModified: "Jan 2026" },
  { title: "Internship Agreement", type: "Template", usedBy: 8, lastModified: "Mar 2026" },
];

const offerTemplates = [
  { title: "Standard Offer Letter", level: "Mid-Level", department: "All" },
  { title: "Senior Offer Letter", level: "Senior", department: "Engineering" },
  { title: "Executive Offer Letter", level: "C-Suite", department: "Leadership" },
  { title: "Internship Offer", level: "Intern", department: "All" },
];

export default function DocumentsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Documentation Management</h1>
          <p className="page-subheader">Employee records, contracts, templates & ID card generation</p>
        </div>
        <Button size="sm"><Upload className="w-4 h-4 mr-1" /> Upload Document</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Records", value: "165", icon: FolderOpen },
          { label: "Templates", value: "24", icon: FileCheck },
          { label: "Pending Reviews", value: "7", icon: FileText },
          { label: "ID Cards Issued", value: "158", icon: CreditCard },
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

      <Tabs defaultValue="records">
        <TabsList>
          <TabsTrigger value="records">Employee Records</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="offers">Offer Templates</TabsTrigger>
          <TabsTrigger value="idcard">ID Card Generator</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2 flex flex-row items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search records..." className="pl-9" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {records.map((r) => (
                <div key={r.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-primary-foreground text-xs font-semibold">
                    {r.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.id} · {r.docs} documents · Updated {r.lastUpdated}</p>
                  </div>
                  <Badge variant="outline" className={`text-xs ${r.status === "complete" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{r.status}</Badge>
                  <Button size="sm" variant="ghost"><Download className="w-4 h-4" /></Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="mt-4">
          <Card className="glass-card">
            <CardContent className="p-4 space-y-2">
              {contracts.map((c) => (
                <div key={c.title} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{c.title}</p>
                    <p className="text-xs text-muted-foreground">Used by {c.usedBy} employees · Modified {c.lastModified}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">{c.type}</Badge>
                  <Button size="sm" variant="outline"><Download className="w-4 h-4 mr-1" /> Download</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Offer Letter Templates</CardTitle>
              <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Create Template</Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {offerTemplates.map((o) => (
                <div key={o.title} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <FileCheck className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{o.title}</p>
                    <p className="text-xs text-muted-foreground">{o.level} · {o.department}</p>
                  </div>
                  <Button size="sm" variant="outline">Use Template</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="idcard" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base">ID Card Generator</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="w-80 h-48 rounded-xl gradient-border p-4 flex gap-4">
                  <div className="w-20 h-24 bg-muted/50 rounded-lg flex items-center justify-center text-xs text-muted-foreground">Photo</div>
                  <div className="flex-1 space-y-2">
                    <p className="font-bold text-sm gradient-text">NexaHR</p>
                    <p className="font-semibold text-sm">Employee Name</p>
                    <p className="text-xs text-muted-foreground">Designation</p>
                    <p className="text-xs text-muted-foreground">EMP-XXX</p>
                    <div className="w-16 h-8 bg-muted/30 rounded mt-2 flex items-center justify-center text-[8px] text-muted-foreground">QR Code</div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <Button><CreditCard className="w-4 h-4 mr-1" /> Generate ID Card</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
