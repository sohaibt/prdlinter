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
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/20",
  },
  warning: {
    label: "Warning",
    bg: "bg-yellow-500/10",
    text: "text-yellow-600 dark:text-yellow-400",
    border: "border-yellow-500/20",
  },
  fail: {
    label: "Fail",
    bg: "bg-red-500/10",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-500/20",
  },
};

export function DimensionCard({ dimension }: { dimension: Dimension }) {
  const config = statusConfig[dimension.status];

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-[var(--card-foreground)]">
          {dimension.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[var(--muted-foreground)]">
            {dimension.score}/10
          </span>
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 text-xs font-medium",
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
        <div className="mb-3">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
            Issues
          </p>
          <ul className="space-y-1">
            {dimension.issues.map((issue, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm text-[var(--card-foreground)]"
              >
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}

      {dimension.suggestions.length > 0 && (
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
            Suggestions
          </p>
          <ul className="space-y-1">
            {dimension.suggestions.map((suggestion, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm text-[var(--card-foreground)]"
              >
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {dimension.issues.length === 0 && dimension.suggestions.length === 0 && (
        <p className="text-sm text-[var(--muted-foreground)]">
          No issues found. Looking good!
        </p>
      )}
    </div>
  );
}
