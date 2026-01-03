"use client";

import { useState } from "react";

export default function SymptomForm() {
  const [symptom, setSymptom] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [severity, setSeverity] = useState(1);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Basic validation
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

    // Simulate submit
    console.log({ symptom, severity });

    // Reset state
    setError("");
    setSuccess(true);
    setSymptom("");
    setSeverity(1);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-lg border border-blue-100 bg-blue-50 p-6"
    >
      <h2 className="text-xl font-semibold mb-4 text-blue-900">
        Log a Symptom
      </h2>

      {/* Success Message */}
      {success && (
        <p className="mb-4 text-sm text-green-700">
          Symptom logged successfully.
        </p>
      )}

      {/* Error Message */}
      {error && (
        <p className="mb-4 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mb-4">
        <label
          htmlFor="symptom"
          className="block text-sm font-medium text-blue-800 mb-1"
        >
          Symptom
        </label>

        <input
          id="symptom"
          name="symptom"
          type="text"
          placeholder="Headache"
          value={symptom}
          onChange={(e) => setSymptom(e.target.value)}
          className="
            w-full
            rounded-md
            border
            border-blue-200
            bg-white
            px-3
            py-2
            text-sm
            text-gray-900
            focus:outline-none
            focus:ring-2
            focus:ring-blue-400
            focus:border-blue-400
          "
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Log Symptom
      </button>

      {/* Severity */}
      <div className="mb-6">
        <label
          htmlFor="severity"
          className="block text-sm font-medium text-blue-800 p-2 mb-1"
        >
          Severity (1–10)
        </label>

        <select
          id="severity"
          name="severity"
          value={severity}
          onChange={(e) => setSeverity(Number(e.target.value))}
          className="w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => (
            <option key={value} value={value}>
              {value} {value === 1 ? "(Mild)" : value === 10 ? "(Severe)" : ""}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Log Severity 
      </button>

    </form>
  );
}
