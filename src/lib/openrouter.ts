
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

export const router = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  headers: {
    "HTTP-Referer": "http://localhost:3000", // required
    "X-Title": "resume-sense",               // your app name
  },
});



