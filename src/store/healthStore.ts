import { create } from "zustand";
import { persist } from "zustand/middleware";
import { HealthEntry } from "@/types/health";
import { validateHealthEntry } from "@/lib/validation/healthValidation";

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
        const result = validateHealthEntry(entry);

        if (!result.valid) {
          set({ validationError: result.error });
          return;
        }

        set((state) => ({
          validationError: null,
          entries: [...state.entries, entry],
        }));
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
