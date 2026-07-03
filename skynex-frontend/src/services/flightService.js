import api from './api'

export const getAllFlights = () => api.get('/flights')
export const getFlightById = (id) => api.get(`/flights/${id}`)
export const searchFlights = (origin, destination, date) =>
  api.get('/flights/search', { params: { origin, destination, date } })
