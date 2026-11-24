import { useContext } from 'react'
import { AuthContext } from './authContext'

// Who is logged in, from any page:
//   const { user, profile, isStaff, isOwner, loading, refreshProfile, signOut } = useAuth()
//
//   user     -> Supabase login (user.id, user.email), or null if signed out
//   profile  -> row from the profiles table: { id, role, full_name, phone, email }
//   isStaff  -> owner or employee (can use the admin dashboard)
//   isOwner  -> owner only (can manage employees, packages, hours)
export function useAuth() {
  const auth = useContext(AuthContext)
  if (!auth) throw new Error('useAuth must be used inside <AuthProvider>')
  return auth
}
