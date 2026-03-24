import { motion } from "framer-motion";
import { BookOpen, TrendingUp, Target, Award, Brain, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const skillGaps = [
  { skill: "React", current: 85, required: 90 },
  { skill: "TypeScript", current: 70, required: 85 },
  { skill: "AWS", current: 45, required: 75 },
  { skill: "Python", current: 60, required: 70 },
  { skill: "Leadership", current: 55, required: 80 },
  { skill: "System Design", current: 50, required: 75 },
];

const radarData = skillGaps.map(s => ({ skill: s.skill, current: s.current, required: s.required }));

const courses = [
  { title: "Advanced React Patterns", provider: "Udemy", duration: "12h", match: 95, category: "Technical", enrolled: 24 },
  { title: "AWS Solutions Architect", provider: "Coursera", duration: "40h", match: 88, category: "Cloud", enrolled: 18 },
  { title: "Leadership Fundamentals", provider: "LinkedIn Learning", duration: "8h", match: 82, category: "Soft Skills", enrolled: 31 },
  { title: "System Design Masterclass", provider: "Educative", duration: "20h", match: 78, category: "Technical", enrolled: 15 },
];

const learningPaths = [
  { name: "Frontend Mastery", progress: 68, modules: 12, completed: 8 },
  { name: "Cloud Architecture", progress: 35, modules: 10, completed: 3 },
  { name: "Management Track", progress: 20, modules: 8, completed: 2 },
];

const growthData = [
  { month: "Oct", score: 62 }, { month: "Nov", score: 65 }, { month: "Dec", score: 70 },
  { month: "Jan", score: 72 }, { month: "Feb", score: 78 }, { month: "Mar", score: 82 },
];

export default function TrainingPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="page-header">Training & Development</h1>
        <p className="page-subheader">AI-powered skill gap analysis & personalized learning paths</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Programs", value: "14", icon: BookOpen },
          { label: "Avg Skill Score", value: "76%", icon: Target },
          { label: "Courses Completed", value: "234", icon: Award },
          { label: "Skill Improvement", value: "+12%", icon: TrendingUp },
        ].map((s) => (
          <Card key={s.label} className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <s.icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skill Gap Radar */}
        <Card className="glass-card">
          <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Brain className="w-4 h-4" /> Skill Gap Analysis</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Radar name="Current" dataKey="current" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                <Radar name="Required" dataKey="required" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.1} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Growth Chart */}
        <Card className="glass-card">
          <CardHeader className="pb-2"><CardTitle className="text-base">Employee Growth Dashboard</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Bar dataKey="score" fill="hsl(var(--primary))" name="Skill Score" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Course Recommendations */}
      <Card className="glass-card">
        <CardHeader className="pb-2"><CardTitle className="text-base">AI Course Recommendations</CardTitle></CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-3">
            {courses.map((c) => (
              <div key={c.title} className="p-4 rounded-lg border border-border bg-muted/20 hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-sm">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.provider} · {c.duration}</p>
                  </div>
                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">{c.match}% match</Badge>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <Badge variant="secondary" className="text-xs">{c.category}</Badge>
                  <Button size="sm" variant="outline">Enroll <ChevronRight className="w-3 h-3 ml-1" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Paths */}
      <Card className="glass-card">
        <CardHeader className="pb-2"><CardTitle className="text-base">Learning Paths</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {learningPaths.map((lp) => (
              <div key={lp.name} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                <div className="flex-1">
                  <p className="font-medium text-sm">{lp.name}</p>
                  <p className="text-xs text-muted-foreground">{lp.completed}/{lp.modules} modules completed</p>
                </div>
                <Progress value={lp.progress} className="w-32 h-2" />
                <span className="text-sm font-medium w-12 text-right">{lp.progress}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
