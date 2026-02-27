"use client";

import { cn } from "@/lib/utils";
import { PERSONA_LIST, type PersonaId } from "@/lib/personas";

interface PersonaSelectorProps {
  value: PersonaId;
  onChange: (id: PersonaId) => void;
  disabled?: boolean;
}

export function PersonaSelector({
  value,
  onChange,
  disabled,
}: PersonaSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {PERSONA_LIST.map((persona) => {
        const isActive = value === persona.id;
        return (
          <button
            key={persona.id}
            onClick={() => onChange(persona.id)}
            disabled={disabled}
            className={cn(
              "flex flex-col items-start rounded-xl border px-3 py-2.5 text-left transition-all",
              isActive
                ? "border-[var(--primary)] bg-[var(--primary)]/5 shadow-sm shadow-[var(--primary)]/10"
                : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--muted-foreground)]/30 hover:bg-[var(--surface-hover)]",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <span className="text-base leading-none">{persona.emoji}</span>
            <span
              className={cn(
                "mt-1.5 text-xs font-semibold leading-tight",
                isActive
                  ? "text-[var(--primary)]"
                  : "text-[var(--card-foreground)]"
              )}
            >
              {persona.label}
            </span>
            <span className="mt-1 text-[10px] leading-snug text-[var(--muted-foreground)]">
              {persona.subtitle}
            </span>
          </button>
        );
      })}
    </div>
  );
}
