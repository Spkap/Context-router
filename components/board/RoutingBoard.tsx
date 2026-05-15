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
    <main className="min-w-0 bg-white p-4">
      <div className="mb-4 flex flex-col gap-2 border-b border-zinc-200 pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-base font-semibold text-zinc-950">
            Routing Board
          </h2>
          <p className="text-sm text-zinc-600">
            {result
              ? result.run.summary
              : "Paste notes, route context, then review the buckets."}
          </p>
        </div>
        {result ? (
          <div className="text-xs leading-5 text-zinc-500">
            {result.atoms.length} atoms extracted
          </div>
        ) : null}
      </div>
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2 2xl:grid-cols-3">
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
