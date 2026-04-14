-- Bucket pro PNG z Gemini; veřejné čtení; app_config pro gemini_api_key (service role only).

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

drop policy if exists "Public read gemini-images" on storage.objects;
create policy "Public read gemini-images"
on storage.objects for select
to public
using (bucket_id = 'gemini-images');

create table if not exists public.app_config (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table public.app_config enable row level security;

comment on table public.app_config is 'Skript gemini-regenerate-images.mjs čte gemini_api_key přes service role.';
