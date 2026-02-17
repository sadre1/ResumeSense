import { UIMessage, convertToModelMessages, streamText } from "ai";
import { router } from "@/lib/openrouter";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";



export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();
    const { userId } = await auth();
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    // Get last user message metadata
    const lastMessage = messages[messages.length - 1];
    const route = (lastMessage?.metadata as any)?.route;
    const createMode = (lastMessage?.metadata as any)?.createMode;

    let systemPrompt = "";
    console.log("Route from message metadata:", route);
    if (route === "/resumes" && createMode === true) {
        systemPrompt = `
You are a Resume Builder Assistant.

Ask the user step-by-step for:
- Job title
- Years of experience
- Skills
- Education

DO NOT generate the resume yet.
Only ask questions and acknowledge answers.
`;
    }



    else if (route === "/resumes") {
        systemPrompt = `
You are a dedicated Resume Builder Assistant.

You ONLY help users with resume-related tasks.

If the user asks "what can you do?" or similar, respond by explaining that you help with:
- Writing strong resume bullet points
- Improving clarity and impact
- Tailoring resumes to specific job roles
- Optimizing for ATS systems
- Suggesting skills and keywords
- Rewriting job descriptions professionally

Do NOT mention anything outside resume building.
Do NOT offer help with coding, science, jokes, or unrelated topics.
Always keep responses focused on resume creation and improvement.
`;
    }

    if (route === "/analyze") {
        // ✅ Fetch resumes ONLY for analyzer route
        const [resumes] = await Promise.all([
            prisma.resume.findMany({
                where: {
                    userId,
                },
                orderBy: {
                    updatedAt: "desc",
                },
                include: {
                    workExperiences: true,
                    educations: true,
                },
            })
        ]);
        const resumeDataText = resumes.length
            ? resumes
                .map((resume, index) => {
                    return `
==============================
Resume ${index + 1}
==============================

ID: ${resume.id}
Title: ${resume.title ?? "N/A"}
Job Title: ${resume.jobTitle ?? "N/A"}
Location: ${resume.city ?? ""} ${resume.country ?? ""}
Email: ${resume.email ?? ""}
Phone: ${resume.phone ?? ""}

Summary:
${resume.summary ?? "N/A"}

Skills:
${resume.skills.length ? resume.skills.map(s => `- ${s}`).join("\n") : "N/A"}

Work Experience:
${resume.workExperiences.length
                            ? resume.workExperiences
                                .map(
                                    (exp) => `
- Position: ${exp.position ?? "N/A"}
  Company: ${exp.company ?? "N/A"}
  Duration: ${exp.startDate?.toDateString() ?? "N/A"} – ${exp.endDate?.toDateString() ?? "Present"
                                        }
  Description:
  ${exp.description ?? "N/A"}
`
                                )
                                .join("\n")
                            : "N/A"
                        }

Education:
${resume.educations.length
                            ? resume.educations
                                .map(
                                    (edu) => `
- Degree: ${edu.degree ?? "N/A"}
  School: ${edu.school ?? "N/A"}
  Duration: ${edu.startDate?.toDateString() ?? "N/A"} – ${edu.endDate?.toDateString() ?? "N/A"
                                        }
`
                                )
                                .join("\n")
                            : "N/A"
                        }
`;
                })
                .join("\n\n")
            : "No resumes found.";

        systemPrompt = `
You are a resume analysis assistant.
You ONLY help with:
- Resume comparison
- ATS scoring
- Job description matching
- Improvement suggestions

You MUST ask the user to select a resume before analyzing.
${resumeDataText}
`;
    }

    const modelMessages = await convertToModelMessages(messages);
    console.log("Received messages:", systemPrompt);

    const result = await streamText({
        model: router("openai/gpt-oss-120b"),
        messages: [
            {
                role: "system",
                content: systemPrompt,
            },
            ...modelMessages,
        ],
        temperature: 0.3,
    });

    return result.toUIMessageStreamResponse();
}
