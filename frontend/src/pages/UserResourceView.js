import { useEffect, useState } from "react";
import { getResources } from "../api/resourceApi";

export default function UserResourceView() {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getResources().then(res => setResources(res.data));
  }, []);

  // Availability logic
  const isAvailable = (r) => {
    if (!r.availableFrom || !r.availableTo) return false;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [fh, fm] = r.availableFrom.split(":").map(Number);
    const [th, tm] = r.availableTo.split(":").map(Number);

    const from = fh * 60 + fm;
    const to = th * 60 + tm;

    return currentMinutes >= from && currentMinutes <= to;
  };

  return (
    <div className="container">
      <h1>📚 Available Resources</h1>

      {/* 🔍 Search */}
      <input
        placeholder="Search by location..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Location</th>
              <th>Status</th>
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

                  <td style={{ fontWeight: "bold" }}>
                    {r.status === "OUT_OF_SERVICE"
                      ? "🚫 Out of Service"
                      : isAvailable(r)
                      ? "🟢 Available"
                      : "🔴 Closed"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
