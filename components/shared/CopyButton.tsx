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
      className={
        "inline-flex items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white text-sm font-medium text-zinc-800 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 " +
        (compact ? "h-8 px-2" : "h-9 px-3")
      }
    >
      {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
      <span>{copied ? "Copied" : label}</span>
    </button>
  );
}
