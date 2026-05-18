-- profiles: auth.users 확장 (닉네임·역할 등 추가 정보)
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text,
  avatar_url text,
  role text,
  created_at timestamptz default now()
);

-- posts: 블로그 글
create table posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text,
  content text,
  created_at timestamptz
);