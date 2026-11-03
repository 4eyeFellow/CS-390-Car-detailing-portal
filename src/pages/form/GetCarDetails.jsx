function GetCarDetails({ navigate }) {
  return (
    <div className="page">
      <h1>Car Details</h1>
      <p>Vehicle information form will go here.</p>
      <button onClick={() => navigate('navigate_to')}>
        Back to Navigation
      </button>
    </div>
  )
}

export default GetCarDetails