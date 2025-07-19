import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function Auth({ onAuth }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  const ensureUserRow = async (user) => {
    const { data } = await supabase.from('users').select('id').eq('id', user.id).single()
    if (!data) {
      await supabase.from('users').insert({ id: user.id, email: user.email, username })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    if (isSignUp) {
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
      if (signUpError) {
        setError(signUpError.message)
      } else {
        const user = data.user
        if (user) {
          await supabase.from('users').insert({ id: user.id, email, username })
          onAuth(user)
        }
      }
    } else {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) {
        setError(signInError.message)
      } else {
        const user = data.user
        if (user) {
          await ensureUserRow(user)
          onAuth(user)
        }
      }
    }
    setLoading(false)
  }

  return (
    <div>
      <h2>{isSignUp ? 'Sign Up' : 'Log In'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {isSignUp && (
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}
        <button type="submit" disabled={loading}>
          {isSignUp ? 'Sign Up' : 'Log In'}
        </button>
      </form>
      <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? 'Have an account? Log In' : 'Need an account? Sign Up'}
      </button>
    </div>
  )
}

export default Auth
