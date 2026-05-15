import { MODE_OPTIONS } from "@/lib/bucket-config";
import type { Mode } from "@/lib/types";

type ModeSelectorProps = {
  value: Mode;
  onChange: (value: Mode) => void;
};

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-text-muted">Mode</div>
      <div className="grid grid-cols-2 gap-2">
        {MODE_OPTIONS.map((mode) => (
          <button
            key={mode.value}
            type="button"
            onClick={() => onChange(mode.value)}
            className={
              "h-8 rounded border px-2 text-xs font-medium transition " +
              (value === mode.value
                ? "border-text-primary bg-text-primary text-bg-surface"
                : "border-border-subtle bg-bg-surface text-text-muted hover:border-border-strong hover:bg-bg-surface-hover")
            }
          >
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
}
