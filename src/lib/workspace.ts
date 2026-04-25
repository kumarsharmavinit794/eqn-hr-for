import type { UserRole } from "@/lib/auth";

export interface WorkspaceMembership {
  id: string;
  companyName: string;
  companyEmail: string;
  domain: string;
  industry: string;
  size: string;
  logoUrl?: string;
  accent: [string, string];
  role: UserRole;
  userName: string;
  userEmail: string;
  recognizedEmails: string[];
  documentUses: string[];
  lastActiveLabel: string;
}

export interface PendingCompanyRegistration {
  companyName: string;
  companyEmail: string;
  industry: string;
  size: string;
  logoUrl?: string;
}

const CUSTOM_WORKSPACES_KEY = "nexa.custom.workspaces";
const ACTIVE_WORKSPACE_KEY = "nexa.active.workspace";
const LAST_WORKSPACE_ID_KEY = "nexa.last.workspace.id";
const PENDING_COMPANY_KEY = "nexa.pending.company";
const CONFIRMED_ROLES_KEY = "nexa.confirmed.role.workspaces";
const RESET_EMAIL_KEY = "nexa.reset.email";
const WORKSPACE_EVENT = "nexa-workspace-updated";

const accentPalette: Array<[string, string]> = [
  ["#10A37F", "#34D399"],
  ["#0EA5E9", "#14B8A6"],
  ["#F59E0B", "#FB7185"],
  ["#8B5CF6", "#14B8A6"],
  ["#2563EB", "#38BDF8"],
];

export const demoOtp = "482901";

export const industryOptions = [
  "HR Technology",
  "Information Technology",
  "Manufacturing",
  "Healthcare",
  "Retail",
  "Financial Services",
  "Education",
  "Consulting",
  "Logistics",
];

export const companySizeOptions = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-1000 employees",
  "1000+ employees",
];

const seededWorkspaces: WorkspaceMembership[] = [
  {
    id: "nexa-hr-owner",
    companyName: "Nexa HR",
    companyEmail: "workspace@nexahr.ai",
    domain: "nexahr.ai",
    industry: "HR Technology",
    size: "51-200 employees",
    accent: ["#10A37F", "#34D399"],
    role: "admin",
    userName: "Aarav Mehta",
    userEmail: "aarav@nexahr.ai",
    recognizedEmails: ["aarav@nexahr.ai", "workspace@nexahr.ai", "owner@nexahr.ai"],
    documentUses: ["Offer Letters", "HR Documents", "Payslips"],
    lastActiveLabel: "Last active 4 min ago",
  },
  {
    id: "aurion-labs-hr",
    companyName: "Aurion Labs",
    companyEmail: "people@aurionlabs.com",
    domain: "aurionlabs.com",
    industry: "Biotech",
    size: "201-1000 employees",
    accent: ["#0EA5E9", "#6366F1"],
    role: "hr",
    userName: "Riya Sen",
    userEmail: "riya@sharedworkspace.com",
    recognizedEmails: ["riya@sharedworkspace.com", "people@aurionlabs.com"],
    documentUses: ["Offer Letters", "Probation Letters", "Payroll Docs"],
    lastActiveLabel: "Last active 12 min ago",
  },
  {
    id: "cedar-stack-employee",
    companyName: "Cedar Stack",
    companyEmail: "hr@cedarstack.co",
    domain: "cedarstack.co",
    industry: "IT Services",
    size: "11-50 employees",
    accent: ["#F97316", "#FB7185"],
    role: "employee",
    userName: "Riya Sen",
    userEmail: "riya@sharedworkspace.com",
    recognizedEmails: ["riya@sharedworkspace.com", "riya@cedarstack.co"],
    documentUses: ["Payslips", "Employment Letters", "Tax Forms"],
    lastActiveLabel: "Last active yesterday",
  },
  {
    id: "northstar-retail-employee",
    companyName: "Northstar Retail",
    companyEmail: "hello@northstarretail.com",
    domain: "northstarretail.com",
    industry: "Retail",
    size: "1000+ employees",
    accent: ["#8B5CF6", "#14B8A6"],
    role: "employee",
    userName: "Kabir Sharma",
    userEmail: "kabir@northstarretail.com",
    recognizedEmails: ["kabir@northstarretail.com", "hello@northstarretail.com"],
    documentUses: ["Payslips", "Shift Letters", "Store Compliance Docs"],
    lastActiveLabel: "Last active 1 hour ago",
  },
];

function readStorageValue<T>(storage: Storage | undefined, key: string, fallback: T): T {
  if (!storage) {
    return fallback;
  }

  try {
    const rawValue = storage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorageValue(storage: Storage | undefined, key: string, value: unknown) {
  if (!storage) {
    return;
  }

  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore write failures for preview-only auth state.
  }
}

function emitWorkspaceUpdate() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(WORKSPACE_EVENT));
}

function getLocalStorage() {
  return typeof window === "undefined" ? undefined : window.localStorage;
}

function getSessionStorage() {
  return typeof window === "undefined" ? undefined : window.sessionStorage;
}

function clearAuthStorage() {
  const localStorage = getLocalStorage();
  const sessionStorage = getSessionStorage();

  ["token", "refresh_token", "name", "email", "role"].forEach((key) => {
    localStorage?.removeItem(key);
    sessionStorage?.removeItem(key);
  });
}

function uniqueById(workspaces: WorkspaceMembership[]) {
  const seen = new Set<string>();
  return workspaces.filter((workspace) => {
    if (seen.has(workspace.id)) {
      return false;
    }

    seen.add(workspace.id);
    return true;
  });
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleCase(part: string) {
  if (!part) {
    return part;
  }

  return part.charAt(0).toUpperCase() + part.slice(1);
}

function createNameFromEmail(email: string) {
  const localPart = email.split("@")[0] || "workspace owner";
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map(titleCase)
    .join(" ");
}

function getAccentForIndex(index: number) {
  return accentPalette[index % accentPalette.length];
}

function createWorkspaceFromRegistration(registration: PendingCompanyRegistration, index: number): WorkspaceMembership {
  const domain = registration.companyEmail.split("@")[1] || "company.com";
  const createdAt = Date.now().toString(36);

  return {
    id: `${slugify(registration.companyName)}-${createdAt}`,
    companyName: registration.companyName,
    companyEmail: registration.companyEmail,
    domain,
    industry: registration.industry,
    size: registration.size,
    logoUrl: registration.logoUrl,
    accent: getAccentForIndex(index),
    role: "admin",
    userName: createNameFromEmail(registration.companyEmail),
    userEmail: registration.companyEmail,
    recognizedEmails: [registration.companyEmail],
    documentUses: ["Offer Letters", "HR Documents", "Payslips"],
    lastActiveLabel: "Created just now",
  };
}

export function getWorkspaceUpdateEventName() {
  return WORKSPACE_EVENT;
}

export function getRoleLabel(role: UserRole) {
  if (role === "admin") {
    return "Admin";
  }

  if (role === "hr") {
    return "HR";
  }

  return "Employee";
}

export function createWorkspacePreview({
  companyName,
  companyEmail,
  industry,
  size,
  logoUrl,
  role = "admin",
}: {
  companyName?: string;
  companyEmail?: string;
  industry?: string;
  size?: string;
  logoUrl?: string;
  role?: UserRole;
}): WorkspaceMembership {
  const email = companyEmail || "workspace@company.com";
  const fallbackName = companyName || "Your Company";

  return {
    id: "preview-workspace",
    companyName: fallbackName,
    companyEmail: email,
    domain: email.split("@")[1] || "company.com",
    industry: industry || "Industry",
    size: size || "Team size",
    logoUrl,
    accent: accentPalette[0],
    role,
    userName: role === "admin" ? "Workspace Owner" : "Team Member",
    userEmail: email,
    recognizedEmails: [email],
    documentUses: ["Offer Letters", "HR Documents", "Payslips"],
    lastActiveLabel: "Ready to launch",
  };
}

export function getEmailSuggestions() {
  const suggestions = seededWorkspaces.flatMap((workspace) => workspace.recognizedEmails);
  return Array.from(new Set(suggestions));
}

export function getCustomWorkspaces() {
  return readStorageValue<WorkspaceMembership[]>(getLocalStorage(), CUSTOM_WORKSPACES_KEY, []);
}

export function getAllWorkspaces() {
  return uniqueById([...getCustomWorkspaces(), ...seededWorkspaces]);
}

export function getWorkspaceById(workspaceId?: string | null) {
  if (!workspaceId) {
    return null;
  }

  return getAllWorkspaces().find((workspace) => workspace.id === workspaceId) || null;
}

export function findWorkspacesForEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail.includes("@")) {
    return [];
  }

  const domain = normalizedEmail.split("@")[1];
  const exactMatches = getAllWorkspaces().filter((workspace) => {
    const emails = workspace.recognizedEmails.map((value) => value.toLowerCase());
    return emails.includes(normalizedEmail);
  });

  if (exactMatches.length > 0) {
    return uniqueById(exactMatches);
  }

  const domainMatches = getAllWorkspaces().filter((workspace) => workspace.domain.toLowerCase() === domain);
  return uniqueById(domainMatches);
}

export function getActiveWorkspace() {
  const activeWorkspace = readStorageValue<WorkspaceMembership | null>(getLocalStorage(), ACTIVE_WORKSPACE_KEY, null);
  if (activeWorkspace?.id) {
    return getWorkspaceById(activeWorkspace.id) || activeWorkspace;
  }

  return null;
}

export function getLastWorkspace() {
  const lastWorkspaceId = getLocalStorage()?.getItem(LAST_WORKSPACE_ID_KEY);
  return getWorkspaceById(lastWorkspaceId) || getActiveWorkspace();
}

export function setActiveWorkspace(workspace: WorkspaceMembership) {
  const storage = getLocalStorage();
  writeStorageValue(storage, ACTIVE_WORKSPACE_KEY, workspace);
  storage?.setItem(LAST_WORKSPACE_ID_KEY, workspace.id);
  storage?.setItem("company_name", workspace.companyName);
  storage?.setItem("company_email", workspace.companyEmail);
  storage?.setItem("company_industry", workspace.industry);
  if (workspace.logoUrl) {
    storage?.setItem("company_logo", workspace.logoUrl);
  } else {
    storage?.removeItem("company_logo");
  }
  emitWorkspaceUpdate();
}

export function savePendingCompanyRegistration(registration: PendingCompanyRegistration) {
  writeStorageValue(getSessionStorage(), PENDING_COMPANY_KEY, registration);
}

export function getPendingCompanyRegistration() {
  return readStorageValue<PendingCompanyRegistration | null>(getSessionStorage(), PENDING_COMPANY_KEY, null);
}

export function clearPendingCompanyRegistration() {
  getSessionStorage()?.removeItem(PENDING_COMPANY_KEY);
}

export function completePendingCompanyRegistration() {
  const registration = getPendingCompanyRegistration();
  if (!registration) {
    return null;
  }

  const existingWorkspaces = getCustomWorkspaces();
  const createdWorkspace = createWorkspaceFromRegistration(registration, existingWorkspaces.length);
  writeStorageValue(getLocalStorage(), CUSTOM_WORKSPACES_KEY, [createdWorkspace, ...existingWorkspaces]);
  clearPendingCompanyRegistration();
  setActiveWorkspace(createdWorkspace);
  return createdWorkspace;
}

export function applyWorkspaceSession(workspace: WorkspaceMembership, persist = true) {
  const storage = persist ? getLocalStorage() : getSessionStorage();
  setActiveWorkspace(workspace);
  clearAuthStorage();
  storage?.setItem("token", `demo-token-${workspace.id}`);
  storage?.setItem("refresh_token", `demo-refresh-${workspace.id}`);
  storage?.setItem("name", workspace.userName);
  storage?.setItem("email", workspace.userEmail);
  storage?.setItem("role", workspace.role);
  emitWorkspaceUpdate();
}

export function logoutWorkspaceSession() {
  clearAuthStorage();
  emitWorkspaceUpdate();
}

export function hasRoleConfirmation(workspaceId?: string | null) {
  if (!workspaceId) {
    return false;
  }

  const confirmed = readStorageValue<string[]>(getLocalStorage(), CONFIRMED_ROLES_KEY, []);
  return confirmed.includes(workspaceId);
}

export function markRoleConfirmation(workspaceId: string) {
  const confirmed = readStorageValue<string[]>(getLocalStorage(), CONFIRMED_ROLES_KEY, []);
  if (!confirmed.includes(workspaceId)) {
    writeStorageValue(getLocalStorage(), CONFIRMED_ROLES_KEY, [...confirmed, workspaceId]);
    emitWorkspaceUpdate();
  }
}

export function setResetEmail(email: string) {
  getSessionStorage()?.setItem(RESET_EMAIL_KEY, email.trim().toLowerCase());
}

export function getResetEmail() {
  return getSessionStorage()?.getItem(RESET_EMAIL_KEY) || "";
}

export function clearResetEmail() {
  getSessionStorage()?.removeItem(RESET_EMAIL_KEY);
}

export function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}
