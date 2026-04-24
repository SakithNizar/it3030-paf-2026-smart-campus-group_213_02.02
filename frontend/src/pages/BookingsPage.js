import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllBookings, getUserBookings, createBooking, updateBookingStatus } from '../api/bookingApi';
import { getResources } from '../api/resourceApi';

const STATUS_COLORS = {
  PENDING:   { bg: '#FEF9C3', color: '#CA8A04' },
  APPROVED:  { bg: '#DCFCE7', color: '#16A34A' },
  REJECTED:  { bg: '#FEE2E2', color: '#DC2626' },
  CANCELLED: { bg: '#F3F4F6', color: '#6B7280' },
};

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.PENDING;
  return (
    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, backgroundColor: s.bg, color: s.color }}>
      {status}
    </span>
  );
}

function AdminBookingsView() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [rejectModal, setRejectModal] = useState(null);
  const [reason, setReason] = useState('');

  const load = () => getAllBookings().then(r => setBookings(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleApprove = async (id) => {
    await updateBookingStatus(id, 'APPROVED');
    load();
  };

  const handleReject = async () => {
    await updateBookingStatus(rejectModal, 'REJECTED', reason); // reason maps to adminReason in API
    setRejectModal(null);
    setReason('');
    load();
  };

  const filtered = filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div>
      {/* Reject reason modal */}
      {rejectModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 28, width: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>Reject Booking</h3>
            <textarea
              placeholder="Reason for rejection (optional)"
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button onClick={() => setRejectModal(null)} style={{ flex: 1, padding: '9px', border: '1px solid #E5E7EB', borderRadius: 8, background: 'white', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>
                Cancel
              </button>
              <button onClick={handleReject} style={{ flex: 1, padding: '9px', border: 'none', borderRadius: 8, background: '#EF4444', color: 'white', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 600 }}>
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Total', value: bookings.length, color: '#6B7280' },
          { label: 'Pending', value: bookings.filter(b => b.status === 'PENDING').length, color: '#CA8A04' },
          { label: 'Approved', value: bookings.filter(b => b.status === 'APPROVED').length, color: '#16A34A' },
          { label: 'Rejected', value: bookings.filter(b => b.status === 'REJECTED').length, color: '#DC2626' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, minWidth: 120, backgroundColor: 'white', borderRadius: 14, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderLeft: `4px solid ${s.color}` }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#111827' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div style={{ backgroundColor: 'white', borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #F3F4F6', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginRight: 8 }}>Filter:</span>
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: '5px 14px', borderRadius: 20, border: '1px solid',
                borderColor: filter === s ? '#1B3A72' : '#E5E7EB',
                backgroundColor: filter === s ? '#1B3A72' : 'white',
                color: filter === s ? 'white' : '#6B7280',
                fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              {s}
            </button>
          ))}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAFAFA' }}>
                {['#', 'Resource', 'Date', 'Time', 'Purpose', 'Attendees', 'Status', 'Actions'].map(col => (
                  <th key={col} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #F3F4F6', whiteSpace: 'nowrap' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: '40px 16px', textAlign: 'center', color: '#9CA3AF', fontSize: 14 }}>No bookings found.</td></tr>
              ) : filtered.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid #F9FAFB' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FAFAFA')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#9CA3AF' }}>{b.id}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500, color: '#F47B20' }}>Resource {b.resourceId}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#374151' }}>{b.bookingDate}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#374151', whiteSpace: 'nowrap' }}>{b.startTime} – {b.endTime}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#374151', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.purpose}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#374151', textAlign: 'center' }}>{b.expectedAttendees}</td>
                  <td style={{ padding: '12px 16px' }}><StatusBadge status={b.status} /></td>
                  <td style={{ padding: '12px 16px' }}>
                    {b.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => handleApprove(b.id)}
                          style={{ padding: '4px 12px', border: 'none', borderRadius: 6, backgroundColor: '#DCFCE7', color: '#16A34A', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                          Approve
                        </button>
                        <button onClick={() => setRejectModal(b.id)}
                          style={{ padding: '4px 12px', border: 'none', borderRadius: 6, backgroundColor: '#FEE2E2', color: '#DC2626', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function UserBookingsView() {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({ resourceId: '', bookingDate: '', startTime: '', endTime: '', purpose: '', expectedAttendees: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const loadBookings = () => getUserBookings(user.userId).then(r => setBookings(r.data)).catch(() => {});
  useEffect(() => {
    loadBookings();
    getResources().then(r => setResources(r.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (new Date(form.bookingDate) < today) { setError('Cannot book a date in the past.'); setLoading(false); return; }
    if (form.endTime <= form.startTime) { setError('End time must be after start time.'); setLoading(false); return; }
    try {
      const res = await createBooking({ ...form, userId: user.userId });
      if (res.status === 409) { setError('This resource is already booked for that time.'); return; }
      setSuccess('Booking request submitted successfully!');
      setForm({ resourceId: '', bookingDate: '', startTime: '', endTime: '', purpose: '', expectedAttendees: '' });
      loadBookings();
    } catch (err) {
      if (err.response?.status === 409) setError('This resource is already booked for that time.');
      else setError('Failed to submit booking. Please try again.');
    } finally { setLoading(false); }
  };

  const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 24, alignItems: 'start', flexWrap: 'wrap' }}>
      {/* Booking form */}
      <div style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: '#111827' }}>New Booking Request</h3>
        {error && <div style={{ padding: '10px 14px', borderRadius: 8, backgroundColor: '#FEF2F2', color: '#DC2626', fontSize: 13, marginBottom: 14, borderLeft: '3px solid #DC2626' }}>{error}</div>}
        {success && <div style={{ padding: '10px 14px', borderRadius: 8, backgroundColor: '#DCFCE7', color: '#16A34A', fontSize: 13, marginBottom: 14, borderLeft: '3px solid #16A34A' }}>{success}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>Resource</label>
            <select value={form.resourceId} onChange={e => setForm({ ...form, resourceId: e.target.value })} required style={inputStyle}>
              <option value="">Select a resource...</option>
              {resources.filter(r => r.status !== 'OUT_OF_SERVICE').map(r => (
                <option key={r.id} value={r.id}>{r.name} ({r.type} — {r.location})</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Date</label>
            <input type="date" value={form.bookingDate} onChange={e => setForm({ ...form, bookingDate: e.target.value })} required style={inputStyle} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Start Time</label>
              <input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>End Time</label>
              <input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} required style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Purpose</label>
            <input type="text" placeholder="e.g. Group project meeting" value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} required style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Expected Attendees</label>
            <input type="number" min="1" placeholder="Number of people" value={form.expectedAttendees} onChange={e => setForm({ ...form, expectedAttendees: e.target.value })} required style={inputStyle} />
          </div>
          <button type="submit" disabled={loading}
            style={{ padding: '11px', border: 'none', borderRadius: 8, backgroundColor: loading ? '#9CA3AF' : '#F47B20', color: 'white', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
            {loading ? 'Submitting...' : 'Request Booking'}
          </button>
        </form>
      </div>

      {/* My bookings */}
      <div style={{ backgroundColor: 'white', borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #F3F4F6' }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>My Bookings</h3>
        </div>
        {bookings.length === 0 ? (
          <p style={{ padding: '40px 24px', textAlign: 'center', color: '#9CA3AF', fontSize: 14, margin: 0 }}>No bookings yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAFAFA' }}>
                  {['Resource', 'Date', 'Time', 'Purpose', 'Status'].map(col => (
                    <th key={col} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #F3F4F6' }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #F9FAFB' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FAFAFA')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#F47B20', fontWeight: 500 }}>Resource {b.resourceId}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#374151' }}>{b.bookingDate}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#374151', whiteSpace: 'nowrap' }}>{b.startTime} – {b.endTime}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#374151', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.purpose}</td>
                    <td style={{ padding: '12px 16px' }}><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookingsPage() {
  const { user } = useAuth();
  return user?.role === 'ADMIN' ? <AdminBookingsView /> : <UserBookingsView />;
}
