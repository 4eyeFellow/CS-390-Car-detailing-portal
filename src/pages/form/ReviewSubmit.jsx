function ReviewSubmit({ navigate }) {
  return (
    <div className="page">
      <h1>Review & Submit</h1>
      <p>Booking review and submission will go here.</p>
      <button onClick={() => navigate('navigate_to')}>
        Back to Navigation
      </button>
    </div>
  )
}

export default ReviewSubmit