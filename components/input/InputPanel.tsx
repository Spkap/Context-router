import type { HistoryEntry } from "@/lib/history/localHistory";
import type { Mode } from "@/lib/types";
import { DailyDumpTextarea } from "./DailyDumpTextarea";
import { ModeSelector } from "./ModeSelector";
import { RouteContextButton } from "./RouteContextButton";
import { SampleDataButton } from "./SampleDataButton";
import { VoiceSamplesTextarea } from "./VoiceSamplesTextarea";

type InputPanelProps = {
  dailyDump: string;
  voiceSamples: string;
  mode: Mode;
  isRouting: boolean;
  history: HistoryEntry[];
  onDailyDumpChange: (value: string) => void;
  onVoiceSamplesChange: (value: string) => void;
  onModeChange: (value: Mode) => void;
  onUseSample: () => void;
  onRoute: () => void;
  onLoadHistory: (entry: HistoryEntry) => void;
};

export function InputPanel({
  dailyDump,
  voiceSamples,
  mode,
  isRouting,
  history,
  onDailyDumpChange,
  onVoiceSamplesChange,
  onModeChange,
  onUseSample,
  onRoute,
  onLoadHistory,
}: InputPanelProps) {
  const isDisabled = dailyDump.trim().length < 10 || dailyDump.length > 5000;

  return (
    <aside className="flex flex-col gap-4 p-4">
      {/* Utility row — compact secondary actions */}
      <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
        <SampleDataButton onUseSample={onUseSample} />
        {history.length > 0 ? (
          <select
            aria-label="Recent runs"
            defaultValue=""
            onChange={(event) => {
              const entry = history.find(
                (item) => item.runId === event.target.value,
              );
              if (entry) {
                onLoadHistory(entry);
                event.target.value = "";
              }
            }}
            className="h-7 min-w-0 flex-1 rounded border border-border-subtle bg-bg-surface px-2 text-[11px] text-text-muted outline-none focus:border-border-strong"
          >
            <option value="">Recent runs</option>
            {history.map((entry) => (
              <option key={entry.runId} value={entry.runId}>
                {new Date(entry.createdAt).toLocaleString()} — {entry.mode}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      {/* Daily Dump */}
      <DailyDumpTextarea value={dailyDump} onChange={onDailyDumpChange} />

      {/* Writing Samples */}
      <VoiceSamplesTextarea value={voiceSamples} onChange={onVoiceSamplesChange} />

      {/* Mode + Route */}
      <ModeSelector value={mode} onChange={onModeChange} />
      <RouteContextButton
        disabled={isDisabled}
        isRouting={isRouting}
        onClick={onRoute}
      />
    </aside>
  );
}
