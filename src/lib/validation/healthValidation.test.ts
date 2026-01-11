import { describe, it, expect } from "vitest";
import { validateHealthEntry } from "./healthValidation";
import type { HealthEntry, HealthMetricType } from "@/types/health";



describe("validateHealthEntry", () => {
  const baseEntry: Omit<HealthEntry, "metric" | "value"> = {
    id: "test-id",
    timestamp: Date.now(),
    unit: "",
  };

  it("returns valid for a correct steps entry", () => {
    const entry: HealthEntry = {
      ...baseEntry,
      metric: "steps",
      value: 5000,
    };

    const result = validateHealthEntry(entry);
    expect(result.valid).toBe(true);
  });

  it("rejects negative steps", () => {
    const entry: HealthEntry = {
      ...baseEntry,
      metric: "steps",
      value: -10,
    };

    const result = validateHealthEntry(entry);
    expect(result).toEqual({
      valid: false,
      error: "steps must be at least 0.",
    });
  });

  it("rejects sleep greater than 24 hours", () => {
    const entry: HealthEntry = {
      ...baseEntry,
      metric: "sleep",
      value: 25,
    };

    const result = validateHealthEntry(entry);
    expect(result).toEqual({
      valid: false,
      error: "sleep must be at most 24.",
    });
  });

  it("rejects heart rate below minimum", () => {
    const entry: HealthEntry = {
      ...baseEntry,
      metric: "heart_rate",
      value: 20,
    };

    const result = validateHealthEntry(entry);
    expect(result).toEqual({
      valid: false,
      error: "heart_rate must be at least 30.",
    });
  });

  it("rejects NaN values", () => {
    const entry: HealthEntry = {
      ...baseEntry,
      metric: "weight",
      value: NaN,
    };

    const result = validateHealthEntry(entry);
    expect(result).toEqual({
      valid: false,
      error: "Value must be a valid number.",
    });
  });

  it("rejects invalid timestamps", () => {
    const entry: HealthEntry = {
      ...baseEntry,
      metric: "steps",
      value: 1000,
      timestamp: Date.now() + 1000 * 60 * 60 * 24 * 365, // far future
    };

    const result = validateHealthEntry(entry);
    expect(result).toEqual({
      valid: false,
      error: "Invalid timestamp.",
    });
  });

  it("rejects unknown metrics", () => {
    const entry: HealthEntry = {
      ...baseEntry,
      metric: "unknown_metric" as unknown as HealthMetricType,
      value: 10,
    };
  
    const result = validateHealthEntry(entry);
    expect(result).toEqual({
      valid: false,
      error: "Invalid health metric.",
    });
  });
})  
