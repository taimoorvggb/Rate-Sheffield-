import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import AuthPage from './components/AuthPage'
import Dashboard from './components/Dashboard'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div style={{
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0f1117', color: '#4f8ef7', fontFamily: 'Inter, sans-serif', fontSize: 14,
        flexDirection: 'column', gap: 12
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4f8ef7" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <span style={{ color: '#4a5568', fontSize: 12 }}>Loading RateShield AI…</span>
      </div>
    )
  }

  if (!session) return <AuthPage />
  return <Dashboard session={session} />
}
