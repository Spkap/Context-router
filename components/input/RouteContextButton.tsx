import { Loader2, Route } from "lucide-react";

type RouteContextButtonProps = {
  disabled: boolean;
  isRouting: boolean;
  onClick: () => void;
};

export function RouteContextButton({
  disabled,
  isRouting,
  onClick,
}: RouteContextButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || isRouting}
      onClick={onClick}
      className="inline-flex h-9 w-full items-center justify-center gap-2 rounded bg-text-primary px-4 text-sm font-medium text-bg-surface transition hover:bg-text-primary/90 disabled:cursor-not-allowed disabled:bg-border-subtle disabled:text-text-muted"
    >
      {isRouting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Route className="h-4 w-4" />
      )}
      {isRouting ? "Routing..." : "Route Context"}
    </button>
  );
}
