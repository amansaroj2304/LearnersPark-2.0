import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { AdminNoAccess, AdminSetupNotice } from "@/components/admin/admin-states";
import { getAdminState, roleLabel } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: "Admin | Learners Park",
  robots: { index: false, follow: false },
};

export default async function AdminConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const state = await getAdminState();

  if (state.status === "unauthenticated") {
    redirect("/admin/login");
  }
  if (state.status === "unavailable") {
    return <AdminSetupNotice />;
  }
  if (state.status === "forbidden") {
    return <AdminNoAccess email={state.email} />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg-light md:flex-row">
      <AdminNav email={state.email} roleLabel={roleLabel[state.role]} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
