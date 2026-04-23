import { useEffect, useState } from "react";
import { getResources, deleteResource } from "../api/resourceApi";
import ResourceForm from "./ResourceForm";

export default function ResourceList() {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const loadData = () => {
    getResources().then(res => setResources(res.data));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (id) => {
    deleteResource(id).then(() => loadData());
  };

  // Availability logic
const isAvailable = (r) => {
  if (!r.availableFrom || !r.availableTo) return false;

  const now = new Date();

  // Convert current time to minutes
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Convert availableFrom (HH:mm) to minutes
  const [fromHour, fromMin] = r.availableFrom.split(":").map(Number);
  const fromMinutes = fromHour * 60 + fromMin;

  // Convert availableTo (HH:mm) to minutes
  const [toHour, toMin] = r.availableTo.split(":").map(Number);
  const toMinutes = toHour * 60 + toMin;

  return currentMinutes >= fromMinutes && currentMinutes <= toMinutes;
};

  return (
    <div>
      <ResourceForm
        refresh={loadData}
        selected={selected}
        setSelected={setSelected}
      />

      <div className="card">
        <h2>Resource List</h2>

        {/* 🔍 Search */}
        <input
          placeholder="Search by location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Location</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {resources
              .filter(r =>
                r.location.toLowerCase().includes(search.toLowerCase())
              )
              .map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.name}</td>
                  <td>{r.type}</td>
                  <td>{r.capacity}</td>
                  <td>{r.location}</td>

                  {/* 🟢 Availability */}
                  <td style={{ fontWeight: "bold" }}>
                   {r.status === "OUT_OF_SERVICE"
                      ? "🚫 Out of Service"
                     : isAvailable(r)
                     ? "🟢 Available Now"
                    : "🔴 Closed"}
                  </td>

                  <td>
                    <button onClick={() => setSelected(r)}>Edit</button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(r.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
