import { NextRequest, NextResponse } from "next/server";
import { analyzePRD, type Provider } from "@/lib/llm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, provider } = body as { text: string; provider: Provider };

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "PRD text is required" },
        { status: 400 }
      );
    }

    if (!["anthropic", "openai", "gemini"].includes(provider)) {
      return NextResponse.json(
        { error: "Invalid provider. Must be one of: anthropic, openai, gemini" },
        { status: 400 }
      );
    }

    const result = await analyzePRD(text.trim(), provider);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
