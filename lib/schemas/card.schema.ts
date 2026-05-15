import { z } from "zod";
import {
  BucketSchema,
  RiskLevelSchema,
  ScoreBandSchema,
} from "./common.schema";

export const RewriteActionSchema = z.enum([
  "make_sharper",
  "less_formal",
  "cut_30",
  "more_like_my_voice",
  "make_x_version",
  "make_linkedin_version",
  "make_investor_safe",
  "make_public_safe",
]);

export const QualityScoresSchema = z.object({
  specificity: ScoreBandSchema,
  privacyRisk: RiskLevelSchema,
  slopRisk: RiskLevelSchema,
  voiceMatch: ScoreBandSchema,
  supportLevel: ScoreBandSchema,
});

export const ClaimSchema = z.object({
  text: z.string().min(1),
  sourceAtomIds: z.array(z.string()).min(1),
});

export const CardSchema = z.object({
  id: z.string().regex(/^card_[0-9]{3,}$/),
  bucket: BucketSchema,
  title: z.string().min(1),
  draft: z.string().min(1),
  sourceAtomIds: z.array(z.string()).min(1),
  claims: z.array(ClaimSchema),
  reason: z.string().min(1),
  riskLevel: RiskLevelSchema,
  qualityScores: QualityScoresSchema,
  suggestedActions: z.array(RewriteActionSchema),
});

export type RewriteAction = z.infer<typeof RewriteActionSchema>;
export type QualityScores = z.infer<typeof QualityScoresSchema>;
export type Claim = z.infer<typeof ClaimSchema>;
export type Card = z.infer<typeof CardSchema>;
