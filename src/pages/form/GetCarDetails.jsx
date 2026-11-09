import { useState } from 'react'

const conditions = ['Good', 'Average', 'Bad']

function GetCarDetails({ navigate }) {
  const [condition, setCondition] = useState('')
  const [damageNotes, setDamageNotes] = useState('')
  const [repainted, setRepainted] = useState(false)
  const [error, setError] = useState('')

  function handleConditionChange(event) {
    setCondition(event.target.value)
    setError('')
  }

  function handleContinue() {
    if (!condition) {
      setError('Please select the condition of your car.')
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
        <button onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  )
}

export default GetCarDetails
