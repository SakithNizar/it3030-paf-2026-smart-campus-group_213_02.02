import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IncidentTicketList from './IncidentTicketList';
import './AdminDashboard.css';

const AdminDashboard = ({ user }) => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:8080/api/incident-tickets/stats',
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setStats(response.data);
    } catch (err) {
      setError('Failed to fetch statistics');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, color, icon }) => (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">
        {icon}
      </div>
      <div className="stat-content">
        <h3>{title}</h3>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  );

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Incident Management System</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'tickets' ? 'active' : ''}`}
          onClick={() => setActiveTab('tickets')}
        >
          All Tickets
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="overview-section">
          <div className="stats-grid">
            <StatCard
              title="Open Tickets"
              value={stats.openTickets || 0}
              color="blue"
              icon="📋"
            />
            <StatCard
              title="In Progress"
              value={stats.inProgressTickets || 0}
              color="yellow"
              icon="⚡"
            />
            <StatCard
              title="Resolved"
              value={stats.resolvedTickets || 0}
              color="green"
              icon="✅"
            />
            <StatCard
              title="High Priority"
              value={stats.highPriorityTickets || 0}
              color="red"
              icon="🚨"
            />
            <StatCard
              title="Medium Priority"
              value={stats.mediumPriorityTickets || 0}
              color="orange"
              icon="⚠️"
            />
            <StatCard
              title="Low Priority"
              value={stats.lowPriorityTickets || 0}
              color="teal"
              icon="ℹ️"
            />
          </div>

          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <button
                onClick={() => setActiveTab('tickets')}
                className="action-btn primary"
              >
                View All Tickets
              </button>
              <button
                onClick={() => window.location.reload()}
                className="action-btn secondary"
              >
                Refresh Stats
              </button>
            </div>
          </div>

          <div className="recent-activity">
            <h2>System Overview</h2>
            <div className="activity-grid">
              <div className="activity-card">
                <h3>Ticket Distribution</h3>
                <div className="progress-bars">
                  <div className="progress-item">
                    <span>Open: {stats.openTickets || 0}</span>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill blue"
                        style={{ 
                          width: `${stats.openTickets ? (stats.openTickets / (stats.openTickets + stats.inProgressTickets + stats.resolvedTickets)) * 100 : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                  <div className="progress-item">
                    <span>In Progress: {stats.inProgressTickets || 0}</span>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill yellow"
                        style={{ 
                          width: `${stats.inProgressTickets ? (stats.inProgressTickets / (stats.openTickets + stats.inProgressTickets + stats.resolvedTickets)) * 100 : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                  <div className="progress-item">
                    <span>Resolved: {stats.resolvedTickets || 0}</span>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill green"
                        style={{ 
                          width: `${stats.resolvedTickets ? (stats.resolvedTickets / (stats.openTickets + stats.inProgressTickets + stats.resolvedTickets)) * 100 : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="activity-card">
                <h3>Priority Breakdown</h3>
                <div className="priority-charts">
                  <div className="priority-item">
                    <div className="priority-indicator high"></div>
                    <span>High: {stats.highPriorityTickets || 0}</span>
                  </div>
                  <div className="priority-item">
                    <div className="priority-indicator medium"></div>
                    <span>Medium: {stats.mediumPriorityTickets || 0}</span>
                  </div>
                  <div className="priority-item">
                    <div className="priority-indicator low"></div>
                    <span>Low: {stats.lowPriorityTickets || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tickets' && (
        <div className="tickets-section">
          <IncidentTicketList user={user} isAdmin={true} />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
