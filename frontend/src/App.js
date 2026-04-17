import React from 'react';
import './App.css';
import BookingManager from './components/BookingManager';

function App() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Smart Campus System</h1>
      {/* Your new component is injected right here! */}
      <BookingManager /> 
    </div>
  );
}

export default App;