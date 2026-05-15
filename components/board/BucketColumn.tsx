import {
  BriefcaseBusiness,
  CircleSlash,
  Mail,
  MessageSquareText,
  Shield,
  SquareCheck,
  TrendingUp,
} from "lucide-react";
import { BUCKET_CONFIG } from "@/lib/bucket-config";
import type { Atom, Bucket, Card } from "@/lib/types";
import { EmptyBucket } from "./EmptyBucket";
import { OutputCard } from "./OutputCard";

type BucketColumnProps = {
  bucket: Bucket;
  cards: Card[];
  emptyReason?: string;
  selectedCardId: string | null;
  atomsById: Map<string, Atom>;
  onSelectCard: (cardId: string) => void;
};

const icons = {
  x_post: MessageSquareText,
  linkedin: BriefcaseBusiness,
  follow_up: Mail,
  task: SquareCheck,
  investor_update: TrendingUp,
  private: Shield,
  leave_out: CircleSlash,
};

const accentClasses = {
  sky: "border-sky-200 bg-sky-50 text-sky-700",
  indigo: "border-indigo-200 bg-indigo-50 text-indigo-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  violet: "border-violet-200 bg-violet-50 text-violet-700",
  rose: "border-rose-200 bg-rose-50 text-rose-700",
  zinc: "border-zinc-200 bg-zinc-100 text-zinc-700",
};

export function BucketColumn({
  bucket,
  cards,
  emptyReason,
  selectedCardId,
  atomsById,
  onSelectCard,
}: BucketColumnProps) {
  const config = BUCKET_CONFIG[bucket];
  const Icon = icons[bucket];

  return (
    <section className="min-w-0 rounded-md border border-zinc-200 bg-white p-3 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div
            className={
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border " +
              accentClasses[config.accent as keyof typeof accentClasses]
            }
          >
            <Icon className="h-4 w-4" />
          </div>
          <h2 className="truncate text-sm font-semibold text-zinc-950">
            {config.label}
          </h2>
        </div>
        <span className="shrink-0 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-600">
          {cards.length}
        </span>
      </div>
      <div className="space-y-3">
        {cards.length === 0 ? (
          <EmptyBucket message={emptyReason || config.empty} />
        ) : (
          cards.map((card) => (
            <OutputCard
              key={card.id}
              card={card}
              sourceAtom={atomsById.get(card.sourceAtomIds[0])}
              isSelected={selectedCardId === card.id}
              onSelect={onSelectCard}
            />
          ))
        )}
      </div>
    </section>
  );
}
