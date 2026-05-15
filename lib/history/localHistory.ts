import type { Mode, RouteContextResponse } from "../types";

const HISTORY_KEY = "context-router:runs:v1";
const MAX_RUNS = 20;

export type HistoryEntry = {
  runId: string;
  createdAt: string;
  inputSummary: string;
  mode: Mode;
  response: RouteContextResponse;
};

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadHistory(): HistoryEntry[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const raw = localStorage.getItem(HISTORY_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      localStorage.removeItem(HISTORY_KEY);
      return [];
    }

    return parsed.slice(0, MAX_RUNS);
  } catch {
    localStorage.removeItem(HISTORY_KEY);
    return [];
  }
}

export function saveRun(response: RouteContextResponse): HistoryEntry[] {
  if (!isBrowser()) {
    return [];
  }

  const entry: HistoryEntry = {
    runId: response.run.runId,
    createdAt: response.run.createdAt,
    inputSummary: response.run.inputSummary,
    mode: response.run.mode,
    response,
  };

  const next = [
    entry,
    ...loadHistory().filter((item) => item.runId !== entry.runId),
  ].slice(0, MAX_RUNS);

  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  return next;
}

export function mergeHistoryEntries(entries: HistoryEntry[]): HistoryEntry[] {
  const deduped = new Map<string, HistoryEntry>();

  for (const entry of [...entries, ...loadHistory()]) {
    deduped.set(entry.runId, entry);
  }

  const next = [...deduped.values()]
    .sort(
      (left, right) =>
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    )
    .slice(0, MAX_RUNS);

  if (isBrowser()) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  }

  return next;
}
