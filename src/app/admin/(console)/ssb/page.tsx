import Link from "next/link";
import { PageHeader, Badge } from "@/components/admin/ui";
import { getAdminState, canWrite } from "@/lib/admin/auth";
import { DAYS, getSsbTests, STATUSES } from "@/lib/ssb/data";
import { isOpamConfigured } from "@/lib/supabase/service";
import { saveSsbTest } from "./actions";

export const instant = false;

export default async function AdminSsbPage() {
  const state = await getAdminState();
  const writable = state.status === "ok" && canWrite(state.role);
  const tests = isOpamConfigured() ? await getSsbTests().catch(() => []) : [];

  return (
    <>
      <PageHeader
        title="SSB tests"
        description="The 17 practice modules. A test stays Soon until its content exists; open it by setting Available."
        actions={
          <Link href="/ssb" className="h-10 rounded-lg border border-ink/15 px-4 text-sm font-semibold leading-[2.4rem] text-ink hover:bg-ink/5">
            View public page
          </Link>
        }
      />

      <div className="px-5 py-6 sm:px-8">
        {tests.length === 0 ? (
          <p className="rounded-xl border border-gold/40 bg-gold/10 p-4 text-sm text-[#6b520f]">
            The catalogue is not loaded. Run <code className="rounded bg-white/60 px-1">0004_ssb.sql</code> in the
            Supabase SQL Editor to create and seed the 17 tests.
          </p>
        ) : (
          DAYS.map((d) => {
            const dayTests = tests.filter((t) => t.day === d.day);
            if (!dayTests.length) return null;
            return (
              <section key={d.day} className="mb-10">
                <h2 className="text-sm font-bold tracking-[0.12em] text-ink/45 uppercase">{d.title}</h2>
                <div className="mt-3 flex flex-col gap-3">
                  {dayTests.map((test) => (
                    <form
                      key={test.id}
                      action={saveSsbTest}
                      className="grid gap-3 rounded-2xl border border-ink/10 bg-white p-4 lg:grid-cols-[220px_1fr_150px_150px_auto]"
                    >
                      <input type="hidden" name="id" value={test.id} />
                      <div>
                        <p className="text-sm font-bold text-ink">
                          {test.test_no}. {test.name}
                        </p>
                        <p className="text-xs text-ink/50">{test.full_form}</p>
                        <Badge tone={test.status === "SOON" ? "amber" : test.status === "AVAILABLE" || test.status === "LIVE" ? "green" : "grey"}>
                          {test.status}
                        </Badge>
                      </div>
                      <div className="flex flex-col gap-2">
                        <textarea
                          name="description"
                          defaultValue={test.description}
                          rows={2}
                          disabled={!writable}
                          className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink"
                          aria-label={`${test.name} description`}
                        />
                        <textarea
                          name="instructions"
                          defaultValue={test.instructions ?? ""}
                          rows={2}
                          disabled={!writable}
                          placeholder="Instructions shown before the test"
                          className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink"
                          aria-label={`${test.name} instructions`}
                        />
                      </div>
                      <select
                        name="status"
                        defaultValue={test.status}
                        disabled={!writable}
                        className="h-10 rounded-lg border border-ink/15 bg-white px-3 text-sm text-ink"
                        aria-label={`${test.name} status`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-semibold text-ink/50">
                          Opens
                          <input type="datetime-local" name="opensAt" disabled={!writable} defaultValue={test.opens_at ? test.opens_at.slice(0, 16) : ""} className="mt-0.5 h-9 w-full rounded-lg border border-ink/15 px-2 text-xs" />
                        </label>
                        <label className="text-[11px] font-semibold text-ink/50">
                          Closes
                          <input type="datetime-local" name="closesAt" disabled={!writable} defaultValue={test.closes_at ? test.closes_at.slice(0, 16) : ""} className="mt-0.5 h-9 w-full rounded-lg border border-ink/15 px-2 text-xs" />
                        </label>
                      </div>
                      <button
                        type="submit"
                        disabled={!writable}
                        className="h-10 self-center rounded-lg bg-ink px-4 text-sm font-semibold text-white disabled:opacity-40"
                      >
                        Save
                      </button>
                    </form>
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>
    </>
  );
}
