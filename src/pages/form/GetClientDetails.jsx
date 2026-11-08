import { supabase } from '../../lib/supabaseClient'   // '../../lib/...' from pages/form/
import { createClient } from '@supabase/supabase-js'
const { data, error } = await supabase.from('packages').select('*')


//function UpdateDatabase {}

function GetClientDetails({ navigate }) {
  return (
    <div className="page">
      <h1>Client Details</h1>
      <form onSubmit={handleSubmit}>
      <label>
       Username: <br /><br /><input name="id" type="text" placeholder="Enter username" />
      </label>
      <hr />
      <label>
       Full Name: <br /><br /><input name="full_name" type="text" placeholder="Enter name" />
      </label>
      <hr />
      <label>
      Email Address: <br /><br /><input name="email" type="text" placeholder="Enter email address" />
      </label>
      <hr />
      <label>
      Phone Number: <br /><br /><input type="text" placeholder="Enter phone number" />
      </label>
      <hr />
      <button type="submit">Submit</button>
      </form>
      
      <p>Client information form will go here.</p>
      <button onClick={() => navigate('navigate_to')}>
        Back to Navigation
      </button>
    </div>
  )
}

export default GetClientDetails