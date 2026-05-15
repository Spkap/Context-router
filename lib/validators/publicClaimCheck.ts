import { BUCKET_ORDER } from "../bucket-config";
import type { Card, RouteContextResponse, ValidationIssue } from "../types";
import type { Bucket, Buckets } from "../schemas/routeContext.schema";

type BoardLike = Pick<RouteContextResponse, "atoms" | "buckets">;

const PUBLIC_OR_INVESTOR_BUCKETS = new Set<Bucket>([
  "x_post",
  "linkedin",
  "investor_update",
]);

const NUMBER_OR_PERCENT = /\b\d[\d,.]*(?:%| percent| users?| customers?| founders?| hours?| days?| weeks?| months?| dollars?|\$)?\b/i;
const NAMED_ENTITY_HINT = /\b[A-Z][A-Za-z0-9&]*(?:\s+[A-Z][A-Za-z0-9&]*)+\b/;

function publicCards(buckets: Buckets): Card[] {
  return BUCKET_ORDER.flatMap((bucket) =>
    PUBLIC_OR_INVESTOR_BUCKETS.has(bucket) ? buckets[bucket] : [],
  );
}

function hasHighRiskClaimText(draft: string) {
  return NUMBER_OR_PERCENT.test(draft) || NAMED_ENTITY_HINT.test(draft);
}

export function validatePublicClaimSupport(board: BoardLike): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const card of publicCards(board.buckets)) {
    if (card.claims.length === 0) {
      issues.push({
        code: "PUBLIC_CARD_MISSING_CLAIMS",
        severity: "warning",
        message:
          "Public and investor cards should list explicit source-supported claims.",
        cardId: card.id,
        atomId: null,
      });
    }

    if (hasHighRiskClaimText(card.draft) && card.claims.length === 0) {
      issues.push({
        code: "HIGH_RISK_PUBLIC_CLAIM_WITHOUT_SUPPORT",
        severity: "error",
        message:
          "A public or investor draft appears to contain specific claims without claim/source entries.",
        cardId: card.id,
        atomId: null,
      });
    }
  }

  return issues;
}
