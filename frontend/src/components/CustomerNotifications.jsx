import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaBell, 
  FaChevronDown, 
  FaChevronUp, 
  FaCheckCircle, 
  FaInfoCircle, 
  FaCalendarAlt,
  FaSearch,
  FaTimes
} from 'react-icons/fa';
import './CustomerNotifications.css';

const CustomerNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Notifications from Backend
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notifications');
      
      // Sort: Newest notifications at the top
      const sortedData = res.data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setNotifications(sortedData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Helper to format date as "Apr 4, 2026"
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Real-time Filter Logic
  const filteredNotifications = notifications.filter(notif => 
    notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notif.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (notif.formattedID && notif.formattedID.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="loading-state">Loading your updates...</div>;

  return (
    <div className="notifications-page">
      <header className="page-header">
        <div className="header-title-area">
          <FaBell className="header-icon" />
          <div>
            <h1>Notifications</h1>
            <p>Stay updated on your complaint status and loyalty rewards.</p>
          </div>
        </div>
      </header>

      <div className="notifications-container">
        
        {/* --- SEARCH BAR --- */}
        <div className="search-bar-container">
          <FaSearch className="search-bar-icon" />
          <input 
            type="text" 
            placeholder="Search by ID or keywords (e.g. 'AC', 'Loyalty')..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              <FaTimes />
            </button>
          )}
        </div>

        <div className="notif-list-card">
          {filteredNotifications.map((notif) => (
            <div 
              key={notif._id} 
              className={`notif-wrapper ${expandedId === notif._id ? 'expanded' : ''} ${notif.isUnread ? 'is-unread' : ''}`}
            >
              <div className="notif-main-row" onClick={() => toggleExpand(notif._id)}>
                {/* Status Icon based on Type */}
                <div className={`notif-status-icon ${notif.type?.toLowerCase().replace(' ', '-') || 'system'}`}>
                  {notif.type === 'Solved' ? <FaCheckCircle /> : <FaInfoCircle />}
                </div>
                
                <div className="notif-content-summary">
                  <div className="notif-top-line">
                    <span className="notif-title">{notif.title}</span>
                    <div className="badge-group">
                       {/* Added Status Pill Label */}
                      {notif.type && (
                        <span className={`status-pill-mini ${notif.type.toLowerCase().replace(' ', '-')}`}>
                          {notif.type}
                        </span>
                      )}
                      {notif.isUnread && <span className="new-badge">New</span>}
                    </div>
                  </div>
                  <p className="notif-brief">{notif.message.substring(0, 100)}...</p>
                </div>

                <div className="notif-meta">
                  <span className="notif-date">{formatDate(notif.createdAt)}</span>
                  <div className="expand-icon">
                    {expandedId === notif._id ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </div>
              </div>

              {/* Expandable Section */}
              {expandedId === notif._id && (
                <div className="notif-details-expanded">
                  <div className="details-content">
                    <div className="details-header">
                      <span>
                        <FaCalendarAlt /> Received on {formatDate(notif.createdAt)} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {/* Expanded Status Label */}
                      <span className={`status-pill-expanded ${notif.type?.toLowerCase().replace(' ', '-') || 'system'}`}>
                        Current Status: {notif.type || 'System'}
                      </span>
                    </div>
                    <div className="details-body">
                      <label>Update Details {notif.formattedID && `(${notif.formattedID})`}</label>
                      <p>{notif.message}</p>
                    </div>
                    <div className="details-footer">
                      <button className="btn-action">Help Center</button>
                      <button className="btn-secondary" onClick={() => setExpandedId(null)}>Close</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Empty Search State */}
          {filteredNotifications.length === 0 && (
            <div className="empty-notif-state">
              <p>No notifications match your search "<strong>{searchTerm}</strong>".</p>
              <button className="btn-secondary" onClick={() => setSearchTerm('')}>Clear Search</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerNotifications;