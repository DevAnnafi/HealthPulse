import { describe, it, expect } from "vitest";
import {
  evaluateWeeklyGoal,
  getWeeklyStreak,
} from "./healthAnalytics";
import { HealthEntry, HealthMetricType } from "@/types/health";

/* ---------------------------------------------
   Test Helpers
--------------------------------------------- */

function createEntry(
  metric: HealthMetricType,
  value: number,
  date: string
): HealthEntry {
  return {
    id: crypto.randomUUID(),
    metric,
    value,
    unit: "",
    timestamp: new Date(date + "T00:00:00Z").getTime(),
  };
}

/* ---------------------------------------------
   evaluateWeeklyGoal Tests
--------------------------------------------- */

describe("evaluateWeeklyGoal", () => {
  it("returns no-goal when goal is undefined", () => {
    const result = evaluateWeeklyGoal("steps", 8000, undefined);
    expect(result).toBe("no-goal");
  });

  it("returns hit when min rule is satisfied", () => {
    const result = evaluateWeeklyGoal("steps", 10000, 8000);
    expect(result).toBe("hit");
  });

  it("returns miss when min rule is violated", () => {
    const result = evaluateWeeklyGoal("steps", 6000, 8000);
    expect(result).toBe("miss");
  });

  it("returns hit when max rule is satisfied", () => {
    const result = evaluateWeeklyGoal("calories", 1800, 2000);
    expect(result).toBe("hit");
  });

  it("returns miss when max rule is violated", () => {
    const result = evaluateWeeklyGoal("calories", 2400, 2000);
    expect(result).toBe("miss");
  });
});

/* ---------------------------------------------
   getWeeklyStreak Tests
--------------------------------------------- */

describe("getWeeklyStreak", () => {
  it("returns correct streak for consecutive hit weeks", () => {
    const entries: HealthEntry[] = [
      // Current week (hit)
      createEntry("steps", 10000, "2026-01-05"),
      createEntry("steps", 10000, "2026-01-06"),

      // Previous week (hit)
      createEntry("steps", 9000, "2025-12-29"),
      createEntry("steps", 9000, "2025-12-30"),

      // Two weeks ago (hit)
      createEntry("steps", 8500, "2025-12-22"),
    ];

    const streak = getWeeklyStreak(
      entries,
      "steps",
      8000,
      "2026-01-05",
      10
    );

    expect(streak).toBe(3);
  });

  it("stops streak on first miss", () => {
    const entries: HealthEntry[] = [
      // Current week (hit)
      createEntry("steps", 9000, "2026-01-05"),

      // Previous week (miss)
      createEntry("steps", 6000, "2025-12-29"),
    ];

    const streak = getWeeklyStreak(
      entries,
      "steps",
      8000,
      "2026-01-05",
      10
    );

    expect(streak).toBe(1);
  });

  it("returns 0 when no goal is set", () => {
    const entries: HealthEntry[] = [
      createEntry("steps", 10000, "2026-01-05"),
      createEntry("steps", 10000, "2025-12-29"),
    ];

    const streak = getWeeklyStreak(
      entries,
      "steps",
      undefined,
      "2026-01-05",
      10
    );

    expect(streak).toBe(0);
  });

  it("respects maxWeeks limit", () => {
    const entries: HealthEntry[] = [
      createEntry("steps", 10000, "2026-01-05"),
      createEntry("steps", 10000, "2025-12-29"),
      createEntry("steps", 10000, "2025-12-22"),
    ];

    const streak = getWeeklyStreak(
      entries,
      "steps",
      8000,
      "2026-01-05",
      2
    );

    expect(streak).toBe(2);
  });
});
