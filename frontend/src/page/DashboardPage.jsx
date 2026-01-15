import "../assets/css/DashboardPage.css";
import { useNavigate } from 'react-router-dom';
import {
  User, Menu, ClipboardCheck, ShieldCheck,
  LayoutDashboard, Settings, LogOut, Bell,
  Home, X, Phone,
  Sun,
} from 'lucide-react';

import { useState } from 'react';

const DashboardPage = () => {

  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // NEW: State for Logout Modal
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // --- LOGOUT LOGIC ---
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    navigate('/');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleVenueClick = () => {
    navigate('/venue-check');
  };

  const actions = [
    {
      title: "Venue Check",
      icon: <Home size={32} color="#0284c7" />,
      onClick: handleVenueClick
    },
    {
      title: "Result Checker",
      icon: <ClipboardCheck size={32} color="#ea580c" />,
      onClick: () => navigate('/result-check')
    },
  ];

  const handleProfile = () => {
    navigate ('/profile')
  }

  // New Handler for Contact
  const handleContact = () => {
    navigate('/contact');
  }

  return (
    <div className="dashboard-container">

    {/* ======================= */}
      {/* LOGOUT CONFIRMATION MODAL */}
      {/* ======================= */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Log Out?</h3>
            <p>Are you sure you want to log out of your account?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={cancelLogout}>Cancel</button>
              <button className="btn-confirm" onClick={confirmLogout}>Log Out</button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= */}
      {/* 1. DESKTOP SIDEBAR      */}
      {/* ======================= */}
      <aside className="desktop-sidebar">
        <div className="sidebar-logo">
          <ShieldCheck size={28} />
          <span>ExamCheck+</span>
        </div>

        <nav className="sidebar-menu">
          <div className="sidebar-item active">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
          <div className="sidebar-item" onClick={handleProfile} >
            <User size={20} />
            <span>Profile</span>
          </div>
          {/* ADDED CONTACT ITEM HERE */}
          <div className="sidebar-item" onClick={handleContact}>
            <Phone size={20} />
            <span>Contact</span>
          </div>
          <div style= {{ marginTop: 'auto' }} className="sidebar-item" onClick={handleLogoutClick} >
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </nav>
      </aside>


      {/* ======================= */}
      {/* 2. DESKTOP MAIN CONTENT */}
      {/* ======================= */}
      <main className="desktop-main">
        <div className="desktop-topbar">
          <div className="top-profile">
            <div className="profile-avatar">
              <User size={24} />
            </div>
            <span className="font-bold text-gray-700">Abdulkareem S.</span>
            <Sun size={30} color="#ebee2aff" style={{marginLeft: '15px'}} />
          </div>
        </div>

        <div className="welcome-banner">
          <div className="welcome-text">
            <h2>Welcome back, Sherifah!</h2>
            <p className="opacity-90">Always stay updated in your student portal.</p>
          </div>
        </div>

        <div className="action-grid">
          {actions.map((item, index) => (
            <div key={index} className="action-card" onClick={item.onClick}>
              <div className="card-icon">{item.icon}</div>
              <span className="card-title">{item.title}</span>
            </div>
          ))}
        </div>
      </main>


      {/* ======================= */}
      {/* 3. MOBILE APP LAYOUT    */}
      {/* ======================= */}
      <div className="mobile-layout">
        <div className="mobile-header" style={{display:'flex', alignItems:'center'}}>
          <button
            className="hamburger-btn"
            onClick={() => setIsMobileMenuOpen(true)}
          >
          <Menu size={28}/>
          </button>
          <h1>ExamCheck+</h1>
        </div>

        <div className="profile-card">
          <div className="profile-avatar">
            <User size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Welcome,</p>
            <p className="font-bold text-lg">Abdulkareem Sherifah</p>
          </div>
        </div>

        <div className="action-grid">
          {actions.map((item, index) => (
            <div key={index} className="action-card" onClick={item.onClick}>
              <div className="card-icon">{item.icon}</div>
              <span className="card-title">{item.title}</span>
            </div>
          ))}
        </div>

        {/* SLIDE OUT MOBILE MENU */}
        <div className= {`mobile-sidebar-overlay ${isMobileMenuOpen? 'open' : ''}`}>
        <div
         style={{position:'absolute', width:'100%', height:'100%'}}
         onClick={() => setIsMobileMenuOpen(false)} />

        <div className="mobile-sidebar-content">
         <button
          className="close-menu-btn"
          onClick={() => setIsMobileMenuOpen(false)}
         >
         <X size={28}/>
         </button>

        <div className="sidebar-logo" style={{marginBottom: "30px"}}>
          <ShieldCheck size={28} />
          <span>ExamCheck+</span>
        </div>

        <nav className="sidebar-menu">
          <div className="sidebar-item active">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
          <div className="sidebar-item" onClick={handleProfile}>
            <User size={20} />
            <span>Profile</span>
          </div>
          {/* ADDED CONTACT ITEM HERE */}
          <div className="sidebar-item" onClick={handleContact}>
            <Phone size={20} />
            <span>Contact</span>
          </div>
          <div style= {{ marginTop: 'auto' }} className="sidebar-item" onClick={handleLogoutClick}>
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </nav>
        </div>
        </div>
      </div>

    </div>
);
};
export default DashboardPage;