import { normalizeDate } from "@/lib/analytics/healthAnalytics";
import { HealthEntry } from "@/types/health";

export function selectTodayEntries(entries: HealthEntry[]): HealthEntry[] {
    const today = normalizeDate(Date.now());
    
    return entries.filter((entry) => {
        return normalizeDate(entry.timestamp) === today;
    });
}