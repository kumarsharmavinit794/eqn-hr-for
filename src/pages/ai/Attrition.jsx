import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Brain,
  Briefcase,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Flame,
  Gauge,
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

const departments = ["Engineering", "Product", "Sales", "Marketing", "HR", "Finance"];
const departmentMetrics = [
  { name: "Engineering", attrition: 17, burnout: 49 },
  { name: "Product", attrition: 11, burnout: 38 },
  { name: "Sales", attrition: 26, burnout: 68 },
  { name: "Marketing", attrition: 14, burnout: 43 },
  { name: "HR", attrition: 8, burnout: 29 },
  { name: "Finance", attrition: 10, burnout: 31 },
];
const heatmap = [
  { team: "Platform", risk: 34 },
  { team: "Revenue", risk: 77 },
  { team: "Design", risk: 41 },
  { team: "Success", risk: 58 },
  { team: "Security", risk: 24 },
  { team: "Recruiting", risk: 36 },
];

function tone(level) {
  if (level === "High") return "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300";
  if (level === "Medium") return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300";
  return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300";
}

function Attrition() {
  const [form, setForm] = useState({
    employee: "",
    employeeId: "EMP2041",
    attendance: "88",
    performance: "Medium",
    workHours: "46",
    salarySatisfaction: "3",
    promotionHistory: "No",
    managerFeedback: "3",
    engagement: "61",
    tenure: "3.5",
    stressLevel: "64",
    department: "Engineering",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState("prediction");

  const analytics = useMemo(() => [
    { label: "Total Employees at Risk", value: 64, icon: Users },
    { label: "High Risk Employees", value: 18, icon: ShieldAlert },
    { label: "Average Attrition Probability", value: "42%", icon: TrendingDown },
    { label: "Avg Confidence Score", value: "91%", icon: Brain },
  ], []);

  const predict = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    const attendance = Number(form.attendance);
    const hours = Number(form.workHours);
    const salary = Number(form.salarySatisfaction);
    const manager = Number(form.managerFeedback);
    const engagement = Number(form.engagement);
    const tenure = Number(form.tenure);
    const stress = Number(form.stressLevel);

    let score = 0;
    const drivers = [];

    if (attendance < 85) {
      score += 14;
      drivers.push("Attendance has dipped below target range");
    } else if (attendance < 92) score += 8;

    if (form.performance === "Low") {
      score += 16;
      drivers.push("Performance rating is declining");
    } else if (form.performance === "Medium") score += 8;

    if (hours > 48) {
      score += 18;
      drivers.push("High overtime workload suggests burnout risk");
    } else if (hours > 44) score += 10;

    if (salary <= 2) {
      score += 15;
      drivers.push("Salary satisfaction is critically low");
    } else if (salary === 3) score += 8;

    if (form.promotionHistory === "No") {
      score += 12;
      drivers.push("Lack of promotion opportunities is affecting retention");
    }

    if (manager <= 2) {
      score += 14;
      drivers.push("Manager feedback relationship is weak");
    } else if (manager === 3) score += 6;

    if (engagement < 55) {
      score += 18;
      drivers.push("Low engagement score is a major attrition signal");
    } else if (engagement < 70) score += 10;

    if (stress > 70) {
      score += 14;
      drivers.push("Stress level is elevated and linked to burnout");
    } else if (stress > 55) score += 8;

    if (tenure > 4 && form.promotionHistory === "No") score += 6;

    const riskScore = Math.max(10, Math.min(94, Math.round(score)));
    const riskLevel = riskScore >= 70 ? "High" : riskScore >= 40 ? "Medium" : "Low";
    const confidence = Math.max(82, Math.min(98, Math.round(88 + score / 10)));
    const burnout = Math.max(12, Math.min(96, Math.round((stress * 0.45) + (Math.max(hours - 40, 0) * 2.2) + ((100 - engagement) * 0.25))));
    const trend = [Math.max(8, riskScore - 22), Math.max(10, riskScore - 14), Math.max(12, riskScore - 7), riskScore];
    const recommendations = [
      riskScore >= 70 ? "Schedule an immediate one-on-one with manager and HRBP." : "Maintain structured monthly check-ins.",
      burnout >= 60 ? "Reduce workload and reallocate overtime-heavy responsibilities." : "Monitor capacity and energy levels through the next sprint.",
      form.promotionHistory === "No" ? "Present a career growth or promotion path." : "Reinforce next-step development planning.",
      engagement < 70 ? "Provide targeted learning or recognition opportunities." : "Sustain current engagement momentum with stretch work.",
    ];

    setResult({ riskScore, riskLevel, confidence, burnout, trend, drivers, recommendations, engagement, stress, salary, hours });
    setLoading(false);
    setTab("prediction");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="relative overflow-hidden px-6 py-8 sm:px-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_35%),radial-gradient(circle_at_right,_rgba(244,63,94,0.14),_transparent_32%)]" />
            <div className="relative flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <Badge variant="outline" className="mb-3 border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">AI Employee Retention Dashboard</Badge>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Attrition Prediction Intelligence</h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Predict employee attrition risk, surface burnout signals, and guide HR intervention with department analytics and team-level heatmaps.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setForm({ ...form, employee: "", employeeId: "EMP2041" })}><RefreshCw className="mr-2 h-4 w-4" />Reset</Button>
                <Button onClick={predict} disabled={loading}>{loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <TrendingUp className="mr-2 h-4 w-4" />}{loading ? "Analyzing..." : "Predict Attrition"}</Button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {analytics.map((item) => <Card key={item.label} className="dark:border-slate-700 dark:bg-slate-900"><CardContent className="flex items-center justify-between p-5"><div><p className="text-xs text-slate-500">{item.label}</p><p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{item.value}</p></div><item.icon className="h-5 w-5 text-slate-500" /></CardContent></Card>)}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <Card className="dark:border-slate-700 dark:bg-slate-900">
            <CardHeader><CardTitle className="text-base">Attrition Input Factors</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div><p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Employee Name</p><Input value={form.employee} onChange={(e) => setForm((p) => ({ ...p, employee: e.target.value }))} placeholder="John Doe" /></div>
              <div><p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Employee ID</p><Input value={form.employeeId} onChange={(e) => setForm((p) => ({ ...p, employeeId: e.target.value }))} /></div>
              <div><p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Attendance %</p><Input type="number" value={form.attendance} onChange={(e) => setForm((p) => ({ ...p, attendance: e.target.value }))} /></div>
              <div><p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Performance Rating</p><select value={form.performance} onChange={(e) => setForm((p) => ({ ...p, performance: e.target.value }))} className="flex h-10 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm dark:border-slate-700">{["Low", "Medium", "High"].map((x) => <option key={x} value={x}>{x}</option>)}</select></div>
              <div><p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Work Hours / Week</p><Input type="number" value={form.workHours} onChange={(e) => setForm((p) => ({ ...p, workHours: e.target.value }))} /></div>
              <div><p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Salary Satisfaction</p><Input type="number" min="1" max="5" value={form.salarySatisfaction} onChange={(e) => setForm((p) => ({ ...p, salarySatisfaction: e.target.value }))} /></div>
              <div><p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Promotion History</p><select value={form.promotionHistory} onChange={(e) => setForm((p) => ({ ...p, promotionHistory: e.target.value }))} className="flex h-10 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm dark:border-slate-700"><option value="Yes">Yes</option><option value="No">No</option></select></div>
              <div><p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Manager Feedback (1-5)</p><Input type="number" min="1" max="5" value={form.managerFeedback} onChange={(e) => setForm((p) => ({ ...p, managerFeedback: e.target.value }))} /></div>
              <div><p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Engagement Score</p><Input type="number" min="0" max="100" value={form.engagement} onChange={(e) => setForm((p) => ({ ...p, engagement: e.target.value }))} /></div>
              <div><p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Tenure (Years)</p><Input type="number" min="0" max="40" step="0.5" value={form.tenure} onChange={(e) => setForm((p) => ({ ...p, tenure: e.target.value }))} /></div>
              <div><p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Stress Level</p><Input type="number" min="0" max="100" value={form.stressLevel} onChange={(e) => setForm((p) => ({ ...p, stressLevel: e.target.value }))} /></div>
              <div className="sm:col-span-2"><p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Department</p><select value={form.department} onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))} className="flex h-10 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm dark:border-slate-700">{departments.map((x) => <option key={x} value={x}>{x}</option>)}</select></div>
            </CardContent>
          </Card>

          <Card className="dark:border-slate-700 dark:bg-slate-900">
            <CardHeader><CardTitle className="text-base">HR Dashboard Analytics</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "High-risk employees", value: "18 flagged this cycle", icon: ShieldAlert },
                { label: "Burnout watchlist", value: "23 employees", icon: Flame },
                { label: "Confidence benchmark", value: `${result?.confidence || 91}%`, icon: Gauge },
                { label: "Wellbeing correlation", value: result ? `${Math.round((result.burnout + (100 - result.engagement)) / 2)} risk index` : "58 risk index", icon: HeartPulse },
              ].map((item) => <div key={item.label} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><div className="flex items-center justify-between"><div><p className="text-xs text-slate-500">{item.label}</p><p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{item.value}</p></div><item.icon className="h-4 w-4 text-slate-500" /></div></div>)}
            </CardContent>
          </Card>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="prediction">Prediction</TabsTrigger>
            <TabsTrigger value="drivers">Drivers</TabsTrigger>
            <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="prediction" className="mt-4">
            <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader><CardTitle className="text-base">Attrition Risk Gauge</CardTitle></CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    {result ? (
                      <motion.div key="risk" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-700">
                          <div className="flex items-start justify-between"><div><Badge variant="outline" className={tone(result.riskLevel)}>{result.riskLevel} Risk</Badge><p className="mt-3 text-4xl font-bold text-slate-900 dark:text-slate-100">{result.riskScore}%</p><p className="mt-1 text-sm text-slate-500">Confidence score: {result.confidence}%</p></div><Gauge className="h-10 w-10 text-blue-500" /></div>
                          <Progress className="mt-4" value={result.riskScore} />
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                          {[{ label: "Burnout Detection", value: `${result.burnout}%`, icon: Flame }, { label: "Engagement", value: `${result.engagement}%`, icon: HeartPulse }, { label: "Stress Level", value: `${result.stress}%`, icon: AlertTriangle }].map((item) => <div key={item.label} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><div className="flex items-center justify-between"><p className="text-xs text-slate-500">{item.label}</p><item.icon className="h-4 w-4 text-slate-400" /></div><p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{item.value}</p></div>)}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-sm text-slate-500 dark:border-slate-700">Run a prediction to visualize attrition risk and confidence.</motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader><CardTitle className="text-base">Risk Trend Line Chart</CardTitle></CardHeader>
                <CardContent>
                  <div className="mb-3 flex justify-between text-xs text-slate-500">{["Jan", "Feb", "Mar", "Apr"].map((m) => <span key={m}>{m}</span>)}</div>
                  <svg viewBox="0 0 320 140" className="w-full"><polyline fill="none" stroke="rgb(59 130 246)" strokeWidth="4" points={(result?.trend || [18, 26, 35, 46]).map((v, i) => `${i * 90 + 20},${125 - v}`).join(" ")} />{(result?.trend || [18, 26, 35, 46]).map((v, i) => <circle key={`${v}-${i}`} cx={i * 90 + 20} cy={125 - v} r="5" fill="rgb(59 130 246)" />)}</svg>
                  <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Trend progression helps HR detect whether risk is accelerating or stabilizing over time.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="drivers" className="mt-4">
            <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader><CardTitle className="text-base">Risk Drivers Analysis</CardTitle></CardHeader>
                <CardContent className="space-y-3">{(result?.drivers || ["Low engagement score is a key attrition driver.", "High overtime workload increases burnout exposure.", "Limited growth mobility raises retention risk."]).map((item) => <div key={item} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" /><p className="text-sm text-slate-700 dark:text-slate-300">{item}</p></div></div>)}</CardContent>
              </Card>
              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader><CardTitle className="text-base">Burnout Detection</CardTitle></CardHeader>
                <CardContent className="space-y-4">{[{ label: "Overtime hours", value: `${result?.hours || form.workHours} hrs` }, { label: "Stress level", value: `${result?.stress || form.stressLevel}%` }, { label: "Declining productivity risk", value: form.performance === "Low" ? "High" : form.performance === "Medium" ? "Moderate" : "Low" }].map((item) => <div key={item.label} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><p className="text-xs text-slate-500">{item.label}</p><p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{item.value}</p></div>)}</CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="heatmap" className="mt-4">
            <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader><CardTitle className="text-base">Department Attrition Graph</CardTitle></CardHeader>
                <CardContent className="space-y-3">{departmentMetrics.map((item) => <div key={item.name} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.name}</p><p className="text-xs text-slate-500">Burnout index: {item.burnout}%</p></div><Badge variant="outline" className={tone(item.attrition >= 20 ? "High" : item.attrition >= 12 ? "Medium" : "Low")}>{item.attrition}% attrition</Badge></div><Progress className="mt-3" value={item.attrition} /></div>)}</CardContent>
              </Card>
              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader><CardTitle className="text-base">Team Attrition Heatmap</CardTitle></CardHeader>
                <CardContent><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{heatmap.map((item) => <div key={item.team} className="rounded-2xl border border-slate-200 p-4 text-center dark:border-slate-700"><div className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-semibold ${item.risk >= 70 ? "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-300" : item.risk >= 40 ? "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300" : "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300"}`}>{item.risk}</div><p className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.team}</p><p className="text-xs text-slate-500">{item.risk >= 70 ? "High Risk" : item.risk >= 40 ? "Medium Risk" : "Low Risk"}</p></div>)}</div></CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="actions" className="mt-4">
            <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader><CardTitle className="text-base">Retention Recommendations</CardTitle></CardHeader>
                <CardContent className="space-y-3">{(result?.recommendations || ["Schedule one-on-one meeting with manager and HRBP.", "Reduce workload in overtime-heavy weeks.", "Offer clear promotion or internal mobility path.", "Provide skill training and engagement support."]).map((item) => <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><Sparkles className="mt-0.5 h-4 w-4 text-blue-500" /><p className="text-sm text-slate-700 dark:text-slate-300">{item}</p></div>)}</CardContent>
              </Card>
              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader><CardTitle className="text-base">Wellbeing & Attrition Correlation</CardTitle></CardHeader>
                <CardContent className="space-y-4"><div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100"><HeartPulse className="h-4 w-4 text-rose-500" />Correlation Insight</div><p className="text-sm text-slate-600 dark:text-slate-300">High stress plus lower engagement and extended workload creates a stronger probability of burnout-led attrition.</p></div><div className="grid gap-3 sm:grid-cols-2">{[{ label: "Burnout risk", value: `${result?.burnout || 58}%`, icon: Flame }, { label: "Future attrition probability", value: `${result?.riskScore || 46}%`, icon: TrendingDown }].map((item) => <div key={item.label} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><div className="flex items-center justify-between"><p className="text-xs text-slate-500">{item.label}</p><item.icon className="h-4 w-4 text-slate-400" /></div><p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{item.value}</p></div>)}</div></CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Attrition;
