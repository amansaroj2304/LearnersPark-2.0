"use client";

import { useRef, useState, useTransition } from "react";
import { uploadPpdtSheet } from "@/app/ppdt/actions";

export function SheetUpload({ mode, set }: { mode: "practice" | "timed"; set: string }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [fileName, setFileName] = useState("");

  return (
    <form
      ref={formRef}
      action={(formData) => {
        formData.set("mode", mode);
        formData.set("set", set);
        startTransition(async () => {
          const res = await uploadPpdtSheet(formData);
          setResult(res);
          if (res.ok) {
            formRef.current?.reset();
            setFileName("");
          }
        });
      }}
      className="mt-5 rounded-xl border border-dashed border-ink/20 bg-ink/[0.02] p-4"
    >
      <p className="text-xs font-bold tracking-[0.12em] text-ink/50 uppercase">Upload your written sheet</p>
      <p className="mt-1 text-xs text-ink/50">
        Wrote your story on paper? Photograph it and upload it here. The file is kept private and copied to the
        Drive folder <span className="font-semibold text-ink/70">ppdt uploaded</span>.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label className="inline-flex h-9 cursor-pointer items-center rounded-lg border border-ink/15 bg-white px-4 text-sm font-semibold text-ink hover:bg-ink/5">
          Choose photo or PDF
          <input
            type="file"
            name="file"
            accept="image/*,application/pdf"
            className="sr-only"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
          />
        </label>
        <button
          type="submit"
          disabled={pending || !fileName}
          className="inline-flex h-9 items-center rounded-lg bg-crimson px-4 text-sm font-semibold text-white hover:bg-crimson-shape disabled:cursor-not-allowed disabled:opacity-40"
        >
          {pending ? "Uploading…" : "Upload sheet"}
        </button>
        <span className="truncate text-xs text-ink/45">{fileName || "JPG, PNG or PDF · up to 10 MB"}</span>
      </div>
      {result ? (
        <p role="status" className={`mt-3 text-xs font-semibold ${result.ok ? "text-emerald-700" : "text-crimson"}`}>
          {result.message}
        </p>
      ) : null}
    </form>
  );
}
