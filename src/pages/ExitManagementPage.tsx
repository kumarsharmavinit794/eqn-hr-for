import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { UserMinus, FileText, DollarSign, MessageSquare, CheckCircle2, Circle, Package, Send, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/lib/api";

type ExitStatus = "initiated" | "in-progress" | "completed";
type AssetStatus = "returned" | "pending" | "lost" | "not_applicable";

interface ExitCase {
  id: number;
  name: string;
  role: string;
  last_day: string;
  reason: string;
  status: ExitStatus;
  progress: number;
}

interface WorkflowStep {
  id: number;
  step_name: string;
  step_order: number;
  completed: boolean;
  completed_at?: string | null;
}

interface ExitAsset {
  id: number;
  asset_name: string;
  status: AssetStatus;
}

interface SettlementItem {
  id: number;
  item_name: string;
  amount: number;
}

interface ExitSettlement {
  earnings: SettlementItem[];
  deductions: SettlementItem[];
  totals: { total_earnings: number; total_deductions: number; net: number };
}

interface ExitLetter {
  id: number;
  content: string;
  generated_at: string;
}

interface FeedbackRecord {
  id: number;
  message: string;
  response: string;
  created_at: string;
}

const assetStatusColors: Record<string, string> = {
  returned: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  lost: "bg-destructive/10 text-destructive",
  not_applicable: "bg-muted text-muted-foreground",
};

export default function ExitManagementPage() {
  const [exitCases, setExitCases] = useState<ExitCase[]>([]);
  const [selectedExitCaseId, setSelectedExitCaseId] = useState<number | null>(null);
  const [workflow, setWorkflow] = useState<WorkflowStep[]>([]);
  const [assets, setAssets] = useState<ExitAsset[]>([]);
  const [settlement, setSettlement] = useState<ExitSettlement | null>(null);
  const [letter, setLetter] = useState<ExitLetter | null>(null);
  const [feedback, setFeedback] = useState<FeedbackRecord[]>([]);
  const [feedbackInput, setFeedbackInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [createRole, setCreateRole] = useState("");
  const [createLastDay, setCreateLastDay] = useState("");
  const [createReason, setCreateReason] = useState("");

  const selectedExitCase = useMemo(() => exitCases.find((item) => item.id === selectedExitCaseId) || null, [exitCases, selectedExitCaseId]);

  const fetchExitDetails = async (exitCaseId: number) => {
    const [wf, asset, settle, letterRes] = await Promise.all([
      api.get(`/exit-workflow/${exitCaseId}`),
      api.get(`/exit-assets/${exitCaseId}`),
      api.get(`/exit-settlement/${exitCaseId}`),
      api.get(`/exit-letter/${exitCaseId}`).catch(() => null),
    ]);
    setWorkflow(wf.data?.data || []);
    setAssets(asset.data?.data || []);
    setSettlement(settle.data?.data || null);
    setLetter(letterRes?.data?.data || null);
    setFeedback([]);
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const casesRes = await api.get("/exit-cases");
      const cases = (casesRes.data?.data || []) as ExitCase[];
      setExitCases(cases);

      if (cases.length > 0) {
        const id = cases[0].id;
        setSelectedExitCaseId(id);
        await fetchExitDetails(id);
      } else {
        setSelectedExitCaseId(null);
        setWorkflow([]);
        setAssets([]);
        setSettlement(null);
        setLetter(null);
        setFeedback([]);
      }
    } catch (err) {
      console.error(err);
      setExitCases([]);
      setSelectedExitCaseId(null);
      setWorkflow([]);
      setAssets([]);
      setSettlement(null);
      setLetter(null);
      setFeedback([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchAll();
  }, []);

  const handleSelectExitCase = async (exitCaseId: number) => {
    setSelectedExitCaseId(exitCaseId);
    setActionLoading(true);
    try {
      await fetchExitDetails(exitCaseId);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStep = async (step: WorkflowStep) => {
    if (!selectedExitCaseId) return;
    setActionLoading(true);
    try {
      await api.patch(`/exit-workflow/${step.id}`, { completed: !step.completed });
      const casesRes = await api.get("/exit-cases");
      const cases = (casesRes.data?.data || []) as ExitCase[];
      setExitCases(cases);
      await fetchExitDetails(selectedExitCaseId);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateAssetStatus = async (assetId: number, status: AssetStatus) => {
    if (!selectedExitCaseId) return;
    setActionLoading(true);
    try {
      await api.patch(`/exit-assets/${assetId}`, { status });
      await fetchExitDetails(selectedExitCaseId);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendFeedback = async () => {
    if (!selectedExitCaseId) return;
    const message = feedbackInput.trim();
    if (!message) return;

    setActionLoading(true);
    try {
      const res = await api.post("/exit-feedback", { exit_case_id: selectedExitCaseId, message });
      const record = res.data?.data as FeedbackRecord;
      setFeedback((prev) => [...prev, record]);
      setFeedbackInput("");
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateExitCase = async () => {
    const lastDay = createLastDay.trim();
    const reason = createReason.trim();
    if (!lastDay || !reason) return;

    setActionLoading(true);
    try {
      await api.post("/exit-cases", { last_day: lastDay, reason, role: createRole.trim() });
      setCreateOpen(false);
      setCreateRole("");
      setCreateLastDay("");
      setCreateReason("");
      await fetchAll();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadLetter = async () => {
    if (!selectedExitCaseId) return;
    setActionLoading(true);
    try {
      const response = await api.get(`/exit-letter/${selectedExitCaseId}/pdf`, { responseType: "blob" });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `experience-letter-${selectedExitCaseId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="page-header">Exit Management</h1>
        <p className="page-subheader">Resignation workflow, final settlement & experience letter generation</p>
      </div>

      {/* Active Cases */}
      <div className="grid sm:grid-cols-3 gap-4">
        {loading ? (
          <Card className="glass-card-hover sm:col-span-3">
            <CardContent className="p-5 text-sm text-muted-foreground">Loading exit cases...</CardContent>
          </Card>
        ) : exitCases.length === 0 ? (
          <Card className="glass-card-hover sm:col-span-3">
            <CardContent className="p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">No exit cases</p>
                <p className="text-sm text-muted-foreground">Start a resignation workflow to track tasks, assets, and settlement.</p>
              </div>
              <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">Start Exit Case</Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Create Exit Case</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input value={createRole} onChange={(e) => setCreateRole(e.target.value)} placeholder="e.g., DevOps Engineer" />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Working Day</Label>
                      <Input value={createLastDay} onChange={(e) => setCreateLastDay(e.target.value)} placeholder="YYYY-MM-DD" />
                    </div>
                    <div className="space-y-2">
                      <Label>Reason</Label>
                      <Textarea value={createReason} onChange={(e) => setCreateReason(e.target.value)} placeholder="Share your reason for resignation..." />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setCreateOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateExitCase} disabled={actionLoading}>
                        Create
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ) : (
          exitCases.map((e) => (
            <Card
              key={e.id}
              className={`glass-card-hover cursor-pointer ${e.id === selectedExitCaseId ? "ring-2 ring-primary/30" : ""}`}
              onClick={() => void handleSelectExitCase(e.id)}
            >
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <UserMinus className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{e.name}</p>
                  <p className="text-xs text-muted-foreground">{e.role}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-1">Last Day: {e.last_day} · {e.reason}</p>
              <div className="flex items-center gap-2">
                <Progress value={e.progress} className="h-2 flex-1" />
                <span className="text-xs font-medium">{e.progress}%</span>
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>

      <Tabs defaultValue="workflow">
        <TabsList>
          <TabsTrigger value="workflow">Resignation Workflow</TabsTrigger>
          <TabsTrigger value="settlement">Final Settlement</TabsTrigger>
          <TabsTrigger value="assets">Asset Return</TabsTrigger>
          <TabsTrigger value="letter">Experience Letter</TabsTrigger>
          <TabsTrigger value="chatbot">Exit Interview Bot</TabsTrigger>
        </TabsList>

        <TabsContent value="workflow" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Resignation Steps{selectedExitCase ? ` — ${selectedExitCase.name}` : ""}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {!selectedExitCaseId ? (
                <p className="text-sm text-muted-foreground">Select or create an exit case to view workflow steps.</p>
              ) : actionLoading ? (
                <p className="text-sm text-muted-foreground">Loading workflow...</p>
              ) : workflow.length === 0 ? (
                <p className="text-sm text-muted-foreground">No workflow steps found.</p>
              ) : (
                workflow.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => void handleToggleStep(s)}
                    className="w-full text-left flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/40 transition-colors"
                    disabled={actionLoading}
                  >
                    {s.completed ? <CheckCircle2 className="w-5 h-5 text-success" /> : <Circle className="w-5 h-5 text-muted-foreground" />}
                    <span className={`text-sm flex-1 ${s.completed ? "line-through text-muted-foreground" : ""}`}>{s.step_name}</span>
                    <span className="text-xs text-muted-foreground">Step {s.step_order}</span>
                  </button>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settlement" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><DollarSign className="w-4 h-4" /> Full & Final Settlement</CardTitle></CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-semibold text-success mb-2">Earnings</p>
                  <div className="space-y-2">
                    {(settlement?.earnings || []).length === 0 ? (
                      <p className="text-sm text-muted-foreground">No earnings added yet.</p>
                    ) : (
                      settlement?.earnings.map((e) => (
                        <div key={e.id} className="flex justify-between text-sm p-2 rounded bg-muted/30">
                          <span>{e.item_name}</span>
                          <span className="font-medium">₹{e.amount.toLocaleString()}</span>
                        </div>
                      ))
                    )}
                    <div className="flex justify-between text-sm font-bold pt-2 border-t border-border">
                      <span>Total Earnings</span><span className="text-success">₹{(settlement?.totals.total_earnings || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-destructive mb-2">Deductions</p>
                  <div className="space-y-2">
                    {(settlement?.deductions || []).length === 0 ? (
                      <p className="text-sm text-muted-foreground">No deductions added yet.</p>
                    ) : (
                      settlement?.deductions.map((d) => (
                        <div key={d.id} className="flex justify-between text-sm p-2 rounded bg-muted/30">
                          <span>{d.item_name}</span>
                          <span className="font-medium">₹{d.amount.toLocaleString()}</span>
                        </div>
                      ))
                    )}
                    <div className="flex justify-between text-sm font-bold pt-2 border-t border-border">
                      <span>Total Deductions</span><span className="text-destructive">₹{(settlement?.totals.total_deductions || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 rounded-lg gradient-bg text-primary-foreground text-center">
                <p className="text-sm">Net Settlement Amount</p>
                <p className="text-2xl font-bold">₹{(settlement?.totals.net || 0).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assets" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Package className="w-4 h-4" /> Asset Return Checklist</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {!selectedExitCaseId ? (
                <p className="text-sm text-muted-foreground">Select or create an exit case to view assets.</p>
              ) : assets.length === 0 ? (
                <p className="text-sm text-muted-foreground">No assets found.</p>
              ) : (
                assets.map((a) => (
                  <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    {a.status === "returned" ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Circle className="w-4 h-4 text-muted-foreground" />}
                    <span className="text-sm flex-1">{a.asset_name}</span>
                    <Select value={a.status} onValueChange={(value: AssetStatus) => void handleUpdateAssetStatus(a.id, value)} disabled={actionLoading}>
                      <SelectTrigger className="h-8 w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">pending</SelectItem>
                        <SelectItem value="returned">returned</SelectItem>
                        <SelectItem value="lost">lost</SelectItem>
                        <SelectItem value="not_applicable">not_applicable</SelectItem>
                      </SelectContent>
                    </Select>
                    <Badge variant="outline" className={`text-xs capitalize ${assetStatusColors[a.status]}`}>{a.status}</Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="letter" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base">Experience Letter Generator</CardTitle></CardHeader>
            <CardContent>
              <div className="p-6 border border-border rounded-lg bg-muted/10 max-w-lg mx-auto">
                <div className="text-center mb-6">
                  <p className="text-lg font-bold gradient-text">NexaHR Technologies</p>
                  <p className="text-xs text-muted-foreground">Certificate of Employment</p>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground">
                  {!selectedExitCaseId ? (
                    <p>Select or create an exit case to generate an experience letter.</p>
                  ) : letter?.content ? (
                    letter.content.split("\n").map((line, idx) => <p key={idx}>{line || "\u00A0"}</p>)
                  ) : (
                    <p className="text-sm text-muted-foreground">Letter not generated yet.</p>
                  )}
                </div>
              </div>
              <div className="text-center mt-4">
                <Button onClick={() => void handleDownloadLetter()} disabled={!selectedExitCaseId || actionLoading}>
                  <Download className="w-4 h-4 mr-1" /> Download Letter (PDF)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chatbot" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Exit Interview Chatbot</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                {feedback.length === 0 ? (
                  <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center shrink-0"><MessageSquare className="w-3 h-3 text-primary-foreground" /></div>
                    <div className="glass-card rounded-xl px-3 py-2 text-sm max-w-[80%]">
                      Share your feedback here. Your message will be saved securely, and may receive an automated follow-up if enabled.
                    </div>
                  </div>
                ) : (
                  feedback.map((item) => (
                    <div key={item.id} className="space-y-2">
                      <div className="flex gap-2 justify-end">
                        <div className="glass-card rounded-xl px-3 py-2 text-sm max-w-[80%] bg-primary/10">{item.message}</div>
                      </div>
                      {item.response ? (
                        <div className="flex gap-2">
                          <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center shrink-0"><MessageSquare className="w-3 h-3 text-primary-foreground" /></div>
                          <div className="glass-card rounded-xl px-3 py-2 text-sm max-w-[80%]">{item.response}</div>
                        </div>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <Input value={feedbackInput} onChange={(e) => setFeedbackInput(e.target.value)} placeholder="Share your feedback..." className="flex-1" />
                <Button size="sm" onClick={() => void handleSendFeedback()} disabled={!selectedExitCaseId || actionLoading}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
