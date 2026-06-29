-- ============================================================================
-- Life OS — Temel veritabanı şeması
-- Supabase SQL Editor'de bir kez çalıştır. Sade tutuldu; sonra genişletilecek.
-- Tüm tablolarda RLS aktif: kullanıcı SADECE kendi satırlarını görür/değiştirir.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- profiles  (auth.users'a 1-1 bağlı)
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at   timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- space_groups  (sidebar'daki daraltılabilir gruplar)
-- ----------------------------------------------------------------------------
create table if not exists public.space_groups (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  name         text not null,
  sort_order   integer not null default 0,
  is_collapsed boolean not null default false,
  created_at   timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- spaces  (bir gruba bağlı veya bağımsız)
-- ----------------------------------------------------------------------------
create table if not exists public.spaces (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  group_id   uuid references public.space_groups (id) on delete set null,
  name       text not null,
  type       text not null default 'standard'
             check (type in ('standard', 'tracker', 'kanban', 'language')),
  color      text not null default '#6366f1',
  icon       text not null default '📄',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- tasks
-- ----------------------------------------------------------------------------
create table if not exists public.tasks (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users (id) on delete cascade,
  space_id       uuid not null references public.spaces (id) on delete cascade,
  parent_heading text,
  title          text not null,
  due_date       date,
  priority       integer not null default 0,
  is_done        boolean not null default false,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- notes
-- ----------------------------------------------------------------------------
create table if not exists public.notes (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  space_id   uuid not null references public.spaces (id) on delete cascade,
  title      text not null default '',
  content    text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Sık sorgulanan kolonlar için indeksler.
create index if not exists idx_space_groups_user on public.space_groups (user_id);
create index if not exists idx_spaces_user        on public.spaces (user_id);
create index if not exists idx_spaces_group       on public.spaces (group_id);
create index if not exists idx_tasks_space        on public.tasks (space_id);
create index if not exists idx_notes_space        on public.notes (space_id);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table public.profiles     enable row level security;
alter table public.space_groups enable row level security;
alter table public.spaces       enable row level security;
alter table public.tasks        enable row level security;
alter table public.notes        enable row level security;

-- profiles: satır kullanıcının kendi id'si.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- Diğer tablolar: user_id eşleşmesi. Tek politika ile tüm işlemler.
drop policy if exists "space_groups_all_own" on public.space_groups;
create policy "space_groups_all_own" on public.space_groups
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "spaces_all_own" on public.spaces;
create policy "spaces_all_own" on public.spaces
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "tasks_all_own" on public.tasks;
create policy "tasks_all_own" on public.tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "notes_all_own" on public.notes;
create policy "notes_all_own" on public.notes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- TRIGGER'LAR
-- ============================================================================

-- Yeni auth.users kaydında otomatik profiles satırı.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- notes.updated_at otomatik güncelleme.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists notes_set_updated_at on public.notes;
create trigger notes_set_updated_at
  before update on public.notes
  for each row execute function public.set_updated_at();
