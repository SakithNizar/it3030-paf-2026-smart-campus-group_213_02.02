import { useEffect, useState } from "react";
import { getResources, deleteResource } from "../api/resourceApi";
import ResourceForm from "./ResourceForm";

const SortIcon = () => (
  <svg viewBox="0 0 24 24" fill="#9CA3AF" width="14" height="14" style={{ flexShrink: 0 }}>
    <path d="M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15 12 18.17z" />
  </svg>
);

const isAvailableNow = (r) => {
  if (!r.availableFrom || !r.availableTo) return false;
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  const [fh, fm] = r.availableFrom.split(":").map(Number);
  const [th, tm] = r.availableTo.split(":").map(Number);
  return cur >= fh * 60 + fm && cur <= th * 60 + tm;
};

function StatusBadge({ resource }) {
  if (resource.status === "OUT_OF_SERVICE") {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, backgroundColor: '#FEF2F2', color: '#EF4444', fontSize: 12, fontWeight: 600 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#EF4444', display: 'inline-block' }} />
        Out of Service
      </span>
    );
  }
  if (isAvailableNow(resource)) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, backgroundColor: '#ECFDF5', color: '#059669', fontSize: 12, fontWeight: 600 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#059669', display: 'inline-block' }} />
        Available
      </span>
    );
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, backgroundColor: '#FEF9C3', color: '#CA8A04', fontSize: 12, fontWeight: 600 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#CA8A04', display: 'inline-block' }} />
      Closed
    </span>
  );
}

export default function ResourceList() {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadData = () => {
    getResources().then(res => setResources(res.data));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Delete this resource?")) {
      deleteResource(id).then(() => loadData());
    }
  };

  const handleEdit = (r) => {
    setSelected(r);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelected(null);
    setShowForm(true);
  };

  const filtered = resources.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.location?.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = resources.filter(r => r.status !== 'OUT_OF_SERVICE').length;

  return (
    <div>
      {/* Form modal */}
      {showForm && (
        <div
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
          }}
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}
        >
          <div
            style={{
              backgroundColor: 'white', borderRadius: 16, padding: '28px 32px',
              width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' }}>
                {selected ? 'Edit Resource' : 'Add Resource'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: 4 }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
            <ResourceForm
              refresh={() => { loadData(); setShowForm(false); }}
              selected={selected}
              setSelected={setSelected}
            />
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Resources', value: resources.length, color: '#3B82F6', bg: '#EFF6FF' },
          { label: 'Available', value: activeCount, color: '#059669', bg: '#ECFDF5' },
          { label: 'Out of Service', value: resources.length - activeCount, color: '#EF4444', bg: '#FEF2F2' },
        ].map(s => (
          <div
            key={s.label}
            style={{
              flex: 1, minWidth: 160, backgroundColor: 'white', borderRadius: 14,
              padding: '18px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              borderLeft: `4px solid ${s.color}`,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 6 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#111827' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div style={{ backgroundColor: 'white', borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid #F3F4F6', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '0 0 220px' }}>
            <svg viewBox="0 0 24 24" fill="#9CA3AF" width="16" height="16" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}>
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input
              placeholder="Search resources..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                paddingLeft: 34, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
                border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13,
                color: '#374151', width: '100%', outline: 'none',
              }}
            />
          </div>
          <button
            onClick={handleAdd}
            style={{
              marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 18px', border: 'none', borderRadius: 8,
              backgroundColor: '#F47B20', fontSize: 13, fontWeight: 600,
              color: 'white', cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#E06710')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#F47B20')}
          >
            <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
            </svg>
            Add Resource
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAFAFA' }}>
                {['No', 'Name', 'Type', 'Capacity', 'Location', 'Status', 'Actions'].map(col => (
                  <th
                    key={col}
                    style={{
                      padding: '12px 20px', textAlign: 'left', fontSize: 13,
                      fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #F3F4F6', whiteSpace: 'nowrap',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {col}
                      {col !== 'No' && col !== 'Actions' && <SortIcon />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, idx) => (
                <tr
                  key={r.id}
                  style={{ borderBottom: '1px solid #F9FAFB', transition: 'background 0.12s' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FAFAFA')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '13px 20px', fontSize: 14, color: '#374151' }}>{idx + 1}</td>
                  <td style={{ padding: '13px 20px', fontSize: 14 }}>
                    <span style={{ color: '#F47B20', fontWeight: 500 }}>{r.name}</span>
                  </td>
                  <td style={{ padding: '13px 20px', fontSize: 14, color: '#374151' }}>
                    <span style={{ padding: '3px 8px', backgroundColor: '#F3F4F6', borderRadius: 6, fontSize: 12, fontWeight: 500 }}>
                      {r.type}
                    </span>
                  </td>
                  <td style={{ padding: '13px 20px', fontSize: 14, color: '#374151' }}>{r.capacity}</td>
                  <td style={{ padding: '13px 20px', fontSize: 14, color: '#374151' }}>{r.location}</td>
                  <td style={{ padding: '13px 20px' }}>
                    <StatusBadge resource={r} />
                  </td>
                  <td style={{ padding: '13px 20px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => handleEdit(r)}
                        style={{
                          padding: '5px 14px', border: '1px solid #E5E7EB', borderRadius: 6,
                          backgroundColor: 'white', fontSize: 12, fontWeight: 500,
                          color: '#374151', cursor: 'pointer',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F9FAFB'; e.currentTarget.style.borderColor = '#1B3A72'; e.currentTarget.style.color = '#1B3A72'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#374151'; }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        style={{
                          padding: '5px 14px', border: '1px solid #FEE2E2', borderRadius: 6,
                          backgroundColor: '#FEF2F2', fontSize: 12, fontWeight: 500,
                          color: '#EF4444', cursor: 'pointer',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#FEE2E2'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#FEF2F2'; }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '40px 20px', textAlign: 'center', color: '#9CA3AF', fontSize: 14 }}>
                    No resources found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
