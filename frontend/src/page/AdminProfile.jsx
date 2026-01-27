import "../assets/css/DashboardPage.css";
import { useNavigate } from "react-router-dom";
import {
  User,
  Menu,
  ShieldCheck,
  LayoutDashboard,
  Settings,
  LogOut,
  Copy,
  Edit2,
  Check,
  X,
  FileSpreadsheet,
  MapPin,
  Users,
  Building,
} from "lucide-react";

import { useState } from "react";
import { useAuthStore } from "../store/authStore";

const AdminProfile = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- LOGOUT MODAL STATE ---
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const {user, logout} = useAuthStore()
  // --- STATE FOR ADMIN DATA ---
  const [userData, setUserData] = useState({
    fullName: user?.full_name || "System Administrator", // Default Admin Name
    role: user?.role || "ADM-2024-001",
    email: user?.email || "admin@examcheck.com",
  });

  // --- STATE FOR EMAIL EDITING ---
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState(userData.email);
  const [emailError, setEmailError] = useState("");
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);

  // --- HANDLERS ---
  const handleCopyId = () => {
    navigator.clipboard.writeText(userData.role);
    setShowCopyTooltip(true);
    setTimeout(() => setShowCopyTooltip(false), 2000);
  };
const handleDashboardClick = () => navigate("/admin/dashboard");
  const handleProfileClick = () => navigate("/admin/profile");
  const handleResultUpload = () => navigate("/admin/result-upload");


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

  // --- LOGOUT HANDLERS ---
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    const response = await logout();
    console.log(response);
    if (response && !response.success) {
      return;
    }
    navigate("/");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    // Added 'admin-theme' class to match Admin Dashboard colors
    <div className="dashboard-container admin-theme">
      {/* ======================= */}
      {/* LOGOUT CONFIRMATION MODAL */}
      {/* ======================= */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Log Out?</h3>
            <p>Are you sure you want to log out of the Admin Portal?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={cancelLogout}>
                Cancel
              </button>
              <button className="btn-confirm" onClick={confirmLogout}>
                Log Out
              </button>
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
                <span>Admin Portal</span>
              </div>

              <nav className="sidebar-menu">
                <div className="sidebar-item" onClick={handleDashboardClick}>
                  <LayoutDashboard size={20} />
                  <span>Dashboard</span>
                </div>
                <div className="sidebar-item" onClick={handleResultUpload}>
                  <FileSpreadsheet size={20} />
                  <span>Upload Results</span>
                </div>
                <div className="sidebar-item" onClick={()=>  navigate("/admin/upload-venue")}>
                  <Building size={20} />
                  <span>Upload Venue</span>
                </div>
                <div className="sidebar-item" onClick={()=>  navigate("/admin/results/batches")}>
                  <FileSpreadsheet size={20} />
                  <span>Result Batches</span>
                </div>
                <div className="sidebar-item active" onClick={handleProfileClick}>
                  <User size={20} />
                  <span>Profile</span>
                </div>
                <div className="sidebar-item" onClick={handleLogoutClick}>
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
            <div className="large-avatar" style={{ background: "#334155" }}>
              <User size={60} />
            </div>

            {/* Header Name */}
            <h2 style={{ textTransform: "capitalize" }}>{userData.fullName}</h2>

            <div className="profile-info-group">
              {/* 1. USER ID */}
              <div className="info-row">
                <span className="info-label">User ID</span>
                <div className="info-value">
                  <span>{userData.role}</span>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span
                      className={`copy-tooltip ${showCopyTooltip ? "show" : ""}`}
                    >
                      Copied!
                    </span>
                    <button
                      className="icon-btn"
                      onClick={handleCopyId}
                      title="Copy ID"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. EMAIL (EDITABLE) */}
              <div className="info-row" style={{ borderBottom: "none" }}>
                <span className="info-label">Email Address</span>

                {!isEditingEmail ? (
                  <div className="info-value">
                    <span>{userData.email}</span>
                    <button
                      className="icon-btn"
                      onClick={() => setIsEditingEmail(true)}
                      title="Edit Email"
                    >
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
        <div
          className="mobile-header"
          style={{ display: "flex", alignItems: "center" }}
        >
          <button
            className="hamburger-btn"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={28} />
          </button>
          <h1>Admin Profile</h1>
        </div>

        <div className="profile-detail-card" style={{ padding: "20px" }}>
          <div className="large-avatar" style={{ background: "#334155" }}>
            <User size={50} />
          </div>

          <h2 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
            {userData.fullName}
          </h2>

          <div className="profile-info-group">
            {/* 1. User ID */}
            <div className="info-row">
              <span className="info-label">User ID</span>
              <div className="info-value">
                <span style={{ fontSize: "0.9rem" }}>{userData.role}</span>
                <button className="icon-btn" onClick={handleCopyId}>
                  <Copy size={18} />
                </button>
              </div>
            </div>

            {/* 2. Email */}
            <div className="info-row" style={{ borderBottom: "none" }}>
              <span className="info-label">Email</span>
              {!isEditingEmail ? (
                <div className="info-value">
                  <span style={{ fontSize: "0.9rem", wordBreak: "break-all" }}>
                    {userData.email}
                  </span>
                  <button
                    className="icon-btn"
                    onClick={() => setIsEditingEmail(true)}
                  >
                    <Edit2 size={18} />
                  </button>
                </div>
              ) : (
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
                </div>
              )}
              {emailError && <p className="error-msg">{emailError}</p>}
            </div>
          </div>
        </div>

        {/* SIDEBAR OVERLAY */}
        <div
          className={`mobile-sidebar-overlay ${isMobileMenuOpen ? "open" : ""}`}
        >
          <div
            style={{ position: "absolute", width: "100%", height: "100%" }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="mobile-sidebar-content">
            <button
              className="close-menu-btn"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={28} />
            </button>

            <div className="sidebar-logo" style={{ marginBottom: "30px" }}>
              <ShieldCheck size={28} />
              <span>Admin Portal</span>
            </div>

            <nav className="sidebar-menu">
              <div
                className="sidebar-item"
                onClick={() => navigate("/admin/dashboard")}
              >
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </div>
              <div
                className="sidebar-item active"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User size={20} />
                <span>Profile</span>
              </div>
              <div
                style={{ marginTop: "auto" }}
                className="sidebar-item"
                onClick={handleLogoutClick}
              >
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
export default AdminProfile;
