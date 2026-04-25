import React, { useState, useEffect } from 'react';
import IncidentTicketForm from '../components/IncidentTicketForm';
import IncidentTicketList from '../components/IncidentTicketList';
import './IncidentTicketPage.css';

const IncidentTicketPage = ({ user }) => {
  const [activeView, setActiveView] = useState('create');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTicketCreated = () => {
    setRefreshKey(prev => prev + 1);
    setActiveView('list');
  };

  return (
    <div className="incident-ticket-page">
      <div className="page-header">
        <h1>Incident Management</h1>
        <p>Create and track incident tickets</p>
      </div>

      <div className="view-tabs">
        <button
          className={`tab-btn ${activeView === 'create' ? 'active' : ''}`}
          onClick={() => setActiveView('create')}
        >
          Create Ticket
        </button>
        <button
          className={`tab-btn ${activeView === 'list' ? 'active' : ''}`}
          onClick={() => setActiveView('list')}
        >
          My Tickets
        </button>
      </div>

      <div className="tab-content">
        {activeView === 'create' && (
          <IncidentTicketForm 
            user={user} 
            onTicketCreated={handleTicketCreated}
          />
        )}
        {activeView === 'list' && (
          <IncidentTicketList 
            user={user} 
            isAdmin={false}
            key={refreshKey}
          />
        )}
      </div>
    </div>
  );
};

export default IncidentTicketPage;
