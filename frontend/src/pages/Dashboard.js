import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getResources } from '../api/resourceApi';
import { getAllUsers } from '../api/authApi';
import { getUserBookings, getAllBookings } from '../api/bookingApi';
import { useAuth } from '../context/AuthContext';

// ─── Shared primitives ────────────────────────────────────────────────────────

function StatCard({ icon, iconBg, label, value, sub }) {
  return (
    <div style={{
      backgroundColor: 'white', borderRadius: 16, padding: '22px 24px',
      display: 'flex', alignItems: 'center', gap: 16,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)', flex: 1, minWidth: 0,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12, backgroundColor: iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 }}>
          {label}
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, color: '#111827' }}>
          {value !== null && value !== undefined ? value : '—'}
        </div>
        {sub && <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

function DonutChart({ value, total, color = '#3B82F6', trackColor = '#BFDBFE' }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div style={{ position: 'relative', width: 110, height: 110, flexShrink: 0 }}>
      <svg viewBox="0 0 36 36" width="110" height="110" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="18" cy="18" r="14" fill="none" stroke={trackColor} strokeWidth="7" />
        <circle cx="18" cy="18" r="14" fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={`${(pct / 100) * 88} 88`} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#111827' }}>{value}</div>
        <div style={{ fontSize: 10, color: '#9CA3AF' }}>{total > 0 ? Math.round(pct) + '%' : ''}</div>
      </div>
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function buildMonthlyActivity(bookings) {
  // Last 12 months ending this month
  const now = new Date();
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    return { year: d.getFullYear(), month: d.getMonth(), label: MONTHS_SHORT[d.getMonth()], count: 0 };
  });

  bookings.forEach(b => {
    if (!b.bookingDate) return;
    const d = new Date(b.bookingDate);
    const slot = months.find(m => m.year === d.getFullYear() && m.month === d.getMonth());
    if (slot) slot.count++;
  });

  return months;
}

function buildTopResources(bookings, resourceList) {
  const countMap = {};
  bookings.forEach(b => {
    countMap[b.resourceId] = (countMap[b.resourceId] || 0) + 1;
  });

  return Object.entries(countMap)
    .map(([id, count]) => {
      const r = resourceList.find(res => String(res.id) === String(id));
      return { name: r ? r.name : `Resource ${id}`, type: r ? r.type : '', count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

function ActivityChart({ months }) {
  const maxVal = Math.max(...months.map(m => m.count), 1);
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', height: 180, gap: 8 }}>
        {months.map((m, i) => {
          const barH = Math.max((m.count / maxVal) * 160, m.count > 0 ? 4 : 0);
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 4 }}>{m.count > 0 ? m.count : ''}</div>
              <div style={{
                width: '100%', height: barH, borderRadius: '4px 4px 0 0',
                backgroundColor: m.count > 0 ? '#3B82F6' : '#E5E7EB',
                transition: 'height 0.3s ease',
              }} />
              <span style={{ fontSize: 10, color: '#9CA3AF', marginTop: 6 }}>{m.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdminDashboard({ resources, users, bookings }) {
  const available    = resources.filter(r => r.status === 'ACTIVE');
  const outOfService = resources.filter(r => r.status === 'OUT_OF_SERVICE');
  const maintenance  = resources.filter(r => r.status === 'UNDER_MAINTENANCE');
  const pending      = bookings.filter(b => b.status === 'PENDING');

  const monthlyData  = buildMonthlyActivity(bookings);
  const topResources = buildTopResources(bookings, resources);

  return (
    <div>
      {/* Stat cards */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
        <StatCard
          icon={<svg viewBox="0 0 24 24" fill="#3B82F6" width="22" height="22"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>}
          iconBg="#EFF6FF" label="Total Users" value={users.length}
        />
        <StatCard
          icon={<svg viewBox="0 0 24 24" fill="#0D9488" width="22" height="22"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>}
          iconBg="#F0FDF4" label="Total Resources" value={resources.length}
          sub={`${outOfService.length + maintenance.length} unavailable`}
        />
        <StatCard
          icon={<svg viewBox="0 0 24 24" fill="#F47B20" width="22" height="22"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>}
          iconBg="#FFF7ED" label="Pending Bookings" value={pending.length}
          sub="Awaiting approval"
        />
        <StatCard
          icon={<svg viewBox="0 0 24 24" fill="#7C3AED" width="22" height="22"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9H7v-2h5V9l4 4-4 4v-3z"/></svg>}
          iconBg="#F5F3FF" label="Total Bookings" value={bookings.length}
        />
      </div>

      {/* Activity chart */}
      <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: '#111827' }}>Booking Activity</h3>
        <p style={{ margin: '0 0 20px', fontSize: 13, color: '#9CA3AF' }}>Number of bookings per month over the last 12 months</p>
        <ActivityChart months={monthlyData} />
      </div>

      {/* Bottom: top resources + availability */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Top booked resources */}
        <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#111827' }}>Most Booked Resources</h3>
          {topResources.length === 0 ? (
            <p style={{ color: '#9CA3AF', fontSize: 13 }}>No booking data yet.</p>
          ) : topResources.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '11px 0', borderBottom: i < topResources.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: i === 0 ? '#FFF7ED' : '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: i === 0 ? '#F47B20' : '#6B7280', flexShrink: 0 }}>
                {i + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>{r.type}</div>
              </div>
              <div style={{ fontSize: 12, color: '#F47B20', fontWeight: 600, flexShrink: 0 }}>{r.count} bookings</div>
            </div>
          ))}
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Resource availability donut */}
          <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#111827' }}>Resource Availability</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <DonutChart value={available.length} total={resources.length || 1} color="#22C55E" trackColor="#DCFCE7" />
              <div style={{ fontSize: 13 }}>
                {[
                  { label: 'Active',            count: available.length,    color: '#22C55E' },
                  { label: 'Out of Service',    count: outOfService.length, color: '#EF4444' },
                  { label: 'Under Maintenance', count: maintenance.length,  color: '#F59E0B' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: row.color, flexShrink: 0 }} />
                    <span style={{ color: '#374151' }}>{row.label}</span>
                    <span style={{ fontWeight: 700, color: '#111827', marginLeft: 'auto' }}>{row.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking status breakdown */}
          <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', flex: 1 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 700, color: '#111827' }}>Booking Status Breakdown</h3>
            {[
              { label: 'Approved',  count: bookings.filter(b => b.status === 'APPROVED').length,  color: '#16A34A', bg: '#DCFCE7' },
              { label: 'Pending',   count: bookings.filter(b => b.status === 'PENDING').length,   color: '#CA8A04', bg: '#FEF9C3' },
              { label: 'Rejected',  count: bookings.filter(b => b.status === 'REJECTED').length,  color: '#DC2626', bg: '#FEE2E2' },
              { label: 'Cancelled', count: bookings.filter(b => b.status === 'CANCELLED').length, color: '#6B7280', bg: '#F3F4F6' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
                <span style={{ fontSize: 13, color: '#374151' }}>{row.label}</span>
                <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, backgroundColor: row.bg, color: row.color }}>
                  {row.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── User Dashboard ───────────────────────────────────────────────────────────

const STATUS_COLORS = {
  PENDING:   { bg: '#FEF9C3', color: '#CA8A04' },
  APPROVED:  { bg: '#DCFCE7', color: '#16A34A' },
  REJECTED:  { bg: '#FEE2E2', color: '#DC2626' },
  CANCELLED: { bg: '#F3F4F6', color: '#6B7280' },
};

function QuickActionCard({ label, description, color, onClick, icon }) {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'white', borderRadius: 16, padding: '20px 24px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)', flex: 1, cursor: 'pointer',
        borderTop: `4px solid ${color}`, transition: 'transform 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; }}
    >
      <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 13, color: '#6B7280' }}>{description}</div>
    </div>
  );
}

function UserDashboard({ resources, bookings, navigate }) {
  const available = resources.filter(r => r.status === 'ACTIVE');
  const myActive  = bookings.filter(b => b.status === 'APPROVED');
  const myPending = bookings.filter(b => b.status === 'PENDING');
  const recent    = [...bookings].reverse().slice(0, 5);

  return (
    <div>
      {/* Stat cards */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
        <StatCard
          icon={<svg viewBox="0 0 24 24" fill="#0D9488" width="22" height="22"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>}
          iconBg="#F0FDF4" label="Available Resources" value={available.length}
          sub={`of ${resources.length} total`}
        />
        <StatCard
          icon={<svg viewBox="0 0 24 24" fill="#16A34A" width="22" height="22"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>}
          iconBg="#DCFCE7" label="Active Bookings" value={myActive.length}
          sub="Approved"
        />
        <StatCard
          icon={<svg viewBox="0 0 24 24" fill="#CA8A04" width="22" height="22"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>}
          iconBg="#FEF9C3" label="Pending Requests" value={myPending.length}
          sub="Awaiting approval"
        />
        <StatCard
          icon={<svg viewBox="0 0 24 24" fill="#7C3AED" width="22" height="22"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9H7v-2h5V9l4 4-4 4v-3z"/></svg>}
          iconBg="#F5F3FF" label="Total My Bookings" value={bookings.length}
        />
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 700, color: '#111827' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <QuickActionCard icon="📅" label="Book a Resource" description="Reserve a room, lab, or equipment" color="#F47B20" onClick={() => navigate('/bookings')} />
          <QuickActionCard icon="🏫" label="Browse Facilities" description="View available campus resources" color="#3B82F6" onClick={() => navigate('/facilities')} />
          <QuickActionCard icon="🚨" label="Report an Incident" description="Submit a maintenance or safety issue" color="#EF4444" onClick={() => navigate('/incidents')} />
        </div>
      </div>

      {/* Recent bookings */}
      <div style={{ backgroundColor: 'white', borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>My Recent Bookings</h3>
          <button onClick={() => navigate('/bookings')} style={{ fontSize: 13, color: '#F47B20', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            View all →
          </button>
        </div>
        {recent.length === 0 ? (
          <p style={{ padding: '40px 24px', textAlign: 'center', color: '#9CA3AF', fontSize: 14, margin: 0 }}>
            No bookings yet. Use the button above to make your first booking!
          </p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAFAFA' }}>
                {['Resource', 'Date', 'Time', 'Purpose', 'Status'].map(col => (
                  <th key={col} style={{ padding: '11px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #F3F4F6' }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map(b => {
                const s = STATUS_COLORS[b.status] || STATUS_COLORS.PENDING;
                return (
                  <tr key={b.id} style={{ borderBottom: '1px solid #F9FAFB' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FAFAFA')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '12px 20px', fontSize: 13, color: '#F47B20', fontWeight: 500 }}>Resource {b.resourceId}</td>
                    <td style={{ padding: '12px 20px', fontSize: 13, color: '#374151' }}>{b.bookingDate}</td>
                    <td style={{ padding: '12px 20px', fontSize: 13, color: '#374151', whiteSpace: 'nowrap' }}>{b.startTime} – {b.endTime}</td>
                    <td style={{ padding: '12px 20px', fontSize: 13, color: '#374151', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.purpose}</td>
                    <td style={{ padding: '12px 20px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, backgroundColor: s.bg, color: s.color }}>{b.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'ADMIN';

  const [resources, setResources] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getResources().then(r => setResources(r.data)).catch(() => {});
    if (isAdmin) {
      getAllUsers().then(r => setUsers(r.data)).catch(() => {});
      getAllBookings().then(r => setBookings(r.data)).catch(() => {});
    } else {
      getUserBookings(user.userId).then(r => setBookings(r.data)).catch(() => {});
    }
  }, [isAdmin, user.userId]);

  if (isAdmin) {
    return <AdminDashboard resources={resources} users={users} bookings={bookings} />;
  }
  return <UserDashboard resources={resources} bookings={bookings} navigate={navigate} />;
}
