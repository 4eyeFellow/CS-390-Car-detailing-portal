import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/useAuth'
import { formatDateTime, formatPrice } from '../lib/format'

// US 13: a signed-in client's saved info, saved vehicles and appointment history.
// App.jsx only shows this page to signed-in users.
// The database (row level security) only returns this client's own rows.

const CANCEL_DAYS_NOTICE = 7

function vehicleLabel(v) {
  const name = [v.year, v.make, v.model].filter(Boolean).join(' ')
  return name || 'Vehicle'
}

// Loads everything this page shows. The database only returns this client's rows.
async function fetchMyData(userId) {
  const [profileResult, vehicleResult, appointmentResult] = await Promise.all([
    supabase.from('profiles').select('full_name, phone').eq('id', userId).single(),
    supabase.from('vehicles')
      .select('id, make, model, year, color, condition, damage_notes, repainted')
      .eq('owner_id', userId),
    supabase.from('appointments')
      .select('id, status, starts_at, service_address, total_price_cents, packages(name), vehicles(make, model, year)')
      .eq('client_id', userId)
      .order('starts_at', { ascending: false }),
  ])

  if (profileResult.error || vehicleResult.error || appointmentResult.error) {
    return { error: true }
  }

  // Split into upcoming vs. history, and mark which ones can still be cancelled
  const now = Date.now()
  const cancelDeadline = now + CANCEL_DAYS_NOTICE * 24 * 60 * 60 * 1000
  const upcoming = []
  const history = []
  for (const a of appointmentResult.data) {
    const start = new Date(a.starts_at).getTime()
    const active = ['pending', 'confirmed'].includes(a.status)
    if (active && start >= now) {
      upcoming.push({ ...a, cancellable: start > cancelDeadline })
    } else {
      history.push(a)
    }
  }
  upcoming.reverse() // soonest first

  return { profile: profileResult.data, vehicles: vehicleResult.data, upcoming, history }
}

function MyProfile({ navigate }) {
  const { user, refreshProfile, signOut } = useAuth()

  // Saved info form, filled in from the profile when the page loads
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [infoMessage, setInfoMessage] = useState('')

  const [vehicles, setVehicles] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [history, setHistory] = useState([])
  const [loadError, setLoadError] = useState('')
  const [reloadKey, setReloadKey] = useState(0) // bump to reload the data

  useEffect(() => {
    let ignore = false
    fetchMyData(user.id).then((result) => {
      if (ignore) return
      if (result.error) {
        setLoadError('Could not load your saved info. Please refresh the page.')
        return
      }
      setFullName(result.profile.full_name ?? '')
      setPhone(result.profile.phone ?? '')
      setVehicles(result.vehicles)
      setUpcoming(result.upcoming)
      setHistory(result.history)
    })
    return () => { ignore = true }
  }, [user.id, reloadKey])

  async function saveInfo(event) {
    event.preventDefault()
    if (!fullName.trim()) {
      setInfoMessage('Please enter your name.')
      return
    }
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName.trim(), phone: phone.trim() })
      .eq('id', user.id)

    if (error) {
      setInfoMessage('Could not save. Please try again.')
      return
    }
    setInfoMessage('Saved!')
    refreshProfile()
  }

  async function cancelAppointment(id) {
    if (!window.confirm('Cancel this appointment?')) return
    const { error } = await supabase.rpc('cancel_appointment', { p_appointment_id: id })
    if (error) {
      window.alert(error.message)
      return
    }
    setReloadKey((k) => k + 1)
  }

  return (
    <div className="page">
      <h1>My Profile</h1>
      <p>Signed in as {user.email}</p>
      {loadError && <p role="alert">{loadError}</p>}

      <h2>My Info</h2>
      <p>This is filled in for you automatically when you book.</p>
      <form onSubmit={saveInfo} style={{ maxWidth: '360px' }}>
        <label htmlFor="profile-name">Full name</label><br />
        <input id="profile-name" type="text" style={{ width: '100%' }}
          value={fullName} onChange={(e) => { setFullName(e.target.value); setInfoMessage('') }} />
        <br /><br />
        <label htmlFor="profile-phone">Phone</label><br />
        <input id="profile-phone" type="tel" style={{ width: '100%' }}
          value={phone} onChange={(e) => { setPhone(e.target.value); setInfoMessage('') }} />
        <br /><br />
        <button type="submit">Save</button>
        {infoMessage && <span role="status"> {infoMessage}</span>}
      </form>

      <h2>My Vehicles</h2>
      {vehicles.length === 0 ? (
        <p>No saved vehicles yet. They're saved when you book.</p>
      ) : (
        <ul>
          {vehicles.map((v) => (
            <li key={v.id}>
              {vehicleLabel(v)}
              {v.color && `, ${v.color}`}
              {v.condition && ` (condition: ${v.condition})`}
            </li>
          ))}
        </ul>
      )}

      <h2>Upcoming Appointments</h2>
      {upcoming.length === 0 ? (
        <p>No upcoming appointments.</p>
      ) : (
        <ul>
          {upcoming.map((a) => (
            <li key={a.id} style={{ marginBottom: '10px' }}>
              <strong>{formatDateTime(a.starts_at)}</strong>: {a.packages?.name ?? 'Detail'}
              {' '}for {a.vehicles ? vehicleLabel(a.vehicles) : 'your vehicle'}, {formatPrice(a.total_price_cents)} ({a.status})
              <br />
              {a.service_address}
              <br />
              {a.cancellable ? (
                <button onClick={() => cancelAppointment(a.id)}>Cancel</button>
              ) : (
                <small>Can't be cancelled online within {CANCEL_DAYS_NOTICE} days. Please call to change it.</small>
              )}
            </li>
          ))}
        </ul>
      )}

      <h2>Appointment History</h2>
      {history.length === 0 ? (
        <p>No past appointments yet.</p>
      ) : (
        <ul>
          {history.map((a) => (
            <li key={a.id}>
              {formatDateTime(a.starts_at)}: {a.packages?.name ?? 'Detail'}, {formatPrice(a.total_price_cents)} ({a.status})
            </li>
          ))}
        </ul>
      )}

      <div className="container">
        <button onClick={signOut}>Sign Out</button>{' '}
        <button onClick={() => navigate('navigate_to')}>Back to Navigation</button>
      </div>
    </div>
  )
}

export default MyProfile
