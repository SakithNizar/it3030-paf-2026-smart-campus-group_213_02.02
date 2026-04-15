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
    const now = new Date();
    const currentTime = now.getHours() + ":" + now.getMinutes();

    return currentTime >= r.availableFrom && currentTime <= r.availableTo;
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
                  <td>{r.name}</td>
                  <td>{r.type}</td>
                  <td>{r.capacity}</td>
                  <td>{r.location}</td>

                  {/* 🟢 Availability */}
                  <td>
                    {isAvailable(r) ? "🟢 Available" : "🔴 Closed"}
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
