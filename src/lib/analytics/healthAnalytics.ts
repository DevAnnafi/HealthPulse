import { HealthEntry, HealthMetricType, DailyHealthSummary } from "@/types/health";

export function normalizeDate(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toISOString().split("T")[0];
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
