import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyNotifications, getUnreadCount, markAsRead, markAllAsRead, clearAllNotifications } from '../api/notificationApi';

const TYPE_CONFIG = {
  BOOKING: {
    icon: (
      <svg viewBox="0 0 24 24" fill="#F47B20" width="16" height="16">
        <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
      </svg>
    ),
    bg: '#FFF7ED',
    route: '/bookings',
  },
  INCIDENT: {
    icon: (
      <svg viewBox="0 0 24 24" fill="#EF4444" width="16" height="16">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
    ),
    bg: '#FEF2F2',
    route: '/incidents',
  },
  SYSTEM: {
    icon: (
      <svg viewBox="0 0 24 24" fill="#3B82F6" width="16" height="16">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
      </svg>
    ),
    bg: '#EFF6FF',
    route: null,
  },
};

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)   return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [open, setOpen]                   = useState(false);
  const [tab, setTab]                     = useState('ALL');
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await getUnreadCount();
      setUnreadCount(res.data.count);
    } catch {}
  };

  const handleOpen = async () => {
    if (!open) {
      try {
        const res = await getMyNotifications();
        setNotifications(res.data);
      } catch {}
    }
    setOpen(o => !o);
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {}
  };

  const handleMarkOne = async (n) => {
    if (!n.read) {
      try {
        await markAsRead(n.id);
        setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch {}
    }
    const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.SYSTEM;
    if (cfg.route) {
      setOpen(false);
      navigate(cfg.route);
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllNotifications();
      setNotifications([]);
      setUnreadCount(0);
    } catch {}
  };

  const displayed = tab === 'UNREAD'
    ? notifications.filter(n => !n.read)
    : notifications;

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Bell button */}
      <button
        onClick={handleOpen}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          position: 'relative', padding: '6px', display: 'flex',
          alignItems: 'center', justifyContent: 'center', borderRadius: 8,
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.06)')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <svg viewBox="0 0 24 24" fill="#6B7280" width="22" height="22">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
        </svg>
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: 2, right: 2,
            backgroundColor: '#EF4444', color: 'white',
            borderRadius: '50%', fontSize: 10, fontWeight: 700,
            width: 16, height: 16, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            border: '2px solid #F5F7FA',
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 8px)',
          width: 360, backgroundColor: 'white', borderRadius: 14,
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)', zIndex: 1000,
          display: 'flex', flexDirection: 'column',
          maxHeight: 480, overflow: 'hidden',
          border: '1px solid #F3F4F6',
        }}>
          {/* Header */}
          <div style={{ padding: '14px 16px 0', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>
                Notifications
                {unreadCount > 0 && (
                  <span style={{ marginLeft: 8, padding: '1px 7px', borderRadius: 20, fontSize: 11, fontWeight: 700, backgroundColor: '#EFF6FF', color: '#1D4ED8' }}>
                    {unreadCount} new
                  </span>
                )}
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} style={{ background: 'none', border: 'none', color: '#1B3A72', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>
                    Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button onClick={handleClearAll} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>
                    Clear all
                  </button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, backgroundColor: '#F3F4F6', borderRadius: 8, padding: 3, marginBottom: 0 }}>
              {[['ALL', 'All'], ['UNREAD', `Unread (${unreadCount})`]].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  style={{
                    flex: 1, padding: '5px 0', borderRadius: 6, border: 'none',
                    backgroundColor: tab === key ? 'white' : 'transparent',
                    color: tab === key ? '#111827' : '#6B7280',
                    fontSize: 12, fontWeight: tab === key ? 600 : 400,
                    cursor: 'pointer', fontFamily: 'inherit',
                    boxShadow: tab === key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div style={{ overflowY: 'auto', flex: 1, marginTop: 8 }}>
            {displayed.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🔔</div>
                <p style={{ color: '#9CA3AF', fontSize: 13, margin: 0 }}>
                  {tab === 'UNREAD' ? 'No unread notifications' : 'No notifications yet'}
                </p>
              </div>
            ) : displayed.map(n => {
              const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.SYSTEM;
              return (
                <div
                  key={n.id}
                  onClick={() => handleMarkOne(n)}
                  style={{
                    display: 'flex', gap: 12, padding: '12px 16px',
                    backgroundColor: n.read ? 'white' : '#FAFBFF',
                    borderBottom: '1px solid #F9FAFB',
                    cursor: cfg.route ? 'pointer' : (n.read ? 'default' : 'pointer'),
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = n.read ? 'white' : '#FAFBFF')}
                >
                  {/* Type icon */}
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, backgroundColor: cfg.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {cfg.icon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: '#111827', lineHeight: 1.4, marginBottom: 3, fontWeight: n.read ? 400 : 500 }}>
                      {n.message}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, color: '#9CA3AF' }}>{timeAgo(n.createdAt)}</span>
                      {cfg.route && (
                        <span style={{ fontSize: 11, color: '#F47B20', fontWeight: 600 }}>View →</span>
                      )}
                    </div>
                  </div>

                  {/* Unread dot */}
                  {!n.read && (
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#3B82F6', flexShrink: 0, marginTop: 4 }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
