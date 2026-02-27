import { NextRequest, NextResponse } from "next/server";
import { analyzePRD, type Provider } from "@/lib/llm";
import { PERSONA_PROMPTS, type PersonaId } from "@/lib/personas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, provider, persona } = body as {
      text: string;
      provider: Provider;
      persona?: PersonaId;
    };

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

    const selectedPersona: PersonaId = persona && persona in PERSONA_PROMPTS
      ? persona
      : "senior-pm";

    const result = await analyzePRD(text.trim(), provider, selectedPersona);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
