"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function StartButton({ setId, label }: { setId: number; label: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/opam/start", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ setId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Could not start the test.");
      router.push(`/opam/${setId}/test?attempt=${data.attemptId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start the test.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={start}
        disabled={loading}
        className="inline-flex h-12 items-center justify-center rounded-lg bg-crimson px-7 text-sm font-bold text-white transition-colors hover:bg-crimson-shape disabled:opacity-60"
      >
        {loading ? "Preparing your paper…" : label}
      </button>
      {error && (
        <p role="alert" className="text-sm text-crimson">
          {error}
        </p>
      )}
    </div>
  );
}
