"use client";

import { useState } from "react";
import { useHealthStore } from "@/store/healthStore";
import { HealthEntry } from "@/types/health";
import { selectTodayEntryForMetric } from "@/lib/selectors/selectTodayEntryForMetric";

export default function SymptomForm() {
  // Store state
  const entries = useHealthStore((state) => state.entries);
  const addEntry = useHealthStore((state) => state.addEntry);
  const validationError = useHealthStore((state) => state.validationError);
  const clearValidationError = useHealthStore((state) => state.clearValidationError);

  // UI state
  const [symptom, setSymptom] = useState("");
  const [severity, setSeverity] = useState(1);
  const [durationDays, setDurationDays] = useState(1);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Metric for this form (hardcoded for now)
  const metric = "steps";

  // Selector-driven derived state
  const existingEntryToday = selectTodayEntryForMetric(entries, metric);
  const hasLoggedToday = Boolean(existingEntryToday);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (hasLoggedToday) return;

    if (!symptom.trim()) {
      setError("Symptom is required.");
      return;
    }

    if (severity < 1 || severity > 10) {
      setError("Severity must be between 1 and 10.");
      return;
    }

    if (durationDays < 1) {
      setError("Duration must be at least 1 day.");
      return;
    }

    const entry: HealthEntry = {
      id: crypto.randomUUID(),
      metric,
      value: severity,
      unit: "",
      timestamp: Date.now(),
    };

    addEntry(entry);

    if (validationError) return;

    setError("");
    clearValidationError();
    setSuccess(true);

    setSymptom("");
    setSeverity(1);
    setDurationDays(1);
    setNotes("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-lg border border-blue-100 bg-blue-50 p-6 space-y-6"
    >
      <h2 className="text-xl font-semibold text-blue-900">
        Log a Symptom
      </h2>

      {success && <p className="text-sm text-green-700">Symptom logged successfully.</p>}
      {error && <p className="text-sm text-red-700">{error}</p>}
      {validationError && <p className="text-sm text-red-700">{validationError}</p>}

      <input
        type="text"
        placeholder="Headache"
        value={symptom}
        onChange={(e) => {
          setSymptom(e.target.value);
          clearValidationError();
        }}
        className="w-full rounded-md border px-3 py-2 text-sm"
      />

      <select
        value={severity}
        onChange={(e) => {
          setSeverity(Number(e.target.value));
          clearValidationError();
        }}
        className="w-full rounded-md border px-3 py-2 text-sm"
      >
        {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
          <option key={v} value={v}>{v}</option>
        ))}
      </select>

      <button
        type="submit"
        disabled={hasLoggedToday}
        className={`w-full rounded-md py-2 text-sm font-medium ${
          hasLoggedToday
            ? "cursor-not-allowed bg-gray-300 text-gray-500"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {hasLoggedToday ? "Already logged today" : "Log Symptom"}
      </button>
    </form>
  );
}
