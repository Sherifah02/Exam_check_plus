import "../assets/css/DashboardPage.css";
import { useNavigate } from 'react-router-dom';
import {
  User, Menu, ShieldCheck, LayoutDashboard, Settings, LogOut,
  Copy, Edit2, Check, X, Hash, BookOpen, Phone, Layers // Added BookOpen for Department icon
} from 'lucide-react';

import { useState } from 'react';

const ProfilePage = () => {

  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // NEW: State for Logout Modal
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // --- LOGOUT LOGIC ---
  const handleLogoutClick = () => {
    setShowLogoutModal(true); // 1. Open Modal
  };

  const confirmLogout = () => {
    navigate('/'); // 2. Actually Logout
  };

  const cancelLogout = () => {
    setShowLogoutModal(false); // 3. Close Modal
  };

  // --- STATE FOR USER DATA ---
  const [userData, setUserData] = useState({
    fullName: "Abdulkareem Sherifah",
    userId: "USR-2024-8892",
    department: "Computer Science",
    level: "",
    regNo: "CST/19/COM/00234",
    email: "sherifah@student.uni.edu"
  });

  // --- STATE FOR EMAIL EDITING ---
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState(userData.email);
  const [emailError, setEmailError] = useState("");
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);

  // --- HANDLERS ---
  const handleCopyId = () => {
    navigator.clipboard.writeText(userData.userId);
    setShowCopyTooltip(true);
    setTimeout(() => setShowCopyTooltip(false), 2000);
  };

  const handleSaveEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setUserData({ ...userData, email: newEmail });
    setIsEditingEmail(false);
    setEmailError("");
  };

  const handleCancelEdit = () => {
    setNewEmail(userData.email);
    setIsEditingEmail(false);
    setEmailError("");
  };

  const handleContact = () => {
    navigate('/contact')
  };

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
          <div className="sidebar-item" onClick={() => navigate('/dashboard')}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
          <div className="sidebar-item active">
            <User size={20} />
            <span>Profile</span>
          </div>
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
        <div className="profile-content-wrapper">
            <div className="profile-detail-card">

                {/* Large Avatar */}
                <div className="large-avatar">
                    <User size={60} />
                </div>

                {/* UPDATED: Full Name is now the Header */}
                <h2 style={{textTransform: 'capitalize'}}>{userData.fullName}</h2>

                <div className="profile-info-group">

                    {/* 1. USER ID (Now First) */}
                    <div className="info-row">
                        <span className="info-label">User ID</span>
                        <div className="info-value">
                            <span>{userData.userId}</span>
                            <div style={{display:'flex', alignItems:'center'}}>
                                <span className={`copy-tooltip ${showCopyTooltip ? 'show' : ''}`}>Copied!</span>
                                <button className="icon-btn" onClick={handleCopyId} title="Copy ID">
                                    <Copy size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 2. DEPARTMENT (New Field) */}
                    <div className="info-row">
                        <span className="info-label">Department</span>
                        <div className="info-value">
                            {userData.department}
                            <BookOpen size={18} className="text-gray-400" />
                        </div>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Level</span>
                        <div className="info-value">
                            {userData.level}
                            <Layers size={18} className="text-gray-400" />
                        </div>
                    </div>

                    {/* 3. REGISTRATION NUMBER */}
                    <div className="info-row">
                        <span className="info-label">Registration Number</span>
                        <div className="info-value">
                            {userData.regNo}
                            <Hash size={18} className="text-gray-400" />
                        </div>
                    </div>

                    {/* 4. EMAIL (EDITABLE) */}
                    <div className="info-row" style={{borderBottom: 'none'}}>
                        <span className="info-label">Email Address</span>

                        {!isEditingEmail ? (
                            <div className="info-value">
                                <span>{userData.email}</span>
                                <button className="icon-btn" onClick={() => setIsEditingEmail(true)} title="Edit Email">
                                    <Edit2 size={18} />
                                </button>
                            </div>
                        ) : (
                            <div>
                                <div className="email-edit-form">
                                    <input
                                        type="email"
                                        className="email-input"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                    />
                                    <button className="save-btn" onClick={handleSaveEmail}>
                                        <Check size={16} />
                                    </button>
                                    <button className="cancel-btn" onClick={handleCancelEdit}>
                                        <X size={16} />
                                    </button>
                                </div>
                                {emailError && <p className="error-msg">{emailError}</p>}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
      </main>

      {/* ======================= */}
      {/* 3. MOBILE APP LAYOUT    */}
      {/* ======================= */}
      <div className="mobile-layout">
        <div className="mobile-header" style={{display:'flex', alignItems:'center'}}>
          <button className="hamburger-btn" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={28}/>
          </button>
          <h1>Profile</h1>
        </div>

        <div className="profile-detail-card" style={{padding: '20px'}}>
             <div className="large-avatar">
                <User size={50} />
            </div>

            {/* UPDATED: Full Name as Header on Mobile too */}
            <h2 style={{fontSize: '1.5rem', marginBottom: '10px'}}>{userData.fullName}</h2>

            <div className="profile-info-group">

                {/* 1. User ID */}
                <div className="info-row">
                    <span className="info-label">User ID</span>
                    <div className="info-value">
                        <span style={{fontSize:'0.9rem'}}>{userData.userId}</span>
                        <button className="icon-btn" onClick={handleCopyId}><Copy size={18}/></button>
                    </div>
                </div>

                {/* 2. Department */}
                <div className="info-row">
                    <span className="info-label">Department</span>
                    <div className="info-value">{userData.department}</div>
                </div>

                <div className="info-row">
                        <span className="info-label">Level</span>
                        <div className="info-value">{userData.level}</div>
                    </div>

                {/* 3. Reg Number */}
                <div className="info-row">
                    <span className="info-label">Reg Number</span>
                    <div className="info-value">{userData.regNo}</div>
                </div>

                {/* 4. Email */}
                <div className="info-row" style={{borderBottom:'none'}}>
                    <span className="info-label">Email</span>
                    {!isEditingEmail ? (
                         <div className="info-value">
                            <span style={{fontSize:'0.9rem', wordBreak:'break-all'}}>{userData.email}</span>
                            <button className="icon-btn" onClick={() => setIsEditingEmail(true)}><Edit2 size={18}/></button>
                         </div>
                    ) : (
                         <div className="email-edit-form">
                            <input
                                type="email"
                                className="email-input"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                            />
                            <button className="save-btn" onClick={handleSaveEmail}><Check size={16}/></button>
                        </div>
                    )}
                     {emailError && <p className="error-msg">{emailError}</p>}
                </div>
            </div>
        </div>

        {/* SIDEBAR OVERLAY */}
        <div className= {`mobile-sidebar-overlay ${isMobileMenuOpen? 'open' : ''}`}>
        <div style={{position:'absolute', width:'100%', height:'100%'}} onClick={() => setIsMobileMenuOpen(false)} />
        <div className="mobile-sidebar-content">
         <button className="close-menu-btn" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={28}/>
         </button>

        <div className="sidebar-logo" style={{marginBottom: "30px"}}>
          <ShieldCheck size={28} />
          <span>ExamCheck+</span>
        </div>

        <nav className="sidebar-menu">
          <div className="sidebar-item" onClick={() => navigate('/dashboard')}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
          <div className="sidebar-item active" onClick={() => setIsMobileMenuOpen(false)}>
            <User size={20} />
            <span>Profile</span>
          </div>
          <div className="sidebar-item" onClick={ () => navigate('/contact')}>
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
export default ProfilePage;