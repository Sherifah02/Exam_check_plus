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
  Hash,
  BookOpen,
  Phone,
  Layers,
  Mail,
  Calendar,
} from "lucide-react";

import { useState } from "react";
import { useAuthStore } from "../store/authStore";

const ProfilePage = () => {
  const { user, logout } = useAuthStore(); // Added logout function
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // --- USER DATA FROM AUTH STORE ---
  const [userData, setUserData] = useState({
    fullName: user ? `${user.first_name} ${user.last_name}` : "Student User",
    userId: user?.user_id || "N/A",
    department: user?.department || "Not specified",
    level: user?.year_of_study ? `${user.year_of_study}00 Level` : "N/A",
    regNo: user?.reg_number || "N/A",
    email: user?.email || "Not provided",
  });

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
    }
    if (user?.first_name) {
      return user.first_name.charAt(0).toUpperCase();
    }
    return "SU";
  };

  // --- STATE FOR EMAIL EDITING ---
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState(user?.email || "");
  const [emailError, setEmailError] = useState("");
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);

  // --- HANDLERS ---
  const handleCopyId = () => {
    navigator.clipboard.writeText(user?.user_id || "");
    setShowCopyTooltip(true);
    setTimeout(() => setShowCopyTooltip(false), 2000);
  };

  const handleCopyRegNumber = () => {
    navigator.clipboard.writeText(user?.reg_number || "");
    setShowCopyTooltip(true);
    setTimeout(() => setShowCopyTooltip(false), 2000);
  };

  const handleSaveEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    // In a real app, you would call an API to update the email
    setUserData({ ...userData, email: newEmail });
    setIsEditingEmail(false);
    setEmailError("");
    alert("Email updated successfully! (Demo only - no actual change made)");
  };

  const handleCancelEdit = () => {
    setNewEmail(user?.email || "");
    setIsEditingEmail(false);
    setEmailError("");
  };

  const handleContact = () => {
    navigate("/contact");
  };

  // --- LOGOUT LOGIC ---
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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
          <span>ExamCheck+</span>
        </div>

        <nav className="sidebar-menu">
          <div className="sidebar-item" onClick={() => navigate("/dashboard")}>
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
          <div
            style={{ marginTop: "auto" }}
            className="sidebar-item"
            onClick={handleLogoutClick}
          >
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
            {/* Large Avatar with Initials */}
            <div className="large-avatar" style={{
              backgroundColor: "#8b5cf6",
              color: "white",
              fontWeight: "bold",
              fontSize: "24px"
            }}>
              {getUserInitials()}
            </div>

            {/* User's Full Name */}
            <h2 style={{ textTransform: "capitalize", marginBottom: "5px" }}>
              {user?.first_name} {user?.last_name}
            </h2>

            {/* Registration Number under name */}
            <p style={{ color: "#6b7280", marginBottom: "25px" }}>
              {user?.reg_number || "No registration number"}
            </p>

            <div className="profile-info-group">
              {/* 1. USER ID */}
              <div className="info-row">
                <span className="info-label">User ID</span>
                <div className="info-value">
                  <span>{user?.user_id || "N/A"}</span>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span
                      className={`copy-tooltip ${showCopyTooltip ? "show" : ""}`}
                    >
                      Copied!
                    </span>
                    <button
                      className="icon-btn"
                      onClick={handleCopyId}
                      title="Copy User ID"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. DEPARTMENT */}
              <div className="info-row">
                <span className="info-label">Department</span>
                <div className="info-value">
                  {user?.department || "Not specified"}
                  <BookOpen size={18} className="text-gray-400" />
                </div>
              </div>

              {/* 3. LEVEL/YEAR OF STUDY */}
              <div className="info-row">
                <span className="info-label">Year of Study</span>
                <div className="info-value">
                  {user?.year_of_study ? `${user.year_of_study}00 Level` : "N/A"}
                  <Layers size={18} className="text-gray-400" />
                </div>
              </div>

              {/* 4. REGISTRATION NUMBER */}
              <div className="info-row">
                <span className="info-label">Registration Number</span>
                <div className="info-value">
                  <span>{user?.reg_number || "N/A"}</span>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button
                      className="icon-btn"
                      onClick={handleCopyRegNumber}
                      title="Copy Registration Number"
                    >
                      <Copy size={18} />
                    </button>
                    <Hash size={18} className="text-gray-400" />
                  </div>
                </div>
              </div>

              {/* 5. EMAIL ADDRESS */}
              <div className="info-row">
                <span className="info-label">Email Address</span>
                {!isEditingEmail ? (
                  <div className="info-value">
                    <span>{user?.email || "Not provided"}</span>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <button
                        className="icon-btn"
                        onClick={() => setIsEditingEmail(true)}
                        title="Edit Email"
                      >
                        <Edit2 size={18} />
                      </button>
                      <Mail size={18} className="text-gray-400" />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="email-edit-form">
                      <input
                        type="email"
                        className="email-input"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="Enter new email"
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

              {/* 6. ACCOUNT CREATION DATE */}
              <div className="info-row" style={{ borderBottom: "none" }}>
                <span className="info-label">Account Created</span>
                <div className="info-value">
                  <span>{formatDate(user?.user_created_at)}</span>
                  <Calendar size={18} className="text-gray-400" />
                </div>
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
          <h1>Profile</h1>
        </div>

        <div className="profile-detail-card" style={{ padding: "20px" }}>
          <div className="large-avatar" style={{
            backgroundColor: "#8b5cf6",
            color: "white",
            fontWeight: "bold",
            fontSize: "20px",
            width: "70px",
            height: "70px"
          }}>
            {getUserInitials()}
          </div>

          <h2 style={{ fontSize: "1.5rem", marginBottom: "5px" }}>
            {user?.first_name} {user?.last_name}
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "20px" }}>
            {user?.reg_number || "No registration number"}
          </p>

          <div className="profile-info-group">
            {/* Mobile Info Rows */}
            <div className="info-row">
              <span className="info-label">User ID</span>
              <div className="info-value">
                <span style={{ fontSize: "0.9rem" }}>{user?.user_id || "N/A"}</span>
                <button className="icon-btn" onClick={handleCopyId}>
                  <Copy size={18} />
                </button>
              </div>
            </div>

            <div className="info-row">
              <span className="info-label">Department</span>
              <div className="info-value">{user?.department || "Not specified"}</div>
            </div>

            <div className="info-row">
              <span className="info-label">Year of Study</span>
              <div className="info-value">
                {user?.year_of_study ? `${user.year_of_study}00 Level` : "N/A"}
              </div>
            </div>

            <div className="info-row">
              <span className="info-label">Reg Number</span>
              <div className="info-value">
                <span>{user?.reg_number || "N/A"}</span>
                <button className="icon-btn" onClick={handleCopyRegNumber}>
                  <Copy size={18} />
                </button>
              </div>
            </div>

            <div className="info-row">
              <span className="info-label">Email</span>
              {!isEditingEmail ? (
                <div className="info-value">
                  <span style={{ fontSize: "0.9rem", wordBreak: "break-all" }}>
                    {user?.email || "Not provided"}
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
                    placeholder="Enter new email"
                  />
                  <button className="save-btn" onClick={handleSaveEmail}>
                    <Check size={16} />
                  </button>
                  <button className="cancel-btn" onClick={handleCancelEdit}>
                    <X size={16} />
                  </button>
                </div>
              )}
              {emailError && <p className="error-msg">{emailError}</p>}
            </div>

            <div className="info-row" style={{ borderBottom: "none" }}>
              <span className="info-label">Account Created</span>
              <div className="info-value">{formatDate(user?.user_created_at)}</div>
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
              <span>ExamCheck+</span>
            </div>

            <nav className="sidebar-menu">
              <div
                className="sidebar-item"
                onClick={() => navigate("/dashboard")}
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
                className="sidebar-item"
                onClick={() => navigate("/contact")}
              >
                <Phone size={20} />
                <span>Contact</span>
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
export default ProfilePage;