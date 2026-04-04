import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaRoute, FaStar, FaTrophy, FaExclamationCircle, FaCarSide, 
  FaUserTie, FaBell, FaTimes, FaCheckCircle, FaInfoCircle, 
  FaThLarge, FaQuoteLeft, FaUserCircle 
} from 'react-icons/fa';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // State for Dynamic Notifications
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifs, setLoadingNotifs] = useState(true);

  // Fetch Reviews and Notifications
  useEffect(() => {
    const fetchData = async () => {
      try {
        const revResponse = await axios.get('http://localhost:5000/api/reviews');
        
        // Filter approved and sort by newest date first
        const sortedReviews = revResponse.data
          .filter(rev => rev.status === 'Approved')
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          
        setReviews(sortedReviews);
        setLoadingReviews(false);

        const notifResponse = await axios.get('http://localhost:5000/api/notifications');
        
        // Ensure newest notifications are ALWAYS at the top
        const sortedNotifs = notifResponse.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setNotifications(sortedNotifs);
        setLoadingNotifs(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setLoadingReviews(false);
        setLoadingNotifs(false);
      }
    };
    fetchData();
  }, []);

  // Badge still counts ALL unread notifications in the background
  const unreadCount = notifications.filter(n => n.isUnread).length;

  const handleMarkAsRead = async (notifId) => {
    try {
      await axios.patch(`http://localhost:5000/api/notifications/${notifId}`, { isUnread: false });
      setNotifications(notifications.map(n => n._id === notifId ? { ...n, isUnread: false } : n));
      setSelectedNotification(null);
    } catch (err) {
      console.error("Error marking notification as read:", err);
      setSelectedNotification(null);
    }
  };

  const ReviewCard = ({ rev }) => (
    <div className="review-feed-card">
      <div className="review-card-top">
        <div className="reviewer-info">
          <FaUserCircle className="reviewer-avatar" />
          <div>
            <p className="reviewer-name">{rev.passengerName} <FaCheckCircle className="verified-check" /></p>
            <span className="review-date">
              {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              }) : 'Recent'}
            </span>
          </div>
        </div>
        <div className="dual-rating-display">
          <div className="rating-row">
            <span className="rating-label">Vehicle</span>
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < rev.vehicleRating ? "filled" : "empty"} />
              ))}
            </div>
          </div>
          <div className="rating-row">
            <span className="rating-label">Driver</span>
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < rev.driverRating ? "filled" : "empty"} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="review-context-tags">
        <span className="tag driver-tag"><FaUserTie /> {rev.driverName}</span>
        <span className="tag vehicle-tag"><FaCarSide /> {rev.vehicleType}</span>
      </div>
      <p className="review-comment">"{rev.overallFeedback}"</p>
    </div>
  );

  return (
    <div className="customer-dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="header-title-area">
            <FaThLarge className="header-icon" />
            <div>
              <h1>Dashboard</h1>
              <p>Welcome back! Here's what's happening with your account.</p>
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="notification-bell-container">
            <button className="bell-btn" onClick={() => setShowNotifications(!showNotifications)}>
              <FaBell />
              {unreadCount > 0 && <span className="bell-badge">{unreadCount}</span>}
            </button>
            
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="dropdown-header"><h3>Notifications</h3></div>
                <div className="notif-list">
                  {loadingNotifs ? (
                    <p style={{ padding: '20px', textAlign: 'center', fontSize: '14px', color: '#64748b' }}>
                      Checking for updates...
                    </p>
                  ) : notifications.length > 0 ? (
                    /* Slicing to only show the 5 most recent in the popup */
                    notifications.slice(0, 5).map(notif => (
                      <div 
                        key={notif._id} 
                        className={`notif-item ${notif.isUnread ? 'unread' : ''}`} 
                        onClick={() => { setSelectedNotification(notif); setShowNotifications(false); }}
                      >
                        <div className={`notif-icon ${notif.type?.toLowerCase().replace(' ', '-') || 'system'}`}>
                          {notif.type === 'Solved' ? <FaCheckCircle /> : <FaInfoCircle />}
                        </div>
                        <div className="notif-text">
                          <div className="notif-header-row">
                            <p className="notif-title">{notif.title}</p>
                            {notif.type && (
                              <span className={`status-pill ${notif.type.toLowerCase().replace(' ', '-')}`}>
                                {notif.type}
                              </span>
                            )}
                          </div>
                          <p className="notif-snippet">{notif.message.substring(0, 45)}...</p>
                          <span className="notif-time">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ padding: '20px', textAlign: 'center', fontSize: '14px', color: '#64748b' }}>
                      No new notifications
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon rides"><FaCarSide /></div>
          <div className="stat-info"><span className="stat-label">Total Rides</span><h3 className="stat-value">24</h3></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon distance"><FaRoute /></div>
          <div className="stat-info"><span className="stat-label">Distance</span><h3 className="stat-value">142 km</h3></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon loyalty"><FaTrophy /></div>
          <div className="stat-info"><span className="stat-label">Loyalty</span><h3 className="stat-value">1,250 pts</h3></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon disputes"><FaExclamationCircle /></div>
          <div className="stat-info">
            <span className="stat-label">Disputes</span>
            <h3 className="stat-value">{notifications.filter(n => n.type !== 'system' && n.type !== undefined).length}</h3>
          </div>
        </div>
      </div>

      {/* Rankings Section */}
      <div className="rankings-container">
        <div className="ranking-box">
          <div className="box-header"><h3><FaUserTie /> Top Rated Drivers</h3></div>
          <div className="ranking-list">
            {[
              { id: 1, name: "Michael Johnson", rating: 4.98, rides: "1,240", rank: 1 },
              { id: 2, name: "Sarah Williams", rating: 4.95, rides: "980", rank: 2 },
              { id: 3, name: "David Kim", rating: 4.92, rides: "850", rank: 3 },
              { id: 4, name: "Jessica Martinez", rating: 4.88, rides: "720", rank: 4 },
            ].map((d) => (
              <div key={d.id} className={`ranking-item rank-${d.rank}`}>
                <div className="rank-number">{d.rank}</div>
                <div className="item-details"><p className="item-name">{d.name}</p><span className="item-subtext">{d.rides} Rides</span></div>
                <div className="item-rating"><FaStar className="star-icon" /> {d.rating}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="ranking-box">
          <div className="box-header"><h3><FaCarSide /> Top Rated Vehicles</h3></div>
          <div className="ranking-list">
            {[
              { id: 1, model: "Tesla Model 3", type: "Luxury", rating: 4.99, rank: 1 },
              { id: 2, model: "BMW i4", type: "Business", rating: 4.96, rank: 2 },
              { id: 3, model: "Hyundai Ioniq 5", type: "Standard", rating: 4.91, rank: 3 },
              { id: 4, model: "Toyota Prius", type: "Eco", rating: 4.85, rank: 4 },
            ].map((v) => (
              <div key={v.id} className={`ranking-item rank-${v.rank}`}>
                <div className="rank-number">{v.rank}</div>
                <div className="item-details"><p className="item-name">{v.model}</p><span className="item-subtext">{v.type}</span></div>
                <div className="item-rating"><FaStar className="star-icon" /> {v.rating}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <div className="section-header">
          <div className="section-header-left">
            <h3><FaQuoteLeft className="quote-icon" /> Recent Customer Reviews</h3>
          </div>
          <button className="view-all-btn" onClick={() => setShowAllReviews(true)}>View All</button>
        </div>

        {loadingReviews ? (
          <div className="loading-state">Loading latest feedback...</div>
        ) : (
          <div className="reviews-grid">
            {reviews.slice(0, 6).map((rev) => (
              <ReviewCard key={rev._id} rev={rev} />
            ))}
          </div>
        )}
      </div>

      {/* NOTIFICATION DETAIL MODAL */}
      {selectedNotification && (
        <div className="modal-overlay">
          <div className="modal-content notification-detail-modal">
            <div className="modal-header">
              <h3>Notification Detail</h3>
              <button className="close-modal" onClick={() => setSelectedNotification(null)}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <div className="notif-detail-meta">
                <span className={`status-pill ${selectedNotification.type?.toLowerCase().replace(' ', '-') || 'system'}`}>
                  {selectedNotification.type || 'System Update'}
                </span>
                <span className="notif-detail-time">
                  {new Date(selectedNotification.createdAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </span>
              </div>
              <h2 className="notif-detail-title">{selectedNotification.title}</h2>
              
              <div className="notif-detail-box">
                <label>Admin Message</label>
                <p className="notif-detail-msg">{selectedNotification.message}</p>
              </div>

              <div className="notif-detail-box secondary">
                <label>Ticket Reference</label>
                <p>{selectedNotification.formattedID || 'Complaint Update'}</p>
              </div>
              
              <button className="btn-mark-read" onClick={() => handleMarkAsRead(selectedNotification._id)}>
                Close & Mark as Read
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All Reviews Modal */}
      {showAllReviews && (
        <div className="modal-overlay">
          <div className="modal-content all-reviews-modal">
            <div className="modal-header">
              <h3>Our Customer Reviews</h3>
              <button className="close-modal" onClick={() => setShowAllReviews(false)}><FaTimes /></button>
            </div>
            <div className="modal-body scrollable-reviews">
              <div className="full-reviews-list">
                {reviews.map((rev) => (
                  <ReviewCard key={rev._id} rev={rev} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;