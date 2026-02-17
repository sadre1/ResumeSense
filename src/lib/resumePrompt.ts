export const resumePrompt = `
You are an ATS resume analyzer.

Resume:
{{resume}}

Job Description:
{{job}}

Return JSON only:
{
  "atsScore": number,
  "missingSkills": string[],
  "strengths": string[],
  "improvements": {
    "summary": string[],
    "experience": string[],
    "skills": string[]
  }
}
`;
