"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type MobileNavLink = {
  label: string;
  href?: string;
  soon?: boolean;
};

export function MobileNav({ links }: { links: MobileNavLink[] }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = panelRef.current?.querySelector<HTMLElement>(
      "a, button:not([disabled])",
    );
    first?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const firstEl = focusable[0];
      const lastEl = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === firstEl) {
        event.preventDefault();
        lastEl.focus();
      } else if (!event.shiftKey && document.activeElement === lastEl) {
        event.preventDefault();
        firstEl.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="-ml-1 flex h-10 w-10 items-center justify-center rounded-lg text-ink hover:bg-ink/5 lg:hidden"
      >
        <Menu className="h-6 w-6" strokeWidth={2.3} aria-hidden="true" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/45 backdrop-blur-sm"
          />
          <div
            ref={panelRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="relative flex h-full w-[82%] max-w-[320px] flex-col bg-white shadow-[0_30px_80px_-30px_rgba(6,21,13,0.6)]"
          >
            <div className="flex h-[68px] items-center justify-between border-b border-ink/10 px-5">
              <span className="text-xs font-bold tracking-[0.18em] text-ink/60 uppercase">
                Menu
              </span>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-ink/70 hover:bg-ink/5 hover:text-ink"
              >
                <X className="h-5 w-5" strokeWidth={2.3} aria-hidden="true" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
              {links.map((link) =>
                link.href && !link.soon ? (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-3 text-lg font-semibold text-ink hover:bg-ink/5"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <span
                    key={link.label}
                    aria-disabled="true"
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-3 text-lg font-semibold text-ink/60",
                    )}
                  >
                    {link.label}
                    <span className="rounded-md bg-sage/40 px-2 py-0.5 text-[0.65rem] font-bold tracking-[0.12em] text-olive-deep uppercase">
                      Soon
                    </span>
                  </span>
                ),
              )}
            </nav>
            <div className="border-t border-ink/10 px-5 py-5 text-sm text-ink/60">
              <Link
                href="/privacy"
                onClick={() => setOpen(false)}
                className="hover:text-crimson"
              >
                Privacy
              </Link>
              <span aria-hidden className="mx-2">
                ·
              </span>
              <Link
                href="/terms"
                onClick={() => setOpen(false)}
                className="hover:text-crimson"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
