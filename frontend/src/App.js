import React from 'react';
import "./App.css";
import ResourceList from "./pages/ResourceList";
import BookingManager from './components/BookingManager';

function App() {
  return (
    <div className="container">
      <h1>🏫 Smart Campus Resource Management</h1>
      <ResourceList />
      <BookingManager />
    </div>
  );
}

export default App;