import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getBookingsByUser, cancelBooking } from '../services/bookingService'
import Navbar from '../components/Navbar'
import '../css/MyBookings.css'

const statusColor = {
  CONFIRMED: 'status-green',
  CANCELLED: 'status-red',
  PENDING: 'status-yellow',
}

export default function MyBookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelling, setCancelling] = useState(null)

  const fetchBookings = async () => {
    try {
      const res = await getBookingsByUser(user.id)
      setBookings(res.data.data)
    } catch {
      setError('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return
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

  return (
    <div className="bookings-page">
      <Navbar />
      <div className="bookings-container">
        <div className="bookings-header">
          <h1>My Bookings</h1>
          <p>All your flight reservations in one place</p>
        </div>

        {error && <p className="page-error">{error}</p>}

        {loading ? (
          <div className="bookings-list">
            {[1, 2].map((i) => <div key={i} className="skeleton-card" />)}
          </div>
        ) : bookings.length === 0 ? (
          <div className="no-bookings">
            <span>🎫</span>
            <h3>No bookings yet</h3>
            <p>When you book a flight, it will appear here.</p>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((b) => (
              <div key={b.id} className="booking-card">
                <div className="booking-top">
                  <div className="booking-ref">
                    <small>Booking Reference</small>
                    <strong>{b.bookingReference}</strong>
                  </div>
                  <span className={`status-badge ${statusColor[b.status] || 'status-green'}`}>
                    {b.status}
                  </span>
                </div>

                <div className="booking-body">
                  <div className="booking-route">
                    <div className="booking-city">
                      <strong>{b.flight?.origin}</strong>
                      <span>{b.flight?.departureTime?.slice(0, 5)}</span>
                    </div>
                    <div className="booking-arrow">
                      <span className="arrow-line" />
                      <span>✈</span>
                    </div>
                    <div className="booking-city right">
                      <strong>{b.flight?.destination}</strong>
                      <span>Arrives</span>
                    </div>
                  </div>

                  <div className="booking-details">
                    <div className="booking-detail">
                      <span>Flight</span>
                      <strong>{b.flight?.flightNumber}</strong>
                    </div>
                    <div className="booking-detail">
                      <span>Date</span>
                      <strong>
                        {new Date(b.flight?.departureDate).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric',
                        })}
                      </strong>
                    </div>
                    <div className="booking-detail">
                      <span>Seats</span>
                      <strong>{b.seatNumbers?.join(', ') || '—'}</strong>
                    </div>
                    <div className="booking-detail">
                      <span>Passengers</span>
                      <strong>{b.numberOfPassengers}</strong>
                    </div>
                    <div className="booking-detail">
                      <span>Total Paid</span>
                      <strong className="price-gold">₹{b.totalPrice?.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>

                {b.status === 'CONFIRMED' && (
                  <div className="booking-actions">
                    <button
                      className="btn-cancel"
                      onClick={() => handleCancel(b.id)}
                      disabled={cancelling === b.id}
                    >
                      {cancelling === b.id ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
