import { createClient } from "@/lib/supabase/server";

export type StudentRow = {
  id: string;
  user_id: string;
  student_id: string;
  full_name: string;
  email: string;
  mobile: string | null;
  account_status: "active" | "inactive" | "suspended";
  created_at: string;
};

export type AttemptRow = {
  id: string;
  user_id: string;
  test_id: string;
  test_title: string;
  score: number;
  max_score: number;
  correct: number;
  wrong: number;
  attempted: number;
  accuracy: number;
  sections: { code: string; name: string; attempted: number; correct: number; wrong: number; score: number }[];
  created_at: string;
};

export type TestRow = {
  id: string;
  test_key: string;
  title: string;
  category: string;
  duration_minutes: number;
  marks_correct: number;
  marks_wrong: number;
  max_marks: number;
  total_questions: number;
  status: "draft" | "published" | "archived";
};

export type LoginRow = {
  id: number;
  user_id: string | null;
  event_type: "sign_in" | "sign_out" | "failed";
  ip: string | null;
  user_agent: string | null;
  created_at: string;
};

export type AuditRow = {
  id: number;
  admin_id: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

const PAGE_SIZE = 25;

export async function getDashboard() {
  const supabase = await createClient();
  const [students, attempts, tests, logins] = await Promise.all([
    supabase.from("students").select("id", { count: "exact", head: true }),
    supabase.from("test_attempts").select("id", { count: "exact", head: true }),
    supabase.from("tests").select("id", { count: "exact", head: true }),
    supabase
      .from("login_events")
      .select("id", { count: "exact", head: true })
      .gte("created_at", new Date(Date.now() - 86400000).toISOString()),
  ]);

  const { data: recent } = await supabase
    .from("test_attempts")
    .select("id, user_id, test_id, test_title, score, max_score, accuracy, created_at")
    .order("created_at", { ascending: false })
    .limit(8);

  const { data: byStatus } = await supabase
    .from("students")
    .select("account_status")
    .limit(1000);

  const statusCounts = { active: 0, inactive: 0, suspended: 0 };
  for (const row of byStatus ?? []) {
    const key = row.account_status as keyof typeof statusCounts;
    if (key in statusCounts) statusCounts[key] += 1;
  }

  return {
    counts: {
      students: students.count ?? 0,
      attempts: attempts.count ?? 0,
      tests: tests.count ?? 0,
      logins24h: logins.count ?? 0,
    },
    statusCounts,
    recent: (recent ?? []) as {
      id: string;
      user_id: string;
      test_id: string;
      test_title: string;
      score: number;
      max_score: number;
      accuracy: number;
      created_at: string;
    }[],
  };
}

export async function getStudents(params: {
  q?: string;
  status?: string;
  page?: number;
}) {
  const supabase = await createClient();
  const page = Math.max(1, params.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  let query = supabase
    .from("students")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (params.q) {
    const term = params.q.replace(/[%,]/g, " ").trim();
    if (term) {
      query = query.or(
        `full_name.ilike.%${term}%,email.ilike.%${term}%,student_id.ilike.%${term}%,mobile.ilike.%${term}%`,
      );
    }
  }
  if (params.status && params.status !== "all") {
    query = query.eq("account_status", params.status);
  }

  const { data, count, error } = await query;
  return {
    rows: (data ?? []) as StudentRow[],
    total: count ?? 0,
    page,
    pageSize: PAGE_SIZE,
    error: error?.message ?? null,
  };
}

export async function getStudent(id: string) {
  const supabase = await createClient();
  const { data: student, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !student) return { student: null, attempts: [] as AttemptRow[], logins: [] as LoginRow[] };

  const [attempts, logins] = await Promise.all([
    supabase
      .from("test_attempts")
      .select("*")
      .eq("user_id", (student as StudentRow).user_id)
      .order("created_at", { ascending: false }),
    supabase
      .from("login_events")
      .select("*")
      .eq("user_id", (student as StudentRow).user_id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  return {
    student: student as StudentRow,
    attempts: (attempts.data ?? []) as AttemptRow[],
    logins: (logins.data ?? []) as LoginRow[],
  };
}

export async function getTests() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tests")
    .select("*")
    .order("created_at", { ascending: true });
  return (data ?? []) as TestRow[];
}

export async function getLogins() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("login_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  const rows = (data ?? []) as LoginRow[];
  return { rows, students: await studentNames(rows.map((r) => r.user_id)) };
}

export async function getAudit() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  const rows = (data ?? []) as AuditRow[];
  return { rows, admins: await studentNames(rows.map((r) => r.admin_id)) };
}

async function studentNames(ids: (string | null)[]) {
  const unique = [...new Set(ids.filter((id): id is string => Boolean(id)))];
  if (unique.length === 0) return new Map<string, string>();
  const supabase = await createClient();
  const { data } = await supabase
    .from("students")
    .select("user_id, full_name, student_id")
    .in("user_id", unique);
  const map = new Map<string, string>();
  for (const row of data ?? []) {
    map.set(row.user_id as string, `${row.full_name || "Unnamed"} · ${row.student_id}`);
  }
  return map;
}

export async function getAllStudentsForExport() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("students")
    .select("student_id, full_name, email, mobile, account_status, created_at")
    .order("student_id", { ascending: true });
  return (data ?? []) as Pick<
    StudentRow,
    "student_id" | "full_name" | "email" | "mobile" | "account_status" | "created_at"
  >[];
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
