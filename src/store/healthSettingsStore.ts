import { create } from "zustand";
import { persist } from "zustand/middleware";
import { HealthMetricType } from "@/types/health";

type HealthGoalsState = {
  goals: Partial<Record<HealthMetricType, number>>;
  setGoal: (metric: HealthMetricType, value: number) => void;
  clearGoal: (metric: HealthMetricType) => void;
};

export const useHealthGoalsStore = create<HealthGoalsState>()(
  persist(
    (set) => ({
      goals: {},

      setGoal: (metric, value) =>
        set((state) => ({
          goals: {
            ...state.goals,
            [metric]: value,
          },
        })),

      clearGoal: (metric) =>
        set((state) => {
          const { [metric]: _, ...rest } = state.goals;
          return { goals: rest };
        }),
    }),
    {
      name: "health-goals", // localStorage key
    }
  )
);
