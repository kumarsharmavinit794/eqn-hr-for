import { useState } from "react";

const complianceData = [
  {
    id: 1,
    title: "PF Compliance",
    description: "Provident Fund deductions & remittance",
    status: "compliant",
    dueDate: "Mar 15, 2025",
    lastUpdated: "Mar 12, 2025",
    category: "Statutory",
    progress: 100,
  },
  {
    id: 2,
    title: "ESI Compliance",
    description: "Employee State Insurance contributions",
    status: "compliant",
    dueDate: "Mar 21, 2025",
    lastUpdated: "Mar 19, 2025",
    category: "Statutory",
    progress: 100,
  },
  {
    id: 3,
    title: "Tax Filing",
    description: "Quarterly TDS return filing",
    status: "pending",
    dueDate: "Apr 30, 2025",
    lastUpdated: "Mar 01, 2025",
    category: "Taxation",
    progress: 45,
  },
  {
    id: 4,
    title: "Labour Law Audit",
    description: "Annual compliance audit report",
    status: "overdue",
    dueDate: "Feb 28, 2025",
    lastUpdated: "Jan 15, 2025",
    category: "Audit",
    progress: 20,
  },
  {
    id: 5,
    title: "PT Compliance",
    description: "Professional Tax monthly filing",
    status: "compliant",
    dueDate: "Mar 31, 2025",
    lastUpdated: "Mar 28, 2025",
    category: "Taxation",
    progress: 100,
  },
  {
    id: 6,
    title: "Gratuity Filing",
    description: "Annual gratuity liability statement",
    status: "pending",
    dueDate: "May 15, 2025",
    lastUpdated: "Mar 10, 2025",
    category: "Statutory",
    progress: 60,
  },
];

const statusConfig = {
  compliant: {
    label: "Compliant",
    bg: "#E6F9F1",
    text: "#0D7A4E",
    border: "#A3D9C0",
    dot: "#0D7A4E",
    barColor: "#0D7A4E",
  },
  pending: {
    label: "Pending",
    bg: "#FFF8E1",
    text: "#B07800",
    border: "#FFD54F",
    dot: "#F59E0B",
    barColor: "#F59E0B",
  },
  overdue: {
    label: "Overdue",
    bg: "#FDEAEA",
    text: "#9B1C1C",
    border: "#F5AAAA",
    dot: "#DC2626",
    barColor: "#DC2626",
  },
};

const categoryColors = {
  Statutory: { bg: "#EEF2FF", text: "#3730A3" },
  Taxation:  { bg: "#FDF4FF", text: "#7E22CE" },
  Audit:     { bg: "#FFF7ED", text: "#C2410C" },
};

const filters = ["All", "Compliant", "Pending", "Overdue"];

export default function Compliance() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedId, setExpandedId] = useState(null);

  const filtered = complianceData.filter((item) => {
    if (activeFilter === "All") return true;
    return item.status === activeFilter.toLowerCase();
  });

  const counts = {
    compliant: complianceData.filter((d) => d.status === "compliant").length,
    pending:   complianceData.filter((d) => d.status === "pending").length,
    overdue:   complianceData.filter((d) => d.status === "overdue").length,
  };

  const overallHealth = Math.round(
    complianceData.reduce((acc, d) => acc + d.progress, 0) / complianceData.length
  );

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .filter-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          padding: 7px 16px;
          border-radius: 99px;
          border: 1px solid #E0E0E0;
          background: #fff;
          color: #666;
          cursor: pointer;
          transition: all 0.15s;
        }
        .filter-btn:hover { border-color: #bbb; color: #333; }
        .filter-btn.active {
          background: #0F1923;
          color: #fff;
          border-color: #0F1923;
        }

        .comp-card {
          background: #fff;
          border: 1px solid #EAEAEA;
          border-radius: 14px;
          padding: 18px 20px;
          cursor: pointer;
          transition: box-shadow 0.18s, transform 0.15s;
        }
        .comp-card:hover {
          box-shadow: 0 4px 18px rgba(0,0,0,0.07);
          transform: translateY(-2px);
        }

        .bar-fill {
          height: 100%;
          border-radius: 99px;
          animation: growBar 0.9s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes growBar { from { width: 0%; } }

        .card-in {
          animation: fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .dot-pulse {
          width: 8px; height: 8px; border-radius: 50%;
          display: inline-block;
        }
      `}</style>

      <div style={styles.wrapper}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>HR Dashboard</p>
            <h1 style={styles.title}>Compliance Tracking</h1>
            <p style={styles.subtitle}>Monitor statutory & regulatory obligations in real-time</p>
          </div>
          <div style={styles.healthRing}>
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="28" fill="none" stroke="#F0F0F0" strokeWidth="7" />
              <circle
                cx="36" cy="36" r="28"
                fill="none"
                stroke={overallHealth >= 80 ? "#0D7A4E" : overallHealth >= 50 ? "#F59E0B" : "#DC2626"}
                strokeWidth="7"
                strokeDasharray={`${(overallHealth / 100) * 175.9} 175.9`}
                strokeLinecap="round"
                transform="rotate(-90 36 36)"
                style={{ transition: "stroke-dasharray 1s ease" }}
              />
            </svg>
            <div style={styles.healthInner}>
              <span style={styles.healthNum}>{overallHealth}%</span>
            </div>
            <p style={styles.healthLabel}>Overall Health</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={styles.summaryGrid}>
          {[
            { label: "Compliant",  value: counts.compliant, ...statusConfig.compliant },
            { label: "Pending",    value: counts.pending,   ...statusConfig.pending },
            { label: "Overdue",    value: counts.overdue,   ...statusConfig.overdue },
            { label: "Total Items", value: complianceData.length, bg: "#F5F5F5", text: "#444", border: "#E0E0E0", dot: "#888" },
          ].map((s) => (
            <div key={s.label} style={{ ...styles.summaryCard, background: s.bg, border: `1px solid ${s.border}` }}>
              <span className="dot-pulse" style={{ background: s.dot, marginBottom: 10 }} />
              <span style={{ ...styles.summaryVal, color: s.text }}>{s.value}</span>
              <span style={{ ...styles.summaryLabel, color: s.text }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={styles.filterRow}>
          {filters.map((f) => (
            <button
              key={f}
              className={`filter-btn ${activeFilter === f ? "active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div style={styles.cardGrid}>
          {filtered.map((item, i) => {
            const s = statusConfig[item.status];
            const cat = categoryColors[item.category];
            const isOpen = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="comp-card card-in"
                style={{ animationDelay: `${i * 0.07}s` }}
                onClick={() => setExpandedId(isOpen ? null : item.id)}
              >
                {/* Top row */}
                <div style={styles.cardTop}>
                  <div style={{ flex: 1 }}>
                    <div style={styles.cardTitleRow}>
                      <span style={styles.cardTitle}>{item.title}</span>
                      <span style={{ ...styles.catBadge, background: cat.bg, color: cat.text }}>
                        {item.category}
                      </span>
                    </div>
                    <p style={styles.cardDesc}>{item.description}</p>
                  </div>
                  <span style={{ ...styles.statusBadge, background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>
                    <span className="dot-pulse" style={{ background: s.dot, width: 6, height: 6, marginRight: 5 }} />
                    {s.label}
                  </span>
                </div>

                {/* Progress */}
                <div style={{ marginTop: 14 }}>
                  <div style={styles.progressMeta}>
                    <span style={styles.progressLabel}>Progress</span>
                    <span style={{ ...styles.progressPct, color: s.text }}>{item.progress}%</span>
                  </div>
                  <div style={styles.barTrack}>
                    <div
                      className="bar-fill"
                      style={{ width: `${item.progress}%`, background: s.barColor }}
                    />
                  </div>
                </div>

                {/* Expanded detail */}
                {isOpen && (
                  <div style={styles.expanded}>
                    <div style={styles.expandGrid}>
                      <div style={styles.expandItem}>
                        <span style={styles.expandLabel}>Due Date</span>
                        <span style={styles.expandVal}>{item.dueDate}</span>
                      </div>
                      <div style={styles.expandItem}>
                        <span style={styles.expandLabel}>Last Updated</span>
                        <span style={styles.expandVal}>{item.lastUpdated}</span>
                      </div>
                    </div>
                    <button
                      style={styles.actionBtn}
                      onClick={(e) => { e.stopPropagation(); }}
                    >
                      {item.status === "compliant" ? "View Certificate" : "Take Action →"}
                    </button>
                  </div>
                )}

                <p style={styles.tapHint}>{isOpen ? "Tap to collapse" : "Tap for details"}</p>
              </div>
            );
          })}
        </div>

        <p style={styles.footer}>
          Last synced: March 28, 2025 · Data from HRMS portal
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'DM Sans', sans-serif",
    minHeight: "100vh",
    background: "#F7F8FA",
    padding: "40px 16px",
  },
  wrapper: {
    maxWidth: 680,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  header: {
    background: "#fff",
    borderRadius: 16,
    padding: "28px 28px 24px",
    border: "1px solid #EAEAEA",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#AAA",
    marginBottom: 8,
  },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 30,
    fontWeight: 800,
    color: "#0F1923",
    marginBottom: 6,
  },
  subtitle: { fontSize: 14, color: "#888", lineHeight: 1.5 },
  healthRing: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    flexShrink: 0,
  },
  healthInner: {
    position: "absolute",
    top: 18,
    left: 0,
    right: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  healthNum: { fontSize: 15, fontWeight: 700, color: "#0F1923" },
  healthLabel: { fontSize: 11, color: "#AAA", marginTop: 6, textAlign: "center" },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
  },
  summaryCard: {
    borderRadius: 12,
    padding: "14px 16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 4,
  },
  summaryVal: { fontSize: 26, fontWeight: 700 },
  summaryLabel: { fontSize: 12, fontWeight: 500 },

  filterRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  cardTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 4,
  },
  cardTitle: { fontSize: 15, fontWeight: 600, color: "#0F1923" },
  cardDesc: { fontSize: 12, color: "#999", lineHeight: 1.5 },
  catBadge: {
    fontSize: 10,
    fontWeight: 600,
    padding: "2px 8px",
    borderRadius: 99,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },
  statusBadge: {
    display: "flex",
    alignItems: "center",
    fontSize: 11,
    fontWeight: 600,
    padding: "4px 10px",
    borderRadius: 99,
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  progressMeta: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  progressLabel: { fontSize: 11, color: "#BBB" },
  progressPct: { fontSize: 11, fontWeight: 700 },
  barTrack: {
    height: 5,
    background: "#F0F0F0",
    borderRadius: 99,
    overflow: "hidden",
  },
  expanded: {
    marginTop: 14,
    paddingTop: 14,
    borderTop: "1px solid #F0F0F0",
  },
  expandGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginBottom: 12,
  },
  expandItem: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  expandLabel: { fontSize: 11, color: "#BBB" },
  expandVal: { fontSize: 13, fontWeight: 600, color: "#0F1923" },
  actionBtn: {
    width: "100%",
    padding: "9px",
    borderRadius: 8,
    border: "1px solid #0F1923",
    background: "#0F1923",
    color: "#fff",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  tapHint: {
    fontSize: 11,
    color: "#CCC",
    textAlign: "right",
    marginTop: 10,
  },
  footer: {
    textAlign: "center",
    fontSize: 12,
    color: "#CCC",
    paddingBottom: 8,
  },
};