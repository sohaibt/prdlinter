# PRD Linter

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**AI-powered analysis of Product Requirement Documents.** PRD Linter scans your PRDs for common PM anti-patterns — missing success metrics, vague personas, unclear scope, unhandled edge cases, and weak acceptance criteria — and gives you a concrete score with actionable suggestions.

Runs 100% locally. Your documents never leave your machine. No backend, no database, no deployment. Clone it, add an API key, and go.

[![Screenshot placeholder]([https://github.com/sohaibt/prdlinter/blob/main/PRD%20Linter%20Preview.png)]

---

## Why?

Good PRDs ship better products. But reviewing a PRD for completeness is tedious and easy to get wrong. PRD Linter automates the first pass — catching the structural issues that experienced PMs know to look for, so you can focus on the substance.

## Features

- **Multi-LLM support** — choose between Anthropic, OpenAI, or Google Gemini with configurable models
- **5-dimension analysis** — scored rubric covering the most common PRD gaps
- **PDF, Markdown & text upload** — paste text or upload .txt, .md, and .pdf files
- **Actionable feedback** — specific issues and suggestions, not vague advice
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
git clone https://github.com/your-username/prdlinter.git
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

## The 5 Dimensions

PRD Linter evaluates your document across five dimensions, each scored 0–10:

### 1. Success Metrics
Does the PRD define clear, measurable success metrics? Are there KPIs, targets, and timelines?

### 2. Persona Definition
Are target users clearly defined with needs, pain points, and context? Are there specific user segments?

### 3. Scope Clarity
Is the scope well-defined? Are there clear boundaries of what's in and out of scope? Are requirements unambiguous?

### 4. Edge Cases
Does the PRD address edge cases, error states, and boundary conditions? Are failure modes considered?

### 5. Acceptance Criteria
Are there clear, testable acceptance criteria for each feature or requirement? Could an engineer build from this?

Each dimension receives a status:
- **Pass** (7–10) — meets the bar
- **Warning** (4–6) — needs improvement
- **Fail** (0–3) — significant gaps

The overall score (0–100) is a weighted assessment across all five dimensions.

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
│   ├── score-badge.tsx          # Animated overall score ring + grade
│   └── theme-toggle.tsx         # Dark / light mode toggle
└── lib/
    ├── export.ts                # Markdown export utility
    ├── llm.ts                   # Multi-provider LLM abstraction
    └── utils.ts                 # Tailwind merge utility
```

## Contributing

Contributions are welcome! Here are some ways to help:

1. **Report bugs** — open an issue describing the problem and steps to reproduce
2. **Suggest dimensions** — have an idea for a new analysis dimension? Open an issue to discuss
3. **Add providers** — the LLM abstraction in `src/lib/llm.ts` is designed to make adding new providers straightforward
4. **Improve the prompt** — better prompts lead to better analysis; PRs welcome
5. **Fix issues** — check the issue tracker for open items

### Development

```bash
npm install
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000). The API route is at `POST /api/analyze`.

## License

[MIT](LICENSE)
