"use client";

import { useState } from "react";
import { useTodayHealthEntry } from "@/hooks/useTodayHealthEntry";
import { HealthMetricType } from "@/types/health";

export default function SymptomForm() {
  const metric: HealthMetricType = "steps";

  const {
    entry,
    isEditing,
    hasEntryToday,
    save,
    validationError,
    clearValidationError,
  } = useTodayHealthEntry(metric);

  const [severity, setSeverity] = useState(entry?.value ?? 1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // UI-level validation only
    if (severity < 1 || severity > 10) {
      setError("Severity must be between 1 and 10.");
      return;
    }

    save(severity);

    if (validationError) {
      setSuccess(false);
      return;
    }

    setError("");
    clearValidationError();
    setSuccess(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-lg border bg-blue-50 p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold text-blue-900">
        {isEditing ? "Update Today's Entry" : "Log Today's Entry"}
      </h2>

      {success && (
        <p className="text-sm text-green-700">
          Entry saved successfully.
        </p>
      )}

      {error && <p className="text-sm text-red-700">{error}</p>}

      {validationError && (
        <p className="text-sm text-red-700">{validationError}</p>
      )}

      <select
        value={severity}
        onChange={(e) => {
          setSeverity(Number(e.target.value));
          clearValidationError();
        }}
        className="w-full rounded-md border px-3 py-2 text-sm"
      >
        {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        {isEditing ? "Update Entry" : "Log Entry"}
      </button>
    </form>
  );
}
