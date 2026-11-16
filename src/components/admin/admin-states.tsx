import Link from "next/link";
import { Database, ShieldAlert } from "lucide-react";

export function AdminSetupNotice() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-light px-5 py-16">
      <div className="w-full max-w-[620px] rounded-2xl border border-ink/10 bg-white p-8 sm:p-10">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold">
          <Database className="h-6 w-6" strokeWidth={2} />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold tracking-[-0.02em] text-ink">
          The database is not set up yet
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink/65">
          The admin tables (<code className="rounded bg-ink/6 px-1.5 py-0.5">students</code>,{" "}
          <code className="rounded bg-ink/6 px-1.5 py-0.5">admin_users</code>,{" "}
          <code className="rounded bg-ink/6 px-1.5 py-0.5">tests</code>) do not exist in this
          Supabase project. Run{" "}
          <code className="rounded bg-ink/6 px-1.5 py-0.5">supabase/APPLY_IN_SUPABASE_EDITOR.sql</code>{" "}
          in the Supabase SQL Editor, then reload this page.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink/65">
          Nothing is broken: the console simply has no schema to read from yet. Once the SQL has
          run, this screen is replaced by the dashboard.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-10 items-center rounded-lg border border-ink/15 px-5 text-sm font-semibold text-ink transition-colors hover:bg-ink/5"
        >
          Back to the site
        </Link>
      </div>
    </main>
  );
}

export function AdminNoAccess({ email }: { email: string | null }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-light px-5 py-16">
      <div className="w-full max-w-[560px] rounded-2xl border border-ink/10 bg-white p-8 sm:p-10">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-crimson/10 text-crimson">
          <ShieldAlert className="h-6 w-6" strokeWidth={2} />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold tracking-[-0.02em] text-ink">
          This account has no admin access
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink/65">
          {email ? (
            <>
              You are signed in as <span className="font-semibold text-ink">{email}</span>, but this
              account is not listed as an administrator.
            </>
          ) : (
            "This account is not listed as an administrator."
          )}{" "}
          Ask a super admin to grant access, or sign in with an admin account.
        </p>
        <Link
          href="/admin/login"
          className="mt-6 inline-flex h-10 items-center rounded-lg bg-crimson px-5 text-sm font-semibold text-white transition-colors hover:bg-crimson-shape"
        >
          Sign in with another account
        </Link>
      </div>
    </main>
  );
}
