import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

const conditions = ['Good', 'Average', 'Bad']

function GetCarDetails({ navigate }) {
  const [condition, setCondition] = useState('')
  const [damageNotes, setDamageNotes] = useState('')
  const [repainted, setRepainted] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function handleConditionChange(event) {
    setCondition(event.target.value)
    setError('')
  }

  async function handleContinue() {
    if (!condition) {
      setError('Please select the condition of your car.')
      return
    }

    setSaving(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError('Please sign in to save your car details.')
      setSaving(false)
      return
    }

    const { error: saveError } = await supabase.from('vehicles').insert({
      owner_id: user.id,
      condition,
      damage_notes: damageNotes.trim() || null,
      repainted
    })

    if (saveError) {
      setError('Your car details could not be saved. Please try again.')
      setSaving(false)
      return
    }

    navigate('form_selectpackage')
  }

  return (
    <div className="page">
      <h1>Car Details</h1>

      <h2>Car Condition</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {conditions.map((option) => (
          <label key={option} style={{ cursor: 'pointer' }}>
            {/* Replace with real example photos when we have them */}
            <div
              style={{
                width: '150px',
                height: '100px',
                border: '1px solid black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px'
              }}
            >
              Example photo
            </div>
            <input
              type="radio"
              name="condition"
              value={option}
              checked={condition === option}
              onChange={handleConditionChange}
            />
            {' '}{option}
          </label>
        ))}
      </div>

      <h2>Existing Damage</h2>
      <label htmlFor="damage-notes">Describe any damage to your car (optional)</label>
      <br />
      <textarea
        id="damage-notes"
        rows="4"
        cols="40"
        style={{ maxWidth: '100%' }}
        value={damageNotes}
        onChange={(event) => setDamageNotes(event.target.value)}
      />

      <h2>Paint</h2>
      <label>
        <input
          type="checkbox"
          checked={repainted}
          onChange={(event) => setRepainted(event.target.checked)}
        />
        {' '}This car has been repainted
      </label>

      {error && <p role="alert">{error}</p>}

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button onClick={() => navigate('navigate_to')}>
          Back to Navigation
        </button>
        <button onClick={handleContinue} disabled={saving}>
          {saving ? 'Saving...' : 'Continue'}
        </button>
      </div>
    </div>
  )
}

export default GetCarDetails
