import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { analyzeResumeAction } from "./action";
import ResumeFront from "@/components/resumes";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function AnalyzePage() {
  const { userId } = await auth();

  

  if (!userId) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-6xl flex flex-col gap-8">
        
        {/* TOP: Resume List */}
        
        <ResumeFront userId={userId} />

        {/* BELOW: ATS Analyzer Form */}
        <Card className="w-full shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Resume ATS Analyzer
            </CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              Upload your resume and job description to get an ATS score
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form action={analyzeResumeAction} className="space-y-6">
              
              {/* Resume Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Resume (PDF)</label>
                <Input
                  name="resume"
                  type="file"
                  accept="application/pdf"
                  required
                />
              </div>

              {/* Job Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Job Description</label>
                <Textarea
                  name="jobDesc"
                  placeholder="Paste the job description here..."
                  rows={8}
                  required
                />
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full text-lg" size="lg">
                Get ATS Score
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
