import { useHealthStore } from "@/store/healthStore";
import { HealthEntry, HealthMetricType } from "@/types/health";
import { selectTodayEntryForMetric } from "@/lib/selectors/selectTodayEntryForMetric";

type UseTodayHealthEntryResult = {
  entry: HealthEntry | undefined;
  isEditing: boolean;
  hasEntryToday: boolean;
  save: (value: number) => void;
  validationError: string | null;
  clearValidationError: () => void;
};

export function useTodayHealthEntry(
  metric: HealthMetricType
): UseTodayHealthEntryResult {
  // Store state
  const entries = useHealthStore((state) => state.entries);
  const addEntry = useHealthStore((state) => state.addEntry);
  const updateEntry = useHealthStore((state) => state.updateEntry);
  const validationError = useHealthStore((state) => state.validationError);
  const clearValidationError = useHealthStore(
    (state) => state.clearValidationError
  );

  // Select today’s entry for this metric
  const entry = selectTodayEntryForMetric(entries, metric);

  const isEditing = Boolean(entry);
  const hasEntryToday = Boolean(entry);

  // Single action for UI
  function save(value: number) {
    if (isEditing && entry) {
      updateEntry(entry.id, {
        value,
        timestamp: Date.now(),
      });
      return;
    }

    const newEntry: HealthEntry = {
      id: crypto.randomUUID(),
      metric,
      value,
      unit: "",
      timestamp: Date.now(),
    };

    addEntry(newEntry);
  }

  return {
    entry,
    isEditing,
    hasEntryToday,
    save,
    validationError,
    clearValidationError,
  };
}
