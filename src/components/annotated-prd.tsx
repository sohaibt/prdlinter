"use client";

import { useState, useMemo } from "react";
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
    bg: "bg-red-500/15",
    border: "border-red-500/40",
    text: "text-red-400",
    label: "Critical",
    dot: "bg-red-500",
  },
  warning: {
    bg: "bg-amber-500/15",
    border: "border-amber-500/40",
    text: "text-amber-400",
    label: "Warning",
    dot: "bg-amber-500",
  },
  suggestion: {
    bg: "bg-blue-500/15",
    border: "border-blue-500/40",
    text: "text-blue-400",
    label: "Suggestion",
    dot: "bg-blue-500",
  },
};

function buildSegments(
  text: string,
  annotations: InlineAnnotation[]
): TextSegment[] {
  // Find all match positions, avoiding overlaps
  const matches: { start: number; end: number; annotation: InlineAnnotation }[] = [];

  for (const ann of annotations) {
    if (!ann.quote || ann.quote.length < 3) continue;
    const idx = text.indexOf(ann.quote);
    if (idx === -1) continue;

    // Check for overlap with existing matches
    const end = idx + ann.quote.length;
    const overlaps = matches.some(
      (m) => idx < m.end && end > m.start
    );
    if (!overlaps) {
      matches.push({ start: idx, end, annotation: ann });
    }
  }

  // Sort by position
  matches.sort((a, b) => a.start - b.start);

  // Build segments
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

export function AnnotatedPrd({ prdText, annotations }: AnnotatedPrdProps) {
  const [activeAnnotation, setActiveAnnotation] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);

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

  if (annotations.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)]/50 p-8 text-center">
        <p className="text-sm text-[var(--muted-foreground)]">
          No inline annotations available for this analysis.
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
            const isActive = activeAnnotation === ann.quote;

            return (
              <span key={i} className="relative inline">
                <span
                  className={cn(
                    "cursor-pointer rounded-sm border-b-2 transition-all",
                    cfg.bg,
                    cfg.border,
                    isActive && "ring-2 ring-[var(--primary)]/30"
                  )}
                  onClick={() =>
                    setActiveAnnotation(isActive ? null : ann.quote)
                  }
                >
                  {seg.text}
                </span>
                {isActive && (
                  <span className="relative z-10 mt-1 block">
                    <span
                      className={cn(
                        "block rounded-lg border p-3 text-xs shadow-lg",
                        "bg-[var(--card)] border-[var(--border)]"
                      )}
                    >
                      <span className="mb-1 flex items-center gap-1.5">
                        <span
                          className={cn(
                            "h-2 w-2 rounded-full flex-shrink-0",
                            cfg.dot
                          )}
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
                      </span>
                      <span className="mt-1.5 block font-sans text-xs leading-relaxed text-[var(--card-foreground)]">
                        {ann.comment}
                      </span>
                    </span>
                  </span>
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
            return (
              <button
                key={i}
                onClick={() =>
                  setActiveAnnotation(
                    activeAnnotation === ann.quote ? null : ann.quote
                  )
                }
                className={cn(
                  "w-full rounded-lg border p-3 text-left transition-all",
                  activeAnnotation === ann.quote
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
