"use client";

import {useState} from 'react';

export default function SymptomForm() {
    return (
      <form className="w-full max-w-md border rounded-md p-6">
        <h2 className="text-xl font-semibold mb-4">
            Log a Symptom
        </h2>

        <label htmlFor="symptom" className="block text-sm font-medium ">
            Symptom

        </label>
        <input
            id="symptom"
            name="symptom"
            type="text"
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

      </form>
    );
  }
  