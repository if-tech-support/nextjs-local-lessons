-- Enable required extension for gen_random_uuid
create extension if not exists pgcrypto;

-- Memos table
create table if not exists public.memos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
