import { buildHrSupportReply, runHrIntelligence } from "./hr-intelligence";

const K = "nexahr_frontend_only_db";
const wait = (ms = 100) => new Promise((r) => setTimeout(r, ms));
const now = () => new Date().toISOString();
const blob = (text, type = "application/pdf") => new Blob([text], { type });
const copy = (v) => JSON.parse(JSON.stringify(v));

export class MockApiError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "MockApiError";
    this.response = { status, data: { message } };
  }
}

export const isApiError = (error) => error instanceof MockApiError;

export const generateJD = (title, department, extra = "") => `Overview\nWe are hiring a ${title} in ${department}.\n\nResponsibilities\n- Lead execution and delivery\n- Collaborate across functions\n- Improve quality and workflows\n- Communicate risks and progress\n- Support continuous improvement\n\nRequirements\n- Relevant hands-on experience\n- Strong communication skills\n- Ability to work independently\n- Experience with modern tools\n- Problem-solving mindset\n\nNice-to-haves\n- ${extra || "Mentoring and documentation"}\n- Cross-functional collaboration\n- Ownership mindset`;

export const analyzeResumeMock = (fileName) => ({
  ats_score: 82,
  overall_verdict: `${fileName} appears well structured and ATS friendly.`,
  sections_found: ["Contact Info", "Summary", "Experience", "Education", "Skills"],
  keyword_density: "High",
  formatting_score: 80,
  readability_score: 86,
  strengths: ["Clear structure", "Relevant experience", "Strong skills section"],
  weaknesses: ["Needs more metrics", "Summary can be tighter", "Add certifications"],
  improvements: [
    { priority: "High", action: "Add quantified achievements to recent roles." },
    { priority: "Medium", action: "Tailor the summary to the target role." },
    { priority: "Low", action: "Expand tools and certifications." },
  ],
  missing_sections: ["Certifications"],
  top_skills_detected: ["React", "TypeScript", "Communication"],
  experience_years: "4-6 years",
});

export const analyzeExitInterviewMock = (answers) => {
  const text = answers.join(" ").toLowerCase();
  const negative = ["stress", "manager", "salary", "toxic"].filter((t) => text.includes(t)).length;
  const positive = ["growth", "team", "support", "learning"].filter((t) => text.includes(t)).length;
  const overallSentiment = negative > positive ? "Negative" : positive > negative ? "Positive" : "Neutral";
  return {
    overallSentiment,
    sentimentScore: overallSentiment === "Positive" ? 7.8 : overallSentiment === "Negative" ? 4.2 : 5.8,
    retentionRisk: overallSentiment === "Negative" ? "High" : overallSentiment === "Positive" ? "Low" : "Medium",
    topThemes: overallSentiment === "Negative" ? ["Workload", "Manager support", "Compensation"] : ["Growth", "Team culture", "Career progression"],
    executiveSummary: overallSentiment === "Negative" ? "The employee highlighted workload and support concerns. Retention risk appears elevated." : "The employee experience was broadly positive with room to improve long-term growth clarity.",
    strengths: ["Team collaboration", "Meaningful work"],
    improvements: ["Clarify career paths", "Improve manager touchpoints"],
    recommendToOthers: overallSentiment !== "Negative",
  };
};

const seed = () => ({
  auth: { signup_enabled: true, resetTokens: {} },
  users: [
    { id: 1, name: "Aarav Mehta", email: "admin@nexahr.com", role: "admin", password: "Admin@123", phone: "+91 98765 43210", bio: "Admin overseeing people operations.", isActive: true },
    { id: 2, name: "Priya Sharma", email: "hr@nexahr.com", role: "hr", password: "Hr@12345", phone: "+91 91234 56780", bio: "HR lead focused on hiring and culture.", isActive: true },
    { id: 3, name: "Rohan Verma", email: "employee@nexahr.com", role: "employee", password: "Employee@123", phone: "+91 99887 76655", bio: "Frontend engineer building internal tools.", isActive: true },
  ],
  activityLogs: [{ id: 1, action: "User login", detail: "Aarav Mehta signed in from a trusted device", created_at: now() }],
  employees: [
    { id: 1, name: "Aarav Mehta", role: "Admin", dept: "Operations", status: "active", email: "admin@nexahr.com", joined: "2023-01-15" },
    { id: 2, name: "Priya Sharma", role: "HR Lead", dept: "HR", status: "active", email: "hr@nexahr.com", joined: "2023-03-12" },
    { id: 3, name: "Rohan Verma", role: "Frontend Engineer", dept: "Engineering", status: "remote", email: "employee@nexahr.com", joined: "2024-02-04" },
  ],
  jobs: [
    { id: 1, title: "Senior React Developer", department: "Engineering", description: generateJD("Senior React Developer", "Engineering"), min_salary: 1200000, max_salary: 1800000 },
    { id: 2, title: "Product Designer", department: "Design", description: generateJD("Product Designer", "Design"), min_salary: 900000, max_salary: 1400000 },
  ],
  attendance: { clockedIn: false, logs: [
    { id: 1, date: "2026-04-07", clockIn: "2026-04-07T09:32:00.000Z", clockOut: "2026-04-07T18:06:00.000Z", hours: 8.6, status: "present" },
    { id: 2, date: "2026-04-06", clockIn: "2026-04-06T09:48:00.000Z", clockOut: "2026-04-06T18:01:00.000Z", hours: 8.2, status: "present" },
  ]},
  candidates: [
    { id: 1, name: "Aditya Nair", role: "Frontend Engineer", experience: "5 years", skills: ["React", "TypeScript", "Jest"], match: 92, status: "shortlisted", resume_url: "/mock-resume-1.pdf" },
    { id: 2, name: "Sara Khan", role: "UX Designer", experience: "4 years", skills: ["Figma", "Research", "Design Systems"], match: 85, status: "interview", resume_url: "/mock-resume-2.pdf" },
  ],
  culture: {
    metrics: [{ id: 1, label: "Engagement", value: "86%", description: "+4 pts this quarter" }, { id: 2, label: "Retention", value: "92%", description: "Healthy trend" }],
    policies: [{ id: 1, name: "Remote Work Policy", category: "flexibility", views: 123, last_updated: "2026-03-28", content: "Employees may work remotely up to three days per week with manager approval." }],
    safety: [{ id: 1, title: "Office Fire Drill", status: "completed", date: "2026-03-20", score: 94 }],
    scores: [{ id: 1, metric_name: "Belonging", score: 88 }, { id: 2, metric_name: "Career Growth", score: 76 }],
    career: [{ id: 1, title: "Life at NexaHR", content: "We build people-first systems with high ownership and strong mentoring." }],
    branding: [{ id: 1, platform_name: "LinkedIn", followers: "24.6K", posts: 18, engagement: "6.2%" }],
  },
  compliance: {
    laws: [{ id: 1, law_name: "POSH Act 2013", status: "compliant", last_audit: "2026-02-14", next_audit: "2026-08-14" }],
    policies: [{ id: 1, name: "Whistleblower Policy", version: "v2.1", status: "active", updated_at: "2026-03-01", content: "Anonymous reporting channels remain available." }],
    audit: [{ id: 1, area_name: "Payroll Compliance", score: 96, findings: 1, status: "passed", created_at: now() }],
    legalDocs: [{ id: 1, title: "NDA Template", category: "Legal", file_path: "/mock/nda.pdf", created_at: now() }],
  },
  documents: {
    userDocuments: { 1: [{ id: 101, user_id: 1, file_name: "admin-contract.pdf", file_type: "pdf", uploaded_at: now() }], 2: [{ id: 102, user_id: 2, file_name: "priya-pan.pdf", file_type: "pdf", uploaded_at: now() }], 3: [{ id: 103, user_id: 3, file_name: "rohan-resume.pdf", file_type: "pdf", uploaded_at: now() }] },
    contracts: [{ id: 1, title: "Employment Agreement", type: "agreement", used_count: 6, last_modified: now() }],
    offerTemplates: [{ id: 1, title: "Engineering L2 Offer", level: "L2", department: "Engineering", content: "Dear Candidate, we are pleased to offer you the role..." }],
    onboardingDocs: [{ id: 1, name: "Government ID", type: "Identity", status: "verified" }, { id: 2, name: "PAN Card", type: "Tax", status: "uploaded" }, { id: 3, name: "Address Proof", type: "Address", status: "pending" }],
    idCardsIssued: 4,
  },
  exit: {
    cases: [{ id: 1, name: "Ritika Bose", role: "QA Engineer", last_day: "2026-04-30", reason: "Career growth", status: "in-progress", progress: 58 }],
    workflowByCase: { 1: [{ id: 1, step_name: "Manager approval", step_order: 1, completed: true }, { id: 2, step_name: "Knowledge transfer", step_order: 2, completed: false }] },
    assetsByCase: { 1: [{ id: 1, asset_name: "MacBook Pro", status: "pending" }, { id: 2, asset_name: "Access Card", status: "returned" }] },
    settlementByCase: { 1: { earnings: [{ id: 1, item_name: "Salary till last day", amount: 72000 }], deductions: [{ id: 2, item_name: "Asset recovery", amount: 0 }], totals: { total_earnings: 72000, total_deductions: 0, net: 72000 } } },
    letterByCase: { 1: { id: 1, generated_at: now(), content: "This is to certify that Ritika Bose served with NexaHR Technologies.\n\nWe wish her success in future endeavors." } },
    feedbackByCase: { 1: [] },
  },
  engagement: { satisfactionData: [{ name: "Highly Satisfied", value: 42, color: "#10b981" }, { name: "Satisfied", value: 31, color: "#3b82f6" }], feedbackTrends: [{ month: "Jan", score: 4.1 }, { month: "Feb", score: 4.2 }], surveys: [{ title: "Quarterly Pulse Survey", responses: 124, total: 160, status: "active" }], complaints: [{ id: "CMP-1001", subject: "Air conditioning issue", priority: "low", status: "resolved", date: "2026-04-01" }], stats: { satisfactionScore: 4.4, activeSurveys: 1, openComplaints: 1, upcomingEvents: 4 } },
  performance: { stats: { overallScore: 8.6, productivity: 91, growth: 14, awards: 7 }, radar: [{ skill: "Execution", score: 88 }, { skill: "Quality", score: 84 }], trend: [{ month: "Q1", score: 7.8 }, { month: "Q2", score: 8.1 }], kpis: [{ label: "Goal Completion", value: 88, target: 100 }, { label: "Peer Collaboration", value: 84, target: 100 }] },
  onboarding: { hires: [{ id: 1, avatar: "PS", name: "Priya Sharma", role: "HR Lead", joinDate: "Apr 15, 2026", progress: 82 }, { id: 2, avatar: "RK", name: "Riya Khanna", role: "Product Designer", joinDate: "Apr 18, 2026", progress: 61 }] },
  access: { roles: [{ id: 1, role_name: "Admin", users: 1, permissions: ["all", "security", "payroll"] }], permissions: [{ id: 1, permission_name: "View employees" }], security: [{ id: 1, setting_name: "MFA Required", description: "All admin and HR logins require MFA.", enabled: true }], systems: [{ id: 1, name: "GitHub" }, { id: 2, name: "Slack" }], accesses: [{ id: 1, user_id: 1, system_id: 1, system: "GitHub", role: "owner", status: "active" }, { id: 2, user_id: 2, system_id: 2, system: "Slack", role: "admin", status: "active" }] },
  payroll: { payslipsByUser: { 1: [{ id: 201, month: 3, year: 2026, gross_salary: 180000, total_deductions: 22000, net_salary: 158000, status: "paid", earnings: { basic: 90000, hra: 36000, allowances: 22000, bonus: 32000 }, deductions: { pf: 10800, esi: 0, tds: 9200, professional_tax: 200, other_deductions: 1800 } }], 2: [{ id: 202, month: 3, year: 2026, gross_salary: 125000, total_deductions: 15000, net_salary: 110000, status: "paid", earnings: { basic: 62500, hra: 25000, allowances: 18000, bonus: 19500 }, deductions: { pf: 7500, esi: 0, tds: 6100, professional_tax: 200, other_deductions: 1200 } }], 3: [{ id: 203, month: 3, year: 2026, gross_salary: 98000, total_deductions: 11200, net_salary: 86800, status: "paid", earnings: { basic: 49000, hra: 19600, allowances: 15000, bonus: 14400 }, deductions: { pf: 5880, esi: 0, tds: 4200, professional_tax: 200, other_deductions: 920 } }] } },
  training: { stats: { activePrograms: 6, avgSkillScore: 82, coursesCompleted: 19, skillImprovement: 13 }, skillGaps: [{ skill: "React", current: 82, required: 90 }, { skill: "Testing", current: 66, required: 84 }], growth: [{ month: "Jan", score: 64 }, { month: "Feb", score: 71 }], courses: [{ id: 1, title: "Advanced React Patterns", description: "Build scalable frontend systems.", duration: "5 weeks", category: "Engineering", enrolled_count: 24, enrollment_id: null, status: null, progress: null }, { id: 2, title: "Design Systems Foundations", description: "Create reusable design primitives.", duration: "3 weeks", category: "Design", enrolled_count: 18, enrollment_id: 9002, status: "in-progress", progress: 42 }], paths: [{ name: "Frontend Growth Path", progress: 54, modules: 11, completed: 6 }] },
});

const load = () => JSON.parse(localStorage.getItem(K) || "null") || save(seed());
const save = (db) => (localStorage.setItem(K, JSON.stringify(db)), db);
const userDir = (db) => db.users.map((u) => ({ id: u.id, fullName: u.name, email: u.email, role: u.role, isActive: u.isActive }));
const records = (db) => db.users.map((u) => ({ id: u.id, user_id: u.id, name: u.name, employee_code: `NX-${String(u.id).padStart(3, "0")}`, total_documents: (db.documents.userDocuments[u.id] || []).length, last_updated: (db.documents.userDocuments[u.id] || [])[0]?.uploaded_at || null, status: (db.documents.userDocuments[u.id] || []).length >= 2 ? "complete" : "incomplete" }));
const dashboard = (db) => ({ totalEmployees: db.employees.length, activeRecruitment: db.jobs.length, attendanceRate: 94, avgPerformance: 8.6, hiringData: [{ month: "Jan", hired: 8, left: 2 }, { month: "Feb", hired: 6, left: 1 }], departmentData: [{ name: "Engineering", value: 34 }, { name: "HR", value: 9 }], attendanceTrend: [{ day: "Mon", attendance: 91 }, { day: "Tue", attendance: 94 }] });
const attendancePayload = (db) => ({ logs: db.attendance.logs, clockedIn: db.attendance.clockedIn, chart: db.attendance.logs.map((l) => ({ day: new Date(l.date).toLocaleDateString(undefined, { weekday: "short" }), hours: l.hours || 0 })), stats: { daysPresent: db.attendance.logs.filter((l) => l.status !== "absent").length, avgHoursPerDay: 8.4, lateArrivals: 1 } });
const currentUser = (db) => db.users.find((u) => u.email === localStorage.getItem("email")) || db.users[0];
const ok = (data) => ({ data });
const byId = (path) => Number(path.split("/").filter(Boolean).pop());

async function handle(method, path, payload, config = {}) {
  const db = load();
  const params = config.params || {};

  if (path === "/auth/status" && method === "get") return ok({ data: { signup_enabled: db.auth.signup_enabled } });
  if (path === "/auth/signup" && method === "post") { const email = String(payload.email || "").trim().toLowerCase(); if (db.users.some((u) => u.email === email)) throw new MockApiError("Account already exists."); const role = db.users.some((u) => u.role === "admin") ? payload.role || "employee" : "admin"; const user = { id: db.users.length + 1, name: payload.fullName || "New User", email, role, password: payload.password, phone: payload.phone || "+91 90000 00000", isActive: true }; db.users.push(user); db.employees.push({ id: user.id, name: user.name, role: role === "hr" ? "HR Executive" : role === "admin" ? "Admin" : "Employee", dept: role === "hr" ? "HR" : "General", status: "active", email, joined: new Date().toISOString().slice(0,10) }); save(db); return ok({ message: "Account created successfully", data: { user } }); }
  if (path === "/auth/login" && method === "post") { const user = db.users.find((u) => u.email === String(payload.email).toLowerCase() && u.password === payload.password); if (!user) throw new MockApiError("Invalid credentials", 401); return ok({ data: { access_token: `mock-token-${user.id}`, refresh_token: `mock-refresh-${user.id}`, email: user.email, name: user.name, role: user.role } }); }
  if (path === "/auth/forgot-password" && method === "post") { const token = `reset-${Math.random().toString(36).slice(2,10)}`; db.auth.resetTokens[token] = String(payload.email || "").toLowerCase(); save(db); return ok({ message: `Reset token generated locally: ${token}` }); }
  if (path === "/auth/reset-password" && method === "post") { const email = db.auth.resetTokens[payload.token]; if (!email) throw new MockApiError("Reset token is invalid or expired."); const user = db.users.find((u) => u.email === email); user.password = payload.new_password; delete db.auth.resetTokens[payload.token]; save(db); return ok({ message: "Password updated successfully." }); }
  if (path === "/dashboard" && method === "get") return ok({ data: dashboard(db) });
  if (path === "/users" && method === "get") return ok({ data: db.users.map(({ password, ...u }) => u) });
  if (path === "/activity-logs" && method === "get") return ok({ data: db.activityLogs });
  if (path === "/employees" && method === "get") return ok({ data: db.employees });
  if (path === "/employees" && method === "post") { db.employees.unshift({ id: Date.now(), ...payload }); save(db); return ok({ data: payload }); }
  if (path.startsWith("/employees/") && method === "delete") { db.employees = db.employees.filter((e) => e.id !== byId(path)); save(db); return ok({ message: "Employee removed" }); }
  if (path === "/attendance" && method === "get") return ok({ data: attendancePayload(db) });
  if ((path === "/clock-in" || path === "/clock-out") && method === "post") { db.attendance.clockedIn = path === "/clock-in"; if (path === "/clock-in") db.attendance.logs.unshift({ id: Date.now(), date: new Date().toISOString().slice(0,10), clockIn: now(), clockOut: null, hours: null, status: "active" }); else if (db.attendance.logs[0]) Object.assign(db.attendance.logs[0], { clockOut: now(), hours: 8.1, status: "present" }); save(db); return ok({ message: "Attendance updated" }); }
  if (path === "/jobs" && method === "get") return ok({ data: db.jobs });
  if (path === "/jobs" && method === "post") { const item = { id: Date.now(), ...payload }; db.jobs.unshift(item); save(db); return ok({ data: item }); }
  if (path === "/candidates" && method === "get") return ok({ data: db.candidates });
  if (/^\/candidates\/\d+\/status$/.test(path) && method === "patch") { const item = db.candidates.find((c) => c.id === Number(path.split("/")[2])); if (item) item.status = payload.status; save(db); return ok({ data: item }); }
  if (path === "/upload" && method === "post") { const file = payload?.get?.("file"); db.candidates.unshift({ id: Date.now(), name: file?.name?.replace(/\.[^.]+$/, "") || "New Candidate", role: "AI Screened Candidate", experience: "3 years", skills: ["Communication", "Problem Solving"], match: 74, status: "new", resume_url: "/mock-resume.pdf" }); save(db); return ok({ message: "Resume uploaded successfully" }); }
  if (path === "/culture/metrics") return ok({ data: db.culture.metrics });
  if (path === "/culture/policies") return ok({ data: db.culture.policies });
  if (path === "/culture/safety") return ok({ data: db.culture.safety });
  if (path === "/culture/scores") return ok({ data: db.culture.scores });
  if (path === "/culture/career") return ok({ data: db.culture.career });
  if (path === "/culture/branding") return ok({ data: db.culture.branding });
  if (/^\/culture\/policies\/\d+$/.test(path) && method === "patch") { const item = db.culture.policies.find((p) => p.id === byId(path)); if (payload.increment_views) item.views += 1; save(db); return ok({ data: item }); }
  if (/^\/culture\/career\/\d+$/.test(path) && method === "patch") { const item = db.culture.career.find((c) => c.id === byId(path)); item.content = payload.content; save(db); return ok({ data: item }); }
  if (path === "/compliance/laws") return ok({ data: { compliance_percent: 100, laws: db.compliance.laws } });
  if (path === "/compliance/policies") return ok({ data: db.compliance.policies });
  if (path === "/compliance/audit") return ok({ data: db.compliance.audit });
  if (path === "/compliance/legal-docs") return ok({ data: db.compliance.legalDocs });
  if (/^\/compliance\/laws\/\d+$/.test(path) && method === "patch") { db.compliance.laws[0].status = payload.status; save(db); return ok({ data: db.compliance.laws[0] }); }
  if (path === "/compliance/laws" && method === "post") { db.compliance.laws.unshift({ id: Date.now(), ...payload }); save(db); return ok({ data: db.compliance.laws[0] }); }
  if (path === "/compliance/policies" && method === "post") { db.compliance.policies.unshift({ id: Date.now(), ...payload }); save(db); return ok({ data: db.compliance.policies[0] }); }
  if (path === "/compliance/audit" && method === "post") { db.compliance.audit.unshift({ id: Date.now(), created_at: now(), ...payload }); save(db); return ok({ data: db.compliance.audit[0] }); }
  if (path === "/compliance/legal-docs" && method === "post") { db.compliance.legalDocs.unshift({ id: Date.now(), title: payload.get("title"), category: payload.get("category"), file_path: "/mock/legal-doc.pdf", created_at: now() }); save(db); return ok({ data: db.compliance.legalDocs[0] }); }
  if (/^\/compliance\/legal-docs\/\d+\/download$/.test(path)) return ok(blob("Mock legal document"));
  if (path === "/documents/stats") return ok({ data: { total_records: records(db).length, total_templates: db.documents.offerTemplates.length, pending_reviews: records(db).filter((r) => r.status === "incomplete").length, id_cards_issued: db.documents.idCardsIssued } });
  if (path === "/documents/records") return ok({ data: records(db) });
  if (path === "/documents") return ok({ data: db.documents.onboardingDocs });
  if (path === "/contracts") return ok({ data: db.documents.contracts });
  if (path === "/offer-templates") return ok({ data: db.documents.offerTemplates });
  if (path === "/access/user-directory") return ok({ data: userDir(db) });
  if (path === "/documents/upload" && method === "post") { const uid = Number(payload.get("user_id") || currentUser(db).id); db.documents.userDocuments[uid] = db.documents.userDocuments[uid] || []; db.documents.userDocuments[uid].unshift({ id: Date.now(), user_id: uid, file_name: payload.get("file")?.name || "uploaded-document.pdf", file_type: "pdf", uploaded_at: now() }); save(db); return ok({ message: "Document uploaded" }); }
  if (/^\/documents\/user\/\d+$/.test(path)) return ok({ data: db.documents.userDocuments[byId(path)] || [] });
  if (/^\/documents\/download\/\d+$/.test(path) || /^\/contracts\/download\/\d+$/.test(path) || /^\/id-card\/\d+$/.test(path)) return ok(blob("Mock downloadable file"));
  if (path === "/contracts" && method === "post") { db.documents.contracts.unshift({ id: Date.now(), title: payload.get("title"), type: payload.get("type"), used_count: 0, last_modified: now() }); save(db); return ok({ data: db.documents.contracts[0] }); }
  if (path === "/offer-templates" && method === "post") { db.documents.offerTemplates.unshift({ id: Date.now(), ...payload }); save(db); return ok({ data: db.documents.offerTemplates[0] }); }
  if (/^\/id-card\/generate\/\d+$/.test(path) && method === "post") { db.documents.idCardsIssued += 1; save(db); return ok({ message: "ID card generated" }); }
  if (path === "/engagement") return ok({ data: db.engagement });
  if (path === "/ai/hr-brain" && method === "post") return ok({ data: runHrIntelligence(String(payload.message || ""), { ...db, currentEmail: localStorage.getItem("email") }) });
  if (path === "/hr-chat" && method === "post") return ok({ reply: buildHrSupportReply(String(payload.message || ""), { ...db, currentEmail: localStorage.getItem("email") }) });
  if (path === "/performance") return ok({ data: db.performance });
  if (path === "/onboarding") return ok({ data: db.onboarding.hires });
  if (path === "/onboarding/chatbot" && method === "post") return ok({ data: { reply: buildHrSupportReply(String(payload.message || ""), { ...db, currentEmail: localStorage.getItem("email") }) } });
  if (path === "/onboarding/documents/upload" && method === "post") { db.documents.onboardingDocs = db.documents.onboardingDocs.map((d) => ({ ...d, status: d.name === payload.get("name") ? "uploaded" : d.status })); save(db); return ok({ message: "Document uploaded" }); }
  if (path === "/profile") return ok({ data: { user: currentUser(db) } });
  if (path === "/exit-cases") return ok({ data: db.exit.cases });
  if (path === "/exit-cases" && method === "post") { db.exit.cases.unshift({ id: Date.now(), name: "New Exit Case", role: payload.role || "Employee", last_day: payload.last_day, reason: payload.reason, status: "initiated", progress: 20 }); save(db); return ok({ data: db.exit.cases[0] }); }
  if (/^\/exit-workflow\/\d+$/.test(path) && method === "get") return ok({ data: db.exit.workflowByCase[byId(path)] || [] });
  if (/^\/exit-assets\/\d+$/.test(path) && method === "get") return ok({ data: db.exit.assetsByCase[byId(path)] || [] });
  if (/^\/exit-settlement\/\d+$/.test(path)) return ok({ data: db.exit.settlementByCase[byId(path)] || null });
  if (/^\/exit-letter\/\d+$/.test(path) && method === "get") return ok({ data: db.exit.letterByCase[byId(path)] || null });
  if (/^\/exit-workflow\/\d+$/.test(path) && method === "patch") { const steps = db.exit.workflowByCase[1] || []; const step = steps.find((s) => s.id === byId(path)); if (step) step.completed = payload.completed; save(db); return ok({ message: "Workflow updated" }); }
  if (/^\/exit-assets\/\d+$/.test(path) && method === "patch") { const asset = (db.exit.assetsByCase[1] || []).find((a) => a.id === byId(path)); if (asset) asset.status = payload.status; save(db); return ok({ message: "Asset updated" }); }
  if (path === "/exit-feedback" && method === "post") { const item = { id: Date.now(), message: payload.message, response: "Thank you for the feedback. We have recorded it in this local demo workspace.", created_at: now() }; db.exit.feedbackByCase[payload.exit_case_id] = db.exit.feedbackByCase[payload.exit_case_id] || []; db.exit.feedbackByCase[payload.exit_case_id].push(item); save(db); return ok({ data: item }); }
  if (/^\/exit-letter\/\d+\/pdf$/.test(path)) return ok(blob("Mock experience letter"));
  if (path === "/access/users") return ok({ data: db.users.map((u) => ({ user_id: u.id, employee: u.name, email: u.email, accesses: db.access.accesses.filter((a) => a.user_id === u.id) })) });
  if (path === "/roles") return ok({ data: db.access.roles });
  if (path === "/permissions") return ok({ data: db.access.permissions });
  if (path === "/security/settings") return ok({ data: db.access.security });
  if (path === "/access/summary") return ok({ data: { total_users: db.users.length, active_users: db.access.accesses.filter((a) => a.status === "active").length, system_count: db.access.systems.length, pending_requests: db.access.accesses.filter((a) => a.status !== "active").length } });
  if (path === "/access/systems") return ok({ data: db.access.systems });
  if (/^\/access\/update\/\d+$/.test(path) && method === "patch") { const access = db.access.accesses.find((a) => a.id === byId(path)); if (access) { access.role = payload.role; access.status = payload.status; } save(db); return ok({ data: access }); }
  if (path === "/access/grant" && method === "post") { const sys = db.access.systems.find((s) => s.id === Number(payload.system_id)); db.access.accesses.push({ id: Date.now(), user_id: Number(payload.user_id), system_id: Number(payload.system_id), system: sys?.name || "System", role: payload.role || "member", status: payload.status || "active" }); save(db); return ok({ data: db.access.accesses.at(-1) }); }
  if (/^\/security\/settings\/\d+$/.test(path) && method === "patch") { const setting = db.access.security.find((s) => s.id === byId(path)); if (setting) setting.enabled = Boolean(payload.enabled); save(db); return ok({ data: setting }); }
  if (path === "/access/systems" && method === "post") { db.access.systems.push({ id: Date.now(), name: payload.name || "New System" }); save(db); return ok({ data: db.access.systems.at(-1) }); }
  if (path === "/payroll/users") return ok({ data: userDir(db) });
  if (path === "/payroll/user") { const uid = Number(params.user_id); const user = db.users.find((u) => u.id === uid); const latest_payslip = (db.payroll.payslipsByUser[uid] || [])[0] || null; return ok({ data: { user, latest_payslip } }); }
  if (path === "/payroll/payslips") return ok({ data: db.payroll.payslipsByUser[Number(params.user_id)] || [] });
  if (path === "/payroll/stats") { const list = db.payroll.payslipsByUser[Number(params.user_id)] || []; return ok({ data: { netPay: list[0]?.net_salary || 0, ytd: list.reduce((s, p) => s + p.net_salary, 0), deductions: list.reduce((s, p) => s + p.total_deductions, 0) } }); }
  if (/^\/payroll\/download\/\d+$/.test(path)) return ok(blob("Mock payslip"));
  if (path === "/payroll/tax/calc" && method === "post") { const annual = Number(payload.annual_salary || 0); const taxableIncome = Math.max(0, annual - 75000); const tax = Math.round(taxableIncome * 0.1); const cess = Math.round(tax * 0.04); return ok({ data: { taxableIncome, tax, cess, totalTax: tax + cess, netIncome: annual - tax - cess } }); }
  if (path === "/payroll/generate" && method === "post") { const uid = Number(payload.user_id); db.payroll.payslipsByUser[uid] = db.payroll.payslipsByUser[uid] || []; const base = db.payroll.payslipsByUser[uid][0] || { gross_salary: 90000, total_deductions: 10000, net_salary: 80000, earnings: { basic: 45000, hra: 18000, allowances: 14000, bonus: 13000 }, deductions: { pf: 5400, esi: 0, tds: 3400, professional_tax: 200, other_deductions: 1000 } }; db.payroll.payslipsByUser[uid].unshift({ id: Date.now(), month: Number(payload.month), year: Number(payload.year), gross_salary: base.gross_salary, total_deductions: base.total_deductions, net_salary: base.net_salary, status: payload.status || "pending", earnings: base.earnings, deductions: base.deductions }); save(db); return ok({ data: db.payroll.payslipsByUser[uid][0] }); }
  if (path === "/training/dashboard") return ok({ data: db.training });
  if (path === "/training/enroll" && method === "post") { const course = db.training.courses.find((c) => c.id === Number(payload.course_id)); if (course && !course.enrollment_id) { course.enrollment_id = Date.now(); course.status = "in-progress"; course.progress = 12; course.enrolled_count += 1; } save(db); return ok({ data: course }); }
  throw new MockApiError(`Unsupported frontend-only route: ${method.toUpperCase()} ${path}`, 404);
}

const request = async (method, path, payload, config) => { await wait(); return handle(method, path, payload, config); };

const api = {
  get: (path, config) => request("get", path, undefined, config),
  post: (path, payload, config) => request("post", path, payload, config),
  patch: (path, payload, config) => request("patch", path, payload, config),
  delete: (path, config) => request("delete", path, undefined, config),
};

export const resetMockDatabase = () => localStorage.removeItem(K);
export default api;
