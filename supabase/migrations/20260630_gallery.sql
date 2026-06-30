create table public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  label text not null default '',
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.gallery_images to anon, authenticated;
grant insert, update, delete on public.gallery_images to authenticated;
grant all on public.gallery_images to service_role;
alter table public.gallery_images enable row level security;
create policy "Public can read active gallery images" on public.gallery_images
  for select to anon, authenticated using (active = true or public.has_role(auth.uid(),'admin'));
create policy "Admins manage gallery images" on public.gallery_images for all to authenticated
  using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));

-- Seed with the current photos so the site isn't empty
insert into public.gallery_images (image_url, label, sort_order) values
  ('https://images.unsplash.com/photo-1550005869-5fca7db35ddb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'Glam Makeup', 1),
  ('https://images.unsplash.com/photo-1621691536086-e21b2439c73a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'Special Occasion', 2),
  ('https://images.unsplash.com/photo-1633029187262-333e004d4224?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGluZGlhbiUyMEdpcmwlMjBkb2luZyUyMG5haWwlMjBhcnR8ZW58MHx8MHx8fDA%3D', 'Nail Art', 3),
  ('https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YmVhdXR5JTIwcGFybG91cnxlbnwwfHwwfHx8MA%3D%3D', 'At The Salon', 4);
