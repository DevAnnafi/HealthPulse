import { HealthEntry, HealthMetricType } from "@/types/health";
import { selectTodayEntries } from "@/lib/selectors/selectTodayEntries";

export function selectTodayEntryForMetric(
    entries: HealthEntry[],
    metric: HealthMetricType
): HealthEntry | undefined {

    const todayEntries = selectTodayEntries(entries);

    return todayEntries.find((entry) => entry.metric === metric);

}