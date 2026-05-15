import { CheckCircle2, CircleDashed } from "lucide-react";

export const PIPELINE_STEPS = [
  "Extracting context atoms...",
  "Checking for private details...",
  "Scoring signal...",
  "Routing to output buckets...",
  "Drafting usable outputs...",
  "Running anti-slop check...",
];

const FINAL_STEP = "Still routing. Waiting for the model response...";

type LoadingPipelineProps = {
  activeStep: number;
};

export function LoadingPipeline({ activeStep }: LoadingPipelineProps) {
  const isFinalStep = activeStep >= PIPELINE_STEPS.length;

  return (
    <div className="rounded-md border border-border-subtle bg-bg-surface p-3">
      <div className="mb-2 text-xs font-semibold uppercase tracking-normal text-text-muted">
        Routing pipeline
      </div>
      <ol className="space-y-2">
        {PIPELINE_STEPS.map((step, index) => {
          const isActive = index === activeStep;
          const isDone = index < activeStep;

          return (
            <li
              key={step}
              className="flex items-center gap-2 text-sm text-text-muted"
            >
              {isDone ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
              ) : (
                <CircleDashed
                  className={
                    "h-4 w-4 shrink-0 " +
                    (isActive ? "animate-spin text-text-primary" : "text-border-strong")
                  }
                />
              )}
              <span className={isActive ? "font-medium text-text-primary" : ""}>
                {step}
              </span>
            </li>
          );
        })}
        {isFinalStep ? (
          <li className="flex items-center gap-2 text-sm text-text-muted">
            <CircleDashed className="h-4 w-4 shrink-0 animate-spin text-text-primary" />
            <span className="font-medium text-text-primary">{FINAL_STEP}</span>
          </li>
        ) : null}
      </ol>
    </div>
  );
}
