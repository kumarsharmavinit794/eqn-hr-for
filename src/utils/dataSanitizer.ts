export type DashboardHiringPoint = {
  month: string;
  hired: number;
  left: number;
};

export type DashboardDepartmentPoint = {
  name: string;
  value: number;
};

export type DashboardAttendancePoint = {
  day: string;
  attendance: number;
};

export type DashboardData = {
  totalEmployees: number;
  activeRecruitment: number;
  attendanceRate: number;
  avgPerformance: number;
  hiringData: DashboardHiringPoint[];
  departmentData: DashboardDepartmentPoint[];
  attendanceTrend: DashboardAttendancePoint[];
};

const FALLBACK_TEXT = "N/A";

export const fallbackDashboardData: DashboardData = {
  totalEmployees: 1248,
  activeRecruitment: 47,
  attendanceRate: 94.2,
  avgPerformance: 87,
  hiringData: [
    { month: "Jan", hired: 24, left: 8 },
    { month: "Feb", hired: 31, left: 12 },
    { month: "Mar", hired: 28, left: 15 },
    { month: "Apr", hired: 35, left: 9 },
  ],
  departmentData: [
    { name: "Engineering", value: 42 },
    { name: "Sales", value: 28 },
    { name: "Marketing", value: 18 },
    { name: "HR", value: 12 },
  ],
  attendanceTrend: [
    { day: "Mon", attendance: 92 },
    { day: "Tue", attendance: 95 },
    { day: "Wed", attendance: 89 },
    { day: "Thu", attendance: 96 },
    { day: "Fri", attendance: 93 },
  ],
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const normalizeNumberishString = (value: string) =>
  value.replace(/,/g, "").replace(/%/g, "").trim();

export const ensureArray = <T = unknown>(value: unknown): T[] =>
  Array.isArray(value) ? (value as T[]) : [];

export const toSafeString = (value: unknown, fallback = FALLBACK_TEXT): string => {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return fallback;
};

export const toSafeNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }

  if (typeof value === "string") {
    const normalized = normalizeNumberishString(value);
    if (!normalized) {
      return fallback;
    }

    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const clampNumber = (
  value: unknown,
  min: number,
  max: number,
  fallback = min,
): number => {
  const safeValue = toSafeNumber(value, fallback);
  return Math.min(max, Math.max(min, safeValue));
};

export const sanitizeCollection = <T>(
  value: unknown,
  sanitizer: (item: unknown, index: number) => T | null,
): T[] =>
  ensureArray(value).reduce<T[]>((accumulator, item, index) => {
    const sanitized = sanitizer(item, index);
    if (sanitized !== null) {
      accumulator.push(sanitized);
    }

    return accumulator;
  }, []);

export const sanitizeDashboardData = (
  raw: unknown,
  fallback: DashboardData = fallbackDashboardData,
): DashboardData => {
  const source = isRecord(raw) ? raw : {};

  const hiringData = sanitizeCollection(source.hiringData, (item, index) => {
    const entry = isRecord(item) ? item : {};
    const fallbackEntry = fallback.hiringData[index];

    const month = toSafeString(entry.month, fallbackEntry?.month ?? `Month ${index + 1}`);
    const hired = Math.max(0, Math.round(toSafeNumber(entry.hired, fallbackEntry?.hired ?? 0)));
    const left = Math.max(0, Math.round(toSafeNumber(entry.left, fallbackEntry?.left ?? 0)));

    return month ? { month, hired, left } : null;
  });

  const departmentData = sanitizeCollection(source.departmentData, (item, index) => {
    const entry = isRecord(item) ? item : {};
    const fallbackEntry = fallback.departmentData[index];

    const name = toSafeString(
      entry.name,
      fallbackEntry?.name ?? `Department ${index + 1}`,
    );
    const value = clampNumber(entry.value, 0, 100, fallbackEntry?.value ?? 0);

    return name ? { name, value } : null;
  });

  const attendanceTrend = sanitizeCollection(source.attendanceTrend, (item, index) => {
    const entry = isRecord(item) ? item : {};
    const fallbackEntry = fallback.attendanceTrend[index];

    const day = toSafeString(entry.day, fallbackEntry?.day ?? `Day ${index + 1}`);
    const attendance = clampNumber(
      entry.attendance,
      0,
      100,
      fallbackEntry?.attendance ?? 0,
    );

    return day ? { day, attendance } : null;
  });

  return {
    totalEmployees: Math.max(
      0,
      Math.round(toSafeNumber(source.totalEmployees, fallback.totalEmployees)),
    ),
    activeRecruitment: Math.max(
      0,
      Math.round(toSafeNumber(source.activeRecruitment, fallback.activeRecruitment)),
    ),
    attendanceRate: clampNumber(
      source.attendanceRate,
      0,
      100,
      fallback.attendanceRate,
    ),
    avgPerformance: Math.max(0, toSafeNumber(source.avgPerformance, fallback.avgPerformance)),
    hiringData: hiringData.length > 0 ? hiringData : fallback.hiringData,
    departmentData: departmentData.length > 0 ? departmentData : fallback.departmentData,
    attendanceTrend: attendanceTrend.length > 0 ? attendanceTrend : fallback.attendanceTrend,
  };
};
