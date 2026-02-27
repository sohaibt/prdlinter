import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

export type Provider = "anthropic" | "openai" | "gemini";

export interface AnalysisResult {
  overall_score: number;
  overall_verdict: string;
  dimensions: {
    name: string;
    score: number;
    status: "pass" | "warning" | "fail";
    issues: string[];
    suggestions: string[];
  }[];
}

const SYSTEM_PROMPT = `You are a senior product manager and PRD reviewer. Analyze the provided Product Requirements Document (PRD) across exactly 5 dimensions. Return ONLY valid JSON — no prose, no markdown fences, no explanation outside the JSON.

Evaluate these 5 dimensions:

1. **Success Metrics** — Does the PRD define clear, measurable success metrics? Are there KPIs, targets, and timelines? Score 0-10.
2. **Persona Definition** — Are target users clearly defined with needs, pain points, and context? Are there specific user segments? Score 0-10.
3. **Scope Clarity** — Is the scope well-defined? Are there clear boundaries of what's in and out of scope? Are requirements unambiguous? Score 0-10.
4. **Edge Cases** — Does the PRD address edge cases, error states, and boundary conditions? Are failure modes considered? Score 0-10.
5. **Acceptance Criteria** — Are there clear, testable acceptance criteria for each feature or requirement? Could an engineer build from this? Score 0-10.

For each dimension:
- Assign a score from 0 to 10
- Assign a status: "pass" (7-10), "warning" (4-6), or "fail" (0-3)
- List specific issues found (empty array if none)
- List specific, actionable suggestions (empty array if none)

Calculate an overall_score from 0-100 based on a weighted assessment of all dimensions.
Provide a one-sentence overall_verdict summarizing the PRD quality.

Return this exact JSON structure:
{
  "overall_score": <number 0-100>,
  "overall_verdict": "<one sentence>",
  "dimensions": [
    {
      "name": "Success Metrics",
      "score": <number 0-10>,
      "status": "pass" | "warning" | "fail",
      "issues": ["<specific issue>"],
      "suggestions": ["<specific suggestion>"]
    },
    {
      "name": "Persona Definition",
      "score": <number 0-10>,
      "status": "pass" | "warning" | "fail",
      "issues": [],
      "suggestions": []
    },
    {
      "name": "Scope Clarity",
      "score": <number 0-10>,
      "status": "pass" | "warning" | "fail",
      "issues": [],
      "suggestions": []
    },
    {
      "name": "Edge Cases",
      "score": <number 0-10>,
      "status": "pass" | "warning" | "fail",
      "issues": [],
      "suggestions": []
    },
    {
      "name": "Acceptance Criteria",
      "score": <number 0-10>,
      "status": "pass" | "warning" | "fail",
      "issues": [],
      "suggestions": []
    }
  ]
}`;

function parseJsonResponse(text: string): AnalysisResult {
  // Strip markdown fences if the model wrapped the response
  const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  return JSON.parse(cleaned);
}

export async function analyzePRD(
  prdText: string,
  provider: Provider
): Promise<AnalysisResult> {
  switch (provider) {
    case "anthropic":
      return analyzeWithAnthropic(prdText);
    case "openai":
      return analyzeWithOpenAI(prdText);
    case "gemini":
      return analyzeWithGemini(prdText);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

async function analyzeWithAnthropic(prdText: string): Promise<AnalysisResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set in .env");

  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5-20250514";
  const client = new Anthropic({ apiKey });
  const message = await client.messages.create({
    model,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
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

async function analyzeWithOpenAI(prdText: string): Promise<AnalysisResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set in .env");

  const model = process.env.OPENAI_MODEL || "gpt-4o";
  const client = new OpenAI({ apiKey });
  const response = await client.chat.completions.create({
    model,
    temperature: 0.2,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Analyze the following PRD:\n\n${prdText}` },
    ],
  });

  const text = response.choices[0]?.message?.content;
  if (!text) throw new Error("No response from OpenAI");
  return parseJsonResponse(text);
}

async function analyzeWithGemini(prdText: string): Promise<AnalysisResult> {
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
            text: `${SYSTEM_PROMPT}\n\nAnalyze the following PRD:\n\n${prdText}`,
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
