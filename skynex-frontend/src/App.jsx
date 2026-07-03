import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import Login from './pages/Login'
import Register from './pages/Register'
import Flights from './pages/Flights'
import Search from './pages/Search'
import SeatSelection from './pages/SeatSelection'
import BookingConfirm from './pages/BookingConfirm'
import MyBookings from './pages/MyBookings'

import AdminDashboard from './pages/AdminDashboard'
import ManageFlights from './pages/ManageFlights'
import ManageBookings from './pages/ManageBookings'
import ManageUsers from './pages/ManageUsers'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function AdminRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  if (user.role !== 'ADMIN') return <Navigate to="/flights" />
  return children
}

export default function App() {
  return (
    <Routes>
      {/* public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Navigate to="/flights" />} />

      {/* user routes */}
      <Route path="/flights" element={<PrivateRoute><Flights /></PrivateRoute>} />
      <Route path="/search" element={<PrivateRoute><Search /></PrivateRoute>} />
      <Route path="/seat-selection/:flightId" element={<PrivateRoute><SeatSelection /></PrivateRoute>} />
      <Route path="/booking-confirm" element={<PrivateRoute><BookingConfirm /></PrivateRoute>} />
      <Route path="/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />

      {/* admin routes */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/flights" element={<AdminRoute><ManageFlights /></AdminRoute>} />
      <Route path="/admin/bookings" element={<AdminRoute><ManageBookings /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
    </Routes>
  )
}
