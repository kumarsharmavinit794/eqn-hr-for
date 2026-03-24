import { motion } from "framer-motion";
import { Heart, Shield, Globe, Megaphone, FileText, Users, Star, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const cultureMetrics = [
  { label: "Employee NPS", value: "+42", description: "Excellent" },
  { label: "Work-Life Score", value: "4.1/5", description: "Above avg" },
  { label: "Diversity Index", value: "0.78", description: "Strong" },
  { label: "Safety Score", value: "96%", description: "Exemplary" },
];

const policies = [
  { name: "Remote Work Policy", category: "Work", views: 234, lastUpdated: "Mar 2026" },
  { name: "Code of Conduct", category: "Ethics", views: 312, lastUpdated: "Feb 2026" },
  { name: "Dress Code Guidelines", category: "Office", views: 156, lastUpdated: "Jan 2026" },
  { name: "Travel & Expense Policy", category: "Finance", views: 189, lastUpdated: "Mar 2026" },
  { name: "Health & Safety Guidelines", category: "Safety", views: 267, lastUpdated: "Mar 2026" },
];

const safetyItems = [
  { item: "Fire Safety Drill", status: "completed", date: "Mar 15, 2026", score: 98 },
  { item: "First Aid Training", status: "scheduled", date: "Apr 5, 2026", score: null },
  { item: "Workplace Ergonomics Audit", status: "completed", date: "Feb 28, 2026", score: 92 },
  { item: "Emergency Evacuation Plan", status: "active", date: "Reviewed Mar 2026", score: 100 },
];

const careerPageSections = [
  { title: "About Us", content: "NexaHR is revolutionizing HR with AI-powered solutions." },
  { title: "Our Values", content: "Innovation, Transparency, Growth, Inclusion" },
  { title: "Benefits", content: "Health insurance, flexible hours, learning budget, stock options" },
  { title: "Open Positions", content: "23 open roles across 5 departments" },
];

export default function CulturePage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="page-header">Culture & Branding</h1>
        <p className="page-subheader">Company culture, workplace safety, career page & employer branding</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cultureMetrics.map((m) => (
          <Card key={m.label} className="glass-card">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className="text-2xl font-bold mt-1">{m.value}</p>
              <p className="text-xs text-primary mt-1">{m.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="policies">
        <TabsList>
          <TabsTrigger value="policies">Office Policies</TabsTrigger>
          <TabsTrigger value="safety">Safety Dashboard</TabsTrigger>
          <TabsTrigger value="culture">Culture Tracker</TabsTrigger>
          <TabsTrigger value="career">Career Page</TabsTrigger>
          <TabsTrigger value="branding">Social Branding</TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="mt-4">
          <Card className="glass-card">
            <CardContent className="p-4 space-y-2">
              {policies.map((p) => (
                <div key={p.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.views} views · Updated {p.lastUpdated}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">{p.category}</Badge>
                  <Button size="sm" variant="ghost"><Eye className="w-4 h-4" /></Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="safety" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Shield className="w-4 h-4" /> Employee Safety Dashboard</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {safetyItems.map((s) => (
                <div key={s.item} className="p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">{s.item}</p>
                    <Badge variant="outline" className={`text-xs capitalize ${s.status === "completed" ? "bg-success/10 text-success" : s.status === "scheduled" ? "bg-info/10 text-info" : "bg-primary/10 text-primary"}`}>{s.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{s.date}</span>
                    {s.score && <div className="flex items-center gap-2"><Progress value={s.score} className="w-20 h-1.5" /><span className="text-xs font-medium">{s.score}%</span></div>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="culture" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Heart className="w-4 h-4" /> Work Culture Tracker</CardTitle></CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { metric: "Team Collaboration", score: 88 },
                  { metric: "Innovation Culture", score: 76 },
                  { metric: "Inclusivity", score: 82 },
                  { metric: "Work-Life Balance", score: 74 },
                  { metric: "Communication", score: 85 },
                  { metric: "Leadership Trust", score: 79 },
                ].map((c) => (
                  <div key={c.metric} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{c.metric}</p>
                    </div>
                    <Progress value={c.score} className="w-24 h-2" />
                    <span className="text-sm font-medium w-10 text-right">{c.score}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="career" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Globe className="w-4 h-4" /> Career Page Manager</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {careerPageSections.map((s) => (
                  <div key={s.title} className="p-4 rounded-lg border border-border bg-muted/20">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-sm">{s.title}</p>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{s.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Megaphone className="w-4 h-4" /> Social Hiring & Employer Branding</CardTitle></CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { platform: "LinkedIn", followers: "12.4K", posts: 48, engagement: "4.2%" },
                  { platform: "Glassdoor", followers: "3.2K", posts: 156, engagement: "4.5 ★" },
                  { platform: "Twitter/X", followers: "8.1K", posts: 92, engagement: "3.8%" },
                ].map((p) => (
                  <div key={p.platform} className="p-4 rounded-lg border border-border bg-muted/20 text-center">
                    <p className="font-semibold text-sm">{p.platform}</p>
                    <p className="text-xl font-bold mt-2">{p.followers}</p>
                    <p className="text-xs text-muted-foreground">{p.posts} posts · {p.engagement} engagement</p>
                    <Button size="sm" variant="outline" className="mt-3">Manage</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
