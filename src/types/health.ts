export type HealthMetricType =
  | "weight"
  | "steps"
  | "sleep"
  | "calories"
  | "heart_rate";


  export interface HealthEntry {
    id: string;
    metric: HealthMetricType;
    value: number;
    unit: string;
    timestamp: number; // Unix ms
  }

  export interface DailyHealthSummary {
    date: string; // YYYY-MM-DD
    metrics: Record<
      HealthMetricType,
      {
        total?: number;
        average?: number;
        min?: number;
        max?: number;
      }
    >;
  }
  
  export interface HealthGoal {
    metric: HealthMetricType;
    target: number;
    comparison: "min" | "max" | "exact";
  }
  
  export interface HealthTrend {
    metric: HealthMetricType;
    period: "daily" | "weekly" | "monthly";
    data: {
      date: string;
      value: number;
    }[];
  }
  