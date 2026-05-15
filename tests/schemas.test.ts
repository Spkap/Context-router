import { describe, expect, it } from "vitest";
import validBoard from "./fixtures/valid-sample-board.json";
import invalidPrivateLeak from "./fixtures/invalid-private-leak.json";
import { CardSchema } from "@/lib/schemas/card.schema";
import { ModeSchema } from "@/lib/schemas/common.schema";
import {
  ApiErrorCodeSchema,
  RouteContextModelOutputSchema,
} from "@/lib/schemas/routeContext.schema";

describe("ContextRouter schemas", () => {
  it("parses the valid sample board fixture", () => {
    expect(() => RouteContextModelOutputSchema.parse(validBoard)).not.toThrow();
  });

  it("rejects cards missing source atom ids", () => {
    const card = invalidPrivateLeak.buckets.x_post[0];
    const { sourceAtomIds, ...missingSource } = card;

    expect(sourceAtomIds).toBeDefined();
    expect(CardSchema.safeParse(missingSource).success).toBe(false);
  });

  it("rejects unknown bucket keys", () => {
    const invalid = {
      ...validBoard,
      buckets: {
        ...validBoard.buckets,
        random_bucket: [],
      },
    };

    expect(RouteContextModelOutputSchema.safeParse(invalid).success).toBe(false);
  });

  it("accepts student_builder but rejects student", () => {
    expect(ModeSchema.safeParse("student_builder").success).toBe(true);
    expect(ModeSchema.safeParse("student").success).toBe(false);
  });

  it("recognizes provider quota errors in API envelopes", () => {
    expect(ApiErrorCodeSchema.safeParse("PROVIDER_QUOTA_EXCEEDED").success).toBe(
      true,
    );
  });
});
