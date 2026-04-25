import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './IncidentTicketList.css';

const IncidentTicketList = ({ user, isAdmin = false }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showResponseModal, setShowResponseModal] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, [currentPage, statusFilter, priorityFilter, isAdmin]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let url;
      
      if (isAdmin) {
        url = 'http://localhost:8080/api/incident-tickets/all';
      } else {
        url = 'http://localhost:8080/api/incident-tickets/my-tickets';
      }
      
      const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: { page: currentPage, size: 10 }
      });
      
      setTickets(response.data.content || response.data);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      setError('Failed to fetch tickets');
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredTickets = async (filterType, filterValue) => {
    try {
      const token = localStorage.getItem('token');
      let url;
      
      if (filterType === 'status') {
        url = `http://localhost:8080/api/incident-tickets/by-status/${filterValue}`;
      } else if (filterType === 'priority') {
        url = `http://localhost:8080/api/incident-tickets/by-priority/${filterValue}`;
      }
      
      const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setTickets(response.data);
    } catch (err) {
      console.error('Error fetching filtered tickets:', err);
    }
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    if (value !== 'ALL') {
      fetchFilteredTickets('status', value);
    } else {
      fetchTickets();
    }
  };

  const handlePriorityFilterChange = (value) => {
    setPriorityFilter(value);
    if (value !== 'ALL') {
      fetchFilteredTickets('priority', value);
    } else {
      fetchTickets();
    }
  };

  const handleResponseSubmit = async () => {
    if (!responseText.trim()) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8080/api/incident-tickets/${selectedTicket.id}/respond`,
        { response: responseText },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setShowResponseModal(false);
      setResponseText('');
      setSelectedTicket(null);
      fetchTickets();
    } catch (err) {
      console.error('Error submitting response:', err);
    }
  };

  const handleStatusUpdate = async (ticketId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8080/api/incident-tickets/${ticketId}/status`,
        { status: newStatus },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      fetchTickets();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return '#dc3545';
      case 'MEDIUM': return '#ffc107';
      case 'LOW': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return '#007bff';
      case 'IN_PROGRESS': return '#ffc107';
      case 'RESOLVED': return '#28a745';
      case 'CLOSED': return '#6c757d';
      default: return '#6c757d';
    }
  };

  if (loading) return <div className="loading">Loading tickets...</div>;

  return (
    <div className="incident-ticket-list">
      <div className="list-header">
        <h2>{isAdmin ? 'All Incident Tickets' : 'My Incident Tickets'}</h2>
        
        {!isAdmin && (
          <div className="filters">
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => handlePriorityFilterChange(e.target.value)}
            >
              <option value="ALL">All Priority</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="tickets-container">
        {tickets.length === 0 ? (
          <div className="no-tickets">
            <p>No tickets found</p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket.id} className="ticket-card">
              <div className="ticket-header">
                <div className="ticket-title">
                  <h3>{ticket.title}</h3>
                  <span className="ticket-id">#{ticket.id}</span>
                </div>
                <div className="ticket-meta">
                  <span
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(ticket.priority) }}
                  >
                    {ticket.priority}
                  </span>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(ticket.status) }}
                  >
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              
              <div className="ticket-content">
                <p className="ticket-message">{ticket.message}</p>
                
                <div className="ticket-details">
                  <div className="detail-row">
                    <strong>Contact:</strong> {ticket.phoneNumber}
                  </div>
                  <div className="detail-row">
                    <strong>Email:</strong> {ticket.userEmail}
                  </div>
                  {ticket.uploadUrl && (
                    <div className="detail-row">
                      <strong>URL:</strong> 
                      <a href={ticket.uploadUrl} target="_blank" rel="noopener noreferrer">
                        {ticket.uploadUrl}
                      </a>
                    </div>
                  )}
                  {ticket.attachmentPath && (
                    <div className="detail-row">
                      <strong>Attachment:</strong> Available
                    </div>
                  )}
                  <div className="detail-row">
                    <strong>Created:</strong> {new Date(ticket.createdAt).toLocaleString()}
                  </div>
                </div>
                
                {ticket.adminResponse && (
                  <div className="admin-response">
                    <h4>Admin Response:</h4>
                    <p>{ticket.adminResponse}</p>
                    {ticket.respondedBy && (
                      <small>Responded by: {ticket.respondedBy}</small>
                    )}
                  </div>
                )}
              </div>
              
              {isAdmin && ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && (
                <div className="ticket-actions">
                  <button
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setShowResponseModal(true);
                    }}
                    className="respond-btn"
                  >
                    Respond
                  </button>
                  
                  <select
                    onChange={(e) => handleStatusUpdate(ticket.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="">Update Status</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
          >
            Previous
          </button>
          <span>Page {currentPage + 1} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage === totalPages - 1}
          >
            Next
          </button>
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && selectedTicket && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Respond to Ticket #{selectedTicket.id}</h3>
              <button
                onClick={() => setShowResponseModal(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="ticket-summary">
                <h4>{selectedTicket.title}</h4>
                <p>{selectedTicket.message}</p>
              </div>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Enter your response..."
                rows="6"
              />
            </div>
            <div className="modal-actions">
              <button
                onClick={() => setShowResponseModal(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={handleResponseSubmit}
                className="submit-btn"
                disabled={!responseText.trim()}
              >
                Send Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentTicketList;
