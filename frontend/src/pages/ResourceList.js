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

  // 🧠 Availability logic
  const isAvailable = (r) => {
    if (!r.availableFrom || !r.availableTo) return false;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [fromHour, fromMin] = r.availableFrom.split(":").map(Number);
    const fromMinutes = fromHour * 60 + fromMin;

    const [toHour, toMin] = r.availableTo.split(":").map(Number);
    const toMinutes = toHour * 60 + toMin;

    return currentMinutes >= fromMinutes && currentMinutes <= toMinutes;
  };

  // 🎨 Styles
  const thStyle = {
    padding: "12px",
    textAlign: "center",
    borderBottom: "2px solid #ddd"
  };

  const tdStyle = {
    padding: "10px"
  };

  const btnStyle = {
    margin: "0 5px",
    padding: "6px 10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "#1890ff",
    color: "white"
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
          style={{
            marginBottom: "10px",
            padding: "8px",
            width: "250px",
            borderRadius: "5px",
            border: "1px solid #ccc"
          }}
        />

        {/* 📊 Table */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Capacity</th>
              <th style={thStyle}>Location</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>

          <tbody>
            {resources
              .filter(r =>
                r.location.toLowerCase().includes(search.toLowerCase())
              )
              .map(r => (
                <tr
                  key={r.id}
                  style={{
                    textAlign: "center",
                    borderBottom: "1px solid #ddd"
                  }}
                >
                  <td style={tdStyle}>{r.id}</td>
                  <td style={tdStyle}>{r.name}</td>
                  <td style={tdStyle}>{r.type}</td>
                  <td style={tdStyle}>{r.capacity}</td>
                  <td style={tdStyle}>{r.location}</td>

                  {/* 🟢 Availability */}
                  <td style={{ ...tdStyle, fontWeight: "bold" }}>
                    {r.status === "OUT_OF_SERVICE"
                      ? "🚫 Out of Service"
                      : isAvailable(r)
                      ? "🟢 Available Now"
                      : "🔴 Closed"}
                  </td>

                  <td style={tdStyle}>
                    <button
                      onClick={() => setSelected(r)}
                      style={btnStyle}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      style={{
                        ...btnStyle,
                        backgroundColor: "#ff4d4f"
                      }}
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
