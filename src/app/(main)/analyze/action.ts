"use server";

import { analyzeResume } from "@/lib/ai/anayser";
import { parsePdf } from "@/lib/pdf/pdfParcer";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function analyzeResumeAction(formData: FormData) {
  // 🔐 Auth check
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // 📄 Read form data
  const file = formData.get("resume") as File | null;
  const jobDesc = formData.get("jobDesc") as string | null;

  if (!file || !jobDesc?.trim()) {
    throw new Error("Missing resume or job description");
  }

  // ✅ FIX 1: Convert to Uint8Array directly (skipping Buffer)
  const arrayBuffer = await file.arrayBuffer();
  const resumeText = await parsePdf(new Uint8Array(arrayBuffer));
  console.log("Extracted resume text length:", resumeText.length);

  if (!resumeText.trim()) {
    throw new Error("Failed to extract text from PDF");
  }

  // 🤖 AI analysis (already schema-validated inside)
  const analysis = await analyzeResume(resumeText, jobDesc);

  // 💾 Save to DB (Clerk user mapped)
  const result = await prisma.analysis.create({
    data: {
      userId,
      resumeText,
      jobDescText: jobDesc,
      atsScore: analysis.atsScore,
      insights: analysis,
    },
  });

  // 🚀 Redirect to results page
  redirect(`/results/${result.id}`);
}
