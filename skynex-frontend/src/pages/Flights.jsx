import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllFlights } from '../services/flightService'
import Navbar from '../components/Navbar'
import '../css/Flights.css'

const statusColor = {
  SCHEDULED: 'status-green',
  DELAYED: 'status-yellow',
  CANCELLED: 'status-red',
}

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

const formatTime = (t) => {
  const [h, m] = t.split(':')
  const hr = parseInt(h)
  return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`
}

export default function Flights() {
  const navigate = useNavigate()
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [sort, setSort] = useState('price')

  useEffect(() => {
    getAllFlights()
      .then((res) => setFlights(res.data.data))
      .catch(() => setError('Failed to load flights'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = flights
    .filter((f) => filter === 'ALL' || f.status === filter)
    .sort((a, b) => {
      if (sort === 'price') return a.price - b.price
      if (sort === 'date') return new Date(a.departureDate) - new Date(b.departureDate)
      return b.availableSeats - a.availableSeats
    })

  return (
    <div className="flights-page">
      <Navbar />
      <div className="flights-container">
        <div className="flights-top">
          <div>
            <h1>All Flights</h1>
            <p>{loading ? 'Loading...' : `${filtered.length} flights available`}</p>
          </div>
          <div className="flights-controls">
            <div className="control-group">
              <span>Status</span>
              <div className="pills">
                {['ALL', 'SCHEDULED', 'DELAYED', 'CANCELLED'].map((s) => (
                  <button
                    key={s}
                    className={`pill ${filter === s ? 'pill-active' : ''}`}
                    onClick={() => setFilter(s)}
                  >
                    {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
            <div className="control-group">
              <span>Sort</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="sort-select">
                <option value="price">Price</option>
                <option value="date">Date</option>
                <option value="seats">Seats left</option>
              </select>
            </div>
          </div>
        </div>

        {error && <p className="page-error">{error}</p>}

        {loading ? (
          <div className="flight-grid">
            {[1, 2, 3].map((i) => <div key={i} className="skeleton-card" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="no-results">
            <span>🛫</span>
            <p>No flights match your filter</p>
          </div>
        ) : (
          <div className="flight-grid">
            {filtered.map((f) => {
              const sold = f.availableSeats === 0
              const low = !sold && f.availableSeats <= 20
              return (
                <div key={f.id} className={`flight-card ${sold ? 'card-faded' : ''}`}>
                  <div className="card-head">
                    <span className="flight-num">{f.flightNumber}</span>
                    <span className={`status-badge ${statusColor[f.status] || 'status-green'}`}>
                      {f.status}
                    </span>
                  </div>

                  <div className="route-row">
                    <div className="city">
                      <strong>{f.origin}</strong>
                      <span>{formatTime(f.departureTime)}</span>
                    </div>
                    <div className="route-mid">
                      <div className="route-line">
                        <span className="plane-icon">✈</span>
                      </div>
                      <small>{f.duration || '—'}</small>
                    </div>
                    <div className="city right">
                      <strong>{f.destination}</strong>
                      <span>Arrives</span>
                    </div>
                  </div>

                  <div className="card-meta">
                    <span>📅 {formatDate(f.departureDate)}</span>
                    <span className={sold ? 'text-red' : low ? 'text-yellow' : ''}>
                      🪑 {sold ? 'Sold out' : `${f.availableSeats} seats`}
                    </span>
                  </div>

                  <div className="card-footer">
                    <div className="price-block">
                      <small>Per person</small>
                      <strong>₹{f.price?.toLocaleString('en-IN')}</strong>
                    </div>
                    <button
                      className="btn-book"
                      disabled={sold || f.status === 'CANCELLED'}
                      onClick={() => navigate(`/seat-selection/${f.id}`, { state: { flight: f } })}
                    >
                      {sold ? 'Sold Out' : 'Select Seats'}
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
