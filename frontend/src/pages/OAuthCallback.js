import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OAuthCallback() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            login(token);
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                navigate(payload.role === 'ADMIN' ? '/admin' : '/user', { replace: true });
            } catch {
                navigate('/user', { replace: true });
            }
        } else {
            navigate('/login', { replace: true });
        }
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <p style={{ color: '#6c757d', fontSize: '16px' }}>Signing you in...</p>
        </div>
    );
}
