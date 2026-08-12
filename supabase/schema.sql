-- ============================================================================
-- Sweet G's Smoke Shop — inventory schema
--
-- Run this once in the Supabase SQL editor (Dashboard → SQL Editor → New query).
-- It is idempotent: safe to re-run.
--
-- Modelled on how the shop actually operates rather than on a generic store.
-- Their Facebook page is a stream of "FLAVOR OF THE DAY" posts and stock that
-- turns over weekly, so variants (flavours) are first-class and there's a
-- lightweight announcements table for the banner they post constantly.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ── Categories ──────────────────────────────────────────────────────────────
create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  blurb       text default '',
  sort        int  not null default 0,
  created_at  timestamptz not null default now()
);

-- ── Products ────────────────────────────────────────────────────────────────
create table if not exists products (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  name         text not null,
  category_id  uuid references categories(id) on delete set null,
  brand        text,
  hook         text default '',
  body         text default '',
  details      text[] not null default '{}',

  -- Price is nullable on purpose. Plenty of their stock is one-of-one and
  -- quoted in person; a null price renders as "Ask in store" rather than $0.
  price_cents  int check (price_cents is null or price_cents >= 0),

  in_stock     boolean not null default true,
  rotates      boolean not null default false,  -- "stock rotates weekly" badge
  featured     boolean not null default false,
  published    boolean not null default true,   -- hide from the site without deleting

  image_path   text,        -- path within the product-images storage bucket
  sort         int not null default 0,

  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists products_category_idx on products(category_id);
create index if not exists products_published_idx on products(published);

-- ── Variants — the flavour list ─────────────────────────────────────────────
-- This is the table that earns its keep. Vape flavours, disposable models,
-- chocolate types, shirt sizes: anything where the product is one thing and the
-- thing that sells out is a variation of it.
create table if not exists product_variants (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid not null references products(id) on delete cascade,
  name         text not null,                    -- "Blue Razz", "XL", "Gelato"
  price_cents  int check (price_cents is null or price_cents >= 0),
  in_stock     boolean not null default true,
  sort         int not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists variants_product_idx on product_variants(product_id);

-- ── Announcements — "FLAVOR OF THE DAY", "open till 9 tonight" ──────────────
create table if not exists announcements (
  id          uuid primary key default gen_random_uuid(),
  body        text not null,
  active      boolean not null default true,
  -- Optional self-expiry so a "today only" note doesn't sit there in November.
  expires_at  timestamptz,
  created_at  timestamptz not null default now()
);

-- ── Staff allowlist ─────────────────────────────────────────────────────────
-- Membership here — not merely having an auth account — is what grants write
-- access. Signing up must never be enough to edit the shop's inventory.
create table if not exists staff (
  email      text primary key,
  name       text,
  created_at timestamptz not null default now()
);

-- ── updated_at trigger ──────────────────────────────────────────────────────
create or replace function touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists products_touch on products;
create trigger products_touch before update on products
  for each row execute function touch_updated_at();

-- ============================================================================
-- Row Level Security
--
-- Read: anonymous visitors see published products only.
-- Write: restricted to emails present in `staff`.
-- ============================================================================

alter table categories       enable row level security;
alter table products         enable row level security;
alter table product_variants enable row level security;
alter table announcements    enable row level security;
alter table staff            enable row level security;

create or replace function is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from staff
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- Categories: world-readable, staff-writable.
drop policy if exists categories_read on categories;
create policy categories_read on categories for select using (true);
drop policy if exists categories_write on categories;
create policy categories_write on categories for all
  using (is_staff()) with check (is_staff());

-- Products: the public only ever sees published rows; staff see everything.
drop policy if exists products_read on products;
create policy products_read on products for select
  using (published or is_staff());
drop policy if exists products_write on products;
create policy products_write on products for all
  using (is_staff()) with check (is_staff());

-- Variants follow their parent product's visibility.
drop policy if exists variants_read on product_variants;
create policy variants_read on product_variants for select
  using (
    exists (select 1 from products p
            where p.id = product_id and (p.published or is_staff()))
  );
drop policy if exists variants_write on product_variants;
create policy variants_write on product_variants for all
  using (is_staff()) with check (is_staff());

-- Announcements: only live, unexpired ones are public.
drop policy if exists announcements_read on announcements;
create policy announcements_read on announcements for select
  using ((active and (expires_at is null or expires_at > now())) or is_staff());
drop policy if exists announcements_write on announcements;
create policy announcements_write on announcements for all
  using (is_staff()) with check (is_staff());

-- Staff table: readable only by staff, and never writable from the client.
-- Add and remove people in the Supabase dashboard.
drop policy if exists staff_read on staff;
create policy staff_read on staff for select using (is_staff());

-- ============================================================================
-- Storage — product photography
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists product_images_read on storage.objects;
create policy product_images_read on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists product_images_write on storage.objects;
create policy product_images_write on storage.objects for all
  using (bucket_id = 'product-images' and is_staff())
  with check (bucket_id = 'product-images' and is_staff());

-- ============================================================================
-- Seed — the six real categories from their BBB listing
-- ============================================================================

insert into categories (slug, name, blurb, sort) values
  ('glass',        'Glass',                      'Water pipes, hand pipes, bubblers and rigs. Heady one-offs from local makers next to workhorse daily drivers.', 1),
  ('vaporizers',   'Vaporizers & Batteries',     'Dry herb and concentrate vaporizers, 510 batteries, pods, coils and chargers.', 2),
  ('cbd',          'CBD',                        'Tinctures, edibles, topicals and flower. Vermont-made where we can get it.', 3),
  ('art',          'Local Art',                  'Local and American-made art, prints and oddities. The walls change constantly.', 4),
  ('apparel',      'Vintage & Custom Clothing',  'Real Bud Camo, Backwoods, NEVA NUDE and Queen City, plus vintage we pick ourselves.', 5),
  ('accessories',  'Smoke Shop Staples',         'Grinders, papers, wraps, torches, trays, screens, cleaners.', 6)
on conflict (slug) do nothing;

-- ── FINAL STEP ──────────────────────────────────────────────────────────────
-- Add yourself so you can log in to /admin. Replace with the real address:
--
--   insert into staff (email, name) values ('sweetgsmokeshop@gmail.com', 'Jordan');
--
-- Then create that user under Authentication → Users → Add user (set a
-- password, and tick "Auto Confirm User").
