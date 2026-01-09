import { useHealthStore } from "@/store/healthStore";
import { useState } from "react";
import { HealthEntry, HealthMetricType } from "@/types/health";
import { getWeeklyTrend } from "@/lib/analytics/healthAnalytics";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,} from "recharts";
import { stringify } from "querystring";

export function WeeklyMetricTrendChart() {

    function formatDayLabel(dateString: string): string {
        const date = new Date(dateString + "T00:00:00Z");
        return date.toLocaleDateString("en-US", { weekday: "short" });
      }
      

    // Metric Options
    const METRIC_OPTIONS: {label: string; value: HealthMetricType } [] = [
        { label: "Steps", value: "steps" },
        { label: "Sleep", value: "sleep" },
        { label: "Calories", value: "calories" },
        { label: "Heart Rate", value: "heart_rate" },
        { label: "Weight", value: "weight" },
    ];

    // Select only `entries`
    const entries = useHealthStore((state) => state.entries);

    // Decide which metric to display
    const [metric, setMetric] = useState<HealthMetricType>("steps");

    // Selected week start (YYYY-MM-DD)
    const [weekStart, setWeekStart] = useState<string>("2026-01-01");

    // Call getWeeklyTrend(entries, weekStart, metric)
    const trendDate = getWeeklyTrend(entries, weekStart, metric);
    
        return (
            <div className="w-full">
              {/* Metric selector */}
              <div className="flex items-center gap-2 mb-4">
                <label className="text-sm font-medium text-muted-foreground">
                  Metric
                </label>
                <select
                  value={metric}
                  onChange={(e) => setMetric(e.target.value as HealthMetricType)}
                  className="border rounded px-2 py-1 text-sm bg-background"
                >
                  {METRIC_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
        
              {/* Chart */}
              <div className="w-full h-64">
                {trendDate.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                    No data available for this week.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendDate}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={formatDayLabel}
                        />
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
            </div>
          );
      
}





