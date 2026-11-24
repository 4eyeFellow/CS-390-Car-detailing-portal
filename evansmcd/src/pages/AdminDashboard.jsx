import { useState } from 'react'
import { useAuth } from '../lib/useAuth'
import LoyalClients from './admin/LoyalClients'
import ManageEmployees from './admin/ManageEmployees'

// US 14: staff dashboard. App.jsx only shows this page to the owner and employees.
// Add more dashboard sections (schedule, packages, ...) as new components in src/pages/admin/

function AdminDashboard({ navigate }) {
  const { profile, isOwner, signOut } = useAuth()
  const [clientListVersion, setClientListVersion] = useState(0) // bump to reload the client list

  return (
    <div className="page">
      <h1>Admin Dashboard</h1>
      <p>
        Signed in as {profile?.full_name || profile?.email} (<strong>{profile?.role}</strong>)
      </p>

      <LoyalClients key={clientListVersion} />

      {/* Only the owner can add or remove employees */}
      {isOwner && <ManageEmployees onChange={() => setClientListVersion((v) => v + 1)} />}

      <div className="container">
        <button onClick={signOut}>Sign Out</button>{' '}
        <button onClick={() => navigate('navigate_to')}>Back to Navigation</button>
      </div>
    </div>
  )
}

export default AdminDashboard
