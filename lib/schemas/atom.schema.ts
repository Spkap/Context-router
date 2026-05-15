import { z } from "zod";
import { AtomTypeSchema, SensitivitySchema } from "./common.schema";

export const AtomSchema = z.object({
  id: z.string().regex(/^atom_[0-9]{3,}$/),
  sourceSnippet: z.string().min(1),
  cleanedMeaning: z.string().min(1),
  type: AtomTypeSchema,
  sensitivity: SensitivitySchema,
  signalScore: z.number().min(0).max(100),
  confidence: z.number().min(0).max(1),
  routingNotes: z.string().nullable(),
});

export type Atom = z.infer<typeof AtomSchema>;
