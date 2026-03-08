import type { AnalysisResult } from "./llm";
import type { PersonaId } from "./personas";

export interface HistoryEntry {
  id: string;
  timestamp: number;
  title: string;
  score: number;
  persona: PersonaId;
  provider: string;
  result: AnalysisResult;
  /** First 200 chars of the PRD text for preview */
  preview: string;
}

const STORAGE_KEY = "prdlinter-history";
const MAX_ENTRIES = 50;

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function extractTitle(text: string): string {
  // Try to find a title from the first non-empty line
  const firstLine = text
    .split("\n")
    .map((l) => l.replace(/^#+\s*/, "").trim())
    .find((l) => l.length > 0);
  if (firstLine && firstLine.length <= 80) return firstLine;
  if (firstLine) return firstLine.slice(0, 77) + "...";
  return "Untitled PRD";
}

export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function saveToHistory(
  prdText: string,
  result: AnalysisResult,
  persona: PersonaId,
  provider: string
): HistoryEntry {
  const entry: HistoryEntry = {
    id: generateId(),
    timestamp: Date.now(),
    title: extractTitle(prdText),
    score: result.overall_score,
    persona,
    provider,
    result,
    preview: prdText.slice(0, 200),
  };

  const history = getHistory();
  history.unshift(entry);

  // Keep only the most recent entries
  if (history.length > MAX_ENTRIES) {
    history.length = MAX_ENTRIES;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return entry;
}

export function deleteFromHistory(id: string): void {
  const history = getHistory().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
