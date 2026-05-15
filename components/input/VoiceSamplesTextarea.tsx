type VoiceSamplesTextareaProps = {
  value: string;
  onChange: (value: string) => void;
};

export function VoiceSamplesTextarea({ value, onChange }: VoiceSamplesTextareaProps) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-zinc-950">
          Writing Samples
        </span>
        <span className="text-xs text-zinc-500">{value.length}/3000</span>
      </div>
      <textarea
        value={value}
        maxLength={3000}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Paste 3-5 tweets, LinkedIn posts, or notes written in your own voice. ContextRouter will use these to avoid generic AI tone."
        className="min-h-[130px] w-full resize-y rounded-md border border-zinc-200 bg-white px-3 py-3 text-sm leading-6 text-zinc-950 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
      />
      <p className="mt-2 text-xs text-zinc-500">
        No fine-tuning. Just voice matching from examples.
      </p>
    </label>
  );
}
