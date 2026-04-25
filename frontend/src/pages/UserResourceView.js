import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getResources } from "../api/resourceApi";

const TYPE_COLORS = {
  ROOM:      { bg: '#EFF6FF', color: '#1D4ED8' },
  LAB:       { bg: '#F0FDF4', color: '#15803D' },
  EQUIPMENT: { bg: '#FFF7ED', color: '#C2410C' },
};

const PLACEHOLDER = "https://picsum.photos/seed/default/600/400";

function getAvailability(r) {
  if (r.status === "OUT_OF_SERVICE")   return { label: "Out of Service",    dot: '#EF4444', text: '#EF4444', bg: '#FEE2E2' };
  if (r.status === "UNDER_MAINTENANCE") return { label: "Under Maintenance", dot: '#F59E0B', text: '#B45309', bg: '#FEF9C3' };

  if (!r.availableFrom || !r.availableTo) return { label: "Unavailable", dot: '#9CA3AF', text: '#6B7280', bg: '#F3F4F6' };

  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  const [fh, fm] = r.availableFrom.split(":").map(Number);
  const [th, tm] = r.availableTo.split(":").map(Number);
  const from = fh * 60 + fm;
  const to   = th * 60 + tm;

  if (cur < from) return { label: `Opens ${r.availableFrom}`, dot: '#F59E0B', text: '#B45309', bg: '#FEF9C3' };
  if (cur > to)   return { label: "Closed",                   dot: '#EF4444', text: '#EF4444', bg: '#FEE2E2' };

  const rem = to - cur;
  const h = Math.floor(rem / 60), m = rem % 60;
  return { label: `Available · ${h}h ${m}m left`, dot: '#22C55E', text: '#15803D', bg: '#DCFCE7' };
}

function ResourceCard({ r, onBook }) {
  const avail    = getAvailability(r);
  const typeStyle = TYPE_COLORS[r.type] || TYPE_COLORS.ROOM;
  const isBookable = r.status === 'ACTIVE';

  return (
    <div style={{
      backgroundColor: 'white', borderRadius: 16, overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column',
      transition: 'box-shadow 0.2s, transform 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.07)'; e.currentTarget.style.transform = 'none'; }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 180, flexShrink: 0, backgroundColor: '#F3F4F6' }}>
        <img
          src={r.imageUrl || PLACEHOLDER}
          alt={r.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.src = PLACEHOLDER; }}
        />
        {/* Type badge */}
        <span style={{
          position: 'absolute', top: 10, left: 10,
          padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
          backgroundColor: typeStyle.bg, color: typeStyle.color,
        }}>
          {r.type}
        </span>
        {/* Status badge */}
        <span style={{
          position: 'absolute', top: 10, right: 10,
          padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
          backgroundColor: avail.bg, color: avail.text,
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: avail.dot, display: 'inline-block' }} />
          {avail.label}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: '#111827' }}>{r.name}</h3>
        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg viewBox="0 0 24 24" fill="#9CA3AF" width="13" height="13"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          {r.location}
        </div>

        <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: 12, color: '#6B7280' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg viewBox="0 0 24 24" fill="#9CA3AF" width="13" height="13"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
            Capacity: {r.capacity}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg viewBox="0 0 24 24" fill="#9CA3AF" width="13" height="13"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>
            {r.availableFrom} – {r.availableTo}
          </span>
        </div>

        {/* Tags */}
        {r.tags && r.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
            {r.tags.map(tag => (
              <span key={tag} style={{ padding: '2px 8px', borderRadius: 12, fontSize: 11, backgroundColor: '#F3F4F6', color: '#374151' }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <div style={{ marginTop: 'auto' }}>
          <button
            onClick={() => isBookable && onBook(r)}
            disabled={!isBookable}
            style={{
              width: '100%', padding: '9px', border: 'none', borderRadius: 8, fontSize: 13,
              fontWeight: 600, cursor: isBookable ? 'pointer' : 'not-allowed', fontFamily: 'inherit',
              backgroundColor: isBookable ? '#F47B20' : '#F3F4F6',
              color: isBookable ? 'white' : '#9CA3AF',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => { if (isBookable) e.currentTarget.style.backgroundColor = '#E06710'; }}
            onMouseLeave={e => { if (isBookable) e.currentTarget.style.backgroundColor = '#F47B20'; }}
          >
            {isBookable ? 'Book Now' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserResourceView() {
  const [resources, setResources] = useState([]);
  const [search, setSearch]       = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [availFilter, setAvailFilter] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getResources().then(res => setResources(res.data)).catch(() => {});
  }, []);

  const filtered = resources.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
                        r.location.toLowerCase().includes(search.toLowerCase());
    const matchType   = typeFilter === "ALL" || r.type === typeFilter;
    const matchAvail  = !availFilter || r.status === "ACTIVE";
    return matchSearch && matchType && matchAvail;
  });

  const counts = {
    ALL:       resources.length,
    ROOM:      resources.filter(r => r.type === 'ROOM').length,
    LAB:       resources.filter(r => r.type === 'LAB').length,
    EQUIPMENT: resources.filter(r => r.type === 'EQUIPMENT').length,
  };

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} viewBox="0 0 24 24" fill="#9CA3AF" width="16" height="16">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input
            placeholder="Search by name or location…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
          />
        </div>

        {/* Type pills */}
        <div style={{ display: 'flex', gap: 6 }}>
          {['ALL', 'ROOM', 'LAB', 'EQUIPMENT'].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)} style={{
              padding: '7px 16px', borderRadius: 20, border: '1px solid',
              borderColor: typeFilter === t ? '#1B3A72' : '#E5E7EB',
              backgroundColor: typeFilter === t ? '#1B3A72' : 'white',
              color: typeFilter === t ? 'white' : '#6B7280',
              fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              {t} <span style={{ opacity: 0.7 }}>({counts[t]})</span>
            </button>
          ))}
        </div>

        {/* Available now toggle */}
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#374151', userSelect: 'none' }}>
          <div style={{
            width: 36, height: 20, borderRadius: 10, position: 'relative', transition: 'background 0.2s',
            backgroundColor: availFilter ? '#22C55E' : '#D1D5DB',
          }}
            onClick={() => setAvailFilter(v => !v)}
          >
            <div style={{
              width: 14, height: 14, borderRadius: '50%', backgroundColor: 'white',
              position: 'absolute', top: 3, left: availFilter ? 18 : 3, transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          </div>
          Available now
        </label>
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF', fontSize: 14 }}>
          No resources match your filters.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {filtered.map(r => (
            <ResourceCard
              key={r.id}
              r={r}
              onBook={() => navigate('/bookings')}
            />
          ))}
        </div>
      )}
    </div>
  );
}
