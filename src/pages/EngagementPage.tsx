import { motion } from "framer-motion";
import { Heart, MessageSquare, Star, Calendar, AlertTriangle, SmilePlus, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useEffect, useState } from "react";
import api from "@/lib/api";

// Type definitions
interface SatisfactionData {
  name: string;
  value: number;
  color: string;
}

interface FeedbackTrend {
  month: string;
  score: number;
}

interface Survey {
  title: string;
  responses: number;
  total: number;
  status: string;
}

interface Complaint {
  id: string;
  subject: string;
  priority: string;
  status: string;
  date: string;
}

interface EngagementData {
  satisfactionData: SatisfactionData[];
  feedbackTrends: FeedbackTrend[];
  surveys: Survey[];
  complaints: Complaint[];
  stats: {
    satisfactionScore: number;
    activeSurveys: number;
    openComplaints: number;
    upcomingEvents: number;
  };
}

interface ChatMessage {
  sender: "user" | "bot";
  text: string;
}

export default function EngagementPage() {
  const [data, setData] = useState<EngagementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "bot",
      text: "Hi! I can help with policy queries, salary info, leave balance, and more. How can I assist?"
    }
  ]);
  const [input, setInput] = useState("");

  useEffect(() => {
    api
      .get("/engagement")
      .then((res) => {
        setData(res.data?.data || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching engagement data:", err);
        setError("Failed to load engagement data");
        setLoading(false);
      });
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setInput("");

    try {
      const res = await api.post("/hr-chat", {
        message: userMsg
      });
      setMessages(prev => [...prev, { sender: "bot", text: res.data.reply }]);
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages(prev => [...prev, { sender: "bot", text: "Sorry, I couldn't process your request. Please try again." }]);
    }
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading engagement data...</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error || !data) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="text-center py-12">
          <p className="text-destructive">{error || "No data available"}</p>
        </div>
      </motion.div>
    );
  }

  // Quick stats from data
  const stats = data.stats || {
    satisfactionScore: 4.2,
    activeSurveys: data.surveys.filter(s => s.status === "active").length,
    openComplaints: data.complaints.filter(c => c.status !== "resolved").length,
    upcomingEvents: 4 // could also come from API if available
  };

  const priorityColors: Record<string, string> = {
    high: "bg-destructive/10 text-destructive",
    low: "bg-success/10 text-success",
    medium: "bg-warning/10 text-warning",
  };
  const statusColors: Record<string, string> = {
    resolved: "text-success",
    "in-progress": "text-warning",
    open: "text-info",
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="page-header">Engagement & Support</h1>
        <p className="page-subheader">Employee satisfaction, feedback, events & complaint management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Satisfaction Score</span>
              <Heart className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xl font-bold">{stats.satisfactionScore}/5</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Active Surveys</span>
              <Star className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xl font-bold">{stats.activeSurveys}</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Open Complaints</span>
              <AlertTriangle className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xl font-bold">{stats.openComplaints}</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Upcoming Events</span>
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xl font-bold">{stats.upcomingEvents}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="feedback">
        <TabsList>
          <TabsTrigger value="feedback">Feedback & Surveys</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="complaints">Complaints</TabsTrigger>
          <TabsTrigger value="chatbot">HR Chatbot</TabsTrigger>
        </TabsList>

        <TabsContent value="feedback" className="mt-4 space-y-4">
          <div className="grid lg:grid-cols-2 gap-4">
            <Card className="glass-card">
              <CardHeader className="pb-2"><CardTitle className="text-base">Satisfaction Distribution</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={data.satisfactionData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                      {data.satisfactionData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-3 justify-center">
                  {data.satisfactionData.map((d) => (
                    <div key={d.name} className="flex items-center gap-1.5 text-xs">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                      {d.name} ({d.value}%)
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardHeader className="pb-2"><CardTitle className="text-base">Feedback Score Trend</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data.feedbackTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis domain={[3, 5]} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base">Surveys</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {data.surveys.map((s) => (
                <div key={s.title} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{s.title}</p>
                    <p className="text-xs text-muted-foreground">{s.responses}/{s.total} responses</p>
                  </div>
                  <Progress value={(s.responses / s.total) * 100} className="w-24 h-2" />
                  <Badge variant="outline" className="text-xs capitalize">{s.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base">Upcoming Events</CardTitle></CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {/* Events would come from API; for now use static or from data if available */}
                {/* If API provides events, map here; otherwise keep static placeholder */}
                {/* To avoid breaking, we can keep the static events or conditionally render */}
                {[
                  { name: "Team Building Workshop", date: "Apr 5, 2026", type: "Workshop", attendees: 45 },
                  { name: "Quarterly Town Hall", date: "Apr 15, 2026", type: "Meeting", attendees: 160 },
                  { name: "Wellness Wednesday", date: "Apr 9, 2026", type: "Wellness", attendees: 30 },
                  { name: "Innovation Hackathon", date: "Apr 20-21, 2026", type: "Event", attendees: 60 },
                ].map((e) => (
                  <div key={e.name} className="p-4 rounded-lg border border-border bg-muted/20">
                    <p className="font-semibold text-sm">{e.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{e.date}</p>
                    <div className="flex items-center justify-between mt-3">
                      <Badge variant="secondary" className="text-xs">{e.type}</Badge>
                      <span className="text-xs text-muted-foreground">{e.attendees} attendees</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complaints" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base">Complaint Dashboard</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {data.complaints.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <span className="text-xs mono-text text-muted-foreground w-16">{c.id}</span>
                  <span className="text-sm flex-1">{c.subject}</span>
                  <Badge variant="outline" className={`text-xs ${priorityColors[c.priority]}`}>{c.priority}</Badge>
                  <span className={`text-xs font-medium capitalize ${statusColors[c.status]}`}>{c.status}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chatbot" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><SmilePlus className="w-4 h-4" /> HR Support Chatbot</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                {messages.map((m, i) => (
                  <div key={i} className={`flex gap-2 ${m.sender === "user" ? "justify-end" : ""}`}>
                    {m.sender === "bot" && (
                      <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center shrink-0">
                        <MessageSquare className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                    <div className={`${m.sender === "user" ? "bg-primary text-primary-foreground" : "glass-card"} rounded-xl px-3 py-2 text-sm max-w-[80%]`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask about policies, salary, leave..."
                  className="flex-1"
                />
                <Button size="sm" onClick={handleSendMessage}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {["Leave balance", "Salary slip", "Holiday list", "File complaint"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setInput(p)}
                    className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-muted-foreground"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
