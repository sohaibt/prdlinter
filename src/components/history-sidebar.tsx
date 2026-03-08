"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { HistoryEntry } from "@/lib/history";
import { deleteFromHistory, clearHistory } from "@/lib/history";

function scoreColor(score: number): string {
  if (score >= 90) return "text-emerald-400";
  if (score >= 80) return "text-green-400";
  if (score >= 70) return "text-yellow-400";
  if (score >= 60) return "text-orange-400";
  return "text-red-400";
}

function scoreBg(score: number): string {
  if (score >= 90) return "bg-emerald-400/10";
  if (score >= 80) return "bg-green-400/10";
  if (score >= 70) return "bg-yellow-400/10";
  if (score >= 60) return "bg-orange-400/10";
  return "bg-red-400/10";
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface HistorySidebarProps {
  open: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onHistoryChange: () => void;
}

export function HistorySidebar({
  open,
  onClose,
  history,
  onSelect,
  onHistoryChange,
}: HistorySidebarProps) {
  const [confirmClear, setConfirmClear] = useState(false);

  function handleDelete(id: string) {
    deleteFromHistory(id);
    onHistoryChange();
  }

  function handleClear() {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
      return;
    }
    clearHistory();
    onHistoryChange();
    setConfirmClear(false);
  }

  // Group history by date
  const groups: { label: string; entries: HistoryEntry[] }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const todayEntries: HistoryEntry[] = [];
  const yesterdayEntries: HistoryEntry[] = [];
  const weekEntries: HistoryEntry[] = [];
  const olderEntries: HistoryEntry[] = [];

  for (const entry of history) {
    const d = new Date(entry.timestamp);
    if (d >= today) todayEntries.push(entry);
    else if (d >= yesterday) yesterdayEntries.push(entry);
    else if (d >= weekAgo) weekEntries.push(entry);
    else olderEntries.push(entry);
  }

  if (todayEntries.length) groups.push({ label: "Today", entries: todayEntries });
  if (yesterdayEntries.length) groups.push({ label: "Yesterday", entries: yesterdayEntries });
  if (weekEntries.length) groups.push({ label: "This Week", entries: weekEntries });
  if (olderEntries.length) groups.push({ label: "Older", entries: olderEntries });

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-200",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-[var(--border)] bg-[var(--background)] shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[var(--primary)]"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <h2 className="text-sm font-bold text-[var(--foreground)]">
              Previous Analyses
            </h2>
            <span className="rounded-md bg-[var(--muted)] px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-[var(--muted-foreground)]">
              {history.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--muted)]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-[var(--muted-foreground)]"
                >
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <p className="text-sm font-medium text-[var(--foreground)]">No analyses yet</p>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                Your analysis history will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {groups.map((group) => (
                <div key={group.label}>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                    {group.label}
                  </p>
                  <div className="space-y-2">
                    {group.entries.map((entry) => (
                      <button
                        key={entry.id}
                        onClick={() => { onSelect(entry); onClose(); }}
                        className="group relative w-full rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 text-left transition-all hover:border-[var(--primary)]/30 hover:shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-[var(--card-foreground)]">
                              {entry.title}
                            </p>
                            <p className="mt-0.5 text-[11px] text-[var(--muted-foreground)]">
                              {formatDate(entry.timestamp)}
                            </p>
                          </div>
                          <span
                            className={cn(
                              "flex-shrink-0 rounded-md px-2 py-0.5 text-xs font-bold tabular-nums",
                              scoreColor(entry.score),
                              scoreBg(entry.score)
                            )}
                          >
                            {entry.score}
                          </span>
                        </div>
                        {/* Delete button */}
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={(e) => { e.stopPropagation(); handleDelete(entry.id); }}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); handleDelete(entry.id); } }}
                          className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded text-[var(--muted-foreground)] opacity-0 transition-opacity hover:bg-[var(--muted)] hover:text-[var(--destructive)] group-hover:opacity-100"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="border-t border-[var(--border)] px-5 py-3">
            <button
              onClick={handleClear}
              className={cn(
                "w-full rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                confirmClear
                  ? "bg-[var(--destructive)]/10 text-[var(--destructive)]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              )}
            >
              {confirmClear ? "Click again to confirm" : "Clear all history"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
