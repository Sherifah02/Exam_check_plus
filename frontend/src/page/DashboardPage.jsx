import "../assets/css/DashboardPage.css";
import { useNavigate } from "react-router-dom";
import {
  User,
  Menu,
  ClipboardCheck,
  ShieldCheck,
  LayoutDashboard,
  Settings,
  LogOut,
  Bell,
  Home,
  X,
  Phone,
  Sun,
} from "lucide-react";

import { useState } from "react";
import { useAuthStore } from "../store/authStore";

const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  console.log("User data:", user);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Get user's full name from the user object
  const getUserName = () => {
    if (!user) return "Student";

    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }

    if (user.first_name) return user.first_name;
    if (user.last_name) return user.last_name;

    return "Student";
  };

  // Get first letter for avatar
  const getInitial = () => {
    if (user?.first_name) {
      return user.first_name.charAt(0).toUpperCase();
    }
    return "S";
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

  const handleVenueClick = () => {
    navigate("/venue-check");
  };

  const actions = [
    {
      title: "Venue Check",
      icon: <Home size={32} color="#0284c7" />,
      onClick: handleVenueClick,
    },
    {
      title: "Result Checker",
      icon: <ClipboardCheck size={32} color="#ea580c" />,
      onClick: () => navigate("/result-check"),
    },
  ];

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleContact = () => {
    navigate("/contact");
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="dashboard-container">
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
          <div className="sidebar-item" onClick={handleProfile}>
            <User size={20} />
            <span>Profile</span>
          </div>
          {/* ADDED CONTACT ITEM HERE */}
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

      <main className="desktop-main">
        <div className="desktop-topbar">
          <div className="top-profile">
            <div className="profile-avatar">
              <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                {getInitial()}
              </span>
            </div>
            <span className="font-bold text-gray-700">{getUserName()}</span>
            <Sun size={30} color="#ebee2aff" style={{ marginLeft: "15px" }} />
          </div>
        </div>

        <div className="welcome-banner">
          <div className="welcome-text">
            <h2>
              {getGreeting()}, {user?.first_name || "Student"}!
            </h2>
            <p className="opacity-90">
              Always stay updated in your student portal.
            </p>
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
          <h1>ExamCheck+</h1>
        </div>

        <div className="profile-card">
          <div className="profile-avatar">
            <span style={{ fontWeight: "bold", fontSize: "18px" }}>
              {getInitial()}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">{getGreeting()}</p>
            <p className="font-bold text-lg">{getUserName()}</p>
            {user?.reg_number && (
              <p className="text-sm text-gray-600 mt-1">{user.reg_number}</p>
            )}
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
export default DashboardPage;
