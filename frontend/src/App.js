import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OAuthCallback from "./pages/OAuthCallback";
import Dashboard from "./pages/Dashboard";
import ResourceList from "./pages/ResourceList";
import UserResourceView from "./pages/UserResourceView";
import BookingsPage from "./pages/BookingsPage";
import UsersPage from "./pages/UsersPage";

function PlaceholderPage({ title, description }) {
  return (
    <div style={{ backgroundColor: "white", borderRadius: 16, padding: "60px 32px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
      <h2 style={{ margin: "0 0 8px", color: "#111827", fontSize: 20, fontWeight: 700 }}>{title}</h2>
      <p style={{ color: "#6B7280", fontSize: 14, margin: 0 }}>{description || "This section is coming soon."}</p>
    </div>
  );
}

function FacilitiesPage() {
  const { user } = useAuth();
  return user?.role === "ADMIN" ? <ResourceList /> : <UserResourceView />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/oauth2/callback" element={<OAuthCallback />} />

          {/* Authenticated */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard"  element={<Dashboard />} />
              <Route path="/facilities" element={<FacilitiesPage />} />
              <Route path="/bookings"   element={<BookingsPage />} />
              <Route path="/incidents"  element={<PlaceholderPage title="Incident Tickets" description="Being implemented by another team member — check back soon." />} />
              <Route path="/users"      element={<UsersPage />} />
            </Route>
          </Route>

          {/* Redirects */}
          <Route path="/"      element={<Navigate to="/dashboard" replace />} />
          <Route path="/admin" element={<Navigate to="/facilities" replace />} />
          <Route path="/user"  element={<Navigate to="/facilities" replace />} />
          <Route path="*"      element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
