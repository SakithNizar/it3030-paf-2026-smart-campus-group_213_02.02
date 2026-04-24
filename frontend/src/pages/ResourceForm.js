import { useEffect, useState } from "react";
import { createResource, updateResource } from "../api/resourceApi";

export default function ResourceForm({ refresh, selected, setSelected }) {
  const [form, setForm] = useState({
    name: "",
    type: "ROOM",
    capacity: "",
    location: "",
    status: "ACTIVE",
    availableFrom: "",
    availableTo: "",
    imageUrl: "",   // ✅ NEW
    tags: ""        // ✅ NEW (string input)
  });

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

      <div>
        <label style={labelStyle}>Image URL</label>
        <input name="imageUrl" placeholder="https://..." value={form.imageUrl} onChange={handleChange} style={fieldStyle} />
      </div>

      {form.imageUrl && (
        <img src={form.imageUrl} alt="preview" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8, marginBottom: 14 }} onError={e => (e.target.style.display = 'none')} />
      )}

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
