import { Component, type ErrorInfo, type ReactNode, useEffect, useRef, useState } from "react";
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

type DepartmentConfig = {
  overviewFocus: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
};

interface Requirement {
  id: number;
  job_title: string;
  department: string;
  positions: number;
  budget: string | null;
  status: "high" | "medium" | "low";
  created_at?: string;
}

interface PrefilledJob {
  title: string;
  department: string;
  description: string;
}

type ForecastPoint = {
  month: string;
  current: number | null;
  projected: number;
};

type BudgetPoint = {
  dept: string;
  salary: number;
  hiring: number;
};

type OrgNode = {
  name: string;
  children?: OrgNode[];
};

const MOCK_REQUIREMENTS: Requirement[] = [
  {
    id: 1,
    job_title: "Senior Frontend Engineer",
    department: "Engineering",
    positions: 3,
    budget: "$360K",
    status: "high",
    created_at: "2026-04-01T10:00:00.000Z",
  },
  {
    id: 2,
    job_title: "Product Designer",
    department: "Design",
    positions: 2,
    budget: "$180K",
    status: "medium",
    created_at: "2026-04-02T10:00:00.000Z",
  },
  {
    id: 3,
    job_title: "Growth Marketing Manager",
    department: "Marketing",
    positions: 1,
    budget: "$120K",
    status: "medium",
    created_at: "2026-04-03T10:00:00.000Z",
  },
  {
    id: 4,
    job_title: "People Operations Specialist",
    department: "HR",
    positions: 1,
    budget: "$95K",
    status: "low",
    created_at: "2026-04-04T10:00:00.000Z",
  },
];

const MOCK_STATS = {
  openPositions: 7,
  totalBudget: "$755K",
  headcountTarget: 148,
  avgTimeToFill: 32,
};

const MOCK_FORECAST: ForecastPoint[] = [
  { month: "Jan", current: 118, projected: 120 },
  { month: "Feb", current: 121, projected: 124 },
  { month: "Mar", current: 125, projected: 128 },
  { month: "Apr", current: 129, projected: 132 },
  { month: "May", current: null, projected: 137 },
  { month: "Jun", current: null, projected: 142 },
];

const MOCK_BUDGET: BudgetPoint[] = [
  { dept: "Eng", salary: 420, hiring: 95 },
  { dept: "Design", salary: 155, hiring: 35 },
  { dept: "Mktg", salary: 130, hiring: 24 },
  { dept: "HR", salary: 90, hiring: 12 },
  { dept: "Sales", salary: 210, hiring: 46 },
];

const MOCK_ORG: OrgNode = {
  name: "CEO",
  children: [
    {
      name: "CTO",
      children: [{ name: "Engineering" }, { name: "Product" }],
    },
    {
      name: "COO",
      children: [{ name: "Operations" }, { name: "HR" }],
    },
    {
      name: "CRO",
      children: [{ name: "Sales" }, { name: "Marketing" }],
    },
  ],
};

const DEPARTMENTS = [
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "HR",
  "Product",
  "Operations",
];

const priorityColors: Record<string, string> = {
  high: "border-red-200 bg-red-50 text-red-700",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  low: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const JD_DEPARTMENT_TEMPLATES: Record<string, DepartmentConfig> = {
  Engineering: {
    overviewFocus: "build scalable, reliable product experiences and collaborate closely with design, product, and QA partners",
    responsibilities: [
      "Design, build, test, and maintain production-ready features with strong code quality standards.",
      "Collaborate with product and design stakeholders to translate requirements into clear technical execution plans.",
      "Review pull requests, improve development workflows, and contribute to engineering best practices.",
      "Monitor delivery risks, troubleshoot issues, and support continuous improvement across the development lifecycle.",
    ],
    requirements: [
      "Strong hands-on experience building and shipping modern software products.",
      "Ability to write clean, maintainable, and well-documented code.",
      "Comfort working with collaborative planning, debugging, and code review workflows.",
      "Strong communication skills and the ability to break down complex technical work clearly.",
    ],
    benefits: [
      "Work on high-impact product initiatives with modern tooling.",
      "Collaborative engineering culture with room for mentorship and growth.",
    ],
  },
  Design: {
    overviewFocus: "create intuitive, polished, user-centered experiences across product touchpoints",
    responsibilities: [
      "Own end-to-end design deliverables from discovery and wireframes through polished handoff assets.",
      "Partner with product, engineering, and research stakeholders to shape thoughtful user experiences.",
      "Improve consistency across components, visual systems, and interaction patterns.",
      "Use feedback, data, and testing insights to refine workflows and increase usability.",
    ],
    requirements: [
      "Strong portfolio demonstrating product thinking and interface craft.",
      "Experience with design systems, user flows, and collaborative iteration.",
      "Ability to present rationale clearly and incorporate feedback effectively.",
      "Strong attention to detail across layout, hierarchy, and interaction design.",
    ],
    benefits: [
      "Opportunity to shape the design language of visible product experiences.",
      "Cross-functional partnership with product and engineering leaders.",
    ],
  },
  Marketing: {
    overviewFocus: "drive pipeline, brand visibility, and campaign performance through data-informed execution",
    responsibilities: [
      "Plan and execute campaigns aligned to growth, awareness, and engagement goals.",
      "Work with content, design, and sales teams to develop clear messaging and launch plans.",
      "Track performance metrics, identify opportunities, and improve channel efficiency over time.",
      "Support reporting, experimentation, and go-to-market coordination across initiatives.",
    ],
    requirements: [
      "Experience managing multi-channel marketing initiatives with clear business goals.",
      "Strong written communication and stakeholder coordination skills.",
      "Ability to translate performance data into actionable recommendations.",
      "Comfort balancing planning, execution, and optimization in fast-moving teams.",
    ],
    benefits: [
      "Ownership of growth-focused initiatives with measurable impact.",
      "Exposure to brand, campaign, and performance strategy work.",
    ],
  },
  Sales: {
    overviewFocus: "build strong customer relationships and accelerate revenue growth through consultative execution",
    responsibilities: [
      "Manage the sales pipeline from outreach and qualification through closing and handoff.",
      "Work with marketing and customer teams to improve lead quality and conversion performance.",
      "Understand client needs and communicate value with clarity and credibility.",
      "Maintain accurate reporting, forecasting, and follow-through across active opportunities.",
    ],
    requirements: [
      "Strong consultative selling and relationship management skills.",
      "Ability to manage pipeline activity and communicate performance clearly.",
      "Confidence working with targets, stakeholder follow-ups, and structured sales processes.",
      "Strong negotiation, presentation, and objection-handling ability.",
    ],
    benefits: [
      "Clear visibility into growth outcomes and commercial impact.",
      "High-ownership environment with support from cross-functional teams.",
    ],
  },
  HR: {
    overviewFocus: "strengthen employee experience, people operations, and organizational effectiveness",
    responsibilities: [
      "Support hiring, onboarding, employee lifecycle coordination, and core HR operations.",
      "Partner with managers and employees to maintain consistent, people-first processes.",
      "Improve documentation, compliance readiness, and internal communication workflows.",
      "Track people metrics and identify opportunities to improve experience and execution quality.",
    ],
    requirements: [
      "Strong understanding of employee lifecycle workflows and operational coordination.",
      "Ability to manage confidential information with sound judgment and professionalism.",
      "Strong communication, organization, and cross-functional partnership skills.",
      "Comfort balancing policy consistency with a positive employee experience.",
    ],
    benefits: [
      "Direct impact on hiring quality, employee experience, and team health.",
      "Broad exposure across people operations, culture, and talent programs.",
    ],
  },
  Product: {
    overviewFocus: "turn business goals and user needs into clear priorities, plans, and shipped outcomes",
    responsibilities: [
      "Define priorities, clarify scope, and align stakeholders around product objectives.",
      "Translate customer and business needs into actionable requirements and delivery plans.",
      "Work closely with engineering and design partners throughout the product lifecycle.",
      "Measure outcomes, surface tradeoffs, and improve roadmap decisions with data and feedback.",
    ],
    requirements: [
      "Experience managing product discovery, prioritization, and cross-functional delivery.",
      "Strong communication and stakeholder alignment skills.",
      "Ability to structure ambiguous problems and make practical tradeoff decisions.",
      "Comfort using data, user feedback, and strategic context to guide execution.",
    ],
    benefits: [
      "Own meaningful roadmap decisions with visible business impact.",
      "High-collaboration role across strategy, design, and engineering.",
    ],
  },
  Operations: {
    overviewFocus: "improve execution quality, process efficiency, and cross-functional coordination at scale",
    responsibilities: [
      "Maintain and improve internal workflows, documentation, and operational consistency.",
      "Coordinate with multiple teams to remove blockers and keep programs moving smoothly.",
      "Track metrics, identify process gaps, and recommend practical improvements.",
      "Support reporting, planning, and day-to-day execution across business operations.",
    ],
    requirements: [
      "Strong operational thinking with attention to detail and follow-through.",
      "Ability to organize complex work across teams and stakeholders.",
      "Comfort working with reporting, process improvement, and structured execution.",
      "Strong written and verbal communication skills.",
    ],
    benefits: [
      "Broad business exposure and visible impact on team efficiency.",
      "Opportunity to shape operational systems as the organization grows.",
    ],
  },
};

const DEFAULT_DEPARTMENT_TEMPLATE: DepartmentConfig = {
  overviewFocus: "deliver high-quality work, partner closely with stakeholders, and contribute to continuous team improvement",
  responsibilities: [
    "Own key deliverables and maintain strong execution quality across day-to-day responsibilities.",
    "Collaborate with cross-functional teams to align priorities, timelines, and outcomes.",
    "Identify process improvements and communicate risks or blockers early.",
    "Contribute positively to team goals, planning, and knowledge sharing.",
  ],
  requirements: [
    "Relevant experience in a similar role or transferable functional expertise.",
    "Strong communication, problem-solving, and organizational skills.",
    "Ability to manage priorities effectively in a collaborative environment.",
    "Comfort working with modern tools, reporting, and structured workflows.",
  ],
  benefits: [
    "Growth-oriented environment with meaningful ownership opportunities.",
    "Supportive collaboration across teams and functions.",
  ],
};

function normalizeDepartment(department: string) {
  return department.trim().toLowerCase();
}

function toTitleCase(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function getDepartmentConfig(department: string) {
  const normalized = normalizeDepartment(department);
  const match = Object.entries(JD_DEPARTMENT_TEMPLATES).find(([key]) => normalizeDepartment(key) === normalized);
  return match ? { label: match[0], config: match[1] } : { label: toTitleCase(department) || "General", config: DEFAULT_DEPARTMENT_TEMPLATE };
}

function parseExtraRequirements(extra: string) {
  return extra
    .split(/\n|,|;/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);
}

function buildJobDescription(title: string, department: string, extra = "") {
  const cleanTitle = title.trim();
  const cleanDepartment = department.trim();

  if (!cleanTitle && !cleanDepartment) {
    return {
      description: "",
      guidance: "Enter a job title and choose a department to generate a complete job description.",
    };
  }

  if (!cleanTitle) {
    return {
      description: "",
      guidance: "Add a job title to generate a structured job description.",
    };
  }

  if (!cleanDepartment) {
    return {
      description: "",
      guidance: "Select a department to generate responsibilities and requirements tailored to the role.",
    };
  }

  const { label: departmentLabel, config } = getDepartmentConfig(cleanDepartment);
  const extraRequirements = parseExtraRequirements(extra);
  const benefits = [
    ...config.benefits,
    "Competitive compensation, learning support, and a collaborative team environment.",
  ];

  const requirements = [...config.requirements];
  if (extraRequirements.length > 0) {
    requirements.push(...extraRequirements.map((item) => `Preference for candidates with ${item.replace(/\.$/, "")}.`));
  }

  const roleTitle = toTitleCase(cleanTitle) || "Team Member";
  const description = [
    "Job Overview",
    `${roleTitle} will join the ${departmentLabel} team to ${config.overviewFocus}. This role is expected to work cross-functionally, communicate clearly, and maintain a high standard of execution.`,
    "",
    "Responsibilities",
    ...config.responsibilities.map((item) => `- ${item}`),
    "",
    "Requirements",
    ...requirements.map((item) => `- ${item}`),
    "",
    "Benefits",
    ...benefits.map((item) => `- ${item}`),
  ].join("\n");

  return {
    description,
    guidance: "",
  };
}

async function generateJDWithClaude(title: string, department: string, extra = "") {
  await new Promise((resolve) => setTimeout(resolve, 250));
  const { description } = buildJobDescription(title, department, extra);
  return description || "Job Overview\nThis role supports key team priorities and cross-functional delivery.\n\nResponsibilities\n- Contribute to team deliverables.\n- Communicate progress clearly.\n- Maintain quality and consistency.\n\nRequirements\n- Relevant experience for the role.\n- Strong collaboration and communication skills.\n\nBenefits\n- Growth-oriented team environment.\n- Competitive compensation and learning support.";
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function HiringPlanningPage() {
  return (
    <PageErrorBoundary>
      <HiringPlanningPageContent />
    </PageErrorBoundary>
  );
}

function HiringPlanningPageContent() {
  const [requirements, setRequirements] = useState<Requirement[]>(MOCK_REQUIREMENTS ?? []);
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

  const safeRequirements = requirements ?? [];
  const safeForecast = MOCK_FORECAST ?? [];
  const safeBudget = MOCK_BUDGET ?? [];
  const safeDepartments = DEPARTMENTS ?? [];
  const safeOrg = MOCK_ORG ?? { name: "Organization", children: [] };
  const safeStats = {
    openPositions: stats?.openPositions ?? 0,
    totalBudget: stats?.totalBudget ?? "$0",
    headcountTarget: stats?.headcountTarget ?? 0,
    avgTimeToFill: stats?.avgTimeToFill ?? 0,
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
          <JDGeneratorDialog onUseJD={handleUseJD} departments={safeDepartments} />
          <JobCreateDialog
            open={jobCreateOpen}
            onOpenChange={(v) => { setJobCreateOpen(v); if (!v) setPrefilled(null); }}
            prefilled={prefilled}
            departments={safeDepartments}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 xl:grid-cols-4">
        {[ 
          { label: "Open Positions",   value: safeStats.openPositions,       icon: Briefcase,  sub: "from requirements"   },
          { label: "Total Budget",     value: safeStats.totalBudget,         icon: DollarSign, sub: "across departments"  },
          { label: "Headcount Target", value: safeStats.headcountTarget,     icon: Users,      sub: "projected workforce" },
          { label: "Avg Time to Fill", value: `${safeStats.avgTimeToFill}d`, icon: TrendingUp, sub: "days per position"   },
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
              <LineChart data={safeForecast}>
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
              <BarChart data={safeBudget}>
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
              {safeRequirements.map((r) => (
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
                  <Badge variant="outline" className={`text-xs shrink-0 capitalize ${priorityColors[r?.status] ?? "border-border bg-muted/30 text-muted-foreground"}`}>
                    {r?.status ?? "unknown"}
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
            <OrgNodeComponent node={safeOrg} />
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
        {node?.name ?? "Unknown"}
      </div>
      {(node?.children?.length ?? 0) > 0 && (
        <>
          <div className="w-px h-4 bg-border" />
          <div className="flex gap-6">
            {(node?.children ?? []).map((c: any) => (
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
function JDGeneratorDialog({
  onUseJD,
  departments,
}: {
  onUseJD: (data: PrefilledJob) => void;
  departments: string[];
}) {
  const [open,    setOpen]    = useState(false);
  const [title,   setTitle]   = useState("");
  const [dept,    setDept]    = useState("");
  const [extra,   setExtra]   = useState("");
  const [output,  setOutput]  = useState("");
  const [guidance, setGuidance] = useState("Enter a job title and choose a department to generate a complete job description.");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [copied,  setCopied]  = useState(false);
  const safeDepartments = departments ?? [];
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    const { description, guidance: nextGuidance } = buildJobDescription(title, dept, extra);

    if (!title.trim() || !dept.trim()) {
      setLoading(false);
      setError("");
      setOutput("");
      setGuidance(nextGuidance);
      return () => {
        if (debounce.current) clearTimeout(debounce.current);
      };
    }

    const nextRequestId = requestIdRef.current + 1;
    requestIdRef.current = nextRequestId;
    setLoading(true);
    setError("");
    setGuidance("");

    debounce.current = setTimeout(async () => {
      try {
        const generated = await generateJDWithClaude(title, dept, extra);
        if (requestIdRef.current !== nextRequestId) return;
        setOutput(generated || description);
      } catch {
        if (requestIdRef.current !== nextRequestId) return;
        setError("We couldn't generate the job description right now. A fallback template is shown below.");
        setOutput(description);
      } finally {
        if (requestIdRef.current === nextRequestId) {
          setLoading(false);
        }
      }
    }, 650);

    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [title, dept, extra]);

  const reset = () => {
    setTitle("");
    setDept("");
    setExtra("");
    setOutput("");
    setGuidance("Enter a job title and choose a department to generate a complete job description.");
    setError("");
    setCopied(false);
    setLoading(false);
  };

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
                  {safeDepartments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
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
                  <p className="text-center text-sm">{guidance}</p>
                </div>
              )}
              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-7 h-7 animate-spin text-primary" />
                  <p className="text-sm font-medium text-primary">Building a structured job description…</p>
                </div>
              )}
              {!loading && output && (
                <div className="max-h-80 overflow-y-auto p-4 text-sm leading-relaxed whitespace-pre-wrap">
                  {output}
                </div>
              )}
              {!loading && error && output && (
                <div className="absolute left-3 right-3 top-3 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" /> {error}
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
  open, onOpenChange, prefilled, departments,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  prefilled: PrefilledJob | null;
  departments: string[];
}) {
  const [form,    setForm]    = useState<JobForm>(emptyJob);
  const [errors,  setErrors]  = useState<Partial<JobForm>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const safeDepartments = departments ?? [];

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
                  {safeDepartments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
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

type PageErrorBoundaryProps = {
  children: ReactNode;
};

type PageErrorBoundaryState = {
  hasError: boolean;
};

class PageErrorBoundary extends Component<PageErrorBoundaryProps, PageErrorBoundaryState> {
  state: PageErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    // Keep the page stable even if a child render path fails.
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Hiring & Workforce Planning</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">Strategic workforce planning with real-time data</p>
          </div>
          <Card>
            <CardContent className="flex min-h-[240px] flex-col items-center justify-center gap-3 p-8 text-center">
              <AlertCircle className="h-10 w-10 text-destructive" />
              <p className="text-base font-medium">This section hit a rendering issue.</p>
              <p className="max-w-md text-sm text-muted-foreground">
                The page stayed available, but some hiring planning content could not be displayed. Refreshing the page should restore the local mock data view.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

