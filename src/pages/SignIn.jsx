import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/useAuth'

// US 13: sign up and log in with email + password (Supabase Auth).
// Passwords are hashed and stored by Supabase; we never see or save them.
// New accounts automatically get a 'client' profile (database trigger).

const MIN_PASSWORD_LENGTH = 8

// Turn Supabase error messages into friendlier ones
function friendlyError(message) {
  if (message.includes('Invalid login credentials')) return 'Wrong email or password.'
  if (message.includes('Email not confirmed')) return 'Please confirm your email first. Check your inbox for the link.'
  if (message.includes('already registered')) return 'An account with that email already exists. Try signing in.'
  if (message.toLowerCase().includes('rate limit')) return 'Too many attempts. Please wait a few minutes and try again.'
  return message
}

function SignIn({ navigate }) {
  const { user, profile, isStaff, signOut } = useAuth()

  const [mode, setMode] = useState('sign_in') // 'sign_in' or 'sign_up'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  function switchMode(newMode) {
    setMode(newMode)
    setMessage('')
  }

  // After signing in: staff go to the dashboard, clients to their profile
  async function goToHome(userId) {
    const { data } = await supabase.from('profiles').select('role').eq('id', userId).single()
    const staff = data?.role === 'owner' || data?.role === 'employee'
    navigate(staff ? 'admin_dashboard' : 'my_profile')
  }

  async function handleSignIn(event) {
    event.preventDefault()
    if (!email.trim() || !password) {
      setMessage('Please enter your email and password.')
      return
    }

    setBusy(true)
    setMessage('')
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    setBusy(false)

    if (error) {
      setMessage(friendlyError(error.message))
      return
    }
    await goToHome(data.user.id)
  }

  async function handleSignUp(event) {
    event.preventDefault()
    if (!fullName.trim() || !email.trim() || !password) {
      setMessage('Please fill in your name, email and password.')
      return
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setMessage(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
      return
    }
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    setBusy(true)
    setMessage('')
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        // Saved into the new profile by the database trigger
        data: { full_name: fullName.trim(), phone: phone.trim() },
        // Where the confirmation email link sends people back to
        emailRedirectTo: window.location.origin,
      },
    })
    setBusy(false)

    if (error) {
      setMessage(friendlyError(error.message))
      return
    }

    if (data.session) {
      // Email confirmation is off: they're signed in right away
      navigate('my_profile')
    } else {
      setMode('sign_in')
      setPassword('')
      setConfirmPassword('')
      setMessage('Account created! Check your email for a confirmation link, then sign in.')
    }
  }

  // Already signed in
  if (user) {
    return (
      <div className="page">
        <h1>Signed In</h1>
        <p>You are signed in as <strong>{profile?.full_name || user.email}</strong>.</p>
        <div className="container">
          <button onClick={() => navigate(isStaff ? 'admin_dashboard' : 'my_profile')}>
            Continue
          </button>{' '}
          <button onClick={signOut}>Sign Out</button>{' '}
          <button onClick={() => navigate('navigate_to')}>Back to Navigation</button>
        </div>
      </div>
    )
  }

  const signingUp = mode === 'sign_up'

  return (
    <div className="page">
      <h1>{signingUp ? 'Create Account' : 'Sign In'}</h1>

      <form onSubmit={signingUp ? handleSignUp : handleSignIn} style={{ maxWidth: '360px' }}>
        {signingUp && (
          <>
            <label htmlFor="full-name">Full name</label><br />
            <input id="full-name" type="text" autoComplete="name" style={{ width: '100%' }}
              value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <br /><br />

            <label htmlFor="phone">Phone (optional)</label><br />
            <input id="phone" type="tel" autoComplete="tel" style={{ width: '100%' }}
              value={phone} onChange={(e) => setPhone(e.target.value)} />
            <br /><br />
          </>
        )}

        <label htmlFor="email">Email</label><br />
        <input id="email" type="email" autoComplete="email" style={{ width: '100%' }}
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <br /><br />

        <label htmlFor="password">Password</label><br />
        <input id="password" type="password" style={{ width: '100%' }}
          autoComplete={signingUp ? 'new-password' : 'current-password'}
          value={password} onChange={(e) => setPassword(e.target.value)} />
        <br /><br />

        {signingUp && (
          <>
            <label htmlFor="confirm-password">Confirm password</label><br />
            <input id="confirm-password" type="password" autoComplete="new-password" style={{ width: '100%' }}
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <br /><br />
          </>
        )}

        {message && <p role="alert">{message}</p>}

        <button type="submit" disabled={busy}>
          {busy ? 'Please wait...' : signingUp ? 'Create Account' : 'Sign In'}
        </button>
      </form>

      <p>
        {signingUp ? 'Already have an account? ' : 'New here? '}
        <button onClick={() => switchMode(signingUp ? 'sign_in' : 'sign_up')}>
          {signingUp ? 'Sign in instead' : 'Create an account'}
        </button>
      </p>

      <button onClick={() => navigate('navigate_to')}>Back to Navigation</button>
    </div>
  )
}

export default SignIn
