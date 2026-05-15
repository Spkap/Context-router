import { AlertCircle, CheckCircle2, Info } from "lucide-react";

type StatusMessageProps = {
  tone: "error" | "info" | "success";
  message: string;
};

const toneClasses = {
  error: "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300",
  info: "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
};

const icons = {
  error: AlertCircle,
  info: Info,
  success: CheckCircle2,
};

export function StatusMessage({ tone, message }: StatusMessageProps) {
  const Icon = icons[tone];

  return (
    <div
      className={
        "flex gap-2 rounded-md border px-3 py-2 text-sm leading-5 " +
        toneClasses[tone]
      }
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
