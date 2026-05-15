import { FileText } from "lucide-react";

type SampleDataButtonProps = {
  onUseSample: () => void;
};

export function SampleDataButton({ onUseSample }: SampleDataButtonProps) {
  return (
    <button
      type="button"
      onClick={onUseSample}
      className="inline-flex h-7 items-center gap-1.5 rounded border border-border-subtle bg-bg-surface px-2.5 text-[11px] font-medium text-text-muted transition hover:border-border-strong hover:text-text-primary"
    >
      <FileText className="h-3 w-3" />
      Sample data
    </button>
  );
}
