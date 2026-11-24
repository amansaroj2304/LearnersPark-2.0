"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadStudent, makeStudentId, saveStudent, type StudentProfile } from "@/lib/dossier/student";

export interface DayMeta {
  day: number;
  lecturette: string;
  totalSeconds: number;
}

interface DayState {
  status: "NOT STARTED" | "IN PROGRESS" | "SUBMITTED";
  submittedAt?: string;
  lastAttempt?: string;
}

const STATUS_STYLE: Record<string, string> = {
  "NOT STARTED": "bg-ink/5 text-ink/55",
  "IN PROGRESS": "bg-gold/20 text-[#7a5c10]",
  SUBMITTED: "bg-[#2f9e5b]/12 text-[#256e42]",
};

export function DossierDashboard({ days }: { days: DayMeta[] }) {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [state, setState] = useState<Record<number, DayState>>({});
  const [editing, setEditing] = useState(false);

  // Values live in localStorage, so they are read after mount to keep SSR output stable.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStudent(loadStudent());
    const next: Record<number, DayState> = {};
    for (const d of days) {
      try {
        const raw = window.localStorage.getItem(`lp.dossier.day${d.day}`);
        if (!raw) continue;
        const p = JSON.parse(raw) as { status?: string; submittedAt?: string; updatedAt?: string };
        next[d.day] = {
          status: p.status === "SUBMITTED" ? "SUBMITTED" : "IN PROGRESS",
          submittedAt: p.submittedAt,
          lastAttempt: p.updatedAt,
        };
      } catch {
        /* ignore */
      }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(next);
  }, [days]);

  const done = Object.values(state).filter((s) => s.status === "SUBMITTED").length;
  const pct = Math.round((done / days.length) * 100);

  function createProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const p: StudentProfile = {
      id: student?.id ?? makeStudentId(),
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
    };
    if (!p.name) return;
    saveStudent(p);
    setStudent(p);
    setEditing(false);
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6">
        {student && !editing ? (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.14em] text-ink/45 uppercase">Student profile</p>
              <p className="mt-1 text-lg font-bold text-ink">{student.name}</p>
              <p className="text-xs text-ink/55">
                ID <span className="font-semibold text-ink/75">{student.id}</span>
                {student.email ? ` · ${student.email}` : ""}
                {student.phone ? ` · ${student.phone}` : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="h-9 rounded-lg border border-ink/15 px-4 text-sm font-semibold text-ink hover:bg-ink/5"
            >
              Edit profile
            </button>
          </div>
        ) : (
          <form onSubmit={createProfile} className="grid gap-3 sm:grid-cols-4">
            <label className="text-xs font-semibold text-ink/60">
              Full name
              <input
                name="name"
                required
                defaultValue={student?.name ?? ""}
                className="mt-1 h-10 w-full rounded-lg border border-ink/15 px-3 text-sm text-ink"
              />
            </label>
            <label className="text-xs font-semibold text-ink/60">
              Email
              <input
                name="email"
                type="email"
                defaultValue={student?.email ?? ""}
                className="mt-1 h-10 w-full rounded-lg border border-ink/15 px-3 text-sm text-ink"
              />
            </label>
            <label className="text-xs font-semibold text-ink/60">
              Mobile
              <input
                name="phone"
                defaultValue={student?.phone ?? ""}
                className="mt-1 h-10 w-full rounded-lg border border-ink/15 px-3 text-sm text-ink"
              />
            </label>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="inline-flex h-10 items-center rounded-lg bg-crimson px-4 text-sm font-semibold text-white hover:bg-crimson-shape"
              >
                {student ? "Save" : "Create profile"}
              </button>
              {student ? (
                <button type="button" onClick={() => setEditing(false)} className="h-10 px-2 text-sm text-ink/50">
                  Cancel
                </button>
              ) : null}
            </div>
            <p className="text-xs text-ink/45 sm:col-span-4">
              One permanent profile for all 15 days. It stays in this browser and is attached to every submission.
            </p>
          </form>
        )}
      </section>

      <section className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-bold text-ink">15-day progress</h2>
          <span className="text-sm font-semibold text-ink/60">
            {done}/{days.length} submitted
          </span>
        </div>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-ink/8">
          <div className="h-full rounded-full bg-crimson transition-all" style={{ width: `${pct}%` }} />
        </div>
      </section>

      <section aria-label="Daily drills" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {days.map((d) => {
          const s = state[d.day];
          const status = s?.status ?? "NOT STARTED";
          return (
            <article key={d.day} className="flex flex-col rounded-2xl border border-ink/10 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink text-sm font-bold text-white">
                    {d.day}
                  </span>
                  <div>
                    <h3 className="text-base font-bold leading-tight text-ink">Day {d.day}</h3>
                    <p className="text-[11px] text-ink/50">
                      TAT · WAT 15 · SRT 10 · Lecturette
                    </p>
                  </div>
                </div>
                <span className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-bold ${STATUS_STYLE[status]}`}>
                  {status}
                </span>
              </div>
              <p className="mt-3 flex-1 text-xs leading-relaxed text-ink/55">
                Lecturette topic: <span className="font-semibold text-ink/75">{d.lecturette}</span>
              </p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-ink/40">~{Math.round(d.totalSeconds / 60)} min</span>
                <Link
                  href={`/dossier/${d.day}`}
                  className={`inline-flex h-9 items-center rounded-lg px-4 text-sm font-semibold ${
                    status === "SUBMITTED"
                      ? "border border-ink/15 text-ink hover:bg-ink/5"
                      : "bg-crimson text-white hover:bg-crimson-shape"
                  }`}
                >
                  {status === "SUBMITTED" ? "View / resubmit" : status === "IN PROGRESS" ? "Resume" : "Start practice"}
                </Link>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
