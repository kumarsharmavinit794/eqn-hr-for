import { useState, useRef, useEffect } from "react";

const QUESTIONS = [
  { id: 1, text: "Why are you leaving the company?", placeholder: "Share your primary reason for leaving..." },
  { id: 2, text: "How was your overall experience working here?", placeholder: "Describe your journey — the highs, the lows..." },
  { id: 3, text: "What did you enjoy most about your role?", placeholder: "What made you excited to come to work?" },
  { id: 4, text: "What could the company have done better to retain you?", placeholder: "Be honest — this helps us improve..." },
  { id: 5, text: "Would you recommend this company to others?", placeholder: "Why or why not?" },
];

const SENTIMENT_CONFIG = {
  "Very Positive": { color: "#059669", bg: "#d1fae5", bar: 95 },
  "Positive": { color: "#16a34a", bg: "#dcfce7", bar: 75 },
  "Neutral": { color: "#d97706", bg: "#fef3c7", bar: 50 },
  "Negative": { color: "#dc2626", bg: "#fee2e2", bar: 28 },
  "Very Negative": { color: "#b91c1c", bg: "#fecaca", bar: 8 },
};

export default function ExitInterviewBot() {
  const [phase, setPhase] = useState("intro"); // intro | questions | submitting | results
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(""));
  const [draft, setDraft] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [animKey, setAnimKey] = useState(0);
  const textRef = useRef(null);

  useEffect(() => {
    if (phase === "questions" && textRef.current) {
      textRef.current.focus();
    }
  }, [phase, currentQ, animKey]);

  const progress = phase === "questions" ? ((currentQ) / QUESTIONS.length) * 100 : phase === "results" ? 100 : 0;

  function startInterview() {
    setPhase("questions");
    setCurrentQ(0);
    setDraft("");
    setAnimKey(k => k + 1);
  }

  function handleNext() {
    if (!draft.trim()) return;
    const updated = [...answers];
    updated[currentQ] = draft.trim();
    setAnswers(updated);

    if (currentQ < QUESTIONS.length - 1) {
      setDraft("");
      setCurrentQ(q => q + 1);
      setAnimKey(k => k + 1);
    } else {
      submitInterview(updated);
    }
  }

  function handleBack() {
    if (currentQ === 0) return;
    setDraft(answers[currentQ - 1] || "");
    setCurrentQ(q => q - 1);
    setAnimKey(k => k + 1);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleNext();
  }

  async function submitInterview(allAnswers) {
    setPhase("submitting");
    setError("");
    try {
      const formatted = QUESTIONS.map((q, i) =>
        `Q${i + 1}: ${q.text}\nAnswer: ${allAnswers[i] || "(skipped)"}`
      ).join("\n\n");

      const prompt = `You are an expert HR analyst. Analyze the following exit interview responses and return ONLY a valid JSON object — no markdown, no explanation, no extra text.

Exit Interview:
${formatted}

Return exactly this JSON structure:
{
  "overallSentiment": "Very Positive" | "Positive" | "Neutral" | "Negative" | "Very Negative",
  "sentimentScore": <number 1-10>,
  "retentionRisk": "Low" | "Medium" | "High",
  "topThemes": ["theme1", "theme2", "theme3"],
  "executiveSummary": "<2-3 sentence summary>",
  "strengths": ["strength1", "strength2"],
  "improvements": ["area1", "area2"],
  "recommendToOthers": true | false
}`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await res.json();
      const raw = data.content?.map(b => b.text || "").join("") || "";
      const cleaned = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      setResults(parsed);
      setPhase("results");
    } catch (err) {
      setError("Analysis failed. Please try again.");
      setPhase("questions");
      setCurrentQ(QUESTIONS.length - 1);
    }
  }

  function restart() {
    setPhase("intro");
    setAnswers(Array(QUESTIONS.length).fill(""));
    setDraft("");
    setResults(null);
    setError("");
    setCurrentQ(0);
  }

  const sentimentMeta = results ? SENTIMENT_CONFIG[results.overallSentiment] || SENTIMENT_CONFIG["Neutral"] : null;

  return (
    <div style={s.shell}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes barGrow {
          from { width: 0; }
        }
        .fade-up { animation: fadeUp 0.35s cubic-bezier(.25,.8,.25,1) both; }
        .bar-grow { animation: barGrow 1s cubic-bezier(.25,.8,.25,1) both 0.3s; }
        textarea:focus { outline: none; border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
        .btn-primary:hover { background: #4f46e5 !important; }
        .btn-primary:active { transform: scale(0.98); }
        .btn-ghost:hover { background: rgba(99,102,241,0.08) !important; color: #6366f1 !important; }
        .restart-btn:hover { background: #f5f5f7 !important; }
      `}</style>

      {/* Top bar */}
      <div style={s.topBar}>
        <div style={s.logo}>
          <div style={s.logoIcon}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="white" strokeWidth="1.5" />
              <path d="M4.5 7L6.5 9L9.5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={s.logoText}>ExitIQ</span>
        </div>
        <span style={s.confidential}>Confidential</span>
      </div>

      {/* Progress bar */}
      <div style={s.progressTrack}>
        <div style={{ ...s.progressFill, width: `${progress}%`, transition: "width 0.5s ease" }} />
      </div>

      {/* Content */}
      <div style={s.body}>

        {/* INTRO */}
        {phase === "intro" && (
          <div className="fade-up" style={s.card}>
            <div style={s.introIcon}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="10" fill="#eef2ff" />
                <path d="M10 16h12M16 10v12" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h1 style={s.h1}>Exit Interview</h1>
            <p style={s.lead}>
              Thank you for your time here. Before you go, we'd love to hear your honest thoughts.
              Your feedback is confidential and helps us build a better workplace.
            </p>
            <div style={s.pills}>
              {["5 questions", "~3 minutes", "AI-analyzed", "Confidential"].map(p => (
                <span key={p} style={s.pill}>{p}</span>
              ))}
            </div>
            {error && <div style={s.errorBox}>{error}</div>}
            <button className="btn-primary" style={s.btnPrimary} onClick={startInterview}>
              Begin Interview
            </button>
          </div>
        )}

        {/* QUESTIONS */}
        {phase === "questions" && (
          <div key={animKey} className="fade-up" style={s.card}>
            <div style={s.qMeta}>
              <span style={s.qCounter}>Question {currentQ + 1} of {QUESTIONS.length}</span>
              <div style={s.dotRow}>
                {QUESTIONS.map((_, i) => (
                  <div key={i} style={{ ...s.dot, background: i <= currentQ ? "#6366f1" : "#e5e7eb" }} />
                ))}
              </div>
            </div>
            <h2 style={s.h2}>{QUESTIONS[currentQ].text}</h2>
            <textarea
              ref={textRef}
              style={s.textarea}
              placeholder={QUESTIONS[currentQ].placeholder}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={5}
            />
            <div style={s.hint}>Press Ctrl + Enter to continue</div>
            <div style={s.btnRow}>
              {currentQ > 0 && (
                <button className="btn-ghost" style={s.btnGhost} onClick={handleBack}>
                  ← Back
                </button>
              )}
              <button
                className="btn-primary"
                style={{ ...s.btnPrimary, opacity: draft.trim() ? 1 : 0.45, cursor: draft.trim() ? "pointer" : "default", marginTop: 0 }}
                onClick={handleNext}
                disabled={!draft.trim()}
              >
                {currentQ < QUESTIONS.length - 1 ? "Continue →" : "Submit & Analyze"}
              </button>
            </div>
          </div>
        )}

        {/* SUBMITTING */}
        {phase === "submitting" && (
          <div className="fade-up" style={{ ...s.card, textAlign: "center", padding: "60px 40px" }}>
            <div style={{ width: 44, height: 44, border: "3px solid #e5e7eb", borderTop: "3px solid #6366f1", borderRadius: "50%", margin: "0 auto 24px", animation: "spin 0.8s linear infinite" }} />
            <p style={{ color: "#6b7280", fontSize: 15 }}>Analyzing your responses…</p>
          </div>
        )}

        {/* RESULTS */}
        {phase === "results" && results && sentimentMeta && (
          <div className="fade-up" style={{ ...s.card, maxWidth: 640 }}>
            <div style={s.resultsHeader}>
              <span style={s.qCounter}>Analysis Complete</span>
              <h2 style={{ ...s.h2, marginBottom: 0 }}>Interview Summary</h2>
            </div>

            {/* Sentiment + Risk row */}
            <div style={s.metricsRow}>
              <div style={s.metricBox}>
                <span style={s.metricLabel}>Overall Sentiment</span>
                <span style={{ ...s.metricValue, color: sentimentMeta.color }}>
                  {results.overallSentiment}
                </span>
                <div style={s.scoreBarTrack}>
                  <div
                    className="bar-grow"
                    style={{ ...s.scoreBarFill, width: `${sentimentMeta.bar}%`, background: sentimentMeta.color }}
                  />
                </div>
                <span style={s.scoreNum}>{results.sentimentScore}/10</span>
              </div>

              <div style={s.metricBox}>
                <span style={s.metricLabel}>Retention Risk</span>
                <span style={{
                  ...s.metricValue,
                  color: results.retentionRisk === "High" ? "#dc2626" : results.retentionRisk === "Medium" ? "#d97706" : "#16a34a"
                }}>
                  {results.retentionRisk}
                </span>
                <span style={s.metricSub}>
                  {results.recommendToOthers ? "Would recommend to others" : "Would not recommend to others"}
                </span>
              </div>
            </div>

            {/* Summary */}
            <div style={s.summaryBox}>
              <span style={s.boxLabel}>Executive Summary</span>
              <p style={s.summaryText}>{results.executiveSummary}</p>
            </div>

            {/* Themes */}
            <div style={s.section}>
              <span style={s.boxLabel}>Key Themes</span>
              <div style={s.tagRow}>
                {(results.topThemes || []).map((t, i) => (
                  <span key={i} style={s.tag}>{t}</span>
                ))}
              </div>
            </div>

            {/* Strengths + Areas */}
            <div style={s.twoCol}>
              <div style={{ ...s.miniBox, borderColor: "#bbf7d0" }}>
                <span style={{ ...s.boxLabel, color: "#16a34a" }}>Strengths</span>
                {(results.strengths || []).map((str, i) => (
                  <div key={i} style={s.listItem}>
                    <span style={{ ...s.listBullet, color: "#16a34a" }}>✓</span> {str}
                  </div>
                ))}
              </div>
              <div style={{ ...s.miniBox, borderColor: "#fecaca" }}>
                <span style={{ ...s.boxLabel, color: "#dc2626" }}>Improvement Areas</span>
                {(results.improvements || []).map((imp, i) => (
                  <div key={i} style={s.listItem}>
                    <span style={{ ...s.listBullet, color: "#dc2626" }}>!</span> {imp}
                  </div>
                ))}
              </div>
            </div>

            <button className="restart-btn" style={s.btnSecondary} onClick={restart}>
              Start New Interview
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

const s = {
  shell: {
    minHeight: "100vh",
    background: "#f9fafb",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    display: "flex",
    flexDirection: "column",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 28px",
    background: "white",
    borderBottom: "1px solid #f3f4f6",
  },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  logoIcon: {
    width: 28, height: 28, borderRadius: 8, background: "#6366f1",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  logoText: { fontSize: 16, fontWeight: 700, color: "#111827", letterSpacing: "0.02em" },
  confidential: {
    fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
    color: "#9ca3af", border: "1px solid #e5e7eb", borderRadius: 4, padding: "3px 8px",
  },
  progressTrack: { height: 3, background: "#f3f4f6" },
  progressFill: { height: "100%", background: "linear-gradient(90deg, #6366f1, #818cf8)", borderRadius: 9999 },
  body: {
    flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start",
    padding: "40px 16px 60px",
  },
  card: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: "40px",
    maxWidth: 560,
    width: "100%",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.04)",
  },
  introIcon: { marginBottom: 20 },
  h1: { fontSize: 28, fontWeight: 700, color: "#111827", marginBottom: 14, lineHeight: 1.2 },
  h2: { fontSize: 20, fontWeight: 600, color: "#111827", marginBottom: 20, lineHeight: 1.4 },
  lead: { fontSize: 15, color: "#6b7280", lineHeight: 1.75, marginBottom: 24 },
  pills: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 },
  pill: {
    fontSize: 12, padding: "4px 12px", borderRadius: 9999,
    background: "#eef2ff", color: "#6366f1", border: "1px solid #e0e7ff",
  },
  errorBox: {
    background: "#fee2e2", color: "#dc2626", borderRadius: 8,
    padding: "10px 14px", fontSize: 13, marginBottom: 16,
  },
  btnPrimary: {
    display: "block", width: "100%",
    background: "#6366f1", color: "white", border: "none",
    borderRadius: 10, padding: "13px 20px",
    fontSize: 15, fontWeight: 600, cursor: "pointer",
    marginTop: 8, transition: "background 0.15s",
  },
  btnGhost: {
    background: "transparent", color: "#6b7280",
    border: "1px solid #e5e7eb", borderRadius: 10,
    padding: "11px 20px", fontSize: 14, cursor: "pointer",
    transition: "all 0.15s",
  },
  btnSecondary: {
    display: "block", width: "100%",
    background: "white", color: "#374151",
    border: "1px solid #e5e7eb", borderRadius: 10,
    padding: "12px 20px", fontSize: 14, cursor: "pointer",
    marginTop: 24, transition: "background 0.15s",
  },
  qMeta: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  qCounter: { fontSize: 12, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "monospace" },
  dotRow: { display: "flex", gap: 6 },
  dot: { width: 8, height: 8, borderRadius: "50%", transition: "background 0.3s" },
  textarea: {
    width: "100%", boxSizing: "border-box",
    background: "#fafafa", border: "1.5px solid #e5e7eb", borderRadius: 10,
    padding: "14px", fontSize: 15, fontFamily: "'Georgia', serif",
    color: "#111827", lineHeight: 1.7, resize: "vertical",
    transition: "border-color 0.2s",
  },
  hint: { fontSize: 12, color: "#d1d5db", marginTop: 8, marginBottom: 20 },
  btnRow: { display: "flex", gap: 10, alignItems: "center" },
  resultsHeader: { marginBottom: 24 },
  metricsRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 },
  metricBox: {
    background: "#fafafa", border: "1px solid #f3f4f6",
    borderRadius: 12, padding: "16px",
  },
  metricLabel: { display: "block", fontSize: 11, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8 },
  metricValue: { display: "block", fontSize: 20, fontWeight: 700, marginBottom: 10 },
  metricSub: { display: "block", fontSize: 12, color: "#9ca3af", marginTop: 8 },
  scoreBarTrack: { height: 4, background: "#f3f4f6", borderRadius: 9999, overflow: "hidden", marginBottom: 6 },
  scoreBarFill: { height: "100%", borderRadius: 9999 },
  scoreNum: { fontSize: 12, color: "#9ca3af", fontFamily: "monospace" },
  summaryBox: {
    background: "#fafafa", border: "1px solid #e5e7eb",
    borderRadius: 12, padding: "16px", marginBottom: 18,
  },
  boxLabel: { display: "block", fontSize: 11, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 10 },
  summaryText: { fontSize: 14, color: "#374151", lineHeight: 1.75, margin: 0 },
  section: { marginBottom: 18 },
  tagRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  tag: {
    fontSize: 12, padding: "5px 12px", borderRadius: 9999,
    background: "#eef2ff", color: "#6366f1", border: "1px solid #e0e7ff",
  },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  miniBox: {
    background: "#fafafa", border: "1px solid",
    borderRadius: 12, padding: "14px",
  },
  listItem: { fontSize: 13, color: "#374151", marginTop: 8, display: "flex", gap: 8, lineHeight: 1.5 },
  listBullet: { fontWeight: 700, flexShrink: 0 },
};