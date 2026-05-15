import { openai } from "@ai-sdk/openai";

export const DEFAULT_AI_MODEL = "gpt-5.4-mini";

const DEFAULT_TEMPERATURE = 0.2;
const DEFAULT_REASONING_EFFORT = "low";

function isGpt5Model(modelId: string) {
  return /^gpt-5(?:[.-]|$)/.test(modelId);
}

function defaultReasoningEffort(modelId: string) {
  if (modelId.startsWith("gpt-5.3-chat")) {
    return "medium";
  }

  return DEFAULT_REASONING_EFFORT;
}

export function getConfiguredModelId() {
  return process.env.AI_MODEL?.trim() || DEFAULT_AI_MODEL;
}

export function getOpenAIModelConfig() {
  const modelId = getConfiguredModelId();
  const model = openai(modelId);

  if (isGpt5Model(modelId)) {
    return {
      model,
      providerOptions: {
        openai: {
          reasoningEffort:
            process.env.AI_REASONING_EFFORT?.trim() ||
            defaultReasoningEffort(modelId),
        },
      },
    };
  }

  return {
    model,
    temperature: DEFAULT_TEMPERATURE,
  };
}
