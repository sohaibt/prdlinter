"use client";

import { useState, useRef, useCallback } from "react";
import { ScoreBadge } from "@/components/score-badge";
import { DimensionCard } from "@/components/dimension-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { exportAsMarkdown } from "@/lib/export";
import type { AnalysisResult } from "@/lib/llm";
import type { Provider } from "@/lib/llm";

export default function Home() {
  const [prdText, setPrdText] = useState("");
  const [provider, setProvider] = useState<Provider>("anthropic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const charCount = prdText.length;

  function showToast(msg: string) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }

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

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.type === "application/pdf") {
        setFileName(file.name);
        try {
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch("/api/parse-pdf", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          if (!res.ok) {
            setError(data.error || "Failed to parse PDF");
            return;
          }
          setPrdText(data.text);
          showToast(`Loaded ${file.name}`);
        } catch {
          setError("Failed to parse PDF file.");
        }
      } else {
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result;
          if (typeof text === "string") {
            setPrdText(text);
            showToast(`Loaded ${file.name}`);
          }
        };
        reader.readAsText(file);
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    []
  );

  function handleCopyMarkdown() {
    if (!result) return;
    const md = exportAsMarkdown(result);
    navigator.clipboard.writeText(md);
    showToast("Report copied to clipboard");
  }

  function handleReset() {
    setPrdText("");
    setResult(null);
    setError(null);
    setFileName(null);
  }

  return (
    <div className="relative min-h-screen">
      {/* Background gradient accent */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-48 left-1/2 h-96 w-[800px] -translate-x-1/2 rounded-full bg-[var(--primary)] opacity-[0.03] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)]">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-[var(--foreground)]">
                PRD Linter
              </h1>
              <p className="text-xs text-[var(--muted-foreground)]">
                AI-powered PRD analysis — runs 100% locally
              </p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr,1fr]">
          {/* Input Panel */}
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <label
                  htmlFor="prd-input"
                  className="text-sm font-semibold text-[var(--card-foreground)]"
                >
                  Your PRD
                </label>
                <span className="rounded-md bg-[var(--muted)] px-2 py-0.5 text-[11px] font-medium tabular-nums text-[var(--muted-foreground)]">
                  {charCount.toLocaleString()} chars
                </span>
              </div>

              <textarea
                id="prd-input"
                value={prdText}
                onChange={(e) => setPrdText(e.target.value)}
                placeholder="Paste your Product Requirements Document here..."
                className="h-72 w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 py-3 text-sm leading-relaxed text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                disabled={loading}
              />

              {/* Controls row */}
              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                {/* File upload */}
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--card-foreground)] transition-colors hover:bg-[var(--surface-hover)]">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[var(--muted-foreground)]"
                  >
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Upload file
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.md,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={loading}
                  />
                </label>

                {fileName && (
                  <span className="flex items-center gap-1.5 rounded-md bg-[var(--muted)] px-2.5 py-1.5 text-xs text-[var(--muted-foreground)]">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    {fileName}
                  </span>
                )}

                <span className="hidden text-[var(--border)] sm:block">|</span>

                <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                  .txt .md .pdf
                </span>

                {/* Provider selector */}
                <div className="ml-auto">
                  <select
                    value={provider}
                    onChange={(e) =>
                      setProvider(e.target.value as Provider)
                    }
                    className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                    disabled={loading}
                  >
                    <option value="anthropic">Anthropic</option>
                    <option value="openai">OpenAI</option>
                    <option value="gemini">Google Gemini</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Analyze button */}
            <button
              onClick={handleAnalyze}
              disabled={loading || !prdText.trim()}
              className="group relative rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-[var(--primary-foreground)] transition-all hover:bg-[var(--primary-hover)] hover:shadow-lg hover:shadow-[var(--primary)]/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="opacity-25"
                    />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      className="opacity-75"
                    />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                "Analyze PRD"
              )}
            </button>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="mt-0.5 flex-shrink-0"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="flex flex-col gap-4">
            {loading && (
              <div className="flex flex-col gap-4">
                {/* Skeleton loader */}
                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="skeleton h-36 w-36 rounded-full" />
                    <div className="skeleton h-4 w-48 rounded-md" />
                  </div>
                </div>
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="skeleton h-9 w-9 rounded-lg" />
                        <div className="skeleton h-4 w-28 rounded-md" />
                      </div>
                      <div className="skeleton h-6 w-16 rounded-md" />
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="skeleton h-3 w-full rounded" />
                      <div className="skeleton h-3 w-3/4 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && !result && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)]/50 p-16 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--muted)]">
                  <svg
                    className="h-6 w-6 text-[var(--muted-foreground)]"
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
                </div>
                <p className="text-sm font-medium text-[var(--foreground)]">
                  No analysis yet
                </p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  Paste a PRD or upload a file, then click Analyze
                </p>
              </div>
            )}

            {!loading && result && (
              <div className="animate-fade-in flex flex-col gap-4">
                {/* Overall score */}
                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 text-center shadow-sm">
                  <ScoreBadge score={result.overall_score} />
                  <p className="mt-4 text-sm leading-relaxed text-[var(--muted-foreground)]">
                    {result.overall_verdict}
                  </p>
                </div>

                {/* Dimension cards */}
                {result.dimensions.map((dim, i) => (
                  <DimensionCard key={dim.name} dimension={dim} index={i} />
                ))}

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleCopyMarkdown}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium text-[var(--card-foreground)] transition-colors hover:bg-[var(--surface-hover)]"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect
                        x="9"
                        y="9"
                        width="13"
                        height="13"
                        rx="2"
                        ry="2"
                      />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                    Copy as Markdown
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium text-[var(--card-foreground)] transition-colors hover:bg-[var(--surface-hover)]"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="1 4 1 10 7 10" />
                      <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
                    </svg>
                    Analyze Another
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t border-[var(--border)] pt-6 text-center">
          <p className="text-xs text-[var(--muted-foreground)]">
            PRD Linter — Open source, runs locally, your data never leaves your
            machine.
          </p>
        </footer>
      </div>

      {/* Toast */}
      {toast && (
        <div className="toast-enter fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium text-[var(--card-foreground)] shadow-lg">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-emerald-400"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
