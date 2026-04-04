import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaStar, FaClipboardCheck, FaCheckCircle, 
  FaUserTie, FaCarSide, FaTrophy, FaSyncAlt, FaChartLine,
  FaChartBar, FaChartArea 
} from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    avgDriver: "0.0", avgVehicle: "0.0", totalReviews: 0, resolutionRate: 0,
  });
  const [topDrivers, setTopDrivers] = useState([]);
  const [topVehicles, setTopVehicles] = useState([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const [revRes, compRes] = await Promise.all([
        axios.get('http://localhost:5000/api/reviews'),
        axios.get('http://localhost:5000/api/complaints')
      ]);

      const reviews = Array.isArray(revRes.data) ? revRes.data.filter(r => r.status === 'Approved') : [];
      const complaints = Array.isArray(compRes.data) ? compRes.data : [];

      const totalRev = reviews.length;
      const avgD = totalRev > 0 ? reviews.reduce((acc, r) => acc + (r.driverRating || 0), 0) / totalRev : 0;
      const avgV = totalRev > 0 ? reviews.reduce((acc, r) => acc + (r.vehicleRating || 0), 0) / totalRev : 0;
      const solved = complaints.filter(c => c.status === 'Solved');
      const resRate = complaints.length > 0 ? (solved.length / complaints.length) * 100 : 0;

      setStats({
        avgDriver: avgD.toFixed(1),
        avgVehicle: avgV.toFixed(1),
        totalReviews: totalRev,
        resolutionRate: Math.round(resRate),
      });

      const dMap = {};
      reviews.forEach(r => {
        if(!dMap[r.driverName]) dMap[r.driverName] = { name: r.driverName, sum: 0, count: 0 };
        dMap[r.driverName].sum += r.driverRating; dMap[r.driverName].count += 1;
      });
      setTopDrivers(Object.values(dMap).map(d => ({ ...d, avg: (d.sum / d.count).toFixed(1) })).sort((a,b) => b.avg - a.avg).slice(0, 4));

      const vMap = {};
      reviews.forEach(r => {
        if(!vMap[r.vehicleType]) vMap[r.vehicleType] = { name: r.vehicleType, sum: 0, count: 0 };
        vMap[r.vehicleType].sum += r.vehicleRating; vMap[r.vehicleType].count += 1;
      });
      setTopVehicles(Object.values(vMap).map(v => ({ ...v, avg: (v.sum / v.count).toFixed(1) })).sort((a,b) => b.avg - a.avg).slice(0, 4));

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) return <div className="admin-loading-state"><span>Syncing Intelligence...</span></div>;

  return (
    <div className="admin-analytics-container">
      <header className="analytics-header">
        <div className="header-left">
          <FaChartLine className="main-title-icon" />
          <div className="header-text">
            <h1>Quality Reporting & Analytics</h1>
            <p>Provider performance oversight and service quality metrics.</p>
          </div>
        </div>
        <button className="refresh-btn" onClick={fetchAnalyticsData}><FaSyncAlt /> Refresh Stats</button>
      </header>

      {/* 4 Stats Cards */}
      <div className="analytics-stats-grid">
        <div className="a-stat-card">
          <div className="a-stat-icon rating"><FaStar /></div>
          <div className="a-stat-info">
            <label>Avg Driver Rating</label>
            <h3>{stats.avgDriver} <small>/ 5.0</small></h3>
          </div>
        </div>
        <div className="a-stat-card">
          <div className="a-stat-icon vehicle"><FaCarSide /></div>
          <div className="a-stat-info">
            <label>Avg Vehicle Rating</label>
            <h3>{stats.avgVehicle} <small>/ 5.0</small></h3>
          </div>
        </div>
        <div className="a-stat-card">
          <div className="a-stat-icon reviews"><FaClipboardCheck /></div>
          <div className="a-stat-info">
            <label>Total Feedback</label>
            <h3>{stats.totalReviews}</h3>
          </div>
        </div>
        <div className="a-stat-card">
          <div className="a-stat-icon resolution"><FaCheckCircle /></div>
          <div className="a-stat-info">
            <label>Resolution Rate</label>
            <h3>{stats.resolutionRate}%</h3>
          </div>
        </div>
      </div>

      <div className="analytics-main-row">
        <div className="chart-card-polished">
          <div className="card-title">
            <h3><FaChartBar className="title-icon-blue" /> Rating Distribution</h3>
            <div className="legend">
              <div className="legend-item"><span className="dot driver"></span> Driver</div>
              <div className="legend-item"><span className="dot vehicle"></span> Vehicle</div>
            </div>
          </div>
          <div className="manual-chart-ui">
            {/* Added Y-Axis Labels */}
            <div className="y-axis-labels">
              <span>100</span><span>75</span><span>50</span><span>25</span><span>0</span>
            </div>
            <div className="chart-content">
              <div className="grid-background">
                {[...Array(5)].map((_, i) => <div key={i} className="grid-line"></div>)}
              </div>
              <div className="bars-container">
                {[88, 72, 45, 25, 12].map((h, i) => (
                  <div key={i} className="bar-set">
                    <div className="bar-pair">
                      <div className="bar-single d-bar" style={{ height: `${h}%` }}></div>
                      <div className="bar-single v-bar" style={{ height: `${h * 0.85}%` }}></div>
                    </div>
                    <span className="star-label">{5 - i}★</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="ranking-card">
          <div className="card-title">
            <h3><FaTrophy className="title-icon-blue" /> Top Performing Drivers</h3>
          </div>
          <div className="perf-list-polished">
            {topDrivers.map((d, i) => (
              <div key={i} className="perf-item-new">
                <div className="perf-rank">{i + 1}</div>
                <div className="perf-main">
                  <div className="perf-avatar-box"><FaUserTie /></div>
                  <div className="perf-details">
                    <p className="p-name">{d.name}</p>
                    <span className="p-trips">{d.count} Trips Rated</span>
                  </div>
                </div>
                <div className="p-rating-pill"><FaStar /> {d.avg}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="analytics-bottom-row">
        <div className="trend-card-polished">
          <div className="card-title">
            <h3><FaChartArea className="title-icon-blue" /> Dispute Trends</h3>
            <div className="legend">
              <div className="legend-item"><span className="dot new"></span> New</div>
              <div className="legend-item"><span className="dot resolved"></span> Resolved</div>
            </div>
          </div>
          <div className="manual-trend-ui">
            {/* Added Y-Axis Labels for Trends */}
            <div className="y-axis-labels-trend">
              <span>20</span><span>15</span><span>10</span><span>5</span><span>0</span>
            </div>
            <div className="trend-content">
              <svg viewBox="0 0 600 120" className="trend-line-svg">
                <path d="M0,100 Q150,20 300,80 T600,30" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                <path d="M0,110 Q150,90 300,100 T600,60" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
              </svg>
              <div className="trend-x-axis">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
              </div>
            </div>
          </div>
        </div>

        <div className="ranking-card flex-1">
          <div className="card-title">
            <h3><FaCarSide className="title-icon-blue" /> Top Rated Vehicles</h3>
          </div>
          <div className="perf-list-polished">
            {topVehicles.map((v, i) => (
              <div key={i} className="perf-item-new">
                <div className="perf-rank">{i + 1}</div>
                <div className="perf-main">
                  <div className="v-avatar-box"><FaCarSide /></div>
                  <div className="perf-details">
                    <p className="p-name">{v.name}</p>
                    <span className="p-trips">{v.count} Bookings</span>
                  </div>
                </div>
                <div className="p-rating-pill vehicle-pill"><FaStar /> {v.avg}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;