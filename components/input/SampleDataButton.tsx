import { FileText } from "lucide-react";
import type { SampleContext } from "@/lib/sample-data";

type SampleDataButtonProps = {
  samples: SampleContext[];
  onUseSample: (sampleId: string) => void;
};

export function SampleDataButton({
  samples,
  onUseSample,
}: SampleDataButtonProps) {
  return (
    <div className="relative shrink-0">
      <FileText className="pointer-events-none absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-text-muted" />
      <select
        aria-label="Sample data"
        defaultValue=""
        onChange={(event) => {
          if (event.target.value) {
            onUseSample(event.target.value);
            event.target.value = "";
          }
        }}
        className="h-7 max-w-[148px] rounded border border-border-subtle bg-bg-surface pl-6 pr-2 text-[11px] font-medium text-text-muted outline-none transition hover:border-border-strong hover:text-text-primary focus:border-border-strong"
      >
        <option value="">Sample data</option>
        {samples.map((sample) => (
          <option key={sample.id} value={sample.id}>
            {sample.label}
          </option>
        ))}
      </select>
    </div>
  );
}
