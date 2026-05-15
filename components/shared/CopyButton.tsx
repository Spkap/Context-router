"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

type CopyButtonProps = {
  text: string;
  label?: string;
  compact?: boolean;
};

export function CopyButton({ text, label = "Copy", compact }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  function fallbackCopy() {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();

    try {
      return document.execCommand("copy");
    } finally {
      document.body.removeChild(textarea);
    }
  }

  async function handleCopy() {
    let didCopy = false;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        didCopy = true;
      }
    } catch {
      didCopy = false;
    }

    if (!didCopy) {
      didCopy = fallbackCopy();
    }

    if (didCopy) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={label}
      aria-label={label}
      className={
        "inline-flex shrink-0 items-center justify-center rounded border border-border-subtle bg-bg-surface text-text-muted transition hover:border-border-strong hover:bg-bg-surface-hover hover:text-text-primary " +
        (compact ? "h-6 w-6" : "h-8 w-8")
      }
    >
      {copied ? (
        <Check className={compact ? "h-3 w-3 text-emerald-500" : "h-4 w-4 text-emerald-500"} />
      ) : (
        <Copy className={compact ? "h-3 w-3" : "h-4 w-4"} />
      )}
    </button>
  );
}
