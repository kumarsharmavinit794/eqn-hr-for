import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Brain, FileUp, Loader2, RefreshCw, Sparkles, Trophy, Users } from "lucide-react";
import { analyzeResumeMock } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

const maxSize = 5 * 1024 * 1024;
const skillLibrary = ["React", "Node.js", "TypeScript", "JavaScript", "Python", "SQL", "AWS", "Docker", "Kubernetes", "REST", "GraphQL"];

const readFileAsBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });

const normalizeKeywords = (text) =>
  text
    .toLowerCase()
    .split(/[^a-z0-9.+#]+/g)
    .filter(Boolean);

const scoreLabel = (score) => (score >= 85 ? "Strong Hire" : score >= 70 ? "Hire" : score >= 55 ? "Consider" : "Reject");
const probabilityLabel = (score) => (score >= 75 ? "High chance" : score >= 50 ? "Moderate chance" : "Low chance");

function deriveCandidateInsights(file, base64, result, jobDescription) {
  const jdWords = normalizeKeywords(jobDescription);
  const jdSkills = skillLibrary.filter((skill) => jdWords.includes(skill.toLowerCase().replace(/\s+/g, "")) || jdWords.includes(skill.toLowerCase()));
  const detectedSkills = result.top_skills_detected?.length ? result.top_skills_detected : skillLibrary.filter(() => Math.random() > 0.58).slice(0, 5);
  const matchedSkills = detectedSkills.filter((skill) => jdSkills.includes(skill));
  const missingSkills = jdSkills.filter((skill) => !detectedSkills.includes(skill));
  const matchScore = jdSkills.length === 0 ? Math.min(95, result.ats_score + 4) : Math.round((matchedSkills.length / jdSkills.length) * 100);
  const keywordScore = result.keyword_density === "High" ? 88 : result.keyword_density === "Medium" ? 62 : 38;
  const hiringScore = Math.round(result.ats_score * 0.45 + matchScore * 0.35 + keywordScore * 0.2);
  const interviewProbability = Math.max(15, Math.min(96, Math.round(hiringScore * 0.9)));

  const exp = Number(String(result.experience_years || "2").match(/\d+/)?.[0] || 2);
  const baseLpa = 5 + exp * 1.5 + Math.floor(detectedSkills.length * 0.55);
  const salaryLow = Math.max(4, Math.round(baseLpa));
  const salaryHigh = Math.round(salaryLow + 3 + exp * 0.4);

  const questionBank = {
    React: ["Explain React hooks.", "How does reconciliation work in React?"],
    "Node.js": ["Explain Node.js event loop.", "How does Node handle async operations?"],
    TypeScript: ["Difference between type and interface?", "What are generics in TypeScript?"],
    SQL: ["How do you optimize SQL joins?", "Difference between clustered and non-clustered index?"],
    Python: ["What are decorators?", "How do generators work?"],
  };

  const interviewQuestions = detectedSkills.slice(0, 3).map((skill) => ({
    skill,
    questions: questionBank[skill] || [`Walk me through a project where you used ${skill}.`, `What are advanced best practices for ${skill}?`],
  }));

  const personality = [
    hiringScore > 80 ? "Leadership potential" : "Growth mindset",
    result.readability_score > 75 ? "Clear communicator" : "Detail oriented",
    detectedSkills.includes("SQL") ? "Analytical thinker" : "Problem solver",
    detectedSkills.includes("React") ? "Collaborative team player" : "Execution focused",
  ];

  return {
    id: `${file.name}-${Date.now()}-${Math.random()}`,
    name: file.name.replace(/\.[^/.]+$/, ""),
    file,
    base64,
    fileType: file.name.toLowerCase().endsWith(".pdf") ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    result,
    keywordScore,
    matchScore,
    matchedSkills,
    missingSkills,
    hiringScore,
    interviewProbability,
    interviewQuestions,
    personality,
    salaryRange: `₹${salaryLow} LPA - ₹${salaryHigh} LPA`,
    rankingScore: Math.round(hiringScore * 0.6 + matchScore * 0.4),
  };
}

function ResumeATSModern() {
  const [files, setFiles] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [activeCandidateId, setActiveCandidateId] = useState("");
  const [jobDescription, setJobDescription] = useState("Senior Frontend Engineer with React, TypeScript, Node.js, SQL, and cloud deployment experience.");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const processFiles = async (inputFiles) => {
    if (!inputFiles?.length) return;
    setError("");
    const nextFiles = Array.from(inputFiles);
    const invalid = nextFiles.find((f) => {
      const name = f.name.toLowerCase();
      return (!name.endsWith(".pdf") && !name.endsWith(".doc") && !name.endsWith(".docx")) || f.size > maxSize;
    });
    if (invalid) return setError("Only PDF, DOC, DOCX under 5MB are supported.");
    setFiles(nextFiles);
    setCandidates([]);
    setActiveCandidateId("");
  };

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    setDragActive(false);
    void processFiles(event.dataTransfer.files);
  }, []);

  const analyze = async () => {
    if (!files.length) return setError("Please upload at least one resume.");
    setLoading(true);
    setError("");
    try {
      const analyzed = await Promise.all(
        files.map(async (file) => deriveCandidateInsights(file, await readFileAsBase64(file), analyzeResumeMock(file.name), jobDescription))
      );
      setCandidates(analyzed);
      setActiveCandidateId(analyzed[0]?.id || "");
    } catch (analysisError) {
      console.error(analysisError);
      setError("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setFiles([]);
    setCandidates([]);
    setError("");
    setActiveCandidateId("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const rankedCandidates = useMemo(
    () => [...candidates].sort((a, b) => b.rankingScore - a.rankingScore).map((candidate, index) => ({ ...candidate, rank: index + 1 })),
    [candidates]
  );
  const activeCandidate = rankedCandidates.find((candidate) => candidate.id === activeCandidateId) || rankedCandidates[0];
  const shortlisted = rankedCandidates.filter((candidate) => candidate.hiringScore >= 75).slice(0, 5);
  const comparePair = rankedCandidates.slice(0, 2);

  useEffect(() => {
    if (!activeCandidateId && rankedCandidates.length) setActiveCandidateId(rankedCandidates[0].id);
  }, [activeCandidateId, rankedCandidates]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">ATS Hiring Intelligence Dashboard</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Enterprise-style resume intelligence, ranking, shortlisting, and interview readiness insights.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={clearAll}><RefreshCw className="mr-2 h-4 w-4" />Analyze Another</Button>
            <Button onClick={analyze} disabled={!files.length || loading}><Sparkles className="mr-2 h-4 w-4" />{loading ? "Analyzing..." : "Analyze Resume"}</Button>
          </div>
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
          <Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">Resume Upload Panel</CardTitle></CardHeader><CardContent>
            <div onDrop={handleDrop} onDragOver={(e) => { e.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)} className={`rounded-xl border-2 border-dashed p-8 text-center ${dragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30" : "border-slate-300 dark:border-slate-700"}`}>
              <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" multiple className="hidden" onChange={(e) => void processFiles(e.target.files)} />
              <FileUp className="mx-auto mb-3 h-10 w-10 text-slate-400" />
              <p className="text-sm text-slate-600 dark:text-slate-300">Upload one or more resumes to auto-rank candidates.</p>
              <Button variant="outline" className="mt-4" onClick={() => inputRef.current?.click()}>Browse Files</Button>
              {!!files.length && <p className="mt-2 text-xs text-emerald-600">{files.length} files ready</p>}
            </div>
            {error && <p className="mt-3 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
          </CardContent></Card>
          <Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">Job Description Input</CardTitle></CardHeader><CardContent><Label htmlFor="jd">Paste JD for match score and skill-gap analysis</Label><Textarea id="jd" rows={8} className="mt-2" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} /></CardContent></Card>
        </div>

        {loading && <Card className="dark:border-slate-700 dark:bg-slate-900"><CardContent className="flex items-center gap-2 p-5 text-sm"><Loader2 className="h-4 w-4 animate-spin" />Running AI parser, ranking candidates, and generating recommendations...</CardContent></Card>}

        {!loading && activeCandidate && <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[
            { label: "ATS Score", value: activeCandidate.result.ats_score, icon: Brain },
            { label: "JD Match Score", value: activeCandidate.matchScore, icon: Sparkles },
            { label: "Hiring Score", value: activeCandidate.hiringScore, icon: Trophy },
            { label: "Interview Probability", value: activeCandidate.interviewProbability, icon: Users },
          ].map((m) => <Card key={m.label} className="dark:border-slate-700 dark:bg-slate-900"><CardContent className="flex items-center justify-between p-5"><div><p className="text-xs text-slate-500">{m.label}</p><p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{m.value}%</p></div><m.icon className="h-5 w-5 text-slate-500" /></CardContent></Card>)}</div>
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">ATS Score Dashboard</CardTitle></CardHeader><CardContent className="space-y-3"><div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full" style={{ background: `conic-gradient(rgb(37 99 235) ${activeCandidate.result.ats_score * 3.6}deg, rgb(226 232 240) 0deg)` }}><div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white dark:bg-slate-900"><p className="text-2xl font-bold">{activeCandidate.result.ats_score}</p><p className="text-xs text-slate-500">ATS</p></div></div>{[["Formatting", activeCandidate.result.formatting_score], ["Readability", activeCandidate.result.readability_score], ["Keyword", activeCandidate.keywordScore]].map(([l, v]) => <div key={String(l)}><div className="mb-1 flex justify-between text-xs"><span>{l}</span><span>{v}%</span></div><Progress value={Number(v)} /></div>)}</CardContent></Card>
            <Card className="lg:col-span-2 dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">JD Match, Skill Gap, and Hiring Decision</CardTitle></CardHeader><CardContent className="space-y-3"><p className="rounded-lg border px-3 py-2 text-sm">Recommendation: <b>{scoreLabel(activeCandidate.hiringScore)}</b> | {probabilityLabel(activeCandidate.interviewProbability)}</p><div><p className="mb-1 text-xs font-semibold uppercase text-slate-500">Matching Keywords</p><div className="flex flex-wrap gap-2">{activeCandidate.matchedSkills.map((skill) => <Badge key={skill} className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">{skill}</Badge>)}</div></div><div><p className="mb-1 text-xs font-semibold uppercase text-slate-500">Missing Keywords</p><div className="flex flex-wrap gap-2">{activeCandidate.missingSkills.length ? activeCandidate.missingSkills.map((skill) => <Badge key={skill} variant="outline" className="border-red-300 text-red-700 dark:border-red-900 dark:text-red-300">{skill}</Badge>) : <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">No critical gaps</Badge>}</div></div><p className="text-sm">Predicted Salary: <b>{activeCandidate.salaryRange}</b></p></CardContent></Card>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">Strengths, Weaknesses, Improvements</CardTitle></CardHeader><CardContent className="space-y-3"><div><p className="text-xs font-semibold uppercase text-emerald-600">Strengths</p>{activeCandidate.result.strengths?.map((x) => <p key={x} className="text-sm">- {x}</p>)}</div><div><p className="text-xs font-semibold uppercase text-red-600">Weaknesses</p>{activeCandidate.result.weaknesses?.map((x) => <p key={x} className="text-sm">- {x}</p>)}</div><div>{activeCandidate.result.improvements?.map((x) => <p key={x.action} className="text-sm">[{x.priority}] {x.action}</p>)}</div></CardContent></Card>
            <Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">Interview Questions and Personality Prediction</CardTitle></CardHeader><CardContent className="space-y-3">{activeCandidate.interviewQuestions.map((g) => <div key={g.skill}><p className="text-sm font-semibold">{g.skill}</p>{g.questions.map((q) => <p key={q} className="text-sm text-slate-600 dark:text-slate-300">- {q}</p>)}</div>)}<div className="flex flex-wrap gap-2 pt-1">{activeCandidate.personality.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}</div></CardContent></Card>
          </div>
          <div className="grid gap-4 xl:grid-cols-3">
            <Card className="xl:col-span-2 dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">Candidate Ranking and Leaderboard</CardTitle></CardHeader><CardContent><div className="overflow-auto"><table className="min-w-full text-left text-sm"><thead><tr className="border-b"><th className="py-2 pr-4">Rank</th><th className="py-2 pr-4">Candidate</th><th className="py-2 pr-4">ATS</th><th className="py-2 pr-4">Match</th><th className="py-2 pr-4">Hiring</th></tr></thead><tbody>{rankedCandidates.map((c) => <tr key={c.id} className="border-b border-slate-100 dark:border-slate-800"><td className="py-2 pr-4">{c.rank}</td><td className="py-2 pr-4">{c.name}</td><td className="py-2 pr-4">{c.result.ats_score}%</td><td className="py-2 pr-4">{c.matchScore}%</td><td className="py-2 pr-4">{c.hiringScore}%</td></tr>)}</tbody></table></div></CardContent></Card>
            <Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">Auto Shortlisting</CardTitle></CardHeader><CardContent className="space-y-2">{shortlisted.length ? shortlisted.map((c) => <div key={c.id} className="rounded-lg border p-2"><p className="text-sm font-medium">{c.name}</p><p className="text-xs text-slate-500">{c.matchScore}% match | {c.hiringScore}% hiring</p></div>) : <p className="text-sm text-slate-500">No candidate met shortlist threshold.</p>}</CardContent></Card>
          </div>
          {comparePair.length === 2 && <Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">Candidate Comparison Panel</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2">{comparePair.map((c) => <div key={c.id} className="rounded-lg border p-3"><p className="font-semibold">{c.name}</p><p className="text-sm">ATS: {c.result.ats_score}%</p><p className="text-sm">Skills: {(c.matchedSkills.length ? c.matchedSkills : c.result.top_skills_detected || []).slice(0, 4).join(", ")}</p><p className="text-sm">Hiring: {c.hiringScore}%</p></div>)}</CardContent></Card>}
        </>}
      </div>
    </div>
  );
}

export default ResumeATSModern;

function LegacyResumeATS() {
  const [file, setFile] = useState(null);
  const [fileBase64, setFileBase64] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const maxSize = 5 * 1024 * 1024; // 5MB

  const readFileAsBase64 = (f) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = () => reject(new Error("File read failed"));
      reader.readAsDataURL(f);
    });

  const processFile = async (selectedFile) => {
    setError("");
    setResult(null);
    if (!selectedFile) return;

    const name = selectedFile.name.toLowerCase();
    const isPdf = name.endsWith(".pdf");
    const isDoc = name.endsWith(".doc") || name.endsWith(".docx");

    if (!isPdf && !isDoc) {
      setError("Only PDF, DOC, or DOCX files are allowed.");
      return;
    }
    if (selectedFile.size > maxSize) {
      setError("File must be smaller than 5MB.");
      return;
    }

    try {
      const b64 = await readFileAsBase64(selectedFile);
      setFile(selectedFile);
      setFileBase64(b64);
      setFileType(isPdf ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    } catch {
      setError("Could not read the file. Please try again.");
    }
  };

  const handleInputChange = (e) => processFile(e.target.files?.[0]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    processFile(e.dataTransfer.files?.[0]);
  }, []);

  const handleDragOver = (e) => { e.preventDefault(); setDragActive(true); };
  const handleDragLeave = () => setDragActive(false);

  const analyzeResume = async () => {
    if (!file || !fileBase64) { setError("Please upload a resume first."); return; }
    setLoading(true);
    setError("");

    try {
      setResult(analyzeResumeMock(file.name));
    } catch (err) {
      setError("Analysis failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const clearAll = () => {
    setFile(null); setFileBase64(null); setFileType(null);
    setResult(null); setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#22c55e";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Needs Work";
    return "Poor";
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)", fontFamily: "'Segoe UI', sans-serif", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}></div>
          <h1 style={{ color: "#fff", fontSize: "2rem", fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>
            Resume ATS Analyzer
          </h1>
          <p style={{ color: "#a78bfa", marginTop: 8, fontSize: 15 }}>
            Upload your resume and get instant AI-powered ATS feedback
          </p>
        </div>

        {/* Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !file && inputRef.current?.click()}
          style={{
            border: `2px dashed ${dragActive ? "#a78bfa" : file ? "#22c55e" : "#6366f1"}`,
            borderRadius: 16,
            padding: "2.5rem",
            textAlign: "center",
            background: dragActive ? "rgba(167,139,250,0.1)" : file ? "rgba(34,197,94,0.08)" : "rgba(99,102,241,0.08)",
            cursor: file ? "default" : "pointer",
            transition: "all 0.3s ease",
            marginBottom: "1.5rem"
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleInputChange}
            style={{ display: "none" }}
          />

          {!file ? (
            <>
              <div style={{ fontSize: 40, marginBottom: 12 }}>☁️</div>
              <p style={{ color: "#c4b5fd", fontSize: 16, margin: 0 }}>
                <strong>Drag &amp; drop</strong> your resume here, or click to browse
              </p>
              <p style={{ color: "#6b7280", fontSize: 13, marginTop: 8 }}>PDF, DOC, DOCX &bull; Max 5MB</p>
              <button
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                style={{
                  marginTop: 16,
                  background: "linear-gradient(135deg, #6366f1, #a78bfa)",
                  color: "#fff", border: "none", borderRadius: 8,
                  padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer"
                }}
              >
                Browse File
              </button>
            </>
          ) : (
            <div>
              <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
              <p style={{ color: "#22c55e", fontWeight: 700, margin: 0, fontSize: 16 }}>{file.name}</p>
              <p style={{ color: "#9ca3af", fontSize: 13, marginTop: 4 }}>
                {(file.size / 1024).toFixed(1)} KB &bull; {file.name.split(".").pop().toUpperCase()}
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); clearAll(); }}
                style={{
                  marginTop: 10,
                  background: "rgba(239,68,68,0.15)", color: "#f87171",
                  border: "1px solid rgba(239,68,68,0.3)", borderRadius: 6,
                  padding: "6px 16px", fontSize: 13, cursor: "pointer"
                }}
              >
                ✕ Remove
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 10, padding: "12px 16px", color: "#f87171",
            fontSize: 14, marginBottom: "1.5rem", textAlign: "center"
          }}>
             {error}
          </div>
        )}

        {/* Analyze Button */}
        <button
          onClick={analyzeResume}
          disabled={!file || loading}
          style={{
            width: "100%", padding: "14px",
            background: !file ? "#374151" : loading ? "#4f46e5" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: !file ? "#6b7280" : "#fff",
            border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700,
            cursor: !file ? "not-allowed" : "pointer",
            transition: "all 0.3s", marginBottom: "2rem",
            boxShadow: file && !loading ? "0 4px 20px rgba(99,102,241,0.4)" : "none"
          }}
        >
          {loading ? " Analyzing your resume... please wait" : " Analyze Resume"}
        </button>

        {/* Results */}
        {result && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>

            {/* ATS Score Card */}
            <div style={{
              background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)",
              borderRadius: 16, padding: "2rem", marginBottom: "1.5rem",
              border: "1px solid rgba(255,255,255,0.1)", textAlign: "center"
            }}>
              <div style={{
                width: 120, height: 120, borderRadius: "50%", margin: "0 auto 1rem",
                background: `conic-gradient(${getScoreColor(result.ats_score)} ${result.ats_score * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 0 30px ${getScoreColor(result.ats_score)}40`
              }}>
                <div style={{
                  width: 90, height: 90, borderRadius: "50%", background: "#1a1a2e",
                  display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"
                }}>
                  <span style={{ color: getScoreColor(result.ats_score), fontSize: 24, fontWeight: 800 }}>
                    {result.ats_score}
                  </span>
                  <span style={{ color: "#9ca3af", fontSize: 11 }}>ATS Score</span>
                </div>
              </div>
              <h2 style={{ color: getScoreColor(result.ats_score), margin: "0 0 4px", fontSize: 22 }}>
                {getScoreLabel(result.ats_score)}
              </h2>
              <p style={{ color: "#d1d5db", margin: 0, fontSize: 14 }}>{result.overall_verdict}</p>

              {/* Sub-scores */}
              <div style={{ display: "flex", gap: 16, marginTop: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
                {[
                  { label: "Formatting", val: result.formatting_score },
                  { label: "Readability", val: result.readability_score },
                  { label: "Keywords", val: result.keyword_density === "High" ? 85 : result.keyword_density === "Medium" ? 55 : 30 }
                ].map(item => (
                  <div key={item.label} style={{ textAlign: "center" }}>
                    <div style={{ color: getScoreColor(item.val), fontSize: 20, fontWeight: 700 }}>{item.val}%</div>
                    <div style={{ color: "#9ca3af", fontSize: 12 }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: "1.5rem" }}>
              <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 12, padding: "1.25rem" }}>
                <h3 style={{ color: "#22c55e", margin: "0 0 12px", fontSize: 15 }}>✅ Strengths</h3>
                {result.strengths?.map((s, i) => (
                  <p key={i} style={{ color: "#d1fae5", fontSize: 13, margin: "6px 0" }}>• {s}</p>
                ))}
              </div>
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "1.25rem" }}>
                <h3 style={{ color: "#ef4444", margin: "0 0 12px", fontSize: 15 }}>❌ Weaknesses</h3>
                {result.weaknesses?.map((w, i) => (
                  <p key={i} style={{ color: "#fee2e2", fontSize: 13, margin: "6px 0" }}>• {w}</p>
                ))}
              </div>
            </div>

            {/* Improvements */}
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "1.5rem", marginBottom: "1.5rem" }}>
              <h3 style={{ color: "#f59e0b", margin: "0 0 16px", fontSize: 16 }}>🎯 Recommended Improvements</h3>
              {result.improvements?.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 20, flexShrink: 0, marginTop: 2,
                    background: item.priority === "High" ? "rgba(239,68,68,0.2)" : item.priority === "Medium" ? "rgba(245,158,11,0.2)" : "rgba(34,197,94,0.2)",
                    color: item.priority === "High" ? "#f87171" : item.priority === "Medium" ? "#fbbf24" : "#4ade80"
                  }}>
                    {item.priority}
                  </span>
                  <p style={{ color: "#e5e7eb", fontSize: 14, margin: 0 }}>{item.action}</p>
                </div>
              ))}
            </div>

            {/* Skills & Info */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: "1.5rem" }}>
              <div style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 12, padding: "1.25rem" }}>
                <h3 style={{ color: "#a78bfa", margin: "0 0 12px", fontSize: 14 }}>🔧 Detected Skills</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {result.top_skills_detected?.map((sk, i) => (
                    <span key={i} style={{ background: "rgba(99,102,241,0.2)", color: "#c4b5fd", fontSize: 12, padding: "4px 10px", borderRadius: 20 }}>
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "1.25rem" }}>
                <h3 style={{ color: "#9ca3af", margin: "0 0 12px", fontSize: 14 }}>ℹ️ Resume Info</h3>
                <p style={{ color: "#d1d5db", fontSize: 13, margin: "4px 0" }}>Experience: {result.experience_years}</p>
                <p style={{ color: "#d1d5db", fontSize: 13, margin: "4px 0" }}>Keyword Density: {result.keyword_density}</p>
                {result.missing_sections?.length > 0 && (
                  <p style={{ color: "#f87171", fontSize: 13, margin: "8px 0 0" }}>
                    Missing: {result.missing_sections.join(", ")}
                  </p>
                )}
              </div>
            </div>

            {/* Sections Found */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "1.25rem", marginBottom: "2rem" }}>
              <h3 style={{ color: "#9ca3af", margin: "0 0 12px", fontSize: 14 }}>📋 Sections Detected</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {result.sections_found?.map((sec, i) => (
                  <span key={i} style={{ background: "rgba(34,197,94,0.1)", color: "#4ade80", fontSize: 12, padding: "5px 12px", borderRadius: 8, border: "1px solid rgba(34,197,94,0.2)" }}>
                    ✓ {sec}
                  </span>
                ))}
              </div>
            </div>

            {/* Analyze Another */}
            <button
              onClick={clearAll}
              style={{
                width: "100%", padding: "12px",
                background: "rgba(255,255,255,0.05)", color: "#9ca3af",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10, fontSize: 14, cursor: "pointer"
              }}
            >
              Analyze Another Resume
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}



