import axios from 'axios';

const USERS_BASE = 'http://localhost:8080/api/users';
const AUTH_BASE = 'http://localhost:8080/api/auth';

const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const getMe = () => axios.get(`${USERS_BASE}/me`, authHeader());
export const getAllUsers = () => axios.get(USERS_BASE, authHeader());
export const updateUserRole = (id, role) =>
    axios.patch(`${USERS_BASE}/${id}/role`, { role }, authHeader());

export const loginUser = (email, password) =>
    axios.post(`${AUTH_BASE}/login`, { email, password });

export const registerUser = (name, email, password) =>
    axios.post(`${AUTH_BASE}/register`, { name, email, password });
