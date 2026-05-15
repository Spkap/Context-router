import { BUCKET_ORDER } from "../bucket-config";
import type { Atom, Card, RouteContextResponse, ValidationIssue } from "../types";
import type { Bucket, Buckets } from "../schemas/routeContext.schema";

type BoardLike = Pick<RouteContextResponse, "atoms" | "buckets">;

const PUBLIC_OR_INVESTOR_BUCKETS = new Set<Bucket>([
  "x_post",
  "linkedin",
  "investor_update",
]);

const PUBLIC_BUCKETS = new Set<Bucket>(["x_post", "linkedin"]);
const PRIVATE_DIRECTIVE = /\b(do not|don't|private|confidential|not mention|not share|keep internal)\b/i;

function getAtomMap(atoms: Atom[]) {
  return new Map(atoms.map((atom) => [atom.id, atom]));
}

function allBucketCards(buckets: Buckets): Array<{ bucket: Bucket; card: Card }> {
  return BUCKET_ORDER.flatMap((bucket) =>
    buckets[bucket].map((card) => ({ bucket, card })),
  );
}

export function validatePrivacyRouting(board: BoardLike): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const atomsById = getAtomMap(board.atoms);

  for (const { bucket, card } of allBucketCards(board.buckets)) {
    for (const atomId of card.sourceAtomIds) {
      const atom = atomsById.get(atomId);

      if (!atom) {
        continue;
      }

      if (
        atom.sensitivity === "private" &&
        PUBLIC_OR_INVESTOR_BUCKETS.has(bucket)
      ) {
        issues.push({
          code: "PRIVATE_SOURCE_IN_PUBLIC_OUTPUT",
          severity: "error",
          message:
            "Private source atoms cannot be used in public or investor outputs.",
          cardId: card.id,
          atomId,
        });
      }

      if (atom.sensitivity === "internal_only" && PUBLIC_BUCKETS.has(bucket)) {
        issues.push({
          code: "INTERNAL_SOURCE_IN_PUBLIC_OUTPUT",
          severity: "error",
          message: "Internal-only source atoms cannot be used in public posts.",
          cardId: card.id,
          atomId,
        });
      }

      if (
        atom.sensitivity === "unknown" &&
        PUBLIC_OR_INVESTOR_BUCKETS.has(bucket)
      ) {
        issues.push({
          code: "UNKNOWN_SENSITIVITY_IN_PUBLIC_OUTPUT",
          severity: "warning",
          message:
            "A public or investor output is using a source atom with unknown sensitivity.",
          cardId: card.id,
          atomId,
        });
      }

      if (
        bucket === "leave_out" &&
        atom.sensitivity === "private" &&
        PRIVATE_DIRECTIVE.test(atom.sourceSnippet + " " + atom.cleanedMeaning)
      ) {
        issues.push({
          code: "PRIVATE_WARNING_IN_LEAVE_OUT",
          severity: "error",
          message:
            "Private directives should be represented in the Private bucket, not only Leave Out.",
          cardId: card.id,
          atomId,
        });
      }
    }
  }

  return issues;
}
