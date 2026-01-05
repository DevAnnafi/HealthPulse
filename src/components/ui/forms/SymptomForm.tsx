"use client";

import { useState } from "react";
import { submitSymptom } from "@/services/symptomService";

export default function SymptomForm() {
  const [symptom, setSymptom] = useState("");
  const [severity, setSeverity] = useState(1);
  const [durationDays, setDurationDays] = useState(1);
  const [error, setError] = useState("");
  const[notes, setNotes]= useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!symptom.trim()) {
      setError("Symptom is required.");
      setSuccess(false);
      return;
    }

    if (severity < 1 || severity > 10) {
      setError("Severity must be between 1 and 10.");
      setSuccess(false);
      return;
    }

    if (durationDays < 1) {
      setError("Duration must be at least 1 day.");
      setSuccess(false);
      return;
    }

   await submitSymptom({ symptom, severity, durationDays, notes });

    setError("");
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

      {success && (
        <p className="text-sm text-green-700">
          Symptom logged successfully.
        </p>
      )}

      {error && (
        <p className="text-sm text-red-700">
          {error}
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
          onChange={(e) => setSymptom(e.target.value)}
          className="w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Severity */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-blue-800">
          Severity (1–10)
        </label>
        <select
          value={severity}
          onChange={(e) => setSeverity(Number(e.target.value))}
          className="w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => (
            <option key={value} value={value}>
              {value} {value === 1 ? "(Mild)" : value === 10 ? "(Severe)" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Duration */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-blue-800">
          Duration (days)
        </label>
        <input
          type="number"
          min={1}
          value={durationDays}
          onChange={(e) => setDurationDays(Number(e.target.value))}
          className="w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Notes */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-blue-800">
          Additional Notes (optional)
        </label>
        <textarea
          rows={3}
          placeholder="Triggers, time of day, medications taken, etc."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Log Symptom
      </button>
    </form>
  );
}
