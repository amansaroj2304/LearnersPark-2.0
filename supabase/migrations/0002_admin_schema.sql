-- 0002 · Admin console foundation (Phase 1–2)
-- Students, test registry, administrators, login events and the audit trail.
-- Additive and safe: no existing table is dropped or renamed.

begin;

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Students: one permanent profile per authenticated user
-- ---------------------------------------------------------------------------
create sequence if not exists public.student_id_seq start 1;

create table if not exists public.students (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null unique references auth.users(id) on delete cascade,
  student_id     text not null unique,
  full_name      text not null default '',
  email          text not null default '',
  mobile         text,
  mobile_norm    text,
  account_status text not null default 'active'
                 check (account_status in ('active', 'inactive', 'suspended')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create unique index if not exists students_email_uidx
  on public.students (lower(trim(email)));
create unique index if not exists students_mobile_norm_uidx
  on public.students (mobile_norm) where mobile_norm is not null;

create table if not exists public.profile_conflicts (
  id          bigserial primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  email       text,
  mobile_norm text,
  reason      text not null,
  status      text not null default 'open'
              check (status in ('open', 'resolved', 'dismissed')),
  created_at  timestamptz not null default now()
);

-- Create the profile automatically for every new sign-in.
create or replace function public.handle_new_student()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.students (user_id, student_id, full_name, email)
  values (
    new.id,
    'LP-' || lpad(nextval('public.student_id_seq')::text, 6, '0'),
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''),
    coalesce(new.email, '')
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_student();

-- Backfill existing accounts.
insert into public.students (user_id, student_id, full_name, email)
select u.id,
       'LP-' || lpad(nextval('public.student_id_seq')::text, 6, '0'),
       coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name', ''),
       coalesce(u.email, '')
from auth.users u
on conflict (user_id) do nothing;

-- ---------------------------------------------------------------------------
-- Test registry (metadata only for now; question banks stay in the repo)
-- ---------------------------------------------------------------------------
create table if not exists public.tests (
  id               uuid primary key default gen_random_uuid(),
  test_key         text not null unique,
  title            text not null,
  category         text not null default 'CSSS',
  description      text,
  exam_date        date,
  duration_minutes int  not null,
  marks_correct    int  not null default 3,
  marks_wrong      int  not null default 1,
  max_marks        int  not null,
  total_questions  int  not null,
  status           text not null default 'draft'
                   check (status in ('draft', 'published', 'archived')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

insert into public.tests
  (test_key, title, category, duration_minutes, marks_correct, marks_wrong, max_marks, total_questions, status)
values
  ('mock-01', 'CSSS Mock Test 01', 'CSSS', 10, 3, 1, 210, 70, 'published'),
  ('mock-02', 'CSSS Mock Test 02', 'CSSS', 10, 3, 1, 210, 70, 'published'),
  ('mock-03', 'CSSS Mock Test 03', 'CSSS', 10, 3, 1, 210, 70, 'published')
on conflict (test_key) do nothing;

-- ---------------------------------------------------------------------------
-- Administrators
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  role       text not null default 'admin'
             check (role in ('super_admin', 'admin', 'read_only')),
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = auth.uid() and is_active
  );
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = auth.uid() and is_active and role = 'super_admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- Login events and audit trail
-- ---------------------------------------------------------------------------
create table if not exists public.login_events (
  id         bigserial primary key,
  student_id uuid references public.students(id) on delete cascade,
  user_id    uuid references auth.users(id) on delete cascade,
  event_type text not null check (event_type in ('sign_in', 'sign_out', 'failed')),
  ip         inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists login_events_user_idx on public.login_events (user_id, created_at desc);

create table if not exists public.audit_log (
  id          bigserial primary key,
  admin_id    uuid not null references auth.users(id) on delete cascade,
  action      text not null,
  target_type text,
  target_id   text,
  metadata    jsonb,
  ip          inet,
  created_at  timestamptz not null default now()
);

create index if not exists audit_log_created_idx on public.audit_log (created_at desc);

create or replace function public.log_login_event(
  p_event_type text,
  p_ip text default null,
  p_user_agent text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_student uuid;
begin
  if v_uid is null then
    return;
  end if;
  select id into v_student from public.students where user_id = v_uid;
  insert into public.login_events (student_id, user_id, event_type, ip, user_agent)
  values (v_student, v_uid, p_event_type, nullif(p_ip, '')::inet, p_user_agent);
end;
$$;

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table public.students         enable row level security;
alter table public.profile_conflicts enable row level security;
alter table public.tests            enable row level security;
alter table public.admin_users      enable row level security;
alter table public.login_events     enable row level security;
alter table public.audit_log        enable row level security;

drop policy if exists students_select_own on public.students;
create policy students_select_own on public.students
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists students_update_own on public.students;
create policy students_update_own on public.students
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists students_admin_update on public.students;
create policy students_admin_update on public.students
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists profile_conflicts_admin on public.profile_conflicts;
create policy profile_conflicts_admin on public.profile_conflicts
  for select using (public.is_admin());

drop policy if exists tests_select_published on public.tests;
create policy tests_select_published on public.tests
  for select using (status = 'published' or public.is_admin());

drop policy if exists tests_admin_write on public.tests;
create policy tests_admin_write on public.tests
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists admin_users_read on public.admin_users;
create policy admin_users_read on public.admin_users
  for select using (public.is_admin());

drop policy if exists admin_users_write on public.admin_users;
create policy admin_users_write on public.admin_users
  for all using (public.is_super_admin()) with check (public.is_super_admin());

drop policy if exists login_events_admin on public.login_events;
create policy login_events_admin on public.login_events
  for select using (public.is_admin());

drop policy if exists audit_log_admin on public.audit_log;
create policy audit_log_admin on public.audit_log
  for select using (public.is_admin());

drop policy if exists audit_log_insert on public.audit_log;
create policy audit_log_insert on public.audit_log
  for insert to authenticated
  with check (public.is_admin() and admin_id = auth.uid());

commit;
