import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import NotificationBell from "./components/NotificationBell";

import LoginPage from "./pages/LoginPage";
import OAuthCallback from "./pages/OAuthCallback";
import ResourceList from "./pages/ResourceList";
import UserResourceView from "./pages/UserResourceView";
import BookingManager from "./components/BookingManager";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 24px', backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px', borderRadius: '12px'
        }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <span style={{ fontWeight: '700', fontSize: '16px' }}>🏫 Smart Campus</span>
                {user.role === 'ADMIN' && (
                    <Link to="/admin" style={{ textDecoration: 'none', color: '#0061f2', fontWeight: '500' }}>
                        Admin
                    </Link>
                )}
                <Link to="/user" style={{ textDecoration: 'none', color: '#0061f2', fontWeight: '500' }}>
                    Resources
                </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <NotificationBell />
                <span style={{ fontSize: '14px', color: '#6c757d' }}>{user.email}</span>
                <span style={{
                    padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
                    backgroundColor: user.role === 'ADMIN' ? '#e8f0fe' : '#e6f4ea',
                    color: user.role === 'ADMIN' ? '#1a73e8' : '#1e8e3e'
                }}>
                    {user.role}
                </span>
                <button
                    onClick={handleLogout}
                    style={{
                        padding: '6px 14px', border: '1px solid #e0e0e0', borderRadius: '8px',
                        background: 'white', cursor: 'pointer', fontSize: '13px', color: '#555'
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

function AppRoutes() {
    return (
        <>
            <Navbar />
            <Routes>
                {/* Public */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/oauth2/callback" element={<OAuthCallback />} />

                {/* Admin only */}
                <Route element={<ProtectedRoute role="ADMIN" />}>
                    <Route path="/admin" element={<ResourceList />} />
                </Route>

                {/* Any logged-in user */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/user" element={<><UserResourceView /><BookingManager /></>} />
                </Route>

                {/* Default */}
                <Route path="*" element={<LoginPage />} />
            </Routes>
        </>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="container">
                    <AppRoutes />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
