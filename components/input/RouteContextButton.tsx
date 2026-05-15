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
      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
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
