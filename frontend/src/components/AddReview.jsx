import React, { useState } from 'react';
import axios from 'axios';
import { FaStar, FaRegStar, FaUser, FaCheckCircle, FaCarSide } from 'react-icons/fa'; 
import './AddReview.css';

const AddReview = ({ bookingId, driverName, driverId, passengerName, vehicleType }) => {
  const [vRating, setVRating] = useState(0);
  const [dRating, setDRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (vRating === 0 || dRating === 0) {
      alert("Please provide both vehicle and driver ratings.");
      return;
    }

    const reviewData = {
      bookingId,
      driverId,
      passengerName: passengerName || "Guest User",
      driverName,
      vehicleType: vehicleType || "Standard Ride",
      vehicleRating: vRating,
      driverRating: dRating,
      overallFeedback: feedback
    };

    try {
      await axios.post('http://localhost:5000/api/reviews', reviewData);
      setIsSubmitted(true); 
    } catch (err) {
      console.error("Backend Error:", err);
      alert("Submission failed: " + (err.response?.data?.message || "Server error"));
    }
  };

  if (isSubmitted) {
    return (
      <div className="main-container">
        <div className="review-card success-card">
          <div className="success-icon-container">
            <FaCheckCircle className="success-icon-big" />
          </div>
          <h2>Thank You!</h2>
          <p className="success-message">
            Your feedback for <strong>{driverName}</strong> and the <strong>{vehicleType}</strong> has been recorded. 
          </p>
          <button 
            className="submit-btn" 
            onClick={() => window.location.reload()} 
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="review-card">
        {/* --- HEADER SECTION (Matched to other screens) --- */}
        <div className="header-title-area">
          <FaStar className="header-icon" />
          <div>
            <h3>Rate Your Experience</h3>
            <p className="booking-id">Booking Reference: #{bookingId}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* --- VEHICLE RATING SECTION --- */}
          <div className="rating-section">
            <label>How was the vehicle?</label>
            <div className="vehicle-profile">
              <div className="avatar vehicle-icon-bg"><FaCarSide /></div>
              <span className="vehicle-name">{vehicleType}</span>
            </div>
            <div className="star-rating">
              {[...Array(5)].map((_, i) => {
                const val = i + 1;
                return (
                  <span key={i} onClick={() => setVRating(val)}>
                    {val <= vRating ? <FaStar className="star filled" /> : <FaRegStar className="star empty" />}
                  </span>
                );
              })}
            </div>
          </div>

          {/* --- DRIVER RATING SECTION --- */}
          <div className="rating-section">
            <label>Rate your driver</label>
            <div className="driver-profile">
              <div className="avatar"><FaUser className="user-icon" /></div>
              <span className="driver-name">{driverName}</span>
            </div>
            <div className="star-rating">
              {[...Array(5)].map((_, i) => {
                const val = i + 1;
                return (
                  <span key={i} onClick={() => setDRating(val)}>
                    {val <= dRating ? <FaStar className="star filled" /> : <FaRegStar className="star empty" />}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="feedback-section">
            <label>Overall Feedback</label>
            <textarea 
              value={feedback} 
              onChange={(e) => setFeedback(e.target.value)} 
              placeholder="Share your experience with us..."
              rows="6"
              required
            />
          </div>

          <div className="action-buttons">
            <button type="button" className="skip-btn">Skip</button>
            <button type="submit" className="submit-btn">Submit Review</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReview;