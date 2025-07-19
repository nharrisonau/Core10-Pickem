-- SQL schema for the Pick'em app
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY,
    username text NOT NULL,
    email text UNIQUE NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS games (
    id uuid PRIMARY KEY,
    season integer NOT NULL,
    week integer NOT NULL,
    home_team text NOT NULL,
    away_team text NOT NULL,
    winner text,
    kickoff timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS picks (
    id uuid PRIMARY KEY,
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    game_id uuid REFERENCES games(id) ON DELETE CASCADE,
    selected_team text NOT NULL,
    week integer NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS scores (
    id uuid PRIMARY KEY,
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    week integer NOT NULL,
    correct_picks integer DEFAULT 0,
    total_picks integer DEFAULT 0,
    points integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS yearly_picks (
    id uuid PRIMARY KEY,
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    prediction_type text NOT NULL,
    prediction_value text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS game_scores (
    id uuid PRIMARY KEY,
    game_id uuid REFERENCES games(id) ON DELETE CASCADE,
    home_score integer DEFAULT 0,
    away_score integer DEFAULT 0,
    status text DEFAULT 'scheduled',
    updated_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);
