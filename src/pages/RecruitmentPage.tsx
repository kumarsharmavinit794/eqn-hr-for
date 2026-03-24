import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter, Upload, Star, ThumbsUp, ThumbsDown, Calendar, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const candidates = [
  { id: 1, name: "Sarah Chen", role: "Sr. Frontend Engineer", match: 94, skills: ["React", "TypeScript", "Next.js"], status: "shortlisted", experience: "6 yrs" },
  { id: 2, name: "Marcus Johnson", role: "Backend Developer", match: 87, skills: ["Python", "Django", "AWS"], status: "new", experience: "4 yrs" },
  { id: 3, name: "Aisha Patel", role: "Product Designer", match: 78, skills: ["Figma", "UX Research", "Prototyping"], status: "interview", experience: "5 yrs" },
  { id: 4, name: "James Wilson", role: "DevOps Engineer", match: 65, skills: ["Docker", "K8s", "Terraform"], status: "rejected", experience: "3 yrs" },
  { id: 5, name: "Elena Rodriguez", role: "Data Scientist", match: 91, skills: ["Python", "ML", "TensorFlow"], status: "new", experience: "7 yrs" },
];

const statusColors: Record<string, string> = {
  new: "bg-info/10 text-info border-info/20",
  shortlisted: "bg-success/10 text-success border-success/20",
  interview: "bg-warning/10 text-warning border-warning/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function RecruitmentPage() {
  const [search, setSearch] = useState("");
  const filtered = candidates.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Recruitment</h1>
          <p className="page-subheader">AI-powered candidate screening & management</p>
        </div>
        <div className="flex gap-2">
          <ResumeUploadDialog />
          <JobCreateDialog />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search candidates..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-1" /> Filter</Button>
      </div>

      {/* Candidate Cards */}
      <div className="grid gap-4">
        {filtered.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card-hover rounded-xl p-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-11 h-11 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-semibold text-sm shrink-0">
                  {c.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <h3 className="font-semibold">{c.name}</h3>
                  <p className="text-sm text-muted-foreground">{c.role} · {c.experience}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-1">
                <div className="flex flex-wrap gap-1.5">
                  {c.skills.map(s => (
                    <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-32">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">AI Match</span>
                    <span className="font-semibold">{c.match}%</span>
                  </div>
                  <Progress value={c.match} className="h-2" />
                </div>
                <Badge variant="outline" className={`${statusColors[c.status]} capitalize text-xs`}>{c.status}</Badge>
              </div>

              <div className="flex gap-1">
                <Button size="icon" variant="ghost" className="h-8 w-8 text-success"><ThumbsUp className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive"><ThumbsDown className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-info"><Calendar className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" className="h-8 w-8"><Eye className="w-4 h-4" /></Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function ResumeUploadDialog() {
  const [dragging, setDragging] = useState(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"><Upload className="w-4 h-4 mr-1" /> Upload Resume</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Upload Resume for AI Analysis</DialogTitle></DialogHeader>
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); }}
          className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${dragging ? "border-primary bg-primary/5" : "border-border"}`}
        >
          <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm font-medium">Drag & drop resume here</p>
          <p className="text-xs text-muted-foreground mt-1">PDF, DOCX up to 10MB</p>
          <Button variant="outline" size="sm" className="mt-4">Browse Files</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function JobCreateDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Create Job</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Create New Job Posting</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label>Job Title</Label><Input placeholder="e.g. Senior Frontend Engineer" /></div>
          <div><Label>Department</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Description</Label><Textarea placeholder="Job description..." rows={4} /></div>
          <div className="flex gap-2">
            <div className="flex-1"><Label>Min Salary</Label><Input type="number" placeholder="80000" /></div>
            <div className="flex-1"><Label>Max Salary</Label><Input type="number" placeholder="120000" /></div>
          </div>
          <Button className="w-full"><Sparkles className="w-4 h-4 mr-1" /> Create with AI Enhancement</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Sparkles(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
      <path d="M20 3v4"/><path d="M22 5h-4"/>
    </svg>
  );
}
