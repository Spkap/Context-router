import { Sparkles } from "lucide-react";

type SampleDataButtonProps = {
  onUseSample: () => void;
};

export function SampleDataButton({ onUseSample }: SampleDataButtonProps) {
  return (
    <button
      type="button"
      onClick={onUseSample}
      className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-800 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50"
    >
      <Sparkles className="h-4 w-4" />
      Use sample founder day
    </button>
  );
}
