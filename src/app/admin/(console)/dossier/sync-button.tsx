"use client";

import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { triggerDriveSync } from "./actions";

export function SyncNowButton() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  function run() {
    setResult(null);
    startTransition(async () => {
      setResult(await triggerDriveSync());
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={run}
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-full bg-crimson px-4 py-2 text-sm font-bold text-white transition hover:bg-crimson/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RefreshCw className={pending ? "h-4 w-4 animate-spin" : "h-4 w-4"} aria-hidden />
        {pending ? "Starting sync…" : "Sync now"}
      </button>
      {result ? (
        <span
          className={
            result.ok
              ? "text-sm font-medium text-emerald-700"
              : "text-sm font-medium text-crimson"
          }
          role="status"
        >
          {result.message}
        </span>
      ) : null}
    </div>
  );
}
