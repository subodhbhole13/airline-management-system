import { useState, useEffect } from 'react'
import { getAllBookings } from '../services/adminService'
import { cancelBooking } from '../services/bookingService'
import Navbar from '../components/Navbar'
import '../css/ManageBookings.css'

export default function ManageBookings() {
  const [bookings, setBookings] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [cancelling, setCancelling] = useState(null)

  const fetchBookings = async () => {
    try {
      const res = await getAllBookings()
      const data = res.data.data || []
      setBookings(data)
      setFiltered(data)
    } catch {
      console.error('Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    let result = bookings

    if (statusFilter !== 'ALL') {
      result = result.filter((b) => b.status === statusFilter)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (b) =>
          b.bookingReference?.toLowerCase().includes(q) ||
          b.flight?.flightNumber?.toLowerCase().includes(q) ||
          b.flight?.origin?.toLowerCase().includes(q) ||
          b.flight?.destination?.toLowerCase().includes(q)
      )
    }

    setFiltered(result)
  }, [search, statusFilter, bookings])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return
    setCancelling(id)
    try {
      await cancelBooking(id)
      fetchBookings()
    } catch {
      alert('Failed to cancel booking')
    } finally {
      setCancelling(null)
    }
  }

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

  return (
    <div className="mb-page">
      <Navbar />
      <div className="mb-container">
        <div className="mb-header">
          <div>
            <h1>Manage Bookings</h1>
            <p>{filtered.length} booking{filtered.length !== 1 ? 's' : ''} shown</p>
          </div>
        </div>

        <div className="mb-filters">
          <input
            type="text"
            placeholder="Search by reference, flight, or route..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <div className="pills">
            {['ALL', 'CONFIRMED', 'CANCELLED', 'PENDING'].map((s) => (
              <button
                key={s}
                className={`pill ${statusFilter === s ? 'pill-active' : ''}`}
                onClick={() => setStatusFilter(s)}
              >
                {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="table-skeleton" />
        ) : filtered.length === 0 ? (
          <div className="no-data">
            <span>🎫</span>
            <p>No bookings found</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Flight</th>
                  <th>Route</th>
                  <th>Travel Date</th>
                  <th>Seats</th>
                  <th>Passengers</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id}>
                    <td className="ref-col">{b.bookingReference}</td>
                    <td>{b.flight?.flightNumber}</td>
                    <td>{b.flight?.origin} → {b.flight?.destination}</td>
                    <td>{formatDate(b.flight?.departureDate)}</td>
                    <td>{b.seatNumbers?.join(', ') || '—'}</td>
                    <td>{b.numberOfPassengers}</td>
                    <td>₹{b.totalPrice?.toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`badge ${b.status === 'CONFIRMED' ? 'badge-green' : b.status === 'CANCELLED' ? 'badge-red' : 'badge-yellow'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      {b.status === 'CONFIRMED' ? (
                        <button
                          className="btn-cancel"
                          onClick={() => handleCancel(b.id)}
                          disabled={cancelling === b.id}
                        >
                          {cancelling === b.id ? '...' : 'Cancel'}
                        </button>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
