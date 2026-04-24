import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../api/authApi';

const DecorativeShape = ({ style }) => (
  <div style={{ position: 'absolute', borderRadius: '50%', opacity: 0.12, ...style }} />
);

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  border: '1.5px solid #E5E7EB',
  borderRadius: 10,
  fontSize: 14,
  color: '#111827',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: "'Inter', sans-serif",
  transition: 'border-color 0.2s',
};

export default function RegisterPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser(name, email, password);
      login(res.data.token);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* Left panel */}
      <div
        style={{
          flex: '0 0 45%',
          backgroundColor: '#1B3A72',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '48px 40px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <DecorativeShape style={{ width: 320, height: 320, background: 'white', top: -60, right: -80 }} />
        <DecorativeShape style={{ width: 200, height: 200, background: 'white', bottom: 40, left: -60 }} />
        <DecorativeShape style={{ width: 120, height: 120, background: '#F47B20', top: '40%', right: -30 }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48, zIndex: 1 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg viewBox="0 0 40 40" fill="none" width="30" height="30">
              <path d="M20 8L6 15l14 7 14-7-14-7z" fill="white" />
              <path d="M13 19v6c0 2.5 3.1 4.5 7 4.5s7-2 7-4.5v-6l-7 3.5-7-3.5z" fill="rgba(255,255,255,0.8)" />
            </svg>
          </div>
          <div style={{ color: 'white' }}>
            <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: 0.5 }}>smart</div>
            <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: 0.5 }}>campus</div>
          </div>
        </div>

        {/* Illustration */}
        <div style={{ zIndex: 1, marginBottom: 40, width: '100%', maxWidth: 320, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%">
            <rect x="80" y="170" width="160" height="18" rx="6" fill="#F47B20" />
            <rect x="90" y="150" width="140" height="22" rx="6" fill="rgba(255,255,255,0.3)" />
            <rect x="100" y="132" width="120" height="20" rx="6" fill="rgba(255,255,255,0.2)" />
            <ellipse cx="160" cy="128" rx="22" ry="22" fill="rgba(255,255,255,0.25)" />
            <circle cx="160" cy="108" r="16" fill="rgba(255,255,255,0.4)" />
            <rect x="130" y="125" width="60" height="36" rx="4" fill="rgba(255,255,255,0.3)" />
            <rect x="133" y="128" width="54" height="26" rx="2" fill="rgba(255,255,255,0.15)" />
            <ellipse cx="60" cy="180" rx="20" ry="30" fill="rgba(255,255,255,0.1)" />
            <ellipse cx="260" cy="185" rx="18" ry="25" fill="rgba(255,255,255,0.1)" />
            <circle cx="245" cy="100" r="4" fill="rgba(255,255,255,0.3)" />
            <circle cx="255" cy="115" r="3" fill="rgba(255,255,255,0.2)" />
            <circle cx="70" cy="110" r="3" fill="rgba(255,255,255,0.3)" />
            <circle cx="236" cy="75" r="12" fill="rgba(244,123,32,0.6)" />
            <path d="M236 67v6M230 69l4 4M242 69l-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <circle cx="75" cy="65" r="18" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
            <rect x="255" y="50" width="22" height="22" rx="3" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
            <line x1="95" y1="150" x2="100" y2="100" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
          </svg>
        </div>

        <h2 style={{ color: 'white', fontSize: 26, fontWeight: 700, lineHeight: 1.3, margin: 0, textAlign: 'center', zIndex: 1, maxWidth: 320 }}>
          Join Smart Campus — Manage your university experience in one place.
        </h2>
      </div>

      {/* Right panel */}
      <div
        style={{
          flex: 1,
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '48px 60px',
          overflowY: 'auto',
        }}
      >
        <div style={{ width: '100%', maxWidth: 380 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: '0 0 8px', letterSpacing: -0.3 }}>
            Create your account
          </h2>
          <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 28px' }}>
            Fill in your details to get started.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Full name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = '#1B3A72')}
                onBlur={e => (e.currentTarget.style.borderColor = '#E5E7EB')}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = '#1B3A72')}
                onBlur={e => (e.currentTarget.style.borderColor = '#E5E7EB')}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = '#1B3A72')}
                onBlur={e => (e.currentTarget.style.borderColor = '#E5E7EB')}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Confirm password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = '#1B3A72')}
                onBlur={e => (e.currentTarget.style.borderColor = '#E5E7EB')}
              />
            </div>

            {error && (
              <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#DC2626', marginBottom: 16 }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px 24px',
                backgroundColor: loading ? '#9CA3AF' : '#F47B20',
                border: 'none',
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
                boxSizing: 'border-box',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#E06710'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = '#F47B20'; }}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', margin: '20px 0 0' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#1B3A72', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
