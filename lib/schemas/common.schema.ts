import { z } from "zod";

export const ModeSchema = z.enum([
  "founder",
  "student_builder",
  "operator",
  "creator",
]);

export const BucketSchema = z.enum([
  "x_post",
  "linkedin",
  "follow_up",
  "task",
  "investor_update",
  "private",
  "leave_out",
]);

export const AtomTypeSchema = z.enum([
  "meeting",
  "user_feedback",
  "product_work",
  "achievement",
  "reminder",
  "opinion",
  "private_note",
  "noise",
  "unknown",
]);

export const SensitivitySchema = z.enum([
  "public_safe",
  "internal_only",
  "private",
  "unknown",
]);

export const RiskLevelSchema = z.enum(["low", "medium", "high"]);
export const ScoreBandSchema = z.enum(["low", "medium", "high"]);

export type Mode = z.infer<typeof ModeSchema>;
export type Bucket = z.infer<typeof BucketSchema>;
export type AtomType = z.infer<typeof AtomTypeSchema>;
export type Sensitivity = z.infer<typeof SensitivitySchema>;
export type RiskLevel = z.infer<typeof RiskLevelSchema>;
export type ScoreBand = z.infer<typeof ScoreBandSchema>;
