function SelectPackage({ navigate }) {
  return (
    <div className="page">
      <h1>Select Package</h1>
      <p>Package selection will go here.</p>
      <button onClick={() => navigate('navigate_to')}>
        Back to Navigation
      </button>
    </div>
  )
}

export default SelectPackage