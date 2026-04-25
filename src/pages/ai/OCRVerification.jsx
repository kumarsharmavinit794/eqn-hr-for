import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRightLeft,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  Eye,
  File,
  FileCheck2,
  FileImage,
  FileSearch,
  FileText,
  Fingerprint,
  History,
  ImagePlus,
  Layers3,
  Loader2,
  RefreshCw,
  ScanLine,
  SearchCheck,
  ShieldAlert,
  ShieldCheck,
  Upload,
  UserRoundSearch,
  X,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const storageKey = "ocrVerificationHistory";
const validTypes = ["image/jpeg", "image/png", "application/pdf"];
const workflowSteps = [
  { id: "upload", label: "Upload", detail: "Document and selfie attached" },
  { id: "ocr", label: "OCR", detail: "Multi-page extraction complete" },
  { id: "validation", label: "Validation", detail: "Rules and fraud checks" },
  { id: "approval", label: "Approval", detail: "Ready for reviewer decision" },
];

const dataset = [
  {
    type: "Passport",
    holderName: "Riya Sharma",
    documentNumber: "N4582217",
    dob: "1994-08-14",
    address: "12 Residency Road, Bengaluru",
    expiryDate: "2032-08-14",
    issuingCountry: "India",
    pages: 2,
    faceMatch: 96,
    textConfidence: 97,
    imageQuality: 92,
    fieldAccuracy: 95,
    fraudScore: 8,
    duplicateMatch: "No duplicate match found",
    comparisonMatch: 98,
    databaseStatus: "Employee master record aligned",
    insights: ["Image quality is production ready", "MRZ and primary identity fields are fully visible"],
    validationRules: [
      { label: "Passport number format", status: "pass" },
      { label: "Date of birth is valid", status: "pass" },
      { label: "Expiry date still active", status: "pass" },
    ],
    fraudSignals: [
      { label: "Edited document risk", score: 7, status: "low" },
      { label: "Template tampering risk", score: 9, status: "low" },
      { label: "Duplicate identity risk", score: 8, status: "low" },
    ],
    extractedFields: [
      { label: "Name", value: "Riya Sharma", confidence: 98 },
      { label: "Document Number", value: "N4582217", confidence: 97 },
      { label: "Date of Birth", value: "14 Aug 1994", confidence: 95 },
      { label: "Address", value: "12 Residency Road, Bengaluru", confidence: 93 },
      { label: "Expiry Date", value: "14 Aug 2032", confidence: 96 },
    ],
    pagesMeta: [
      { page: "Page 1", coverage: "Photo page", confidence: 97 },
      { page: "Page 2", coverage: "Address and visa entries", confidence: 92 },
    ],
    comparisonFields: [
      { label: "Legal Name", extracted: "Riya Sharma", database: "Riya Sharma", match: true },
      { label: "Date of Birth", extracted: "14 Aug 1994", database: "14 Aug 1994", match: true },
      { label: "Address", extracted: "12 Residency Road, Bengaluru", database: "12 Residency Road, Bengaluru", match: true },
    ],
    workflowStatus: "Verified",
  },
  {
    type: "PAN Card",
    holderName: "Arjun Mehta",
    documentNumber: "BNZPM4412K",
    dob: "1989-11-03",
    address: "45 Linking Road, Mumbai",
    expiryDate: "No expiry",
    issuingCountry: "India",
    pages: 1,
    faceMatch: 84,
    textConfidence: 89,
    imageQuality: 78,
    fieldAccuracy: 86,
    fraudScore: 34,
    duplicateMatch: "1 partial duplicate in contractor database",
    comparisonMatch: 87,
    databaseStatus: "Address mismatch with HRIS profile",
    insights: ["Card edge is partially cropped", "Review address mismatch before final approval"],
    validationRules: [
      { label: "PAN format validation", status: "pass" },
      { label: "Date of birth is valid", status: "pass" },
      { label: "Card visibility is complete", status: "review" },
    ],
    fraudSignals: [
      { label: "Edited document risk", score: 28, status: "medium" },
      { label: "Fake template probability", score: 22, status: "medium" },
      { label: "Duplicate identity risk", score: 41, status: "medium" },
    ],
    extractedFields: [
      { label: "Name", value: "Arjun Mehta", confidence: 92 },
      { label: "Document Number", value: "BNZPM4412K", confidence: 96 },
      { label: "Date of Birth", value: "03 Nov 1989", confidence: 87 },
      { label: "Address", value: "45 Linking Road, Mumbai", confidence: 78 },
      { label: "Expiry Date", value: "Not applicable", confidence: 99 },
    ],
    pagesMeta: [{ page: "Page 1", coverage: "Front card", confidence: 88 }],
    comparisonFields: [
      { label: "Legal Name", extracted: "Arjun Mehta", database: "Arjun Mehta", match: true },
      { label: "Date of Birth", extracted: "03 Nov 1989", database: "03 Nov 1989", match: true },
      { label: "Address", extracted: "45 Linking Road, Mumbai", database: "BKC, Mumbai", match: false },
    ],
    workflowStatus: "Needs Review",
  },
  {
    type: "Driving License",
    holderName: "Sneha Kapoor",
    documentNumber: "DL-0420110149646",
    dob: "1992-02-09",
    address: "Sector 62, Noida",
    expiryDate: "2024-12-01",
    issuingCountry: "India",
    pages: 2,
    faceMatch: 72,
    textConfidence: 81,
    imageQuality: 69,
    fieldAccuracy: 79,
    fraudScore: 63,
    duplicateMatch: "Possible duplicate license found in archived records",
    comparisonMatch: 74,
    databaseStatus: "Expiry date outdated against latest compliance snapshot",
    insights: ["Image quality too low for auto-approval", "Document appears partially visible on reverse page"],
    validationRules: [
      { label: "License number format", status: "pass" },
      { label: "Date of birth is valid", status: "pass" },
      { label: "Document expiry validation", status: "fail" },
    ],
    fraudSignals: [
      { label: "Edited document risk", score: 54, status: "high" },
      { label: "Fake template probability", score: 61, status: "high" },
      { label: "Duplicate identity risk", score: 72, status: "high" },
    ],
    extractedFields: [
      { label: "Name", value: "Sneha Kapoor", confidence: 87 },
      { label: "Document Number", value: "DL-0420110149646", confidence: 82 },
      { label: "Date of Birth", value: "09 Feb 1992", confidence: 80 },
      { label: "Address", value: "Sector 62, Noida", confidence: 70 },
      { label: "Expiry Date", value: "01 Dec 2024", confidence: 77 },
    ],
    pagesMeta: [
      { page: "Page 1", coverage: "Front side", confidence: 83 },
      { page: "Page 2", coverage: "Reverse side", confidence: 71 },
    ],
    comparisonFields: [
      { label: "Legal Name", extracted: "Sneha Kapoor", database: "Sneha Kapoor", match: true },
      { label: "Date of Birth", extracted: "09 Feb 1992", database: "09 Feb 1992", match: true },
      { label: "Expiry Date", extracted: "01 Dec 2024", database: "01 Dec 2026", match: false },
    ],
    workflowStatus: "Rejected",
  },
  {
    type: "Aadhaar Card",
    holderName: "Vikram Nair",
    documentNumber: "4812 6685 2284",
    dob: "1996-05-21",
    address: "Salt Lake, Kolkata",
    expiryDate: "No expiry",
    issuingCountry: "India",
    pages: 1,
    faceMatch: 91,
    textConfidence: 94,
    imageQuality: 90,
    fieldAccuracy: 92,
    fraudScore: 15,
    duplicateMatch: "No duplicate match found",
    comparisonMatch: 94,
    databaseStatus: "Pending reviewer approval for onboarding batch",
    insights: ["Masked Aadhaar recommendation available for export", "Address line wrapped cleanly across scan"],
    validationRules: [
      { label: "Aadhaar digit grouping", status: "pass" },
      { label: "Date of birth is valid", status: "pass" },
      { label: "Image visibility and crop", status: "pass" },
    ],
    fraudSignals: [
      { label: "Edited document risk", score: 12, status: "low" },
      { label: "Fake template probability", score: 16, status: "low" },
      { label: "Duplicate identity risk", score: 19, status: "low" },
    ],
    extractedFields: [
      { label: "Name", value: "Vikram Nair", confidence: 96 },
      { label: "Document Number", value: "4812 6685 2284", confidence: 91 },
      { label: "Date of Birth", value: "21 May 1996", confidence: 94 },
      { label: "Address", value: "Salt Lake, Kolkata", confidence: 90 },
      { label: "Expiry Date", value: "Not applicable", confidence: 99 },
    ],
    pagesMeta: [{ page: "Page 1", coverage: "Front card", confidence: 94 }],
    comparisonFields: [
      { label: "Legal Name", extracted: "Vikram Nair", database: "Vikram Nair", match: true },
      { label: "Date of Birth", extracted: "21 May 1996", database: "21 May 1996", match: true },
      { label: "Address", extracted: "Salt Lake, Kolkata", database: "Salt Lake, Kolkata", match: true },
    ],
    workflowStatus: "Pending Approval",
  },
];

function formatFileSize(file) {
  if (!file) return "";
  if (file.size < 1024 * 1024) return `${(file.size / 1024).toFixed(1)} KB`;
  return `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
}

function badgeClassForStatus(status) {
  switch (status) {
    case "Verified":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300";
    case "Needs Review":
    case "Pending Approval":
      return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300";
    case "Rejected":
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300";
  }
}

function signalClass(level) {
  if (level === "high") return "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300";
  if (level === "medium") return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300";
  return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300";
}

function ruleIcon(status) {
  if (status === "pass") return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
  if (status === "fail") return <XCircle className="h-4 w-4 text-red-500" />;
  return <AlertTriangle className="h-4 w-4 text-amber-500" />;
}

function documentIcon(type) {
  return type === "application/pdf" ? <FileText className="h-6 w-6" /> : <FileImage className="h-6 w-6" />;
}

function OCRVerification() {
  const [documentFile, setDocumentFile] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);
  const [documentPreview, setDocumentPreview] = useState("");
  const [selfiePreview, setSelfiePreview] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedProfile, setSelectedProfile] = useState(0);
  const [scanResult, setScanResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const documentInputRef = useRef(null);
  const selfieInputRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (!documentFile || !documentFile.type.startsWith("image/")) {
      setDocumentPreview("");
      return undefined;
    }
    const url = URL.createObjectURL(documentFile);
    setDocumentPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [documentFile]);

  useEffect(() => {
    if (!selfieFile || !selfieFile.type.startsWith("image/")) {
      setSelfiePreview("");
      return undefined;
    }
    const url = URL.createObjectURL(selfieFile);
    setSelfiePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [selfieFile]);

  const analytics = useMemo(() => {
    const records = scanResult ? [scanResult, ...history] : history;
    const totalDocuments = records.length || 1248;
    const verifiedDocuments = records.filter((item) => item.workflowStatus === "Verified").length || 1124;
    const rejectedDocuments = records.filter((item) => item.workflowStatus === "Rejected").length || 36;
    const fraudAlerts = records.filter((item) => item.fraudScore >= 45).length || 18;
    return [
      { label: "Total Documents Scanned", value: totalDocuments, icon: FileSearch },
      { label: "Verified Documents", value: verifiedDocuments, icon: ShieldCheck },
      { label: "Rejected Documents", value: rejectedDocuments, icon: XCircle },
      { label: "Fraud Alerts", value: fraudAlerts, icon: ShieldAlert },
    ];
  }, [history, scanResult]);

  const workflowStatus = scanResult?.workflowStatus || "Pending Approval";
  const workflowStepIndex = workflowStatus === "Verified" ? 3 : workflowStatus === "Rejected" ? 2 : workflowStatus === "Needs Review" ? 2 : 3;

  const processDocumentFile = (file) => {
    if (!file) return;
    if (!validTypes.includes(file.type)) {
      setError("Please upload a JPG, PNG, or PDF document.");
      return;
    }
    setError("");
    setDocumentFile(file);
    setScanResult(null);
  };

  const processSelfieFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Selfie upload supports image files only.");
      return;
    }
    setError("");
    setSelfieFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    processDocumentFile(event.dataTransfer.files?.[0]);
  };

  const runScan = async () => {
    if (!documentFile) {
      setError("Upload a document before starting OCR verification.");
      return;
    }
    setError("");
    setScanning(true);
    setScanProgress(0);
    setScanResult(null);

    const progressMarks = [12, 28, 47, 63, 81, 100];
    for (const value of progressMarks) {
      await new Promise((resolve) => setTimeout(resolve, 280));
      setScanProgress(value);
    }

    const profile = dataset[selectedProfile];
    const fileName = documentFile.name;
    const result = {
      ...profile,
      fileName,
      uploadedAt: new Date().toLocaleString(),
      selfieName: selfieFile?.name || "candidate-selfie.jpg",
      confidenceAverage: Math.round((profile.textConfidence + profile.imageQuality + profile.fieldAccuracy) / 3),
    };

    setScanResult(result);
    setHistory((prev) => [{ id: Date.now(), ...result }, ...prev].slice(0, 8));
    setActiveTab("verification");
    setScanning(false);
  };

  const exportResult = () => {
    if (!scanResult) return;
    const blob = new Blob([JSON.stringify(scanResult, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${scanResult.type.toLowerCase().replace(/\s+/g, "-")}-verification.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearUploads = () => {
    setDocumentFile(null);
    setSelfieFile(null);
    setScanResult(null);
    setError("");
    setScanProgress(0);
    if (documentInputRef.current) documentInputRef.current.value = "";
    if (selfieInputRef.current) selfieInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="relative overflow-hidden px-6 py-8 sm:px-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_35%),radial-gradient(circle_at_right,_rgba(16,185,129,0.14),_transparent_30%)]" />
            <div className="relative flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <Badge variant="outline" className="mb-3 border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
                  Document Intelligence Suite
                </Badge>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  AI Document Verification Dashboard
                </h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Upload identity documents, run OCR, verify extracted fields, detect fraud signals, compare against HR records, and move cases through a reviewer workflow.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={clearUploads}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset Workspace
                </Button>
                <Button onClick={runScan} disabled={!documentFile || scanning}>
                  {scanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ScanLine className="mr-2 h-4 w-4" />}
                  {scanning ? "Scanning..." : "Run Verification"}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {analytics.map((item) => (
            <Card key={item.label} className="dark:border-slate-700 dark:bg-slate-900">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{item.value}</p>
                </div>
                <item.icon className="h-5 w-5 text-slate-500" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="dark:border-slate-700 dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-base">Document Upload System</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                onDrop={handleDrop}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                className={`rounded-2xl border-2 border-dashed p-8 text-center transition ${
                  dragActive
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                    : "border-slate-300 dark:border-slate-700"
                }`}
              >
                <input
                  ref={documentInputRef}
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  className="hidden"
                  onChange={(event) => processDocumentFile(event.target.files?.[0])}
                />
                <Upload className="mx-auto mb-3 h-10 w-10 text-slate-400" />
                <p className="text-sm text-slate-700 dark:text-slate-300">Drag and drop a document or browse manually.</p>
                <p className="mt-1 text-xs text-slate-500">Supported formats: JPG, PNG, PDF</p>
                <Button variant="outline" className="mt-4" onClick={() => documentInputRef.current?.click()}>
                  Select Document
                </Button>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Primary document</p>
                      <p className="text-xs text-slate-500">Upload for OCR and validation</p>
                    </div>
                    <Badge variant="outline">{documentFile ? "Ready" : "Waiting"}</Badge>
                  </div>
                  <div className="mt-4 flex min-h-36 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    {documentPreview ? (
                      <img src={documentPreview} alt="Document preview" className="h-32 rounded-lg object-cover" />
                    ) : (
                      <div className="text-center text-slate-400">
                        {documentFile ? documentIcon(documentFile.type) : <File className="mx-auto h-8 w-8" />}
                        <p className="mt-2 text-xs">{documentFile?.name || "No file selected"}</p>
                      </div>
                    )}
                  </div>
                  {documentFile && (
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>{formatFileSize(documentFile)}</span>
                      <button type="button" onClick={() => setDocumentFile(null)} className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100">
                        <X className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Selfie for face match</p>
                      <p className="text-xs text-slate-500">Optional but recommended</p>
                    </div>
                    <Badge variant="outline">{selfieFile ? "Ready" : "Optional"}</Badge>
                  </div>
                  <div className="mt-4 flex min-h-36 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    {selfiePreview ? (
                      <img src={selfiePreview} alt="Selfie preview" className="h-32 w-32 rounded-full object-cover" />
                    ) : (
                      <div className="text-center text-slate-400">
                        <ImagePlus className="mx-auto h-8 w-8" />
                        <p className="mt-2 text-xs">{selfieFile?.name || "No selfie selected"}</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={selfieInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => processSelfieFile(event.target.files?.[0])}
                  />
                  <Button variant="outline" className="mt-3 w-full" onClick={() => selfieInputRef.current?.click()}>
                    <UserRoundSearch className="mr-2 h-4 w-4" />
                    Upload Selfie
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Simulation profile</p>
                  <p className="text-xs text-slate-500">Switch scenarios to preview passport, PAN, Aadhaar, or license verification states.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {dataset.map((item, index) => (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setSelectedProfile(index)}
                      className={`rounded-full border px-3 py-1.5 text-xs transition ${
                        selectedProfile === index
                          ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                      }`}
                    >
                      {item.type}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                  {error}
                </div>
              )}

              <AnimatePresence>
                {scanning && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="rounded-full border border-blue-200 bg-blue-50 p-2 text-blue-600 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300"
                      >
                        <Fingerprint className="h-5 w-5" />
                      </motion.div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Running OCR, validation, and fraud intelligence</p>
                        <p className="text-xs text-slate-500">Scanning pages, extracting fields, and calculating verification confidence</p>
                      </div>
                    </div>
                    <Progress value={scanProgress} />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Stage progress</span>
                      <span>{scanProgress}%</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          <Card className="dark:border-slate-700 dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-base">Verification Workflow System</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Current status</p>
                    <p className="text-xs text-slate-500">Route cases to approval or manual review</p>
                  </div>
                  <Badge variant="outline" className={badgeClassForStatus(workflowStatus)}>
                    {workflowStatus}
                  </Badge>
                </div>
                <div className="mt-4 space-y-3">
                  {workflowSteps.map((step, index) => (
                    <div key={step.id} className="flex items-start gap-3">
                      <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                        index <= workflowStepIndex
                          ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{step.label}</p>
                        <p className="text-xs text-slate-500">{step.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Document type detection", value: scanResult?.type || dataset[selectedProfile].type, icon: SearchCheck },
                  { label: "Multi-page support", value: `${scanResult?.pages || dataset[selectedProfile].pages} pages`, icon: Layers3 },
                  { label: "Face match result", value: `${scanResult?.faceMatch || dataset[selectedProfile].faceMatch}%`, icon: UserRoundSearch },
                  { label: "Comparison match", value: `${scanResult?.comparisonMatch || dataset[selectedProfile].comparisonMatch}%`, icon: ArrowRightLeft },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-500">{item.label}</p>
                      <item.icon className="h-4 w-4 text-slate-400" />
                    </div>
                    <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-blue-500" />
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">AI document insights</p>
                </div>
                <div className="mt-3 space-y-2">
                  {(scanResult?.insights || dataset[selectedProfile].insights).map((insight) => (
                    <div key={insight} className="flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                      <ChevronRight className="mt-0.5 h-4 w-4 text-slate-400" />
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2 dark:border-slate-700 dark:bg-slate-900">
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="text-base">OCR Extraction Engine and AI Field Extraction</CardTitle>
                  {scanResult && (
                    <Button variant="outline" size="sm" onClick={exportResult}>
                      <Download className="mr-2 h-4 w-4" />
                      Export JSON
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {scanResult ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {scanResult.extractedFields.map((field) => (
                        <motion.div key={field.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                          <div className="flex items-center justify-between">
                            <p className="text-xs uppercase tracking-wide text-slate-500">{field.label}</p>
                            <span className="text-xs text-slate-500">{field.confidence}%</span>
                          </div>
                          <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{field.value}</p>
                          <Progress value={field.confidence} className="mt-3" />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700">
                      Start verification to populate extracted identity fields and OCR confidence.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-base">Multi-Page OCR Support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(scanResult?.pagesMeta || dataset[selectedProfile].pagesMeta).map((page) => (
                    <div key={page.page} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{page.page}</p>
                        <Badge variant="outline">{page.confidence}%</Badge>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{page.coverage}</p>
                      <Progress value={page.confidence} className="mt-3" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="verification" className="mt-4">
            <div className="grid gap-4 xl:grid-cols-3">
              <Card className="xl:col-span-2 dark:border-slate-700 dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-base">Document Validation Rules and Comparison Engine</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-3">
                    {(scanResult?.validationRules || dataset[selectedProfile].validationRules).map((rule) => (
                      <div key={rule.label} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                          {ruleIcon(rule.status)}
                          <span className="text-sm text-slate-700 dark:text-slate-300">{rule.label}</span>
                        </div>
                        <Badge variant="outline" className={rule.status === "fail" ? signalClass("high") : rule.status === "review" ? signalClass("medium") : signalClass("low")}>
                          {rule.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {(scanResult?.comparisonFields || dataset[selectedProfile].comparisonFields).map((field) => (
                      <div key={field.label} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{field.label}</p>
                          <Badge variant="outline" className={field.match ? signalClass("low") : signalClass("high")}>
                            {field.match ? "Match" : "Mismatch"}
                          </Badge>
                        </div>
                        <div className="mt-3 space-y-2 text-xs text-slate-500">
                          <div className="flex justify-between gap-3">
                            <span>Extracted</span>
                            <span className="text-right text-slate-700 dark:text-slate-300">{field.extracted}</span>
                          </div>
                          <div className="flex justify-between gap-3">
                            <span>Database</span>
                            <span className="text-right text-slate-700 dark:text-slate-300">{field.database}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-base">Face Match and Fraud Detection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Face Match Score</p>
                      <Badge variant="outline" className={signalClass((scanResult?.faceMatch || dataset[selectedProfile].faceMatch) < 80 ? "medium" : "low")}>
                        {(scanResult?.faceMatch || dataset[selectedProfile].faceMatch) >= 85 ? "Verified" : "Needs Review"}
                      </Badge>
                    </div>
                    <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{scanResult?.faceMatch || dataset[selectedProfile].faceMatch}%</p>
                    <Progress value={scanResult?.faceMatch || dataset[selectedProfile].faceMatch} className="mt-3" />
                  </div>

                  <div className="space-y-3">
                    {(scanResult?.fraudSignals || dataset[selectedProfile].fraudSignals).map((signal) => (
                      <div key={signal.label} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{signal.label}</p>
                          <Badge variant="outline" className={signalClass(signal.status)}>
                            {signal.score}/100
                          </Badge>
                        </div>
                        <Progress value={signal.score} className="mt-3" />
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-800/60">
                    <p className="font-medium text-slate-900 dark:text-slate-100">Duplicate ID and database signal</p>
                    <p className="mt-2 text-slate-600 dark:text-slate-300">{scanResult?.duplicateMatch || dataset[selectedProfile].duplicateMatch}</p>
                    <p className="mt-2 text-slate-500">{scanResult?.databaseStatus || dataset[selectedProfile].databaseStatus}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-base">Confidence Analytics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Text Recognition Score", value: scanResult?.textConfidence || dataset[selectedProfile].textConfidence },
                    { label: "Image Quality Score", value: scanResult?.imageQuality || dataset[selectedProfile].imageQuality },
                    { label: "Field Accuracy Score", value: scanResult?.fieldAccuracy || dataset[selectedProfile].fieldAccuracy },
                  ].map((metric) => (
                    <div key={metric.label}>
                      <div className="mb-1 flex justify-between text-xs text-slate-500">
                        <span>{metric.label}</span>
                        <span>{metric.value}%</span>
                      </div>
                      <Progress value={metric.value} />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-base">Document Analytics Dashboard</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                    <p className="text-xs text-slate-500">Average confidence</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                      {scanResult?.confidenceAverage || Math.round((dataset[selectedProfile].textConfidence + dataset[selectedProfile].imageQuality + dataset[selectedProfile].fieldAccuracy) / 3)}%
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                    <p className="text-xs text-slate-500">Detected document type</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{scanResult?.type || dataset[selectedProfile].type}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                    <p className="text-xs text-slate-500">Fraud risk score</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{scanResult?.fraudScore || dataset[selectedProfile].fraudScore}/100</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-base">AI Document Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(scanResult?.insights || dataset[selectedProfile].insights).map((insight) => (
                    <div key={insight} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                      <div className="flex items-start gap-3">
                        <Eye className="mt-0.5 h-4 w-4 text-blue-500" />
                        <p className="text-sm text-slate-700 dark:text-slate-300">{insight}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <Card className="dark:border-slate-700 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-base">Scan History</CardTitle>
              </CardHeader>
              <CardContent>
                {history.length ? (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800">
                            <History className="h-4 w-4 text-slate-500" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.fileName}</p>
                            <p className="text-xs text-slate-500">{item.type} � {item.uploadedAt}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline">{item.documentNumber}</Badge>
                          <Badge variant="outline" className={badgeClassForStatus(item.workflowStatus)}>
                            {item.workflowStatus}
                          </Badge>
                          <Badge variant="outline">{item.confidenceAverage}% confidence</Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700">
                    No scan history yet. Run the first verification to build an audit trail.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="dark:border-slate-700 dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-base">Document Comparison Workspace</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <FileCheck2 className="h-4 w-4 text-slate-500" />
                  Uploaded document
                </div>
                <div className="mt-4 flex min-h-56 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  {documentPreview ? (
                    <img src={documentPreview} alt="Uploaded document preview" className="max-h-52 rounded-lg object-cover" />
                  ) : (
                    <div className="text-center text-slate-400">
                      {documentFile ? documentIcon(documentFile.type) : <FileText className="mx-auto h-10 w-10" />}
                      <p className="mt-2 text-xs">{documentFile?.name || "Document preview will appear here"}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <ArrowRightLeft className="h-4 w-4 text-slate-500" />
                  Extracted and matched fields
                </div>
                <div className="mt-4 space-y-3">
                  {(scanResult?.comparisonFields || dataset[selectedProfile].comparisonFields).map((field) => (
                    <div key={field.label} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                      <div className="flex items-center justify-between">
                        <p className="text-xs uppercase tracking-wide text-slate-500">{field.label}</p>
                        {field.match ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <AlertTriangle className="h-4 w-4 text-amber-500" />}
                      </div>
                      <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">{field.extracted}</p>
                      <p className="mt-1 text-xs text-slate-500">Database: {field.database}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:border-slate-700 dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-base">Reviewer Queue Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Verified", count: analytics[1].value, icon: CheckCircle2, tone: "text-emerald-600" },
                { label: "Needs Review", count: history.filter((item) => item.workflowStatus === "Needs Review").length || 22, icon: AlertTriangle, tone: "text-amber-600" },
                { label: "Rejected", count: analytics[2].value, icon: XCircle, tone: "text-red-600" },
                { label: "Pending Approval", count: history.filter((item) => item.workflowStatus === "Pending Approval").length || 31, icon: Clock3, tone: "text-blue-600" },
              ].map((queue) => (
                <div key={queue.label} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <queue.icon className={`h-4 w-4 ${queue.tone}`} />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{queue.label}</span>
                  </div>
                  <Badge variant="outline">{queue.count}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default OCRVerification;
