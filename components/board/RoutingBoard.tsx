import { BUCKET_ORDER } from "@/lib/bucket-config";
import type { Atom, RouteContextResponse } from "@/lib/types";
import { BucketColumn } from "./BucketColumn";

type RoutingBoardProps = {
  result: RouteContextResponse | null;
  selectedCardId: string | null;
  atomsById: Map<string, Atom>;
  onSelectCard: (cardId: string) => void;
};

export function RoutingBoard({
  result,
  selectedCardId,
  atomsById,
  onSelectCard,
}: RoutingBoardProps) {
  return (
    <main className="min-w-0 bg-bg-canvas">
      <div className="mb-3 flex flex-col gap-1 border-b border-border-subtle pb-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Routing Board
          </p>
          <p className="mt-0.5 text-sm text-text-muted">
            {result
              ? result.run.summary
              : "Paste notes, route context, then review the buckets."}
          </p>
        </div>
        {result ? (
          <div className="shrink-0 text-[11px] tabular-nums text-text-muted">
            {result.atoms.length} atoms
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-3">
        {BUCKET_ORDER.map((bucket) => (
          <BucketColumn
            key={bucket}
            bucket={bucket}
            cards={result ? result.buckets[bucket] : []}
            emptyReason={result?.emptyBucketReasons[bucket] ?? undefined}
            selectedCardId={selectedCardId}
            atomsById={atomsById}
            onSelectCard={onSelectCard}
          />
        ))}
      </div>
    </main>
  );
}
