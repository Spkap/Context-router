import { BUCKET_ORDER } from "../bucket-config";
import type { Atom, Card, RouteContextResponse, ValidationIssue } from "../types";
import type { Buckets } from "../schemas/routeContext.schema";

type BoardLike = Pick<RouteContextResponse, "atoms" | "buckets">;

function allCards(buckets: Buckets): Card[] {
  return BUCKET_ORDER.flatMap((bucket) => buckets[bucket]);
}

export function validateSourceSupport(board: BoardLike): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const validAtomIds = new Set(board.atoms.map((atom: Atom) => atom.id));

  for (const card of allCards(board.buckets)) {
    if (card.sourceAtomIds.length === 0) {
      issues.push({
        code: "CARD_MISSING_SOURCE",
        severity: "error",
        message: "Every card must cite at least one source atom.",
        cardId: card.id,
        atomId: null,
      });
    }

    for (const atomId of card.sourceAtomIds) {
      if (!validAtomIds.has(atomId)) {
        issues.push({
          code: "UNKNOWN_SOURCE_ATOM",
          severity: "error",
          message: "Card references a missing source atom.",
          cardId: card.id,
          atomId,
        });
      }
    }

    for (const claim of card.claims) {
      for (const atomId of claim.sourceAtomIds) {
        if (!validAtomIds.has(atomId)) {
          issues.push({
            code: "UNKNOWN_CLAIM_SOURCE_ATOM",
            severity: "error",
            message: "Claim references a missing source atom.",
            cardId: card.id,
            atomId,
          });
        }
      }
    }
  }

  return issues;
}
