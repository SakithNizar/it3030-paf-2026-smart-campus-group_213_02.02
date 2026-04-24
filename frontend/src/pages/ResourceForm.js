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

  return (
    <div className="card">
      <h2>{form.id ? "Edit Resource" : "Add Resource"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="capacity"
          placeholder="Capacity"
          value={form.capacity}
          onChange={handleChange}
          required
        />

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />

        <input
          name="availableFrom"
          type="time"
          value={form.availableFrom}
          onChange={handleChange}
          required
        />

        <input
          name="availableTo"
          type="time"
          value={form.availableTo}
          onChange={handleChange}
          required
        />

        {/* 🖼️ Image URL */}
        <input
          name="imageUrl"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={handleChange}
        />

        {/* 🏷️ Tags */}
        <input
          name="tags"
          placeholder="Tags (e.g. AC,WiFi,Projector)"
          value={form.tags}
          onChange={handleChange}
        />

        {/* 👀 Image Preview */}
        {form.imageUrl && (
          <img
            src={form.imageUrl}
            alt="preview"
            width="120"
            style={{ marginTop: "10px", borderRadius: "5px" }}
            onError={(e) => (e.target.style.display = "none")}
          />
        )}

        <select name="type" value={form.type} onChange={handleChange}>
          <option value="ROOM">ROOM</option>
          <option value="LAB">LAB</option>
          <option value="EQUIPMENT">EQUIPMENT</option>
        </select>

        <select name="status" value={form.status} onChange={handleChange}>
          <option value="ACTIVE">ACTIVE</option>
          <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
        </select>

        <button type="submit">
          {form.id ? "Update Resource" : "Add Resource"}
        </button>
      </form>
    </div>
  );
}
