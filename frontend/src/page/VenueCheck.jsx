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
  ChevronDown,
  BookOpen,
} from "lucide-react";

import { useState, useEffect } from "react";
import { useGeneralStore } from "../store/genStore";
import { useVenueStore } from "../store/venueStore";
import { useAuthStore } from "../store/authStore";

/* ========================================================= */
/* 1. COMPONENT DEFINED OUTSIDE TO PREVENT FOCUS LOSS BUG    */
/* ========================================================= */
const VenueCardContent = ({
  step,
  regInput,
  sessionInput,
  inputError,
  venueData, // Now an array
  handleInputChange,
  handleSessionChange,
  checkVenue,
  resetCheck,
  navigate,
  sessions = [],
  isLoading = false,
}) => {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Format time only (without date)
  const formatTimeOnly = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

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
            <label htmlFor="sessionInput">Academic Session *</label>
            <div style={{ position: "relative", marginBottom: "15px" }}>
              <select
                id="sessionInput"
                value={sessionInput}
                onChange={handleSessionChange}
                className="venue-input"
                style={{ width: "100%", padding: "12px 16px", appearance: "none" }}
                disabled={isLoading}
              >
                <option value="">Select Session</option>
                {sessions.map((session) => (
                  <option key={session.id || session.value} value={session.id || session.value}>
                    {session.name || session.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={20}
                style={{
                  position: "absolute",
                  right: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: "#6b7280"
                }}
              />
            </div>

            <label htmlFor="regInput">Registration Number *</label>
            <input
              type="text"
              id="regInput"
              value={regInput}
              onChange={handleInputChange}
              className={`venue-input ${inputError ? "input-error" : ""}`}
              placeholder="CST/21/COM/00736"
              maxLength={16}
              autoFocus
              style={{ borderColor: inputError ? "#ef4444" : "" }}
              disabled={isLoading}
            />
            {inputError && (
              <p className="error-msg" style={{ textAlign: "left" }}>
                {inputError}
              </p>
            )}

            <button
              onClick={checkVenue}
              className="venue-button"
              disabled={isLoading || !regInput.trim() || !sessionInput}
            >
              {isLoading ? "Checking..." : "Check Venue"}
            </button>
          </div>
        )}

        {step === "success" && venueData && venueData.length > 0 && (
          <div className="venue-details">
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
              borderBottom: "1px solid #e2e8f0",
              paddingBottom: "10px"
            }}>
              <h3 style={{ color: "#0284c7", margin: 0 }}>
                Exam Venue Details
              </h3>
              <div style={{
                fontSize: "0.9rem",
                color: "#64748b",
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}>
                <Calendar size={16} />
                <span>Session: {venueData[0]?.session || ""}</span>
              </div>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <p style={{ marginBottom: "10px" }}>
                <strong>Registration Number:</strong> {venueData[0]?.reg_number || regInput}
              </p>
            </div>

            {/* Venue List Table */}
            <div style={{ overflowX: "auto", marginBottom: "20px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc" }}>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                      <BookOpen size={16} style={{ marginRight: "8px", verticalAlign: "middle" }} />
                      Course
                    </th>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                      <Home size={16} style={{ marginRight: "8px", verticalAlign: "middle" }} />
                      Venue
                    </th>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                      <Clock size={16} style={{ marginRight: "8px", verticalAlign: "middle" }} />
                      Time
                    </th>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                      Seat
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {venueData.map((venue, index) => (
                    <tr key={index} style={{ borderBottom: index < venueData.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                      <td style={{ padding: "12px" }}>
                        <div style={{ fontWeight: "500" }}>{venue.course_code}</div>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <div style={{ fontWeight: "500" }}>{venue.hall}</div>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <div>{formatTimeOnly(venue.exam_time)}</div>
                        <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                          {formatDate(venue.exam_time).split(',')[0]}
                        </div>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <div style={{
                          backgroundColor: "#e0f2fe",
                          color: "#0369a1",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontWeight: "600",
                          textAlign: "center",
                          minWidth: "50px"
                        }}>
                          {venue.seat_number}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Important Notes */}
            <div style={{
              backgroundColor: "#fef3c7",
              border: "1px solid #fbbf24",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "20px"
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <AlertCircle size={20} color="#92400e" />
                <div>
                  <p style={{ margin: "0 0 8px 0", fontWeight: "500", color: "#92400e" }}>
                    Important Instructions:
                  </p>
                  <ul style={{ margin: 0, paddingLeft: "20px", color: "#92400e", fontSize: "0.9rem" }}>
                    <li>Arrive at your venue 30 minutes before exam time</li>
                    <li>Bring your student ID card and exam docket</li>
                    <li>Seats are strictly assigned - do not change seats</li>
                  </ul>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <button
                onClick={resetCheck}
                className="venue-button-secondary"
                style={{ flex: 1 }}
              >
                Check Another
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="venue-button"
                style={{ flex: 1 }}
              >
                Back to Dashboard
              </button>
            </div>
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
              Venue Not Found
            </h3>
            <p style={{ lineHeight: "1.6", marginBottom: "15px" }}>
              No venue allocation found for:
            </p>
            <div style={{
              background: "#f1f5f9",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "20px"
            }}>
              <p style={{ margin: "5px 0" }}><strong>Registration:</strong> {regInput}</p>
              <p style={{ margin: "5px 0" }}><strong>Session:</strong> {
                sessions.find(s => (s.id || s.value) === sessionInput)?.name ||
                sessions.find(s => (s.id || s.value) === sessionInput)?.label ||
                sessionInput
              }</p>
            </div>
            <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "20px" }}>
              Please check if:
              <ul style={{ paddingLeft: "20px", marginTop: "8px" }}>
                <li>Your registration number is correct</li>
                <li>Venue allocations have been published for this session</li>
                <li>You are registered for exams in this session</li>
              </ul>
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
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
  const [sessionInput, setSessionInput] = useState("");
  const [venueData, setVenueData] = useState([]); // Now an array
  const [inputError, setInputError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get stores
  const { sessions = [], fetchSessions } = useGeneralStore();
  const { checkVenue: checkVenueApi, error: apiError } = useVenueStore();
  const { user } = useAuthStore();

  // Fetch sessions on mount
  useEffect(() => {
    const loadSessions = async () => {
      try {
        await fetchSessions();
      } catch (error) {
        console.error("Failed to load sessions:", error);
      }
    };
    loadSessions();
  }, [fetchSessions]);

  // Auto-fill registration number from auth store if available
  useEffect(() => {
    if (user?.reg_number) {
      setRegInput(user.reg_number);
    }
  }, [user]);

  // Get session label for display
  const getSessionLabel = () => {
    if (!sessionInput) return "";
    const session = sessions.find(s => (s.id || s.value) === sessionInput);
    return session ? (session.name || session.label) : sessionInput;
  };

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

  const handleSessionChange = (e) => {
    setSessionInput(e.target.value);
  };

  const checkVenue = async () => {
    const regPattern = /^[A-Z]{3}\/\d{2}\/[A-Z]{3}\/\d{5}$/;

    if (!sessionInput) {
      setInputError("Please select an academic session");
      return;
    }

    if (!regPattern.test(regInput)) {
      setInputError("Invalid format. Required: CST/21/COM/00736");
      return;
    }

    setIsLoading(true);
    setInputError("");

    try {
      // Prepare data for API call
      const requestData = {
        reg_number: regInput,
        session: sessionInput,
      };
      console.log("Request data:", requestData);

      const response = await checkVenueApi(requestData);
      console.log("API Response:", response);

      if (response?.success && response.data) {
        // Response.data is an array - add session label to each item
        const venueDataWithSession = Array.isArray(response.data)
          ? response.data.map(item => ({
              ...item,
              session: getSessionLabel(),
            }))
          : [{
              ...response.data,
              session: getSessionLabel(),
            }];

        setVenueData(venueDataWithSession);
        setStep("success");
      } else {
        // Handle API error
        setInputError(response?.message || "Venue allocation not found");
        setStep("error");
      }
    } catch (error) {
      console.error("Error checking venue:", error);
      setInputError(apiError || "Failed to check venue. Please try again.");
      setStep("error");
    } finally {
      setIsLoading(false);
    }
  };

  const resetCheck = () => {
    setStep("input");
    // Keep the registration number if it came from auth store
    if (!user?.reg_number) {
      setRegInput("");
    }
    setSessionInput("");
    setVenueData([]);
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
          <div className="sidebar-item " onClick={() => navigate("/dashboard")}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
          <div className="sidebar-item" onClick={() => navigate("/profile")}>
            <User size={20} />
            <span>Profile</span>
          </div>
          <div className="sidebar-item active">
            <Home size={20} />
            <span>Venue Check</span>
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

      {/* MAIN CONTENT (DESKTOP) */}
      <main className="desktop-main">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <VenueCardContent
            step={step}
            regInput={regInput}
            sessionInput={sessionInput}
            inputError={inputError}
            venueData={venueData}
            handleInputChange={handleInputChange}
            handleSessionChange={handleSessionChange}
            checkVenue={checkVenue}
            resetCheck={resetCheck}
            navigate={navigate}
            sessions={sessions}
            isLoading={isLoading}
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
          sessionInput={sessionInput}
          inputError={inputError}
          venueData={venueData}
          handleInputChange={handleInputChange}
          handleSessionChange={handleSessionChange}
          checkVenue={checkVenue}
          resetCheck={resetCheck}
          navigate={navigate}
          sessions={sessions}
          isLoading={isLoading}
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
                <LayoutDashboard size={20} /> <span>Dashboard</span>
              </div>
              <div
                className="sidebar-item"
                onClick={() => navigate("/profile")}
              >
                <User size={20} /> <span>Profile</span>
              </div>
              <div className="sidebar-item active">
                <Home size={20} /> <span>Venue Check</span>
              </div>
              <div
                className="sidebar-item"
                onClick={() => navigate("/contact")}
              >
                <Phone size={20} /> <span>Contact</span>
              </div>
              <div
                style={{ marginTop: "auto" }}
                className="sidebar-item"
                onClick={handleLogoutClick}
              >
                <LogOut size={20} /> <span>Logout</span>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VenueCheck;