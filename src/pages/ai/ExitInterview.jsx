
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  Gauge,
  LineChart,
  MessagesSquare,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { analyzeExitInterviewMock } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const QUESTIONS = [
  {
    id: 1,
    text: "Why are you leaving the company?",
    placeholder: "Share the primary reason behind your decision to leave.",
  },
  {
    id: 2,
    text: "How was your overall experience working here?",
    placeholder: "Describe the overall employee experience, key moments, and concerns.",
  },
  {
    id: 3,
    text: "What did you enjoy most about your role?",
    placeholder: "Highlight the strengths you valued in your work and team environment.",
  },
  {
    id: 4,
    text: "What could the company have done better to retain you?",
    placeholder: "Be candid about growth, leadership, compensation, or workload gaps.",
  },
  {
    id: 5,
    text: "Would you recommend the company to others?",
    placeholder: "Explain why you would or would not recommend this workplace.",
  },
];

const SENTIMENT_META = {
  "Very Positive": {
    tone: "text-emerald-700 dark:text-emerald-300",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
    chart: "bg-emerald-500",
  },
  Positive: {
    tone: "text-green-700 dark:text-green-300",
    badge: "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300",
    chart: "bg-green-500",
  },
  Neutral: {
    tone: "text-amber-700 dark:text-amber-300",
    badge: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
    chart: "bg-amber-500",
  },
  Negative: {
    tone: "text-orange-700 dark:text-orange-300",
    badge: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-300",
    chart: "bg-orange-500",
  },
  "Very Negative": {
    tone: "text-red-700 dark:text-red-300",
    badge: "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300",
    chart: "bg-red-500",
  },
};

const sentimentDistribution = [
  { label: "Very Positive", value: 18 },
  { label: "Positive", value: 31 },
  { label: "Neutral", value: 22 },
  { label: "Negative", value: 17 },
  { label: "Very Negative", value: 12 },
];

const exitReasons = [
  { label: "Growth opportunities", value: 38 },
  { label: "Compensation", value: 29 },
  { label: "Management quality", value: 24 },
  { label: "Work-life balance", value: 21 },
];

const riskTrend = [32, 36, 41, 47, 44, 52];
const departmentExits = [
  { name: "Engineering", score: 64 },
  { name: "Sales", score: 78 },
  { name: "Operations", score: 48 },
  { name: "HR", score: 26 },
];

function buildTrendPath(values) {
  const width = 320;
  const height = 120;
  const max = Math.max(...values);
  const min = Math.min(...values);
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / Math.max(1, max - min)) * (height - 18) - 9;
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
}

function riskTone(risk) {
  if (risk === "High") return "text-red-700 dark:text-red-300";
  if (risk === "Medium") return "text-amber-700 dark:text-amber-300";
  return "text-emerald-700 dark:text-emerald-300";
}

function riskBadge(risk) {
  if (risk === "High") return "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300";
  if (risk === "Medium") return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300";
  return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300";
}

function ExitInterviewBot() {
  const [phase, setPhase] = useState("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(""));
  const [draft, setDraft] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const textRef = useRef(null);

  useEffect(() => {
    if (phase === "questions" && textRef.current) {
      textRef.current.focus();
    }
  }, [phase, currentQ]);

  const interviewProgress = phase === "questions" ? ((currentQ + (draft.trim() ? 1 : 0)) / QUESTIONS.length) * 100 : phase === "results" ? 100 : 0;

  const analytics = useMemo(() => {
    const sentimentScore = results?.sentimentScore ?? 7.1;
    return [
      { label: "Average Sentiment Score", value: `${sentimentScore}/10`, icon: BrainCircuit },
      { label: "Top Reason for Leaving", value: "Growth opportunities", icon: MessagesSquare },
      { label: "Department Exit Trend", value: "Sales trending higher", icon: TrendingUp },
    ];
  }, [results]);

  const sentimentMeta = results ? SENTIMENT_META[results.overallSentiment] || SENTIMENT_META.Neutral : SENTIMENT_META.Neutral;
  const confidenceScore = results ? Math.min(96, 72 + results.sentimentScore * 2) : 84;
  const recommendationList = results
    ? [
        "Improve manager coaching and feedback quality for at-risk teams.",
        "Review compensation competitiveness for frequently mentioned exit themes.",
        "Create clearer internal growth paths and promotion visibility.",
      ]
    : [];

  function startInterview() {
    setPhase("questions");
    setCurrentQ(0);
    setDraft(answers[0] || "");
    setError("");
  }

  function handleNext() {
    if (!draft.trim()) return;

    const updated = [...answers];
    updated[currentQ] = draft.trim();
    setAnswers(updated);

    if (currentQ < QUESTIONS.length - 1) {
      const nextIndex = currentQ + 1;
      setCurrentQ(nextIndex);
      setDraft(updated[nextIndex] || "");
      return;
    }

    void submitInterview(updated);
  }

  function handleBack() {
    if (currentQ === 0) return;
    const updated = [...answers];
    updated[currentQ] = draft;
    const previousIndex = currentQ - 1;
    setAnswers(updated);
    setCurrentQ(previousIndex);
    setDraft(updated[previousIndex] || "");
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      handleNext();
    }
  }

  async function submitInterview(allAnswers) {
    setPhase("analyzing");
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      const parsed = analyzeExitInterviewMock(allAnswers);
      setResults(parsed);
      setPhase("results");
    } catch (err) {
      setError("AI analysis failed. Please review the responses and try again.");
      setPhase("questions");
      setCurrentQ(QUESTIONS.length - 1);
      setDraft(allAnswers[QUESTIONS.length - 1] || "");
    }
  }

  function restart() {
    setPhase("intro");
    setCurrentQ(0);
    setAnswers(Array(QUESTIONS.length).fill(""));
    setDraft("");
    setResults(null);
    setError("");
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="relative overflow-hidden px-6 py-8 sm:px-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_36%),radial-gradient(circle_at_right,_rgba(14,165,233,0.12),_transparent_30%)]" />
            <div className="relative flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <Badge variant="outline" className="mb-3 border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300">
                  Exit Intelligence System
                </Badge>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Exit Interview AI Bot
                </h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Capture structured employee feedback, detect sentiment and retention risk, and convert exit interviews into practical HR intelligence.
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white/80 px-5 py-4 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-800">
                    <Gauge className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Interview Progress</p>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{Math.round(interviewProgress)}%</p>
                  </div>
                </div>
                <Progress value={interviewProgress} className="mt-4 h-2" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Structured Questions", value: QUESTIONS.length, icon: ClipboardList },
            { label: "AI Summary Coverage", value: "100%", icon: Sparkles },
            { label: "Retention Risk Tracking", value: results?.retentionRisk || "Live", icon: ShieldAlert },
            { label: "Exit Insights Ready", value: phase === "results" ? "Yes" : "In progress", icon: CheckCircle2 },
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
              <CardTitle className="text-base">Interview Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {phase === "intro" && (
                  <motion.div
                    key="intro"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="space-y-5"
                  >
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/40">
                      <Badge variant="outline" className="mb-4">Confidential and AI analyzed</Badge>
                      <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Turn exit interviews into retention intelligence</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        This workflow helps HR capture honest feedback, detect recurring themes, estimate future retention risk, and prioritize improvements for similar employee groups.
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        "Five structured exit questions",
                        "Sentiment and retention risk scoring",
                        "Theme extraction and executive summary",
                        "HR recommendations for similar employee cohorts",
                      ].map((item) => (
                        <div key={item} className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
                          {item}
                        </div>
                      ))}
                    </div>
                    {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">{error}</div> : null}
                    <Button onClick={startInterview} className="w-full sm:w-auto">
                      Start exit interview
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                )}

                {phase === "questions" && (
                  <motion.div
                    key={`question-${currentQ}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="space-y-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Question {currentQ + 1} of {QUESTIONS.length}</p>
                        <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">{QUESTIONS[currentQ].text}</h2>
                      </div>
                      <Badge variant="outline">Step-based flow</Badge>
                    </div>

                    <div className="flex gap-2">
                      {QUESTIONS.map((item, index) => (
                        <div key={item.id} className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${index <= currentQ ? 100 : 0}%` }}
                            className="h-full rounded-full bg-indigo-500"
                          />
                        </div>
                      ))}
                    </div>

                    <Textarea
                      ref={textRef}
                      rows={7}
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={QUESTIONS[currentQ].placeholder}
                      className="min-h-[180px] resize-y"
                    />

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-300">
                      Press Ctrl + Enter to continue. Responses are confidential and used only for AI summarization.
                    </div>

                    {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">{error}</div> : null}

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                      <Button variant="outline" onClick={handleBack} disabled={currentQ === 0}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button onClick={handleNext} disabled={!draft.trim()}>
                        {currentQ === QUESTIONS.length - 1 ? "Submit and analyze" : "Continue"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {phase === "analyzing" && (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="space-y-5 text-center"
                  >
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/30">
                      <RefreshCw className="h-7 w-7 animate-spin text-indigo-600 dark:text-indigo-300" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">AI analysis in progress</h2>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        Generating sentiment classification, retention risk assessment, key themes, and executive recommendations.
                      </p>
                    </div>
                    <Progress value={82} className="h-2" />
                  </motion.div>
                )}

                {phase === "results" && results && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="space-y-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Analysis complete</p>
                        <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">Exit insights dashboard</h2>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className={sentimentMeta.badge}>{results.overallSentiment}</Badge>
                        <Badge variant="outline" className={riskBadge(results.retentionRisk)}>{results.retentionRisk} retention risk</Badge>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                        <p className="text-xs text-slate-500">Sentiment score</p>
                        <p className={`mt-1 text-3xl font-semibold ${sentimentMeta.tone}`}>{results.sentimentScore}/10</p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                        <p className="text-xs text-slate-500">Confidence score</p>
                        <p className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-100">{confidenceScore}%</p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                        <p className="text-xs text-slate-500">Recommendation intent</p>
                        <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                          {results.recommendToOthers ? "Would recommend" : "Would not recommend"}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/40">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Executive summary</p>
                      <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-200">{results.executiveSummary}</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
                        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Strengths identified</p>
                        <div className="mt-3 space-y-2">
                          {results.strengths.map((item) => (
                            <div key={item} className="flex gap-2 text-sm text-slate-700 dark:text-slate-200">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-red-200 bg-red-50/70 p-4 dark:border-red-900 dark:bg-red-950/20">
                        <p className="text-sm font-semibold text-red-700 dark:text-red-300">Improvement areas</p>
                        <div className="mt-3 space-y-2">
                          {results.improvements.map((item) => (
                            <div key={item} className="flex gap-2 text-sm text-slate-700 dark:text-slate-200">
                              <CircleAlert className="mt-0.5 h-4 w-4 text-red-500" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Key themes</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {results.topThemes.map((theme) => (
                          <Badge key={theme} variant="outline" className="border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300">
                            {theme}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button onClick={restart}>Start new interview</Button>
                      <Button variant="outline" onClick={() => setPhase("questions")}>Review responses</Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          <Card className="dark:border-slate-700 dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-base">Exit Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="insights" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                  <TabsTrigger value="charts">Charts</TabsTrigger>
                  <TabsTrigger value="actions">AI Actions</TabsTrigger>
                </TabsList>

                <TabsContent value="insights" className="space-y-4">
                  <div className="grid gap-3">
                    {analytics.map((item) => (
                      <div key={item.label} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs text-slate-500">{item.label}</p>
                            <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{item.value}</p>
                          </div>
                          <item.icon className="h-5 w-5 text-slate-500" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      <Target className="h-4 w-4 text-indigo-500" />
                      Retention risk trend
                    </div>
                    <svg viewBox="0 0 320 120" className="mt-4 h-32 w-full">
                      <path d={buildTrendPath(riskTrend)} fill="none" stroke="rgb(99 102 241)" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    <div className="mt-2 flex justify-between text-xs text-slate-500">
                      <span>Jan</span>
                      <span>Feb</span>
                      <span>Mar</span>
                      <span>Apr</span>
                      <span>May</span>
                      <span>Jun</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Department exit trends</p>
                    <div className="mt-3 space-y-3">
                      {departmentExits.map((department) => (
                        <div key={department.name}>
                          <div className="mb-1 flex justify-between text-xs text-slate-500">
                            <span>{department.name}</span>
                            <span>{department.score}%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${department.score}%` }}
                              className={`h-full rounded-full ${department.score > 70 ? "bg-red-500" : department.score > 45 ? "bg-amber-500" : "bg-emerald-500"}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="charts" className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Sentiment distribution</p>
                    <div className="mt-4 space-y-3">
                      {sentimentDistribution.map((item) => {
                        const meta = SENTIMENT_META[item.label] || SENTIMENT_META.Neutral;
                        return (
                          <div key={item.label}>
                            <div className="mb-1 flex justify-between text-xs text-slate-500">
                              <span>{item.label}</span>
                              <span>{item.value}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${item.value}%` }} className={`h-full rounded-full ${meta.chart}`} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Common exit reasons</p>
                    <div className="mt-4 space-y-3">
                      {exitReasons.map((item) => (
                        <div key={item.label}>
                          <div className="mb-1 flex justify-between text-xs text-slate-500">
                            <span>{item.label}</span>
                            <span>{item.value}%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${item.value}%` }} className="h-full rounded-full bg-sky-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      <LineChart className="h-4 w-4 text-sky-500" />
                      Prediction explanation panel
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      Risk is inferred from response sentiment, recommendation intent, recurring growth themes, and negative signals around leadership or workload. Confidence rises when the employee gives detailed and consistent answers across multiple questions.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="actions" className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      <Sparkles className="h-4 w-4 text-indigo-500" />
                      AI recommendations
                    </div>
                    <div className="mt-3 space-y-3">
                      {(recommendationList.length
                        ? recommendationList
                        : [
                            "Improve management training for teams with recurring feedback concerns.",
                            "Review promotion and career path transparency for high-performing cohorts.",
                            "Monitor compensation themes in quarterly exit summaries.",
                          ]).map((item) => (
                        <div key={item} className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700 dark:bg-slate-800/50 dark:text-slate-200">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      <ShieldAlert className={`h-4 w-4 ${results ? riskTone(results.retentionRisk) : "text-amber-500"}`} />
                      Similar employee risk
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {results
                        ? `This interview suggests a ${results.retentionRisk.toLowerCase()} retention risk for similar employees if the same themes remain unresolved.`
                        : "Complete an interview to estimate future retention risk for similar employee groups."}
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ExitInterviewBot;
