function Confirmation({ navigate }) {
  return (
    <div className="page">
      <h1>Confirmation</h1>
      <p>Final booking confirmation/summary will go here after submit.</p>
      <button onClick={() => navigate('navigate_to')}>
        Back to Navigation
      </button>
    </div>
  )
}

export default Confirmation