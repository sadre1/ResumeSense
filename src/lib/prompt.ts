export const atsPrompt = (resume: string, jd: string) => `
You are an Applicant Tracking System.

Compare the RESUME with the JOB DESCRIPTION.

Return ONLY valid JSON:
{
  "ats_score": number,
  "matched_skills": string[],
  "missing_skills": string[],
  "keyword_match_percentage": number,
  "experience_match": "Low" | "Medium" | "High",
  "recommendations": string[]
}

RESUME:
${resume}

JOB DESCRIPTION:
${jd}
`;
