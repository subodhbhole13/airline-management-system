import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchFlights } from '../services/flightService'
import Navbar from '../components/Navbar'
import '../css/Search.css'

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

const formatTime = (t) => {
  const [h, m] = t.split(':')
  const hr = parseInt(h)
  return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`
}

const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata',
  'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Nanded',
  'Goa', 'Kochi', 'Lucknow', 'Surat', 'Dubai',
]

export default function Search() {
  const navigate = useNavigate()
  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({ from: '', to: '', date: '' })
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const swap = () => setForm({ ...form, from: form.to, to: form.from })

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!form.from || !form.to || !form.date) {
      setError('Please fill in all fields')
      return
    }
    if (form.from === form.to) {
      setError('Origin and destination cannot be the same')
      return
    }
    setLoading(true)
    setSearched(false)
    try {
      const res = await searchFlights(form.from, form.to, form.date)
      setResults(res.data.data)
      setSearched(true)
    } catch {
      setError('Search failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="search-page">
      <Navbar />

      <div className="search-hero">
        <h1>Find your flight</h1>
        <p>Search from hundreds of routes across India</p>
      </div>

      <div className="search-container">
        <div className="search-card">
          {error && <div className="alert-error">{error}</div>}

          <form onSubmit={handleSearch} className="search-form">
            <div className="search-fields">
              <div className="field">
                <label>From</label>
                <select name="from" value={form.from} onChange={handleChange}>
                  <option value="" disabled>Select city</option>
                  {CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <button type="button" className="swap-btn" onClick={swap} title="Swap">⇄</button>

              <div className="field">
                <label>To</label>
                <select name="to" value={form.to} onChange={handleChange}>
                  <option value="" disabled>Select city</option>
                  {CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="field">
                <label>Date</label>
                <input type="date" name="date" min={today} value={form.date} onChange={handleChange} />
              </div>

              <button type="submit" className="btn-search" disabled={loading}>
                {loading ? 'Searching...' : '🔍 Search'}
              </button>
            </div>
          </form>
        </div>

        {!searched && !loading && (
          <div className="search-empty">
            <span>🛫</span>
            <p>Enter details above to search for flights</p>
          </div>
        )}

        {searched && results.length === 0 && (
          <div className="search-empty">
            <span>😔</span>
            <p>No flights found for this route and date</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="search-results">
            <h3>{results.length} flight{results.length > 1 ? 's' : ''} found</h3>
            {results.map((f) => {
              const sold = f.availableSeats === 0
              return (
                <div key={f.id} className="result-card">
                  <div className="result-left">
                    <span className="result-num">{f.flightNumber}</span>
                    <div className="result-route">
                      <div>
                        <strong>{f.origin}</strong>
                        <span>{formatTime(f.departureTime)}</span>
                      </div>
                      <div className="result-arrow">→</div>
                      <div>
                        <strong>{f.destination}</strong>
                        <span>Arrives</span>
                      </div>
                    </div>
                    <div className="result-meta">
                      <span>📅 {formatDate(f.departureDate)}</span>
                      <span className={f.availableSeats <= 20 ? 'text-yellow' : ''}>
                        🪑 {sold ? 'Sold out' : `${f.availableSeats} seats left`}
                      </span>
                    </div>
                  </div>
                  <div className="result-right">
                    <div className="result-price">₹{f.price?.toLocaleString('en-IN')}</div>
                    <small>per person</small>
                    <button
                      className="btn-select"
                      disabled={sold || f.status === 'CANCELLED'}
                      onClick={() => navigate(`/seat-selection/${f.id}`, { state: { flight: f } })}
                    >
                      Select Seats
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
