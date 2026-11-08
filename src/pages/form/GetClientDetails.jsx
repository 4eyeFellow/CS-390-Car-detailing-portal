import { supabase } from '../../lib/supabaseClient'   // '../../lib/...' from pages/form/
import { createClient } from '@supabase/supabase-js'
const { data, error } = await supabase.from('packages').select('*')


//function UpdateDatabase {}


function GetClientDetails({ navigate }) {
  const[full_name, setName] = useState('')
  const[email, setEmail] = useState('')
  const[phone, setPhone] = useState('')
  const[formError, setFormError] = useState(null)
  return (
    <div className="page">
      <h1>Client Details</h1>
      <form onSubmit={handleSubmit}>
      <label>
       Username: <br /><br /><input name="id" type="text" placeholder="Enter username" />
      </label>
      <hr />
      <label>
       Full Name: <br /><br /><input type="text" id="full_name" value="full_name" onChange={(e) => setName(e.target.value)} placeholder="Enter name" />
      </label>
      <hr />
      <label>
      Email Address: <br /><br /><input type="text" id="email" onChange={(e) => setEmail(e.target.value)} placeholder="Enter email address" />
      </label>
      <hr />
      <label>
      Phone Number: <br /><br /><input type="text" id="phone" onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" />
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

const Create = () => {
  const[title, setTitle] = useState('')
  const[method, setMethod] = useState('')
  const[rating, setRating] = useState('')
  const[formError, setFormError] = useState(null)


  return(
    <div className="pagecreate">
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}/>
        <label htmlFor="title">Method:</label>
        <input
          type="text"
          id="method"
          value={method}
          onChange={(e) => setMethod(e.target.value)}/>
        <label htmlFor="title">Rating:</label>
        <input
          type="text"
          id="rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}/>
        <button>Create Smoothie Recipe</button>

        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  )
}
export default Create