import React, { useState } from 'react';
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
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock Data
  const [notifications] = useState([
    {
      id: 1,
      category: 'Solved',
      title: 'Complaint #TC-882 Solved',
      message: 'Your complaint regarding the AC in Tesla Model 3 has been resolved.',
      details: 'Our maintenance team inspected vehicle Plate #WP-K1234. The AC compressor was replaced. We have credited 50 loyalty points to your account as a gesture of goodwill. Thank you for your patience.',
      date: 'Apr 02, 2026',
      time: '02:30 PM',
      isUnread: true
    },
    {
      id: 2,
      category: 'System',
      title: 'Loyalty Milestone Reached!',
      message: 'You have earned 100 bonus points for completing 20 rides this month.',
      details: 'Congratulations! You are now just 200 points away from unlocking "Elite Status," which grants you access to luxury vehicle pre-booking and specialized drivers.',
      date: 'Apr 01, 2026',
      time: '10:15 AM',
      isUnread: false
    },
    {
      id: 3,
      category: 'System',
      title: 'Profile Verified',
      message: 'Your account identity verification is complete.',
      details: 'Your documents have been successfully processed. You can now enjoy full access to all YAMU Customer Portal features, including dispute filing and priority support.',
      date: 'Mar 28, 2026',
      time: '09:00 AM',
      isUnread: false
    }
  ]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // --- Real-time Filter Logic ---
  const filteredNotifications = notifications.filter(notif => 
    notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notif.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              key={notif.id} 
              className={`notif-wrapper ${expandedId === notif.id ? 'expanded' : ''} ${notif.isUnread ? 'is-unread' : ''}`}
            >
              <div className="notif-main-row" onClick={() => toggleExpand(notif.id)}>
                <div className={`notif-status-icon ${notif.category.toLowerCase()}`}>
                  {notif.category === 'Solved' ? <FaCheckCircle /> : <FaInfoCircle />}
                </div>
                
                <div className="notif-content-summary">
                  <div className="notif-top-line">
                    <span className="notif-title">{notif.title}</span>
                    {notif.isUnread && <span className="new-badge">New</span>}
                  </div>
                  <p className="notif-brief">{notif.message}</p>
                </div>

                <div className="notif-meta">
                  <span className="notif-date">{notif.date}</span>
                  <div className="expand-icon">
                    {expandedId === notif.id ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </div>
              </div>

              {/* Expandable Section */}
              {expandedId === notif.id && (
                <div className="notif-details-expanded">
                  <div className="details-content">
                    <div className="details-header">
                      <span><FaCalendarAlt /> Received on {notif.date} at {notif.time}</span>
                    </div>
                    <div className="details-body">
                      <label>Full Update Message</label>
                      <p>{notif.details}</p>
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