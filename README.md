# PRD Linter

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**AI-powered analysis of Product Requirement Documents.** PRD Linter scans your PRDs through the lens of 4 distinct reviewer personas — a senior PM, an engineering lead, an executive, and a PM coach — flagging anti-patterns, scoring across 5 dimensions, and giving you a ship/revise/reject recommendation with blunt, actionable feedback.

Runs 100% locally. Your documents never leave your machine. No backend, no database, no deployment. Clone it, add an API key, and go.

![PRD Linter Preview](https://raw.githubusercontent.com/sohaibt/prdlinter/refs/heads/main/PRD%20Linter%20Preview.png)
======

---

## Why?

Good PRDs ship better products. But reviewing a PRD for completeness is tedious and easy to get wrong. PRD Linter automates the first pass — catching the structural issues that experienced PMs know to look for, so you can focus on the substance.

## Features

- **4 reviewer personas** — Senior PM, Engineering Lead, Executive, and PM Coach, each with a distinct evaluation lens and tone
- **Ship / Revise / Reject recommendation** — clear verdict with rationale, not just a score
- **Inline annotations** — section-by-section feedback highlighting specific passages in your PRD, like a code review for product writing
- **History & progress tracking** — automatically saves up to 50 past analyses in your browser, grouped by date, so you can track improvement over time
- **Shareable report links** — generate a single URL that contains the entire compressed report; share it with teammates without any server or database
- **PRD templates** — 6 starter templates (New Feature, Platform Migration, API Spec, Growth Experiment, Bug Fix, Mobile Feature) to kickstart your writing
- **Free demo mode** — ships with Groq (Llama 3.3 70B) as the default provider, free tier, no credit card needed
- **Multi-LLM support** — choose between Groq, Anthropic, OpenAI, or Google Gemini with configurable models
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

| Provider | Default Model | Free Tier | Get a Key |
|----------|---------------|-----------|-----------|
| **Groq** | llama-3.3-70b-versatile | Yes | [console.groq.com/keys](https://console.groq.com/keys) |
| Anthropic | claude-sonnet-4-5-20250514 | No | [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys) |
| OpenAI | gpt-4o | No | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| Google Gemini | gemini-1.5-pro | No | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) |

**Groq is the default** and works on the free tier with no credit card required — perfect for demos and trying the tool out. For production-quality analysis (including inline annotations), use Anthropic, OpenAI, or Gemini.

Add the key(s) to your `.env.local` file:

```
GROQ_API_KEY=gsk_...
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AI...
```

### Custom models

Each provider uses a sensible default model, but you can override it in `.env.local`:

```
GROQ_MODEL=llama-3.1-8b-instant
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
- **Inline annotations** — 5–15 highlighted passages in your PRD with targeted, severity-tagged feedback (critical / warning / suggestion)
- **Markdown export** — full report formatted for pasting into docs, Slack, or PRs
- **Shareable link** — a single URL encoding the full compressed report

The PM Coach persona additionally returns a **Growth Focus** callout with skill diagnosis and development plan.

### Inline Review

After analysis, switch to the **Inline Review** tab to see your PRD text with color-coded highlights:

- **Red** — critical issues that block shipping
- **Amber** — warnings that should be fixed
- **Blue** — suggestions for improvement

Click any highlight to see the feedback popover. Use the filter bar to focus on a specific severity. The annotation summary list at the bottom lets you jump to any highlight in the document.

> **Note:** Inline annotations work best with more capable models (Claude, GPT-4o, Gemini Pro). The Groq free-tier model may not reliably return annotations.

### History & Progress Tracking

Every analysis is automatically saved to your browser's local storage (up to 50 entries). Click the **History** button in the header to open the sidebar, where past analyses are grouped by date (Today, Yesterday, This Week, Older). Click any entry to reload the full report; delete individual entries or clear all history from the sidebar. No account or server needed — everything stays in your browser.

### Shareable Report Links

After analysis, click the **Share Link** button to generate a URL that contains the entire report. The analysis result is compressed using the browser's native `CompressionStream` API and encoded into a base64url query parameter. Anyone with the link can view the full report — no login, no server, no expiration. Recipients see a "Viewing a shared report" banner.

### Templates

Click the **Templates** button in the header to browse 6 PRD starter templates:

| Template | Use case |
|----------|----------|
| **New Feature PRD** | Standard feature requests with problem, goals, user stories, scope, and risks |
| **Platform Migration PRD** | Infrastructure changes with migration strategy, rollback plans, and phased rollout |
| **API Specification PRD** | API design with endpoints, schemas, authentication, and rate limits |
| **Growth Experiment PRD** | A/B tests with hypothesis, variants, metrics, and statistical analysis plans |
| **Bug Fix / Incident PRD** | Critical bugs with root cause analysis, fix approach, and prevention measures |
| **Mobile Feature PRD** | Mobile app features with platform-specific considerations, offline behavior, and device constraints |

Preview any template before loading it into the editor. Each template includes placeholder sections that guide you toward a complete, reviewable PRD.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts     # POST endpoint for PRD analysis
│   │   └── parse-pdf/route.ts   # POST endpoint for PDF text extraction
│   ├── globals.css              # Global styles, themes, animations
│   ├── layout.tsx               # Root layout + theme init script
│   └── page.tsx                 # Main UI (input + results + inline review)
├── components/
│   ├── annotated-prd.tsx        # Inline annotation viewer with highlights
│   ├── dimension-card.tsx       # Individual dimension result card
│   ├── history-sidebar.tsx      # History sidebar with date-grouped entries
│   ├── persona-selector.tsx     # 4-option persona card selector
│   ├── score-badge.tsx          # Animated overall score ring + grade
│   ├── template-library.tsx     # Template browser modal with preview
│   └── theme-toggle.tsx         # Dark / light mode toggle
└── lib/
    ├── export.ts                # Markdown export utility
    ├── history.ts               # localStorage-based history (save/load/delete)
    ├── llm.ts                   # Multi-provider LLM abstraction + types
    ├── personas.ts              # 4 persona system prompts + annotation instructions
    ├── share.ts                 # Compress/decompress shareable report URLs
    ├── templates.ts             # 6 PRD starter templates
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
