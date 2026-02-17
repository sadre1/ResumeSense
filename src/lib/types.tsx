import { Prisma } from "@prisma/client";
import { ResumeValues } from "./validation";

export interface EditorFormProps {
  resumeData: ResumeValues;
  setResumeData: (data: ResumeValues) => void;
}

export const resumeDataInclude = {
  workExperiences: true,
  educations: true,
} satisfies Prisma.ResumeInclude;

export type ResumeServerData = Prisma.ResumeGetPayload<{
  include: typeof resumeDataInclude;
}>; 

export type ResumePrefill = {
  title: string;
  description: string;
  jobTitle: string;
  summary: string;

  skills: string[];

  workExperiences: {
    position: string;
    company: string;
    startYear: string;
    endYear: string | "Present";
    description: string;
  }[];

  educations: {
    degree: string;
    school: string;
    startYear: string;
    endYear: string;
  }[];
};
