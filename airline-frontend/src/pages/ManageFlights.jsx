import { useState, useEffect } from 'react'
import { getAllFlights } from '../services/flightService'
import { createFlight, updateFlight, deleteFlight } from '../services/adminService'
import Navbar from '../components/Navbar'
import '../css/ManageFlights.css'

const EMPTY_FORM = {
  flightNumber: '',
  origin: '',
  destination: '',
  departureDate: '',
  departureTime: '',
  price: '',
  availableSeats: '',
  status: 'SCHEDULED',
}

export default function ManageFlights() {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editFlight, setEditFlight] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [deleteId, setDeleteId] = useState(null)

  const fetchFlights = async () => {
    try {
      const res = await getAllFlights()
      setFlights(res.data.data || [])
    } catch {
      console.error('Failed to fetch flights')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFlights()
  }, [])

  const openAdd = () => {
    setEditFlight(null)
    setForm(EMPTY_FORM)
    setError('')
    setShowModal(true)
  }

  const openEdit = (flight) => {
    setEditFlight(flight)
    setForm({
      flightNumber: flight.flightNumber,
      origin: flight.origin,
      destination: flight.destination,
      departureDate: flight.departureDate,
      departureTime: flight.departureTime?.slice(0, 5),
      price: flight.price,
      availableSeats: flight.availableSeats,
      status: flight.status,
    })
    setError('')
    setShowModal(true)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.flightNumber || !form.origin || !form.destination || !form.departureDate || !form.departureTime || !form.price || !form.availableSeats) {
      setError('All fields are required')
      return
    }

    setSubmitting(true)
    try {
      if (editFlight) {
        await updateFlight(editFlight.id, form)
      } else {
        await createFlight(form)
      }
      setShowModal(false)
      fetchFlights()
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this flight? This cannot be undone.')) return
    setDeleteId(id)
    try {
      await deleteFlight(id)
      fetchFlights()
    } catch {
      alert('Failed to delete flight')
    } finally {
      setDeleteId(null)
    }
  }

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <div className="mf-page">
      <Navbar />
      <div className="mf-container">
        <div className="mf-header">
          <div>
            <h1>Manage Flights</h1>
            <p>{flights.length} total flights</p>
          </div>
          <button className="btn-add" onClick={openAdd}>+ Add Flight</button>
        </div>

        {loading ? (
          <div className="table-skeleton" />
        ) : flights.length === 0 ? (
          <div className="no-data">
            <span>✈</span>
            <p>No flights found. Add your first flight.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Flight No.</th>
                  <th>Route</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Seats</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {flights.map((f) => (
                  <tr key={f.id}>
                    <td className="gold-text">{f.flightNumber}</td>
                    <td>{f.origin} → {f.destination}</td>
                    <td>{formatDate(f.departureDate)}</td>
                    <td>{f.departureTime?.slice(0, 5)}</td>
                    <td>{f.availableSeats}</td>
                    <td>₹{f.price?.toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`badge ${f.status === 'SCHEDULED' ? 'badge-green' : f.status === 'CANCELLED' ? 'badge-red' : 'badge-yellow'}`}>
                        {f.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-group">
                        <button className="btn-edit" onClick={() => openEdit(f)}>Edit</button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(f.id)}
                          disabled={deleteId === f.id}
                        >
                          {deleteId === f.id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editFlight ? 'Edit Flight' : 'Add New Flight'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            {error && <div className="alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="flight-form">
              <div className="form-row">
                <div className="field">
                  <label>Flight Number</label>
                  <input name="flightNumber" placeholder="e.g. AI-303" value={form.flightNumber} onChange={handleChange} />
                </div>
                <div className="field">
                  <label>Status</label>
                  <select name="status" value={form.status} onChange={handleChange}>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="DELAYED">Delayed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="field">
                  <label>Origin</label>
                  <input name="origin" placeholder="e.g. Mumbai" value={form.origin} onChange={handleChange} />
                </div>
                <div className="field">
                  <label>Destination</label>
                  <input name="destination" placeholder="e.g. Delhi" value={form.destination} onChange={handleChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="field">
                  <label>Departure Date</label>
                  <input type="date" name="departureDate" value={form.departureDate} onChange={handleChange} />
                </div>
                <div className="field">
                  <label>Departure Time</label>
                  <input type="time" name="departureTime" value={form.departureTime} onChange={handleChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="field">
                  <label>Price (₹)</label>
                  <input type="number" name="price" placeholder="e.g. 4999" value={form.price} onChange={handleChange} />
                </div>
                <div className="field">
                  <label>Available Seats</label>
                  <input type="number" name="availableSeats" placeholder="e.g. 150" value={form.availableSeats} onChange={handleChange} />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel-modal" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save" disabled={submitting}>
                  {submitting ? 'Saving...' : editFlight ? 'Save Changes' : 'Add Flight'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
