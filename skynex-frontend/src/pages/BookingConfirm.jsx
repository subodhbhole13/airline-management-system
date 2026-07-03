import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { bookTicket } from '../services/bookingService'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import '../css/BookingConfirm.css'

export default function BookingConfirm() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  const { flight, selectedSeats } = location.state || {}
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)

  if (!flight || !selectedSeats) {
    navigate('/flights')
    return null
  }

  const totalPrice = flight.price * selectedSeats.length

  const handleConfirm = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await bookTicket({
        userId: user.id,
        flightId: flight.id,
        seatNumbers: selectedSeats,
        seatsBooked: selectedSeats.length,
      })
      setSuccess(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="confirm-page">
        <Navbar />
        <div className="confirm-container">
          <div className="success-card">
            <div className="success-icon">✅</div>
            <h2>Booking Confirmed!</h2>
            <p>Your seats have been booked successfully.</p>

            <div className="ticket">
              <div className="ticket-row">
                <span>Booking Ref</span>
                <strong>{success.bookingReference}</strong>
              </div>
              <div className="ticket-row">
                <span>Flight</span>
                <strong>{flight.flightNumber}</strong>
              </div>
              <div className="ticket-row">
                <span>Route</span>
                <strong>{flight.origin} → {flight.destination}</strong>
              </div>
              <div className="ticket-row">
                <span>Seats</span>
                <strong>{selectedSeats.join(', ')}</strong>
              </div>
              <div className="ticket-row">
                <span>Passengers</span>
                <strong>{selectedSeats.length}</strong>
              </div>
              <div className="ticket-row total-row">
                <span>Total Paid</span>
                <strong>₹{totalPrice.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div className="success-actions">
              <button className="btn-secondary" onClick={() => navigate('/my-bookings')}>
                View My Bookings
              </button>
              <button className="btn-primary" onClick={() => navigate('/flights')}>
                Book Another Flight
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="confirm-page">
      <Navbar />
      <div className="confirm-container">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h1>Confirm Booking</h1>

        {error && <div className="alert-error">{error}</div>}

        <div className="confirm-layout">
          {/* Flight summary */}
          <div className="confirm-card">
            <h3>Flight Details</h3>
            <div className="detail-row">
              <span>Flight</span>
              <strong>{flight.flightNumber}</strong>
            </div>
            <div className="detail-row">
              <span>From</span>
              <strong>{flight.origin}</strong>
            </div>
            <div className="detail-row">
              <span>To</span>
              <strong>{flight.destination}</strong>
            </div>
            <div className="detail-row">
              <span>Date</span>
              <strong>
                {new Date(flight.departureDate).toLocaleDateString('en-IN', {
                  day: '2-digit', month: 'long', year: 'numeric',
                })}
              </strong>
            </div>
            <div className="detail-row">
              <span>Departure</span>
              <strong>{flight.departureTime?.slice(0, 5)}</strong>
            </div>
            <div className="detail-row">
              <span>Status</span>
              <strong className="status-green">{flight.status}</strong>
            </div>
          </div>

          {/* Passenger & seat summary */}
          <div className="confirm-card">
            <h3>Your Selection</h3>
            <div className="detail-row">
              <span>Passenger</span>
              <strong>{user?.name}</strong>
            </div>
            <div className="detail-row">
              <span>Email</span>
              <strong>{user?.email}</strong>
            </div>
            <div className="detail-row">
              <span>Seats Selected</span>
              <strong>{selectedSeats.join(', ')}</strong>
            </div>
            <div className="detail-row">
              <span>Passengers</span>
              <strong>{selectedSeats.length}</strong>
            </div>
            <div className="detail-row">
              <span>Price / seat</span>
              <strong>₹{flight.price?.toLocaleString('en-IN')}</strong>
            </div>
            <div className="detail-row total-row">
              <span>Total Amount</span>
              <strong>₹{totalPrice.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </div>

        <div className="confirm-footer">
          <p className="confirm-note">
            By confirming, you agree that this booking is non-refundable after 24 hours.
          </p>
          <button className="btn-confirm" onClick={handleConfirm} disabled={loading}>
            {loading ? 'Processing...' : `Confirm & Pay ₹${totalPrice.toLocaleString('en-IN')}`}
          </button>
        </div>
      </div>
    </div>
  )
}
