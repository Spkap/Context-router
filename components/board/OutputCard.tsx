import { CopyButton } from "@/components/shared/CopyButton";
import type { Atom, Card } from "@/lib/types";

type OutputCardProps = {
  card: Card;
  sourceAtom?: Atom;
  isSelected: boolean;
  onSelect: (cardId: string) => void;
};

const riskClasses = {
  low: "border-emerald-200 bg-emerald-50 text-emerald-700",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
  high: "border-rose-200 bg-rose-50 text-rose-700",
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
        "w-full cursor-pointer rounded-md border bg-white p-3 text-left shadow-sm transition hover:border-zinc-300 hover:shadow focus:outline-none focus:ring-2 focus:ring-zinc-200 " +
        (isSelected ? "border-zinc-950 ring-2 ring-zinc-200" : "border-zinc-200")
      }
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold leading-5 text-zinc-950">
          {card.title}
        </h3>
        <span
          className={
            "shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize " +
            riskClasses[card.riskLevel]
          }
        >
          {card.riskLevel}
        </span>
      </div>
      <p className="line-clamp-4 whitespace-pre-line text-sm leading-5 text-zinc-700">
        {card.draft}
      </p>
      {sourceAtom ? (
        <div className="mt-3 rounded-md bg-zinc-50 px-2 py-2 text-xs leading-5 text-zinc-600">
          <span className="font-medium text-zinc-800">Source: </span>
          {sourceAtom.sourceSnippet}
        </div>
      ) : null}
      <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-500">
        {card.reason}
      </p>
      <div className="mt-3" onClick={(event) => event.stopPropagation()}>
        <CopyButton text={card.draft} compact />
      </div>
    </article>
  );
}
