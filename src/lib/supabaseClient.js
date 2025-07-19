/*
Supabase schema used by this project:
- users(id, username, email)
- games(id, season, week, home_team, away_team, winner, kickoff)
- picks(id, user_id, game_id, selected_team, week)
- scores(id, user_id, week, correct_picks, total_picks, points)
- yearly_picks(id, user_id, prediction_type, prediction_value)
- game_scores(id, game_id, home_score, away_score, status, updated_at)
*/
import { createClient } from "@supabase/supabase-js"
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
