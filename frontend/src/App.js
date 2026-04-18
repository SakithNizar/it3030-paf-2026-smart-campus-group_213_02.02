import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import ResourceList from "./pages/ResourceList";        // Admin
import UserResourceView from "./pages/UserResourceView"; // User (view resources)
import BookingManager from "./components/BookingManager"; // User booking

function App() {
  return (
    <Router>
      <div className="container">
        <h1>🏫 Smart Campus Resource Management</h1>

        {/* 🔝 Navigation */}
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/admin" style={{ marginRight: "20px" }}>
            👨‍💼 Admin
          </Link>
          <Link to="/user">👤 User</Link>
        </nav>

        <Routes>
          {/* 👨‍💼 ADMIN PAGE */}
          <Route path="/admin" element={<ResourceList />} />

          {/* 👤 USER PAGE */}
          <Route
            path="/user"
            element={
              <>
                <UserResourceView />
                <BookingManager />
              </>
            }
          />

          {/* 🔁 Default route */}
          <Route
            path="*"
            element={
              <>
                <UserResourceView />
                <BookingManager />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
