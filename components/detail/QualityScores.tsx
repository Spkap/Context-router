import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import type { Card } from "@/lib/types";

type QualityScoresProps = {
  card: Card;
};

const labelMap = {
  specificity: "Specificity",
  privacyRisk: "Privacy risk",
  slopRisk: "Slop risk",
  voiceMatch: "Voice match",
  supportLevel: "Support level",
};

export function QualityScores({ card }: QualityScoresProps) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-text-primary">Checks</h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
        {Object.entries(card.qualityScores).map(([key, value]) => {
          let Icon = CheckCircle2;
          let iconColor = "text-emerald-500";

          if (value === "medium") {
            Icon = AlertTriangle;
            iconColor = "text-amber-500";
          } else if (value === "high" || value === "low") {
            // Note: depends on if high is bad (risk) or good (specificity).
            // In typical scores: high risk = bad, high specificity = good.
            if (key.toLowerCase().includes("risk") && value === "high") {
              Icon = XCircle;
              iconColor = "text-rose-500";
            }
          }

          return (
            <div
              key={key}
              className="flex items-center justify-between gap-3 rounded-md border border-border-subtle bg-bg-surface px-3 py-2 text-sm"
            >
              <span className="text-text-muted">
                {labelMap[key as keyof typeof labelMap]}
              </span>
              <div className="flex items-center gap-1.5 font-medium capitalize text-text-primary">
                <Icon className={"h-3.5 w-3.5 " + iconColor} />
                {value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
