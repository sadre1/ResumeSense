import { NextResponse } from "next/server";
import { chatWithFallback } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const result = await chatWithFallback([
      { role: "user", content: message },
    ]);

    return NextResponse.json({
      reply: result.content,
      modelUsed: result.model,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "All AI models failed" },
      { status: 500 }
    );
  }
}
