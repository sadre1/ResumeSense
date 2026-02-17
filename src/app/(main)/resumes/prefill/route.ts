import { auth } from "@clerk/nextjs/server";
import { streamText } from "ai";
import { router } from "@/lib/openrouter";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { context } = await req.json();

  const result = await streamText({
    model: router("openai/gpt-oss-120b"),
    messages: [
      {
        role: "system",
        content: `
You are a Resume Generator.

Generate ONLY valid JSON matching this exact schema:

{
  "title": string,
  "description": string,
  "jobTitle": string,
  "summary": string,
  "skills": string[],
  "workExperiences": {
    "position": string,
    "company": string,
    "startYear": string,
    "endYear": string | "Present",
    "description": string
  }[],
  "educations": {
    "degree": string,
    "school": string,
    "startYear": string,
    "endYear": string
  }[]
}

Rules:
- JSON ONLY
- No markdown
- No extra text
`
      },
      {
        role: "user",
        content: context
      }
    ],
    temperature: 0.2
  });

  const text = await result.text();

  return new Response(text, {
    headers: { "Content-Type": "application/json" }
  });
}
