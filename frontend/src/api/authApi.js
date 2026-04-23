import axios from 'axios';

const BASE = 'http://localhost:8080/api/users';

const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const getMe = () => axios.get(`${BASE}/me`, authHeader());
export const getAllUsers = () => axios.get(BASE, authHeader());
export const updateUserRole = (id, role) =>
    axios.patch(`${BASE}/${id}/role`, { role }, authHeader());
