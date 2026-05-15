import { afterEach, describe, expect, it } from "vitest";
import {
  DEFAULT_AI_MODEL,
  getConfiguredModelId,
  getOpenAIModelConfig,
} from "@/lib/ai/modelConfig";

const originalModel = process.env.AI_MODEL;
const originalReasoningEffort = process.env.AI_REASONING_EFFORT;

afterEach(() => {
  process.env.AI_MODEL = originalModel;
  process.env.AI_REASONING_EFFORT = originalReasoningEffort;
});

describe("model config", () => {
  it("defaults to gpt-5.4-mini", () => {
    delete process.env.AI_MODEL;

    expect(DEFAULT_AI_MODEL).toBe("gpt-5.4-mini");
    expect(getConfiguredModelId()).toBe("gpt-5.4-mini");
  });

  it("uses low reasoning effort for the default GPT-5 model", () => {
    delete process.env.AI_MODEL;
    delete process.env.AI_REASONING_EFFORT;

    expect(getOpenAIModelConfig()).toMatchObject({
      providerOptions: {
        openai: {
          reasoningEffort: "low",
        },
      },
    });
  });

  it("keeps temperature only for non-GPT-5 models", () => {
    process.env.AI_MODEL = "gpt-4o";

    expect(getOpenAIModelConfig()).toMatchObject({
      temperature: 0.2,
    });
  });
});
