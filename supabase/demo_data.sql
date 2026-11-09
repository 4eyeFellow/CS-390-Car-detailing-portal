-- Demo data for development. Create these 3 users first in
-- Authentication -> Users -> Add user (Auto Confirm ON), then run this.
-- Fake people only: 555 phone numbers, example.com emails.

update public.profiles set full_name = 'Demo Client One',   phone = '812-555-0101' where email = 'demo1@example.com';
update public.profiles set full_name = 'Demo Client Two',   phone = '812-555-0102' where email = 'demo2@example.com';
update public.profiles set full_name = 'Demo Client Three', phone = '812-555-0103' where email = 'demo3@example.com';

insert into public.vehicles (owner_id, make, model, year, color, damage_notes)
select p.id, x.make, x.model, x.year, x.color, x.notes
from (values
  ('demo1@example.com', 'Ford',   'F-150',  2019, 'Blue',  'Mud on floor mats'),
  ('demo2@example.com', 'Honda',  'Civic',  2016, 'Silver','Dog hair in back seat'),
  ('demo3@example.com', 'Toyota', 'RAV4',   2021, 'White', 'Light interior dust')
) as x(email, make, model, year, color, notes)
join public.profiles p on p.email = x.email;

-- Times are local (America/Chicago), relative to the current week
insert into public.appointments (client_id, vehicle_id, package_id, status, blocked_from,
  starts_at, ends_at, travel_minutes, service_address, total_price_cents)
select p.id, v.id, pk.id, x.status::public.appointment_status,
  t.starts_at - make_interval(mins => x.travel), t.starts_at,
  t.starts_at + make_interval(mins => pk.duration_minutes),
  x.travel, x.address, pk.price_cents
from (values
  ('demo1@example.com', 'Full Detail',    'confirmed', 8,  '10 hours', 20, '100 Example St, Evansville, IN'),
  ('demo2@example.com', 'Basic Detail',   'pending',   10, '13 hours', 15, '200 Sample Ave, Evansville, IN'),
  ('demo3@example.com', 'Premium Detail', 'completed', -5, '9 hours',  25, '300 Test Rd, Newburgh, IN')
) as x(email, package, status, day_offset, hour_offset, travel, address)
cross join lateral (select ((date_trunc('week', now() at time zone 'America/Chicago')
  + make_interval(days => x.day_offset) + x.hour_offset::interval) at time zone 'America/Chicago') as starts_at) t
join public.profiles p on p.email = x.email
join public.vehicles v on v.owner_id = p.id
join public.packages pk on pk.name = x.package;

select p.full_name, v.make || ' ' || v.model as vehicle, pk.name as package, a.status,
  a.starts_at at time zone 'America/Chicago' as local_start, (a.total_price_cents / 100.0)::numeric(10,2) as price
from public.appointments a
join public.profiles p on p.id = a.client_id
join public.vehicles v on v.id = a.vehicle_id
join public.packages pk on pk.id = a.package_id
order by a.starts_at;
