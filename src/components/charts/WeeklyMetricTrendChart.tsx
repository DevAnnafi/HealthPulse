import { useHealthStore } from "@/store/healthStore";
import { useState, useEffect } from "react";
import { HealthMetricType } from "@/types/health";
import { getWeeklyTrend } from "@/lib/analytics/healthAnalytics";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, } from "recharts";
import { useHealthGoalsStore } from "@/store/healthSettingsStore";
import { getWeeklyStreak } from "@/lib/analytics/healthAnalytics";


/* ---------------------------------------------
   Goal Line Helper
--------------------------------------------- */

type GoalLineProps = {
  goal?: number;
};

function GoalLine({ goal }: GoalLineProps) {
  if (goal === undefined) {
    return null;
  }

  return (
    <ReferenceLine
      y={goal}
      stroke="#f97316"
      strokeDasharray="4 4"
      label={{
        value: "Goal",
        position: "right",
        fill: "#f97316",
        fontSize: 12,
      }}
    />
  );
}

/* ---------------------------------------------
   Main Chart Component
--------------------------------------------- */

export function WeeklyMetricTrendChart() {
  function formatDayLabel(dateString: string): string {
    const date = new Date(dateString + "T00:00:00Z");
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }

  const METRIC_OPTIONS: { label: string; value: HealthMetricType }[] = [
    { label: "Steps", value: "steps" },
    { label: "Sleep", value: "sleep" },
    { label: "Calories", value: "calories" },
    { label: "Heart Rate", value: "heart_rate" },
    { label: "Weight", value: "weight" },
  ];


  // Select only `entries`
  const entries = useHealthStore((state) => state.entries);
  
  // UI state
  const [metric, setMetric] = useState<HealthMetricType>("steps");
  const [weekStart, setWeekStart] = useState<string>("2026-01-01");

  // Analytics
  const trendData = getWeeklyTrend(entries, weekStart, metric);

  const goals = useHealthGoalsStore((state) => state.goals);
  const setGoal = useHealthGoalsStore((state) => state.setGoal);
  const clearGoal = useHealthGoalsStore((state) => state.clearGoal);

  const currentGoal = goals[metric];

  const [goalInput, setGoalInput] = useState<string>(
    currentGoal !== undefined ? String(currentGoal) : ""
  );

  useEffect(() => {
    setGoalInput(currentGoal !== undefined ? String(currentGoal) : "");
  }, [currentGoal, metric]);

  const streak = getWeeklyStreak(
    entries,
    metric,
    currentGoal,
    weekStart,
    52 // safety cap: 1 year
  );
  

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

      <div className="flex items-center gap-2 mb-4">
        <label className="text-sm font-medium text-muted-foreground">
          Goal
        </label>

        <input
          type="number"
          value={goalInput}
          onChange={(e) => setGoalInput(e.target.value)}
          className="border rounded px-2 py-1 text-sm w-28 bg-background"
          placeholder="Enter goal"
        />

        <button
          onClick={() => {
            const value = Number(goalInput);
            if (!isNaN(value) && value > 0) {
              setGoal(metric, value);
            }
          }}
          className="px-3 py-1 text-sm rounded bg-primary text-primary-foreground"
        >
          Save
        </button>

        {currentGoal !== undefined && (
          <button
            onClick={() => clearGoal(metric)}
            className="px-3 py-1 text-sm rounded border text-muted-foreground"
          >
            Clear
          </button>
        )}
      </div>

      {streak > 0 && (
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
          🏆 {streak}-week streak
        </div>
      )}

      {/* Chart */}
      <div className="w-full h-64">
        {trendData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            No data available for this week.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDayLabel} />
              <YAxis />
              <Tooltip />

              {/* Goal line */}
              <GoalLine goal={currentGoal} />

              {/* Trend line */}
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
