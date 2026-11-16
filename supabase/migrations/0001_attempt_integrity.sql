-- 0001 · Attempt integrity (Phase 0)
-- Adds the metadata the admin console needs and makes "one test, one attempt"
-- a database guarantee rather than a UI suggestion.
-- Safe to run on the live project: test_attempts is currently empty.

begin;

alter table public.test_attempts
  add column if not exists attempt_number     int          not null default 1,
  add column if not exists started_at         timestamptz,
  add column if not exists time_taken_seconds int,
  add column if not exists unattempted        int          not null default 0,
  add column if not exists percentage         numeric(5,2) not null default 0,
  add column if not exists result_status      text         not null default 'completed',
  add column if not exists answers            jsonb;

alter table public.test_attempts
  drop constraint if exists test_attempts_result_status_check;
alter table public.test_attempts
  add constraint test_attempts_result_status_check
  check (result_status in ('completed', 'incomplete', 'abandoned'));

-- Backfill derived columns for any rows that already exist.
update public.test_attempts
set percentage = round((score::numeric / nullif(max_score, 0)) * 100, 2)
where max_score > 0;

-- One attempt per student per test.
create unique index if not exists test_attempts_one_per_test_uidx
  on public.test_attempts (user_id, test_id);

create index if not exists test_attempts_created_at_idx
  on public.test_attempts (created_at desc);

create index if not exists test_attempts_test_id_idx
  on public.test_attempts (test_id);

commit;
