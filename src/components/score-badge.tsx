"use client";

import { cn } from "@/lib/utils";

function getGrade(score: number): { letter: string; color: string } {
  if (score >= 90) return { letter: "A", color: "text-emerald-500" };
  if (score >= 80) return { letter: "B", color: "text-green-500" };
  if (score >= 70) return { letter: "C", color: "text-yellow-500" };
  if (score >= 60) return { letter: "D", color: "text-orange-500" };
  return { letter: "F", color: "text-red-500" };
}

function getScoreRingColor(score: number): string {
  if (score >= 90) return "stroke-emerald-500";
  if (score >= 80) return "stroke-green-500";
  if (score >= 70) return "stroke-yellow-500";
  if (score >= 60) return "stroke-orange-500";
  return "stroke-red-500";
}

export function ScoreBadge({ score }: { score: number }) {
  const grade = getGrade(score);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-32 w-32">
        <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            className="stroke-[var(--border)]"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            className={cn(getScoreRingColor(score))}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-3xl font-bold", grade.color)}>
            {score}
          </span>
          <span className={cn("text-sm font-semibold", grade.color)}>
            {grade.letter}
          </span>
        </div>
      </div>
    </div>
  );
}
