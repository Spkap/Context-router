type DailyDumpTextareaProps = {
  value: string;
  onChange: (value: string) => void;
};

export function DailyDumpTextarea({ value, onChange }: DailyDumpTextareaProps) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-zinc-950">Daily Dump</span>
        <span className="text-xs text-zinc-500">{value.length}/5000</span>
      </div>
      <textarea
        value={value}
        maxLength={5000}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Paste anything from your day: meetings, notes, product updates, bugs fixed, user feedback, thoughts, wins, reminders, follow-ups, private details, random ideas..."
        className="min-h-[260px] w-full resize-y rounded-md border border-zinc-200 bg-white px-3 py-3 text-sm leading-6 text-zinc-950 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
      />
    </label>
  );
}
