import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api/authApi';
import homeScreen from '../images/home-screen.png';

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75C21.27 7.61 17 4.5 12 4.5c-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zm4.53 4.53l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
  </svg>
);

const validators = {
  email: v => !v ? 'Email is required' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Enter a valid email address' : '',
  password: v => !v ? 'Password is required' : '',
};

const baseInput = {
  width: '100%', padding: '12px 14px', borderRadius: 10, fontSize: 14,
  color: '#111827', outline: 'none', boxSizing: 'border-box',
  fontFamily: "'Inter', sans-serif", transition: 'border-color 0.2s',
};

const FieldError = ({ msg }) => msg ? (
  <div style={{ fontSize: 12, color: '#EF4444', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
    <svg viewBox="0 0 24 24" fill="#EF4444" width="12" height="12"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
    {msg}
  </div>
) : null;

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [touched, setTouched]   = useState({ email: false, password: false });
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const handleChange = (name, value) => {
    if (name === 'email') setEmail(value);
    else setPassword(value);
    if (touched[name]) setFieldErrors(p => ({ ...p, [name]: validators[name](value) }));
  };

  const handleBlur = (name, value) => {
    setTouched(p => ({ ...p, [name]: true }));
    setFieldErrors(p => ({ ...p, [name]: validators[name](value) }));
  };

  const borderColor = (name) => {
    if (!touched[name]) return '#E5E7EB';
    return fieldErrors[name] ? '#EF4444' : '#10B981';
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const emailErr = validators.email(email);
    const pwdErr   = validators.password(password);
    setTouched({ email: true, password: true });
    setFieldErrors({ email: emailErr, password: pwdErr });
    if (emailErr || pwdErr) return;

    setError('');
    setLoading(true);
    try {
      const res = await loginUser(email, password);
      login(res.data.token);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* Left panel */}
      <div style={{
        flex: '0 0 46%',
        background: 'linear-gradient(150deg, #1d46a0 0%, #142f6e 100%)',
        display: 'flex',
        flexDirection: 'column',
        padding: '40px 44px 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* ── Decorative layer ── */}
        {/* Large circle outline — top right */}
        <div style={{ position:'absolute', width:340, height:340, borderRadius:'50%', border:'1.5px solid rgba(255,255,255,0.1)', top:-90, right:-90 }} />
        {/* Medium circle outline — inside large */}
        <div style={{ position:'absolute', width:190, height:190, borderRadius:'50%', border:'1.5px solid rgba(255,255,255,0.08)', top:20, right:10 }} />
        {/* Small filled orange circle */}
        <div style={{ position:'absolute', width:52, height:52, borderRadius:'50%', backgroundColor:'rgba(244,123,32,0.3)', top:148, right:76 }} />
        {/* Tiny white accent dots near orange circle */}
        <div style={{ position:'absolute', width:10, height:10, borderRadius:'50%', backgroundColor:'rgba(255,255,255,0.22)', top:118, right:58 }} />
        <div style={{ position:'absolute', width:6,  height:6,  borderRadius:'50%', backgroundColor:'rgba(255,255,255,0.15)', top:208, right:46 }} />
        {/* Dotted grid — top right */}
        <svg style={{ position:'absolute', top:16, right:16, opacity:0.18 }} width="90" height="108">
          {[0,1,2,3,4,5].map(row => [0,1,2,3,4].map(col => (
            <circle key={`${row}-${col}`} cx={col*18+9} cy={row*18+9} r="2.5" fill="white" />
          )))}
        </svg>
        {/* Circle outline — left mid */}
        <div style={{ position:'absolute', width:180, height:180, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.07)', top:'42%', left:-60 }} />
        {/* Small orange dot — lower right */}
        <div style={{ position:'absolute', width:12, height:12, borderRadius:'50%', backgroundColor:'rgba(244,123,32,0.55)', bottom:'32%', right:40 }} />
        {/* Cube outline — right mid (matches reference geometric) */}
        <svg style={{ position:'absolute', bottom:'36%', right:28, opacity:0.13 }} width="44" height="50" viewBox="0 0 44 50">
          <polygon points="22,2 42,13 42,37 22,48 2,37 2,13" fill="none" stroke="white" strokeWidth="1.5"/>
          <line x1="22" y1="2"  x2="22" y2="26" stroke="white" strokeWidth="1" opacity="0.6"/>
          <line x1="2"  y1="13" x2="22" y2="26" stroke="white" strokeWidth="1" opacity="0.6"/>
          <line x1="42" y1="13" x2="22" y2="26" stroke="white" strokeWidth="1" opacity="0.6"/>
        </svg>
        {/* Second small dotted grid — lower left */}
        <svg style={{ position:'absolute', bottom:220, left:28, opacity:0.1 }} width="54" height="54">
          {[0,1,2].map(row => [0,1,2].map(col => (
            <circle key={`b${row}-${col}`} cx={col*18+9} cy={row*18+9} r="2" fill="white" />
          )))}
        </svg>

        {/* ── Content ── */}
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:10, zIndex:1, marginBottom:32 }}>
          <div style={{ width:40, height:40, borderRadius:10, backgroundColor:'rgba(255,255,255,0.15)',
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg viewBox="0 0 40 40" fill="none" width="26" height="26">
              <path d="M20 8L6 15l14 7 14-7-14-7z" fill="white" />
              <path d="M13 19v6c0 2.5 3.1 4.5 7 4.5s7-2 7-4.5v-6l-7 3.5-7-3.5z" fill="rgba(255,255,255,0.8)" />
            </svg>
          </div>
          <div style={{ color:'white', fontWeight:700, fontSize:14, letterSpacing:0.4 }}>smart campus</div>
        </div>

        {/* Headline */}
        <h1 style={{ color:'white', fontSize:34, fontWeight:800, lineHeight:1.2,
          margin:'0 0 10px', zIndex:1, maxWidth:310 }}>
          Smart Campus
        </h1>
        <p style={{ color:'rgba(255,255,255,0.62)', fontSize:13.5, margin:'0 0 28px',
          lineHeight:1.6, zIndex:1, maxWidth:290 }}>
          The all-in-one university management platform for students and staff.
        </p>

        {/* Feature bullets */}
        <div style={{ zIndex:1, display:'flex', flexDirection:'column', gap:10 }}>
          {[
            { icon:'🏛️', text:'Book campus rooms & resources' },
            { icon:'🔔', text:'Real-time notifications & email alerts' },
            { icon:'🎫', text:'Raise and track incident tickets' },
          ].map(f => (
            <div key={f.text} style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:28, height:28, borderRadius:7, backgroundColor:'rgba(255,255,255,0.12)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, flexShrink:0 }}>
                {f.icon}
              </div>
              <span style={{ color:'rgba(255,255,255,0.78)', fontSize:13 }}>{f.text}</span>
            </div>
          ))}
        </div>

        {/* Image — pinned to bottom, spans full panel width */}
        <div style={{ flex:1, display:'flex', alignItems:'flex-end',
          marginLeft:-44, marginRight:-44, marginTop:24, zIndex:1 }}>
          <img
            src={homeScreen}
            alt="Smart Campus illustration"
            style={{ width:'100%', display:'block',
              filter:'drop-shadow(0 -4px 24px rgba(0,0,0,0.18))',
              userSelect:'none', pointerEvents:'none' }}
          />
        </div>
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
        }}
      >
        <div style={{ width: '100%', maxWidth: 380 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: '0 0 8px', letterSpacing: -0.3 }}>
            Sign in to Smart Campus
          </h2>
          <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 28px' }}>
            Welcome back! Please enter your details.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => handleChange('email', e.target.value)}
                onBlur={e => handleBlur('email', e.target.value)}
                style={{ ...baseInput, border: `1.5px solid ${borderColor('email')}` }}
              />
              <FieldError msg={touched.email && fieldErrors.email} />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => handleChange('password', e.target.value)}
                  onBlur={e => handleBlur('password', e.target.value)}
                  style={{ ...baseInput, border: `1.5px solid ${borderColor('password')}`, paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPwd(s => !s)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF',
                    padding: 0, display: 'flex', alignItems: 'center' }}>
                  {showPwd ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              <FieldError msg={touched.password && fieldErrors.password} />
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
                width: '100%', padding: '13px 24px',
                backgroundColor: loading ? '#9CA3AF' : '#1B3A72',
                border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600,
                color: 'white', cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s', boxSizing: 'border-box',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#162f5e'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = '#1B3A72'; }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
            <span style={{ fontSize: 12, color: '#9CA3AF', whiteSpace: 'nowrap' }}>or continue with</span>
            <div style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
          </div>

          {/* Google OAuth button */}
          <a
            href="http://localhost:8080/oauth2/authorization/google"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              width: '100%',
              padding: '13px 24px',
              backgroundColor: '#F47B20',
              border: 'none',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              color: 'white',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s',
              boxSizing: 'border-box',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#E06710')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#F47B20')}
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="white" d="M44.5 20H24v8.5h11.8C34.7 33.9 29.8 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 20-8 20-20 0-1.3-.2-2.7-.5-4z" />
            </svg>
            Sign in with Google
          </a>

          {/* Register link */}
          <p style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', margin: '20px 0 0' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#F47B20', fontWeight: 600, textDecoration: 'none' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
