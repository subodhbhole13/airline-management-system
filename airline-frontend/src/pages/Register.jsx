import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/authService'
import Navbar from '../components/Navbar'
import '../css/Register.css'

export default function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      setError('All fields are required')
      return
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await registerUser({ name: form.name, email: form.email, password: form.password })
      navigate('/login', { state: { registered: true } })
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page">
      <Navbar />
      <div className="register-wrapper">
        <div className="register-card">
          <div className="register-header">
            <span className="register-brand">✈ SkyNex</span>
            <h2>Create your account</h2>
            <p>Join thousands of travelers booking flights every day</p>
          </div>

          {error && <div className="alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="field">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Email address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="field">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
              <div className="field">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirm"
                  placeholder="Repeat password"
                  value={form.confirm}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="register-footer">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
