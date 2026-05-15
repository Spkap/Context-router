import { ZodError } from "zod";
import { apiFailure, apiSuccess } from "@/lib/api/envelope";
import {
  InvalidModelOutputError,
  ModelFailureError,
  ProviderQuotaExceededError,
  ValidationFailedError,
} from "@/lib/ai/routeContext";
import { rewriteCard } from "@/lib/ai/rewriteCard";
import { RewriteCardRequestSchema } from "@/lib/schemas/rewrite.schema";

export const runtime = "nodejs";

function invalidRequestMessage(error: ZodError) {
  const cardIssue = error.issues.find((issue) => issue.path.includes("card"));

  if (cardIssue) {
    return "The selected card is not valid.";
  }

  return "The rewrite request is invalid.";
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return apiFailure(
      "INVALID_REQUEST",
      "The request body is not valid JSON.",
      400,
    );
  }

  const parsed = RewriteCardRequestSchema.safeParse(body);

  if (!parsed.success) {
    return apiFailure(
      "INVALID_REQUEST",
      invalidRequestMessage(parsed.error),
      400,
      parsed.error.flatten(),
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return apiFailure(
      "MISSING_API_KEY",
      "AI routing is not configured yet. Add OPENAI_API_KEY to run the model.",
      500,
    );
  }

  try {
    const result = await rewriteCard(parsed.data);
    return apiSuccess(result);
  } catch (error) {
    if (error instanceof ValidationFailedError) {
      return apiFailure(
        "VALIDATION_FAILED",
        "The rewritten card did not pass safety checks.",
        502,
        error.issues,
      );
    }

    if (error instanceof InvalidModelOutputError) {
      return apiFailure(
        "INVALID_MODEL_OUTPUT",
        "The model returned an invalid rewrite. Try again with clearer notes.",
        502,
        error.issues,
      );
    }

    if (error instanceof ModelFailureError) {
      return apiFailure(
        "MODEL_FAILURE",
        "Routing failed. Try again with shorter notes.",
        502,
      );
    }

    if (error instanceof ProviderQuotaExceededError) {
      return apiFailure(
        "PROVIDER_QUOTA_EXCEEDED",
        "OpenAI quota is exhausted for the configured API key. Check billing or use a key with available credits.",
        502,
      );
    }

    return apiFailure(
      "MODEL_FAILURE",
      "Routing failed. Try again with shorter notes.",
      502,
    );
  }
}
