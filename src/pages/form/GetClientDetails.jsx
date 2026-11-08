function GetClientDetails({ navigate }) {
  return (
    <div className="page">
      <h1>Client Details</h1>
      <label>
       Full Name: <br /><br /><input type="text" placeholder="Enter  name" />
      </label>
      <hr />
      <label>
      Email Address: <br /><br /><input type="text" placeholder="Enter email address" />
      </label>
      <hr />
      <label>
      Phone Number: <br /><br /><input type="text" placeholder="Enter phone number" />
      </label>
      <hr />
      <p>Client information form will go here.</p>
      <button onClick={() => navigate('navigate_to')}>
        Back to Navigation
      </button>
    </div>
  )
}

export default GetClientDetails