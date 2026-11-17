-- SSB module: the 17 practice tests, organised day-wise.
-- RLS with no policies: the catalogue is read through the server only.

create table if not exists public.ssb_tests (
  id          text primary key,
  test_no     int  not null unique check (test_no between 1 and 17),
  day         int  not null check (day between 1 and 5),
  name        text not null,
  full_form   text not null,
  category    text not null,
  description text not null,
  status      text not null default 'SOON' check (status in ('SOON', 'AVAILABLE', 'LIVE', 'COMPLETED')),
  instructions text,
  content_ref text,
  opens_at    timestamptz,
  closes_at   timestamptz,
  updated_at  timestamptz not null default now(),
  updated_by  uuid
);

alter table public.ssb_tests enable row level security;

insert into public.ssb_tests (id, test_no, day, name, full_form, category, description) values
  ('oir', 1, 1, 'OIR', 'Officer Intelligence Rating', 'Screening',
   'A reasoning paper in two booklets covering verbal and non-verbal intelligence — series, analogies, matrices and spatial questions against the clock.'),
  ('ppdt', 2, 1, 'PPDT', 'Picture Perception and Discussion Test', 'Screening',
   'A hazy picture is shown for 30 seconds; you write a story in four minutes, then narrate it and agree a common story with the group.'),
  ('tat', 3, 2, 'TAT', 'Thematic Apperception Test', 'Psychological',
   'A series of pictures, each shown briefly; you write a story for every one, ending with a blank slide where you invent your own.'),
  ('wat', 4, 2, 'WAT', 'Word Association Test', 'Psychological',
   'Sixty words appear one at a time for 15 seconds each; you write the first meaningful sentence each word brings to mind.'),
  ('srt', 5, 2, 'SRT', 'Situation Reaction Test', 'Psychological',
   'Sixty everyday situations in 30 minutes; for each, you write what you would actually do.'),
  ('sdt', 6, 2, 'SDT', 'Self Description Test', 'Psychological',
   'Five short pieces of writing: how your parents see you, your teachers, your friends, how you see yourself, and how you would like to be seen.'),
  ('gd', 7, 3, 'GD', 'Group Discussion', 'GTO Tasks',
   'Two group discussions on current affairs and social issues, where assessors watch how you contribute, listen and move the group.'),
  ('gpe', 8, 3, 'GPE', 'Group Planning Exercise', 'GTO Tasks',
   'A model situation with a map is read out; you write your own plan, then the group agrees one plan and briefs it.'),
  ('pgt', 9, 3, 'PGT', 'Progressive Group Task', 'GTO Tasks',
   'The group crosses a series of obstacles using planks, ropes and barrels, with the rules tightening at every stage.'),
  ('hgt', 10, 3, 'HGT', 'Half Group Task', 'GTO Tasks',
   'Half the group tackles an obstacle task with fewer people and the same resources.'),
  ('lecturette', 11, 4, 'Lecturette', 'Lecturette', 'GTO Tasks',
   'Three minutes to speak on a topic chosen from a card, after three minutes of preparation.'),
  ('individual-obstacles', 12, 4, 'Individual Obstacles', 'Individual Obstacles', 'GTO Tasks',
   'Ten obstacles, each carrying points, to be attempted individually within three minutes.'),
  ('command-task', 13, 4, 'Command Task', 'Command Task', 'GTO Tasks',
   'You are nominated to lead the group on an obstacle task, then answer the assessing officer''s questions on your plan.'),
  ('snake-race', 14, 4, 'Snake Race', 'Group Obstacle Race', 'GTO Tasks',
   'The group races through a course of obstacles while carrying a rolled tent, working as one unit.'),
  ('final-group-task', 15, 4, 'Final Group Task', 'Final Group Task', 'GTO Tasks',
   'One last obstacle task for the whole group, bringing together everything practised during the GTO series.'),
  ('personal-interview', 16, 5, 'Personal Interview', 'Personal Interview', 'Conference',
   'A conversation with the interviewing officer covering your background, education, hobbies, work and current affairs.'),
  ('ssb-conference', 17, 5, 'SSB Conference', 'SSB Conference', 'Conference',
   'All assessors meet you together for a short conference before results are announced.')
on conflict (id) do nothing;

-- Note: status starts at SOON for all 17. Enable a test from /admin/ssb only
-- when its practice content exists.
