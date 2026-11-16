import Link from "next/link";
import { connection } from "next/server";
import { PageHeader, StatCard, Badge } from "@/components/admin/ui";
import { getSetConfigs, opamInvariants, attemptStats } from "@/lib/opam/data";
import { isOpamConfigured } from "@/lib/supabase/service";
import { toggleSet, saveSetConfig } from "./actions";

export const instant = false;

export default async function AdminOpamPage() {
  if (!isOpamConfigured()) {
    return (
      <>
        <PageHeader title="OPAM" description="Personality assessment module." />
        <div className="px-5 py-6 sm:px-8">
          <div className="rounded-2xl border border-gold/40 bg-gold/10 p-5 text-sm text-[#6b520f]">
            <p className="font-semibold">The server key is not configured.</p>
            <p className="mt-1">
              OPAM reads its tables with the service role. Add{" "}
              <code className="rounded bg-white/60 px-1.5 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code> to the
              Vercel project environment variables, then redeploy.
            </p>
          </div>
        </div>
      </>
    );
  }

  await connection();
  const [configs, stats, problems] = await Promise.all([
    getSetConfigs(),
    attemptStats(),
    opamInvariants(),
  ]);

  return (
    <>
      <PageHeader
        title="OPAM"
        description="Two 120-question practice sets. Enable a set only when its bank passes validation."
        actions={
          <Link
            href="/admin/opam/attempts"
            className="h-10 rounded-lg border border-ink/15 px-4 text-sm font-semibold leading-[2.4rem] text-ink hover:bg-ink/5"
          >
            Attempts
          </Link>
        }
      />

      <div className="px-5 py-6 sm:px-8">
        {problems.length > 0 && (
          <div className="mb-5 rounded-xl border border-crimson/30 bg-crimson/5 p-4 text-sm text-crimson">
            <p className="font-semibold">Question bank fails validation</p>
            <ul className="mt-1 list-disc pl-5">
              {problems.map((p) => <li key={p}>{p}</li>)}
            </ul>
            <p className="mt-1 text-crimson/80">Sets cannot be enabled until these are resolved.</p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Questions live" value={stats.questions} hint="of 240 expected" />
          <StatCard label="Attempts · 24h" value={stats.attemptsToday} />
          <StatCard label="Completions" value={stats.completions} hint={`${stats.open} open`} />
          <StatCard label="Avg completion" value={`${stats.avgCompletion}%`} />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          {configs.map((config) => (
            <section key={config.set_id} className="rounded-2xl border border-ink/10 bg-white p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-ink">{config.title}</h2>
                  <p className="text-sm text-ink/55">{config.subtitle || "—"}</p>
                </div>
                <Badge tone={config.is_enabled ? "green" : "grey"}>
                  {config.is_enabled ? "Open" : "Closed"}
                </Badge>
              </div>

              <form action={toggleSet} className="mt-4">
                <input type="hidden" name="setId" value={config.set_id} />
                <button
                  type="submit"
                  className={`h-9 rounded-lg px-4 text-sm font-semibold ${
                    config.is_enabled
                      ? "border border-ink/15 text-ink hover:bg-ink/5"
                      : "bg-crimson text-white hover:bg-crimson-shape"
                  }`}
                >
                  {config.is_enabled ? "Close this set" : "Open this set"}
                </button>
              </form>

              <form action={saveSetConfig} className="mt-5 grid gap-3 sm:grid-cols-2">
                <input type="hidden" name="setId" value={config.set_id} />
                <label className="flex flex-col gap-1 text-xs font-semibold text-ink/60">
                  Title
                  <input name="title" defaultValue={config.title} maxLength={120} className="h-9 rounded-lg border border-ink/15 px-3 text-sm font-normal text-ink" />
                </label>
                <label className="flex flex-col gap-1 text-xs font-semibold text-ink/60">
                  Subtitle
                  <input name="subtitle" defaultValue={config.subtitle} maxLength={120} className="h-9 rounded-lg border border-ink/15 px-3 text-sm font-normal text-ink" />
                </label>
                <label className="flex flex-col gap-1 text-xs font-semibold text-ink/60">
                  Seconds per question
                  <input type="number" name="perQuestionSecs" min={5} max={120} defaultValue={config.per_question_secs} className="h-9 rounded-lg border border-ink/15 px-3 text-sm font-normal text-ink" />
                </label>
                <label className="flex flex-col gap-1 text-xs font-semibold text-ink/60">
                  Total clock (seconds)
                  <input type="number" name="totalSeconds" min={300} max={7200} defaultValue={config.total_seconds} className="h-9 rounded-lg border border-ink/15 px-3 text-sm font-normal text-ink" />
                </label>
                <label className="flex items-center gap-2 text-sm text-ink">
                  <input type="checkbox" name="allowBackNav" defaultChecked={config.allow_back_nav} />
                  Allow going back
                </label>
                <label className="flex items-center gap-2 text-sm text-ink">
                  <input type="checkbox" name="showReportToUser" defaultChecked={config.show_report_to_user} />
                  Show report to candidate
                </label>
                <button type="submit" className="h-9 rounded-lg bg-ink px-4 text-sm font-semibold text-white sm:col-span-2">
                  Save settings
                </button>
              </form>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
