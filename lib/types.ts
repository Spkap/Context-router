import type { z } from "zod";
import type { AtomSchema } from "./schemas/atom.schema";
import type { CardSchema, RewriteActionSchema } from "./schemas/card.schema";
import type {
  BucketSchema,
  ModeSchema,
  RiskLevelSchema,
  ScoreBandSchema,
  SensitivitySchema,
} from "./schemas/common.schema";
import type {
  ApiErrorCode,
  Buckets,
  EmptyBucketReasons,
  RouteContextResponse,
  ValidationIssue,
} from "./schemas/routeContext.schema";

export type Mode = z.infer<typeof ModeSchema>;
export type Bucket = z.infer<typeof BucketSchema>;
export type Sensitivity = z.infer<typeof SensitivitySchema>;
export type RiskLevel = z.infer<typeof RiskLevelSchema>;
export type ScoreBand = z.infer<typeof ScoreBandSchema>;
export type Atom = z.infer<typeof AtomSchema>;
export type Card = z.infer<typeof CardSchema>;
export type RewriteAction = z.infer<typeof RewriteActionSchema>;
export type {
  Buckets,
  EmptyBucketReasons,
  RouteContextResponse,
  ValidationIssue,
};

export type ApiSuccess<T> = { ok: true; data: T };

export type ApiFailure = {
  ok: false;
  error: {
    code: ApiErrorCode;
    message: string;
    issues?: unknown;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
