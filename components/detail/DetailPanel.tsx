"use client";

import { useState } from "react";
import { BUCKET_CONFIG } from "@/lib/bucket-config";
import type { Atom, Card, RewriteAction, ValidationIssue } from "@/lib/types";
import { CopyButton } from "@/components/shared/CopyButton";
import { StatusMessage } from "@/components/shared/StatusMessage";
import { QualityScores } from "./QualityScores";
import { RewriteActions } from "./RewriteActions";
import { RiskFlags } from "./RiskFlags";

type DetailPanelProps = {
  card: Card | null;
  atomsById: Map<string, Atom>;
  validationIssues: ValidationIssue[];
  loadingAction: RewriteAction | null;
  rewriteError: string | null;
  onRewrite: (action: RewriteAction) => Promise<void>;
};

type DetailPanelContentProps = Omit<DetailPanelProps, "card"> & {
  card: Card;
};

export function DetailPanel({
  card,
  atomsById,
  validationIssues,
  loadingAction,
  rewriteError,
  onRewrite,
}: DetailPanelProps) {
  if (!card) {
    return (
      <aside className="border-t border-zinc-200 bg-zinc-50 p-4 lg:border-l lg:border-t-0">
        <div className="rounded-md border border-dashed border-zinc-200 bg-white p-4 text-sm leading-6 text-zinc-500">
          Select a routed card to inspect the draft, source notes, reasoning, checks, and rewrite actions.
        </div>
      </aside>
    );
  }

  return (
    <DetailPanelContent
      key={card.id + card.draft}
      card={card}
      atomsById={atomsById}
      validationIssues={validationIssues}
      loadingAction={loadingAction}
      rewriteError={rewriteError}
      onRewrite={onRewrite}
    />
  );
}

function DetailPanelContent({
  card,
  atomsById,
  validationIssues,
  loadingAction,
  rewriteError,
  onRewrite,
}: DetailPanelContentProps) {
  const [draftText, setDraftText] = useState(card.draft);
  const bucketLabel = BUCKET_CONFIG[card.bucket].label;
  const sourceAtoms = card.sourceAtomIds
    .map((atomId) => atomsById.get(atomId))
    .filter(Boolean) as Atom[];

  return (
    <aside className="space-y-4 border-t border-zinc-200 bg-zinc-50 p-4 lg:border-l lg:border-t-0">
      <div>
        <div className="text-xs font-semibold uppercase tracking-normal text-zinc-500">
          {bucketLabel}
        </div>
        <h2 className="mt-1 text-lg font-semibold leading-6 text-zinc-950">
          {card.title}
        </h2>
      </div>

      {rewriteError ? (
        <StatusMessage tone="error" message={rewriteError} />
      ) : null}

      <label className="block">
        <div className="mb-2 text-sm font-semibold text-zinc-950">Draft</div>
        <textarea
          value={draftText}
          onChange={(event) => setDraftText(event.target.value)}
          className="min-h-[220px] w-full resize-y rounded-md border border-zinc-200 bg-white px-3 py-3 text-sm leading-6 text-zinc-950 shadow-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
        />
      </label>
      <CopyButton text={draftText} label="Copy draft" />

      <div>
        <h3 className="mb-2 text-sm font-semibold text-zinc-950">Sources</h3>
        <div className="space-y-2">
          {sourceAtoms.map((atom) => (
            <div
              key={atom.id}
              className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm leading-6 text-zinc-700"
            >
              <div className="mb-1 flex items-center justify-between gap-2 text-xs text-zinc-500">
                <span>{atom.id}</span>
                <span className="capitalize">{atom.sensitivity.replace("_", " ")}</span>
              </div>
              {atom.sourceSnippet}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-zinc-950">
          Why this was routed here
        </h3>
        <p className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm leading-6 text-zinc-700">
          {card.reason}
        </p>
      </div>

      <QualityScores card={card} />
      <RiskFlags card={card} issues={validationIssues} />
      <RewriteActions
        card={card}
        loadingAction={loadingAction}
        onRewrite={onRewrite}
      />
    </aside>
  );
}
