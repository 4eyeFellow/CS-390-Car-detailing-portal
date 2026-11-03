# Database Setup (Supabase)

Project ref: `epqkfsdkxstpnfyhbaeb` · Owner: Zeke

## One-time (Zeke)
Run from the repo folder in VS Code's terminal:
```
npx supabase login
npx supabase init
npx supabase link --project-ref epqkfsdkxstpnfyhbaeb
npx supabase db push
```
Then: dashboard → SQL Editor → run `supabase/seed.sql`.

## Every teammate
1. `npm install @supabase/supabase-js`
2. Copy `.env.example` to `.env.local`, paste the publishable key (Project Settings → API Keys).
3. `import { supabase } from '../lib/supabaseClient'`

## Make an admin
Sign up normally, then in the SQL Editor:
```sql
update public.profiles set role = 'admin' where email = 'their@email.com';
```

## Rules
- Never commit `.env.local` or the secret/service_role key.
- Schema changes go in a new file: `npx supabase migration new <name>`, then `db push`.
- Every new table needs RLS, policies and grants.
- Clients book and cancel only through the functions below.
- Free tier pauses after about a week idle; open the dashboard before demos.

## Using it in React
```js
await supabase.from('packages').select('*')
await supabase.rpc('get_busy_times', { p_from, p_to })
await supabase.rpc('book_appointment', {
  p_vehicle_id, p_package_id, p_add_on_ids, p_starts_at,
  p_travel_minutes, p_service_address, p_client_notes
})
await supabase.rpc('cancel_appointment', { p_appointment_id })
```

## Next
- [ ] Real prices from Carson
- [ ] Travel time calculated server-side
- [ ] Email notifications, calendar sync, backups
