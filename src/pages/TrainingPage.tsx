import { motion } from "framer-motion";
import { BookOpen, TrendingUp, Target, Award, Brain, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useEffect, useState } from "react";
import api from "@/lib/api";

// Type definitions based on API response
interface SkillGap {
  skill: string;
  current: number;
  required: number;
}

interface GrowthPoint {
  month: string;
  score: number;
}

interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  category: string;
  enrolled_count: number;
  enrollment_id: number | null;
  status: string | null;
  progress: number | null;
}

interface LearningPath {
  name: string;
  progress: number;
  modules: number;
  completed: number;
}

interface TrainingStats {
  activePrograms: number;
  avgSkillScore: number;
  coursesCompleted: number;
  skillImprovement: number;
}

interface TrainingData {
  stats: TrainingStats;
  skillGaps: SkillGap[];
  growth: GrowthPoint[];
  courses: Course[];
  paths: LearningPath[];
}

const emptyTrainingData: TrainingData = {
  stats: {
    activePrograms: 0,
    avgSkillScore: 0,
    coursesCompleted: 0,
    skillImprovement: 0
  },
  skillGaps: [],
  growth: [],
  courses: [],
  paths: []
};

export default function TrainingPage() {
  const [data, setData] = useState<TrainingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/training/dashboard")
      .then((res) => {
        setData(res.data?.data || emptyTrainingData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching training data:", err);
        setError("Failed to load training data");
        setLoading(false);
      });
  }, []);

  const handleEnroll = async (courseId: number) => {
    try {
      await api.post("/training/enroll", { course_id: courseId });
      const updated = await api.get("/training/dashboard");
      setData(updated.data?.data || emptyTrainingData);
    } catch (err) {
      console.error("Error enrolling:", err);
      setError("Enrollment failed");
    }
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading training data...</p>
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

  const isEmpty =
    !data.skillGaps?.length && !data.growth?.length && !data.courses?.length && !data.paths?.length && (!data.stats || data.stats.activePrograms === 0);

  if (isEmpty) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div>
          <h1 className="page-header">Training & Development</h1>
          <p className="page-subheader">Skill gap analysis & learning paths</p>
        </div>
        <Card className="glass-card">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Start by adding skills, creating courses, and enrolling employees in training programs.</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const radarData = (data.skillGaps || []).map((gap) => ({
    skill: gap.skill,
    current: gap.current,
    required: gap.required
  }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="page-header">Training & Development</h1>
        <p className="page-subheader">AI-powered skill gap analysis & personalized learning paths</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Active Programs</span>
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xl font-bold">{data.stats.activePrograms}</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Avg Skill Score</span>
              <Target className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xl font-bold">{data.stats.avgSkillScore}%</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Courses Completed</span>
              <Award className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xl font-bold">{data.stats.coursesCompleted}</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Skill Improvement</span>
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xl font-bold">+{data.stats.skillImprovement}%</p>
          </CardContent>
        </Card>
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
              <BarChart data={data.growth}>
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
            {data.courses.map((c) => (
              <div key={c.id} className="p-4 rounded-lg border border-border bg-muted/20 hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-sm">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.duration || "—"} · {c.category || "—"}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">{c.enrolled_count} enrolled</Badge>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <Badge variant="secondary" className="text-xs">{c.category || "General"}</Badge>
                  {c.enrollment_id ? (
                    <Button size="sm" variant="outline" disabled>
                      {c.status === "completed" ? "Completed" : `Enrolled${typeof c.progress === "number" ? ` · ${c.progress}%` : ""}`}
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => void handleEnroll(c.id)}>
                      Enroll <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  )}
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
            {data.paths.map((lp) => (
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
