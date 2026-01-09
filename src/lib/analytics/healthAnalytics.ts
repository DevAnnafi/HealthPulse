import { HealthEntry, HealthMetricType, DailyHealthSummary } from "@/types/health";

/* ---------------------------------------------
   Time Utilities
--------------------------------------------- */

export function normalizeDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toISOString().split("T")[0];
}

function parseISODate(dateString: string): Date {
  if (typeof dateString !== "string" || dateString.length !== 10) {
    throw new Error("Invalid date format. Expected YYYY-MM-DD.");
  }

  if (dateString[4] !== "-" || dateString[7] !== "-") {
    throw new Error("Invalid date format. Expected YYYY-MM-DD.");
  }

  const date = new Date(dateString + "T00:00:00Z");

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date value.");
  }

  const year = date.getUTCFullYear().toString();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");

  const reconstructed = `${year}-${month}-${day}`;

  if (reconstructed !== dateString) {
    throw new Error("Invalid calendar date.");
  }

  return date;
}

/* ---------------------------------------------
   Grouping
--------------------------------------------- */

export function groupEntriesByDay(
  entries: HealthEntry[]
): Record<string, HealthEntry[]> {
  return entries.reduce<Record<string, HealthEntry[]>>((acc, entry) => {
    const day = normalizeDate(entry.timestamp);

    if (!acc[day]) {
      acc[day] = [];
    }

    acc[day].push(entry);
    return acc;
  }, {});
}

/* ---------------------------------------------
   Daily Analytics
--------------------------------------------- */

export function getDailySummary(
  entries: HealthEntry[],
  date: string
): DailyHealthSummary {
  const groupedByDay = groupEntriesByDay(entries);
  const dayEntries = groupedByDay[date] ?? [];

  const metrics: Partial<DailyHealthSummary["metrics"]> = {};

  for (const entry of dayEntries) {
    const metric = entry.metric;

    if (!metrics[metric]) {
      metrics[metric] = {
        total: 0,
        min: entry.value,
        max: entry.value,
        average: 0,
      };
    }

    const stats = metrics[metric]!;

    stats.total = (stats.total ?? 0) + entry.value;
    stats.min = Math.min(stats.min ?? entry.value, entry.value);
    stats.max = Math.max(stats.max ?? entry.value, entry.value);
  }

  for (const metric in metrics) {
    const metricEntries = dayEntries.filter(
      (e) => e.metric === metric
    );

    metrics[metric as HealthMetricType]!.average =
      metrics[metric as HealthMetricType]!.total! / metricEntries.length;
  }

  return {
    date,
    metrics: metrics as DailyHealthSummary["metrics"],
  };
}

/* ---------------------------------------------
   Weekly Analytics
--------------------------------------------- */

export function getWeeklySummary(
  entries: HealthEntry[],
  weekStart: string
) {
  // Validate input
  parseISODate(weekStart);

  // Generate 7-day date range
  const dates: string[] = [];
  const start = new Date(weekStart + "T00:00:00Z");

  for (let i = 0; i < 7; i++) {
    const current = new Date(start);
    current.setUTCDate(start.getUTCDate() + i);
    dates.push(current.toISOString().split("T")[0]);
  }

  // Weekly accumulator
  type WeeklyMetricAccumulator = {
    total: number;
    min?: number;
    max?: number;
    dayCount: number;
  };

  const weeklyMetrics: Partial<
    Record<HealthMetricType, WeeklyMetricAccumulator>
  > = {};

  // Aggregate daily summaries
  for (let i = 0; i < dates.length; i++) {
    const currentDay = dates[i];
    const dailySummary = getDailySummary(entries, currentDay);

    if (Object.keys(dailySummary.metrics).length === 0) {
      continue;
    }

    for (const metric in dailySummary.metrics) {
      const metricKey = metric as HealthMetricType;
      const dailyMetric = dailySummary.metrics[metricKey]!;

      if (!weeklyMetrics[metricKey]) {
        weeklyMetrics[metricKey] = {
          total: 0,
          min: undefined,
          max: undefined,
          dayCount: 0,
        };
      }

      const weeklyMetric = weeklyMetrics[metricKey]!;

      weeklyMetric.total += dailyMetric.total ?? 0;

      if (
        weeklyMetric.min === undefined ||
        dailyMetric.min! < weeklyMetric.min
      ) {
        weeklyMetric.min = dailyMetric.min;
      }

      if (
        weeklyMetric.max === undefined ||
        dailyMetric.max! > weeklyMetric.max
      ) {
        weeklyMetric.max = dailyMetric.max;
      }

      weeklyMetric.dayCount += 1;
    }
  }

  // Finalize weekly averages
  const finalizedMetrics = {} as DailyHealthSummary["metrics"];

  for (const metric in weeklyMetrics) {
    const metricKey = metric as HealthMetricType;
    const data = weeklyMetrics[metricKey]!;

    if (data.dayCount === 0) continue;

    finalizedMetrics[metricKey] = {
      total: data.total,
      min: data.min,
      max: data.max,
      average: data.total / data.dayCount,
    };
  }

  // Compute weekEnd
  const weekEndDate = new Date(weekStart + "T00:00:00Z");
  weekEndDate.setUTCDate(weekEndDate.getUTCDate() + 6);
  const weekEnd = weekEndDate.toISOString().split("T")[0];

  return {
    weekStart,
    weekEnd,
    metrics: finalizedMetrics,
  };
}

/* ---------------------------------------------
   Weekly Trend
--------------------------------------------- */
export function getWeeklyTrend(
  entries: HealthEntry[],
  weekStart: string,
  metric: HealthMetricType
): { date: string; value: number }[] {
  // Validate weekStart
  parseISODate(weekStart);

  // Generate 7-day range
  const dates: string[] = [];
  const start = new Date(weekStart + "T00:00:00Z");

  for (let i = 0; i < 7; i++) {
    const current = new Date(start);
    current.setUTCDate(start.getUTCDate() + i);
    dates.push(current.toISOString().split("T")[0]);
  }

  // Build trend data
  const trend: { date: string; value: number }[] = [];

  for (const date of dates) {
    const dailySummary = getDailySummary(entries, date);
    const metricData = dailySummary.metrics[metric];

    if (!metricData || metricData.average === undefined) {
      continue;
    }

    trend.push({
      date,
      value: metricData.average,
    });
  }

  return trend;
}
