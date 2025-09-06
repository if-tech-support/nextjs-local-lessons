create table memos (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);