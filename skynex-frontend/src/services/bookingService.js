import api from './api'

export const bookTicket = (data) => api.post('/bookings', data)
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`)
export const getBookingById = (id) => api.get(`/bookings/${id}`)
export const getBookingsByUser = (userId) => api.get(`/bookings/user/${userId}`)
export const getBookingByReference = (ref) => api.get(`/bookings/reference/${ref}`)
