import React, { useEffect, useState } from 'react';
import { getAllUsers, updateUserRole } from '../api/authApi';

const ROLE_COLORS = {
  ADMIN:      { bg: '#EEF2FF', color: '#4338CA' },
  USER:       { bg: '#F0FDF4', color: '#16A34A' },
  TECHNICIAN: { bg: '#FFF7ED', color: '#C2410C' },
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const load = () => getAllUsers().then(r => setUsers(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleRoleChange = async (id, newRole) => {
    setUpdatingId(id);
    await updateUserRole(id, newRole).catch(() => {});
    await load();
    setUpdatingId(null);
  };

  const filtered = users.filter(u =>
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ backgroundColor: 'white', borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid #F3F4F6', gap: 12 }}>
          <div style={{ position: 'relative', flex: '0 0 240px' }}>
            <svg viewBox="0 0 24 24" fill="#9CA3AF" width="16" height="16"
              style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}>
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input placeholder="Search by email..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 34, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, width: '100%', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
          </div>
          <span style={{ marginLeft: 'auto', fontSize: 13, color: '#9CA3AF' }}>{filtered.length} user{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAFAFA' }}>
                {['#', 'Email', 'Role', 'Change Role'].map(col => (
                  <th key={col} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #F3F4F6' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '40px 20px', textAlign: 'center', color: '#9CA3AF', fontSize: 14 }}>No users found.</td></tr>
              ) : filtered.map((u, idx) => {
                const rc = ROLE_COLORS[u.role] || ROLE_COLORS.USER;
                return (
                  <tr key={u.id} style={{ borderBottom: '1px solid #F9FAFB' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FAFAFA')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '13px 20px', fontSize: 13, color: '#9CA3AF' }}>{idx + 1}</td>
                    <td style={{ padding: '13px 20px', fontSize: 14, color: '#111827', fontWeight: 500 }}>{u.email}</td>
                    <td style={{ padding: '13px 20px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, backgroundColor: rc.bg, color: rc.color }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '13px 20px' }}>
                      <select
                        value={u.role}
                        disabled={updatingId === u.id}
                        onChange={e => handleRoleChange(u.id, e.target.value)}
                        style={{ padding: '6px 10px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, color: '#374151', cursor: 'pointer', fontFamily: 'inherit', outline: 'none', backgroundColor: 'white' }}
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="TECHNICIAN">TECHNICIAN</option>
                      </select>
                      {updatingId === u.id && <span style={{ marginLeft: 8, fontSize: 12, color: '#9CA3AF' }}>Saving...</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
