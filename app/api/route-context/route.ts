import { ZodError } from "zod";
import { apiFailure, apiSuccess } from "@/lib/api/envelope";
import {
  InvalidModelOutputError,
  ModelFailureError,
  ProviderQuotaExceededError,
  routeContext,
  ValidationFailedError,
} from "@/lib/ai/routeContext";
import { DatabaseConfigError } from "@/lib/db/client";
import { saveRouteRun } from "@/lib/db/runs";
import { RouteContextRequestSchema } from "@/lib/schemas/routeContext.schema";

export const runtime = "nodejs";

function invalidRequestMessage(error: ZodError) {
  const dailyDumpIssue = error.issues.find((issue) =>
    issue.path.includes("dailyDump"),
  );

  if (dailyDumpIssue?.code === "too_small") {
    return "Paste at least a few notes from your day.";
  }

  if (dailyDumpIssue?.code === "too_big") {
    return "This is too much context for the MVP. Please paste one day or one meeting at a time.";
  }

  return "The request is invalid.";
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

  const parsed = RouteContextRequestSchema.safeParse(body);

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
    const result = await routeContext(parsed.data);

    try {
      await saveRouteRun({
        response: result,
        dailyDump: parsed.data.dailyDump,
        voiceSamples: parsed.data.voiceSamples,
      });
    } catch {
      return apiFailure(
        "DATABASE_UNAVAILABLE",
        "The board was routed, but database persistence failed. Check DATABASE_URL and run the database migration.",
        500,
      );
    }

    return apiSuccess(result);
  } catch (error) {
    if (error instanceof DatabaseConfigError) {
      return apiFailure(
        "DATABASE_UNAVAILABLE",
        "Database persistence is not configured yet. Add DATABASE_URL and run the database migration.",
        500,
      );
    }

    if (error instanceof ValidationFailedError) {
      return apiFailure(
        "VALIDATION_FAILED",
        "The routed output did not pass safety checks.",
        502,
        error.issues,
      );
    }

    if (error instanceof InvalidModelOutputError) {
      return apiFailure(
        "INVALID_MODEL_OUTPUT",
        "The model returned an invalid board. Try again with clearer notes.",
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
