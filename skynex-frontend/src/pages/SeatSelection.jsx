import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import '../css/SeatSelection.css'

// Generates a seat map: rows 1-20, cols A B C _ D E F
// Some seats marked as taken randomly (in real app, fetch from API)
function generateSeats(totalSeats) {
  const cols = ['A', 'B', 'C', 'D', 'E', 'F']
  const rows = 20
  const seats = []
  let takenCount = 0
  const maxTaken = Math.floor((rows * 6) - totalSeats)

  for (let r = 1; r <= rows; r++) {
    for (let c of cols) {
      const id = `${r}${c}`
      // simple deterministic "taken" logic using seat id hash
      const hash = (r * 7 + c.charCodeAt(0) * 13) % 100
      const taken = takenCount < maxTaken && hash < 45
      if (taken) takenCount++
      seats.push({ id, row: r, col: c, taken })
    }
  }
  return seats
}

export default function SeatSelection() {
  const location = useLocation()
  const navigate = useNavigate()
  const flight = location.state?.flight

  const [seats] = useState(() => generateSeats(flight?.availableSeats || 100))
  const [selected, setSelected] = useState([])

  if (!flight) {
    navigate('/flights')
    return null
  }

  const toggleSeat = (seat) => {
    if (seat.taken) return
    if (selected.includes(seat.id)) {
      setSelected(selected.filter((s) => s !== seat.id))
    } else {
      if (selected.length >= 6) return // max 6 seats at once
      setSelected([...selected, seat.id])
    }
  }

  const handleProceed = () => {
    if (selected.length === 0) return
    navigate('/booking-confirm', {
      state: { flight, selectedSeats: selected },
    })
  }

  const rows = [...new Set(seats.map((s) => s.row))]
  const cols = ['A', 'B', 'C', 'D', 'E', 'F']

  return (
    <div className="seat-page">
      <Navbar />
      <div className="seat-container">
        <div className="seat-header">
          <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
          <div>
            <h1>Select Seats</h1>
            <p>
              <strong>{flight.flightNumber}</strong> · {flight.origin} → {flight.destination} ·{' '}
              {new Date(flight.departureDate).toLocaleDateString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="seat-layout">
          {/* Legend */}
          <div className="seat-legend">
            <div className="legend-item"><div className="legend-box available" /> Available</div>
            <div className="legend-item"><div className="legend-box taken" /> Taken</div>
            <div className="legend-item"><div className="legend-box seat-sel" /> Selected</div>
          </div>

          {/* Plane nose */}
          <div className="plane-nose">✈ Front of plane</div>

          {/* Column headers */}
          <div className="col-headers">
            <span className="row-num-gap" />
            {cols.map((c, i) => (
              <>
                {i === 3 && <span key="aisle" className="aisle-label">Aisle</span>}
                <span key={c} className="col-label">{c}</span>
              </>
            ))}
          </div>

          {/* Seat rows */}
          <div className="seat-rows">
            {rows.map((row) => {
              const rowSeats = seats.filter((s) => s.row === row)
              return (
                <div key={row} className="seat-row">
                  <span className="row-num">{row}</span>
                  {cols.map((col, i) => {
                    const seat = rowSeats.find((s) => s.col === col)
                    const isSelected = selected.includes(seat?.id)
                    return (
                      <>
                        {i === 3 && <span key={`aisle-${row}`} className="aisle-gap" />}
                        <button
                          key={seat?.id}
                          className={`seat-btn ${seat?.taken ? 'seat-taken' : isSelected ? 'seat-selected' : 'seat-free'}`}
                          onClick={() => toggleSeat(seat)}
                          disabled={seat?.taken}
                          title={seat?.id}
                        >
                          {isSelected ? '✓' : ''}
                        </button>
                      </>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom panel */}
        <div className="seat-summary">
          <div className="summary-info">
            {selected.length === 0 ? (
              <p>No seats selected yet. Click a seat to select.</p>
            ) : (
              <>
                <p>Selected: <strong>{selected.join(', ')}</strong></p>
                <p>Total: <strong>₹{(flight.price * selected.length).toLocaleString('en-IN')}</strong>
                  <small> ({selected.length} × ₹{flight.price?.toLocaleString('en-IN')})</small>
                </p>
              </>
            )}
          </div>
          <button
            className="btn-proceed"
            disabled={selected.length === 0}
            onClick={handleProceed}
          >
            Proceed to Book →
          </button>
        </div>
      </div>
    </div>
  )
}
