import { useState } from "react";

const candidates = [
  { name: "Rahul Sharma", score: 92, role: "Frontend Engineer", avatar: "RS" },
  { name: "Aman Verma", score: 85, role: "Backend Developer", avatar: "AV" },
  { name: "Priya Singh", score: 95, role: "Full Stack Engineer", avatar: "PS" },
  { name: "Neha Gupta", score: 88, role: "UI/UX Designer", avatar: "NG" },
];

const medalConfig = [
  { bg: "#FFF8E7", border: "#F5C842", text: "#B8860B", label: "Gold",   icon: "▲" },
  { bg: "#F5F5F5", border: "#A8A8A8", text: "#5A5A5A", label: "Silver", icon: "▲" },
  { bg: "#FFF0E8", border: "#CD7F32", text: "#8B4513", label: "Bronze", icon: "▲" },
  { bg: "#F0F4FF", border: "#7B9FE0", text: "#3A5A9E", label: "4th",    icon: "▲" },
];

function getScoreMeta(score) {
  if (score >= 93) return { label: "Outstanding", color: "#0D7A4E", bg: "#E6F9F1" };
  if (score >= 88) return { label: "Excellent",   color: "#1A5FB5", bg: "#E8F0FD" };
  if (score >= 83) return { label: "Good",         color: "#7A4F00", bg: "#FFF3CD" };
  return              { label: "Average",          color: "#8B1A1A", bg: "#FDEAEA" };
}

const avatarColors = [
  { bg: "#E8F0FD", text: "#1A5FB5" },
  { bg: "#E6F9F1", text: "#0D7A4E" },
  { bg: "#FFF0FB", text: "#8B2070" },
  { bg: "#FFF3E0", text: "#B05A00" },
];

export default function CandidateRanking() {
  const [ranked, setRanked] = useState([]);
  const [triggered, setTriggered] = useState(false);
  const [animating, setAnimating] = useState(false);

  const handleRank = () => {
    setAnimating(true);
    setRanked([]);
    setTimeout(() => {
      const sorted = [...candidates].sort((a, b) => b.score - a.score);
      setRanked(sorted);
      setTriggered(true);
      setAnimating(false);
    }, 400);
  };

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .card-enter {
          animation: slideUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .bar-fill {
          animation: growBar 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes growBar {
          from { width: 0%; }
        }

        .rank-btn {
          background: #0F1923;
          color: #fff;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: 0.02em;
          padding: 14px 32px;
          border-radius: 10px;
          width: 100%;
          transition: background 0.18s, transform 0.12s;
        }
        .rank-btn:hover { background: #1E2D3E; }
        .rank-btn:active { transform: scale(0.98); }

        .row-card {
          transition: box-shadow 0.18s, transform 0.18s;
          cursor: default;
        }
        .row-card:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.09);
          transform: translateY(-2px);
        }
      `}</style>

      <div style={styles.wrapper}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerTop}>
            <span style={styles.tag}>Assessment Results</span>
          </div>
          <h1 style={styles.title}>Candidate Ranking</h1>
          <p style={styles.subtitle}>
            {triggered
              ? `${ranked.length} candidates evaluated · Sorted by performance score`
              : "Click below to evaluate and rank all candidates"}
          </p>
        </div>

        {/* Top 3 podium — visible after rank */}
        {ranked.length > 0 && (
          <div style={styles.podium}>
            {[ranked[1], ranked[0], ranked[2]].map((c, idx) => {
              if (!c) return null;
              const realRank = ranked.indexOf(c);
              const m = medalConfig[realRank];
              const av = avatarColors[realRank % avatarColors.length];
              const heights = [90, 120, 70];
              return (
                <div key={c.name} style={{ ...styles.podiumItem, animationDelay: `${idx * 0.1}s` }} className="card-enter">
                  <div style={{ ...styles.podiumAvatar, background: av.bg, color: av.text }}>{c.avatar}</div>
                  <p style={styles.podiumName}>{c.name.split(" ")[0]}</p>
                  <p style={styles.podiumScore}>{c.score}%</p>
                  <div style={{ ...styles.podiumBar, height: heights[idx], background: m.bg, borderTop: `3px solid ${m.border}` }}>
                    <span style={{ ...styles.podiumRank, color: m.text }}>#{realRank + 1}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Full list */}
        {ranked.length > 0 && (
          <div style={styles.list}>
            <p style={styles.listLabel}>Full Rankings</p>
            {ranked.map((c, i) => {
              const m = medalConfig[i];
              const meta = getScoreMeta(c.score);
              const av = avatarColors[i % avatarColors.length];
              return (
                <div
                  key={c.name}
                  className="row-card card-enter"
                  style={{ ...styles.rowCard, animationDelay: `${i * 0.08}s` }}
                >
                  {/* Rank */}
                  <div style={{ ...styles.rankBadge, background: m.bg, border: `1px solid ${m.border}`, color: m.text }}>
                    #{i + 1}
                  </div>

                  {/* Avatar */}
                  <div style={{ ...styles.avatar, background: av.bg, color: av.text }}>{c.avatar}</div>

                  {/* Info */}
                  <div style={styles.info}>
                    <div style={styles.nameRow}>
                      <span style={styles.name}>{c.name}</span>
                      <span style={{ ...styles.statusBadge, background: meta.bg, color: meta.color }}>
                        {meta.label}
                      </span>
                    </div>
                    <span style={styles.role}>{c.role}</span>
                    <div style={styles.barTrack}>
                      <div
                        className="bar-fill"
                        style={{ ...styles.barFill, width: `${c.score}%`, background: m.border }}
                      />
                    </div>
                  </div>

                  {/* Score */}
                  <div style={styles.scoreBox}>
                    <span style={styles.scoreNum}>{c.score}</span>
                    <span style={styles.scorePct}>%</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Loading state */}
        {animating && (
          <div style={styles.loading}>
            <div style={styles.spinner} />
            <p style={styles.loadingText}>Evaluating candidates…</p>
          </div>
        )}

        {/* Button */}
        <button className="rank-btn" onClick={handleRank}>
          {triggered ? "Re-evaluate Candidates" : "Rank Candidates"}
        </button>

        {/* Footer */}
        {triggered && (
          <p style={styles.footer}>
            Top performer: <strong>{ranked[0]?.name}</strong> with {ranked[0]?.score}% score
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'DM Sans', sans-serif",
    minHeight: "100vh",
    background: "#F7F8FA",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "40px 16px",
  },
  wrapper: {
    width: "100%",
    maxWidth: 520,
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  header: {
    background: "#fff",
    borderRadius: 16,
    padding: "28px 28px 24px",
    border: "1px solid #EAEAEA",
  },
  headerTop: { marginBottom: 12 },
  tag: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#888",
    background: "#F2F2F2",
    padding: "4px 10px",
    borderRadius: 6,
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 28,
    fontWeight: 700,
    color: "#0F1923",
    marginBottom: 6,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    lineHeight: 1.5,
  },
  podium: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 12,
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #EAEAEA",
    padding: "24px 16px 0",
    overflow: "hidden",
  },
  podiumItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  },
  podiumAvatar: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    fontSize: 14,
    marginBottom: 6,
  },
  podiumName: { fontSize: 13, fontWeight: 600, color: "#0F1923", marginBottom: 2 },
  podiumScore: { fontSize: 12, color: "#888", marginBottom: 8 },
  podiumBar: {
    width: "100%",
    borderRadius: "8px 8px 0 0",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingTop: 8,
  },
  podiumRank: { fontSize: 13, fontWeight: 700 },
  list: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #EAEAEA",
    padding: "20px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  listLabel: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#AAA",
    marginBottom: 4,
  },
  rowCard: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #F0F0F0",
    background: "#FAFAFA",
  },
  rankBadge: {
    minWidth: 36,
    height: 36,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 600,
    flexShrink: 0,
  },
  info: { flex: 1, minWidth: 0 },
  nameRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
    flexWrap: "wrap",
  },
  name: { fontSize: 14, fontWeight: 600, color: "#0F1923" },
  statusBadge: {
    fontSize: 11,
    fontWeight: 600,
    padding: "2px 8px",
    borderRadius: 6,
  },
  role: { fontSize: 12, color: "#999", display: "block", marginBottom: 8 },
  barTrack: {
    height: 5,
    background: "#EFEFEF",
    borderRadius: 99,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 99,
  },
  scoreBox: {
    display: "flex",
    alignItems: "baseline",
    gap: 1,
    flexShrink: 0,
  },
  scoreNum: { fontSize: 22, fontWeight: 700, color: "#0F1923" },
  scorePct: { fontSize: 12, color: "#999", fontWeight: 500 },
  loading: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    padding: "24px 0",
  },
  spinner: {
    width: 28,
    height: 28,
    border: "3px solid #EAEAEA",
    borderTop: "3px solid #0F1923",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
  loadingText: { fontSize: 14, color: "#999" },
  footer: {
    textAlign: "center",
    fontSize: 13,
    color: "#AAA",
  },
};