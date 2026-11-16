"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

export function ShareButton({
  title,
  path,
}: {
  title: string;
  path: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = `${window.location.origin}${path}`;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // user cancelled or share failed — fall back to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link", url);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex items-center gap-2 transition-colors hover:text-ink"
    >
      {copied ? (
        <Check className="h-4.5 w-4.5 text-olive-deep" strokeWidth={1.9} aria-hidden="true" />
      ) : (
        <Share2 className="h-4.5 w-4.5" strokeWidth={1.9} aria-hidden="true" />
      )}
      <span aria-live="polite">{copied ? "Link copied" : "Share"}</span>
    </button>
  );
}
