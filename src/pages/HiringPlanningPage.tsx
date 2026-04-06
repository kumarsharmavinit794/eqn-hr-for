import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, TrendingUp, Users, DollarSign,
  Sparkles, GitBranch, Plus, ChevronRight, Loader2,
  Check, AlertCircle, Wand2, ArrowRight, Copy,
} from "lucide-react";
import api from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend,
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Requirement {
  id: number;
  job_title: string;
  department: string;
  positions: number;
  budget: string | null;
  status: string;
  created_at?: string;
}
interface PrefilledJob {
  title: string;
  department: string;
  description: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_REQUIREMENTS: Requirement[] = [
  { id: 1, job_title: "Senior React Developer", department: "Engineering", positions: 3, budget: "$360K", status: "high"   },
  { id: 2, job_title: "Product Designer",        department: "Design",      positions: 2, budget: "$200K", status: "medium" },
  { id: 3, job_title: "Data Analyst",            department: "Marketing",   positions: 1, budget: "$90K",  status: "low"    },
  { id: 4, job_title: "DevOps Engineer",         department: "Engineering", positions: 2, budget: "$240K", status: "high"   },
  { id: 5, job_title: "Content Strategist",      department: "Marketing",   positions: 1, budget: "$80K",  status: "medium" },
];
const MOCK_STATS    = { openPositions: 9, totalBudget: "$970K", headcountTarget: 142, avgTimeToFill: 34 };
const MOCK_FORECAST = [
  { month: "Jan", current: 110, projected: 112 },
  { month: "Feb", current: 114, projected: 116 },
  { month: "Mar", current: 118, projected: 121 },
  { month: "Apr", current: 120, projected: 126 },
  { month: "May", current: null, projected: 130 },
  { month: "Jun", current: null, projected: 135 },
  { month: "Jul", current: null, projected: 140 },
  { month: "Aug", current: null, projected: 142 },
];
const MOCK_BUDGET = [
  { dept: "Eng",       salary: 520, hiring: 48 },
  { dept: "Design",    salary: 180, hiring: 18 },
  { dept: "Marketing", salary: 140, hiring: 12 },
  { dept: "Sales",     salary: 200, hiring: 20 },
  { dept: "HR",        salary: 90,  hiring: 8  },
];
const MOCK_ORG = {
  name: "CEO",
  children: [
    { name: "CTO", children: [{ name: "Engineering" }, { name: "DevOps" }] },
    { name: "CPO", children: [{ name: "Product" },     { name: "Design" }] },
    { name: "CMO", children: [{ name: "Marketing" },   { name: "Sales" }] },
  ],
};
const priorityColors: Record<string, string> = {
  high:   "bg-red-500/10 text-red-600 border-red-400/30",
  medium: "bg-amber-500/10 text-amber-600 border-amber-400/30",
  low:    "bg-emerald-500/10 text-emerald-600 border-emerald-400/30",
};
const DEPARTMENTS = ["Engineering","Design","Marketing","Sales","HR","Product","Operations"];

// ─── Claude API ───────────────────────────────────────────────────────────────
async function generateJDWithClaude(title: string, department: string, extra = "") {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `Write a professional job description for a ${title} role in the ${department} department.
${extra ? `Key requirements: ${extra}` : ""}
Format: Overview, Responsibilities (5-6 bullets), Requirements (5-6 bullets), Nice-to-haves (3 bullets). Be concise but compelling.`,
      }],
    }),
  });
  const data = await res.json();
  return (data.content?.[0]?.text ?? "") as string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function HiringPlanningPage() {
  const [requirements, setRequirements] = useState<Requirement[]>(MOCK_REQUIREMENTS);
  const [connected,    setConnected]    = useState<string[]>([]);
  const [stats,        setStats]        = useState(MOCK_STATS);

  // Shared state: JD generator → JobCreate pre-fill
  const [prefilled,     setPrefilled]     = useState<PrefilledJob | null>(null);
  const [jobCreateOpen, setJobCreateOpen] = useState(false);

  // ★ FIX: copy + open both happen here
  const handleUseJD = (data: PrefilledJob) => {
    // 1. Copy JD to clipboard
    navigator.clipboard.writeText(data.description);

    // 2. Pre-fill and open JobCreateDialog after brief delay so user sees copy feedback
    setPrefilled(data);
    setTimeout(() => setJobCreateOpen(true), 600);
  };

  const handleRequirementAdded = (req: Requirement) => {
    setRequirements(prev => [req, ...prev]);
    setStats(s => ({ ...s, openPositions: s.openPositions + req.positions }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hiring & Workforce Planning</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Strategic workforce planning with real-time data</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <JDGeneratorDialog onUseJD={handleUseJD} />
          <JobCreateDialog
            open={jobCreateOpen}
            onOpenChange={(v) => { setJobCreateOpen(v); if (!v) setPrefilled(null); }}
            prefilled={prefilled}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Open Positions",   value: stats.openPositions,       icon: Briefcase,  sub: "from requirements"   },
          { label: "Total Budget",     value: stats.totalBudget,         icon: DollarSign, sub: "across departments"  },
          { label: "Headcount Target", value: stats.headcountTarget,     icon: Users,      sub: "projected workforce" },
          { label: "Avg Time to Fill", value: `${stats.avgTimeToFill}d`, icon: TrendingUp, sub: "days per position"   },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{s.label}</span>
                  <s.icon className="w-4 h-4 text-primary/60" />
                </div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Manpower Forecast</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={MOCK_FORECAST}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} domain={[100, 150]} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="current"   stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} name="Current"   connectNulls={false} />
                <Line type="monotone" dataKey="projected" stroke="hsl(220 70% 60%)"    strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} name="Projected" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Budget Breakdown ($K)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={MOCK_BUDGET}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="dept" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="salary" fill="hsl(var(--primary))" name="Salary"      radius={[4,4,0,0]} />
                <Bar dataKey="hiring" fill="hsl(220 70% 65%)"    name="Hiring Cost" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Requirements */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Department Hiring Requirements</CardTitle>
            <NewRequirementDialog onAdded={handleRequirementAdded} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2.5">
            <AnimatePresence initial={false}>
              {requirements.map((r) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/40"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{r.job_title}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.department} · {r.positions} position{r.positions > 1 ? "s" : ""}
                      {r.budget ? ` · Budget: ${r.budget}` : ""}
                    </p>
                  </div>
                  <Badge variant="outline" className={`text-xs shrink-0 capitalize ${priorityColors[r.status] ?? "bg-muted/30"}`}>
                    {r.status}
                  </Badge>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Org */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <GitBranch className="w-4 h-4" /> Organization Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-start overflow-x-auto pb-2 pt-2 sm:justify-center">
            <OrgNodeComponent node={MOCK_ORG} />
          </div>
        </CardContent>
      </Card>

      {/* Channels */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Job Posting Channels</CardTitle></CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-3">
            {["LinkedIn", "Naukri", "Indeed"].map((ch) => {
              const isConn = connected.includes(ch);
              return (
                <div key={ch} className="p-4 rounded-lg border border-border bg-muted/20 text-center">
                  <p className="font-semibold text-sm">{ch}</p>
                  <p className="text-xs text-muted-foreground mt-1">{isConn ? "Active integration" : "Not connected"}</p>
                  <Button
                    variant={isConn ? "secondary" : "outline"} size="sm" className="mt-3"
                    onClick={() => !isConn && setConnected(prev => [...prev, ch])}
                    disabled={isConn}
                  >
                    {isConn ? <><Check className="w-3 h-3 mr-1" /> Connected</> : <><ChevronRight className="w-3 h-3 mr-1" /> Connect</>}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Org Tree ─────────────────────────────────────────────────────────────────
function OrgNodeComponent({ node, depth = 0 }: { node: any; depth?: number }) {
  const colors = [
    "bg-primary text-primary-foreground",
    "bg-primary/20 text-primary border border-primary/30",
    "bg-muted text-foreground border border-border",
  ];
  return (
    <div className="flex flex-col items-center">
      <div className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${colors[Math.min(depth, 2)]}`}>
        {node.name}
      </div>
      {node.children?.length > 0 && (
        <>
          <div className="w-px h-4 bg-border" />
          <div className="flex gap-6">
            {node.children.map((c: any) => (
              <div key={c.name} className="flex flex-col items-center">
                <div className="w-px h-4 bg-border" />
                <OrgNodeComponent node={c} depth={depth + 1} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// AI JD GENERATOR DIALOG
// ═══════════════════════════════════════════════════════════════════════════════
function JDGeneratorDialog({ onUseJD }: { onUseJD: (data: PrefilledJob) => void }) {
  const [open,    setOpen]    = useState(false);
  const [title,   setTitle]   = useState("");
  const [dept,    setDept]    = useState("");
  const [extra,   setExtra]   = useState("");
  const [output,  setOutput]  = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [copied,  setCopied]  = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-generate on title / dept change (900ms debounce)
  useEffect(() => {
    if (!title.trim() || !dept) { setOutput(""); setError(""); return; }
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      setLoading(true); setError(""); setOutput("");
      try   { setOutput(await generateJDWithClaude(title, dept, extra)); }
      catch { setError("Generation failed. Please try again."); }
      finally { setLoading(false); }
    }, 900);
    return () => { if (debounce.current) clearTimeout(debounce.current); };
  }, [title, dept]);

  // Re-generate on extra requirements change (1.5s debounce)
  useEffect(() => {
    if (!title.trim() || !dept || !extra.trim()) return;
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      setLoading(true); setError("");
      try   { setOutput(await generateJDWithClaude(title, dept, extra)); }
      catch { setError("Generation failed. Please try again."); }
      finally { setLoading(false); }
    }, 1500);
    return () => { if (debounce.current) clearTimeout(debounce.current); };
  }, [extra]);

  const reset = () => { setTitle(""); setDept(""); setExtra(""); setOutput(""); setError(""); setCopied(false); };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ★ FIX: "Use This JD" — copy karo AND JobCreateDialog kholo (600ms delay for feedback)
  const handleUseJD = () => {
    // Step 1: Clipboard mein copy
    navigator.clipboard.writeText(output);
    setCopied(true);

    // Step 2: 600ms baad JD dialog band karo + JobCreate dialog kholo
    setTimeout(() => {
      onUseJD({ title, department: dept, description: output });
      setOpen(false);
      reset();
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Sparkles className="w-4 h-4 mr-1.5" /> AI Job Description
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-primary" /> AI Job Description Generator
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 mt-2">
          {/* Title + Dept */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>
                Job Title <span className="text-destructive">*</span>
                <span className="text-muted-foreground text-xs ml-1">(type to auto-generate)</span>
              </Label>
              <Input
                placeholder="e.g. Senior React Developer"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Department <span className="text-destructive">*</span></Label>
              <Select value={dept} onValueChange={setDept}>
                <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Extra */}
          <div className="space-y-1.5">
            <Label>
              Key Requirements
              <span className="text-muted-foreground text-xs ml-1">(optional — updates JD automatically)</span>
            </Label>
            <Textarea
              placeholder="e.g. 5+ years React, TypeScript, team lead experience…"
              rows={2} value={extra} onChange={e => setExtra(e.target.value)}
            />
          </div>

          {/* Output box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Generated Job Description</Label>
              {loading && (
                <span className="flex items-center gap-1.5 text-xs text-primary">
                  <Loader2 className="w-3 h-3 animate-spin" /> Generating…
                </span>
              )}
              {!loading && output && (
                <span className="flex items-center gap-1 text-xs text-emerald-600">
                  <Check className="w-3 h-3" /> Ready
                </span>
              )}
            </div>

            <div className={`relative min-h-[220px] rounded-xl border transition-all ${loading ? "border-primary/40 bg-primary/5" : "border-border bg-muted/30"}`}>
              {!loading && !output && !error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground select-none">
                  <Wand2 className="w-8 h-8 opacity-25" />
                  <p className="text-sm">Type a job title + select department to auto-generate</p>
                </div>
              )}
              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-7 h-7 animate-spin text-primary" />
                  <p className="text-sm text-primary font-medium">Writing job description…</p>
                </div>
              )}
              {!loading && output && (
                <div className="max-h-80 overflow-y-auto p-4 text-sm leading-relaxed whitespace-pre-wrap">
                  {output}
                </div>
              )}
              {!loading && error && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons — visible only when JD is ready */}
          {output && !loading && (
            <div className="flex flex-col gap-2 sm:flex-row">
              {/* Sirf copy button — dialog band nahi hoti */}
              <Button variant="outline" className="flex-1" onClick={handleCopy}>
                {copied
                  ? <><Check className="w-4 h-4 mr-1.5 text-emerald-600" /> Copied!</>
                  : <><Copy className="w-4 h-4 mr-1.5" /> Copy</>
                }
              </Button>

              {/* ★ FIX: Copy + JobCreate dono */}
              <Button className="flex-1" onClick={handleUseJD} disabled={copied}>
                {copied
                  ? <><Check className="w-4 h-4 mr-1.5 text-emerald-600" /> Copied! Opening…</>
                  : <><ArrowRight className="w-4 h-4 mr-1.5" /> Use This JD — Create Job</>
                }
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// JOB CREATE DIALOG  (controlled externally so JD can pre-fill it)
// ═══════════════════════════════════════════════════════════════════════════════
interface JobForm { title: string; department: string; description: string; min_salary: string; max_salary: string; }
const emptyJob: JobForm = { title: "", department: "", description: "", min_salary: "", max_salary: "" };

function JobCreateDialog({
  open, onOpenChange, prefilled,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  prefilled: PrefilledJob | null;
}) {
  const [form,    setForm]    = useState<JobForm>(emptyJob);
  const [errors,  setErrors]  = useState<Partial<JobForm>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Sync prefilled data when dialog opens
  useEffect(() => {
    if (open && prefilled) {
      setForm({ title: prefilled.title, department: prefilled.department, description: prefilled.description, min_salary: "", max_salary: "" });
      setErrors({});
    }
    if (!open) { setForm(emptyJob); setErrors({}); setSuccess(false); }
  }, [open, prefilled]);

  const set = (field: keyof JobForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e: Partial<JobForm> = {};
    if (!form.title.trim())       e.title       = "Job title is required.";
    if (!form.department)         e.department  = "Please select a department.";
    if (!form.description.trim()) e.description = "Description is required.";
    if (!form.min_salary)         e.min_salary  = "Min salary is required.";
    if (!form.max_salary)         e.max_salary  = "Max salary is required.";
    if (form.min_salary && form.max_salary && Number(form.min_salary) > Number(form.max_salary))
      e.max_salary = "Max salary must be ≥ min salary.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post("/jobs", {
        title:       form.title.trim(),
        department:  form.department,
        description: form.description.trim(),
        min_salary:  Number(form.min_salary),
        max_salary:  Number(form.max_salary),
      });
      setSuccess(true);
      setTimeout(() => onOpenChange(false), 1400);
    } catch (err: any) {
      const msg = err?.response?.data?.detail || "Failed to create job.";
      setErrors(prev => ({ ...prev, title: msg }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Create Job</Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            {prefilled ? "Create Job — AI Pre-filled" : "Create New Job Posting"}
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Check className="w-7 h-7 text-emerald-600" />
            </div>
            <p className="font-semibold text-emerald-600 text-lg">Job Created Successfully!</p>
          </div>
        ) : (
          <div className="space-y-4 mt-1">

            {/* Banner when pre-filled */}
            {prefilled && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20 text-xs text-primary font-medium">
                <Wand2 className="w-3.5 h-3.5 shrink-0" />
                Auto-filled from AI Generator — JD clipboard mein copy ho gayi hai · Salary fill karke submit karein
              </div>
            )}

            {/* Title */}
            <div className="space-y-1">
              <Label>Job Title <span className="text-destructive">*</span></Label>
              <Input placeholder="e.g. Senior Frontend Engineer" value={form.title} onChange={e => set("title", e.target.value)} className={errors.title ? "border-destructive" : ""} />
              {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
            </div>

            {/* Department */}
            <div className="space-y-1">
              <Label>Department <span className="text-destructive">*</span></Label>
              <Select value={form.department} onValueChange={v => set("department", v)}>
                <SelectTrigger className={errors.department ? "border-destructive" : ""}><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.department && <p className="text-xs text-destructive">{errors.department}</p>}
            </div>

            {/* Description */}
            <div className="space-y-1">
              <Label>Description <span className="text-destructive">*</span></Label>
              <Textarea placeholder="Job description…" rows={5} value={form.description} onChange={e => set("description", e.target.value)} className={errors.description ? "border-destructive" : ""} />
              {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
            </div>

            {/* Salary */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1 space-y-1">
                <Label>Min Salary (₹) <span className="text-destructive">*</span></Label>
                <Input type="number" placeholder="500000" value={form.min_salary} onChange={e => set("min_salary", e.target.value)} className={errors.min_salary ? "border-destructive" : ""} />
                {errors.min_salary && <p className="text-xs text-destructive">{errors.min_salary}</p>}
              </div>
              <div className="flex-1 space-y-1">
                <Label>Max Salary (₹) <span className="text-destructive">*</span></Label>
                <Input type="number" placeholder="1200000" value={form.max_salary} onChange={e => set("max_salary", e.target.value)} className={errors.max_salary ? "border-destructive" : ""} />
                {errors.max_salary && <p className="text-xs text-destructive">{errors.max_salary}</p>}
              </div>
            </div>

            <Button onClick={handleSubmit} disabled={loading} className="w-full">
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating…</> : "Create Job Posting"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── New Requirement Dialog ───────────────────────────────────────────────────
let nextId = MOCK_REQUIREMENTS.length + 1;

function NewRequirementDialog({ onAdded }: { onAdded: (r: Requirement) => void }) {
  const [open,    setOpen]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [form, setForm] = useState({ jobTitle: "", department: "", positions: "", budget: "", status: "medium" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.jobTitle || !form.department || !form.positions) {
      setError("Job Title, Department, and Positions are required."); return;
    }
    setError(""); setLoading(true);
    setTimeout(() => {
      onAdded({ id: nextId++, job_title: form.jobTitle, department: form.department, positions: Number(form.positions), budget: form.budget || null, status: form.status, created_at: new Date().toISOString() });
      setOpen(false);
      setForm({ jobTitle: "", department: "", positions: "", budget: "", status: "medium" });
      setLoading(false);
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline"><Plus className="w-4 h-4 mr-1.5" /> New Requirement</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Add New Hiring Requirement</DialogTitle></DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Job Title <span className="text-destructive">*</span></Label>
            <Input name="jobTitle" value={form.jobTitle} onChange={handleChange} placeholder="e.g. Backend Engineer" />
          </div>
          <div className="space-y-1.5">
            <Label>Department <span className="text-destructive">*</span></Label>
            <Input name="department" value={form.department} onChange={handleChange} placeholder="e.g. Engineering" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Open Positions <span className="text-destructive">*</span></Label>
              <Input type="number" name="positions" value={form.positions} onChange={handleChange} placeholder="e.g. 3" min={1} />
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Budget <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <Input name="budget" value={form.budget} onChange={handleChange} placeholder="e.g. $240K" />
          </div>
          {error && <div className="flex items-center gap-2 text-sm text-destructive"><AlertCircle className="w-4 h-4 shrink-0" /> {error}</div>}
          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</> : "Create Requirement"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
