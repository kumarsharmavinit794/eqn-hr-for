import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FileText, FolderOpen, Download, Upload, Search, CreditCard, FileCheck, Plus, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";

interface DocumentStats {
  total_records: number;
  total_templates: number;
  pending_reviews: number;
  id_cards_issued: number;
}

interface EmployeeRecord {
  id: number;
  user_id: number;
  name: string;
  employee_code: string;
  total_documents: number;
  last_updated: string | null;
  status: string;
}

interface UserDirectoryItem {
  id: number;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
}

interface UserDocumentItem {
  id: number;
  user_id: number;
  file_name: string;
  file_type: string;
  uploaded_at: string | null;
}

interface ContractItem {
  id: number;
  title: string;
  type: string;
  used_count: number;
  last_modified: string | null;
}

interface OfferTemplateItem {
  id: number;
  title: string;
  level: string;
  department: string;
  content: string;
}

const statusColors: Record<string, string> = {
  complete: "bg-success/10 text-success",
  incomplete: "bg-warning/10 text-warning",
};

export default function DocumentsPage() {
  const role = (localStorage.getItem("role") || "").toLowerCase();
  const isAdmin = role === "admin";

  const [stats, setStats] = useState<DocumentStats>({ total_records: 0, total_templates: 0, pending_reviews: 0, id_cards_issued: 0 });
  const [records, setRecords] = useState<EmployeeRecord[]>([]);
  const [contracts, setContracts] = useState<ContractItem[]>([]);
  const [offers, setOffers] = useState<OfferTemplateItem[]>([]);
  const [userDirectory, setUserDirectory] = useState<UserDirectoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadUserId, setUploadUserId] = useState<string>("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const [docsDialogOpen, setDocsDialogOpen] = useState(false);
  const [docsOwner, setDocsOwner] = useState<EmployeeRecord | null>(null);
  const [userDocs, setUserDocs] = useState<UserDocumentItem[]>([]);

  const [contractDialogOpen, setContractDialogOpen] = useState(false);
  const [contractTitle, setContractTitle] = useState("");
  const [contractType, setContractType] = useState<"template" | "agreement">("template");
  const [contractFile, setContractFile] = useState<File | null>(null);

  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [templateTitle, setTemplateTitle] = useState("");
  const [templateLevel, setTemplateLevel] = useState("");
  const [templateDepartment, setTemplateDepartment] = useState("");
  const [templateContent, setTemplateContent] = useState("");

  const [idCardUserId, setIdCardUserId] = useState<string>("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const calls: Array<Promise<any>> = [api.get("/documents/stats"), api.get("/contracts"), api.get("/offer-templates")];
      if (isAdmin) {
        calls.push(api.get("/documents/records"));
        calls.push(api.get("/access/user-directory"));
      }
      const results = await Promise.all(calls);
      const statsRes = results[0];
      const contractsRes = results[1];
      const offersRes = results[2];

      setStats(statsRes.data?.data || { total_records: 0, total_templates: 0, pending_reviews: 0, id_cards_issued: 0 });
      setContracts(contractsRes.data?.data || []);
      setOffers(offersRes.data?.data || []);

      if (isAdmin) {
        const recordsRes = results[3];
        const usersRes = results[4];
        setRecords(recordsRes.data?.data || []);
        setUserDirectory(usersRes.data?.data || []);
      } else {
        setRecords([]);
        setUserDirectory([]);
      }
    } catch (err) {
      console.error(err);
      setStats({ total_records: 0, total_templates: 0, pending_reviews: 0, id_cards_issued: 0 });
      setRecords([]);
      setContracts([]);
      setOffers([]);
      setUserDirectory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredRecords = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return records;
    return records.filter((r) => r.name.toLowerCase().includes(q) || r.employee_code.toLowerCase().includes(q));
  }, [records, search]);

  const downloadBlob = (blob: Blob, filename: string) => {
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  };

  const handleUploadDocument = async () => {
    if (!uploadFile) return;
    setActionLoading(true);
    try {
      const form = new FormData();
      if (isAdmin && uploadUserId) {
        form.append("user_id", uploadUserId);
      }
      form.append("file", uploadFile);
      await api.post("/documents/upload", form, { headers: { "Content-Type": "multipart/form-data" } });
      setUploadDialogOpen(false);
      setUploadUserId("");
      setUploadFile(null);
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const openUserDocuments = async (record: EmployeeRecord) => {
    setDocsOwner(record);
    setUserDocs([]);
    setDocsDialogOpen(true);
    setActionLoading(true);
    try {
      const response = await api.get(`/documents/user/${record.user_id}`);
      setUserDocs(response.data?.data || []);
    } catch (err) {
      console.error(err);
      setUserDocs([]);
    } finally {
      setActionLoading(false);
    }
  };

  const downloadDocument = async (doc: UserDocumentItem) => {
    setActionLoading(true);
    try {
      const response = await api.get(`/documents/download/${doc.id}`, { responseType: "blob" });
      downloadBlob(new Blob([response.data]), doc.file_name || `document-${doc.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const uploadContract = async () => {
    if (!isAdmin || !contractTitle.trim() || !contractFile) return;
    setActionLoading(true);
    try {
      const form = new FormData();
      form.append("title", contractTitle.trim());
      form.append("type", contractType);
      form.append("file", contractFile);
      await api.post("/contracts", form, { headers: { "Content-Type": "multipart/form-data" } });
      setContractDialogOpen(false);
      setContractTitle("");
      setContractType("template");
      setContractFile(null);
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const downloadContract = async (contract: ContractItem) => {
    setActionLoading(true);
    try {
      const response = await api.get(`/contracts/download/${contract.id}`, { responseType: "blob" });
      const safeTitle = (contract.title || `contract-${contract.id}`).replace(/[\\/:*?\"<>|]/g, "_");
      downloadBlob(new Blob([response.data]), safeTitle);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const createTemplate = async () => {
    if (!isAdmin || !templateTitle.trim()) return;
    setActionLoading(true);
    try {
      await api.post("/offer-templates", {
        title: templateTitle.trim(),
        level: templateLevel.trim(),
        department: templateDepartment.trim(),
        content: templateContent,
      });
      setTemplateDialogOpen(false);
      setTemplateTitle("");
      setTemplateLevel("");
      setTemplateDepartment("");
      setTemplateContent("");
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const generateAndDownloadIdCard = async () => {
    if (!isAdmin || !idCardUserId) return;
    setActionLoading(true);
    try {
      await api.post(`/id-card/generate/${idCardUserId}`);
      const response = await api.get(`/id-card/${idCardUserId}`, { responseType: "blob" });
      downloadBlob(new Blob([response.data]), `id-card-${idCardUserId}.pdf`);
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Document Management</h1>
          <p className="page-subheader">Employee records, contracts, templates & ID card generation</p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Upload className="w-4 h-4 mr-1" /> Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {isAdmin ? (
                <div className="space-y-2">
                  <Label>Upload For User</Label>
                  <Select value={uploadUserId} onValueChange={setUploadUserId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {userDirectory.map((u) => (
                        <SelectItem key={u.id} value={String(u.id)}>
                          {u.fullName} ({u.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}

              <div className="space-y-2">
                <Label>File</Label>
                <input type="file" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} className="block w-full text-sm" />
                <p className="text-xs text-muted-foreground">Allowed: PDF, DOC, DOCX, PNG, JPG. Max size: 10 MB.</p>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setUploadDialogOpen(false)} disabled={actionLoading}>
                  Cancel
                </Button>
                <Button onClick={() => void handleUploadDocument()} disabled={actionLoading || !uploadFile}>
                  Upload
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Records", value: String(stats.total_records || 0), icon: FolderOpen },
          { label: "Templates", value: String(stats.total_templates || 0), icon: FileCheck },
          { label: "Pending Reviews", value: String(stats.pending_reviews || 0), icon: FileText },
          { label: "ID Cards Issued", value: String(stats.id_cards_issued || 0), icon: CreditCard },
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

      <Tabs defaultValue="records">
        <TabsList>
          <TabsTrigger value="records">Employee Records</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="offers">Offer Templates</TabsTrigger>
          <TabsTrigger value="idcard">ID Card Generator</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2 flex flex-row items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search records..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {!isAdmin ? <p className="text-sm text-muted-foreground">Employee records are available to admins only.</p> : null}
              {isAdmin && filteredRecords.length === 0 ? (
                <p className="text-sm text-muted-foreground">No records found. Upload documents to get started.</p>
              ) : null}
              {isAdmin
                ? filteredRecords.map((r) => (
                    <div key={r.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-primary-foreground text-xs font-semibold">
                        {r.name
                          .split(" ")
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{r.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {r.employee_code} · {r.total_documents} documents · Updated{" "}
                          {r.last_updated ? new Date(r.last_updated).toLocaleDateString() : "—"}
                        </p>
                      </div>
                      <Badge variant="outline" className={`text-xs ${statusColors[r.status] || "bg-muted text-muted-foreground"}`}>
                        {r.status}
                      </Badge>
                      <Button size="sm" variant="ghost" onClick={() => void openUserDocuments(r)} disabled={actionLoading}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                : null}
            </CardContent>
          </Card>

          <Dialog open={docsDialogOpen} onOpenChange={setDocsDialogOpen}>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Documents{docsOwner ? ` — ${docsOwner.name}` : ""}</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                {userDocs.length === 0 ? <p className="text-sm text-muted-foreground">No documents uploaded.</p> : null}
                {userDocs.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{doc.file_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.file_type ? doc.file_type.toUpperCase() : "FILE"} ·{" "}
                        {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleString() : "—"}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => void downloadDocument(doc)} disabled={actionLoading}>
                      <Download className="w-4 h-4 mr-1" /> Download
                    </Button>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="contracts" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Contracts</CardTitle>
              {isAdmin ? (
                <Dialog open={contractDialogOpen} onOpenChange={setContractDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-1" /> Upload Contract
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Upload Contract</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input value={contractTitle} onChange={(e) => setContractTitle(e.target.value)} placeholder="Contract title" />
                      </div>
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select value={contractType} onValueChange={(v) => setContractType(v as any)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="template">Template</SelectItem>
                            <SelectItem value="agreement">Agreement</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>File</Label>
                        <input type="file" onChange={(e) => setContractFile(e.target.files?.[0] || null)} className="block w-full text-sm" />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setContractDialogOpen(false)} disabled={actionLoading}>
                          Cancel
                        </Button>
                        <Button onClick={() => void uploadContract()} disabled={actionLoading || !contractTitle.trim() || !contractFile}>
                          Upload
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : null}
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {contracts.length === 0 ? <p className="text-sm text-muted-foreground">No contracts uploaded yet.</p> : null}
              {contracts.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{c.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Used {c.used_count} times · Modified {c.last_modified ? new Date(c.last_modified).toLocaleDateString() : "—"}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {c.type}
                  </Badge>
                  <Button size="sm" variant="outline" onClick={() => void downloadContract(c)} disabled={actionLoading}>
                    <Download className="w-4 h-4 mr-1" /> Download
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Offer Letter Templates</CardTitle>
              {isAdmin ? (
                <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-1" /> Create Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl">
                    <DialogHeader>
                      <DialogTitle>Create Offer Template</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input value={templateTitle} onChange={(e) => setTemplateTitle(e.target.value)} placeholder="Template title" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Level</Label>
                          <Input value={templateLevel} onChange={(e) => setTemplateLevel(e.target.value)} placeholder="e.g. Senior" />
                        </div>
                        <div className="space-y-2">
                          <Label>Department</Label>
                          <Input value={templateDepartment} onChange={(e) => setTemplateDepartment(e.target.value)} placeholder="e.g. Engineering" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Content</Label>
                        <Textarea value={templateContent} onChange={(e) => setTemplateContent(e.target.value)} rows={8} placeholder="Paste template HTML/text here" />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setTemplateDialogOpen(false)} disabled={actionLoading}>
                          Cancel
                        </Button>
                        <Button onClick={() => void createTemplate()} disabled={actionLoading || !templateTitle.trim()}>
                          Create
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : null}
            </CardHeader>
            <CardContent className="space-y-2">
              {offers.length === 0 ? <p className="text-sm text-muted-foreground">No templates created yet.</p> : null}
              {offers.map((o) => (
                <div key={o.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <FileCheck className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{o.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {o.level || "—"} · {o.department || "—"}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(o.content || "");
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    disabled={!o.content}
                  >
                    Use Template
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="idcard" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">ID Card Generator</CardTitle>
            </CardHeader>
            <CardContent>
              {!isAdmin ? <p className="text-sm text-muted-foreground">ID card generation is available to admins only.</p> : null}
              {isAdmin ? (
                <div className="space-y-4 max-w-lg mx-auto">
                  <div className="space-y-2">
                    <Label>Select User</Label>
                    <Select value={idCardUserId} onValueChange={setIdCardUserId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                      <SelectContent>
                        {userDirectory.map((u) => (
                          <SelectItem key={u.id} value={String(u.id)}>
                            {u.fullName} ({u.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="text-center">
                    <Button onClick={() => void generateAndDownloadIdCard()} disabled={actionLoading || !idCardUserId}>
                      <CreditCard className="w-4 h-4 mr-1" /> Generate & Download
                    </Button>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
