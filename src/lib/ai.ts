import { router } from "./openrouter";
import { MODEL_PRIORITY } from "./utils";
import { withTimeout } from "./timeout";
import { generateText } from "ai";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function chatWithFallback(messages: ChatMessage[]) {
  let lastError: unknown = null;

  for (const model of MODEL_PRIORITY) {
    try {
      const completion = await withTimeout(
        generateText({
          model: router(model),
          messages,
          temperature: 0.3,
        }),
        8000
      );

      return {
        model,
        content: completion.text,
      };
    } catch (err) {
      console.warn(`Model failed: ${model}`, err);
      lastError = err;
    }
  }

  throw lastError ?? new Error("All models failed");
}