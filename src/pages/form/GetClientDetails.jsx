import { supabase } from '../../lib/supabaseClient'
import { useState} from "react"
const { data, error } = await supabase.from('profiles').select('*')


function GetClientDetails({ navigate }) {
  const [fullName, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('client')
  const [formError, setFormError] = useState(null)


  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!fullName || !phone || !email){
      setFormError('Please fill out all fields.')
      return
    }
    if (!(email.includes('@'))){
      setFormError('Please enter valid email address.')
      return
    }
    if ((phone.length != 10 && phone.length != 11) || phone.charAt(0) != (1||2||3||4||5||6||7||8||9||0)){
      setFormError('Please enter valid phone number.')
      return
    }


    const { data, error } = await supabase
      .from('public.profiles')
      .insert([{role: role.toString(), full_name: fullName.toString(), phone: phone.toString(), email: email.toString()}])
      .select('*')

    if (error) {
        console.log(error)
        setFormError('failure!')
        return
    }
    if (data) {
        console.log(data)
        setFormError('Success!')
    }
  }
  return (
    <div className="page">
      <h1>Client Details</h1>
      <form onSubmit={handleSubmit}>
      <p style={{color: 'red'}}>{formError}</p>
      <label>
       Username: <br /><br /><input name="id" type="text" placeholder="Enter username" />
      </label>
      <hr />
      <label>
       Full Name: <br /><br /><input type="text" id="full_name" onChange={(e) => setName(e.target.value)} placeholder="Enter name" />
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
      <br />
      <button onClick={() => navigate('navigate_to')}>
        Back to Navigation
      </button>
    </div>
  )
}

export default GetClientDetails