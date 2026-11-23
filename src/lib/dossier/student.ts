"use client";

/** One permanent student profile per browser, shared by all 15 days. */
export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
}

const KEY = "lp.dossier.student";

export function loadStudent(): StudentProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as StudentProfile;
    return p && p.id && p.name ? p : null;
  } catch {
    return null;
  }
}

export function saveStudent(p: StudentProfile) {
  window.localStorage.setItem(KEY, JSON.stringify(p));
}

export function makeStudentId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `DOS-${s}`;
}

export function safeName(s: string) {
  return (s.trim() || "Student").replace(/[^A-Za-z0-9]+/g, "_").slice(0, 40);
}
