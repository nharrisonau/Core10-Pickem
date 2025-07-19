import { useEffect, useState } from 'react'
import WeekGames from './pages/WeekGames'
import Auth from './pages/Auth'
import { supabase } from './lib/supabaseClient'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUser(user)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <div className="App">
      <h1>College Football Pick'em</h1>
      {user ? (
        <>
          <button onClick={handleSignOut}>Sign Out</button>
          <WeekGames />
        </>
      ) : (
        <Auth onAuth={setUser} />
      )}
    </div>
  )
}

export default App
