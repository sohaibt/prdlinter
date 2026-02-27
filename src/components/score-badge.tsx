"use client";

import { cn } from "@/lib/utils";

function getGrade(score: number): {
  letter: string;
  color: string;
  gradient: string;
} {
  if (score >= 90)
    return {
      letter: "A",
      color: "text-emerald-400",
      gradient: "from-emerald-400 to-green-500",
    };
  if (score >= 80)
    return {
      letter: "B",
      color: "text-green-400",
      gradient: "from-green-400 to-teal-500",
    };
  if (score >= 70)
    return {
      letter: "C",
      color: "text-yellow-400",
      gradient: "from-yellow-400 to-amber-500",
    };
  if (score >= 60)
    return {
      letter: "D",
      color: "text-orange-400",
      gradient: "from-orange-400 to-red-400",
    };
  return {
    letter: "F",
    color: "text-red-400",
    gradient: "from-red-400 to-rose-500",
  };
}

function getScoreRingColor(score: number): string {
  if (score >= 90) return "stroke-emerald-400";
  if (score >= 80) return "stroke-green-400";
  if (score >= 70) return "stroke-yellow-400";
  if (score >= 60) return "stroke-orange-400";
  return "stroke-red-400";
}

export function ScoreBadge({ score }: { score: number }) {
  const grade = getGrade(score);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-36 w-36">
        {/* Glow effect */}
        <div
          className={cn(
            "absolute inset-2 rounded-full bg-gradient-to-br opacity-20 blur-xl",
            grade.gradient
          )}
        />
        <svg className="relative h-36 w-36 -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            className="stroke-[var(--muted)]"
            strokeWidth="6"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            className={cn("score-ring", getScoreRingColor(score))}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-4xl font-bold tabular-nums", grade.color)}>
            {score}
          </span>
          <span
            className={cn(
              "mt-0.5 text-xs font-semibold uppercase tracking-widest",
              grade.color
            )}
          >
            Grade {grade.letter}
          </span>
        </div>
      </div>
    </div>
  );
}
