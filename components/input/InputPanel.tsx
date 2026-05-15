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
    <aside className="space-y-4 border-b border-zinc-200 bg-zinc-50 p-4 lg:border-b-0 lg:border-r">
      <div className="flex flex-wrap items-center justify-between gap-2">
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
            className="h-9 max-w-full rounded-md border border-zinc-200 bg-white px-2 text-sm text-zinc-700 shadow-sm outline-none focus:border-zinc-400"
          >
            <option value="">Recent runs</option>
            {history.map((entry) => (
              <option key={entry.runId} value={entry.runId}>
                {new Date(entry.createdAt).toLocaleString()} - {entry.mode}
              </option>
            ))}
          </select>
        ) : null}
      </div>
      <DailyDumpTextarea value={dailyDump} onChange={onDailyDumpChange} />
      <VoiceSamplesTextarea value={voiceSamples} onChange={onVoiceSamplesChange} />
      <ModeSelector value={mode} onChange={onModeChange} />
      <RouteContextButton
        disabled={isDisabled}
        isRouting={isRouting}
        onClick={onRoute}
      />
    </aside>
  );
}
