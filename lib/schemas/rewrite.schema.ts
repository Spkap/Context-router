import { z } from "zod";
import { AtomSchema } from "./atom.schema";
import { CardSchema, RewriteActionSchema } from "./card.schema";
import { ValidationIssueSchema } from "./routeContext.schema";

export const RewriteCardRequestSchema = z.object({
  card: CardSchema,
  atoms: z.array(AtomSchema),
  action: RewriteActionSchema,
  voiceSamples: z.string().max(3000).optional().default(""),
});

export const RewriteCardModelOutputSchema = z.object({
  card: CardSchema,
  validationIssues: z.array(ValidationIssueSchema),
});

export const RewriteCardResponseSchema = RewriteCardModelOutputSchema;

export type RewriteCardRequest = z.infer<typeof RewriteCardRequestSchema>;
export type RewriteCardModelOutput = z.infer<
  typeof RewriteCardModelOutputSchema
>;
export type RewriteCardResponse = z.infer<typeof RewriteCardResponseSchema>;
