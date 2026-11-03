
function AdminDashboard({ navigate }) {
  return (
    <div className="page">
      <h1>Admin Dashboard</h1>
      <p>Admin dashboard content will go here.</p>

      <button onClick={() => navigate('navigate_to')}>
        Back to Navigation
      </button>
    </div>
  )
}

export default AdminDashboard
