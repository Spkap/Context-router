import { generateObject } from "ai";
import { BUCKET_ORDER } from "../bucket-config";
import type { Buckets } from "../schemas/routeContext.schema";
import {
  RewriteCardModelOutputSchema,
  type RewriteCardRequest,
  type RewriteCardResponse,
} from "../schemas/rewrite.schema";
import { hasBlockingIssues, validateBoard } from "../validators/boardValidation";
import { buildRewritePrompt } from "./prompts";
import {
  InvalidModelOutputError,
  isProviderQuotaExceeded,
  logModelFailure,
  ModelFailureError,
  ProviderQuotaExceededError,
  ValidationFailedError,
} from "./routeContext";
import { getOpenAIModelConfig } from "./modelConfig";

function bucketsForSingleCard(card: RewriteCardResponse["card"]): Buckets {
  const buckets = Object.fromEntries(
    BUCKET_ORDER.map((bucket) => [bucket, []]),
  ) as unknown as Buckets;

  buckets[card.bucket] = [card];
  return buckets;
}

export async function rewriteCard(
  input: RewriteCardRequest,
): Promise<RewriteCardResponse> {
  try {
    const result = await generateObject({
      ...getOpenAIModelConfig(),
      schema: RewriteCardModelOutputSchema,
      prompt: buildRewritePrompt(input),
    });

    const parsed = RewriteCardModelOutputSchema.safeParse(result.object);

    if (!parsed.success) {
      throw new InvalidModelOutputError(parsed.error.flatten());
    }

    const card = {
      ...parsed.data.card,
      id: input.card.id,
    };

    const identityIssues =
      parsed.data.card.id === input.card.id
        ? []
        : [
            {
              code: "REWRITE_CHANGED_CARD_ID",
              severity: "warning" as const,
              message:
                "The rewrite changed the card id; the server preserved the selected card id.",
              cardId: input.card.id,
              atomId: null,
            },
          ];

    const validationIssues = validateBoard({
      atoms: input.atoms,
      buckets: bucketsForSingleCard(card),
    });

    const allIssues = [
      ...parsed.data.validationIssues,
      ...identityIssues,
      ...validationIssues,
    ];

    if (hasBlockingIssues(allIssues)) {
      throw new ValidationFailedError(allIssues);
    }

    return {
      card,
      validationIssues: allIssues,
    };
  } catch (error) {
    if (
      error instanceof InvalidModelOutputError ||
      error instanceof ValidationFailedError
    ) {
      throw error;
    }

    logModelFailure("[rewrite-card] model failure", error);
    if (isProviderQuotaExceeded(error)) {
      throw new ProviderQuotaExceededError();
    }
    throw new ModelFailureError();
  }
}
