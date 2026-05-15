type DailyDumpTextareaProps = {
  value: string;
  onChange: (value: string) => void;
};

export function DailyDumpTextarea({ value, onChange }: DailyDumpTextareaProps) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">Daily Dump</span>
        <span className="text-[11px] tabular-nums text-text-muted">{value.length}/5000</span>
      </div>
      <textarea
        value={value}
        maxLength={5000}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Meetings, notes, wins, ideas, follow-ups, anything..."
        className="min-h-[160px] w-full resize-y rounded border border-border-subtle bg-bg-canvas px-3 py-2.5 font-mono text-xs leading-[1.7] text-text-primary outline-none transition placeholder:text-text-muted/40 focus:border-border-strong focus:ring-1 focus:ring-border-strong"
      />
    </label>
  );
}
