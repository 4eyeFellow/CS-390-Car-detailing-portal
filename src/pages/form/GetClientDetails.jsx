function GetClientDetails({ navigate }) {
  return (
    <div className="page">
      <h1>Client Details</h1>
      <label>
       First Name: <br /><br /><input type="text" placeholder="Enter first name" />
      </label>
      <hr />
      <label>
       Last Name: <br /><br /><input type="text" placeholder="Enter last name" />
      </label>
      <hr />
      <label>
       Address for detailing: <br /><br /><input type="text" placeholder="Enter detailing address" />
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