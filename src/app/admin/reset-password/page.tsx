import type { Metadata } from "next";
import { Logo } from "@/components/layout/logo";
import { ResetPasswordForm } from "@/app/admin/reset-password/reset-form";

export const instant = false;

export const metadata: Metadata = {
  title: "Set a new password | Learners Park",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-light px-5 py-16">
      <div className="w-full max-w-[440px] rounded-2xl border border-ink/10 bg-white p-8 shadow-[0_30px_80px_-40px_rgba(6,21,13,0.45)]">
        <Logo className="h-9 w-auto" />
        <h1 className="mt-6 text-2xl font-extrabold tracking-[-0.02em] text-ink">
          Set a new password
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          Choose a password for your admin account. The reset link works once and expires after one
          hour.
        </p>
        <ResetPasswordForm />
      </div>
    </main>
  );
}
