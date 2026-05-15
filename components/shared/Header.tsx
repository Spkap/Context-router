import { Route } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-[1800px] flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-zinc-950 text-white">
            <Route className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-normal text-zinc-950">
              ContextRouter
            </h1>
            <p className="text-sm text-zinc-600">
              Turn messy daily notes into posts, follow-ups, tasks, updates, and warnings.
            </p>
          </div>
        </div>
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">
          Do not paste highly sensitive information. This MVP sends your text to an AI model provider for processing.
        </div>
      </div>
    </header>
  );
}
