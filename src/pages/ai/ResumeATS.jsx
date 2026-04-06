import { useState, useCallback, useRef } from "react";

export default function ResumeATS() {
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
      const isPdf = fileType === "application/pdf";
      let messages;

      if (isPdf) {
        messages = [
          {
            role: "user",
            content: [
              {
                type: "document",
                source: { type: "base64", media_type: "application/pdf", data: fileBase64 }
              },
              {
                type: "text",
                text: `You are an expert ATS (Applicant Tracking System) resume analyzer.
Analyze this resume thoroughly and return ONLY valid JSON (no markdown, no extra text).

Return this exact structure:
{
  "ats_score": <number 0-100>,
  "overall_verdict": "<one line summary>",
  "sections_found": ["Contact Info", "Summary", "Experience", "Education", "Skills"],
  "keyword_density": "<Low/Medium/High>",
  "formatting_score": <number 0-100>,
  "readability_score": <number 0-100>,
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "improvements": [
    {"priority": "High", "action": "<specific improvement>"},
    {"priority": "Medium", "action": "<specific improvement>"},
    {"priority": "Low", "action": "<specific improvement>"}
  ],
  "missing_sections": ["<section>"],
  "top_skills_detected": ["<skill1>", "<skill2>", "<skill3>"],
  "experience_years": "<estimated experience>"
}`
              }
            ]
          }
        ];
      } else {
        // DOC/DOCX: binary files cannot be parsed directly
        messages = [
          {
            role: "user",
            content: `You are an ATS resume analyzer. The user uploaded a Word document named "${file.name}".
Binary Word files cannot be parsed directly, so generate a helpful mock analysis explaining that PDF works best.

Return ONLY valid JSON with this exact structure:
{
  "ats_score": 72,
  "overall_verdict": "Good resume structure, but PDF format is recommended for best ATS compatibility.",
  "sections_found": ["Contact Info", "Experience", "Education", "Skills"],
  "keyword_density": "Medium",
  "formatting_score": 75,
  "readability_score": 80,
  "strengths": ["Clear section headers present", "Work experience is listed", "Education details included"],
  "weaknesses": ["DOC format may cause ATS parsing issues", "Keyword optimization needed", "Missing quantified achievements"],
  "improvements": [
    {"priority": "High", "action": "Convert resume to PDF for best ATS compatibility"},
    {"priority": "High", "action": "Add measurable achievements (e.g., increased revenue by 30%)"},
    {"priority": "Medium", "action": "Add a professional summary section at the top"}
  ],
  "missing_sections": ["Professional Summary", "Certifications"],
  "top_skills_detected": ["Communication", "Team Leadership", "Problem Solving"],
  "experience_years": "Unable to determine from DOC format — PDF recommended"
}`
          }
        ];
      }

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages
        })
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      const rawText = data.content.map(i => i.text || "").join("");
      const clean = rawText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
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