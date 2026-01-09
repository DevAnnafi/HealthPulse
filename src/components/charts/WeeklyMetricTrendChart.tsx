import { useHealthStore } from "@/store/healthStore";
import { useState } from "react";
import { HealthEntry, HealthMetricType } from "@/types/health";
import { getWeeklyTrend } from "@/lib/analytics/healthAnalytics";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,} from "recharts";

export function WeeklyMetricTrendChart() {
    // Select only `entries`
    const entries = useHealthStore((state) => state.entries);

    // Decide which metric to display
    const [metric, setMetric] = useState<HealthMetricType>("steps");

    // Selected week start (YYYY-MM-DD)
    const [weekStart, setWeekStart] = useState<string>("2026-01-01");

    // Call getWeeklyTrend(entries, weekStart, metric)
    const trendDate = getWeeklyTrend(entries, weekStart, metric);
      
      return (
        <div className="w-full h-64">
          {trendDate.length === 0 ? (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
              No data available for this week.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      );
      
}





