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
      <aside className="flex h-full flex-col items-center justify-center border-t border-border-subtle bg-bg-surface p-8 text-center lg:border-l lg:border-t-0">
        <div className="mb-2 text-text-muted/40">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        </div>
        <p className="text-sm text-text-muted">
          Select a card to inspect its draft,
          <br />source notes, and checks.
        </p>
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
    <aside className="space-y-4 p-4">
      <div>
        <div className="text-xs font-semibold uppercase tracking-normal text-text-muted">
          {bucketLabel}
        </div>
        <h2 className="mt-1 text-lg font-semibold leading-6 text-text-primary">
          {card.title}
        </h2>
      </div>

      {rewriteError ? (
        <StatusMessage tone="error" message={rewriteError} />
      ) : null}

      <label className="block">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-text-primary">Draft</span>
          <CopyButton text={draftText} label="Copy draft" compact />
        </div>
        <textarea
          value={draftText}
          onChange={(event) => setDraftText(event.target.value)}
          className="min-h-[200px] w-full resize-y rounded-md border border-border-subtle bg-bg-surface px-3 py-3 font-mono text-sm leading-6 text-text-primary outline-none focus:border-border-strong focus:ring-1 focus:ring-border-strong"
        />
      </label>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-text-primary">Sources</h3>
        <div className="space-y-2">
          {sourceAtoms.map((atom) => (
            <div
              key={atom.id}
              className="rounded-md border border-border-subtle bg-bg-surface-hover px-3 py-2 font-mono text-sm leading-6 text-text-muted"
            >
              <div className="mb-1 flex items-center justify-between gap-2 font-sans text-xs text-text-muted/70">
                <span>{atom.id}</span>
                <span className="capitalize">{atom.sensitivity.replace("_", " ")}</span>
              </div>
              {atom.sourceSnippet}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-text-primary">
          Why this was routed here
        </h3>
        <p className="rounded-md border border-border-subtle bg-bg-surface-hover px-3 py-2 text-sm leading-6 text-text-muted">
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
