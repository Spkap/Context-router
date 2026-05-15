import { describe, expect, it } from "vitest";
import invalidPrivateLeak from "./fixtures/invalid-private-leak.json";
import invalidSourceMissing from "./fixtures/invalid-source-missing.json";
import validBoard from "./fixtures/valid-sample-board.json";
import { RouteContextModelOutputSchema } from "@/lib/schemas/routeContext.schema";
import {
  hasBlockingIssues,
  validateBoard,
} from "@/lib/validators/boardValidation";

describe("ContextRouter validators", () => {
  it("accepts the valid sample board", () => {
    const board = RouteContextModelOutputSchema.parse(validBoard);
    const issues = validateBoard(board);

    expect(hasBlockingIssues(issues)).toBe(false);
  });

  it("catches a card whose source atom does not exist", () => {
    const board = RouteContextModelOutputSchema.parse(invalidSourceMissing);
    const issues = validateBoard(board);

    expect(issues.some((issue) => issue.code === "UNKNOWN_SOURCE_ATOM")).toBe(
      true,
    );
    expect(hasBlockingIssues(issues)).toBe(true);
  });

  it("catches private atom leakage into public buckets", () => {
    const board = RouteContextModelOutputSchema.parse(invalidPrivateLeak);
    const issues = validateBoard(board);

    expect(
      issues.some((issue) => issue.code === "PRIVATE_SOURCE_IN_PUBLIC_OUTPUT"),
    ).toBe(true);
    expect(hasBlockingIssues(issues)).toBe(true);
  });

  it("allows empty buckets with explicit empty leave-out reason", () => {
    const board = RouteContextModelOutputSchema.parse({
      ...validBoard,
      buckets: {
        x_post: [],
        linkedin: [],
        follow_up: [],
        task: [],
        investor_update: [],
        private: [],
        leave_out: [],
      },
      emptyBucketReasons: {
        x_post: "No strong X post found in today's notes.",
        linkedin: "No strong LinkedIn post found in today's notes.",
        follow_up: "No follow-up messages found.",
        task: "No concrete tasks found.",
        investor_update: "No investor-safe update found.",
        private: "No private warnings found.",
        leave_out: "No content left out. All notes were useful and routed.",
      },
    });

    const issues = validateBoard(board);

    expect(hasBlockingIssues(issues)).toBe(false);
    expect(board.emptyBucketReasons.leave_out).toContain("No content left out");
  });
});
