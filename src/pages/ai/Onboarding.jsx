import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  FileCheck2,
  FileText,
  Github,
  Laptop,
  Mail,
  RefreshCw,
  ScanSearch,
  ShieldCheck,
  Slack,
  Sparkles,
  Upload,
  UserCircle2,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const storageKey = "employeeOnboardingIntelligence";

const departments = ["Engineering", "Product", "Marketing", "Sales", "Human Resources", "Finance"];
const roles = [
  "Software Engineer",
  "Product Manager",
  "Marketing Specialist",
  "Sales Executive",
  "HR Generalist",
  "Financial Analyst",
];
const managers = [
  "Aisha Verma - Engineering Director",
  "Rahul Khanna - Product Lead",
  "Neha Iyer - People Operations Head",
  "Karan Shah - Sales Manager",
];

const documentTemplates = [
  { name: "PAN Card", type: "Government ID", confidence: 96, status: "Verified" },
  { name: "Aadhaar Card", type: "Government ID", confidence: 94, status: "Verified" },
  { name: "Resume", type: "Candidate Profile", confidence: 92, status: "Matched" },
  { name: "Offer Letter", type: "Employment Document", confidence: 98, status: "Verified" },
  { name: "Identity Proof", type: "Address Proof", confidence: 88, status: "Needs Review" },
];

const trainingByRole = {
  "Software Engineer": ["React Advanced", "Secure Coding Essentials", "Engineering Onboarding Bootcamp"],
  "Product Manager": ["Product Strategy Foundations", "Roadmapping at Scale", "Stakeholder Communication"],
  "Marketing Specialist": ["Brand Voice Playbook", "Campaign Analytics", "Marketing Operations 101"],
  "Sales Executive": ["CRM Pipeline Mastery", "Discovery and Demo Skills", "Sales Compliance Basics"],
  "HR Generalist": ["HRIS Platform Training", "Policy and Compliance", "People Operations Workflow"],
  "Financial Analyst": ["FP&A Fundamentals", "Data Accuracy Controls", "Finance Systems Training"],
};

const defaultChecklist = [
  { label: "Complete employee profile", done: true, owner: "HR Ops" },
  { label: "Upload and verify documents", done: true, owner: "Employee" },
  { label: "Read company policies", done: false, owner: "Employee" },
  { label: "Set up work tools", done: false, owner: "IT Admin" },
  { label: "Manager welcome meeting", done: false, owner: "Manager" },
  { label: "Finish security training", done: false, owner: "Employee" },
];

function generateEmployeeId() {
  return `EMP${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")}`;
}

function statusTone(status) {
  switch (status) {
    case "Verified":
    case "Matched":
    case "Completed":
    case "Active":
    case "Allocated":
    case "Provisioned":
    case "Ready":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300";
    case "Needs Review":
    case "Pending":
    case "In Progress":
      return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300";
  }
}

export default function EmployeeOnboarding() {
  const [formData, setFormData] = useState({
    employeeId: generateEmployeeId(),
    name: "",
    email: "",
    role: "Software Engineer",
    department: "Engineering",
    joiningDate: "",
    avatar: "",
    manager: managers[0],
    introNotes: "",
  });
  const [documents, setDocuments] = useState([]);
  const [checklist, setChecklist] = useState(defaultChecklist);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("workspace");

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return;
    const parsed = JSON.parse(stored);
    setFormData(parsed.formData || {
      employeeId: generateEmployeeId(),
      name: "",
      email: "",
      role: "Software Engineer",
      department: "Engineering",
      joiningDate: "",
      avatar: "",
      manager: managers[0],
      introNotes: "",
    });
    setDocuments(parsed.documents || []);
    setChecklist(parsed.checklist || defaultChecklist);
    setCompleted(Boolean(parsed.completed));
  }, []);

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({ formData, documents, checklist, completed })
    );
  }, [formData, documents, checklist, completed]);

  const uploadedDocuments = documents.length ? documents : documentTemplates;
  const verifiedDocuments = uploadedDocuments.filter((item) => item.status === "Verified" || item.status === "Matched").length;
  const completedTasks = checklist.filter((item) => item.done).length;
  const progress = Math.round(((completedTasks + verifiedDocuments) / (checklist.length + uploadedDocuments.length)) * 100);
  const trainingRecommendations = trainingByRole[formData.role] || trainingByRole["Software Engineer"];

  const analytics = useMemo(
    () => [
      { label: "Total Employees Onboarded", value: 148, icon: Users },
      { label: "Pending Onboarding", value: 12, icon: Clock3 },
      { label: "Average Onboarding Time", value: "4.2 days", icon: CalendarDays },
      { label: "Automation Completion", value: `${progress}%`, icon: Sparkles },
    ],
    [progress]
  );

  const accounts = [
    { name: "Email", handle: formData.email || "employee@company.com", status: "Active", icon: Mail },
    { name: "Slack", handle: formData.name ? `@${formData.name.toLowerCase().replace(/\s+/g, ".")}` : "@new.joiner", status: "Pending", icon: Slack },
    { name: "HR Portal", handle: formData.employeeId, status: "Active", icon: ShieldCheck },
    { name: "GitHub", handle: formData.name ? `${formData.name.toLowerCase().split(" ")[0]}-corp` : "newhire-corp", status: "Pending", icon: Github },
  ];

  const equipment = [
    { label: "Laptop", value: "MacBook Pro 14", icon: Laptop, status: "Allocated" },
    { label: "Access Card", value: "HQ Level 5 access", icon: CreditCard, status: "Ready" },
    { label: "Email Account", value: formData.email || "pending setup", icon: Mail, status: "Provisioned" },
  ];

  const introMessage = useMemo(() => {
    const firstName = formData.name.trim().split(" ")[0] || "our new teammate";
    return `Please welcome ${firstName}, joining ${formData.department} as ${formData.role}. ${firstName} starts on ${
      formData.joiningDate || "the scheduled joining date"
    } and will report to ${formData.manager}.`;
  }, [formData.department, formData.joiningDate, formData.manager, formData.name, formData.role]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      setError("Please upload a valid profile image.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => handleChange("avatar", e.target?.result || "");
    reader.readAsDataURL(file);
  };

  const handleDocumentUpload = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    const nextDocuments = files.map((file, index) => {
      const template = documentTemplates[(documents.length + index) % documentTemplates.length];
      return {
        id: `${file.name}-${Date.now()}-${index}`,
        name: template.name,
        fileName: file.name,
        type: template.type,
        confidence: template.confidence,
        status: template.status,
      };
    });
    setDocuments((prev) => [...prev, ...nextDocuments].slice(0, 5));
  };

  const toggleTask = (index) => {
    setChecklist((prev) => prev.map((item, idx) => (idx === index ? { ...item, done: !item.done } : item)));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.joiningDate) {
      setError("Please complete employee basics before finalizing onboarding.");
      return;
    }
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setSubmitting(false);
    setCompleted(true);
    setActiveTab("analytics");
  };

  const handleReset = () => {
    setFormData({
      employeeId: generateEmployeeId(),
      name: "",
      email: "",
      role: "Software Engineer",
      department: "Engineering",
      joiningDate: "",
      avatar: "",
      manager: managers[0],
      introNotes: "",
    });
    setDocuments([]);
    setChecklist(defaultChecklist);
    setCompleted(false);
    setError("");
    setActiveTab("workspace");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="relative overflow-hidden px-6 py-8 sm:px-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_35%),radial-gradient(circle_at_right,_rgba(16,185,129,0.16),_transparent_30%)]" />
            <div className="relative flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <Badge variant="outline" className="mb-3 border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
                  Employee Onboarding Intelligence
                </Badge>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Employee Onboarding Management System
                </h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Centralize employee setup, document verification, provisioning, training, manager assignment, and onboarding progress in one enterprise HR workspace.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={handleReset}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button onClick={handleSubmit} disabled={submitting}>
                  {submitting ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                  {submitting ? "Finalizing..." : "Complete Onboarding"}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {analytics.map((item) => (
            <Card key={item.label} className="dark:border-slate-700 dark:bg-slate-900">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-xs text-slate-500">{item.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{item.value}</p>
                </div>
                <item.icon className="h-5 w-5 text-slate-500" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="dark:border-slate-700 dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-base">Onboarding Progress Tracker</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Workflow completion</p>
                    <p className="text-xs text-slate-500">Profile, documents, accounts, and tasks</p>
                  </div>
                  <Badge variant="outline" className={statusTone(completed ? "Completed" : "In Progress")}>
                    {completed ? "Completed" : "In Progress"}
                  </Badge>
                </div>
                <div className="mt-4">
                  <Progress value={progress} />
                  <div className="mt-2 flex justify-between text-xs text-slate-500">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Manager Assignment", value: formData.manager, icon: UserCog },
                  { label: "Documents Verified", value: `${verifiedDocuments}/${uploadedDocuments.length}`, icon: FileCheck2 },
                  { label: "Accounts Provisioned", value: `${accounts.filter((item) => item.status === "Active").length}/${accounts.length}`, icon: ShieldCheck },
                  { label: "Task Completion", value: `${completedTasks}/${checklist.length}`, icon: BadgeCheck },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-500">{item.label}</p>
                      <item.icon className="h-4 w-4 text-slate-400" />
                    </div>
                    <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="dark:border-slate-700 dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-base">Employee Introduction Generator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Employee avatar" className="h-16 w-16 rounded-2xl object-cover" />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                    <UserCircle2 className="h-9 w-9 text-slate-400" />
                  </div>
                )}
                <div>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{formData.name || "New employee"}</p>
                  <p className="text-sm text-slate-500">{formData.role} • {formData.department}</p>
                  <p className="text-xs text-slate-500">{formData.employeeId}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  Welcome message
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">{introMessage}</p>
              </div>
              <Textarea
                value={formData.introNotes}
                onChange={(e) => handleChange("introNotes", e.target.value)}
                placeholder="Add custom intro note for the team announcement..."
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="workspace">Workspace</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="workspace" className="mt-4">
            <div className="grid gap-4 xl:grid-cols-3">
              <Card className="xl:col-span-2 dark:border-slate-700 dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-base">Employee Onboarding Form and Profile Creation</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2 flex items-center gap-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                    {formData.avatar ? (
                      <div className="relative">
                        <img src={formData.avatar} alt="Profile" className="h-20 w-20 rounded-2xl object-cover" />
                        <button type="button" onClick={() => handleChange("avatar", "")} className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                        <UserCircle2 className="h-10 w-10 text-slate-400" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Profile Photo</p>
                      <label className="inline-flex cursor-pointer items-center rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload photo
                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                      </label>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Employee ID</p>
                    <Input value={formData.employeeId} onChange={(e) => handleChange("employeeId", e.target.value)} />
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</p>
                    <Input value={formData.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="John Doe" />
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Email</p>
                    <Input value={formData.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="john@company.com" type="email" />
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Joining Date</p>
                    <Input type="date" value={formData.joiningDate} onChange={(e) => handleChange("joiningDate", e.target.value)} />
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Role</p>
                    <select value={formData.role} onChange={(e) => handleChange("role", e.target.value)} className="flex h-10 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm dark:border-slate-700">
                      {roles.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Department</p>
                    <select value={formData.department} onChange={(e) => handleChange("department", e.target.value)} className="flex h-10 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm dark:border-slate-700">
                      {departments.map((department) => (
                        <option key={department} value={department}>{department}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Manager Assignment</p>
                    <select value={formData.manager} onChange={(e) => handleChange("manager", e.target.value)} className="flex h-10 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm dark:border-slate-700">
                      {managers.map((manager) => (
                        <option key={manager} value={manager}>{manager}</option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-base">Training Recommendation System</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {trainingRecommendations.map((item) => (
                    <div key={item} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                      <div className="flex items-start gap-3">
                        <BookOpenCheck className="mt-0.5 h-4 w-4 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{item}</p>
                          <p className="text-xs text-slate-500">Recommended based on {formData.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="operations" className="mt-4">
            <div className="grid gap-4 xl:grid-cols-3">
              <Card className="xl:col-span-2 dark:border-slate-700 dark:bg-slate-900">
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="text-base">Document Upload System and OCR Verification</CardTitle>
                  <label className="inline-flex cursor-pointer items-center rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload documents
                    <input type="file" multiple className="hidden" onChange={handleDocumentUpload} />
                  </label>
                </CardHeader>
                <CardContent className="space-y-3">
                  {uploadedDocuments.map((doc, index) => (
                    <motion.div key={doc.id || doc.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800">
                            <FileText className="h-4 w-4 text-slate-500" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{doc.name}</p>
                            <p className="text-xs text-slate-500">{doc.fileName || `${doc.name.toLowerCase().replace(/\s+/g, "-")}.pdf`} • {doc.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{doc.confidence}% OCR confidence</Badge>
                          <Badge variant="outline" className={statusTone(doc.status)}>{doc.status}</Badge>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
                        <ScanSearch className="h-4 w-4 text-blue-500" />
                        Extracted name, identity number, and joining details aligned with employee profile record #{index + 1}.
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-base">Equipment Allocation and Access Setup</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {equipment.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <item.icon className="h-4 w-4 text-slate-500" />
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.label}</p>
                            <p className="text-xs text-slate-500">{item.value}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={statusTone(item.status)}>{item.status}</Badge>
                      </div>
                    </div>
                  ))}

                  {accounts.map((account) => (
                    <div key={account.name} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <account.icon className="h-4 w-4 text-slate-500" />
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{account.name}</p>
                            <p className="text-xs text-slate-500">{account.handle}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={statusTone(account.status)}>{account.status}</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="mt-4">
            <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-base">Onboarding Task Checklist</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {checklist.map((item, index) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => toggleTask(index)}
                      className="flex w-full items-center justify-between rounded-2xl border border-slate-200 p-4 text-left transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${item.done ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-slate-100 text-slate-400 dark:bg-slate-800"}`}>
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.label}</p>
                          <p className="text-xs text-slate-500">Owner: {item.owner}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={statusTone(item.done ? "Completed" : "Pending")}>
                        {item.done ? "Completed" : "Pending"}
                      </Badge>
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-base">AI Onboarding Suggestions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    "Schedule day-one welcome with reporting manager.",
                    "Grant GitHub and Slack access before joining date.",
                    "Prioritize security training in the first 48 hours.",
                    "Share team intro and onboarding buddy assignment.",
                  ].map((suggestion) => (
                    <div key={suggestion} className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                      <ChevronRight className="mt-0.5 h-4 w-4 text-blue-500" />
                      <p className="text-sm text-slate-700 dark:text-slate-300">{suggestion}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-base">Onboarding Completion Snapshot</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Profile readiness", value: formData.name && formData.email ? 100 : 55 },
                    { label: "Document verification", value: Math.round((verifiedDocuments / uploadedDocuments.length) * 100) },
                    { label: "Provisioning readiness", value: Math.round((accounts.filter((item) => item.status === "Active").length / accounts.length) * 100) },
                  ].map((metric) => (
                    <div key={metric.label}>
                      <div className="mb-1 flex justify-between text-xs text-slate-500">
                        <span>{metric.label}</span>
                        <span>{metric.value}%</span>
                      </div>
                      <Progress value={metric.value} />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-base">Employee Profile Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-3 dark:border-slate-700">
                    <span className="text-slate-500">Name</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{formData.name || "Pending"}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-3 dark:border-slate-700">
                    <span className="text-slate-500">Role</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{formData.role}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-3 dark:border-slate-700">
                    <span className="text-slate-500">Department</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{formData.department}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-3 dark:border-slate-700">
                    <span className="text-slate-500">Manager</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{formData.manager}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-base">Operational Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    `OCR verification completed for ${verifiedDocuments} of ${uploadedDocuments.length} documents.`,
                    `${completedTasks} onboarding tasks are complete and ${checklist.length - completedTasks} remain open.`,
                    `${accounts.filter((item) => item.status === "Pending").length} employee accounts still need activation.`,
                  ].map((insight) => (
                    <div key={insight} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                      <div className="flex items-start gap-3">
                        <Sparkles className="mt-0.5 h-4 w-4 text-blue-500" />
                        <p className="text-sm text-slate-700 dark:text-slate-300">{insight}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
