import React from 'react';
import { 
  FaThLarge, 
  FaStar, 
  FaExclamationCircle, 
  FaUserCircle,
  FaSignOutAlt,
  FaBell /* Added for the Notifications link */
} from 'react-icons/fa';
import './PassengerSidebar.css';

const PassengerSidebar = ({ activeView, setActiveView }) => {
  
  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <FaThLarge /> 
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: <FaBell /> 
    },
    { 
      id: 'review', 
      label: 'Rate Your Experience', 
      icon: <FaStar /> 
    },
    { 
      id: 'complaint', 
      label: 'Add Complaint', 
      icon: <FaExclamationCircle /> 
    }
  ];

  return (
    <div className="passenger-sidebar">
      {/* Brand Section */}
      <div className="sidebar-brand">
        <div className="brand-logo">Y</div>
        <div className="brand-info">
          <h2>YAMU</h2>
          <span>Customer Portal</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => setActiveView(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Profile & Logout */}
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            <FaUserCircle />
          </div>
          <div className="user-details">
            <p>Usindu K.</p>
            <span>Verified Customer</span>
          </div>
        </div>
        <button className="logout-btn" title="Logout">
          <FaSignOutAlt />
        </button>
      </div>
    </div>
  );
};

export default PassengerSidebar;