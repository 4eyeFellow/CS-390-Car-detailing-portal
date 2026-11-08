function GetClientDetails({ navigate }) {
  return (
    <div className="page">
      <h1>Client Details</h1>
      <p>Client information form will go here.</p>
      <button onClick={() => navigate('navigate_to')}>
        Back to Navigation
      </button>
    </div>
  )
}

export default GetClientDetails