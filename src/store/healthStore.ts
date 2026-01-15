import { create } from "zustand";
import { persist } from "zustand/middleware";
import { HealthEntry } from "@/types/health";
import { validateHealthEntry } from "@/lib/validation/healthValidation";
import { normalizeDate } from "@/lib/analytics/healthAnalytics";
import { selectTodayEntries } from "@/lib/selectors/selectTodayEntries";
import { selectTodayEntryForMetric } from "@/lib/selectors/selectTodayEntryForMetric";

interface HealthState {
  entries: HealthEntry[];
  validationError: string | null;
  clearValidationError: () => void;
  addEntry: (entry: HealthEntry) => void;
  deleteEntry: (id: string) => void;
  updateEntry: (id: string, updates: Partial<HealthEntry>) => void;
  clearAll: () => void;
}

export const useHealthStore = create<HealthState>()(
  persist(
    (set) => ({
      entries: [],
      validationError: null,

      clearValidationError: () =>
        set({ validationError: null }),

        addEntry: (entry) => {
          set((state) => {
            // 1. Validate entry
            const result = validateHealthEntry(entry);
            if (!result.valid) {
              return {
                ...state,
                validationError: result.error,
              };
            }
        
            // 2. Check duplicate (same metric, same day)
            const entryDay = normalizeDate(entry.timestamp);
            const duplicateExists = state.entries.some(
              (existing) =>
                existing.metric === entry.metric &&
                normalizeDate(existing.timestamp) === entryDay
            );
        
            if (duplicateExists) {
              return {
                ...state,
                validationError: "You already logged this metric today.",
              };
            }
        
            // 3. Insert entry
            return {
              ...state,
              validationError: null,
              entries: [...state.entries, entry],
            };
          });
        },
                

      deleteEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        })),

      updateEntry: (id, updates) =>
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id ? { ...entry, ...updates } : entry
          ),
        })),

      clearAll: () =>
        set({
          entries: [],
          validationError: null,
        }),
    }),
    {
      name: "healthpulse-store",
    }
  )
);
