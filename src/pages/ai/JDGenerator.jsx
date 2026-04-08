import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Download, RefreshCw, Sparkles, Briefcase, CheckCircle2, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

function LegacyJDGenerator() {
  const [role, setRole] = useState("");
  const [jd, setJD] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  // Realistic JD generator based on role
  const generateJobDescription = (jobRole) => {
    const roleLower = jobRole.toLowerCase();
    let overview = "";
    let responsibilities = [];
    let skills = [];
    let experience = "";

    if (roleLower.includes("frontend") || roleLower.includes("react") || roleLower.includes("vue")) {
      overview = `We are looking for a talented ${jobRole} to join our dynamic team. You will be responsible for building responsive, high-performance user interfaces and collaborating with designers and backend engineers.`;
      responsibilities = [
        "Develop and maintain scalable web applications using modern frameworks (React/Vue/Angular).",
        "Translate UI/UX designs into pixel-perfect, responsive code.",
        "Optimize components for maximum performance across devices.",
        "Collaborate with backend teams to integrate RESTful APIs.",
        "Write clean, maintainable, and testable code following best practices."
      ];
      skills = [
        "Proficiency in HTML5, CSS3, and JavaScript (ES6+)",
        "Experience with React.js and its ecosystem (Redux, React Router)",
        "Knowledge of state management and component lifecycle",
        "Familiarity with version control (Git) and build tools (Webpack, Vite)",
        "Understanding of responsive design and cross-browser compatibility"
      ];
      experience = "3+ years of frontend development experience, preferably in a product-based company.";
    } 
    else if (roleLower.includes("backend") || roleLower.includes("node") || roleLower.includes("python") || roleLower.includes("java")) {
      overview = `We are seeking an experienced ${jobRole} to design and implement robust backend services. You'll work on scalable architecture, APIs, and database optimization.`;
      responsibilities = [
        "Design and develop high-volume, low-latency APIs.",
        "Implement secure data storage solutions (SQL/NoSQL).",
        "Optimize application performance and scalability.",
        "Collaborate with frontend developers to integrate user-facing elements.",
        "Write unit and integration tests to ensure reliability."
      ];
      skills = [
        "Strong knowledge of Node.js / Python / Java",
        "Experience with Express, Django, or Spring Boot",
        "Database design (PostgreSQL, MongoDB, or similar)",
        "Understanding of microservices architecture",
        "Familiarity with cloud platforms (AWS, GCP, Azure)"
      ];
      experience = "4+ years of backend development experience, with a strong grasp of system design.";
    }
    else if (roleLower.includes("full stack") || roleLower.includes("fullstack")) {
      overview = `We are hiring a versatile ${jobRole} to take ownership of both frontend and backend development. You will build end-to-end features and contribute to architectural decisions.`;
      responsibilities = [
        "Develop and maintain full-stack web applications.",
        "Implement responsive UIs and scalable backend APIs.",
        "Ensure seamless integration between frontend and backend.",
        "Participate in code reviews and contribute to team best practices.",
        "Troubleshoot and debug across the entire stack."
      ];
      skills = [
        "Proficiency in JavaScript/TypeScript (React, Node.js)",
        "Experience with RESTful APIs and database design",
        "Knowledge of version control (Git) and CI/CD pipelines",
        "Understanding of cloud services and deployment",
        "Strong problem-solving and communication skills"
      ];
      experience = "3+ years of full-stack development experience, with a portfolio of projects.";
    }
    else {
      overview = `We are looking for a motivated ${jobRole} to join our growing team. You will contribute to our products and help drive innovation.`;
      responsibilities = [
        "Collaborate with cross-functional teams to define and deliver features.",
        "Write clean, maintainable code following industry standards.",
        "Participate in design reviews and contribute to technical discussions.",
        "Ensure application performance, quality, and responsiveness.",
        "Stay up-to-date with emerging technologies and propose improvements."
      ];
      skills = [
        "Solid understanding of software development principles",
        "Experience with one or more programming languages (JavaScript, Python, Java, etc.)",
        "Familiarity with version control (Git)",
        "Good communication and teamwork skills",
        "Problem-solving mindset and attention to detail"
      ];
      experience = "2+ years of relevant software development experience.";
    }

    return `
${overview}

**Role Overview**
As a ${jobRole}, you will play a key role in shaping our products and driving technical excellence.

**Responsibilities**
${responsibilities.map(r => `• ${r}`).join("\n")}

**Required Skills**
${skills.map(s => `• ${s}`).join("\n")}

**Experience & Qualifications**
${experience}

**Why Join Us?**
- Competitive salary and benefits
- Flexible work hours and remote-friendly culture
- Opportunity to work on cutting-edge technologies
- Collaborative and inclusive team environment
    `.trim();
  };

  const handleGenerate = async () => {
    if (!role.trim()) return;
    setLoading(true);
    // Simulate async generation for realism
    await new Promise(resolve => setTimeout(resolve, 800));
    const generatedJD = generateJobDescription(role);
    setJD(generatedJD);
    setLoading(false);
  };

  const handleClear = () => {
    setRole("");
    setJD("");
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!jd) return;
    await navigator.clipboard.writeText(jd);
    setCopied(true);
    setToastVisible(true);
    setTimeout(() => {
      setCopied(false);
      setToastVisible(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <Briefcase className="h-7 w-7 text-white" />
            <h1 className="text-2xl font-bold text-white">Job Description Generator</h1>
          </div>
          <p className="text-indigo-100 text-sm mt-1">
            Create professional, tailored job descriptions in seconds
          </p>
        </div>

        {/* Main Content */}
        <div className="p-6 md:p-8">
          {/* Input Section */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Job Role
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., Senior Frontend Developer, Backend Engineer, Full Stack Developer"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerate}
                  disabled={!role.trim() || loading}
                  className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition ${
                    !role.trim() || loading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClear}
                  className="px-4 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Clear
                </motion.button>
              </div>
            </div>
          </div>

          {/* Output Section */}
          {jd && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-500" />
                  Generated Job Description
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </motion.button>
              </div>
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-5 max-h-[500px] overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700">
                  {jd}
                </pre>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50"
          >
            <CheckCircle2 className="h-4 w-4 text-green-400" />
            Copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const templates = [
  { role: "Software Engineer", dept: "Engineering", exp: "3-5 years", skills: "JavaScript, TypeScript, React, Node.js" },
  { role: "Product Manager", dept: "Product", exp: "5-7 years", skills: "Product Strategy, Analytics, Roadmapping, Stakeholder Management" },
  { role: "Sales Executive", dept: "Sales", exp: "2-4 years", skills: "Lead Generation, CRM, Negotiation, Pipeline Management" },
  { role: "HR Manager", dept: "HR", exp: "4-6 years", skills: "Talent Management, Policy, Employee Relations, HRIS" },
  { role: "Data Scientist", dept: "Engineering", exp: "3-6 years", skills: "Python, SQL, ML, Statistics, Experimentation" },
];

const roleSkills = {
  frontend: ["React", "TypeScript", "Redux", "REST APIs", "CSS3"],
  backend: ["Node.js", "SQL", "Microservices", "API Design", "AWS"],
  product: ["Roadmapping", "User Research", "Analytics", "A/B Testing", "Stakeholder Management"],
  sales: ["Prospecting", "CRM", "Negotiation", "Closing", "Forecasting"],
  hr: ["Recruitment", "Employee Relations", "HR Policy", "Performance Management", "L&D"],
};

const inclusiveFixes = { rockstar: "high-performing", ninja: "expert", young: "motivated", aggressive: "results-oriented" };
const portals = ["LinkedIn", "Indeed", "Naukri"];
const salaryByRole = { frontend: "₹14 LPA - ₹20 LPA", backend: "₹15 LPA - ₹22 LPA", product: "₹20 LPA - ₹32 LPA", sales: "₹10 LPA - ₹18 LPA", hr: "₹12 LPA - ₹19 LPA" };

function roleKeyOf(role) {
  const lower = role.toLowerCase();
  if (lower.includes("frontend") || lower.includes("react")) return "frontend";
  if (lower.includes("backend") || lower.includes("node")) return "backend";
  if (lower.includes("product")) return "product";
  if (lower.includes("sales")) return "sales";
  if (lower.includes("hr")) return "hr";
  return "frontend";
}

function JDGeneratorModern() {
  const [form, setForm] = useState({
    role: "",
    department: "Engineering",
    experience: "3-5 years",
    employmentType: "Full Time",
    location: "Bangalore",
    salaryRange: "",
    requiredSkills: "",
  });
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [versions, setVersions] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");

  const roleKey = roleKeyOf(form.role || "");
  const suggestedSkills = roleSkills[roleKey] || roleSkills.frontend;
  const salaryPrediction = salaryByRole[roleKey] || "₹12 LPA - ₹18 LPA";
  const usedSkills = useMemo(() => (form.requiredSkills || "").split(",").map((s) => s.trim()).filter(Boolean), [form.requiredSkills]);

  const qualityScore = useMemo(() => {
    const clarity = jd.length > 500 ? 85 : 55;
    const structure = /Responsibilities|Required Skills|Qualifications/i.test(jd) ? 88 : 52;
    const skillCoverage = Math.min(95, 50 + usedSkills.length * 8);
    const inclusiveness = Object.keys(inclusiveFixes).some((w) => jd.toLowerCase().includes(w)) ? 48 : 86;
    return { clarity, structure, skillCoverage, inclusiveness, total: Math.round((clarity + structure + skillCoverage + inclusiveness) / 4) };
  }, [jd, usedSkills.length]);

  const biasWarnings = useMemo(
    () =>
      Object.entries(inclusiveFixes)
        .filter(([biased]) => jd.toLowerCase().includes(biased))
        .map(([biased, replacement]) => `"${biased}" -> "${replacement}"`),
    [jd]
  );

  const missingSkills = useMemo(() => suggestedSkills.filter((s) => !usedSkills.includes(s)), [suggestedSkills, usedSkills]);
  const screeningRules = useMemo(
    () => ({ minExperience: form.experience, mustHave: usedSkills.length ? usedSkills : suggestedSkills.slice(0, 3), niceToHave: missingSkills.slice(0, 2) }),
    [form.experience, missingSkills, suggestedSkills, usedSkills]
  );

  const interviewQuestions = useMemo(
    () =>
      (usedSkills.length ? usedSkills : suggestedSkills.slice(0, 4)).map((skill) => ({
        skill,
        questions: [`How have you applied ${skill} in production?`, `What advanced concepts in ${skill} matter for this role?`],
      })),
    [suggestedSkills, usedSkills]
  );

  const generateJD = async () => {
    if (!form.role.trim()) return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const finalSkills = usedSkills.length ? usedSkills : suggestedSkills;
    const text = `
${form.role} - ${form.department}

Location: ${form.location}
Employment Type: ${form.employmentType}
Experience: ${form.experience}
Salary: ${form.salaryRange || salaryPrediction}

Role Overview
We are hiring a ${form.experience} ${form.role} to join our ${form.department} team and drive product and business outcomes.

Responsibilities
- Own delivery of high-impact initiatives aligned to department goals
- Partner with cross-functional teams to execute quality releases
- Improve process efficiency, quality, and collaboration
- Mentor peers and elevate engineering and delivery standards

Required Skills
${finalSkills.map((s) => `- ${s}`).join("\n")}

Qualifications
- Proven experience in a similar role
- Strong communication and stakeholder management
- Ability to thrive in fast-paced environments
`.trim();
    setJd(text);
    setVersions((prev) => [{ id: `v${prev.length + 1}`, label: `${form.role || "JD"} v${prev.length + 1}`, text }, ...prev]);
    setLoading(false);
  };

  const applyTemplate = (template) => {
    setForm((prev) => ({ ...prev, role: template.role, department: template.dept, experience: template.exp, requiredSkills: template.skills }));
  };

  const exportJD = async (target) => {
    if (!jd) return;
    await navigator.clipboard.writeText(`[${target} Export]\n\n${jd}`);
  };

  const addComment = () => {
    if (!commentInput.trim()) return;
    setComments((prev) => [{ text: commentInput.trim(), author: "Hiring Manager", time: "Just now" }, ...prev]);
    setCommentInput("");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Job Description Intelligence</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Smart JD generation, optimization, quality analysis, collaboration, and export workflows.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setJd("")}><RefreshCw className="mr-2 h-4 w-4" />Reset</Button>
            <Button onClick={generateJD} disabled={!form.role || loading}><Sparkles className="mr-2 h-4 w-4" />{loading ? "Generating..." : "Generate JD"}</Button>
          </div>
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
          <Card className="dark:border-slate-700 dark:bg-slate-900">
            <CardHeader><CardTitle className="text-base">Smart JD Generator</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2"><Label>Job Role</Label><Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Frontend Developer" /></div>
              <div><Label>Department</Label><Select value={form.department} onValueChange={(v) => setForm({ ...form, department: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Engineering", "Product", "Sales", "HR", "Finance"].map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Experience</Label><Select value={form.experience} onValueChange={(v) => setForm({ ...form, experience: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["0-2 years", "3-5 years", "6-8 years", "8+ years"].map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Employment Type</Label><Select value={form.employmentType} onValueChange={(v) => setForm({ ...form, employmentType: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Full Time", "Contract", "Internship", "Remote"].map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
              <div><Label>Salary Range</Label><Input value={form.salaryRange} onChange={(e) => setForm({ ...form, salaryRange: e.target.value })} placeholder={salaryPrediction} /></div>
              <div className="sm:col-span-2"><Label>Required Skills (comma separated)</Label><Textarea rows={3} value={form.requiredSkills} onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })} /></div>
            </CardContent>
          </Card>
          <Card className="dark:border-slate-700 dark:bg-slate-900">
            <CardHeader><CardTitle className="text-base">JD Template Library</CardTitle></CardHeader>
            <CardContent className="space-y-2">{templates.map((t) => <button key={t.role} onClick={() => applyTemplate(t)} className="w-full rounded-lg border border-slate-200 p-3 text-left text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"><p className="font-semibold">{t.role}</p><p className="text-xs text-slate-500">{t.dept} • {t.exp}</p></button>)}</CardContent>
          </Card>
        </div>

        <Tabs defaultValue="intelligence">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
            <TabsTrigger value="output">Generated JD</TabsTrigger>
            <TabsTrigger value="version">Versions</TabsTrigger>
            <TabsTrigger value="collab">Collaboration</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          </TabsList>

          <TabsContent value="intelligence" className="mt-4 space-y-4">
            <div className="grid gap-4 xl:grid-cols-3">
              <Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">Skill Recommendation Engine</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-2">{suggestedSkills.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}</CardContent></Card>
              <Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">Salary Range Prediction</CardTitle></CardHeader><CardContent className="text-sm"><p>Role: <b>{form.role || "N/A"}</b></p><p>Location: <b>{form.location}</b></p><p className="mt-2 text-lg font-semibold text-emerald-600">{form.salaryRange || salaryPrediction}</p></CardContent></Card>
              <Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">Competitor Job Analysis</CardTitle></CardHeader><CardContent className="space-y-1 text-sm"><p><b>Google</b>, <b>Amazon</b>, <b>Flipkart</b> hiring similar talent.</p><p className="text-slate-500">Common skills: {suggestedSkills.slice(0, 4).join(", ")}</p></CardContent></Card>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">JD Quality Score</CardTitle></CardHeader><CardContent className="space-y-3"><div className="flex items-center justify-between rounded-lg border p-3 dark:border-slate-700"><span>Overall Score</span><span className="text-xl font-bold">{qualityScore.total}/100</span></div>{[["Clarity", qualityScore.clarity], ["Skill Coverage", qualityScore.skillCoverage], ["Structure", qualityScore.structure], ["Inclusiveness", qualityScore.inclusiveness]].map(([l, v]) => <div key={String(l)}><div className="mb-1 flex justify-between text-xs"><span>{l}</span><span>{v}</span></div><Progress value={Number(v)} /></div>)}</CardContent></Card>
              <Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">Bias Detection and SEO Optimization</CardTitle></CardHeader><CardContent className="space-y-3"><div>{biasWarnings.length ? biasWarnings.map((x) => <p key={x} className="text-sm text-red-600">{x}</p>) : <p className="text-sm text-emerald-600">No critical biased language detected.</p>}</div><div className="flex flex-wrap gap-2">{[...new Set([...suggestedSkills, form.role].filter(Boolean))].map((k) => <Badge key={k} variant="outline">{k}</Badge>)}</div><p className="text-xs text-slate-500">Optimized for: {portals.join(", ")}</p></CardContent></Card>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">Interview Question Generator</CardTitle></CardHeader><CardContent>{interviewQuestions.map((g) => <div key={g.skill} className="mb-3"><p className="font-medium">{g.skill}</p>{g.questions.map((q) => <p key={q} className="text-sm text-slate-600 dark:text-slate-300">- {q}</p>)}</div>)}</CardContent></Card>
              <Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">Resume Screening Rule Generator</CardTitle></CardHeader><CardContent className="space-y-2 text-sm"><p>Minimum Experience: <b>{screeningRules.minExperience}</b></p><p>Must Have: <b>{screeningRules.mustHave.join(", ")}</b></p><p>Nice To Have: <b>{screeningRules.niceToHave.join(", ") || "None"}</b></p></CardContent></Card>
            </div>
          </TabsContent>

          <TabsContent value="output" className="mt-4">
            <Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader className="flex-row items-center justify-between"><CardTitle className="text-base">Generated Job Description</CardTitle><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(jd || "")}><Copy className="mr-1 h-4 w-4" />Copy</Button><Button size="sm" variant="outline" onClick={() => exportJD("Career Page")}><Download className="mr-1 h-4 w-4" />Export</Button></div></CardHeader><CardContent>{jd ? <pre className="whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm dark:bg-slate-800">{jd}</pre> : <p className="text-sm text-slate-500">Generate a JD to preview.</p>}</CardContent></Card>
          </TabsContent>
          <TabsContent value="version" className="mt-4"><Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">JD Version Control</CardTitle></CardHeader><CardContent className="space-y-2">{versions.length ? versions.map((v) => <button key={v.id} onClick={() => setJd(v.text)} className="block w-full rounded-lg border border-slate-200 p-3 text-left text-sm dark:border-slate-700">{v.label}</button>) : <p className="text-sm text-slate-500">No versions yet.</p>}</CardContent></Card></TabsContent>
          <TabsContent value="collab" className="mt-4"><Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">JD Collaboration Mode</CardTitle></CardHeader><CardContent className="space-y-3"><div className="flex gap-2"><Input value={commentInput} onChange={(e) => setCommentInput(e.target.value)} placeholder="Add collaboration comment..." /><Button onClick={addComment}>Add</Button></div>{comments.length ? comments.map((c, i) => <div key={`${c.text}-${i}`} className="rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-700"><p>{c.text}</p><p className="text-xs text-slate-500">{c.author} • {c.time}</p></div>) : <p className="text-sm text-slate-500">No comments yet.</p>}<div className="flex flex-wrap gap-2">{portals.map((p) => <Button key={p} size="sm" variant="outline" onClick={() => exportJD(p)}>{p} Export</Button>)}</div></CardContent></Card></TabsContent>
          <TabsContent value="pipeline" className="mt-4"><Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">Hiring Pipeline Generator</CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{["Application Review", "Technical Test", "Technical Interview", "HR Interview", "Offer"].map((s, i) => <div key={s} className="rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-700"><p className="text-xs text-slate-500">Stage {i + 1}</p><p className="font-medium">{s}</p></div>)}</CardContent></Card><Card className="mt-4 dark:border-slate-700 dark:bg-slate-900"><CardContent className="flex items-center gap-2 p-4 text-sm"><Target className="h-4 w-4 text-blue-600" />Pipeline generated for <b>{form.role || "selected role"}</b> with role-tailored stages.</CardContent></Card></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default JDGeneratorModern;
