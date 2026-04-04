import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaSearch, FaUserCircle, FaTimes, FaFilter, 
  FaChevronLeft, FaChevronRight, FaPaperPlane, FaCheckCircle 
} from 'react-icons/fa';
import './DisputeManagement.css';

const DisputeManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  
  const [notificationMessage, setNotificationMessage] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastUpdatedId, setLastUpdatedId] = useState('');

  const statusMessages = {
    'Pending': "Hello, we have received your complaint. It is currently placed in our 'Pending' queue and will be assigned to a specialist shortly.",
    'Under Review': "We are currently investigating the details of your complaint. Our team is reviewing the booking and driver logs. We will update you soon.",
    'Solved': "Good news! Your complaint has been resolved. We have taken the necessary actions based on your feedback. Thank you for your patience."
  };

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

  const handleStatusClick = (status) => {
    setSelectedStatus(status);
    setNotificationMessage(statusMessages[status] || '');
  };

  const handleSendNotification = async () => {
    if (!selectedStatus) {
      alert("Please select a status first.");
      return;
    }
    try {
      const ticketId = selectedTicket._id;
      const formattedID = `#TC-${ticketId.slice(-4).toUpperCase()}`;
      setLastUpdatedId(formattedID);

      await axios.patch(`http://localhost:5000/api/complaints/${ticketId}`, { status: selectedStatus });
      await axios.post('http://localhost:5000/api/notifications', {
        userId: selectedTicket.userId, 
        ticketId: ticketId,
        formattedID: formattedID,
        title: `Complaint Update: ${selectedStatus}`,
        message: notificationMessage,
        type: selectedStatus
      });

      setShowSuccess(true);
      fetchTickets(); 
      setSelectedTicket(null);
      setNotificationMessage('');
      setSelectedStatus('');
    } catch (err) {
      alert(`❌ Error: ${err.response?.data?.error || err.message}`);
    }
  };

  const filteredTickets = tickets.filter(t => {
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
      {/* ... (Header and Table code remains standard) ... */}
      <header className="dispute-header">
        <h1>Dispute Management</h1>
        <div className="controls-row">
          <div className="search-group">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by Ticket ID, Subject or Booking..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
                <td><span className={`badge priority ${ticket.priority.toLowerCase()}`}>{ticket.priority}</span></td>
                <td><span className={`badge status ${ticket.status.toLowerCase().replace(' ', '-')}`}>{ticket.status}</span></td>
                <td>{new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                <td><button className="btn-view-action" onClick={() => setSelectedTicket(ticket)}>View Details</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RE-STRUCTURED MODAL */}
      {selectedTicket && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Ticket Details: #TC-{selectedTicket._id.slice(-4).toUpperCase()}</h3>
              <button className="close-modal" onClick={() => {setSelectedTicket(null); setNotificationMessage(''); setSelectedStatus('');}}><FaTimes /></button>
            </div>
            <div className="modal-body">
              {/* Restored the modal-row grid structure */}
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

              {/* Status Section */}
              <div className="modal-footer-actions">
                <label>Update Lifecycle Status:</label>
                <div className="status-button-group">
                  <button className={`btn-status pending ${selectedStatus === 'Pending' ? 'active' : ''}`} onClick={() => handleStatusClick('Pending')}>Pending</button>
                  <button className={`btn-status review ${selectedStatus === 'Under Review' ? 'active' : ''}`} onClick={() => handleStatusClick('Under Review')}>Under Review</button>
                  <button className={`btn-status solved ${selectedStatus === 'Solved' ? 'active' : ''}`} onClick={() => handleStatusClick('Solved')}>Solved</button>
                </div>
              </div>

              {/* Notification Section */}
              <div className="modal-notification-section">
                <label>Send Notification to Customer:</label>
                <textarea 
                  className="notification-textarea"
                  placeholder="The default status message will appear here..."
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                />
                <button className="btn-send-notif" onClick={handleSendNotification}>
                  <FaPaperPlane /> Send Notification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP */}
      {showSuccess && (
        <div className="success-popup-overlay">
          <div className="success-popup-content">
            <div className="success-icon-circle"><FaCheckCircle /></div>
            <h2>Notification Sent!</h2>
            <p>Ticket <strong>{lastUpdatedId}</strong> has been successfully updated.</p>
            <button className="btn-success-close" onClick={() => setShowSuccess(false)}>Back to Dashboard</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisputeManagement;