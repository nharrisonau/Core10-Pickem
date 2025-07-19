import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [leaderboard, setLeaderboard] = useState([])
  const [weekSummary, setWeekSummary] = useState([])
  const currentWeek = 1

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from('scores')
        .select('user_id, week, points, users(username)')

      if (!error) {
        const totals = {}
        data.forEach((row) => {
          const key = row.user_id
          totals[key] = totals[key] || { user_id: key, username: row.users?.username, points: 0 }
          totals[key].points += row.points
        })
        setLeaderboard(Object.values(totals).sort((a, b) => b.points - a.points))
      }
    }

    const fetchWeekSummary = async () => {
      const { data: games } = await supabase
        .from('games')
        .select('*')
        .eq('week', currentWeek)
        .order('kickoff')

      const { data: picks } = await supabase
        .from('picks')
        .select('game_id, selected_team, users(username)')
        .eq('week', currentWeek)

      const summary = (games || []).map((game) => {
        const gamePicks = (picks || []).filter((p) => p.game_id === game.id)
        return {
          ...game,
          picks: gamePicks,
        }
      })
      setWeekSummary(summary)
    }

    fetchLeaderboard()
    fetchWeekSummary()
  }, [])

  return (
    <div>
      <h2>Leaderboard</h2>
      <ul>
        {leaderboard.map((row) => (
          <li key={row.user_id}>
            {row.username || row.user_id}: {row.points} pts
          </li>
        ))}
      </ul>

      <h2>Week {currentWeek} Results</h2>
      {weekSummary.map((game) => (
        <div key={game.id} style={{ marginBottom: '1rem' }}>
          <div>
            <strong>{game.away_team}</strong> @ <strong>{game.home_team}</strong>
            {' '} - Winner: {game.winner || 'TBD'}
          </div>
          <ul>
            {game.picks.map((p, i) => (
              <li key={i}>
                {p.users?.username || p.user_id}: {p.selected_team}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
