import { useState } from "react";
import { createResource } from "../api/resourceApi";

export default function ResourceForm({ refresh }) {
  const [form, setForm] = useState({
    name: "",
    type: "ROOM",
    capacity: "",
    location: "",
    status: "ACTIVE",
    availableFrom: "",
    availableTo: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    createResource(form).then(() => {
      refresh();
      setForm({
        name: "",
        type: "ROOM",
        capacity: "",
        location: "",
        status: "ACTIVE",
        availableFrom: "",
        availableTo: ""
      });
    });
  };

  return (
    <div className="card">
      <h2>Add Resource</h2>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="capacity" placeholder="Capacity" value={form.capacity} onChange={handleChange} required />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} required />

        <select name="type" value={form.type} onChange={handleChange}>
          <option value="ROOM">ROOM</option>
          <option value="LAB">LAB</option>
          <option value="EQUIPMENT">EQUIPMENT</option>
        </select>

        <button type="submit">Add Resource</button>
      </form>
    </div>
  );
}
