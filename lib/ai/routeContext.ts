import { generateObject } from "ai";
import { BUCKET_CONFIG, BUCKET_ORDER } from "../bucket-config";
import {
  RouteContextModelOutputSchema,
  RouteContextResponseSchema,
  type RouteContextModelOutput,
  type RouteContextRequest,
  type RouteContextResponse,
  type ValidationIssue,
} from "../schemas/routeContext.schema";
import { hasBlockingIssues, validateBoard } from "../validators/boardValidation";
import { getOpenAIModelConfig } from "./modelConfig";
import { buildRouteContextPrompt, buildStrictRetryPrompt } from "./prompts";

export class InvalidModelOutputError extends Error {
  constructor(public issues?: unknown) {
    super("The model returned an invalid board.");
    this.name = "InvalidModelOutputError";
  }
}

export class ValidationFailedError extends Error {
  constructor(public issues: ValidationIssue[]) {
    super("The routed output did not pass safety checks.");
    this.name = "ValidationFailedError";
  }
}

export class ModelFailureError extends Error {
  constructor() {
    super("Routing failed.");
    this.name = "ModelFailureError";
  }
}

export class ProviderQuotaExceededError extends Error {
  constructor() {
    super("The configured OpenAI API key has no available quota.");
    this.name = "ProviderQuotaExceededError";
  }
}

export function isProviderQuotaExceeded(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  return /exceeded your current quota|insufficient_quota/i.test(error.message);
}

export function logModelFailure(scope: string, error: unknown) {
  const record =
    error instanceof Error
      ? {
          name: error.name,
          message: error.message,
          statusCode:
            "statusCode" in error && typeof error.statusCode === "number"
              ? error.statusCode
              : undefined,
        }
      : { message: "Unknown model failure" };

  console.error(scope, record);
}

async function generateBoard(prompt: string) {
  const result = await generateObject({
    ...getOpenAIModelConfig(),
    schema: RouteContextModelOutputSchema,
    prompt,
  });

  return result.object;
}

function withEmptyReasons(output: RouteContextModelOutput): RouteContextModelOutput {
  const emptyBucketReasons = { ...output.emptyBucketReasons };

  for (const bucket of BUCKET_ORDER) {
    if (output.buckets[bucket].length === 0 && !emptyBucketReasons[bucket]) {
      emptyBucketReasons[bucket] = BUCKET_CONFIG[bucket].empty;
    }
  }

  return {
    ...output,
    emptyBucketReasons,
  };
}

function wrapResponse(
  output: RouteContextModelOutput,
  input: RouteContextRequest,
  issues: ValidationIssue[],
): RouteContextResponse {
  const response = {
    ...output,
    run: {
      ...output.run,
      mode: input.mode,
      runId: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    },
    validationIssues: [...output.validationIssues, ...issues],
  };

  return RouteContextResponseSchema.parse(response);
}

async function generateAndValidate(prompt: string) {
  const generated = await generateBoard(prompt);
  const parsed = RouteContextModelOutputSchema.safeParse(generated);

  if (!parsed.success) {
    throw new InvalidModelOutputError(parsed.error.flatten());
  }

  const output = withEmptyReasons(parsed.data);
  const issues = validateBoard(output);

  return { output, issues };
}

export async function routeContext(
  input: RouteContextRequest,
): Promise<RouteContextResponse> {
  let firstIssues: ValidationIssue[] = [];

  try {
    const first = await generateAndValidate(buildRouteContextPrompt(input));
    firstIssues = first.issues;

    if (!hasBlockingIssues(first.issues)) {
      return wrapResponse(first.output, input, first.issues);
    }
  } catch (error) {
    if (error instanceof InvalidModelOutputError) {
      firstIssues = [
        {
          code: "INVALID_MODEL_OUTPUT",
          severity: "error",
          message: "The model output did not match the required schema.",
          cardId: null,
          atomId: null,
        },
      ];
    } else {
      logModelFailure("[route-context] initial model failure", error);
      if (isProviderQuotaExceeded(error)) {
        throw new ProviderQuotaExceededError();
      }
      throw new ModelFailureError();
    }
  }

  try {
    const retry = await generateAndValidate(
      buildStrictRetryPrompt(input, firstIssues),
    );

    if (hasBlockingIssues(retry.issues)) {
      throw new ValidationFailedError(retry.issues);
    }

    return wrapResponse(retry.output, input, retry.issues);
  } catch (error) {
    if (error instanceof ValidationFailedError) {
      throw error;
    }

    if (error instanceof InvalidModelOutputError) {
      throw error;
    }

    logModelFailure("[route-context] retry model failure", error);
    if (isProviderQuotaExceeded(error)) {
      throw new ProviderQuotaExceededError();
    }
    throw new ModelFailureError();
  }
}
