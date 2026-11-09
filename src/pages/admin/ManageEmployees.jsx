import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

// US 14: the owner adds or removes employee access.
// The employee creates a normal account first, then the owner adds them by email.
// The database function set_user_role() checks that the caller is the owner.

// onChange: called after someone is added or removed, so the dashboard can refresh
function ManageEmployees({ onChange }) {
  const [staff, setStaff] = useState([])
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const [reloadKey, setReloadKey] = useState(0) // bump to reload the list

  useEffect(() => {
    let ignore = false
    supabase
      .from('profiles')
      .select('id, full_name, email, role')
      .in('role', ['owner', 'employee'])
      .order('role', { ascending: true })
      .then(({ data, error }) => {
        if (ignore) return
        if (error) {
          setMessage('Could not load staff: ' + error.message)
          return
        }
        setStaff(data)
      })
    return () => { ignore = true }
  }, [reloadKey])

  async function setRole(targetEmail, role) {
    const { error } = await supabase.rpc('set_user_role', { p_email: targetEmail, p_role: role })
    if (error) {
      setMessage(error.message)
      return false
    }
    setReloadKey((k) => k + 1)
    onChange?.()
    return true
  }

  async function addEmployee(event) {
    event.preventDefault()
    if (!email.trim()) {
      setMessage('Enter the email they used to create their account.')
      return
    }
    if (await setRole(email.trim(), 'employee')) {
      setMessage(`${email.trim()} now has employee access.`)
      setEmail('')
    }
  }

  async function removeEmployee(person) {
    const name = person.full_name || person.email
    if (!window.confirm(`Remove employee access for ${name}? Their account stays, as a client.`)) return
    if (await setRole(person.email, 'client')) {
      setMessage(`${name} no longer has employee access.`)
    }
  }

  return (
    <section>
      <h2>Employees</h2>
      <p>Employees can view the dashboard and clients. Only the owner can manage employees and prices.</p>

      <ul>
        {staff.map((person) => (
          <li key={person.id} style={{ marginBottom: '6px' }}>
            {person.full_name || '(no name)'} ({person.email}), <strong>{person.role}</strong>
            {person.role === 'employee' && (
              <>{' '}<button onClick={() => removeEmployee(person)}>Remove</button></>
            )}
          </li>
        ))}
      </ul>

      <form onSubmit={addEmployee}>
        <label htmlFor="employee-email">Add an employee by email</label><br />
        <input id="employee-email" type="email" placeholder="employee@example.com"
          value={email} onChange={(e) => { setEmail(e.target.value); setMessage('') }} />
        {' '}<button type="submit">Add Employee</button>
      </form>
      <p><small>They need to create an account on the Sign In page first.</small></p>

      {message && <p role="status">{message}</p>}
    </section>
  )
}

export default ManageEmployees
