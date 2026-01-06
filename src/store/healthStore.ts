import { create } from "zustand";
import { persist } from "zustand/middleware";
import { HealthEntry } from "@/types/health";

interface HealthState {
  entries: HealthEntry[];
  addEntry: (entry: HealthEntry) => void;
  deleteEntry: (id: string) => void;
  updateEntry: (id: string, updates: Partial<HealthEntry>) => void;
  clearAll: () => void;
}

export const useHealthStore = create<HealthState>()(
  persist(
    (set) => ({
      entries: [],

      addEntry: (entry) =>
        set((state) => ({
          entries: [...state.entries, entry],
        })),

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

      clearAll: () => set({ entries: [] }),
    }),
    {
      name: "healthpulse-store",
    }
  )
);
