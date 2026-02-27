import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PERSONA_PROMPTS, type PersonaId } from "./personas";

export type Provider = "anthropic" | "openai" | "gemini";

export interface GrowthFocus {
  skill: string;
  diagnosis: string;
  recommendation: string;
}

export interface AnalysisResult {
  persona?: string;
  overall_score: number;
  overall_verdict: string;
  ship_recommendation?: "ship" | "revise" | "reject";
  ship_rationale?: string;
  dimensions: {
    name: string;
    score: number;
    status: "pass" | "warning" | "fail";
    issues: string[];
    suggestions: string[];
    rewrite_example?: string;
  }[];
  growth_focus?: GrowthFocus;
}

function parseJsonResponse(text: string): AnalysisResult {
  // Strip markdown fences if the model wrapped the response
  const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  return JSON.parse(cleaned);
}

export async function analyzePRD(
  prdText: string,
  provider: Provider,
  persona: PersonaId = "senior-pm"
): Promise<AnalysisResult> {
  const systemPrompt = PERSONA_PROMPTS[persona];

  switch (provider) {
    case "anthropic":
      return analyzeWithAnthropic(prdText, systemPrompt);
    case "openai":
      return analyzeWithOpenAI(prdText, systemPrompt);
    case "gemini":
      return analyzeWithGemini(prdText, systemPrompt);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

async function analyzeWithAnthropic(
  prdText: string,
  systemPrompt: string
): Promise<AnalysisResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set in .env");

  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5-20250514";
  const client = new Anthropic({ apiKey });
  const message = await client.messages.create({
    model,
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `Analyze the following PRD:\n\n${prdText}`,
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Anthropic");
  }
  return parseJsonResponse(textBlock.text);
}

async function analyzeWithOpenAI(
  prdText: string,
  systemPrompt: string
): Promise<AnalysisResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set in .env");

  const model = process.env.OPENAI_MODEL || "gpt-4o";
  const client = new OpenAI({ apiKey });
  const response = await client.chat.completions.create({
    model,
    temperature: 0.2,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Analyze the following PRD:\n\n${prdText}` },
    ],
  });

  const text = response.choices[0]?.message?.content;
  if (!text) throw new Error("No response from OpenAI");
  return parseJsonResponse(text);
}

async function analyzeWithGemini(
  prdText: string,
  systemPrompt: string
): Promise<AnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set in .env");

  const modelName = process.env.GEMINI_MODEL || "gemini-1.5-pro";
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelName });

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${systemPrompt}\n\nAnalyze the following PRD:\n\n${prdText}`,
          },
        ],
      },
    ],
    generationConfig: { temperature: 0.2 },
  });

  const text = result.response.text();
  if (!text) throw new Error("No response from Gemini");
  return parseJsonResponse(text);
}
