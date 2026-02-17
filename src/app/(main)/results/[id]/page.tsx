
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ResultsPageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: ResultsPageProps) {
  const { userId } = await auth();

  if (!userId) {
    notFound();
  }
  console.log("User ID:", params.id );
  const analysis = await prisma.analysis.findFirst({
    where: { id: params.id },
  });

  if (!analysis || analysis.userId !== userId) {
    notFound();
  }

  const insights = analysis.insights as any;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* ATS SCORE */}
  
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">ATS Score</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-5xl font-bold">
            {analysis.atsScore}
            <span className="text-xl text-muted-foreground"> / 100</span>
          </div>
          <Progress value={analysis.atsScore} />
        </CardContent>
      </Card>

      {/* STRENGTHS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Strengths</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {insights.strengths?.length ? (
            insights.strengths.map((skill: string, index: number) => (
              <Badge key={index} variant="secondary">
                {skill}
              </Badge>
            ))
          ) : (
            <p className="text-muted-foreground">No strengths identified</p>
          )}
        </CardContent>
      </Card>

      {/* MISSING SKILLS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Missing Skills</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {insights.missingSkills?.length ? (
            insights.missingSkills.map((skill: string, index: number) => (
              <Badge key={index} variant="destructive">
                {skill}
              </Badge>
            ))
          ) : (
            <p className="text-muted-foreground">
              No critical skill gaps found 🎉
            </p>
          )}
        </CardContent>
      </Card>

      {/* IMPROVEMENTS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Improvement Suggestions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ImprovementSection
            title="Summary"
            items={insights.improvements?.summary}
          />
          <ImprovementSection
            title="Experience"
            items={insights.improvements?.experience}
          />
          <ImprovementSection
            title="Skills"
            items={insights.improvements?.skills}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function ImprovementSection({
  title,
  items,
}: {
  title: string;
  items?: string[];
}) {
  if (!items || items.length === 0) return null;

  return (
    <div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
