import { CheckCircle2, CircleDashed } from "lucide-react";

export const PIPELINE_STEPS = [
  "Extracting context atoms...",
  "Checking for private details...",
  "Scoring signal...",
  "Routing to output buckets...",
  "Drafting usable outputs...",
  "Running anti-slop check...",
];

type LoadingPipelineProps = {
  activeStep: number;
};

export function LoadingPipeline({ activeStep }: LoadingPipelineProps) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white p-3 shadow-sm">
      <div className="mb-2 text-xs font-semibold uppercase tracking-normal text-zinc-500">
        Routing pipeline
      </div>
      <ol className="space-y-2">
        {PIPELINE_STEPS.map((step, index) => {
          const isActive = index === activeStep;
          const isDone = index < activeStep;

          return (
            <li
              key={step}
              className="flex items-center gap-2 text-sm text-zinc-700"
            >
              {isDone ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              ) : (
                <CircleDashed
                  className={
                    "h-4 w-4 " +
                    (isActive ? "animate-spin text-zinc-900" : "text-zinc-300")
                  }
                />
              )}
              <span className={isActive ? "font-medium text-zinc-950" : ""}>
                {step}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
