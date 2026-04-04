import React, { useState } from 'react';
import AddReview from './components/AddReview';
import ReviewApproval from './components/ReviewApproval';
import AdminSidebar from './components/AdminSidebar';
import PassengerSidebar from './components/PassengerSidebar';
import SubmitComplaint from './components/SubmitComplaint';
import DisputeManagement from './components/DisputeManagement';
import CustomerDashboard from './components/CustomerDashboard';
import CustomerNotifications from './components/CustomerNotifications';
// 1. IMPORT the new Dashboard component
import AdminDashboard from './components/AdminDashboard'; 
import './index.css'; 

function App() {
  const [appMode, setAppMode] = useState('passenger'); 
  
  // 2. CHANGE default view to 'dashboard' so it's the first thing you see
  const [adminView, setAdminView] = useState('dashboard');
  
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
          <button onClick={() => setAppMode('admin')} className="dev-mode-toggle">
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
        {/* 3. SWAP the placeholder for the real AdminDashboard component */}
        {adminView === 'dashboard' && <AdminDashboard />}

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