function MyProfile({ navigate }) {
  return (
    <div className="page">
      <h1>My Profile</h1>
      <p>Client profile information will go here.</p>
      <button onClick={() => navigate('navigate_to')}>
        Back to Navigation
      </button>
    </div>
  )
}

export default MyProfile