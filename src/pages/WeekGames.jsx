import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function WeekGames() {
  const [games, setGames] = useState([])

  useEffect(() => {
    const fetchGames = async () => {
      const { data, error } = await supabase
        .from('games')
        .select('id, kickoff, home_team, away_team')
        .eq('week', 1)
        .order('kickoff', { ascending: true })

      if (error) {
        console.error('Error fetching games:', error)
      } else {
        setGames(data)
      }
    }

    fetchGames()
  }, [])

  return (
    <div>
      <h2>Week 1 Games</h2>
      <ul>
        {games.map(game => (
          <li key={game.id}>
            <span>{new Date(game.kickoff).toLocaleString()}</span>: 
            <strong>{game.away_team}</strong> @ <strong>{game.home_team}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}
