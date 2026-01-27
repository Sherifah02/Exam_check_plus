import "../assets/css/DashboardPage.css";
import { useNavigate } from "react-router-dom";
import {
  User,
  Menu,
  ShieldCheck,
  LayoutDashboard,
  Settings,
  LogOut,
  Bell,
  UploadCloud,
  FileText,
  X,
  Users,
  FileSpreadsheet,
  MapPin,
  Building,
} from "lucide-react";

import { useState, useRef } from "react";
import { useAuthStore } from "../store/authStore";

const AdminDashb = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
 const handleDashboardClick = () => navigate("/admin/dashboard");
  const handleProfileClick = () => navigate("/admin/profile");
  const handleResultUpload = () => navigate("/admin/result-upload");
const {user, logout} = useAuthStore()
  // Logout handlers

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleVenueClick = () => {
    navigate("/admin/upload-venue");
  };

  const handleResultClick = () => {
    navigate("/admin/result-upload");
  };

  const actions = [
    {
      title: "Student Verification",
      icon: <User size={32} color="#0284c7" />,
      onClick: () => navigate("/admin/verification"),
    },
    {
      title: "Venue Upload",
      icon: <UploadCloud size={32} color="#059669" />,
      onClick: handleVenueClick, // Triggers the venue file input
    },
    {
      title: "Result Upload",
      icon: <FileText size={32} color="#ea580c" />,
      onClick: handleResultClick, // Triggers the result file input
    },
  ];

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

  return (
    <div className="dashboard-container admin-theme">
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
          <span>Admin Portal</span>
        </div>

        <nav className="sidebar-menu ">
          <div className="sidebar-item active" onClick={handleDashboardClick}>
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
          <div className="sidebar-item " onClick={()=> navigate("/admin/results/batches")}>
            <FileSpreadsheet size={20} />
            <span>Result Batches</span>
          </div>
          <div className="sidebar-item" onClick={handleProfileClick}>
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
        {/* Top Bar */}
        <div className="desktop-topbar">
          {/* Profile on the Left */}
          <div className="top-profile">
            <div className="profile-avatar">
              <User size={24} />
            </div>
            <span className="font-bold text-gray-700">Admin User</span>
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="welcome-banner">
          <div className="welcome-text">
            <h2>Admin Dashboard</h2>
            <p className="opacity-90">
              Manage student data, venues, and results.
            </p>
          </div>
        </div>

        {/* Action Grid (The 3 Buttons) */}
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
          <h1>Admin Portal</h1>
        </div>

        <div className="profile-card">
          <div className="profile-avatar">
            <User size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Welcome, Admin</p>
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
              <div className="sidebar-item active">
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </div>
              <div
                className="sidebar-item"
                onClick={() => navigate("/admin/profile")}
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
export default AdminDashb;
