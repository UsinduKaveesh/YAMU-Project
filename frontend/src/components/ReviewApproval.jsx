import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaStar, FaRegStar, FaUser, FaChevronLeft, FaChevronRight, FaUndo } from 'react-icons/fa';
import './ReviewApproval.css';

const ReviewApproval = () => {
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('Pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/reviews');
      setReviews(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/reviews/${id}`, { status: newStatus });
      // Updates local state so the card moves to the correct tab immediately
      setReviews(prev => prev.map(r => r._id === id ? { ...r, status: newStatus } : r));
    } catch (err) {
      alert("Error updating review status");
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const filteredReviews = reviews.filter(r => {
    const status = r.status || 'Pending';
    return status === activeTab; 
  });

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      i < rating ? <FaStar key={i} className="star-filled" /> : <FaRegStar key={i} className="star-empty" />
    ));
  };

  if (loading) return <div className="loading-text">Loading YAMU Approvals...</div>;

  return (
    <div className="approval-page">
      <div className="approval-container">
        <div className="page-header">
          <h1>Review Approvals</h1>
          <span className="count-badge">{filteredReviews.length}</span>
        </div>

        <div className="tab-navigation">
          {['Pending', 'Approved', 'Rejected'].map(tab => (
            <button 
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="reviews-list">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <div key={review._id} className="approval-card-wide">
                <div className="card-left">
                  <div className="user-avatar-icon">
                    <FaUser />
                  </div>
                  
                  <div className="review-content">
                    <div className="content-header">
                      <span className="user-name">{review.passengerName || "Guest User"}</span>
                    </div>

                    <div className="ratings-inline">
                      <div className="rating-item">
                        <span className="rating-mini-label">Vehicle:</span>
                        <div className="star-row-small">{renderStars(review.vehicleRating)}</div>
                      </div>
                      <div className="rating-item">
                        <span className="rating-mini-label">Driver:</span>
                        <div className="star-row-small">{renderStars(review.driverRating)}</div>
                      </div>
                    </div>

                    <p className="review-body">"{review.overallFeedback}"</p>
                    
                    <p className="target-line">
                      <strong>Target:</strong> {review.driverName} / {review.vehicleType}
                    </p>
                  </div>
                </div>

                <div className="card-right">
                  <span className="time-stamp">{formatTime(review.createdAt)}</span>
                  
                  <div className="card-actions">
                    {/* --- Buttons for Pending Tab --- */}
                    {activeTab === 'Pending' && (
                      <>
                        <button className="btn-reject" onClick={() => handleStatusUpdate(review._id, 'Rejected')}>Reject</button>
                        <button className="btn-approve" onClick={() => handleStatusUpdate(review._id, 'Approved')}>Approve</button>
                      </>
                    )}

                    {/* --- Buttons for Approved Tab --- */}
                    {activeTab === 'Approved' && (
                      <>
                        <button className="btn-reject" onClick={() => handleStatusUpdate(review._id, 'Rejected')}>Reject</button>
                        <button className="btn-pending" onClick={() => handleStatusUpdate(review._id, 'Pending')}>
                           Pending
                        </button>
                      </>
                    )}

                    {/* --- Buttons for Rejected Tab --- */}
                    {activeTab === 'Rejected' && (
                      <>
                        <button className="btn-pending" onClick={() => handleStatusUpdate(review._id, 'Pending')}>
                           Pending
                        </button>
                        <button className="btn-approve" onClick={() => handleStatusUpdate(review._id, 'Approved')}>Approve</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">No {activeTab.toLowerCase()} reviews found.</div>
          )}
        </div>

        <div className="pagination-footer">
          <span className="results-count">Showing 1-{filteredReviews.length} of {filteredReviews.length} reviews</span>
          <div className="page-controls">
            <button className="page-nav-btn"><FaChevronLeft /></button>
            <button className="page-number active">1</button>
            <button className="page-nav-btn"><FaChevronRight /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewApproval;