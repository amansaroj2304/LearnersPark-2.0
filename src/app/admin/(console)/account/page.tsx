import { PageHeader } from "@/components/admin/ui";
import { ChangePasswordForm } from "@/app/admin/(console)/account/change-password-form";
import { getAdminState, roleLabel } from "@/lib/admin/auth";

export const instant = false;

export default async function AccountPage() {
  const state = await getAdminState();
  const email = state.status === "ok" ? state.email : "";
  const role = state.status === "ok" ? roleLabel[state.role] : "";

  return (
    <>
      <PageHeader title="Account" description="Your administrator account and password." />
      <div className="grid gap-6 px-5 py-6 sm:px-8 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <section className="h-fit rounded-2xl border border-ink/10 bg-white p-6">
          <h2 className="text-sm font-bold tracking-[0.12em] text-ink/45 uppercase">Signed in as</h2>
          <p className="mt-3 truncate text-sm font-semibold text-ink">{email}</p>
          <p className="text-xs text-ink/50">{role}</p>
          <p className="mt-4 text-xs leading-relaxed text-ink/50">
            Access is granted by the administrator list in the database, not by this password. A new
            password changes how you sign in; it does not change what you can see.
          </p>
        </section>

        <section className="rounded-2xl border border-ink/10 bg-white p-6">
          <h2 className="text-lg font-bold text-ink">Change password</h2>
          <p className="mt-1 mb-5 text-sm text-ink/60">
            No email is sent. The change takes effect immediately for future sign-ins.
          </p>
          <ChangePasswordForm email={email} />
        </section>
      </div>
    </>
  );
}
