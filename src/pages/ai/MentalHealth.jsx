import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Angry,
  BookOpen,
  Brain,
  Calendar,
  Coffee,
  Flame,
  Frown,
  Heart,
  LineChart,
  Moon,
  RefreshCw,
  Smile,
  Sparkles,
  Waves,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const moodOptions = [
  { value: "happy", label: "Happy", icon: Smile, color: "text-emerald-500", score: 88 },
  { value: "sad", label: "Sad", icon: Frown, color: "text-blue-500", score: 42 },
  { value: "stressed", label: "Stressed", icon: Brain, color: "text-amber-500", score: 34 },
  { value: "tired", label: "Tired", icon: Moon, color: "text-violet-500", score: 51 },
  { value: "angry", label: "Angry", icon: Angry, color: "text-red-500", score: 29 },
];
const affirmations = [
  "I am capable of handling whatever comes my way.",
  "I give myself permission to rest and recharge.",
  "My feelings are valid and deserve attention.",
  "I can take one calm step at a time.",
];
const wellnessSuggestions = {
  happy: ["Share appreciation with a teammate.", "Capture today’s win in your journal.", "Use this energy for a focused deep-work block."],
  sad: ["Take a short walk and get sunlight.", "Message someone you trust.", "Write down one thing you need support with today."],
  stressed: ["Try a 4-7-8 breathing cycle.", "Drink water and stretch for 5 minutes.", "Block 15 minutes to reset before the next task."],
  tired: ["Take a screen break and rest your eyes.", "Stand up and do a light mobility stretch.", "Prioritize sleep hygiene tonight."],
  angry: ["Pause before replying to messages.", "Write your thoughts before responding.", "Take 10 slow breaths and step away briefly."],
};

function MentalHealth() {
  const [mood, setMood] = useState("happy");
  const [thought, setThought] = useState("");
  const [history, setHistory] = useState([]);
  const [affirmation, setAffirmation] = useState(affirmations[0]);
  const [breathing, setBreathing] = useState(false);
  const [tab, setTab] = useState("checkin");

  useEffect(() => {
    const stored = localStorage.getItem("mindfulCompanionHistory");
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("mindfulCompanionHistory", JSON.stringify(history));
  }, [history]);

  const selectedMood = moodOptions.find((item) => item.value === mood) || moodOptions[0];
  const wellbeingScore = selectedMood.score;
  const stressRisk = Math.max(12, 100 - wellbeingScore);
  const burnoutRisk = Math.round((stressRisk * 0.55) + (history.filter((item) => item.mood === "stressed" || item.mood === "tired").length * 6));
  const weeklyTrend = [62, 58, 51, wellbeingScore, Math.max(40, wellbeingScore - 5), Math.min(92, wellbeingScore + 4), wellbeingScore];
  const moodCounts = useMemo(() => moodOptions.map((item) => ({ ...item, count: history.filter((entry) => entry.mood === item.value).length + (item.value === mood ? 1 : 0) })), [history, mood]);

  const saveEntry = () => {
    const entry = {
      id: Date.now(),
      mood,
      thought: thought.trim() || "No journal note added.",
      timestamp: new Date().toLocaleString(),
      score: wellbeingScore,
    };
    setHistory((prev) => [entry, ...prev].slice(0, 12));
    setThought("");
    setTab("history");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="relative overflow-hidden px-6 py-8 sm:px-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.18),_transparent_35%),radial-gradient(circle_at_right,_rgba(59,130,246,0.16),_transparent_32%)]" />
            <div className="relative flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <Badge variant="outline" className="mb-3 border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-300">Wellbeing Intelligence System</Badge>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Employee Mental Health Support</h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Track daily mood, maintain a thought journal, use guided wellness tools, and connect wellbeing signals with burnout and attrition risk.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)])}><RefreshCw className="mr-2 h-4 w-4" />New Affirmation</Button>
                <Button onClick={saveEntry}><Heart className="mr-2 h-4 w-4" />Save Check-In</Button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[{ label: "Wellbeing Score", value: `${wellbeingScore}%`, icon: Heart }, { label: "Stress Level", value: `${stressRisk}%`, icon: Brain }, { label: "Burnout Risk", value: `${burnoutRisk}%`, icon: Flame }, { label: "Mood Entries Logged", value: history.length || 7, icon: Calendar }].map((item) => <Card key={item.label} className="dark:border-slate-700 dark:bg-slate-900"><CardContent className="flex items-center justify-between p-5"><div><p className="text-xs text-slate-500">{item.label}</p><p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{item.value}</p></div><item.icon className="h-5 w-5 text-slate-500" /></CardContent></Card>)}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <Card className="dark:border-slate-700 dark:bg-slate-900">
            <CardHeader><CardTitle className="text-base">Mood Tracking and Thought Journal</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">{moodOptions.map((item) => <button key={item.value} type="button" onClick={() => setMood(item.value)} className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${mood === item.value ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900" : "border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"}`}><item.icon className={`h-4 w-4 ${mood === item.value ? "text-current" : item.color}`} />{item.label}</button>)}</div>
              <Textarea value={thought} onChange={(e) => setThought(e.target.value)} rows={5} placeholder="Write how your day is going, any stressors, or what support would help..." />
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50"><div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100"><Sparkles className="h-4 w-4 text-teal-500" />Daily Affirmation</div><p className="text-sm text-slate-600 dark:text-slate-300">{affirmation}</p></div>
            </CardContent>
          </Card>

          <Card className="dark:border-slate-700 dark:bg-slate-900">
            <CardHeader><CardTitle className="text-base">Guided Wellness Tools</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><div className="mb-2 flex items-center justify-between"><div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100"><Waves className="h-4 w-4 text-blue-500" />4-7-8 Breathing</div><Button variant="outline" size="sm" onClick={() => setBreathing((prev) => !prev)}>{breathing ? "Hide" : "Start"}</Button></div><AnimatePresence>{breathing && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden text-sm text-slate-600 dark:text-slate-300"><p>Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds. Repeat 4 cycles.</p></motion.div>}</AnimatePresence></div>
              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100"><BookOpen className="h-4 w-4 text-violet-500" />Meditation & Sleep</div><p className="text-sm text-slate-600 dark:text-slate-300">Try a 10-minute guided meditation, avoid screens 30 minutes before sleep, and keep your sleep window consistent.</p></div>
              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100"><Coffee className="h-4 w-4 text-amber-500" />Personalized Wellness Recommendations</div><div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">{wellnessSuggestions[mood].map((item) => <div key={item} className="flex items-start gap-2"><Sparkles className="mt-0.5 h-3.5 w-3.5 text-slate-400" /><span>{item}</span></div>)}</div></div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="checkin">Check-In</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="correlation">Correlation</TabsTrigger>
          </TabsList>

          <TabsContent value="checkin" className="mt-4">
            <Card className="dark:border-slate-700 dark:bg-slate-900">
              <CardHeader><CardTitle className="text-base">Mood Timeline Graph</CardTitle></CardHeader>
              <CardContent><div className="mb-3 flex justify-between text-xs text-slate-500">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <span key={d}>{d}</span>)}</div><svg viewBox="0 0 420 140" className="w-full"><polyline fill="none" stroke="rgb(20 184 166)" strokeWidth="4" points={weeklyTrend.map((v, i) => `${i * 60 + 20},${125 - v}`).join(" ")} />{weeklyTrend.map((v, i) => <circle key={`${v}-${i}`} cx={i * 60 + 20} cy={125 - v} r="5" fill="rgb(20 184 166)" />)}</svg><p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Weekly mood trends help identify positive recovery periods or repeated stress spikes.</p></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <Card className="dark:border-slate-700 dark:bg-slate-900">
              <CardHeader><CardTitle className="text-base">Mood and Journal History</CardTitle></CardHeader>
              <CardContent className="space-y-3">{history.length ? history.map((entry) => <div key={entry.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><div className="flex items-center justify-between"><div className="flex items-center gap-2">{(() => { const Icon = moodOptions.find((item) => item.value === entry.mood)?.icon || Smile; return <Icon className="h-4 w-4 text-slate-500" />; })()}<p className="text-sm font-medium text-slate-900 dark:text-slate-100">{entry.mood}</p></div><p className="text-xs text-slate-500">{entry.timestamp}</p></div><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{entry.thought}</p></div>) : <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700">No mood entries yet. Save a check-in to build your wellbeing history.</div>}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader><CardTitle className="text-base">Mood Frequency Analytics</CardTitle></CardHeader>
                <CardContent className="space-y-3">{moodCounts.map((item) => <div key={item.value} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><item.icon className={`h-4 w-4 ${item.color}`} /><span className="text-sm text-slate-900 dark:text-slate-100">{item.label}</span></div><Badge variant="outline">{item.count}</Badge></div></div>)}</CardContent>
              </Card>
              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader><CardTitle className="text-base">HR Wellbeing Analytics</CardTitle></CardHeader>
                <CardContent className="space-y-3">{[{ label: "Average wellbeing score", value: `${wellbeingScore}%`, icon: Heart }, { label: "Stress pattern", value: stressRisk > 55 ? "Elevated" : "Stable", icon: Brain }, { label: "Departments with burnout risk", value: "Sales, Engineering", icon: Flame }].map((item) => <div key={item.label} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><div className="flex items-center justify-between"><div><p className="text-xs text-slate-500">{item.label}</p><p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{item.value}</p></div><item.icon className="h-4 w-4 text-slate-500" /></div></div>)}</CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="correlation" className="mt-4">
            <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader><CardTitle className="text-base">Wellbeing and Attrition Correlation</CardTitle></CardHeader>
                <CardContent className="space-y-4"><div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100"><LineChart className="h-4 w-4 text-blue-500" />Risk Intelligence Insight</div><p className="text-sm text-slate-600 dark:text-slate-300">{stressRisk > 55 ? "High stress and lower wellbeing suggest increased future attrition probability unless workload and support are adjusted." : "Wellbeing signals are relatively stable, which lowers short-term burnout-driven attrition risk."}</p></div><div className="grid gap-3 sm:grid-cols-3">{[{ label: "Stress level", value: `${stressRisk}%`, icon: Brain }, { label: "Burnout risk", value: `${burnoutRisk}%`, icon: Flame }, { label: "Future attrition probability", value: `${Math.min(92, Math.round((burnoutRisk * 0.55) + ((100 - wellbeingScore) * 0.35)))}%`, icon: Activity }].map((item) => <div key={item.label} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><div className="flex items-center justify-between"><p className="text-xs text-slate-500">{item.label}</p><item.icon className="h-4 w-4 text-slate-400" /></div><p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{item.value}</p></div>)}</div></CardContent>
              </Card>
              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader><CardTitle className="text-base">Mood Feedback Actions</CardTitle></CardHeader>
                <CardContent className="space-y-3">{[
                  "Encourage a short walk, hydration, and a brief reset between meetings.",
                  "If stress remains elevated for 3+ check-ins, suggest manager support and workload review.",
                  "Use journal patterns to identify recurring triggers and improve team support.",
                  "Share sleep and mindfulness tools during high-pressure periods.",
                ].map((item) => <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><Sparkles className="mt-0.5 h-4 w-4 text-teal-500" /><p className="text-sm text-slate-700 dark:text-slate-300">{item}</p></div>)}</CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default MentalHealth;
