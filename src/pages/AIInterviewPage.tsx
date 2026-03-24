import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Play, Pause, SkipForward, CheckCircle2, Clock, Brain, Star, ChevronRight, BarChart3, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

interface Question {
  id: number;
  text: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  timeLimit: number;
  status: "pending" | "active" | "answered" | "skipped";
  answer?: string;
  confidence?: number;
  quality?: number;
}

const initialQuestions: Question[] = [
  { id: 1, text: "Tell me about your experience with React and TypeScript in production environments.", category: "Technical", difficulty: "medium", timeLimit: 180, status: "answered", answer: "I've worked with React for 4 years building large-scale SaaS applications...", confidence: 88, quality: 85 },
  { id: 2, text: "How do you handle state management in complex React applications?", category: "Technical", difficulty: "hard", timeLimit: 240, status: "answered", answer: "I typically evaluate the complexity first. For simpler apps I use Context API...", confidence: 92, quality: 90 },
  { id: 3, text: "Describe a challenging bug you debugged recently and your approach.", category: "Problem Solving", difficulty: "medium", timeLimit: 180, status: "active", answer: "", confidence: undefined, quality: undefined },
  { id: 4, text: "How do you prioritize tasks when multiple deadlines are approaching?", category: "Behavioral", difficulty: "easy", timeLimit: 120, status: "pending" },
  { id: 5, text: "Explain the concept of server-side rendering and when you'd use it.", category: "Technical", difficulty: "medium", timeLimit: 180, status: "pending" },
  { id: 6, text: "Tell me about a time you disagreed with a team decision. How did you handle it?", category: "Behavioral", difficulty: "medium", timeLimit: 180, status: "pending" },
  { id: 7, text: "Design a real-time notification system for a social media platform.", category: "System Design", difficulty: "hard", timeLimit: 300, status: "pending" },
  { id: 8, text: "What's your approach to writing testable and maintainable code?", category: "Technical", difficulty: "medium", timeLimit: 180, status: "pending" },
];

const candidateProfile = {
  name: "Sarah Chen",
  role: "Sr. Frontend Engineer",
  experience: "6 years",
  avatar: "SC",
};

const radarData = [
  { skill: "Technical", score: 87 },
  { skill: "Problem Solving", score: 82 },
  { skill: "Communication", score: 90 },
  { skill: "System Design", score: 75 },
  { skill: "Behavioral", score: 88 },
  { skill: "Culture Fit", score: 85 },
];

const difficultyColors: Record<string, string> = {
  easy: "bg-success/10 text-success border-success/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  hard: "bg-destructive/10 text-destructive border-destructive/20",
};

const qualityLabel = (score: number) => {
  if (score >= 85) return { label: "Excellent", color: "text-success" };
  if (score >= 70) return { label: "Good", color: "text-primary" };
  if (score >= 50) return { label: "Average", color: "text-warning" };
  return { label: "Needs Improvement", color: "text-destructive" };
};

export default function AIInterviewPage() {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [elapsedTime, setElapsedTime] = useState(47);

  const activeQuestion = questions.find((q) => q.status === "active");
  const answered = questions.filter((q) => q.status === "answered").length;
  const avgConfidence = Math.round(
    questions.filter((q) => q.confidence).reduce((s, q) => s + (q.confidence || 0), 0) /
      (questions.filter((q) => q.confidence).length || 1)
  );
  const avgQuality = Math.round(
    questions.filter((q) => q.quality).reduce((s, q) => s + (q.quality || 0), 0) /
      (questions.filter((q) => q.quality).length || 1)
  );

  const handleSkip = () => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.status === "active") return { ...q, status: "skipped" as const };
        const activeIdx = prev.findIndex((p) => p.status === "active");
        if (q.id === prev[activeIdx + 1]?.id) return { ...q, status: "active" as const };
        return q;
      })
    );
  };

  const handleSubmitAnswer = () => {
    setQuestions((prev) => {
      const activeIdx = prev.findIndex((p) => p.status === "active");
      return prev.map((q, i) => {
        if (i === activeIdx) return { ...q, status: "answered" as const, confidence: Math.floor(Math.random() * 20 + 75), quality: Math.floor(Math.random() * 25 + 70) };
        if (i === activeIdx + 1 && q.status === "pending") return { ...q, status: "active" as const };
        return q;
      });
    });
    setIsRecording(false);
  };

  const filteredQuestions = selectedCategory === "all" ? questions : questions.filter((q) => q.category === selectedCategory);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">AI Interview Panel</h1>
          <p className="page-subheader">AI-powered interview conducting with real-time evaluation</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/20">
            <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            <span className="text-sm font-medium text-destructive">LIVE</span>
          </div>
          <div className="text-sm text-muted-foreground mono-text">
            <Clock className="w-3.5 h-3.5 inline mr-1" />
            {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, "0")} elapsed
          </div>
        </div>
      </div>

      {/* Candidate + Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="glass-card col-span-2 lg:col-span-1">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-semibold text-sm">{candidateProfile.avatar}</div>
            <div>
              <p className="font-semibold text-sm">{candidateProfile.name}</p>
              <p className="text-xs text-muted-foreground">{candidateProfile.role} · {candidateProfile.experience}</p>
            </div>
          </CardContent>
        </Card>
        {[
          { label: "Questions", value: `${answered}/${questions.length}` },
          { label: "Avg Confidence", value: `${avgConfidence}%` },
          { label: "Avg Quality", value: `${avgQuality}%` },
          { label: "Overall Score", value: `${Math.round((avgConfidence + avgQuality) / 2)}%` },
        ].map((s) => (
          <Card key={s.label} className="glass-card">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Interview Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Active Question */}
          {activeQuestion && (
            <Card className="glass-card border-primary/30">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{activeQuestion.category}</Badge>
                    <Badge variant="outline" className={`text-xs ${difficultyColors[activeQuestion.difficulty]}`}>{activeQuestion.difficulty}</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground mono-text">Q{activeQuestion.id} · {Math.floor(activeQuestion.timeLimit / 60)}:{(activeQuestion.timeLimit % 60).toString().padStart(2, "0")} limit</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-base font-medium leading-relaxed">{activeQuestion.text}</p>

                {/* Voice Input UI */}
                <div className="p-4 rounded-xl border border-border bg-muted/20">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" onClick={() => setIsPaused(!isPaused)}>
                      {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    </Button>
                    <button
                      onClick={() => setIsRecording(!isRecording)}
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isRecording
                          ? "gradient-bg shadow-lg shadow-primary/30 scale-110"
                          : "bg-muted hover:bg-muted/80 border border-border"
                      }`}
                    >
                      {isRecording ? <Mic className="w-7 h-7 text-primary-foreground" /> : <MicOff className="w-7 h-7 text-muted-foreground" />}
                    </button>
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" onClick={handleSkip}>
                      <SkipForward className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Audio Waveform Placeholder */}
                  {isRecording && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-1 h-10 mb-3">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1 rounded-full bg-primary"
                          animate={{ height: [4, Math.random() * 28 + 8, 4] }}
                          transition={{ duration: 0.6 + Math.random() * 0.4, repeat: Infinity, repeatType: "reverse", delay: i * 0.05 }}
                        />
                      ))}
                    </motion.div>
                  )}

                  <p className="text-xs text-center text-muted-foreground">
                    {isRecording ? "Recording... Speak your answer clearly" : "Click microphone to start recording"}
                  </p>
                </div>

                {/* Answer Text Area */}
                <Textarea placeholder="Answer will be transcribed here, or type manually..." rows={3} className="text-sm" />

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={handleSkip}>Skip</Button>
                  <Button onClick={handleSubmitAnswer}><CheckCircle2 className="w-4 h-4 mr-1" /> Submit Answer</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Question List */}
          <Card className="glass-card">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Question Queue</CardTitle>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40 h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Behavioral">Behavioral</SelectItem>
                  <SelectItem value="Problem Solving">Problem Solving</SelectItem>
                  <SelectItem value="System Design">System Design</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {filteredQuestions.map((q) => (
                <div
                  key={q.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    q.status === "active" ? "bg-primary/10 border border-primary/20" : "bg-muted/30"
                  }`}
                >
                  <span className="text-xs mono-text text-muted-foreground w-6">Q{q.id}</span>
                  {q.status === "answered" ? (
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  ) : q.status === "active" ? (
                    <div className="w-4 h-4 rounded-full border-2 border-primary animate-pulse shrink-0" />
                  ) : q.status === "skipped" ? (
                    <SkipForward className="w-4 h-4 text-muted-foreground shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-border shrink-0" />
                  )}
                  <span className={`text-sm flex-1 line-clamp-1 ${q.status === "answered" || q.status === "skipped" ? "text-muted-foreground" : ""}`}>{q.text}</span>
                  <Badge variant="outline" className={`text-[10px] ${difficultyColors[q.difficulty]}`}>{q.difficulty}</Badge>
                  {q.confidence !== undefined && (
                    <div className="flex items-center gap-1">
                      <div className="w-12"><Progress value={q.confidence} className="h-1.5" /></div>
                      <span className="text-xs font-medium w-8">{q.confidence}%</span>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel — Evaluation */}
        <div className="space-y-4">
          {/* Skill Radar */}
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Brain className="w-4 h-4" /> AI Evaluation</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <Radar dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Answer Quality for Answered Questions */}
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Answer Quality</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {questions.filter((q) => q.status === "answered").map((q) => {
                const ql = qualityLabel(q.quality || 0);
                return (
                  <div key={q.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Q{q.id} · {q.category}</span>
                      <span className={`text-xs font-medium ${ql.color}`}>{ql.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex gap-1">
                        <div className="flex-1">
                          <div className="flex justify-between text-[10px] text-muted-foreground mb-0.5"><span>Confidence</span><span>{q.confidence}%</span></div>
                          <Progress value={q.confidence} className="h-1.5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between text-[10px] text-muted-foreground mb-0.5"><span>Quality</span><span>{q.quality}%</span></div>
                          <Progress value={q.quality} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* AI Feedback */}
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><MessageSquare className="w-4 h-4" /> AI Feedback</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[
                { feedback: "Strong technical depth in React/TS answers", type: "positive" },
                { feedback: "Could elaborate more on system design trade-offs", type: "suggestion" },
                { feedback: "Excellent communication clarity and structure", type: "positive" },
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-muted/30">
                  <Star className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${f.type === "positive" ? "text-success" : "text-warning"}`} />
                  <span className="text-xs">{f.feedback}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
