import "../assets/css/DashboardPage.css";
import { useNavigate } from "react-router-dom";
import {
  User,
  Menu,
  ShieldCheck,
  LayoutDashboard,
  Settings,
  LogOut,
  Search,
  Mail,
  Hash,
  BookOpen,
  Calendar,
  GraduationCap,
  X,
  Layers,
} from "lucide-react";

import { useState } from "react";
import { useAuthStore } from "../store/authStore";

const AdminVerification = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // --- SEARCH STATE ---
  const [searchId, setSearchId] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState("");
    const { logout } = useAuthStore();
  // --- MOCK DATABASE ---
  const handleSearch = () => {
    // Mock Data: In a real app, this would come from your backend
    const mockStudent = {
      fullName: "Abdulkareem Sherifah",
      regNo: "CST/19/COM/00234",
      faculty: "Faculty Of Computing",
      department: "Computer Science",
      level: "200",
      yearOfAdmission: "2019",
      email: "sherifah@student.uni.edu",
    };

    // Simple check for demonstration (Use ID "12345" to test)
    if (searchId === "12345") {
      setStudentData(mockStudent);
      setError("");
    } else {
      setStudentData(null);
      setError("Student not found. Please check the User ID.");
    }
  };

  // --- LOGOUT HANDLERS ---
  const handleLogoutClick = () => setShowLogoutModal(true);
  const confirmLogout = async () => {
    const response = await logout();
    console.log(response);
    if (response && !response.success) {
      return;
    }
    navigate("/");
  };
  const cancelLogout = () => setShowLogoutModal(false);

  return (
    // Uses 'admin-theme' for dark sidebar
    <div className="dashboard-container admin-theme">
      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Log Out?</h3>
            <p>Are you sure you want to log out?</p>
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
          <div
            className="sidebar-item"
            onClick={() => navigate("/admin/dashboard")}
          >
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
      </aside>

      {/* ======================= */}
      {/* 2. MAIN CONTENT AREA    */}
      {/* ======================= */}
      <main className="desktop-main">
        {/* CENTERED CONTENT WRAPPER */}
        <div
          className="profile-content-wrapper"
          style={{ alignItems: "flex-start", paddingTop: "40px" }}
        >
          <div className="profile-detail-card" style={{ maxWidth: "600px" }}>
            {/* SEARCH SECTION */}
            <h2 style={{ marginBottom: "20px", color: "#0f172a" }}>
              Student Verification
            </h2>

            <div
              style={{
                display: "flex",
                gap: "10px",
                width: "100%",
                marginBottom: "30px",
              }}
            >
              <input
                type="text"
                placeholder="Enter Student User ID (Try: 12345)"
                className="venue-input"
                style={{ flex: 1 }}
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
              <button
                className="venue-button"
                onClick={handleSearch}
                style={{ marginTop: 0, width: "auto", padding: "0 24px" }}
              >
                <Search size={20} />
              </button>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <p style={{ color: "#ef4444", marginBottom: "20px" }}>{error}</p>
            )}

            {/* STUDENT INFO RESULT */}
            {studentData && (
              <div style={{ width: "100%", animation: "fadeIn 0.3s ease" }}>
                <div
                  style={{
                    width: "100%",
                    height: "1px",
                    backgroundColor: "#e2e8f0",
                    marginBottom: "30px",
                  }}
                ></div>

                <h3
                  style={{
                    color: "#059669",
                    marginBottom: "20px",
                    textDecoration: "underline",
                  }}
                >
                  Student Information
                </h3>

                {/* Avatar & Name */}
                <div
                  className="large-avatar"
                  style={{ margin: "0 auto 20px auto", background: "#0f172a" }}
                >
                  <User size={60} />
                </div>
                <h2 style={{ marginBottom: "30px" }}>{studentData.fullName}</h2>

                {/* Details List */}
                <div className="profile-info-group">
                  <div className="info-row">
                    <span className="info-label">Faculty</span>
                    <div className="info-value">
                      {studentData.faculty}
                      <GraduationCap size={18} className="text-gray-400" />
                    </div>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Department</span>
                    <div className="info-value">
                      {studentData.department}
                      <BookOpen size={18} className="text-gray-400" />
                    </div>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Level</span>
                    <div className="info-value">
                      {studentData.level} Level
                      <Layers size={18} className="text-gray-400" />
                    </div>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Registration Number</span>
                    <div className="info-value">
                      {studentData.regNo}
                      <Hash size={18} className="text-gray-400" />
                    </div>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Year of Admission</span>
                    <div className="info-value">
                      {studentData.yearOfAdmission}
                      <Calendar size={18} className="text-gray-400" />
                    </div>
                  </div>

                  <div className="info-row" style={{ borderBottom: "none" }}>
                    <span className="info-label">Email Address</span>
                    <div className="info-value">
                      {studentData.email}
                      <Mail size={18} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            )}
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
          <h1>Verification</h1>
        </div>

        {/* MOBILE CONTENT CARD (Reusing logic) */}
        <div className="profile-detail-card" style={{ padding: "20px" }}>
          <h3 style={{ marginBottom: "15px" }}>Verify Student</h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              width: "100%",
              marginBottom: "20px",
            }}
          >
            <input
              type="text"
              placeholder="User ID (e.g. 12345)"
              className="venue-input"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <button
              className="venue-button"
              onClick={handleSearch}
              style={{ marginTop: 0 }}
            >
              Search
            </button>
          </div>

          {error && (
            <p style={{ color: "#ef4444", marginBottom: "20px" }}>{error}</p>
          )}

          {studentData && (
            <div style={{ marginTop: "20px", width: "100%" }}>
              <div
                className="large-avatar"
                style={{ margin: "0 auto 15px auto", background: "#0f172a" }}
              >
                <User size={50} />
              </div>
              <h2 style={{ fontSize: "1.4rem", marginBottom: "20px" }}>
                {studentData.fullName}
              </h2>

              <div className="profile-info-group">
                <div className="info-row">
                  <span className="info-label">Faculty</span>
                  <div className="info-value" style={{ fontSize: "0.9rem" }}>
                    {studentData.faculty}
                  </div>
                </div>
                <div className="info-row">
                  <span className="info-label">Department</span>
                  <div className="info-value">{studentData.department}</div>
                </div>
                <div className="info-row">
                  <span className="info-label">Level</span>
                  <div className="info-value">{studentData.level}</div>
                </div>
                <div className="info-row">
                  <span className="info-label">Reg Number</span>
                  <div className="info-value">{studentData.regNo}</div>
                </div>
                <div className="info-row" style={{ borderBottom: "none" }}>
                  <span className="info-label">Email</span>
                  <div
                    className="info-value"
                    style={{ fontSize: "0.9rem", wordBreak: "break-all" }}
                  >
                    {studentData.email}
                  </div>
                </div>
              </div>
            </div>
          )}
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
export default AdminVerification;
