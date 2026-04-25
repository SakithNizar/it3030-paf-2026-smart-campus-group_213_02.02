import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPreferences, savePreferences } from '../api/notificationApi';

const CATEGORIES = [
  {
    key: 'BOOKING',
    label: 'Booking Notifications',
    description: 'Alerts when your bookings are approved, rejected, or cancelled',
    color: '#F47B20',
    bg: '#FFF7ED',
    icon: (
      <svg viewBox="0 0 24 24" fill="#F47B20" width="20" height="20">
        <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
      </svg>
    ),
  },
  {
    key: 'INCIDENT',
    label: 'Incident Notifications',
    description: 'Updates on incident tickets you have submitted',
    color: '#EF4444',
    bg: '#FEF2F2',
    icon: (
      <svg viewBox="0 0 24 24" fill="#EF4444" width="20" height="20">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
    ),
  },
  {
    key: 'SYSTEM',
    label: 'System Notifications',
    description: 'General platform announcements and updates',
    color: '#3B82F6',
    bg: '#EFF6FF',
    icon: (
      <svg viewBox="0 0 24 24" fill="#3B82F6" width="20" height="20">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
      </svg>
    ),
  },
];

function Toggle({ enabled, onChange, disabled }) {
  return (
    <div
      onClick={disabled ? undefined : onChange}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        backgroundColor: disabled ? '#E5E7EB' : enabled ? '#1B3A72' : '#D1D5DB',
        cursor: disabled ? 'not-allowed' : 'pointer',
        position: 'relative',
        flexShrink: 0,
        transition: 'background-color 0.2s',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 3,
          left: enabled ? 23 : 3,
          width: 18,
          height: 18,
          borderRadius: '50%',
          backgroundColor: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          transition: 'left 0.2s',
        }}
      />
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState({
    BOOKING: true, INCIDENT: true, SYSTEM: true, EMAIL_NOTIFICATIONS: true,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPreferences()
      .then(r => setPrefs(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (key) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    setSaving(true);
    setSaved(false);
    try {
      const r = await savePreferences(updated);
      setPrefs(r.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setPrefs(prefs);
    } finally {
      setSaving(false);
    }
  };

  const initials = user?.email ? user.email.substring(0, 2).toUpperCase() : 'U';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div style={{ maxWidth: 600 }}>
      {/* Profile card */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: '28px 28px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
      }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1B3A72 0%, #3B6CB7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: 22,
          fontWeight: 700,
          flexShrink: 0,
        }}>
          {initials}
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>{user?.email}</div>
          <div style={{
            display: 'inline-block',
            marginTop: 6,
            padding: '3px 10px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 700,
            backgroundColor: '#EEF2FF',
            color: '#4338CA',
          }}>
            {user?.role}
          </div>
        </div>
      </div>

      {/* In-app notification preferences */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: 16,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        marginBottom: 20,
      }}>
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid #F3F4F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>In-App Notifications</div>
            <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
              Choose which notifications appear in your bell
            </div>
          </div>
          {saving && <span style={{ fontSize: 12, color: '#6B7280' }}>Saving…</span>}
          {saved && !saving && <span style={{ fontSize: 12, color: '#10B981', fontWeight: 600 }}>Saved</span>}
        </div>

        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
            Loading preferences…
          </div>
        ) : (
          CATEGORIES.map((cat, i) => (
            <div
              key={cat.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '18px 24px',
                borderBottom: i < CATEGORIES.length - 1 ? '1px solid #F9FAFB' : 'none',
              }}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: cat.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {cat.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{cat.label}</div>
                <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{cat.description}</div>
              </div>
              <Toggle enabled={!!prefs[cat.key]} onChange={() => handleToggle(cat.key)} />
            </div>
          ))
        )}
      </div>

      {/* Email notifications — users only */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: 16,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #F3F4F6' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>Email Notifications</div>
          <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
            {isAdmin
              ? 'Admins are notified via the dashboard — email delivery is not available for admin accounts'
              : 'Receive email updates for your booking and incident activity'}
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '18px 24px',
        }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: isAdmin ? '#F3F4F6' : '#F0FDF4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg viewBox="0 0 24 24" fill={isAdmin ? '#9CA3AF' : '#10B981'} width="20" height="20">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: isAdmin ? '#9CA3AF' : '#111827' }}>
              Send me email notifications
            </div>
            <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
              {isAdmin ? 'Not available for admin accounts' : `Emails sent to ${user?.email}`}
            </div>
          </div>
          <Toggle
            enabled={!isAdmin && !!prefs['EMAIL_NOTIFICATIONS']}
            onChange={() => handleToggle('EMAIL_NOTIFICATIONS')}
            disabled={isAdmin}
          />
        </div>
      </div>
    </div>
  );
}
