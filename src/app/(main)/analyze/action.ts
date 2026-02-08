// "use server";

// import { extractResumeText } from "@/lib/resume/extractText";
// import { cleanText } from "@/lib/resume/cleanText";
// import { analyzeWithAI } from "@/lib/ai/openrouter";

// export async function analyzeResume(formData: FormData) {
//   const resume = formData.get("resume") as File;
//   const jobDescription = formData.get("jobDescription") as string;

//   const rawText = await extractResumeText(resume);
//   const resumeText = cleanText(rawText);

//   return analyzeWithAI(resumeText, jobDescription);
// }
