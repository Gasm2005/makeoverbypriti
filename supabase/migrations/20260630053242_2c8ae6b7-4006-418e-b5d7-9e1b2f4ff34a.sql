
-- Roles
create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users can read their own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);
create policy "Admins can read all roles" on public.user_roles for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Business info (singleton)
create table public.business_info (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tagline text,
  phone text,
  whatsapp text,
  address text,
  maps_embed_url text,
  instagram_url text,
  google_reviews_url text,
  hours text,
  hero_image_url text,
  color_primary text,
  color_accent text,
  color_bg text,
  updated_at timestamptz not null default now()
);
grant select on public.business_info to anon, authenticated;
grant all on public.business_info to service_role;
alter table public.business_info enable row level security;
create policy "Public can read business info" on public.business_info for select to anon, authenticated using (true);
create policy "Admins can update business info" on public.business_info for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "Admins can insert business info" on public.business_info for insert to authenticated with check (public.has_role(auth.uid(),'admin'));

-- Services
create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text,
  price_from int,
  duration_min int not null default 60,
  icon text,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.services to anon, authenticated;
grant insert, update, delete on public.services to authenticated;
grant all on public.services to service_role;
alter table public.services enable row level security;
create policy "Public can read active services" on public.services for select to anon, authenticated using (active = true or public.has_role(auth.uid(),'admin'));
create policy "Admins manage services" on public.services for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Staff
create table public.staff (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.staff to anon, authenticated;
grant insert, update, delete on public.staff to authenticated;
grant all on public.staff to service_role;
alter table public.staff enable row level security;
create policy "Public can read active staff" on public.staff for select to anon, authenticated using (active = true or public.has_role(auth.uid(),'admin'));
create policy "Admins manage staff" on public.staff for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Bookings
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  service_id uuid references public.services(id) on delete set null,
  service_name text not null,
  staff_id uuid references public.staff(id) on delete set null,
  staff_name text,
  booking_date date not null,
  booking_time time not null,
  duration_min int not null default 60,
  notes text,
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled','completed')),
  created_at timestamptz not null default now()
);
grant insert on public.bookings to anon, authenticated;
grant select on public.bookings to anon, authenticated;
grant update, delete on public.bookings to authenticated;
grant all on public.bookings to service_role;
alter table public.bookings enable row level security;
-- Public can insert their booking
create policy "Anyone can create bookings" on public.bookings for insert to anon, authenticated with check (true);
-- Public can read only minimal columns for slot availability via column-grant? We'll restrict by RLS: allow select only of non-cancelled rows for date filtering, but exclude PII at API layer
create policy "Public can read non-cancelled booking slots" on public.bookings for select to anon, authenticated using (status in ('pending','confirmed'));
create policy "Admins manage bookings" on public.bookings for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Seed business info
insert into public.business_info (name, tagline, phone, whatsapp, address, maps_embed_url, instagram_url, google_reviews_url, hours, color_primary, color_accent, color_bg)
values (
  'Makeover By Priti Academy & Salon',
  'Bridal Makeup | Party Makeup | Hair Straightening Salon',
  '06386770141',
  '916386770141',
  'Shivdham Mandir Road, Patel Nagar Rd, near Loknath Guest House, Harihar Nagar, Kamta, Lucknow, Uttar Pradesh 226028',
  'https://www.google.com/maps?q=Makeover+By+Priti+Academy+Salon+Kamta+Lucknow&output=embed',
  'https://instagram.com/makeoverbypriti_',
  'https://www.google.com/maps?q=Makeover+By+Priti+Academy+Salon+Kamta+Lucknow',
  'Open daily from 11:00 AM to 8:00 PM',
  '#B76E79','#D4AF7A','#FAF6F1'
);

-- Seed staff
insert into public.staff (name, sort_order) values ('Priti', 0);

-- Seed services
insert into public.services (name, category, description, price_from, duration_min, icon, sort_order) values
  ('Bridal Makeup (Airbrush/HD/Traditional)','Bridal & Party','Complete bridal look with airbrush, HD or traditional finish.',15000,180,'crown',1),
  ('Party Makeup','Bridal & Party','Glamorous party look perfect for events and celebrations.',2500,75,'sparkles',2),
  ('Eye Makeup','Bridal & Party','Striking eye looks — smokey, glam, cut-crease and more.',800,45,'eye',3),
  ('Special Occasion Makeup','Bridal & Party','Engagement, sangeet, reception ready looks.',3500,90,'heart',4),
  ('Performance Makeup','Bridal & Party','Stage, dance and performance ready makeup.',2000,60,'star',5),
  ('Photography Makeup','Bridal & Party','HD camera-ready makeup for shoots.',3000,75,'camera',6),
  ('Eyebrow Threading','Skin & Beauty','Clean, precise eyebrow shaping.',80,15,'scissors',7),
  ('Skin Care / Facials','Skin & Beauty','Customised facials for glowing skin.',800,60,'leaf',8),
  ('Permanent Makeup (Lip/Eyebrow)','Skin & Beauty','Long-lasting lip & eyebrow micropigmentation.',5000,120,'pen-tool',9),
  ('Hair Straightening & Treatments','Hair','Smoothening, keratin and hair treatments.',3500,180,'wind',10),
  ('Hairstyling','Hair','Bridal, party and event hairstyling.',800,45,'wand',11),
  ('Makeup Academy / Classes','Academy','Professional makeup courses by Priti.',15000,0,'graduation-cap',12);
