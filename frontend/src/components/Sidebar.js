import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { navItems } from '../navigation';

const SIDEBAR_BG = '#1B3A72';
const SIDEBAR_WIDTH = 220;
const SIDEBAR_COLLAPSED = 68;

const icons = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
    </svg>
  ),
  facilities: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
    </svg>
  ),
  bookings: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
    </svg>
  ),
  incidents: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
    </svg>
  ),
};

const GradCapLogo = () => (
  <svg viewBox="0 0 40 40" fill="none" width="34" height="34">
    <rect width="40" height="40" rx="10" fill="rgba(255,255,255,0.15)" />
    <path d="M20 11L8 17l12 6 12-6-12-6z" fill="white" />
    <path d="M14 20v5c0 2.2 2.7 4 6 4s6-1.8 6-4v-5l-6 3-6-3z" fill="rgba(255,255,255,0.85)" />
    <line x1="32" y1="17" x2="32" y2="24" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <circle cx="32" cy="25" r="1.5" fill="white" />
  </svg>
);

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (item) => {
    if (item.path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname === item.path || location.pathname.startsWith(item.path + '/');
  };

  return (
    <div
      style={{
        width: collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH,
        minWidth: collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH,
        backgroundColor: SIDEBAR_BG,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s ease, min-width 0.25s ease',
        overflow: 'hidden',
        flexShrink: 0,
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Hamburger toggle */}
      <button
        onClick={onToggle}
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.7)',
          cursor: 'pointer',
          padding: '20px 24px 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
      >
        {icons.menu}
      </button>

      {/* Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: collapsed ? '12px 0' : '12px 20px',
          marginBottom: 16,
          justifyContent: collapsed ? 'center' : 'flex-start',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/dashboard')}
      >
        <GradCapLogo />
        {!collapsed && (
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 13, letterSpacing: 0.5 }}>smart</div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 13, letterSpacing: 0.5 }}>campus</div>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, paddingBottom: 16 }}>
        {navItems.map(item => {
          const active = isActive(item);
          return (
            <div
              key={item.id}
              onClick={() => {
                if (item.subItems) {
                  navigate(item.subItems[0].path);
                } else {
                  navigate(item.path);
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: collapsed ? '12px 0' : '12px 16px',
                margin: collapsed ? '3px 8px' : '3px 12px',
                borderRadius: 12,
                cursor: 'pointer',
                backgroundColor: active ? 'rgba(255,255,255,0.18)' : 'transparent',
                color: active ? '#fff' : 'rgba(255,255,255,0.72)',
                borderLeft: active ? '3px solid #F47B20' : '3px solid transparent',
                transition: 'background 0.18s, color 0.18s',
                justifyContent: collapsed ? 'center' : 'flex-start',
                position: 'relative',
                userSelect: 'none',
              }}
              onMouseEnter={e => {
                if (!active) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
              }}
              onMouseLeave={e => {
                if (!active) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span style={{ flexShrink: 0 }}>{icons[item.icon]}</span>
              {!collapsed && (
                <span style={{ fontSize: 14, fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }}>
                  {item.label}
                </span>
              )}
              {item.badge && !collapsed && (
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#EF4444',
                    marginLeft: 'auto',
                    flexShrink: 0,
                  }}
                />
              )}
              {item.badge && collapsed && (
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    backgroundColor: '#EF4444',
                    position: 'absolute',
                    top: 8,
                    right: 8,
                  }}
                />
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
