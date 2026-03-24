import { useState } from "react";
import { motion } from "framer-motion";
import { UserMinus, FileText, DollarSign, MessageSquare, CheckCircle2, Circle, Package, Send, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const exitCases = [
  { name: "James Wilson", role: "DevOps Engineer", lastDay: "Apr 15, 2026", reason: "Better Opportunity", progress: 60, status: "in-progress" },
  { name: "Emily Davis", role: "Marketing Analyst", lastDay: "Apr 30, 2026", reason: "Relocation", progress: 30, status: "initiated" },
  { name: "Tom Brown", role: "QA Lead", lastDay: "Mar 31, 2026", reason: "Personal", progress: 100, status: "completed" },
];

const resignationSteps = [
  { step: "Resignation Submitted", done: true },
  { step: "Manager Approval", done: true },
  { step: "HR Acknowledgment", done: true },
  { step: "Knowledge Transfer", done: false },
  { step: "Exit Interview", done: false },
  { step: "Asset Return", done: false },
  { step: "Final Settlement", done: false },
  { step: "Experience Letter Issued", done: false },
];

const assetChecklist = [
  { item: "Laptop", status: "returned" },
  { item: "ID Card", status: "returned" },
  { item: "Access Card", status: "pending" },
  { item: "Company Phone", status: "not-applicable" },
  { item: "Parking Pass", status: "pending" },
  { item: "Library Books", status: "returned" },
];

const settlement = {
  earnings: [
    { item: "Pending Salary", amount: 45000 },
    { item: "Leave Encashment", amount: 12500 },
    { item: "Gratuity", amount: 85000 },
    { item: "Bonus (Pro-rata)", amount: 8000 },
  ],
  deductions: [
    { item: "Notice Period Shortfall", amount: 22500 },
    { item: "Asset Recovery", amount: 0 },
    { item: "Tax Deduction", amount: 15200 },
  ],
};

const assetStatusColors: Record<string, string> = {
  returned: "bg-success/10 text-success", pending: "bg-warning/10 text-warning", "not-applicable": "bg-muted text-muted-foreground",
};

export default function ExitManagementPage() {
  const totalEarnings = settlement.earnings.reduce((s, e) => s + e.amount, 0);
  const totalDeductions = settlement.deductions.reduce((s, d) => s + d.amount, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="page-header">Exit Management</h1>
        <p className="page-subheader">Resignation workflow, final settlement & experience letter generation</p>
      </div>

      {/* Active Cases */}
      <div className="grid sm:grid-cols-3 gap-4">
        {exitCases.map((e) => (
          <Card key={e.name} className="glass-card-hover">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <UserMinus className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{e.name}</p>
                  <p className="text-xs text-muted-foreground">{e.role}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-1">Last Day: {e.lastDay} · {e.reason}</p>
              <div className="flex items-center gap-2">
                <Progress value={e.progress} className="h-2 flex-1" />
                <span className="text-xs font-medium">{e.progress}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="workflow">
        <TabsList>
          <TabsTrigger value="workflow">Resignation Workflow</TabsTrigger>
          <TabsTrigger value="settlement">Final Settlement</TabsTrigger>
          <TabsTrigger value="assets">Asset Return</TabsTrigger>
          <TabsTrigger value="letter">Experience Letter</TabsTrigger>
          <TabsTrigger value="chatbot">Exit Interview Bot</TabsTrigger>
        </TabsList>

        <TabsContent value="workflow" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base">Resignation Steps — James Wilson</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {resignationSteps.map((s, i) => (
                <div key={s.step} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  {s.done ? <CheckCircle2 className="w-5 h-5 text-success" /> : <Circle className="w-5 h-5 text-muted-foreground" />}
                  <span className={`text-sm flex-1 ${s.done ? "line-through text-muted-foreground" : ""}`}>{s.step}</span>
                  <span className="text-xs text-muted-foreground">Step {i + 1}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settlement" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><DollarSign className="w-4 h-4" /> Full & Final Settlement</CardTitle></CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-semibold text-success mb-2">Earnings</p>
                  <div className="space-y-2">
                    {settlement.earnings.map((e) => (
                      <div key={e.item} className="flex justify-between text-sm p-2 rounded bg-muted/30">
                        <span>{e.item}</span>
                        <span className="font-medium">₹{e.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm font-bold pt-2 border-t border-border">
                      <span>Total Earnings</span><span className="text-success">₹{totalEarnings.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-destructive mb-2">Deductions</p>
                  <div className="space-y-2">
                    {settlement.deductions.map((d) => (
                      <div key={d.item} className="flex justify-between text-sm p-2 rounded bg-muted/30">
                        <span>{d.item}</span>
                        <span className="font-medium">₹{d.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm font-bold pt-2 border-t border-border">
                      <span>Total Deductions</span><span className="text-destructive">₹{totalDeductions.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 rounded-lg gradient-bg text-primary-foreground text-center">
                <p className="text-sm">Net Settlement Amount</p>
                <p className="text-2xl font-bold">₹{(totalEarnings - totalDeductions).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assets" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Package className="w-4 h-4" /> Asset Return Checklist</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {assetChecklist.map((a) => (
                <div key={a.item} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  {a.status === "returned" ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Circle className="w-4 h-4 text-muted-foreground" />}
                  <span className="text-sm flex-1">{a.item}</span>
                  <Badge variant="outline" className={`text-xs capitalize ${assetStatusColors[a.status]}`}>{a.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="letter" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base">Experience Letter Generator</CardTitle></CardHeader>
            <CardContent>
              <div className="p-6 border border-border rounded-lg bg-muted/10 max-w-lg mx-auto">
                <div className="text-center mb-6">
                  <p className="text-lg font-bold gradient-text">NexaHR Technologies</p>
                  <p className="text-xs text-muted-foreground">Certificate of Employment</p>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>To Whom It May Concern,</p>
                  <p>This is to certify that <strong className="text-foreground">James Wilson</strong> was employed with NexaHR Technologies as a <strong className="text-foreground">DevOps Engineer</strong> from <strong className="text-foreground">Jan 2024</strong> to <strong className="text-foreground">Apr 2026</strong>.</p>
                  <p>During the tenure, the employee demonstrated excellent skills and was a valuable member of the team.</p>
                  <p className="mt-6">We wish them all the best in future endeavors.</p>
                  <p className="mt-4">HR Department<br />NexaHR Technologies</p>
                </div>
              </div>
              <div className="text-center mt-4">
                <Button><Download className="w-4 h-4 mr-1" /> Download Letter</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chatbot" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Exit Interview Chatbot</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center shrink-0"><MessageSquare className="w-3 h-3 text-primary-foreground" /></div>
                  <div className="glass-card rounded-xl px-3 py-2 text-sm max-w-[80%]">Thank you for your time at NexaHR. I'd like to conduct a brief exit interview. What was the primary reason for your decision to leave?</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Share your feedback..." className="flex-1" />
                <Button size="sm"><Send className="w-4 h-4" /></Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
