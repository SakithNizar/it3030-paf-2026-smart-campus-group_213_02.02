import axios from 'axios';

const BASE = 'http://localhost:8080/api/notifications';

const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const getMyNotifications = () => axios.get(`${BASE}/me`, authHeader());
export const getUnreadCount = () => axios.get(`${BASE}/me/unread-count`, authHeader());
export const markAsRead = (id) => axios.patch(`${BASE}/${id}/read`, {}, authHeader());
export const markAllAsRead = () => axios.patch(`${BASE}/me/read-all`, {}, authHeader());
