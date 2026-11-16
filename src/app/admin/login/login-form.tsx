"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (signInError) {
      setError(
        signInError.message === "Invalid login credentials"
          ? "Email or password is incorrect."
          : signInError.message,
      );
      setLoading(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
        Email
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-11 rounded-lg border border-ink/15 bg-white px-3 text-sm font-normal text-ink focus:border-ink/40 focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
        Password
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
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
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
