import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function WeeklyPicks() {
  const [games, setGames] = useState([])
  const [picks, setPicks] = useState([])
  const [user, setUser] = useState(null)
  const currentWeek = 1

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))

    const fetchGames = async () => {
      const { data } = await supabase
        .from('games')
        .select('*')
        .eq('week', currentWeek)
        .order('kickoff')
      setGames(data || [])
    }

    const fetchPicks = async () => {
      const { data } = await supabase
        .from('picks')
        .select('*')
        .eq('week', currentWeek)
      setPicks(data || [])
    }

    fetchGames()
    fetchPicks()
  }, [])

  const handlePick = async (gameId, team) => {
    if (!user) return
    const existing = picks.find((p) => p.user_id === user.id && p.game_id === gameId)
    if (existing) {
      await supabase
        .from('picks')
        .update({ selected_team: team })
        .eq('id', existing.id)
    } else {
      await supabase.from('picks').insert({
        user_id: user.id,
        game_id: gameId,
        selected_team: team,
        week: currentWeek,
      })
    }
    const { data } = await supabase
      .from('picks')
      .select('*')
      .eq('week', currentWeek)
    setPicks(data || [])
  }

  const renderGame = (game) => {
    const kickoff = new Date(game.kickoff)
    const kickoffPassed = kickoff <= new Date()
    const userPick = user && picks.find((p) => p.user_id === user.id && p.game_id === game.id)
    const gamePicks = picks.filter((p) => p.game_id === game.id)

    if (kickoffPassed) {
      return (
        <div key={game.id} style={{ marginBottom: '1rem' }}>
          <div>
            <strong>{game.away_team}</strong> @ <strong>{game.home_team}</strong> - Winner: {game.winner || 'TBD'}
          </div>
          <ul>
            {gamePicks.map((p) => (
              <li key={p.id}>
                {p.user_id}: {p.selected_team}
              </li>
            ))}
          </ul>
        </div>
      )
    }

    return (
      <div key={game.id} style={{ marginBottom: '1rem' }}>
        <div>
          <strong>{game.away_team}</strong> @ <strong>{game.home_team}</strong>
        </div>
        {user ? (
          <div>
            <button onClick={() => handlePick(game.id, game.away_team)} disabled={userPick?.selected_team === game.away_team}>
              {game.away_team}
            </button>
            <button onClick={() => handlePick(game.id, game.home_team)} disabled={userPick?.selected_team === game.home_team}>
              {game.home_team}
            </button>
            {userPick && <span> Picked: {userPick.selected_team}</span>}
          </div>
        ) : (
          <div>Please log in to make picks</div>
        )}
      </div>
    )
  }

  return (
    <div>
      <h2>Week {currentWeek} Picks</h2>
      {games.map(renderGame)}
    </div>
  )
}
