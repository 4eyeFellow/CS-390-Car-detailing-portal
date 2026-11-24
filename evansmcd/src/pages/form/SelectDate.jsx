function SelectDate({ navigate }) {
  return (
    <div className="page">
      <h1>Select Date</h1>
      <p>Appointment date selection will go here.</p>
      <button onClick={() => navigate('navigate_to')}>
        Back to Navigation
      </button>
    </div>
  )
}

export default SelectDate