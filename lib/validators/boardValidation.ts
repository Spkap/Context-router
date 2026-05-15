import type { RouteContextResponse, ValidationIssue } from "../types";
import { validatePrivacyRouting } from "./privacyCheck";
import { validatePublicClaimSupport } from "./publicClaimCheck";
import { validateSourceSupport } from "./sourceCheck";

type BoardLike = Pick<RouteContextResponse, "atoms" | "buckets">;

export function validateBoard(board: BoardLike): ValidationIssue[] {
  return [
    ...validateSourceSupport(board),
    ...validatePrivacyRouting(board),
    ...validatePublicClaimSupport(board),
  ];
}

export function hasBlockingIssues(issues: ValidationIssue[]) {
  return issues.some((issue) => issue.severity === "error");
}
