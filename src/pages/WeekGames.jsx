import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function WeekGames({ week = 1, user }) {
  const [games, setGames] = useState([])
  const [picks, setPicks] = useState({})
  const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
    const fetchGames = async () => {
        const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('week', week)

        console.log('Games data:', data)
        console.log('Supabase error:', error)

        if (error) console.error('Error fetching games:', error)
        else setGames(data)
    }

    fetchGames()
    }, [week])


  const handlePickChange = (gameId, team) => {
    setPicks(prev => ({
      ...prev,
      [gameId]: team
    }))
  }

  const handleSubmit = async () => {
    if (!user) return
    setSubmitting(true)
    const userId = user.id

    const inserts = Object.entries(picks).map(([gameId, selected_team]) => ({
      user_id: userId,
      game_id: gameId,
      selected_team,
      week
    }))

    const { error } = await supabase.from('picks').insert(inserts)

    if (error) console.error('Error submitting picks:', error)
    else alert('Picks submitted!')

    setSubmitting(false)
  }

  return (
    <div>
      <h2>Week {week} Picks</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
        {games.map(game => (
          <div key={game.id} style={{ marginBottom: '1rem' }}>
            <strong>{game.away_team}</strong> @ <strong>{game.home_team}</strong><br />
            <label>
              <input
                type="radio"
                name={`pick-${game.id}`}
                value={game.away_team}
                onChange={() => handlePickChange(game.id, game.away_team)}
              /> {game.away_team}
            </label>
            <label style={{ marginLeft: '1rem' }}>
              <input
                type="radio"
                name={`pick-${game.id}`}
                value={game.home_team}
                onChange={() => handlePickChange(game.id, game.home_team)}
              /> {game.home_team}
            </label>
          </div>
        ))}
        <button type="submit" disabled={submitting}>Submit Picks</button>
      </form>
    </div>
  )
}

export default WeekGames
