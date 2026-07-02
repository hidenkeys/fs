create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  role text not null default 'family_admin',
  created_at timestamptz not null default now()
);

create table if not exists tributes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  relationship text not null,
  country text not null,
  message text not null,
  photo_url text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  pinned boolean not null default false,
  featured boolean not null default false,
  candle_count integer not null default 0,
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

create index if not exists tributes_status_created_at_idx on tributes (status, created_at desc);
create index if not exists tributes_featured_idx on tributes (featured) where featured = true;
create index if not exists tributes_pinned_idx on tributes (pinned) where pinned = true;

create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text not null,
  alt text not null,
  story text,
  quote text,
  year_label text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table gallery add column if not exists sort_order integer not null default 0;
create unique index if not exists gallery_title_unique_idx on gallery (title);
create index if not exists gallery_status_created_at_idx on gallery (status, featured desc, sort_order asc, created_at desc);

create table if not exists timeline (
  id uuid primary key default gen_random_uuid(),
  year_label text not null,
  title text not null,
  description text not null,
  image_url text,
  quote text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create unique index if not exists timeline_title_unique_idx on timeline (title);
create index if not exists timeline_sort_order_idx on timeline (sort_order, created_at);

create table if not exists candles (
  id uuid primary key default gen_random_uuid(),
  country text,
  tribute_id uuid references tributes (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists flowers (
  id uuid primary key default gen_random_uuid(),
  country text,
  tribute_id uuid references tributes (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists photo_memories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  relationship text,
  country text,
  image_url text not null,
  memory text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

create index if not exists photo_memories_status_created_at_idx on photo_memories (status, created_at desc);

create table if not exists memory_stories (
  id uuid primary key default gen_random_uuid(),
  seed_key text unique,
  name text not null,
  relationship text not null,
  country text not null,
  story text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

alter table memory_stories add column if not exists seed_key text unique;
create index if not exists memory_stories_status_created_at_idx on memory_stories (status, featured desc, created_at desc);

create table if not exists map_pins (
  id uuid primary key default gen_random_uuid(),
  city text,
  country text not null,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  message text,
  status text not null default 'approved' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create unique index if not exists map_pins_city_country_unique_idx on map_pins (city, country);

create table if not exists settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
