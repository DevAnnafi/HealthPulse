"use client";

import { useState, useEffect } from "react";
import { useHealthStore } from "@/store/healthStore";
import { HealthEntry, HealthMetricType } from "@/types/health";
import { selectTodayEntryForMetric } from "@/lib/selectors/selectTodayEntryForMetric";

export default function SymptomForm() {
  /* ---------------------------------------------
     Store state
  --------------------------------------------- */

  const entries = useHealthStore((state) => state.entries);
  const addEntry = useHealthStore((state) => state.addEntry);
  const updateEntry = useHealthStore((state) => state.updateEntry);
  const validationError = useHealthStore((state) => state.validationError);
  const clearValidationError = useHealthStore(
    (state) => state.clearValidationError
  );

  /* ---------------------------------------------
     UI state
  --------------------------------------------- */

  const [symptom, setSymptom] = useState("");
  const [severity, setSeverity] = useState(1);
  const [durationDays, setDurationDays] = useState(1);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  /* ---------------------------------------------
     Metric (hardcoded for now)
  --------------------------------------------- */

  const metric: HealthMetricType = "steps";

  /* ---------------------------------------------
     Selector-derived state
  --------------------------------------------- */

  const existingEntryToday = selectTodayEntryForMetric(entries, metric);
  const isEditing = Boolean(existingEntryToday);

  /* ---------------------------------------------
     Prefill form when editing today’s entry
  --------------------------------------------- */

  useEffect(() => {
    if (existingEntryToday) {
      setSeverity(existingEntryToday.value);
      setSuccess(false);
    }
  }, [existingEntryToday]);

  /* ---------------------------------------------
     Submit handler
  --------------------------------------------- */

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // UI-level validation
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

    // Build domain entry
    const entry: HealthEntry = {
      id: crypto.randomUUID(),
      metric,
      value: severity,
      unit: "",
      timestamp: Date.now(),
    };

    // Edit vs create
    if (isEditing && existingEntryToday) {
      updateEntry(existingEntryToday.id, {
        value: severity,
        timestamp: Date.now(),
      });
    } else {
      addEntry(entry);
    }

    // Store-level validation feedback
    if (validationError) {
      setSuccess(false);
      return;
    }

    // Success
    setError("");
    clearValidationError();
    setSuccess(true);

    // Reset only non-persistent fields
    setSymptom("");
    setSeverity(1);
    setDurationDays(1);
    setNotes("");
  }

  /* ---------------------------------------------
     Render
  --------------------------------------------- */

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-lg border border-blue-100 bg-blue-50 p-6 space-y-6"
    >
      <h2 className="text-xl font-semibold text-blue-900">
        {isEditing ? "Edit Today’s Entry" : "Log a Symptom"}
      </h2>

      {success && (
        <p className="text-sm text-green-700">
          Entry saved successfully.
        </p>
      )}

      {error && (
        <p className="text-sm text-red-700">
          {error}
        </p>
      )}

      {validationError && (
        <p className="text-sm text-red-700">
          {validationError}
        </p>
      )}

      {/* Symptom */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-blue-800">
          Symptom
        </label>
        <input
          type="text"
          placeholder="Headache"
          value={symptom}
          onChange={(e) => {
            setSymptom(e.target.value);
            clearValidationError();
          }}
          className="w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm"
        />
      </div>

      {/* Severity */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-blue-800">
          Severity (1–10)
        </label>
        <select
          value={severity}
          onChange={(e) => {
            setSeverity(Number(e.target.value));
            clearValidationError();
          }}
          className="w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm"
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        {isEditing ? "Update Entry" : "Log Symptom"}
      </button>
    </form>
  );
}
