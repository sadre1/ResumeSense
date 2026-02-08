import { openrouter } from "./openrouter";
import { MODEL_PRIORITY } from "./utils";
import { withTimeout } from "./timeout";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function chatWithFallback(
  messages: ChatMessage[]
) {
  let lastError: unknown = null;

  for (const model of MODEL_PRIORITY) {
    try {
    const completion = await withTimeout(
        openrouter.chat.completions.create({
          model,
          messages,
          temperature: 0.3,
        }),
        8000
      );

      return {
        model,
        content: completion.choices[0].message.content,
      };
    } catch (err) {
      console.warn(`Model failed: ${model}`);
      lastError = err;
    }
  }

  throw lastError ?? new Error("All models failed");
}
