import api from './api'

// flights
export const createFlight = (data) => api.post('/flights', data)
export const updateFlight = (id, data) => api.put(`/flights/${id}`, data)
export const deleteFlight = (id) => api.delete(`/flights/${id}`)

// bookings
export const getAllBookings = () => api.get('/bookings')

// users
export const getAllUsers = () => api.get('/users')
