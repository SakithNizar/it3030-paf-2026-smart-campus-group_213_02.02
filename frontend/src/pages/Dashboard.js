import React, { useEffect, useState } from 'react';
import { getResources } from '../api/resourceApi';
import { getAllUsers } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const mockChartData = [
  { tenan: 80, admin: 60, alumni: 120, mahasiswa: 140 },
  { tenan: 100, admin: 80, alumni: 160, mahasiswa: 200 },
  { tenan: 120, admin: 90, alumni: 200, mahasiswa: 280 },
  { tenan: 160, admin: 110, alumni: 260, mahasiswa: 340 },
  { tenan: 200, admin: 130, alumni: 320, mahasiswa: 400 },
  { tenan: 240, admin: 160, alumni: 380, mahasiswa: 500 },
  { tenan: 300, admin: 200, alumni: 460, mahasiswa: 620 },
  { tenan: 380, admin: 240, alumni: 540, mahasiswa: 720 },
  { tenan: 440, admin: 280, alumni: 600, mahasiswa: 820 },
  { tenan: 500, admin: 320, alumni: 660, mahasiswa: 920 },
  { tenan: 560, admin: 360, alumni: 720, mahasiswa: 1000 },
  { tenan: 620, admin: 400, alumni: 800, mahasiswa: 1100 },
];

const CHART_COLORS = {
  tenan: '#6366F1',
  admin: '#EC4899',
  alumni: '#3B82F6',
  mahasiswa: '#F59E0B',
};

function StatCard({ icon, iconBg, label, value }) {
  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: '22px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        flex: 1,
        minWidth: 0,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          backgroundColor: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 }}>
          {label}
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, color: '#111827' }}>
          {value !== null && value !== undefined ? value.toLocaleString() : '—'}
        </div>
      </div>
    </div>
  );
}

function StackedBarChart({ data }) {
  const maxTotal = Math.max(...data.map(d => d.tenan + d.admin + d.alumni + d.mahasiswa));
  return (
    <div style={{ flex: 1 }}>
      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        {Object.entries(CHART_COLORS).map(([key, color]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: color }} />
            <span style={{ fontSize: 12, color: '#6B7280', textTransform: 'capitalize' }}>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
          </div>
        ))}
      </div>

      {/* Bars */}
      <div style={{ display: 'flex', alignItems: 'flex-end', height: 200, gap: 6 }}>
        {data.map((d, i) => {
          const total = d.tenan + d.admin + d.alumni + d.mahasiswa;
          const barH = (total / maxTotal) * 180;
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: '100%',
                  height: barH,
                  borderRadius: '6px 6px 0 0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column-reverse',
                }}
              >
                {['mahasiswa', 'alumni', 'admin', 'tenan'].map(key => (
                  <div
                    key={key}
                    style={{
                      flex: d[key],
                      backgroundColor: CHART_COLORS[key],
                      minHeight: d[key] > 0 ? 2 : 0,
                    }}
                  />
                ))}
              </div>
              <span style={{ fontSize: 10, color: '#9CA3AF', marginTop: 6 }}>{MONTHS[i]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DonutChart({ available, total }) {
  const pct = total > 0 ? (available / total) * 100 : 0;
  return (
    <div style={{ position: 'relative', width: 130, height: 130, flexShrink: 0 }}>
      <svg viewBox="0 0 36 36" width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="18" cy="18" r="14" fill="none" stroke="#BFDBFE" strokeWidth="7" />
        <circle
          cx="18" cy="18" r="14"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="7"
          strokeDasharray={`${(pct / 100) * 88} 88`}
          strokeLinecap="round"
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>{available}</div>
      </div>
    </div>
  );
}

function Top5List({ items }) {
  return (
    <div>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '12px 0',
            borderBottom: i < items.length - 1 ? '1px solid #F3F4F6' : 'none',
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: '#F3F4F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              color: '#6B7280',
              flexShrink: 0,
            }}
          >
            {i + 1}
          </div>
          <div style={{ flex: 1, fontSize: 13, color: '#374151', fontWeight: 500 }}>{item.name}</div>
          <div style={{ fontSize: 12, color: '#9CA3AF' }}>{item.count}x</div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [users, setUsers] = useState([]);
  const [top5Tab, setTop5Tab] = useState('Assets');
  useEffect(() => {
    const fetches = [getResources().then(r => setResources(r.data)).catch(() => {})];
    if (user?.role === 'ADMIN') {
      fetches.push(getAllUsers().then(r => setUsers(r.data)).catch(() => {}));
    }
    Promise.allSettled(fetches);
  }, [user]);

  const activeResources = resources.filter(r => r.status !== 'OUT_OF_SERVICE');
  const unavailableResources = resources.length - activeResources.length;

  const top5Resources = [...resources]
    .slice(0, 5)
    .map(r => ({ name: r.name, count: Math.floor(Math.random() * 900) + 100 }));

  return (
    <div>
      {/* Stat cards */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
        <StatCard
          icon={
            <svg viewBox="0 0 24 24" fill="#3B82F6" width="24" height="24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          }
          iconBg="#EFF6FF"
          label="Total User"
          value={users.length || (user?.role === 'ADMIN' ? null : '—')}
        />
        <StatCard
          icon={
            <svg viewBox="0 0 24 24" fill="#0D9488" width="24" height="24">
              <path d="M10 2h4c1.1 0 2 .9 2 2v2h4c1.1 0 2 .9 2 2v11c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h4V4c0-1.1.9-2 2-2zm0 2v2h4V4h-4zM4 8v11h16V8H4z" />
            </svg>
          }
          iconBg="#F0FDF4"
          label="Total Asset"
          value={resources.length}
        />
        <StatCard
          icon={
            <svg viewBox="0 0 24 24" fill="#7C3AED" width="24" height="24">
              <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
            </svg>
          }
          iconBg="#F5F3FF"
          label="Total Books"
          value={1029}
        />
        <StatCard
          icon={
            <svg viewBox="0 0 24 24" fill="#DB2777" width="24" height="24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
            </svg>
          }
          iconBg="#FDF2F8"
          label="Total Project"
          value={1029}
        />
      </div>

      {/* Middle section: chart + stats */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: '24px',
          marginBottom: 24,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}
      >
        <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: '#111827' }}>Smart User Data</h3>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          {/* Left stats */}
          <div style={{ minWidth: 160 }}>
            {/* Filter pills */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
              {['Year', 'Status', 'Gender', 'Faculty'].map(f => (
                <button
                  key={f}
                  style={{
                    padding: '5px 14px',
                    borderRadius: 20,
                    border: '1px solid #E5E7EB',
                    backgroundColor: 'white',
                    fontSize: 12,
                    color: '#374151',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  {f}
                  <svg viewBox="0 0 24 24" fill="#9CA3AF" width="14" height="14">
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </button>
              ))}
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 2 }}>Total Faculties</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>209</div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 2 }}>Total Department</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>529</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 2 }}>Total Sub-Department</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>1.029</div>
            </div>
          </div>

          {/* Right: chart */}
          <StackedBarChart data={mockChartData} />
        </div>
      </div>

      {/* Bottom section: Top 5 + Asset chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, flexWrap: 'wrap' }}>
        {/* Top 5 */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: '24px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>Top 5</h3>
            <div style={{ display: 'flex', gap: 4, backgroundColor: '#F3F4F6', borderRadius: 8, padding: 3 }}>
              {['Assets', 'Books/Journal', 'Project'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setTop5Tab(tab)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 6,
                    border: 'none',
                    backgroundColor: top5Tab === tab ? '#111827' : 'transparent',
                    color: top5Tab === tab ? 'white' : '#6B7280',
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'background 0.15s',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <p style={{ fontSize: 12, color: '#9CA3AF', margin: '0 0 12px' }}>
            {top5Tab}
          </p>
          <Top5List
            items={
              top5Resources.length > 0
                ? top5Resources
                : [
                    { name: 'The 9 habit of Effect Blogger in 2021 (Limited)', count: 1000 },
                    { name: 'The 9 habit of Effect Blogger in 2021 (Limited)', count: 1000 },
                    { name: 'The 9 habit of Effect Blogger in 2021 (Limited)', count: 1000 },
                    { name: 'The 9 habit of Effect Blogger in 2021 (Limited)', count: 1000 },
                    { name: 'The 9 habit of Effect Blogger in 2021 (Limited)', count: 1000 },
                  ]
            }
          />
        </div>

        {/* Asset chart + Project Berjalan */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Asset donut */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: 16,
              padding: '24px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}
          >
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#111827' }}>Available Assets</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <DonutChart available={activeResources.length} total={resources.length || 1} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#3B82F6' }} />
                  <span style={{ fontSize: 13, color: '#374151' }}>Available</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginLeft: 4 }}>{activeResources.length}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#BFDBFE' }} />
                  <span style={{ fontSize: 13, color: '#374151' }}>Unavailable</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginLeft: 4 }}>{unavailableResources}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Project Berjalan */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: 16,
              padding: '24px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              flex: 1,
            }}
          >
            <h3 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 700, color: '#111827' }}>Active Projects</h3>
            <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>No active projects yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
