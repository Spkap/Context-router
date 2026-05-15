import { MODE_OPTIONS } from "@/lib/bucket-config";
import type { Mode } from "@/lib/types";

type ModeSelectorProps = {
  value: Mode;
  onChange: (value: Mode) => void;
};

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  return (
    <div>
      <div className="mb-2 text-sm font-semibold text-zinc-950">Mode</div>
      <div className="grid grid-cols-2 gap-2">
        {MODE_OPTIONS.map((mode) => (
          <button
            key={mode.value}
            type="button"
            onClick={() => onChange(mode.value)}
            className={
              "h-9 rounded-md border px-2 text-sm font-medium transition " +
              (value === mode.value
                ? "border-zinc-950 bg-zinc-950 text-white"
                : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50")
            }
          >
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
}
