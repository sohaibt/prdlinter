"use client";

import { cn } from "@/lib/utils";

interface Dimension {
  name: string;
  score: number;
  status: "pass" | "warning" | "fail";
  issues: string[];
  suggestions: string[];
}

const statusConfig = {
  pass: {
    label: "Pass",
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    border: "border-emerald-500/20",
    bar: "bg-emerald-500",
  },
  warning: {
    label: "Warning",
    bg: "bg-amber-500/10",
    text: "text-amber-500",
    border: "border-amber-500/20",
    bar: "bg-amber-500",
  },
  fail: {
    label: "Fail",
    bg: "bg-red-500/10",
    text: "text-red-500",
    border: "border-red-500/20",
    bar: "bg-red-500",
  },
};

const dimensionIcons: Record<string, string> = {
  "Success Metrics": "M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  "Persona Definition": "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  "Scope Clarity": "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
  "Edge Cases": "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  "Acceptance Criteria": "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
};

export function DimensionCard({
  dimension,
  index,
}: {
  dimension: Dimension;
  index: number;
}) {
  const config = statusConfig[dimension.status];
  const iconPath = dimensionIcons[dimension.name] || dimensionIcons["Success Metrics"];

  return (
    <div
      className="animate-slide-up overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] transition-shadow hover:shadow-lg hover:shadow-[var(--glow)]"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
    >
      {/* Score bar at top */}
      <div className="h-1 bg-[var(--muted)]">
        <div
          className={cn("h-full transition-all duration-700", config.bar)}
          style={{ width: `${dimension.score * 10}%` }}
        />
      </div>

      <div className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg",
                config.bg
              )}
            >
              <svg
                className={cn("h-4.5 w-4.5", config.text)}
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={iconPath} />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-[var(--card-foreground)]">
              {dimension.name}
            </h3>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-lg font-bold tabular-nums text-[var(--card-foreground)]">
              {dimension.score}
              <span className="text-xs font-normal text-[var(--muted-foreground)]">
                /10
              </span>
            </span>
            <span
              className={cn(
                "rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
                config.bg,
                config.text,
                config.border
              )}
            >
              {config.label}
            </span>
          </div>
        </div>

        {dimension.issues.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-red-400"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              Issues
            </p>
            <ul className="space-y-1.5">
              {dimension.issues.map((issue, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-sm leading-relaxed text-[var(--card-foreground)]"
                >
                  <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-red-400/60" />
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}

        {dimension.suggestions.length > 0 && (
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-[var(--primary)]"
              >
                <path d="M12 2v4m0 12v4m-7.07-3.93l2.83-2.83m8.48-8.48l2.83-2.83M2 12h4m12 0h4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83" />
              </svg>
              Suggestions
            </p>
            <ul className="space-y-1.5">
              {dimension.suggestions.map((suggestion, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-sm leading-relaxed text-[var(--card-foreground)]"
                >
                  <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-[var(--primary)]/60" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}

        {dimension.issues.length === 0 && dimension.suggestions.length === 0 && (
          <p className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-emerald-400"
            >
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            No issues found. Looking good!
          </p>
        )}
      </div>
    </div>
  );
}
