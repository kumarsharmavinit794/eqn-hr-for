import { AnimatePresence, motion } from "framer-motion";
import {
  BriefcaseBusiness, Building2, Calendar as CalendarIcon, CheckCircle2, Eye, Filter, Loader2,
  Plus, Search, ThumbsDown, ThumbsUp, Download, Upload, X, XCircle, TrendingUp, MapPin, Clock,
  ShieldCheck, AlertTriangle, FileText, Zap, Sparkles, LayoutList, Kanban, Users, Target, Activity,
  Plug, RefreshCw, UploadCloud, DownloadCloud, Cloud, Database, Network, Share
} from "lucide-react";
import { useEffect, useRef, useState, useMemo } from "react";
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";

import api, { isApiError } from "@/lib/api";

type CandidateStatus = "new" | "shortlisted" | "interview" | "rejected";

interface Candidate {
  id: number;
  name: string;
  role: string;
  experience: string;
  skills: string[];
  match: number;
  status: CandidateStatus;
  resume_url?: string;
  location?: string;
  notice_period?: string;
  expected_salary?: number;
  source?: string;
  ats_id?: string;
  ats_status?: string;
}

interface Toast {
  id: number;
  type: "success" | "error";
  message: string;
}

interface JobForm {
  title: string;
  department: string;
  experience_level: string;
  description: string;
  min_salary: string;
  max_salary: string;
}

interface Job {
  id: number;
  title: string;
  department: string;
  description: string;
  min_salary: number;
  max_salary: number;
  status?: string;
  ats_source?: string;
}

// ── ATS INTEGRATION TYPES & MOCK DATA ──
const MOCK_ATS_PROVIDERS = ["Greenhouse", "Lever", "Workday", "BambooHR", "Recruit CRM", "Naukri ATS", "Hirist"];

interface IntelligenceScore {
  label: string;
  value: number;
  color: string;
}

interface TimelineEvent {
  stage: string;
  date: string;
  status: "completed" | "current" | "pending";
}

interface SkillGap {
  matched: string[];
  missing: string[];
  bonus: string[];
  coverage: number;
}

interface InterviewKit {
  technical: string[];
  behavioral: string[];
  scenario: string[];
  coding: string[];
}

interface ATSActivity {
  action: string;
  date: string;
  details: string;
}

const MOCK_INTELLIGENCE: Record<number, {
  scores: IntelligenceScore[];
  timeline: TimelineEvent[];
  skillGap: SkillGap;
  whyRecommended: string;
  strengths: string[];
  weaknesses: string[];
  interviewKit: InterviewKit;
  atsActivity?: ATSActivity[];
}> = {
  1: {
    scores: [
      { label: "Technical", value: 92, color: "hsl(var(--primary))" },
      { label: "Experience", value: 88, color: "hsl(142 76% 36%)" },
      { label: "Culture Fit", value: 85, color: "hsl(262 83% 58%)" },
      { label: "Stability", value: 78, color: "hsl(27 87% 67%)" },
    ],
    timeline: [
      { stage: "Resume Uploaded", date: "12 Apr 2026", status: "completed" },
      { stage: "AI Parsed", date: "12 Apr 2026", status: "completed" },
      { stage: "Screened", date: "13 Apr 2026", status: "completed" },
      { stage: "Shortlisted", date: "14 Apr 2026", status: "current" },
      { stage: "Interview Scheduled", date: "18 Apr 2026", status: "pending" },
    ],
    skillGap: {
      matched: ["React", "TypeScript", "Tailwind", "Framer Motion"],
      missing: ["GraphQL", "Next.js App Router"],
      bonus: ["Zustand", "Shadcn/ui"],
      coverage: 82,
    },
    whyRecommended: "Strong modern frontend stack with excellent match to our current tech radar. Proven delivery velocity in fast-paced teams.",
    strengths: ["Modern React ecosystem", "UI/UX intuition", "Clean code practices"],
    weaknesses: ["Limited backend exposure", "Only 2 years leadership experience"],
    interviewKit: {
      technical: ["Explain React Server Components", "How would you optimize a large dashboard?"],
      behavioral: ["Tell me about a time you improved team velocity", "How do you handle design-system conflicts?"],
      scenario: ["Product asks for a feature in 3 days — how do you respond?"],
      coding: ["Build a reusable animated modal with accessibility"],
    },
    atsActivity: [
      { action: "Synced from Greenhouse", date: "12 Apr 2026 10:00", details: "Candidate imported from req GH-39421" },
      { action: "Status updated in Greenhouse", date: "14 Apr 2026 15:30", details: "Status changed to 'In Review'" },
    ],
  },
};

let addToast: ((type: "success" | "error", message: string) => void) | null = null;

export function toast(type: "success" | "error", message: string) {
  addToast?.(type, message);
}

function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  useEffect(() => {
    addToast = (type, message) => {
      const id = ++counter.current;
      setToasts((prev) => [...prev, { id, type, message }]);
      window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
    };
    return () => { addToast = null; };
  }, []);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[9999] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 80, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.94 }}
            className={`pointer-events-auto flex min-w-[260px] items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-xl ${t.type === "success" ? "border-success/30 bg-success/10 text-success" : "border-destructive/30 bg-destructive/10 text-destructive"}`}
          >
            {t.type === "success" ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <XCircle className="h-5 w-5 shrink-0" />}
            <span className="flex-1">{t.message}</span>
            <button onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}>
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function getErrorMessage(error: unknown, fallback: string) {
  if (isApiError(error)) return error.response?.data?.message || fallback;
  return fallback;
}

// ATS Connection Dialog
function ATSConnectionDialog() {
  const [open, setOpen] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connected, setConnected] = useState<string[]>(["Greenhouse"]);

  const handleConnect = (ats: string) => {
    if (connected.includes(ats)) {
      setConnected(prev => prev.filter(a => a !== ats));
      toast("success", `Disconnected from ${ats}`);
      return;
    }
    setConnecting(ats);
    setTimeout(() => {
      setConnecting(null);
      setConnected(prev => [...prev, ats]);
      toast("success", `Successfully connected to ${ats}`);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-primary/30 hover:bg-primary/5 text-primary">
          <Plug className="w-4 h-4 mr-2" /> Connect ATS
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader><DialogTitle>Connect ATS Integrations</DialogTitle></DialogHeader>
        <div className="grid gap-3 mt-4 max-h-[60vh] overflow-y-auto pr-2">
          {MOCK_ATS_PROVIDERS.map(ats => {
            const isConn = connected.includes(ats);
            return (
              <div key={ats} className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-background border flex items-center justify-center"><Cloud className="w-5 h-5 text-muted-foreground"/></div>
                  <div>
                    <h4 className="font-semibold text-sm">{ats}</h4>
                    <p className="text-xs text-muted-foreground">{isConn ? 'Connected & syncing' : 'Not connected'}</p>
                  </div>
                </div>
                <Button variant={isConn ? "secondary" : "default"} size="sm" onClick={() => handleConnect(ats)} disabled={connecting === ats}>
                  {connecting === ats ? <Loader2 className="w-4 h-4 animate-spin"/> : isConn ? "Disconnect" : "Connect"}
                </Button>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ResumeViewerDialog({ candidateName, resumeUrl, open, onOpenChange }: any) {
  const [iframeError, setIframeError] = useState(false);
  useEffect(() => { if (open) setIframeError(false); }, [open, resumeUrl]);

  const handleDownload = () => resumeUrl && window.open(resumeUrl, "_blank");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Resume for {candidateName}</span>
            {resumeUrl && <Button variant="outline" size="sm" onClick={handleDownload}><Download className="mr-2 h-4 w-4" /> Download</Button>}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 relative flex items-center justify-center bg-muted/20 rounded-lg">
          {resumeUrl && !iframeError ? (
            <iframe src={resumeUrl} title={`Resume for ${candidateName}`} className="w-full h-full border-none rounded-lg" onError={() => setIframeError(true)} />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground p-4 text-center">
              <XCircle className="h-10 w-10" />
              <p className="text-lg font-medium">Resume not available or failed to load.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CandidateIntelligencePanel({ candidate, open, onOpenChange, onStatusChange }: {
  candidate: Candidate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (id: number, status: CandidateStatus) => void;
}) {
  const [activeTab, setActiveTab] = useState<"overview" | "timeline" | "interview" | "notes" | "ats">("overview");
  const [generatingKit, setGeneratingKit] = useState(false);
  const [interviewDate, setInterviewDate] = useState<Date | undefined>(new Date());
  const [interviewTime, setInterviewTime] = useState("10:00");
  const [note, setNote] = useState("");
  const [notesList, setNotesList] = useState<{date: string, text: string}[]>([
    { date: "12 Apr 2026 14:30", text: "Candidate has strong communication skills. Willing to relocate." }
  ]);
  const requestIdRef = useRef(0);

  if (!candidate) return null;

  const intel = MOCK_INTELLIGENCE[candidate.id] || { scores: [], timeline: [], skillGap: { matched: [], missing: [], bonus: [], coverage: 0 }, whyRecommended: "Strong profile match.", strengths: [], weaknesses: [], interviewKit: { technical: [], behavioral: [], scenario: [], coding: [] }, atsActivity: [] };

  const handleGenerateKit = async () => {
    const nextId = ++requestIdRef.current;
    setGeneratingKit(true);
    await new Promise(r => setTimeout(r, 650));
    if (requestIdRef.current !== nextId) return;
    setGeneratingKit(false);
    toast("success", "Interview kit generated and copied to clipboard");
  };

  const handleSchedule = () => {
    toast("success", `Interview scheduled for ${interviewDate?.toLocaleDateString()} at ${interviewTime}`);
    onStatusChange(candidate.id, "interview");
  };

  const handleAddNote = () => {
    if (!note.trim()) return;
    setNotesList([{ date: new Date().toLocaleString(), text: note }, ...notesList]);
    setNote("");
    toast("success", "Note added successfully");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[92vh] flex flex-col p-0 overflow-hidden bg-background border-border">
        <DialogHeader className="px-6 py-4 border-b border-border/40 bg-muted/20">
          <DialogTitle className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary" />
            Candidate Intelligence
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="flex flex-col h-full">
            <div className="px-6 pt-4 border-b border-border/40">
              <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex bg-muted/50 p-1 rounded-xl">
                <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Overview</TabsTrigger>
                <TabsTrigger value="timeline" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Timeline</TabsTrigger>
                <TabsTrigger value="interview" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Interview</TabsTrigger>
                <TabsTrigger value="notes" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Notes</TabsTrigger>
                <TabsTrigger value="ats" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">ATS Activity</TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="overview" className="mt-0 outline-none space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">AI Recommendation</h3>
                  <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 text-sm text-primary/90 leading-relaxed">
                    {intel.whyRecommended}
                  </div>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                   <div>
                      <h4 className="text-sm font-medium mb-3 text-muted-foreground">Strengths</h4>
                      <ul className="space-y-2">
                        {intel.strengths.map(s => <li key={s} className="flex items-start gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0"/> {s}</li>)}
                      </ul>
                   </div>
                   <div>
                      <h4 className="text-sm font-medium mb-3 text-muted-foreground">Areas to Probe</h4>
                      <ul className="space-y-2">
                        {intel.weaknesses.map(w => <li key={w} className="flex items-start gap-2 text-sm"><AlertTriangle className="w-4 h-4 text-warning mt-0.5 shrink-0"/> {w}</li>)}
                      </ul>
                   </div>
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="mt-0 outline-none">
                 <div className="space-y-6">
                    {intel.timeline.map((ev, i) => (
                       <div key={i} className="flex gap-4">
                          <div className="flex flex-col items-center">
                             <div className={`w-3 h-3 rounded-full ${ev.status === 'completed' ? 'bg-primary' : ev.status === 'current' ? 'bg-warning ring-4 ring-warning/20' : 'bg-muted'}`} />
                             {i < intel.timeline.length - 1 && <div className="w-px h-full bg-border my-2" />}
                          </div>
                          <div className="pb-4">
                             <p className={`font-medium ${ev.status === 'pending' ? 'text-muted-foreground' : ''}`}>{ev.stage}</p>
                             <p className="text-xs text-muted-foreground mt-1">{ev.date}</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </TabsContent>

              <TabsContent value="interview" className="mt-0 outline-none space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-primary"/> Schedule Interview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Calendar mode="single" selected={interviewDate} onSelect={setInterviewDate} className="rounded-md border mx-auto" />
                      <div className="space-y-1.5">
                        <Label>Select Time</Label>
                        <Select value={interviewTime} onValueChange={setInterviewTime}>
                           <SelectTrigger><SelectValue placeholder="Time" /></SelectTrigger>
                           <SelectContent>
                              <SelectItem value="10:00">10:00 AM</SelectItem>
                              <SelectItem value="11:30">11:30 AM</SelectItem>
                              <SelectItem value="14:00">02:00 PM</SelectItem>
                              <SelectItem value="16:00">04:00 PM</SelectItem>
                           </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full" onClick={handleSchedule}>Confirm Booking</Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2"><Zap className="w-4 h-4 text-warning"/> AI Interview Kit</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 text-sm">
                        <div>
                          <p className="font-semibold text-muted-foreground mb-1">Technical Focus</p>
                          <ul className="list-disc pl-4 space-y-1">{intel.interviewKit.technical.map(t=><li key={t}>{t}</li>)}</ul>
                        </div>
                        <div>
                          <p className="font-semibold text-muted-foreground mb-1">Behavioral</p>
                          <ul className="list-disc pl-4 space-y-1">{intel.interviewKit.behavioral.map(t=><li key={t}>{t}</li>)}</ul>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full mt-6" onClick={handleGenerateKit} disabled={generatingKit}>
                        {generatingKit ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <FileText className="w-4 h-4 mr-2"/>} Generate PDF Kit
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="mt-0 outline-none space-y-4">
                <div className="space-y-2">
                  <Label>Add Recruiter Note</Label>
                  <Textarea placeholder="Write a note about the candidate..." value={note} onChange={e=>setNote(e.target.value)} rows={3}/>
                  <Button onClick={handleAddNote}>Save Note</Button>
                </div>
                <Separator className="my-4"/>
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Activity Log</h3>
                  {notesList.map((n, i) => (
                    <div key={i} className="bg-muted/30 p-3 rounded-lg border border-border/50 text-sm space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Recruiter</span>
                        <span>{n.date}</span>
                      </div>
                      <p>{n.text}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="ats" className="mt-0 outline-none">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-border/40">
                    <h3 className="font-semibold text-sm">ATS Sync History</h3>
                    <Button variant="outline" size="sm" onClick={() => toast("success", "Forced sync with ATS")}><RefreshCw className="w-3 h-3 mr-2"/> Force Sync</Button>
                  </div>
                  {intel.atsActivity && intel.atsActivity.length > 0 ? intel.atsActivity.map((act: any, i: number) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                         <div className="w-3 h-3 rounded-full bg-primary" />
                         {i < intel.atsActivity!.length - 1 && <div className="w-px h-full bg-border my-2" />}
                      </div>
                      <div className="pb-4">
                         <p className="font-medium text-sm">{act.action}</p>
                         <p className="text-xs text-muted-foreground mt-1">{act.date}</p>
                         <p className="text-xs mt-1">{act.details}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-muted-foreground text-center py-8">No ATS activity logged for this candidate.</p>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function JobsSection({ jobs, onInitialJobsLoaded }: any) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await api.get("/jobs");
        const nextJobs = Array.isArray(response.data?.data) ? response.data.data : Array.isArray(response.data) ? response.data : [];
        if (active) onInitialJobsLoaded(nextJobs);
      } catch {
        if (active) onInitialJobsLoaded([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    void fetchJobs();
    return () => { active = false; };
  }, [onInitialJobsLoaded]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Job Postings</h2>
          <p className="text-sm text-muted-foreground">Browse current openings and view full job descriptions.</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" onClick={() => toast("success", "Imported 2 new jobs from ATS")}><DownloadCloud className="w-4 h-4 mr-2"/> Import from ATS</Button>
           <Badge variant="outline" className="text-xs">{jobs.length} role{jobs.length === 1 ? "" : "s"}</Badge>
        </div>
      </div>
      {/* Your original job cards JSX goes here */}
    </section>
  );
}

function ResumeUploadDialog({ onUploaded }: { onUploaded: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="outline"><Upload className="w-4 h-4 mr-2"/> Upload Resumes</Button></DialogTrigger>
      <DialogContent><DialogHeader><DialogTitle>Upload Resumes</DialogTitle></DialogHeader><div className="py-8 text-center text-sm text-muted-foreground border-2 border-dashed rounded-lg">Drag & drop resume PDF files here</div></DialogContent>
    </Dialog>
  );
}

function JobCreateDialog({ onCreated }: { onCreated: (job: Job) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2"/> Create Job</Button></DialogTrigger>
      <DialogContent><DialogHeader><DialogTitle>Create New Job</DialogTitle></DialogHeader><div className="py-8 text-center text-sm text-muted-foreground">Job Form Placeholder</div></DialogContent>
    </Dialog>
  );
}

// Kanban Sortable Item Wrapper
function SortableCandidateCard({ candidate, selected, onSelect, onViewResume, onIntelligence, onUpdateStatus }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: candidate.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none cursor-grab active:cursor-grabbing">
      <Card className="glass-card-hover rounded-xl border border-border/60 shadow-sm mb-3 pointer-events-auto">
        <CardContent className="p-4">
           <div className="flex justify-between items-start mb-2">
             <Checkbox checked={selected} onCheckedChange={onSelect} className="mt-1" onPointerDown={e=>e.stopPropagation()} />
             <div className="flex gap-1 flex-wrap justify-end">
                {candidate.source && <Badge variant="secondary" className="text-[10px] bg-muted">{candidate.source}</Badge>}
                {candidate.ats_id && <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-500 border-blue-500/20">{candidate.ats_id}</Badge>}
                <Badge variant="outline" className="text-[10px] bg-primary/5 border-primary/20 text-primary">{candidate.match}% Match</Badge>
             </div>
           </div>
           <div className="mt-1">
             <h4 className="font-semibold text-sm truncate">{candidate.name}</h4>
             <p className="text-xs text-muted-foreground truncate">{candidate.role}</p>
             <p className="text-xs text-muted-foreground mt-1">{candidate.experience}</p>
           </div>
           <div className="flex flex-wrap gap-1 mt-3">
             {candidate.skills.slice(0,3).map((s:string) => <Badge key={s} variant="outline" className="text-[9px] px-1 py-0">{s}</Badge>)}
             {candidate.skills.length > 3 && <Badge variant="outline" className="text-[9px] px-1 py-0">+{candidate.skills.length-3}</Badge>}
           </div>
           <div className="flex items-center gap-1 mt-4 pt-3 border-t border-border/40" onPointerDown={e=>e.stopPropagation()}>
              <Button size="icon" variant="ghost" className="h-7 w-7 text-success" onClick={() => onUpdateStatus(candidate.id, "shortlisted")}><ThumbsUp className="h-3 w-3" /></Button>
              <Button size="icon" variant="ghost" className="h-7 w-7 text-info" onClick={() => onUpdateStatus(candidate.id, "interview")}><CalendarIcon className="h-3 w-3" /></Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onViewResume(candidate)}><Eye className="h-3 w-3" /></Button>
              <Button size="icon" variant="ghost" className="h-7 w-7 text-primary" onClick={() => onIntelligence(candidate)}><Sparkles className="h-3 w-3" /></Button>
              <Button size="icon" variant="ghost" className="h-7 w-7 text-blue-500 hover:text-blue-600 hover:bg-blue-500/10 ml-auto" onClick={() => toast("success", `Pushed ${candidate.name} to ATS`)} title="Push to ATS"><Share className="h-3 w-3" /></Button>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── MAIN PAGE (complete) ──
export default function RecruitmentPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CandidateStatus>("all");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [loading, setLoading] = useState(true);
  const [resumeViewerOpen, setResumeViewerOpen] = useState(false);
  const [selectedCandidateForResume, setSelectedCandidateForResume] = useState<Candidate | null>(null);

  const [intelligenceOpen, setIntelligenceOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // New Features State
  const [viewMode, setViewMode] = useState<"list" | "pipeline">("list");
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([]);
  
  // Advanced Filters State
  const [filterSkills, setFilterSkills] = useState<string[]>([]);
  const [filterLocation, setFilterLocation] = useState("");
  const [filterNotice, setFilterNotice] = useState("");
  const [filterExp, setFilterExp] = useState("");

  const fetchCandidates = async (nextPage = page, nextSearch = search, nextStatus = statusFilter) => {
    setLoading(true);
    try {
      const response = await api.get("/candidates", {
        params: {
          page: nextPage,
          page_size: 8,
          search: nextSearch.trim(),
          ...(nextStatus !== "all" ? { status: nextStatus } : {}),
        },
      });
      const payload = response.data as any;
      let apiCandidates: Candidate[] = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload?.items) ? payload.items : Array.isArray(response.data) ? response.data : [];

      if (apiCandidates.length === 0) {
        apiCandidates = [
          { id: 1, name: "Rahul Sharma", role: "Senior Frontend Engineer", experience: "5+ years", skills: ["React", "TypeScript", "Tailwind"], match: 92, status: "new", resume_url: "https://example.com/resume1.pdf", location: "Jaipur", notice_period: "30 days", expected_salary: 2200000, source: "LinkedIn", ats_id: "GH-39421" },
          { id: 2, name: "Priya Patel", role: "Product Designer", experience: "4 years", skills: ["Figma", "UI/UX", "Prototyping"], match: 87, status: "shortlisted", location: "Delhi", notice_period: "15 days", expected_salary: 1800000, source: "Referral" },
          { id: 3, name: "Amit Kumar", role: "Backend Developer", experience: "3 years", skills: ["Node.js", "Python", "SQL"], match: 74, status: "new", location: "Bangalore", notice_period: "60 days", expected_salary: 1500000, source: "Naukri", ats_id: "GH-39422" },
          { id: 4, name: "Neha Singh", role: "Frontend Developer", experience: "2 years", skills: ["React", "CSS", "HTML"], match: 65, status: "interview", location: "Mumbai", notice_period: "15 days", expected_salary: 1000000, source: "Direct" },
          { id: 5, name: "Vikas Verma", role: "DevOps Engineer", experience: "6 years", skills: ["AWS", "Docker", "Kubernetes"], match: 95, status: "rejected", location: "Remote", notice_period: "90 days", expected_salary: 3000000, source: "LinkedIn", ats_id: "GH-39410" },
        ];
      }

      setCandidates(apiCandidates);
      setTotalCandidates(apiCandidates.length);
      setTotalPages(1);
      setPage(1);
    } catch (error) {
      toast("error", getErrorMessage(error, "Failed to load candidates"));
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => fetchCandidates(1, search, statusFilter), 250);
    return () => window.clearTimeout(timer);
  }, [search, statusFilter]);

  useEffect(() => {
    void fetchCandidates(1, "", "all");
  }, []);

  const updateCandidateStatus = async (candidateId: number, status: CandidateStatus) => {
    setUpdatingId(candidateId);
    try {
      await api.patch(`/candidates/${candidateId}/status`, { status });
      setCandidates(c => c.map(cand => cand.id === candidateId ? { ...cand, status } : cand));
      toast("success", `Candidate marked as ${status}`);
    } catch (error) {
      toast("error", getErrorMessage(error, "Failed to update candidate"));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleBulkAction = (action: string) => {
    if(selectedCandidates.length === 0) return;
    toast("success", `Bulk action "${action}" applied to ${selectedCandidates.length} candidates`);
    setSelectedCandidates([]);
  };

  const handleOpenIntelligence = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIntelligenceOpen(true);
  };

  const handleViewResume = (candidate: Candidate) => {
    if (candidate.resume_url) {
      setSelectedCandidateForResume(candidate);
      setResumeViewerOpen(true);
    } else {
      toast("error", "Resume not available for this candidate.");
    }
  };

  // DND Pipeline Setup
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if(!over) return;
    const candId = active.id as number;
    const newStatus = over.id as CandidateStatus;
    const cand = candidates.find(c => c.id === candId);
    if(cand && cand.status !== newStatus) {
      updateCandidateStatus(candId, newStatus);
    }
  };

  // Analytics
  const avgMatch = Math.round(candidates.reduce((a, b) => a + b.match, 0) / (candidates.length || 1));
  const shortlistedRate = Math.round((candidates.filter(c => c.status === "shortlisted").length / (candidates.length || 1)) * 100);
  const interviews = candidates.filter(c => c.status === "interview").length;

  return (
    <>
      <ToastContainer />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
               <h1 className="page-header text-3xl font-bold tracking-tight">Recruitment</h1>
               <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-success/10 text-success text-[10px] font-semibold border border-success/20">
                 <span className="relative flex h-2 w-2">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                 </span>
                 ATS Active (Greenhouse)
               </div>
            </div>
            <p className="page-subheader text-muted-foreground mt-1">AI-powered candidate screening, secure resume ingestion, and job creation.</p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <ATSConnectionDialog />
            <Button variant="outline" className="border-primary/20 text-foreground" onClick={() => { toast("success", "Synced 5 new candidates from ATS"); }}><RefreshCw className="w-4 h-4 mr-2"/> Sync from ATS</Button>
            <ResumeUploadDialog onUploaded={() => fetchCandidates(1, search, statusFilter)} />
            <JobCreateDialog onCreated={(newJob) => setJobs((prev) => [newJob, ...prev])} />
          </div>
        </div>

        {/* Analytics Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card/60 backdrop-blur-sm border-border/60">
             <CardContent className="p-5 flex items-center justify-between">
                <div>
                   <p className="text-sm font-medium text-muted-foreground mb-1">Total Candidates</p>
                   <p className="text-2xl font-bold">{totalCandidates}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><Users className="w-5 h-5 text-primary"/></div>
             </CardContent>
          </Card>
          <Card className="bg-card/60 backdrop-blur-sm border-border/60">
             <CardContent className="p-5 flex items-center justify-between">
                <div>
                   <p className="text-sm font-medium text-muted-foreground mb-1">Avg AI Match</p>
                   <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold">{avgMatch}%</p>
                      <span className="text-xs text-success flex items-center"><TrendingUp className="w-3 h-3 mr-0.5"/> 4%</span>
                   </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center"><Sparkles className="w-5 h-5 text-success"/></div>
             </CardContent>
          </Card>
          <Card className="bg-card/60 backdrop-blur-sm border-border/60">
             <CardContent className="p-5 flex items-center justify-between">
                <div>
                   <p className="text-sm font-medium text-muted-foreground mb-1">Shortlisted Rate</p>
                   <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold">{shortlistedRate}%</p>
                      <span className="text-xs text-destructive flex items-center"><TrendingUp className="w-3 h-3 mr-0.5 rotate-180"/> 2%</span>
                   </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-info/10 flex items-center justify-center"><Target className="w-5 h-5 text-info"/></div>
             </CardContent>
          </Card>
          <Card className="bg-card/60 backdrop-blur-sm border-border/60">
             <CardContent className="p-5 flex items-center justify-between">
                <div>
                   <p className="text-sm font-medium text-muted-foreground mb-1">Interviews Scheduled</p>
                   <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold">{interviews}</p>
                      <span className="text-xs text-success flex items-center"><TrendingUp className="w-3 h-3 mr-0.5"/> 12%</span>
                   </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center"><CalendarIcon className="w-5 h-5 text-warning"/></div>
             </CardContent>
          </Card>
        </div>

        <JobsSection jobs={jobs} onInitialJobsLoaded={setJobs} />

        {/* Filters and View Toggle */}
        <div className="grid gap-3 rounded-2xl border border-border/60 bg-card/60 p-4 lg:grid-cols-[minmax(0,1fr)_180px_auto_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by candidate, role, or skill" className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={(v: "all" | CandidateStatus) => setStatusFilter(v)}>
            <SelectTrigger>
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline"><Filter className="w-4 h-4 mr-2"/> Advanced</Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Advanced Filters</SheetTitle>
              </SheetHeader>
              <div className="py-6 space-y-6">
                <div className="space-y-2">
                  <Label>Skills (Comma separated)</Label>
                  <Input placeholder="e.g. React, Node, AWS" onChange={e => setFilterSkills(e.target.value.split(','))} />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {filterSkills.filter(s=>s.trim()).map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select value={filterLocation} onValueChange={setFilterLocation}>
                    <SelectTrigger><SelectValue placeholder="Any Location"/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jaipur">Jaipur</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-4">
                  <Label>Expected Salary Limit (₹ Lakhs)</Label>
                  <Slider defaultValue={[30]} max={50} step={1} className="py-2" />
                </div>
                <div className="space-y-2">
                  <Label>Notice Period</Label>
                  <Select value={filterNotice} onValueChange={setFilterNotice}>
                    <SelectTrigger><SelectValue placeholder="Any"/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">0-15 Days</SelectItem>
                      <SelectItem value="30">15-30 Days</SelectItem>
                      <SelectItem value="60">30-60 Days</SelectItem>
                      <SelectItem value="90">60+ Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Experience</Label>
                  <Select value={filterExp} onValueChange={setFilterExp}>
                    <SelectTrigger><SelectValue placeholder="Any"/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-3">1-3 Years</SelectItem>
                      <SelectItem value="3-5">3-5 Years</SelectItem>
                      <SelectItem value="5-8">5-8 Years</SelectItem>
                      <SelectItem value="8+">8+ Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button className="w-full">Apply Filters</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <div className="flex bg-muted/50 rounded-lg p-1 border border-border/50">
            <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" className="h-8 w-8 rounded-md" onClick={() => setViewMode("list")}>
               <LayoutList className="w-4 h-4"/>
            </Button>
            <Button variant={viewMode === "pipeline" ? "secondary" : "ghost"} size="icon" className="h-8 w-8 rounded-md" onClick={() => setViewMode("pipeline")}>
               <Kanban className="w-4 h-4"/>
            </Button>
          </div>
        </div>

        {/* Bulk Action Bar */}
        <AnimatePresence>
          {selectedCandidates.length > 0 && (
            <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="bg-primary/10 border border-primary/20 text-primary px-4 py-3 rounded-xl flex flex-wrap items-center justify-between gap-4">
              <span className="font-semibold text-sm">{selectedCandidates.length} candidate(s) selected</span>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="bg-background text-xs border-primary/20 hover:bg-primary/10" onClick={()=>handleBulkAction('Shortlist')}>Shortlist</Button>
                <Button size="sm" variant="outline" className="bg-background text-xs border-primary/20 hover:bg-primary/10" onClick={()=>handleBulkAction('Reject')}>Reject</Button>
                <Button size="sm" variant="outline" className="bg-background text-xs border-primary/20 hover:bg-primary/10" onClick={()=>handleBulkAction('Schedule Interview')}>Schedule Interview</Button>
                <Button size="sm" variant="outline" className="bg-background text-xs border-blue-500/20 text-blue-500 hover:bg-blue-500/10" onClick={()=>handleBulkAction('Push to ATS')}><UploadCloud className="w-3 h-3 mr-1"/> Push to ATS</Button>
                <Button size="sm" variant="outline" className="bg-background text-xs border-primary/20 hover:bg-primary/10" onClick={()=>handleBulkAction('Export CSV')}><Download className="w-3 h-3 mr-1"/> Export</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Candidates Content */}
        {loading ? (
          <div className="flex items-center justify-center rounded-2xl border border-border/60 bg-card/50 py-16 text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading candidates...</div>
        ) : candidates.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border/70 py-16 text-center text-muted-foreground">No candidates found.</p>
        ) : viewMode === "list" ? (
          /* List View */
          <div className="grid gap-4">
            {candidates.map((candidate, index) => (
              <motion.div key={candidate.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="glass-card-hover rounded-2xl border border-border/60 p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                  <div className="flex items-center self-start xl:self-center mr-2">
                    <Checkbox checked={selectedCandidates.includes(candidate.id)} onCheckedChange={(c) => setSelectedCandidates(p => c ? [...p, candidate.id] : p.filter(id => id !== candidate.id))} />
                  </div>
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="gradient-bg flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-primary-foreground">
                      {candidate.name.split(" ").slice(0, 2).map(n => n[0]).join("")}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                         <h3 className="truncate font-semibold">{candidate.name}</h3>
                         {candidate.source && <Badge variant="secondary" className="text-[10px] bg-muted/60">{candidate.source}</Badge>}
                         {candidate.ats_id && <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-500 border-blue-500/20"><Network className="w-3 h-3 mr-1"/> {candidate.ats_id}</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{candidate.role} - {candidate.experience}</p>
                      {candidate.resume_url && <Badge variant="outline" className="mt-1 text-xs bg-primary/10 text-primary border-primary/20">Resume Available</Badge>}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-wrap gap-1.5">
                    {candidate.skills.map(skill => <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>)}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-36">
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">AI Match</span>
                        <span className="font-semibold">{candidate.match}%</span>
                      </div>
                      <Progress value={candidate.match} className="h-2" />
                    </div>
                    <Badge variant="outline" className={`capitalize text-xs w-[90px] text-center justify-center ${candidate.status === "new" ? "bg-info/10 text-info" : candidate.status === "shortlisted" ? "bg-success/10 text-success" : candidate.status === "interview" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>
                      {candidate.status}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-success" disabled={updatingId === candidate.id} onClick={() => updateCandidateStatus(candidate.id, "shortlisted")}><ThumbsUp className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" disabled={updatingId === candidate.id} onClick={() => updateCandidateStatus(candidate.id, "rejected")}><ThumbsDown className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-info" disabled={updatingId === candidate.id} onClick={() => updateCandidateStatus(candidate.id, "interview")}><CalendarIcon className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleViewResume(candidate)}><Eye className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-primary bg-primary/5 hover:bg-primary/15" onClick={() => handleOpenIntelligence(candidate)}><Sparkles className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-500/10" onClick={() => toast("success", `Pushed ${candidate.name} to ATS`)} title="Push to ATS"><Share className="h-4 w-4" /></Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Pipeline View */
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
              {(["new", "shortlisted", "interview", "rejected"] as CandidateStatus[]).map((col) => {
                const colCands = candidates.filter(c => c.status === col);
                const avg = colCands.length ? Math.round(colCands.reduce((a,b)=>a+b.match,0)/colCands.length) : 0;
                return (
                  <div key={col} id={col} className="bg-muted/30 rounded-2xl p-4 border border-border/50 min-h-[400px]">
                     <div className="flex items-center justify-between mb-4">
                       <h3 className="font-semibold capitalize text-sm">{col} <Badge variant="secondary" className="ml-2 text-xs">{colCands.length}</Badge></h3>
                       {colCands.length > 0 && <span className="text-[10px] text-muted-foreground">{avg}% match</span>}
                     </div>
                     <SortableContext items={colCands.map(c=>c.id)} strategy={verticalListSortingStrategy}>
                       {colCands.map(c => (
                         <SortableCandidateCard key={c.id} candidate={c} selected={selectedCandidates.includes(c.id)} onSelect={(chk: boolean) => setSelectedCandidates(p => chk ? [...p, c.id] : p.filter(id => id !== c.id))} onViewResume={handleViewResume} onIntelligence={handleOpenIntelligence} onUpdateStatus={updateCandidateStatus} />
                       ))}
                     </SortableContext>
                     {colCands.length === 0 && <div className="text-center py-8 text-xs text-muted-foreground border-2 border-dashed border-border/40 rounded-xl">Drop candidate here</div>}
                  </div>
                );
              })}
            </div>
          </DndContext>
        )}

        {selectedCandidateForResume && (
          <ResumeViewerDialog candidateName={selectedCandidateForResume.name} resumeUrl={selectedCandidateForResume.resume_url} open={resumeViewerOpen} onOpenChange={setResumeViewerOpen} />
        )}

        <CandidateIntelligencePanel candidate={selectedCandidate} open={intelligenceOpen} onOpenChange={setIntelligenceOpen} onStatusChange={updateCandidateStatus} />
      </motion.div>
    </>
  );
}
