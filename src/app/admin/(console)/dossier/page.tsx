import { listDossierSubmissions } from "@/app/dossier/actions";
import { SyncNowButton } from "./sync-button";

export const instant = false;

export default async function AdminDossierPage() {
  const data = await listDossierSubmissions();

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">Daily drill submissions</h1>
          <p className="mt-2 max-w-2xl text-sm text-ink/60">
            Every submitted Day drill, grouped by student and day. Files are also copied into Google Drive under
            DAILY DOSSIER SSB / Day N / StudentID_Name at the next sync. Links below expire after 24 hours.
          </p>
        </div>
        <SyncNowButton />
      </div>
      <p className="mt-3 max-w-2xl text-xs text-ink/45">
        “Sync now” immediately copies pending PPDT sheets and drill submissions to Drive (ppdt uploaded and
        DAILY DOSSIER SSB). An automatic sync also runs every hour.
      </p>

      {!data.ok ? (
        <p className="mt-6 rounded-xl border border-crimson/25 bg-crimson/5 px-4 py-3 text-sm text-ink/70">
          {data.message ?? "Submissions are not configured."}
        </p>
      ) : data.students.length === 0 ? (
        <p className="mt-6 rounded-xl border border-ink/10 bg-white px-4 py-6 text-sm text-ink/55">
          No submissions yet.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {data.students.map((row) => (
            <section key={`${row.student}-${row.day}`} className="rounded-2xl border border-ink/10 bg-white p-5">
              <h2 className="text-sm font-bold text-ink">
                {row.student.replace(/^DOS-[A-Z0-9]{6}_/, "")} <span className="font-normal text-ink/45">· {row.day.replace("day", "Day ")}</span>
              </h2>
              <ul className="mt-3 space-y-1 text-sm">
                {row.files.map((f) => (
                  <li key={f.path}>
                    <a href={f.url} target="_blank" rel="noreferrer" className="font-semibold text-crimson hover:underline">
                      {f.name}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
