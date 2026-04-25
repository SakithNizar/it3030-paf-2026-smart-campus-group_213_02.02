import axios from 'axios';

const BASE = 'http://localhost:8080/api/bookings';

const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const getAllBookings = () => axios.get(BASE, authHeader());
export const getUserBookings = (userId) => axios.get(`${BASE}/user/${userId}`, authHeader());
export const createBooking = (data) => axios.post(BASE, data, authHeader());
export const updateBookingStatus = (id, status, adminReason = '') =>
    axios.patch(`${BASE}/${id}/status`, { status, adminReason }, authHeader());
