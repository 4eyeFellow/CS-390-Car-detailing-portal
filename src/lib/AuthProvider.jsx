import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { AuthContext } from './authContext'

// Keeps track of who is logged in and loads their profile (role, name, phone).
// Wraps the whole app in main.jsx, so every page can call useAuth().
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async (user) => {
    if (!user) {
      setProfile(null)
      return
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('id, role, full_name, phone, email')
      .eq('id', user.id)
      .single()
    if (error) console.error('Could not load profile:', error.message)
    // If it fails, treat them as a signed-in user with no special role
    setProfile(data ?? { id: user.id, role: null })
  }, [])

  useEffect(() => {
    let active = true

    // Restore a saved login when the page first loads
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return
      setSession(data.session)
      await loadProfile(data.session?.user)
      if (active) setLoading(false)
    })

    // Update whenever someone signs in or out.
    // setTimeout: Supabase recommends not calling the database inside this callback directly.
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setTimeout(() => loadProfile(newSession?.user), 0)
    })

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [loadProfile])

  const role = profile?.role ?? null

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    role,
    isStaff: role === 'owner' || role === 'employee',
    isOwner: role === 'owner',
    loading,
    refreshProfile: () => loadProfile(session?.user),
    signOut: () => supabase.auth.signOut(),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
