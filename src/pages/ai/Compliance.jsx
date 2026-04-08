import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  BadgeCheck,
  CalendarClock,
  CircleAlert,
  Clock3,
  FileCheck2,
  FileSearch,
  Landmark,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const complianceItems = [
  {
    id: 1,
    title: "PF Compliance",
    description: "Provident fund deductions and monthly remittance filing.",
    category: "Statutory",
    dueDate: "2026-04-15",
    lastUpdated: "2026-04-08",
    progress: 100,
    status: "Compliant",
    actions: ["View compliance certificate", "Download challan", "Review employee mapping"],
  },
  {
    id: 2,
    title: "ESI Compliance",
    description: "Employee State Insurance contribution submission and audit support.",
    category: "Statutory",
    dueDate: "2026-04-21",
    lastUpdated: "2026-04-06",
    progress: 84,
    status: "Pending",
    actions: ["Submit filing", "Validate employee declarations", "Upload contribution summary"],
  },
  {
    id: 3,
    title: "Professional Tax",
    description: "Monthly professional tax filing across registered states.",
    category: "Taxation",
    dueDate: "2026-04-12",
    lastUpdated: "2026-03-29",
    progress: 62,
    status: "Pending",
    actions: ["Upload tax proof", "Complete state-wise reconciliation", "Submit PT filing"],
  },
  {
    id: 4,
    title: "TDS Filing",
    description: "Quarterly TDS filing with deduction validation and return upload.",
    category: "Taxation",
    dueDate: "2026-04-09",
    lastUpdated: "2026-03-18",
    progress: 38,
    status: "Overdue",
    actions: ["Submit filing", "Fix deduction mismatches", "Escalate to finance controller"],
  },
  {
    id: 5,
    title: "Labour Law Audit",
    description: "Annual labour law audit and location-level compliance evidence review.",
    category: "Audit",
    dueDate: "2026-04-27",
    lastUpdated: "2026-04-05",
    progress: 55,
    status: "Pending",
    actions: ["Start audit", "Upload registers", "Assign auditor"],
  },
  {
    id: 6,
    title: "Gratuity Filing",
    description: "Annual gratuity liability statement and actuarial support documents.",
    category: "Benefits",
    dueDate: "2026-04-05",
    lastUpdated: "2026-03-12",
    progress: 24,
    status: "Overdue",
    actions: ["Upload documents", "Review actuarial sheet", "Notify benefits partner"],
  },
];

const filters = ["All", "Compliant", "Pending", "Overdue"];

function badgeTone(status) {
  if (status === "Compliant") return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "Pending") return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300";
  return "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300";
}

function progressColor(status) {
  if (status === "Compliant") return "bg-emerald-500";
  if (status === "Pending") return "bg-amber-500";
  return "bg-red-500";
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function daysUntil(date) {
  return Math.ceil((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
}

function ComplianceProgress({ value, status }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.6 }}
        className={`h-full rounded-full ${progressColor(status)}`}
      />
    </div>
  );
}

function ComplianceDashboard() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(complianceItems[0].id);

  const selectedItem = complianceItems.find((item) => item.id === selectedId) || complianceItems[0];
  const filteredItems = complianceItems.filter((item) => activeFilter === "All" || item.status === activeFilter);
  const counts = useMemo(
    () => ({
      compliant: complianceItems.filter((item) => item.status === "Compliant").length,
      pending: complianceItems.filter((item) => item.status === "Pending").length,
      overdue: complianceItems.filter((item) => item.status === "Overdue").length,
    }),
    [],
  );
  const overallHealth = Math.round(complianceItems.reduce((sum, item) => sum + item.progress, 0) / complianceItems.length);
  const upcoming = complianceItems.filter((item) => daysUntil(item.dueDate) >= 0 && daysUntil(item.dueDate) <= 5);
  const overdueItems = complianceItems.filter((item) => item.status === "Overdue");
  const delayedCategory = overdueItems.sort((a, b) => a.progress - b.progress)[0]?.category || "Audit";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="relative overflow-hidden px-6 py-8 sm:px-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_35%),radial-gradient(circle_at_right,_rgba(16,185,129,0.14),_transparent_32%)]" />
            <div className="relative flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <Badge variant="outline" className="mb-3 border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
                  Compliance Intelligence System
                </Badge>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Compliance Tracking Dashboard
                </h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Monitor statutory obligations, surface filing risk, and guide payroll and HR teams with actionable compliance intelligence.
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 text-center shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
                <div className="relative mx-auto h-24 w-24">
                  <svg viewBox="0 0 120 120" className="h-24 w-24 -rotate-90">
                    <circle cx="60" cy="60" r="46" stroke="rgb(226 232 240)" strokeWidth="10" fill="none" />
                    <motion.circle
                      cx="60"
                      cy="60"
                      r="46"
                      stroke={overallHealth >= 85 ? "rgb(16 185 129)" : overallHealth >= 60 ? "rgb(245 158 11)" : "rgb(239 68 68)"}
                      strokeWidth="10"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: overallHealth / 100 }}
                      transition={{ duration: 0.8 }}
                      style={{ pathLength: overallHealth / 100 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-slate-900 dark:text-slate-100">{overallHealth}%</span>
                  </div>
                </div>
                <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                  Compliance Health Index
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Compliance Items", value: complianceItems.length, icon: FileSearch },
            { label: "Compliant Items", value: counts.compliant, icon: ShieldCheck },
            { label: "Pending Items", value: counts.pending, icon: Clock3 },
            { label: "Overdue Items", value: counts.overdue, icon: ShieldAlert },
          ].map((item) => (
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

        <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <Card className="dark:border-slate-700 dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-base">Compliance Summary and Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition ${
                      activeFilter === filter
                        ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="grid gap-3">
                {filteredItems.map((item) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      selectedId === item.id
                        ? "border-slate-900 bg-slate-50 dark:border-slate-100 dark:bg-slate-800/60"
                        : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.description}</p>
                      </div>
                      <Badge variant="outline" className={badgeTone(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                    <div className="mt-3">
                      <div className="mb-1 flex justify-between text-xs text-slate-500">
                        <span>{item.category}</span>
                        <span>{item.progress}%</span>
                      </div>
                      <ComplianceProgress value={item.progress} status={item.status} />
                    </div>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="dark:border-slate-700 dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-base">Expanded Details and Compliance Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{selectedItem.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{selectedItem.description}</p>
                  </div>
                  <Badge variant="outline" className={badgeTone(selectedItem.status)}>
                    {selectedItem.status}
                  </Badge>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    { label: "Category", value: selectedItem.category },
                    { label: "Due Date", value: formatDate(selectedItem.dueDate) },
                    { label: "Last Updated", value: formatDate(selectedItem.lastUpdated) },
                    { label: "Completion", value: `${selectedItem.progress}%` },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                      <p className="text-xs text-slate-500">{item.label}</p>
                      <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Required Actions</p>
                  {selectedItem.actions.map((action) => (
                    <div
                      key={action}
                      className="flex items-start gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300"
                    >
                      <Sparkles className="mt-0.5 h-4 w-4 text-blue-500" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm">
                    <FileCheck2 className="mr-2 h-4 w-4" />
                    View compliance certificate
                  </Button>
                  <Button size="sm" variant="outline">
                    <Landmark className="mr-2 h-4 w-4" />
                    Submit filing
                  </Button>
                  <Button size="sm" variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload documents
                  </Button>
                  <Button size="sm" variant="outline">
                    <BadgeCheck className="mr-2 h-4 w-4" />
                    Start audit
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    <CircleAlert className="h-4 w-4 text-amber-500" />
                    Upcoming Deadlines
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {upcoming.length ? `${upcoming.length} items due in the next 5 days` : "No critical upcoming deadlines"}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    Most Delayed Category
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{delayedCategory}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    <CalendarClock className="h-4 w-4 text-blue-500" />
                    Completion Rate
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {overallHealth}% average progress across all compliance obligations
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {upcoming.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300"
                  >
                    {item.title} is due in {daysUntil(item.dueDate)} day(s).
                  </div>
                ))}
                {overdueItems.map((item) => (
                  <div
                    key={`overdue-${item.id}`}
                    className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
                  >
                    {item.title} is overdue and requires immediate action.
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ComplianceDashboard;
