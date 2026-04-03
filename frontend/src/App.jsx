import React, { useState } from 'react';
import AddReview from './components/AddReview';
import ReviewApproval from './components/ReviewApproval';
import AdminSidebar from './components/AdminSidebar';
import PassengerSidebar from './components/PassengerSidebar';
import SubmitComplaint from './components/SubmitComplaint';
import DisputeManagement from './components/DisputeManagement';
import CustomerDashboard from './components/CustomerDashboard';
import CustomerNotifications from './components/CustomerNotifications'; // Added new import
import './index.css'; 

function App() {
  // Toggle between 'passenger' (Customer) and 'admin' portals
  const [appMode, setAppMode] = useState('passenger'); 
  
  // State for Admin navigation
  const [adminView, setAdminView] = useState('approvals');
  
  // State for Customer navigation
  const [passengerView, setPassengerView] = useState('dashboard'); 

  const currentBooking = {
    id: "YMU-1029",
    driver: "Michael Johnson",
    driverId: "DRV_7721",
    passengerName: "Usindu K", 
    vehicleType: "Tesla Model 3" 
  };

  // --- CUSTOMER (PASSENGER) PORTAL ---
  if (appMode === 'passenger') {
    return (
      <div className="passenger-portal-layout">
        <PassengerSidebar activeView={passengerView} setActiveView={setPassengerView} />

        <main className="passenger-content">
          {/* Customer Portal Views */}
          {passengerView === 'dashboard' && <CustomerDashboard />}

          {passengerView === 'notifications' && <CustomerNotifications />} 

          {passengerView === 'review' && (
            <AddReview 
              bookingId={currentBooking.id} 
              driverName={currentBooking.driver} 
              driverId={currentBooking.driverId} 
              passengerName={currentBooking.passengerName}
              vehicleType={currentBooking.vehicleType}
            />
          )}

          {passengerView === 'complaint' && (
            <SubmitComplaint bookingId={currentBooking.id} />
          )}

          <button 
            onClick={() => setAppMode('admin')} 
            className="dev-mode-toggle"
          >
            Switch to Admin Portal
          </button>
        </main>
      </div>
    );
  }

  // --- ADMIN PORTAL ---
  return (
    <div className="admin-portal-layout">
      <AdminSidebar activeView={adminView} setActiveView={setAdminView} />

      <main className="admin-content">
        {adminView === 'dashboard' && (
          <div style={{ padding: '40px' }}>
            <h1>Admin Dashboard</h1>
            <p>Quality Reporting and Analytics will appear here.</p>
          </div>
        )}

        {adminView === 'approvals' && <ReviewApproval />}

        {adminView === 'disputes' && <DisputeManagement />}
        
        <button 
          onClick={() => setAppMode('passenger')} 
          className="dev-mode-toggle"
        >
          Switch to Customer Portal
        </button>
      </main>
    </div>
  );
}

export default App;