export interface ATSResult {
  ats_score: number;
  matched_skills: string[];
  missing_skills: string[];
  keyword_match_percentage: number;
  experience_match: "Low" | "Medium" | "High";
  recommendations: string[];
}
