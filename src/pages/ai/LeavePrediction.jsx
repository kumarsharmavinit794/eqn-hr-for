import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Brain,
  Briefcase,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Flame,
  HeartPulse,
  LineChart,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
  User,
  Users,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const departments = ["Engineering", "Product", "Sales", "Marketing", "Finance", "People Ops"];

const departmentAnalytics = [
  { name: "Engineering", rate: 18, highRisk: 7, mediumRisk: 14 },
  { name: "Product", rate: 11, highRisk: 3, mediumRisk: 9 },
  { name: "Sales", rate: 26, highRisk: 10, mediumRisk: 16 },
  { name: "Marketing", rate: 14, highRisk: 4, mediumRisk: 8 },
  { name: "Finance", rate: 9, highRisk: 2, mediumRisk: 5 },
  { name: "People Ops", rate: 7, highRisk: 1, mediumRisk: 3 },
];

const teamHeatmap = [
  { team: "Platform", score: 32 },
  { team: "Design", score: 41 },
  { team: "Revenue", score: 74 },
  { team: "Customer Success", score: 58 },
  { team: "Security", score: 24 },
  { team: "Recruiting", score: 37 },
];

function statusTone(level) {
  if (level === "High") return "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300";
  if (level === "Medium") return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300";
  return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300";
}

function scoreTone(score) {
  if (score >= 70) return "bg-red-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-emerald-500";
}

function LeavePrediction() {
  const [form, setForm] = useState({
    employeeName: "",
    attendance: "",
    performance: "Medium",
    workHours: "40",
    salarySatisfaction: "3",
    promotionHistory: "No",
    engagementScore: "72",
    tenure: "2",
    department: "Engineering",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("prediction");

  const dashboardStats = useMemo(
    () => [
      { label: "High Risk Employees", value: 18, icon: ShieldAlert },
      { label: "Medium Risk Employees", value: 46, icon: AlertTriangle },
      { label: "Low Risk Employees", value: 126, icon: CheckCircle2 },
      { label: "Average Engagement", value: "74%", icon: HeartPulse },
    ],
    []
  );

  const calculateRisk = () => {
    const attendance = Number(form.attendance);
    const hours = Number(form.workHours);
    const engagement = Number(form.engagementScore);
    const salary = Number(form.salarySatisfaction);
    const tenure = Number(form.tenure);

    if (!form.employeeName.trim() || Number.isNaN(attendance) || Number.isNaN(hours) || Number.isNaN(engagement) || Number.isNaN(salary) || Number.isNaN(tenure)) {
      return null;
    }

    let score = 0;
    const drivers = [];

    if (attendance < 80) {
      score += 18;
      drivers.push("Attendance has dropped below healthy benchmark");
    } else if (attendance < 90) {
      score += 10;
    }

    if (form.performance === "Low") {
      score += 16;
      drivers.push("Performance trend indicates disengagement");
    } else if (form.performance === "Medium") {
      score += 8;
    }

    if (hours > 50) {
      score += 18;
      drivers.push("Sustained overtime signals burnout risk");
    } else if (hours > 45) {
      score += 10;
    } else if (hours < 35) {
      score += 9;
      drivers.push("Lower weekly hours may reflect lower involvement");
    }

    if (salary <= 2) {
      score += 16;
      drivers.push("Salary satisfaction is critically low");
    } else if (salary === 3) {
      score += 8;
    }

    if (form.promotionHistory === "No") {
      score += 10;
      drivers.push("No recent promotion or growth milestone recorded");
    }

    if (engagement < 50) {
      score += 22;
      drivers.push("Engagement score is low");
    } else if (engagement < 70) {
      score += 12;
    }

    if (tenure < 1) {
      score += 9;
    } else if (tenure > 5 && form.promotionHistory === "No") {
      score += 8;
      drivers.push("Long tenure without career progression may raise attrition intent");
    }

    const probability = Math.max(8, Math.min(94, Math.round(score)));
    const riskLevel = probability >= 70 ? "High" : probability >= 40 ? "Medium" : "Low";
    const burnoutScore = Math.max(12, Math.min(96, Math.round((Math.max(hours - 38, 0) * 1.6) + ((100 - engagement) * 0.55) + (form.performance === "Low" ? 15 : form.performance === "Medium" ? 7 : 0))));
    const retentionScore = Math.max(6, 100 - probability);
    const trend = [
      Math.max(10, probability - 26),
      Math.max(12, probability - 18),
      Math.max(14, probability - 9),
      probability,
    ];

    const recommendations = [
      probability >= 70 ? "Schedule an immediate manager and HR retention conversation." : "Maintain bi-weekly manager check-ins.",
      engagement < 70 ? "Create a tailored engagement recovery plan with clear milestones." : "Offer targeted recognition and growth opportunities.",
      hours > 45 ? "Rebalance workload and review overtime expectations." : "Monitor workload sustainability through the next cycle.",
      form.promotionHistory === "No" ? "Discuss role growth, internal mobility, or upskilling path." : "Reinforce career momentum with the next development goal.",
    ];

    const explanation = `Risk is driven primarily by ${drivers.slice(0, 2).join(" and ") || "stable signals across attendance, engagement, and workload"}. Current retention confidence is ${retentionScore}%.`;

    return {
      probability,
      riskLevel,
      drivers,
      burnoutScore,
      retentionScore,
      engagement,
      trend,
      salary,
      hours,
      recommendations,
      explanation,
    };
  };

  const handlePredict = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    const prediction = calculateRisk();
    setResult(prediction);
    setLoading(false);
    if (prediction) setActiveTab("prediction");
  };

  const handleReset = () => {
    setForm({
      employeeName: "",
      attendance: "",
      performance: "Medium",
      workHours: "40",
      salarySatisfaction: "3",
      promotionHistory: "No",
      engagementScore: "72",
      tenure: "2",
      department: "Engineering",
    });
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="relative overflow-hidden px-6 py-8 sm:px-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_35%),radial-gradient(circle_at_right,_rgba(244,63,94,0.12),_transparent_32%)]" />
            <div className="relative flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <Badge variant="outline" className="mb-3 border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
                  Workforce Retention Intelligence
                </Badge>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Workforce Attrition Prediction System</h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Predict attrition risk, understand risk drivers, monitor burnout indicators, and equip HR with proactive retention actions across the organization.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={handleReset}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button onClick={handlePredict} disabled={loading}>
                  {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <TrendingUp className="mr-2 h-4 w-4" />}
                  {loading ? "Analyzing..." : "Run Prediction"}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((item) => (
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
              <CardTitle className="text-base">Employee Risk Prediction Form</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Employee Name</p>
                <Input value={form.employeeName} onChange={(e) => setForm((prev) => ({ ...prev, employeeName: e.target.value }))} placeholder="e.g. John Doe" />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Department</p>
                <select value={form.department} onChange={(e) => setForm((prev) => ({ ...prev, department: e.target.value }))} className="flex h-10 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm dark:border-slate-700">
                  {departments.map((department) => <option key={department} value={department}>{department}</option>)}
                </select>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Attendance %</p>
                <Input type="number" value={form.attendance} onChange={(e) => setForm((prev) => ({ ...prev, attendance: e.target.value }))} placeholder="85" />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Performance Rating</p>
                <select value={form.performance} onChange={(e) => setForm((prev) => ({ ...prev, performance: e.target.value }))} className="flex h-10 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm dark:border-slate-700">
                  {["Low", "Medium", "High"].map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Work Hours / Week</p>
                <Input type="number" value={form.workHours} onChange={(e) => setForm((prev) => ({ ...prev, workHours: e.target.value }))} placeholder="40" />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Salary Satisfaction (1-5)</p>
                <Input type="number" min="1" max="5" value={form.salarySatisfaction} onChange={(e) => setForm((prev) => ({ ...prev, salarySatisfaction: e.target.value }))} />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Promotion History</p>
                <select value={form.promotionHistory} onChange={(e) => setForm((prev) => ({ ...prev, promotionHistory: e.target.value }))} className="flex h-10 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm dark:border-slate-700">
                  {["Yes", "No"].map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Engagement Score</p>
                <Input type="number" min="0" max="100" value={form.engagementScore} onChange={(e) => setForm((prev) => ({ ...prev, engagementScore: e.target.value }))} />
              </div>
              <div className="sm:col-span-2">
                <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Tenure (Years)</p>
                <Input type="number" min="0" max="40" step="0.5" value={form.tenure} onChange={(e) => setForm((prev) => ({ ...prev, tenure: e.target.value }))} />
              </div>
            </CardContent>
          </Card>

          <Card className="dark:border-slate-700 dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-base">HR Action Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Immediate intervention", value: "18 employees", icon: ShieldAlert },
                { label: "Manager check-ins due", value: "11 this week", icon: CalendarClock },
                { label: "Burnout watchlist", value: "23 employees", icon: Flame },
                { label: "Retention plans active", value: "14 workflows", icon: Brain },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">{item.label}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{item.value}</p>
                    </div>
                    <item.icon className="h-4 w-4 text-slate-500" />
                  </div>
                </div>
              ))}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  AI Retention Recommendations
                </div>
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {(result?.recommendations || [
                    "Prioritize 1:1s for employees with overtime and low engagement.",
                    "Review compensation signals in departments above 20% attrition rate.",
                    "Use team heatmap to target manager coaching interventions.",
                  ]).map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <ArrowRight className="mt-0.5 h-4 w-4 text-slate-400" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="prediction">Prediction</TabsTrigger>
            <TabsTrigger value="drivers">Drivers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="explanation">Explanation</TabsTrigger>
          </TabsList>

          <TabsContent value="prediction" className="mt-4">
            <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-base">Attrition Risk Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    {result ? (
                      <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-4">
                        <div className="flex items-start justify-between rounded-2xl border border-slate-200 p-5 dark:border-slate-700">
                          <div>
                            <Badge variant="outline" className={statusTone(result.riskLevel)}>{result.riskLevel} Risk</Badge>
                            <p className="mt-3 text-4xl font-bold text-slate-900 dark:text-slate-100">{result.probability}%</p>
                            <p className="mt-1 text-sm text-slate-500">Attrition probability for {form.employeeName}</p>
                          </div>
                          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                            {result.riskLevel === "High" ? <ShieldAlert className="h-8 w-8 text-red-500" /> : result.riskLevel === "Medium" ? <AlertTriangle className="h-8 w-8 text-amber-500" /> : <CheckCircle2 className="h-8 w-8 text-emerald-500" />}
                          </div>
                        </div>
                        <div>
                          <div className="mb-2 flex justify-between text-xs text-slate-500">
                            <span>Risk score progress</span>
                            <span>{result.probability}%</span>
                          </div>
                          <Progress value={result.probability} />
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                          {[
                            { label: "Burnout Detection", value: `${result.burnoutScore}%`, icon: Flame },
                            { label: "Engagement Score", value: `${result.engagement}%`, icon: HeartPulse },
                            { label: "Retention Confidence", value: `${result.retentionScore}%`, icon: TrendingUp },
                          ].map((item) => (
                            <div key={item.label} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-slate-500">{item.label}</p>
                                <item.icon className="h-4 w-4 text-slate-400" />
                              </div>
                              <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{item.value}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-sm text-slate-500 dark:border-slate-700">
                        Fill in employee attributes and run the prediction to generate attrition intelligence.
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-base">Attrition Trend Graph</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-3 flex justify-between text-xs text-slate-500">
                    {["Jan", "Feb", "Mar", "Apr"].map((month) => <span key={month}>{month}</span>)}
                  </div>
                  <svg viewBox="0 0 320 140" className="w-full">
                    <polyline
                      fill="none"
                      stroke="rgb(59 130 246)"
                      strokeWidth="4"
                      points={(result?.trend || [18, 26, 33, 41]).map((value, index) => `${index * 90 + 20},${125 - value}`).join(" ")}
                    />
                    {(result?.trend || [18, 26, 33, 41]).map((value, index) => (
                      <circle key={`${value}-${index}`} cx={index * 90 + 20} cy={125 - value} r="5" fill="rgb(59 130 246)" />
                    ))}
                  </svg>
                  <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                    Risk trend reflects a month-over-month movement from {(result?.trend || [18])[0]}% to {(result?.trend || [18, 26, 33, 41])[3]}%, helping HR detect acceleration early.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="drivers" className="mt-4">
            <div className="grid gap-4 xl:grid-cols-3">
              <Card className="xl:col-span-2 dark:border-slate-700 dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-base">Risk Drivers Analysis and Burnout Detection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(result?.drivers || [
                    "Low engagement trend compared to team average.",
                    "Compensation satisfaction may be suppressing retention confidence.",
                    "Workload intensity and overtime should be reviewed.",
                  ]).map((driver) => (
                    <div key={driver} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" />
                        <p className="text-sm text-slate-700 dark:text-slate-300">{driver}</p>
                      </div>
                    </div>
                  ))}
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      { label: "Overtime signal", value: `${result?.hours || Number(form.workHours || 40)} hrs`, icon: Clock3 },
                      { label: "Engagement health", value: `${result?.engagement || Number(form.engagementScore || 72)}%`, icon: HeartPulse },
                      { label: "Salary sentiment", value: `${result?.salary || Number(form.salarySatisfaction || 3)}/5`, icon: Wallet },
                    ].map((item) => (
                      <div key={item.label} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-slate-500">{item.label}</p>
                          <item.icon className="h-4 w-4 text-slate-400" />
                        </div>
                        <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-base">Salary vs Attrition Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                    <p className="text-xs text-slate-500">Salary satisfaction</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{result?.salary || Number(form.salarySatisfaction || 3)}/5</p>
                    <Progress className="mt-3" value={((result?.salary || Number(form.salarySatisfaction || 3)) / 5) * 100} />
                  </div>
                  <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                    <p className="text-xs text-slate-500">Compensation pressure index</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{(6 - (result?.salary || Number(form.salarySatisfaction || 3))) * 14}%</p>
                    <p className="mt-1 text-xs text-slate-500">Higher pressure often correlates with retention risk in high-demand roles.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-base">Department Attrition Analytics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {departmentAnalytics.map((item) => (
                    <div key={item.name} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.name}</p>
                          <p className="text-xs text-slate-500">High risk: {item.highRisk} • Medium risk: {item.mediumRisk}</p>
                        </div>
                        <Badge variant="outline" className={statusTone(item.rate >= 20 ? "High" : item.rate >= 12 ? "Medium" : "Low")}>
                          {item.rate}% attrition
                        </Badge>
                      </div>
                      <Progress className="mt-3" value={item.rate} />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-base">Team Risk Heatmap</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {teamHeatmap.map((item) => (
                      <div key={item.team} className="rounded-2xl border border-slate-200 p-4 text-center dark:border-slate-700">
                        <div className={`mx-auto mb-3 h-14 w-14 rounded-2xl ${item.score >= 70 ? "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-300" : item.score >= 40 ? "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300" : "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300"} flex items-center justify-center text-lg font-semibold`}>
                          {item.score}
                        </div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.team}</p>
                        <p className="text-xs text-slate-500">team risk score</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="explanation" className="mt-4">
            <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-base">Prediction Explanation Panel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      <Brain className="h-4 w-4 text-blue-500" />
                      Model explanation
                    </div>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                      {result?.explanation || "The model combines attendance, performance, workload, pay sentiment, promotion movement, engagement, and tenure to estimate attrition probability."}
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      { label: "Attendance contribution", value: form.attendance || "--", suffix: "%", icon: TrendingDown },
                      { label: "Tenure contribution", value: form.tenure || "--", suffix: " yrs", icon: Briefcase },
                      { label: "Department context", value: form.department, suffix: "", icon: Building2 },
                      { label: "Workload context", value: form.workHours || "--", suffix: " hrs", icon: Clock3 },
                    ].map((item) => (
                      <div key={item.label} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-slate-500">{item.label}</p>
                          <item.icon className="h-4 w-4 text-slate-400" />
                        </div>
                        <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{item.value}{item.suffix}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-base">Suggested HR Playbook</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    "Run a focused retention review for high-risk employees this week.",
                    "Coach managers in departments above benchmark attrition rates.",
                    "Review workload and overtime data before the next pulse survey.",
                    "Tie compensation and growth actions to low-engagement cases.",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                      <Sparkles className="mt-0.5 h-4 w-4 text-blue-500" />
                      <p className="text-sm text-slate-700 dark:text-slate-300">{item}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default LeavePrediction;
