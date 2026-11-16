import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/layout/logo";
import { AdminLoginForm } from "@/app/admin/login/login-form";
import { getAdminState } from "@/lib/admin/auth";

export const instant = false;

export const metadata: Metadata = {
  title: "Admin sign in | Learners Park",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const state = await getAdminState();
  if (state.status === "ok") {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-light px-5 py-16">
      <div className="w-full max-w-[420px] rounded-2xl border border-ink/10 bg-white p-8 shadow-[0_30px_80px_-40px_rgba(6,21,13,0.45)]">
        <Logo className="h-9 w-auto" />
        <h1 className="mt-6 text-2xl font-extrabold tracking-[-0.02em] text-ink">
          Admin sign in
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          Restricted to Learners Park staff. Students should sign in on the main site.
        </p>
        <AdminLoginForm />
        <p className="mt-5 text-center text-xs text-ink/45">
          Access is checked against the administrator list on every request.
        </p>
      </div>
    </main>
  );
}
