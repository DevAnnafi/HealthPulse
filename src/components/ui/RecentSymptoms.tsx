"use client";

import { useState, useEffect } from 'react';
import { getRecentSymptoms, SymptomEntry } from '@/services/symptomService';

export default function RecentSymptoms() {

  // 4️⃣ Create state to hold the list of symptom entries
  // - this should start as an empty array
  // - it should be typed using SymptomEntry[]

  const [recentEntries, setRecentEntries] = useState<SymptomEntry[]>([]);


  // 5️⃣ Use useEffect to fetch recent symptoms
  // - this should run once when the component mounts
  // - call the service function here
  // - store the result in state
  useEffect(() => {
    async function loadSymptoms() {
        const data = await getRecentSymptoms();
        setRecentEntries(data);

    }
    loadSymptoms();
  }, []);



  // 7️⃣ Return JSX for the component
  // - a container div
  // - a small section title (e.g. "Recent Symptoms")
// 8️⃣ Loop over the symptom entries
  // - use map
  // - each entry should render:
  //   - symptom name
  //   - severity
  //   - duration
  //   - notes (only if they exist)
  return (
    <div>
       <h3> Recent Symptoms </h3> 
       <ul>
        {recentEntries.map(entry => (
            <li key={entry.createdAt.toISOString()}>
            <div>
              <div>{entry.symptom}</div>
          
              <div>
                Severity {entry.severity} · {entry.durationDays} day(s)
              </div>
          
              {entry.notes && (
                <div>{entry.notes}</div>
              )}
            </div>
          </li>
          

        ))}
       </ul>
    </div>
  )


  // 9️⃣ Keep this component READ-ONLY
  // - no submit logic
  // - no mutation
  // - no validation

}
