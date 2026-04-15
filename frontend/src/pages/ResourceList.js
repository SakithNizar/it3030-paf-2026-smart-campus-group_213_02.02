import { useEffect, useState } from "react";
import { getResources, deleteResource } from "../api/resourceApi";
import ResourceForm from "./ResourceForm";

export default function ResourceList() {
  const [resources, setResources] = useState([]);

  const loadData = () => {
    getResources().then(res => setResources(res.data));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (id) => {
    deleteResource(id).then(() => loadData());
  };

  return (
    <div>
      <ResourceForm refresh={loadData} />

      <div className="card">
        <h2>Resource List</h2>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Location</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {resources.map(r => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.type}</td>
                <td>{r.capacity}</td>
                <td>{r.location}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(r.id)}>
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
