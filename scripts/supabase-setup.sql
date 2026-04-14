-- Spusť v Supabase → SQL Editor (projekt: njbtqmsxbyvpwigfceke nebo vlastní).
-- Bucket pro PNG z Gemini (binární upload ze skriptu — ne base64 v DB).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'gemini-images',
  'gemini-images',
  true,
  52428800,
  array['image/png', 'image/jpeg', 'image/webp']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Veřejné čtení souborů v bucketu (URL pro <img> / odkazy).
drop policy if exists "Public read gemini-images" on storage.objects;
create policy "Public read gemini-images"
on storage.objects for select
to public
using (bucket_id = 'gemini-images');

-- Volitelný klíč Gemini (čte jen skript se SERVICE ROLE — ne v prohlížeči).
create table if not exists public.app_config (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table public.app_config enable row level security;

-- Bez policies: běžní uživatelé k tabulci nepřijdou; service role RLS obchází.
-- Nepřidávej policy pro anon — klíč by šel vyčíst z klienta s anon key.

comment on table public.app_config is 'Skript gemini-regenerate-images.mjs čte gemini_api_key přes service role.';
