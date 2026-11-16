"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "forgot";

export function AdminLoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignIn(event: React.FormEvent) {
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
          ? "Email or password is incorrect. If you have never set a password, use “Forgot password?”."
          : signInError.message,
      );
      setLoading(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  async function handleForgot(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo: `${window.location.origin}/admin/reset-password` },
    );
    setLoading(false);
    if (resetError) {
      setError(
        resetError.message.toLowerCase().includes("rate")
          ? "Too many reset emails requested. Please wait a few minutes and try again."
          : resetError.message,
      );
      return;
    }
    setNotice(
      "If an account exists for that email, a reset link is on its way. Check the spam folder too; the link expires after one hour.",
    );
  }

  if (mode === "forgot") {
    return (
      <form onSubmit={handleForgot} className="mt-6 flex flex-col gap-4">
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
        {error && (
          <p role="alert" className="rounded-lg bg-crimson/8 px-3 py-2 text-sm text-crimson">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="rounded-lg bg-[#2f9e5b]/10 px-3 py-2 text-sm text-[#256e42]">
            {notice}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="h-11 rounded-lg bg-crimson text-sm font-semibold text-white transition-colors hover:bg-crimson-shape disabled:opacity-60"
        >
          {loading ? "Sending…" : "Send reset link"}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signin");
            setError(null);
            setNotice(null);
          }}
          className="text-sm font-semibold text-ink/60 transition-colors hover:text-ink"
        >
          Back to sign in
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSignIn} className="mt-6 flex flex-col gap-4">
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
      <div className="-mt-1 text-right">
        <button
          type="button"
          onClick={() => {
            setMode("forgot");
            setError(null);
            setNotice(null);
          }}
          className="text-sm font-semibold text-crimson hover:underline"
        >
          Forgot password?
        </button>
      </div>
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
      <p className="text-center text-xs text-ink/45">
        No password yet?{" "}
        <button
          type="button"
          onClick={() => {
            setMode("forgot");
            setError(null);
            setNotice(null);
          }}
          className="font-semibold text-crimson hover:underline"
        >
          Set one by email
        </button>
      </p>
      <p className="text-center text-xs text-ink/45">
        Students sign in on the <Link href="/login" className="font-semibold text-crimson hover:underline">main site</Link>.
      </p>
    </form>
  );
}
