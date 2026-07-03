import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../css/Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path ? 'active' : ''
  const isAdmin = user?.role === 'ADMIN'

  return (
    <nav className="navbar">
      <Link to={isAdmin ? '/admin' : '/flights'} className="navbar-brand">
        <span className="brand-icon">✈</span>
        <span className="brand-name">SkyNex</span>
        {isAdmin && <span className="admin-tag">Admin</span>}
      </Link>

      {user ? (
        <>
          {isAdmin ? (
            <div className="navbar-links">
              <Link to="/admin" className={isActive('/admin')}>Dashboard</Link>
              <Link to="/admin/flights" className={isActive('/admin/flights')}>Flights</Link>
              <Link to="/admin/bookings" className={isActive('/admin/bookings')}>Bookings</Link>
              <Link to="/admin/users" className={isActive('/admin/users')}>Users</Link>
            </div>
          ) : (
            <div className="navbar-links">
              <Link to="/flights" className={isActive('/flights')}>Flights</Link>
              <Link to="/search" className={isActive('/search')}>Search</Link>
              <Link to="/my-bookings" className={isActive('/my-bookings')}>My Bookings</Link>
            </div>
          )}
          <div className="navbar-user">
            <div className="user-avatar">{user.name?.charAt(0).toUpperCase()}</div>
            <span className="user-name">{user.name}</span>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </div>
        </>
      ) : (
        <div className="navbar-links">
          <Link to="/login" className={isActive('/login')}>Login</Link>
          <Link to="/register" className="btn-register">Sign Up</Link>
        </div>
      )}
    </nav>
  )
}
