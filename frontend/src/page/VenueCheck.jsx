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
  Home,
  X,
  Calendar,
  Clock,
  AlertCircle,
  Phone,
} from "lucide-react";

import { useState } from "react";

/* ========================================================= */
/* 1. COMPONENT DEFINED OUTSIDE TO PREVENT FOCUS LOSS BUG    */
/* ========================================================= */
const VenueCardContent = ({
  step,
  regInput,
  inputError,
  venueData,
  handleInputChange,
  checkVenue,
  resetCheck,
  navigate,
}) => {
  return (
    <div className="venue-check-container">
      <h2 className="venue-title">Venue Check</h2>
      <div
        className="large-avatar"
        style={{
          background: "linear-gradient(to right, #0ea5e9, #2563eb)",
          margin: "0 auto 20px auto",
        }}
      >
        <Home size={40} color="white" />
      </div>

      <div className="venue-content-box">
        {step === "input" && (
          <div className="venue-form">
            <label htmlFor="regInput">Registration Number:</label>
            <input
              type="text"
              id="regInput"
              value={regInput}
              onChange={handleInputChange}
              className={`venue-input ${inputError ? "input-error" : ""}`}
              placeholder="CST/21/COM/00736"
              maxLength={16}
              autoFocus // Helps keep focus
              style={{ borderColor: inputError ? "#ef4444" : "" }}
            />
            {inputError && (
              <p className="error-msg" style={{ textAlign: "left" }}>
                {inputError}
              </p>
            )}

            <button onClick={checkVenue} className="venue-button">
              Done
            </button>
          </div>
        )}

        {step === "success" && venueData && (
          <div className="venue-details">
            <h3
              style={{
                color: "#0284c7",
                marginBottom: "15px",
                borderBottom: "1px solid #e2e8f0",
                paddingBottom: "10px",
              }}
            >
              Exam Venue Details
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <p>
                <strong>Full Name:</strong> {venueData.fullName}
              </p>
              <p>
                <strong>Reg No:</strong> {venueData.regNo}
              </p>
              <p>
                <strong>Course:</strong> {venueData.course}
              </p>
              <p>
                <strong>Course Code:</strong> {venueData.courseCode}
              </p>
              <div
                style={{
                  background: "#f0f9ff",
                  padding: "15px",
                  borderRadius: "8px",
                  border: "1px solid #bae6fd",
                }}
              >
                <p style={{ margin: 0, color: "#0369a1", fontSize: "1.1rem" }}>
                  <strong>Venue:</strong> {venueData.venue}
                </p>
                <p style={{ margin: 0, color: "#0369a1", fontSize: "1.1rem" }}>
                  <strong>Seat Number:</strong> {venueData.seatNo}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.9rem",
                  color: "#64748b",
                  marginTop: "10px",
                }}
              >
                <span
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <Clock size={16} /> {venueData.time}
                </span>
                <span
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <Calendar size={16} /> {venueData.currentDate}
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="venue-button"
              style={{ width: "100%", marginTop: "25px" }}
            >
              Back to Dashboard
            </button>
          </div>
        )}

        {step === "error" && (
          <div className="venue-error" style={{ padding: "10px 0" }}>
            <AlertCircle
              size={50}
              color="#ef4444"
              style={{ marginBottom: "15px" }}
            />
            <h3 className="error-title" style={{ fontSize: "1.2rem" }}>
              Error
            </h3>
            <p style={{ lineHeight: "1.6" }}>
              Seems the venue is not out yet or you don't have any papers today.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button onClick={resetCheck} className="venue-button">
                Try Again
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="venue-button-secondary"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ========================================================= */
/* 2. MAIN COMPONENT                                         */
/* ========================================================= */
const VenueCheck = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // --- STATE ---
  const [step, setStep] = useState("input");
  const [regInput, setRegInput] = useState("");
  const [venueData, setVenueData] = useState(null);
  const [inputError, setInputError] = useState("");

  // --- LOGOUT LOGIC ---
  const handleLogoutClick = () => setShowLogoutModal(true);
  const confirmLogout = () => navigate("/");
  const cancelLogout = () => setShowLogoutModal(false);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    let value = e.target.value.toUpperCase();
    const rawValue = value.replace(/[^A-Z0-9]/g, "");

    let formattedValue = rawValue;
    if (rawValue.length > 3) {
      formattedValue = rawValue.slice(0, 3) + "/" + rawValue.slice(3);
    }
    if (rawValue.length > 5) {
      formattedValue =
        rawValue.slice(0, 3) +
        "/" +
        rawValue.slice(3, 5) +
        "/" +
        rawValue.slice(5);
    }
    if (rawValue.length > 8) {
      formattedValue =
        rawValue.slice(0, 3) +
        "/" +
        rawValue.slice(3, 5) +
        "/" +
        rawValue.slice(5, 8) +
        "/" +
        rawValue.slice(8, 13);
    }

    setRegInput(formattedValue);
    if (inputError) setInputError("");
  };

  const checkVenue = () => {
    const regPattern = /^[A-Z]{3}\/\d{2}\/[A-Z]{3}\/\d{5}$/;

    if (!regPattern.test(regInput)) {
      setInputError("Invalid format. Required: CST/21/COM/00736");
      return;
    }

    const mockValidReg = "CST/21/COM/00736";

    if (regInput === mockValidReg) {
      setVenueData({
        fullName: "Abdulkareem Sherifah",
        regNo: regInput,
        course: "System Analysis & Design",
        courseCode: "SWE 2315",
        venue: "Lecture Room 2",
        seatNo: "045",
        time: "9:00 AM - 12:00 PM",
        currentDate: new Date().toLocaleDateString(),
      });
      setStep("success");
    } else {
      setStep("error");
    }
  };

  const resetCheck = () => {
    setStep("input");
    setRegInput("");
    setVenueData(null);
    setInputError("");
  };

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

      {/* SIDEBAR */}
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

      {/* MAIN CONTENT (DESKTOP) - TOP BAR REMOVED */}
      <main className="desktop-main">
        {/* We use 'display:flex' to center the content vertically and horizontally since top bar is gone */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          {/* 3. PASS PROPS TO EXTERNAL COMPONENT */}
          <VenueCardContent
            step={step}
            regInput={regInput}
            inputError={inputError}
            venueData={venueData}
            handleInputChange={handleInputChange}
            checkVenue={checkVenue}
            resetCheck={resetCheck}
            navigate={navigate}
          />
        </div>
      </main>

      {/* MOBILE LAYOUT */}
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
          <h1>Venue Check</h1>
        </div>

        <VenueCardContent
          step={step}
          regInput={regInput}
          inputError={inputError}
          venueData={venueData}
          handleInputChange={handleInputChange}
          checkVenue={checkVenue}
          resetCheck={resetCheck}
          navigate={navigate}
        />

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
              <ShieldCheck size={28} /> <span>ExamCheck+</span>
            </div>
            <nav className="sidebar-menu">
              <div
                className="sidebar-item"
                onClick={() => navigate("/dashboard")}
              >
                {" "}
                <LayoutDashboard size={20} /> <span>Dashboard</span>{" "}
              </div>
              <div
                className="sidebar-item"
                onClick={() => navigate("/profile")}
              >
                {" "}
                <User size={20} /> <span>Profile</span>{" "}
              </div>
              <div
                className="sidebar-item"
                onClick={() => navigate("/contact")}
              >
                {" "}
                <Phone size={20} /> <span>Contact</span>{" "}
              </div>
              <div
                style={{ marginTop: "auto" }}
                className="sidebar-item"
                onClick={handleLogoutClick}
              >
                {" "}
                <LogOut size={20} /> <span>Logout</span>{" "}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VenueCheck;
