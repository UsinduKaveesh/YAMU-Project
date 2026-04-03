import React from 'react';
import { 
  FaCheckDouble, 
  FaExclamationTriangle, 
  FaChartBar, 
  FaUserShield,
  FaSignOutAlt
} from 'react-icons/fa';
import './AdminSidebar.css';

const AdminSidebar = ({ activeView, setActiveView }) => {
  
  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Admin Dashboard', 
      icon: <FaChartBar /> 
    },
    { 
      id: 'approvals', 
      label: 'Review Approvals', 
      icon: <FaCheckDouble /> 
    },
    { 
      id: 'disputes', 
      label: 'Dispute Management', 
      icon: <FaExclamationTriangle /> 
    }
  ];

  return (
    <div className="admin-sidebar">
      {/* Brand Section */}
      <div className="sidebar-brand">
        <div className="brand-logo">Y</div>
        <div className="brand-info">
          <h2>YAMU</h2>
          <span>Admin Portal</span>
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

      {/* Admin Profile & Logout */}
      <div className="sidebar-footer">
        <div className="admin-profile">
          <div className="admin-avatar">
            <FaUserShield />
          </div>
          <div className="admin-details">
            <p>Usindu K.</p>
            <span>Senior Staff</span>
          </div>
        </div>
        <button className="logout-btn">
          <FaSignOutAlt />
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;