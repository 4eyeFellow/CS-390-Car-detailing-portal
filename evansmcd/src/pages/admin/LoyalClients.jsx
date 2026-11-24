import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { formatDateTime, formatPrice } from '../../lib/format'

// US 14: which clients are "loyal", based on their completed appointments.
// Data comes from the get_client_loyalty() database function (staff only).

// A client with this many completed visits counts as loyal
const LOYAL_VISITS = 3

function LoyalClients() {
  const [clients, setClients] = useState([])
  const [loyalOnly, setLoyalOnly] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false
    supabase.rpc('get_client_loyalty').then(({ data, error: loadError }) => {
      if (ignore) return
      if (loadError) {
        setError('Could not load clients: ' + loadError.message)
        return
      }
      setClients(data)
    })
    return () => { ignore = true }
  }, [])

  const shown = loyalOnly ? clients.filter((c) => c.completed_visits >= LOYAL_VISITS) : clients
  const cell = { border: '1px solid black', padding: '6px', textAlign: 'left' }

  return (
    <section>
      <h2>Clients</h2>
      <p>Clients with {LOYAL_VISITS} or more completed visits are marked as loyal.</p>
      <label>
        <input type="checkbox" checked={loyalOnly} onChange={(e) => setLoyalOnly(e.target.checked)} />
        {' '}Show loyal clients only
      </label>

      {error && <p role="alert">{error}</p>}

      {shown.length === 0 ? (
        <p>No clients to show.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr>
                <th style={cell}>Name</th>
                <th style={cell}>Email</th>
                <th style={cell}>Phone</th>
                <th style={cell}>Completed visits</th>
                <th style={cell}>Last visit</th>
                <th style={cell}>Total spent</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((c) => (
                <tr key={c.client_id}>
                  <td style={cell}>
                    {c.full_name || '(no name)'}
                    {c.completed_visits >= LOYAL_VISITS && <strong> ★ Loyal</strong>}
                  </td>
                  <td style={cell}>{c.email}</td>
                  <td style={cell}>{c.phone || '-'}</td>
                  <td style={cell}>{c.completed_visits}</td>
                  <td style={cell}>{formatDateTime(c.last_visit)}</td>
                  <td style={cell}>{formatPrice(c.total_spent_cents)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default LoyalClients
