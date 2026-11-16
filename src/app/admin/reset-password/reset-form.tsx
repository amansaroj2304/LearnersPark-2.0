"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type State = "checking" | "ready" | "expired" | "done";

export function ResetPasswordForm() {
  const router = useRouter();
  const [state, setState] = useState<State>("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function establishSession() {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      if (code) {
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);
        // The code is single-use; keep it out of the address bar and history.
        url.searchParams.delete("code");
        window.history.replaceState({}, "", url.toString());
        if (exchangeError && !cancelled) {
          setState("expired");
          return;
        }
      }

      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      setState(data.session ? "ready" : "expired");
    }

    void establishSession();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("The two passwords do not match.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) {
      setError(
        updateError.message.toLowerCase().includes("session")
          ? "This reset link has expired. Request a new one from the sign-in page."
          : updateError.message,
      );
      return;
    }
    setState("done");
  }

  if (state === "checking") {
    return (
      <p className="mt-6 text-sm text-ink/60" role="status">
        Checking your reset link…
      </p>
    );
  }

  if (state === "expired") {
    return (
      <div className="mt-6 flex flex-col gap-4">
        <p className="rounded-lg bg-crimson/8 px-3 py-2 text-sm text-crimson" role="alert">
          This reset link is invalid or has expired. Links work once and last one hour.
        </p>
        <Link
          href="/admin/login"
          className="flex h-11 items-center justify-center rounded-lg bg-crimson text-sm font-semibold text-white transition-colors hover:bg-crimson-shape"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  if (state === "done") {
    return (
      <div className="mt-6 flex flex-col gap-4">
        <p className="rounded-lg bg-[#2f9e5b]/10 px-3 py-2 text-sm text-[#256e42]" role="status">
          Your password has been updated. You can now sign in with it.
        </p>
        <button
          type="button"
          onClick={() => {
            router.push("/admin");
            router.refresh();
          }}
          className="h-11 rounded-lg bg-crimson text-sm font-semibold text-white transition-colors hover:bg-crimson-shape"
        >
          Continue to the console
        </button>
        <Link
          href="/admin/login"
          className="text-center text-sm font-semibold text-ink/60 transition-colors hover:text-ink"
        >
          Go to sign in instead
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
        New password
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-11 rounded-lg border border-ink/15 bg-white px-3 text-sm font-normal text-ink focus:border-ink/40 focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
        Confirm password
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          className="h-11 rounded-lg border border-ink/15 bg-white px-3 text-sm font-normal text-ink focus:border-ink/40 focus:outline-none"
        />
      </label>
      {error && (
        <p role="alert" className="rounded-lg bg-crimson/8 px-3 py-2 text-sm text-crimson">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="h-11 rounded-lg bg-crimson text-sm font-semibold text-white transition-colors hover:bg-crimson-shape disabled:opacity-60"
      >
        {loading ? "Saving…" : "Save new password"}
      </button>
    </form>
  );
}
