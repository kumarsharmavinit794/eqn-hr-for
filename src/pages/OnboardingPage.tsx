import { useState } from "react";
import { motion } from "framer-motion";
import { UserCheck, FileText, Shield, CheckCircle2, Circle, Clock, Upload, MessageSquare, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const newHires = [
  { id: 1, name: "Priya Sharma", role: "Frontend Engineer", joinDate: "Apr 1, 2026", progress: 75, status: "in-progress", avatar: "PS" },
  { id: 2, name: "Alex Kim", role: "Product Designer", joinDate: "Apr 5, 2026", progress: 40, status: "in-progress", avatar: "AK" },
  { id: 3, name: "Jordan Lee", role: "Data Analyst", joinDate: "Apr 10, 2026", progress: 100, status: "completed", avatar: "JL" },
];

const checklist = [
  { task: "Background Verification", status: "done", icon: Shield },
  { task: "Document Upload (Aadhar, PAN)", status: "done", icon: FileText },
  { task: "Verification Status Confirmed", status: "done", icon: CheckCircle2 },
  { task: "Email & System Accounts Created", status: "pending", icon: UserCheck },
  { task: "Welcome Kit Assigned", status: "pending", icon: Package },
  { task: "Training Module Assigned", status: "pending", icon: Clock },
  { task: "Policy Acknowledged", status: "pending", icon: FileText },
];

const documents = [
  { name: "Aadhar Card", status: "verified", type: "Identity" },
  { name: "PAN Card", status: "verified", type: "Tax" },
  { name: "Degree Certificate", status: "pending", type: "Education" },
  { name: "Previous Offer Letter", status: "uploaded", type: "Employment" },
  { name: "Address Proof", status: "pending", type: "Address" },
];

const docStatusColors: Record<string, string> = {
  verified: "bg-success/10 text-success border-success/20",
  uploaded: "bg-info/10 text-info border-info/20",
  pending: "bg-warning/10 text-warning border-warning/20",
};

export default function OnboardingPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="page-header">Employee Onboarding</h1>
        <p className="page-subheader">Streamlined onboarding with automated verification & checklists</p>
      </div>

      {/* New Hires */}
      <div className="grid sm:grid-cols-3 gap-4">
        {newHires.map((h) => (
          <Card key={h.id} className="glass-card-hover">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-primary-foreground text-sm font-semibold">{h.avatar}</div>
                <div>
                  <p className="font-semibold text-sm">{h.name}</p>
                  <p className="text-xs text-muted-foreground">{h.role}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Joining: {h.joinDate}</p>
              <div className="flex items-center gap-2">
                <Progress value={h.progress} className="h-2 flex-1" />
                <span className="text-xs font-medium">{h.progress}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="checklist">
        <TabsList>
          <TabsTrigger value="checklist">Joining Checklist</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="chatbot">Policy Chatbot</TabsTrigger>
        </TabsList>

        <TabsContent value="checklist" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base">Onboarding Checklist — Priya Sharma</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {checklist.map((item) => (
                  <div key={item.task} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    {item.status === "done" ? (
                      <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                    )}
                    <span className={`text-sm flex-1 ${item.status === "done" ? "line-through text-muted-foreground" : ""}`}>{item.task}</span>
                    <Badge variant="outline" className={`text-xs ${item.status === "done" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Document Management</CardTitle>
              <Button size="sm" variant="outline"><Upload className="w-4 h-4 mr-1" /> Upload</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div key={doc.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.type}</p>
                    </div>
                    <Badge variant="outline" className={`text-xs ${docStatusColors[doc.status]}`}>{doc.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base">Background Verification</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { check: "Identity Verification", status: "Passed", color: "text-success" },
                  { check: "Criminal Record Check", status: "Passed", color: "text-success" },
                  { check: "Education Verification", status: "In Progress", color: "text-warning" },
                  { check: "Employment History", status: "In Progress", color: "text-warning" },
                  { check: "Reference Check", status: "Pending", color: "text-muted-foreground" },
                ].map((v) => (
                  <div key={v.check} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <span className="text-sm">{v.check}</span>
                    <span className={`text-sm font-medium ${v.color}`}>{v.status}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chatbot" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Policy Explanation Chatbot</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center shrink-0"><MessageSquare className="w-3 h-3 text-primary-foreground" /></div>
                  <div className="glass-card rounded-xl px-3 py-2 text-sm max-w-[80%]">Welcome! I can help you understand company policies, leave rules, code of conduct, and more. What would you like to know?</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Ask about company policies..." className="flex-1" />
                <Button size="sm">Send</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {["Leave policy", "Work hours", "Dress code", "Remote work"].map((p) => (
                  <button key={p} className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-muted-foreground">{p}</button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
