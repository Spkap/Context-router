import { z } from "zod";
import { AtomSchema } from "./atom.schema";
import { CardSchema } from "./card.schema";
import { BucketSchema, ModeSchema } from "./common.schema";

export const RouteContextRequestSchema = z.object({
  dailyDump: z.string().trim().min(10).max(5000),
  voiceSamples: z.string().trim().max(3000).optional().default(""),
  mode: ModeSchema.default("founder"),
});

export const BucketsSchema = z.object({
  x_post: z.array(CardSchema),
  linkedin: z.array(CardSchema),
  follow_up: z.array(CardSchema),
  task: z.array(CardSchema),
  investor_update: z.array(CardSchema),
  private: z.array(CardSchema),
  leave_out: z.array(CardSchema),
}).strict();

export const ValidationIssueSchema = z.object({
  code: z.string(),
  severity: z.enum(["warning", "error"]),
  message: z.string(),
  cardId: z.string().nullable(),
  atomId: z.string().nullable(),
});

export const ModelRunSchema = z.object({
  mode: ModeSchema,
  inputSummary: z.string(),
  summary: z.string(),
});

export const EmptyBucketReasonsSchema = z.object({
  x_post: z.string().nullable(),
  linkedin: z.string().nullable(),
  follow_up: z.string().nullable(),
  task: z.string().nullable(),
  investor_update: z.string().nullable(),
  private: z.string().nullable(),
  leave_out: z.string().nullable(),
});

export const QualityReportSchema = z.object({
  strongestSignal: z.string(),
  weakestSignal: z.string(),
  privacyWarningsCount: z.number().int().min(0),
  unsupportedClaimsCount: z.number().int().min(0),
  slopWarningsCount: z.number().int().min(0),
});

export const RouteContextModelOutputSchema = z.object({
  run: ModelRunSchema,
  atoms: z.array(AtomSchema),
  buckets: BucketsSchema,
  emptyBucketReasons: EmptyBucketReasonsSchema,
  qualityReport: QualityReportSchema,
  validationIssues: z.array(ValidationIssueSchema),
});

export const RouteContextResponseSchema = z.object({
  run: ModelRunSchema.extend({
    runId: z.string(),
    createdAt: z.string(),
  }),
  atoms: z.array(AtomSchema),
  buckets: BucketsSchema,
  emptyBucketReasons: EmptyBucketReasonsSchema,
  qualityReport: QualityReportSchema,
  validationIssues: z.array(ValidationIssueSchema),
});

export const ApiErrorCodeSchema = z.enum([
  "INVALID_REQUEST",
  "MISSING_API_KEY",
  "PROVIDER_QUOTA_EXCEEDED",
  "MODEL_FAILURE",
  "INVALID_MODEL_OUTPUT",
  "VALIDATION_FAILED",
  "DATABASE_UNAVAILABLE",
]);

export type RouteContextRequest = z.infer<typeof RouteContextRequestSchema>;
export type Buckets = z.infer<typeof BucketsSchema>;
export type ValidationIssue = z.infer<typeof ValidationIssueSchema>;
export type ModelRun = z.infer<typeof ModelRunSchema>;
export type EmptyBucketReasons = z.infer<typeof EmptyBucketReasonsSchema>;
export type QualityReport = z.infer<typeof QualityReportSchema>;
export type RouteContextModelOutput = z.infer<
  typeof RouteContextModelOutputSchema
>;
export type RouteContextResponse = z.infer<typeof RouteContextResponseSchema>;
export type ApiErrorCode = z.infer<typeof ApiErrorCodeSchema>;
export type Bucket = z.infer<typeof BucketSchema>;
