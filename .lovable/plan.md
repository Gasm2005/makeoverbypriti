# Makeover By Priti — Salon Website + Booking Engine

A mobile-first, elegant single-page site with a Supabase-powered booking engine and a protected admin panel. Built to be white-labeled for other salons by editing config rows in the database.

## Design direction

- Palette: blush pink `#F5E1DC`, rose gold `#B76E79`, cream `#FAF6F1`, deep charcoal `#1A1A1A`, soft gold accent `#D4AF7A`.
- Typography: Playfair Display (headings, serif) + Inter (body, sans). Loaded via `@fontsource` packages.
- Feel: airy, premium, lots of whitespace, soft shadows, gold hairline dividers, subtle fade/slide-in on scroll (Motion for React).
- Mobile-first; sticky bottom-bar on mobile with Call / WhatsApp / Book.

## Page sections (single route `/`)

1. **Hero** — full-bleed AI-generated bridal portrait, salon name in Playfair, tagline, 5★ badge "5.0 · 18+ Google reviews", primary "Book Appointment" (scroll to #book), secondary "Call Now" + WhatsApp icon.
2. **About** — Priti intro, 18+ happy brides, academy mention.
3. **Services** — Tabs: Bridal & Party | Hair | Skin & Beauty | Academy. Cards (icon + name + short desc + "from ₹___"). Driven by `services` table.
4. **Gallery** — 6 AI-generated placeholder images (bridal looks, salon interior, hair, skincare). Clearly marked as replaceable.
5. **Booking** — form (name, phone, service, date, staff, time slot, notes). Live slot availability per staff. Submit inserts into `bookings`; confirmation card on success.
6. **Reviews** — 3 real testimonials, 5★ display, "Read more on Google" button.
7. **Contact** — embedded Google Maps iframe (no API key, src-based embed), phone, WhatsApp, Instagram, hours.
8. **Footer** — name, quick links, socials, copyright.

## Booking engine

- Service durations stored per service (default 60 min; bridal 120; threading 15).
- Salon hours 11:00–20:00, slots generated client-side at 30-min granularity.
- A slot is shown disabled if it overlaps any existing booking for the selected **staff** on that date with status in (`pending`, `confirmed`).
- Slot query: `bookings` for staff_id + date → compute busy intervals → filter generated slots.
- On submit: insert via public server function (anon RLS policy: INSERT allowed for anyone, SELECT denied to anon).
- Success view: "Thank you! We'll confirm shortly via WhatsApp/Call."

## Admin panel (`/admin`, behind `_authenticated`)

- Full Supabase email/password login at `/auth` (managed by integration).
- Role check via `has_role(uid, 'admin')`; non-admins see "Access denied".
- Bookings table view: sortable by date, filter by status and date range; row actions: Confirm / Cancel / Complete.
- Sub-tabs: **Bookings**, **Services** (CRUD prices/durations/categories), **Staff** (CRUD), **Business Info** (name, tagline, phone, address, hours, socials, colors).
- All edits write to Supabase; the public site reads the same rows → white-label by editing here.

## White-label architecture

One Supabase project per salon. Tables drive everything visible:
- `business_info` (singleton row) — name, tagline, phone, whatsapp, address, maps_embed_url, instagram, hours, hero_image_url, brand colors.
- `services` — name, category, description, price_from, duration_min, icon, sort_order, active.
- `staff` — name, active.
- `bookings` — see schema below.
- `user_roles` + `has_role()` per Lovable convention.

Frontend reads via TanStack Query + server functions; a single `useBusinessInfo()` hook feeds branding to all sections.

## Technical details

### Stack
- TanStack Start (existing), Tailwind v4, shadcn/ui, Motion for React, date-fns, react-hook-form + zod.
- Supabase via Lovable Cloud (enable in build).
- AI-generated hero + gallery images via `imagegen` (fast tier).

### Routes
- `/` — single-page site
- `/auth` — managed Supabase auth
- `/_authenticated/admin` — admin shell with sub-tabs

### Server functions (`src/lib/*.functions.ts`)
- `getBusinessInfo`, `listServices`, `listStaff` — public (server publishable client, narrow `TO anon` SELECT policies).
- `getBookedSlots({ staffId, date })` — public, returns only `{start, duration}` (no PII).
- `createBooking(input)` — public, zod-validated, inserts with status `pending`.
- `listBookings`, `updateBookingStatus`, `upsertService`, `deleteService`, `upsertStaff`, `updateBusinessInfo` — `requireSupabaseAuth` + admin role check.

### Database schema (migration)

```sql
create type app_role as enum ('admin');

create table public.business_info (
  id uuid primary key default gen_random_uuid(),
  name text, tagline text, phone text, whatsapp text,
  address text, maps_embed_url text, instagram_url text,
  hours text, hero_image_url text,
  color_primary text, color_accent text, color_bg text,
  updated_at timestamptz default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null, category text not null,
  description text, price_from int, duration_min int default 60,
  icon text, sort_order int default 0, active boolean default true
);

create table public.staff (
  id uuid primary key default gen_random_uuid(),
  name text not null, active boolean default true
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null, phone text not null,
  service_id uuid references services(id),
  service_name text not null,
  staff_id uuid references staff(id),
  booking_date date not null, booking_time time not null,
  duration_min int not null default 60,
  notes text,
  status text not null default 'pending'
    check (status in ('pending','confirmed','cancelled','completed')),
  created_at timestamptz default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null, unique(user_id, role)
);
```

RLS:
- `business_info`, `services`, `staff`: `SELECT TO anon, authenticated` (active=true for services); writes via admin server fns only (service role).
- `bookings`: `INSERT TO anon` allowed; `SELECT/UPDATE` only via `has_role(auth.uid(),'admin')`.
- `getBookedSlots` runs server-side with publishable client and projects only `booking_time, duration_min` filtered by date+staff.

Grants included per Lovable convention. Seed migration inserts business_info row, services (12 items with placeholder prices), and one staff "Priti".

### Admin bootstrap
The first signed-in user can claim admin via a one-time server fn `claimFirstAdmin` (only succeeds if `user_roles` is empty). Documented in-app on `/admin` when no admin exists.

### Images
Generate with `imagegen` (fast): 1 hero (1920×1024), 6 gallery (1024×1024) — Indian bridal makeup, salon interior, hair styling, skincare facial, eye makeup closeup, party look. Stored under `src/assets/`.

### Files to create
- `src/routes/index.tsx` (sections composed from components)
- `src/components/site/{Hero,About,Services,Gallery,Booking,Reviews,Contact,Footer,MobileBar}.tsx`
- `src/components/admin/{BookingsTable,ServicesEditor,StaffEditor,BusinessInfoEditor}.tsx`
- `src/routes/_authenticated/admin.tsx`
- `src/lib/{business,services,staff,bookings,admin}.functions.ts`
- `src/hooks/useBusinessInfo.ts`, `src/hooks/useServices.ts`
- Supabase migration with schema + RLS + grants + seed.

## Out of scope (future)
- WhatsApp/SMS auto-notifications
- Payments / deposits
- Multi-language
- Per-service staff assignment matrix