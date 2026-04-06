import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  Eye,
  Filter,
  Loader2,
  Plus,
  Search,
  ThumbsDown,
  ThumbsUp,
  Download,
  Upload,
  X,
  XCircle,
} from "lucide-react";
import axios from "axios";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";

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
}

interface Toast {
  id: number;
  type: "success" | "error";
  message: string;
}

interface JobForm {
  title: string;
  department: string;
  description: string;
  min_salary: string;
  max_salary: string;
}

const statusColors: Record<CandidateStatus, string> = {
  new: "bg-info/10 text-info border-info/20",
  shortlisted: "bg-success/10 text-success border-success/20",
  interview: "bg-warning/10 text-warning border-warning/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

const emptyJob: JobForm = {
  title: "",
  department: "",
  description: "",
  min_salary: "",
  max_salary: "",
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
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((toastItem) => toastItem.id !== id));
      }, 3500);
    };
    return () => {
      addToast = null;
    };
  }, []);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[9999] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toastItem) => (
          <motion.div
            key={toastItem.id}
            initial={{ opacity: 0, x: 80, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            className={`pointer-events-auto flex min-w-[260px] items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-xl ${
              toastItem.type === "success"
                ? "border-success/30 bg-success/10 text-success"
                : "border-destructive/30 bg-destructive/10 text-destructive"
            }`}
          >
            {toastItem.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 shrink-0" />
            )}
            <span className="flex-1">{toastItem.message}</span>
            <button
              onClick={() => setToasts((prev) => prev.filter((item) => item.id !== toastItem.id))}
              className="opacity-60 transition-opacity hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback;
  }
  return fallback;
}

// ResumeViewerDialog component
interface ResumeViewerDialogProps {
  candidateName: string;
  resumeUrl: string | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ResumeViewerDialog({ candidateName, resumeUrl, open, onOpenChange }: ResumeViewerDialogProps) {
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    // Reset iframeError when dialog opens or resumeUrl changes
    if (open) {
      setIframeError(false);
    }
  }, [open, resumeUrl]);

  const handleDownload = () => {
    if (resumeUrl) {
      // Open in new tab, browser will handle download if Content-Disposition header is set
      window.open(resumeUrl, '_blank');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Resume for {candidateName}</span>
            <div className="flex gap-2">
              {resumeUrl && (
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 relative flex items-center justify-center bg-muted/20 rounded-lg">
          {resumeUrl && !iframeError ? (
            <iframe
              src={resumeUrl}
              title={`Resume for ${candidateName}`}
              className="w-full h-full border-none rounded-lg"
              onError={() => setIframeError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground p-4 text-center">
              <XCircle className="h-10 w-10" />
              <p className="text-lg font-medium">Resume not available or failed to load.</p>
              {!resumeUrl && <p className="text-sm">No resume URL provided for this candidate.</p>}
              {iframeError && resumeUrl && <p className="text-sm">Could not display resume from the provided URL. It might be due to security restrictions (e.g., cross-origin issues) or an invalid file format.</p>}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function RecruitmentPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CandidateStatus>("all");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [loading, setLoading] = useState(true);
  const [resumeViewerOpen, setResumeViewerOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

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

      const payload = response.data as unknown as { data?: unknown; items?: unknown };
      const apiCandidates = Array.isArray(payload?.data)
        ? (payload.data as Candidate[])
        : Array.isArray(payload?.items)
          ? (payload.items as Candidate[])
          : Array.isArray(response.data)
            ? (response.data as Candidate[])
            : [];

      const query = nextSearch.trim().toLowerCase();
      const filteredCandidates = apiCandidates.filter((candidate) => {
        if (nextStatus !== "all" && candidate.status !== nextStatus) return false;
        if (!query) return true;
        const skillText = (candidate.skills || []).join(" ").toLowerCase();
        return (
          (candidate.name || "").toLowerCase().includes(query) ||
          (candidate.role || "").toLowerCase().includes(query) ||
          skillText.includes(query)
        );
      });

      const pageSize = 8;
      const pages = Math.max(1, Math.ceil(filteredCandidates.length / pageSize));
      const safePage = Math.min(Math.max(1, nextPage), pages);
      const start = (safePage - 1) * pageSize;
      const pagedCandidates = filteredCandidates.slice(start, start + pageSize);

      console.log("Candidates:", pagedCandidates);
      setCandidates(pagedCandidates);
      setPage(safePage);
      setTotalPages(pages);
      setTotalCandidates(filteredCandidates.length);
    } catch (error) {
      toast("error", getErrorMessage(error, "Failed to load candidates"));
      setCandidates([]);
      setPage(1);
      setTotalPages(1);
      setTotalCandidates(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchCandidates(1, search, statusFilter);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [search, statusFilter]);

  useEffect(() => {
    void fetchCandidates(1, "", "all");
  }, []);

  const updateCandidateStatus = async (candidateId: number, status: CandidateStatus) => {
    setUpdatingId(candidateId);
    try {
      await api.patch(`/candidates/${candidateId}/status`, { status });
      toast("success", `Candidate marked as ${status}`);
      await fetchCandidates(page, search, statusFilter);
    } catch (error) {
      toast("error", getErrorMessage(error, "Failed to update candidate"));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleViewResume = (candidate: Candidate) => {
    if (candidate.resume_url) {
      setSelectedCandidate(candidate);
      setResumeViewerOpen(true);
    } else {
      toast("error", "Resume not available for this candidate.");
    }
  };

  return (
    <>
      <ToastContainer />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="page-header">Recruitment</h1>
            <p className="page-subheader">AI-powered candidate screening, secure resume ingestion, and job creation.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ResumeUploadDialog onUploaded={() => fetchCandidates(1, search, statusFilter)} />
            <JobCreateDialog onCreated={() => fetchCandidates(page, search, statusFilter)} />
          </div>
        </div>

        <div className="grid gap-3 rounded-2xl border border-border/60 bg-card/60 p-4 lg:grid-cols-[minmax(0,1fr)_180px_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by candidate, role, or skill" className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={(value: "all" | CandidateStatus) => setStatusFilter(value)}>
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
          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/70 px-4 py-3 text-sm text-muted-foreground">
            <span>Total candidates</span>
            <span className="font-semibold text-foreground">{totalCandidates}</span>
          </div>
        </div>

        <div className="grid gap-4">
          {loading && (
            <div className="flex items-center justify-center rounded-2xl border border-border/60 bg-card/50 py-16 text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading candidates...
            </div>
          )}

          {!loading && candidates.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border/70 py-16 text-center text-muted-foreground">
              No candidates found for the current filters.
            </p>
          )}

          {!loading &&
            candidates.map((candidate, index) => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="glass-card-hover rounded-2xl border border-border/60 p-5"
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="gradient-bg flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-primary-foreground">
                      {candidate.name
                        .split(" ")
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join("")}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">{candidate.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {candidate.role || "Unassigned role"} - {candidate.experience || "Experience not parsed"}
                      </p>
                      {candidate.resume_url && (
                        <Badge variant="outline" className="mt-1 text-xs bg-primary/10 text-primary border-primary/20">Resume Available</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-wrap gap-1.5">
                    {(candidate.skills || []).length > 0 ? (
                      candidate.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No skills extracted yet</span>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-36">
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">AI Match</span>
                        <span className="font-semibold">{candidate.match}%</span>
                      </div>
                      <Progress value={candidate.match} className="h-2" />
                    </div>
                    <Badge variant="outline" className={`${statusColors[candidate.status]} capitalize text-xs`}>
                      {candidate.status}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-success"
                      disabled={updatingId === candidate.id}
                      onClick={() => updateCandidateStatus(candidate.id, "shortlisted")}
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive"
                      disabled={updatingId === candidate.id}
                      onClick={() => updateCandidateStatus(candidate.id, "rejected")}
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-info"
                      disabled={updatingId === candidate.id}
                      onClick={() => updateCandidateStatus(candidate.id, "interview")}
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      title={candidate.resume_url ? "View Resume" : "Resume not available"}
                      disabled={!candidate.resume_url}
                      onClick={() => handleViewResume(candidate)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" disabled={page <= 1 || loading} onClick={() => fetchCandidates(page - 1, search, statusFilter)}>
              Previous
            </Button>
            <Button variant="outline" disabled={page >= totalPages || loading} onClick={() => fetchCandidates(page + 1, search, statusFilter)}>
              Next
            </Button>
          </div>
        </div>

        {selectedCandidate && (
          <ResumeViewerDialog
            candidateName={selectedCandidate.name}
            resumeUrl={selectedCandidate.resume_url}
            open={resumeViewerOpen}
            onOpenChange={setResumeViewerOpen}
          />
        )}
      </motion.div>
    </>
  );
}

function ResumeUploadDialog({ onUploaded }: { onUploaded: () => void }) {
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
  ];

  const handleFile = (selectedFile: File) => {
    if (!allowedTypes.includes(selectedFile.type)) {
      toast("error", "Only PDF, DOC, or DOCX files are allowed.");
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast("error", "File too large. Maximum size is 10 MB.");
      return;
    }
    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const handleUpload = async () => {
    if (!file) {
      toast("error", "Please select a resume first.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast("success", "Resume uploaded and candidate created successfully");
      onUploaded();
      setOpen(false);
      setFile(null);
      setFileName(null);
    } catch (error) {
      toast("error", getErrorMessage(error, "Upload failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="mr-1 h-4 w-4" /> Upload Resume
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Resume</DialogTitle>
        </DialogHeader>
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            const droppedFile = event.dataTransfer.files[0];
            if (droppedFile) {
              handleFile(droppedFile);
            }
          }}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
            dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/40"
          }`}
        >
          <Upload className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          {fileName ? (
            <p className="text-sm font-medium text-primary">{fileName}</p>
          ) : (
            <>
              <p className="text-sm font-medium">Drag and drop resume here</p>
              <p className="mt-1 text-xs text-muted-foreground">PDF, DOC, DOCX up to 10 MB</p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(event) => {
              const selectedFile = event.target.files?.[0];
              if (selectedFile) {
                handleFile(selectedFile);
              }
            }}
          />
          <Button variant="outline" size="sm" className="mt-4" type="button">
            Browse Files
          </Button>
        </div>

        <Button onClick={handleUpload} disabled={loading || !file} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
            </>
          ) : (
            "Upload Resume"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function JobCreateDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<JobForm>(emptyJob);
  const [errors, setErrors] = useState<Partial<JobForm>>({});
  const [loading, setLoading] = useState(false);

  const setField = (field: keyof JobForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const nextErrors: Partial<JobForm> = {};
    if (!form.title.trim()) nextErrors.title = "Job title is required.";
    if (!form.department) nextErrors.department = "Please select a department.";
    if (!form.description.trim()) nextErrors.description = "Description is required.";
    if (!form.min_salary) nextErrors.min_salary = "Min salary is required.";
    if (!form.max_salary) nextErrors.max_salary = "Max salary is required.";
    if (form.min_salary && form.max_salary && Number(form.min_salary) > Number(form.max_salary)) {
      nextErrors.max_salary = "Max salary must be greater than or equal to min salary.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post("/jobs", {
        title: form.title.trim(),
        department: form.department,
        description: form.description.trim(),
        min_salary: Number(form.min_salary),
        max_salary: Number(form.max_salary),
      });
      toast("success", "Job posting created successfully");
      onCreated();
      setOpen(false);
      setForm(emptyJob);
      setErrors({});
    } catch (error) {
      toast("error", getErrorMessage(error, "Failed to create job. Try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) {
          setForm(emptyJob);
          setErrors({});
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-1 h-4 w-4" /> Create Job
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Job Posting</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1">
            <Label>
              Job Title <span className="text-destructive">*</span>
            </Label>
            <Input
              value={form.title}
              onChange={(event) => setField("title", event.target.value)}
              className={errors.title ? "border-destructive" : ""}
              placeholder="e.g. Senior Frontend Engineer"
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-1">
            <Label>
              Department <span className="text-destructive">*</span>
            </Label>
            <Select value={form.department} onValueChange={(value) => setField("department", value)}>
              <SelectTrigger className={errors.department ? "border-destructive" : ""}>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
            {errors.department && <p className="text-xs text-destructive">{errors.department}</p>}
          </div>

          <div className="space-y-1">
            <Label>
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              value={form.description}
              onChange={(event) => setField("description", event.target.value)}
              className={errors.description ? "border-destructive" : ""}
              placeholder="Job description, responsibilities, requirements..."
              rows={4}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1 space-y-1">
              <Label>
                Min Salary (INR) <span className="text-destructive">*</span>
              </Label>
              <Input
                type="number"
                value={form.min_salary}
                onChange={(event) => setField("min_salary", event.target.value)}
                className={errors.min_salary ? "border-destructive" : ""}
                placeholder="500000"
              />
              {errors.min_salary && <p className="text-xs text-destructive">{errors.min_salary}</p>}
            </div>
            <div className="flex-1 space-y-1">
              <Label>
                Max Salary (INR) <span className="text-destructive">*</span>
              </Label>
              <Input
                type="number"
                value={form.max_salary}
                onChange={(event) => setField("max_salary", event.target.value)}
                className={errors.max_salary ? "border-destructive" : ""}
                placeholder="1200000"
              />
              {errors.max_salary && <p className="text-xs text-destructive">{errors.max_salary}</p>}
            </div>
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
              </>
            ) : (
              "Create Job"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
