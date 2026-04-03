import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaUserCircle, FaTimes, FaFilter, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './DisputeManagement.css';

const DisputeManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All'); // New State
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/complaints');
      setTickets(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/complaints/${id}`, { status: newStatus });
      fetchTickets(); 
      setSelectedTicket(null);
    } catch (err) {
      alert("Failed to update ticket status");
    }
  };

  // --- Search & Filter Logic ---
  const filteredTickets = tickets.filter(t => {
    // Generate the same ID format used in the table for searching
    const formattedID = `#TC-${t._id.slice(-4).toUpperCase()}`;
    
    const matchesSearch = 
      formattedID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.bookingReference.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
    const matchesPriority = filterPriority === 'All' || t.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (loading) return <div className="loading-state">Loading Dispute Records...</div>;

  return (
    <div className="dispute-mgmt-container">
      <header className="dispute-header">
        <h1>Dispute Management</h1>
        
        <div className="controls-row">
          {/* Search Box Group */}
          <div className="search-group">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by Ticket ID, Subject or Booking..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters Group (Separated for UI spacing) */}
          <div className="filters-group">
            <div className="filter-item">
              <select className="filter-dropdown" onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Solved">Solved</option>
              </select>
            </div>

            <div className="filter-item">
              <select className="filter-dropdown" onChange={(e) => setFilterPriority(e.target.value)}>
                <option value="All">All Priorities</option>
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="main-table-card">
        <table className="dispute-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Customer</th>
              <th>Category</th>
              <th>Subject</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr key={ticket._id}>
                <td className="ticket-id">#TC-{ticket._id.slice(-4).toUpperCase()}</td>
                <td className="customer-cell">
                  <FaUserCircle className="user-icon" />
                  <span>Usindu K.</span>
                </td>
                <td>{ticket.category}</td>
                <td className="subject-text">{ticket.subject}</td>
                <td>
                  <span className={`badge priority ${ticket.priority.toLowerCase()}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td>
                  <span className={`badge status ${ticket.status.toLowerCase().replace(' ', '-')}`}>
                    {ticket.status}
                  </span>
                </td>
                <td>{new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                <td>
                  <button className="btn-view-action" onClick={() => setSelectedTicket(ticket)}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer info matching your screenshot */}
        <div className="pagination-footer">
          <p>Showing 1-{filteredTickets.length} of {tickets.length} complaints</p>
          <div className="page-btns">
            <button className="page-nav"><FaChevronLeft /> Previous</button>
            <button className="page-num active">1</button>
            <button className="page-nav">Next <FaChevronRight /></button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedTicket && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Ticket Details: #TC-{selectedTicket._id.slice(-4).toUpperCase()}</h3>
              <button className="close-modal" onClick={() => setSelectedTicket(null)}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <div className="modal-row">
                <div className="modal-info-item">
                  <label>Subject</label>
                  <p>{selectedTicket.subject}</p>
                </div>
                <div className="modal-info-item">
                  <label>Booking Reference</label>
                  <p className="booking-ref-text">{selectedTicket.bookingReference}</p>
                </div>
              </div>
              <div className="modal-info-item full-width">
                <label>Complaint Description</label>
                <div className="description-box">{selectedTicket.description}</div>
              </div>
              <div className="modal-footer-actions">
                <label>Update Lifecycle Status:</label>
                <div className="status-button-group">
                  <button className="btn-status pending" onClick={() => handleStatusUpdate(selectedTicket._id, 'Pending')}>Pending</button>
                  <button className="btn-status review" onClick={() => handleStatusUpdate(selectedTicket._id, 'Under Review')}>Under Review</button>
                  <button className="btn-status solved" onClick={() => handleStatusUpdate(selectedTicket._id, 'Solved')}>Solved</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisputeManagement;