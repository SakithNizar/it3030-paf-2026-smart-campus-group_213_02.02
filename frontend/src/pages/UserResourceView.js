import { useEffect, useState } from "react";
import { getResources } from "../api/resourceApi";

export default function UserResourceView() {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  useEffect(() => {
    getResources().then(res => setResources(res.data));
  }, []);

  // ⏱ Convert time
  const getMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  // 🧠 Smart availability
  const getAvailability = (r) => {
    if (!r.availableFrom || !r.availableTo) {
      return { text: "🔴 Closed", color: "red" };
    }

    if (r.status === "OUT_OF_SERVICE") {
      return { text: "🚫 Out of Service", color: "gray" };
    }

    const now = new Date();
    const current = now.getHours() * 60 + now.getMinutes();

    const from = getMinutes(r.availableFrom);
    const to = getMinutes(r.availableTo);

    if (current < from) {
      return { text: `🕒 Opens at ${r.availableFrom}`, color: "orange" };
    }

    if (current > to) {
      return { text: "🔴 Closed", color: "red" };
    }

    const remaining = to - current;
    const hours = Math.floor(remaining / 60);
    const mins = remaining % 60;

    return {
      text: `🟢 Available (${hours}h ${mins}m left)`,
      color: "green"
    };
  };

  // 🔍 Filtering
  const filtered = resources.filter(r => {
    return (
      r.location.toLowerCase().includes(search.toLowerCase()) &&
      (typeFilter === "" || r.type === typeFilter) &&
      (!onlyAvailable || getAvailability(r).text.includes("Available"))
    );
  });

  return (
    <div className="container">
      <h1> Resources</h1>

      {/* 🔍 Filters */}
      <div style={{ marginBottom: "15px" }}>
        <input
          placeholder="Search location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          <option value="LAB">LAB</option>
          <option value="ROOM">ROOM</option>
          <option value="EQUIPMENT">EQUIPMENT</option>
        </select>

        <label style={{ marginLeft: "10px" }}>
          <input
            type="checkbox"
            onChange={() => setOnlyAvailable(!onlyAvailable)}
          />
          Available Now
        </label>
      </div>

      {/* 📊 TABLE */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Capacity</th>
            <th>Location</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map(r => {
            const status = getAvailability(r);
            return (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.name}</td>
                <td>{r.type}</td>
                <td>{r.capacity}</td>
                <td>{r.location}</td>

                <td style={{ color: status.color, fontWeight: "bold" }}>
                  {status.text}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}