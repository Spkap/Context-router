import { describe, expect, it } from "vitest";
import { SAMPLE_CONTEXTS } from "@/lib/sample-data";
import { RouteContextRequestSchema } from "@/lib/schemas/routeContext.schema";

describe("sample data", () => {
  it("provides several selectable frontend-ready samples", () => {
    expect(SAMPLE_CONTEXTS).toHaveLength(5);

    const ids = new Set(SAMPLE_CONTEXTS.map((sample) => sample.id));
    const labels = SAMPLE_CONTEXTS.map((sample) => sample.label);

    expect(ids.size).toBe(SAMPLE_CONTEXTS.length);
    expect(labels).toEqual([
      "Day 1",
      "Day 2",
      "Day 3",
      "Day 4",
      "Day 5",
    ]);
  });

  it("matches the route-context request fields and limits", () => {
    for (const sample of SAMPLE_CONTEXTS) {
      expect(() =>
        RouteContextRequestSchema.parse({
          dailyDump: sample.dailyDump,
          voiceSamples: sample.voiceSamples,
          mode: sample.mode,
        }),
      ).not.toThrow();
    }
  });

  it("covers the routing buckets the MVP is meant to prove", () => {
    const combinedSamples = SAMPLE_CONTEXTS.map(
      (sample) => sample.dailyDump,
    ).join("\n");

    expect(combinedSamples).toMatch(/follow/i);
    expect(combinedSamples).toMatch(/task/i);
    expect(combinedSamples).toMatch(/investor-safe|investor update/i);
    expect(combinedSamples).toMatch(/Campus Fund/i);
    expect(combinedSamples).toMatch(/investment call/i);
    expect(combinedSamples).toMatch(/private/i);
    expect(combinedSamples).toMatch(/leave out/i);
  });

  it("makes each seed exercise the full routing board", () => {
    for (const sample of SAMPLE_CONTEXTS) {
      expect(sample.dailyDump).toMatch(/possible x|possible post|thinking/i);
      expect(sample.dailyDump).toMatch(/possible linkedin|linkedin/i);
      expect(sample.dailyDump).toMatch(/follow up|follow-up/i);
      expect(sample.dailyDump).toMatch(/task:|need to|ask /i);
      expect(sample.dailyDump).toMatch(/investor-safe|possible update/i);
      expect(sample.dailyDump).toMatch(/private/i);
      expect(sample.dailyDump).toMatch(/leave out|noise:|not post-worthy|too generic/i);
    }
  });
});
