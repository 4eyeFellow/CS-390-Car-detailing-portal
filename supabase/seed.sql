-- Placeholder menu: replace with Carson's real prices. Prices in cents.
insert into public.packages (name, price_cents, duration_minutes) values
  ('Basic Detail', 8000, 90),
  ('Full Detail', 16000, 180),
  ('Premium Detail', 25000, 300);

insert into public.add_ons (name, price_cents, duration_minutes) values
  ('Pet Hair Removal', 3000, 30),
  ('Headlight Restoration', 4000, 45),
  ('Odor Treatment', 3500, 30);

-- 1 = Monday ... 6 = Saturday
insert into public.availability_rules (weekday, start_time, end_time) values
  (1, '08:00', '18:00'), (2, '08:00', '18:00'), (3, '08:00', '18:00'),
  (4, '08:00', '18:00'), (5, '08:00', '18:00'), (6, '09:00', '15:00');
