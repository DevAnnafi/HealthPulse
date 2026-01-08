import { HealthEntry, HealthMetricType, DailyHealthSummary } from "@/types/health";

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
  
    // Finalize averages
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

  export function getWeeklySummary(
    entries: HealthEntry[],
    weekStart: string,
  ) {
  // 1. Validate weekStart format
  // - Ensure weekStart is in "YYYY-MM-DD"
  // - Treat it as the first day of the week (authoritative)
   const startDate = parseISODate(weekStart);
  

  // 2. Generate the 7-day date range for the week
  // - Starting from weekStart
  // - Create an array of 7 consecutive dates
  // - Each date should be in "YYYY-MM-DD" format
  // - Include days even if no entries exist
  const dates: string[] = [];

  const start = new Date(weekStart + "T00:00:00Z");

  for (let i = 0; i < 7; i++) {
    const current = new Date(start);
    current.setUTCDate(start.getUTCDate() + i);
    dates.push(current.toISOString().split("T")[0]);
  }

  // 3. Initialize an empty weekly metrics accumulator
  // - Keyed by HealthMetricType
  // Create a variable to hold weekly metric accumulators
  // This is an object keyed by HealthMetricType
  // Each value is an accumulator object (total, min, max, dayCount)
  // Start with an empty object
  // - For each metric, prepare:
  //   - total = 0
  //   - min = undefined
  //   - max = undefined
  //   - dayCount = 0
  type WeeklyMetricAccumulator = {
    total: number;
    min?: number;
    max?: number;
    dayCount: number;
  };
  
  const weeklyMetrics: Partial<
    Record<HealthMetricType, WeeklyMetricAccumulator>
  > = {};
  
  // 4. Loop through each day in the 7-day range
  // - For each day:
  //   - Call getDailySummary(entries, currentDay)
  //   - If no metrics exist for that day, continue
  for(let i = 0; i < 7; i++) {
    // 1. Get the current date string from the dates array
    //    - This represents one calendar day in the week
     const CurrentDay = dates[i];

      // 2. Call getDailySummary using:
      //    - the full entries array
      //    - the current day string
     const dailySummary = getDailySummary(entries, CurrentDay);

      // 3. Check if the daily summary has any metrics
      //    - If the metrics object is empty:
      //      - Skip this day entirely
      //      - Do NOT increment any counters
      if (Object.keys(dailySummary.metrics).length === 0) {
        continue;
      }
      
     // 4. Iterate over each metric in the daily summary
    for (const metric in dailySummary.metrics) {
      const metricKey = metric as HealthMetricType;
      const dailyMetric = dailySummary.metrics[metricKey]!;

      // 5. Initialize weekly accumulator if it does not exist
      if (!weeklyMetrics[metricKey]) {
        weeklyMetrics[metricKey] = {
          total: 0,
          min: undefined,
          max: undefined,
          dayCount: 0,
        };
      }

      const weeklyMetric = weeklyMetrics[metricKey]!;

      // 6. Merge daily data into weekly accumulator
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

      // 7. Increment dayCount ONCE per day for this metric
      weeklyMetric.dayCount += 1;
}

  }
    

    // 5. Accumulate daily metrics into weekly metrics
    // - For each metric in the daily summary:
    //   - Add daily total to weekly total
    //   - Update weekly min if smaller
    //   - Update weekly max if larger
    //   - Increment dayCount for that metric

    // 6. Finalize weekly averages
    // - For each metric:
    //   - If dayCount > 0:
    //     - weeklyAverage = weeklyTotal / dayCount
    //   - Avoid division by zero

    // 7. Construct the weekly summary return object
    // - Include:
    //   - weekStart
    //   - weekEnd (weekStart + 6 days)
    //   - metrics grouped by HealthMetricType
    // - Keep structure consistent with DailyHealthSummary

    // 8. Return the finalized weekly summary
}
  
