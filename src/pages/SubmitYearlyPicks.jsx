import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function SubmitYearlyPicks() {
  const [champion, setChampion] = useState('')
  const [conferenceWinner, setConferenceWinner] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      setMessage('Please log in to submit picks')
      return
    }

    const entries = [
      { prediction_type: 'champion', prediction_value: champion },
      { prediction_type: 'conference_winner', prediction_value: conferenceWinner },
    ]

    for (const entry of entries) {
      if (!entry.prediction_value) continue
      await supabase.from('yearly_picks').upsert({
        user_id: user.id,
        prediction_type: entry.prediction_type,
        prediction_value: entry.prediction_value,
      }, { onConflict: 'user_id,prediction_type' })
    }

    setMessage('Picks submitted!')
  }

  return (
    <div>
      <h2>Yearly Predictions</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            National Champion:
            <input value={champion} onChange={(e) => setChampion(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Conference Winner:
            <input
              value={conferenceWinner}
              onChange={(e) => setConferenceWinner(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Submit Picks</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}
