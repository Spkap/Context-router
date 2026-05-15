import { Loader2, Wand2 } from "lucide-react";
import type { Card, RewriteAction } from "@/lib/types";

type RewriteActionsProps = {
  card: Card;
  loadingAction: RewriteAction | null;
  onRewrite: (action: RewriteAction) => Promise<void>;
};

const actionLabels: Record<RewriteAction, string> = {
  make_sharper: "Make sharper",
  less_formal: "Less formal",
  cut_30: "Cut 30%",
  more_like_my_voice: "More like my voice",
  make_x_version: "Make X version",
  make_linkedin_version: "Make LinkedIn version",
  make_investor_safe: "Make investor-safe",
  make_public_safe: "Make public-safe",
};

const fallbackActions: Record<Card["bucket"], RewriteAction[]> = {
  x_post: ["make_sharper", "cut_30", "more_like_my_voice", "make_linkedin_version"],
  linkedin: ["make_sharper", "less_formal", "cut_30", "make_x_version"],
  follow_up: ["less_formal", "cut_30", "more_like_my_voice"],
  task: ["make_sharper", "cut_30"],
  investor_update: ["make_sharper", "cut_30", "make_public_safe"],
  private: ["make_public_safe", "cut_30"],
  leave_out: ["make_public_safe", "make_sharper"],
};

export function RewriteActions({
  card,
  loadingAction,
  onRewrite,
}: RewriteActionsProps) {
  const actions =
    card.suggestedActions.length > 0
      ? card.suggestedActions
      : fallbackActions[card.bucket];

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-text-primary">Rewrite</h3>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => {
          const isLoading = loadingAction === action;

          return (
            <button
              key={action}
              type="button"
              disabled={Boolean(loadingAction)}
              onClick={() => onRewrite(action)}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border-strong bg-bg-surface px-3 text-sm font-medium text-text-primary shadow-sm transition hover:border-text-primary hover:bg-bg-surface-hover disabled:cursor-wait disabled:opacity-60"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4 text-text-muted" />
              )}
              {actionLabels[action]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
