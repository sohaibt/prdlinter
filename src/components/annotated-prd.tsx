"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { InlineAnnotation } from "@/lib/llm";

interface AnnotatedPrdProps {
  prdText: string;
  annotations: InlineAnnotation[];
}

interface TextSegment {
  text: string;
  annotation?: InlineAnnotation;
}

const severityConfig = {
  critical: {
    bg: "bg-red-500/20",
    hoverBg: "hover:bg-red-500/30",
    border: "border-red-500/50",
    text: "text-red-400",
    label: "Critical",
    dot: "bg-red-500",
  },
  warning: {
    bg: "bg-amber-500/20",
    hoverBg: "hover:bg-amber-500/30",
    border: "border-amber-500/50",
    text: "text-amber-400",
    label: "Warning",
    dot: "bg-amber-500",
  },
  suggestion: {
    bg: "bg-blue-500/20",
    hoverBg: "hover:bg-blue-500/30",
    border: "border-blue-500/50",
    text: "text-blue-400",
    label: "Suggestion",
    dot: "bg-blue-500",
  },
};

function buildSegments(
  text: string,
  annotations: InlineAnnotation[]
): TextSegment[] {
  const matches: { start: number; end: number; annotation: InlineAnnotation }[] = [];

  for (const ann of annotations) {
    if (!ann.quote || ann.quote.length < 3) continue;
    const idx = text.indexOf(ann.quote);
    if (idx === -1) continue;
    const end = idx + ann.quote.length;
    const overlaps = matches.some((m) => idx < m.end && end > m.start);
    if (!overlaps) {
      matches.push({ start: idx, end, annotation: ann });
    }
  }

  matches.sort((a, b) => a.start - b.start);

  const segments: TextSegment[] = [];
  let cursor = 0;

  for (const match of matches) {
    if (match.start > cursor) {
      segments.push({ text: text.slice(cursor, match.start) });
    }
    segments.push({
      text: text.slice(match.start, match.end),
      annotation: match.annotation,
    });
    cursor = match.end;
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor) });
  }

  return segments;
}

function AnnotationPopover({
  annotation,
  onClose,
}: {
  annotation: InlineAnnotation;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const cfg = severityConfig[annotation.severity] || severityConfig.suggestion;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute left-0 right-0 z-50 mt-1"
      style={{ top: "100%" }}
    >
      <div
        className={cn(
          "rounded-lg border p-3 shadow-xl",
          "bg-[var(--card)] border-[var(--border)]"
        )}
      >
        <div className="mb-1.5 flex items-center gap-1.5">
          <span className={cn("h-2 w-2 rounded-full flex-shrink-0", cfg.dot)} />
          <span
            className={cn(
              "text-[10px] font-bold uppercase tracking-wider",
              cfg.text
            )}
          >
            {cfg.label}
          </span>
          <span className="text-[10px] text-[var(--muted-foreground)]">
            — {annotation.dimension}
          </span>
        </div>
        <p className="font-sans text-xs leading-relaxed text-[var(--card-foreground)]">
          {annotation.comment}
        </p>
      </div>
    </div>
  );
}

export function AnnotatedPrd({ prdText, annotations }: AnnotatedPrdProps) {
  const [activeQuote, setActiveQuote] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);
  const highlightRefs = useRef<Map<string, HTMLElement>>(new Map());

  const filteredAnnotations = useMemo(
    () =>
      filterSeverity
        ? annotations.filter((a) => a.severity === filterSeverity)
        : annotations,
    [annotations, filterSeverity]
  );

  const segments = useMemo(
    () => buildSegments(prdText, filteredAnnotations),
    [prdText, filteredAnnotations]
  );

  const counts = useMemo(() => {
    const c = { critical: 0, warning: 0, suggestion: 0 };
    for (const a of annotations) {
      if (a.severity in c) c[a.severity as keyof typeof c]++;
    }
    return c;
  }, [annotations]);

  const handleHighlightClick = useCallback((quote: string) => {
    setActiveQuote((prev) => (prev === quote ? null : quote));
  }, []);

  const handleClosePopover = useCallback(() => {
    setActiveQuote(null);
  }, []);

  const scrollToHighlight = useCallback((quote: string) => {
    setActiveQuote(quote);
    const el = highlightRefs.current.get(quote);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  if (annotations.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)]/50 p-8 text-center">
        <p className="text-sm text-[var(--muted-foreground)]">
          No inline annotations available for this analysis.
        </p>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]/70">
          Try using a more capable model (Claude, GPT-4o) for richer feedback.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
          Filter:
        </span>
        <button
          onClick={() => setFilterSeverity(null)}
          className={cn(
            "rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
            !filterSeverity
              ? "bg-[var(--primary)]/10 text-[var(--primary)]"
              : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
          )}
        >
          All ({annotations.length})
        </button>
        {(["critical", "warning", "suggestion"] as const).map((sev) => {
          const cfg = severityConfig[sev];
          return (
            <button
              key={sev}
              onClick={() =>
                setFilterSeverity(filterSeverity === sev ? null : sev)
              }
              className={cn(
                "flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
                filterSeverity === sev
                  ? `${cfg.bg} ${cfg.text}`
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
              {cfg.label} ({counts[sev]})
            </button>
          );
        })}
      </div>

      {/* Annotated text */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
        <div className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-[var(--foreground)]">
          {segments.map((seg, i) => {
            if (!seg.annotation) {
              return <span key={i}>{seg.text}</span>;
            }

            const ann = seg.annotation;
            const cfg = severityConfig[ann.severity] || severityConfig.suggestion;
            const isActive = activeQuote === ann.quote;

            return (
              <span
                key={i}
                className="relative inline-block"
                style={{ verticalAlign: "baseline" }}
                ref={(el) => {
                  if (el) highlightRefs.current.set(ann.quote, el);
                }}
              >
                <mark
                  role="button"
                  tabIndex={0}
                  className={cn(
                    "cursor-pointer rounded-sm border-b-2 px-0.5 text-inherit transition-all",
                    "not-italic no-underline",
                    cfg.bg,
                    cfg.hoverBg,
                    cfg.border,
                    isActive && "ring-2 ring-[var(--primary)]/40"
                  )}
                  style={{ backgroundColor: undefined }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHighlightClick(ann.quote);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleHighlightClick(ann.quote);
                    }
                  }}
                >
                  {seg.text}
                </mark>
                {isActive && (
                  <AnnotationPopover
                    annotation={ann}
                    onClose={handleClosePopover}
                  />
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* Annotations summary list */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
          All Annotations ({filteredAnnotations.length})
        </p>
        <div className="space-y-2">
          {filteredAnnotations.map((ann, i) => {
            const cfg = severityConfig[ann.severity] || severityConfig.suggestion;
            const isActive = activeQuote === ann.quote;
            return (
              <button
                key={i}
                onClick={() => scrollToHighlight(ann.quote)}
                className={cn(
                  "w-full rounded-lg border p-3 text-left transition-all",
                  isActive
                    ? "border-[var(--primary)]/30 bg-[var(--primary)]/5"
                    : "border-[var(--border)] hover:border-[var(--muted-foreground)]/30"
                )}
              >
                <div className="mb-1 flex items-center gap-1.5">
                  <span
                    className={cn("h-2 w-2 rounded-full flex-shrink-0", cfg.dot)}
                  />
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider",
                      cfg.text
                    )}
                  >
                    {cfg.label}
                  </span>
                  <span className="text-[10px] text-[var(--muted-foreground)]">
                    — {ann.dimension}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-[var(--card-foreground)]">
                  {ann.comment}
                </p>
                <p className="mt-1 truncate text-[11px] italic text-[var(--muted-foreground)]">
                  &ldquo;{ann.quote}&rdquo;
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
