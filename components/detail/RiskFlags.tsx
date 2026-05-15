import type { Card, ValidationIssue } from "@/lib/types";

type RiskFlagsProps = {
  card: Card;
  issues: ValidationIssue[];
};

const riskClasses = {
  low: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400",
  medium: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400",
  high: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400",
};

export function RiskFlags({ card, issues }: RiskFlagsProps) {
  const cardIssues = issues.filter((issue) => issue.cardId === card.id);

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-text-primary">Risk flags</h3>
      <div className="flex flex-wrap gap-2">
        <span
          className={
            "rounded-full border px-2.5 py-1 text-xs font-medium capitalize " +
            riskClasses[card.riskLevel]
          }
        >
          {card.riskLevel} risk
        </span>
        {card.sourceAtomIds.map((atomId) => (
          <span
            key={atomId}
            className="rounded-full border border-border-subtle bg-bg-surface px-2.5 py-1 font-mono text-xs font-medium text-text-muted"
          >
            {atomId}
          </span>
        ))}
      </div>
      {cardIssues.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {cardIssues.map((issue, index) => (
            <li
              key={issue.code + index}
              className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900"
            >
              {issue.message}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
