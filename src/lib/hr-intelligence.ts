type TaskType =
  | "capability_overview"
  | "hiring_recommendation"
  | "promotion_analysis"
  | "warning_disciplinary_action"
  | "employee_resignation_risk"
  | "optimal_team_formation"
  | "remote_vs_office_recommendation"
  | "complete_hr_intelligence_report";

type WorkMode = "remote" | "office" | "hybrid";
type EmployeeStatus = "active" | "on_leave";

interface Traits {
  leadership: number;
  execution: number;
  creativity: number;
  analytical: number;
  collaboration: number;
  adaptability: number;
  ownership: number;
  communication: number;
  empathy: number;
}

interface EmployeeProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  department: string;
  designation: string;
  salary: number;
  joiningDate: string;
  location: string;
  status: EmployeeStatus;
  currentWorkMode: WorkMode;
  roleType: "independent" | "collaborative" | "client_facing";
  attendance: {
    presentDays: number;
    absentDays: number;
    monthlyAttendancePercent: number;
    consecutiveUnapprovedAbsenceDays: number;
    lateArrivalsMonthly: number;
    earlyExitsMonthly: number;
    overtimeHoursMonthly: number;
    meetingNoShowsQuarter: number;
    deadlineMissesQuarter: number;
    unauthorizedAccessAttemptsQuarter: number;
  };
  leave: {
    leavesTakenYtd: number;
    leaveTypes: string[];
    approvalRate: number;
    pattern: string;
    sickLeaveSpike: boolean;
  };
  performance: {
    kpiLast6Months: number[];
    monthlyRatings: number[];
    managerFeedbackScore: number;
    managerFeedbackText: string;
    goalCompletion: number;
    outputVsTeamPercent: number;
    similarProjectScore: number;
    lowOutputDays: number;
  };
  behavior: {
    complaintsQuarter: number;
    disciplinaryIncidentsQuarter: number;
    peerReviewScore: number;
    engagementScore: number;
    engagementDelta: number;
    peerSentimentScore: number;
    complaintsAgainstManager: number;
    skipLevelRequests: number;
    negativeSentimentKeywords: number;
  };
  salaryHistory: {
    current: number;
    lastIncrementDate: string;
    incrementHistory: number[];
    bonusesLast12m: number;
    stagnationMonths: number;
    promotionStagnationMonths: number;
    rewardGap: boolean;
  };
  recruitment: {
    source: string;
    onboardingDays: number;
    productivityDays: number;
  };
  exitIndicators: {
    linkedinUpdated: boolean;
    naukriVisitsDetected: boolean;
    moodSurveyScore: number;
    colleaguePromotedWhileNot: boolean;
    overtimeWithoutComp: boolean;
  };
  skills: {
    current: string[];
    certifications: string[];
    trainingCompleted: string[];
    newSkillsLast12m: string[];
    gaps: string[];
  };
  workModeHistory: {
    remoteDaysPerMonth: number;
    officeDaysPerMonth: number;
    productivityRemote: number;
    productivityOffice: number;
    meetingLoadPerDay: number;
    homeSetupScore: number;
    teamNeedsPresence: boolean;
    clientMeetingsMonthly: number;
    isolationRisk: number;
    commuteDistanceKm: number;
    managerPreference: WorkMode;
  };
  leadership: {
    mentoringCount: number;
    initiativeScore: number;
    crossTeamCollaboration: number;
  };
  traits: Traits;
  recentEvents: Array<{ date: string; label: string; detail: string }>;
  conflictsWith: string[];
  preferredCollaborators: string[];
  availability: {
    bandwidthPercent: number;
    timezone: string;
  };
  pipStatus: {
    active: boolean;
    stage?: string;
    startDate?: string;
  };
}

interface CandidateProfile {
  id: string;
  name: string;
  targetRole: string;
  department: string;
  experienceYears: number;
  skills: string[];
  expectedSalary: number;
  currentSalary: number;
  noticePeriodDays: number;
  location: string;
  preferredWorkMode: WorkMode;
  source: string;
  onboardingSpeedDays: number;
  jobChangesLast5Years: number;
  assessmentScore: number;
  portfolioScore: number;
  motivationScore: number;
  tenureStabilityScore: number;
  referenceScore: number;
  traits: Traits;
  acceptanceSignals: {
    interestScore: number;
    compensationFlexibility: number;
    locationFit: number;
    competingOffers: boolean;
  };
  redFlags: string[];
  personalityNotes: string[];
}

interface JobOpening {
  id: string;
  title: string;
  department: string;
  requiredSkills: string[];
  salaryRange: [number, number];
  priority: "critical" | "high" | "medium";
}

interface HrDataset {
  employees: EmployeeProfile[];
  candidates: CandidateProfile[];
  openPositions: JobOpening[];
}

interface HrBrainResponse {
  task: TaskType;
  generatedAt: string;
  confidence: number;
  summary: string;
  structuredJson: Record<string, unknown>;
}

const REFERENCE_DATE = new Date("2026-04-16T09:00:00");

const defaultTraits: Traits = {
  leadership: 60,
  execution: 70,
  creativity: 60,
  analytical: 60,
  collaboration: 72,
  adaptability: 72,
  ownership: 72,
  communication: 72,
  empathy: 66,
};

function normalize(value: string) {
  return String(value || "").trim().toLowerCase();
}

function titleize(value: string) {
  return String(value || "")
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function avg(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function round(value: number) {
  return Math.round(value * 10) / 10;
}

function isoDate() {
  return REFERENCE_DATE.toISOString().slice(0, 10);
}

function monthsBetween(startDate: string, endDate = isoDate()) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.max(0, (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()));
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function formatLpa(amount: number) {
  return `INR ${round(amount / 100000)} LPA`;
}

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function addDays(date: string, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next.toISOString().slice(0, 10);
}

function addWeeks(date: string, weeks: number) {
  return addDays(date, weeks * 7);
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}

function splitList(raw: string) {
  return unique(
    String(raw || "")
      .split(/,|\band\b|\/|\|/i)
      .map((part) => titleize(part))
      .filter(Boolean),
  );
}

function extractLabelValue(message: string, labels: string[]) {
  for (const label of labels) {
    const matcher = new RegExp(`${label}\\s*[:\\-]\\s*([^\\n]+)`, "i");
    const match = message.match(matcher);
    if (match?.[1]) return match[1].trim();
  }
  return "";
}

function extractSalaryRange(message: string, fallback: [number, number]) {
  const raw = extractLabelValue(message, ["Budget range", "Salary range", "Budget", "Compensation"]);
  const numeric = (raw.match(/\d+(?:\.\d+)?/g) || []).map(Number);
  if (numeric.length >= 2) {
    const mapped = numeric.map((value) => (value > 50000 ? value : value * 100000));
    return [Math.min(mapped[0], mapped[1]), Math.max(mapped[0], mapped[1])] as [number, number];
  }
  return fallback;
}

function extractTeamSize(message: string, fallback = 5) {
  const raw = extractLabelValue(message, ["Team size needed", "Team size", "Number"]);
  const value = Number((raw.match(/\d+/) || [fallback])[0]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function extractSkills(message: string, labels = ["Required skills", "Skills needed", "Skills list", "Skills"]) {
  const raw = extractLabelValue(message, labels);
  return splitList(raw);
}

function extractDepartment(message: string) {
  return titleize(extractLabelValue(message, ["Department"]));
}

function extractProjectName(message: string) {
  return extractLabelValue(message, ["Project", "Project name"]) || "Project Atlas";
}

function extractTimeline(message: string) {
  return extractLabelValue(message, ["Duration", "Timeline"]) || "12 weeks";
}

function extractRole(message: string) {
  return extractLabelValue(message, ["Given the following job role", "Job role", "Job title", "Role"]) || "";
}

function inferTask(message: string): TaskType {
  const query = normalize(message);
  if (!query) return "capability_overview";
  if (query.includes("complete hr intelligence") || query.includes("run all modules") || query.includes("today")) {
    return "complete_hr_intelligence_report";
  }
  if (query.includes("promotion")) return "promotion_analysis";
  if (query.includes("warning") || query.includes("disciplinary") || query.includes("pip") || query.includes("termination risk")) {
    return "warning_disciplinary_action";
  }
  if (query.includes("resignation") || query.includes("likely to resign") || query.includes("next 90 days") || query.includes("attrition risk employees")) {
    return "employee_resignation_risk";
  }
  if (query.includes("optimal team") || query.includes("team formation") || query.includes("project")) {
    return "optimal_team_formation";
  }
  if (query.includes("remote") || query.includes("office") || query.includes("work mode")) {
    return "remote_vs_office_recommendation";
  }
  if (query.includes("hiring") || query.includes("candidate") || query.includes("hire recommendation") || query.includes("job role")) {
    return "hiring_recommendation";
  }
  return "capability_overview";
}

function roleKeywords(role: string, department: string) {
  return unique(
    `${role} ${department}`
      .split(/[\s,/()-]+/)
      .map((part) => normalize(part))
      .filter((part) => part.length > 2),
  );
}

function skillOverlap(required: string[], actual: string[]) {
  if (!required.length) return 0;
  const requiredSet = required.map(normalize);
  const actualSet = actual.map(normalize);
  const exact = requiredSet.filter((skill) => actualSet.includes(skill)).length;
  const related = requiredSet.filter(
    (skill) =>
      !actualSet.includes(skill) &&
      actualSet.some((candidateSkill) => candidateSkill.includes(skill) || skill.includes(candidateSkill)),
  ).length;
  return clamp(((exact + related * 0.5) / requiredSet.length) * 100);
}

function archetypeFromTraits(traits: Traits) {
  const map = [
    { label: "Leader", value: traits.leadership },
    { label: "Executor", value: traits.execution },
    { label: "Creative", value: traits.creativity },
    { label: "Analyst", value: traits.analytical },
  ];
  return map.sort((a, b) => b.value - a.value)[0].label;
}

function dataCompletenessScore(dataset: HrDataset) {
  return clamp(84 + dataset.employees.length * 0.4 + dataset.candidates.length * 0.2, 84, 96);
}

function makeEmployee(
  input: Partial<EmployeeProfile> &
    Pick<EmployeeProfile, "id" | "name" | "department" | "designation" | "salary" | "joiningDate" | "location">,
): EmployeeProfile {
  return {
    age: 30,
    gender: "Unspecified",
    status: "active",
    currentWorkMode: "hybrid",
    roleType: "collaborative",
    attendance: {
      presentDays: 22,
      absentDays: 1,
      monthlyAttendancePercent: 96,
      consecutiveUnapprovedAbsenceDays: 0,
      lateArrivalsMonthly: 1,
      earlyExitsMonthly: 1,
      overtimeHoursMonthly: 8,
      meetingNoShowsQuarter: 0,
      deadlineMissesQuarter: 1,
      unauthorizedAccessAttemptsQuarter: 0,
    },
    leave: {
      leavesTakenYtd: 3,
      leaveTypes: ["casual", "sick"],
      approvalRate: 96,
      pattern: "stable",
      sickLeaveSpike: false,
    },
    performance: {
      kpiLast6Months: [82, 84, 85, 86, 87, 88],
      monthlyRatings: [4.1, 4.2, 4.2, 4.3, 4.4, 4.4],
      managerFeedbackScore: 4.2,
      managerFeedbackText: "Consistent and dependable contributor.",
      goalCompletion: 86,
      outputVsTeamPercent: 103,
      similarProjectScore: 84,
      lowOutputDays: 0,
    },
    behavior: {
      complaintsQuarter: 0,
      disciplinaryIncidentsQuarter: 0,
      peerReviewScore: 4.2,
      engagementScore: 81,
      engagementDelta: 2,
      peerSentimentScore: 84,
      complaintsAgainstManager: 0,
      skipLevelRequests: 0,
      negativeSentimentKeywords: 0,
    },
    salaryHistory: {
      current: input.salary,
      lastIncrementDate: "2025-04-01",
      incrementHistory: [8],
      bonusesLast12m: 120000,
      stagnationMonths: 12,
      promotionStagnationMonths: 12,
      rewardGap: false,
    },
    recruitment: {
      source: "Referral",
      onboardingDays: 16,
      productivityDays: 34,
    },
    exitIndicators: {
      linkedinUpdated: false,
      naukriVisitsDetected: false,
      moodSurveyScore: 78,
      colleaguePromotedWhileNot: false,
      overtimeWithoutComp: false,
    },
    skills: {
      current: [],
      certifications: [],
      trainingCompleted: [],
      newSkillsLast12m: [],
      gaps: [],
    },
    workModeHistory: {
      remoteDaysPerMonth: 8,
      officeDaysPerMonth: 10,
      productivityRemote: 88,
      productivityOffice: 89,
      meetingLoadPerDay: 4,
      homeSetupScore: 82,
      teamNeedsPresence: false,
      clientMeetingsMonthly: 2,
      isolationRisk: 28,
      commuteDistanceKm: 14,
      managerPreference: "hybrid",
    },
    leadership: {
      mentoringCount: 1,
      initiativeScore: 74,
      crossTeamCollaboration: 76,
    },
    traits: { ...defaultTraits },
    recentEvents: [],
    conflictsWith: [],
    preferredCollaborators: [],
    availability: {
      bandwidthPercent: 72,
      timezone: "IST",
    },
    pipStatus: {
      active: false,
    },
    ...input,
  };
}

function makeCandidate(
  input: Partial<CandidateProfile> &
    Pick<CandidateProfile, "id" | "name" | "targetRole" | "department" | "experienceYears" | "skills" | "expectedSalary">,
): CandidateProfile {
  return {
    currentSalary: Math.round(input.expectedSalary * 0.9),
    noticePeriodDays: 30,
    location: "Bengaluru",
    preferredWorkMode: "hybrid",
    source: "Referral",
    onboardingSpeedDays: 20,
    jobChangesLast5Years: 1,
    assessmentScore: 82,
    portfolioScore: 80,
    motivationScore: 82,
    tenureStabilityScore: 82,
    referenceScore: 84,
    traits: { ...defaultTraits, creativity: 68, analytical: 72, execution: 78 },
    acceptanceSignals: {
      interestScore: 82,
      compensationFlexibility: 78,
      locationFit: 84,
      competingOffers: false,
    },
    redFlags: [],
    personalityNotes: [],
    ...input,
  };
}

function makePosition(
  input: Partial<JobOpening> & Pick<JobOpening, "id" | "title" | "department" | "requiredSkills" | "salaryRange">,
): JobOpening {
  return {
    priority: "high",
    ...input,
  };
}

const baseEmployees: EmployeeProfile[] = [
  makeEmployee({
    id: "EMP001",
    name: "Aarav Mehta",
    age: 35,
    gender: "Male",
    department: "Operations",
    designation: "Operations Director",
    salary: 2800000,
    joiningDate: "2023-01-15",
    location: "Bengaluru",
    currentWorkMode: "hybrid",
    roleType: "collaborative",
    performance: {
      kpiLast6Months: [88, 90, 91, 92, 92, 93],
      monthlyRatings: [4.4, 4.5, 4.6, 4.6, 4.7, 4.7],
      managerFeedbackScore: 4.7,
      managerFeedbackText: "Strategic operator who keeps cross-functional work on track.",
      goalCompletion: 94,
      outputVsTeamPercent: 116,
      similarProjectScore: 91,
      lowOutputDays: 0,
    },
    skills: {
      current: ["Operations Strategy", "Workforce Planning", "Vendor Management", "Program Delivery"],
      certifications: ["Six Sigma Black Belt"],
      trainingCompleted: ["Executive Leadership Lab"],
      newSkillsLast12m: ["Workforce Analytics"],
      gaps: ["Advanced HRIS Automation"],
    },
    leadership: {
      mentoringCount: 5,
      initiativeScore: 93,
      crossTeamCollaboration: 92,
    },
    traits: {
      leadership: 95,
      execution: 91,
      creativity: 70,
      analytical: 80,
      collaboration: 92,
      adaptability: 88,
      ownership: 95,
      communication: 91,
      empathy: 84,
    },
    workModeHistory: {
      remoteDaysPerMonth: 8,
      officeDaysPerMonth: 12,
      productivityRemote: 90,
      productivityOffice: 94,
      meetingLoadPerDay: 6,
      homeSetupScore: 88,
      teamNeedsPresence: true,
      clientMeetingsMonthly: 6,
      isolationRisk: 20,
      commuteDistanceKm: 18,
      managerPreference: "hybrid",
    },
    preferredCollaborators: ["Priya Sharma", "Harshita Bose"],
  }),
  makeEmployee({
    id: "EMP002",
    name: "Priya Sharma",
    age: 31,
    gender: "Female",
    department: "HR",
    designation: "HR Lead",
    salary: 1820000,
    joiningDate: "2023-03-12",
    location: "Mumbai",
    currentWorkMode: "hybrid",
    roleType: "collaborative",
    performance: {
      kpiLast6Months: [89, 91, 92, 93, 94, 95],
      monthlyRatings: [4.4, 4.5, 4.6, 4.6, 4.7, 4.8],
      managerFeedbackScore: 4.8,
      managerFeedbackText: "Strong people judgment and calm escalation handling.",
      goalCompletion: 96,
      outputVsTeamPercent: 118,
      similarProjectScore: 92,
      lowOutputDays: 0,
    },
    behavior: {
      complaintsQuarter: 0,
      disciplinaryIncidentsQuarter: 0,
      peerReviewScore: 4.7,
      engagementScore: 88,
      engagementDelta: 4,
      peerSentimentScore: 91,
      complaintsAgainstManager: 0,
      skipLevelRequests: 0,
      negativeSentimentKeywords: 0,
    },
    salaryHistory: {
      current: 1820000,
      lastIncrementDate: "2025-04-01",
      incrementHistory: [10, 12],
      bonusesLast12m: 220000,
      stagnationMonths: 12,
      promotionStagnationMonths: 16,
      rewardGap: false,
    },
    skills: {
      current: ["Talent Management", "Employee Relations", "HR Analytics", "Policy Design"],
      certifications: ["SHRM-CP"],
      trainingCompleted: ["Advanced Employee Relations", "People Analytics Sprint"],
      newSkillsLast12m: ["Power BI", "Compensation Benchmarking"],
      gaps: ["Advanced SQL"],
    },
    leadership: {
      mentoringCount: 4,
      initiativeScore: 91,
      crossTeamCollaboration: 90,
    },
    traits: {
      leadership: 90,
      execution: 88,
      creativity: 72,
      analytical: 84,
      collaboration: 94,
      adaptability: 89,
      ownership: 90,
      communication: 94,
      empathy: 92,
    },
    workModeHistory: {
      remoteDaysPerMonth: 8,
      officeDaysPerMonth: 10,
      productivityRemote: 88,
      productivityOffice: 91,
      meetingLoadPerDay: 6,
      homeSetupScore: 86,
      teamNeedsPresence: true,
      clientMeetingsMonthly: 2,
      isolationRisk: 22,
      commuteDistanceKm: 12,
      managerPreference: "hybrid",
    },
    preferredCollaborators: ["Aarav Mehta", "Sneha Rao"],
  }),
  makeEmployee({
    id: "EMP003",
    name: "Rohan Verma",
    age: 28,
    gender: "Male",
    department: "Engineering",
    designation: "Frontend Engineer",
    salary: 1320000,
    joiningDate: "2024-02-04",
    location: "Pune",
    currentWorkMode: "remote",
    roleType: "independent",
    attendance: {
      presentDays: 21,
      absentDays: 2,
      monthlyAttendancePercent: 91,
      consecutiveUnapprovedAbsenceDays: 0,
      lateArrivalsMonthly: 1,
      earlyExitsMonthly: 0,
      overtimeHoursMonthly: 22,
      meetingNoShowsQuarter: 0,
      deadlineMissesQuarter: 1,
      unauthorizedAccessAttemptsQuarter: 0,
    },
    leave: {
      leavesTakenYtd: 5,
      leaveTypes: ["sick", "casual"],
      approvalRate: 94,
      pattern: "short leaves increasing",
      sickLeaveSpike: true,
    },
    performance: {
      kpiLast6Months: [86, 88, 90, 91, 93, 94],
      monthlyRatings: [4.2, 4.3, 4.4, 4.5, 4.6, 4.6],
      managerFeedbackScore: 4.4,
      managerFeedbackText: "Ships quickly and raises technical quality across the squad.",
      goalCompletion: 95,
      outputVsTeamPercent: 119,
      similarProjectScore: 92,
      lowOutputDays: 0,
    },
    behavior: {
      complaintsQuarter: 0,
      disciplinaryIncidentsQuarter: 0,
      peerReviewScore: 4.5,
      engagementScore: 63,
      engagementDelta: -18,
      peerSentimentScore: 82,
      complaintsAgainstManager: 1,
      skipLevelRequests: 1,
      negativeSentimentKeywords: 4,
    },
    salaryHistory: {
      current: 1320000,
      lastIncrementDate: "2024-09-01",
      incrementHistory: [8],
      bonusesLast12m: 90000,
      stagnationMonths: 19,
      promotionStagnationMonths: 26,
      rewardGap: true,
    },
    exitIndicators: {
      linkedinUpdated: true,
      naukriVisitsDetected: true,
      moodSurveyScore: 61,
      colleaguePromotedWhileNot: true,
      overtimeWithoutComp: true,
    },
    skills: {
      current: ["React", "TypeScript", "Design Systems", "Testing Library", "Tailwind CSS"],
      certifications: ["Meta Frontend Developer"],
      trainingCompleted: ["Accessibility for React"],
      newSkillsLast12m: ["Performance Optimization", "Storybook"],
      gaps: ["People Leadership"],
    },
    workModeHistory: {
      remoteDaysPerMonth: 18,
      officeDaysPerMonth: 2,
      productivityRemote: 97,
      productivityOffice: 89,
      meetingLoadPerDay: 3,
      homeSetupScore: 92,
      teamNeedsPresence: false,
      clientMeetingsMonthly: 1,
      isolationRisk: 34,
      commuteDistanceKm: 24,
      managerPreference: "hybrid",
    },
    leadership: {
      mentoringCount: 1,
      initiativeScore: 82,
      crossTeamCollaboration: 79,
    },
    traits: {
      leadership: 68,
      execution: 92,
      creativity: 78,
      analytical: 84,
      collaboration: 85,
      adaptability: 88,
      ownership: 90,
      communication: 79,
      empathy: 71,
    },
    recentEvents: [
      { date: "2026-03-08", label: "Pulse survey", detail: "Noted concerns about slower career progression." },
      { date: "2026-04-03", label: "Overtime spike", detail: "Logged 11 overtime hours in one week." },
      { date: "2026-04-09", label: "Profile activity", detail: "LinkedIn profile updated and recruiter visibility enabled." },
    ],
    preferredCollaborators: ["Maya Fernandes", "Neha Gupta"],
  }),
  makeEmployee({
    id: "EMP004",
    name: "Ananya Iyer",
    age: 32,
    gender: "Female",
    department: "Engineering",
    designation: "Senior Backend Engineer",
    salary: 1980000,
    joiningDate: "2022-08-18",
    location: "Bengaluru",
    currentWorkMode: "hybrid",
    roleType: "collaborative",
    performance: {
      kpiLast6Months: [84, 87, 89, 90, 92, 93],
      monthlyRatings: [4.1, 4.3, 4.4, 4.5, 4.6, 4.6],
      managerFeedbackScore: 4.7,
      managerFeedbackText: "Most reliable architecture partner in the engineering team.",
      goalCompletion: 94,
      outputVsTeamPercent: 116,
      similarProjectScore: 95,
      lowOutputDays: 0,
    },
    behavior: {
      complaintsQuarter: 0,
      disciplinaryIncidentsQuarter: 0,
      peerReviewScore: 4.6,
      engagementScore: 84,
      engagementDelta: 5,
      peerSentimentScore: 90,
      complaintsAgainstManager: 0,
      skipLevelRequests: 0,
      negativeSentimentKeywords: 0,
    },
    salaryHistory: {
      current: 1980000,
      lastIncrementDate: "2025-04-01",
      incrementHistory: [11, 12],
      bonusesLast12m: 240000,
      stagnationMonths: 12,
      promotionStagnationMonths: 22,
      rewardGap: false,
    },
    skills: {
      current: ["Node.js", "System Design", "PostgreSQL", "GraphQL", "Cloud Architecture"],
      certifications: ["AWS Solutions Architect Associate"],
      trainingCompleted: ["Engineering Leadership Circle", "Advanced System Design"],
      newSkillsLast12m: ["Coaching", "Platform Reliability", "Event-driven Architecture"],
      gaps: ["Stakeholder Storytelling"],
    },
    leadership: {
      mentoringCount: 4,
      initiativeScore: 92,
      crossTeamCollaboration: 91,
    },
    traits: {
      leadership: 88,
      execution: 91,
      creativity: 69,
      analytical: 93,
      collaboration: 88,
      adaptability: 85,
      ownership: 92,
      communication: 83,
      empathy: 77,
    },
    workModeHistory: {
      remoteDaysPerMonth: 8,
      officeDaysPerMonth: 10,
      productivityRemote: 91,
      productivityOffice: 94,
      meetingLoadPerDay: 4,
      homeSetupScore: 85,
      teamNeedsPresence: true,
      clientMeetingsMonthly: 1,
      isolationRisk: 24,
      commuteDistanceKm: 11,
      managerPreference: "hybrid",
    },
    preferredCollaborators: ["Rohan Verma", "Dev Malhotra"],
  }),
  makeEmployee({
    id: "EMP005",
    name: "Neha Gupta",
    age: 29,
    gender: "Female",
    department: "Product",
    designation: "Product Designer",
    salary: 1540000,
    joiningDate: "2023-06-20",
    location: "Mumbai",
    currentWorkMode: "hybrid",
    roleType: "collaborative",
    performance: {
      kpiLast6Months: [82, 85, 87, 88, 90, 91],
      monthlyRatings: [4.0, 4.2, 4.3, 4.4, 4.5, 4.6],
      managerFeedbackScore: 4.6,
      managerFeedbackText: "Combines product thinking with clean execution.",
      goalCompletion: 92,
      outputVsTeamPercent: 114,
      similarProjectScore: 90,
      lowOutputDays: 0,
    },
    behavior: {
      complaintsQuarter: 0,
      disciplinaryIncidentsQuarter: 0,
      peerReviewScore: 4.6,
      engagementScore: 85,
      engagementDelta: 7,
      peerSentimentScore: 89,
      complaintsAgainstManager: 0,
      skipLevelRequests: 0,
      negativeSentimentKeywords: 0,
    },
    salaryHistory: {
      current: 1540000,
      lastIncrementDate: "2025-04-01",
      incrementHistory: [10, 11],
      bonusesLast12m: 160000,
      stagnationMonths: 12,
      promotionStagnationMonths: 20,
      rewardGap: false,
    },
    skills: {
      current: ["Design Systems", "UX Research", "Figma", "Product Discovery", "Accessibility"],
      certifications: ["Google UX Design"],
      trainingCompleted: ["Design Leadership Essentials", "Experimentation Frameworks"],
      newSkillsLast12m: ["Facilitation", "Advanced Accessibility"],
      gaps: ["People Management"],
    },
    leadership: {
      mentoringCount: 3,
      initiativeScore: 88,
      crossTeamCollaboration: 90,
    },
    traits: {
      leadership: 81,
      execution: 86,
      creativity: 95,
      analytical: 79,
      collaboration: 91,
      adaptability: 86,
      ownership: 85,
      communication: 90,
      empathy: 88,
    },
    workModeHistory: {
      remoteDaysPerMonth: 10,
      officeDaysPerMonth: 8,
      productivityRemote: 92,
      productivityOffice: 90,
      meetingLoadPerDay: 5,
      homeSetupScore: 88,
      teamNeedsPresence: true,
      clientMeetingsMonthly: 3,
      isolationRisk: 27,
      commuteDistanceKm: 16,
      managerPreference: "hybrid",
    },
    preferredCollaborators: ["Rohan Verma", "Harshita Bose"],
  }),
  makeEmployee({
    id: "EMP006",
    name: "Imran Khan",
    age: 30,
    gender: "Male",
    department: "Finance",
    designation: "People Analytics Analyst",
    salary: 1380000,
    joiningDate: "2023-11-10",
    location: "Hyderabad",
    currentWorkMode: "hybrid",
    roleType: "independent",
    performance: {
      kpiLast6Months: [80, 82, 84, 85, 86, 87],
      monthlyRatings: [4.0, 4.1, 4.2, 4.3, 4.3, 4.4],
      managerFeedbackScore: 4.3,
      managerFeedbackText: "Brings clarity to messy workforce data.",
      goalCompletion: 88,
      outputVsTeamPercent: 108,
      similarProjectScore: 87,
      lowOutputDays: 0,
    },
    skills: {
      current: ["SQL", "Power BI", "People Analytics", "Forecasting", "Excel Automation"],
      certifications: ["Microsoft Power BI Data Analyst"],
      trainingCompleted: ["Predictive Analytics for HR"],
      newSkillsLast12m: ["Python", "Scenario Planning"],
      gaps: ["Stakeholder Facilitation"],
    },
    leadership: {
      mentoringCount: 1,
      initiativeScore: 77,
      crossTeamCollaboration: 79,
    },
    traits: {
      leadership: 66,
      execution: 84,
      creativity: 64,
      analytical: 93,
      collaboration: 80,
      adaptability: 78,
      ownership: 83,
      communication: 78,
      empathy: 72,
    },
    workModeHistory: {
      remoteDaysPerMonth: 14,
      officeDaysPerMonth: 6,
      productivityRemote: 95,
      productivityOffice: 88,
      meetingLoadPerDay: 3,
      homeSetupScore: 90,
      teamNeedsPresence: false,
      clientMeetingsMonthly: 0,
      isolationRisk: 31,
      commuteDistanceKm: 27,
      managerPreference: "hybrid",
    },
    preferredCollaborators: ["Priya Sharma", "Harshita Bose"],
  }),
  makeEmployee({
    id: "EMP007",
    name: "Kavya Menon",
    age: 30,
    gender: "Female",
    department: "Customer Success",
    designation: "Customer Success Manager",
    salary: 1480000,
    joiningDate: "2023-02-11",
    location: "Mumbai",
    currentWorkMode: "hybrid",
    roleType: "client_facing",
    attendance: {
      presentDays: 22,
      absentDays: 1,
      monthlyAttendancePercent: 95,
      consecutiveUnapprovedAbsenceDays: 0,
      lateArrivalsMonthly: 2,
      earlyExitsMonthly: 1,
      overtimeHoursMonthly: 19,
      meetingNoShowsQuarter: 1,
      deadlineMissesQuarter: 2,
      unauthorizedAccessAttemptsQuarter: 0,
    },
    leave: {
      leavesTakenYtd: 7,
      leaveTypes: ["sick", "casual"],
      approvalRate: 90,
      pattern: "more short leaves in the last month",
      sickLeaveSpike: true,
    },
    performance: {
      kpiLast6Months: [83, 82, 84, 81, 78, 79],
      monthlyRatings: [4.1, 4.0, 4.1, 3.9, 3.8, 3.9],
      managerFeedbackScore: 3.8,
      managerFeedbackText: "Strong with clients but stretched thin.",
      goalCompletion: 79,
      outputVsTeamPercent: 94,
      similarProjectScore: 82,
      lowOutputDays: 12,
    },
    behavior: {
      complaintsQuarter: 0,
      disciplinaryIncidentsQuarter: 0,
      peerReviewScore: 4.0,
      engagementScore: 58,
      engagementDelta: -22,
      peerSentimentScore: 70,
      complaintsAgainstManager: 1,
      skipLevelRequests: 2,
      negativeSentimentKeywords: 5,
    },
    salaryHistory: {
      current: 1480000,
      lastIncrementDate: "2024-08-01",
      incrementHistory: [9],
      bonusesLast12m: 130000,
      stagnationMonths: 20,
      promotionStagnationMonths: 22,
      rewardGap: true,
    },
    exitIndicators: {
      linkedinUpdated: true,
      naukriVisitsDetected: true,
      moodSurveyScore: 52,
      colleaguePromotedWhileNot: true,
      overtimeWithoutComp: true,
    },
    skills: {
      current: ["Account Management", "Escalation Handling", "Renewal Strategy", "Stakeholder Communication"],
      certifications: [],
      trainingCompleted: ["Enterprise Account Management"],
      newSkillsLast12m: ["Process Design"],
      gaps: ["Team Leadership", "Automation"],
    },
    workModeHistory: {
      remoteDaysPerMonth: 8,
      officeDaysPerMonth: 10,
      productivityRemote: 84,
      productivityOffice: 90,
      meetingLoadPerDay: 7,
      homeSetupScore: 78,
      teamNeedsPresence: true,
      clientMeetingsMonthly: 14,
      isolationRisk: 43,
      commuteDistanceKm: 10,
      managerPreference: "office",
    },
    leadership: {
      mentoringCount: 1,
      initiativeScore: 76,
      crossTeamCollaboration: 74,
    },
    traits: {
      leadership: 72,
      execution: 80,
      creativity: 66,
      analytical: 68,
      collaboration: 86,
      adaptability: 74,
      ownership: 78,
      communication: 92,
      empathy: 84,
    },
    recentEvents: [
      { date: "2026-03-18", label: "Escalation cluster", detail: "Managed four urgent client escalations in one week." },
      { date: "2026-04-04", label: "Pulse survey", detail: "Marked workload as unsustainable for the second month in a row." },
      { date: "2026-04-10", label: "Career note", detail: "Asked about internal mobility after seeing a peer promotion." },
    ],
    preferredCollaborators: ["Harshita Bose"],
  }),
  makeEmployee({
    id: "EMP008",
    name: "Sneha Rao",
    age: 26,
    gender: "Female",
    department: "HR",
    designation: "HR Executive",
    salary: 760000,
    joiningDate: "2024-05-09",
    location: "Mumbai",
    currentWorkMode: "hybrid",
    roleType: "collaborative",
    attendance: {
      presentDays: 16,
      absentDays: 6,
      monthlyAttendancePercent: 72,
      consecutiveUnapprovedAbsenceDays: 0,
      lateArrivalsMonthly: 12,
      earlyExitsMonthly: 4,
      overtimeHoursMonthly: 3,
      meetingNoShowsQuarter: 4,
      deadlineMissesQuarter: 6,
      unauthorizedAccessAttemptsQuarter: 0,
    },
    leave: {
      leavesTakenYtd: 11,
      leaveTypes: ["sick", "casual"],
      approvalRate: 74,
      pattern: "frequent unplanned short leaves",
      sickLeaveSpike: true,
    },
    performance: {
      kpiLast6Months: [79, 77, 74, 68, 61, 58],
      monthlyRatings: [3.8, 3.7, 3.5, 3.2, 2.9, 2.8],
      managerFeedbackScore: 2.6,
      managerFeedbackText: "Needs immediate improvement in follow-through and attendance discipline.",
      goalCompletion: 63,
      outputVsTeamPercent: 66,
      similarProjectScore: 61,
      lowOutputDays: 58,
    },
    behavior: {
      complaintsQuarter: 1,
      disciplinaryIncidentsQuarter: 0,
      peerReviewScore: 3.1,
      engagementScore: 49,
      engagementDelta: -21,
      peerSentimentScore: 54,
      complaintsAgainstManager: 0,
      skipLevelRequests: 0,
      negativeSentimentKeywords: 3,
    },
    salaryHistory: {
      current: 760000,
      lastIncrementDate: "2025-04-01",
      incrementHistory: [8],
      bonusesLast12m: 40000,
      stagnationMonths: 12,
      promotionStagnationMonths: 14,
      rewardGap: false,
    },
    skills: {
      current: ["Interview Coordination", "HR Operations", "Documentation"],
      certifications: [],
      trainingCompleted: ["Recruitment Foundations"],
      newSkillsLast12m: ["Excel Reporting"],
      gaps: ["Stakeholder Management", "HR Analytics", "Ownership"],
    },
    workModeHistory: {
      remoteDaysPerMonth: 10,
      officeDaysPerMonth: 8,
      productivityRemote: 70,
      productivityOffice: 78,
      meetingLoadPerDay: 5,
      homeSetupScore: 72,
      teamNeedsPresence: true,
      clientMeetingsMonthly: 0,
      isolationRisk: 48,
      commuteDistanceKm: 15,
      managerPreference: "hybrid",
    },
    leadership: {
      mentoringCount: 0,
      initiativeScore: 52,
      crossTeamCollaboration: 58,
    },
    traits: {
      leadership: 44,
      execution: 56,
      creativity: 58,
      analytical: 52,
      collaboration: 62,
      adaptability: 55,
      ownership: 48,
      communication: 61,
      empathy: 68,
    },
    recentEvents: [
      { date: "2026-03-21", label: "Attendance review", detail: "Attendance slipped below 75 percent for the month." },
      { date: "2026-04-01", label: "Deadline miss", detail: "Missed document verification batch SLA by two days." },
      { date: "2026-04-11", label: "Coaching note", detail: "Manager initiated formal improvement coaching." },
    ],
    pipStatus: {
      active: true,
      stage: "written_warning",
      startDate: "2026-04-11",
    },
    preferredCollaborators: ["Priya Sharma"],
  }),
  makeEmployee({
    id: "EMP009",
    name: "Vikram Patel",
    age: 34,
    gender: "Male",
    department: "Sales",
    designation: "Sales Manager",
    salary: 1720000,
    joiningDate: "2022-02-07",
    location: "Delhi",
    currentWorkMode: "office",
    roleType: "client_facing",
    attendance: {
      presentDays: 15,
      absentDays: 7,
      monthlyAttendancePercent: 69,
      consecutiveUnapprovedAbsenceDays: 4,
      lateArrivalsMonthly: 14,
      earlyExitsMonthly: 5,
      overtimeHoursMonthly: 2,
      meetingNoShowsQuarter: 5,
      deadlineMissesQuarter: 7,
      unauthorizedAccessAttemptsQuarter: 3,
    },
    leave: {
      leavesTakenYtd: 9,
      leaveTypes: ["casual", "sick"],
      approvalRate: 62,
      pattern: "irregular and often unapproved",
      sickLeaveSpike: false,
    },
    performance: {
      kpiLast6Months: [88, 85, 80, 72, 62, 58],
      monthlyRatings: [4.1, 4.0, 3.8, 3.4, 2.9, 2.7],
      managerFeedbackScore: 2.4,
      managerFeedbackText: "Multiple policy and conduct breaches despite prior coaching.",
      goalCompletion: 57,
      outputVsTeamPercent: 62,
      similarProjectScore: 60,
      lowOutputDays: 67,
    },
    behavior: {
      complaintsQuarter: 4,
      disciplinaryIncidentsQuarter: 2,
      peerReviewScore: 2.7,
      engagementScore: 43,
      engagementDelta: -26,
      peerSentimentScore: 38,
      complaintsAgainstManager: 0,
      skipLevelRequests: 0,
      negativeSentimentKeywords: 7,
    },
    salaryHistory: {
      current: 1720000,
      lastIncrementDate: "2025-04-01",
      incrementHistory: [7, 9],
      bonusesLast12m: 140000,
      stagnationMonths: 12,
      promotionStagnationMonths: 19,
      rewardGap: false,
    },
    skills: {
      current: ["Pipeline Management", "Negotiation", "Forecasting"],
      certifications: [],
      trainingCompleted: ["Enterprise Selling"],
      newSkillsLast12m: [],
      gaps: ["Discipline", "CRM Hygiene", "Coaching"],
    },
    workModeHistory: {
      remoteDaysPerMonth: 2,
      officeDaysPerMonth: 18,
      productivityRemote: 58,
      productivityOffice: 72,
      meetingLoadPerDay: 7,
      homeSetupScore: 70,
      teamNeedsPresence: true,
      clientMeetingsMonthly: 18,
      isolationRisk: 20,
      commuteDistanceKm: 13,
      managerPreference: "office",
    },
    leadership: {
      mentoringCount: 0,
      initiativeScore: 45,
      crossTeamCollaboration: 42,
    },
    traits: {
      leadership: 50,
      execution: 53,
      creativity: 58,
      analytical: 48,
      collaboration: 40,
      adaptability: 45,
      ownership: 42,
      communication: 72,
      empathy: 38,
    },
    recentEvents: [
      { date: "2026-03-14", label: "Complaint", detail: "Two customer complaints were escalated for delayed follow-up." },
      { date: "2026-03-29", label: "Security alert", detail: "Three unauthorized CRM access attempts were recorded." },
      { date: "2026-04-08", label: "Absence", detail: "Four consecutive workdays missed without prior approval." },
    ],
    conflictsWith: ["Kavya Menon"],
    pipStatus: {
      active: true,
      stage: "final_warning",
      startDate: "2026-03-29",
    },
  }),
  makeEmployee({
    id: "EMP010",
    name: "Dev Malhotra",
    age: 31,
    gender: "Male",
    department: "IT",
    designation: "Security Engineer",
    salary: 1880000,
    joiningDate: "2023-05-15",
    location: "Bengaluru",
    currentWorkMode: "office",
    roleType: "collaborative",
    performance: {
      kpiLast6Months: [89, 90, 89, 91, 90, 92],
      monthlyRatings: [4.4, 4.5, 4.4, 4.6, 4.5, 4.7],
      managerFeedbackScore: 4.6,
      managerFeedbackText: "Strong operator in high-trust systems work.",
      goalCompletion: 93,
      outputVsTeamPercent: 112,
      similarProjectScore: 94,
      lowOutputDays: 0,
    },
    skills: {
      current: ["Security Engineering", "IAM", "Cloud Security", "Compliance Automation"],
      certifications: ["CISSP"],
      trainingCompleted: ["Zero Trust Workshop"],
      newSkillsLast12m: ["Threat Modeling"],
      gaps: ["Presentation Skills"],
    },
    leadership: {
      mentoringCount: 2,
      initiativeScore: 84,
      crossTeamCollaboration: 82,
    },
    traits: {
      leadership: 74,
      execution: 90,
      creativity: 62,
      analytical: 92,
      collaboration: 80,
      adaptability: 77,
      ownership: 91,
      communication: 74,
      empathy: 68,
    },
    workModeHistory: {
      remoteDaysPerMonth: 4,
      officeDaysPerMonth: 16,
      productivityRemote: 84,
      productivityOffice: 92,
      meetingLoadPerDay: 4,
      homeSetupScore: 86,
      teamNeedsPresence: true,
      clientMeetingsMonthly: 0,
      isolationRisk: 23,
      commuteDistanceKm: 8,
      managerPreference: "office",
    },
    preferredCollaborators: ["Ananya Iyer"],
  }),
  makeEmployee({
    id: "EMP011",
    name: "Maya Fernandes",
    age: 27,
    gender: "Female",
    department: "Engineering",
    designation: "QA Automation Engineer",
    salary: 1140000,
    joiningDate: "2026-04-03",
    location: "Pune",
    currentWorkMode: "remote",
    roleType: "independent",
    performance: {
      kpiLast6Months: [78, 82, 85, 87, 88, 90],
      monthlyRatings: [3.9, 4.1, 4.2, 4.3, 4.4, 4.5],
      managerFeedbackScore: 4.4,
      managerFeedbackText: "Fast learner with disciplined automation habits.",
      goalCompletion: 90,
      outputVsTeamPercent: 109,
      similarProjectScore: 88,
      lowOutputDays: 0,
    },
    recruitment: {
      source: "Campus+Lateral blend",
      onboardingDays: 12,
      productivityDays: 26,
    },
    skills: {
      current: ["QA Automation", "Cypress", "Playwright", "API Testing", "CI Pipelines"],
      certifications: [],
      trainingCompleted: ["Modern Test Automation"],
      newSkillsLast12m: ["Playwright"],
      gaps: ["Mentoring Experience"],
    },
    leadership: {
      mentoringCount: 0,
      initiativeScore: 79,
      crossTeamCollaboration: 76,
    },
    traits: {
      leadership: 58,
      execution: 90,
      creativity: 64,
      analytical: 86,
      collaboration: 82,
      adaptability: 91,
      ownership: 84,
      communication: 76,
      empathy: 72,
    },
    workModeHistory: {
      remoteDaysPerMonth: 18,
      officeDaysPerMonth: 2,
      productivityRemote: 94,
      productivityOffice: 87,
      meetingLoadPerDay: 2,
      homeSetupScore: 90,
      teamNeedsPresence: false,
      clientMeetingsMonthly: 0,
      isolationRisk: 25,
      commuteDistanceKm: 22,
      managerPreference: "hybrid",
    },
    preferredCollaborators: ["Rohan Verma", "Ananya Iyer"],
  }),
  makeEmployee({
    id: "EMP012",
    name: "Harshita Bose",
    age: 33,
    gender: "Female",
    department: "Product",
    designation: "Product Manager",
    salary: 2060000,
    joiningDate: "2022-10-09",
    location: "Bengaluru",
    currentWorkMode: "hybrid",
    roleType: "collaborative",
    performance: {
      kpiLast6Months: [84, 86, 88, 89, 90, 91],
      monthlyRatings: [4.2, 4.3, 4.4, 4.4, 4.5, 4.6],
      managerFeedbackScore: 4.5,
      managerFeedbackText: "Drives clarity across product, design, and delivery.",
      goalCompletion: 92,
      outputVsTeamPercent: 111,
      similarProjectScore: 93,
      lowOutputDays: 0,
    },
    skills: {
      current: ["Roadmapping", "Stakeholder Management", "Discovery", "Delivery Planning", "Analytics"],
      certifications: ["CSPO"],
      trainingCompleted: ["Leadership for PMs"],
      newSkillsLast12m: ["Experiment Design", "Executive Communication"],
      gaps: ["Deep Data Modeling"],
    },
    leadership: {
      mentoringCount: 3,
      initiativeScore: 89,
      crossTeamCollaboration: 93,
    },
    traits: {
      leadership: 86,
      execution: 88,
      creativity: 81,
      analytical: 79,
      collaboration: 93,
      adaptability: 87,
      ownership: 89,
      communication: 92,
      empathy: 84,
    },
    workModeHistory: {
      remoteDaysPerMonth: 9,
      officeDaysPerMonth: 9,
      productivityRemote: 88,
      productivityOffice: 92,
      meetingLoadPerDay: 6,
      homeSetupScore: 84,
      teamNeedsPresence: true,
      clientMeetingsMonthly: 2,
      isolationRisk: 28,
      commuteDistanceKm: 17,
      managerPreference: "hybrid",
    },
    preferredCollaborators: ["Neha Gupta", "Kavya Menon", "Aarav Mehta"],
  }),
  makeEmployee({
    id: "EMP013",
    name: "Ritu Sen",
    age: 27,
    gender: "Female",
    department: "HR",
    designation: "Recruiting Coordinator",
    salary: 680000,
    joiningDate: "2025-07-14",
    location: "Kolkata",
    status: "on_leave",
    currentWorkMode: "remote",
    roleType: "collaborative",
    performance: {
      kpiLast6Months: [76, 79, 81, 82, 83, 84],
      monthlyRatings: [3.8, 4.0, 4.1, 4.2, 4.2, 4.3],
      managerFeedbackScore: 4.1,
      managerFeedbackText: "Reliable coordinator with steady communication.",
      goalCompletion: 84,
      outputVsTeamPercent: 101,
      similarProjectScore: 80,
      lowOutputDays: 0,
    },
    leave: {
      leavesTakenYtd: 14,
      leaveTypes: ["medical"],
      approvalRate: 100,
      pattern: "approved medical leave",
      sickLeaveSpike: false,
    },
    skills: {
      current: ["Scheduling", "Candidate Communication", "ATS Coordination"],
      certifications: [],
      trainingCompleted: ["Interview Operations"],
      newSkillsLast12m: ["Offer Coordination"],
      gaps: ["Analytics"],
    },
    workModeHistory: {
      remoteDaysPerMonth: 20,
      officeDaysPerMonth: 0,
      productivityRemote: 89,
      productivityOffice: 86,
      meetingLoadPerDay: 4,
      homeSetupScore: 87,
      teamNeedsPresence: false,
      clientMeetingsMonthly: 0,
      isolationRisk: 26,
      commuteDistanceKm: 19,
      managerPreference: "remote",
    },
  }),
];

const baseCandidates: CandidateProfile[] = [
  makeCandidate({
    id: "CAN001",
    name: "Aditya Nair",
    targetRole: "Senior Frontend Engineer",
    department: "Engineering",
    experienceYears: 5.2,
    skills: ["React", "TypeScript", "Next.js", "Jest", "Accessibility", "GraphQL"],
    expectedSalary: 2000000,
    assessmentScore: 91,
    portfolioScore: 88,
    motivationScore: 86,
    tenureStabilityScore: 90,
    referenceScore: 89,
    traits: {
      leadership: 72,
      execution: 91,
      creativity: 76,
      analytical: 84,
      collaboration: 85,
      adaptability: 82,
      ownership: 90,
      communication: 79,
      empathy: 72,
    },
    acceptanceSignals: {
      interestScore: 90,
      compensationFlexibility: 82,
      locationFit: 86,
      competingOffers: false,
    },
    personalityNotes: ["Calm in code review", "Strong ownership in past projects"],
  }),
  makeCandidate({
    id: "CAN002",
    name: "Meera Joshi",
    targetRole: "Senior Frontend Engineer",
    department: "Engineering",
    experienceYears: 4.1,
    skills: ["React", "TypeScript", "Tailwind CSS", "Cypress", "Design Systems", "Storybook"],
    expectedSalary: 1820000,
    assessmentScore: 87,
    portfolioScore: 85,
    motivationScore: 92,
    tenureStabilityScore: 84,
    referenceScore: 86,
    traits: {
      leadership: 68,
      execution: 86,
      creativity: 82,
      analytical: 79,
      collaboration: 93,
      adaptability: 90,
      ownership: 82,
      communication: 86,
      empathy: 84,
    },
    acceptanceSignals: {
      interestScore: 94,
      compensationFlexibility: 88,
      locationFit: 92,
      competingOffers: false,
    },
    personalityNotes: ["Strong workshop facilitator", "Known for clean design system thinking"],
  }),
  makeCandidate({
    id: "CAN003",
    name: "Nikhil Sethi",
    targetRole: "Senior Frontend Engineer",
    department: "Engineering",
    experienceYears: 6,
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "Testing", "AWS"],
    expectedSalary: 2400000,
    noticePeriodDays: 60,
    assessmentScore: 88,
    portfolioScore: 81,
    motivationScore: 80,
    tenureStabilityScore: 68,
    referenceScore: 82,
    jobChangesLast5Years: 3,
    traits: {
      leadership: 74,
      execution: 85,
      creativity: 70,
      analytical: 86,
      collaboration: 78,
      adaptability: 74,
      ownership: 81,
      communication: 80,
      empathy: 67,
    },
    acceptanceSignals: {
      interestScore: 78,
      compensationFlexibility: 58,
      locationFit: 80,
      competingOffers: true,
    },
    redFlags: ["Long notice period", "Competing offer in final rounds"],
  }),
  makeCandidate({
    id: "CAN004",
    name: "Farhan Ali",
    targetRole: "Senior Frontend Engineer",
    department: "Engineering",
    experienceYears: 3.8,
    skills: ["React", "JavaScript", "Redux", "CSS", "REST APIs"],
    expectedSalary: 2100000,
    assessmentScore: 76,
    portfolioScore: 74,
    motivationScore: 72,
    tenureStabilityScore: 58,
    referenceScore: 70,
    jobChangesLast5Years: 4,
    traits: {
      leadership: 54,
      execution: 72,
      creativity: 70,
      analytical: 66,
      collaboration: 71,
      adaptability: 67,
      ownership: 68,
      communication: 75,
      empathy: 63,
    },
    acceptanceSignals: {
      interestScore: 74,
      compensationFlexibility: 55,
      locationFit: 82,
      competingOffers: true,
    },
    redFlags: ["Frequent job changes", "Skill depth in testing is limited"],
  }),
  makeCandidate({
    id: "CAN005",
    name: "Pooja Bansal",
    targetRole: "Product Designer",
    department: "Product",
    experienceYears: 5.4,
    skills: ["Figma", "Design Systems", "Research", "Accessibility", "Prototyping"],
    expectedSalary: 1760000,
    assessmentScore: 90,
    portfolioScore: 92,
    motivationScore: 88,
    tenureStabilityScore: 86,
    referenceScore: 89,
    traits: {
      leadership: 70,
      execution: 84,
      creativity: 95,
      analytical: 78,
      collaboration: 91,
      adaptability: 87,
      ownership: 84,
      communication: 89,
      empathy: 85,
    },
  }),
  makeCandidate({
    id: "CAN006",
    name: "Isha Kulkarni",
    targetRole: "People Analytics Manager",
    department: "HR",
    experienceYears: 6.3,
    skills: ["People Analytics", "SQL", "Power BI", "Stakeholder Management", "Compensation Analytics"],
    expectedSalary: 1720000,
    assessmentScore: 89,
    portfolioScore: 84,
    motivationScore: 90,
    tenureStabilityScore: 88,
    referenceScore: 91,
    traits: {
      leadership: 82,
      execution: 86,
      creativity: 66,
      analytical: 94,
      collaboration: 89,
      adaptability: 83,
      ownership: 87,
      communication: 85,
      empathy: 81,
    },
  }),
  makeCandidate({
    id: "CAN007",
    name: "Manav Desai",
    targetRole: "People Analytics Manager",
    department: "HR",
    experienceYears: 4.7,
    skills: ["SQL", "Python", "Dashboarding", "Forecasting", "Excel Automation"],
    expectedSalary: 1480000,
    assessmentScore: 84,
    portfolioScore: 79,
    motivationScore: 84,
    tenureStabilityScore: 82,
    referenceScore: 83,
    traits: {
      leadership: 64,
      execution: 83,
      creativity: 61,
      analytical: 92,
      collaboration: 78,
      adaptability: 80,
      ownership: 82,
      communication: 74,
      empathy: 70,
    },
  }),
  makeCandidate({
    id: "CAN008",
    name: "Sara Khan",
    targetRole: "Product Designer",
    department: "Product",
    experienceYears: 4.2,
    skills: ["Figma", "Research", "Design Systems", "Interaction Design"],
    expectedSalary: 1640000,
    assessmentScore: 85,
    portfolioScore: 87,
    motivationScore: 85,
    tenureStabilityScore: 80,
    referenceScore: 84,
    traits: {
      leadership: 62,
      execution: 80,
      creativity: 90,
      analytical: 75,
      collaboration: 84,
      adaptability: 82,
      ownership: 78,
      communication: 83,
      empathy: 82,
    },
  }),
];

const baseOpenPositions: JobOpening[] = [
  makePosition({
    id: "JOB001",
    title: "Senior Frontend Engineer",
    department: "Engineering",
    requiredSkills: ["React", "TypeScript", "Testing", "Design Systems", "API Integration"],
    salaryRange: [1600000, 2200000],
    priority: "critical",
  }),
  makePosition({
    id: "JOB002",
    title: "People Analytics Manager",
    department: "HR",
    requiredSkills: ["People Analytics", "SQL", "Dashboarding", "Stakeholder Management"],
    salaryRange: [1400000, 1800000],
    priority: "high",
  }),
  makePosition({
    id: "JOB003",
    title: "Customer Success Team Lead",
    department: "Customer Success",
    requiredSkills: ["Account Management", "Escalation Handling", "Communication", "Process Design"],
    salaryRange: [1200000, 1600000],
    priority: "medium",
  }),
];

function defaultCandidateFromApi(candidate: Record<string, any>): CandidateProfile {
  return makeCandidate({
    id: `CAN-${candidate.id || Date.now()}`,
    name: candidate.name || "New Candidate",
    targetRole: candidate.role || "AI Screened Candidate",
    department: "Engineering",
    experienceYears: Number(String(candidate.experience || "3").match(/\d+/)?.[0] || 3),
    skills: Array.isArray(candidate.skills) ? candidate.skills : ["Communication", "Problem Solving"],
    expectedSalary: 1400000,
    assessmentScore: clamp(candidate.match || 72),
    portfolioScore: clamp((candidate.match || 72) - 4),
    motivationScore: 80,
    tenureStabilityScore: 76,
    referenceScore: 78,
    acceptanceSignals: {
      interestScore: 84,
      compensationFlexibility: 76,
      locationFit: 82,
      competingOffers: false,
    },
  });
}

function defaultEmployeeFromApi(employee: Record<string, any>): EmployeeProfile {
  const department = employee.dept || employee.department || "General";
  return makeEmployee({
    id: `EMP-${employee.id || Date.now()}`,
    name: employee.name || "New Employee",
    department,
    designation: employee.role || employee.designation || "Employee",
    salary: 900000,
    joiningDate: employee.joined || employee.joiningDate || "2025-01-01",
    location: "Bengaluru",
    status: employee.status === "on leave" ? "on_leave" : "active",
    currentWorkMode: employee.status === "remote" ? "remote" : "hybrid",
    skills: {
      current: department === "Engineering" ? ["Execution", "Collaboration", "Delivery"] : ["Operations", "Coordination", "Delivery"],
      certifications: [],
      trainingCompleted: [],
      newSkillsLast12m: [],
      gaps: [],
    },
  });
}

function defaultPositionFromApi(job: Record<string, any>): JobOpening {
  return makePosition({
    id: `JOB-${job.id || Date.now()}`,
    title: job.title || "Open Position",
    department: titleize(job.department || "General"),
    requiredSkills: splitList(job.description || "").slice(0, 5).length
      ? splitList(job.description || "").slice(0, 5)
      : ["Communication", "Execution", "Problem Solving"],
    salaryRange: [Number(job.min_salary) || 1000000, Number(job.max_salary) || 1600000],
    priority: "medium",
  });
}

function buildDataset(rawDb?: Record<string, any>): HrDataset {
  const employees = [...baseEmployees];
  const candidates = [...baseCandidates];
  const openPositions = [...baseOpenPositions];

  if (Array.isArray(rawDb?.employees)) {
    for (const employee of rawDb.employees) {
      if (!employees.some((item) => normalize(item.name) === normalize(employee.name || ""))) {
        employees.push(defaultEmployeeFromApi(employee));
      }
    }
  }

  if (Array.isArray(rawDb?.candidates)) {
    for (const candidate of rawDb.candidates) {
      if (!candidates.some((item) => normalize(item.name) === normalize(candidate.name || ""))) {
        candidates.push(defaultCandidateFromApi(candidate));
      }
    }
  }

  if (Array.isArray(rawDb?.jobs)) {
    for (const job of rawDb.jobs) {
      if (!openPositions.some((item) => normalize(item.title) === normalize(job.title || ""))) {
        openPositions.push(defaultPositionFromApi(job));
      }
    }
  }

  return { employees, candidates, openPositions };
}

function hiringRoleDefaults(dataset: HrDataset, message: string) {
  const explicitRole = titleize(extractRole(message));
  const explicitDepartment = extractDepartment(message);
  const explicitSkills = extractSkills(message);
  const matchingPosition =
    dataset.openPositions.find((position) => normalize(position.title) === normalize(explicitRole)) ||
    dataset.openPositions.find((position) => normalize(message).includes(normalize(position.title))) ||
    dataset.openPositions.find((position) => normalize(position.department) === normalize(explicitDepartment)) ||
    dataset.openPositions[0];

  return {
    role: explicitRole || matchingPosition.title,
    department: explicitDepartment || matchingPosition.department,
    skills: explicitSkills.length ? explicitSkills : matchingPosition.requiredSkills,
    salaryRange: extractSalaryRange(message, matchingPosition.salaryRange),
  };
}

function hiringCandidatePool(dataset: HrDataset, role: string, department: string) {
  const keywords = roleKeywords(role, department);
  return dataset.candidates
    .filter((candidate) => {
      const titleHit = keywords.some((word) => normalize(candidate.targetRole).includes(word));
      const departmentHit = normalize(candidate.department) === normalize(department);
      return titleHit || departmentHit;
    })
    .sort((left, right) => right.assessmentScore - left.assessmentScore);
}

function hiringRecommendation(dataset: HrDataset, message: string): HrBrainResponse {
  const context = hiringRoleDefaults(dataset, message);
  const pool = hiringCandidatePool(dataset, context.role, context.department);

  const analyzed = pool.map((candidate) => {
    const skillMatchScore = round(
      skillOverlap(context.skills, candidate.skills) * 0.7 +
        clamp(candidate.assessmentScore * 0.2 + candidate.portfolioScore * 0.1),
    );
    const cultureFitScore = round(
      candidate.traits.collaboration * 0.24 +
        candidate.traits.ownership * 0.24 +
        candidate.traits.adaptability * 0.2 +
        candidate.traits.communication * 0.18 +
        candidate.referenceScore * 0.14,
    );
    const first90DayPerformance = round(
      skillMatchScore * 0.38 +
        candidate.assessmentScore * 0.22 +
        candidate.portfolioScore * 0.1 +
        candidate.motivationScore * 0.16 +
        clamp(100 - candidate.onboardingSpeedDays * 1.4) * 0.14,
    );

    const attritionContributors = [
      candidate.jobChangesLast5Years >= 4 ? 18 : candidate.jobChangesLast5Years >= 3 ? 11 : 4,
      candidate.expectedSalary > context.salaryRange[1] ? 17 : candidate.expectedSalary > context.salaryRange[1] * 0.95 ? 9 : 3,
      clamp(100 - candidate.motivationScore, 0, 25) * 0.3,
      candidate.acceptanceSignals.competingOffers ? 12 : 3,
      clamp(100 - candidate.tenureStabilityScore, 0, 20) * 0.5,
    ];
    const attritionRisk = round(clamp(attritionContributors.reduce((sum, value) => sum + value, 8), 8, 88));

    const offerAcceptanceProbability = round(
      candidate.acceptanceSignals.interestScore * 0.34 +
        candidate.acceptanceSignals.compensationFlexibility * 0.2 +
        candidate.acceptanceSignals.locationFit * 0.16 +
        clamp(100 - Math.max(candidate.noticePeriodDays - 30, 0) * 0.8) * 0.1 +
        (context.salaryRange[1] >= candidate.expectedSalary ? 92 : 68) * 0.2,
    );

    const overallHireRecommendationScore = round(
      skillMatchScore * 0.28 +
        cultureFitScore * 0.2 +
        first90DayPerformance * 0.24 +
        (100 - attritionRisk) * 0.14 +
        offerAcceptanceProbability * 0.14,
    );

    const redFlags = unique(
      [
        ...candidate.redFlags,
        skillMatchScore < 78 ? "Several must-have skills still need validation." : "",
        attritionRisk >= 55 ? "Retention risk is above the preferred hiring threshold." : "",
        candidate.noticePeriodDays > 45 ? "Joining timeline is longer than ideal." : "",
        candidate.expectedSalary > context.salaryRange[1] ? "Compensation expectation is above current budget." : "",
      ].filter(Boolean),
    );

    const interviewQuestions = [
      `Walk us through a project where you used ${context.skills[0]} under delivery pressure.`,
      candidate.traits.collaboration < 82
        ? "Tell us about a disagreement with design or backend and how you resolved it."
        : "How do you keep cross-functional partners aligned when requirements shift?",
      skillMatchScore < 80
        ? `Which of these skills would you ramp on first: ${context.skills.slice(0, 3).join(", ")}?`
        : "What would your first 30-60-90 day plan look like in this role?",
    ];

    const predictedJoiningDate = addDays(isoDate(), candidate.noticePeriodDays + 9);
    const onboardingTimeDays = Math.max(10, Math.round(candidate.onboardingSpeedDays));
    const finalRecommendation =
      overallHireRecommendationScore >= 84 && attritionRisk <= 45
        ? "HIRE"
        : overallHireRecommendationScore >= 70
          ? "SHORTLIST"
          : "REJECT";
    const confidence = round(
      clamp(
        78 +
          skillMatchScore * 0.05 +
          cultureFitScore * 0.03 +
          candidate.referenceScore * 0.04 -
          redFlags.length * 2.2,
        70,
        96,
      ),
    );

    return {
      candidate_id: candidate.id,
      candidate_name: candidate.name,
      target_role: candidate.targetRole,
      source: candidate.source,
      experience_years: candidate.experienceYears,
      skill_match_score: skillMatchScore,
      culture_fit_score: cultureFitScore,
      predicted_performance_first_90_days: first90DayPerformance,
      attrition_risk: attritionRisk,
      offer_acceptance_probability: offerAcceptanceProbability,
      overall_hire_recommendation_score: overallHireRecommendationScore,
      reasons: [
        `${candidate.name} covers ${Math.round(skillOverlap(context.skills, candidate.skills))}% of the required skills for ${context.role}.`,
        `${archetypeFromTraits(candidate.traits)} profile with ${candidate.traits.collaboration}% collaboration and ${candidate.traits.ownership}% ownership signals.`,
        `Expected onboarding time is ${onboardingTimeDays} days with a predicted join date of ${formatDate(predictedJoiningDate)}.`,
      ],
      red_flags: redFlags,
      suggested_interview_questions: interviewQuestions,
      predicted_joining_date: predictedJoiningDate,
      predicted_onboarding_time_days: onboardingTimeDays,
      final_recommendation: finalRecommendation,
      confidence_percent: confidence,
    };
  });

  const ranked = analyzed.sort((left, right) => right.overall_hire_recommendation_score - left.overall_hire_recommendation_score);
  const top3 = ranked.slice(0, 3);
  const topCandidate = top3[0];
  const summary =
    topCandidate
      ? `${topCandidate.candidate_name} leads the ${context.role} shortlist with an ${topCandidate.overall_hire_recommendation_score}% overall hire score, ${topCandidate.skill_match_score}% skill match, and ${topCandidate.offer_acceptance_probability}% offer acceptance probability. ${top3.length > 1 ? `${top3[1].candidate_name} and ${top3[2]?.candidate_name || "the next ranked candidate"} remain strong backup options, but the main decision point is whether we prioritize immediate fit or lower compensation risk.` : "This role currently has one clear frontrunner, so the next step is to validate remaining risk areas in interview."}`
      : `No suitable candidates were found for ${context.role}, so the strongest next action is broadening sourcing while refining the skill and budget filters.`;

  return {
    task: "hiring_recommendation",
    generatedAt: isoDate(),
    confidence: round(clamp(dataCompletenessScore(dataset) - 2, 80, 94)),
    summary,
    structuredJson: {
      job_context: {
        role: context.role,
        department: context.department,
        required_skills: context.skills,
        salary_range: {
          min: context.salaryRange[0],
          max: context.salaryRange[1],
          display: `${formatLpa(context.salaryRange[0])} - ${formatLpa(context.salaryRange[1])}`,
        },
      },
      top_3_candidates: top3,
      candidates_analyzed: ranked,
      final_recommendation: topCandidate
        ? {
            recommended_action: topCandidate.final_recommendation,
            recommended_candidate: topCandidate.candidate_name,
            confidence_percent: topCandidate.confidence_percent,
          }
        : {
            recommended_action: "REJECT",
            recommended_candidate: null,
            confidence_percent: 78,
          },
    },
  };
}

function promotionScores(employee: EmployeeProfile) {
  const performanceConsistency = round(avg(employee.performance.kpiLast6Months));
  const leadershipIndicators = round(
    clamp(
      employee.leadership.mentoringCount * 10 +
        employee.leadership.initiativeScore * 0.42 +
        employee.leadership.crossTeamCollaboration * 0.38,
      0,
      100,
    ),
  );
  const skillGrowthRate = round(
    clamp(
      employee.skills.newSkillsLast12m.length * 16 +
        employee.skills.trainingCompleted.length * 7 +
        Math.max(0, 100 - employee.skills.gaps.length * 12) * 0.35,
      0,
      100,
    ),
  );
  const tenureYears = Math.max(1, monthsBetween(employee.joiningDate) / 12);
  const tenureVsContributionRatio = round(
    clamp(((performanceConsistency + employee.performance.goalCompletion + employee.performance.outputVsTeamPercent) / 3) / tenureYears, 35, 100),
  );
  const feedbackSentimentScore = round(
    clamp(
      employee.behavior.peerReviewScore * 18 +
        employee.performance.managerFeedbackScore * 16 +
        employee.behavior.peerSentimentScore * 0.28,
      0,
      100,
    ),
  );
  const promotionReadinessScore = round(
    performanceConsistency * 0.28 +
      leadershipIndicators * 0.22 +
      skillGrowthRate * 0.16 +
      tenureVsContributionRatio * 0.14 +
      feedbackSentimentScore * 0.2,
  );
  return {
    performanceConsistency,
    leadershipIndicators,
    skillGrowthRate,
    tenureVsContributionRatio,
    feedbackSentimentScore,
    promotionReadinessScore,
  };
}

function nextDesignation(currentDesignation: string) {
  const map: Record<string, string> = {
    "Frontend Engineer": "Senior Frontend Engineer",
    "Senior Backend Engineer": "Engineering Lead",
    "Product Designer": "Senior Product Designer",
    "Product Manager": "Senior Product Manager",
    "HR Executive": "HR Business Partner",
    "People Analytics Analyst": "Senior People Analytics Analyst",
    "Customer Success Manager": "Customer Success Team Lead",
  };
  return map[currentDesignation] || `Senior ${currentDesignation}`;
}

function promotionAnalysis(dataset: HrDataset, message: string): HrBrainResponse {
  const department = extractDepartment(message) || "Engineering";
  const employees = dataset.employees.filter(
    (employee) => employee.status === "active" && normalize(employee.department) === normalize(department),
  );

  const analyzed = employees
    .map((employee) => {
      const scores = promotionScores(employee);
      const criteriaGap = [
        scores.leadershipIndicators < 75 ? "Needs stronger people leadership or mentoring signals." : "",
        scores.skillGrowthRate < 72 ? "Skill growth has slowed over the last 12 months." : "",
        employee.salaryHistory.promotionStagnationMonths < 18 ? "Tenure at current level is still short for immediate elevation." : "",
        employee.skills.gaps.length ? `Role gap to close: ${employee.skills.gaps[0]}.` : "",
      ].filter(Boolean);
      const timelineRecommendation =
        scores.promotionReadinessScore >= 84 && criteriaGap.length <= 1
          ? "Promote NOW"
          : scores.promotionReadinessScore >= 72
            ? "Promote in 3 months"
            : "Promote in 6 months";
      const attritionProbabilityIfIgnored = round(
        clamp(
          22 +
            employee.salaryHistory.promotionStagnationMonths * 1.15 +
            (employee.salaryHistory.rewardGap ? 12 : 0) +
            Math.max(0, 78 - employee.behavior.engagementScore) * 0.7,
          18,
          92,
        ),
      );
      const finalDecision =
        scores.promotionReadinessScore >= 84 && criteriaGap.length <= 1
          ? "PROMOTE"
          : scores.promotionReadinessScore >= 70
            ? "HOLD"
            : "DEVELOP";
      const suggestedMin = Math.round(employee.salary * 1.12);
      const suggestedMax = Math.round(employee.salary * 1.2);

      return {
        employee_id: employee.id,
        employee_name: employee.name,
        current_designation: employee.designation,
        performance_consistency_score: scores.performanceConsistency,
        leadership_indicators: scores.leadershipIndicators,
        skill_growth_rate: scores.skillGrowthRate,
        tenure_vs_contribution_ratio: scores.tenureVsContributionRatio,
        peer_and_manager_feedback_sentiment_score: scores.feedbackSentimentScore,
        promotion_readiness_score: scores.promotionReadinessScore,
        required_criteria_gap: criteriaGap,
        suggested_new_designation: nextDesignation(employee.designation),
        suggested_salary_band: {
          min: suggestedMin,
          max: suggestedMax,
          display: `${formatLpa(suggestedMin)} - ${formatLpa(suggestedMax)}`,
        },
        timeline_recommendation: timelineRecommendation,
        risk_of_not_promoting_attrition_probability: attritionProbabilityIfIgnored,
        final_decision: finalDecision,
        justification: `${employee.name} is at ${scores.promotionReadinessScore}% readiness with ${scores.performanceConsistency}% performance consistency and ${scores.leadershipIndicators}% leadership signal strength.`,
      };
    })
    .sort((left, right) => right.promotion_readiness_score - left.promotion_readiness_score);

  const topCandidates = analyzed.slice(0, 3);
  const summary =
    topCandidates.length
      ? `${topCandidates[0].employee_name} is the strongest promotion case in ${department} at ${topCandidates[0].promotion_readiness_score}% readiness, with ${topCandidates[0].timeline_recommendation.toLowerCase()}. ${topCandidates[1] ? `${topCandidates[1].employee_name} is close behind and should stay in the same quarter review cycle.` : ""}`
      : `No active employees were found in ${department}, so promotion analysis could not surface any immediate candidates.`;

  return {
    task: "promotion_analysis",
    generatedAt: isoDate(),
    confidence: round(clamp(dataCompletenessScore(dataset) - 1, 82, 95)),
    summary,
    structuredJson: {
      department,
      top_candidates_for_promotion: topCandidates,
      employees_analyzed: analyzed,
      final_decision: topCandidates.map((candidate) => ({
        employee_name: candidate.employee_name,
        final_decision: candidate.final_decision,
        timeline_recommendation: candidate.timeline_recommendation,
      })),
    },
  };
}

function kpiDropPercent(employee: EmployeeProfile) {
  const values = employee.performance.kpiLast6Months;
  const previous = avg(values.slice(-4, -2));
  const current = avg(values.slice(-2));
  if (!previous) return 0;
  return round(((previous - current) / previous) * 100);
}

function severityFromTriggers(triggerCount: number, employee: EmployeeProfile) {
  if (employee.behavior.disciplinaryIncidentsQuarter >= 2 || triggerCount >= 5) return "TERMINATION RISK";
  if (triggerCount >= 4) return "FINAL WARNING";
  if (triggerCount >= 2) return "WRITTEN";
  return "VERBAL";
}

function improvementTimeline(severity: string) {
  if (severity === "TERMINATION RISK") return "Review within 14 days";
  if (severity === "FINAL WARNING") return "Review within 21 days";
  if (severity === "WRITTEN") return "Review within 30 days";
  return "Review within 45 days";
}

function warningActionPlan(employee: EmployeeProfile, evidence: string[]) {
  return [
    `Set weekly manager check-ins focused on attendance, deliverables, and conduct for ${employee.name}.`,
    employee.performance.outputVsTeamPercent < 70
      ? "Start a structured PIP with measurable output goals tied to the team average."
      : "Track completion quality and reopen missed SLA items within 24 hours.",
    employee.attendance.lateArrivalsMonthly > 10 || employee.attendance.monthlyAttendancePercent < 75
      ? "Require daily start-of-day and end-of-day confirmation for the next review cycle."
      : "Monitor schedule adherence for the next full month.",
    evidence.some((item) => item.toLowerCase().includes("complaint")) || employee.behavior.disciplinaryIncidentsQuarter > 0
      ? "Escalate to HRBP for conduct coaching and documented acknowledgement."
      : "Continue manager-led coaching with HR follow-up at the end of the period.",
  ];
}

function warningLetter(employee: EmployeeProfile, severity: string, evidence: string[]) {
  return [
    `Subject: ${severity} - Performance and Conduct Review`,
    "",
    `Dear ${employee.name},`,
    "",
    `This letter serves as a formal ${severity.toLowerCase()} regarding recent issues observed in your performance, attendance, and/or workplace conduct.`,
    `Key observations: ${evidence.join(" ")}`,
    "You are expected to show immediate and sustained improvement against the agreed action plan.",
    `Your review checkpoint is scheduled for ${improvementTimeline(severity).replace("Review within ", "")}.`,
    "",
    "Regards,",
    "HR Operations",
  ].join("\n");
}

function warningAnalysis(dataset: HrDataset): HrBrainResponse {
  const flagged = dataset.employees
    .filter((employee) => employee.status === "active")
    .map((employee) => {
      const kpiDrop = kpiDropPercent(employee);
      const evidence = [
        employee.attendance.consecutiveUnapprovedAbsenceDays > 3
          ? `${formatDate("2026-04-08")}: ${employee.attendance.consecutiveUnapprovedAbsenceDays} consecutive unapproved absence days.`
          : "",
        employee.attendance.monthlyAttendancePercent < 75
          ? `${formatDate("2026-03-31")}: attendance closed at ${employee.attendance.monthlyAttendancePercent}%.`
          : "",
        kpiDrop > 20 ? `${formatDate("2026-04-10")}: KPI dropped ${kpiDrop}% over the last two months.` : "",
        employee.behavior.complaintsQuarter > 2
          ? `${formatDate("2026-03-14")}: ${employee.behavior.complaintsQuarter} complaints logged this quarter.`
          : "",
        employee.behavior.disciplinaryIncidentsQuarter > 0
          ? `${formatDate("2026-03-29")}: ${employee.behavior.disciplinaryIncidentsQuarter} disciplinary incidents recorded.`
          : "",
        employee.attendance.lateArrivalsMonthly > 10
          ? `${formatDate("2026-03-31")}: ${employee.attendance.lateArrivalsMonthly} late arrivals this month.`
          : "",
        employee.attendance.unauthorizedAccessAttemptsQuarter > 0
          ? `${formatDate("2026-03-29")}: ${employee.attendance.unauthorizedAccessAttemptsQuarter} unauthorized access attempts detected.`
          : "",
        employee.performance.outputVsTeamPercent < 70 && employee.performance.lowOutputDays >= 45
          ? `${formatDate("2026-04-12")}: output is ${employee.performance.outputVsTeamPercent}% of team average for ${employee.performance.lowOutputDays} days.`
          : "",
        employee.attendance.meetingNoShowsQuarter > 3
          ? `${formatDate("2026-04-05")}: ${employee.attendance.meetingNoShowsQuarter} meeting no-shows this quarter.`
          : "",
        employee.attendance.deadlineMissesQuarter > 5
          ? `${formatDate("2026-04-09")}: ${employee.attendance.deadlineMissesQuarter} deadline misses this quarter.`
          : "",
      ].filter(Boolean);
      const triggerCount = evidence.length;
      if (!triggerCount) return null;
      const severity = severityFromTriggers(triggerCount, employee);
      return {
        employee_id: employee.id,
        employee_name: employee.name,
        department: employee.department,
        warning_severity: severity,
        specific_evidence: evidence,
        recommended_action_plan: warningActionPlan(employee, evidence),
        timeline_for_improvement_review: improvementTimeline(severity),
        auto_generated_warning_letter_draft: warningLetter(employee, severity, evidence),
        escalation_path_if_no_improvement:
          severity === "TERMINATION RISK"
            ? "Escalate to HR Director and Legal for termination review."
            : severity === "FINAL WARNING"
              ? "Escalate to HRBP and department head for final PIP review."
              : "Escalate to HRBP for formal PIP if progress is not visible by the review date.",
      };
    })
    .filter(Boolean)
    .sort((left, right) => {
      const order = { "TERMINATION RISK": 4, "FINAL WARNING": 3, WRITTEN: 2, VERBAL: 1 };
      return order[(right as any).warning_severity] - order[(left as any).warning_severity];
    });

  const summary = flagged.length
    ? `${(flagged[0] as any).employee_name} is the most urgent disciplinary case at ${(flagged[0] as any).warning_severity}, and ${flagged.length - 1} additional employees need documented warning actions. The strongest pattern across flagged employees is a mix of attendance slippage, KPI decline, and missed commitments.`
    : "No employees currently meet the warning threshold, and no new disciplinary actions are recommended this cycle.";

  return {
    task: "warning_disciplinary_action",
    generatedAt: isoDate(),
    confidence: round(clamp(dataCompletenessScore(dataset), 83, 95)),
    summary,
    structuredJson: {
      flagged_employees: flagged,
      total_flagged: flagged.length,
    },
  };
}

function resignationRiskScore(employee: EmployeeProfile) {
  const factors = [
    { label: "Job portal activity", value: employee.exitIndicators.linkedinUpdated || employee.exitIndicators.naukriVisitsDetected ? 18 : 3 },
    { label: "Salary stagnation", value: employee.salaryHistory.stagnationMonths > 18 ? 15 : employee.salaryHistory.stagnationMonths > 12 ? 8 : 3 },
    { label: "Recognition gap", value: employee.salaryHistory.rewardGap ? 12 : 4 },
    { label: "Leave pattern shift", value: employee.leave.sickLeaveSpike ? 8 : 2 },
    { label: "Engagement drop", value: clamp(Math.max(0, -employee.behavior.engagementDelta) * 0.6 + Math.max(0, 75 - employee.behavior.engagementScore) * 0.25, 0, 16) },
    { label: "Manager conflict", value: employee.behavior.complaintsAgainstManager > 0 || employee.behavior.skipLevelRequests > 0 ? 12 : 3 },
    { label: "Peer comparison", value: employee.exitIndicators.colleaguePromotedWhileNot ? 8 : 2 },
    { label: "Workload imbalance", value: employee.exitIndicators.overtimeWithoutComp || employee.attendance.overtimeHoursMonthly > 16 ? 10 : 3 },
    { label: "Tenure milestone", value: monthsBetween(employee.joiningDate) >= 18 && monthsBetween(employee.joiningDate) <= 30 ? 6 : 2 },
    { label: "Negative sentiment", value: clamp(employee.behavior.negativeSentimentKeywords * 1.4, 0, 14) },
  ];
  const probability = round(clamp(factors.reduce((sum, factor) => sum + factor.value, 5), 5, 95));
  return { probability, factors };
}

function retentionActions(employee: EmployeeProfile, reasons: string[]) {
  return unique(
    reasons.map((reason) => {
      if (reason.includes("Salary") || reason.includes("Recognition")) return "Review compensation or spot bonus and clarify progression path.";
      if (reason.includes("Workload")) return "Rebalance workload and remove unpaid overtime from the next cycle.";
      if (reason.includes("Manager")) return "Arrange HRBP-led stay interview and skip-level mediation.";
      if (reason.includes("Engagement")) return "Provide targeted recognition and project variety within two weeks.";
      if (reason.includes("Job portal")) return "Move quickly with a retention conversation before external interviewing advances.";
      return "Run a manager stay interview and agree on a 30-day retention plan.";
    }),
  ).slice(0, 3);
}

function resignationAnalysis(dataset: HrDataset): HrBrainResponse {
  const analyzed = dataset.employees
    .filter((employee) => employee.status === "active")
    .map((employee) => {
      const { probability, factors } = resignationRiskScore(employee);
      const topReasons = factors
        .sort((left, right) => right.value - left.value)
        .slice(0, 3)
        .map((factor) => factor.label);
      const riskLevel =
        probability >= 75 ? "CRITICAL" : probability >= 55 ? "HIGH" : probability >= 35 ? "MEDIUM" : "LOW";
      const costMultiplier =
        employee.department === "Engineering" || employee.department === "IT"
          ? 0.65
          : employee.department === "Product"
            ? 0.58
            : 0.45;
      const costOfLosingEmployee = Math.round(employee.salaryHistory.current * costMultiplier);
      const urgencyDays = riskLevel === "CRITICAL" ? 5 : riskLevel === "HIGH" ? 14 : riskLevel === "MEDIUM" ? 30 : 45;
      return {
        employee_id: employee.id,
        employee_name: employee.name,
        department: employee.department,
        resignation_probability: probability,
        risk_level: riskLevel,
        top_3_reasons_driving_resignation_risk: topReasons,
        recommended_retention_actions: retentionActions(employee, topReasons),
        cost_of_losing_this_employee: {
          estimate: costOfLosingEmployee,
          display: formatInr(costOfLosingEmployee),
        },
        urgency: `Act within ${urgencyDays} days`,
        retention_script_suggestion: `Open with recognition of ${employee.name}'s impact, ask what has changed recently, and offer one concrete action tied to ${topReasons[0].toLowerCase()} before the conversation ends.`,
      };
    })
    .filter((employee) => employee.resignation_probability >= 35)
    .sort((left, right) => right.resignation_probability - left.resignation_probability);

  const summary = analyzed.length
    ? `${analyzed[0].employee_name} is the highest resignation risk at ${analyzed[0].resignation_probability}%, driven mainly by ${analyzed[0].top_3_reasons_driving_resignation_risk.join(", ").toLowerCase()}. ${analyzed.filter((employee) => employee.risk_level === "CRITICAL").length} employees are in the critical zone and should get manager outreach immediately.`
    : "No active employees currently cross the monitored resignation-risk threshold.";

  return {
    task: "employee_resignation_risk",
    generatedAt: isoDate(),
    confidence: round(clamp(dataCompletenessScore(dataset), 84, 95)),
    summary,
    structuredJson: {
      at_risk_employees: analyzed,
      critical_attrition_risks: analyzed.filter((employee) => employee.risk_level === "CRITICAL"),
    },
  };
}

function employeeSkillScore(employee: EmployeeProfile, requiredSkills: string[]) {
  return skillOverlap(requiredSkills, employee.skills.current);
}

function collaborationScore(team: EmployeeProfile[]) {
  if (team.length <= 1) return 86;
  const scores: number[] = [];
  for (let i = 0; i < team.length; i += 1) {
    for (let j = i + 1; j < team.length; j += 1) {
      const left = team[i];
      const right = team[j];
      let score = 76;
      if (left.preferredCollaborators.includes(right.name) || right.preferredCollaborators.includes(left.name)) score += 10;
      if (left.conflictsWith.includes(right.name) || right.conflictsWith.includes(left.name)) score -= 35;
      if (left.availability.timezone === right.availability.timezone) score += 4;
      scores.push(clamp(score, 25, 96));
    }
  }
  return round(avg(scores));
}

function roleAssignment(employee: EmployeeProfile, selected: EmployeeProfile[]) {
  const skillSet = employee.skills.current.map(normalize);
  if (selected[0]?.name === employee.name) return "Team Lead";
  if (skillSet.some((skill) => skill.includes("design"))) return "Design Lead";
  if (skillSet.some((skill) => skill.includes("qa") || skill.includes("testing"))) return "Quality Lead";
  if (skillSet.some((skill) => skill.includes("analytics") || skill.includes("sql"))) return "Analytics Lead";
  if (skillSet.some((skill) => skill.includes("node") || skill.includes("architecture") || skill.includes("cloud"))) return "Platform Lead";
  return "Implementation Lead";
}

function teamFormation(dataset: HrDataset, message: string): HrBrainResponse {
  const requiredSkills = extractSkills(message, ["Required skills", "Skills needed", "Skills"]);
  const projectName = extractProjectName(message);
  const timeline = extractTimeline(message);
  const teamSize = extractTeamSize(message, 5);
  const chosenSkills = requiredSkills.length
    ? requiredSkills
    : ["React", "Node.js", "Design Systems", "QA Automation", "Analytics"];

  const pool = dataset.employees.filter((employee) => employee.status === "active" && employee.availability.bandwidthPercent <= 85);
  const lead = [...pool].sort((left, right) => {
    const leftScore = left.leadership.initiativeScore + left.leadership.crossTeamCollaboration + left.traits.leadership;
    const rightScore = right.leadership.initiativeScore + right.leadership.crossTeamCollaboration + right.traits.leadership;
    return rightScore - leftScore;
  })[0];

  const selected: EmployeeProfile[] = lead ? [lead] : [];
  while (selected.length < Math.min(teamSize, pool.length)) {
    const remaining = pool.filter((employee) => !selected.some((member) => member.id === employee.id));
    const scored = remaining
      .map((employee) => {
        const uncovered = chosenSkills.filter(
          (skill) => !selected.some((member) => employeeSkillScore(member, [skill]) >= 80),
        );
        const coverageScore = employeeSkillScore(employee, uncovered.length ? uncovered : chosenSkills);
        const availabilityScore = clamp(100 - employee.availability.bandwidthPercent);
        const collaborationBoost = collaborationScore([...selected, employee]);
        const conflictPenalty = selected.some(
          (member) => member.conflictsWith.includes(employee.name) || employee.conflictsWith.includes(member.name),
        )
          ? 30
          : 0;
        const projectFit =
          employee.performance.similarProjectScore * 0.3 +
          employee.traits.execution * 0.2 +
          employee.traits.collaboration * 0.2 +
          employee.traits.adaptability * 0.15 +
          availabilityScore * 0.15;
        return {
          employee,
          total: coverageScore * 0.4 + projectFit * 0.4 + collaborationBoost * 0.2 - conflictPenalty,
        };
      })
      .sort((left, right) => right.total - left.total);
    if (!scored[0]) break;
    selected.push(scored[0].employee);
  }

  const coverage = round(
    avg(
      chosenSkills.map((skill) =>
        clamp(
          Math.max(...selected.map((employee) => employeeSkillScore(employee, [skill])), 0),
          0,
          100,
        ),
      ),
    ),
  );
  const personalityBalance = round(
    clamp(
      unique(selected.map((employee) => archetypeFromTraits(employee.traits))).length * 23 +
        avg(selected.map((employee) => employee.traits.collaboration)) * 0.1,
      0,
      100,
    ),
  );
  const teamStrengthScore = round(
    coverage * 0.42 +
      collaborationScore(selected) * 0.26 +
      personalityBalance * 0.16 +
      avg(selected.map((employee) => clamp(100 - employee.availability.bandwidthPercent))) * 0.16,
  );
  const successProbability = round(
    teamStrengthScore * 0.58 + avg(selected.map((employee) => employee.performance.similarProjectScore)) * 0.42,
  );
  const backups = pool
    .filter((employee) => !selected.some((member) => member.id === employee.id))
    .sort(
      (left, right) =>
        employeeSkillScore(right, chosenSkills) + right.performance.similarProjectScore -
        (employeeSkillScore(left, chosenSkills) + left.performance.similarProjectScore),
    )
    .slice(0, 3)
    .map((employee) => ({
      employee_name: employee.name,
      designation: employee.designation,
      backup_value: `${Math.round(employeeSkillScore(employee, chosenSkills))}% skill coverage`,
    }));

  const risks = unique(
    [
      coverage < 85 ? "Skill coverage still depends on one or two specialists." : "",
      selected.some((employee) => employee.availability.bandwidthPercent > 80)
        ? "At least one core team member is near bandwidth saturation."
        : "",
      selected.some((employee) => employee.workModeHistory.teamNeedsPresence) &&
      selected.some((employee) => employee.currentWorkMode === "remote")
        ? "Delivery cadence could slow if office overlap is not scheduled explicitly."
        : "",
      selected.some((employee) =>
        selected.some(
          (member) => member.id !== employee.id && member.conflictsWith.includes(employee.name),
        ),
      )
        ? "Historical conflict exists inside the suggested group and needs active mitigation."
        : "",
    ].filter(Boolean),
  );

  const summary = selected.length
    ? `${selected[0].name} is the strongest lead for ${projectName}, and the recommended ${selected.length}-person team reaches ${coverage}% skill coverage with an ${successProbability}% estimated success probability. The main execution watchout is ${risks[0] ? risks[0].toLowerCase() : "maintaining bandwidth discipline across the full timeline"}.`
    : `No available team could be formed for ${projectName} with the current staffing constraints.`;

  return {
    task: "optimal_team_formation",
    generatedAt: isoDate(),
    confidence: round(clamp(dataCompletenessScore(dataset) - 1, 80, 93)),
    summary,
    structuredJson: {
      project: projectName,
      duration: timeline,
      required_skills: chosenSkills,
      recommended_team: selected.map((employee) => ({
        employee_id: employee.id,
        employee_name: employee.name,
        designation: employee.designation,
        department: employee.department,
        assigned_role: roleAssignment(employee, selected),
        archetype: archetypeFromTraits(employee.traits),
        bandwidth_available_percent: clamp(100 - employee.availability.bandwidthPercent),
      })),
      team_strength_score: teamStrengthScore,
      potential_team_risks: risks,
      mitigation_suggestions: risks.map((risk) =>
        risk.includes("bandwidth")
          ? "Protect focus blocks and remove non-project meetings from the critical path."
          : risk.includes("office overlap")
            ? "Set Tuesday-Thursday overlap for design, QA, and delivery reviews."
            : risk.includes("conflict")
              ? "Assign a neutral delivery owner and define decision rules up front."
              : "Add a backup owner for the riskiest skill area.",
      ),
      backup_members: backups,
      estimated_project_success_probability: successProbability,
      team_lead_recommendation: selected[0]
        ? {
            employee_name: selected[0].name,
            justification: `${selected[0].name} combines the highest leadership signal with strong cross-team collaboration and relevant project experience.`,
          }
        : null,
    },
  };
}

function workModeRecommendationForEmployee(employee: EmployeeProfile) {
  const remoteGain = employee.workModeHistory.productivityRemote - employee.workModeHistory.productivityOffice;
  const needsOffice =
    employee.roleType !== "independent" ||
    employee.workModeHistory.teamNeedsPresence ||
    employee.workModeHistory.meetingLoadPerDay > 5 ||
    employee.workModeHistory.clientMeetingsMonthly > 8 ||
    employee.workModeHistory.managerPreference === "office";
  const remoteFriendly =
    remoteGain >= 4 &&
    employee.workModeHistory.homeSetupScore >= 80 &&
    employee.workModeHistory.isolationRisk < 60 &&
    employee.roleType === "independent";

  let recommendedMode: string;
  let officeRequirementDays: string;
  if (remoteFriendly) {
    recommendedMode = "FULL REMOTE";
    officeRequirementDays = "One anchor day every second Wednesday";
  } else if (needsOffice && employee.workModeHistory.productivityOffice >= employee.workModeHistory.productivityRemote) {
    recommendedMode =
      employee.workModeHistory.clientMeetingsMonthly > 10 || employee.roleType === "client_facing"
        ? "FULL OFFICE"
        : "HYBRID (3 days/week)";
    officeRequirementDays = recommendedMode === "FULL OFFICE" ? "Monday-Friday" : "Tuesday-Thursday mandatory";
  } else {
    recommendedMode = "HYBRID (2 days/week)";
    officeRequirementDays = "Tuesday and Thursday mandatory";
  }

  const targetProductivity =
    recommendedMode === "FULL REMOTE"
      ? employee.workModeHistory.productivityRemote
      : recommendedMode === "FULL OFFICE"
        ? employee.workModeHistory.productivityOffice
        : round((employee.workModeHistory.productivityRemote + employee.workModeHistory.productivityOffice) / 2);
  const currentProductivity =
    employee.currentWorkMode === "remote"
      ? employee.workModeHistory.productivityRemote
      : employee.currentWorkMode === "office"
        ? employee.workModeHistory.productivityOffice
        : round((employee.workModeHistory.productivityRemote + employee.workModeHistory.productivityOffice) / 2);
  const impact = round(targetProductivity - currentProductivity);
  const savings = recommendedMode.includes("REMOTE")
    ? Math.round(employee.workModeHistory.commuteDistanceKm * 22 * 18)
    : recommendedMode.includes("HYBRID")
      ? Math.round(employee.workModeHistory.commuteDistanceKm * 8 * 18)
      : 0;
  const supportNeeded =
    recommendedMode.includes("REMOTE") || recommendedMode.includes("HYBRID")
      ? employee.workModeHistory.homeSetupScore < 80
        ? ["External monitor", "Internet stipend", "Ergonomic chair support"]
        : ["Quarterly internet stipend"]
      : ["Meeting-room prioritization for collaboration blocks"];
  return {
    employee_id: employee.id,
    employee_name: employee.name,
    department: employee.department,
    current_mode: employee.currentWorkMode,
    recommended_mode: recommendedMode,
    productivity_impact_prediction: `${impact >= 0 ? "+" : ""}${impact}%`,
    cost_savings_estimate: {
      monthly: savings,
      display: formatInr(savings),
    },
    office_attendance_requirement_days: officeRequirementDays,
    equipment_support_needed: supportNeeded,
    review_date: addWeeks(isoDate(), 8),
  };
}

function workModeAnalysis(dataset: HrDataset): HrBrainResponse {
  const recommendations = dataset.employees
    .filter((employee) => employee.status === "active")
    .map(workModeRecommendationForEmployee)
    .sort((left, right) => Number(right.productivity_impact_prediction.replace("%", "")) - Number(left.productivity_impact_prediction.replace("%", "")));

  const summary = recommendations.length
    ? `${recommendations[0].employee_name} shows the strongest work-mode upside at ${recommendations[0].productivity_impact_prediction} expected productivity impact under ${recommendations[0].recommended_mode}. Across the full active workforce, the biggest pattern is that independent analytics and engineering work trends remote, while client-heavy roles still perform best with office overlap.`
    : "No active employees were available for work-mode review.";

  return {
    task: "remote_vs_office_recommendation",
    generatedAt: isoDate(),
    confidence: round(clamp(dataCompletenessScore(dataset) - 1, 82, 94)),
    summary,
    structuredJson: {
      employee_recommendations: recommendations,
    },
  };
}

function capabilityOverview(dataset: HrDataset): HrBrainResponse {
  return {
    task: "capability_overview",
    generatedAt: isoDate(),
    confidence: 94,
    summary:
      "The HR intelligence brain is ready to run hiring, promotion, warning, attrition, team formation, work-mode, and full-report analysis using the seeded workforce and candidate dataset. Use one of the suggested prompts to get structured JSON plus a plain-language recommendation.",
    structuredJson: {
      supported_tasks: [
        "Hiring Recommendation",
        "Promotion Analysis",
        "Warning & Disciplinary Action Recommendation",
        "Employee Resignation Risk Prediction",
        "Optimal Team Formation",
        "Remote vs Office Work Mode Recommendation",
        "Complete HR Intelligence Report",
      ],
      dataset_coverage: {
        employees: dataset.employees.length,
        active_employees: dataset.employees.filter((employee) => employee.status === "active").length,
        candidates: dataset.candidates.length,
        open_positions: dataset.openPositions.length,
      },
      response_contract: {
        always_returns: ["structured JSON", "human-readable summary", "confidence score", "actionable recommendations"],
      },
    },
  };
}

function departmentHeadcount(dataset: HrDataset) {
  return Object.entries(
    dataset.employees.reduce<Record<string, number>>((accumulator, employee) => {
      accumulator[employee.department] = (accumulator[employee.department] || 0) + 1;
      return accumulator;
    }, {}),
  )
    .map(([department, headcount]) => ({ department, headcount }))
    .sort((left, right) => right.headcount - left.headcount);
}

function workModeBreakdown(dataset: HrDataset) {
  return Object.entries(
    dataset.employees.reduce<Record<string, number>>((accumulator, employee) => {
      accumulator[employee.currentWorkMode] = (accumulator[employee.currentWorkMode] || 0) + 1;
      return accumulator;
    }, {}),
  ).map(([mode, count]) => ({ mode, count }));
}

function newJoinersThisMonth(dataset: HrDataset) {
  return dataset.employees.filter((employee) => employee.joiningDate.startsWith("2026-04"));
}

function resignationsThisMonth(rawDb?: Record<string, any>) {
  const cases = Array.isArray(rawDb?.exit?.cases) ? rawDb.exit.cases : [];
  return cases.filter((item: Record<string, any>) => String(item.last_day || "").startsWith("2026-04"));
}

function departmentHealth(dataset: HrDataset) {
  const departments = unique(dataset.employees.map((employee) => employee.department));
  return departments.map((department) => {
    const employees = dataset.employees.filter((employee) => employee.department === department);
    const score = round(
      avg(employees.map((employee) => employee.behavior.engagementScore)) * 0.34 +
        avg(employees.map((employee) => avg(employee.performance.kpiLast6Months))) * 0.36 +
        avg(employees.map((employee) => employee.performance.outputVsTeamPercent)) * 0.2 +
        avg(employees.map((employee) => clamp(100 - employee.behavior.complaintsQuarter * 14))) * 0.1,
    );
    return { department, team_health_score: score };
  });
}

function collaborationMap(dataset: HrDataset) {
  const map: Array<{ pair: string; strength: number }> = [];
  const employees = dataset.employees.filter((employee) => employee.status === "active");
  for (let i = 0; i < employees.length; i += 1) {
    for (let j = i + 1; j < employees.length; j += 1) {
      const left = employees[i];
      const right = employees[j];
      let strength = 72;
      if (left.preferredCollaborators.includes(right.name) || right.preferredCollaborators.includes(left.name)) strength += 16;
      if (left.conflictsWith.includes(right.name) || right.conflictsWith.includes(left.name)) strength -= 30;
      if (left.department === right.department) strength += 4;
      map.push({ pair: `${left.name} x ${right.name}`, strength: clamp(strength, 20, 96) });
    }
  }
  return map.sort((left, right) => right.strength - left.strength).slice(0, 10);
}

function fullReport(dataset: HrDataset, rawDb?: Record<string, any>): HrBrainResponse {
  const hiring = dataset.openPositions.map((position) =>
    hiringRecommendation(
      dataset,
      `Job role: ${position.title}\nDepartment: ${position.department}\nRequired skills: ${position.requiredSkills.join(", ")}\nBudget range: ${position.salaryRange[0]}-${position.salaryRange[1]}`,
    ).structuredJson,
  );
  const promotions = dataset.employees
    .filter((employee) => employee.status === "active")
    .map((employee) => ({
      employee_name: employee.name,
      department: employee.department,
      ...promotionScores(employee),
      promotionStagnationMonths: employee.salaryHistory.promotionStagnationMonths,
    }));
  const readyForPromotion = promotions
    .filter((item) => item.promotionReadinessScore > 80)
    .sort((left, right) => right.promotionReadinessScore - left.promotionReadinessScore);
  const overduePromotion = dataset.employees
    .filter((employee) => employee.status === "active" && employee.salaryHistory.promotionStagnationMonths > 18)
    .map((employee) => ({
      employee_name: employee.name,
      department: employee.department,
      tenure_months_without_change: employee.salaryHistory.promotionStagnationMonths,
    }));
  const warnings = warningAnalysis(dataset).structuredJson.flagged_employees as Array<Record<string, any>>;
  const attrition = resignationAnalysis(dataset).structuredJson.at_risk_employees as Array<Record<string, any>>;
  const workMode = workModeAnalysis(dataset).structuredJson.employee_recommendations as Array<Record<string, any>>;
  const criticalAttrition = attrition.filter((employee) => employee.risk_level === "CRITICAL");
  const exits = resignationsThisMonth(rawDb);
  const topHiring = hiring.map((report) => ({
    position: (report as Record<string, any>).job_context.role,
    priority: dataset.openPositions.find((item) => item.title === (report as Record<string, any>).job_context.role)?.priority || "high",
    top_candidate: (report as Record<string, any>).top_3_candidates[0] || null,
  }));

  const executiveSummary = [
    `Headcount is ${dataset.employees.length} with ${dataset.employees.filter((employee) => employee.status === "active").length} active employees as of ${formatDate(isoDate())}.`,
    `${criticalAttrition.length} employees are in the critical attrition band, led by ${criticalAttrition[0]?.employee_name || "no one"}.`,
    `${readyForPromotion.length} employees are promotion-ready above the 80-point threshold this cycle.`,
    `${warnings.length} employees require warning or PIP action, with ${warnings[0]?.employee_name || "no current escalations"} the most urgent case.`,
    `${topHiring[0]?.top_candidate?.candidate_name || "No candidate"} is the strongest immediate hiring recommendation for the highest-priority open role.`,
  ];

  const priorityActionList = [
    `Meet ${criticalAttrition[0]?.employee_name || "the highest-risk employee"} within 5 days to address attrition drivers.`,
    `Finalize promotion case for ${readyForPromotion[0]?.employee_name || "the top promotion candidate"} this quarter.`,
    `Close the warning review loop for ${warnings[0]?.employee_name || "flagged employees"} with documented milestones.`,
    `Advance offer decision on ${topHiring[0]?.top_candidate?.candidate_name || "the top-ranked candidate"} for ${topHiring[0]?.position || "the priority role"}.`,
    "Rebalance office presence for client-heavy and collaboration-heavy teams before the next scheduling cycle.",
  ];

  const detailedReport = {
    section_1_workforce_overview: {
      total_headcount_by_department: departmentHeadcount(dataset),
      total_headcount_by_location: Object.entries(
        dataset.employees.reduce<Record<string, number>>((accumulator, employee) => {
          accumulator[employee.location] = (accumulator[employee.location] || 0) + 1;
          return accumulator;
        }, {}),
      ).map(([location, count]) => ({ location, count })),
      total_headcount_by_work_mode: workModeBreakdown(dataset),
      active_on_leave_remote_in_office_count: {
        active: dataset.employees.filter((employee) => employee.status === "active").length,
        on_leave: dataset.employees.filter((employee) => employee.status === "on_leave").length,
        remote: dataset.employees.filter((employee) => employee.currentWorkMode === "remote").length,
        in_office: dataset.employees.filter((employee) => employee.currentWorkMode === "office").length,
      },
      new_joiners_this_month: newJoinersThisMonth(dataset).map((employee) => ({
        employee_name: employee.name,
        joining_date: employee.joiningDate,
      })),
      resignations_this_month: exits,
    },
    section_2_hiring_queue: {
      open_positions_and_priority_ranking: dataset.openPositions
        .sort((left, right) => ({ critical: 3, high: 2, medium: 1 }[right.priority] - { critical: 3, high: 2, medium: 1 }[left.priority]))
        .map((position) => ({
          title: position.title,
          department: position.department,
          priority: position.priority,
        })),
      top_recommended_candidates_per_position: topHiring,
      hiring_funnel_health_score: round(avg(topHiring.map((item) => item.top_candidate?.overall_hire_recommendation_score || 60))),
    },
    section_3_promotion_alerts: {
      employees_ready_for_promotion: readyForPromotion,
      employees_overdue_for_promotion: overduePromotion,
      recommended_promotion_actions_this_quarter: readyForPromotion.slice(0, 3).map((item) => ({
        employee_name: item.employee_name,
        action: "Prepare promotion review pack and compensation recommendation.",
      })),
    },
    section_4_warning_and_pip: {
      employees_currently_on_pip: dataset.employees
        .filter((employee) => employee.pipStatus.active)
        .map((employee) => ({
          employee_name: employee.name,
          stage: employee.pipStatus.stage,
          start_date: employee.pipStatus.startDate,
        })),
      new_employees_flagged_for_warning_this_week: warnings,
      termination_risk_employees_list: warnings.filter((employee) => employee.warning_severity === "TERMINATION RISK"),
    },
    section_5_attrition_risks: {
      critical_attrition_risks: criticalAttrition,
      estimated_cost_of_potential_exits: {
        total: attrition.reduce((sum, item) => sum + item.cost_of_losing_this_employee.estimate, 0),
        display: formatInr(attrition.reduce((sum, item) => sum + item.cost_of_losing_this_employee.estimate, 0)),
      },
      retention_actions_recommended: criticalAttrition.map((employee) => ({
        employee_name: employee.employee_name,
        actions: employee.recommended_retention_actions,
      })),
    },
    section_6_team_health: {
      department_wise_team_health_score: departmentHealth(dataset),
      conflict_zones_detected: dataset.employees
        .filter((employee) => employee.conflictsWith.length)
        .map((employee) => ({
          employee_name: employee.name,
          conflicts_with: employee.conflictsWith,
        })),
      collaboration_strength_map: collaborationMap(dataset),
    },
    section_7_work_mode_optimization: {
      employees_recommended_to_shift_to_remote_or_office: workMode.filter(
        (employee) => String(employee.current_mode).toUpperCase() !== String(employee.recommended_mode).toUpperCase(),
      ),
      productivity_by_work_mode_summary: workModeBreakdown(dataset).map((item) => ({
        mode: item.mode,
        count: item.count,
        avg_productivity: round(
          avg(
            dataset.employees
              .filter((employee) => employee.currentWorkMode === item.mode)
              .map((employee) =>
                employee.currentWorkMode === "remote"
                  ? employee.workModeHistory.productivityRemote
                  : employee.currentWorkMode === "office"
                    ? employee.workModeHistory.productivityOffice
                    : (employee.workModeHistory.productivityRemote + employee.workModeHistory.productivityOffice) / 2,
              ),
          ),
        ),
      })),
      office_occupancy_forecast: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day, index) => ({
        day,
        predicted_occupancy: [52, 74, 79, 72, 46][index],
      })),
    },
    section_8_ai_alerts_for_today: {
      top_5_urgent_actions_hr_must_take_today: priorityActionList,
      employees_to_call_or_meet_immediately: unique([
        criticalAttrition[0]?.employee_name,
        warnings[0]?.employee_name,
        readyForPromotion[0]?.employee_name,
      ]).filter(Boolean),
      policy_compliance_alerts: warnings
        .filter((employee) =>
          employee.specific_evidence.some((detail: string) => detail.toLowerCase().includes("unauthorized access") || detail.toLowerCase().includes("absence")),
        )
        .map((employee) => ({
          employee_name: employee.employee_name,
          alert: "Immediate policy review required",
        })),
    },
  };

  const visualReadyData = {
    headcount_by_department: departmentHeadcount(dataset),
    work_mode_distribution: workModeBreakdown(dataset),
    promotion_readiness: readyForPromotion.slice(0, 6).map((employee) => ({
      employee_name: employee.employee_name,
      score: employee.promotionReadinessScore,
    })),
    attrition_risk_distribution: attrition.map((employee) => ({
      employee_name: employee.employee_name,
      risk_level: employee.risk_level,
      probability: employee.resignation_probability,
    })),
    office_occupancy_forecast: detailedReport.section_7_work_mode_optimization.office_occupancy_forecast,
    department_health_scores: departmentHealth(dataset),
  };

  return {
    task: "complete_hr_intelligence_report",
    generatedAt: isoDate(),
    confidence: round(clamp(dataCompletenessScore(dataset), 86, 96)),
    summary: `${executiveSummary[0]} ${executiveSummary[1]} ${executiveSummary[2]}`,
    structuredJson: {
      executive_summary: executiveSummary,
      priority_action_list: priorityActionList,
      full_detailed_json_report: detailedReport,
      visual_ready_data_for_dashboard_charts: visualReadyData,
    },
  };
}

export function buildHrSupportReply(message: string, rawDb?: Record<string, any>) {
  const query = normalize(message);
  const currentUser =
    rawDb?.users?.find((user: Record<string, any>) => normalize(user.email) === normalize(rawDb?.currentEmail || rawDb?.email || "")) ||
    rawDb?.users?.[0];
  if (query.includes("leave")) {
    return "You have a healthy leave approval history in this demo workspace. If you need a balance check, open the Attendance or HR module for the detailed breakdown.";
  }
  if (query.includes("salary") || query.includes("payslip")) {
    return currentUser
      ? `Your latest payroll records are available for ${currentUser.name}. Open Payroll to review the current payslip and deductions.`
      : "Payroll data is available in the Payroll module, where you can review the latest payslip and deductions.";
  }
  if (query.includes("policy") || query.includes("holiday")) {
    return "Policy and holiday queries are handled in the Documents, Compliance, and Culture modules. The remote-work policy currently allows up to three manager-approved remote days per week.";
  }
  if (query.includes("complaint")) {
    return "You can log a complaint from the Engagement module, where it will be tracked with priority, status, and HR follow-up.";
  }
  return "I can help with policy queries, salary information, leave guidance, or routing you to the right HR module. Ask a specific question and I will point you to the right answer.";
}

export function runHrIntelligence(message: string, rawDb?: Record<string, any>): HrBrainResponse {
  const dataset = buildDataset(rawDb);
  const task = inferTask(message);
  if (task === "hiring_recommendation") return hiringRecommendation(dataset, message);
  if (task === "promotion_analysis") return promotionAnalysis(dataset, message);
  if (task === "warning_disciplinary_action") return warningAnalysis(dataset);
  if (task === "employee_resignation_risk") return resignationAnalysis(dataset);
  if (task === "optimal_team_formation") return teamFormation(dataset, message);
  if (task === "remote_vs_office_recommendation") return workModeAnalysis(dataset);
  if (task === "complete_hr_intelligence_report") return fullReport(dataset, rawDb);
  return capabilityOverview(dataset);
}

export function getHrBrainPromptSuggestions() {
  return [
    "Run complete HR intelligence report for today's date",
    "Hiring recommendation for Senior Frontend Engineer\nDepartment: Engineering\nRequired skills: React, TypeScript, Testing, Design Systems\nBudget range: 16-22 LPA",
    "Promotion analysis\nDepartment: Engineering",
    "Warning and disciplinary action recommendation",
    "Predict who is likely to resign in the next 90 days",
    "Project: Atlas\nDuration: 12 weeks\nRequired skills: React, Node.js, Design Systems, QA Automation, Analytics\nTeam size needed: 5",
    "Recommend optimal work mode for all employees",
  ];
}
