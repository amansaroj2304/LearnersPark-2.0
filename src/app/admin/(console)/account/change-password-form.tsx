"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function ChangePasswordForm({ email }: { email: string }) {
  const router = useRouter();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setDone(false);

    if (next.length < 8) {
      setError("The new password needs at least 8 characters.");
      return;
    }
    if (next !== confirm) {
      setError("The new passwords do not match.");
      return;
    }
    if (next === current) {
      setError("Choose a password different from the current one.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    // Prove the current password before changing anything. This also refreshes
    // the session, so an idle tab cannot be hijacked to change the password.
    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email,
      password: current,
    });
    if (reauthError) {
      setError(
        reauthError.message === "Invalid login credentials"
          ? "The current password is incorrect. If this account signs in with Google and has no password yet, use “Forgot password?” on the sign-in page to set one."
          : reauthError.message,
      );
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: next });
    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }

    setCurrent("");
    setNext("");
    setConfirm("");
    setDone(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-[460px] flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
        Current password
        <input
          type="password"
          required
          autoComplete="current-password"
          value={current}
          onChange={(event) => setCurrent(event.target.value)}
          className="h-11 rounded-lg border border-ink/15 bg-white px-3 text-sm font-normal text-ink focus:border-ink/40 focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
        New password
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={next}
          onChange={(event) => setNext(event.target.value)}
          className="h-11 rounded-lg border border-ink/15 bg-white px-3 text-sm font-normal text-ink focus:border-ink/40 focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
        Confirm new password
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
      {done && (
        <p role="status" className="rounded-lg bg-[#2f9e5b]/10 px-3 py-2 text-sm text-[#256e42]">
          Password updated. Use it the next time you sign in.
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="h-11 rounded-lg bg-crimson text-sm font-semibold text-white transition-colors hover:bg-crimson-shape disabled:opacity-60"
      >
        {loading ? "Updating…" : "Update password"}
      </button>
      <p className="text-xs text-ink/50">
        At least 8 characters. The current password is required so an unattended browser cannot
        change it.
      </p>
    </form>
  );
}
