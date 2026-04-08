import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpenCheck,
  Brain,
  CheckCircle2,
  Code2,
  GraduationCap,
  Plus,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const suggestions = ["React", "TypeScript", "Node.js", "Docker", "AWS", "GraphQL", "SQL", "Python", "Kubernetes", "Tailwind CSS"];
const learningMap = {
  React: { course: "React Official Docs", time: "12 hrs", priority: "High" },
  TypeScript: { course: "TypeScript Handbook", time: "10 hrs", priority: "High" },
  "Node.js": { course: "Node.js Mastery", time: "14 hrs", priority: "Medium" },
  Docker: { course: "Docker Mastery", time: "8 hrs", priority: "High" },
  AWS: { course: "AWS Cloud Practitioner", time: "20 hrs", priority: "High" },
  GraphQL: { course: "GraphQL with Apollo", time: "9 hrs", priority: "Medium" },
  SQL: { course: "SQL for Analytics", time: "7 hrs", priority: "Medium" },
  Python: { course: "Python for Everybody", time: "16 hrs", priority: "Medium" },
  Kubernetes: { course: "Kubernetes Basics", time: "15 hrs", priority: "High" },
  "Tailwind CSS": { course: "Tailwind CSS Official Docs", time: "6 hrs", priority: "Low" },
};

function tone(priority) {
  if (priority === "High") return "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300";
  if (priority === "Medium") return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300";
  return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300";
}

function SkillGapAnalysis() {
  const [employeeName, setEmployeeName] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Intermediate");
  const [currentSkills, setCurrentSkills] = useState(["React", "TypeScript", "SQL"]);
  const [requiredSkills, setRequiredSkills] = useState(["React", "TypeScript", "Docker", "AWS"]);
  const [skillInput, setSkillInput] = useState("");
  const [inputType, setInputType] = useState("current");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("analysis");
  const [error, setError] = useState("");

  const addSkill = () => {
    if (!skillInput.trim()) return;
    const value = skillInput.trim();
    if (inputType === "current") {
      if (!currentSkills.includes(value)) setCurrentSkills((prev) => [...prev, value]);
    } else {
      if (!requiredSkills.includes(value)) setRequiredSkills((prev) => [...prev, value]);
    }
    setSkillInput("");
  };

  const removeSkill = (type, skill) => {
    if (type === "current") setCurrentSkills((prev) => prev.filter((item) => item !== skill));
    else setRequiredSkills((prev) => prev.filter((item) => item !== skill));
  };

  const analyze = async () => {
    if (!employeeName.trim()) {
      setError("Employee name is required.");
      return;
    }
    if (!requiredSkills.length) {
      setError("Add at least one required skill.");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    const matching = requiredSkills.filter((skill) => currentSkills.includes(skill));
    const missing = requiredSkills.filter((skill) => !currentSkills.includes(skill));
    const coverage = Math.round((matching.length / requiredSkills.length) * 100);
    const gapScore = 100 - coverage;
    const learningPath = missing.map((skill) => ({ skill, ...(learningMap[skill] || { course: "Targeted learning path", time: "8 hrs", priority: "Medium" }) }));
    setResult({
      matching,
      missing,
      coverage,
      gapScore,
      learningPath,
      maturity: coverage >= 80 ? "Advanced" : coverage >= 55 ? "Developing" : "Foundation",
      improvementPotential: Math.min(96, gapScore + 22),
      strengths: matching.length ? matching : currentSkills.slice(0, 2),
    });
    setLoading(false);
    setActiveTab("analysis");
  };

  const reset = () => {
    setEmployeeName("");
    setExperienceLevel("Intermediate");
    setCurrentSkills(["React", "TypeScript", "SQL"]);
    setRequiredSkills(["React", "TypeScript", "Docker", "AWS"]);
    setSkillInput("");
    setResult(null);
    setError("");
  };

  const analytics = useMemo(() => {
    const missingCount = result?.missing.length || 2;
    return [
      { label: "Skill Gap Score", value: `${result?.gapScore ?? 42}%` },
      { label: "Skill Coverage", value: `${result?.coverage ?? 58}%` },
      { label: "Learning Demand", value: `${missingCount} priority skills` },
      { label: "Maturity Level", value: result?.maturity || "Developing" },
    ];
  }, [result]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="relative overflow-hidden px-6 py-8 sm:px-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.18),_transparent_35%),radial-gradient(circle_at_right,_rgba(14,165,233,0.14),_transparent_32%)]" />
            <div className="relative flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <Badge variant="outline" className="mb-3 border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">Employee Skill Intelligence</Badge>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Skill Gap Analysis System</h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Analyze employee readiness, identify missing capabilities, generate training paths, and surface deeper skill intelligence from one dashboard.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={reset}><RefreshCw className="mr-2 h-4 w-4" />Reset</Button>
                <Button onClick={analyze} disabled={loading}>{loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Target className="mr-2 h-4 w-4" />}{loading ? "Analyzing..." : "Analyze Skills"}</Button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {analytics.map((item) => (
            <Card key={item.label} className="dark:border-slate-700 dark:bg-slate-900"><CardContent className="p-5"><p className="text-xs text-slate-500">{item.label}</p><p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{item.value}</p></CardContent></Card>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <Card className="dark:border-slate-700 dark:bg-slate-900">
            <CardHeader><CardTitle className="text-base">Employee Skill Inputs</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Employee Name</p><Input value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} placeholder="John Doe" /></div>
                <div><p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Experience Level</p><select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className="flex h-10 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm dark:border-slate-700">{["Beginner", "Intermediate", "Expert"].map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
              </div>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSkill()} placeholder="Add skill" />
                <select value={inputType} onChange={(e) => setInputType(e.target.value)} className="flex h-10 rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm dark:border-slate-700"><option value="current">Current</option><option value="required">Required</option></select>
                <Button type="button" onClick={addSkill}><Plus className="mr-2 h-4 w-4" />Add</Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                  <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Current Skills</p>
                  <div className="flex flex-wrap gap-2">{currentSkills.map((skill) => <span key={skill} className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">{skill}<button onClick={() => removeSkill("current", skill)}><X className="h-3 w-3" /></button></span>)}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                  <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Required Skills</p>
                  <div className="flex flex-wrap gap-2">{requiredSkills.map((skill) => <span key={skill} className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-sm text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">{skill}<button onClick={() => removeSkill("required", skill)}><X className="h-3 w-3" /></button></span>)}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">{suggestions.map((item) => <button key={item} type="button" onClick={() => setSkillInput(item)} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">{item}</button>)}</div>
              {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">{error}</div>}
            </CardContent>
          </Card>

          <Card className="dark:border-slate-700 dark:bg-slate-900">
            <CardHeader><CardTitle className="text-base">Employee Skill Intelligence</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><div className="flex items-center justify-between"><p className="text-xs text-slate-500">Skill maturity</p><Brain className="h-4 w-4 text-slate-400" /></div><p className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">{result?.maturity || "Developing"}</p></div>
              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><div className="flex items-center justify-between"><p className="text-xs text-slate-500">Learning progress</p><TrendingUp className="h-4 w-4 text-slate-400" /></div><Progress className="mt-3" value={result?.coverage || 58} /><p className="mt-2 text-sm text-slate-500">Current role readiness based on required skill coverage.</p></div>
              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><div className="flex items-center justify-between"><p className="text-xs text-slate-500">Improvement potential</p><Sparkles className="h-4 w-4 text-slate-400" /></div><p className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">{result?.improvementPotential || 64}%</p></div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="mt-4">
            <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader><CardTitle className="text-base">Skill Gap Results</CardTitle></CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    {result ? (
                      <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                        <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-700">
                          <div className="flex items-center justify-between"><div><p className="text-xs text-slate-500">Skill gap score</p><p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{result.gapScore}%</p></div><Badge variant="outline">{result.coverage}% coverage</Badge></div>
                          <Progress className="mt-4" value={result.coverage} />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Matching Skills</div><div className="flex flex-wrap gap-2">{result.matching.length ? result.matching.map((skill) => <Badge key={skill} variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">{skill}</Badge>) : <p className="text-sm text-slate-500">No matching skills yet.</p>}</div></div>
                          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100"><Target className="h-4 w-4 text-amber-500" />Missing Skills</div><div className="flex flex-wrap gap-2">{result.missing.length ? result.missing.map((skill) => <Badge key={skill} variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">{skill}</Badge>) : <p className="text-sm text-slate-500">No critical skill gaps.</p>}</div></div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700">Run analysis to see skill matching, missing skills, and coverage metrics.</motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader><CardTitle className="text-base">AI Skill Insights</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {[
                    `Strength area: ${(result?.strengths || currentSkills.slice(0, 2)).join(", ")}`,
                    `Skill gap focus: ${(result?.missing || requiredSkills.filter((skill) => !currentSkills.includes(skill))).slice(0, 2).join(", ") || "No major gap"}`,
                    `Learning priority: ${(result?.learningPath || [])[0]?.skill || "Maintain current learning momentum"}`,
                  ].map((item) => (
                    <div key={item} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><div className="flex items-start gap-3"><Sparkles className="mt-0.5 h-4 w-4 text-blue-500" /><p className="text-sm text-slate-700 dark:text-slate-300">{item}</p></div></div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="training" className="mt-4">
            <Card className="dark:border-slate-700 dark:bg-slate-900">
              <CardHeader><CardTitle className="text-base">Training Recommendation Engine</CardTitle></CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {(result?.learningPath || requiredSkills.filter((skill) => !currentSkills.includes(skill)).map((skill) => ({ skill, ...(learningMap[skill] || { course: "Targeted learning path", time: "8 hrs", priority: "Medium" }) }))).map((item) => (
                  <div key={item.skill} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                    <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.skill}</p><p className="mt-1 text-xs text-slate-500">{item.course}</p></div><Badge variant="outline" className={tone(item.priority)}>{item.priority}</Badge></div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500"><GraduationCap className="h-4 w-4" />Estimated learning time: {item.time}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="mt-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">Skill Strength</CardTitle></CardHeader><CardContent className="text-sm text-slate-600 dark:text-slate-300">{(result?.strengths || currentSkills.slice(0, 3)).join(", ")}</CardContent></Card>
              <Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">Skill Gap</CardTitle></CardHeader><CardContent className="text-sm text-slate-600 dark:text-slate-300">{(result?.missing || requiredSkills.filter((skill) => !currentSkills.includes(skill))).join(", ") || "No major gap"}</CardContent></Card>
              <Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">Improvement Potential</CardTitle></CardHeader><CardContent className="text-sm text-slate-600 dark:text-slate-300">{result?.improvementPotential || 64}% with targeted learning path completion.</CardContent></Card>
            </div>
          </TabsContent>

          <TabsContent value="charts" className="mt-4">
            <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader><CardTitle className="text-base">Skill Distribution Chart</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {[{ label: "Coverage", value: result?.coverage || 58 }, { label: "Gap", value: result?.gapScore || 42 }].map((item) => <div key={item.label}><div className="mb-1 flex justify-between text-xs text-slate-500"><span>{item.label}</span><span>{item.value}%</span></div><Progress value={item.value} /></div>)}
                </CardContent>
              </Card>
              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader><CardTitle className="text-base">Skill Comparison Chart</CardTitle></CardHeader>
                <CardContent className="space-y-3">{requiredSkills.map((skill) => { const present = currentSkills.includes(skill); return <div key={skill} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Code2 className="h-4 w-4 text-slate-400" /><span className="text-sm text-slate-900 dark:text-slate-100">{skill}</span></div><Badge variant="outline" className={present ? tone("Low") : tone("High")}>{present ? "Available" : "Missing"}</Badge></div></div>;})}</CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default SkillGapAnalysis;
