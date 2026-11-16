-- OPAM module: two 120-question practice sets, server-graded.
-- RLS is enabled with NO policies: these tables are unreachable with the
-- publishable key. Only the server (service role) reads or writes them, so
-- answer keys can never reach a browser.

create table if not exists public.opam_questions (
  id          text primary key,
  set_id      int  not null check (set_id in (1, 2)),
  part        int  not null check (part in (1, 2, 3)),
  qnum        int  not null check (qnum between 1 and 120),
  format      text not null check (format in ('agree', 'ab', 'abcd')),
  text        text not null,
  keyed       text check (keyed in ('P', 'N')),
  pair        text,
  option_a    text,
  option_b    text,
  options     jsonb,
  best_index  int check (best_index between 0 and 3),
  acceptable  int[] not null default '{}',
  rationales  jsonb,
  olq         text[] not null default '{}',
  olq_a       text[] not null default '{}',
  olq_b       text[] not null default '{}',
  is_active   boolean not null default true,
  updated_at  timestamptz not null default now(),
  updated_by  uuid,
  unique (set_id, qnum)
);

create index if not exists opam_questions_set_part_idx on public.opam_questions (set_id, part);

create table if not exists public.opam_set_config (
  set_id              int primary key check (set_id in (1, 2)),
  title               text not null,
  subtitle            text not null default '',
  is_enabled          boolean not null default false,
  per_question_secs   int not null default 15 check (per_question_secs between 5 and 120),
  total_seconds       int not null default 1800 check (total_seconds between 300 and 7200),
  allow_back_nav      boolean not null default true,
  show_report_to_user boolean not null default true,
  updated_at          timestamptz not null default now()
);

insert into public.opam_set_config (set_id, title, subtitle, is_enabled)
values
  (1, 'OPAM Mock Test — Set 1', 'Foundations', false),
  (2, 'OPAM Mock Test — Set 2', 'Pressure', false)
on conflict (set_id) do nothing;

create table if not exists public.opam_attempts (
  id            uuid primary key default gen_random_uuid(),
  set_id        int not null references public.opam_set_config (set_id),
  user_id       uuid references auth.users (id) on delete set null,
  guest_token   uuid unique,
  status        text not null default 'in_progress'
                check (status in ('in_progress', 'submitted', 'auto_submitted', 'abandoned')),
  started_at    timestamptz not null default now(),
  finished_at   timestamptz,
  elapsed_secs  int not null default 0,
  answers       jsonb not null default '{}'::jsonb,
  spent         jsonb not null default '{}'::jsonb,
  locked        jsonb not null default '{}'::jsonb,
  flagged       jsonb not null default '{}'::jsonb,
  report        jsonb,
  ip_hash       text,
  user_agent    text
);

create index if not exists opam_attempts_set_status_idx on public.opam_attempts (set_id, status);
create index if not exists opam_attempts_user_idx on public.opam_attempts (user_id, started_at desc);
create index if not exists opam_attempts_started_idx on public.opam_attempts (started_at desc);

create table if not exists public.opam_audit (
  id         bigserial primary key,
  actor_id   uuid,
  action     text not null,
  target     text not null,
  before     jsonb,
  after      jsonb,
  created_at timestamptz not null default now()
);

create index if not exists opam_audit_created_idx on public.opam_audit (created_at desc);

alter table public.opam_questions  enable row level security;
alter table public.opam_set_config enable row level security;
alter table public.opam_attempts   enable row level security;
alter table public.opam_audit      enable row level security;

-- No policies on purpose. The publishable key gets nothing; the service role
-- (server only) bypasses RLS. Candidate-facing reads go through server routes
-- that strip keyed / pair / best_index / acceptable / rationales.
