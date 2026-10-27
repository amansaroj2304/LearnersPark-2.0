"use client";

import { useEffect, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { LoginButton } from "@/components/auth/login-button";

export function GetStartedDialog({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="get-started-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <button
            type="button"
            aria-label="Close sign up"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/45 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-[420px] rounded-2xl border border-ink/10 bg-white p-7 shadow-[0_30px_80px_-30px_rgba(6,21,13,0.6)] sm:p-8">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-lg text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink"
            >
              <X className="h-5 w-5" strokeWidth={2.2} />
            </button>

            <span className="rounded-md bg-ink px-3 py-1.5 text-xs font-bold tracking-[0.14em] text-white uppercase">
              CSSS
            </span>
            <h2
              id="get-started-title"
              className="mt-5 text-2xl font-extrabold tracking-[-0.02em] text-ink"
            >
              Sign up to get started
            </h2>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/60">
              Create your free account to attempt CSSS mock tests and track your
              progress over time.
            </p>

            <div className="mt-6">
              <LoginButton next="/csss" />
            </div>

            <p className="mt-5 text-center text-xs leading-relaxed text-ink/45">
              Free forever. No credit card required.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
