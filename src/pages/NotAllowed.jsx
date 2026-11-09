// Shown when a signed-in client tries to open a staff-only page (US 14).
function NotAllowed({ navigate }) {
  return (
    <div className="page">
      <h1>Staff Only</h1>
      <p>This page is only for the business owner and employees.</p>
      <button onClick={() => navigate('my_profile')}>Go to My Profile</button>{' '}
      <button onClick={() => navigate('navigate_to')}>Back to Navigation</button>
    </div>
  )
}

export default NotAllowed
