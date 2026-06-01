-- comments for posts
create table post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  author_name text not null,
  content text not null,
  created_at timestamptz not null default now()
);

alter table post_comments enable row level security;

drop policy if exists "Allow anyone to read post comments" on post_comments;
drop policy if exists "Allow authenticated users to add post comments" on post_comments;
drop policy if exists "Allow users to delete their own post comments" on post_comments;

create policy "Allow anyone to read post comments"
on post_comments for select
using (true);

create policy "Allow authenticated users to add post comments"
on post_comments for insert
with check (auth.uid() = user_id);

create policy "Allow users to delete their own post comments"
on post_comments for delete
using (auth.uid() = user_id);