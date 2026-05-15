import {
  MessageSquare,
  BriefcaseBusiness,
  MailQuestion,
  ListTodo,
  TrendingUp,
  Lock,
  ArchiveX,
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
  x_post: MessageSquare,
  linkedin: BriefcaseBusiness,
  follow_up: MailQuestion,
  task: ListTodo,
  investor_update: TrendingUp,
  private: Lock,
  leave_out: ArchiveX,
};

const accentClasses = {
  sky: "bg-sky-500",
  indigo: "bg-indigo-500",
  amber: "bg-amber-500",
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  rose: "bg-rose-500",
  zinc: "bg-zinc-500",
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
    <section className="min-w-0 rounded border border-border-subtle bg-bg-surface">
      <div className="mb-2 flex items-center justify-between gap-2 px-3 pt-3">
        <div className="flex min-w-0 items-center gap-1.5">
          <div
            className={
              "h-1.5 w-1.5 shrink-0 rounded-full " +
              accentClasses[config.accent as keyof typeof accentClasses]
            }
          />
          <Icon className="h-3.5 w-3.5 text-text-muted" />
          <h2 className="truncate text-xs font-semibold uppercase tracking-wide text-text-muted">
            {config.label}
          </h2>
        </div>
        <span className="shrink-0 rounded border border-border-subtle bg-bg-canvas px-1.5 py-px text-[11px] font-medium tabular-nums text-text-muted">
          {cards.length}
        </span>
      </div>
      <div className="space-y-1.5 px-3 pb-3">
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
