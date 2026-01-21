import "../assets/css/DashboardPage.css";
import { useNavigate } from "react-router-dom";
import {
  User,
  Menu,
  ShieldCheck,
  LayoutDashboard,
  Settings,
  LogOut,
  ClipboardCheck,
  Download,
  AlertCircle,
  ArrowLeft,
  Phone,
  X,
  ChevronDown,
  Calendar,
  Layers,
} from "lucide-react";

import { useState, useEffect } from "react";
import { useResultStore } from "../store/resultStore";
import { useGeneralStore } from "../store/genStore";
import { useAuthStore } from "../store/authStore";

const ResultCheck = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Stores
  const { user } = useAuthStore();
  const {
    semesters,
    sessions,
    fetchSemesters,
    fetchSessions,
  } = useGeneralStore();

  const { checkResult, resultData, isLoading, error } = useResultStore();

  // --- STATE ---
  const [viewState, setViewState] = useState("input"); // 'input', 'result', 'error'
  const [formData, setFormData] = useState({
    semester: "",
    session: "",
  });
  const [errors, setErrors] = useState({});
  const [localLoading, setLocalLoading] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await fetchSemesters();
        await fetchSessions();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchInitialData();
  }, [fetchSemesters, fetchSessions]);

  const getUserId = () => {
    return user?.reg_number || "CST/21/COM/00780";
  };

  const getUserName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return "Student";
  };

  // Get user level from auth store
  const getUserLevel = () => {
    return user?.year_of_study ? `${user.year_of_study}00 Level` : "200 Level";
  };

  // Format semester options from store
  const getSemesterOptions = () => {
    if (semesters && semesters.length > 0) {
      return semesters.map(sem => ({
        value: sem.id || sem.value,
        label: sem.name || sem.label
      }));
    }
    return [
      { value: "first", label: "First Semester" },
      { value: "second", label: "Second Semester" },
    ];
  };

  // Format session options from store
  const getSessionOptions = () => {
    if (sessions && sessions.length > 0) {
      return sessions.map(sess => ({
        value: sess.id || sess.value,
        label: sess.name || sess.label
      }));
    }
    return [
      { value: "2023-2024", label: "2023/2024 Academic Session" },
      { value: "2024-2025", label: "2024/2025 Academic Session" },
      { value: "2025-2026", label: "2025/2026 Academic Session" },
    ];
  };

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.semester) newErrors.semester = "Please select a semester";
    if (!formData.session) newErrors.session = "Please select a session";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckResult = async () => {
    if (!validateForm()) {
      return;
    }

    setLocalLoading(true);
    setViewState("input"); // Reset to input view while loading

    try {
      // Prepare data for API call
      const checkData = {
        reg_number: getUserId(),
        semester: formData.semester,
        session: formData.session,
      };

      const response = await checkResult(checkData);

      if (response && response.success) {
        setViewState("result");
      } else {
        setViewState("error");
      }
    } catch (error) {
      console.error("Error checking result:", error);
      setViewState("error");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleDownload = () => {
    if (resultData && resultData.length > 0) {
      // In a real app, call API to generate/download PDF
      alert("Downloading Result Slip as PDF...");
      // You would use: downloadResultPdf(resultData.id);
    } else {
      alert("No result data available to download");
    }
  };

  const handleLogoutClick = () => setShowLogoutModal(true);
  const confirmLogout = () => navigate("/");
  const cancelLogout = () => setShowLogoutModal(false);

  // Helper for Grade Color
  const getGradeClass = (grade) => {
    if (!grade) return "grade-F";
    if (grade === "A" || grade === "A+") return "grade-A";
    if (grade === "B" || grade === "B+") return "grade-B";
    if (grade === "C" || grade === "C+") return "grade-C";
    if (grade === "D" || grade === "D+") return "grade-D";
    return "grade-F";
  };

  // Get semester and session labels for display
  const getSemesterLabel = () => {
    const semesterOptions = getSemesterOptions();
    const sessionOptions = getSessionOptions();

    const semester = semesterOptions.find(s => s.value === formData.semester);
    const session = sessionOptions.find(s => s.value === formData.session);

    return semester && session ? `${semester.label}, ${session.label}` : "";
  };

  // Calculate statistics from result data




  return (
    <div className="dashboard-container">
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
          <div className="sidebar-item" onClick={() => navigate("/contact")}>
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
      {/* 2. MAIN CONTENT AREA    */}
      {/* ======================= */}
      <main className="desktop-main">
        <div className="profile-content-wrapper">
          {/* --- VIEW 1: INPUT --- */}
          {viewState === "input" && (
            <div className="profile-detail-card" style={{ maxWidth: "500px" }}>
              <div className="large-avatar" style={{ background: "#0891b2" }}>
                <ClipboardCheck size={50} />
              </div>
              <h2 style={{ marginBottom: "20px" }}>Check Results</h2>
              <p style={{ marginBottom: "30px", color: "#64748b" }}>
                Select semester and session to view your results.
              </p>

              <div style={{ width: "100%", marginBottom: "25px" }}>
                <label
                  style={{
                    fontWeight: "600",
                    color: "#334155",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  Your ID:
                </label>
                <input
                  type="text"
                  value={getUserId()}
                  readOnly
                  className="venue-input input-locked"
                  style={{ width: "100%" }}
                />
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "#94a3b8",
                    marginTop: "5px",
                    marginBottom: "15px",
                  }}
                >
                  *ID is automatically detected from your profile.
                </p>
              </div>

              {/* Semester Selection */}
              <div style={{ width: "100%", marginBottom: "20px" }}>
                <label
                  style={{
                    fontWeight: "600",
                    color: "#334155",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  <Layers size={16} style={{ marginRight: "8px", verticalAlign: "middle" }} />
                  Semester *
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    disabled={localLoading}
                    className={`form-select ${errors.semester ? 'error' : ''}`}
                    style={{ width: "100%", padding: "12px 16px" }}
                  >
                    <option value="">Select Semester</option>
                    {getSemesterOptions().map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={20} style={{
                    position: "absolute",
                    right: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    color: "#6b7280"
                  }} />
                </div>
                {errors.semester && (
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#ef4444",
                    fontSize: "0.85rem",
                    marginTop: "6px"
                  }}>
                    <AlertCircle size={14} />
                    <span>{errors.semester}</span>
                  </div>
                )}
              </div>

              {/* Session Selection */}
              <div style={{ width: "100%", marginBottom: "30px" }}>
                <label
                  style={{
                    fontWeight: "600",
                    color: "#334155",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  <Calendar size={16} style={{ marginRight: "8px", verticalAlign: "middle" }} />
                  Academic Session *
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    name="session"
                    value={formData.session}
                    onChange={handleInputChange}
                    disabled={localLoading}
                    className={`form-select ${errors.session ? 'error' : ''}`}
                    style={{ width: "100%", padding: "12px 16px" }}
                  >
                    <option value="">Select Session</option>
                    {getSessionOptions().map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={20} style={{
                    position: "absolute",
                    right: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    color: "#6b7280"
                  }} />
                </div>
                {errors.session && (
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#ef4444",
                    fontSize: "0.85rem",
                    marginTop: "6px"
                  }}>
                    <AlertCircle size={14} />
                    <span>{errors.session}</span>
                  </div>
                )}
              </div>

              <button
                className="venue-button"
                onClick={handleCheckResult}
                disabled={localLoading}
                style={{ width: "100%" }}
              >
                {localLoading ? "Checking..." : "Check Result"}
              </button>

              {/* Show error from store */}
              {error && (
                <div style={{
                  marginTop: "15px",
                  padding: "12px",
                  backgroundColor: "#fee2e2",
                  border: "1px solid #ef4444",
                  borderRadius: "8px",
                  color: "#dc2626",
                  fontSize: "0.85rem"
                }}>
                  <AlertCircle size={16} style={{ marginRight: "8px", verticalAlign: "middle" }} />
                  {error}
                </div>
              )}
            </div>
          )}

          {/* --- VIEW 2: RESULT DISPLAY --- */}
          {viewState === "result" && resultData && (
            <div className="profile-detail-card" style={{ maxWidth: "650px" }}>
              {/* Header */}
              <div
                className="large-avatar"
                style={{ margin: "0 auto 15px auto" }}
              >
                <User size={60} />
              </div>
              <h2 style={{ fontSize: "1.5rem" }}>
                {getUserName()}{" "}
                <span
                  style={{
                    fontSize: "1rem",
                    color: "#64748b",
                    fontWeight: "normal",
                  }}
                >
                  ({getUserLevel()})
                </span>
              </h2>

              {/* Display selected semester and session */}
              <p style={{ color: "#64748b", marginBottom: "10px" }}>
                <Layers size={16} style={{ marginRight: "8px", verticalAlign: "middle" }} />
                {getSemesterLabel()}
              </p>

              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "#e2e8f0",
                  marginBottom: "20px",
                }}
              ></div>

              {/* Table */}
              {resultData.length > 0 ? (
                <>
                  <table className="result-table">
                    <thead>
                      <tr>
                        <th style={{ textAlign: "center", width: "40%" }}>Course</th>
                        <th style={{ textAlign: "center", width: "20%" }}>Score</th>
                        <th style={{ textAlign: "center", width: "20%" }}>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultData.map((course, index) => (
                        <tr key={index}>
                          <td>
                            <div style={{ fontWeight: "600" }}>
                              {course.course_code || course.code}
                            </div>
                            <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                              {course.course_title || course.course_name}
                            </div>
                          </td>
                          <td style={{ textAlign: "center" }}>{course.score}</td>
                          <td style={{ textAlign: "center" }}>
                            <span
                              className={`grade-badge ${getGradeClass(course.grade)}`}
                            >
                              {course.grade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>


                </>
              ) : (
                <div style={{
                  padding: "30px",
                  textAlign: "center",
                  color: "#64748b"
                }}>
                  <p>No course data available for this semester.</p>
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: "flex", gap: "10px", marginTop: "25px" }}>
                <button
                  className="venue-button-secondary"
                  onClick={() => setViewState("input")}
                  style={{ flex: 1 }}
                >
                  <ArrowLeft size={18} style={{ marginRight: "8px" }} />
                  Check Another
                </button>
                <button
                  className="venue-button"
                  onClick={handleDownload}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <Download size={20} />
                  Download
                </button>
              </div>
            </div>
          )}

          {/* --- VIEW 3: ERROR (NOT OUT YET) --- */}
          {viewState === "error" && (
            <div className="profile-detail-card" style={{ maxWidth: "500px" }}>
              <AlertCircle
                size={60}
                color="#ef4444"
                style={{ marginBottom: "20px" }}
              />
              <h2 style={{ color: "#ef4444", marginBottom: "10px" }}>
                Result Not Available
              </h2>
              <p style={{ color: "#64748b", marginBottom: "10px" }}>
                Results for {getSemesterLabel()} are not available yet.
              </p>
              <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "30px" }}>
                Please check back later or contact your department if you believe this is an error.
              </p>
              <button
                className="venue-button-secondary"
                onClick={() => setViewState("input")}
                style={{ width: "100%" }}
              >
                <ArrowLeft
                  size={18}
                  style={{ marginRight: "8px", display: "inline" }}
                />
                Back to Result Check
              </button>
            </div>
          )}
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
          <h1>Results</h1>
        </div>

        {/* Mobile View mirrors Desktop content logic */}
        {viewState === "input" && (
          <div className="profile-detail-card" style={{ padding: "25px" }}>
            <div className="large-avatar" style={{ background: "#0891b2" }}>
              <ClipboardCheck size={40} />
            </div>
            <h3 style={{ marginBottom: "20px" }}>Check Results</h3>

            <div style={{ width: "100%", marginBottom: "15px" }}>
              <label style={{ fontWeight: "600", color: "#334155", fontSize: "0.9rem" }}>
                Your ID:
              </label>
              <input
                type="text"
                value={getUserId()}
                readOnly
                className="venue-input input-locked"
                style={{ width: "100%", marginTop: "5px", fontSize: "0.9rem" }}
              />
            </div>

            {/* Semester Selection - Mobile */}
            <div style={{ width: "100%", marginBottom: "15px" }}>
              <label style={{ fontWeight: "600", color: "#334155", fontSize: "0.9rem" }}>
                Semester *
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleInputChange}
                disabled={localLoading}
                className={`form-select ${errors.semester ? 'error' : ''}`}
                style={{ width: "100%", padding: "10px", fontSize: "0.9rem", marginTop: "5px" }}
              >
                <option value="">Select Semester</option>
                {getSemesterOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.semester && (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#ef4444",
                  fontSize: "0.8rem",
                  marginTop: "4px"
                }}>
                  <AlertCircle size={12} />
                  <span>{errors.semester}</span>
                </div>
              )}
            </div>

            {/* Session Selection - Mobile */}
            <div style={{ width: "100%", marginBottom: "20px" }}>
              <label style={{ fontWeight: "600", color: "#334155", fontSize: "0.9rem" }}>
                Academic Session *
              </label>
              <select
                name="session"
                value={formData.session}
                onChange={handleInputChange}
                disabled={localLoading}
                className={`form-select ${errors.session ? 'error' : ''}`}
                style={{ width: "100%", padding: "10px", fontSize: "0.9rem", marginTop: "5px" }}
              >
                <option value="">Select Session</option>
                {getSessionOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.session && (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#ef4444",
                  fontSize: "0.8rem",
                  marginTop: "4px"
                }}>
                  <AlertCircle size={12} />
                  <span>{errors.session}</span>
                </div>
              )}
            </div>

            <button
              className="venue-button"
              onClick={handleCheckResult}
              disabled={localLoading}
              style={{ width: "100%", marginTop: "10px" }}
            >
              {localLoading ? "Checking..." : "Check Result"}
            </button>
          </div>
        )}

        {/* Mobile Result View */}
        {viewState === "result" && resultData && (
          <div className="profile-detail-card" style={{ padding: "15px" }}>
            <div
              className="large-avatar"
              style={{ width: "80px", height: "80px" }}
            >
              <User size={40} />
            </div>
            <h3 style={{ marginBottom: "3px" }}>
              {getUserName()}{" "}
              <span style={{ color: "#64748b", fontWeight: "normal" }}>
                ({getUserLevel()})
              </span>
            </h3>
            <p style={{ fontSize: "0.9rem", color: "#64748b", marginBottom: "15px" }}>
              {getSemesterLabel()}
            </p>

            {resultData.length > 0 ? (
              <>
                <table className="result-table" style={{ fontSize: "0.8rem" }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "center", width: "40%" }}>Course</th>
                      <th style={{ textAlign: "center", width: "20%" }}>Score</th>
                      <th style={{ textAlign: "center", width: "20%" }}>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultData.map((course, index) => (
                      <tr key={index}>
                        <td>
                          <div style={{ fontWeight: "600" }}>
                            {course.course_code || course.code}
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                            {course.course_title || course.course_name}
                          </div>
                        </td>
                        <td style={{ textAlign: "center" }}>{course.score}</td>
                        <td style={{ textAlign: "center" }}>
                          <span
                            className={`grade-badge ${getGradeClass(course.grade)}`}
                          >
                            {course.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>


              </>
            ) : (
              <div style={{
                padding: "20px",
                textAlign: "center",
                color: "#64748b",
                fontSize: "0.9rem"
              }}>
                <p>No course data available for this semester.</p>
              </div>
            )}

            {/* Mobile Buttons */}
            <div style={{ display: "flex", gap: "8px", marginTop: "15px" }}>
              <button
                className="venue-button-secondary"
                onClick={() => setViewState("input")}
                style={{ flex: 1, fontSize: "0.9rem", padding: "10px" }}
              >
                <ArrowLeft size={16} style={{ marginRight: "6px" }} />
                Back
              </button>
              <button
                className="venue-button"
                onClick={handleDownload}
                style={{
                  flex: 1,
                  fontSize: "0.9rem",
                  padding: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                <Download size={16} />
                Download
              </button>
            </div>
          </div>
        )}

        {/* Mobile Error View */}
        {viewState === "error" && (
          <div className="profile-detail-card" style={{ padding: "20px" }}>
            <AlertCircle
              size={50}
              color="#ef4444"
              style={{ marginBottom: "15px" }}
            />
            <h3 style={{ color: "#ef4444", fontSize: "1.2rem", marginBottom: "10px" }}>
              Not Available
            </h3>
            <p
              style={{
                color: "#64748b",
                fontSize: "0.9rem",
                marginBottom: "15px",
              }}
            >
              Results for {getSemesterLabel()} are not available yet.
            </p>
            <button
              className="venue-button-secondary"
              onClick={() => setViewState("input")}
              style={{ width: "100%", padding: "12px" }}
            >
              <ArrowLeft size={16} style={{ marginRight: "8px" }} />
              Back to Result Check
            </button>
          </div>
        )}

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

export default ResultCheck;