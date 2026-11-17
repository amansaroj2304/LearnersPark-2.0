"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BookOpenCheck,
  LayoutDashboard,
  LogIn,
  KeyRound,
  BrainCircuit,
  ShieldCheck,
  LogOut,
  ScrollText,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/tests", label: "Tests", icon: BookOpenCheck },
  { href: "/admin/opam", label: "OPAM", icon: BrainCircuit },
  { href: "/admin/ssb", label: "SSB tests", icon: ShieldCheck },
  { href: "/admin/logins", label: "Login activity", icon: LogIn },
  { href: "/admin/audit", label: "Audit log", icon: ScrollText },
  { href: "/admin/account", label: "Account", icon: KeyRound },
];

export function AdminNav({
  email,
  roleLabel: role,
}: {
  email: string;
  roleLabel: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-white/10 bg-ink text-white md:min-h-screen md:w-[248px] md:border-b-0">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-crimson text-sm font-extrabold">
          LP
        </span>
        <div className="leading-tight">
          <p className="text-sm font-bold">Admin console</p>
          <p className="text-[11px] text-white/50">Learners Park</p>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible">
        {items.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-white/12 text-white"
                  : "text-white/65 hover:bg-white/8 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={2.1} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden border-t border-white/10 px-5 py-4 md:block">
        <p className="truncate text-xs font-semibold text-white/80">{email}</p>
        <p className="mt-0.5 text-[11px] text-white/45">{role}</p>
        <button
          type="button"
          onClick={signOut}
          disabled={signingOut}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-white/15 px-3 py-2 text-xs font-semibold text-white/80 transition-colors hover:bg-white/10 disabled:opacity-60"
        >
          <LogOut className="h-3.5 w-3.5" strokeWidth={2.2} />
          {signingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </aside>
  );
}
