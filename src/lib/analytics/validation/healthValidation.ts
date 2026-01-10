import { HealthEntry, HealthMetricType } from "@/types/health";

export type ValidationResult =
  | { valid: true }
  | { valid: false; error: string };


  type MetricConstraint = {
    min?: number;
    max?: number;
  };
  
  const METRIC_CONSTRAINTS: Record<HealthMetricType, MetricConstraint> = {
    steps: { min: 0 },
    sleep: { min: 0, max: 24 },
    calories: { min: 0 },
    heart_rate: { min: 30, max: 220 },
    weight: { min: 1 },
  };

  function isValidTimestamp(timestamp: number): boolean {
    return (
      Number.isFinite(timestamp) &&
      timestamp > 0 &&
      timestamp < Date.now() + 1000 * 60 * 60 * 24
    );
  }

  export function validateHealthEntry(entry: HealthEntry): ValidationResult {
    const { metric, value, timestamp } = entry;
  
    // Metric existence
    if (!metric || !(metric in METRIC_CONSTRAINTS)) {
      return { valid: false, error: "Invalid health metric." };
    }
  
    // Value sanity
    if (!Number.isFinite(value)) {
      return { valid: false, error: "Value must be a valid number." };
    }
  
    // Timestamp sanity
    if (!isValidTimestamp(timestamp)) {
      return { valid: false, error: "Invalid timestamp." };
    }
  
    // Domain constraints
    const { min, max } = METRIC_CONSTRAINTS[metric];
  
    if (min !== undefined && value < min) {
      return {
        valid: false,
        error: `${metric} must be at least ${min}.`,
      };
    }
  
    if (max !== undefined && value > max) {
      return {
        valid: false,
        error: `${metric} must be at most ${max}.`,
      };
    }
  
    return { valid: true };
  }
  
  
  