"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { BarChart3, LogOut, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Profile = {
  name: string;
  email: string;
  avatar: string | null;
};

function profileFromUser(user: User): Profile {
  const metadata = user.user_metadata ?? {};
  const name =
    (metadata.full_name as string | undefined) ||
    (metadata.name as string | undefined) ||
    user.email?.split("@")[0] ||
    "Student";
  const avatar =
    (metadata.avatar_url as string | undefined) ||
    (metadata.picture as string | undefined) ||
    null;
  return { name, email: user.email ?? "", avatar };
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function AccountMenu() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getClaims().then(({ data }) => {
      const user = data?.claims;
      if (user?.email) {
        setProfile({
          name:
            (user.user_metadata?.full_name as string | undefined) ||
            (user.user_metadata?.name as string | undefined) ||
            user.email.split("@")[0],
          email: user.email,
          avatar:
            (user.user_metadata?.avatar_url as string | undefined) ||
            (user.user_metadata?.picture as string | undefined) ||
            null,
        });
      }
      setReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setProfile(session?.user ? profileFromUser(session.user) : null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!open) return;
    function handleClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  if (!ready) {
    return <span className="h-10 w-10 rounded-full bg-ink/10" aria-hidden="true" />;
  }

  if (!profile) {
    return (
      <Link href="/login" className={buttonClasses("primary", "md", "gap-2.5")}>
        Sign in
      </Link>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-ink/10 bg-white py-1 pr-2 pl-1 transition-colors hover:bg-ink/5"
      >
        {profile.avatar ? (
          <Image
            src={profile.avatar}
            alt={profile.name}
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">
            {initials(profile.name)}
          </span>
        )}
        <ChevronDown className="h-4 w-4 text-ink/50" strokeWidth={2.4} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border border-ink/10 bg-white shadow-[0_24px_60px_-30px_rgba(6,21,13,0.5)]"
        >
          <div className="border-b border-ink/10 px-4 py-3">
            <p className="truncate text-sm font-bold text-ink">{profile.name}</p>
            <p className="truncate text-xs text-ink/55">{profile.email}</p>
          </div>
          <Link
            href="/progress"
            role="menuitem"
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-sm font-semibold text-ink transition-colors hover:bg-ink/5",
            )}
          >
            <BarChart3 className="h-4 w-4" strokeWidth={2.3} />
            My Progress
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 border-t border-ink/10 px-4 py-3 text-left text-sm font-semibold text-crimson transition-colors hover:bg-crimson/5"
          >
            <LogOut className="h-4 w-4" strokeWidth={2.3} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
