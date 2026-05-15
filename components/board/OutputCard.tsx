import { CopyButton } from "@/components/shared/CopyButton";
import type { Atom, Card } from "@/lib/types";

type OutputCardProps = {
  card: Card;
  sourceAtom?: Atom;
  isSelected: boolean;
  onSelect: (cardId: string) => void;
};

const riskClasses = {
  low: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400",
  medium: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400",
  high: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400",
};

export function OutputCard({
  card,
  sourceAtom,
  isSelected,
  onSelect,
}: OutputCardProps) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onSelect(card.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(card.id);
        }
      }}
      className={
        "group w-full cursor-pointer rounded border bg-bg-surface px-3 py-2.5 text-left transition-colors focus:outline-none " +
        (isSelected
          ? "border-border-strong bg-bg-surface-hover"
          : "border-border-subtle hover:border-border-strong hover:bg-bg-surface-hover")
      }
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium leading-5 text-text-primary">
          {card.title}
        </h3>
        <div className="flex shrink-0 items-center gap-1.5">
          <span
            className={
              "rounded border px-1.5 py-px text-[10px] font-medium capitalize leading-4 " +
              riskClasses[card.riskLevel]
            }
          >
            {card.riskLevel}
          </span>
          {/* Inline copy — only visible on hover / selected */}
          <div onClick={(event) => event.stopPropagation()}>
            <CopyButton text={card.draft} compact />
          </div>
        </div>
      </div>

      {/* Draft preview */}
      <p className="mt-1.5 line-clamp-3 text-xs leading-[1.6] text-text-muted">
        {card.draft}
      </p>

      {/* Source — tight inline label */}
      {sourceAtom ? (
        <p className="mt-1.5 truncate text-[11px] text-text-muted/60">
          <span className="font-medium text-text-muted">↗ </span>
          {sourceAtom.sourceSnippet}
        </p>
      ) : null}
    </article>
  );
}
