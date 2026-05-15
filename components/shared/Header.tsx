"use client";

import { Route, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <header className="border-b border-border-subtle bg-bg-surface">
      <div className="mx-auto flex max-w-[1800px] items-center gap-4 px-4 py-2.5 sm:px-5">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-text-primary text-bg-surface">
            <Route className="h-4 w-4" />
          </div>
          <div>
            <span className="text-sm font-semibold text-text-primary">ContextRouter</span>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Warning chip */}
        <p className="hidden text-[11px] text-text-muted sm:block">
          ⚠ Do not paste sensitive information — text is sent to an AI provider.
        </p>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex h-7 w-7 items-center justify-center rounded border border-border-subtle bg-bg-surface text-text-muted transition hover:bg-bg-surface-hover hover:text-text-primary"
          aria-label="Toggle dark mode"
        >
          {mounted ? (
            theme === "dark" ? (
              <Sun className="h-3.5 w-3.5" />
            ) : (
              <Moon className="h-3.5 w-3.5" />
            )
          ) : (
            <div className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </header>
  );
}
