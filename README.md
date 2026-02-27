# PRD Linter

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**AI-powered analysis of Product Requirement Documents.** PRD Linter scans your PRDs through the lens of 4 distinct reviewer personas — a senior PM, an engineering lead, an executive, and a PM coach — flagging anti-patterns, scoring across 5 dimensions, and giving you a ship/revise/reject recommendation with blunt, actionable feedback.

Runs 100% locally. Your documents never leave your machine. No backend, no database, no deployment. Clone it, add an API key, and go.



---

## Why?

Good PRDs ship better products. But reviewing a PRD for completeness is tedious and easy to get wrong. PRD Linter automates the first pass — catching the structural issues that experienced PMs know to look for, so you can focus on the substance.

## Features

- **4 reviewer personas** — Senior PM, Engineering Lead, Executive, and PM Coach, each with a distinct evaluation lens and tone
- **Ship / Revise / Reject recommendation** — clear verdict with rationale, not just a score
- **Multi-LLM support** — choose between Anthropic, OpenAI, or Google Gemini with configurable models
- **5-dimension analysis** — scored rubric tailored to each persona's perspective
- **Rewrite examples** — reviewers show you what stronger writing looks like
- **PM Coach growth focus** — diagnoses your #1 PM skill gap with a development plan
- **PDF, Markdown & text upload** — paste text or upload .txt, .md, and .pdf files
- **Markdown export** — copy the full report to clipboard as formatted Markdown
- **Dark / light mode** — dark by default, toggle in the header
- **Privacy-first** — all processing happens locally via API calls you control
- **Zero infrastructure** — no database, no auth, no deployment needed

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (LTS recommended)
- An API key for at least one supported provider

## Setup

```bash
# 1. Clone the repository
git clone https://github.com/sohaibt/prdlinter.git
cd prdlinter

# 2. Copy the example env file and add your API key(s)
cp .env.example .env.local

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Getting API Keys

You only need a key for the provider(s) you want to use.

| Provider | Default Model | Get a Key |
|----------|---------------|-----------|
| Anthropic | Chose your favorite model | [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys) |
| OpenAI | Chose your favorite model | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| Google Gemini | Chose your favorite model | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) |

Add the key(s) to your `.env.local` file:

```
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AI...
```

### Custom models

Each provider uses a sensible default model, but you can override it in `.env.local`:

```
ANTHROPIC_MODEL=claude-opus-4-20250514
OPENAI_MODEL=gpt-4-turbo
GEMINI_MODEL=gemini-2.0-flash
```

Use any model your API key has access to — the app passes it straight through to the provider SDK.

## Reviewer Personas

Each persona evaluates your PRD through a completely different lens with its own 5 dimensions and tone.

### Senior PM Review

> Feedback as if from a Staff PM at Google, Meta, or Booking.com

Evaluates: Problem Clarity, Success Metrics, User Insight, Scope & Prioritization, Edge Cases & Risks. Zero tolerance for vague thinking, vanity metrics, or features built without evidence.

### Engineering Lead Review

> Feedback as if from a senior engineer deciding whether to start building

Evaluates: Technical Feasibility, Ambiguity & Completeness, Edge Cases & Error States, Scope Creep Risk, Testability. Asks one question: can my team build this without constantly interrupting the PM?

### Executive Review

> Feedback as if from a CPO or investor assessing strategic impact

Evaluates: Strategic Alignment, Business Impact, Market & Competitive Context, Resource Justification, Success Definition. Doesn't care about execution detail — evaluates whether this deserves to be built at all.

### PM Coach Review

> Developmental feedback on your PM thinking and craft

Evaluates: Problem Thinking, User Empathy, Metrics Thinking, Prioritization & Trade-off Thinking, Communication Clarity. Diagnoses thinking patterns and returns a **Growth Focus** — the #1 PM skill to develop, with a specific recommendation.

## Output

All personas return:
- **Overall score** (0–100) with letter grade (A–F)
- **Ship recommendation** — ship, revise, or reject with rationale
- **5 dimension cards** — score, status (pass/warning/fail), issues, suggestions, and optional rewrite examples
- **Markdown export** — full report formatted for pasting into docs, Slack, or PRs

The PM Coach persona additionally returns a **Growth Focus** callout with skill diagnosis and development plan.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts     # POST endpoint for PRD analysis
│   │   └── parse-pdf/route.ts   # POST endpoint for PDF text extraction
│   ├── globals.css              # Global styles, themes, animations
│   ├── layout.tsx               # Root layout + theme init script
│   └── page.tsx                 # Main UI (input + results)
├── components/
│   ├── dimension-card.tsx       # Individual dimension result card
│   ├── persona-selector.tsx     # 4-option persona card selector
│   ├── score-badge.tsx          # Animated overall score ring + grade
│   └── theme-toggle.tsx         # Dark / light mode toggle
└── lib/
    ├── export.ts                # Markdown export utility
    ├── llm.ts                   # Multi-provider LLM abstraction
    ├── personas.ts              # 4 persona system prompts + metadata
    └── utils.ts                 # Tailwind merge utility
```

## Contributing

Contributions are welcome! Here are some ways to help:

1. **Report bugs** — open an issue describing the problem and steps to reproduce
2. **Add personas** — new reviewer perspectives are easy to add in `src/lib/personas.ts`
3. **Add providers** — the LLM abstraction in `src/lib/llm.ts` is designed to make adding new providers straightforward
4. **Improve prompts** — better prompts lead to better analysis; PRs welcome
5. **Fix issues** — check the issue tracker for open items

### Development

```bash
npm install
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000). The API route is at `POST /api/analyze`.

## License

[MIT](LICENSE)
