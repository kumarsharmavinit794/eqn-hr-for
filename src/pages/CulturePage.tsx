import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Shield, Globe, Megaphone, FileText, Users, Star, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";

type SafetyStatus = "completed" | "scheduled" | "active";

interface CultureMetric {
  id: number;
  label: string;
  value: string;
  description: string;
}

interface Policy {
  id: number;
  name: string;
  category: string;
  views: number;
  last_updated: string;
  content: string;
}

interface SafetyRecord {
  id: number;
  title: string;
  status: SafetyStatus | string;
  date: string;
  score: number | null;
}

interface CultureScore {
  id: number;
  metric_name: string;
  score: number;
}

interface CareerSection {
  id: number;
  title: string;
  content: string;
}

interface BrandingPlatform {
  id: number;
  platform_name: string;
  followers: string;
  posts: number;
  engagement: string;
}

export default function CulturePage() {
  const [metrics, setMetrics] = useState<CultureMetric[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [safety, setSafety] = useState<SafetyRecord[]>([]);
  const [scores, setScores] = useState<CultureScore[]>([]);
  const [career, setCareer] = useState<CareerSection[]>([]);
  const [branding, setBranding] = useState<BrandingPlatform[]>([]);
  const [loading, setLoading] = useState(true);

  const [policyDialogOpen, setPolicyDialogOpen] = useState(false);
  const [activePolicy, setActivePolicy] = useState<Policy | null>(null);

  const [careerDialogOpen, setCareerDialogOpen] = useState(false);
  const [activeCareer, setActiveCareer] = useState<CareerSection | null>(null);
  const [careerDraft, setCareerDraft] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [m, p, s, c, cs, b] = await Promise.all([
        api.get("/culture/metrics"),
        api.get("/culture/policies"),
        api.get("/culture/safety"),
        api.get("/culture/scores"),
        api.get("/culture/career"),
        api.get("/culture/branding"),
      ]);
      setMetrics(m.data?.data || []);
      setPolicies(p.data?.data || []);
      setSafety(s.data?.data || []);
      setScores(c.data?.data || []);
      setCareer(cs.data?.data || []);
      setBranding(b.data?.data || []);
    } catch (err) {
      console.error(err);
      setMetrics([]);
      setPolicies([]);
      setSafety([]);
      setScores([]);
      setCareer([]);
      setBranding([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  const scoreItems = useMemo(() => {
    return scores
      .map((item) => ({
        metric: item.metric_name,
        score: Math.max(0, Math.min(100, Number(item.score) || 0)),
      }))
      .sort((a, b) => b.score - a.score);
  }, [scores]);

  const handleViewPolicy = async (policy: Policy) => {
    setActivePolicy(policy);
    setPolicyDialogOpen(true);
    try {
      const res = await api.patch(`/culture/policies/${policy.id}`, { increment_views: true });
      const nextViews = res.data?.data?.views;
      if (typeof nextViews === "number") {
        setPolicies((prev) => prev.map((item) => (item.id === policy.id ? { ...item, views: nextViews } : item)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openCareerEditor = (section: CareerSection) => {
    setActiveCareer(section);
    setCareerDraft(section.content || "");
    setCareerDialogOpen(true);
  };

  const saveCareerSection = async () => {
    if (!activeCareer) return;
    try {
      await api.patch(`/culture/career/${activeCareer.id}`, { content: careerDraft });
      setCareerDialogOpen(false);
      setActiveCareer(null);
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="page-header">Culture & Branding</h1>
        <p className="page-subheader">Company culture, workplace safety, career page & employer branding</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(metrics || []).map((m) => (
          <Card key={m.label} className="glass-card">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className="text-2xl font-bold mt-1">{m.value}</p>
              <p className="text-xs text-primary mt-1">{m.description}</p>
            </CardContent>
          </Card>
        ))}
        {(metrics || []).length === 0 && (
          <Card className="glass-card col-span-2 lg:col-span-4">
            <CardContent className="p-4 text-sm text-muted-foreground">No culture metrics found.</CardContent>
          </Card>
        )}
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
              {(policies || []).map((p) => (
                <div key={p.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.views} views · Updated {p.last_updated}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">{p.category}</Badge>
                  <Button size="sm" variant="ghost" onClick={() => void handleViewPolicy(p)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {(policies || []).length === 0 && <p className="text-sm text-muted-foreground">No policies available.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="safety" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Shield className="w-4 h-4" /> Employee Safety Dashboard</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {(safety || []).map((s) => (
                <div key={s.id} className="p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">{s.title}</p>
                    <Badge variant="outline" className={`text-xs capitalize ${s.status === "completed" ? "bg-success/10 text-success" : s.status === "scheduled" ? "bg-info/10 text-info" : "bg-primary/10 text-primary"}`}>{s.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{s.date}</span>
                    {typeof s.score === "number" ? (
                      <div className="flex items-center gap-2">
                        <Progress value={s.score} className="w-20 h-1.5" />
                        <span className="text-xs font-medium">{s.score}%</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
              {(safety || []).length === 0 && <p className="text-sm text-muted-foreground">No safety records available.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="culture" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Heart className="w-4 h-4" /> Work Culture Tracker</CardTitle></CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {(scoreItems || []).map((c) => (
                  <div key={c.metric} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{c.metric}</p>
                    </div>
                    <Progress value={c.score} className="w-24 h-2" />
                    <span className="text-sm font-medium w-10 text-right">{c.score}%</span>
                  </div>
                ))}
                {(scoreItems || []).length === 0 && <p className="text-sm text-muted-foreground">No culture scores available.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="career" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Globe className="w-4 h-4" /> Career Page Manager</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(career || []).map((s) => (
                  <div key={s.title} className="p-4 rounded-lg border border-border bg-muted/20">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-sm">{s.title}</p>
                      <Button size="sm" variant="outline" onClick={() => openCareerEditor(s)}>
                        Edit
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{s.content}</p>
                  </div>
                ))}
                {(career || []).length === 0 && <p className="text-sm text-muted-foreground">No career sections available.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Megaphone className="w-4 h-4" /> Social Hiring & Employer Branding</CardTitle></CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-3">
                {(branding || []).map((p) => (
                  <div key={p.id} className="p-4 rounded-lg border border-border bg-muted/20 text-center">
                    <p className="font-semibold text-sm">{p.platform_name}</p>
                    <p className="text-xl font-bold mt-2">{p.followers}</p>
                    <p className="text-xs text-muted-foreground">{p.posts} posts · {p.engagement} engagement</p>
                    <Button size="sm" variant="outline" className="mt-3">Manage</Button>
                  </div>
                ))}
                {(branding || []).length === 0 && <p className="text-sm text-muted-foreground">No branding platforms available.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={policyDialogOpen} onOpenChange={setPolicyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{activePolicy?.name || "Policy"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 text-sm text-muted-foreground whitespace-pre-wrap">
            {activePolicy?.content || "No content available."}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={careerDialogOpen} onOpenChange={setCareerDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit: {activeCareer?.title || "Career Section"}</DialogTitle>
          </DialogHeader>
          <Textarea value={careerDraft} onChange={(e) => setCareerDraft(e.target.value)} className="min-h-[220px]" />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCareerDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void saveCareerSection()}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
