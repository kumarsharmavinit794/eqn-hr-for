import { describe, expect, it } from "vitest";

import {
  fallbackDashboardData,
  sanitizeDashboardData,
  toSafeNumber,
  toSafeString,
} from "@/utils/dataSanitizer";

describe("dataSanitizer", () => {
  it("coerces messy numeric and string input into safe dashboard data", () => {
    const sanitized = sanitizeDashboardData({
      totalEmployees: "1,280",
      activeRecruitment: "19",
      attendanceRate: "101%",
      avgPerformance: "87.5",
      departmentData: [
        { name: "Engineering", value: "110" },
        { name: "", value: null },
      ],
      attendanceTrend: [
        { day: "Mon", attendance: "95%" },
        { day: null, attendance: "bad" },
      ],
    });

    expect(sanitized.totalEmployees).toBe(1280);
    expect(sanitized.activeRecruitment).toBe(19);
    expect(sanitized.attendanceRate).toBe(100);
    expect(sanitized.avgPerformance).toBe(87.5);
    expect(sanitized.departmentData[0]).toEqual({
      name: "Engineering",
      value: 100,
    });
    expect(sanitized.departmentData[1]).toEqual({
      name: "Sales",
      value: 0,
    });
    expect(sanitized.attendanceTrend[0]).toEqual({
      day: "Mon",
      attendance: 95,
    });
    expect(sanitized.attendanceTrend[1]).toEqual({
      day: "Tue",
      attendance: 95,
    });
  });

  it("falls back to the bundled mock dataset when payloads are missing arrays", () => {
    const sanitized = sanitizeDashboardData(null);

    expect(sanitized).toEqual(fallbackDashboardData);
  });

  it("handles primitive coercion helpers safely", () => {
    expect(toSafeNumber("45%", 0)).toBe(45);
    expect(toSafeNumber("bad", 7)).toBe(7);
    expect(toSafeString("", "Fallback")).toBe("Fallback");
  });
});
