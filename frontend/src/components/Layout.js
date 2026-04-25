import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import NotificationBell from './NotificationBell';
import { navItems, pageConfig } from '../navigation';

function SubMenuPanel({ items, activeSubPath }) {
  const navigate = useNavigate();
  return (
    <div
      style={{
        width: 170,
        minWidth: 170,
        backgroundColor: '#F5F7FA',
        borderRight: '1px solid #E5E7EB',
        paddingTop: 24,
        flexShrink: 0,
      }}
    >
      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: '#9CA3AF',
          letterSpacing: 1,
          textTransform: 'uppercase',
          margin: '0 0 12px 20px',
        }}
      >
        Sub Menu
      </p>
      {items.map(item => {
        const active = activeSubPath === item.path;
        return (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: active ? 600 : 400,
              color: active ? '#1B3A72' : '#4B5563',
              cursor: 'pointer',
              borderLeft: active ? '3px solid #F47B20' : '3px solid transparent',
              backgroundColor: active ? 'rgba(27,58,114,0.06)' : 'transparent',
              transition: 'background 0.15s',
              userSelect: 'none',
            }}
            onMouseEnter={e => {
              if (!active) e.currentTarget.style.backgroundColor = 'rgba(27,58,114,0.04)';
            }}
            onMouseLeave={e => {
              if (!active) e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {item.label}
          </div>
        );
      })}
    </div>
  );
}

function TopBar({ title, breadcrumb }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : 'U';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 28px 16px',
        backgroundColor: '#F5F7FA',
        flexShrink: 0,
      }}
    >
      {/* Left: title + breadcrumb */}
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 700,
            color: '#111827',
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
          {breadcrumb.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <span style={{ color: '#9CA3AF', fontSize: 13 }}>/</span>
              )}
              <span
                style={{
                  fontSize: 13,
                  color: i === breadcrumb.length - 1 ? '#4B5563' : '#1D77E6',
                  fontWeight: i === breadcrumb.length - 1 ? 400 : 500,
                  cursor: i < breadcrumb.length - 1 ? 'pointer' : 'default',
                }}
              >
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Right: bell + avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <NotificationBell />
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', position: 'relative' }}
          onClick={() => setDropdownOpen(o => !o)}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1B3A72 0%, #3B6CB7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 13,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <svg viewBox="0 0 24 24" fill="#6B7280" width="16" height="16">
            <path d="M7 10l5 5 5-5z" />
          </svg>

          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: 10,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                minWidth: 180,
                zIndex: 100,
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.email}
                </div>
                <div
                  style={{
                    display: 'inline-block',
                    marginTop: 4,
                    padding: '2px 8px',
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 700,
                    backgroundColor: '#EEF2FF',
                    color: '#4338CA',
                  }}
                >
                  {user?.role}
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '11px 16px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: 14,
                  color: '#EF4444',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const activeNavItem = navItems.find(
    item =>
      item.subItems &&
      (location.pathname === item.path ||
        location.pathname.startsWith(item.path + '/'))
  );

  const config = pageConfig[location.pathname] || {
    title: 'Smart Campus',
    breadcrumb: ['Smart Campus'],
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#F5F7FA', overflow: 'hidden' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} role={user?.role} />

      {activeNavItem && !collapsed && (
        <SubMenuPanel
          items={activeNavItem.subItems}
          activeSubPath={location.pathname}
        />
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar title={config.title} breadcrumb={config.breadcrumb} />
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0 28px 28px',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
