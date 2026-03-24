import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, TrendingUp, Users, DollarSign, Sparkles, GitBranch, Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const hiringPlan = [
  { department: "Engineering", openRoles: 8, filled: 3, budget: "$480K", priority: "high" },
  { department: "Design", openRoles: 3, filled: 1, budget: "$180K", priority: "medium" },
  { department: "Marketing", openRoles: 4, filled: 2, budget: "$200K", priority: "medium" },
  { department: "Sales", openRoles: 6, filled: 4, budget: "$360K", priority: "high" },
  { department: "HR", openRoles: 2, filled: 0, budget: "$120K", priority: "low" },
];

const forecastData = [
  { month: "Jan", current: 120, projected: 120 },
  { month: "Feb", current: 124, projected: 126 },
  { month: "Mar", current: 128, projected: 132 },
  { month: "Apr", current: 131, projected: 140 },
  { month: "May", current: 135, projected: 148 },
  { month: "Jun", current: null, projected: 155 },
  { month: "Jul", current: null, projected: 162 },
];

const budgetData = [
  { dept: "Eng", salary: 320, hiring: 80 },
  { dept: "Design", salary: 120, hiring: 40 },
  { dept: "Mktg", salary: 140, hiring: 50 },
  { dept: "Sales", salary: 240, hiring: 60 },
  { dept: "HR", salary: 80, hiring: 30 },
];

const orgTree = [
  { name: "CEO", children: [
    { name: "CTO", children: [{ name: "VP Eng" }, { name: "VP Data" }] },
    { name: "CFO", children: [{ name: "Finance Dir" }] },
    { name: "CHRO", children: [{ name: "HR Dir" }, { name: "L&D Head" }] },
  ]},
];

const priorityColors: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-success/10 text-success border-success/20",
};

export default function HiringPlanningPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Hiring & Workforce Planning</h1>
          <p className="page-subheader">Strategic workforce planning with AI-powered forecasting</p>
        </div>
        <div className="flex gap-2">
          <JDGeneratorDialog />
          <Button size="sm"><Plus className="w-4 h-4 mr-1" /> New Requirement</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Open Positions", value: "23", icon: Briefcase, change: "+5 this month" },
          { label: "Total Budget", value: "$1.34M", icon: DollarSign, change: "Q2 allocation" },
          { label: "Headcount Target", value: "162", icon: Users, change: "By Dec 2026" },
          { label: "Avg Time to Fill", value: "28d", icon: TrendingUp, change: "-3d vs last Q" },
        ].map((s) => (
          <Card key={s.label} className="glass-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <s.icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Manpower Forecast */}
        <Card className="glass-card">
          <CardHeader className="pb-2"><CardTitle className="text-base">Manpower Forecast</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Line type="monotone" dataKey="current" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} name="Current" />
                <Line type="monotone" dataKey="projected" stroke="hsl(var(--accent))" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} name="Projected" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Budget Breakdown */}
        <Card className="glass-card">
          <CardHeader className="pb-2"><CardTitle className="text-base">Budget Breakdown ($K)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="dept" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Bar dataKey="salary" fill="hsl(var(--primary))" name="Salary" radius={[4, 4, 0, 0]} />
                <Bar dataKey="hiring" fill="hsl(var(--accent))" name="Hiring Cost" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Hiring Plan Table */}
      <Card className="glass-card">
        <CardHeader className="pb-2"><CardTitle className="text-base">Department Hiring Plan</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {hiringPlan.map((d) => (
              <div key={d.department} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                <div className="flex-1">
                  <p className="font-medium text-sm">{d.department}</p>
                  <p className="text-xs text-muted-foreground">{d.filled}/{d.openRoles} filled · Budget: {d.budget}</p>
                </div>
                <Progress value={(d.filled / d.openRoles) * 100} className="w-32 h-2" />
                <Badge variant="outline" className={`text-xs ${priorityColors[d.priority]}`}>{d.priority}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Org Structure */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><GitBranch className="w-4 h-4" /> Organization Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <OrgNode node={orgTree[0]} />
          </div>
        </CardContent>
      </Card>

      {/* Job Posting Placeholders */}
      <Card className="glass-card">
        <CardHeader className="pb-2"><CardTitle className="text-base">Job Posting Channels</CardTitle></CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-3">
            {["LinkedIn", "Naukri", "Indeed"].map((ch) => (
              <div key={ch} className="p-4 rounded-lg border border-border bg-muted/20 text-center">
                <p className="font-semibold text-sm">{ch}</p>
                <p className="text-xs text-muted-foreground mt-1">Integration placeholder</p>
                <Button variant="outline" size="sm" className="mt-3">Connect <ChevronRight className="w-3 h-3 ml-1" /></Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function OrgNode({ node }: { node: any }) {
  return (
    <div className="flex flex-col items-center">
      <div className="px-4 py-2 rounded-lg gradient-bg text-primary-foreground text-sm font-medium">{node.name}</div>
      {node.children && (
        <div className="flex gap-6 mt-4 pt-4 border-t border-border">
          {node.children.map((c: any) => <OrgNode key={c.name} node={c} />)}
        </div>
      )}
    </div>
  );
}

function JDGeneratorDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"><Sparkles className="w-4 h-4 mr-1" /> AI Job Description</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>AI Job Description Generator</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label>Job Title</Label><Input placeholder="e.g. Senior React Developer" /></div>
          <div><Label>Department</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="eng">Engineering</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Key Requirements</Label><Textarea placeholder="List key skills and requirements..." rows={3} /></div>
          <Button className="w-full"><Sparkles className="w-4 h-4 mr-1" /> Generate with AI</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
