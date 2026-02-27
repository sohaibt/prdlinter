"use client";

import { useState, useRef } from "react";
import { ScoreBadge } from "@/components/score-badge";
import { DimensionCard } from "@/components/dimension-card";
import { exportAsMarkdown } from "@/lib/export";
import type { AnalysisResult } from "@/lib/llm";
import type { Provider } from "@/lib/llm";

export default function Home() {
  const [prdText, setPrdText] = useState("");
  const [provider, setProvider] = useState<Provider>("anthropic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const charCount = prdText.length;

  async function handleAnalyze() {
    if (!prdText.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: prdText, provider }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Analysis failed");
        return;
      }

      setResult(data as AnalysisResult);
    } catch {
      setError("Failed to connect to the analysis API. Is the server running?");
    } finally {
      setLoading(false);
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === "string") {
        setPrdText(text);
      }
    };
    reader.readAsText(file);

    // Reset file input so the same file can be re-uploaded
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleCopyMarkdown() {
    if (!result) return;
    const md = exportAsMarkdown(result);
    navigator.clipboard.writeText(md);
  }

  function handleReset() {
    setPrdText("");
    setResult(null);
    setError(null);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          PRD Linter
        </h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          AI-powered analysis of Product Requirement Documents. Runs locally —
          your data never leaves your machine.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Input Panel */}
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <label
                htmlFor="prd-input"
                className="text-sm font-medium text-[var(--card-foreground)]"
              >
                Paste your PRD
              </label>
              <span className="text-xs text-[var(--muted-foreground)]">
                {charCount.toLocaleString()} characters
              </span>
            </div>

            <textarea
              id="prd-input"
              value={prdText}
              onChange={(e) => setPrdText(e.target.value)}
              placeholder="Paste your Product Requirements Document here, or upload a file below..."
              className="h-80 w-full resize-y rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-1"
              disabled={loading}
            />

            <div className="mt-3 flex flex-wrap items-center gap-3">
              {/* File upload */}
              <label className="cursor-pointer rounded-md border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--card-foreground)] transition-colors hover:bg-[var(--accent)]">
                Upload .txt / .md
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.md"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={loading}
                />
              </label>

              {/* Provider selector */}
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as Provider)}
                className="rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                disabled={loading}
              >
                <option value="anthropic">Claude (Anthropic)</option>
                <option value="openai">GPT-4o (OpenAI)</option>
                <option value="gemini">Gemini 1.5 Pro (Google)</option>
              </select>
            </div>
          </div>

          {/* Analyze button */}
          <button
            onClick={handleAnalyze}
            disabled={loading || !prdText.trim()}
            className="rounded-md bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze PRD"}
          </button>

          {/* Error */}
          {error && (
            <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
              {error}
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="flex flex-col gap-4">
          {loading && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] p-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--muted)] border-t-[var(--foreground)]" />
              <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                Analyzing your PRD...
              </p>
            </div>
          )}

          {!loading && !result && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[var(--border)] bg-[var(--card)] p-12 text-center">
              <svg
                className="mb-3 h-10 w-10 text-[var(--muted-foreground)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
              <p className="text-sm text-[var(--muted-foreground)]">
                Paste a PRD and click &quot;Analyze PRD&quot; to get started
              </p>
            </div>
          )}

          {result && (
            <>
              {/* Overall score */}
              <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 text-center">
                <ScoreBadge score={result.overall_score} />
                <p className="mt-3 text-sm text-[var(--muted-foreground)]">
                  {result.overall_verdict}
                </p>
              </div>

              {/* Dimension cards */}
              {result.dimensions.map((dim) => (
                <DimensionCard key={dim.name} dimension={dim} />
              ))}

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCopyMarkdown}
                  className="flex-1 rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--card-foreground)] transition-colors hover:bg-[var(--accent)]"
                >
                  Copy Report as Markdown
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--card-foreground)] transition-colors hover:bg-[var(--accent)]"
                >
                  Analyze Another
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
