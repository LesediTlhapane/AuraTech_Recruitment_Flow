-- The app currently uses Supabase's anonymous client without user authentication.
-- Apply this in Supabase SQL Editor to allow the notification feed to work.
-- Replace these policies with authenticated, user-scoped policies before production use.

alter table public.notifications enable row level security;

drop policy if exists "Allow anonymous notification reads" on public.notifications;
create policy "Allow anonymous notification reads"
on public.notifications
for select
to anon, authenticated
using (true);

drop policy if exists "Allow anonymous notification inserts" on public.notifications;
create policy "Allow anonymous notification inserts"
on public.notifications
for insert
to anon, authenticated
with check (true);

drop policy if exists "Allow anonymous notification updates" on public.notifications;
create policy "Allow anonymous notification updates"
on public.notifications
for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Allow anonymous notification deletes" on public.notifications;
create policy "Allow anonymous notification deletes"
on public.notifications
for delete
to anon, authenticated
using (true);
