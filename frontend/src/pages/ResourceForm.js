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
    availableTo: ""
  });

  // Load selected resource for edit
  useEffect(() => {
    if (selected) {
      setForm(selected);
    }
  }, [selected]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.id) {
      updateResource(form.id, form).then(() => {
        refresh();
        setSelected(null);
        resetForm();
      });
    } else {
      createResource(form).then(() => {
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
      availableTo: ""
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

        <select name="type" value={form.type} onChange={handleChange}>
          <option value="LECTURE_HALL">LECTURE_HALL</option>
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
