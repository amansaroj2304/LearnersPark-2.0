-- A test can carry reference notes before its practice module exists.
-- When reference_path is set, the /ssb card links to that page and shows
-- "Reference notes" instead of a bare Soon badge.

alter table public.ssb_tests add column if not exists reference_path text;

update public.ssb_tests
   set reference_path = '/ppdt',
       description = 'A hazy picture is shown for 30 seconds; you write a story in four minutes, then narrate it and agree a common story with the group. Notes on how to write and narrate it are live.'
 where id = 'ppdt';
