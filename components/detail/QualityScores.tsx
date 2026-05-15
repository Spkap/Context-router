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
      <h3 className="mb-2 text-sm font-semibold text-zinc-950">Checks</h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
        {Object.entries(card.qualityScores).map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between gap-3 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm"
          >
            <span className="text-zinc-600">
              {labelMap[key as keyof typeof labelMap]}
            </span>
            <span className="font-medium capitalize text-zinc-950">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
