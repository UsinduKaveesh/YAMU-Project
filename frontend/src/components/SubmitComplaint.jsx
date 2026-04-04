import React, { useState } from 'react';
import axios from 'axios';
import { FaCloudUploadAlt, FaCheckCircle, FaExclamationCircle, FaLifeRing } from 'react-icons/fa';
import './SubmitComplaint.css';

const SubmitComplaint = ({ bookingId }) => {
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    bookingReference: bookingId || '',
    priority: 'Low',
    description: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsError(false);
    try {
      await axios.post('http://localhost:5000/api/complaints', formData);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Error submitting complaint", err);
      setIsError(true);
    }
  };

  // --- Updated Success Return Block ---
if (isSubmitted) {
  return (
    /* Added 'success-view' class here to handle the centering */
    <div className="complaint-container success-view"> 
      <div className="complaint-form-card success-state">
        <div className="success-icon-container">
          <FaCheckCircle className="success-icon-big" />
        </div>
        <h2>Complaint Submitted!</h2>
        <p className="success-message">
          Your ticket for booking <strong>#{formData.bookingReference}</strong> has been successfully created. 
        </p>
        <button className="btn-submit" onClick={() => window.location.reload()}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

  return (
    <div className="complaint-container">
      <div className="complaint-form-card">
        <div className="header-title-area">
          <FaLifeRing className="header-icon" />
          <div>
            <h1>Submit a Complaint</h1>
            <p className="subtitle">Please provide details about the issue you encountered.</p>
          </div>
        </div>
        
        {isError && (
          <div className="error-banner">
            <FaExclamationCircle /> Failed to submit. Please check your connection.
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Subject <span className="required">*</span></label>
            <input 
              type="text" 
              name="subject"
              placeholder="Brief description of your complaint" 
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Category <span className="required">*</span></label>
              <select name="category" onChange={handleChange} required>
                <option value="">Select a category</option>
                <option value="Vehicle Issue">Vehicle Issue</option>
                <option value="Billing">Billing</option>
                <option value="Service">Service</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group flex-1">
              <label>Booking Reference</label>
              <input 
                type="text" 
                name="bookingReference"
                placeholder="e.g. BK12131341" 
                value={formData.bookingReference}
                onChange={handleChange}
              />
            </div>

            <div className="form-group flex-1">
              <label>Priority <span className="required">*</span></label>
              <div className="priority-options">
                <label className="radio-label">
                  <input type="radio" name="priority" value="Low" checked={formData.priority === 'Low'} onChange={handleChange} />
                  <span className="dot low"></span> Low
                </label>
                <label className="radio-label">
                  <input type="radio" name="priority" value="Medium" checked={formData.priority === 'Medium'} onChange={handleChange} />
                  <span className="dot medium"></span> Med
                </label>
                <label className="radio-label">
                  <input type="radio" name="priority" value="High" checked={formData.priority === 'High'} onChange={handleChange} />
                  <span className="dot high"></span> High
                </label>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Description <span className="required">*</span></label>
            <textarea 
              name="description"
              placeholder="Provide detailed information about your complaint..." 
              rows="8" /* Increased height */
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label>Attachment</label>
            <div className="upload-box-large">
              <FaCloudUploadAlt className="upload-icon" />
              <p><span>Click to upload</span> or drag and drop files</p>
              <span className="upload-subtext">PNG, JPG, PDF up to 10MB</span>
              <input type="file" className="file-input" />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel">Cancel</button>
            <button type="submit" className="btn-submit">Submit Complaint</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitComplaint;