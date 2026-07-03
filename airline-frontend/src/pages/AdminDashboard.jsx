import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllFlights } from '../services/flightService'
import { getAllBookings, getAllUsers } from '../services/adminService'
import Navbar from '../components/Navbar'
import '../css/AdminDashboard.css'

export default function AdminDashboard() {
  const navigate = useNavigate()

  const [stats, setStats] = useState({
    flights: 0,
    bookings: 0,
    users: 0,
    revenue: 0,
  })
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [flightsRes, bookingsRes, usersRes] = await Promise.all([
          getAllFlights(),
          getAllBookings(),
          getAllUsers(),
        ])

        const flights = flightsRes.data.data || []
        const bookings = bookingsRes.data.data || []
        const users = usersRes.data.data || []

        const revenue = bookings
          .filter((b) => b.status === 'CONFIRMED')
          .reduce((sum, b) => sum + (b.totalPrice || 0), 0)

        setStats({
          flights: flights.length,
          bookings: bookings.length,
          users: users.length,
          revenue,
        })

        setRecentBookings(bookings.slice(0, 5))
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const statCards = [
    { label: 'Total Flights', value: stats.flights, icon: '✈', path: '/admin/flights' },
    { label: 'Total Bookings', value: stats.bookings, icon: '🎫', path: '/admin/bookings' },
    { label: 'Registered Users', value: stats.users, icon: '👤', path: '/admin/users' },
    { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}`, icon: '💰', path: null },
  ]

  return (
    <div className="admin-page">
      <Navbar />
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Manage your airline operations from here</p>
        </div>

        {loading ? (
          <div className="dash-grid">
            {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton-stat" />)}
          </div>
        ) : (
          <>
            <div className="dash-grid">
              {statCards.map((card) => (
                <div
                  key={card.label}
                  className={`stat-card ${card.path ? 'clickable' : ''}`}
                  onClick={() => card.path && navigate(card.path)}
                >
                  <div className="stat-icon">{card.icon}</div>
                  <div className="stat-info">
                    <span className="stat-value">{card.value}</span>
                    <span className="stat-label">{card.label}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="dash-actions">
              <h2>Quick Actions</h2>
              <div className="action-buttons">
                <button onClick={() => navigate('/admin/flights')} className="action-btn">
                  ✈ Manage Flights
                </button>
                <button onClick={() => navigate('/admin/bookings')} className="action-btn">
                  🎫 Manage Bookings
                </button>
                <button onClick={() => navigate('/admin/users')} className="action-btn action-btn-outline">
                  👤 View Users
                </button>
              </div>
            </div>

            <div className="recent-section">
              <h2>Recent Bookings</h2>
              {recentBookings.length === 0 ? (
                <p className="empty-text">No bookings yet</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Flight</th>
                      <th>Route</th>
                      <th>Passengers</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((b) => (
                      <tr key={b.id}>
                        <td className="ref-col">{b.bookingReference}</td>
                        <td>{b.flight?.flightNumber}</td>
                        <td>{b.flight?.origin} → {b.flight?.destination}</td>
                        <td>{b.numberOfPassengers}</td>
                        <td>₹{b.totalPrice?.toLocaleString('en-IN')}</td>
                        <td>
                          <span className={`badge ${b.status === 'CONFIRMED' ? 'badge-green' : b.status === 'CANCELLED' ? 'badge-red' : 'badge-yellow'}`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
