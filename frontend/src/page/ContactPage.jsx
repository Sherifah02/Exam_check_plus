import "../assets/css/DashboardPage.css";
import { useNavigate } from "react-router-dom";
import {
  User,
  Menu,
  ShieldCheck,
  LayoutDashboard,
  Settings,
  LogOut,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  X,
} from "lucide-react";

import { useState } from "react";
import { useAuthStore } from "../store/authStore";

const ContactPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // NEW: State for Logout Modal
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Contact Info Data
  const contactInfo = [
    {
      id: 1,
      label: "Email Support",
      value: "ExamCheckplus@support.com",
      icon: <Mail size={24} color="#ea580c" />,
    },
    {
      id: 2,
      label: "Phone Number",
      value: "+234 800 123 4567",
      icon: <Phone size={24} color="#059669" />,
    },
    {
      id: 3,
      label: "Facebook",
      value: "ExamCheckPlus Official",
      icon: <Facebook size={24} color="#1877F2" />,
    },
    {
      id: 4,
      label: "Instagram",
      value: "@ExamCheckPlus",
      icon: <Instagram size={24} color="#E4405F" />,
    },
    {
      id: 5,
      label: "Twitter (X)",
      value: "@ExamCheck_Plus",
      icon: <Twitter size={24} color="#1DA1F2" />,
    },
  ];

  // --- LOGOUT LOGIC ---
  const handleLogoutClick = () => {
    setShowLogoutModal(true); // 1. Open Modal
  };

  const { logout } = useAuthStore();
  const confirmLogout = async () => {
    const response = await logout();
    console.log(response);
    if (response && !response.success) {
      return;
    }
    navigate("/");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false); // 3. Close Modal
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
          <div className="sidebar-item" onClick={() => navigate("/profile")}>
            <User size={20} />
            <span>Profile</span>
          </div>
          <div className="sidebar-item active">
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
            <div
              className="large-avatar"
              style={{
                background: "linear-gradient(to right, #0ea5e9, #2563eb)",
              }}
            >
              <Phone size={50} />
            </div>

            <h2>Contact Us</h2>
            <p style={{ color: "#64748b", marginBottom: "30px" }}>
              We are here to help you 24/7.
            </p>

            <div className="profile-info-group">
              {contactInfo.map((item) => (
                <div key={item.id} className="info-row">
                  <span className="info-label">{item.label}</span>
                  <div className="info-value">
                    <span>{item.value}</span>
                    <div className="icon-btn">{item.icon}</div>
                  </div>
                </div>
              ))}
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
          <h1>Contact Us</h1>
        </div>

        <div className="profile-detail-card" style={{ padding: "20px" }}>
          <div
            className="large-avatar"
            style={{
              background: "linear-gradient(to right, #0ea5e9, #2563eb)",
            }}
          >
            <Phone size={40} />
          </div>

          <h2 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
            Get in Touch
          </h2>

          <div className="profile-info-group">
            {contactInfo.map((item) => (
              <div key={item.id} className="info-row">
                <span className="info-label">{item.label}</span>
                <div className="info-value" style={{ fontSize: "0.95rem" }}>
                  <span>{item.value}</span>
                  {item.icon}
                </div>
              </div>
            ))}
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
                className="sidebar-item"
                onClick={() => navigate("/profile")}
              >
                <User size={20} />
                <span>Profile</span>
              </div>
              <div
                className="sidebar-item active"
                onClick={() => setIsMobileMenuOpen(false)}
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
export default ContactPage;
