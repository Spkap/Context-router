type VoiceSamplesTextareaProps = {
  value: string;
  onChange: (value: string) => void;
};

export function VoiceSamplesTextarea({ value, onChange }: VoiceSamplesTextareaProps) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
          Writing Samples
        </span>
        <span className="text-[11px] tabular-nums text-text-muted">{value.length}/3000</span>
      </div>
      <textarea
        value={value}
        maxLength={3000}
        onChange={(event) => onChange(event.target.value)}
        placeholder="3–5 posts in your own voice (tweets, LinkedIn, notes)..."
        className="min-h-[90px] w-full resize-y rounded border border-border-subtle bg-bg-canvas px-3 py-2.5 font-mono text-xs leading-[1.7] text-text-primary outline-none transition placeholder:text-text-muted/40 focus:border-border-strong focus:ring-1 focus:ring-border-strong"
      />
      <p className="mt-1.5 text-[11px] text-text-muted/70">
        No fine-tuning. Voice matching from examples.
      </p>
    </label>
  );
}
