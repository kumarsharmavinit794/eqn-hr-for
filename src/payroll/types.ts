export type CountryCode =
  | "IN"
  | "US"
  | "UK"
  | "DE"
  | "AE"
  | "SG"
  | "CA"
  | "AU";

export type CurrencyCode =
  | "INR"
  | "USD"
  | "GBP"
  | "EUR"
  | "AED"
  | "SGD"
  | "CAD"
  | "AUD";

export type CryptoCurrency = "BTC" | "ETH" | "USDT";

export type PayFrequency =
  | "Monthly"
  | "Semi-Monthly"
  | "Bi-Weekly"
  | "Weekly";

export type EmploymentType =
  | "Full-Time"
  | "Part-Time"
  | "Contractor"
  | "Freelancer";

export type RoleType = "Admin" | "HR" | "Manager" | "Employee";

export type EmployeeStatus =
  | "Active"
  | "On Leave"
  | "Probation"
  | "Offboarding"
  | "Terminated";

export type ComplianceBadge =
  | "compliant"
  | "warning"
  | "violation"
  | "critical";

export type LeaveStatus = "Pending" | "Approved" | "Rejected";

export type ExpenseStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Reimbursed";

export type ComplianceSeverity = "low" | "medium" | "high" | "critical";

export type CandidateStage =
  | "Applied"
  | "Screening"
  | "Interview"
  | "Offer"
  | "Hired"
  | "Rejected";

export type ReviewStatus = "Draft" | "Submitted" | "Acknowledged";

export type AIInsightType =
  | "turnover-risk"
  | "payroll-anomaly"
  | "salary-benchmark"
  | "burnout"
  | "projection";

export type RecognitionBadge =
  | "Star"
  | "Innovator"
  | "Leader"
  | "Team Player";

export type TicketStatus = "Open" | "In Progress" | "Resolved";

export type TicketPriority = "Low" | "Medium" | "High" | "Critical";

export type WorkflowAction =
  | "Submit"
  | "Review"
  | "Approve"
  | "Acknowledge"
  | "Archive"
  | "Notify";

export type EquityGrantType = "ESOP" | "RSU" | "Phantom";

export type DocumentCategory =
  | "Offer Letter"
  | "Contract"
  | "ID Proof"
  | "Tax Doc"
  | "Payslip"
  | "Other";

export type CurrencyPreference = "local" | "base";

export type FilingStatus = "Pending" | "Ready" | "Submitted" | "At Risk";

export interface TaxSlab {
  label: string;
  upToMinorUnits: number | null;
  rate: number;
}

export interface SocialContributionRule {
  label: string;
  employeeRate: number;
  employerRate: number;
  capMinorUnits?: number;
  thresholdMinorUnits?: number;
}

export interface MandatoryDeductionRule {
  label: string;
  calculation: "rate" | "fixed";
  employeeRate?: number;
  employerRate?: number;
  fixedEmployeeMinorUnits?: number;
  fixedEmployerMinorUnits?: number;
  capMinorUnits?: number;
}

export interface LeavePolicyRule {
  label: string;
  minimumDays: number;
  carryForwardLimit: number;
  paid: boolean;
  color: string;
}

export interface PublicHoliday {
  date: string;
  name: string;
}

export interface BankDetails {
  accountName: string;
  bankName: string;
  accountNumber: string;
  iban?: string;
  routingNumber?: string;
  ifsc?: string;
  sortCode?: string;
  payInCrypto?: boolean;
  cryptoCurrency?: CryptoCurrency;
  walletAddress?: string;
}

export interface Employee {
  id: string;
  companyId: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  country: CountryCode;
  currency: CurrencyCode;
  locale: string;
  payFrequency: PayFrequency;
  employmentType: EmploymentType;
  taxId: string;
  joinDate: string;
  status: EmployeeStatus;
  salary: number;
  bankDetails: BankDetails;
  complianceBadge: ComplianceBadge;
  riskScore: number;
  skills: string[];
  managerID: string | null;
  avatar: string;
  weeklyHours: number;
  standardHoursPerWeek: number;
  noticePeriodDays: number;
  probationEndsOn: string;
  leaveTakenYtd: number;
  overtimeHoursYtd: number;
  travelMilesYtd: number;
  sustainabilityMode: "Office" | "Hybrid" | "Remote";
}

export interface CountryConfig {
  code: CountryCode;
  name: string;
  flag: string;
  currency: CurrencyCode;
  currencySymbol: string;
  locale: string;
  taxSlabs: TaxSlab[];
  taxFreeAllowanceMinorUnits: number;
  payrollStrategy: "standard" | "contractor-friendly" | "zero-tax";
  socialSecurity: Record<string, SocialContributionRule>;
  minimumWageAnnualMinorUnits: number;
  maxHoursPerWeek: number;
  overtimeMultiplier: number;
  leavePolicy: Record<string, LeavePolicyRule>;
  noticePeriod: number;
  probationDays: number;
  dataPrivacyLaw: string;
  publicHolidays: PublicHoliday[];
  payFrequencies: PayFrequency[];
  mandatoryDeductions: MandatoryDeductionRule[];
  filingRequirements: string[];
  contractorWithholdingRate: number;
  cryptoPaySupported: boolean;
  workingDaysPerMonth: number;
  marketSalaryBenchmarks: Record<string, number>;
}

export interface PayrollPeriod {
  month: number;
  year: number;
  payFrequency: PayFrequency;
  label: string;
}

export interface PayrollLineItem {
  label: string;
  amount: number;
}

export interface PayrollSocialContributions {
  employer: Record<string, number>;
  employee: Record<string, number>;
}

export interface PayslipData {
  earnings: PayrollLineItem[];
  reimbursements: PayrollLineItem[];
  deductions: PayrollLineItem[];
  employerCosts: PayrollLineItem[];
}

export interface PayrollResult {
  employeeId: string;
  period: PayrollPeriod;
  grossPay: number;
  taxBreakdown: Record<string, number>;
  deductions: Record<string, number>;
  socialContributions: PayrollSocialContributions;
  netPay: number;
  currency: CurrencyCode;
  payslipData: PayslipData;
  countrySpecificFields: Record<string, string | number | boolean | null>;
  expensesReimbursed: number;
  cryptoPayout?: {
    currency: CryptoCurrency;
    amount: number;
    rateUsed: number;
  };
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
  approvedBy: string | null;
}

export interface LeaveBalance {
  employeeId: string;
  balances: Record<
    string,
    {
      entitled: number;
      used: number;
      remaining: number;
      carryForward: number;
    }
  >;
}

export interface LeaveCalendarEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  type: string;
  color: string;
  employeeId: string;
}

export interface Expense {
  id: string;
  employeeId: string;
  category: string;
  amount: number;
  currency: CurrencyCode;
  date: string;
  description: string;
  receipt: string;
  status: ExpenseStatus;
  reimbursedInPayroll: boolean;
}

export interface Document {
  id: string;
  employeeId: string;
  category: DocumentCategory;
  fileName: string;
  uploadedOn: string;
  size: string;
  url: string;
  isVerified: boolean;
  blockchainHash: string;
}

export interface ComplianceAlert {
  id: string;
  employeeId: string;
  type: string;
  severity: ComplianceSeverity;
  message: string;
  triggeredOn: string;
  resolvedOn: string | null;
  isResolved: boolean;
}

export interface AuditLogEntry {
  id: string;
  employeeId: string | null;
  country: CountryCode;
  event: string;
  severity: ComplianceSeverity;
  timestamp: string;
}

export interface FilingChecklistItem {
  id: string;
  country: CountryCode;
  label: string;
  status: FilingStatus;
  dueDate: string;
}

export interface ATSCandidate {
  id: string;
  name: string;
  role: string;
  stage: CandidateStage;
  country: CountryCode;
  appliedOn: string;
  score: number;
  tags: string[];
}

export interface JobPosting {
  id: string;
  role: string;
  country: CountryCode;
  department: string;
  openPositions: number;
}

export interface OKR {
  id: string;
  objective: string;
  keyResults: string[];
  progress: number;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  period: string;
  okrs: OKR[];
  rating: number;
  feedbackText: string;
  status: ReviewStatus;
}

export interface AIInsight {
  id: string;
  type: AIInsightType;
  employeeId?: string;
  severity: ComplianceSeverity;
  message: string;
  recommendation: string;
  confidence: number;
}

export interface WorkflowStep {
  role: RoleType;
  action: WorkflowAction;
  slaHours: number;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  trigger: string;
  steps: WorkflowStep[];
  isActive: boolean;
}

export interface EquityGrant {
  id: string;
  employeeId: string;
  type: EquityGrantType;
  grantDate: string;
  vestingSchedule: string;
  totalUnits: number;
  vestedUnits: number;
  strikePrice: number;
  currentFMV: number;
}

export interface SurveyQuestion {
  id: string;
  prompt: string;
}

export interface SurveyResponse {
  employeeId: string;
  score: number;
  answer: string;
}

export interface PulseSurvey {
  id: string;
  title: string;
  questions: SurveyQuestion[];
  responses: SurveyResponse[];
  eNPSScore: number;
  respondedOn: string;
}

export interface Recognition {
  id: string;
  fromId: string;
  toId: string;
  message: string;
  badge: RecognitionBadge;
  points: number;
  date: string;
}

export interface TicketMessage {
  id: string;
  authorId: string;
  content: string;
  createdOn: string;
}

export interface Ticket {
  id: string;
  raisedBy: string;
  assignedTo: string;
  category: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdOn: string;
  thread: TicketMessage[];
}

export interface CompanyProfile {
  id: string;
  name: string;
  brandColor: string;
  headquartersCountry: CountryCode;
  baseCurrency: CurrencyCode;
}

export interface IntegrationConfig {
  id: string;
  name: string;
  status: "Connected" | "Not Connected";
  lastSyncTime: string;
  description: string;
}

export interface AttendanceRecord {
  employeeId: string;
  month: number;
  year: number;
  clockedHours: number;
  overtimeHours: number;
  officeDays: number;
  wfhDays: number;
  lateMarks: number;
  leaveDays: number;
}

export interface PayrollAnomaly {
  id: string;
  employeeId: string;
  severity: ComplianceSeverity;
  message: string;
}

export interface PayrollProjection {
  nextMonthTotal: number;
  headcountDelta: number;
  narrative: string;
}

export interface SalaryBenchmarkResult {
  marketMedian: number;
  delta: number;
  recommendation: string;
}

export interface CopilotResponse {
  id: string;
  message: string;
  suggestions: string[];
}

export interface InternalGig {
  id: string;
  title: string;
  duration: string;
  skillsNeeded: string[];
  department: string;
  rewardPoints: number;
  assignedEmployeeId: string | null;
}

export interface LearningCourse {
  id: string;
  title: string;
  category: string;
  duration: string;
  assignedTo: string[];
  completionByEmployee: Record<string, number>;
}

export interface OnboardingJourney {
  id: string;
  employeeId: string;
  type: "Onboarding" | "Offboarding";
  progress: number;
  tasks: Array<{
    id: string;
    label: string;
    status: "Not Started" | "In Progress" | "Done";
  }>;
}
