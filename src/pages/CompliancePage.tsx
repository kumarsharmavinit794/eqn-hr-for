import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Shield, FileText, AlertTriangle, CheckCircle2, Clock, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/lib/api";

type ComplianceStatus = "compliant" | "attention" | "non-compliant";
type PolicyStatus = "active" | "review" | "inactive";
type AuditStatus = "passed" | "needs-review";

interface ComplianceLaw {
  id: number;
  law_name: string;
  status: ComplianceStatus;
  last_audit: string | null;
  next_audit: string | null;
}

interface CompanyPolicy {
  id: number;
  name: string;
  version: string;
  status: PolicyStatus;
  updated_at: string;
  content: string;
}

interface LegalDocument {
  id: number;
  title: string;
  category: string;
  file_path: string;
  created_at: string;
}

interface AuditRecord {
  id: number;
  area_name: string;
  score: number;
  findings: number;
  status: AuditStatus;
  created_at: string;
}

const statusColors: Record<string, string> = {
  compliant: "bg-success/10 text-success", attention: "bg-warning/10 text-warning", "non-compliant": "bg-destructive/10 text-destructive",
};

export default function CompliancePage() {
  const [laws, setLaws] = useState<ComplianceLaw[]>([]);
  const [policies, setPolicies] = useState<CompanyPolicy[]>([]);
  const [audit, setAudit] = useState<AuditRecord[]>([]);
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [compliancePercent, setCompliancePercent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [policyDialogOpen, setPolicyDialogOpen] = useState(false);
  const [activePolicy, setActivePolicy] = useState<CompanyPolicy | null>(null);

  const [createLawOpen, setCreateLawOpen] = useState(false);
  const [lawName, setLawName] = useState("");
  const [lawStatus, setLawStatus] = useState<ComplianceStatus>("attention");
  const [lawLastAudit, setLawLastAudit] = useState("");
  const [lawNextAudit, setLawNextAudit] = useState("");

  const [createPolicyOpen, setCreatePolicyOpen] = useState(false);
  const [policyName, setPolicyName] = useState("");
  const [policyVersion, setPolicyVersion] = useState("");
  const [policyStatus, setPolicyStatus] = useState<PolicyStatus>("active");
  const [policyUpdatedAt, setPolicyUpdatedAt] = useState("");
  const [policyContent, setPolicyContent] = useState("");

  const [createAuditOpen, setCreateAuditOpen] = useState(false);
  const [auditArea, setAuditArea] = useState("");
  const [auditScore, setAuditScore] = useState("90");
  const [auditFindings, setAuditFindings] = useState("0");
  const [auditStatus, setAuditStatus] = useState<AuditStatus>("passed");

  const [uploadDocOpen, setUploadDocOpen] = useState(false);
  const [docTitle, setDocTitle] = useState("");
  const [docCategory, setDocCategory] = useState("");
  const [docFile, setDocFile] = useState<File | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [lawsRes, policiesRes, auditRes, docsRes] = await Promise.all([
        api.get("/compliance/laws"),
        api.get("/compliance/policies"),
        api.get("/compliance/audit"),
        api.get("/compliance/legal-docs"),
      ]);
      const lawsPayload = lawsRes.data?.data;
      setCompliancePercent(lawsPayload?.compliance_percent || 0);
      setLaws(lawsPayload?.laws || []);
      setPolicies(policiesRes.data?.data || []);
      setAudit(auditRes.data?.data || []);
      setDocuments(docsRes.data?.data || []);
    } catch (err) {
      console.error(err);
      setCompliancePercent(0);
      setLaws([]);
      setPolicies([]);
      setAudit([]);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  const compliantCount = useMemo(() => laws.filter((item) => item.status === "compliant").length, [laws]);
  const openFindings = useMemo(
    () => audit.filter((item) => item.status === "needs-review").reduce((sum, item) => sum + (item.findings || 0), 0),
    [audit],
  );
  const nextAudit = useMemo(() => {
    const dates = laws.map((item) => item.next_audit).filter(Boolean) as string[];
    dates.sort();
    return dates[0] || "-";
  }, [laws]);

  const handleChangeLawStatus = async (lawId: number, status: ComplianceStatus) => {
    setActionLoading(true);
    try {
      await api.patch(`/compliance/laws/${lawId}`, { status });
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const createLaw = async () => {
    const name = lawName.trim();
    if (!name) return;
    setActionLoading(true);
    try {
      await api.post("/compliance/laws", {
        law_name: name,
        status: lawStatus,
        last_audit: lawLastAudit || null,
        next_audit: lawNextAudit || null,
      });
      setCreateLawOpen(false);
      setLawName("");
      setLawStatus("attention");
      setLawLastAudit("");
      setLawNextAudit("");
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const createPolicy = async () => {
    const name = policyName.trim();
    if (!name) return;
    setActionLoading(true);
    try {
      await api.post("/compliance/policies", {
        name,
        version: policyVersion.trim(),
        status: policyStatus,
        updated_at: policyUpdatedAt || null,
        content: policyContent,
      });
      setCreatePolicyOpen(false);
      setPolicyName("");
      setPolicyVersion("");
      setPolicyStatus("active");
      setPolicyUpdatedAt("");
      setPolicyContent("");
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const viewPolicy = (policy: CompanyPolicy) => {
    setActivePolicy(policy);
    setPolicyDialogOpen(true);
  };

  const createAudit = async () => {
    const area = auditArea.trim();
    if (!area) return;
    setActionLoading(true);
    try {
      await api.post("/compliance/audit", {
        area_name: area,
        score: Number(auditScore),
        findings: Number(auditFindings),
        status: auditStatus,
      });
      setCreateAuditOpen(false);
      setAuditArea("");
      setAuditScore("90");
      setAuditFindings("0");
      setAuditStatus("passed");
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const uploadDocument = async () => {
    if (!docTitle.trim() || !docFile) return;
    setActionLoading(true);
    try {
      const form = new FormData();
      form.append("title", docTitle.trim());
      form.append("category", docCategory.trim());
      form.append("file", docFile);
      await api.post("/compliance/legal-docs", form, { headers: { "Content-Type": "multipart/form-data" } });
      setUploadDocOpen(false);
      setDocTitle("");
      setDocCategory("");
      setDocFile(null);
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const downloadDocument = async (doc: LegalDocument) => {
    setActionLoading(true);
    try {
      const response = await api.get(`/compliance/legal-docs/${doc.id}/download`, { responseType: "blob" });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = doc.title || `document-${doc.id}`;
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

  if (loading) return <p>Loading...</p>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="page-header">Compliance & Legal</h1>
        <p className="page-subheader">Labor law compliance, company policies & audit management</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Overall Compliance", value: `${compliancePercent}%`, icon: Shield },
          { label: "Active Policies", value: policies.filter((p) => p.status === "active").length.toString(), icon: FileText },
          { label: "Open Findings", value: openFindings.toString(), icon: AlertTriangle },
          { label: "Next Audit", value: nextAudit, icon: Clock },
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

      <Tabs defaultValue="compliance">
        <TabsList>
          <TabsTrigger value="compliance">Labor Laws</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="legal">Legal Docs</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
        </TabsList>

        <TabsContent value="compliance" className="mt-4">
          <Card className="glass-card">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-end">
                <Dialog open={createLawOpen} onOpenChange={setCreateLawOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      Add Law
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Add Compliance Law</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Law Name</Label>
                        <Input value={lawName} onChange={(e) => setLawName(e.target.value)} placeholder="e.g., POSH Act 2013" />
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={lawStatus} onValueChange={(value: ComplianceStatus) => setLawStatus(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="compliant">compliant</SelectItem>
                            <SelectItem value="attention">attention</SelectItem>
                            <SelectItem value="non-compliant">non-compliant</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Last Audit</Label>
                          <Input value={lawLastAudit} onChange={(e) => setLawLastAudit(e.target.value)} placeholder="YYYY-MM-DD" />
                        </div>
                        <div className="space-y-2">
                          <Label>Next Audit</Label>
                          <Input value={lawNextAudit} onChange={(e) => setLawNextAudit(e.target.value)} placeholder="YYYY-MM-DD" />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setCreateLawOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => void createLaw()} disabled={actionLoading}>
                          Create
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {laws.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  {c.status === "compliant" ? (
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  ) : c.status === "attention" ? (
                    <AlertTriangle className="w-4 h-4 text-warning" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{c.law_name}</p>
                    <p className="text-xs text-muted-foreground">
                      Last: {c.last_audit || "-"} · Next: {c.next_audit || "-"}
                    </p>
                  </div>
                  <Select
                    value={c.status}
                    onValueChange={(value: ComplianceStatus) => void handleChangeLawStatus(c.id, value)}
                    disabled={actionLoading}
                  >
                    <SelectTrigger className="h-8 w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compliant">compliant</SelectItem>
                      <SelectItem value="attention">attention</SelectItem>
                      <SelectItem value="non-compliant">non-compliant</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge variant="outline" className={`text-xs capitalize ${statusColors[c.status]}`}>
                    {c.status}
                  </Badge>
                </div>
              ))}
              {laws.length === 0 && <p className="text-sm text-muted-foreground">No laws available.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="mt-4">
          <Card className="glass-card">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-end">
                <Dialog open={createPolicyOpen} onOpenChange={setCreatePolicyOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      Add Policy
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create Policy</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input value={policyName} onChange={(e) => setPolicyName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Version</Label>
                          <Input value={policyVersion} onChange={(e) => setPolicyVersion(e.target.value)} placeholder="e.g., v1.0" />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Status</Label>
                          <Select value={policyStatus} onValueChange={(value: PolicyStatus) => setPolicyStatus(value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">active</SelectItem>
                              <SelectItem value="review">review</SelectItem>
                              <SelectItem value="inactive">inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Updated At</Label>
                          <Input value={policyUpdatedAt} onChange={(e) => setPolicyUpdatedAt(e.target.value)} placeholder="YYYY-MM-DD" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Content</Label>
                        <Textarea value={policyContent} onChange={(e) => setPolicyContent(e.target.value)} className="min-h-[180px]" />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setCreatePolicyOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => void createPolicy()} disabled={actionLoading}>
                          Create
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {policies.map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.version} · Updated {p.updated_at}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs capitalize">
                    {p.status}
                  </Badge>
                  <Button size="sm" variant="ghost" onClick={() => viewPolicy(p)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {policies.length === 0 && <p className="text-sm text-muted-foreground">No policies available.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal" className="mt-4">
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex justify-end mb-3">
                <Dialog open={uploadDocOpen} onOpenChange={setUploadDocOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      Upload Document
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Upload Legal Document</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input value={docTitle} onChange={(e) => setDocTitle(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Input value={docCategory} onChange={(e) => setDocCategory(e.target.value)} placeholder="e.g., NDA" />
                      </div>
                      <div className="space-y-2">
                        <Label>File (PDF/DOC/DOCX)</Label>
                        <Input type="file" onChange={(e) => setDocFile(e.target.files?.[0] || null)} />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setUploadDocOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => void uploadDocument()} disabled={actionLoading || !docFile}>
                          Upload
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {documents.map((d) => (
                  <div key={d.id} className="p-4 rounded-lg border border-border bg-muted/20 flex items-center gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{d.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {d.category || "Uncategorized"} · {new Date(d.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => void downloadDocument(d)} disabled={actionLoading}>
                      View
                    </Button>
                  </div>
                ))}
                {documents.length === 0 && <p className="text-sm text-muted-foreground">No legal documents uploaded.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-4">
          <Card className="glass-card">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-end">
                <Dialog open={createAuditOpen} onOpenChange={setCreateAuditOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      Add Audit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Add Audit Entry</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Area</Label>
                        <Input value={auditArea} onChange={(e) => setAuditArea(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Score</Label>
                          <Input value={auditScore} onChange={(e) => setAuditScore(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Findings</Label>
                          <Input value={auditFindings} onChange={(e) => setAuditFindings(e.target.value)} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={auditStatus} onValueChange={(value: AuditStatus) => setAuditStatus(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="passed">passed</SelectItem>
                            <SelectItem value="needs-review">needs-review</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setCreateAuditOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => void createAudit()} disabled={actionLoading}>
                          Create
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {audit.map((a) => (
                <div key={a.id} className="p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">{a.area_name}</p>
                    <Badge variant="outline" className={`text-xs ${a.status === "passed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{a.status}</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={a.score} className="h-2 flex-1" />
                    <span className="text-sm font-medium">{a.score}%</span>
                    <span className="text-xs text-muted-foreground">{a.findings} findings</span>
                  </div>
                </div>
              ))}
              {audit.length === 0 && <p className="text-sm text-muted-foreground">No audit records available.</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={policyDialogOpen} onOpenChange={setPolicyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{activePolicy?.name || "Policy"}</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground whitespace-pre-wrap">{activePolicy?.content || "No content."}</div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
