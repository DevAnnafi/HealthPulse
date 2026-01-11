import { describe, it, expect, beforeEach } from "vitest";
import { useHealthStore } from "@/store/healthStore";
import { HealthEntry } from "@/types/health";

describe("HealthStore duplicate entry prevention", () => {
  const baseTimestamp = new Date("2026-01-10T12:00:00Z").getTime();

  const createEntry = (
    overrides?: Partial<HealthEntry>
  ): HealthEntry => ({
    id: crypto.randomUUID(),
    metric: "steps",
    value: 5000,
    unit: "steps",
    timestamp: baseTimestamp,
    ...overrides,
  });

  beforeEach(() => {
    useHealthStore.setState({
      entries: [],
      validationError: null,
    });
  });

  it("allows the first entry for a metric on a given day", () => {
    const entry = createEntry();

    useHealthStore.getState().addEntry(entry);

    const { entries, validationError } = useHealthStore.getState();

    expect(entries.length).toBe(1);
    expect(validationError).toBeNull();
  });

  it("rejects duplicate metric entries on the same day", () => {
    const entry1 = createEntry();
    const entry2 = createEntry(); // same metric + same day

    const store = useHealthStore.getState();

    store.addEntry(entry1);
    store.addEntry(entry2);

    const { entries, validationError } = useHealthStore.getState();

    expect(entries.length).toBe(1);
    expect(validationError).toBe(
      "You already logged this metric today."
    );
  });

  it("allows the same metric on a different day", () => {
    const entryDay1 = createEntry();

    const entryDay2 = createEntry({
      timestamp: baseTimestamp + 1000 * 60 * 60 * 24, // next day
    });

    const store = useHealthStore.getState();

    store.addEntry(entryDay1);
    store.addEntry(entryDay2);

    const { entries, validationError } = useHealthStore.getState();

    expect(entries.length).toBe(2);
    expect(validationError).toBeNull();
  });

  it("allows different metrics on the same day", () => {
    const stepsEntry = createEntry({
      metric: "steps",
    });

    const sleepEntry = createEntry({
      metric: "sleep",
      value: 8,
      unit: "hours",
    });

    const store = useHealthStore.getState();

    store.addEntry(stepsEntry);
    store.addEntry(sleepEntry);

    const { entries, validationError } = useHealthStore.getState();

    expect(entries.length).toBe(2);
    expect(validationError).toBeNull();
  });
});
