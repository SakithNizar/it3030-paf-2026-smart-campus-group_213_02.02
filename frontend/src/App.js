import React from 'react';
import "./App.css";
// import ResourceList from "./pages/ResourceList"; // 1. Commented out the import
import BookingManager from './components/BookingManager';

function App() {
  return (
    <div className="container">
      <h1>🏫 Smart Campus Resource Management</h1>
      
      {/* 2. Muted teammate's component to prevent Network Errors */}
      {/* <ResourceList /> */} 

      <BookingManager />
    </div>
  );
}

export default App;