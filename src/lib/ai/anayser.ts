import { chatWithFallback } from "../ai";
import { resumeAnalysisSchema } from "../validation";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function analyzeResume(
  resume: string,
  jobDescription: string
) {
  const messages: ChatMessage[] = [
{
  role: "system",
  content: `You are an ATS resume analyzer. 
  Output ONLY raw JSON. 
  Do NOT include \`\`\`json or any other markdown formatting tags. 
  Start your response with { and end with }.`
},
  {
    role: "user",
    content: `
Analyze the resume against the job description.

Return JSON in EXACT format:

{
  "atsScore": number (0-100),
  "missingSkills": string[],
  "strengths": string[],
  "improvements": {
    "summary": string[],
    "experience": string[],
    "skills": string[]
  }
}

Resume:
${resume}

Job Description:
${jobDescription}
    `,
  },
];


  const response = await chatWithFallback(messages);
  return cleanJson(response.content);
}

function cleanJson(text: string) {
  // 1. Remove markdown code blocks and any trailing/leading whitespace
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    const json = JSON.parse(cleaned);
    const parsed = resumeAnalysisSchema.safeParse(json);

    if (!parsed.success) {
      console.error("Zod Validation Error:", parsed.error.format());
      throw new Error("AI response did not match the expected schema");
    }

    return parsed.data;
  } catch (error) {
    console.error("Raw AI Output was:", text);
    throw new Error("Failed to parse AI response as JSON");
  }
}

