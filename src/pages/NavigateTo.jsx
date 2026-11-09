

// THIS IS A TEMPORARY PAGE FOR NAVIGATION PURPOSES ONLY.

import { useAuth } from '../lib/useAuth'

function NavigateTo({ navigate }) {
  const { user, profile, signOut } = useAuth()

  return (
    <div className="page">
      <h1>Navigation</h1>
      <p>THIS IS A TEMPORARY PAGE FOR NAVIGATION PURPOSES ONLY.</p>
      <p>
        {user
          ? <>Signed in as <strong>{profile?.full_name || user.email}</strong> ({profile?.role}){' '}
              <button onClick={signOut}>Sign Out</button></>
          : 'Not signed in.'}
      </p>
      <p>Select a page to view.</p>

      <div className="container">
        <button onClick={() => navigate('sign_in')}>
          Sign In
        </button>

        <button onClick={() => navigate('my_profile')}>
          My Profile
        </button>

        <button onClick={() => navigate('admin_dashboard')}>
          Admin Dashboard
        </button>
      </div>

      <h2>Booking Forms</h2>

      <div className="container">
        <button onClick={() => navigate('form_getclientdetails')}>
          Client Details
        </button>

        <button onClick={() => navigate('form_getcardetails')}>
          Car Details
        </button>

        <button onClick={() => navigate('form_selectpackage')}>
          Select Package
        </button>

        <button onClick={() => navigate('form_selectdate')}>
          Select Date
        </button>

        <button onClick={() => navigate('form_reviewsubmit')}>
          Review & Submit
        </button>

        <button onClick={() => navigate('form_confirmation')}>
          Confirmation
        </button>
      </div>
    </div>
  )
}

export default NavigateTo
