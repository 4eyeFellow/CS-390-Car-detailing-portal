-- US 13 + US 14: owner / employee / client roles, employee management,
-- loyal clients view, and the vehicle fields used by the car details form.
-- Apply with: npx supabase db push --linked

-- Roles: 'admin' becomes 'owner', and 'employee' is new.
-- Existing admin accounts become owner automatically.
alter type public.user_role rename value 'admin' to 'owner';
alter type public.user_role add value if not exists 'employee';

-- Role checks. Comparisons use role::text so this file can run in one transaction.
create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles
                 where id = auth.uid() and role::text in ('owner', 'employee'));
$$;

create or replace function public.is_owner() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles
                 where id = auth.uid() and role::text = 'owner');
$$;

-- Existing policies call is_admin(): it now means "owner or employee" (dashboard access).
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select public.is_staff();
$$;

-- Only the owner changes the menu, hours and time off. Employees can still read them.
drop policy packages_admin on public.packages;
create policy packages_owner on public.packages for all to authenticated
  using (public.is_owner()) with check (public.is_owner());

drop policy add_ons_admin on public.add_ons;
create policy add_ons_owner on public.add_ons for all to authenticated
  using (public.is_owner()) with check (public.is_owner());

drop policy availability_admin on public.availability_rules;
create policy availability_owner on public.availability_rules for all to authenticated
  using (public.is_owner()) with check (public.is_owner());

drop policy time_off_admin on public.time_off;
create policy time_off_staff_read on public.time_off for select to authenticated
  using (public.is_staff());
create policy time_off_owner on public.time_off for all to authenticated
  using (public.is_owner()) with check (public.is_owner());

-- Owner adds/removes employees by email. The person must create an account first.
create function public.set_user_role(p_email text, p_role text) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
  v_current text;
begin
  if not public.is_owner() then
    raise exception 'Only the owner can manage employees'; end if;
  if p_role not in ('employee', 'client') then
    raise exception 'Role must be employee or client'; end if;

  select id, role::text into v_id, v_current
  from public.profiles where lower(email) = lower(trim(p_email));
  if not found then
    raise exception 'No account uses that email. Ask them to create an account first.'; end if;
  if v_current = 'owner' then
    raise exception 'The owner account cannot be changed here'; end if;

  update public.profiles set role = p_role::public.user_role where id = v_id;
end; $$;

-- Loyal clients: completed visits and spend per client (staff only).
create function public.get_client_loyalty()
returns table (client_id uuid, full_name text, email text, phone text,
               completed_visits bigint, last_visit timestamptz, total_spent_cents bigint)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_staff() then raise exception 'Not authorized'; end if;
  return query
  select p.id, p.full_name, p.email, p.phone,
         count(a.id) filter (where a.status = 'completed'),
         max(a.starts_at) filter (where a.status = 'completed'),
         coalesce(sum(a.total_price_cents) filter (where a.status = 'completed'), 0)::bigint
  from public.profiles p
  left join public.appointments a on a.client_id = p.id
  where p.role::text = 'client'
  group by p.id
  order by 5 desc, 6 desc nulls last, p.full_name;
end; $$;

revoke execute on function public.set_user_role(text, text), public.get_client_loyalty(),
  public.is_staff(), public.is_owner() from public, anon;
grant execute on function public.set_user_role(text, text), public.get_client_loyalty(),
  public.is_staff(), public.is_owner() to authenticated;

-- Vehicle fields used by the car details form (US 2)
alter table public.vehicles alter column make drop not null;
alter table public.vehicles alter column model drop not null;
alter table public.vehicles rename column condition_notes to damage_notes;
alter table public.vehicles
  add column condition text check (condition in ('Good', 'Average', 'Bad')),
  add column repainted boolean not null default false;
