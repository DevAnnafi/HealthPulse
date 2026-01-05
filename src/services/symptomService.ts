export type SymptomEntry = {
    symptom: string;
    severity: number;
    durationDays: number;
    notes?: string;
    createdAt: Date;
};

const entries: SymptomEntry[] = [];

export async function submitSymptom(
    data: Omit<SymptomEntry, "createdAt">
) {
    const newEntry = {
        // spread data
        ...data,
        // add createdAt
        createdAt: new Date(),
    };

    entries.unshift(newEntry);

    return newEntry;
}

export async function getRecentSymptoms(limit = 5) {
    // return a slice of entries
    return entries.slice(0, limit);
}