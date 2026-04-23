import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate(user.role === 'ADMIN' ? '/admin' : '/user', { replace: true });
        }
    }, [user, navigate]);

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            height: '100vh', backgroundColor: '#f0f4ff'
        }}>
            <div style={{
                backgroundColor: 'white', padding: '48px 40px', borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '400px', width: '100%'
            }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏫</div>
                <h1 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 8px 0', color: '#1a1a1a' }}>
                    Smart Campus Hub
                </h1>
                <p style={{ color: '#6c757d', marginBottom: '32px', fontSize: '15px' }}>
                    Sign in to manage resources and bookings
                </p>

                <a
                    href="http://localhost:8080/oauth2/authorization/google"
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                        padding: '14px 24px', backgroundColor: '#fff', border: '2px solid #e0e0e0',
                        borderRadius: '10px', fontSize: '15px', fontWeight: '600', color: '#333',
                        textDecoration: 'none', cursor: 'pointer', transition: 'border-color 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#4285F4'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#e0e0e0'}
                >
                    <svg width="20" height="20" viewBox="0 0 48 48">
                        <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 33.9 29.8 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 20-8 20-20 0-1.3-.2-2.7-.5-4z"/>
                        <path fill="#34A853" d="M6.3 14.7l7 5.1C15.2 16.1 19.3 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3c-7.7 0-14.3 4.4-17.7 10.7z"/>
                        <path fill="#FBBC05" d="M24 43c5.6 0 10.4-1.9 14.1-5.1l-6.5-5.3C29.6 34.3 26.9 35 24 35c-5.7 0-10.6-3.1-13.2-7.6l-7 5.4C7.5 38.5 15.2 43 24 43z"/>
                        <path fill="#EA4335" d="M44.5 20H24v8.5h11.8c-1 3-3.2 5.5-6.1 7.1l6.5 5.3C40.6 37.5 44 31.2 44 24c0-1.3-.2-2.7-.5-4z"/>
                    </svg>
                    Sign in with Google
                </a>
            </div>
        </div>
    );
}
