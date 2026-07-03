import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import '../css/Login.css'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      const res = await loginUser(form)
      login(res.data.data)
      navigate('/flights')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <Navbar />
      <div className="login-wrapper">
        <div className="login-left">
          <div className="login-left-content">
            <h2 className="login-brand">✈ SkyNex</h2>
            <h1>Your next<br />adventure<br />starts here</h1>
            <p>Book flights across India instantly. Safe, fast, and always the best price.</p>
            <ul className="login-features">
              <li>Search hundreds of flights in seconds</li>
              <li>Best price guarantee on all routes</li>
              <li>Instant e-ticket sent to your email</li>
              <li>Easy cancellation and rescheduling</li>
            </ul>
          </div>
        </div>

        <div className="login-right">
          <div className="login-card">
            <h2>Welcome back</h2>
            <p className="login-subtitle">Log in to manage your bookings</p>

            {error && <div className="alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="field">
                <label>Email address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>

              <div className="field">
                <label>Password</label>
                <div className="pass-wrap">
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />
                  <button type="button" className="eye-toggle" onClick={() => setShowPass(!showPass)}>
                    {showPass ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Signing in...' : 'Log In'}
              </button>
            </form>

            <p className="login-footer">
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
