-- Car Detailing Portal: schema, roles, RLS, booking. See docs/DATABASE_SETUP.md

create type public.user_role as enum ('admin', 'client');
create type public.appointment_status as enum ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');

-- Tables
create table public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  role       public.user_role not null default 'client',
  full_name  text,
  phone      text,
  email      text,
  created_at timestamptz not null default now()
);

create table public.packages (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  description      text,
  price_cents      integer not null check (price_cents >= 0),
  duration_minutes integer not null check (duration_minutes > 0),
  is_active        boolean not null default true
);

create table public.add_ons (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  description      text,
  price_cents      integer not null check (price_cents >= 0),
  duration_minutes integer not null check (duration_minutes >= 0),
  is_active        boolean not null default true
);

create table public.vehicles (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null references public.profiles (id) on delete cascade,
  make            text not null,
  model           text not null,
  year            smallint,
  color           text,
  condition_notes text
);

-- weekday: 0 = Sunday ... 6 = Saturday, times in America/Chicago
create table public.availability_rules (
  id         uuid primary key default gen_random_uuid(),
  weekday    smallint not null check (weekday between 0 and 6),
  start_time time not null,
  end_time   time not null check (end_time > start_time)
);

create table public.time_off (
  id        uuid primary key default gen_random_uuid(),
  starts_at timestamptz not null,
  ends_at   timestamptz not null check (ends_at > starts_at),
  reason    text
);

create table public.appointments (
  id                uuid primary key default gen_random_uuid(),
  client_id         uuid not null references public.profiles (id) on delete restrict,
  vehicle_id        uuid not null references public.vehicles (id) on delete restrict,
  package_id        uuid not null references public.packages (id) on delete restrict,
  status            public.appointment_status not null default 'pending',
  blocked_from      timestamptz not null, -- start of travel
  starts_at         timestamptz not null,
  ends_at           timestamptz not null,
  travel_minutes    integer not null default 0,
  service_address   text not null,
  total_price_cents integer not null,
  client_notes      text,
  created_at        timestamptz not null default now(),
  check (blocked_from <= starts_at and starts_at < ends_at),
  constraint no_double_booking exclude using gist (tstzrange(blocked_from, ends_at) with &&)
    where (status in ('pending', 'confirmed'))
);

create table public.appointment_add_ons (
  appointment_id uuid references public.appointments (id) on delete cascade,
  add_on_id      uuid references public.add_ons (id) on delete restrict,
  price_cents    integer not null,
  primary key (appointment_id, add_on_id)
);

create index on public.vehicles (owner_id);
create index on public.appointments (client_id);

-- New signups always get a 'client' profile
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'phone');
  return new;
end; $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- Row Level Security
alter table public.profiles            enable row level security;
alter table public.packages            enable row level security;
alter table public.add_ons             enable row level security;
alter table public.vehicles            enable row level security;
alter table public.availability_rules  enable row level security;
alter table public.time_off            enable row level security;
alter table public.appointments        enable row level security;
alter table public.appointment_add_ons enable row level security;

create policy profiles_read on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());
create policy profiles_update on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());

create policy packages_read on public.packages for select to anon, authenticated
  using (is_active or public.is_admin());
create policy packages_admin on public.packages for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy add_ons_read on public.add_ons for select to anon, authenticated
  using (is_active or public.is_admin());
create policy add_ons_admin on public.add_ons for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy vehicles_own on public.vehicles for all to authenticated
  using (owner_id = auth.uid() or public.is_admin()) with check (owner_id = auth.uid() or public.is_admin());

create policy availability_read on public.availability_rules for select to authenticated using (true);
create policy availability_admin on public.availability_rules for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy time_off_admin on public.time_off for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy appointments_read on public.appointments for select to authenticated
  using (client_id = auth.uid() or public.is_admin());
create policy appointments_admin on public.appointments for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy appointment_add_ons_read on public.appointment_add_ons for select to authenticated
  using (public.is_admin() or exists (
    select 1 from public.appointments a where a.id = appointment_id and a.client_id = auth.uid()));

-- Grants: start from zero, RLS narrows rows. Users can edit name/phone but never role.
revoke all on all tables in schema public from anon, authenticated;
grant select on public.packages, public.add_ons to anon, authenticated;
grant insert, update, delete on public.packages, public.add_ons to authenticated;
grant select on public.profiles to authenticated;
grant update (full_name, phone) on public.profiles to authenticated;
grant select, insert, update, delete on public.vehicles, public.availability_rules, public.time_off to authenticated;
grant select, update on public.appointments to authenticated;
grant select on public.appointment_add_ons to authenticated;

-- Busy windows for the slot picker (times only, no customer info)
create function public.get_busy_times(p_from timestamptz, p_to timestamptz)
returns table (busy_from timestamptz, busy_to timestamptz)
language sql stable security definer set search_path = '' as $$
  select blocked_from, ends_at from public.appointments
  where status in ('pending', 'confirmed') and tstzrange(blocked_from, ends_at) && tstzrange(p_from, p_to)
  union all
  select starts_at, ends_at from public.time_off
  where tstzrange(starts_at, ends_at) && tstzrange(p_from, p_to);
$$;

-- Booking: price and duration are computed here, never trusted from the browser
create function public.book_appointment(
  p_vehicle_id uuid, p_package_id uuid, p_add_on_ids uuid[], p_starts_at timestamptz,
  p_travel_minutes integer, p_service_address text, p_client_notes text default null)
returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
  v_minutes integer; v_price integer;
  v_blocked timestamptz; v_ends timestamptz; v_id uuid;
begin
  if v_uid is null then raise exception 'You must be signed in to book'; end if;
  if not exists (select 1 from public.vehicles where id = p_vehicle_id and owner_id = v_uid) then
    raise exception 'Vehicle not found'; end if;
  if p_starts_at <= now() then raise exception 'Appointment must be in the future'; end if;
  if p_travel_minutes is null or p_travel_minutes not between 0 and 180 then
    raise exception 'Invalid travel time'; end if;
  if coalesce(trim(p_service_address), '') = '' then raise exception 'Service address is required'; end if;

  select duration_minutes, price_cents into v_minutes, v_price
  from public.packages where id = p_package_id and is_active;
  if not found then raise exception 'Package not available'; end if;

  if coalesce(array_length(p_add_on_ids, 1), 0) > 0 then
    if (select count(*) from public.add_ons where id = any (p_add_on_ids) and is_active)
       <> (select count(distinct x) from unnest(p_add_on_ids) x) then
      raise exception 'One or more add-ons are not available'; end if;
    select v_minutes + sum(duration_minutes), v_price + sum(price_cents) into v_minutes, v_price
    from public.add_ons where id = any (p_add_on_ids);
  end if;

  v_blocked := p_starts_at - make_interval(mins => p_travel_minutes);
  v_ends    := p_starts_at + make_interval(mins => v_minutes);

  if not exists (
    select 1 from public.availability_rules r
    where r.weekday = extract(dow from v_blocked at time zone 'America/Chicago')
      and (v_blocked at time zone 'America/Chicago')::date = (v_ends at time zone 'America/Chicago')::date
      and (v_blocked at time zone 'America/Chicago')::time >= r.start_time
      and (v_ends at time zone 'America/Chicago')::time <= r.end_time) then
    raise exception 'That time is outside business hours'; end if;

  if exists (select 1 from public.time_off where tstzrange(starts_at, ends_at) && tstzrange(v_blocked, v_ends)) then
    raise exception 'The owner is unavailable at that time'; end if;

  insert into public.appointments (client_id, vehicle_id, package_id, blocked_from, starts_at, ends_at,
    travel_minutes, service_address, total_price_cents, client_notes)
  values (v_uid, p_vehicle_id, p_package_id, v_blocked, p_starts_at, v_ends,
    p_travel_minutes, trim(p_service_address), v_price, p_client_notes)
  returning id into v_id;

  insert into public.appointment_add_ons (appointment_id, add_on_id, price_cents)
  select v_id, id, price_cents from public.add_ons where id = any (p_add_on_ids);

  return v_id;
exception when exclusion_violation then
  raise exception 'That time slot is no longer available';
end; $$;

-- Cancel: clients only their own and more than 7 days out; admin anything
create function public.cancel_appointment(p_appointment_id uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_appt public.appointments%rowtype;
  v_admin boolean := public.is_admin();
begin
  select * into v_appt from public.appointments where id = p_appointment_id;
  if not found or (v_appt.client_id is distinct from auth.uid() and not v_admin) then
    raise exception 'Appointment not found'; end if;
  if v_appt.status not in ('pending', 'confirmed') then
    raise exception 'This appointment can no longer be cancelled'; end if;
  if not v_admin and v_appt.starts_at < now() + interval '7 days' then
    raise exception 'Appointments can only be cancelled more than 7 days in advance'; end if;
  update public.appointments set status = 'cancelled' where id = p_appointment_id;
end; $$;

revoke execute on function public.get_busy_times, public.book_appointment, public.cancel_appointment from public, anon;
grant execute on function public.get_busy_times, public.book_appointment, public.cancel_appointment to authenticated;
