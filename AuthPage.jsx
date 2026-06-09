import { useState } from 'react'
import { supabase } from '../lib/supabase'

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0f1117; --bg2: #161b27; --bg3: #1c2235; --bg4: #212840;
    --border: #2a3350; --border2: #1e2a45;
    --blue: #4f8ef7; --blue2: #3b7de8; --blue-glow: rgba(79,142,247,0.15);
    --green: #22c55e; --red: #ef4444; --red-glow: rgba(239,68,68,0.12);
    --text: #e2e8f0; --text2: #94a3b8; --text3: #4a5568;
  }
  html, body { height: 100%; }
  body { background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; font-size: 14px; }

  .auth-bg {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg);
    background-image:
      radial-gradient(ellipse 80% 50% at 50% -20%, rgba(79,142,247,0.12), transparent),
      radial-gradient(ellipse 60% 40% at 80% 80%, rgba(168,85,247,0.06), transparent);
    padding: 20px;
  }

  .auth-card {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 40px;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.5);
  }

  .auth-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 32px;
    justify-content: center;
  }
  .auth-shield {
    width: 44px; height: 44px;
    background: linear-gradient(135deg, #1a3a6b, #1e4d9b);
    border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid rgba(79,142,247,0.3);
  }
  .auth-logo-text { line-height: 1.1; }
  .auth-logo-name { font-size: 18px; font-weight: 800; letter-spacing: -0.4px; }
  .auth-logo-name span { color: var(--blue); }
  .auth-logo-tag { font-size: 10px; color: var(--text3); letter-spacing: 1.5px; text-transform: uppercase; }

  .auth-title { font-size: 22px; font-weight: 800; color: var(--text); margin-bottom: 6px; letter-spacing: -0.4px; }
  .auth-sub { font-size: 13px; color: var(--text2); margin-bottom: 28px; }

  .auth-form { display: flex; flex-direction: column; gap: 16px; }
  .auth-label { font-size: 10px; font-weight: 700; color: var(--text3); letter-spacing: 0.8px; text-transform: uppercase; display: block; margin-bottom: 6px; }
  .auth-input {
    width: 100%;
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 9px;
    color: var(--text);
    font-size: 13px;
    font-family: 'Inter', sans-serif;
    padding: 11px 14px;
    outline: none;
    transition: border-color 0.15s;
  }
  .auth-input:focus { border-color: var(--blue); }
  .auth-input::placeholder { color: var(--text3); }

  .auth-btn {
    width: 100%;
    background: var(--blue);
    color: #fff;
    border: none;
    border-radius: 9px;
    padding: 12px;
    font-size: 14px;
    font-weight: 700;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
    margin-top: 4px;
  }
  .auth-btn:hover { background: var(--blue2); }
  .auth-btn:active { transform: scale(0.98); }
  .auth-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .auth-divider {
    display: flex; align-items: center; gap: 12px;
    margin: 4px 0;
    font-size: 11px; color: var(--text3);
  }
  .auth-divider::before, .auth-divider::after {
    content: ''; flex: 1; height: 1px; background: var(--border);
  }

  .auth-link {
    text-align: center;
    font-size: 12px;
    color: var(--text2);
    margin-top: 4px;
  }
  .auth-link button {
    background: none; border: none; color: var(--blue); font-weight: 600;
    cursor: pointer; font-size: 12px; font-family: 'Inter', sans-serif;
    padding: 0; text-decoration: underline;
  }
  .auth-link button:hover { color: #fff; }

  .auth-error {
    background: var(--red-glow);
    border: 1px solid rgba(239,68,68,0.3);
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 12px;
    color: #fca5a5;
    display: flex; align-items: flex-start; gap: 8px;
  }

  .auth-success {
    background: rgba(34,197,94,0.08);
    border: 1px solid rgba(34,197,94,0.3);
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 12px;
    color: #86efac;
    text-align: center;
  }

  .auth-name-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
`

export default function AuthPage() {
  const [mode, setMode] = useState('login') // 'login' | 'signup' | 'reset'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [company, setCompany] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const clear = () => { setError(''); setSuccess('') }

  const handleLogin = async (e) => {
    e.preventDefault()
    clear(); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    clear()
    if (!firstName || !lastName || !company) { setError('Please fill in all fields.'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        data: { first_name: firstName, last_name: lastName, company }
      }
    })
    if (error) setError(error.message)
    else setSuccess('Check your email to confirm your account, then log in.')
    setLoading(false)
  }

  const handleReset = async (e) => {
    e.preventDefault()
    clear(); setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/?reset=true',
    })
    if (error) setError(error.message)
    else setSuccess('Password reset link sent! Check your email.')
    setLoading(false)
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="auth-bg">
        <div className="auth-card">
          {/* Logo */}
          <div className="auth-logo">
            <div className="auth-shield">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div className="auth-logo-text">
              <div className="auth-logo-name">RateShield <span>AI</span></div>
              <div className="auth-logo-tag">Freight Profit Protection</div>
            </div>
          </div>

          {mode === 'login' && (
            <>
              <div className="auth-title">Welcome back</div>
              <div className="auth-sub">Sign in to your account to continue</div>
              <form className="auth-form" onSubmit={handleLogin}>
                {error && <div className="auth-error">⚠️ {error}</div>}
                {success && <div className="auth-success">{success}</div>}
                <div>
                  <label className="auth-label">Email</label>
                  <input className="auth-input" type="email" placeholder="you@company.com"
                    value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
                </div>
                <div>
                  <label className="auth-label">Password</label>
                  <input className="auth-input" type="password" placeholder="••••••••"
                    value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button className="auth-btn" type="submit" disabled={loading}>
                  {loading ? 'Signing in…' : 'Sign In →'}
                </button>
                <div className="auth-link">
                  <button type="button" onClick={() => { setMode('reset'); clear() }}>Forgot password?</button>
                </div>
                <div className="auth-divider">or</div>
                <div className="auth-link">
                  Don't have an account?{' '}
                  <button type="button" onClick={() => { setMode('signup'); clear() }}>Create one free</button>
                </div>
              </form>
            </>
          )}

          {mode === 'signup' && (
            <>
              <div className="auth-title">Create your account</div>
              <div className="auth-sub">Start protecting your freight margins today</div>
              <form className="auth-form" onSubmit={handleSignup}>
                {error && <div className="auth-error">⚠️ {error}</div>}
                {success && <div className="auth-success">{success}</div>}
                <div className="auth-name-row">
                  <div>
                    <label className="auth-label">First Name</label>
                    <input className="auth-input" placeholder="John"
                      value={firstName} onChange={e => setFirstName(e.target.value)} required autoFocus />
                  </div>
                  <div>
                    <label className="auth-label">Last Name</label>
                    <input className="auth-input" placeholder="Smith"
                      value={lastName} onChange={e => setLastName(e.target.value)} required />
                  </div>
                </div>
                <div>
                  <label className="auth-label">Company Name</label>
                  <input className="auth-input" placeholder="Apex Logistics"
                    value={company} onChange={e => setCompany(e.target.value)} required />
                </div>
                <div>
                  <label className="auth-label">Email</label>
                  <input className="auth-input" type="email" placeholder="you@company.com"
                    value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div>
                  <label className="auth-label">Password</label>
                  <input className="auth-input" type="password" placeholder="Min 6 characters"
                    value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
                </div>
                <button className="auth-btn" type="submit" disabled={loading}>
                  {loading ? 'Creating account…' : 'Create Account →'}
                </button>
                <div className="auth-divider">or</div>
                <div className="auth-link">
                  Already have an account?{' '}
                  <button type="button" onClick={() => { setMode('login'); clear() }}>Sign in</button>
                </div>
              </form>
            </>
          )}

          {mode === 'reset' && (
            <>
              <div className="auth-title">Reset password</div>
              <div className="auth-sub">We'll send a reset link to your email</div>
              <form className="auth-form" onSubmit={handleReset}>
                {error && <div className="auth-error">⚠️ {error}</div>}
                {success && <div className="auth-success">{success}</div>}
                <div>
                  <label className="auth-label">Email</label>
                  <input className="auth-input" type="email" placeholder="you@company.com"
                    value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
                </div>
                <button className="auth-btn" type="submit" disabled={loading}>
                  {loading ? 'Sending…' : 'Send Reset Link →'}
                </button>
                <div className="auth-link">
                  <button type="button" onClick={() => { setMode('login'); clear() }}>← Back to sign in</button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  )
}
