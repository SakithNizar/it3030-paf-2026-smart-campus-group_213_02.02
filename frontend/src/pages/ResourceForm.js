import { useEffect, useState } from "react";
import { createResource, updateResource, uploadImage } from "../api/resourceApi";

export default function ResourceForm({ refresh, selected, setSelected }) {
  const [form, setForm] = useState({
    name: "",
    type: "ROOM",
    capacity: "",
    location: "",
    status: "ACTIVE",
    availableFrom: "",
    availableTo: "",
    imageUrl: "",
    tags: ""
  });
  const [uploading, setUploading] = useState(false);

  // Load selected resource for edit
  useEffect(() => {
    if (selected) {
      setForm({
        ...selected,
        tags: selected.tags ? selected.tags.join(",") : "" // convert array → string
      });
    }
  }, [selected]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ convert tags string → array
    const payload = {
      ...form,
      capacity: Number(form.capacity),
      tags: form.tags
        ? form.tags.split(",").map(tag => tag.trim())
        : []
    };

    if (form.id) {
      updateResource(form.id, payload).then(() => {
        refresh();
        setSelected(null);
        resetForm();
      });
    } else {
      createResource(payload).then(() => {
        refresh();
        resetForm();
      });
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      type: "ROOM",
      capacity: "",
      location: "",
      status: "ACTIVE",
      availableFrom: "",
      availableTo: "",
      imageUrl: "",
      tags: ""
    });
  };

  const fieldStyle = {
    width: '100%',
    padding: '9px 12px',
    border: '1px solid #E5E7EB',
    borderRadius: 8,
    fontSize: 14,
    color: '#374151',
    outline: 'none',
    marginBottom: 14,
    display: 'block',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 4,
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
        <div>
          <label style={labelStyle}>Name *</label>
          <input name="name" placeholder="Resource name" value={form.name} onChange={handleChange} required style={fieldStyle} />
        </div>
        <div>
          <label style={labelStyle}>Capacity *</label>
          <input name="capacity" placeholder="e.g. 30" value={form.capacity} onChange={handleChange} required style={fieldStyle} />
        </div>
        <div>
          <label style={labelStyle}>Location *</label>
          <input name="location" placeholder="Building / Room no." value={form.location} onChange={handleChange} required style={fieldStyle} />
        </div>
        <div>
          <label style={labelStyle}>Type</label>
          <select name="type" value={form.type} onChange={handleChange} style={fieldStyle}>
            <option value="ROOM">ROOM</option>
            <option value="LAB">LAB</option>
            <option value="EQUIPMENT">EQUIPMENT</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Available From *</label>
          <input name="availableFrom" type="time" value={form.availableFrom} onChange={handleChange} required style={fieldStyle} />
        </div>
        <div>
          <label style={labelStyle}>Available To *</label>
          <input name="availableTo" type="time" value={form.availableTo} onChange={handleChange} required style={fieldStyle} />
        </div>
        <div>
          <label style={labelStyle}>Status</label>
          <select name="status" value={form.status} onChange={handleChange} style={fieldStyle}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Tags</label>
          <input name="tags" placeholder="AC,WiFi,Projector" value={form.tags} onChange={handleChange} style={fieldStyle} />
        </div>
      </div>

      {/* Image upload */}
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Resource Image</label>
        <label style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px',
          border: '1.5px dashed #E5E7EB', borderRadius: 8, cursor: 'pointer',
          backgroundColor: uploading ? '#F9FAFB' : 'white', transition: 'border-color 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#F47B20')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = '#E5E7EB')}
        >
          <svg viewBox="0 0 24 24" fill="#9CA3AF" width="20" height="20">
            <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
          </svg>
          <span style={{ fontSize: 13, color: uploading ? '#9CA3AF' : '#6B7280' }}>
            {uploading ? 'Uploading...' : form.imageUrl ? 'Change image' : 'Click to upload image'}
          </span>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            disabled={uploading}
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;
              setUploading(true);
              try {
                const res = await uploadImage(file);
                setForm(prev => ({ ...prev, imageUrl: res.data.url }));
              } catch {
                alert('Image upload failed. Please try again.');
              } finally {
                setUploading(false);
              }
            }}
          />
        </label>
        {form.imageUrl && (
          <div style={{ marginTop: 10, position: 'relative', display: 'inline-block' }}>
            <img src={form.imageUrl} alt="preview" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8, display: 'block' }} onError={e => (e.target.style.display = 'none')} />
            <button
              type="button"
              onClick={() => setForm(prev => ({ ...prev, imageUrl: '' }))}
              style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', border: 'none', backgroundColor: '#EF4444', color: 'white', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
            >
              ×
            </button>
          </div>
        )}
      </div>

      <button
        type="submit"
        style={{
          width: '100%', padding: '11px', border: 'none', borderRadius: 8,
          backgroundColor: '#F47B20', color: 'white', fontSize: 14,
          fontWeight: 600, cursor: 'pointer',
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#E06710')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#F47B20')}
      >
        {form.id ? "Update Resource" : "Add Resource"}
      </button>
    </form>
  );
}
