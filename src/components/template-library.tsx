"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PRD_TEMPLATES, type PrdTemplate } from "@/lib/templates";

interface TemplateLibraryProps {
  open: boolean;
  onClose: () => void;
  onSelect: (template: PrdTemplate) => void;
}

export function TemplateLibrary({ open, onClose, onSelect }: TemplateLibraryProps) {
  const [preview, setPreview] = useState<PrdTemplate | null>(null);

  function handleSelect(template: PrdTemplate) {
    onSelect(template);
    setPreview(null);
    onClose();
  }

  function handleClose() {
    setPreview(null);
    onClose();
  }

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-4 z-50 mx-auto flex max-w-3xl flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-2xl sm:inset-y-8 sm:inset-x-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <div>
            <h2 className="text-sm font-bold text-[var(--foreground)]">
              {preview ? preview.title : "PRD Template Library"}
            </h2>
            <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
              {preview
                ? "Preview the template before loading"
                : "Start with a proven structure — customize it for your project"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {preview && (
              <button
                onClick={() => setPreview(null)}
                className="flex h-7 items-center gap-1 rounded-md border border-[var(--border)] px-2.5 text-xs font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Back
              </button>
            )}
            <button
              onClick={handleClose}
              className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {preview ? (
            /* Preview view */
            <div className="flex flex-col">
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <pre className="whitespace-pre-wrap text-xs leading-relaxed text-[var(--foreground)] font-mono">
                  {preview.content.trim()}
                </pre>
              </div>
              <div className="border-t border-[var(--border)] px-5 py-3">
                <button
                  onClick={() => handleSelect(preview)}
                  className="w-full rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] transition-all hover:bg-[var(--primary-hover)] hover:shadow-lg hover:shadow-[var(--primary)]/20"
                >
                  Use this template
                </button>
              </div>
            </div>
          ) : (
            /* Grid view */
            <div className="grid gap-3 p-5 sm:grid-cols-2">
              {PRD_TEMPLATES.map((template) => (
                <div
                  key={template.id}
                  className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition-all hover:border-[var(--primary)]/30 hover:shadow-sm"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <span className="text-2xl leading-none">{template.emoji}</span>
                    <div className="flex gap-1">
                      {template.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-[var(--muted)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--muted-foreground)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-[var(--card-foreground)]">
                    {template.title}
                  </h3>
                  <p className="mt-1.5 flex-1 text-xs leading-relaxed text-[var(--muted-foreground)]">
                    {template.description}
                  </p>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => setPreview(template)}
                      className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--card-foreground)] transition-colors hover:bg-[var(--surface-hover)]"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => handleSelect(template)}
                      className={cn(
                        "flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                        "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]"
                      )}
                    >
                      Use template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
