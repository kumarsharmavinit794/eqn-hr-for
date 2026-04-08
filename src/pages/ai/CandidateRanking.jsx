import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Flame, Loader2, Sparkles, Star, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

const employeeProfiles = [
  { name: "Rahul Sharma", score: 92, role: "Frontend Engineer", avatar: "RS", department: "Engineering", productivity: 88, taskCompletion: 91, attendance: 95, peerFeedback: 90, managerRating: 94, salaryLpa: 18, tasksAssigned: 34, tasksCompleted: 31, overdueTasks: 3, avgCompletionDays: 2.8, engagement: 87, overtime: 8, trend: [78, 82, 90, 94, 92], skillRadar: { React: 85, "Node.js": 70, Leadership: 60, Communication: 75, ProblemSolving: 88 }, timeline: ["2022 Joined", "2023 Promotion", "2024 Team Lead"], heatmap: [90, 85, 95, 92, 88] },
  { name: "Aman Verma", score: 85, role: "Backend Developer", avatar: "AV", department: "Engineering", productivity: 82, taskCompletion: 84, attendance: 89, peerFeedback: 79, managerRating: 86, salaryLpa: 14, tasksAssigned: 28, tasksCompleted: 24, overdueTasks: 4, avgCompletionDays: 3.2, engagement: 69, overtime: 14, trend: [80, 81, 84, 86, 85], skillRadar: { React: 62, "Node.js": 86, Leadership: 52, Communication: 68, ProblemSolving: 81 }, timeline: ["2021 Joined", "2023 Internal Transfer"], heatmap: [76, 80, 84, 82, 79] },
  { name: "Priya Singh", score: 95, role: "Full Stack Engineer", avatar: "PS", department: "Product", productivity: 93, taskCompletion: 96, attendance: 94, peerFeedback: 95, managerRating: 96, salaryLpa: 22, tasksAssigned: 38, tasksCompleted: 37, overdueTasks: 1, avgCompletionDays: 2.1, engagement: 92, overtime: 6, trend: [86, 89, 92, 96, 95], skillRadar: { React: 90, "Node.js": 88, Leadership: 80, Communication: 84, ProblemSolving: 92 }, timeline: ["2020 Joined", "2022 Promotion", "2024 Principal IC"], heatmap: [94, 92, 96, 95, 93] },
  { name: "Neha Gupta", score: 88, role: "UI/UX Designer", avatar: "NG", department: "Design", productivity: 86, taskCompletion: 87, attendance: 92, peerFeedback: 89, managerRating: 88, salaryLpa: 16, tasksAssigned: 26, tasksCompleted: 24, overdueTasks: 2, avgCompletionDays: 3.0, engagement: 83, overtime: 7, trend: [79, 84, 86, 89, 88], skillRadar: { React: 52, "Node.js": 35, Leadership: 65, Communication: 88, ProblemSolving: 80 }, timeline: ["2022 Joined", "2024 Senior Designer"], heatmap: [85, 87, 89, 86, 83] },
];

const medalByRank = [
  { label: "Gold", icon: "🥇", color: "text-amber-700", bg: "bg-amber-50 dark:bg-amber-950/40", border: "border-amber-200 dark:border-amber-900" },
  { label: "Silver", icon: "🥈", color: "text-slate-700", bg: "bg-slate-100 dark:bg-slate-800", border: "border-slate-300 dark:border-slate-700" },
  { label: "Bronze", icon: "🥉", color: "text-orange-700", bg: "bg-orange-50 dark:bg-orange-950/40", border: "border-orange-200 dark:border-orange-900" },
  { label: "4th", icon: "⭐", color: "text-blue-700", bg: "bg-blue-50 dark:bg-blue-950/40", border: "border-blue-200 dark:border-blue-900" },
];

function performanceStatus(score) {
  if (score >= 93) return { label: "Outstanding", cls: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300" };
  if (score >= 88) return { label: "Excellent", cls: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300" };
  if (score >= 83) return { label: "Good", cls: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300" };
  if (score >= 75) return { label: "Average", cls: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-300" };
  return { label: "Needs Improvement", cls: "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300" };
}

function CandidateRankingModern() {
  const [ranked, setRanked] = useState([]);
  const [triggered, setTriggered] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [compareA, setCompareA] = useState(employeeProfiles[0].name);
  const [compareB, setCompareB] = useState(employeeProfiles[1].name);

  const handleRank = () => {
    setAnimating(true);
    setRanked([]);
    setTimeout(() => {
      const sorted = [...employeeProfiles].sort((a, b) => b.score - a.score);
      setRanked(sorted);
      setTriggered(true);
      setAnimating(false);
    }, 400);
  };

  const source = triggered ? ranked : employeeProfiles;
  const topPerformer = source[0];
  const avgScore = Math.round(source.reduce((sum, item) => sum + item.score, 0) / source.length);
  const above85 = source.filter((item) => item.score >= 85).length;
  const needsWork = source.filter((item) => item.score < 80).length;
  const selected = source[0];

  const teamLeaderboard = useMemo(() => {
    const grouped = source.reduce((acc, item) => {
      if (!acc[item.department]) acc[item.department] = [];
      acc[item.department].push(item.score);
      return acc;
    }, {});
    return Object.entries(grouped)
      .map(([department, scores]) => ({ department, score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) }))
      .sort((a, b) => b.score - a.score);
  }, [source]);

  const compOne = source.find((item) => item.name === compareA) || source[0];
  const compTwo = source.find((item) => item.name === compareB) || source[1];
  const aiInsight = selected
    ? `${selected.name} performance changed ${selected.trend[selected.trend.length - 1] - selected.trend[Math.max(0, selected.trend.length - 3)]}% in the last 3 months from stronger task completion and attendance discipline.`
    : "";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Employee Rankings</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Performance leaderboard across the organization</p>
          </div>
          <Button onClick={handleRank}>{triggered ? "Re-evaluate Employees" : "Rank Employees"}</Button>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Top Performance Score", value: `${topPerformer?.score || 0}%`, icon: Trophy },
            { label: "Average Performance", value: `${avgScore}%`, icon: Sparkles },
            { label: "Employees Above 85%", value: above85, icon: Star },
            { label: "Need Improvement", value: needsWork, icon: BarChart3 },
          ].map((item) => (
            <Card key={item.label} className="dark:border-slate-700 dark:bg-slate-900">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.label}</p>
                  <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">{item.value}</p>
                </div>
                <item.icon className="h-5 w-5 text-slate-500" />
              </CardContent>
            </Card>
          ))}
        </div>

        {animating && (
          <Card className="dark:border-slate-700 dark:bg-slate-900">
            <CardContent className="flex items-center gap-2 p-5 text-sm text-slate-600 dark:text-slate-300">
              <Loader2 className="h-4 w-4 animate-spin" /> Running performance intelligence evaluation...
            </CardContent>
          </Card>
        )}

        {!animating && (
          <>
            <div className="grid gap-4 lg:grid-cols-3">
              {[source[1], source[0], source[2]].map((employee, idx) => {
                if (!employee) return null;
                const rank = source.indexOf(employee);
                const medal = medalByRank[rank];
                return (
                  <motion.div key={employee.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}>
                    <Card className={`border ${medal.border} ${medal.bg}`}>
                      <CardContent className="p-5 text-center">
                        <p className="text-2xl">{medal.icon}</p>
                        <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{employee.name}</p>
                        <p className="text-sm text-slate-500">{employee.department}</p>
                        <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{employee.score}%</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <Card className="dark:border-slate-700 dark:bg-slate-900">
              <CardHeader><CardTitle className="text-base">Employee Leaderboard</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="py-3 pr-4">Rank</th>
                        <th className="py-3 pr-4">Employee</th>
                        <th className="py-3 pr-4">Department</th>
                        <th className="py-3 pr-4">Role</th>
                        <th className="py-3 pr-4">Performance</th>
                        <th className="py-3 pr-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {source.map((item, index) => {
                        const meta = performanceStatus(item.score);
                        return (
                          <tr key={item.name} className="border-b border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40">
                            <td className="py-3 pr-4 font-semibold">#{index + 1}</td>
                            <td className="py-3 pr-4">{item.name}</td>
                            <td className="py-3 pr-4">{item.department}</td>
                            <td className="py-3 pr-4">{item.role}</td>
                            <td className="py-3 pr-4"><div className="min-w-[170px]"><div className="mb-1 text-xs">{item.score}%</div><Progress value={item.score} /></div></td>
                            <td className="py-3 pr-4"><Badge variant="outline" className={meta.cls}>{meta.label}</Badge></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {!animating && selected && (
          <>
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader><CardTitle className="text-base">Employee Performance Intelligence</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">Overall Performance Score: <b>{selected.score}</b></p>
                  {[["Productivity", selected.productivity], ["Task Completion", selected.taskCompletion], ["Attendance", selected.attendance], ["Peer Feedback", selected.peerFeedback], ["Manager Rating", selected.managerRating]].map(([label, value]) => (
                    <div key={String(label)}><div className="mb-1 flex justify-between text-xs"><span>{label}</span><span>{value}</span></div><Progress value={Number(value)} /></div>
                  ))}
                </CardContent>
              </Card>
              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader><CardTitle className="text-base">Performance Trend Graph</CardTitle></CardHeader>
                <CardContent>
                  <div className="mb-2 flex justify-between text-xs text-slate-500">{["Jan","Feb","Mar","Apr","May"].map((m) => <span key={m}>{m}</span>)}</div>
                  <svg viewBox="0 0 300 120" className="w-full">
                    <polyline fill="none" stroke="rgb(37 99 235)" strokeWidth="3" points={selected.trend.map((v, i) => `${i * 70 + 10},${110 - v}`).join(" ")} />
                    {selected.trend.map((v, i) => <circle key={`${v}-${i}`} cx={i * 70 + 10} cy={110 - v} r="4" fill="rgb(37 99 235)" />)}
                  </svg>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{aiInsight}</p>
                </CardContent>
              </Card>
              <Card className="dark:border-slate-700 dark:bg-slate-900">
                <CardHeader><CardTitle className="text-base">Skill Growth Tracker</CardTitle></CardHeader>
                <CardContent className="space-y-2">{Object.entries(selected.skillRadar).map(([skill, value]) => <div key={skill}><div className="mb-1 flex justify-between text-xs"><span>{skill}</span><span>{value}</span></div><Progress value={value} /></div>)}</CardContent>
              </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">Team Performance Leaderboard</CardTitle></CardHeader><CardContent className="space-y-2">{teamLeaderboard.map((team) => <div key={team.department} className="flex items-center justify-between rounded-lg border px-3 py-2 dark:border-slate-700"><span>{team.department}</span><Badge variant="outline">{team.score}</Badge></div>)}</CardContent></Card>
              <Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">Workload Intelligence</CardTitle></CardHeader><CardContent className="space-y-2 text-sm"><p>Tasks Assigned: <b>{selected.tasksAssigned}</b></p><p>Tasks Completed: <b>{selected.tasksCompleted}</b></p><p>Overdue Tasks: <b>{selected.overdueTasks}</b></p><p>Average Completion Time: <b>{selected.avgCompletionDays} days</b></p><p>Engagement Score: <b>{selected.engagement}</b></p></CardContent></Card>
              <Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">Salary vs Performance Analytics</CardTitle></CardHeader><CardContent className="space-y-2 text-sm"><p>Salary: <b>₹{selected.salaryLpa} LPA</b></p><p>Performance Score: <b>{selected.score}</b></p><p>Performance Efficiency Index: <b>{selected.score / selected.salaryLpa > 5 ? "High" : "Moderate"}</b></p><p>Promotion Probability: <b>{Math.min(95, Math.round((selected.score + selected.managerRating) / 2))}%</b></p><p>Attrition Risk: <b>{Math.max(18, Math.min(82, 100 - selected.engagement + selected.overtime))}%</b></p></CardContent></Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">Employee Comparison Panel</CardTitle></CardHeader><CardContent className="space-y-3"><div className="grid gap-3 sm:grid-cols-2"><Select value={compareA} onValueChange={setCompareA}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{source.map((item) => <SelectItem key={item.name} value={item.name}>{item.name}</SelectItem>)}</SelectContent></Select><Select value={compareB} onValueChange={setCompareB}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{source.map((item) => <SelectItem key={item.name} value={item.name}>{item.name}</SelectItem>)}</SelectContent></Select></div><div className="grid gap-3 sm:grid-cols-2">{[compOne, compTwo].map((e) => <div key={e.name} className="rounded-lg border p-3 text-sm dark:border-slate-700"><p className="font-semibold">{e.name}</p><p>Score: {e.score}</p><p>Role: {e.role}</p><p>Manager Rating: {e.managerRating}</p><p>Promotion Probability: {Math.min(95, Math.round((e.score + e.managerRating) / 2))}%</p></div>)}</div></CardContent></Card>
              <Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">Recognition, Timeline, Productivity Heatmap</CardTitle></CardHeader><CardContent className="space-y-3 text-sm"><div className="flex flex-wrap gap-2"><Badge variant="secondary"><Trophy className="mr-1 h-3.5 w-3.5" />Top Performer</Badge><Badge variant="secondary"><Star className="mr-1 h-3.5 w-3.5" />Rising Star</Badge><Badge variant="secondary"><Flame className="mr-1 h-3.5 w-3.5" />Consistent Performer</Badge></div><div><p className="font-medium">Employee Growth Timeline</p>{selected.timeline.map((t) => <p key={t}>- {t}</p>)}</div><div><p className="font-medium">Productivity Heatmap</p><div className="grid grid-cols-5 gap-2">{selected.heatmap.map((v, i) => <div key={`${v}-${i}`} className="rounded-md bg-slate-100 px-2 py-1 text-center text-xs dark:bg-slate-800">{["Mon","Tue","Wed","Thu","Fri"][i]} {v}</div>)}</div></div></CardContent></Card>
            </div>

            <Card className="dark:border-slate-700 dark:bg-slate-900"><CardHeader><CardTitle className="text-base">AI Action Recommendations</CardTitle></CardHeader><CardContent className="space-y-2 text-sm"><p>- Promote {source[0]?.name} based on consistent top-tier score and manager feedback.</p><p>- Provide targeted coaching to {source[source.length - 1]?.name} for completion discipline and engagement boost.</p><p>- Rebalance workload in {teamLeaderboard[teamLeaderboard.length - 1]?.department || "lowest performing"} team to reduce attrition risk.</p></CardContent></Card>
          </>
        )}
      </div>
    </div>
  );
}

export default CandidateRankingModern;

function LegacyCandidateRanking() {
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
